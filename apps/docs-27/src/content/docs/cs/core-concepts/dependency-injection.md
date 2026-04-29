---
title: "Dependency Injection v XOOPS"
---

:::poznámka[Kompatibilita verzí]
| Funkce | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Ruční DI (konstrukční vstřikování) | ✅ K dispozici | ✅ K dispozici |
| Kontejner PSR-11 | ❌ Není vestavěný | ✅ Nativní podpora |
| `\XMF\Module\Helper::getContainer()` | ❌ Pouze 4.0 | ✅ K dispozici |

V **XOOPS 2.5.x** použijte ruční vkládání konstruktoru (explicitní předávání závislostí). Níže uvedené příklady kontejnerů PSR-11 jsou pro **XOOPS 4.0**.
:::

## Přehled

Dependency Injection (DI) je návrhový vzor, který umožňuje komponentám přijímat své závislosti z externích zdrojů, spíše než je vytvářet interně. XOOPS 4.0 zavádí podporu DI kontejnerů kompatibilní se PSR-11.

## Proč Dependency Injection?

### Bez DI (těsná spojka)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Hard dependencies - difficult to test and modify
        $this->repository = new ArticleRepository(new XOOPSDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### S DI (volná spojka)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Kontejner PSR-11

### Základní použití

```php
use Psr\Container\ContainerInterface;

// Get the container
$container = \XMF\Module\Helper::getHelper('mymodule')->getContainer();

// Retrieve a service
$articleService = $container->get(ArticleService::class);

// Check if service exists
if ($container->has(ArticleService::class)) {
    // Use the service
}
```

### Konfigurace kontejneru

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
    'database' => function (): XOOPSDatabase {
        return XOOPSDatabaseFactory::getDatabaseConnection();
    },
];
```

## Registrace služby

### Automatické zapojení

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

### Ruční registrace

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

## Vstřikování konstruktoru

### Preferovaný přístup

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

## Metoda Injekce

### Pro volitelné závislosti

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

## Vazba rozhraní

### Definujte rozhraní

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Implementace vazby

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XOOPSArticleRepository::class,

    // Or with factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XOOPSArticleRepository(
            $c->get('database')
        );
    },
];
```

## Testování s DI

### Snadné zesměšňování

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

## XOOPS Legacy Integrace

### Spojování starého a nového

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \XMF\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Balení starších ovladačů

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

## Nejlepší postupy

1. **Inject Interfaces** – Závisí na abstrakcích, nikoli na implementacích
2. **Constructor Injection** – Upřednostněte konstruktor před injektáží setter
3. **Jednotná odpovědnost** – Každá třída by měla mít několik závislostí
4. **Vyhněte se povědomí o kontejnerech** – Služby by o kontejneru neměly vědět
5. **Konfigurovat, nekódovat** – Pro zapojení použijte konfigurační soubory

## Související dokumentace

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - implementace PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Servisní vzor
- ../03-Module-Development/Best-Practices/Testing - Testování s DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Přehled architektury