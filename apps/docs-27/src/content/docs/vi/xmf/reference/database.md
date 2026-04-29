---
title: "Tiện ích cơ sở dữ liệu"
description: "Tiện ích cơ sở dữ liệu XMF để quản lý lược đồ, di chuyển và tải dữ liệu"
---
Không gian tên `Xmf\Database` cung cấp classes để đơn giản hóa các tác vụ bảo trì cơ sở dữ liệu liên quan đến cài đặt và cập nhật XOOPS modules. Các tiện ích này xử lý việc di chuyển lược đồ, sửa đổi bảng và tải dữ liệu ban đầu.

## Tổng quan

Các tiện ích cơ sở dữ liệu include:

- **Bảng** - Xây dựng và thực thi các câu lệnh DDL để sửa đổi bảng
- **Di chuyển** - Đồng bộ hóa lược đồ cơ sở dữ liệu giữa các phiên bản mô-đun
- **TableLoad** - Đang tải dữ liệu ban đầu vào bảng

## Xmf\Database\Tables

`Tables` class đơn giản hóa việc tạo và sửa đổi các bảng cơ sở dữ liệu. Nó xây dựng một hàng công việc gồm các câu lệnh DDL (Ngôn ngữ định nghĩa dữ liệu) được thực thi cùng nhau.

### Các tính năng chính

- Tải lược đồ hiện tại từ các bảng hiện có
- Hàng đợi thay đổi mà không cần thực hiện ngay lập tức
- Xem xét hiện trạng khi xác định công việc cần làm
- Tự động xử lý tiền tố bảng XOOPS

### Bắt đầu

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### Thao tác trên bảng

#### Đổi tên bảng

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Đặt tùy chọn bảng

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Bỏ bàn

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Sao chép bảng

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Làm việc với cột

#### Thêm cột

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

#### Thay đổi một cột

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

#### Lấy thuộc tính cột

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Thả một cột

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Làm việc với các chỉ mục

#### Lấy chỉ mục bảng

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Thêm khóa chính

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Thêm chỉ mục

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

#### Thả chỉ mục

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Bỏ tất cả các chỉ mục không chính

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Bỏ khóa chính

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Thao tác dữ liệu

#### Chèn dữ liệu

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

#### Cập nhật dữ liệu

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Xóa dữ liệu

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Cắt bớt bảng

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Quản lý hàng đợi công việc

#### Thực thi hàng đợi

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Đặt lại hàng đợi

```php
// Clear queue without executing
$tables->resetQueue();
```

#### Thêm SQL thô

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Xử lý lỗi

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

`Migrate` class đơn giản hóa việc đồng bộ hóa các thay đổi cơ sở dữ liệu giữa các phiên bản mô-đun. Nó mở rộng `Tables` với tính năng so sánh lược đồ và đồng bộ hóa tự động.

### Cách sử dụng cơ bản

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### Trong Cập nhật mô-đun

Thường được gọi trong hàm `xoops_module_pre_update_*` của mô-đun:

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

### Nhận báo cáo DDL

Đối với cơ sở dữ liệu lớn hoặc di chuyển dòng lệnh:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Hành động đồng bộ hóa trước

Một số thay đổi yêu cầu xử lý rõ ràng trước khi đồng bộ hóa. Mở rộng `Migrate` để di chuyển phức tạp:

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

### Quản lý lược đồ

#### Nhận lược đồ hiện tại

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Lấy lược đồ mục tiêu

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Lưu lược đồ hiện tại

Để các nhà phát triển mô-đun nắm bắt lược đồ sau khi thay đổi cơ sở dữ liệu:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Lưu ý dành cho nhà phát triển:** Luôn thực hiện các thay đổi đối với cơ sở dữ liệu trước, sau đó chạy `saveCurrentSchema()`. Không chỉnh sửa thủ công tệp lược đồ đã tạo.

## Xmf\Database\TableLoad

