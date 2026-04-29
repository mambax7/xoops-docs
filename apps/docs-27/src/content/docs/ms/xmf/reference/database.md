---
title: "Utiliti Pangkalan Data"
description: "XMF utiliti pangkalan data untuk pengurusan skema, migrasi dan pemuatan data"
---
Ruang nama `XMF\Database` menyediakan kelas untuk memudahkan tugas penyelenggaraan pangkalan data yang berkaitan dengan memasang dan mengemas kini modul XOOPS. Utiliti ini mengendalikan migrasi skema, pengubahsuaian jadual dan pemuatan data awal.

## Gambaran Keseluruhan

Utiliti pangkalan data termasuk:

- **Jadual** - Membina dan melaksanakan DDL penyata untuk pengubahsuaian jadual
- **Migrasi** - Menyegerakkan skema pangkalan data antara versi modul
- **TableLoad** - Memuatkan data awal ke dalam jadual

## XMF\Database\Tables

Kelas `Tables` memudahkan mencipta dan mengubah suai jadual pangkalan data. Ia membina baris gilir kerja DDL (Bahasa Definisi Data) yang dilaksanakan bersama.

### Ciri Utama

- Memuatkan skema semasa daripada jadual sedia ada
- Baris gilir berubah tanpa pelaksanaan segera
- Mempertimbangkan keadaan semasa semasa menentukan kerja yang perlu dilakukan
- Mengendalikan awalan jadual XOOPS secara automatik

### Bermula
```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```
### Operasi Meja

#### Namakan semula Jadual
```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```
#### Tetapkan Pilihan Jadual
```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```
#### Jatuhkan Meja
```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```
#### Salin Jadual
```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```
### Bekerja dengan Lajur

#### Tambah Lajur
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
#### Ubah Lajur
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
#### Dapatkan Atribut Lajur
```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```
#### Gugurkan Lajur
```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```
### Bekerja dengan Indeks

#### Dapatkan Indeks Jadual
```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```
#### Tambah Kunci Utama
```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```
#### Tambah Indeks
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
#### Indeks Jatuh
```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```
#### Gugurkan Semua Indeks Bukan Utama
```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```
#### Gugurkan Kunci Utama
```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```
### Operasi Data

#### Masukkan Data
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
#### Kemas kini Data
```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```
#### Padamkan Data
```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```
#### Pemangkasan Jadual
```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```
### Pengurusan Barisan Kerja

#### Laksanakan Baris Gilir
```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```
#### Tetapkan Semula Baris Gilir
```php
// Clear queue without executing
$tables->resetQueue();
```
#### Tambah Mentah SQL
```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```
### Pengendalian Ralat
```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```
## XMF\Database\Migrate

Kelas `Migrate` memudahkan penyegerakan perubahan pangkalan data antara versi modul. Ia memanjangkan `Tables` dengan perbandingan skema dan penyegerakan automatik.

### Penggunaan Asas
```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```
### Dalam Kemas Kini Modul

Biasanya dipanggil dalam fungsi `xoops_module_pre_update_*` modul:
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
### Mendapat DDL Penyata

Untuk pangkalan data besar atau migrasi baris arahan:
```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```
### Tindakan Pra-Penyegerakan

Sesetengah perubahan memerlukan pengendalian yang jelas sebelum penyegerakan. Lanjutkan `Migrate` untuk migrasi kompleks:
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
### Pengurusan Skema

#### Dapatkan Skema Semasa
```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```
#### Dapatkan Skema Sasaran
```php
$targetSchema = $migrate->getTargetDefinitions();
```
#### Simpan Skema Semasa

Untuk pembangun modul menangkap skema selepas perubahan pangkalan data:
```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```
> **Nota Pembangun:** Sentiasa buat perubahan pada pangkalan data dahulu, kemudian jalankan `saveCurrentSchema()`. Jangan edit fail skema yang dijana secara manual.

## XMF\Database\TableLoad

Kelas `TableLoad` memudahkan pemuatan data awal ke dalam jadual. Berguna untuk pembenihan jadual dengan data lalai semasa pemasangan modul.

### Memuatkan Data daripada Tatasusunan
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
### Memuatkan Data daripada YAML
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
### Mengekstrak Data

#### Kira Baris
```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```
#### Ekstrak Baris
```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```
### Menyimpan Data ke YAML
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
### Potong Jadual
```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```
## Contoh Migrasi Lengkap

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
## API Rujukan

### XMF\Database\Tables

| Kaedah | Penerangan |
|--------|--------------|
| `addTable($table)` | Muatkan atau buat skema jadual |
| `useTable($table)` | Muatkan jadual sedia ada sahaja |
| `renameTable($table, $newName)` | Namakan semula jadual baris gilir |
| `setTableOptions($table, $options)` | Pilihan jadual baris gilir berubah |
| `dropTable($table)` | Jatuhkan jadual baris gilir |
| `copyTable($table, $newTable, $withData)` | Salinan jadual giliran |
| `addColumn($table, $column, $attributes)` | Penambahan lajur baris gilir |
| `alterColumn($table, $column, $attributes, $newName)` | Perubahan lajur baris gilir |
| `getColumnAttributes($table, $column)` | Dapatkan definisi lajur |
| `dropColumn($table, $column)` | Penurunan lajur baris gilir |
| `getTableIndexes($table)` | Dapatkan definisi indeks |
| `addPrimaryKey($table, $column)` | Kunci utama baris gilir |
| `addIndex($name, $table, $column, $unique)` | Indeks baris gilir |
| `dropIndex($name, $table)` | Penurunan indeks baris gilir |
| `dropIndexes($table)` | Baris gilir semua indeks jatuh |
| `dropPrimaryKey($table)` | Gugurkan kunci utama baris gilir |
| `insert($table, $columns, $quote)` | Sisipan baris gilir |
| `update($table, $columns, $criteria, $quote)` | Kemas kini baris gilir |
| `delete($table, $criteria)` | Padam baris gilir |
| `truncate($table)` | Penggal baris gilir |
| `executeQueue($force)` | Laksanakan operasi beratur |
| `resetQueue()` | Kosongkan baris gilir |
| `addToQueue($sql)` | Tambah mentah SQL |
| `getLastError()` | Dapatkan mesej ralat terakhir |
| `getLastErrNo()` | Dapatkan kod ralat terakhir |### XMF\Database\Migrate

| Kaedah | Penerangan |
|--------|--------------|
| `__construct($dirname)` | Cipta untuk modul |
| `synchronizeSchema()` | Segerakkan pangkalan data untuk menyasarkan |
| `getSynchronizeDDL()` | Dapatkan DDL penyata |
| `preSyncActions()` | Gantikan untuk tindakan tersuai |
| `getCurrentSchema()` | Dapatkan skema pangkalan data semasa |
| `getTargetDefinitions()` | Dapatkan skema sasaran |
| `saveCurrentSchema()` | Simpan skema untuk pembangun |

### XMF\Database\TableLoad

| Kaedah | Penerangan |
|--------|--------------|
| `loadTableFromArray($table, $data)` | Muatkan daripada tatasusunan |
| `loadTableFromYamlFile($table, $file)` | Muatkan daripada YAML |
| `truncateTable($table)` | Meja kosong |
| `countRows($table, $criteria)` | Kira baris |
| `extractRows($table, $criteria, $skip)` | Ekstrak baris |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Simpan ke YAML |

## Lihat Juga

- ../XMF-Rangka Kerja - Gambaran keseluruhan rangka kerja
- ../Asas/XMF-Modul-Helper - Kelas pembantu modul
- Metagen - Utiliti metadata

---

#XMF #database #migration #schema #tables #ddl