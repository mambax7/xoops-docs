---
title: "الگوی مدل دامنه"
---
## بررسی اجمالی

الگوی Domain Model مفاهیم تجاری، قوانین و منطق برنامه شما را نشان می دهد. در توسعه ماژول XOOPS، مدل‌های دامنه، موجودیت‌های تجاری اصلی و رفتارهای آنها را در بر می‌گیرد.

## موجودیت در مقابل شیء ارزش

### نهادها

موجودیت ها دارای هویت و چرخه حیات هستند:

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

### اشیاء ارزش

اشیاء ارزش تغییرناپذیر هستند و با مقدار مقایسه می شوند:

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
        return new self(\XMF\Ulid::generate());
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

## مصالح

انباشته ها خوشه هایی از اشیاء دامنه هستند که به عنوان یک واحد در نظر گرفته می شوند:

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

## رویدادهای دامنه

ثبت رخدادهای مهم دامنه:

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

## فهرست برای وضعیت

از شماره های PHP 8.2+ برای مقادیر وضعیت ایمن نوع استفاده کنید:

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

## متغیرها

محافظت از قوانین دامنه در موجودیت ها:

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

## بهترین شیوه ها

1. **مدل دامنه غنی** - رفتار را در نهادها قرار دهید، نه خدمات
2. **اشیاء با ارزش غیرقابل تغییر** - اشیاء ارزش هرگز نباید تغییر کنند
3. **روش های کارخانه** - از روش های کارخانه ای استاتیک برای ساخت و سازهای پیچیده استفاده کنید
4. **بندهای نگهبانی** - ورودی ها را در مرزهای موجودیت اعتبارسنجی کنید
5. **رویدادهای دامنه** - تغییرات مهم وضعیت را ضبط کنید
6. **زبان فراگیر ** - از اصطلاحات تجاری در کد استفاده کنید

## مستندات مرتبط

- لایه سرویس - خدمات کاربردی
- Repository-Layer - Persistence
- DTO-Pattern - انتقال داده
- رویداد-سیستم - رویدادهای دامنه