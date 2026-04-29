---
title: "Sistem Acara XOOPS"
---

<span class="version-badge version-25x">2.5.x: Pramuat</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Tidak yakin sistem acara mana yang akan digunakan?]
Lihat [Memilih Sistem Acara](Choosing-Event-System.md) untuk pohon keputusan dengan contoh kode untuk kedua pendekatan.
:::

:::catatan[Dua Sistem Acara di XOOPS]
| Sistem | Versi | Kasus Penggunaan |
|--------|---------|----------|
| **Sistem Pramuat** | ✅ XOOPS 2.5.x (saat ini) | Ikuti acara core melalui `class/Preload.php` |
| **Pengirim Acara PSR-14** | 🚧 XOOPS 4.0 (masa depan) | Pengiriman acara modern dengan acara yang diketik |

**Untuk module XOOPS 2.5.x**, gunakan bagian [Sistem Pramuat](#preload-system-legacy) di bawah. Bagian PSR-14 ditujukan untuk pengembangan XOOPS 4.0.
:::

## Ikhtisar

Sistem peristiwa XOOPS memungkinkan penggabungan longgar antar module melalui pola pengamat. Komponen dapat memancarkan peristiwa yang dapat didengar dan ditanggapi oleh bagian lain dari sistem.

## Jenis Acara

### Acara core

| Acara | Titik Pemicu |
|-------|---------------|
| `core.header.start` | Sebelum pemrosesan header |
| `core.header.end` | Setelah pemrosesan tajuk |
| `core.footer.start` | Sebelum rendering footer |
| `core.footer.end` | Setelah rendering footer |
| `core.exception` | Ketika pengecualian terjadi |

### Peristiwa Daur Hidup module

| Acara | Titik Pemicu |
|-------|---------------|
| `module.install` | Setelah instalasi module |
| `module.update` | Setelah pembaruan module |
| `module.uninstall` | Sebelum penghapusan module |
| `module.activate` | Ketika module diaktifkan |
| `module.deactivate` | Ketika module dinonaktifkan |

### Acara Pengguna

| Acara | Titik Pemicu |
|-------|---------------|
| `user.login` | Setelah berhasil login |
| `user.logout` | Setelah keluar |
| `user.register` | Setelah registrasi |
| `user.delete` | Sebelum penghapusan pengguna |

## Sistem Pramuat (Warisan)

### Membuat Pramuat

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

### Penamaan Metode Peristiwa

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Pengirim Acara (XOOPS 4.0)

### Kelas Acara

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

### Acara Pengiriman

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

### Pendengar Acara

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

### Mendaftarkan Pendengar

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

## Acara yang Dapat Dihentikan

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

## Praktik Terbaik

1. **Peristiwa yang Tidak Dapat Diubah** - Acara harus bersifat hanya-baca
2. **Acara Spesifik** - Buat acara spesifik, bukan acara umum
3. **Async Bila Memungkinkan** - Gunakan antrean untuk operasi yang lambat
4. **Tidak Ada Efek Samping dalam Pengiriman** - Pengiriman harus cepat
5. **Dokumen Acara** - Daftar acara yang tersedia untuk pengguna module

## Dokumentasi Terkait

- [Pengembangan module](../03-Module-Development/Module-Development.md) - Pengembangan module
- [Panduan Sistem Acara](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Panduan PSR-14
- [Acara Kait](Hooks-Events.md) - Kait lama
- [Event-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Contoh event
