---
title: "Uvođenje ovisnosti u XOOPS"
---
:::napomena[Kompatibilnost verzije]
| Značajka | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Ručni DI (injekcija konstruktora) | ✅ Dostupan | ✅ Dostupan |
| PSR-11 Spremnik | ❌ Nije ugrađeno | ✅ Izvorna podrška |
| `\Xmf\Module\Helper::getContainer()` | ❌ Samo 4.0 | ✅ Dostupan |

U **XOOPS 2.5.x** koristite ručno ubacivanje konstruktora (izričito prosljeđujući ovisnosti). Primjeri spremnika PSR-11 u nastavku odnose se na **XOOPS 4.0**.
:::

## Pregled

Dependency Injection (DI) je obrazac dizajna koji omogućuje komponentama da primaju svoje ovisnosti iz vanjskih izvora umjesto da ih stvaraju interno. XOOPS 4.0 predstavlja PSR-11 kompatibilnu podršku za DI spremnik.

## Zašto ubrizgavanje ovisnosti?

### Bez DI (čvrsto spajanje)

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

### S DI (labava spojnica)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 Spremnik

### Osnovna upotreba

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

### Konfiguracija spremnika

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

## Registracija usluge

### Automatsko ožičenje

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

### Ručna registracija

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

## Injekcija konstruktora

### Preferirani pristup

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

## Injekcija metode

### Za neobavezne ovisnosti

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

## Povezivanje sučelja

### Definirajte sučelja

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Implementacija vezivanja

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

## Testiranje s DI

### Lako ismijavanje

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

## XOOPS Legacy integracija

### Premošćivanje starog i novog

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Omatanje naslijeđenih rukovatelja

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

## Najbolji primjeri iz prakse

1. **Inject Interfaces** - Ovisi o apstrakcijama, ne o implementacijama
2. **Ubrizgavanje konstruktora** - Dajte prednost konstruktoru nego ubrizgavanju postavljača
3. **Jedna odgovornost** - Svaki class trebao bi imati nekoliko ovisnosti
4. **Izbjegavajte svijest o spremniku** - Usluge ne bi trebale znati za spremnik
5. **Konfiguriraj, ne kodiraj** - Koristite konfiguracijske datoteke za ožičenje

## Povezana dokumentacija

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 implementacija
- ../03-Module-Development/Patterns/Service-Layer - Uzorak usluge
- ../03-Module-Development/Best-Practices/Testing - Testiranje s DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Pregled arhitekture
