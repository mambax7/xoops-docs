---
title: "Datenbankschemad-Design"
---

## Übersicht

Ein ordnungsgemäßes Datenbankschemad-Design ist für die Leistung und Wartbarkeit von XOOPS-Modulen entscheidend. Dieser Leitfaden behandelt Best Practices für Tabellendesign, Beziehungen, Indizierung und Migrationen.

## Tabellenbenennungskonventionen

### Standardformat

```
{prefix}_{modulename}_{tablename}
```

Beispiele:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (Übergangstabelle)

### In Schemadateien

Verwenden Sie `{PREFIX}` Platzhalter:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Spaltentypen

### Empfohlene Typen

| Daten | MySQL-Typ | PHP-Typ | Beschreibung |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | ULID-Kennungen |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sequenzielle IDs |
| Kurzer Text | `VARCHAR(n)` | `string` | Bis zu 255 Zeichen |
| Langer Text | `TEXT` | `string` | Unbegrenzter Text |
| Rich Text | `MEDIUMTEXT` | `string` | HTML-Inhalt |
| Boolean | `TINYINT(1)` | `bool` | Wahr/Falsch |
| Enum | `ENUM(...)` | `string` | Feste Optionen |
| Datum | `DATE` | `DateTimeImmutable` | Nur Datum |
| DateTime | `DATETIME` | `DateTimeImmutable` | Datum und Uhrzeit |
| Zeitstempel | `INT UNSIGNED` | `int` | Unix-Zeitstempel |
| Preis | `DECIMAL(10,2)` | `float` | Währungswerte |
| JSON | `JSON` | `array` | Strukturierte Daten |

### Beispiel für Entity-Schema

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

## Beziehungen

### Eins-zu-Viele

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

### Viele-zu-Viele

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

### Selbstreferenzierung (Hierarchie)

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

## Indizierungsstrategie

### Wann wird indiziert

| Szenario | Index-Typ |
|----------|-----------|
| Primärschlüssel | PRIMARY |
| Eindeutige Einschränkung | UNIQUE |
| Fremdschlüssel | Regular KEY |
| WHERE-Klauselspalte | Regular KEY |
| ORDER BY-Spalte | Regular KEY |
| Volltextsuche | FULLTEXT |

### Zusammengesetzte Indizes

Die Reihenfolge ist wichtig - selektivste Spalte zuerst:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Abdeckende Indizes

Fügen Sie alle abgefragten Spalten ein, um das Tabellen-Lookup zu vermeiden:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrationen

### Migrationsstruktur

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

### Spalten hinzufügen

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Best Practices

1. **InnoDB verwenden** - Unterstützt Transaktionen und Fremdschlüssel
2. **UTF8MB4** - Vollständige Unicode-Unterstützung einschließlich Emojis
3. **NOT NULL** - Verwenden Sie Standardwerte statt NULL-Spalten, falls möglich
4. **Geeignete Typen** - Verwenden Sie TEXT nicht für kurze Strings
5. **Sparsam indizieren** - Jeder Index verlangsamt Schreibvorgänge
6. **Schema dokumentieren** - Fügen Sie COMMENT zu Spalten hinzu
7. **Reservierte Wörter vermeiden** - Verwenden Sie nicht `order`, `group`, `key` als Spaltennamen

## Verwandte Dokumentation

- ../Database-Operations - Abfrageausführung
- ../../04-API-Reference/Database/Criteria - Abfrageerstellung
- Migrations - Schema-Versionierung
- ../../01-Getting-Started/Configuration/Performance-Optimization - Abfrageoptimierung
