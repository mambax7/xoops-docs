---
title: "Databasemigrationer"
---

## Oversigt

Databasemigrationer giver versionskontrollerede, reversible ændringer til dit databaseskema. De sikrer ensartede databasetilstande på tværs af udviklings-, iscenesættelses- og produktionsmiljøer.

## Migrationsstruktur

### Filnavngivning

```
migrations/
├── 001_create_articles_table.php
├── 002_add_status_column.php
├── 003_create_categories_table.php
├── 004_add_indexes.php
└── 005_add_foreign_keys.php
```

### Migrationsklasse

```php
<?php
// migrations/001_create_articles_table.php

declare(strict_types=1);

return new class {
    public function up(\XoopsDatabase $db): void
    {
        $table = $db->prefix('mymodule_articles');

        $sql = "CREATE TABLE IF NOT EXISTS `{$table}` (
            `id` VARCHAR(26) NOT NULL COMMENT 'ULID identifier',
            `title` VARCHAR(255) NOT NULL,
            `content` MEDIUMTEXT,
            `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
            `author_id` INT UNSIGNED NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_status` (`status`),
            KEY `idx_author` (`author_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $table = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$table}`");
    }
};
```

## Fælles operationer

### Tilføjelse af kolonner

```php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');

    // Add single column
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `views` INT UNSIGNED DEFAULT 0 AFTER `status`");

    // Add multiple columns
    $db->queryF("ALTER TABLE `{$table}`
        ADD COLUMN `summary` TEXT AFTER `content`,
        ADD COLUMN `featured` TINYINT(1) DEFAULT 0 AFTER `views`");
}

public function down(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` DROP COLUMN `views`, DROP COLUMN `summary`, DROP COLUMN `featured`");
}
```

### Ændring af kolonner

```php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');

    // Change column type
    $db->queryF("ALTER TABLE `{$table}` MODIFY COLUMN `title` VARCHAR(500) NOT NULL");

    // Rename column
    $db->queryF("ALTER TABLE `{$table}` CHANGE `summary` `excerpt` TEXT");
}
```

### Tilføjelse af indekser

```php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');

    // Single column index
    $db->queryF("CREATE INDEX `idx_created` ON `{$table}` (`created_at`)");

    // Composite index
    $db->queryF("CREATE INDEX `idx_status_date` ON `{$table}` (`status`, `created_at`)");

    // Unique index
    $db->queryF("CREATE UNIQUE INDEX `idx_slug` ON `{$table}` (`slug`)");

    // Fulltext index
    $db->queryF("CREATE FULLTEXT INDEX `idx_search` ON `{$table}` (`title`, `content`)");
}

public function down(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("DROP INDEX `idx_created` ON `{$table}`");
    $db->queryF("DROP INDEX `idx_status_date` ON `{$table}`");
    $db->queryF("DROP INDEX `idx_slug` ON `{$table}`");
    $db->queryF("DROP INDEX `idx_search` ON `{$table}`");
}
```

### Fremmednøgler

```php
public function up(\XoopsDatabase $db): void
{
    $articles = $db->prefix('mymodule_articles');
    $categories = $db->prefix('mymodule_categories');

    $db->queryF("ALTER TABLE `{$articles}`
        ADD CONSTRAINT `fk_article_category`
        FOREIGN KEY (`category_id`) REFERENCES `{$categories}` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE");
}

public function down(\XoopsDatabase $db): void
{
    $articles = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$articles}` DROP FOREIGN KEY `fk_article_category`");
}
```

## Migration Runner

### Kører migreringer

```php
// include/onupdate.php

function xoops_module_update_mymodule(\XoopsModule $module, $previousVersion)
{
    $db = \XoopsDatabaseFactory::getDatabaseConnection();
    $migrator = new MigrationRunner($db, $module->dirname());

    try {
        $migrator->migrate();
        return true;
    } catch (\Exception $e) {
        $module->setErrors($e->getMessage());
        return false;
    }
}
```

### Migration Runner Class

```php
class MigrationRunner
{
    private string $migrationsPath;
    private string $table;

    public function __construct(
        private \XoopsDatabase $db,
        private string $moduleName
    ) {
        $this->migrationsPath = XOOPS_ROOT_PATH . "/modules/{$moduleName}/migrations";
        $this->table = $db->prefix("{$moduleName}_migrations");
    }

    public function migrate(): void
    {
        $this->createMigrationsTable();
        $executed = $this->getExecutedMigrations();

        foreach ($this->getPendingMigrations($executed) as $file) {
            $this->runMigration($file);
        }
    }

    private function runMigration(string $file): void
    {
        $migration = require $this->migrationsPath . '/' . $file;
        $migration->up($this->db);

        $this->db->queryF(
            "INSERT INTO `{$this->table}` (migration, executed_at) VALUES (?, NOW())",
            [$file]
        );
    }

    public function rollback(int $steps = 1): void
    {
        $migrations = $this->getExecutedMigrations();
        $toRollback = array_slice(array_reverse($migrations), 0, $steps);

        foreach ($toRollback as $file) {
            $migration = require $this->migrationsPath . '/' . $file;
            $migration->down($this->db);

            $this->db->queryF(
                "DELETE FROM `{$this->table}` WHERE migration = ?",
                [$file]
            );
        }
    }
}
```

## Bedste praksis

1. **Én ændring pr. migrering** - Hold migreringer fokuseret
2. **Skriv altid ned metoder** - Aktiver tilbagerulninger
3. **Test begge retninger** - Bekræft up() og down()
4. **Brug transaktioner** - Ombryd komplekse migreringer
5. **Rediger ikke gamle migreringer** - Opret nye i stedet
6. **Sikkerhedskopier før du kører** - Især i produktionen

## Relateret dokumentation

- Database-Skema - Skema design
- Database-Operations - Forespørgselsudførelse
- ../xoops_version.php - Modulmanifest
- ../../07-XOOPS-4.0/XOOPS-4.0-Architecture - Moderne arkitektur
