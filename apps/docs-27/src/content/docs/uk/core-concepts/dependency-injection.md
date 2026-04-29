---
title: "Ін’єкція залежності в XOOPS"
---
:::note[Сумісність версій]
| Особливість | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Ручний DI (введення конструктора) | ✅ В наявності | ✅ В наявності |
| PSR-11 Контейнер | ❌ Не вбудований | ✅ Вбудована підтримка |
| `\Xmf\Module\Helper::getContainer()` | ❌ Тільки 4.0 | ✅ В наявності |

У **XOOPS 2.5.x** використовуйте введення конструктора вручну (явна передача залежностей). Наведені нижче приклади контейнерів PSR-11 стосуються **XOOPS 4.0**.
:::

## Огляд

Впровадження залежностей (DI) — це шаблон проектування, який дозволяє компонентам отримувати свої залежності із зовнішніх джерел, а не створювати їх усередині. XOOPS 4.0 представляє підтримку контейнера DI, сумісного з PSR-11.

## Чому Dependency Injection?

### Без DI (щільне з'єднання)
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
### З DI (Loose Coupling)
```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```
## PSR-11 Контейнер

### Основне використання
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
### Конфігурація контейнера
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
## Реєстрація послуги

### Авторозводка
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
### Ручна реєстрація
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
## Впровадження конструктора

### Бажаний підхід
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
## Метод ін'єкції

### Для додаткових залежностей
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
## Прив'язка інтерфейсу

### Визначення інтерфейсів
```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```
### Реалізація прив'язки
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
## Тестування з DI

### Легке глузування
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
## XOOPS Застаріла інтеграція

### Поєднання старого та нового
```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```
### Обгортання застарілих обробників
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
## Найкращі практики

1. **Inject Interfaces** - залежить від абстракцій, а не реалізацій
2. **Ін’єкція конструктора** – віддайте перевагу конструктору, а не ін’єкції сеттера
3. **Єдина відповідальність** - Кожен клас повинен мати кілька залежностей
4. **Уникайте поінформованості про контейнери** - служби не повинні знати про контейнер
5. **Налаштувати, не кодувати** – використовуйте файли конфігурації для з’єднання

## Пов'язана документація

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Реалізація PSR-11
- ../03-Module-Development/Patterns/Service-Layer - шаблон служби
- ../03-Module-Development/Best-Practices/Testing - Тестування з DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Огляд архітектури