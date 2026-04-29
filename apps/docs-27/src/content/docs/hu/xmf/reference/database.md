---
title: "Adatbázis segédprogramok"
description: "XMF adatbázis-segédprogramok sémakezeléshez, áttelepítéshez és adatbetöltéshez"
---
A `XMF\Database` névtér osztályokat biztosít a XOOPS modulok telepítésével és frissítésével kapcsolatos adatbázis-karbantartási feladatok egyszerűsítésére. Ezek a segédprogramok kezelik a sémaköltöztetéseket, a táblamódosításokat és a kezdeti adatbetöltést.

## Áttekintés

Az adatbázis-segédprogramok a következőket tartalmazzák:

- **Táblázatok** - DDL utasítások létrehozása és végrehajtása a tábla módosításához
- **Áttelepítés** - Adatbázisséma szinkronizálása a modulverziók között
- **TableLoad** - Kezdeti adatok betöltése táblákba

## XMF\Database\Tables

A `Tables` osztály leegyszerűsíti az adatbázistáblák létrehozását és módosítását. Munkasort hoz létre a DDL (Data Definition Language) utasításokból, amelyeket együtt hajtanak végre.

### Főbb jellemzők

- Az aktuális sémát betölti a meglévő táblákból
- A sorok azonnali végrehajtás nélkül változnak
- Az elvégzendő munka meghatározásakor figyelembe veszi a jelenlegi állapotot
- Automatikusan kezeli a XOOPS táblázat előtagját

### Első lépések

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Táblázatműveletek

#### Táblázat átnevezése

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Állítsa be a táblázat beállításait

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Dobj egy asztalt

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Táblázat másolása

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Munka oszlopokkal

#### Oszlop hozzáadása

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

#### Oszlop módosítása

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

#### Oszlopattribútumok lekérése

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Dobj egy oszlopot

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Indexekkel való munka

#### Táblázatindexek beszerzése

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Elsődleges kulcs hozzáadása

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Index hozzáadása

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

#### Drop Index

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Az összes nem elsődleges index elvetése

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Dobja el az elsődleges kulcsot

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Adatműveletek

#### Adatok beszúrása

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

#### Adatok frissítése

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Adatok törlése

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Táblázat csonkolása

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Munkasorkezelés

#### Végrehajtási sor

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Várólista visszaállítása

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Raw SQL hozzáadása

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Hibakezelés

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## XMF\Database\Migrate

A `Migrate` osztály leegyszerűsíti az adatbázis-módosítások szinkronizálását a modulverziók között. A `Tables`-t séma-összehasonlítással és automatikus szinkronizálással bővíti.

### Alapvető használat

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### A modul frissítésében

Általában a modul `xoops_module_pre_update_*` függvényében hívják:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Perform any pre-sync actions (renames, etc.)
    // ...

    // Synchronize schema
    return $migrate->synchronizeSchema();
}
```

### DDL nyilatkozatok lekérése

Nagy adatbázisok vagy parancssori migráció esetén:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Előszinkronizálási műveletek

Egyes változtatások kifejezett kezelést igényelnek a szinkronizálás előtt. A `Migrate` kiterjesztése összetett migrálásokhoz:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
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

### Sémakezelés

#### Az aktuális séma lekérése

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Get Target Schema

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Aktuális séma mentése

A modulfejlesztők számára a séma rögzítéséhez az adatbázis módosítása után:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Fejlesztői megjegyzés:** Először mindig az adatbázist módosítsa, majd futtassa a `saveCurrentSchema()` parancsot. Ne szerkessze kézzel az előállított sémafájlt.

## XMF\Database\TableLoad

A `TableLoad` osztály leegyszerűsíti a kezdeti adatok táblázatokba való betöltését. Hasznos a táblák alapértelmezett adatokkal történő vetéséhez a modul telepítése során.

### Adatok betöltése tömbökből

```php
use Xmf\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'News', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Events', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Inserted {$count} rows";
```

### Adatok betöltése a YAML-ból

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML formátum:

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

### Adatok kinyerése

#### Sorok számlálása

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Sorok kibontása

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Adatok mentése a YAML-ba

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

### Táblázat csonkítása

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Teljes áttelepítési példa

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
use Xmf\Database\Migrate;
use Xmf\Database\Tables;
use Xmf\Database\TableLoad;

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

## API Referencia

### XMF\Database\Tables| Módszer | Leírás |
|--------|--------------|
| `addTable($table)` | Táblaséma betöltése vagy létrehozása |
| `useTable($table)` | Csak a meglévő táblázat betöltése |
| `renameTable($table, $newName)` | Sortábla átnevezése |
| `setTableOptions($table, $options)` | A sortábla beállításai módosulnak |
| `dropTable($table)` | Várólista táblázat ledobása |
| `copyTable($table, $newTable, $withData)` | Sortábla másolat |
| `addColumn($table, $column, $attributes)` | Sor oszlop hozzáadása |
| `alterColumn($table, $column, $attributes, $newName)` | Soroszlop változás |
| `getColumnAttributes($table, $column)` | Oszlopdefiníció lekérése |
| `dropColumn($table, $column)` | Soroszlop csökkenése |
| `getTableIndexes($table)` | Indexdefiníciók lekérése |
| `addPrimaryKey($table, $column)` | Sor elsődleges kulcsa |
| `addIndex($name, $table, $column, $unique)` | Sorindex |
| `dropIndex($name, $table)` | Sorindex csökkenése |
| `dropIndexes($table)` | Sorba állítani az összes indexesést |
| `dropPrimaryKey($table)` | Sor elsődleges kulcs ledobása |
| `insert($table, $columns, $quote)` | Sor beszúrása |
| `update($table, $columns, $criteria, $quote)` | Várólista frissítése |
| `delete($table, $criteria)` | Sor törlése |
| `truncate($table)` | Várólista csonkolása |
| `executeQueue($force)` | Várólista műveletek végrehajtása |
| `resetQueue()` | Sor törlése |
| `addToQueue($sql)` | Nyers SQL |
| `getLastError()` | Az utolsó hibaüzenet lekérése |
| `getLastErrNo()` | Az utolsó hibakód lekérése |

### XMF\Database\Migrate

| Módszer | Leírás |
|--------|--------------|
| `__construct($dirname)` | Létrehozás a modulhoz |
| `synchronizeSchema()` | Adatbázis szinkronizálása a céllal |
| `getSynchronizeDDL()` | DDL kimutatások lekérése |
| `preSyncActions()` | Egyéni műveletek felülbírálása |
| `getCurrentSchema()` | Az aktuális adatbázisséma lekérése |
| `getTargetDefinitions()` | Célséma lekérése |
| `saveCurrentSchema()` | Séma mentése fejlesztőknek |

### XMF\Database\TableLoad

| Módszer | Leírás |
|--------|--------------|
| `loadTableFromArray($table, $data)` | Betöltés tömbből |
| `loadTableFromYamlFile($table, $file)` | Betöltés YAML |
| `truncateTable($table)` | Üres asztal |
| `countRows($table, $criteria)` | Sorok számlálása |
| `extractRows($table, $criteria, $skip)` | Sorok kibontása |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Mentés ide: YAML |

## Lásd még

- ../XMF-Framework - A keretrendszer áttekintése
- ../Basics/XMF-module-Helper - modul segítő osztály
- Metagen - Metaadat segédprogramok

---

#xmf #adatbázis #migráció #séma #táblák #ddl
