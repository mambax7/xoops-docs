---
title: "Sistem Acara XOOPS"
---
<span class="version-badge version-25x">2.5.x: Pramuat</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>:::nota[Tidak pasti sistem acara mana yang hendak digunakan?]
Lihat [Memilih Sistem Acara](Choosing-Event-System.md) untuk pepohon keputusan dengan contoh kod untuk kedua-dua pendekatan.
::::::note[Dua Sistem Acara dalam XOOPS]
| Sistem | Versi | Kes Penggunaan |
|--------|---------|----------|
| **Sistem Pramuat** | ✅ XOOPS 2.5.x (semasa) | Sambung ke acara teras melalui `class/Preload.php` |
| **Penghantar Acara PSR-14** | 🚧 XOOPS 4.0 (masa hadapan) | Penghantaran acara moden dengan acara ditaip |**Untuk modul XOOPS 2.5.x**, gunakan bahagian [Sistem Pramuat](#preload-system-legacy) di bawah. Bahagian PSR-14 adalah untuk pembangunan XOOPS 4.0.
:::## Gambaran KeseluruhanSistem acara XOOPS membolehkan gandingan longgar antara modul melalui corak pemerhati. Komponen boleh memancarkan peristiwa yang bahagian lain sistem boleh mendengar dan bertindak balas.## Jenis Acara### Acara Teras| Acara | Titik Pencetus |
|-------|----------------|
| `core.header.start` | Sebelum pemprosesan tajuk |
| `core.header.end` | Selepas pemprosesan tajuk |
| `core.footer.start` | Sebelum pemaparan pengaki |
| `core.footer.end` | Selepas pemaparan pengaki |
| `core.exception` | Apabila pengecualian berlaku |### Peristiwa Kitar Hayat Modul| Acara | Titik Pencetus |
|-------|----------------|
| `module.install` | Selepas pemasangan modul |
| `module.update` | Selepas kemas kini modul |
| `module.uninstall` | Sebelum penyingkiran modul |
| `module.activate` | Apabila modul diaktifkan |
| `module.deactivate` | Apabila modul dinyahaktifkan |### Acara Pengguna| Acara | Titik Pencetus |
|-------|----------------|
| `user.login` | Selepas berjaya log masuk |
| `user.logout` | Selepas log keluar |
| `user.register` | Selepas pendaftaran |
| `user.delete` | Sebelum pemadaman pengguna |## Sistem Pramuat (Legasi)### Mencipta Pramuat
```
php
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
### Penamaan Kaedah Acara
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 Penghantar Acara (XOOPS 4.0)### Kelas Acara
```
php
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
### Menghantar Acara
```
php
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
```
php
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
### Mendaftar Pendengar
```
php
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
## Peristiwa Boleh Hentikan
```
php
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
## Amalan Terbaik1. **Peristiwa Tidak Berubah** - Acara hendaklah dibaca sahaja
2. **Acara Khusus** - Buat acara khusus, bukan acara generik
3. **Async When Possible** - Gunakan baris gilir untuk operasi perlahan
4. **Tiada Kesan Sampingan dalam Dispatch** - Penghantaran hendaklah cepat
5. **Acara Dokumen** - Senaraikan acara yang tersedia untuk pengguna modul## Dokumentasi Berkaitan- [Pembangunan Modul](../03-Module-Development/Module-Development.md) - Pembangunan modul
- [Panduan-Sistem-Acara](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Panduan PSR-14
- [Hooks-Events](Hooks-Events.md) - Cangkuk warisan
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Contoh acara