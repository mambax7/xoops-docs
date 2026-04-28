---
title: "XOOPS 中的依賴注入"
---

:::note[版本相容性]
| 功能 | XOOPS 2.5.x | XOOPS 4.0 |
|------|------------|---------|
| 手動 DI (構造函式注入) | ✅ 可用 | ✅ 可用 |
| PSR-11 容器 | ❌ 未內置 | ✅ 原生支援 |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0 僅 | ✅ 可用 |

在 **XOOPS 2.5.x** 中，使用手動構造函式注入 (顯式傳遞依賴)。下面的 PSR-11 容器示例是針對 **XOOPS 4.0** 的。
:::

## 概述

依賴注入 (DI) 是一種設計模式，允許元件從外部來源接收其依賴，而不是在內部建立它們。XOOPS 4.0 引入了 PSR-11 相容的 DI 容器支援。

## 為什麼使用依賴注入？

### 沒有 DI (緊密耦合)

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // 硬依賴 - 難以測試和修改
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### 使用 DI (鬆散耦合)

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11 容器

### 基本使用

```php
use Psr\Container\ContainerInterface;

// 取得容器
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// 檢索服務
$articleService = $container->get(ArticleService::class);

// 檢查服務是否存在
if ($container->has(ArticleService::class)) {
    // 使用服務
}
```

### 容器設定

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // 簡單類別實例化
    ArticleRepository::class => ArticleRepository::class,

    // 介面到實現的綁定
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // 工廠函式
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // 共享例項 (單體)
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## 服務註冊

### 自動接線

```php
// 當類型提示可用時，容器自動解析依賴

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// 容器使用其依賴建立 ArticleController
$controller = $container->get(ArticleController::class);
```

### 手動註冊

```php
// config/services.php
return [
    ArticleService::class => [
        'class' => ArticleService::class,
        'arguments' => [
            ArticleRepositoryInterface::class,
            EventDispatcherInterface::class,
        ],
        'shared' => true,  // 單體
    ],

    'article.handler' => [
        'factory' => [ArticleHandlerFactory::class, 'create'],
        'arguments' => ['@database'],  // 參考其他服務
    ],
];
```

## 構造函式注入

### 首選方法

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

## 方法注入

### 用於可選依賴

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

## 介面綁定

### 定義介面

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### 綁定實現

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // 或使用工廠
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## 使用 DI 進行測試

### 輕鬆模擬

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // 建立模擬
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // 注入模擬
        $service = new ArticleService($repository, $dispatcher, $logger);

        // 設定期望
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // 測試
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## XOOPS 舊版整合

### 橋接舊版和新版本

```php
// 在舊版程式碼中從容器取得服務
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### 包裝舊版處理程序

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

## 最佳實踐

1. **注入介面** - 依賴抽象，而不是實現
2. **構造函式注入** - 優先於 setter 注入
3. **單一責任** - 每個類別應該有很少的依賴
4. **避免容器感知** - 服務不應該知道容器
5. **配置，不要編碼** - 使用組態檔案進行接線

## 相關文檔

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11 實現
- ../03-Module-Development/Patterns/Service-Layer - 服務模式
- ../03-Module-Development/Best-Practices/Testing - 使用 DI 進行測試
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - 架構概述
