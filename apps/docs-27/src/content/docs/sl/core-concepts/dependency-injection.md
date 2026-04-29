---
title: "Vložek odvisnosti v XOOPS"
---
:::note[Združljivost različic]
| Funkcija | XOOPS 2.5.x | XOOPS 4,0 |
|---------|-------------|------------|
| Ročni DI (vbrizgavanje konstruktorja) | ✅ Na voljo | ✅ Na voljo |
| PSR-11 Posoda | ❌ Ni vgrajeno | ✅ Izvorna podpora |
| `\XMF\Module\Helper::getContainer()` | ❌ Samo 4.0 | ✅ Na voljo |

V **XOOPS 2.5.x** uporabite ročno vstavljanje konstruktorja (izrecno posredovanje odvisnosti). Spodnji primeri vsebnikov PSR-11 so za **XOOPS 4.0**.
:::

## Pregled

Vstavljanje odvisnosti (DI) je vzorec načrtovanja, ki komponentam omogoča, da prejmejo svoje odvisnosti iz zunanjih virov, namesto da bi jih ustvarile interno. XOOPS 4.0 uvaja PSR-11 združljivo podporo za vsebnik DI.

## Zakaj vbrizgavanje odvisnosti?

### Brez DI (tesna povezava)
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
### Z DI (ohlapna spojka)
```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```
## PSR-11 Posoda

### Osnovna uporaba
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
### Konfiguracija vsebnika
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
## Registracija storitve

### Samodejno ožičenje
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
### Ročna registracija
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
## Vbrizgavanje konstruktorja

### Prednostni pristop
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
## Metoda Injekcija

### Za neobvezne odvisnosti
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
## Vezava vmesnika

### Definirajte vmesnike
```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```
### Implementacija povezovanja
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
## Testiranje z DI

### Lahko norčevanje
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
## XOOPS Legacy Integration

### Premostitev starega in novega
```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```
### Ovijanje podedovanih obdelovalcev
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
## Najboljše prakse

1. **Inject Interfaces** – odvisno od abstrakcij, ne od implementacij
2. **Constructor Injection** - Dajte prednost konstruktorju kot setter injekciji
3. **Ena odgovornost** - Vsak razred mora imeti nekaj odvisnosti
4. **Izogibajte se zavedanju vsebnika** – Storitve ne bi smele vedeti za vsebnik
5. **Konfiguriraj, ne kodiraj** - Uporabite konfiguracijske datoteke za ožičenje

## Povezana dokumentacija

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 implementacija
- ../03-Module-Development/Patterns/Service-Layer - Servisni vzorec
- ../03-Module-Development/Best-Practices/Testing - Testiranje z DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Pregled arhitekture