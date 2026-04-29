---
title: “数据库架构设计”
---

## 概述

正确的数据库模式设计对于XOOPS模区块的性能和可维护性至关重要。本指南涵盖表设计、关系、索引和迁移的最佳实践。

## 表命名约定

### 标准格式

```
{prefix}_{modulename}_{tablename}
```

示例：
- `XOOPS_mymodule_articles`
- `XOOPS_mymodule_categories`
- `XOOPS_mymodule_article_category`（连接表）

### 在架构文件中

使用 `{PREFIX}` 占位符：

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## 列类型

### 推荐类型

|数据| MySQL 类型 | PHP 类型 |描述 |
|------|------------|----------|----------|
| ID (ULID) | `VARCHAR(26)`| `string`| ULID标识符|
| ID（自动）| `INT UNSIGNED AUTO_INCREMENT` | `int` |序列 ID |
|短文| `VARCHAR(n)` | `string` |最多 255 个字符 |
|长文本 | `TEXT` | `string` |无限文字|
|富文本| `MEDIUMTEXT` | `string` | HTML内容|
|布尔 | `TINYINT(1)` | `bool` | True/false |
|枚举 | `ENUM(...)` | `string` |固定选项|
|日期 | `DATE`| `DateTimeImmutable` |仅限日期 |
|日期时间 | `DATETIME` | `DateTimeImmutable` |日期和时间 |
|时间戳| `INT UNSIGNED` | `int` | Unix 时间戳 |
|价格| `DECIMAL(10,2)` | `float` |货币价值|
| JSON | `JSON` | `array` |结构化数据|

### 实体架构示例

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

## 关系

### 一-to-Many

```sql
-- Categories (one)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- Articles (many)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### 许多-to-Many

```sql
-- Articles
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- Tags
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- Junction table
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### 自我-Referencing（层次结构）

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

### 何时建立索引

|场景|指数类型 |
|----------|------------|
|主键| PRIMARY |
|唯一约束| UNIQUE |
|外键 |常规KEY|
| WHERE条款栏 |常规KEY |
| ORDER BY 栏 |常规KEY|
|完整-text搜索| FULLTEXT |

### 综合指数

顺序很重要 - 首先是最有选择性的列：

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### 覆盖索引

包括所有查询的列以避免表查找：

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## 迁移

### 迁移文件结构

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

## 最佳实践

1. **使用InnoDB** - 支持事务和外键
2. **UTF8MB4** - 完整的 Unicode 支持，包括表情符号
3. **NOT NULL** - 尽可能使用默认值而不是可空列
4. **适当的类型** - 不要将 TEXT 用于短字符串
5. **索引谨慎** - 每个索引都会减慢写入速度
6. **文档架构** - 将 COMMENT 添加到列
7. **避免保留字** - 不要使用 `order`、`group`、`key` 作为列名称

## 相关文档

- ../Database-Operations - 查询执行
- ../../04-API-Reference/Database/Criteria - 查询构建
- 迁移 - 架构版本控制
- ../../01-Getting-Started/Configuration/Performance-Optimization - 查询优化