`TableLoad` class đơn giản hóa việc tải dữ liệu ban đầu vào bảng. Hữu ích cho việc gieo hạt các bảng có dữ liệu mặc định trong quá trình cài đặt mô-đun.

### Đang tải dữ liệu từ mảng

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

### Đang tải dữ liệu từ YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Định dạng YAML:

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

### Trích xuất dữ liệu#### Đếm hàng

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Trích xuất hàng

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Lưu dữ liệu vào YAML

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

### Cắt bớt bảng

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Ví dụ di chuyển hoàn chỉnh

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

## API Tham khảo

### Xmf\Database\Tables

| Phương pháp | Mô tả |
|--------|-------------|
| `addTable($table)` | Tải hoặc tạo lược đồ bảng |
| `useTable($table)` | Chỉ tải bảng hiện có |
| `renameTable($table, $newName)` | Đổi tên bảng xếp hàng |
| `setTableOptions($table, $options)` | Tùy chọn bảng xếp hàng thay đổi |
| `dropTable($table)` | Xếp hàng thả bảng |
| `copyTable($table, $newTable, $withData)` | Sao chép bảng xếp hàng |
| `addColumn($table, $column, $attributes)` | Thêm cột hàng đợi |
| `alterColumn($table, $column, $attributes, $newName)` | Thay đổi cột hàng đợi |
| `getColumnAttributes($table, $column)` | Nhận định nghĩa cột |
| `dropColumn($table, $column)` | Thả cột hàng đợi |
| `getTableIndexes($table)` | Nhận định nghĩa chỉ mục |
| `addPrimaryKey($table, $column)` | Khóa chính của hàng đợi |
| `addIndex($name, $table, $column, $unique)` | Chỉ mục hàng đợi |
| `dropIndex($name, $table)` | Giảm chỉ số hàng đợi |
| `dropIndexes($table)` | Xếp hàng tất cả các chỉ số giảm |
| `dropPrimaryKey($table)` | Hàng đợi thả khóa chính |
| `insert($table, $columns, $quote)` | Chèn hàng đợi |
| `update($table, $columns, $criteria, $quote)` | Cập nhật hàng đợi |
| `delete($table, $criteria)` | Xóa hàng đợi |
| `truncate($table)` | Cắt ngắn hàng đợi |
| `executeQueue($force)` | Thực hiện các hoạt động xếp hàng |
| `resetQueue()` | Xóa hàng đợi |
| `addToQueue($sql)` | Thêm SQL thô |
| `getLastError()` | Nhận thông báo lỗi cuối cùng |
| `getLastErrNo()` | Nhận mã lỗi cuối cùng |

### Xmf\Database\Migrate

| Phương pháp | Mô tả |
|--------|-------------|
| `__construct($dirname)` | Tạo cho mô-đun |
| `synchronizeSchema()` | Đồng bộ hóa cơ sở dữ liệu với mục tiêu |
| `getSynchronizeDDL()` | Nhận báo cáo DDL |
| `preSyncActions()` | Ghi đè cho các hành động tùy chỉnh |
| `getCurrentSchema()` | Nhận lược đồ cơ sở dữ liệu hiện tại |
| `getTargetDefinitions()` | Nhận lược đồ mục tiêu |
| `saveCurrentSchema()` | Lưu lược đồ cho nhà phát triển |

### Xmf\Database\TableLoad

| Phương pháp | Mô tả |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Tải từ mảng |
| `loadTableFromYamlFile($table, $file)` | Tải từ YAML |
| `truncateTable($table)` | Bàn trống |
| `countRows($table, $criteria)` | Đếm hàng |
| `extractRows($table, $criteria, $skip)` | Trích xuất hàng |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Lưu vào YAML |

## Xem thêm

- ../XMF-Framework - Tổng quan về khung
- ../Basics/XMF-Module-Helper - Trình trợ giúp mô-đun class
- Metagen - Tiện ích siêu dữ liệu

---

#xmf #database #migration #schema #tables #ddl