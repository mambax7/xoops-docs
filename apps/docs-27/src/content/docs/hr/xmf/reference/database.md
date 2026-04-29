---
title: "Uslužni programi baze podataka"
description: "Uslužni programi baze podataka XMF za upravljanje shemama, migracije i učitavanje podataka"
---
`Xmf\Database` imenski prostor pruža classes za pojednostavljenje zadataka održavanja baze podataka povezanih s instaliranjem i ažuriranjem XOOPS modules. Ovi uslužni programi upravljaju migracijama shema, izmjenama tablica i početnim učitavanjem podataka.

## Pregled

Pomoćni programi baze podataka include:

- **Tablice** - Izrada i izvođenje DDL naredbi za modifikacije tablica
- **Migracija** - Sinkronizacija sheme baze podataka između verzija modula
- **TableLoad** - Učitavanje početnih podataka u tablice

## Xmf\Database\Tables

`Tables` class pojednostavljuje stvaranje i modificiranje tablica baze podataka. Gradi radni red DDL (Data Definition Language) naredbi koje se izvode zajedno.

### Ključne značajke

- Učitava trenutnu shemu iz postojećih tablica
- Promjene u redovima čekanja bez trenutnog izvršenja
- Razmatra trenutno stanje pri određivanju posla koji treba obaviti
- Automatski upravlja prefiksom tablice XOOPS

### Početak

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Tablične operacije

#### Preimenuj tablicu

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Postavite opcije stola

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Ispustite stol

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Kopiraj tablicu

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Rad sa stupcima

#### Dodajte stupac

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

#### Promjena stupca

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

#### Dobivanje atributa stupca

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Ispusti stupac

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Rad s indeksima

#### Dobivanje indeksa tablice

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Dodaj primarni ključ

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Dodaj indeks

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

#### Ispustite indeks

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Ispusti sve neprimarne indekse

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Ispusti primarni ključ

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Podatkovne operacije

#### Umetni podatke

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

#### Ažuriranje podataka

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Brisanje podataka

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Skrati tablicu

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Upravljanje čekanjem posla

#### Izvrši red čekanja

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Resetiraj red čekanja

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Dodajte sirovi SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Rješavanje grešaka

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

`Migrate` class pojednostavljuje sinkronizaciju promjena baze podataka između verzija modula. Proširuje `Tables` usporedbom shema i automatskom sinkronizacijom.

### Osnovna upotreba

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### U ažuriranju modula

Obično se poziva u funkciji `xoops_module_pre_update_*` modula:

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

### Dobivanje DDL izjava

Za velike baze podataka ili migracije putem naredbenog retka:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Radnje prije sinkronizacije

Neke promjene zahtijevaju izričito rukovanje prije sinkronizacije. Proširite `Migrate` za složene migracije:

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

### Upravljanje shemama

#### Dobijte trenutnu shemu

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Dobijte ciljnu shemu

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Spremi trenutnu shemu

Za programere modula za snimanje sheme nakon promjena baze podataka:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Napomena za razvojnog programera:** Uvijek prvo napravite promjene u bazi podataka, a zatim pokrenite `saveCurrentSchema()`. Nemojte ručno uređivati ​​generiranu datoteku sheme.

## Xmf\Database\TableLoad

`TableLoad` class pojednostavljuje učitavanje početnih podataka u tablice. Korisno za sijanje tablica sa zadanim podacima tijekom instalacije modula.

### Učitavanje podataka iz polja

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

### Učitavanje podataka iz YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Format YAML:
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

### Izdvajanje podataka

#### Broji redove

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Ekstrakt redaka

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Spremanje podataka u YAML

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

### Skrati tablicu

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Kompletan primjer migracije

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

## API Referenca

### Xmf\Database\Tables

| Metoda | Opis |
|--------|-------------|
| `addTable($table)` | Učitaj ili stvori shemu tablice |
| `useTable($table)` | Učitaj samo postojeću tablicu |
| `renameTable($table, $newName)` | Preimenovanje tablice reda |
| `setTableOptions($table, $options)` | Promjena opcija tablice čekanja |
| `dropTable($table)` | Ispuštanje tablice reda |
| `copyTable($table, $newTable, $withData)` | Kopija tablice reda |
| `addColumn($table, $column, $attributes)` | Dodavanje stupca reda |
| `alterColumn($table, $column, $attributes, $newName)` | Promjena stupca reda |
| `getColumnAttributes($table, $column)` | Dohvati definiciju stupca |
| `dropColumn($table, $column)` | Ispuštanje stupca reda |
| `getTableIndexes($table)` | Dohvatite definicije indeksa |
| `addPrimaryKey($table, $column)` | Primarni ključ čekanja |
| `addIndex($name, $table, $column, $unique)` | Indeks čekanja |
| `dropIndex($name, $table)` | Pad indeksa čekanja |
| `dropIndexes($table)` | Stavi u red čekanja sve padove indeksa |
| `dropPrimaryKey($table)` | Ispuštanje primarnog ključa reda |
| `insert($table, $columns, $quote)` | Umetanje reda |
| `update($table, $columns, $criteria, $quote)` | Ažuriranje reda |
| `delete($table, $criteria)` | Brisanje reda |
| `truncate($table)` | Red čekanja |
| `executeQueue($force)` | Izvrši operacije u redu |
| `resetQueue()` | Očisti red |
| `addToQueue($sql)` | Dodajte sirovi SQL |
| `getLastError()` | Dohvati posljednju poruku o pogrešci |
| `getLastErrNo()` | Dohvati zadnji kod pogreške |

### Xmf\Database\Migrate

| Metoda | Opis |
|--------|-------------|
| `__construct($dirname)` | Stvori za modul |
| `synchronizeSchema()` | Sinkronizacija baze podataka s ciljem |
| `getSynchronizeDDL()` | Dohvati DDL izjave |
| `preSyncActions()` | Nadjačavanje prilagođenih radnji |
| `getCurrentSchema()` | Dohvati trenutnu shemu baze podataka |
| `getTargetDefinitions()` | Dohvati ciljnu shemu |
| `saveCurrentSchema()` | Spremi shemu za programere |

### Xmf\Database\TableLoad

| Metoda | Opis |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Učitaj iz polja |
| `loadTableFromYamlFile($table, $file)` | Učitaj iz YAML |
| `truncateTable($table)` | Prazna tablica |
| `countRows($table, $criteria)` | Broji redove |
| `extractRows($table, $criteria, $skip)` | Ekstrahiraj retke |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Spremi u YAML |

## Vidi također

- ../XMF-Framework - Pregled okvira
- ../Basics/XMF-Module-Helper - Module helper class
- Metagen - Pomoćni programi za metapodatke

---

#xmf #baza podataka #migracija #shema #tablice #ddl
