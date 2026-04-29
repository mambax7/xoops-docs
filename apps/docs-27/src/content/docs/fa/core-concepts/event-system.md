---
title: "سیستم رویداد XOOPS"
---
<span class="version-badge version-25x">2.5.x: پیش‌بارگیری‌ها</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[مطمئن نیستید از کدام سیستم رویداد استفاده کنید؟]
[انتخاب یک سیستم رویداد](Choosing-Event-System.md) را برای درخت تصمیم با مثال‌های کد برای هر دو رویکرد ببینید.
:::

:::note [دو سیستم رویداد در XOOPS]
| سیستم | نسخه | مورد استفاده |
|--------|---------|----------|
| **سیستم پیش بارگیری** | ✅ XOOPS 2.5.x (جاری) | از طریق `class/Preload.php` به رویدادهای اصلی متصل شوید
| ** PSR-14 Event Dispatcher ** | 🚧 XOOPS 4.0 (آینده) | اعزام رویداد مدرن با رویدادهای تایپ شده |

**برای ماژول های XOOPS 2.5.x**، از بخش [Preload System](#preload-system-legacy) در زیر استفاده کنید. بخش PSR-14 برای توسعه XOOPS 4.0 است.
:::

## بررسی اجمالی

سیستم رویداد XOOPS اتصال آزاد بین ماژول ها را از طریق یک الگوی مشاهده گر امکان پذیر می کند. کامپوننت ها می توانند رویدادهایی را منتشر کنند که سایر بخش های سیستم می توانند به آنها گوش دهند و به آنها پاسخ دهند.

## انواع رویداد

### رویدادهای اصلی

| رویداد | نقطه ماشه |
|-------|---------------|
| `core.header.start` | قبل از پردازش هدر |
| `core.header.end` | پس از پردازش هدر |
| `core.footer.start` | قبل از رندر پاورقی |
| `core.footer.end` | پس از رندر پاورقی |
| `core.exception` | وقتی استثنا رخ می دهد |

### رویدادهای چرخه زندگی ماژول

| رویداد | نقطه ماشه |
|-------|---------------|
| `module.install` | بعد از نصب ماژول |
| `module.update` | پس از به روز رسانی ماژول |
| `module.uninstall` | قبل از حذف ماژول |
| `module.activate` | وقتی ماژول فعال شد |
| `module.deactivate` | وقتی ماژول غیرفعال شد |

### رویدادهای کاربر

| رویداد | نقطه ماشه |
|-------|---------------|
| `user.login` | پس از ورود موفق |
| `user.logout` | پس از خروج |
| `user.register` | پس از ثبت نام |
| `user.delete` | قبل از حذف کاربر |

## سیستم پیش بارگیری (قدیمی)

### ایجاد پیش بارگذاری

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use XMF\Module\Helper\AbstractHelper;

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

### نامگذاری روش رویداد

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Event Dispatcher (XOOPS 4.0)

### کلاس رویداد

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

### اعزام رویدادها

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

### شنونده رویداد

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

### ثبت شنوندگان

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

## رویدادهای قابل توقف

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

## بهترین شیوه ها

1. **رویدادهای تغییرناپذیر** - رویدادها باید فقط خواندنی باشند
2. **رویدادهای خاص** - رویدادهای خاص را ایجاد کنید، نه عمومی
3. **Async When Possible** - از صف ها برای عملیات کند استفاده کنید
4. **بدون عوارض جانبی در ارسال ** - ارسال باید سریع باشد
5. ** رویدادهای سند ** - لیست رویدادهای موجود برای کاربران ماژول

## مستندات مرتبط

- [توسعه ماژول](../03-Module-Development/Module-Development.md) - توسعه ماژول
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - راهنمای PSR-14
- [Hoks-Events](Hooks-Events.md) - قلاب های قدیمی
- [رویدادها و قلاب‌ها](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - نمونه‌های رویداد