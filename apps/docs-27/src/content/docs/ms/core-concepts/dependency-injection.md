---
title: "Suntikan Ketergantungan dalam XOOPS"
---
:::nota[Kesesuaian Versi]
| Ciri | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| DI Manual (suntikan pembina) | ✅ Tersedia | ✅ Tersedia |
| Bekas PSR-11 | ❌ Tidak terbina dalam | ✅ Sokongan asli |
| `\XMF\Module\Helper::getContainer()` | ❌ 4.0 sahaja | ✅ Tersedia |Dalam **XOOPS 2.5.x**, gunakan suntikan pembina manual (melepasi kebergantungan secara eksplisit). Contoh bekas PSR-11 di bawah adalah untuk **XOOPS 4.0**.
:::## Gambaran KeseluruhanSuntikan Ketergantungan (DI) ialah corak reka bentuk yang membolehkan komponen menerima kebergantungan mereka daripada sumber luaran dan bukannya menciptanya secara dalaman. XOOPS 4.0 memperkenalkan sokongan kontena DI serasi PSR-11.## Mengapa Suntikan Ketergantungan?### Tanpa DI (Gandingan Ketat)
```
php
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
### Dengan DI (Gandingan Longgar)
```
php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```
## Bekas PSR-11### Penggunaan Asas
```
php
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
### Konfigurasi Bekas
```
php
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
## Pendaftaran Perkhidmatan### Pendawaian automatik
```
php
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
### Pendaftaran Manual
```
php
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
## Suntikan Pembina### Pendekatan Pilihan
```
php
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
## Suntikan Kaedah### Untuk Ketergantungan Pilihan
```
php
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
## Pengikat Antara Muka### Tentukan Antara Muka
```
php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```
### Pelaksanaan Ikatan
```
php
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
## Menguji dengan DI### Mudah Diejek
```
php
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
## XOOPS Integrasi Legasi### Merapatkan Lama dan Baru
```
php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \XMF\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```
### Pengendali Warisan Bungkus
```
php
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
## Amalan Terbaik1. **Antaramuka Inject** - Bergantung pada abstraksi, bukan pelaksanaan
2. **Suntikan Pembina** - Lebih suka pembina daripada suntikan penetap
3. **Tanggungjawab Tunggal** - Setiap kelas harus mempunyai sedikit tanggungan
4. **Elak Kesedaran Kontena** - Perkhidmatan tidak sepatutnya mengetahui tentang kontena
5. **Configure, Don't Code** - Gunakan fail konfigurasi untuk pendawaian## Dokumentasi Berkaitan- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Pelaksanaan PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Corak perkhidmatan
- ../03-Module-Development/Best-Practices/Testing - Menguji dengan DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Gambaran keseluruhan seni bina