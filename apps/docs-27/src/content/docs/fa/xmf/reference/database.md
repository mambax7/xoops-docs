---
title: "ابزارهای پایگاه داده"
description: "ابزارهای پایگاه داده XMF برای مدیریت طرحواره، مهاجرت ها و بارگذاری داده ها"
---
فضای نام `XMF\Database` کلاس هایی را برای ساده سازی وظایف نگهداری پایگاه داده مرتبط با نصب و به روز رسانی ماژول های XOOPS فراهم می کند. این ابزارهای کمکی انتقال طرحواره، تغییرات جدول، و بارگیری داده های اولیه را مدیریت می کنند.

## بررسی اجمالی

ابزارهای پایگاه داده عبارتند از:

- **جدول** - ساخت و اجرای دستورات DDL برای تغییرات جدول
- ** مهاجرت ** - همگام سازی طرح پایگاه داده بین نسخه های ماژول
- **TableLoad** - بارگذاری داده های اولیه در جداول

## XMF\Database\Tables

کلاس `Tables` ایجاد و اصلاح جداول پایگاه داده را ساده می کند. این یک صف کاری از دستورات DDL (زبان تعریف داده) می سازد که با هم اجرا می شوند.

### ویژگی های کلیدی

- طرحواره فعلی را از جداول موجود بارگذاری می کند
- صف ها بدون اجرای فوری تغییر می کنند
- هنگام تعیین کار برای انجام، وضعیت فعلی را در نظر می گیرد
- به طور خودکار پیشوند جدول XOOPS را کنترل می کند

### شروع به کار

```php
use XMF\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### عملیات جدول

#### یک جدول را تغییر نام دهید

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### گزینه های جدول را تنظیم کنید

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### یک جدول را رها کنید

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### یک جدول را کپی کنید

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### کار با ستون ها

#### یک ستون اضافه کنید

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

#### یک ستون را تغییر دهید

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

#### ویژگی های ستون را دریافت کنید

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### یک ستون را رها کنید

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### کار با شاخص ها

#### نمایه های جدول را دریافت کنید

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### کلید اصلی را اضافه کنید

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### اضافه کردن فهرست

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

#### رها کردن شاخص

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### همه شاخص های غیر اولیه را حذف کنید

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### کلید اصلی را رها کنید

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### عملیات داده

#### داده ها را وارد کنید

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

#### داده ها را به روز کنید

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### حذف داده ها

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### جدول کوتاه

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### مدیریت صف کار

#### اجرای صف

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### صف را بازنشانی کنید

```php
// Clear queue without executing
$tables->resetQueue();
```

#### SQL خام را اضافه کنید

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### رسیدگی به خطا

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## XMF\Database\Migrate

کلاس `Migrate` همگام سازی تغییرات پایگاه داده بین نسخه های ماژول را ساده می کند. `Tables` را با مقایسه طرحواره و همگام سازی خودکار گسترش می دهد.

### استفاده اولیه

```php
use XMF\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### در به روز رسانی ماژول

معمولاً در تابع `xoops_module_pre_update_*` ماژول نامیده می شود:

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

### دریافت بیانیه های DDL

برای پایگاه داده های بزرگ یا انتقال خط فرمان:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### اقدامات پیش همگام سازی

برخی تغییرات قبل از همگام سازی نیاز به رسیدگی صریح دارند. `Migrate` را برای مهاجرت های پیچیده گسترش دهید:

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

### مدیریت طرحواره

#### طرحواره فعلی را دریافت کنید

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### طرحواره هدف را دریافت کنید

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### طرحواره فعلی را ذخیره کنید

برای توسعه دهندگان ماژول برای گرفتن طرحواره پس از تغییرات پایگاه داده:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **توجه توسعه دهنده:** همیشه ابتدا تغییراتی را در پایگاه داده ایجاد کنید، سپس `saveCurrentSchema()` را اجرا کنید. فایل طرحواره ایجاد شده را به صورت دستی ویرایش نکنید.

## XMF\Database\TableLoad

کلاس `TableLoad` بارگذاری داده های اولیه را در جداول ساده می کند. برای کاشت جداول با داده های پیش فرض در هنگام نصب ماژول مفید است.

### بارگذاری داده ها از آرایه ها

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

### بارگیری داده ها از YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

فرمت YAML:

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

### استخراج داده ها

#### ردیف ها را بشمارید

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### استخراج ردیف

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### ذخیره داده در YAML

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

### جدول کوتاه

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## مثال کامل مهاجرت

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

## مرجع API

### XMF\Database\Tables| روش | توضیحات |
|--------|------------|
| `addTable($table)` | بارگیری یا ایجاد طرح جدول |
| `useTable($table)` | فقط جدول موجود را بارگیری کنید |
| `renameTable($table, $newName)` | تغییر نام جدول صف |
| `setTableOptions($table, $options)` | تغییر گزینه های جدول صف |
| `dropTable($table)` | افت جدول صف |
| `copyTable($table, $newTable, $withData)` | کپی جدول صف |
| `addColumn($table, $column, $attributes)` | اضافه شدن ستون صف |
| `alterColumn($table, $column, $attributes, $newName)` | تغییر ستون صف |
| `getColumnAttributes($table, $column)` | دریافت تعریف ستون |
| `dropColumn($table, $column)` | افت ستون صف |
| `getTableIndexes($table)` | دریافت تعاریف شاخص |
| `addPrimaryKey($table, $column)` | کلید اصلی صف |
| `addIndex($name, $table, $column, $unique)` | فهرست صف |
| `dropIndex($name, $table)` | افت شاخص صف |
| `dropIndexes($table)` | صف تمام افت های شاخص |
| `dropPrimaryKey($table)` | صف حذف کلید اصلی |
| `insert($table, $columns, $quote)` | درج صف |
| `update($table, $columns, $criteria, $quote)` | به روز رسانی صف |
| `delete($table, $criteria)` | حذف صف |
| `truncate($table)` | کوتاه کردن صف |
| `executeQueue($force)` | اجرای عملیات صف |
| `resetQueue()` | صف پاک کردن |
| `addToQueue($sql)` | اضافه کردن SQL خام |
| `getLastError()` | دریافت آخرین پیغام خطا |
| `getLastErrNo()` | دریافت آخرین کد خطا |

### XMF\Database\Migrate

| روش | توضیحات |
|--------|------------|
| `__construct($dirname)` | ایجاد برای ماژول |
| `synchronizeSchema()` | همگام سازی پایگاه داده با هدف |
| `getSynchronizeDDL()` | دریافت عبارات DDL |
| `preSyncActions()` | لغو برای اقدامات سفارشی |
| `getCurrentSchema()` | دریافت طرح پایگاه داده فعلی |
| `getTargetDefinitions()` | دریافت طرح واره هدف |
| `saveCurrentSchema()` | ذخیره طرح برای توسعه دهندگان |

### XMF\Database\TableLoad

| روش | توضیحات |
|--------|------------|
| `loadTableFromArray($table, $data)` | بارگیری از آرایه |
| `loadTableFromYamlFile($table, $file)` | بارگیری از YAML |
| `truncateTable($table)` | جدول خالی |
| `countRows($table, $criteria)` | شمارش ردیف |
| `extractRows($table, $criteria, $skip)` | استخراج ردیف |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | ذخیره در YAML |

## همچنین ببینید

- ../XMF-Framework - نمای کلی چارچوب
- ../Basics/XMF-Module-Helper - کلاس کمکی ماژول
- Metagen - ابزارهای فراداده

---

#xmf #پایگاه داده #مهاجرت #شما #جدول #ddl