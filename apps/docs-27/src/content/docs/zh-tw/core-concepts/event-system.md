---
title: "XOOPS 事件系統"
---

<span class="version-badge version-25x">2.5.x: 預加載</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[不確定使用哪個事件系統？]
請參閱 [選擇事件系統](Choosing-Event-System.md)，以獲得決策樹和兩種方法的程式碼示例。
:::

:::note[XOOPS 中的兩個事件系統]
| 系統 | 版本 | 用例 |
|------|------|------|
| **預加載系統** | ✅ XOOPS 2.5.x (當前) | 透過 `class/Preload.php` 掛接核心事件 |
| **PSR-14 事件發派器** | 🚧 XOOPS 4.0 (未來) | 具有輸入事件的現代事件發派 |

**對於 XOOPS 2.5.x 模組**，請使用下面的 [預加載系統 (舊版)](#preload-system-legacy) 部分。PSR-14 部分適用於 XOOPS 4.0 開發。
:::

## 概述

XOOPS 事件系統透過觀察者模式實現模組之間的鬆散耦合。元件可以發出其他部分系統可以偵聽和回應的事件。

## 事件類型

### 核心事件

| 事件 | 觸發點 |
|------|--------|
| `core.header.start` | 頁首處理前 |
| `core.header.end` | 頁首處理後 |
| `core.footer.start` | 頁尾呈現前 |
| `core.footer.end` | 頁尾呈現後 |
| `core.exception` | 發生異常時 |

### 模組生命週期事件

| 事件 | 觸發點 |
|------|--------|
| `module.install` | 模組安裝後 |
| `module.update` | 模組更新後 |
| `module.uninstall` | 模組移除前 |
| `module.activate` | 啟用模組時 |
| `module.deactivate` | 停用模組時 |

### 使用者事件

| 事件 | 觸發點 |
|------|--------|
| `user.login` | 成功登錄後 |
| `user.logout` | 登出後 |
| `user.register` | 註冊後 |
| `user.delete` | 使用者刪除前 |

## 預加載系統 (舊版)

### 建立預加載

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // 在每個頁面的頁首前執行
    }

    public function eventCoreFooterStart(array $args): void
    {
        // 在頁尾呈現前執行
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // 處理登錄事件
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // 記錄或處理異常
    }
}
```

### 事件方法命名

```
event{Category}{Action}

示例：
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 事件發派器 (XOOPS 4.0)

### 事件類別

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

### 發派事件

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

        // 發派事件
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

### 事件偵聽器

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

### 登錄偵聽器

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

## 可停止事件

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

// 偵聽器可以停止傳播
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

## 最佳實踐

1. **不可變事件** - 事件應該是唯讀的
2. **特定事件** - 建立特定事件，而不是通用事件
3. **盡可能非同步** - 使用佇列進行緩慢操作
4. **發派中無副作用** - 發派應該很快
5. **記錄事件** - 為模組使用者列出可用事件

## 相關文檔

- [模組開發](../03-Module-Development/Module-Development.md) - 模組開發
- [事件系統指南](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 指南
- [掛鉤-事件](Hooks-Events.md) - 舊版掛鉤
- [事件和掛鉤](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - 事件示例
