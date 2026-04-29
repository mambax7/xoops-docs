---
title: "Databázové nástroje"
description: "Databázové nástroje XMF pro správu schémat, migraci a načítání dat"
---

Jmenný prostor `XMF\Database` poskytuje třídy pro zjednodušení úloh údržby databáze spojených s instalací a aktualizací modulů XOOPS. Tyto nástroje zpracovávají migrace schémat, úpravy tabulek a počáteční načítání dat.

## Přehled

Databázové nástroje zahrnují:

- **Tabulky** - Vytváření a provádění příkazů DDL pro úpravy tabulek
- **Migrate** - Synchronizace schématu databáze mezi verzemi modulů
- **TableLoad** - Načítání počátečních dat do tabulek

## XMF\Databáze\Tabulky

Třída `Tables` zjednodušuje vytváření a úpravy databázových tabulek. Vytváří pracovní frontu příkazů DDL (Data Definition Language), které se provádějí společně.

### Klíčové vlastnosti

- Načte aktuální schéma z existujících tabulek
- Fronty změny bez okamžitého provedení
- Při určování práce zohledňuje aktuální stav
- Automaticky zpracovává předponu tabulky XOOPS

### Začínáme

```php
use XMF\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Tabulkové operace

#### Přejmenujte tabulku

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Nastavení možností tabulky

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Pusťte stůl

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Zkopírujte tabulku

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Práce se sloupci

#### Přidat sloupec

```php
$tables = new Tables();
$tables->addTable('mymodule_items');

$tables->addColumn(
    'mymodule_items',
    'status',
    "TINYINT(1) NOT NULL DEFAULT '1'"
);

$tables->executeQueue();
```

#### Změňte sloupec

```php
$tables->useTable('mymodule_items');

// Change column attributes
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Rename and modify column
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### Získejte atributy sloupců

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Pusťte sloupec

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Práce s indexy

#### Získejte indexy tabulek

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Přidat primární klíč

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Přidat rejstřík

```php
$tables->useTable('mymodule_items');

// Simple index
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Unique index
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Composite index
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Index poklesu

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Zrušte všechny neprimární indexy

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Zrušte primární klíč

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Datové operace

#### Vložte data

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Without automatic quoting (for expressions)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### Aktualizujte data

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Smazat data

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Zkrátit tabulku

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Správa pracovní fronty

#### Provést frontu

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Resetovat frontu

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Přidat Raw SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Zpracování chyb

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## XMF\Database\Migrate

Třída `Migrate` zjednodušuje synchronizaci změn databáze mezi verzemi modulů. Rozšiřuje `Tables` o porovnání schémat a automatickou synchronizaci.

### Základní použití

```php
use XMF\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### V aktualizaci modulu

Obvykle se nazývá funkce modulu `xoops_module_pre_update_*`:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \XMF\Database\Migrate('mymodule');

    // Perform any pre-sync actions (renames, etc.)
    // ...

    // Synchronize schema
    return $migrate->synchronizeSchema();
}
```

### Získávání výpisů DDL

Pro velké databáze nebo migrace z příkazového řádku:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Akce před synchronizací

Některé změny vyžadují před synchronizací explicitní zpracování. Rozšiřte `Migrate` pro komplexní migrace:

```php
class MyModuleMigrate extends \XMF\Database\Migrate
{
    public function preSyncActions()
    {
        // Rename a table before sync
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Rename a column
        $this->useTable('mymodule_items');
        $this->alterColumn(
            'mymodule_items',
            'old_column',
            'VARCHAR(255) NOT NULL',
            'new_column'
        );
        $this->executeQueue();
    }
}

// Usage
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### Správa schémat

#### Získejte aktuální schéma

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Získejte cílové schéma

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Uložit aktuální schéma

Pro vývojáře modulů k zachycení schématu po změnách databáze:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Poznámka pro vývojáře:** Nejprve vždy proveďte změny v databázi a poté spusťte `saveCurrentSchema()`. Vygenerovaný soubor schématu ručně neupravujte.

## XMF\Database\TableLoad

Třída `TableLoad` zjednodušuje načítání počátečních dat do tabulek. Užitečné pro seedování tabulek s výchozími daty během instalace modulu.

### Načítání dat z polí

```php
use XMF\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'News', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Events', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Inserted {$count} rows";
```

### Načítání dat ze YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Formát YAML:

```yaml
-
  category_id: 1
  name: General
  weight: 0
-
  category_id: 2
  name: News
  weight: 10
```

### Extrahování dat

