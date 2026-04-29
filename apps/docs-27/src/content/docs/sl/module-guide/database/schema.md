---
title: "Oblikovanje sheme baze podatkov"
---
## Pregled

Pravilna zasnova sheme baze podatkov je ključnega pomena za XOOPS zmogljivost in vzdržljivost modula. Ta vodnik pokriva najboljše prakse za načrtovanje tabel, relacije, indeksiranje in selitve.

## Dogovori o poimenovanju tabel

### Standardni format
```
{prefix}_{modulename}_{tablename}
```
Primeri:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (razvodna miza)

### V datotekah sheme

Uporabite nadomestno oznako `{PREFIX}`:
```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```
## Vrste stolpcev

### Priporočene vrste

| Podatki | Vrsta MySQL | PHP Vrsta | Opis |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID identifikatorji |
| ID (samodejno) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Zaporedni ID-ji |
| Kratko besedilo | `VARCHAR(n)` | `string` | Do 255 znakov |
| Dolgo besedilo | `TEXT` | `string` | Neomejeno besedilo |
| Obogateno besedilo | `MEDIUMTEXT` | `string` | HTML vsebina |
| Boolean | `TINYINT(1)` | `bool` | True/false |
| Enum | `ENUM(...)` | `string` | Fiksne možnosti |
| Datum | `DATE` | `DateTimeImmutable` | Samo datum |
| DatumUra | `DATETIME` | `DateTimeImmutable` | Datum in čas |
| Časovni žig | `INT UNSIGNED` | `int` | Časovni žig Unix |
| Cena | `DECIMAL(10,2)` | `float` | Valutne vrednosti |
| JSON | `JSON` | `array` | Strukturirani podatki |

### Primer sheme entitete
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

### Eden proti mnogo
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
### Veliko proti mnogo
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
### Samosklicevanje (hierarhija)
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

### Kdaj indeksirati

| Scenarij | Vrsta indeksa |
|----------|-----------|
| Primarni ključ | PRIMARY |
| Edinstvena omejitev | UNIQUE |
| Tuji ključ | Redno KEY |
| WHERE stolpec klavzule | Redno KEY |
| ORDER BY stolpec | Redno KEY |
| Iskanje po celotnem besedilu | FULLTEXT |

### Sestavljeni indeksi

Vrstni red je pomemben - najprej najizbirnejši stolpec:
```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```
### Pokrivanje indeksov

Vključite vse poizvedovane stolpce, da se izognete iskanju v tabeli:
```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```
## Migracije

### Struktura datoteke za selitev
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
### Dodajanje stolpcev
```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```
## Najboljše prakse

1. **Uporabi InnoDB** – podpira transakcije in tuje ključe
2. **UTF8MB4** - Popolna podpora za Unicode, vključno z emodžiji
3. **NOT NULL** - Uporabite privzete namesto ničelnih stolpcev, kadar je to mogoče
4. **Ustrezne vrste** - ne uporabljajte TEXT za kratke nize
5. **Indeksirajte zmerno** - Vsak indeks upočasni pisanje
6. **Shema dokumenta** - dodajte COMMENT v stolpce
7. **Izogibajte se rezerviranim besedam** - Ne uporabljajte `order`, `group`, `key` kot imena stolpcev

## Povezana dokumentacija

- ../Database-Operations - Izvedba poizvedbe
- ../../04-API-Reference/Database/Criteria - Zgradba poizvedbe
- Migracije - Verzija sheme
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimizacija poizvedb