---
title: "Dependency Injection in XOOPS"
---

:::note[Versionskompatibilität]
| Feature | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Manuelles DI (Constructor Injection) | ✅ Verfügbar | ✅ Verfügbar |
| PSR-11 Container | ❌ Nicht integriert | ✅ Native Unterstützung |
| `\Xmf\Module\Helper::getContainer()` | ❌ Nur 4.0 | ✅ Verfügbar |

In **XOOPS 2.5.x** verwenden Sie manuelle Constructor Injection (explizite Übergabe von Abhängigkeiten). Die PSR-11 Container-Beispiele unten sind für **XOOPS 4.0**.
:::

## Übersicht

Dependency Injection (DI) ist ein Design Pattern, das Komponenten ermöglicht, ihre Abhängigkeiten von externen Quellen zu erhalten, anstatt sie intern zu erstellen. XOOPS 4.0 führt PSR-11 kompatible DI Container-Unterstützung ein.

## Warum Dependency Injection?

### Ohne DI (Feste Kopplung)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Harte Abhängigkeiten - schwer zu testen und zu ändern
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### Mit DI (Lose Kopplung)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 Container

### Basic Nutzung

```php
use Psr\Container\ContainerInterface;

// Container abrufen
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Service abrufen
$articleService = $container->get(ArticleService::class);

// Prüfen ob Service existiert
if ($container->has(ArticleService::class)) {
    // Service verwenden
}
```

### Container Konfiguration

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Einfache Klassen-Instanziierung
    ArticleRepository::class => ArticleRepository::class,

    // Interface zu Implementierung Binding
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Factory Funktion
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Freigegebene Instanz (Singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Service Registrierung

### Auto-Wiring

```php
// Der Container löst Abhängigkeiten automatisch auf
// wenn Type Hints verfügbar sind

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Container erstellt ArticleController mit seinen Abhängigkeiten
$controller = $container->get(ArticleController::class);
```

### Manuelle Registrierung

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
        'arguments' => ['@database'],  // Referenz zu anderem Service
    ],
];
```

## Constructor Injection

### Bevorzugter Ansatz

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

## Method Injection

### Für optionale Abhängigkeiten

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

## Interface Binding

### Interfaces definieren

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Implementierung binden

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Oder mit Factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Testen mit DI

### Einfaches Mocking

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Mocks erstellen
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Mocks injizieren
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Erwartungen setzen
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

### Alten und Neuen Code zusammenbinden

```php
// Service aus Container im Legacy-Code abrufen
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Legacy Handler wrappen

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

## Best Practices

1. **Injizieren Sie Interfaces** - Abhängig von Abstraktionen, nicht Implementierungen
2. **Constructor Injection** - Bevorzugen Sie Constructor über Setter Injection
3. **Einzelne Verantwortung** - Jede Klasse sollte wenige Abhängigkeiten haben
4. **Vermeiden Sie Container-Kenntnis** - Services sollten nichts über den Container wissen
5. **Konfigurieren, nicht kodieren** - Verwenden Sie Konfigurationsdateien für Wiring

## Verwandte Dokumentation

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 Implementierung
- ../03-Module-Development/Patterns/Service-Layer - Service Pattern
- ../03-Module-Development/Best-Practices/Testing - Testen mit DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Architektur-Übersicht
