---
title: "Hệ thống sự kiện XOOPS"
---
<span class="version-badge version-25x">2.5.x: Tải trước</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Không chắc nên sử dụng hệ thống sự kiện nào?]
Xem [Chọn hệ thống sự kiện](Choosing-Event-System.md) để biết cây quyết định với các ví dụ về mã cho cả hai phương pháp.
:::

:::note[Hai hệ thống sự kiện trong XOOPS]
| Hệ thống | Phiên bản | Trường hợp sử dụng |
|--------|----------|----------|
| **Hệ thống tải trước** | ✅ XOOPS 2.5.x (hiện tại) | Tham gia các sự kiện cốt lõi thông qua `class/Preload.php` |
| **Bộ điều phối sự kiện PSR-14** | 🚧 XOOPS 4.0 (tương lai) | Gửi sự kiện hiện đại với các sự kiện đã nhập |

**Đối với XOOPS 2.5.x modules**, hãy sử dụng phần [Hệ thống tải trước](#preload-system-legacy) bên dưới. Phần PSR-14 dành cho phát triển XOOPS 4.0.
:::

## Tổng quan

Hệ thống sự kiện XOOPS cho phép ghép nối lỏng lẻo giữa modules thông qua mẫu quan sát. Các thành phần có thể phát ra các sự kiện mà các phần khác của hệ thống có thể lắng nghe và phản hồi.

## Loại sự kiện

### Sự kiện cốt lõi

| Sự kiện | Điểm kích hoạt |
|-------|--------------|
| `core.header.start` | Trước khi xử lý tiêu đề |
| `core.header.end` | Sau khi xử lý tiêu đề |
| `core.footer.start` | Trước khi hiển thị chân trang |
| `core.footer.end` | Sau khi hiển thị chân trang |
| `core.exception` | Khi ngoại lệ xảy ra |

### Sự kiện vòng đời mô-đun

| Sự kiện | Điểm kích hoạt |
|-------|--------------|
| `module.install` | Sau khi cài đặt mô-đun |
| `module.update` | Sau khi cập nhật mô-đun |
| `module.uninstall` | Trước khi gỡ bỏ mô-đun |
| `module.activate` | Khi mô-đun được kích hoạt |
| `module.deactivate` | Khi mô-đun ngừng hoạt động |

### Sự kiện của người dùng

| Sự kiện | Điểm kích hoạt |
|-------|--------------|
| `user.login` | Sau khi đăng nhập thành công |
| `user.logout` | Sau khi đăng xuất |
| `user.register` | Sau khi đăng ký |
| `user.delete` | Trước khi xóa người dùng |

## Hệ thống tải trước (Cũ)

### Tạo bản tải trước

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

### Đặt tên phương thức sự kiện

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Bộ điều phối sự kiện PSR-14 (XOOPS 4.0)

### Lớp sự kiện

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

### Sự kiện gửi đi

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

### Trình xử lý sự kiện

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

### Đăng ký người nghe

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

## Sự kiện có thể dừng lại

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

## Các phương pháp hay nhất

1. **Sự kiện bất biến** - Sự kiện chỉ được đọc
2. **Sự kiện cụ thể** - Tạo sự kiện cụ thể, không tạo sự kiện chung chung
3. **Không đồng bộ khi có thể** - Sử dụng hàng đợi cho các hoạt động chậm
4. **Không có tác dụng phụ khi gửi hàng** - Việc gửi hàng phải nhanh chóng
5. **Sự kiện tài liệu** - Liệt kê các sự kiện có sẵn cho người dùng mô-đun

## Tài liệu liên quan

- [Phát triển mô-đun](../03-Module-Development/Module-Development.md) - Phát triển mô-đun
- [Hướng dẫn hệ thống sự kiện](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Hướng dẫn PSR-14
- [Hooks-Events](Hooks-Events.md) - Móc kế thừa
- [Sự kiện và móc câu](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Ví dụ về sự kiện