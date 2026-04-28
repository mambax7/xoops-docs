---
title: "資料庫公用程式"
description: "用於架構管理、遷移和資料載入的 XMF 資料庫公用程式"
---

`Xmf\Database` 命名空間提供一些類別，用於簡化與安裝和更新 XOOPS 模組相關的資料庫維護任務。這些公用程式處理架構遷移、表格修改和初始資料載入。

## 概述

資料庫公用程式包括：

- **Tables** - 建置和執行 DDL 陳述式以進行表格修改
- **Migrate** - 在模組版本之間同步化資料庫架構
- **TableLoad** - 將初始資料載入到表格中

## Xmf\Database\Tables

`Tables` 類別簡化了建立和修改資料庫表格。它建置一個 DDL (資料定義語言) 陳述式的工作佇列，一起執行這些陳述式。

### 主要特性

- 從現有表格載入目前架構
- 對變更進行佇列而不立即執行
- 在決定工作時考慮目前狀態
- 自動處理 XOOPS 表格前置詞

### 入門

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### 表格操作

#### 重新命名表格

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### 設定表格選項

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### 放棄表格

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### 複製表格

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### 使用欄位

#### 新增欄位

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

#### 更改欄位

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

#### 取得欄位屬性

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### 放棄欄位

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### 使用索引

#### 取得表格索引

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### 新增主鍵

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### 新增索引

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

#### 放棄索引

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### 放棄所有非主索引

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### 放棄主鍵

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### 資料操作

#### 插入資料

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

#### 更新資料

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### 刪除資料

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### 截斷表格

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### 工作佇列管理

#### 執行佇列

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### 重置佇列

```php
// Clear queue without executing
$tables->resetQueue();
```

#### 新增原始 SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### 錯誤處理

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

`Migrate` 類別簡化了在模組版本之間同步化資料庫變更。它擴充了 `Tables` 並提供架構比較和自動同步化。

### 基本用法

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### 在模組更新中

通常在模組的 `xoops_module_pre_update_*` 函式中呼叫：

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

### 取得 DDL 陳述式

對於大型資料庫或命令列遷移：

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### 前同步化動作

某些變更需要在同步化之前進行明確處理。針對複雜的遷移擴充 `Migrate`：

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

### 架構管理

#### 取得目前架構

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### 取得目標架構

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### 儲存目前架構

供模組開發人員在資料庫變更後擷取架構：

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **開發人員備註：** 始終先對資料庫進行變更，然後執行 `saveCurrentSchema()`。不要手動編輯產生的架構檔案。

## Xmf\Database\TableLoad

`TableLoad` 類別簡化了將初始資料載入表格。適用於在模組安裝期間以預設資料植入表格。

### 從陣列載入資料

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

### 從 YAML 載入資料

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML 格式：

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

### 擷取資料

#### 計算列數

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### 擷取列

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### 將資料儲存到 YAML

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

### 截斷表格

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## 完整遷移範例

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

## API 參考資料

### Xmf\Database\Tables

| 方法 | 說明 |
|--------|-------------|
| `addTable($table)` | 載入或建立表格架構 |
| `useTable($table)` | 僅載入現有表格 |
| `renameTable($table, $newName)` | 佇列表格重新命名 |
| `setTableOptions($table, $options)` | 佇列表格選項變更 |
| `dropTable($table)` | 佇列表格放棄 |
| `copyTable($table, $newTable, $withData)` | 佇列表格複製 |
| `addColumn($table, $column, $attributes)` | 佇列欄位新增 |
| `alterColumn($table, $column, $attributes, $newName)` | 佇列欄位變更 |
| `getColumnAttributes($table, $column)` | 取得欄位定義 |
| `dropColumn($table, $column)` | 佇列欄位放棄 |
| `getTableIndexes($table)` | 取得索引定義 |
| `addPrimaryKey($table, $column)` | 佇列主鍵 |
| `addIndex($name, $table, $column, $unique)` | 佇列索引 |
| `dropIndex($name, $table)` | 佇列索引放棄 |
| `dropIndexes($table)` | 佇列所有索引放棄 |
| `dropPrimaryKey($table)` | 佇列主鍵放棄 |
| `insert($table, $columns, $quote)` | 佇列插入 |
| `update($table, $columns, $criteria, $quote)` | 佇列更新 |
| `delete($table, $criteria)` | 佇列刪除 |
| `truncate($table)` | 佇列截斷 |
| `executeQueue($force)` | 執行佇列操作 |
| `resetQueue()` | 清除佇列 |
| `addToQueue($sql)` | 新增原始 SQL |
| `getLastError()` | 取得最後一個錯誤訊息 |
| `getLastErrNo()` | 取得最後一個錯誤代碼 |

### Xmf\Database\Migrate

| 方法 | 說明 |
|--------|-------------|
| `__construct($dirname)` | 建立用於模組 |
| `synchronizeSchema()` | 同步化資料庫至目標 |
| `getSynchronizeDDL()` | 取得 DDL 陳述式 |
| `preSyncActions()` | 覆蓋以執行自訂動作 |
| `getCurrentSchema()` | 取得目前資料庫架構 |
| `getTargetDefinitions()` | 取得目標架構 |
| `saveCurrentSchema()` | 儲存架構供開發人員使用 |

### Xmf\Database\TableLoad

| 方法 | 說明 |
|--------|-------------|
| `loadTableFromArray($table, $data)` | 從陣列載入 |
| `loadTableFromYamlFile($table, $file)` | 從 YAML 載入 |
| `truncateTable($table)` | 清空表格 |
| `countRows($table, $criteria)` | 計算列數 |
| `extractRows($table, $criteria, $skip)` | 擷取列 |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | 儲存為 YAML |

## 相關資訊

- ../XMF-Framework - 框架概述
- ../Basics/XMF-Module-Helper - 模組協助者類別
- Metagen - 中繼資料公用程式

---

#xmf #database #migration #schema #tables #ddl
