---
title: "XOOPS sustav događaja"
---
<span class="version-badge version-25x">2.5.x: Predučitavanja</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Niste sigurni koji sustav događaja koristiti?]
Pogledajte [Odabir sustava događaja](Choosing-Event-System.md) za stablo odlučivanja s primjerima kodova za oba pristupa.
:::

:::napomena[Dva sustava događaja u XOOPS]
| Sustav | Verzija | Slučaj upotrebe |
|--------|---------|----------|
| **Sustav predopterećenja** | ✅ XOOPS 2.5.x (trenutačno) | Priključite se na ključne događaje putem `class/Preload.php` |
| **PSR-14 Dispečer događaja** | 🚧 XOOPS 4.0 (buduće) | Moderno otpremanje događaja s tipiziranim događajima |

**Za XOOPS 2.5.x modules** koristite odjeljak [Sustav predučitavanja](#preload-system-legacy) u nastavku. Odjeljak PSR-14 je za razvoj XOOPS 4.0.
:::

## Pregled

Sustav događaja XOOPS omogućuje labavu vezu između modules kroz uzorak promatrača. Komponente mogu emitirati događaje koje drugi dijelovi sustava mogu slušati i odgovoriti na njih.

## Vrste događaja

### Osnovni događaji

| Događaj | Točka okidanja |
|-------|--------------|
| `core.header.start` | Prije obrade zaglavlja |
| `core.header.end` | Nakon obrade zaglavlja |
| `core.footer.start` | Prije prikazivanja podnožja |
| `core.footer.end` | Nakon renderiranja podnožja |
| `core.exception` | Kada se dogodi iznimka |

### Događaji životnog ciklusa modula

| Događaj | Točka okidanja |
|-------|--------------|
| `module.install` | Nakon instalacije modula |
| `module.update` | Nakon ažuriranja modula |
| `module.uninstall` | Prije uklanjanja modula |
| `module.activate` | Kada je modul aktiviran |
| `module.deactivate` | Kada je modul deaktiviran |

### Korisnički događaji

| Događaj | Točka okidanja |
|-------|--------------|
| `user.login` | Nakon uspješne prijave |
| `user.logout` | Nakon odjave |
| `user.register` | Nakon registracije |
| `user.delete` | Prije brisanja korisnika |

## Sustav prethodnog učitavanja (naslijeđeno)

### Stvaranje predučitavanja

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

### Imenovanje metode događaja

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Dispečer događaja (XOOPS 4.0)

### Klasa događaja

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

### Slanje događaja

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

### Slušatelj događaja

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

### Registracija slušatelja

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

## Događaji koji se mogu zaustaviti

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

## Najbolji primjeri iz prakse

1. **Nepromjenjivi događaji** - Događaji bi trebali biti samo za čitanje
2. **Specifični događaji** - Stvorite specifične događaje, a ne generičke
3. **Async When Possible** - Koristite redove za spore operacije
4. **Nema nuspojava u otpremi** - otprema bi trebala biti brza
5. **Dokumentiraj događaje** - Popis dostupnih događaja za korisnike modula

## Povezana dokumentacija

- [Razvoj modula](../03-Module-Development/Module-Development.md) - Razvoj modula
- [Vodič za sustav događaja](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 vodič
- [Udice-događaji](Hooks-Events.md) - Naslijeđene udice
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Primjeri događaja
