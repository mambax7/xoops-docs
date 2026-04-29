---
title: "การพึ่งพาการฉีดใน XOOPS"
---
:::note[ความเข้ากันได้ของเวอร์ชัน]
| คุณสมบัติ | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| คู่มือ DI (การฉีดตัวสร้าง) | ✅ มีจำหน่าย | ✅ มีจำหน่าย |
| PSR-11 คอนเทนเนอร์ | ❌ ไม่ใช่บิวท์อิน | ✅ รองรับภาษาพื้นเมือง |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 เท่านั้น | ✅ มีจำหน่าย |

ใน **XOOPS 2.5.x** ให้ใช้การแทรกตัวสร้างแบบแมนนวล (ผ่านการพึ่งพาอย่างชัดเจน) ตัวอย่างคอนเทนเนอร์ PSR-11 ด้านล่างมีไว้สำหรับ **XOOPS 4.0**
::::::

## ภาพรวม

Dependency Injection (DI) คือรูปแบบการออกแบบที่ช่วยให้ส่วนประกอบต่างๆ ได้รับการพึ่งพาจากแหล่งภายนอก แทนที่จะสร้างขึ้นภายใน XOOPS 4.0 แนะนำการสนับสนุนคอนเทนเนอร์ PSR-11 DI ที่เข้ากันได้

## ทำไมต้องพึ่งการฉีด?

### ไม่มี DI (ข้อต่อแน่น)
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
### พร้อม DI (ข้อต่อหลวม)
```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```
## PSR-11 คอนเทนเนอร์

### การใช้งานพื้นฐาน
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
### การกำหนดค่าคอนเทนเนอร์
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
## การลงทะเบียนบริการ

### เดินสายไฟอัตโนมัติ
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
### การลงทะเบียนด้วยตนเอง
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
## การฉีดคอนสตรัคเตอร์

### แนวทางที่ต้องการ
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
## วิธีการฉีด

### สำหรับการพึ่งพาเพิ่มเติม
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
## การผูกอินเทอร์เฟซ

### กำหนดอินเทอร์เฟซ
```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```
### การดำเนินการผูกมัด
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
## การทดสอบด้วย DI

### เยาะเย้ยง่าย
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
## XOOPS การบูรณาการแบบเดิม

### เชื่อมโยงเก่าและใหม่
```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```
### การห่อตัวจัดการแบบเดิม
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **Inject Interfaces** - ขึ้นอยู่กับนามธรรม ไม่ใช่การใช้งาน
2. **การฉีดคอนสตรัคเตอร์** - ชอบคอนสตรัคเตอร์มากกว่าการฉีดเซ็ตเตอร์
3. **ความรับผิดชอบเดี่ยว** - แต่ละคลาสควรมีการพึ่งพาน้อย
4. **หลีกเลี่ยงการรับรู้คอนเทนเนอร์** - บริการไม่ควรรู้เกี่ยวกับคอนเทนเนอร์
5. **กำหนดค่า ไม่ต้องเขียนโค้ด** - ใช้ไฟล์การกำหนดค่าสำหรับการเดินสาย

## เอกสารที่เกี่ยวข้อง

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 การดำเนินการ
- ../03-Module-Development/Patterns/Service-Layer - รูปแบบการบริการ
- ../03-Module-Development/Best-Practices/testing - การทดสอบด้วย DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - ภาพรวมสถาปัตยกรรม