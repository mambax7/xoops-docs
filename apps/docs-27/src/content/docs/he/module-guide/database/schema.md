---
title: "עיצוב סכמת מסד נתונים"
---
## סקירה כללית

עיצוב נכון של סכימת מסד נתונים הוא חיוני לביצועים ולתחזוקה של מודול XOOPS. מדריך זה מכסה שיטות עבודה מומלצות לעיצוב טבלה, מערכות יחסים, אינדקס והגירות.

## מוסכמות מתן שמות לטבלה

### פורמט סטנדרטי
```
{prefix}_{modulename}_{tablename}
```
דוגמאות:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (טבלת צומת)

### בקבצי סכימה

השתמש במציין מיקום של `{PREFIX}`:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## סוגי עמודות

### סוגים מומלצים

| נתונים | MySQL סוג | PHP סוג | תיאור |
|------|--------|--------|------------|
| מזהה (ULID) | `VARCHAR(26)` | `string` | ULID מזהים |
| מזהה (אוטומטי) | `INT UNSIGNED AUTO_INCREMENT` | `int` | מזהים עוקבים |
| טקסט קצר | `VARCHAR(n)` | `string` | עד 255 תווים |
| טקסט ארוך | `TEXT` | `string` | טקסט ללא הגבלה |
| טקסט עשיר | `MEDIUMTEXT` | `string` | HTML תוכן |
| בוליאנית | `TINYINT(1)` | `bool` | True/false |
| Enum | `ENUM(...)` | `string` | אפשרויות קבועות |
| תאריך | `DATE` | `DateTimeImmutable` | תאריך בלבד |
| תאריך ושעה | `DATETIME` | `DateTimeImmutable` | תאריך ושעה |
| חותמת זמן | `INT UNSIGNED` | `int` | חותמת זמן של יוניקס |
| מחיר | `DECIMAL(10,2)` | `float` | ערכי מטבע |
| JSON | `JSON` | `array` | נתונים מובנים |

### דוגמה לסכימת ישויות
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
## מערכות יחסים

### אחד לרבים
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
### רבים-לרבים
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
### התייחסות עצמית (היררכיה)
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
## אסטרטגיית אינדקס

### מתי לאינדקס

| תרחיש | סוג אינדקס |
|--------|--------|
| מפתח ראשי | PRIMARY |
| אילוץ ייחודי | UNIQUE |
| מפתח זר | רגיל KEY |
| WHERE עמודת סעיף | רגיל KEY |
| ORDER עמודת BY | רגיל KEY |
| חיפוש בטקסט מלא | FULLTEXT |

### אינדקסים מרוכבים

סדר חשוב - העמודה הסלקטיבית ביותר תחילה:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### מכסה אינדקסים

כלול את כל העמודות שנשאלו כדי להימנע מחיפוש טבלה:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## הגירות

### מבנה קבצי הגירה
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
### הוספת עמודות
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## שיטות עבודה מומלצות

1. **השתמש ב-InnoDB** - תומך בעסקאות ובמפתחות זרים
2. **UTF8MB4** - תמיכה מלאה ביוניקוד כולל אימוג'ים
3. **NOT NULL** - השתמש בברירות מחדל במקום עמודות ניתנות לריק במידת האפשר
4. **סוגים מתאימים** - אל תשתמש ב-TEXT עבור מיתרים קצרים
5. **אינדקס במשורה** - כל מדד מאט את הכתיבה
6. **סכימת מסמכים** - הוסף COMMENT לעמודות
7. **הימנע ממילים שמורות** - אל תשתמש ב-`order`, `group`, `key` בתור שמות עמודות

## תיעוד קשור

- ../Database-Operations - ביצוע שאילתה
- ../../04-API-Reference/Database/Criteria - בניין שאילתה
- העברות - גרסאות סכימה
- ../../01-Getting-Started/Configuration/Performance-Optimization - אופטימיזציה של שאילתות