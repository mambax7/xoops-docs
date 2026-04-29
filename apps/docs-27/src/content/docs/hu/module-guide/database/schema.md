---
title: "Adatbázis séma tervezés"
---
## Áttekintés

A megfelelő adatbázisséma-tervezés kulcsfontosságú a XOOPS modul teljesítménye és karbantarthatósága szempontjából. Ez az útmutató a táblatervezés, a kapcsolatok, az indexelés és az áttelepítés bevált gyakorlatait ismerteti.

## A táblázat elnevezési konvenciói

### Szabványos formátum

```
{prefix}_{modulename}_{tablename}
```

Példák:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (csatlakozóasztal)

### A Sémafájlokban

`{PREFIX}` helyőrző használata:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Oszloptípusok

### Ajánlott típusok

| Adatok | MySQL Típus | PHP Típus | Leírás |
|------|-----------|-----------|--------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID azonosítók |
| ID (Automatikus) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Soros azonosítók |
| Rövid szöveg | `VARCHAR(n)` | `string` | Legfeljebb 255 karakter |
| Hosszú szöveg | `TEXT` | `string` | Korlátlan szöveg |
| Rich Text | `MEDIUMTEXT` | `string` | HTML tartalom |
| logikai | `TINYINT(1)` | `bool` | True/false |
| Enum | `ENUM(...)` | `string` | Rögzített opciók |
| Dátum | `DATE` | `DateTimeImmutable` | Csak dátum |
| DátumTime | `DATETIME` | `DateTimeImmutable` | Dátum és idő |
| Időbélyeg | `INT UNSIGNED` | `int` | Unix időbélyeg |
| Ár | `DECIMAL(10,2)` | `float` | Devizaértékek |
| JSON | `JSON` | `array` | Strukturált adatok |

### Entitásséma példa

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

## Kapcsolatok

### Egy a sokhoz

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

### Sok-sok

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

### Önreferencia (hierarchia)

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

## Indexelési stratégia

### Mikor kell indexelni

| Forgatókönyv | Index típusa |
|----------|------------|
| Elsődleges kulcs | PRIMARY |
| Egyedi megkötés | UNIQUE |
| Idegen kulcs | Normál KEY |
| WHERE záradék oszlop | Normál KEY |
| ORDER BY oszlop | Normál KEY |
| Teljes szöveges keresés | FULLTEXT |

### Összetett indexek

A sorrend számít – a legszelektívebb oszlop először:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Indexek lefedése

Tartalmazza az összes lekérdezett oszlopot a táblázatkeresés elkerülése érdekében:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrációk

### Migrációs fájlszerkezet

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

### Oszlopok hozzáadása

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Bevált gyakorlatok

1. **Használja az InnoDB-t** - Támogatja a tranzakciókat és az idegen kulcsokat
2. **UTF8MB4** - Teljes Unicode támogatás, beleértve a hangulatjeleket
3. **NOT NULL** – Ha lehetséges, használjon alapértelmezett értékeket nullázható oszlopok helyett
4. **Megfelelő típusok** - Ne használja a TEXT rövid karakterláncokhoz
5. **Takarékos indexelés** - Minden index lassítja az írást
6. **Dokumentum séma** - COMMENT hozzáadása az oszlopokhoz
7. **Kerülje a fenntartott szavakat** – Ne használja a `order`, `group`, `key` oszlopokat

## Kapcsolódó dokumentáció

- ../Database-Operations - Lekérdezés végrehajtása
- ../../04-API-Reference/Database/Criteria - Lekérdezési épület
- Migrációk - Sémaverziók
- ../../01-Getting-Started/Configuration/Performance-Optimization - Lekérdezés optimalizálás
