---
title: "XOOPS-gebeurtenissysteem"
---
<span class="version-badge versie-25x">2.5.x: vooraf geladen</span> <span class="version-badge versie-40x">4.0.x: PSR-14</span>

:::note[Weet u niet zeker welk evenementensysteem u moet gebruiken?]
Zie [Een gebeurtenissysteem kiezen](Choosing-Event-System.md) voor een beslissingsboom met codevoorbeelden voor beide benaderingen.
:::

:::note[Twee gebeurtenissystemen in XOOPS]
| Systeem | Versie | Gebruiksscenario |
|--------|---------|----------|
| **Voorlaadsysteem** | ✅ XOOPS 2.5.x (huidig) | Sluit u aan bij kerngebeurtenissen via `class/Preload.php` |
| **PSR-14 Gebeurtenisverzender** | 🚧 XOOPS 4.0 (toekomstig) | Moderne evenementenverzending met getypte evenementen |

**Voor XOOPS 2.5.x-modules** gebruikt u het onderstaande gedeelte [Voorlaadsysteem](#preload-system-legacy). De sectie PSR-14 is bedoeld voor de ontwikkeling van XOOPS 4.0.
:::

## Overzicht

Het XOOPS-gebeurtenissysteem maakt losse koppeling tussen modules mogelijk via een waarnemerspatroon. Componenten kunnen gebeurtenissen uitzenden waar andere delen van het systeem naar kunnen luisteren en waarop ze kunnen reageren.

## Gebeurtenistypen

### Kerngebeurtenissen

| Evenement | Triggerpunt |
|-------|---------------|
| `core.header.start` | Vóór headerverwerking |
| `core.header.end` | Na headerverwerking |
| `core.footer.start` | Vóór weergave van de voettekst |
| `core.footer.end` | Na weergave van de voettekst |
| `core.exception` | Wanneer er een uitzondering optreedt |

### Modulelevenscyclusgebeurtenissen

| Evenement | Triggerpunt |
|-------|---------------|
| `module.install` | Na module-installatie |
| `module.update` | Na module-update |
| `module.uninstall` | Vóór verwijdering van de module |
| `module.activate` | Wanneer module geactiveerd |
| `module.deactivate` | Wanneer module gedeactiveerd |

### Gebruikersgebeurtenissen

| Evenement | Triggerpunt |
|-------|---------------|
| `user.login` | Na succesvol inloggen |
| `user.logout` | Na uitloggen |
| `user.register` | Na registratie |
| `user.delete` | Voordat de gebruiker wordt verwijderd |

## Preload-systeem (verouderd)

### Een voorlading maken

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

### Naamgeving van gebeurtenismethode

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Gebeurtenisverzender (XOOPS 4.0)

### Evenementklasse

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

### Verzendevenementen

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

### Gebeurtenisluisteraar

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

### Luisteraars registreren

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

## Stopbare gebeurtenissen

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

## Beste praktijken

1. **Onveranderlijke gebeurtenissen** - Gebeurtenissen moeten alleen-lezen zijn
2. **Specifieke evenementen** - Creëer specifieke evenementen, geen generieke evenementen
3. **Async indien mogelijk** - Gebruik wachtrijen voor langzame bewerkingen
4. **Geen bijwerkingen bij verzending** - Verzending moet snel zijn
5. **Documentgebeurtenissen** - Lijst met beschikbare gebeurtenissen voor modulegebruikers

## Gerelateerde documentatie

- [Module-ontwikkeling](../03-Module-Development/Module-Development.md) - Module-ontwikkeling
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 gids
- [Haken-evenementen](Hooks-Events.md) - Legacy-haken
- [Evenementen-en-haken](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Voorbeelden van evenementen