---
title: "XOOPS מערכת אירועים"
---
<span class="version-badge version-25x">2.5.x: טעינות מוקדמות</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[לא בטוח באיזו מערכת אירועים להשתמש?]
ראה [בחירת מערכת אירועים](Choosing-Event-System.md) לעץ החלטות עם דוגמאות קוד עבור שתי הגישות.
:::

:::הערה[שתי מערכות אירועים ב-XOOPS]
| מערכת | גרסה | מקרה שימוש |
|--------|--------|--------|
| **מערכת טעינה מראש** | ✅ XOOPS 2.5.x (נוכחי) | היכנס לאירועי ליבה באמצעות `class/Preload.php` |
| **PSR-14 סדרן אירועים** | 🚧 XOOPS 4.0 (עתיד) | שיגור אירועים מודרני עם אירועים מודפסים |

**עבור XOOPS 2.5.x מודולים**, השתמש בסעיף [טעינה מראש](#preload-system-legacy) למטה. החלק PSR-14 מיועד לפיתוח XOOPS 4.0.
:::

## סקירה כללית

מערכת האירועים XOOPS מאפשרת צימוד רופף בין מודולים באמצעות דפוס צופה. רכיבים יכולים לפלוט אירועים שחלקים אחרים של המערכת יכולים להאזין להם ולהגיב אליהם.

## סוגי אירועים

### אירועי ליבה

| אירוע | נקודת טריגר |
|-------|--------------|
| `core.header.start` | לפני עיבוד כותרות |
| `core.header.end` | לאחר עיבוד כותרת |
| `core.footer.start` | לפני עיבוד כותרת תחתונה |
| `core.footer.end` | לאחר עיבוד כותרת תחתונה |
| `core.exception` | כאשר מתרחש חריג |

### אירועי מחזור חיים של מודול

| אירוע | נקודת טריגר |
|-------|--------------|
| `module.install` | לאחר התקנת מודול |
| `module.update` | לאחר עדכון המודול |
| `module.uninstall` | לפני הסרת מודול |
| `module.activate` | כאשר מודול מופעל |
| `module.deactivate` | כאשר מודול מושבת |

### אירועי משתמש

| אירוע | נקודת טריגר |
|-------|--------------|
| `user.login` | לאחר כניסה מוצלחת |
| `user.logout` | לאחר התנתקות |
| `user.register` | לאחר ההרשמה |
| `user.delete` | לפני מחיקת משתמש |

## מערכת טעינה מראש (מדור קודם)

### יצירת טעינה מוקדמת
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
### שם שיטת אירוע
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 משדר אירועים (XOOPS 4.0)

### שיעור אירועים
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
### שיגור אירועים
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
### מאזין אירועים
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
### רישום מאזינים
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
## אירועים שניתנים לעצירה
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
## שיטות עבודה מומלצות

1. **אירועים בלתי ניתנים לשינוי** - אירועים צריכים להיות לקריאה בלבד
2. **אירועים ספציפיים** - צור אירועים ספציפיים, לא כלליים
3. **אסינכרון כשאפשר** - השתמש בתורים לפעולות איטיות
4. **ללא תופעות לוואי במשלוח** - המשלוח צריך להיות מהיר
5. **אירועי מסמך** - רשימת אירועים זמינים עבור משתמשי מודול

## תיעוד קשור

- [פיתוח מודול](../03-Module-Development/Module-Development.md) - פיתוח מודול
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - מדריך PSR-14
- [Hooks-Events](Hooks-Events.md) - הוקס מדור קודם
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - דוגמאות לאירועים