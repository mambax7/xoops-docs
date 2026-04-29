---
title: "XOOPS Σύστημα εκδηλώσεων"
---

<span class="version-badge version-25x">2.5.x: Προφορτώσεις</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Δεν είμαι σίγουρος ποιο σύστημα συμβάντων να χρησιμοποιήσω;]
Δείτε [Επιλογή συστήματος συμβάντων](Choosing-Event-System.md) για ένα δέντρο αποφάσεων με παραδείγματα κώδικα και για τις δύο προσεγγίσεις.
:::

:::note[Δύο συστήματα συμβάντων στο XOOPS]
| Σύστημα | Έκδοση | Περίπτωση χρήσης |
|--------|---------|----------|
| **Σύστημα προφόρτισης** | ✅ XOOPS 2.5.x (τρέχον) | Συνδεθείτε στα βασικά συμβάντα μέσω του `class/Preload.php` |
| **PSR-14 Διανομέας συμβάντων** | 🚧 XOOPS 4.0 (μέλλον) | Σύγχρονη αποστολή εκδηλώσεων με δακτυλογραφημένες εκδηλώσεις |

**Για μονάδες XOOPS 2.5.x**, χρησιμοποιήστε την ενότητα [Προφόρτωση συστήματος](#preload-system-legacy) παρακάτω. Η ενότητα PSR-14 προορίζεται για την ανάπτυξη XOOPS 4.0.
:::

## Επισκόπηση

Το σύστημα συμβάντων XOOPS επιτρέπει τη χαλαρή σύζευξη μεταξύ των μονάδων μέσω ενός σχεδίου παρατηρητή. Τα στοιχεία μπορούν να εκπέμπουν συμβάντα στα οποία μπορούν να ακούσουν και να ανταποκριθούν άλλα μέρη του συστήματος.

## Τύποι συμβάντων

## # Βασικά συμβάντα

| Εκδήλωση | Σημείο ενεργοποίησης |
|-------|---------------|
| `core.header.start` | Πριν από την επεξεργασία της κεφαλίδας |
| `core.header.end` | Μετά την επεξεργασία της κεφαλίδας |
| `core.footer.start` | Πριν από την απόδοση του υποσέλιδου |
| `core.footer.end` | Μετά την απόδοση του υποσέλιδου |
| `core.exception` | Όταν συμβαίνει εξαίρεση |

## # Εκδηλώσεις κύκλου ζωής ενότητας

| Εκδήλωση | Σημείο ενεργοποίησης |
|-------|---------------|
| `module.install` | Μετά την εγκατάσταση της μονάδας |
| `module.update` | Μετά την ενημέρωση της ενότητας |
| `module.uninstall` | Πριν την αφαίρεση της μονάδας |
| `module.activate` | Όταν ενεργοποιηθεί η μονάδα |
| `module.deactivate` | Όταν η μονάδα είναι απενεργοποιημένη |

## # Συμβάντα χρήστη

| Εκδήλωση | Σημείο ενεργοποίησης |
|-------|---------------|
| `user.login` | Μετά την επιτυχή σύνδεση |
| `user.logout` | Μετά την αποσύνδεση |
| `user.register` | Μετά την εγγραφή |
| `user.delete` | Πριν από τη διαγραφή χρήστη |

## Σύστημα προφόρτωσης (παλαιού τύπου)

## # Δημιουργία προφόρτωσης

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

## # Ονομασία μεθόδου συμβάντος

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 Διανομέας συμβάντων (XOOPS 4.0)

## # Τάξη εκδήλωσης

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

## # Αποστολή συμβάντων

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

## # Ακρόαση εκδηλώσεων

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

## # Εγγραφή ακροατών

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

## Συμβάντα με δυνατότητα διακοπής

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

## Βέλτιστες πρακτικές

1. **Αμετάβλητα συμβάντα** - Τα συμβάντα πρέπει να είναι μόνο για ανάγνωση
2. **Συγκεκριμένα συμβάντα** - Δημιουργήστε συγκεκριμένα συμβάντα, όχι γενικά
3. **Async When Possible** - Χρησιμοποιήστε ουρές για αργές λειτουργίες
4. **Χωρίς παρενέργειες στην αποστολή** - Η αποστολή πρέπει να είναι γρήγορη
5. **Συμβάντα εγγράφου** - Καταχωρίστε τα διαθέσιμα συμβάντα για χρήστες της ενότητας

## Σχετική τεκμηρίωση

- [Module-Development](../03-Module-Development/Module-Development.md) - Ανάπτυξη ενότητας
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 οδηγός
- [Hoks-Events](Hooks-Events.md) - Άγκιστρα παλαιού τύπου
- [Events-and-Hoks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Παραδείγματα συμβάντων
