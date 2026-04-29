---
title: "Návrh schématu databáze"
---

## Přehled

Správný návrh databázového schématu je zásadní pro výkon a údržbu modulu XOOPS. Tato příručka obsahuje osvědčené postupy pro návrh tabulek, vztahy, indexování a migrace.

## Konvence pojmenování tabulek

### Standardní formát

```
{prefix}_{modulename}_{tablename}
```

Příklady:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (spojovací stůl)

### V souborech schémat

Použít zástupný symbol `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Typy sloupců

### Doporučené typy

| Údaje | Typ MySQL | Typ PHP | Popis |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Identifikátory ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sekvenční ID |
| Krátký text | `VARCHAR(n)` | `string` | Až 255 znaků |
| Dlouhý text | `TEXT` | `string` | Neomezený text |
| RTF | `MEDIUMTEXT` | `string` | Obsah HTML |
| Boolean | `TINYINT(1)` | `bool` | True/false |
| Výčet | `ENUM(...)` | `string` | Pevné možnosti |
| Datum | `DATE` | `DateTimeImmutable` | Pouze datum |
| Datum a čas | `DATETIME` | `DateTimeImmutable` | Datum a čas |
| Časové razítko | `INT UNSIGNED` | `int` | Unix časové razítko |
| Cena | `DECIMAL(10,2)` | `float` | Hodnoty měn |
| JSON | `JSON` | `array` | Strukturovaná data |

### Příklad schématu entity

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

## Vztahy

### One-to-Many

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

### Many-to-Many

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

### Odkazování na sebe (hierarchie)

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

## Strategie indexování

### Kdy indexovat

| Scénář | Typ indexu |
|----------|-----------|
| Primární klíč | PRIMARY |
| Jedinečné omezení | UNIQUE |
| Cizí klíč | Běžné KEY |
| Sloupec klauzule WHERE | Běžné KEY |
| ORDER BY sloupec | Běžné KEY |
| Fulltextové vyhledávání | FULLTEXT |

### Složené indexy

Na pořadí záleží – nejselektivnější sloupec jako první:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Krycí indexy

Zahrňte všechny dotazované sloupce, abyste se vyhnuli vyhledávání v tabulce:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrace

### Struktura migračního souboru

```php
// migrations/001_create_articles.php
<?php

return new class {
    public function up(\XOOPSDatabase $db): void
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

    public function down(\XOOPSDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$prefix}`");
    }
};
```

### Přidávání sloupců

```php
// migrations/002_add_status_column.php
public function up(\XOOPSDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Nejlepší postupy

1. **Použijte InnoDB** - Podporuje transakce a cizí klíče
2. **UTF8MB4** – Plná podpora Unicode včetně emotikonů
3. **NOT NULL** – Pokud je to možné, použijte místo sloupců s možnou hodnotou Null výchozí
4. **Vhodné typy** – Nepoužívejte TEXT pro krátké struny
5. **Indexujte šetrně** - Každý index zpomaluje zápis
6. **Schéma dokumentu** – Přidejte COMMENT do sloupců
7. **Vyhněte se vyhrazeným slovům** – Nepoužívejte jako názvy sloupců `order`, `group`, `key`

## Související dokumentace

- ../Database-Operations - Spuštění dotazu
- ../../04-API-Reference/Database/Criteria - Budova dotazu
- Migrace - Verze schématu
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimalizace dotazu