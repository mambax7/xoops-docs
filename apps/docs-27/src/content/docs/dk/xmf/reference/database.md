---
title: "Databaseværktøjer"
description: "XMF databaseværktøjer til skemastyring, migreringer og dataindlæsning"
---

Navneområdet `Xmf\Database` giver klasser til at forenkle databasevedligeholdelsesopgaver forbundet med installation og opdatering af XOOPS-moduler. Disse hjælpeprogrammer håndterer skemamigreringer, tabelændringer og indledende dataindlæsning.

## Oversigt

Databaseværktøjerne inkluderer:

- **Tabeller** - Opbygning og udførelse af DDL-sætninger til tabelændringer
- **Migrér** - Synkronisering af databaseskema mellem modulversioner
- **TableLoad** - Indlæser indledende data i tabeller

## Xmf\Database\Tables

Klassen `Tables` forenkler oprettelse og ændring af databasetabeller. Det bygger en arbejdskø af DDL (Data Definition Language) sætninger, der udføres sammen.

### Nøglefunktioner

- Indlæser nuværende skema fra eksisterende tabeller
- Køændringer uden øjeblikkelig udførelse
- Tager den nuværende tilstand i betragtning, når det fastlægges, hvad der skal udføres
- Håndterer automatisk XOOPS tabelpræfiks

### Kom godt i gang

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Tabeloperationer

#### Omdøb en tabel

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Indstil tabelindstillinger

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Slip et bord

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Kopier en tabel

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Arbejde med kolonner

#### Tilføj en kolonne

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

#### Skift en kolonne

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

#### Hent kolonneattributter

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Slip en kolonne

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Arbejde med indekser

#### Hent tabelindekser

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Tilføj primær nøgle

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Tilføj indeks

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

#### Drop alle ikke-primære indekser

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Drop den primære nøgle

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Dataoperationer

#### Indsæt data

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

#### Opdater data

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Slet data

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Afkort tabel

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Arbejdskøstyring

#### Udfør kø

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Nulstil kø

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Tilføj rå SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Fejlhåndtering

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

Klassen `Migrate` forenkler synkronisering af databaseændringer mellem modulversioner. Det udvider `Tables` med skemasammenligning og automatisk synkronisering.

### Grundlæggende brug

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### I modulopdatering

Kaldes typisk i modulets `xoops_module_pre_update_*`-funktion:

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

### Henter DDL-erklæringer

For store databaser eller kommandolinjemigreringer:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Pre-Sync Actions

Nogle ændringer kræver eksplicit håndtering før synkronisering. Udvid `Migrate` til komplekse migreringer:

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

### Skemastyring

#### Få aktuelt skema

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Få målskema

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Gem aktuelt skema

For moduludviklere til at fange skema efter databaseændringer:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Udviklerbemærkning:** Foretag altid først ændringer i databasen, og kør derefter `saveCurrentSchema()`. Rediger ikke den genererede skemafil manuelt.

## Xmf\Database\TableLoad

Klassen `TableLoad` forenkler indlæsning af indledende data i tabeller. Nyttigt til at se tabeller med standarddata under modulinstallation.

### Indlæser data fra arrays

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

### Indlæser data fra YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML format:

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

### Udtræk af data

#### Tæl rækker

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Udtræk rækker

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Gemmer data til YAML

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

### Afkort tabel

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Komplet migreringseksempel

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

## API Reference

### Xmf\Database\Tables| Metode | Beskrivelse |
|--------|-------------|
| `addTable($table)` | Indlæs eller opret tabelskema |
| `useTable($table)` | Indlæs kun eksisterende tabel |
| `renameTable($table, $newName)` | Køtabel omdøb |
| `setTableOptions($table, $options)` | Kø tabel muligheder ændres |
| `dropTable($table)` | Købord fald |
| `copyTable($table, $newTable, $withData)` | Købord kopi |
| `addColumn($table, $column, $attributes)` | Kø kolonne tilføjelse |
| `alterColumn($table, $column, $attributes, $newName)` | Ændring af køkolonne |
| `getColumnAttributes($table, $column)` | Hent kolonnedefinition |
| `dropColumn($table, $column)` | Kø kolonne drop |
| `getTableIndexes($table)` | Hent indeksdefinitioner |
| `addPrimaryKey($table, $column)` | Primær nøgle i kø |
| `addIndex($name, $table, $column, $unique)` | Køindeks |
| `dropIndex($name, $table)` | Køindeksfald |
| `dropIndexes($table)` | Sæt alle indeksfald i kø |
| `dropPrimaryKey($table)` | Slip primærnøgle i kø |
| `insert($table, $columns, $quote)` | Køindsæt |
| `update($table, $columns, $criteria, $quote)` | Køopdatering |
| `delete($table, $criteria)` | Kø sletning |
| `truncate($table)` | Kø afkortes |
| `executeQueue($force)` | Udfør handlinger i kø |
| `resetQueue()` | Ryd kø |
| `addToQueue($sql)` | Tilføj rå SQL |
| `getLastError()` | Få sidste fejlmeddelelse |
| `getLastErrNo()` | Hent sidste fejlkode |

### Xmf\Database\Migrate

| Metode | Beskrivelse |
|--------|-------------|
| `__construct($dirname)` | Opret til modul |
| `synchronizeSchema()` | Synkroniser database til mål |
| `getSynchronizeDDL()` | Hent DDL-udsagn |
| `preSyncActions()` | Tilsidesæt for tilpassede handlinger |
| `getCurrentSchema()` | Hent aktuelt databaseskema |
| `getTargetDefinitions()` | Hent målskema |
| `saveCurrentSchema()` | Gem skema for udviklere |

### Xmf\Database\TableLoad

| Metode | Beskrivelse |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Indlæs fra array |
| `loadTableFromYamlFile($table, $file)` | Indlæs fra YAML |
| `truncateTable($table)` | Tomt bord |
| `countRows($table, $criteria)` | Tæl rækker |
| `extractRows($table, $criteria, $skip)` | Udtræk rækker |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Gem til YAML |

## Se også

- ../XMF-Framework - Rammeoversigt
- ../Basics/XMF-Module-Helper - Modulhjælperklasse
- Metagen - Metadataværktøjer

---

#xmf #database #migrering #skema #tabeller #ddl
