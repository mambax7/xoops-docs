---
title: "Databasemigraties"
---
## Overzicht

Databasemigraties bieden versiegestuurde, omkeerbare wijzigingen in uw databaseschema. Ze zorgen voor consistente databasestatussen in ontwikkelings-, staging- en productieomgevingen.

## Migratiestructuur

### Bestandsnaamgeving

```
migrations/
├── 001_create_articles_table.php
├── 002_add_status_column.php
├── 003_create_categories_table.php
├── 004_add_indexes.php
└── 005_add_foreign_keys.php
```

### Migratieklasse

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

## Algemene bewerkingen

### Kolommen toevoegen

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

### Kolommen wijzigen

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

### Indexen toevoegen

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

### Buitenlandse sleutels

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

## Migratie Runner

### Migraties uitvoeren

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

### Migratie Runner-klasse

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

## Beste praktijken

1. **Eén wijziging per migratie** - Houd migraties gefocust
2. **Schrijf methoden altijd op** - Schakel terugdraaien in
3. **Test beide richtingen** - Controleer omhoog() en omlaag()
4. **Gebruik transacties** - Wikkel complexe migraties in
5. **Wijzig geen oude migraties** - maak in plaats daarvan nieuwe
6. **Back-up maken voordat u gaat rennen** - Vooral tijdens de productie

## Gerelateerde documentatie

- Database-Schema - Schemaontwerp
- Database-bewerkingen - Query-uitvoering
- ../xoops_version.php - Modulemanifest
- ../../07-XOOPS-4.0/XOOPS-4.0-Architectuur - Moderne architectuur