---
title: "database Şeması Tasarımı"
---
## Genel Bakış

Doğru database şeması tasarımı, XOOPS modülünün performansı ve bakımı açısından çok önemlidir. Bu kılavuz, tablo tasarımı, ilişkiler, dizin oluşturma ve geçişlere ilişkin en iyi uygulamaları kapsar.

## Tablo Adlandırma Kuralları

### Standart Format
```
{prefix}_{modulename}_{tablename}
```
Örnekler:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (bağlantı tablosu)

### Şema Dosyalarında

`{PREFIX}` yer tutucusunu kullanın:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## Sütun Türleri

### Önerilen Türler

| Veri | MySQL Tür | PHP Tür | Açıklama |
|------|-----------|----------|------------|
| Kimlik (ULID) | `VARCHAR(26)` | `string` | ULID tanımlayıcılar |
| Kimlik (Otomatik) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sıralı Kimlikler |
| Kısa Metin | `VARCHAR(n)` | `string` | 255 karaktere kadar |
| Uzun Metin | `TEXT` | `string` | Sınırsız metin |
| Zengin Metin | `MEDIUMTEXT` | `string` | HTML içerik |
| Boolean | `TINYINT(1)` | `bool` | True/false |
| Numaralandırma | `ENUM(...)` | `string` | Sabit seçenekler |
| Tarih | `DATE` | `DateTimeImmutable` | Yalnızca tarih |
| TarihSaat | `DATETIME` | `DateTimeImmutable` | Tarih ve saat |
| Zaman Damgası | `INT UNSIGNED` | `int` | Unix zaman damgası |
| Fiyat | `DECIMAL(10,2)` | `float` | Para birimi değerleri |
| JSON | `JSON` | `array` | Yapılandırılmış veriler |

### Varlık Şeması Örneği
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
## İlişkiler

### Bire Çok
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
### Çoktan Çoğa
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
### Kendine Referans Verme (Hiyerarşi)
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
## Dizin Oluşturma Stratejisi

### Ne Zaman İndekslenmeli

| Senaryo | Dizin Türü |
|----------|-----------|
| Birincil anahtar | PRIMARY |
| Benzersiz kısıtlama | UNIQUE |
| Yabancı anahtar | Normal KEY |
| WHERE cümleciği sütunu | Normal KEY |
| ORDER BY sütunu | Normal KEY |
| Tam metin araması | FULLTEXT |

### Bileşik Dizinler

Sıralama önemlidir; en seçici sütun ilk sıradadır:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### Kapsama İndeksleri

Tablo aramasını önlemek için sorgulanan tüm sütunları dahil edin:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## Göçler

### Taşıma Dosyası Yapısı
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
### Sütun Ekleme
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## En İyi Uygulamalar

1. **InnoDB kullanın** - İşlemleri ve yabancı anahtarları destekler
2. **UTF8MB4** - Emojiler dahil tam Unicode desteği
3. **NOT NULL** - Mümkün olduğunda null sütunlar yerine varsayılanları kullanın
4. **Uygun Türler** - Kısa dizeler için TEXT kullanmayın
5. **İdareli Dizin** - Her dizin yazma işlemini yavaşlatır
6. **Belge Şeması** - Sütunlara COMMENT ekleyin
7. **Ayrılmış Kelimelerden Kaçının** - Sütun adları olarak `order`, `group`, `key` kullanmayın

## İlgili Belgeler

- ../Database-Operations - Sorgu yürütme
- ../../04-API-Reference/Database/Criteria - Sorgu oluşturma
- Geçişler - Şema sürüm oluşturma
- ../../01-Getting-Started/Configuration/Performance-Optimization - Sorgu optimizasyonu