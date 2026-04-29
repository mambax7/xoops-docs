---
title: "Έγχυση εξάρτησης σε XOOPS"
---

:::note[Συμβατότητα έκδοσης]
| Χαρακτηριστικό | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Εγχειρίδιο DI (κατασκευαστική έγχυση) | ✅ Διαθέσιμο | ✅ Διαθέσιμο |
| PSR-11 Δοχείο | ❌ Μη ενσωματωμένο | ✅ Εγγενής υποστήριξη |
| `\XMF\Module\Helper::getContainer()` | ❌ 4.0 μόνο | ✅ Διαθέσιμο |

Στο **XOOPS 2.5.x**, χρησιμοποιήστε τη μη αυτόματη έγχυση κατασκευαστή (ρητά περνώντας εξαρτήσεις). Τα παρακάτω παραδείγματα κοντέινερ PSR-11 είναι για **XOOPS 4.0**.
:::

## Επισκόπηση

Το Dependency Injection (DI) είναι ένα μοτίβο σχεδιασμού που επιτρέπει στα στοιχεία να λαμβάνουν τις εξαρτήσεις τους από εξωτερικές πηγές αντί να τις δημιουργούν εσωτερικά. Το XOOPS 4.0 παρουσιάζει τη συμβατή υποστήριξη κοντέινερ PSR-11.

## Γιατί Έγχυση Εξάρτησης;

## # Χωρίς DI (Σφιχτός σύνδεσμος)

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

## # Με DI (Χαλαρή σύζευξη)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 Δοχείο

## # Βασική χρήση

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

## # Διαμόρφωση κοντέινερ

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

## Εγγραφή υπηρεσίας

## # Αυτόματη καλωδίωση

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

## # Εγχειρίδιο εγγραφής

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

## Constructor Injection

## # Προτιμώμενη προσέγγιση

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

## Μέθοδος Ένεσης

## # Για προαιρετικές εξαρτήσεις

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

## Σύνδεση διεπαφής

## # Ορισμός διεπαφών

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

## # Εφαρμογή Bind

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

## Δοκιμή με DI

## # Εύκολη κοροϊδία

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

## XOOPS Ενσωμάτωση παλαιού τύπου

## # Γεφύρωση Παλαιού και Νέου

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

## # Wrapping Legacy Handlers

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

## Βέλτιστες πρακτικές

1. **Inject Interfaces** - Βασίζονται σε αφαιρέσεις, όχι σε υλοποιήσεις
2. **Constructor Injection** - Προτιμήστε το constructor έναντι του setter injection
3. **Ενιαία ευθύνη** - Κάθε τάξη πρέπει να έχει λίγες εξαρτήσεις
4. **Avoid Container Awareness** - Οι υπηρεσίες δεν πρέπει να γνωρίζουν για το κοντέινερ
5. **Διαμόρφωση, Μην κωδικοποιείτε** - Χρησιμοποιήστε αρχεία διαμόρφωσης για την καλωδίωση

## Σχετική τεκμηρίωση

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 υλοποίηση
- ../03-Module-Development/Patterns/Service-Layer - Μοτίβο σέρβις
- ../03-Module-Development/Best-Practices/Testing - Δοκιμή με DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Αρχιτεκτονική επισκόπηση
