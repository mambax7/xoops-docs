---
title: "Database Schema Design"
---

## Oversigt

Korrekt databaseskemadesign er afgørende for XOOPS-modulets ydeevne og vedligeholdelse. Denne vejledning dækker bedste praksis for tabeldesign, relationer, indeksering og migreringer.

## Tabelnavnekonventioner

### Standardformat

```
{prefix}_{modulename}_{tablename}
```

Eksempler:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (krydsningstabel)

### I skemafiler

Brug `{PREFIX}` pladsholder:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Kolonnetyper

### Anbefalede typer

| Data | MySQL Type | PHP Type | Beskrivelse |
|------|--------|--------|------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID identifikatorer |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sekventielle ID'er |
| Kort tekst | `VARCHAR(n)` | `string` | Op til 255 tegn |
| Lang tekst | `TEXT` | `string` | Ubegrænset tekst |
| Rich Text | `MEDIUMTEXT` | `string` | HTML indhold |
| Boolean | `TINYINT(1)` | `bool` | Sandt/falsk |
| Enum | `ENUM(...)` | `string` | Faste muligheder |
| Dato | `DATE` | `DateTimeImmutable` | Kun dato |
| DateTime | `DATETIME` | `DateTimeImmutable` | Dato og tid |
| Tidsstempel | `INT UNSIGNED` | `int` | Unix tidsstempel |
| Pris | `DECIMAL(10,2)` | `float` | Valutaværdier |
| JSON | `JSON` | `array` | Strukturerede data |

### Eksempel på enhedsskema

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

## Relationer

### En-til-mange

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

### Mange-til-mange

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

### Selvreference (hierarki)

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

## Indekseringsstrategi

### Hvornår skal indekseres

| Scenarie | Indekstype |
|--------|--------|
| Primær nøgle | PRIMARY |
| Unik begrænsning | UNIQUE |
| Fremmednøgle | Almindelig KEY |
| WHERE klausul kolonne | Almindelig KEY |
| ORDER BY kolonne | Almindelig KEY |
| Fuldtekstsøgning | FULLTEXT |

### Sammensatte indekser

Ordren har betydning - den mest selektive kolonne først:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Dækker indekser

Inkluder alle søgte kolonner for at undgå tabelopslag:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrationer

### Migrationsfilstruktur

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

### Tilføjelse af kolonner

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Bedste praksis

1. **Brug InnoDB** - Understøtter transaktioner og fremmednøgler
2. **UTF8MB4** - Fuld Unicode-understøttelse inklusive emojis
3. **NOT NULL** - Brug standardindstillinger i stedet for nullbare kolonner, når det er muligt
4. **Relevante typer** - Brug ikke TEXT til korte strenge
5. **Indeks sparsomt** - Hvert indeks sænker skrivningerne
6. **Dokumentskema** - Føj COMMENT til kolonner
7. **Undgå reserverede ord** - Brug ikke `order`, `group`, `key` som kolonnenavne

## Relateret dokumentation

- ../Database-Operations - Forespørgselsudførelse
- ../../04-API-Reference/Database/Criteria - Forespørgselsbygning
- Migrationer - Skemaversionering
- ../../01-Getting-Started/Configuration/Performance-Optimization - Forespørgselsoptimering
