---
title: "طراحی طرحواره پایگاه داده"
---
## بررسی اجمالی

طراحی طرحواره پایگاه داده مناسب برای عملکرد و نگهداری ماژول XOOPS بسیار مهم است. این راهنما بهترین روش‌ها را برای طراحی جدول، روابط، نمایه‌سازی و مهاجرت پوشش می‌دهد.

## قراردادهای نامگذاری جدول

### فرمت استاندارد

```
{prefix}_{modulename}_{tablename}
```

مثال ها:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (میز اتصال)

### در فایل های طرحواره

از جای‌بان `{PREFIX}` استفاده کنید:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## انواع ستون

### انواع توصیه شده

| داده ها | نوع MySQL | نوع PHP | توضیحات |
|------|-----------|----------|-------------|
| شناسه (ULID) | `VARCHAR(26)` | `string` | شناسه های ULID |
| شناسه (خودکار) | `INT UNSIGNED AUTO_INCREMENT` | `int` | شناسه های متوالی |
| متن کوتاه | `VARCHAR(n)` | `string` | تا 255 کاراکتر |
| متن طولانی | `TEXT` | `string` | متن نامحدود |
| متن غنی | `MEDIUMTEXT` | `string` | محتوای HTML |
| بولی | `TINYINT(1)` | `bool` | True/false |
| شمارش | `ENUM(...)` | `string` | گزینه های ثابت |
| تاریخ | `DATE` | `DateTimeImmutable` | فقط تاریخ |
| تاریخ زمان | `DATETIME` | `DateTimeImmutable` | تاریخ و زمان |
| مهر زمان | `INT UNSIGNED` | `int` | مهر زمانی یونیکس |
| قیمت | `DECIMAL(10,2)` | `float` | ارزش ارز |
| JSON | `JSON` | `array` | داده های ساخت یافته |

### مثال طرح واره نهاد

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

## روابط

### یک به چند

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

### چند به چند

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

### ارجاع به خود (سلسله مراتب)

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

## استراتژی نمایه سازی

### چه زمانی باید نمایه شود

| سناریو | نوع شاخص |
|----------|-----------|
| کلید اصلی | اولیه |
| محدودیت منحصر به فرد | منحصر به فرد |
| کلید خارجی | کلید معمولی |
| ستون بند WHERE | کلید معمولی |
| ترتیب بر اساس ستون | کلید معمولی |
| جستجوی متن کامل | متن کامل |

### شاخص های ترکیبی

سفارش مهم است - انتخابی ترین ستون ابتدا:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### شاخص های پوششی

برای جلوگیری از جستجوی جدول، تمام ستون های پرس و جو را اضافه کنید:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## مهاجرت

### ساختار فایل مهاجرت

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

### اضافه کردن ستون ها

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## بهترین شیوه ها

1. **از InnoDB** استفاده کنید - از تراکنش ها و کلیدهای خارجی پشتیبانی می کند
2. **UTF8MB4** - پشتیبانی کامل از یونیکد از جمله ایموجی ها
3. **NOT NULL** - در صورت امکان به جای ستون های nullable از پیش فرض ها استفاده کنید
4. **انواع مناسب ** - از TEXT برای رشته های کوتاه استفاده نکنید
5. **شاخص اندک ** - هر شاخص سرعت نوشتن را کاهش می دهد
6. ** طرحواره سند ** - COMMENT را به ستون ها اضافه کنید
7. **از کلمات رزرو شده اجتناب کنید** - از `order`، `group`، `key` به عنوان نام ستون استفاده نکنید

## مستندات مرتبط

- ../Database-Operations - اجرای پرس و جو
- ../../04-API-Reference/Database/Criteria - ساختمان پرس و جو
- مهاجرت - نسخه بندی طرحواره
- ../../01-Getting-Started/Configuration/Performance-Optimization - بهینه سازی پرس و جو