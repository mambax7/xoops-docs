---
title: "Progettazione dello Schema Database"
---

## Panoramica

Una corretta progettazione dello schema database è cruciale per la performance e la manutenibilità del modulo XOOPS. Questa guida copre le migliori pratiche per la progettazione delle tabelle, le relazioni, l'indicizzazione e le migrazioni.

## Convenzioni di Denominazione delle Tabelle

### Formato Standard

```
{prefix}_{modulename}_{tablename}
```

Esempi:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (junction table)

### Nei File di Schema

Usa il placeholder `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Tipi di Colonna

### Tipi Consigliati

| Data | MySQL Type | PHP Type | Descrizione |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Identificatori ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | ID sequenziali |
| Short Text | `VARCHAR(n)` | `string` | Fino a 255 caratteri |
| Long Text | `TEXT` | `string` | Testo illimitato |
| Rich Text | `MEDIUMTEXT` | `string` | Contenuto HTML |
| Boolean | `TINYINT(1)` | `bool` | Vero/falso |
| Enum | `ENUM(...)` | `string` | Opzioni fisse |
| Date | `DATE` | `DateTimeImmutable` | Solo data |
| DateTime | `DATETIME` | `DateTimeImmutable` | Data e ora |
| Timestamp | `INT UNSIGNED` | `int` | Unix timestamp |
| Price | `DECIMAL(10,2)` | `float` | Valori di valuta |
| JSON | `JSON` | `array` | Dati strutturati |

### Esempio di Schema di Entità

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

## Relazioni

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

### Self-Referencing (Gerarchia)

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

## Strategia di Indicizzazione

### Quando Indicizzare

| Scenario | Tipo di Indice |
|----------|-----------|
| Primary key | PRIMARY |
| Unique constraint | UNIQUE |
| Foreign key | Regular KEY |
| WHERE clause column | Regular KEY |
| ORDER BY column | Regular KEY |
| Full-text search | FULLTEXT |

### Indici Compositi

L'ordine è importante - colonna più selettiva prima:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Indici di Copertura

Includi tutte le colonne interrogate per evitare la ricerca in tabella:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrazioni

### Struttura del File di Migrazione

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

### Aggiunta di Colonne

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Migliori Pratiche

1. **Usa InnoDB** - Supporta transazioni e chiavi esterne
2. **UTF8MB4** - Supporto Unicode completo includendo emoji
3. **NOT NULL** - Usa predefiniti invece di colonne nullable quando possibile
4. **Tipi Appropriati** - Non usare TEXT per stringhe brevi
5. **Indicizza Raramente** - Ogni indice rallenta le scritture
6. **Documenta lo Schema** - Aggiungi COMMENT alle colonne
7. **Evita Parole Riservate** - Non usare `order`, `group`, `key` come nomi di colonna

## Documentazione Correlata

- ../Database-Operations - Esecuzione delle query
- ../../04-API-Reference/Database/Criteria - Query building
- Migrations - Versionamento dello schema
- ../../01-Getting-Started/Configuration/Performance-Optimization - Ottimizzazione delle query
