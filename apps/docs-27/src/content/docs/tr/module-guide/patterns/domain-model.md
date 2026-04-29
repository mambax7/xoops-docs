---
title: "Etki Alanı Modeli Kalıbı"
---
## Genel Bakış

Etki Alanı Modeli modeli, uygulamanızın iş kavramlarını, kurallarını ve mantığını temsil eder. XOOPS module geliştirmede, etki alanı modelleri temel iş varlıklarını ve onların davranışlarını kapsar.

## Varlık ve Değer Nesnesi

### Varlıklar

Varlıkların kimliği ve yaşam döngüsü vardır:
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
### Değer Nesneleri

Değer Nesneleri değişmezdir ve değere göre karşılaştırılır:
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
## Toplamalar

Toplamalar, tek bir birim olarak ele alınan etki alanı nesnelerinin kümeleridir:
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
## Etki Alanı Etkinlikleri

Önemli etki alanı oluşumlarını yakalayın:
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
## Durum için Numaralandırmalar

Tür uyumlu durum değerleri için PHP 8.2+ numaralandırmalarını kullanın:
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
## Değişmezler

Varlıklar içindeki etki alanı kurallarını koruyun:
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
## En İyi Uygulamalar

1. **Zengin Etki Alanı Modeli** - Davranışı hizmetlere değil varlıklara yerleştirin
2. **Değişmez Değer Nesneleri** - Değer nesneleri hiçbir zaman değişmemelidir
3. **Fabrika Yöntemleri** - Karmaşık inşaatlar için statik fabrika yöntemlerini kullanın
4. **Koruma Maddeleri** - Girişlerin varlık sınırlarında doğrulanması
5. **Etki Alanı Olayları** - Önemli durum değişikliklerini yakalayın
6. **Her Yerde Bulunan Dil** - Kodda iş terminolojisini kullanın

## İlgili Belgeler

- Hizmet Katmanı - Uygulama hizmetleri
- Depo Katmanı - Kalıcılık
- DTO-Desen - Veri aktarımı
- Etkinlik Sistemi - Etki alanı etkinlikleri