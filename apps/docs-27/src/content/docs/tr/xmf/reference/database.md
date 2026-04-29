---
title: "database Yardımcı Programları"
description: "XMF şema yönetimi, geçişler ve veri yükleme için database yardımcı programları"
---
`Xmf\Database` ad alanı, XOOPS modüllerinin kurulumu ve güncellenmesiyle ilişkili database bakım görevlerini basitleştirmek için sınıflar sağlar. Bu yardımcı programlar şema geçişlerini, tablo değişikliklerini ve ilk veri yüklemeyi yönetir.

## Genel Bakış

database yardımcı programları şunları içerir:

- **Tablolar** - Tablo değişiklikleri için DDL ifadelerini oluşturma ve yürütme
- **Migrate** - database şemasını module sürümleri arasında senkronize etme
- **TableLoad** - Başlangıç verilerini tablolara yükleme

## Xmf\Database\Tables

`Tables` sınıfı, database tablolarını oluşturmayı ve değiştirmeyi kolaylaştırır. Birlikte yürütülen DDL (Veri Tanımlama Dili) ifadelerinden oluşan bir iş kuyruğu oluşturur.

### Temel Özellikler

- Mevcut tablolardan mevcut şemayı yükler
- Hemen yürütülmeden kuyruk değişiklikleri
- Yapılacak işi belirlerken mevcut durumu dikkate alır
- Otomatik olarak XOOPS tablo önekini yönetir

### Başlarken
```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```
### Tablo İşlemleri

#### Tabloyu Yeniden Adlandırma
```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```
#### Tablo Seçeneklerini Ayarlayın
```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```
#### Bir Masa Bırakın
```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```
#### Tabloyu Kopyala
```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```
### Sütunlarla Çalışmak

#### Sütun Ekle
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
#### Sütunu Değiştirme
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
#### Sütun Niteliklerini Al
```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```
#### Bir Sütun Bırakın
```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```
### Dizinlerle Çalışmak

#### Tablo Dizinlerini Al
```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```
#### Birincil Anahtar Ekle
```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```
#### Dizin Ekle
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
#### Dizini Bırak
```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```
#### Birincil Olmayan Tüm Dizinleri Bırak
```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```
#### Birincil Anahtarı Bırak
```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```
### Veri İşlemleri

#### Veri Ekle
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
#### Verileri Güncelle
```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```
#### Verileri Sil
```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```
#### Tabloyu Kes
```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```
### İş Kuyruğu Yönetimi

#### Yürütme Sırası
```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```
#### Sırayı Sıfırla
```php
// Clear queue without executing
$tables->resetQueue();
```
#### Ham Ekle SQL
```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```
### Hata İşleme
```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```
## Xmf\Database\Migrate

`Migrate` sınıfı, module sürümleri arasındaki database değişikliklerinin senkronizasyonunu kolaylaştırır. `Tables`'yi şema karşılaştırması ve otomatik senkronizasyonla genişletir.

### Temel Kullanım
```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```
### module Güncellemesinde

Genellikle modülün `xoops_module_pre_update_*` işlevinde çağrılır:
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
### DDL Ekstrelerini Alma

Büyük veritabanları veya komut satırı geçişleri için:
```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```
### Senkronizasyon Öncesi Eylemler

Bazı değişiklikler senkronizasyondan önce açık bir şekilde işlenmesini gerektirir. Karmaşık geçişler için `Migrate`'yi genişletin:
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
### Şema Yönetimi

#### Mevcut Şemayı Al
```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```
#### Hedef Şemasını Al
```php
$targetSchema = $migrate->getTargetDefinitions();
```
#### Mevcut Şemayı Kaydet

module geliştiricilerinin database değişikliklerinden sonra şemayı yakalaması için:
```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```
> **Geliştirici Notu:** Her zaman önce veritabanında değişiklik yapın, ardından `saveCurrentSchema()` komutunu çalıştırın. Oluşturulan şema dosyasını manuel olarak düzenlemeyin.

