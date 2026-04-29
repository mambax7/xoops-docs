---
title: "Система подій XOOPS"
---
<span class="version-badge version-25x">2.5.x: попередні завантаження</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Не впевнені, яку систему подій використовувати?]
Перегляньте [Вибір системи подій](Choosing-Event-System.md) для дерева рішень із прикладами коду для обох підходів.
:::

:::note[Дві системи подій у XOOPS]
| Система | Версія | Випадок використання |
|--------|---------|----------|
| **Система попереднього завантаження** | ✅ XOOPS 2.5.x (поточна) | Підключіться до основних подій через `class/Preload.php` |
| **PSR-14 Диспетчер подій** | 🚧 XOOPS 4.0 (майбутнє) | Сучасна диспетчеризація подій з типовими подіями |

**Для модулів XOOPS 2.5.x** використовуйте розділ [Система попереднього завантаження](#preload-system-legacy) нижче. Розділ PSR-14 призначений для розробки XOOPS 4.0.
:::

## Огляд

Система подій XOOPS забезпечує слабий зв’язок між модулями через шаблон спостерігача. Компоненти можуть випромінювати події, які інші частини системи можуть слухати та реагувати на них.

## Типи подій

### Основні події

| Подія | Тригерна точка |
|-------|--------------|
| `core.header.start` | Перед обробкою заголовка |
| `core.header.end` | Після обробки заголовка |
| `core.footer.start` | Перед рендерингом нижнього колонтитула |
| `core.footer.end` | Після візуалізації колонтитула |
| `core.exception` | Коли виникає виняток |

### Події життєвого циклу модуля

| Подія | Тригерна точка |
|-------|--------------|
| `module.install` | Після встановлення модуля |
| `module.update` | Після оновлення модуля |
| `module.uninstall` | Перед видаленням модуля |
| `module.activate` | При активації модуля |
| `module.deactivate` | Коли модуль деактивовано |

### Події користувача

| Подія | Тригерна точка |
|-------|--------------|
| `user.login` | Після успішного входу |
| `user.logout` | Після виходу |
| `user.register` | Після реєстрації |
| `user.delete` | Перед видаленням користувача |

## Система попереднього завантаження (застаріла)

### Створення попереднього завантаження
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
### Іменування методу події
```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```
## PSR-14 Диспетчер подій (XOOPS 4.0)

### Клас події
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
### Відправлення подій
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
### Прослуховувач подій
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
### Реєстрація слухачів
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
## Події, які можна зупинити
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
## Найкращі практики

1. **Незмінні події** - Події мають бути лише для читання
2. **Окремі події** - створюйте конкретні події, а не загальні
3. **Async When Possible** – використовуйте черги для повільних операцій
4. **Відсутність побічних ефектів під час відправлення** – відправка має бути швидкою
5. **Документувати події** - список доступних подій для користувачів модуля

## Пов'язана документація

- [Розробка модуля](../03-Module-Development/Module-Development.md) - Розробка модуля
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 посібник
- [Hooks-Events](Hooks-Events.md) - Застарілі хуки
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Приклади подій