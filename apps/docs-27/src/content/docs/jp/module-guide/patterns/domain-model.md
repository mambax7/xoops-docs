---
title: "ドメインモデルパターン"
---

## 概要

ドメインモデルパターンはアプリケーションのビジネスコンセプト、ルール、ロジックを表します。XOOPSモジュール開発では、ドメインモデルはコアビジネスエンティティとその振る舞いをカプセル化します。

## エンティティ対値オブジェクト

### エンティティ

エンティティはアイデンティティとライフサイクルを持つ:

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
            throw new \DomainException('記事は既に公開されています');
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

    // ゲッター...
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

### 値オブジェクト

値オブジェクトはイミュータブルで、値により比較される:

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
            throw new \InvalidArgumentException('ArticleIdは空にできません');
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

## 集約

集約は単一ユニットとして扱われるドメインオブジェクトのクラスタ:

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
            throw new \DomainException('この記事はこのカテゴリーに属していません');
        }
        $this->articles[] = $article;
    }

    public function getArticleCount(): int
    {
        return count($this->articles);
    }
}
```

## ドメインイベント

重要なドメイン発生を捕捉:

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

## ステータス用の列挙型

PHP 8.2+ の列挙型を使用してタイプセーフなステータス値を実現:

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

## 不変式

エンティティ内のドメインルールを保護:

```php
final class Article
{
    public function setTitle(string $title): void
    {
        if (strlen($title) < 5) {
            throw new \DomainException('タイトルは最低5文字である必要があります');
        }
        if (strlen($title) > 255) {
            throw new \DomainException('タイトルは255文字を超えることはできません');
        }
        $this->title = $title;
    }

    public function archive(): void
    {
        if ($this->status === ArticleStatus::DRAFT) {
            throw new \DomainException('ドラフト記事をアーカイブすることはできません');
        }
        $this->status = ArticleStatus::ARCHIVED;
    }
}
```

## ベストプラクティス

1. **リッチドメインモデル** - 振る舞いをサービスではなくエンティティに入れる
2. **イミュータブル値オブジェクト** - 値オブジェクトは変更してはいけない
3. **ファクトリーメソッド** - 複雑な構築に静的ファクトリーメソッドを使用
4. **ガード句** - エンティティ境界で入力を検証
5. **ドメインイベント** - 重要な状態変化を捕捉
6. **ユビキタス言語** - コード内でビジネス用語を使用

## 関連ドキュメント

- サービスレイヤー - アプリケーションサービス
- リポジトリレイヤー - 永続化
- DTOパターン - データ転送
- イベントシステム - ドメインイベント
