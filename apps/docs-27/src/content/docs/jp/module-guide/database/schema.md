---
title: "データベーススキーマ設計"
---

## 概要

適切なデータベーススキーマ設計はXOOPSモジュールのパフォーマンスと保守性に重要です。このガイドはテーブル設計、リレーションシップ、インデックス、マイグレーションのベストプラクティスをカバーしています。

## テーブル命名規約

### 標準形式

```
{prefix}_{modulename}_{tablename}
```

例:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (ジャンクション表)

### スキーマファイルで

`{PREFIX}` プレースホルダーを使用:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## 列の型

### 推奨型

| データ | MySQL型 | PHP型 | 説明 |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID識別子 |
| ID (自動) | `INT UNSIGNED AUTO_INCREMENT` | `int` | 連続ID |
| 短いテキスト | `VARCHAR(n)` | `string` | 最大255文字 |
| 長いテキスト | `TEXT` | `string` | 無制限テキスト |
| リッチテキスト | `MEDIUMTEXT` | `string` | HTMLコンテンツ |
| ブール値 | `TINYINT(1)` | `bool` | 真/偽 |
| 列挙型 | `ENUM(...)` | `string` | 固定オプション |
| 日付 | `DATE` | `DateTimeImmutable` | 日付のみ |
| DateTime | `DATETIME` | `DateTimeImmutable` | 日時 |
| タイムスタンプ | `INT UNSIGNED` | `int` | Unixタイムスタンプ |
| 価格 | `DECIMAL(10,2)` | `float` | 通貨値 |
| JSON | `JSON` | `array` | 構造化データ |

### エンティティスキーマの例

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) NOT NULL COMMENT 'ULID identifier',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT,
    `summary` TEXT,
    `status` ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED,
    `views` INT UNSIGNED DEFAULT 0,
    `is_featured` TINYINT(1) DEFAULT 0,
    `published_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_slug` (`slug`),
    KEY `idx_status` (`status`),
    KEY `idx_author` (`author_id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_published` (`published_at`),
    KEY `idx_featured` (`is_featured`, `published_at`),

    CONSTRAINT `fk_article_author`
        FOREIGN KEY (`author_id`) REFERENCES `{PREFIX}_users` (`uid`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_article_category`
        FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## リレーションシップ

### 1対多

```sql
-- カテゴリー（1つ）
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- 記事（多数）
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### 多対多

```sql
-- 記事
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- タグ
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- ジャンクション表
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### 自己参照（階層）

```sql
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) COMMENT 'Materialized path: /1/5/12/',
    `depth` TINYINT UNSIGNED DEFAULT 0,

    KEY `idx_parent` (`parent_id`),
    KEY `idx_path` (`path`(255)),

    FOREIGN KEY (`parent_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL
);
```

## インデックス戦略

### インデックスを付けるとき

| シナリオ | インデックス型 |
|----------|-----------|
| 主キー | PRIMARY |
| ユニーク制約 | UNIQUE |
| 外部キー | Regular KEY |
| WHERE句の列 | Regular KEY |
| ORDER BY列 | Regular KEY |
| フルテキスト検索 | FULLTEXT |

### 複合インデックス

順序が重要 - 最も選別的な列を最初に:

```sql
-- 良い例: WHERE status = 'published' ORDER BY created_atに一致
KEY `idx_status_created` (`status`, `created_at`)

-- クエリ最適化
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### カバーするインデックス

クエリ対象のすべての列を含めて、テーブル検索を回避:

```sql
-- カバー: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## マイグレーション

### マイグレーションファイル構造

```php
// migrations/001_create_articles.php
<?php

return new class {
    public function up(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');

        $sql = "CREATE TABLE IF NOT EXISTS `{$prefix}` (
            `id` VARCHAR(26) NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$prefix}`");
    }
};
```

### 列の追加

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## ベストプラクティス

1. **InnoDB を使用** - トランザクションと外部キーをサポート
2. **UTF8MB4** - 絵文字を含む完全なUnicodeサポート
3. **NOT NULL** - NULLableな列ではなくデフォルトを使用
4. **適切な型** - 短い文字列にTEXTを使用しない
5. **スパースインデックス** - 各インデックスは書き込みを遅くする
6. **スキーマを文書化** - 列にCOMMENTを追加
7. **予約語を避ける** - 列名として`order`、`group`、`key`を使用しない

## 関連ドキュメント

- データベース操作 - クエリ実行
- ../../04-API-Reference/Database/Criteria - クエリ構築
- マイグレーション - スキーマバージョン管理
- ../../01-Getting-Started/Configuration/Performance-Optimization - クエリ最適化
