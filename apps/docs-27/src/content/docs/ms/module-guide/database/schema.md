---
title: "Reka Bentuk Skema Pangkalan Data"
---
## Gambaran Keseluruhan

Reka bentuk skema pangkalan data yang betul adalah penting untuk XOOPS prestasi modul dan kebolehselenggaraan. Panduan ini merangkumi amalan terbaik untuk reka bentuk jadual, perhubungan, pengindeksan dan migrasi.

## Konvensyen Penamaan Jadual

### Format Standard
```
{prefix}_{modulename}_{tablename}
```
Contoh:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (jadual simpang)

### Dalam Fail Skema

Gunakan pemegang tempat `{PREFIX}`:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## Jenis Lajur

### Jenis Disyorkan

| Data | Jenis MySQL | PHP Jenis | Penerangan |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID pengecam |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | ID Berjujukan |
| Teks Pendek | `VARCHAR(n)` | `string` | Sehingga 255 aksara |
| Teks Panjang | `TEXT` | `string` | Teks tanpa had |
| Teks Kaya | `MEDIUMTEXT` | `string` | HTML kandungan |
| Boolean | `TINYINT(1)` | `bool` | True/false |
| Enum | `ENUM(...)` | `string` | Pilihan tetap |
| Tarikh | `DATE` | `DateTimeImmutable` | Tarikh sahaja |
| TarikhMasa | `DATETIME` | `DateTimeImmutable` | Tarikh dan masa |
| Cap masa | `INT UNSIGNED` | `int` | Cap masa Unix |
| Harga | `DECIMAL(10,2)` | `float` | Nilai mata wang |
| JSON | `JSON` | `array` | Data berstruktur |

### Contoh Skema Entiti
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
## Perhubungan

### Satu-ke-Ramai
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
### Banyak-ke-Ramai
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
### Rujukan Kendiri (Hierarki)
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
## Strategi Pengindeksan

### Bila hendak Indeks

| Senario | Jenis Indeks |
|----------|-----------|
| Kunci utama | PRIMARY |
| Kekangan unik | UNIQUE |
| Kunci asing | Biasa KEY |
| WHERE lajur klausa | Biasa KEY |
| ORDER OLEH lajur | Biasa KEY |
| Carian teks penuh | FULLTEXT |

### Indeks Komposit

Urusan pesanan - lajur paling terpilih dahulu:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### Meliputi Indeks

Sertakan semua lajur yang ditanya untuk mengelakkan carian jadual:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## Penghijrahan

### Struktur Fail Migrasi
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
### Menambah Lajur
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## Amalan Terbaik

1. **Gunakan InnoDB** - Menyokong urus niaga dan kunci asing
2. **UTF8MB4** - Sokongan Unicode penuh termasuk emoji
3. **NOT NULL** - Gunakan lalai dan bukannya lajur boleh batal apabila boleh
4. **Jenis yang Sesuai** - Jangan gunakan TEXT untuk rentetan pendek
5. **Indeks Sedikit** - Setiap indeks melambatkan penulisan
6. **Skema Dokumen** - Tambahkan COMMENT pada lajur
7. **Elakkan Perkataan Terpelihara** - Jangan gunakan `order`, `group`, `key` sebagai nama lajur

## Dokumentasi Berkaitan

- ../Operasi Pangkalan Data - Pelaksanaan pertanyaan
- ../../04-API-Reference/Database/Criteria - Bangunan pertanyaan
- Migrasi - Pemberian versi skema
- ../../01-Getting-Started/Configuration/Performance-Optimization - Pengoptimuman pertanyaan