---
title: "Sistema di eventi di XOOPS"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Non sei sicuro di quale sistema di eventi utilizzare?]
Vedi [Scelta di un sistema di eventi](Choosing-Event-System.md) per un albero decisionale con esempi di codice per entrambi gli approcci.
:::

:::note[Due sistemi di eventi in XOOPS]
| Sistema | Versione | Caso d'uso |
|--------|---------|----------|
| **Sistema Preload** | ✅ XOOPS 2.5.x (attuale) | Hook negli eventi principali tramite `class/Preload.php` |
| **Dispatcher di eventi PSR-14** | 🚧 XOOPS 4.0 (futuro) | Dispatching moderno di eventi con tipi tipizzati |

**Per i moduli XOOPS 2.5.x**, utilizza la sezione [Sistema Preload](#preload-system-legacy) di seguito. La sezione PSR-14 è per lo sviluppo di XOOPS 4.0.
:::

## Panoramica

Il sistema di eventi di XOOPS abilita l'accoppiamento debole tra i moduli attraverso un pattern observer. I componenti possono emettere eventi che altre parti del sistema possono ascoltare e a cui rispondere.

## Tipi di eventi

### Eventi principali

| Evento | Punto di attivazione |
|-------|---------------|
| `core.header.start` | Prima dell'elaborazione dell'header |
| `core.header.end` | Dopo l'elaborazione dell'header |
| `core.footer.start` | Prima del rendering del footer |
| `core.footer.end` | Dopo il rendering del footer |
| `core.exception` | Quando si verifica un'eccezione |

### Eventi del ciclo di vita del modulo

| Evento | Punto di attivazione |
|-------|---------------|
| `module.install` | Dopo l'installazione del modulo |
| `module.update` | Dopo l'aggiornamento del modulo |
| `module.uninstall` | Prima della rimozione del modulo |
| `module.activate` | Quando il modulo è attivato |
| `module.deactivate` | Quando il modulo è disattivato |

### Eventi utente

| Evento | Punto di attivazione |
|-------|---------------|
| `user.login` | Dopo l'accesso riuscito |
| `user.logout` | Dopo il logout |
| `user.register` | Dopo la registrazione |
| `user.delete` | Prima dell'eliminazione dell'utente |

## Sistema Preload (Legacy)

### Creazione di un Preload

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

### Naming dei metodi di evento

```
event{Category}{Action}

Esempi:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Dispatcher di eventi PSR-14 (XOOPS 4.0)

### Classe di evento

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

### Dispatching degli eventi

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

### Listener di evento

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

### Registrazione dei listener

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

## Eventi stoppabili

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

## Best practice

1. **Eventi immutabili** - Gli eventi dovrebbero essere di sola lettura
2. **Eventi specifici** - Crea eventi specifici, non generici
3. **Asincronia se possibile** - Usa code per operazioni lente
4. **Nessun effetto collaterale nel dispatch** - Il dispatch dovrebbe essere veloce
5. **Documenta gli eventi** - Elenca gli eventi disponibili per gli utenti del modulo

## Documentazione correlata

- [Module-Development](../03-Module-Development/Module-Development.md) - Sviluppo dei moduli
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Guida PSR-14
- [Hooks-Events](Hooks-Events.md) - Hook legacy
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Esempi di eventi
