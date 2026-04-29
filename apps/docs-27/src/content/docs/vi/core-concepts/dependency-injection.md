---
title: "Tiêm phụ thuộc vào XOOPS"
---
:::note[Phiên bản tương thích]
| Tính năng | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|-------------|
| DI thủ công (tiêm hàm tạo) | ✅ Có sẵn | ✅ Có sẵn |
| Thùng chứa PSR-11 | ❌ Không tích hợp sẵn | ✅ Hỗ trợ bản địa |
| `\Xmf\Module\Helper::getContainer()` | ❌ Chỉ 4.0 | ✅ Có sẵn |

Trong **XOOPS 2.5.x**, hãy sử dụng tính năng chèn hàm tạo thủ công (chuyển các phần phụ thuộc một cách rõ ràng). Các ví dụ về vùng chứa PSR-11 bên dưới dành cho **XOOPS 4.0**.
:::

## Tổng quan

Dependency Insert (DI) là một mẫu thiết kế cho phép các thành phần nhận các phần phụ thuộc của chúng từ các nguồn bên ngoài thay vì tạo chúng từ bên trong. XOOPS 4.0 giới thiệu hỗ trợ vùng chứa DI tương thích PSR-11.

## Tại sao phải tiêm phụ thuộc?

### Không có DI (Khớp nối chặt)

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

### Với DI (Khớp nối lỏng lẻo)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Thùng chứa PSR-11

### Cách sử dụng cơ bản

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

### Cấu hình vùng chứa

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

## Đăng ký dịch vụ

### Tự động nối dây

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

### Đăng ký thủ công

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

## Tiêm hàm tạo

### Phương pháp ưu tiên

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

## Phương pháp tiêm

### Dành cho các phần phụ thuộc tùy chọn

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

## Ràng buộc giao diện

### Xác định giao diện

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Thực hiện ràng buộc

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

## Thử nghiệm với DI

### Chế nhạo dễ dàng

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

## Tích hợp kế thừa XOOPS

### Cầu nối giữa cái cũ và cái mới

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Gói các trình xử lý kế thừa

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

## Các phương pháp hay nhất

1. **Tiêm giao diện** - Phụ thuộc vào sự trừu tượng hóa, không phải việc triển khai
2. **Tiêm hàm tạo** - Thích hàm tạo hơn hàm chèn setter
3. **Trách nhiệm duy nhất** - Mỗi class phải có ít phần phụ thuộc
4. **Tránh nhận biết về vùng chứa** - Các dịch vụ không nên biết về vùng chứa
5. **Cấu hình, không viết mã** - Sử dụng các tệp cấu hình để nối dây

## Tài liệu liên quan

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Triển khai PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Mẫu dịch vụ
- ../03-Module-Development/Best-Thực hành/Thử nghiệm - Thử nghiệm với DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Tổng quan về kiến trúc