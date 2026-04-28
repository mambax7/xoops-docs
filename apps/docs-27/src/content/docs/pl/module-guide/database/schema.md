---
title: "Projektowanie schematu bazy danych"
description: "Konwencje nazewnictwa, typy kolumn, relacje i indeksowanie"
---

## Przegląd

Właściwe projektowanie schematu bazy danych jest kluczowe dla wydajności i łatwości utrzymania modułów XOOPS. Ten przewodnik obejmuje najlepsze praktyki w projektowaniu tabel, relacjach, indeksowaniu i migracjach.

## Konwencje nazewnictwa tabel

### Standard Format

```
{prefix}_{modulename}_{tablename}
```

Przykłady:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (tabela pośrednia)

### W plikach schematu

Użyj symbolu zastępczego `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Typy kolumn

### Rekomendowane typy

| Data | MySQL Type | PHP Type | Opis |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Identyfikatory ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | Sekwencyjne identyfikatory |
| Krótki tekst | `VARCHAR(n)` | `string` | Do 255 znaków |
| Długi tekst | `TEXT` | `string` | Nieograniczony tekst |
| Tekst sformatowany | `MEDIUMTEXT` | `string` | Zawartość HTML |
| Boolean | `TINYINT(1)` | `bool` | Prawda/fałsz |
| Enum | `ENUM(...)` | `string` | Stałe opcje |
| Data | `DATE` | `DateTimeImmutable` | Tylko data |
| Data i godzina | `DATETIME` | `DateTimeImmutable` | Data i czas |
| Timestamp | `INT UNSIGNED` | `int` | Timestamp uniksowy |
| Cena | `DECIMAL(10,2)` | `float` | Wartości walutowe |
| JSON | `JSON` | `array` | Dane strukturalne |

### Przykład schematu encji

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

## Relacje

### Jeden do wielu

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

### Wiele do wielu

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

### Samoodwołujące się (hierarchia)

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

## Strategia indeksowania

### Kiedy indeksować

| Scenariusz | Typ indeksu |
|----------|-----------|
| Klucz podstawowy | PRIMARY |
| Ograniczenie unikatowości | UNIQUE |
| Klucz obcy | Regular KEY |
| Kolumna w klauzuli WHERE | Regular KEY |
| Kolumna w ORDER BY | Regular KEY |
| Wyszukiwanie pełnotekstowe | FULLTEXT |

### Indeksy złożone

Kolejność ma znaczenie - najpierw najselektywniejsza kolumna:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Indeksy pokrywające

Dołącz wszystkie kolumny w zapytaniu, aby uniknąć wyszukiwania w tabeli:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migracje

### Struktura pliku migracji

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

### Dodawanie kolumn

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Najlepsze praktyki

1. **Używaj InnoDB** - Obsługuje transakcje i klucze obcy
2. **UTF8MB4** - Pełna obsługa Unicode, w tym emoji
3. **NOT NULL** - Używaj wartości domyślnych zamiast kolumn nullable, gdy to możliwe
4. **Odpowiednie typy** - Nie używaj TEXT dla krótkich łańcuchów
5. **Indeksuj oszczędnie** - Każdy indeks spowalnia zapisy
6. **Dokumentuj schemat** - Dodaj COMMENT do kolumn
7. **Unikaj słów zarezerwowanych** - Nie używaj `order`, `group`, `key` jako nazw kolumn

## Powiązana dokumentacja

- ../Database-Operations - Wykonywanie zapytań
- ../../04-API-Reference/Database/Criteria - Budowanie zapytań
- Migracje - Wersjowanie schematu
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optymalizacja zapytań
