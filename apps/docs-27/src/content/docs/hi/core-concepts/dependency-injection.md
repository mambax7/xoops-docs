---
title: "XOOPS में निर्भरता इंजेक्शन"
---
:::नोट[संस्करण संगतता]
| फ़ीचर | XOOPS 2.5.x | XOOPS 4.0 |
|---------|----|---|
| मैनुअल डीआई (कन्स्ट्रक्टर इंजेक्शन) | ✅ उपलब्ध | ✅ उपलब्ध |
| पीएसआर-11 कंटेनर | ❌ बिल्ट-इन नहीं | ✅ मूल समर्थन |
| `\Xmf\Module\Helper::getContainer()` | ❌ केवल 4.0 | ✅ उपलब्ध |

**XOOPS 2.5.x** में, मैन्युअल कंस्ट्रक्टर इंजेक्शन (निर्भरता को स्पष्ट रूप से पास करना) का उपयोग करें। नीचे दिए गए PSR-11 कंटेनर उदाहरण **XOOPS 4.0** के लिए हैं।
:::

## अवलोकन

डिपेंडेंसी इंजेक्शन (डीआई) एक डिज़ाइन पैटर्न है जो घटकों को आंतरिक रूप से बनाने के बजाय बाहरी स्रोतों से अपनी निर्भरता प्राप्त करने की अनुमति देता है। XOOPS 4.0 ने PSR-11 संगत DI कंटेनर समर्थन प्रस्तुत किया है।

## निर्भरता इंजेक्शन क्यों?

### बिना डीआई (टाइट कपलिंग)

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

### डीआई (लूज़ कपलिंग) के साथ

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## पीएसआर-11 कंटेनर

### मूल उपयोग

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

### कंटेनर कॉन्फ़िगरेशन

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

## सेवा पंजीकरण

### ऑटो-वायरिंग

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

### मैन्युअल पंजीकरण

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

## कंस्ट्रक्टर इंजेक्शन

### पसंदीदा दृष्टिकोण

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

## विधि इंजेक्शन

### वैकल्पिक निर्भरता के लिए

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

## इंटरफ़ेस बाइंडिंग

### इंटरफ़ेस परिभाषित करें

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### बाइंड कार्यान्वयन

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

## डीआई के साथ परीक्षण

### आसान उपहास

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

## XOOPS विरासत एकीकरण

### पुराने और नए को जोड़ना

```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### लिगेसी हैंडलर्स को लपेटना

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

## सर्वोत्तम प्रथाएँ

1. **इंटरफ़ेस इंजेक्ट करें** - अमूर्त पर निर्भर करें, कार्यान्वयन पर नहीं
2. **कन्स्ट्रक्टर इंजेक्शन** - सेटर इंजेक्शन की तुलना में कंस्ट्रक्टर को प्राथमिकता दें
3. **एकल जिम्मेदारी** - प्रत्येक वर्ग में कुछ निर्भरताएँ होनी चाहिए
4. **कंटेनर जागरूकता से बचें** - सेवाओं को कंटेनर के बारे में पता नहीं होना चाहिए
5. **कॉन्फ़िगर करें, कोड न करें** - वायरिंग के लिए कॉन्फ़िगरेशन फ़ाइलों का उपयोग करें

## संबंधित दस्तावेज़ीकरण

- ../07-XOOPS-4.0/कार्यान्वयन-गाइड/PSR-11-निर्भरता-इंजेक्शन-गाइड - PSR-11 कार्यान्वयन
- ../03-मॉड्यूल-विकास/पैटर्न/सेवा-परत - सेवा पैटर्न
- ../03-मॉड्यूल-विकास/सर्वोत्तम अभ्यास/परीक्षण - डीआई के साथ परीक्षण
- ../07-XOOPS-4.0/XOOPS-4.0-आर्किटेक्चर - आर्किटेक्चर सिंहावलोकन