---
title: "Conception du schéma de base de données"
---

## Aperçu

Une conception appropriée du schéma de base de données est cruciale pour les performances et la maintenabilité des modules XOOPS. Ce guide couvre les meilleures pratiques en matière de conception de table, de relations, d'indexation et de migrations.

## Conventions de nommage des tables

### Format standard

```
{prefix}_{modulename}_{tablename}
```

Exemples:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (table de jonction)

### Dans les fichiers de schéma

Utiliser l'espace réservé `{PREFIX}` :

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Types de colonnes

### Types recommandés

| Données | Type MySQL | Type PHP | Description |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Identifiants ULID |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT` | `int` | IDs séquentiels |
| Texte court | `VARCHAR(n)` | `string` | Jusqu'à 255 caractères |
| Texte long | `TEXT` | `string` | Texte illimité |
| Texte riche | `MEDIUMTEXT` | `string` | Contenu HTML |
| Booléen | `TINYINT(1)` | `bool` | Vrai/faux |
| Énumération | `ENUM(...)` | `string` | Options fixes |
| Date | `DATE` | `DateTimeImmutable` | Date uniquement |
| DateTime | `DATETIME` | `DateTimeImmutable` | Date et heure |
| Timestamp | `INT UNSIGNED` | `int` | Timestamp Unix |
| Prix | `DECIMAL(10,2)` | `float` | Valeurs de devise |
| JSON | `JSON` | `array` | Données structurées |

### Exemple de schéma d'entité

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

## Relations

### Un-à-plusieurs

```sql
-- Catégories (un)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- Articles (plusieurs)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

### Plusieurs-à-plusieurs

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

-- Table de jonction
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

### Auto-référence (hiérarchie)

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

## Stratégie d'indexation

### Quand indexer

| Scénario | Type d'index |
|----------|-----------|
| Clé primaire | PRIMARY |
| Contrainte unique | UNIQUE |
| Clé étrangère | KEY régulier |
| Colonne clause WHERE | KEY régulier |
| Colonne ORDER BY | KEY régulier |
| Recherche en texte intégral | FULLTEXT |

### Index composites

L'ordre est important - colonne la plus sélective d'abord :

```sql
-- Bien : correspond à WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Optimisation de requête
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Index couvrant

Inclure toutes les colonnes interrogées pour éviter la recherche de table :

```sql
-- Couvre : SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Migrations

### Structure du fichier de migration

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

### Ajouter des colonnes

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Meilleures pratiques

1. **Utiliser InnoDB** - Prend en charge les transactions et les clés étrangères
2. **UTF8MB4** - Support Unicode complet incluant les emojis
3. **NOT NULL** - Utiliser les valeurs par défaut au lieu de colonnes nullables si possible
4. **Types appropriés** - Ne pas utiliser TEXT pour les chaînes courtes
5. **Indexer avec parcimonie** - Chaque index ralentit les écritures
6. **Documenter le schéma** - Ajouter un COMMENT aux colonnes
7. **Éviter les mots réservés** - Ne pas utiliser `order`, `group`, `key` comme noms de colonne

## Documentation connexe

- ../Opérations-de-base-de-données - Exécution de requête
- ../../04-API-Reference/Database/Critères - Construction de requête
- Migrations - Versioning du schéma
- ../../01-Getting-Started/Configuration/Optimisation-des-performances - Optimisation des requêtes
