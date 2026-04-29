---
title: "Dependency Injection in XOOPS"
---

:::note[Versionskompatibilitet]
| Funktion | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| Manual DI (konstruktørindsprøjtning) | ✅ Tilgængelig | ✅ Tilgængelig |
| PSR-11 Container | ❌ Ikke indbygget | ✅ Native support |
| `\Xmf\Module\Helper::getContainer()` | ❌ kun 4.0 | ✅ Tilgængelig |

I **XOOPS 2.5.x** skal du bruge manuel konstruktørinjektion (passer eksplicit afhængigheder). Eksemplerne på PSR-11-beholderne nedenfor er til **XOOPS 4.0**.
:::

## Oversigt

Dependency Injection (DI) er et designmønster, der tillader komponenter at modtage deres afhængigheder fra eksterne kilder i stedet for at skabe dem internt. XOOPS 4.0 introducerer PSR-11-kompatibel DI-beholderunderstøttelse.

## Hvorfor afhængighedsinjektion?

### Uden DI (tæt kobling)

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

### Med DI (løs kobling)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 Container

### Grundlæggende brug

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

### Containerkonfiguration

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

## Tjenesteregistrering

### Automatisk ledningsføring

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

### Manuel registrering

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

## Konstruktørindsprøjtning

### Foretrukken tilgang

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

## Metode Injektion

### Til valgfrie afhængigheder

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

## Interface Binding

### Definer grænseflader

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Bind-implementering

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

## Test med DI

### Nem at spotte

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

## XOOPS Legacy-integration

### Bro mellem gammelt og nyt

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Indpakning Legacy Handlers

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

## Bedste praksis

1. **Inject Interfaces** - Afhænger af abstraktioner, ikke implementeringer
2. **Konstruktørindsprøjtning** - Foretrækker konstruktør frem for sætterinjektion
3. **Enkelt ansvar** - Hver klasse bør have få afhængigheder
4. **Undgå containerbevidsthed** - Tjenester bør ikke kende til containeren
5. **Configure, Don't Code** - Brug konfigurationsfiler til ledningsføring

## Relateret dokumentation

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 implementering
- ../03-Module-Development/Patterns/Service-Layer - Servicemønster
- ../03-Module-Development/Best-Practices/Testing - Test med DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Arkitektur oversigt
