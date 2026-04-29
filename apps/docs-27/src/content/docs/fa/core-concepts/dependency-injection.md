---
title: "تزریق وابستگی در XOOPS"
---
:::note[سازگاری نسخه]
| ویژگی | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| دستی DI (تزریق سازنده) | ✅ موجود | ✅ موجود |
| کانتینر PSR-11 | ❌ داخلی نیست | ✅ پشتیبانی بومی |
| `\XMF\Module\Helper::getContainer()` | ❌ فقط 4.0 | ✅ موجود |

در **XOOPS 2.5.x**، از تزریق سازنده دستی (وابستگی ها به طور صریح) استفاده کنید. نمونه‌های کانتینر PSR-11 زیر برای **XOOPS 4.0** هستند.
:::

## بررسی اجمالی

تزریق وابستگی (DI) یک الگوی طراحی است که به اجزا اجازه می دهد تا وابستگی های خود را از منابع خارجی دریافت کنند نه اینکه آنها را در داخل ایجاد کنند. XOOPS 4.0 پشتیبانی از کانتینر DI سازگار با PSR-11 را معرفی می کند.

## چرا تزریق وابستگی؟

### بدون DI (کوپلینگ محکم)

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

### با DI (کوپلینگ شل)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## کانتینر PSR-11

### استفاده اولیه

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

### پیکربندی کانتینر

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

## ثبت خدمات

### سیم کشی خودکار

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

### ثبت نام دستی

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

## تزریق سازنده

### رویکرد ترجیحی

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

## روش تزریق

### برای وابستگی های اختیاری

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

## اتصال رابط

### رابط ها را تعریف کنید

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### پیاده سازی Bind

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

## تست با DI

### مسخره کردن آسان

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

## XOOPS Legacy ادغام

### پل زدن قدیم و جدید

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \XMF\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Wrapping Legacy Handlers

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

## بهترین شیوه ها

1. **Inject Interfaces** - به انتزاعات بستگی دارد، نه پیاده سازی
2. **تزریق سازنده** - سازنده را به تزریق ستر ترجیح دهید
3. ** مسئولیت منفرد ** - هر کلاس باید وابستگی های کمی داشته باشد
4. **اجتناب از آگاهی از کانتینر** - سرویس ها نباید از کانتینر اطلاع داشته باشند
5. **پیکربندی، کد نویسی نکنید** - از فایل های پیکربندی برای سیم کشی استفاده کنید

## مستندات مرتبط

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - پیاده سازی PSR-11
- ../03-Module-Development/Patterns/Service-Layer - الگوی خدمات
- ../03-Module-Development/Best-Practices/Testing - تست با DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - نمای کلی معماری