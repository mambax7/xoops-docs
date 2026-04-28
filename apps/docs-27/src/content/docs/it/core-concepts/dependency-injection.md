---
title: "Iniezione di Dipendenze in XOOPS"
---

:::note[Compatibilità della versione]
| Funzionalità | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| DI manuale (iniezione nel costruttore) | ✅ Disponibile | ✅ Disponibile |
| Contenitore PSR-11 | ❌ Non integrato | ✅ Supporto nativo |
| `\Xmf\Module\Helper::getContainer()` | ❌ Solo 4.0 | ✅ Disponibile |

In **XOOPS 2.5.x**, utilizza l'iniezione manuale nel costruttore (passando le dipendenze in modo esplicito). Gli esempi del contenitore PSR-11 di seguito sono per **XOOPS 4.0**.
:::

## Panoramica

L'iniezione di dipendenze (DI) è un pattern di design che consente ai componenti di ricevere le loro dipendenze da fonti esterne piuttosto che crearle internamente. XOOPS 4.0 introduce il supporto nativo per un contenitore DI compatibile con PSR-11.

## Perché Dependency Injection?

### Senza DI (Accoppiamento stretto)

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

### Con DI (Accoppiamento debole)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## Contenitore PSR-11

### Utilizzo di base

```php
use Psr\Container\ContainerInterface;

// Ottieni il contenitore
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// Recupera un servizio
$articleService = $container->get(ArticleService::class);

// Verifica se il servizio esiste
if ($container->has(ArticleService::class)) {
    // Usa il servizio
}
```

### Configurazione del contenitore

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // Istanziazione semplice della classe
    ArticleRepository::class => ArticleRepository::class,

    // Binding interfaccia a implementazione
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // Funzione factory
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // Istanza condivisa (singleton)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## Registrazione dei servizi

### Auto-wiring

```php
// Il contenitore risolve automaticamente le dipendenze
// quando gli hint dei tipi sono disponibili

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// Il contenitore crea ArticleController con le sue dipendenze
$controller = $container->get(ArticleController::class);
```

### Registrazione manuale

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
        'arguments' => ['@database'],  // Riferimento ad altro servizio
    ],
];
```

## Iniezione nel costruttore

### Approccio preferito

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

## Iniezione nel metodo

### Per dipendenze opzionali

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

## Binding dell'interfaccia

### Definisci interfacce

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### Bind implementazione

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // Oppure con factory
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## Test con DI

### Mock facili

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // Crea mock
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // Inietta mock
        $service = new ArticleService($repository, $dispatcher, $logger);

        // Imposta aspettative
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // Test
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## Integrazione legacy di XOOPS

### Collegamento vecchio e nuovo

```php
// Ottieni servizio dal contenitore nel codice legacy
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### Wrapping dei gestori legacy

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

## Best practice

1. **Inietta interfacce** - Dipendi da astrazioni, non da implementazioni
2. **Iniezione nel costruttore** - Preferisci l'iniezione nel costruttore rispetto al setter
3. **Responsabilità unica** - Ogni classe dovrebbe avere poche dipendenze
4. **Evita la consapevolezza del contenitore** - I servizi non dovrebbero conoscere il contenitore
5. **Configura, non codificare** - Usa i file di configurazione per il wiring

## Documentazione correlata

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - Implementazione PSR-11
- ../03-Module-Development/Patterns/Service-Layer - Pattern Service
- ../03-Module-Development/Best-Practices/Testing - Test con DI
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Panoramica dell'architettura
