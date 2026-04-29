---
title: “XOOPS事件系统”
---

<span class="version-badge version-25x">2.5.x：预加载</span> <span class="version-badge version-40x">4.0.x：PSR-14</span>

:::注意[不确定使用哪个事件系统？]
请参阅[Choosing an Event System](Choosing-Event-System.md)，了解决策树以及两种方法的代码示例。
:::

:::note[XOOPS中的两个事件系统]
|系统|版本 |使用案例|
|--------|---------|----------|
| **预载系统** | ✅ XOOPS 2.5.x（当前）|通过 `class/Preload.php` 关注核心事件 |
| **PSR-14 事件调度程序** | 🚧 XOOPS 4.0（未来）|使用类型化事件进行现代事件调度 |

**对于 XOOPS 2.5.x 模区块**，请使用下面的 [Preload System](#preload-system-legacy) 部分。 PSR-14 部分用于XOOPS 4.0 开发。
:::

## 概述

XOOPS事件系统通过观察者模式实现模区块之间的松散耦合。组件可以发出系统其他部分可以侦听和响应的事件。

## 事件类型

### 核心活动

|活动 |触发点|
|--------|----------------|
| `core.header.start` |标头处理之前 |
| `core.header.end` |标头处理后 |
| `core.footer.start` |页脚渲染之前 |
| `core.footer.end` |页脚渲染后 |
| `core.exception`|发生异常时 |

### 模区块生命周期事件

|活动 |触发点|
|--------|----------------|
| `module.install` |模区块安装后 |
| `module.update`|模区块更新后 |
| `module.uninstall`|模区块移除前 |
| `module.activate` |当模区块激活时 |
| `module.deactivate` |当模区块停用时 |

### 用户事件

|活动 |触发点|
|--------|----------------|
| `user.login` |登录成功后 |
| `user.logout` |注销后 |
| `user.register` |注册后|
| `user.delete` |用户删除之前 |

## 预加载系统（旧版）

### 创建预载

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Runs on every page before header
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Runs before footer renders
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Handle login event
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Log or handle exception
    }
}
```

### 事件方法命名

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 事件调度程序 (XOOPS 4.0)

### 事件类

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

### 调度事件

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

        // Dispatch event
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

### 事件监听器

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

### 注册监听器

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

## 可停止的事件

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

// Listener can stop propagation
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

## 最佳实践

1. **不可变事件** - 事件应阅读-only
2. **特定事件** - 创建特定事件，而不是通用事件
3. **尽可能异步** - 使用队列进行慢速操作
4. **调度无副作用** - 调度应该很快
5. **文档事件** - 列出模区块用户可用的事件

## 相关文档

- [Module-Development](../03-Module-Development/Module-Development.md) - 模区块开发
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 指南
- [Hooks-Events](Hooks-Events.md) - 旧版挂钩
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - 事件示例