---
title: "Domeinmodelpatroon"
---
## Overzicht

Het Domain Model-patroon vertegenwoordigt de bedrijfsconcepten, regels en logica van uw toepassing. Bij de ontwikkeling van de XOOPS-module omvatten domeinmodellen de kernbedrijfsentiteiten en hun gedrag.

## Entiteit versus waardeobject

### Entiteiten

Entiteiten hebben een identiteit en een levenscyclus:

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

### Waardeobjecten

Waardeobjecten zijn onveranderlijk en worden op waarde vergeleken:

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

## Aggregaten

Aggregaten zijn clusters van domeinobjecten die als één eenheid worden behandeld:

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

## Domeingebeurtenissen

Leg belangrijke domeingebeurtenissen vast:

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

## Enums voor status

Gebruik PHP 8.2+ enums voor typeveilige statuswaarden:

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

## Invarianten

Bescherm domeinregels binnen entiteiten:

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

## Beste praktijken

1. **Rich Domain Model** - Plaats gedrag in entiteiten, niet in services
2. **Onveranderlijke waardeobjecten** - Waardeobjecten mogen nooit veranderen
3. **Fabrieksmethoden** - Gebruik statische fabrieksmethoden voor complexe constructies
4. **Bewakingsclausules** - Valideer invoer bij entiteitsgrenzen
5. **Domeingebeurtenissen** - Leg belangrijke statuswijzigingen vast
6. **Alomtegenwoordig taalgebruik** - Gebruik zakelijke terminologie in code

## Gerelateerde documentatie

- Servicelaag - Applicatieservices
- Repository-laag - Persistentie
- DTO-patroon - Gegevensoverdracht
- Gebeurtenissysteem - Domeingebeurtenissen