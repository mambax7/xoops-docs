---
title: "數據庫架構設計"
---

## 概述

適當的數據庫架構設計對於 XOOPS 模塊的性能和可維護性至關重要。本指南涵蓋表設計、關係、索引和遷移的最佳實踐。

## 表命名約定

### 標準格式

```
{prefix}_{modulename}_{tablename}
```

示例：
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (結合表)

### 在架構文件中

使用 `{PREFIX}` 佔位符：

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## 列類型

### 推薦的類型

| 數據 | MySQL 類型 | PHP 類型 | 描述 |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID 標識符 |
| ID (自動) | `INT UNSIGNED AUTO_INCREMENT` | `int` | 順序 ID |
| 短文本 | `VARCHAR(n)` | `string` | 最多 255 字符 |
| 長文本 | `TEXT` | `string` | 無限制文本 |
| 富文本 | `MEDIUMTEXT` | `string` | HTML 內容 |
| 布爾值 | `TINYINT(1)` | `bool` | 真/假 |
| 列舉 | `ENUM(...)` | `string` | 固定選項 |
| 日期 | `DATE` | `DateTimeImmutable` | 僅日期 |
| 日期時間 | `DATETIME` | `DateTimeImmutable` | 日期和時間 |
| 時間戳 | `INT UNSIGNED` | `int` | Unix 時間戳 |
| 價格 | `DECIMAL(10,2)` | `float` | 貨幣值 |
| JSON | `JSON` | `array` | 結構化數據 |

### 實體架構示例

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

## 關係

### 一對多

```sql
-- 分類 (一)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- 文章 (多)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### 多對多

```sql
-- 文章
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- 標籤
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- 結合表
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### 自引用 (層級)

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

## 索引策略

### 何時索引

| 場景 | 索引類型 |
|----------|-----------|
| 主鍵 | PRIMARY |
| 唯一約束 | UNIQUE |
| 外鍵 | 常規 KEY |
| WHERE 子句列 | 常規 KEY |
| ORDER BY 列 | 常規 KEY |
| 全文搜索 | FULLTEXT |

### 複合索引

順序很重要 - 最具選擇性的列優先：

```sql
-- 好的：匹配 WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- 查詢優化
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### 覆蓋索引

包含所有查詢的列以避免表查找：

```sql
-- 涵蓋：SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## 遷移

### 遷移文件結構

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

### 添加列

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## 最佳實踐

1. **使用 InnoDB** - 支持事務和外鍵
2. **UTF8MB4** - 完整的 Unicode 支持包括表情符號
3. **NOT NULL** - 在可能的情況下使用默認值而不是可空列
4. **適當的類型** - 不要為短字符串使用 TEXT
5. **謹慎索引** - 每個索引都會減慢寫入
6. **記錄架構** - 向列添加 COMMENT
7. **避免保留字** - 不要使用 `order`、`group`、`key` 作為列名

## 相關文檔

- ../Database-Operations - 查詢執行
- ../../04-API-Reference/Database/Criteria - 查詢構建
- Migrations - 架構版本控制
- ../../01-Getting-Started/Configuration/Performance-Optimization - 查詢優化
