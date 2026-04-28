---
title: "Wstrzykiwanie zależności w XOOPS"
---

:::note[Kompatybilność wersji]
| Funkcja | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Ręczne DI (injection przez konstruktor) | ✅ Dostępne | ✅ Dostępne |
| Kontener PSR-11 | ❌ Nie wbudowany | ✅ Natywna obsługa |
| `\Xmf\Module\Helper::getContainer()` | ❌ Tylko 4.0 | ✅ Dostępne |

W **XOOPS 2.5.x** używaj ręcznego injection przez konstruktor (jawne przekazywanie zależności). Przykłady kontenera PSR-11 poniżej są dla **XOOPS 4.0**.
:::

## Przegląd

Wstrzykiwanie zależności (DI) to wzorzec projektowy, który pozwala komponentom otrzymywać swoje zależności z źródeł zewnętrznych zamiast tworzyć je wewnętrznie. XOOPS 4.0 wprowadza obsługę kontenera DI kompatybilnego z PSR-11.

## Dlaczego wstrzykiwanie zależności?

### Bez DI (ścisłe powiązanie)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // Twarde zależności - trudne do testowania i modyfikacji
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### Z DI (luźne powiązanie)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Kontener PSR-11

### Podstawowe użycie

```php
use Psr\Container\ContainerInterface;

// Pobierz kontener
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Pobierz usługę
$articleService = $container->get(ArticleService::class);

// Sprawdź czy usługa istnieje
if ($container->has(ArticleService::class)) {
    // Użyj usługę
}
```

### Konfiguracja kontenera

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Prosta instancjacja klasy
    ArticleRepository::class => ArticleRepository::class,

    // Wiązanie interfejsu do implementacji
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Funkcja fabryki
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Współdzielona instancja (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Rejestracja usługi

### Automatyczne kierowanie

```php
// Kontener automatycznie rozwiązuje zależności
// gdy są dostępne wskazówki typów

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Kontener tworzy ArticleController z jego zależnościami
$controller = $container->get(ArticleController::class);
```

### Ręczna rejestracja

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
        'arguments' => ['@database'],  // Odwołanie do innej usługi
    ],
];
```

## Injection przez konstruktor

### Preferowana metoda

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

## Injection przez metodę

### Dla opcjonalnych zależności

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

## Wiązanie interfejsu

### Definiuj interfejsy

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Wiąż implementację

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Lub z fabryką
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Testowanie z DI

### Łatwe mockowanie

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Utwórz mocki
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Wstrzyknij mocki
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Ustaw oczekiwania
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Testuj
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Integracja z starszym kodem XOOPS

### Łączenie starego i nowego

```php
// Pobierz usługę z kontenera w starszym kodzie
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Zawijanie starszych obsługiwaczy

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

## Najlepsze praktyki

1. **Wstrzykuj interfejsy** - Zależ od abstrakcji, nie implementacji
2. **Injection przez konstruktor** - Preferuj konstruktor nad setterem
3. **Jedna odpowiedzialność** - Każda klasa powinna mieć mało zależności
4. **Unikaj świadomości kontenera** - Usługi nie powinny wiedzieć o kontenerze
5. **Konfiguruj, nie koduj** - Użyj plików konfiguracyjnych do połączenia

## Powiązana dokumentacja

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Przewodnik implementacji PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Wzorzec serwisu
- ../03-Module-Development/Best-Practices/Testing - Testowanie z DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Przegląd architektury
