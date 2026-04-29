---
title: "XOOPS ระบบเหตุการณ์"
---
<span class="version-badge version-25x">2.5.x: โหลดล่วงหน้า</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[ไม่แน่ใจว่าจะใช้ระบบกิจกรรมใด?]
ดู [การเลือกระบบเหตุการณ์](Choosing-Event-System.md) สำหรับแผนผังการตัดสินใจพร้อมตัวอย่างโค้ดสำหรับทั้งสองวิธี
::::::

:::note[สองระบบเหตุการณ์ใน XOOPS]
| ระบบ | เวอร์ชั่น | ใช้กรณี |
|--------|---------|----------|
| **ระบบพรีโหลด** | ✅ XOOPS 2.5.x (ปัจจุบัน) | ติดตามกิจกรรมหลักผ่านทาง `class/Preload.php` |
| **PSR-14 ผู้จัดส่งกิจกรรม** | 🚧 XOOPS 4.0 (อนาคต) | งานอีเว้นท์สมัยใหม่พร้อมงานพิมพ์ |

**สำหรับโมดูล XOOPS 2.5.x** ให้ใช้ส่วน [ระบบโหลดล่วงหน้า](#preload-system-legacy) ด้านล่าง ส่วน PSR-14 มีไว้สำหรับการพัฒนา XOOPS 4.0
::::::

## ภาพรวม

ระบบเหตุการณ์ XOOPS ช่วยให้การเชื่อมต่อแบบหลวมๆ ระหว่างโมดูลผ่านรูปแบบผู้สังเกตการณ์ ส่วนประกอบสามารถปล่อยเหตุการณ์ที่ส่วนอื่นๆ ของระบบสามารถรับฟังและตอบสนองได้

## ประเภทกิจกรรม

### เหตุการณ์หลัก

| เหตุการณ์ | จุดกระตุ้น |
|-------|---------------|
| `core.header.start` | ก่อนการประมวลผลส่วนหัว |
| `core.header.end` | หลังจากการประมวลผลส่วนหัว |
| `core.footer.start` | ก่อนที่จะเรนเดอร์ส่วนท้าย |
| `core.footer.end` | หลังจากการเรนเดอร์ส่วนท้าย |
| `core.exception` | เมื่อเกิดข้อยกเว้น |

### เหตุการณ์วงจรชีวิตของโมดูล

| เหตุการณ์ | จุดกระตุ้น |
|-------|---------------|
| `module.install` | หลังการติดตั้งโมดูล |
| `module.update` | หลังจากอัพเดตโมดูล |
| `module.uninstall` | ก่อนการลบโมดูล |
| `module.activate` | เมื่อเปิดใช้งานโมดูล |
| `module.deactivate` | เมื่อปิดการใช้งานโมดูล |

### เหตุการณ์ของผู้ใช้

| เหตุการณ์ | จุดกระตุ้น |
|-------|---------------|
| `user.login` | หลังจากเข้าสู่ระบบสำเร็จ |
| `user.logout` | หลังจากออกจากระบบ |
| `user.register` | หลังจากลงทะเบียน |
| `user.delete` | ก่อนการลบผู้ใช้ |

## ระบบพรีโหลด (รุ่นเก่า)

### กำลังสร้างพรีโหลด
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
### การตั้งชื่อวิธีการเหตุการณ์
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 ผู้จัดส่งกิจกรรม (XOOPS 4.0)

### คลาสอีเว้นท์
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
### กิจกรรมจัดส่ง
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
### ผู้ฟังเหตุการณ์
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
### ลงทะเบียนผู้ฟัง
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
## เหตุการณ์ที่หยุดได้
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **เหตุการณ์ที่ไม่เปลี่ยนรูป** - กิจกรรมควรเป็นแบบอ่านอย่างเดียว
2. **กิจกรรมเฉพาะ** - สร้างกิจกรรมเฉพาะ ไม่ใช่กิจกรรมทั่วไป
3. **Async เมื่อเป็นไปได้** - ใช้คิวสำหรับการดำเนินการที่ช้า
4. **ไม่มีผลข้างเคียงในการจัดส่ง** - การจัดส่งควรจะรวดเร็ว
5. **เหตุการณ์เอกสาร** - แสดงรายการเหตุการณ์ที่มีอยู่สำหรับผู้ใช้โมดูล

## เอกสารที่เกี่ยวข้อง

- [โมดูล-การพัฒนา](../03-Module-Development/Module-Development.md) - การพัฒนาโมดูล
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 คู่มือ
- [ตะขอ-กิจกรรม](Hooks-Events.md) - ตะขอแบบเดิม
- [กิจกรรมและตะขอ](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - ตัวอย่างกิจกรรม