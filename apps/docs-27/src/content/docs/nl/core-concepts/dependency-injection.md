---
title: "Afhankelijkheidsinjectie in XOOPS"
---
:::note[Versiecompatibiliteit]
| Kenmerk | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|-----------|
| Handmatige DI (constructorinjectie) | ✅ Beschikbaar | ✅ Beschikbaar |
| PSR-11-container | ❌ Niet ingebouwd | ✅ Native ondersteuning |
| `\Xmf\Module\Helper::getContainer()` | ❌ Alleen 4.0 | ✅ Beschikbaar |

Gebruik in **XOOPS 2.5.x** handmatige constructorinjectie (waarbij afhankelijkheden expliciet worden doorgegeven). De onderstaande PSR-11-containervoorbeelden zijn voor **XOOPS 4.0**.
:::

## Overzicht

Dependency Injection (DI) is een ontwerppatroon waarmee componenten hun afhankelijkheden van externe bronnen kunnen ontvangen in plaats van deze intern te creëren. XOOPS 4.0 introduceert PSR-11-compatibele DI-containerondersteuning.

## Waarom afhankelijkheidsinjectie?

### Zonder DI (strakke koppeling)

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

### Met DI (losse koppeling)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11-container

### Basisgebruik

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

### Containerconfiguratie

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

## Serviceregistratie

### Automatische bedrading

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

### Handmatige registratie

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

## Constructorinjectie

### Voorkeursaanpak

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

## Methode Injectie

### Voor optionele afhankelijkheden

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

## Interfacebinding

### Interfaces definiëren

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Bind-implementatie

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

## Testen met DI

### Gemakkelijk spotten

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

## XOOPS Legacy-integratie

### Een brug slaan tussen oud en nieuw

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Verouderde handlers inpakken

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

## Beste praktijken

1. **Injecteer interfaces** - Afhankelijk van abstracties, niet van implementaties
2. **Constructor-injectie** - Geef de voorkeur aan constructor-injectie boven setter-injectie
3. **Eén verantwoordelijkheid** - Elke klasse zou weinig afhankelijkheden moeten hebben
4. **Vermijd containerbewustzijn** - Services mogen niet op de hoogte zijn van de container
5. **Configureren, niet coderen** - Gebruik configuratiebestanden voor bedrading

## Gerelateerde documentatie

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 implementatie
- ../03-Module-Development/Patterns/Service-Layer - Servicepatroon
- ../03-Module-Ontwikkeling/Best-Practices/Testen - Testen met DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architectuur - Architectuuroverzicht