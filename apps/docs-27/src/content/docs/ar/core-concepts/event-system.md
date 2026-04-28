---
title: "نظام الأحداث في XOOPS"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[غير متأكد من نظام الأحداث المراد استخدامه؟]
انظر [اختيار نظام الأحداث](Choosing-Event-System.md) لشجرة القرار مع أمثلة على الأكواد لكلا النهجين.
:::

:::note[نظامان للأحداث في XOOPS]
| النظام | الإصدار | حالة الاستخدام |
|--------|---------|----------|
| **نظام Preload** | ✅ XOOPS 2.5.x (الحالي) | الربط بأحداث النظام الأساسي عبر `class/Preload.php` |
| **موزع الأحداث PSR-14** | 🚧 XOOPS 4.0 (المستقبل) | توزيع الأحداث الحديث مع الأحداث المكتوبة |

**لمودولات XOOPS 2.5.x**، استخدم قسم [نظام Preload](#preload-system-legacy) أدناه. قسم PSR-14 مخصص لتطوير XOOPS 4.0.
:::

## نظرة عامة

يمكّن نظام الأحداث في XOOPS من الفصل الضعيف بين المودولات من خلال نمط المراقب. يمكن للمكونات إصدار أحداث يمكن لأجزاء أخرى من النظام الاستماع إليها والاستجابة لها.

## أنواع الأحداث

### أحداث النظام الأساسي

| الحدث | نقطة التشغيل |
|-------|---------------|
| `core.header.start` | قبل معالجة الرأس |
| `core.header.end` | بعد معالجة الرأس |
| `core.footer.start` | قبل عرض التذييل |
| `core.footer.end` | بعد عرض التذييل |
| `core.exception` | عند حدوث استثناء |

### أحداث دورة حياة المودول

| الحدث | نقطة التشغيل |
|-------|---------------|
| `module.install` | بعد تثبيت المودول |
| `module.update` | بعد تحديث المودول |
| `module.uninstall` | قبل إزالة المودول |
| `module.activate` | عند تفعيل المودول |
| `module.deactivate` | عند تعطيل المودول |

### أحداث المستخدم

| الحدث | نقطة التشغيل |
|-------|---------------|
| `user.login` | بعد تسجيل الدخول بنجاح |
| `user.logout` | بعد تسجيل الخروج |
| `user.register` | بعد التسجيل |
| `user.delete` | قبل حذف المستخدم |

## نظام Preload (قديم)

### إنشاء Preload

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

### تسمية دوال الأحداث

```
event{Category}{Action}

أمثلة:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## موزع الأحداث PSR-14 (XOOPS 4.0)

### فئة الحدث

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

### توزيع الأحداث

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

### مستمع الحدث

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

### تسجيل المستمعين

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

## أحداث قابلة للإيقاف

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

## أفضل الممارسات

1. **الأحداث غير القابلة للتغيير** - يجب أن تكون الأحداث قراءة فقط
2. **أحداث محددة** - أنشئ أحداث محددة وليس عامة
3. **غير متزامن عند الإمكان** - استخدم الطوابير للعمليات البطيئة
4. **لا توجد تأثيرات جانبية في التوزيع** - يجب أن يكون التوزيع سريعاً
5. **توثيق الأحداث** - اذكر الأحداث المتاحة لمستخدمي المودول

## الوثائق ذات الصلة

- [Module-Development](../03-Module-Development/Module-Development.md) - تطوير المودول
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - دليل PSR-14
- [Hooks-Events](Hooks-Events.md) - الخطافات القديمة
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - أمثلة الأحداث
