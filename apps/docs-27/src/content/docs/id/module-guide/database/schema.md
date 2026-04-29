---
title: "Desain Skema Basis Data"
---

## Ikhtisar

Desain skema database yang tepat sangat penting untuk kinerja dan pemeliharaan module XOOPS. Panduan ini mencakup praktik terbaik untuk desain tabel, hubungan, pengindeksan, dan migrasi.

## Konvensi Penamaan Tabel

### Format Standar

```
{prefix}_{modulename}_{tablename}
```

Contoh:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (tabel persimpangan)

### Dalam File Skema

Gunakan placeholder `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Jenis Kolom

### Jenis yang Direkomendasikan

| Data | Tipe MySQL | Tipe PHP | Deskripsi |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Pengidentifikasi ULID |
| ID (Otomatis) | `INT UNSIGNED AUTO_INCREMENT` | `int` | ID Berurutan |
| Teks Pendek | `VARCHAR(n)` | `string` | Hingga 255 karakter |
| Teks Panjang | `TEXT` | `string` | Teks tak terbatas |
| Teks Kaya | `MEDIUMTEXT` | `string` | Konten HTML |
| Boolean | `TINYINT(1)` | `bool` | True/false |
| Jumlah | `ENUM(...)` | `string` | Opsi tetap |
| Tanggal | `DATE` | `DateTimeImmutable` | Hanya tanggal |
| TanggalWaktu | `DATETIME` | `DateTimeImmutable` | Tanggal dan waktu |
| Stempel waktu | `INT UNSIGNED` | `int` | Stempel waktu Unix |
| Harga | `DECIMAL(10,2)` | `float` | Nilai mata uang |
| JSON | `JSON` | `array` | Data terstruktur |

### Contoh Skema Entitas

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

## Hubungan

### Satu-ke-Banyak

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

### Banyak-ke-Banyak

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

### Referensi Mandiri (Hierarki)

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

### Kapan Mengindeks

| Skenario | Jenis Indeks |
|----------|-----------|
| Kunci utama | UTAMA |
| Batasan unik | UNIK |
| Kunci asing | KUNCI Reguler |
| Kolom klausa WHERE | KUNCI Reguler |
| kolom ORDER BERDASARKAN | KUNCI Reguler |
| Pencarian teks lengkap | TEKS LENGKAP |

### Indeks Komposit

Urutan penting - kolom paling selektif terlebih dahulu:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Meliputi Indeks

Sertakan semua kolom yang ditanyakan untuk menghindari pencarian tabel:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrasi

### Struktur File Migrasi

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

### Menambahkan Kolom

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Praktik Terbaik

1. **Gunakan InnoDB** - Mendukung transaksi dan kunci asing
2. **UTF8MB4** - Dukungan Unicode penuh termasuk emoji
3. **NOT NULL** - Gunakan kolom default alih-alih kolom yang dapat dibatalkan jika memungkinkan
4. **Jenis yang Sesuai** - Jangan gunakan TEXT untuk string pendek
5. **Indeks Hemat** - Setiap indeks memperlambat penulisan
6. **Skema Dokumen** - Tambahkan KOMENTAR ke kolom
7. **Hindari Kata-kata Khusus** - Jangan gunakan `order`, `group`, `key` sebagai nama kolom

## Dokumentasi Terkait

- ../Database-Operations - Eksekusi kueri
- ../../04-API-Reference/Database/Criteria - Pembuatan kueri
- Migrasi - Pembuatan versi skema
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimasi kueri
