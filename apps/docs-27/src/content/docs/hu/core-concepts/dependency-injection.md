---
title: "Függőséginjektálás XOOPS-ban"
---
:::note[Verziókompatibilitás]
| Funkció | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|-------------|
| Kézi DI (konstruktori befecskendezés) | ✅ Elérhető | ✅ Elérhető |
| PSR-11 konténer | ❌ Nem beépített | ✅ Natív támogatás |
| `\XMF\module\Helper::getContainer()` | ❌ Csak 4.0 | ✅ Elérhető |

A **XOOPS 2.5.x** verzióban használjon manuális konstruktor-injektálást (a függőségek kifejezett átadása). Az alábbi példák a PSR-11 konténerhez a **XOOPS 4.0**-ra vonatkoznak.
:::

## Áttekintés

A Dependency Injection (DI) egy olyan tervezési minta, amely lehetővé teszi, hogy az összetevők külső forrásokból kapják a függőségeiket, ahelyett, hogy belsőleg hoznák létre azokat. A XOOPS 4.0 bevezeti a PSR-11 kompatibilis DI konténer támogatást.

## Miért a függőségi injekció?

### DI nélkül (szoros tengelykapcsoló)

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

### DI-vel (laza csatolás)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 tartály

### Alapvető használat

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

### Tároló konfigurációja

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

## Szolgáltatás regisztráció

### Automatikus bekötés

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

### Kézi regisztráció

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

## Konstruktor befecskendezés

### Előnyben részesített megközelítés

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

## Injekciós módszer

### Választható függőségekhez

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

## Interfész kötés

### Interfészek meghatározása

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Kötési megvalósítás

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

## Tesztelés DI-vel

### Könnyű gúny

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

## XOOPS Legacy integráció

### A régi és az új összekapcsolása

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Hagyományos kezelők becsomagolása

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

## Bevált gyakorlatok

1. **Inject Interfaces** - Az absztrakcióktól függ, nem a megvalósításoktól
2. **Konstruktori befecskendezés** - Előnyben részesítse a konstruktort a beállító befecskendezéssel szemben
3. **Single Responsibility** – Minden osztálynak kevés függőséggel kell rendelkeznie
4. **Kerülje el a konténerfigyelést** – A szolgáltatásoknak nem szabad tudniuk a tárolóról
5. **Konfiguráljon, ne kódoljon** - Konfigurációs fájlokat használjon a bekötéshez

## Kapcsolódó dokumentáció

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 megvalósítás
- ../03-module-Development/Patterns/Service-Layer - Szervizminta
- ../03-module-Development/Best-Practices/Testing - Tesztelés DI-vel
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Építészeti áttekintés
