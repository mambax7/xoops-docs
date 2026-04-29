---
title: "Dizajn sheme baze podataka"
---
## Pregled

Pravilan dizajn sheme baze podataka ključan je za performanse i mogućnost održavanja XOOPS modula. Ovaj vodič pokriva najbolje prakse za dizajn tablice, odnose, indeksiranje i migracije.

## Konvencije o imenovanju tablica

### Standardni format

```
{prefix}_{modulename}_{tablename}
```

Primjeri:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (razvodni stol)

### U datotekama shema

Koristite rezervirano mjesto `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Vrste stupaca

### Preporučene vrste

| Podaci | MySQL Tip | PHP Vrsta | Opis |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID identifikatori |
| ID (automatski) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sekvencijalni ID-ovi |
| Kratki tekst | `VARCHAR(n)` | `string` | Do 255 znakova |
| Dugi tekst | `TEXT` | `string` | Neograničen tekst |
| Obogaćeni tekst | `MEDIUMTEXT` | `string` | HTML sadržaj |
| Booleov | `TINYINT(1)` | `bool` | Točno/netočno |
| Enum | `ENUM(...)` | `string` | Fiksne opcije |
| Datum | `DATE` | `DateTimeImmutable` | Samo datum |
| Datumvrijeme | `DATETIME` | `DateTimeImmutable` | Datum i vrijeme |
| Vremenska oznaka | `INT UNSIGNED` | `int` | Unix vremenska oznaka |
| Cijena | `DECIMAL(10,2)` | `float` | Valutne vrijednosti |
| JSON | `JSON` | `array` | Strukturirani podaci |

### Primjer sheme entiteta

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

## Odnosi

### Jedan prema više

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

### Mnogi prema mnogima

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

### Samoreferenciranje (hijerarhija)

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

## Strategija indeksiranja

### Kada indeksirati

| Scenarij | Vrsta indeksa |
|----------|-----------|
| Primarni ključ | PRIMARNO |
| Jedinstveno ograničenje | JEDINSTVENO |
| Strani ključ | Redovni KLJUČ |
| stupac odredbe WHERE | Redovni KLJUČ |
| RED PO stupcu | Redovni KLJUČ |
| Pretraživanje cijelog teksta | CJELI TEKST |

### Kompozitni indeksi

Redoslijed je bitan - prvo najselektivniji stupac:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Pokrivanje indeksa

Uključi sve upitane stupce kako bi se izbjeglo pretraživanje tablice:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migracije

### Struktura datoteke migracije

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

### Dodavanje stupaca

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Najbolji primjeri iz prakse

1. **Koristite InnoDB** - Podržava transakcije i strane ključeve
2. **UTF8MB4** - Puna podrška za Unicode uključujući emojije
3. **NOT NULL** - Koristite zadane umjesto stupaca koji mogu biti null kada je to moguće
4. **Odgovarajuće vrste** - Nemojte koristiti TEXT za kratke nizove
5. **Štedljivo indeksirajte** - Svaki indeks usporava pisanje
6. **Shema dokumenta** - Dodajte KOMENTAR stupcima
7. **Izbjegavajte rezervirane riječi** - Nemojte koristiti `order`, `group`, `key` kao nazive stupaca

## Povezana dokumentacija

- ../Database-Operations - Izvršenje upita
- ../../04-API-Reference/Database/Criteria - Izgradnja upita
- Migracije - Verzija sheme
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimizacija upita
