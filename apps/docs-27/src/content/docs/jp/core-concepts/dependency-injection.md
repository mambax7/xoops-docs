---
title: "XOOPS の依存性注入"
---

:::note[バージョン互換性]
| 機能 | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| 手動DI（コンストラクタ注入） | ✅ 利用可能 | ✅ 利用可能 |
| PSR-11コンテナ | ❌ 組み込みなし | ✅ ネイティブサポート |
| `\Xmf\Module\Helper::getContainer()` | ❌ 4.0のみ | ✅ 利用可能 |

**XOOPS 2.5.x**では、手動コンストラクタ注入（依存関係を明示的に渡す）を使用してください。下記のPSR-11コンテナの例は**XOOPS 4.0**向けです。
:::

## 概要

依存性注入（DI）は、コンポーネントが内部で作成する代わりに外部ソースから依存関係を受け取ることを可能にする設計パターンです。XOOPS 4.0はPSR-11互換DIコンテナサポートを導入しています。

## なぜ依存性注入を使うのか？

### DI なし（密結合）

```php
class ArticleService
{
    private ArticleRepository $repository;
    private EventDispatcher $dispatcher;

    public function __construct()
    {
        // ハード依存関係 - テストや変更が困難
        $this->repository = new ArticleRepository(new XoopsDatabase());
        $this->dispatcher = new EventDispatcher();
    }
}
```

### DI あり（疎結合）

```php
class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}
}
```

## PSR-11コンテナ

### 基本的な使用方法

```php
use Psr\Container\ContainerInterface;

// コンテナを取得
$container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();

// サービスを取得
$articleService = $container->get(ArticleService::class);

// サービスが存在するかチェック
if ($container->has(ArticleService::class)) {
    // サービスを使用
}
```

### コンテナ設定

```php
// config/services.php
use Psr\Container\ContainerInterface;

return [
    // シンプルなクラスインスタンス化
    ArticleRepository::class => ArticleRepository::class,

    // インターフェース実装バインディング
    ArticleRepositoryInterface::class => ArticleRepository::class,

    // ファクトリ関数
    ArticleService::class => function (ContainerInterface $c): ArticleService {
        return new ArticleService(
            $c->get(ArticleRepositoryInterface::class),
            $c->get(EventDispatcherInterface::class)
        );
    },

    // 共有インスタンス（シングルトン）
    'database' => function (): XoopsDatabase {
        return XoopsDatabaseFactory::getDatabaseConnection();
    },
];
```

## サービス登録

### オートワイアリング

```php
// コンテナは型ヒントが利用可能な場合、自動的に依存関係を解決します

class ArticleController
{
    public function __construct(
        private readonly ArticleService $service,
        private readonly ViewRenderer $renderer
    ) {}
}

// コンテナはその依存関係と共にArticleControllerを作成します
$controller = $container->get(ArticleController::class);
```

### 手動登録

```php
// config/services.php
return [
    ArticleService::class => [
        'class' => ArticleService::class,
        'arguments' => [
            ArticleRepositoryInterface::class,
            EventDispatcherInterface::class,
        ],
        'shared' => true,  // シングルトン
    ],

    'article.handler' => [
        'factory' => [ArticleHandlerFactory::class, 'create'],
        'arguments' => ['@database'],  // 他のサービスを参照
    ],
];
```

## コンストラクタ注入

### 推奨アプローチ

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

## メソッド注入

### オプション依存関係用

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

## インターフェース バインディング

### インターフェースを定義

```php
interface ArticleRepositoryInterface
{
    public function findById(int $id): ?Article;
    public function save(Article $article): void;
    public function delete(Article $article): void;
}
```

### 実装をバインド

```php
// config/services.php
return [
    ArticleRepositoryInterface::class => XoopsArticleRepository::class,

    // またはファクトリで
    ArticleRepositoryInterface::class => function (ContainerInterface $c) {
        return new XoopsArticleRepository(
            $c->get('database')
        );
    },
];
```

## DIでテスト

### 簡単なモッキング

```php
class ArticleServiceTest extends TestCase
{
    public function testCreateArticle(): void
    {
        // モックを作成
        $repository = $this->createMock(ArticleRepositoryInterface::class);
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // モックを注入
        $service = new ArticleService($repository, $dispatcher, $logger);

        // 期待を設定
        $repository->expects($this->once())->method('save');
        $dispatcher->expects($this->once())->method('dispatch');

        // テスト
        $dto = new CreateArticleDTO('Title', 'Content');
        $article = $service->create($dto);

        $this->assertInstanceOf(Article::class, $article);
    }
}
```

## XOOPS レガシー統合

### 古いコードと新しいコードをブリッジ

```php
// レガシーコードのコンテナからサービスを取得
function mymodule_get_articles(int $limit): array
{
    $container = \Xmf\Module\Helper::getHelper('mymodule')->getContainer();
    $service = $container->get(ArticleService::class);

    return $service->findRecent($limit);
}
```

### レガシーハンドラーをラップ

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

## ベストプラクティス

1. **インターフェースを注入** - 実装ではなく抽象化に依存
2. **コンストラクタ注入** - セッター注入よりコンストラクタを優先
3. **単一責任** - 各クラスは少数の依存関係を持つべき
4. **コンテナ認識を避ける** - サービスはコンテナについて知らないべき
5. **設定でコード** - ワイアリングに設定ファイルを使用

## 関連ドキュメント

- ../07-XOOPS-4.0/Implementation-Guides/PSR-11-Dependency-Injection-Guide - PSR-11実装
- ../03-Module-Development/Patterns/Service-Layer - サービスパターン
- ../03-Module-Development/Best-Practices/Testing - DIでテスト
- ../07-XOOPS-4.0/XOOPS-4.0-Architecture - アーキテクチャ概要
