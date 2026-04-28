---
title: "Впрыскивание зависимостей в XOOPS"
---

:::note[Совместимость версий]
| Функция | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|----------|
| Ручное DI (впрыскивание через конструктор) | ✅ Доступно | ✅ Доступно |
| Контейнер PSR-11 | ❌ Не встроен | ✅ Встроена поддержка |
| `\Xmf\Module\Helper::getContainer()` | ❌ Только 4.0 | ✅ Доступно |

В **XOOPS 2.5.x**, используйте ручное впрыскивание через конструктор (явная передача зависимостей). Примеры контейнера PSR-11 ниже предназначены для **XOOPS 4.0**.
:::

## Обзор

Впрыскивание зависимостей (DI) - это паттерн проектирования, позволяющий компонентам получать свои зависимости из внешних источников, а не создавать их внутри себя. XOOPS 4.0 вводит встроенную поддержку контейнера, совместимого с PSR-11.

## Зачем нужно впрыскивание зависимостей?

### Без DI (плотная связанность)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Жёсткие зависимости - сложно тестировать и изменять
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### С DI (слабая связанность)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Контейнер PSR-11

### Базовое использование

```php
use Psr\Container\ContainerInterface;

// Получить контейнер
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Получить сервис
$articleService = $container->get(ArticleService::class);

// Проверить наличие сервиса
if ($container->has(ArticleService::class)) {
    // Использовать сервис
}
```

### Конфигурация контейнера

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Простая инстанцировка класса
    ArticleRepository::class => ArticleRepository::class,

    // Привязка интерфейса к реализации
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Функция фабрики
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Общий экземпляр (синглтон)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Регистрация сервисов

### Автоматическое разрешение

```php
// Контейнер автоматически разрешает зависимости
// когда доступны подсказки типов

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Контейнер создаёт ArticleController с его зависимостями
$controller = $container->get(ArticleController::class);
```

### Ручная регистрация

```php
// config/services.php
return [
    ArticleService::class => [
        'class' => ArticleService::class,
        'arguments' => [
            ArticleRepositoryInterface::class,
            EventDispatcherInterface::class,
        ],
        'shared' => true,  // Синглтон
    ],

    'article.handler' => [
        'factory' => [ArticleHandlerFactory::class, 'create'],
        'arguments' => ['@database'],  // Ссылка на другой сервис
    ],
];
```

## Впрыскивание через конструктор

### Предпочтительный подход

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

## Впрыскивание через метод

### Для опциональных зависимостей

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

## Привязка интерфейсов

### Определение интерфейсов

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Привязка реализации

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Или с фабрикой
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Тестирование с DI

### Лёгкое мокирование

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Создать моки
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Впрыснуть моки
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Установить ожидания
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Тест
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Интеграция с XOOPS Legacy

### Мост между старым и новым

```php
// Получить сервис из контейнера в старом коде
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Оборачивание старых обработчиков

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

## Лучшие практики

1. **Впрыскивайте интерфейсы** - зависьте от абстракций, а не реализаций
2. **Впрыскивание через конструктор** - предпочитайте конструктор впрыскиванию через setter
3. **Одна ответственность** - каждый класс должен иметь несколько зависимостей
4. **Избегайте осведомлённости о контейнере** - сервисы не должны знать о контейнере
5. **Конфигурируйте, не кодируйте** - используйте файлы конфигурации для связывания

## Связанная документация

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Реализация PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Паттерн сервиса
- ../03-Module-Development/Best-Practices/Testing - Тестирование с DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Описание архитектуры
