---
title: "XOOPS'ye Bağımlılık Enjeksiyonu"
---
:::not[Sürüm Uyumluluğu]
| Özellik | XOOPS 2.5.x | XOOPS 4.0 |
|-----------|------------|------------|
| Manuel DI (yapıcı enjeksiyonu) | ✅ Mevcut | ✅ Mevcut |
| PSR-11 Konteyner | ❌ Yerleşik değil | ✅ Yerel destek |
| `\Xmf\Module\Helper::getContainer()` | ❌ yalnızca 4.0 | ✅ Mevcut |

**XOOPS 2.5.x**'de, manuel yapıcı enjeksiyonunu kullanın (bağımlılıkları açıkça iletmek). Aşağıdaki PSR-11 konteyner örnekleri **XOOPS 4.0** içindir.
:::

## Genel Bakış

Bağımlılık Enjeksiyonu (DI), bileşenlerin bağımlılıklarını dahili olarak oluşturmak yerine harici kaynaklardan almasına olanak tanıyan bir tasarım modelidir. XOOPS 4.0, PSR-11 uyumlu DI konteyner desteğini sunar.

## Neden Bağımlılık Enjeksiyonu?

### DI olmadan (Sıkı Kaplin)
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
### DI ile (Gevşek Kaplin)
```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```
## PSR-11 Konteyner

### Temel Kullanım
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
### Konteyner Yapılandırması
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
## Hizmet Kaydı

### Otomatik kablolama
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
### Manuel Kayıt
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
## Yapıcı Enjeksiyonu

### Tercih Edilen Yaklaşım
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
## Yöntem Enjeksiyonu

### İsteğe Bağlı Bağımlılıklar İçin
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
## Arayüz Bağlama

### Arayüzleri Tanımla
```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```
### Bağlama Uygulaması
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
## DI ile test etme

### Kolay Alay Etme
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
## XOOPS Eski Entegrasyon

### Eski ve Yeni Arasında Köprü Kurmak
```php
// Get service from container in legacy code
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```
### Eski İşleyicileri Sarma
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
## En İyi Uygulamalar

1. **Arayüzleri Enjekte Et** - Uygulamalara değil soyutlamalara bağlıdır
2. **Yapıcı Enjeksiyonu** - Ayarlayıcı enjeksiyonu yerine yapıcıyı tercih edin
3. **Tek Sorumluluk** - Her sınıfın birkaç bağımlılığı olmalıdır
4. **Konteyner Farkındalığından Kaçının** - Hizmetlerin konteyner hakkında bilgi sahibi olmaması gerekir
5. **Yapılandırın, Kodlamayın** - Kablolama için yapılandırma dosyalarını kullanın

## İlgili Belgeler

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 uygulaması
- ../03-Module-Development/Patterns/Service-Layer - Hizmet modeli
- ../03-Module-Development/Best-Practices/Testing - DI ile test etme
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - Mimariye genel bakış