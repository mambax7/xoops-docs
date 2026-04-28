---
title: "XOOPS Event System"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Unsicher, welches Event System verwenden?]
Siehe [Wählen eines Event Systems](Choosing-Event-System.md) für einen Entscheidungsbaum mit Code-Beispielen für beide Ansätze.
:::

:::note[Zwei Event Systeme in XOOPS]
| System | Version | Verwendungsfall |
|--------|---------|----------|
| **Preload System** | ✅ XOOPS 2.5.x (Aktuell) | In Core Events einklinken via `class/Preload.php` |
| **PSR-14 Event Dispatcher** | 🚧 XOOPS 4.0 (Zukünftig) | Modernes Event Dispatching mit typed Events |

**Für XOOPS 2.5.x Module**, verwenden Sie den Abschnitt [Preload System](#preload-system-legacy) unten. Der PSR-14 Abschnitt ist für XOOPS 4.0 Entwicklung.
:::

## Übersicht

Das XOOPS Event System ermöglicht lose Kopplung zwischen Modulen durch ein Observer Pattern. Komponenten können Events aussenden, auf die andere Teile des Systems hören und reagieren können.

## Event Typen

### Core Events

| Event | Trigger Point |
|-------|---------------|
| `core.header.start` | Vor Header-Verarbeitung |
| `core.header.end` | Nach Header-Verarbeitung |
| `core.footer.start` | Vor Footer-Rendering |
| `core.footer.end` | Nach Footer-Rendering |
| `core.exception` | Wenn Exception auftritt |

### Module Lifecycle Events

| Event | Trigger Point |
|-------|---------------|
| `module.install` | Nach Modul-Installation |
| `module.update` | Nach Modul-Update |
| `module.uninstall` | Vor Modul-Entfernung |
| `module.activate` | Wenn Modul aktiviert wird |
| `module.deactivate` | Wenn Modul deaktiviert wird |

### User Events

| Event | Trigger Point |
|-------|---------------|
| `user.login` | Nach erfolgreichem Login |
| `user.logout` | Nach Logout |
| `user.register` | Nach Registrierung |
| `user.delete` | Vor Benutzer-Löschung |

## Preload System (Legacy)

### Preload erstellen

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Läuft auf jeder Seite vor Header
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Läuft vor Footer-Rendering
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Handle Login Event
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Log oder handle Exception
    }
}
```

### Event-Methoden Naming

```
event{Category}{Action}

Beispiele:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Event Dispatcher (XOOPS 4.0)

### Event Klasse

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

### Events Dispatching

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

        // Event dispatchen
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

### Event Listener

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

### Listener registrieren

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

## Stoppable Events

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

// Listener kann Propagation stoppen
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

## Best Practices

1. **Immutable Events** - Events sollten read-only sein
2. **Specific Events** - Erstellen Sie spezifische Events, nicht generische
3. **Async When Possible** - Verwenden Sie Queues für langsame Operationen
4. **No Side Effects in Dispatch** - Dispatch sollte schnell sein
5. **Document Events** - Listen Sie verfügbare Events für Modul-Benutzer auf

## Verwandte Dokumentation

- [Module-Development](../03-Module-Development/Module-Development.md) - Modul-Entwicklung
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 Leitfaden
- [Hooks-Events](Hooks-Events.md) - Legacy Hooks
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Event Beispiele
