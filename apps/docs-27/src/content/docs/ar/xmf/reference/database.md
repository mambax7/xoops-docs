---
title: "أدوات قاعدة البيانات"
description: "أدوات قاعدة بيانات XMF لإدارة المخطط والترحيل وتحميل البيانات"
dir: rtl
lang: ar
---

توفر مساحة اسم `Xmf\Database` فئات لتبسيط مهام صيانة قاعدة البيانات المرتبطة بتثبيت وتحديث وحدات XOOPS. تتعامل هذه الأدوات مع ترحيل المخطط وتعديلات الجداول وتحميل البيانات الأولية.

## نظرة عامة

تشمل أدوات قاعدة البيانات:

- **Tables** - بناء وتنفيذ عبارات DDL لتعديلات الجدول
- **Migrate** - مزامنة مخطط قاعدة البيانات بين إصدارات الوحدة
- **TableLoad** - تحميل البيانات الأولية في الجداول

## Xmf\Database\Tables

تبسط فئة `Tables` إنشاء وتعديل جداول قاعدة البيانات. تبني طابور عمل لعبارات DDL (Data Definition Language) التي يتم تنفيذها معاً.

### الميزات الرئيسية

- تحميل المخطط الحالي من الجداول الموجودة
- قائمة التغييرات بدون تنفيذ فوري
- تأخذ في الاعتبار الحالة الحالية عند تحديد العمل المراد إجراؤه
- التعامل التلقائي مع بادئة جدول XOOPS

### البدء

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### عمليات الجدول

#### إعادة تسمية الجدول

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### تعيين خيارات الجدول

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### حذف الجدول

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### نسخ جدول

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### العمل مع الأعمدة

#### إضافة عمود

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

#### تعديل عمود

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

#### الحصول على خصائص العمود

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### حذف عمود

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### العمل مع الفهارس

#### الحصول على فهارس الجدول

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### إضافة المفتاح الأساسي

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### إضافة فهرس

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

#### حذف الفهرس

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### حذف جميع الفهارس غير الأساسية

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### حذف المفتاح الأساسي

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### عمليات البيانات

#### إدراج البيانات

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

#### تحديث البيانات

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### حذف البيانات

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### مسح الجدول

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### إدارة طابور العمل

#### تنفيذ الطابور

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### إعادة تعيين الطابور

```php
// Clear queue without executing
$tables->resetQueue();
```

#### إضافة SQL خام

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### معالجة الأخطاء

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

تبسط فئة `Migrate` مزامنة تغييرات قاعدة البيانات بين إصدارات الوحدة. تمتد إلى `Tables` مع مقارنة المخطط والمزامنة التلقائية.

### الاستخدام الأساسي

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### في تحديث الوحدة

يُستدعى عادة في دالة `xoops_module_pre_update_*` الخاصة بالوحدة:

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

### الحصول على عبارات DDL

لقواعد البيانات الكبيرة أو ترحيلات سطر الأوامر:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### إجراءات قبل المزامنة

تتطلب بعض التغييرات معالجة صريحة قبل المزامنة. قم بتوسيع `Migrate` للترحيلات المعقدة:

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

### إدارة المخطط

#### الحصول على المخطط الحالي

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### الحصول على المخطط الهدف

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### حفظ المخطط الحالي

لمطوري الوحدات لالتقاط المخطط بعد تغييرات قاعدة البيانات:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **ملاحظة المطور:** قم دائماً بإجراء التغييرات على قاعدة البيانات أولاً، ثم قم بتشغيل `saveCurrentSchema()`. لا تقم بتحرير ملف المخطط المُنشأ يدويًا.

## Xmf\Database\TableLoad

تبسط فئة `TableLoad` تحميل البيانات الأولية في الجداول. مفيدة لتوطين الجداول بالبيانات الافتراضية أثناء تثبيت الوحدة.

### تحميل البيانات من المصفوفات

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

### تحميل البيانات من YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

صيغة YAML:

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

### استخراج البيانات

#### حساب الصفوف

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### استخراج الصفوف

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### حفظ البيانات في YAML

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

### مسح الجدول

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## مثال ترحيل كامل

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

## مرجع API

### Xmf\Database\Tables

| الطريقة | الوصف |
|--------|-------------|
| `addTable($table)` | تحميل أو إنشاء مخطط الجدول |
| `useTable($table)` | تحميل الجدول الموجود فقط |
| `renameTable($table, $newName)` | قائمة إعادة تسمية الجدول |
| `setTableOptions($table, $options)` | قائمة تغيير خيارات الجدول |
| `dropTable($table)` | قائمة إسقاط الجدول |
| `copyTable($table, $newTable, $withData)` | قائمة نسخ الجدول |
| `addColumn($table, $column, $attributes)` | قائمة إضافة العمود |
| `alterColumn($table, $column, $attributes, $newName)` | قائمة تعديل العمود |
| `getColumnAttributes($table, $column)` | الحصول على تعريف العمود |
| `dropColumn($table, $column)` | قائمة إسقاط العمود |
| `getTableIndexes($table)` | الحصول على تعاريف الفهارس |
| `addPrimaryKey($table, $column)` | قائمة المفتاح الأساسي |
| `addIndex($name, $table, 