#### Počítání řádků

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Extrahovat řádky

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Ukládání dat do YAML

```php
// Save all data
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Save filtered data
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Save without certain columns
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### Zkrátit tabulku

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Kompletní příklad migrace

### xoops_version.php

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_settings'
];
```

### include/onupdate.php

```php
<?php
use XMF\Database\Migrate;
use XMF\Database\Tables;
use XMF\Database\TableLoad;

function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    // Create custom migrate class
    $migrate = new MyModuleMigrate('mymodule');

    // Handle version-specific migrations
    if ($previousVersion < 120) {
        // Version 1.2.0 renamed a table
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // Version 1.3.0 renamed a column
        $migrate->renameOldColumn();
    }

    // Synchronize schema
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Post-update data migrations
    if ($previousVersion < 130) {
        // Load new default settings
        TableLoad::loadTableFromYamlFile(
            'mymodule_settings',
            XOOPS_ROOT_PATH . '/modules/mymodule/sql/new_settings.yml'
        );
    }

    return true;
}

class MyModuleMigrate extends Migrate
{
    public function renameOldTable()
    {
        if ($this->useTable('mymodule_posts')) {
            $this->renameTable('mymodule_posts', 'mymodule_items');
            $this->executeQueue();
        }
    }

    public function renameOldColumn()
    {
        if ($this->useTable('mymodule_items')) {
            $this->alterColumn(
                'mymodule_items',
                'post_title',
                "VARCHAR(255) NOT NULL DEFAULT ''",
                'title'
            );
            $this->executeQueue();
        }
    }
}
```

## Reference API

### XMF\Databáze\Tabulky| Metoda | Popis |
|--------|-------------|
| `addTable($table)` | Načíst nebo vytvořit schéma tabulky |
| `useTable($table)` | Načíst pouze existující tabulku |
| `renameTable($table, $newName)` | Přejmenování tabulky fronty |
| `setTableOptions($table, $options)` | Změna možností tabulky fronty |
| `dropTable($table)` | Pokles tabulky fronty |
| `copyTable($table, $newTable, $withData)` | Kopie tabulky fronty |
| `addColumn($table, $column, $attributes)` | Přidání sloupce fronty |
| `alterColumn($table, $column, $attributes, $newName)` | Změna sloupce fronty |
| `getColumnAttributes($table, $column)` | Získat definici sloupce |
| `dropColumn($table, $column)` | Pokles sloupce fronty |
| `getTableIndexes($table)` | Získat definice indexu |
| `addPrimaryKey($table, $column)` | Primární klíč fronty |
| `addIndex($name, $table, $column, $unique)` | Index fronty |
| `dropIndex($name, $table)` | Pokles indexu fronty |
| `dropIndexes($table)` | Zařadit všechny indexové poklesy |
| `dropPrimaryKey($table)` | Pokles primárního klíče fronty |
| `insert($table, $columns, $quote)` | Vložení fronty |
| `update($table, $columns, $criteria, $quote)` | Aktualizace fronty |
| `delete($table, $criteria)` | Smazat frontu |
| `truncate($table)` | Zkrácení fronty |
| `executeQueue($force)` | Provádět operace ve frontě |
| `resetQueue()` | Vymazat frontu |
| `addToQueue($sql)` | Přidat raw SQL |
| `getLastError()` | Získat poslední chybovou zprávu |
| `getLastErrNo()` | Získat poslední chybový kód |

### XMF\Databáze\Migrace

| Metoda | Popis |
|--------|-------------|
| `__construct($dirname)` | Vytvořit pro modul |
| `synchronizeSchema()` | Synchronizovat databázi s cílem |
| `getSynchronizeDDL()` | Získejte výpisy DDL |
| `preSyncActions()` | Přepsat pro vlastní akce |
| `getCurrentSchema()` | Získat aktuální schéma databáze |
| `getTargetDefinitions()` | Získat cílové schéma |
| `saveCurrentSchema()` | Uložit schéma pro vývojáře |

### XMF\Database\TableLoad

| Metoda | Popis |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Načíst z pole |
| `loadTableFromYamlFile($table, $file)` | Zátěž od YAML |
| `truncateTable($table)` | Prázdný stůl |
| `countRows($table, $criteria)` | Počítat řádky |
| `extractRows($table, $criteria, $skip)` | Extrahovat řádky |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Uložit do YAML |

## Viz také

- ../XMF-Framework - Přehled rámce
- ../Basics/XMF-Module-Helper - Pomocná třída modulu
- Metagen - Metadata utility

---

#xmf #databáze #migrace #schéma #tabulky #ddl