---
title: "Databasehulpprogramma's"
description: "XMF databasehulpprogramma's voor schemabeheer, migraties en het laden van gegevens"
---
De naamruimte `Xmf\Database` biedt klassen om databaseonderhoudstaken te vereenvoudigen die verband houden met het installeren en bijwerken van XOOPS-modules. Deze hulpprogramma's verzorgen schemamigraties, tabelwijzigingen en het aanvankelijk laden van gegevens.

## Overzicht

De databasehulpprogramma's omvatten:

- **Tabellen** - DDL-instructies bouwen en uitvoeren voor tabelwijzigingen
- **Migreren** - Synchroniseren van databaseschema tussen moduleversies
- **TableLoad** - Initiële gegevens in tabellen laden

## Xmf\Database\Tables

De klasse `Tables` vereenvoudigt het maken en wijzigen van databasetabellen. Het bouwt een werkwachtrij op van DDL-instructies (Data Definition Language) die samen worden uitgevoerd.

### Belangrijkste kenmerken

- Laadt het huidige schema uit bestaande tabellen
- Wachtrijen veranderen zonder onmiddellijke uitvoering
- Houdt rekening met de huidige status bij het bepalen van het uit te voeren werk
- Verwerkt automatisch het tabelvoorvoegsel XOOPS

### Aan de slag

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Tabelbewerkingen

#### De naam van een tabel wijzigen

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Tabelopties instellen

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Zet een tafel neer

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Kopieer een tabel

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Werken met kolommen

#### Voeg een kolom toe

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

#### Een kolom wijzigen

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

#### Kolomkenmerken ophalen

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Zet een kolom neer

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Werken met indexen

#### Tabelindexen ophalen

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Primaire sleutel toevoegen

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Index toevoegen

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

#### Dalingsindex

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Verwijder alle niet-primaire indexen

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Primaire sleutel verwijderen

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Gegevensbewerkingen

#### Gegevens invoegen

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

#### Gegevens bijwerken

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Gegevens verwijderen

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Tabel afkappen

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Beheer van werkvoorraad

#### Wachtrij uitvoeren

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Wachtrij opnieuw instellen

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Raw SQL toevoegen

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Foutafhandeling

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

De klasse `Migrate` vereenvoudigt het synchroniseren van databasewijzigingen tussen moduleversies. Het breidt `Tables` uit met schemavergelijking en automatische synchronisatie.

### Basisgebruik

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### In module-update

Meestal aangeroepen in de `xoops_module_pre_update_*`-functie van de module:

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

### DDL-verklaringen ophalen

Voor grote databases of opdrachtregelmigraties:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Pre-synchronisatieacties

Sommige wijzigingen vereisen expliciete afhandeling vóór synchronisatie. Breid `Migrate` uit voor complexe migraties:

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

### Schemabeheer

#### Huidig schema ophalen

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Doelschema ophalen

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Huidig schema opslaan

Voor moduleontwikkelaars om een schema vast te leggen na databasewijzigingen:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Opmerking voor ontwikkelaars:** Breng altijd eerst wijzigingen aan in de database en voer vervolgens `saveCurrentSchema()` uit. Bewerk het gegenereerde schemabestand niet handmatig.

## Xmf\Database\TableLoad

De klasse `TableLoad` vereenvoudigt het laden van initiële gegevens in tabellen. Handig voor het seeden van tabellen met standaardgegevens tijdens de installatie van de module.

### Gegevens uit arrays laden

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

### Gegevens laden uit YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML-formaat:

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

### Gegevens extraheren

#### Tel rijen

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Rijen extraheren

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Gegevens opslaan in YAML

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

### Tabel afkappen

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Compleet migratievoorbeeld

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

## API-referentie

### Xmf\Database\Tables| Werkwijze | Beschrijving |
|--------|-------------|
| `addTable($table)` | Tabelschema laden of maken |
| `useTable($table)` | Alleen bestaande tabel laden |
| `renameTable($table, $newName)` | Naam van wachtrijtabel wijzigen |
| `setTableOptions($table, $options)` | Wachtrijtabelopties veranderen |
| `dropTable($table)` | Wachtrijtabel neerzetten |
| `copyTable($table, $newTable, $withData)` | Wachtrijtabel kopiëren |
| `addColumn($table, $column, $attributes)` | Toevoeging van wachtrijkolom |
| `alterColumn($table, $column, $attributes, $newName)` | Wijziging van wachtrijkolom |
| `getColumnAttributes($table, $column)` | Kolomdefinitie ophalen |
| `dropColumn($table, $column)` | Wachtrijkolom neerzetten |
| `getTableIndexes($table)` | Indexdefinities ophalen |
| `addPrimaryKey($table, $column)` | Primaire sleutel van wachtrij |
| `addIndex($name, $table, $column, $unique)` | Wachtrijindex |
| `dropIndex($name, $table)` | Wachtrijindexdaling |
| `dropIndexes($table)` | Alle indexdalingen in de wachtrij plaatsen |
| `dropPrimaryKey($table)` | Primaire sleuteldrop in wachtrij |
| `insert($table, $columns, $quote)` | Wachtrij invoegen |
| `update($table, $columns, $criteria, $quote)` | Wachtrij-update |
| `delete($table, $criteria)` | Wachtrij verwijderen |
| `truncate($table)` | Wachtrij afkappen |
| `executeQueue($force)` | Bewerkingen in de wachtrij uitvoeren |
| `resetQueue()` | Wachtrij wissen |
| `addToQueue($sql)` | Voeg onbewerkte SQL | toe
| `getLastError()` | Laatste foutmelding ophalen |
| `getLastErrNo()` | Laatste foutcode ophalen |

### Xmf\Database\Migrate

| Werkwijze | Beschrijving |
|--------|-------------|
| `__construct($dirname)` | Maken voor module |
| `synchronizeSchema()` | Synchroniseer database met doel |
| `getSynchronizeDDL()` | DDL-instructies ophalen |
| `preSyncActions()` | Overschrijven voor aangepaste acties |
| `getCurrentSchema()` | Huidig ​​databaseschema ophalen |
| `getTargetDefinitions()` | Doelschema ophalen |
| `saveCurrentSchema()` | Schema opslaan voor ontwikkelaars |

### Xmf\Database\TableLoad

| Werkwijze | Beschrijving |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Laden uit array |
| `loadTableFromYamlFile($table, $file)` | Laden uit YAML |
| `truncateTable($table)` | Lege tafel |
| `countRows($table, $criteria)` | Rijen tellen |
| `extractRows($table, $criteria, $skip)` | Rijen extraheren |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Opslaan in YAML |

## Zie ook

- ../XMF-Framework - Kaderoverzicht
- ../Basics/XMF-Module-Helper - Modulehelperklasse
- Metagen - Metagegevenshulpprogramma's

---

#xmf #database #migration #schema #tables #ddl