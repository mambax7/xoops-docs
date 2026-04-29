---
title: "XOOPS Sistem dogodkov"
---
<span class="version-badge version-25x">2.5.x: Prednalaganja</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Ne veste, kateri sistem dogodkov uporabiti?]
Glejte [Izbira sistema dogodkov](Choosing-Event-System.md) za drevo odločitev s primeri kode za oba pristopa.
:::

:::opomba[Dva sistema dogodkov v XOOPS]
| Sistem | Različica | Primer uporabe |
|--------|---------|----------|
| **Sistem prednapetosti** | ✅ XOOPS 2.5.x (trenutno) | Priključite se na ključne dogodke prek `class/Preload.php` |
| **PSR-14 Dispečer dogodkov** | 🚧 XOOPS 4.0 (prihodnost) | Sodobno razpošiljanje dogodkov s tipiziranimi dogodki |

**Za module XOOPS 2.5.x** uporabite spodnji razdelek [Preload System](#preload-system-legacy). Razdelek PSR-14 je namenjen razvoju XOOPS 4.0.
:::

## Pregled

Sistem dogodkov XOOPS omogoča ohlapno povezavo med moduli prek vzorca opazovalca. Komponente lahko oddajajo dogodke, ki jih lahko drugi deli sistema poslušajo in se nanje odzovejo.

## Vrste dogodkov

### Ključni dogodki

| Dogodek | Sprožilna točka |
|-------|--------------|
| `core.header.start` | Pred obdelavo glave |
| `core.header.end` | Po obdelavi glave |
| `core.footer.start` | Pred upodabljanjem noge |
| `core.footer.end` | Po upodabljanju noge |
| `core.exception` | Ko pride do izjeme |### Dogodki življenjskega cikla modula

| Dogodek | Sprožilna točka |
|-------|--------------|
| `module.install` | Po namestitvi modula |
| `module.update` | Po posodobitvi modula |
| `module.uninstall` | Pred odstranitvijo modula |
| `module.activate` | Ko je modul aktiviran |
| `module.deactivate` | Ko je modul deaktiviran |

### Uporabniški dogodki

| Dogodek | Sprožilna točka |
|-------|--------------|
| `user.login` | Po uspešni prijavi |
| `user.logout` | Po odjavi |
| `user.register` | Po registraciji |
| `user.delete` | Pred izbrisom uporabnika |

## Sistem prednalaganja (podedovano)

### Ustvarjanje prednalaganja
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
### Poimenovanje metode dogodkov
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 Odpremnik dogodkov (XOOPS 4.0)

### Razred dogodka
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
### Odpremni dogodki
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
### Poslušalec dogodkov
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
### Registracija poslušalcev
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
## Dogodki, ki jih je mogoče ustaviti
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
## Najboljše prakse

1. **Nespremenljivi dogodki** - Dogodki morajo biti samo za branje
2. **Posebni dogodki** - Ustvarite specifične dogodke, ne splošnih
3. **Asinhrono, kadar je to mogoče** - Uporabite čakalne vrste za počasne operacije
4. **Brez stranskih učinkov pri odpremi** – odprema mora biti hitra
5. **Dokumentiraj dogodke** - seznam razpoložljivih dogodkov za uporabnike modula

## Povezana dokumentacija

- [Razvoj modula](../03-Module-Development/Module-Development.md) - Razvoj modula
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 vodnik
- [Hooks-Dogodki](Hooks-Events.md) - Starejše kljuke
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Primeri dogodkov