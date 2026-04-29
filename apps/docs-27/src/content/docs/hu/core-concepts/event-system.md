---
title: "XOOPS eseményrendszer"
---
<span class="version-badge version-25x">2.5.x: Előtöltések</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Nem tudja, melyik eseményrendszert használja?]
Az [Eseményrendszer kiválasztása](Choosing-Event-System.md) részben talál egy döntési fát, amely mindkét megközelítéshez kódpéldákat tartalmaz.
:::

:::megjegyzés[Két eseményrendszer a XOOPS-ban]
| Rendszer | Verzió | Használati eset |
|--------|----------|-----------|
| **Előfeszítő rendszer** | ✅ XOOPS 2.5.x (aktuális) | Csatlakozzon az alapvető eseményekhez a `class/Preload.php` | segítségével
| **PSR-14 Esemény diszpécser** | 🚧 XOOPS 4.0 (jövő) | Modern rendezvényküldés gépelt eseményekkel |

**A XOOPS 2.5.x modulokhoz** használja az alábbi [Preload System](#preload-system-legacy) részt. A PSR-14 rész a XOOPS 4.0 fejlesztéshez való.
:::

## Áttekintés

A XOOPS eseményrendszer lehetővé teszi a modulok közötti laza csatolást egy megfigyelő mintán keresztül. Az összetevők olyan eseményeket bocsáthatnak ki, amelyeket a rendszer többi része meghallgathat és reagálhat rájuk.

## Eseménytípusok

### Alapvető események

| Esemény | Trigger Point |
|-------|----------------|
| `core.header.start` | A fejléc feldolgozása előtt |
| `core.header.end` | A fejléc feldolgozása után |
| `core.footer.start` | A lábléc megjelenítése előtt |
| `core.footer.end` | A lábléc megjelenítése után |
| `core.exception` | Kivétel esetén |

### A modul életciklusának eseményei

| Esemény | Trigger Point |
|-------|----------------|
| `module.install` | modul telepítése után |
| `module.update` | modulfrissítés után |
| `module.uninstall` | A modul eltávolítása előtt |
| `module.activate` | Amikor a modul aktiválva van |
| `module.deactivate` | Amikor a modul deaktivált |

### Felhasználói események

| Esemény | Trigger Point |
|-------|----------------|
| `user.login` | Sikeres bejelentkezés után |
| `user.logout` | Kijelentkezés után |
| `user.register` | Regisztráció után |
| `user.delete` | A felhasználó törlése előtt |

## Előtöltő rendszer (örökölt)

### Előtöltés létrehozása

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

### Eseménymódszer elnevezése

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Esemény diszpécser (XOOPS 4.0)

### Eseményosztály

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

### Események feladása

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

### Eseményfigyelő

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

### Hallgatók regisztrálása

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

## Megállítható események

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

## Bevált gyakorlatok

1. **Megváltozhatatlan események** – Az eseményeknek csak olvashatónak kell lenniük
2. **Speciális események** – Konkrét eseményeket hozhat létre, nem általános eseményeket
3. **Aszinkronizálás, amikor lehetséges** – Használjon sorokat a lassú műveletekhez
4. **Nincsenek mellékhatások a kiszállításban** – A kiszállításnak gyorsnak kell lennie
5. **Dokumentum események** - A modul felhasználói számára elérhető események listája

## Kapcsolódó dokumentáció

- [modul-fejlesztés](../03-module-Development/module-Development.md) - modulfejlesztés
- [Esemény-rendszer-útmutató](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 útmutató
- [Hookok-Events](Hooks-Events.md) - Örökös hookok
- [Events-and-Hooks](../10-Vision2026-module/Developer-Guide/Events-and-Hooks.md) - Eseménypéldák
