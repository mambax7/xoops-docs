---
title: "تصميم مخطط قاعدة البيانات"
dir: rtl
lang: ar
---

## نظرة عامة

تصميم مخطط قاعدة البيانات الصحيح حاسم لأداء وحدة XOOPS وقابليتها للصيانة. يغطي هذا الدليل أفضل الممارسات لتصميم الجدول والعلاقات والفهرسة والترحيلات.

## اتفاقيات تسمية الجدول

### صيغة القياسية

```
{prefix}_{modulename}_{tablename}
```

أمثلة:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (جدول الوصل)

### في ملفات المخطط

استخدم عنصر نائب `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## أنواع الأعمدة

### الأنواع الموصى بها

| البيانات | نوع MySQL | نوع PHP | الوصف |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | معرفات ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | معرفات متسلسلة |
| نص قصير | `VARCHAR(n)` | `string` | حتى 255 حرفاً |
| نص طويل | `TEXT` | `string` | نص غير محدود |
| نص غني | `MEDIUMTEXT` | `string` | محتوى HTML |
| منطقي | `TINYINT(1)` | `bool` | صحيح/خطأ |
| تعداد | `ENUM(...)` | `string` | خيارات ثابتة |
| تاريخ | `DATE` | `DateTimeImmutable` | التاريخ فقط |
| التاريخ والوقت | `DATETIME` | `DateTimeImmutable` | التاريخ والوقت |
| طابع زمني | `INT UNSIGNED` | `int` | طابع زمني Unix |
| السعر | `DECIMAL(10,2)` | `float` | قيم العملة |
| JSON | `JSON` | `array` | بيانات منظمة |

### مثال مخطط الكيان

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) NOT NULL COMMENT 'معرف ULID',
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

## العلاقات

### واحد إلى متعدد

```sql
-- الفئات (واحد)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- المقالات (متعدد)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### متعدد إلى متعدد

```sql
-- المقالات
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- الوسوم
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- جدول الوصل
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### الإحالة الذاتية (الهرمية)

```sql
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) COMMENT 'المسار المادي: /1/5/12/',
    `depth` TINYINT UNSIGNED DEFAULT 0,

    KEY `idx_parent` (`parent_id`),
    KEY `idx_path` (`path`(255)),

    FOREIGN KEY (`parent_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL
);
```

## استراتيجية الفهرسة

### متى يتم الفهرسة

| السيناريو | نوع الفهرس |
|----------|-----------|
| المفتاح الأساسي | PRIMARY |
| قيد فريد | UNIQUE |
| المفتاح الأجنبي | المفتاح العادي |
| عمود في الشرط WHERE | المفتاح العادي |
| عمود في ORDER BY | المفتاح العادي |
| بحث النص الكامل | FULLTEXT |

### فهارس مركبة

ترتيب الأهمية - العمود الأكثر انتقائية أولاً:

```sql
-- جيد: يطابق WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- تحسين الاستعلام
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### تغطية الفهارس

قم بتضمين جميع أعمدة الاستعلام لتجنب البحث في الجدول:

```sql
-- يغطي: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## الترحيلات

### هيكل ملف الترحيل

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

### إضافة الأعمدة

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## أفضل الممارسات

1. **استخدم InnoDB** - يدعم المعاملات والمفاتيح الأجنبية
2. **UTF8MB4** - دعم Unicode الكامل بما فيه الرموز التعبيرية
3. **NOT NULL** - استخدم الافتراضيات بدلاً من الأعمدة القابلة للإلغاء عند الإمكان
4. **الأنواع المناسبة** - لا تستخدم TEXT للسلاسل القصيرة
5. **الفهرس بحذر** - كل فهرس يبطئ الكتابات
6. **وثق المخطط** - أضف COMMENT للأعمدة
7. **تجنب الكلمات المحجوزة** - لا تستخدم `order` و `group` و `key` كأسماء أعمدة

## الوثائق ذات الصلة

- ../Database-Operations - تنفيذ الاستعلام
- ../../04-API-Reference/Database/Criteria - بناء الاستعلام
- Migrations - إصدار المخطط
- ../../01-Getting-Started/Configuration/Performance-Optimization - تحسين الاستعلام
