---
title: "Systém událostí XOOPS"
---

<span class="version-badge version-25x">2.5.x: Předběžné načtení</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Nejste si jisti, který systém událostí použít?]
Rozhodovací strom s příklady kódu pro oba přístupy naleznete v části [Výběr systému událostí](Choosing-Event-System.md).
:::

:::note[Dva systémy událostí v XOOPS]
| Systém | Verze | Případ použití |
|--------|---------|----------|
| **Preload System** | ✅ XOOPS 2.5.x (aktuální) | Připojte se k hlavním událostem prostřednictvím `class/Preload.php` |
| **PSR-14 Event Dispečer** | 🚧 XOOPS 4.0 (budoucí) | Moderní eventový dispečink s typizovanými událostmi |

**Pro moduly XOOPS 2.5.x** použijte níže uvedenou část [Preload System](#preload-system-legacy). Sekce PSR-14 je určena pro vývoj XOOPS 4.0.
:::

## Přehled

Systém událostí XOOPS umožňuje volné propojení mezi moduly prostřednictvím vzoru pozorovatele. Komponenty mohou vysílat události, kterým mohou ostatní části systému naslouchat a reagovat na ně.

## Typy událostí

### Hlavní události

| Akce | Spouštěcí bod |
|-------|---------------|
| `core.header.start` | Před zpracováním hlavičky |
| `core.header.end` | Po zpracování hlavičky |
| `core.footer.start` | Před vykreslením zápatí |
| `core.footer.end` | Po vykreslení zápatí |
| `core.exception` | Když nastane výjimka |

### Události životního cyklu modulu

| Akce | Spouštěcí bod |
|-------|---------------|
| `module.install` | Po instalaci modulu |
| `module.update` | Po aktualizaci modulu |
| `module.uninstall` | Před vyjmutím modulu |
| `module.activate` | Při aktivaci modulu |
| `module.deactivate` | Při deaktivaci modulu |

### Uživatelské události

| Akce | Spouštěcí bod |
|-------|---------------|
| `user.login` | Po úspěšném přihlášení |
| `user.logout` | Po odhlášení |
| `user.register` | Po registraci |
| `user.delete` | Před smazáním uživatele |

## Systém předběžného načtení (starší)

### Vytvoření předběžného načtení

```php
<?php
// class/Preload.php

namespace XOOPSModules\MyModule;

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

### Pojmenování metody události

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Dispečer událostí PSR-14 (XOOPS 4.0)

### Třída události

```php
<?php

declare(strict_types=1);

namespace XOOPSModules\MyModule\Event;

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

### Dispečerské akce

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

### Posluchač událostí

```php
<?php

declare(strict_types=1);

namespace XOOPSModules\MyModule\Listener;

use XOOPSModules\MyModule\Event\ArticleCreatedEvent;

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

### Registrace posluchačů

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

## Zastavitelné události

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

## Nejlepší postupy

1. **Neměnné události** – Události by měly být pouze pro čtení
2. **Specifické události** – Vytvářejte konkrétní události, nikoli obecné
3. **Asynchronní, když je to možné** – Používejte fronty pro pomalé operace
4. **Žádné vedlejší účinky při odeslání** – Odeslání by mělo být rychlé
5. **Události dokumentu** – Seznam dostupných událostí pro uživatele modulu

## Související dokumentace

- [Vývoj modulu](../03-Module-Development/Module-Development.md) - Vývoj modulu
- [Průvodce systémem událostí](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Průvodce PSR-14
- [Hooks-Events](Hooks-Events.md) - Starší háky
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Příklady událostí