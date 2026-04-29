---
title: "도메인 모델 패턴"
---

## 개요

도메인 모델 패턴은 애플리케이션의 비즈니스 개념, 규칙 및 논리를 나타냅니다. XOOPS 모듈 개발에서 도메인 모델은 핵심 비즈니스 엔터티와 해당 동작을 캡슐화합니다.

## 엔터티 대 값 개체

### 엔터티

엔터티에는 ID와 수명 주기가 있습니다.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Entity;

use XoopsModules\MyModule\ValueObject\ArticleId;

final class Article
{
    private bool $isNew = true;

    public function __construct(
        private ArticleId $id,
        private string $title,
        private string $content,
        private int $authorId,
        private int $categoryId,
        private ArticleStatus $status,
        private \DateTimeImmutable $createdAt,
        private ?\DateTimeImmutable $updatedAt = null
    ) {}

    public static function create(
        string $title,
        string $content,
        int $authorId,
        int $categoryId
    ): self {
        return new self(
            id: ArticleId::generate(),
            title: $title,
            content: $content,
            authorId: $authorId,
            categoryId: $categoryId,
            status: ArticleStatus::DRAFT,
            createdAt: new \DateTimeImmutable()
        );
    }

    public function publish(): void
    {
        if ($this->status === ArticleStatus::PUBLISHED) {
            throw new \DomainException('Article is already published');
        }

        $this->status = ArticleStatus::PUBLISHED;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateContent(string $title, string $content): void
    {
        $this->title = $title;
        $this->content = $content;
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters...
    public function getId(): ArticleId { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function getContent(): string { return $this->content; }
    public function getStatus(): ArticleStatus { return $this->status; }
    public function isNew(): bool { return $this->isNew; }

    public function markAsPersisted(): void
    {
        $this->isNew = false;
    }
}
```

### 값 개체

값 개체는 변경할 수 없으며 값으로 비교됩니다.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\ValueObject;

final class ArticleId
{
    private function __construct(
        private readonly string $value
    ) {}

    public static function generate(): self
    {
        return new self(\Xmf\Ulid::generate());
    }

    public static function fromString(string $value): self
    {
        if (empty($value)) {
            throw new \InvalidArgumentException('ArticleId cannot be empty');
        }
        return new self($value);
    }

    public function toString(): string
    {
        return $this->value;
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}
```

## 집계

집계는 단일 단위로 처리되는 도메인 개체의 클러스터입니다.

```php
final class Category
{
    private array $articles = [];

    public function __construct(
        private CategoryId $id,
        private string $name,
        private ?CategoryId $parentId = null
    ) {}

    public function addArticle(Article $article): void
    {
        if ($article->getCategoryId() !== $this->id->toInt()) {
            throw new \DomainException('Article does not belong to this category');
        }
        $this->articles[] = $article;
    }

    public function getArticleCount(): int
    {
        return count($this->articles);
    }
}
```

## 도메인 이벤트

중요한 도메인 항목을 캡처합니다.

```php
final class ArticlePublishedEvent
{
    public function __construct(
        public readonly ArticleId $articleId,
        public readonly int $authorId,
        public readonly \DateTimeImmutable $publishedAt
    ) {}
}
```

## 상태 열거형

유형이 안전한 상태 값을 위해 PHP 8.2+ 열거형을 사용하세요:

```php
enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PENDING_REVIEW = 'pending';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public function canTransitionTo(self $newStatus): bool
    {
        return match($this) {
            self::DRAFT => in_array($newStatus, [self::PENDING_REVIEW, self::ARCHIVED]),
            self::PENDING_REVIEW => in_array($newStatus, [self::DRAFT, self::PUBLISHED]),
            self::PUBLISHED => $newStatus === self::ARCHIVED,
            self::ARCHIVED => false,
        };
    }
}
```

## 불변

엔터티 내의 도메인 규칙을 보호합니다.

```php
final class Article
{
    public function setTitle(string $title): void
    {
        if (strlen($title) < 5) {
            throw new \DomainException('Title must be at least 5 characters');
        }
        if (strlen($title) > 255) {
            throw new \DomainException('Title cannot exceed 255 characters');
        }
        $this->title = $title;
    }

    public function archive(): void
    {
        if ($this->status === ArticleStatus::DRAFT) {
            throw new \DomainException('Cannot archive a draft article');
        }
        $this->status = ArticleStatus::ARCHIVED;
    }
}
```

## 모범 사례

1. **리치 도메인 모델** - 서비스가 아닌 엔터티에 동작을 추가합니다.
2. **불변 값 개체** - 값 개체는 절대로 변경되어서는 안 됩니다.
3. **팩토리 메소드** - 복잡한 구성에는 정적 팩토리 메소드를 사용합니다.
4. **보호 조항** - 엔터티 경계에서 입력 유효성을 검사합니다.
5. **도메인 이벤트** - 중요한 상태 변경 캡처
6. **유비쿼터스 언어** - 코드에서 비즈니스 용어 사용

## 관련 문서

- 서비스 레이어 - 애플리케이션 서비스
- 리포지토리 계층 - 지속성
- DTO 패턴 - 데이터 전송
- 이벤트 시스템 - 도메인 이벤트
