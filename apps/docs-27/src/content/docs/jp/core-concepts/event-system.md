---
title: "XOOPS イベントシステム"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[どのイベントシステムを使うかわかりませんか？]
[イベントシステム選択](Choosing-Event-System.md)を参照してください。両方のアプローチのコード例を含む決定木があります。
:::

:::note[XOOPSの2つのイベントシステム]
| システム | バージョン | ユースケース |
|--------|---------|----------|
| **プリロードシステム** | ✅ XOOPS 2.5.x（現在） | `class/Preload.php`経由のコアイベントをフック |
| **PSR-14イベントディスパッチャー** | 🚧 XOOPS 4.0（将来） | 型付きイベントを使用した最新のイベントディスパッチング |

**XOOPS 2.5.xモジュール**の場合、下記の[プリロードシステム](#preload-system-legacy)セクションを使用してください。PSR-14セクションはXOOPS 4.0開発用です。
:::

## 概要

XOOPSイベントシステムはオブザーバーパターンを通じて、モジュール間の疎結合を有効にします。コンポーネントはイベントを発行でき、システムの他の部分はそれをリッスンして対応できます。

## イベントタイプ

### コアイベント

| イベント | トリガーポイント |
|-------|---------------|
| `core.header.start` | ヘッダー処理前 |
| `core.header.end` | ヘッダー処理後 |
| `core.footer.start` | フッターレンダリング前 |
| `core.footer.end` | フッターレンダリング後 |
| `core.exception` | 例外発生時 |

### モジュールライフサイクルイベント

| イベント | トリガーポイント |
|-------|---------------|
| `module.install` | モジュールインストール後 |
| `module.update` | モジュール更新後 |
| `module.uninstall` | モジュール削除前 |
| `module.activate` | モジュール有効化時 |
| `module.deactivate` | モジュール無効化時 |

### ユーザーイベント

| イベント | トリガーポイント |
|-------|---------------|
| `user.login` | ログイン成功後 |
| `user.logout` | ログアウト後 |
| `user.register` | 登録後 |
| `user.delete` | ユーザー削除前 |

## プリロードシステム（レガシー）

### プリロードを作成

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // すべてのページのヘッダー前に実行
    }

    public function eventCoreFooterStart(array $args): void
    {
        // フッターがレンダリングされる前に実行
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // ログインイベントを処理
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // 例外をログまたは処理
    }
}
```

### イベントメソッド命名

```
event{Category}{Action}

例:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14イベントディスパッチャー（XOOPS 4.0）

### イベントクラス

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Event;

final class ArticleCreatedEvent
{
    public function __construct(
        public readonly int $articleId,
        public readonly int $authorId,
        public readonly string $title,
        public readonly \DateTimeImmutable $createdAt
    ) {}
}
```

### イベントをディスパッチ

```php
use Psr\EventDispatcher\EventDispatcherInterface;

final class ArticleService
{
    public function __construct(
        private readonly ArticleRepository $repository,
        private readonly EventDispatcherInterface $dispatcher
    ) {}

    public function create(CreateArticleDTO $dto): Article
    {
        $article = Article::create($dto);
        $this->repository->save($article);

        // イベントをディスパッチ
        $this->dispatcher->dispatch(new ArticleCreatedEvent(
            articleId: $article->getId(),
            authorId: $article->getAuthorId(),
            title: $article->getTitle(),
            createdAt: new \DateTimeImmutable()
        ));

        return $article;
    }
}
```

### イベントリスナー

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Listener;

use XoopsModules\MyModule\Event\ArticleCreatedEvent;

final class SendNotificationOnArticleCreated
{
    public function __construct(
        private readonly NotificationService $notifications
    ) {}

    public function __invoke(ArticleCreatedEvent $event): void
    {
        $this->notifications->notifySubscribers(
            'new_article',
            [
                'article_id' => $event->articleId,
                'title' => $event->title,
            ]
        );
    }
}
```

### リスナーを登録

```php
// config/events.php

return [
    ArticleCreatedEvent::class => [
        SendNotificationOnArticleCreated::class,
        UpdateSearchIndex::class,
        ClearArticleCache::class,
    ],

    ArticleUpdatedEvent::class => [
        UpdateSearchIndex::class,
        ClearArticleCache::class,
    ],

    ArticleDeletedEvent::class => [
        RemoveFromSearchIndex::class,
        ClearArticleCache::class,
    ],
];
```

## 停止可能なイベント

```php
use Psr\EventDispatcher\StoppableEventInterface;

final class ArticlePublishingEvent implements StoppableEventInterface
{
    private bool $propagationStopped = false;
    private ?string $rejectionReason = null;

    public function __construct(
        public readonly Article $article
    ) {}

    public function isPropagationStopped(): bool
    {
        return $this->propagationStopped;
    }

    public function reject(string $reason): void
    {
        $this->propagationStopped = true;
        $this->rejectionReason = $reason;
    }

    public function getRejectionReason(): ?string
    {
        return $this->rejectionReason;
    }
}

// リスナーは伝播を停止できます
final class ContentModerationListener
{
    public function __invoke(ArticlePublishingEvent $event): void
    {
        if ($this->containsProhibitedContent($event->article)) {
            $event->reject('Content violates community guidelines');
        }
    }
}
```

## ベストプラクティス

1. **不変なイベント** - イベントは読み取り専用である必要があります
2. **特定のイベント** - ジェネリックではなく、特定のイベントを作成
3. **可能なときは非同期** - 遅い操作にはキューを使用
4. **ディスパッチで副作用なし** - ディスパッチは高速である必要があります
5. **イベントを文書化** - モジュールユーザー用に利用可能なイベントをリスト

## 関連ドキュメント

- [Module-Development](../03-Module-Development/Module-Development.md) - モジュール開発
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14ガイド
- [Hooks-Events](Hooks-Events.md) - レガシーフック
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - イベント例
