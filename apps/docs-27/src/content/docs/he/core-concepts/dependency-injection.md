---
title: "הזרקת תלות ב-XOOPS"
---

:::הערה[תאימות גרסה]
| תכונה | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| ידני DI (הזרקת קונסטרוקטור) | ✅ זמין | ✅ זמין |
| מיכל PSR-11 | ❌ לא מובנה | ✅ תמיכה מקומית |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 בלבד | ✅ זמין |

ב-**XOOPS 2.5.x**, השתמש בהזרקת בנאי ידנית (העברת תלות במפורש). דוגמאות המכולה של PSR-11 להלן הן עבור **XOOPS 4.0**.
:::

## סקירה כללית

הזרקת תלות (DI) היא דפוס עיצובי המאפשר לרכיבים לקבל את התלות שלהם ממקורות חיצוניים במקום ליצור אותם באופן פנימי. XOOPS 4.0 מציג תמיכה במכולות DI תואמת PSR-11.

## למה הזרקת תלות?

### ללא DI (צימוד הדוק)

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

### עם DI (חיבור רופף)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## מיכל PSR-11

### שימוש בסיסי

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

### תצורת מיכל

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

## רישום שירות

### חיווט אוטומטי

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

### רישום ידני

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

## הזרקת קונסטרוקטור

### גישה מועדפת

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

## הזרקת שיטה

### לתלות אופציונלית

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

## כריכת ממשק

### הגדר ממשקים

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### יישום Bind

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

## בדיקה עם DI

### קל ללעג

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

## XOOPS אינטגרציה מדור קודם

### גישור בין ישן לחדש

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### עטיפת מטפלים מדור קודם

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

## שיטות עבודה מומלצות

1. **הזרקת ממשקים** - תלוי בהפשטות, לא בהטמעות
2. **הזרקת קונסטרוקטור** - העדיפו קונסטרוקטור על פני הזרקת סטטר
3. **אחריות יחידה** - לכל מחלקה צריכה להיות כמה תלות
4. **הימנע ממודעות למכולות** - שירותים לא צריכים לדעת על המכולה
5. **הגדר, אל תקוד** - השתמש בקבצי תצורה עבור חיווט

## תיעוד קשור

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - יישום PSR-11
- ../03-Module-Development/Patterns/Service-Layer - דפוס שירות
- ../03-Module-Development/Best-Practices/Testing - בדיקה עם DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - סקירת אדריכלות
