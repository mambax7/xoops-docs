---
title: "Ontwerp van databaseschema's"
---
## Overzicht

Een goed databaseschema-ontwerp is van cruciaal belang voor de prestaties en onderhoudbaarheid van de XOOPS-module. Deze handleiding behandelt best practices voor tabelontwerp, relaties, indexering en migraties.

## Naamgevingsconventies voor tabellen

### Standaardformaat

```
{prefix}_{modulename}_{tablename}
```

Voorbeelden:
-`xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (verbindingstabel)

### In schemabestanden

Gebruik de tijdelijke aanduiding `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Kolomtypen

### Aanbevolen typen

| Gegevens | MySQL-type | PHP-type | Beschrijving |
|-----|-----------|----------|------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID-identificaties |
| ID (automatisch) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Opeenvolgende ID's |
| Korte tekst | `VARCHAR(n)` | `string` | Maximaal 255 tekens |
| Lange tekst | `TEXT` | `string` | Onbeperkte tekst |
| Rijke tekst | `MEDIUMTEXT` | `string` | HTML-inhoud |
| Booleaans | `TINYINT(1)` | `bool` | Waar/onwaar |
| Enum | `ENUM(...)` | `string` | Vaste opties |
| Datum | `DATE` | `DateTimeImmutable` | Alleen datum |
| DatumTijd | `DATETIME` | `DateTimeImmutable` | Datum en tijd |
| Tijdstempel | `INT UNSIGNED` | `int` | Unix-tijdstempel |
| Prijs | `DECIMAL(10,2)` | `float` | Valutawaarden |
| JSON | `JSON` | `array` | Gestructureerde gegevens |

### Voorbeeld van entiteitsschema

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

## Relaties

### Eén-op-veel

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

### Veel-op-veel

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

### Zelfreferentie (hiërarchie)

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

## Indexeringsstrategie

### Wanneer indexeren

| Scenario | Indextype |
|----------|-----------|
| Primaire sleutel | PRIMARY |
| Unieke beperking | UNIQUE |
| Buitenlandse sleutel | Normaal KEY |
| WHERE-clausulekolom | Normaal KEY |
| ORDER BY-kolom | Normaal KEY |
| Zoeken in volledige tekst | FULLTEXT |

### Samengestelde indexen

Volgorde is belangrijk - meest selectieve kolom eerst:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Indexen bedekken

Neem alle opgevraagde kolommen op om het opzoeken van tabellen te voorkomen:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migraties

### Migratiebestandsstructuur

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

### Kolommen toevoegen

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Beste praktijken

1. **Gebruik InnoDB** - Ondersteunt transacties en externe sleutels
2. **UTF8MB4** - Volledige Unicode-ondersteuning inclusief emoji's
3. **NOT NULL** - Gebruik indien mogelijk standaardwaarden in plaats van null-kolommen
4. **Gepaste typen** - Gebruik TEXT niet voor korte strings
5. **Index spaarzaam** - Elke index vertraagt het schrijven
6. **Documentschema** - COMMENT toevoegen aan kolommen
7. **Vermijd gereserveerde woorden** - Gebruik `order`, `group`, `key` niet als kolomnamen

## Gerelateerde documentatie

- ../Database-Operations - Query-uitvoering
- ../../04-API-Referentie/Database/Criteria - Queryopbouw
- Migraties - Schemaversiebeheer
- ../../01-Getting-Started/Configuration/Performance-Optimization - Query-optimalisatie