## Xmf\Database\TableLoad

`TableLoad` sınıfı, başlangıç verilerinin tablolara yüklenmesini kolaylaştırır. module kurulumu sırasında varsayılan verileri içeren tabloları tohumlamak için kullanışlıdır.

### Dizilerden Veri Yükleme
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
### YAML'den Veri Yükleniyor
```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```
YAML biçimi:
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
### Veri Çıkarma

#### Satırları Say
```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```
#### Satırları Çıkart
```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```
### Verileri YAML'ye Kaydetme
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
### Tabloyu Kes
```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```
## Taşıma Örneğinin Tamamlanması

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
## API Referans

### Xmf\Database\Tables

| Yöntem | Açıklama |
|----------|----------------|
| `addTable($table)` | Tablo şemasını yükleyin veya oluşturun |
| `useTable($table)` | Yalnızca mevcut tabloyu yükle |
| `renameTable($table, $newName)` | Kuyruk tablosunu yeniden adlandır |
| `setTableOptions($table, $options)` | Kuyruk tablosu seçenekleri değişikliği |
| `dropTable($table)` | Kuyruk tablosu bırakma |
| `copyTable($table, $newTable, $withData)` | Kuyruk tablosu kopyası |
| `addColumn($table, $column, $attributes)` | Sıra sütunu ekleme |
| `alterColumn($table, $column, $attributes, $newName)` | Kuyruk sütunu değişikliği |
| `getColumnAttributes($table, $column)` | Sütun tanımını alın |
| `dropColumn($table, $column)` | Kuyruk sütunu düşüşü |
| `getTableIndexes($table)` | Dizin tanımlarını alın |
| `addPrimaryKey($table, $column)` | Sıra birincil anahtarı |
| `addIndex($name, $table, $column, $unique)` | Kuyruk dizini |
| `dropIndex($name, $table)` | Kuyruk dizini düşüşü |
| `dropIndexes($table)` | Tüm dizin düşüşlerini sıraya koy |
| `dropPrimaryKey($table)` | Sıra birincil anahtarını bırakma |
| `insert($table, $columns, $quote)` | Sıra ekleme |
| `update($table, $columns, $criteria, $quote)` | Sıra güncellemesi |
| `delete($table, $criteria)` | Sıra silme |
| `truncate($table)` | Kuyruk kısalt |
| `executeQueue($force)` | Sıraya alınmış işlemleri yürütün |
| `resetQueue()` | Sırayı temizle |
| `addToQueue($sql)` | Ham ekle SQL |
| `getLastError()` | Son hata mesajını al |
| `getLastErrNo()` | Son hata kodunu al |

### Xmf\Database\Migrate

| Yöntem | Açıklama |
|----------|----------------|
| `__construct($dirname)` | module için oluştur |
| `synchronizeSchema()` | Veritabanını hedefe senkronize et |
| `getSynchronizeDDL()` | DDL ekstrelerini alın |
| `preSyncActions()` | Özel eylemleri geçersiz kıl |
| `getCurrentSchema()` | Geçerli database şemasını alın |
| `getTargetDefinitions()` | Hedef şemasını alın |
| `saveCurrentSchema()` | Geliştiriciler için şemayı kaydet |

### Xmf\Database\TableLoad

| Yöntem | Açıklama |
|----------|----------------|
| `loadTableFromArray($table, $data)` | Diziden yükle |
| `loadTableFromYamlFile($table, $file)` | YAML'den yükle |
| `truncateTable($table)` | Boş masa |
| `countRows($table, $criteria)` | Satırları say |
| `extractRows($table, $criteria, $skip)` | Satırları çıkar |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | YAML'e kaydet |

## Ayrıca Bakınız

- ../XMF-Framework - Çerçeveye genel bakış
- ../Basics/XMF-Module-Helper - module yardımcı sınıfı
- Metagen - Meta veri yardımcı programları

---

#xmf #database #migration #schema #tables #ddl