---
title: "حقن الاعتماديات في XOOPS"
dir: rtl
lang: ar
---

:::note[توافق الإصدار]
| الميزة | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| حقن الاعتماديات اليدوي (حقن المُنشِّئ) | ✅ متاح | ✅ متاح |
| حاوية PSR-11 | ❌ غير مدمج | ✅ دعم أصلي |
| `\Xmf\Module\Helper::getContainer()` | ❌ XOOPS 4.0 فقط | ✅ متاح |

في **XOOPS 2.5.x**، استخدم حقن المُنشِّئ اليدوي (تمرير الاعتماديات صراحة). أمثلة حاوية PSR-11 أدناه هي لـ **XOOPS 4.0**.
:::

## نظرة عامة

حقن الاعتماديات (DI) هو نمط تصميم يسمح للمكونات باستقبال اعتماديات من مصادر خارجية بدلاً من إنشاء بعضها داخلياً. يقدم XOOPS 4.0 دعم حاوية حقن الاعتماديات المتوافق مع PSR-11.

## لماذا حقن الاعتماديات؟

### بدون حقن الاعتماديات (الاقتران الوثيق)

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

### مع حقن الاعتماديات (الاقتران الضعيف)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## حاوية PSR-11

### الاستخدام الأساسي

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

### تكوين الحاوية

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

## تسجيل الخدمات

### السلك التلقائي

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

### التسجيل اليدوي

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

## حقن المُنشِّئ

### الأسلوب المفضل

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

## حقن الطريقة

### للاعتماديات الاختيارية

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

## ربط الواجهات

### تحديد الواجهات

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### ربط التطبيق

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

## الاختبار مع حقن الاعتماديات

### السخرية السهلة

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

## تكامل XOOPS القديم

### ربط القديم والجديد

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### لف معالجات قديمة

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

## أفضل الممارسات

1. **حقن الواجهات** - اعتمد على التجريدات وليس التطبيقات
2. **حقن المُنشِّئ** - فضل حقن المُنشِّئ على حقن المُعيِّن
3. **المسؤولية الواحدة** - يجب أن يكون لكل فئة عدد قليل من الاعتماديات
4. **تجنب الوعي بالحاوية** - يجب ألا تعرف الخدمات عن الحاوية
5. **التكوين وليس الترميز** - استخدم ملفات التكوين للأسلاك

## الوثائق ذات الصلة

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - تطبيق PSR-11
- ../03-Module-Development/Patterns/Service-Layer - نمط الخدمة
- ../03-Module-Development/Best-Practices/Testing - الاختبار مع حقن الاعتماديات
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - نظرة عامة على الهندسة المعمارية
