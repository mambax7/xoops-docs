---
title: "XOOPS Event System"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Ikke sikker på hvilket hændelsessystem du skal bruge?]
Se [Valg af et hændelsessystem](Choosing-Event-System.md) for et beslutningstræ med kodeeksempler for begge tilgange.
:::

:::note[To hændelsessystemer i XOOPS]
| System | Version | Use Case |
|--------|--------|--------|
| **Preload System** | ✅ XOOPS 2.5.x (aktuel) | Hook ind i kernebegivenheder via `class/Preload.php` |
| **PSR-14 Begivenhedsafsender** | 🚧 XOOPS 4.0 (fremtidig) | Moderne begivenhedsudsendelse med maskinskrevne begivenheder |

**For XOOPS 2.5.x-moduler**, brug afsnittet [Preload System](#preload-system-legacy) nedenfor. Sektionen PSR-14 er til XOOPS 4.0-udvikling.
:::

## Oversigt

XOOPS hændelsessystemet muliggør løs kobling mellem moduler gennem et observatørmønster. Komponenter kan udsende hændelser, som andre dele af systemet kan lytte til og reagere på.

## Hændelsestyper

### Kernebegivenheder

| Begivenhed | Triggerpunkt |
|-------|---------------|
| `core.header.start` | Før headerbehandling |
| `core.header.end` | Efter headerbehandling |
| `core.footer.start` | Før gengivelse af sidefod |
| `core.footer.end` | Efter gengivelse af sidefod |
| `core.exception` | Når der opstår en undtagelse |

### Modulets livscyklushændelser

| Begivenhed | Triggerpunkt |
|-------|---------------|
| `module.install` | Efter modulinstallation |
| `module.update` | Efter modulopdatering |
| `module.uninstall` | Før modulfjernelse |
| `module.activate` | Når modulet er aktiveret |
| `module.deactivate` | Når modulet er deaktiveret |

### Brugerhændelser

| Begivenhed | Triggerpunkt |
|-------|---------------|
| `user.login` | Efter vellykket login |
| `user.logout` | Efter logout |
| `user.register` | Efter registrering |
| `user.delete` | Før brugersletning |

## Forudindlæst system (forældet)

### Oprettelse af en forudindlæsning

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

### Navngivning af hændelsesmetode

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Event Dispatcher (XOOPS 4.0)

### Begivenhedsklasse

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

### Udsendelse af begivenheder

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

### Begivenhedslytter

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

### Registrering af lyttere

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

## Begivenheder, der kan stoppes

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

## Bedste praksis

1. **Immutable Events** - Hændelser bør være skrivebeskyttet
2. **Specifikke hændelser** - Opret specifikke hændelser, ikke generiske
3. **Asynkronisering, når det er muligt** - Brug køer til langsomme operationer
4. **Ingen bivirkninger ved afsendelse** - Afsendelse bør være hurtig
5. **Dokumenthændelser** - Liste over tilgængelige hændelser for modulbrugere

## Relateret dokumentation

- [Module-udvikling](../03-Module-Development/Module-Development.md) - Moduludvikling
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 guide
- [Hooks-Events](Hooks-Events.md) - Legacy hooks
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Eksempler på begivenheder
