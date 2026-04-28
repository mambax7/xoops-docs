---
title: "System zdarzeń XOOPS"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Nie masz pewności, który system zdarzeń użyć?]
Zobacz [Choosing an Event System](Choosing-Event-System.md) dla drzewa decyzyjnego z przykładami kodu dla obu podejść.
:::

:::note[Dwa systemy zdarzeń w XOOPS]
| System | Wersja | Przypadek użycia |
|--------|---------|----------|
| **System Preload** | ✅ XOOPS 2.5.x (bieżący) | Haczuj się do zdarzeń rdzeniowych poprzez `class/Preload.php` |
| **PSR-14 Event Dispatcher** | 🚧 XOOPS 4.0 (przyszłość) | Nowoczesna dyspozycja zdarzeń z typizowanymi zdarzeniami |

**Dla modułów XOOPS 2.5.x**, używaj sekcji [System Preload](#system-preload-legacy) poniżej. Sekcja PSR-14 jest dla tworzenia XOOPS 4.0.
:::

## Przegląd

System zdarzeń XOOPS umożliwia luźne powiązanie między modułami poprzez wzorzec observer. Komponenty mogą emitować zdarzenia, które inne części systemu mogą słuchać i na nie reagować.

## Typy zdarzeń

### Zdarzenia rdzeniowe

| Zdarzenie | Punkt wyzwolenia |
|-------|---------------|
| `core.header.start` | Przed przetwarzaniem nagłówka |
| `core.header.end` | Po przetwarzaniu nagłówka |
| `core.footer.start` | Przed renderowaniem stopki |
| `core.footer.end` | Po renderowaniu stopki |
| `core.exception` | Gdy pojawi się wyjątek |

### Zdarzenia cyklu życia modułu

| Zdarzenie | Punkt wyzwolenia |
|-------|---------------|
| `module.install` | Po instalacji modułu |
| `module.update` | Po aktualizacji modułu |
| `module.uninstall` | Przed usunięciem modułu |
| `module.activate` | Gdy moduł jest aktywowany |
| `module.deactivate` | Gdy moduł jest dezaktywowany |

### Zdarzenia użytkownika

| Zdarzenie | Punkt wyzwolenia |
|-------|---------------|
| `user.login` | Po pomyślnym zalogowaniu |
| `user.logout` | Po wylogowaniu |
| `user.register` | Po rejestracji |
| `user.delete` | Przed usunięciem użytkownika |

## System Preload (legacy)

### Tworzenie Preload

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Wykonaj na każdej stronie przed nagłówkiem
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Wykonaj przed renderowaniem stopki
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Obsługuj zdarzenie logowania
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Zaloguj lub obsługuj wyjątek
    }
}
```

### Nazewnictwo metod zdarzeń

```
event{Kategoria}{Akcja}

Przykłady:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Event Dispatcher (XOOPS 4.0)

### Klasa zdarzenia

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

### Dyspozycja zdarzeń

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

        // Dyspozycja zdarzenia
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

### Nasłuchiwacz zdarzeń

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

### Rejestracja nasłuchiwaczy

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

## Zdarzenia zatrzymywalne

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

// Nasłuchiwacz może zatrzymać propagację
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

## Najlepsze praktyki

1. **Zdarzenia niezmienne** - Zdarzenia powinny być tylko do odczytu
2. **Zdarzenia specyficzne** - Twórz zdarzenia specyficzne, nie generyczne
3. **Asynchronizacja gdy to możliwe** - Użyj kolejek dla wolnych operacji
4. **Brak efektów ubocznych w dyspozycji** - Dyspozycja powinna być szybka
5. **Dokumentuj zdarzenia** - Wypisz dostępne zdarzenia dla użytkowników modułu

## Powiązana dokumentacja

- [Module-Development](../03-Module-Development/Module-Development.md) - Tworzenie modułu
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Przewodnik PSR-14
- [Hooks-Events](Hooks-Events.md) - Legacy haki
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Przykłady zdarzeń
