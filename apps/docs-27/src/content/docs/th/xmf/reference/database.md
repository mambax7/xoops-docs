---
title: "ยูทิลิตี้ฐานข้อมูล"
description: "XMF ยูทิลิตี้ฐานข้อมูลสำหรับการจัดการสคีมา การย้ายข้อมูล และการโหลดข้อมูล"
---
เนมสเปซ `Xmf\Database` มีคลาสเพื่อลดความซับซ้อนของงานบำรุงรักษาฐานข้อมูลที่เกี่ยวข้องกับการติดตั้งและอัปเดตโมดูล XOOPS ยูทิลิตี้เหล่านี้จัดการการย้ายสคีมา การแก้ไขตาราง และการโหลดข้อมูลเริ่มต้น

## ภาพรวม

ยูทิลิตี้ฐานข้อมูลประกอบด้วย:

- **ตาราง** - การสร้างและดำเนินการคำสั่ง DDL สำหรับการแก้ไขตาราง
- **Migrate** - การซิงโครไนซ์สคีมาฐานข้อมูลระหว่างเวอร์ชันของโมดูล
- **TableLoad** - กำลังโหลดข้อมูลเริ่มต้นลงในตาราง

## Xmf\Database\Tables

คลาส `Tables` ช่วยลดความยุ่งยากในการสร้างและแก้ไขตารางฐานข้อมูล โดยจะสร้างคิวงานของคำสั่ง DDL (Data Definition Language) ที่ดำเนินการร่วมกัน

### คุณสมบัติที่สำคัญ

- โหลดสคีมาปัจจุบันจากตารางที่มีอยู่
- คิวเปลี่ยนแปลงโดยไม่ต้องดำเนินการทันที
- พิจารณาสถานะปัจจุบันเมื่อกำหนดงานที่ต้องทำ
- จัดการคำนำหน้าตาราง XOOPS โดยอัตโนมัติ

### เริ่มต้นใช้งาน
```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```
### การดำเนินงานตาราง

#### เปลี่ยนชื่อตาราง
```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```
#### ตั้งค่าตัวเลือกตาราง
```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```
#### วางโต๊ะ
```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```
#### คัดลอกตาราง
```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```
### การทำงานกับคอลัมน์

#### เพิ่มคอลัมน์
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
#### แก้ไขคอลัมน์
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
#### รับคุณสมบัติคอลัมน์
```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```
#### วางคอลัมน์
```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```
### การทำงานกับดัชนี

#### รับดัชนีตาราง
```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```
#### เพิ่มคีย์หลัก
```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```
#### เพิ่มดัชนี
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
#### ดัชนีลดลง
```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```
#### ยกเลิกดัชนีที่ไม่ใช่หลักทั้งหมด
```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```
#### วางคีย์หลัก
```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```
### การดำเนินการข้อมูล

#### ใส่ข้อมูล
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
#### อัปเดตข้อมูล
```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```
#### ลบข้อมูล
```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```
#### ตัดทอนตาราง
```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```
### การจัดการคิวงาน

#### ดำเนินการคิว
```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```
#### รีเซ็ตคิว
```php
// Clear queue without executing
$tables->resetQueue();
```
#### เพิ่ม Raw SQL
```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```
### การจัดการข้อผิดพลาด
```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```
## Xmf\Database\Migrate

คลาส `Migrate` ช่วยลดความยุ่งยากในการซิงโครไนซ์การเปลี่ยนแปลงฐานข้อมูลระหว่างเวอร์ชันของโมดูล โดยจะขยาย `Tables` ด้วยการเปรียบเทียบสคีมาและการซิงโครไนซ์อัตโนมัติ

### การใช้งานพื้นฐาน
```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```
### ในการอัปเดตโมดูล

โดยทั่วไปเรียกว่าในฟังก์ชัน `xoops_module_pre_update_*` ของโมดูล:
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
### รับคำสั่ง DDL

สำหรับฐานข้อมูลขนาดใหญ่หรือการย้ายบรรทัดคำสั่ง:
```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```
### การดำเนินการก่อนการซิงค์

การเปลี่ยนแปลงบางอย่างจำเป็นต้องมีการจัดการอย่างชัดเจนก่อนการซิงโครไนซ์ ขยาย `Migrate` สำหรับการย้ายข้อมูลที่ซับซ้อน:
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
### การจัดการสคีมา

#### รับสคีมาปัจจุบัน
```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```
#### รับ Schema เป้าหมาย
```php
$targetSchema = $migrate->getTargetDefinitions();
```
#### บันทึกสคีมาปัจจุบัน

