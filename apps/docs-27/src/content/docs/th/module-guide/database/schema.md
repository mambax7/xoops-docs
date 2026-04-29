---
title: "การออกแบบสคีมาฐานข้อมูล"
---
## ภาพรวม

การออกแบบสคีมาฐานข้อมูลที่เหมาะสมเป็นสิ่งสำคัญสำหรับประสิทธิภาพและการบำรุงรักษาโมดูล XOOPS คู่มือนี้ครอบคลุมแนวทางปฏิบัติที่ดีที่สุดสำหรับการออกแบบตาราง ความสัมพันธ์ การทำดัชนี และการย้ายข้อมูล

## แบบแผนการตั้งชื่อตาราง

### รูปแบบมาตรฐาน
```
{prefix}_{modulename}_{tablename}
```
ตัวอย่าง:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (ตารางทางแยก)

### ในไฟล์สคีมา

ใช้ตัวยึดตำแหน่ง `{PREFIX}`:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## ประเภทคอลัมน์

### ประเภทที่แนะนำ

| ข้อมูล | ประเภท MySQL | PHP ประเภท | คำอธิบาย |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID ตัวระบุ |
| ID (อัตโนมัติ) | `INT UNSIGNED AUTO_INCREMENT` | `int` | รหัสตามลำดับ |
| ข้อความสั้น | `VARCHAR(n)` | `string` | มากถึง 255 ตัวอักษร |
| ข้อความยาว | `TEXT` | `string` | ข้อความไม่จำกัด |
| Rich Text | `MEDIUMTEXT` | `string` | HTML เนื้อหา |
| บูลีน | `TINYINT(1)` | `bool` | จริง/เท็จ |
| อีนัม | `ENUM(...)` | `string` | ตัวเลือกคงที่ |
| วันที่ | `DATE` | `DateTimeImmutable` | วันที่เท่านั้น |
| วันที่และเวลา | `DATETIME` | `DateTimeImmutable` | วันที่และเวลา |
| ประทับเวลา | `INT UNSIGNED` | `int` | การประทับเวลา Unix |
| ราคา | `DECIMAL(10,2)` | `float` | ค่าสกุลเงิน |
| JSON | `JSON` | `array` | ข้อมูลที่มีโครงสร้าง |

### ตัวอย่างสคีมาเอนทิตี
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
## ความสัมพันธ์

### หนึ่งต่อหลาย
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
### หลายต่อหลาย
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
### การอ้างอิงตนเอง (ลำดับชั้น)
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
## กลยุทธ์การจัดทำดัชนี

### เมื่อใดที่จะจัดทำดัชนี

| สถานการณ์ | ประเภทดัชนี |
|----------|-----------|
| คีย์หลัก | PRIMARY |
| ข้อจำกัดเฉพาะ | UNIQUE |
| คีย์ต่างประเทศ | ปกติ KEY |
| WHERE คอลัมน์อนุประโยค | ปกติ KEY |
| ORDER BY คอลัมน์ | ปกติ KEY |
| ค้นหาข้อความแบบเต็ม | FULLTEXT |

### ดัชนีคอมโพสิต

เรื่องการสั่งซื้อ - คอลัมน์ที่เลือกมากที่สุดก่อน:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### ดัชนีที่ครอบคลุม

รวมคอลัมน์ที่สืบค้นทั้งหมดเพื่อหลีกเลี่ยงการค้นหาตาราง:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## การย้ายถิ่น

### โครงสร้างไฟล์การโยกย้าย
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
### การเพิ่มคอลัมน์
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **ใช้ InnoDB** - รองรับธุรกรรมและคีย์ต่างประเทศ
2. **UTF8MB4** - รองรับ Unicode เต็มรูปแบบ รวมถึงอิโมจิ
3. **NOT NULL** - ใช้ค่าเริ่มต้นแทนคอลัมน์ที่เป็นค่าว่างเมื่อเป็นไปได้
4. **ประเภทที่เหมาะสม** - อย่าใช้ TEXT สำหรับสตริงสั้น
5. **จัดทำดัชนีเท่าที่จำเป็น** - แต่ละดัชนีจะเขียนช้าลง
6. **สคีมาเอกสาร** - เพิ่ม COMMENT ลงในคอลัมน์
7. **หลีกเลี่ยงคำสงวน** - อย่าใช้ `order`, `group`, `key` เป็นชื่อคอลัมน์

## เอกสารที่เกี่ยวข้อง

- ../Database-Operations - การดำเนินการค้นหา
- ../../04-API-อ้างอิง/ฐานข้อมูล/เกณฑ์ - การสร้างแบบสอบถาม
- การย้ายข้อมูล - การกำหนดเวอร์ชันสคีมา
- ../../01-การเริ่มต้น/การกำหนดค่า/ประสิทธิภาพ-การเพิ่มประสิทธิภาพ - การเพิ่มประสิทธิภาพแบบสอบถาม