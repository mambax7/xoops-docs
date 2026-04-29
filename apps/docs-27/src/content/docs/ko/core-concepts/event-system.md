---
title: "XOOPS 이벤트 시스템"
---

<span class="version-badge version-25x">2.5.x: 사전 로드</span> <span class="version-badge version-40x">4.0.x: PSR-14</span>

:::note[어떤 이벤트 시스템을 사용해야 할지 모르시나요?]
두 접근 방식에 대한 코드 예제가 포함된 의사결정 트리는 [이벤트 시스템 선택](Choosing-Event-System.md)을 참조하세요.
:::

:::note[XOOPS의 두 가지 이벤트 시스템]
| 시스템 | 버전 | 사용 사례 |
|--------|---------|----------|
| **예압 시스템** | ✅ XOOPS 2.5.x(현재) | `class/Preload.php`을 통해 핵심 이벤트에 연결 |
| **PSR-14 이벤트 디스패처** | 🚧 XOOPS 4.0(미래) | 입력된 이벤트를 사용한 최신 이벤트 전달 |

**XOOPS 2.5.x 모듈**의 경우 아래의 [사전 로드 시스템](#preload-system-legacy) 섹션을 사용하세요. PSR-14 섹션은 XOOPS 4.0 개발을 위한 것입니다.
:::

## 개요

XOOPS 이벤트 시스템은 관찰자 패턴을 통해 모듈 간의 느슨한 결합을 가능하게 합니다. 구성 요소는 시스템의 다른 부분이 수신하고 응답할 수 있는 이벤트를 내보낼 수 있습니다.

## 이벤트 유형

### 핵심 이벤트

| 이벤트 | 트리거 포인트 |
|-------|---------------|
| `core.header.start` | 헤더 처리 전 |
| `core.header.end` | 헤더 처리 후 |
| `core.footer.start` | 바닥글 렌더링 전 |
| `core.footer.end` | 바닥글 렌더링 후 |
| `core.exception` | 예외가 발생한 경우 |

### 모듈 수명주기 이벤트

| 이벤트 | 트리거 포인트 |
|-------|---------------|
| `module.install` | 모듈 설치 후 |
| `module.update` | 모듈 업데이트 후 |
| `module.uninstall` | 모듈 제거 전 |
| `module.activate` | 모듈이 활성화되면 |
| `module.deactivate` | 모듈이 비활성화된 경우 |

### 사용자 이벤트

| 이벤트 | 트리거 포인트 |
|-------|---------------|
| `user.login` | 로그인 성공 후 |
| `user.logout` | 로그아웃 후 |
| `user.register` | 등록 후 |
| `user.delete` | 사용자 삭제 전 |

## 프리로드 시스템(레거시)

### 예압 생성

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

### 이벤트 메소드 이름 지정

```
event{Category}{Action}

Examples:
- eventCoreHeaderStart
- eventUserLogin
- eventModuleNewsArticleCreate
```

## PSR-14 이벤트 디스패처(XOOPS 4.0)

### 이벤트 클래스

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

### 이벤트 전달

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

### 이벤트 리스너

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

### 리스너 등록

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

## 중지 가능한 이벤트

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

## 모범 사례

1. **불변 이벤트** - 이벤트는 읽기 전용이어야 합니다.
2. **특정 이벤트** - 일반적인 이벤트가 아닌 특정 이벤트를 만듭니다.
3. **가능한 경우 비동기** - 느린 작업에는 대기열을 사용합니다.
4. **배송시 부작용 없음** - 배송이 빨라야 합니다.
5. **문서 이벤트** - 모듈 사용자가 사용할 수 있는 이벤트를 나열합니다.

## 관련 문서

- [모듈 개발](../03-Module-Development/Module-Development.md) - 모듈 개발
- [이벤트-시스템-가이드](../07-XOOPS-4.0/Implementation-Guides/Event-System-Guide.md) - PSR-14 가이드
- [후크-이벤트](Hooks-Events.md) - 레거시 후크
- [이벤트 및 후크](../10-Vision2026-Module/Developer-Guide/Events-and-Hooks.md) - 이벤트 예
