---
title: "डोमेन मॉडल पैटर्न"
---
## अवलोकन

डोमेन मॉडल पैटर्न आपके एप्लिकेशन की व्यावसायिक अवधारणाओं, नियमों और तर्क का प्रतिनिधित्व करता है। XOOPS मॉड्यूल विकास में, डोमेन मॉडल मुख्य व्यावसायिक संस्थाओं और उनके व्यवहार को समाहित करते हैं।

## इकाई बनाम मूल्य वस्तु

### संस्थाएँ

संस्थाओं की पहचान और एक जीवनचक्र होता है:

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

### मूल्य वस्तुएँ

मूल्य वस्तुएँ अपरिवर्तनीय हैं और मूल्य के आधार पर तुलना की जाती हैं:

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

## समुच्चय

समुच्चय डोमेन ऑब्जेक्ट के समूह हैं जिन्हें एक इकाई के रूप में माना जाता है:

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

## डोमेन इवेंट

महत्वपूर्ण डोमेन घटनाएँ कैप्चर करें:

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

## स्थिति के लिए गणनाएँ

प्रकार-सुरक्षित स्थिति मानों के लिए PHP 8.2+ एनम का उपयोग करें:

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

## अपरिवर्तनशील

संस्थाओं के भीतर डोमेन नियमों को सुरक्षित रखें:

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

## सर्वोत्तम प्रथाएँ

1. **रिच डोमेन मॉडल** - व्यवहार को संस्थाओं में रखें, सेवाओं में नहीं
2. **अपरिवर्तनीय मूल्य वस्तुएं** - मूल्य वस्तुएं कभी नहीं बदलनी चाहिए
3. **फ़ैक्टरी विधियाँ** - जटिल निर्माण के लिए स्थिर फ़ैक्टरी विधियों का उपयोग करें
4. **गार्ड क्लॉज** - इकाई सीमाओं पर इनपुट मान्य करें
5. **डोमेन ईवेंट** - महत्वपूर्ण राज्य परिवर्तनों को कैप्चर करें
6. **सर्वव्यापी भाषा** - कोड में व्यावसायिक शब्दावली का प्रयोग करें

## संबंधित दस्तावेज़ीकरण

- सेवा-परत - अनुप्रयोग सेवाएँ
- रिपॉजिटरी-लेयर - दृढ़ता
- डीटीओ-पैटर्न - डेटा ट्रांसफर
- इवेंट-सिस्टम - डोमेन इवेंट