สำหรับนักพัฒนาโมดูลในการจับภาพสคีมาหลังจากการเปลี่ยนแปลงฐานข้อมูล:
```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```
> **หมายเหตุสำหรับนักพัฒนา:** ทำการเปลี่ยนแปลงฐานข้อมูลก่อนเสมอ จากนั้นจึงเรียกใช้ `saveCurrentSchema()` อย่าแก้ไขไฟล์สคีมาที่สร้างขึ้นด้วยตนเอง

## Xmf\Database\TableLoad

คลาส `TableLoad` ช่วยลดความยุ่งยากในการโหลดข้อมูลเริ่มต้นลงในตาราง มีประโยชน์สำหรับการ seeding ตารางด้วยข้อมูลเริ่มต้นระหว่างการติดตั้งโมดูล

### กำลังโหลดข้อมูลจากอาร์เรย์
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
### กำลังโหลดข้อมูลจาก YAML
```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```
YAML รูปแบบ:
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
### กำลังดึงข้อมูล

#### นับแถว
```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```
#### แยกแถว
```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```
### บันทึกข้อมูลไปที่ YAML
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
### ตัดทอนตาราง
```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```
## ตัวอย่างการย้ายข้อมูลที่สมบูรณ์

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
## API ข้อมูลอ้างอิง

### Xmf\Database\Tables

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `addTable($table)` | โหลดหรือสร้างสคีมาตาราง |
| `useTable($table)` | โหลดตารางที่มีอยู่เท่านั้น |
| `renameTable($table, $newName)` | เปลี่ยนชื่อตารางคิว |
| `setTableOptions($table, $options)` | ตัวเลือกตารางคิวเปลี่ยน |
| `dropTable($table)` | ตารางคิวหล่น |
| `copyTable($table, $newTable, $withData)` | คัดลอกตารางคิว |
| `addColumn($table, $column, $attributes)` | การเพิ่มคอลัมน์คิว |
| `alterColumn($table, $column, $attributes, $newName)` | การเปลี่ยนแปลงคอลัมน์คิว |
| `getColumnAttributes($table, $column)` | รับคำนิยามคอลัมน์ |
| `dropColumn($table, $column)` | ปล่อยคอลัมน์คิว |
| `getTableIndexes($table)` | รับคำจำกัดความของดัชนี |
| `addPrimaryKey($table, $column)` | คิวคีย์หลัก |
| `addIndex($name, $table, $column, $unique)` | ดัชนีคิว |
| `dropIndex($name, $table)` | ดัชนีคิวลดลง |
| `dropIndexes($table)` | คิวดัชนีทั้งหมดลดลง |
| `dropPrimaryKey($table)` | คิวปล่อยคีย์หลัก |
| `insert($table, $columns, $quote)` | แทรกคิว |
| `update($table, $columns, $criteria, $quote)` | อัพเดทคิว |
| `delete($table, $criteria)` | คิวลบ |
| `truncate($table)` | คิวตัดทอน |
| `executeQueue($force)` | ดำเนินการดำเนินการที่อยู่ในคิว |
| `resetQueue()` | ล้างคิว |
| `addToQueue($sql)` | เพิ่มดิบ SQL |
| `getLastError()` | รับข้อความแสดงข้อผิดพลาดล่าสุด |
| `getLastErrNo()` | รับรหัสข้อผิดพลาดล่าสุด |

### Xmf\Database\Migrate

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `__construct($dirname)` | สร้างสำหรับโมดูล |
| `synchronizeSchema()` | ซิงค์ฐานข้อมูลไปยังเป้าหมาย |
| `getSynchronizeDDL()` | รับคำสั่ง DDL |
| `preSyncActions()` | แทนที่การกระทำแบบกำหนดเอง |
| `getCurrentSchema()` | รับสคีมาฐานข้อมูลปัจจุบัน |
| `getTargetDefinitions()` | รับสคีมาเป้าหมาย |
| `saveCurrentSchema()` | บันทึกสคีมาสำหรับนักพัฒนา |

### Xmf\Database\TableLoad

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `loadTableFromArray($table, $data)` | โหลดจากอาร์เรย์ |
| `loadTableFromYamlFile($table, $file)` | โหลดจาก YAML |
| `truncateTable($table)` | โต๊ะว่าง |
| `countRows($table, $criteria)` | นับแถว |
| `extractRows($table, $criteria, $skip)` | แยกแถว |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | บันทึกไปที่ YAML |

## ดูเพิ่มเติม

- ../XMF-Framework - ภาพรวมของเฟรมเวิร์ก
- ../พื้นฐาน/XMF-Module-Helper - คลาสตัวช่วยโมดูล
- Metagen - ยูทิลิตี้เมตาดาต้า

---

#xmf #database #migration #schema #tables #ddl