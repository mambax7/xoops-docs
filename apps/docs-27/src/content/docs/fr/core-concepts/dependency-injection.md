---
title: "Injection de dépendances dans XOOPS"
---

:::note[Compatibilité des versions]
| Fonctionnalité | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| DI manuelle (injection de constructeur) | ✅ Disponible | ✅ Disponible |
| Conteneur PSR-11 | ❌ Non intégré | ✅ Support natif |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 uniquement | ✅ Disponible |

En **XOOPS 2.5.x**, utilisez l'injection de constructeur manuelle (transmission des dépendances explicitement). Les exemples de conteneur PSR-11 ci-dessous sont pour **XOOPS 4.0**.
:::

## Aperçu

L'injection de dépendances (DI) est un modèle de conception qui permet aux composants de recevoir leurs dépendances à partir de sources externes plutôt que de les créer en interne. XOOPS 4.0 introduit le support du conteneur DI compatible PSR-11.

## Pourquoi l'injection de dépendances ?

### Sans DI (couplage serré)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Hard dependencies - difficult to test and modify
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### Avec DI (couplage faible)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Conteneur PSR-11

### Utilisation basique

```php
use Psr\Container\ContainerInterface;

// Get the container
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Retrieve a service
$articleService = $container->get(ArticleService::class);

// Check if service exists
if ($container->has(ArticleService::class)) {
    // Use the service
}
```

### Configuration du conteneur

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Simple class instantiation
    ArticleRepository::class => ArticleRepository::class,

    // Interface to implementation binding
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Factory function
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Shared instance (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Enregistrement du service

### Auto-wiring

```php
// The container automatically resolves dependencies
// when type hints are available

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Container creates ArticleController with its dependencies
$controller = $container->get(ArticleController::class);
```

### Enregistrement manuel

```php
// config/services.php
return [
    ArticleService::class => [
        'class' => ArticleService::class,
        'arguments' => [
            ArticleRepositoryInterface::class,
            EventDispatcherInterface::class,
        ],
        'shared' => true,  // Singleton
    ],

    'article.handler' => [
        'factory' => [ArticleHandlerFactory::class, 'create'],
        'arguments' => ['@database'],  // Reference other service
    ],
];
```

## Injection de constructeur

### Approche préférée

```php
final class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher,
        private readonly LoggerInterface $logger
    ) {}

    public function create(CreateArticleDTO $dto): Article
    {
        $this->logger->info('Creating article', ['title' => $dto->title]);

        $article = Article::create($dto);
        $this->repository->save($article);
        $this->dispatcher->dispatch(new ArticleCreatedEvent($article));

        return $article;
    }
}
```

## Injection de méthode

### Pour les dépendances optionnelles

```php
class ArticleController
{
    public function __construct(
        private readonly ArticleService $service
    ) {}

    public function show(int $id, ?CacheInterface $cache = null): Response
    {
        $cacheKey = "article_{$id}";

        if ($cache && $cached = $cache->get($cacheKey)) {
            return $this->render($cached);
        }

        $article = $this->service->findById($id);

        $cache?->set($cacheKey, $article, 3600);

        return $this->render($article);
    }
}
```

## Liaison d'interface

### Définir les interfaces

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Lier l'implémentation

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Or with factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Test avec DI

### Mocking facile

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Create mocks
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Inject mocks
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Set expectations
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Test
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Intégration Legacy XOOPS

### Intégration de l'ancien et du nouveau

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Envelopper les gestionnaires legacy

```php
// config/services.php
return [
    'article.handler' => function () {
        return xoops_getModuleHandler('article', 'mymodule');
    },

    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new LegacyArticleRepository(
            $c->get('article.handler')
        );
    },
];
```

## Meilleures pratiques

1. **Injecter des interfaces** - Dépendre des abstractions, pas des implémentations
2. **Injection de constructeur** - Préférer l'injection de constructeur à l'injection de setter
3. **Responsabilité unique** - Chaque classe doit avoir peu de dépendances
4. **Éviter la conscience du conteneur** - Les services ne doivent pas connaître le conteneur
5. **Configurer, ne pas coder** - Utiliser les fichiers de configuration pour le câblage

## Documentation connexe

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Implémentation PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Modèle de service
- ../03-Module-Development/Best-Practices/Testing - Test avec DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Aperçu de l'architecture
