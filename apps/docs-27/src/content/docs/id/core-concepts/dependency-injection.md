---
title: "Injeksi Ketergantungan di XOOPS"
---

:::catatan[Kompatibilitas Versi]
| Fitur | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Manual DI (injeksi konstruktor) | ✅ Tersedia | ✅ Tersedia |
| Kontainer PSR-11 | ❌ Bukan bawaan | ✅ Dukungan asli |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 saja | ✅ Tersedia |

Di **XOOPS 2.5.x**, gunakan injeksi konstruktor manual (meneruskan dependensi secara eksplisit). Contoh container PSR-11 di bawah adalah untuk **XOOPS 4.0**.
:::

## Ikhtisar

Dependency Injection (DI) adalah pola desain yang memungkinkan komponen menerima dependensinya dari sumber eksternal daripada membuatnya secara internal. XOOPS 4.0 memperkenalkan dukungan kontainer DI yang kompatibel dengan PSR-11.

## Mengapa Injeksi Ketergantungan?

### Tanpa DI (Kopling Ketat)

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

### Dengan DI (Kopling Longgar)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 Kontainer

### Penggunaan Dasar

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

### Konfigurasi Kontainer

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

## Pendaftaran Layanan

### Pengkabelan otomatis

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

### Registrasi Manual

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

## Injeksi Konstruktor

### Pendekatan Pilihan

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

## Metode Injeksi

### Untuk Dependensi Opsional

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

## Pengikatan Antarmuka

### Tentukan Antarmuka

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Implementasi Pengikatan

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

## Menguji dengan DI

### Mudah Mengejek

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

## Integrasi Warisan XOOPS

### Menjembatani Lama dan Baru

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Membungkus handler Warisan

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

## Praktik Terbaik

1. **Injeksi Antarmuka** - Bergantung pada abstraksi, bukan implementasi
2. **Injeksi Konstruktor** - Lebih memilih konstruktor daripada injeksi penyetel
3. **Tanggung Jawab Tunggal** - Setiap kelas harus memiliki sedikit ketergantungan
4. **Hindari Kesadaran Kontainer** - Layanan tidak boleh mengetahui tentang kontainer
5. **Konfigurasi, Jangan Kode** - Gunakan file konfigurasi untuk pengkabelan

## Dokumentasi Terkait

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Implementasi PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Pola layanan
- ../03-Module-Development/Best-Practices/Testing - Pengujian dengan DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Ikhtisar arsitektur
