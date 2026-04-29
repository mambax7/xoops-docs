---
title: "XOOPS Etkinlik Sistemi"
---
<span class="version-badge version-25x">2.5.x: Ön yüklemeler</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Hangi etkinlik sistemini kullanacağınızdan emin değil misiniz?]
Her iki yaklaşıma yönelik kod örnekleri içeren bir karar ağacı için [Olay Sistemi Seçme](Choosing-Event-System.md) konusuna bakın.
:::

:::note[XOOPS'da İki Etkinlik Sistemi]
| Sistem | Sürüm | Kullanım Örneği |
|-----------|------------|----------|
| **Ön Yükleme Sistemi** | ✅ XOOPS 2.5.x (güncel) | `class/Preload.php` aracılığıyla temel etkinliklere bağlanın |
| **PSR-14 Olay Dağıtıcı** | 🚧 XOOPS 4.0 (gelecek) | Yazılı olaylarla modern olay gönderimi |

**XOOPS 2.5.x modülleri** için aşağıdaki [Ön Yükleme Sistemi](#preload-system-legacy) bölümünü kullanın. PSR-14 bölümü XOOPS 4.0 geliştirmesi içindir.
:::

## Genel Bakış

XOOPS olay sistemi, bir gözlemci modeli aracılığıyla modules arasında gevşek bağlantıya olanak tanır. Bileşenler, sistemin diğer bölümlerinin dinleyebileceği ve yanıt verebileceği events yayabilir.

## Etkinlik Türleri

### Temel Etkinlikler

| Etkinlik | Tetik Noktası |
|----------|---------------|
| `core.header.start` | Başlık işlemeden önce |
| `core.header.end` | Başlık işlendikten sonra |
| `core.footer.start` | Altbilgi oluşturmadan önce |
| `core.footer.end` | Altbilgi oluşturma işleminden sonra |
| `core.exception` | İstisna oluştuğunda |

### module Yaşam Döngüsü Olayları

| Etkinlik | Tetik Noktası |
|----------|---------------|
| `module.install` | module kurulumundan sonra |
| `module.update` | module güncellemesinden sonra |
| `module.uninstall` | Modülün çıkarılmasından önce |
| `module.activate` | module etkinleştirildiğinde |
| `module.deactivate` | module devre dışı bırakıldığında |

### user Etkinlikleri

| Etkinlik | Tetik Noktası |
|----------|---------------|
| `user.login` | Başarılı oturum açtıktan sonra |
| `user.logout` | Oturumu kapattıktan sonra |
| `user.register` | Kayıt olduktan sonra |
| `user.delete` | Kullanıcıyı silmeden önce |

## Ön Yükleme Sistemi (Eski)

### Ön Yükleme Oluşturma
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
### Olay Yöntemi Adlandırma
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 Olay Dağıtıcısı (XOOPS 4.0)

### Etkinlik Sınıfı
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
### Olayları Gönderme
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
### Etkinlik İşleyici
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
### Dinleyicileri Kaydetme
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
## Durdurulabilir events
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
## En İyi Uygulamalar

1. **Değişmez Etkinlikler** - Etkinlikler salt okunur olmalıdır
2. **Belirli Etkinlikler** - Genel etkinlikler değil, belirli etkinlikler oluşturun
3. **Mümkün Olduğunda Eşzamansız** - Yavaş işlemler için kuyrukları kullanın
4. **Gönderimde Yan Etki Olmaz** - Gönderim hızlı olmalıdır
5. **Belge Olayları** - module kullanıcıları için mevcut etkinlikleri listeleyin

## İlgili Belgeler

- [module-Geliştirme](../03-Module-Development/Module-Development.md) - module geliştirme
- [Olay-Sistem-Kılavuzu](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 kılavuzu
- [Hook-Events](Hooks-Events.md) - Eski hooks
- [events ve hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Etkinlik örnekleri