---
title: "XOOPS इवेंट सिस्टम"
---
<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::ध्यान दें[निश्चित नहीं है कि किस ईवेंट सिस्टम का उपयोग किया जाए?]
दोनों दृष्टिकोणों के लिए कोड उदाहरणों के साथ निर्णय वृक्ष के लिए [एक इवेंट सिस्टम चुनना](Choosing-Event-System.md) देखें।
:::

:::नोट[XOOPS में दो इवेंट सिस्टम]
| सिस्टम | संस्करण | केस का प्रयोग करें |
|--------|------|-------|
| **प्रीलोड सिस्टम** | ✅ XOOPS 2.5.x (वर्तमान) | `class/Preload.php` | के माध्यम से मुख्य घटनाओं से जुड़ें
| **पीएसआर-14 इवेंट डिस्पैचर** | 🚧 XOOPS 4.0 (भविष्य) | टाइप की गई घटनाओं के साथ आधुनिक घटना प्रेषण |

**XOOPS 2.5.x मॉड्यूल के लिए**, नीचे [प्रीलोड सिस्टम](#preload-system-legacy) अनुभाग का उपयोग करें। PSR-14 अनुभाग XOOPS 4.0 विकास के लिए है।
:::

## अवलोकन

XOOPS इवेंट सिस्टम एक पर्यवेक्षक पैटर्न के माध्यम से मॉड्यूल के बीच ढीले युग्मन को सक्षम बनाता है। घटक ऐसी घटनाओं का उत्सर्जन कर सकते हैं जिन्हें सिस्टम के अन्य भाग सुन सकते हैं और प्रतिक्रिया दे सकते हैं।

## घटना के प्रकार

### मुख्य घटनाएँ

| घटना | ट्रिगर प्वाइंट |
|-------|----------------------|
| `core.header.start` | हेडर प्रोसेसिंग से पहले |
| `core.header.end` | हेडर प्रोसेसिंग के बाद |
| `core.footer.start` | फ़ुटर रेंडरिंग से पहले |
| `core.footer.end` | फ़ुटर रेंडरिंग के बाद |
| `core.exception` | जब अपवाद होता है |

### मॉड्यूल जीवनचक्र घटनाएँ

| घटना | ट्रिगर प्वाइंट |
|-------|----------------------|
| `module.install` | मॉड्यूल स्थापना के बाद |
| `module.update` | मॉड्यूल अद्यतन के बाद |
| `module.uninstall` | मॉड्यूल हटाने से पहले |
| `module.activate` | जब मॉड्यूल सक्रिय हो गया |
| `module.deactivate` | जब मॉड्यूल निष्क्रिय हो गया |

### उपयोगकर्ता घटनाएँ

| घटना | ट्रिगर प्वाइंट |
|-------|----------------------|
| `user.login` | सफल लॉगिन के बाद |
| `user.logout` | लॉगआउट के बाद |
| `user.register` | पंजीकरण के बाद |
| `user.delete` | उपयोगकर्ता को हटाने से पहले |

## प्रीलोड सिस्टम (विरासत)

### प्रीलोड बनाना

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

### घटना पद्धति का नामकरण

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## पीएसआर-14 इवेंट डिस्पैचर (@@00039@@ 4.0)

### इवेंट क्लास

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

### प्रेषण घटनाएँ

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

### इवेंट श्रोता

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

### श्रोताओं का पंजीकरण

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

## रुकने योग्य घटनाएँ

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

## सर्वोत्तम प्रथाएँ

1. **अपरिवर्तनीय घटनाएँ** - घटनाएँ केवल पढ़ने के लिए होनी चाहिए
2. **विशिष्ट ईवेंट** - विशिष्ट ईवेंट बनाएं, सामान्य ईवेंट नहीं
3. **संभव होने पर Async** - धीमे संचालन के लिए क्यू का उपयोग करें
4. **प्रेषण में कोई दुष्प्रभाव नहीं** - प्रेषण शीघ्र होना चाहिए
5. **दस्तावेज़ घटनाएँ** - मॉड्यूल उपयोगकर्ताओं के लिए उपलब्ध घटनाओं की सूची बनाएं

## संबंधित दस्तावेज़ीकरण

- [मॉड्यूल-विकास](../03-Module-Development/Module-Development.md) - मॉड्यूल विकास
- [इवेंट-सिस्टम-गाइड](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - पीएसआर-14 गाइड
- [हुक्स-इवेंट्स](Hooks-Events.md) - लिगेसी हुक्स
- [इवेंट-एंड-हुक](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - इवेंट उदाहरण