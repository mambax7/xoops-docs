---
title: "Система событий XOOPS"
---

<span class="version-badge version-25x">2.5.x: Preloads</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[Не уверены, какую систему событий использовать?]
Смотрите [Выбор системы событий](Choosing-Event-System.md) для дерева решений с примерами кода для обоих подходов.
:::

:::note[Две системы событий в XOOPS]
| Система | Версия | Случай использования |
|---------|--------|-------------------|
| **Система Preload** | ✅ XOOPS 2.5.x (текущая) | Подключение к основным событиям через `class/Preload.php` |
| **Event Dispatcher PSR-14** | 🚧 XOOPS 4.0 (будущая) | Современная диспетчеризация событий с типизированными событиями |

**Для модулей XOOPS 2.5.x**, используйте раздел [Система Preload](#preload-system-legacy) ниже. Раздел PSR-14 предназначен для разработки XOOPS 4.0.
:::

## Обзор

Система событий XOOPS включает слабую связанность между модулями через паттерн observer. Компоненты могут инициировать события, на которые другие части системы могут подписаться и реагировать.

## Типы событий

### События ядра

| Событие | Точка срабатывания |
|---------|------------------|
| `core.header.start` | Перед обработкой заголовка |
| `core.header.end` | После обработки заголовка |
| `core.footer.start` | Перед рендерингом подвала |
| `core.footer.end` | После рендеринга подвала |
| `core.exception` | Когда происходит исключение |

### События жизненного цикла модуля

| Событие | Точка срабатывания |
|---------|------------------|
| `module.install` | После установки модуля |
| `module.update` | После обновления модуля |
| `module.uninstall` | Перед удалением модуля |
| `module.activate` | Когда модуль активирован |
| `module.deactivate` | Когда модуль деактивирован |

### События пользователя

| Событие | Точка срабатывания |
|---------|------------------|
| `user.login` | После успешного входа |
| `user.logout` | После выхода |
| `user.register` | После регистрации |
| `user.delete` | Перед удалением пользователя |

## Система Preload (Legacy)

### Создание Preload

```php
<?php
// class/Preload.php

namespace XoopsModules\MyModule;

use Xmf\Module\Helper\AbstractHelper;

final class Preload extends AbstractHelper
{
    public function eventCoreHeaderStart(array $args): void
    {
        // Запускается на каждой странице перед заголовком
    }

    public function eventCoreFooterStart(array $args): void
    {
        // Запускается перед рендерингом подвала
    }

    public function eventUserLogin(array $args): void
    {
        $userId = $args['userid'];
        // Обработать событие входа
    }

    public function eventCoreException(array $args): void
    {
        $exception = $args['exception'];
        // Логировать или обработать исключение
    }
}
```

### Именование методов события

```
event{Категория}{Действие}

Примеры:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## Event Dispatcher PSR-14 (XOOPS 4.0)

### Класс события

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

### Диспетчеризация событий

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

        // Диспетчеризировать событие
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

### Слушатель события

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

### Регистрация слушателей

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

## События, которые можно остановить

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

// Слушатель может остановить распространение
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

## Лучшие практики

1. **Неизменяемые события** - события должны быть только для чтения
2. **Специфичные события** - создавайте конкретные события, не общие
3. **Асинхронность, когда возможно** - используйте очереди для медленных операций
4. **Без побочных эффектов при диспетчеризации** - диспетчеризация должна быть быстрой
5. **Документируйте события** - перечисляйте доступные события для пользователей модуля

## Связанная документация

- [Разработка модулей](../03-Module-Development/Module-Development.md) - Разработка модулей
- [Event-System-Guide](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - Руководство PSR-14
- [Hooks-Events](Hooks-Events.md) - Legacy hooks
- [Events-and-Hooks](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - Примеры событий
