---
title: "Utilitas Basis Data"
description: "Utilitas database XMF untuk manajemen skema, migrasi, dan pemuatan data"
---

namespace `Xmf\Database` menyediakan kelas untuk menyederhanakan tugas pemeliharaan database yang terkait dengan instalasi dan pembaruan module XOOPS. Utilitas ini menangani migrasi skema, modifikasi tabel, dan pemuatan data awal.

## Ikhtisar

Utilitas basis data meliputi:

- **Tabel** - Membuat dan mengeksekusi pernyataan DDL untuk modifikasi tabel
- **Migrasi** - Menyinkronkan skema database antar versi module
- **TableLoad** - Memuat data awal ke dalam tabel

## Xmf\Database\Tables

Kelas `Tables` menyederhanakan pembuatan dan modifikasi tabel database. Itu membangun antrian kerja pernyataan DDL (Data Definition Language) yang dieksekusi bersama.

### Fitur Utama

- Memuat skema saat ini dari tabel yang ada
- Antrian berubah tanpa eksekusi segera
- Mempertimbangkan keadaan saat ini ketika menentukan pekerjaan yang harus dilakukan
- Secara otomatis menangani awalan tabel XOOPS

### Memulai

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Operasi Tabel

#### Ganti Nama Tabel

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Atur Opsi Tabel

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

#### Salin Tabel

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Bekerja dengan Kolom

#### Tambahkan Kolom

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

#### Mengubah Kolom

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

#### Dapatkan Atribut Kolom

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Jatuhkan Kolom

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Bekerja dengan Indeks

#### Dapatkan Indeks Tabel

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Tambahkan Kunci Utama

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Tambahkan Indeks

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

#### Jatuhkan Indeks

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Hilangkan Semua Indeks Non-Primer

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Jatuhkan Kunci Utama

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

#### Perbarui Data

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Hapus Data

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Potong Tabel

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Manajemen Antrian Kerja

#### Jalankan Antrian

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Atur Ulang Antrean

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Tambahkan SQL Mentah

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Penanganan Kesalahan

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

Kelas `Migrate` menyederhanakan sinkronisasi perubahan database antar versi module. Ini memperluas `Tables` dengan perbandingan skema dan sinkronisasi otomatis.

### Penggunaan Dasar

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### Dalam Pembaruan module

Biasanya dipanggil dalam fungsi `xoops_module_pre_update_*` module:

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

### Mendapatkan Pernyataan DDL

Untuk database besar atau migrasi baris perintah:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Tindakan Pra-Sinkronisasi

Beberapa perubahan memerlukan penanganan eksplisit sebelum sinkronisasi. Perluas `Migrate` untuk migrasi kompleks:

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

### Manajemen Skema

#### Dapatkan Skema Saat Ini

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Dapatkan Skema Target

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Simpan Skema Saat Ini

Bagi pengembang module untuk menangkap skema setelah perubahan database:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Catatan Pengembang:** Selalu lakukan perubahan pada database terlebih dahulu, lalu jalankan `saveCurrentSchema()`. Jangan mengedit file skema yang dihasilkan secara manual.

## Xmf\Database\TableLoad

Kelas `TableLoad` menyederhanakan pemuatan data awal ke dalam tabel. Berguna untuk menyemai tabel dengan data default selama instalasi module.

### Memuat Data dari Array

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

### Memuat Data dari YAML

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

### Mengekstrak Data

#### Hitung Baris

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

### Potong Tabel

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

## Referensi API

### Xmf\Database\Tables| Metode | Deskripsi |
|--------|-------------|
| `addTable($table)` | Memuat atau membuat skema tabel |
| `useTable($table)` | Muat tabel yang ada saja |
| `renameTable($table, $newName)` | Ganti nama tabel antrian |
| `setTableOptions($table, $options)` | Pilihan tabel antrian berubah |
| `dropTable($table)` | Penurunan tabel antrian |
| `copyTable($table, $newTable, $withData)` | Salinan tabel antrian |
| `addColumn($table, $column, $attributes)` | Penambahan kolom antrian |
| `alterColumn($table, $column, $attributes, $newName)` | Perubahan kolom antrian |
| `getColumnAttributes($table, $column)` | Dapatkan definisi kolom |
| `dropColumn($table, $column)` | Penurunan kolom antrian |
| `getTableIndexes($table)` | Dapatkan definisi indeks |
| `addPrimaryKey($table, $column)` | Kunci utama antrian |
| `addIndex($name, $table, $column, $unique)` | Indeks antrian |
| `dropIndex($name, $table)` | Penurunan indeks antrian |
| `dropIndexes($table)` | Antrian semua penurunan indeks |
| `dropPrimaryKey($table)` | Penurunan kunci utama antrian |
| `insert($table, $columns, $quote)` | Sisipkan antrian |
| `update($table, $columns, $criteria, $quote)` | Pembaruan antrian |
| `delete($table, $criteria)` | Hapus antrian |
| `truncate($table)` | Pemotongan antrian |
| `executeQueue($force)` | Jalankan operasi antrian |
| `resetQueue()` | Hapus antrian |
| `addToQueue($sql)` | Tambahkan SQL |
| `getLastError()` | Dapatkan pesan kesalahan terakhir |
| `getLastErrNo()` | Dapatkan kode kesalahan terakhir |

### Xmf\Database\Migrate

| Metode | Deskripsi |
|--------|-------------|
| `__construct($dirname)` | Buat untuk module |
| `synchronizeSchema()` | Sinkronkan database ke target |
| `getSynchronizeDDL()` | Dapatkan pernyataan DDL |
| `preSyncActions()` | Ganti tindakan khusus |
| `getCurrentSchema()` | Dapatkan skema database saat ini |
| `getTargetDefinitions()` | Dapatkan skema target |
| `saveCurrentSchema()` | Simpan skema untuk pengembang |

### Xmf\Database\TableLoad

| Metode | Deskripsi |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Muat dari larik |
| `loadTableFromYamlFile($table, $file)` | Muat dari YAML |
| `truncateTable($table)` | Meja kosong |
| `countRows($table, $criteria)` | Hitung baris |
| `extractRows($table, $criteria, $skip)` | Ekstrak baris |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Simpan ke YAML |

## Lihat Juga

- ../XMF-Framework - Ikhtisar kerangka kerja
- ../Basics/XMF-Module-Helper - Kelas pembantu module
- Metagen - Utilitas metadata

---

#xmf #database #migrasi #skema #tabel #ddl
