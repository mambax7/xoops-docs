---
title: "Pripomočki za baze podatkov"
description: "XMF pripomočki baze podatkov za upravljanje shem, selitve in nalaganje podatkov"
---
Imenski prostor `XMF\Database` ponuja razrede za poenostavitev nalog vzdrževanja baze podatkov, povezanih z nameščanjem in posodabljanjem modulov XOOPS. Ti pripomočki obravnavajo selitve shem, spremembe tabel in začetno nalaganje podatkov.

## Pregled

Pripomočki baze podatkov vključujejo:

- **Tabele** - Gradnja in izvajanje stavkov DDL za spremembe tabel
- **Migracija** - Sinhronizacija sheme baze podatkov med različicami modula
- **TableLoad** - Nalaganje začetnih podatkov v tabele

## XMF\Database\Tables

Razred `Tables` poenostavlja ustvarjanje in spreminjanje tabel baze podatkov. Zgradi delovno čakalno vrsto stavkov DDL (Jezik za definiranje podatkov), ki se izvajajo skupaj.

### Ključne lastnosti

- Naloži trenutno shemo iz obstoječih tabel
- Čakalne vrste sprememb brez takojšnje izvedbe
- Pri določanju dela, ki ga je treba opraviti, upošteva trenutno stanje
- Samodejno obravnava predpono tabele XOOPS

### Kako začeti
```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```
### Operacije tabele

#### Preimenuj tabelo
```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```
#### Nastavite možnosti tabele
```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```
#### Spusti tabelo
```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```
#### Kopiraj tabelo
```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```
### Delo s stolpci

#### Dodajte stolpec
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
#### Spremeni stolpec
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
#### Pridobite atribute stolpcev
```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```
#### Spusti stolpec
```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```
### Delo z indeksi

#### Pridobite indekse tabel
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
#### Spustite indeks
```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```
#### Spustite vse neprimarne indekse
```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```
#### Spustite primarni ključ
```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```
### Podatkovne operacije

#### Vstavi podatke
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
#### Posodobi podatke
```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```
#### Izbriši podatke
```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```
#### Odreži tabelo
```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```
### Upravljanje čakalne vrste dela

#### Izvedi čakalno vrsto
```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```
#### Ponastavi čakalno vrsto
```php
// Clear queue without executing
$tables->resetQueue();
```
#### Dodaj surovo SQL
```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```
### Obravnava napak
```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```
## XMF\Database\Migrate

Razred `Migrate` poenostavi sinhronizacijo sprememb baze podatkov med različicami modulov. Razširja `Tables` s primerjavo shem in samodejno sinhronizacijo.

### Osnovna uporaba
```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```
### V posodobitvi modula

Običajno se kliče v funkciji `xoops_module_pre_update_*` modula:
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
### Pridobivanje DDL izpiskov

Za velike baze podatkov ali selitve ukazne vrstice:
```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```
### Dejanja pred sinhronizacijo

Nekatere spremembe zahtevajo izrecno obravnavanje pred sinhronizacijo. Podaljšajte `Migrate` za kompleksne selitve:
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
### Upravljanje sheme

#### Pridobite trenutno shemo
```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```
#### Pridobite ciljno shemo
```php
$targetSchema = $migrate->getTargetDefinitions();
```
#### Shrani trenutno shemo

Za razvijalce modulov za zajemanje sheme po spremembah baze podatkov:
```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```
> **Opomba za razvijalce:** Vedno najprej spremenite bazo podatkov, nato pa zaženite `saveCurrentSchema()`. Ne urejajte ročno ustvarjene datoteke sheme.

## XMF\Database\TableLoad

Razred `TableLoad` poenostavi nalaganje začetnih podatkov v tabele. Uporabno za sejanje tabel s privzetimi podatki med namestitvijo modula.

### Nalaganje podatkov iz nizov
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
### Nalaganje podatkov iz YAML
```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```
YAML oblika:
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
### Pridobivanje podatkov

#### Štetje vrstic
```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```
#### Ekstrahiraj vrstice
```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```
### Shranjevanje podatkov v YAML
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
### Obreži tabelo
```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```
## Celoten primer selitve

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

### XMF\Database\Tables

| Metoda | Opis |
|--------|-------------|
| `addTable($table)` | Naloži ali ustvari shemo tabele |
| `useTable($table)` | Naloži samo obstoječo tabelo |
| `renameTable($table, $newName)` | Preimenuj tabelo čakalne vrste |
| `setTableOptions($table, $options)` | Sprememba možnosti tabele čakalne vrste |
| `dropTable($table)` | Padec tabele čakalne vrste |
| `copyTable($table, $newTable, $withData)` | Kopija tabele čakalne vrste |
| `addColumn($table, $column, $attributes)` | Dodajanje stolpca čakalne vrste |
| `alterColumn($table, $column, $attributes, $newName)` | Sprememba stolpca čakalne vrste |
| `getColumnAttributes($table, $column)` | Pridobi definicijo stolpca |
| `dropColumn($table, $column)` | Padec stolpca čakalne vrste |
| `getTableIndexes($table)` | Pridobite definicije indeksa |
| `addPrimaryKey($table, $column)` | Primarni ključ čakalne vrste |
| `addIndex($name, $table, $column, $unique)` | Indeks čakalne vrste |
| `dropIndex($name, $table)` | Padec indeksa čakalne vrste |
| `dropIndexes($table)` | Postavi v čakalno vrsto vse padce indeksa |
| `dropPrimaryKey($table)` | Spuščanje primarnega ključa čakalne vrste |
| `insert($table, $columns, $quote)` | Vstavi v čakalno vrsto |
| `update($table, $columns, $criteria, $quote)` | Posodobitev čakalne vrste |
| `delete($table, $criteria)` | Brisanje čakalne vrste |
| `truncate($table)` | Skrajšanje čakalne vrste |
| `executeQueue($force)` | Izvedi operacije v čakalni vrsti |
| `resetQueue()` | Počisti čakalno vrsto |
| `addToQueue($sql)` | Dodajte surovo SQL |
| `getLastError()` | Pridobi zadnje sporočilo o napaki |
| `getLastErrNo()` | Pridobi zadnjo kodo napake |### XMF\Database\Migrate

| Metoda | Opis |
|--------|-------------|
| `__construct($dirname)` | Ustvari za modul |
| `synchronizeSchema()` | Sinhroniziraj bazo podatkov s ciljem |
| `getSynchronizeDDL()` | Pridobite DDL izpiske |
| `preSyncActions()` | Preglasitev za dejanja po meri |
| `getCurrentSchema()` | Pridobite trenutno shemo baze podatkov |
| `getTargetDefinitions()` | Pridobite ciljno shemo |
| `saveCurrentSchema()` | Shrani shemo za razvijalce |

### XMF\Database\TableLoad

| Metoda | Opis |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Naloži iz polja |
| `loadTableFromYamlFile($table, $file)` | Nalaganje od YAML |
| `truncateTable($table)` | Prazna tabela |
| `countRows($table, $criteria)` | Preštej vrstice |
| `extractRows($table, $criteria, $skip)` | Izvleček vrstic |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Shrani v YAML |

## Glej tudi

- ../XMF-Framework - Pregled okvira
- ../Basics/XMF-Module-Helper - Razred za pomoč modulom
- Metagen - pripomočki za metapodatke

---

#XMF #database #migration #schema #tables #ddl