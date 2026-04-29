---
title: “数据库实用程序”
description: “XMF用于模式管理、迁移和数据加载的数据库实用程序”
---

`XMF\Database`命名空间提供了一些类来简化与安装和更新XOOPS模区块相关的数据库维护任务。这些实用程序处理架构迁移、表修改和初始数据加载。

## 概述

数据库实用程序包括：

- **表** - 构建和执行 DDL 语句以进行表修改
- **迁移** - 在模区块版本之间同步数据库架构
- **TableLoad** - 将初始数据加载到表中

## XMF\Database\Tables

`Tables`类简化了数据库表的创建和修改。它构建了一起执行的 DDL（数据定义语言）语句的工作队列。

### 主要特点

- 从现有表加载当前模式
- 队列更改而不立即执行
- 在确定要做的工作时考虑当前状态
- 自动处理XOOPS表前缀

### 入门

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### 表操作

#### 重命名表

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### 设置表选项

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### 删除一个表

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### 复制表格

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### 使用列

#### 添加列

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

#### 更改列

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

#### 获取列属性

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### 删除一列

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### 使用索引

#### 获取表索引

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### 添加主键

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### 添加索引

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

#### 掉落指数

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### 删除所有非-Primary 索引

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### 删除主键

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### 数据操作

#### 插入数据

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

#### 更新数据

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### 删除数据

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### 截断表

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### 工作队列管理

#### 执行队列

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### 重置队列

```php
// Clear queue without executing
$tables->resetQueue();
```

#### 添加原始SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### 错误处理

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## XMF\Database\Migrate

`Migrate`类简化了模区块版本之间数据库更改的同步。它通过模式比较和自动同步扩展了`Tables`。

### 基本用法

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### 模区块更新中

通常在模区块的 `XOOPS_module_pre_update_*` 函数中调用：

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

### 获取 DDL 声明

对于大型数据库或命令-line迁移：

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### Pre-Sync 行动

某些更改需要在同步之前进行显式处理。扩展 `Migrate` 以进行复杂迁移：

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

### 模式管理

#### 获取当前架构

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### 获取目标架构

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### 保存当前架构

模区块开发人员可以在数据库更改后捕获架构：

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **开发人员注意：** 始终先对数据库进行更改，然后运行`saveCurrentSchema()`。不要手动编辑生成的架构文件。

## XMF\Database\TableLoad

`TableLoad`类简化了将初始数据加载到表中的过程。对于在模区块安装期间使用默认数据播种表很有用。

### 从数组加载数据

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

### 从YAML加载数据

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML格式：

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

### 提取数据

#### 计算行数

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### 提取行

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### 将数据保存到YAML

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

### 截断表

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## 完整的迁移示例

### XOOPS_version.php

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

## API 参考

### XMF\Database\Tables|方法|描述 |
|--------|-------------|
| `addTable($table)` |加载或创建表架构 |
| `useTable($table)` |仅加载现有表 |
| `renameTable($table, $newName)` |队列表重命名 |
| `setTableOptions($table, $options)` |队列表选项更改 |
| `dropTable($table)` |队列表删除 |
| `copyTable($table, $newTable, $withData)` |队列表副本|
| `addColumn($table, $column, $attributes)` |队列列添加 |
| `alterColumn($table, $column, $attributes, $newName)` |队列列变化 |
| `getColumnAttributes($table, $column)`|获取列定义 |
| `dropColumn($table, $column)` |队列列下降|
| `getTableIndexes($table)` |获取索引定义 |
| `addPrimaryKey($table, $column)` |队列主键|
| `addIndex($name, $table, $column, $unique)`|队列索引 |
| `dropIndex($name, $table)` |队列索引下降|
| `dropIndexes($table)` |将所有索引丢弃排队 |
| `dropPrimaryKey($table)` |队列主键删除 |
| `insert($table, $columns, $quote)`|队列插入 |
| `update($table, $columns, $criteria, $quote)` |队列更新 |
| `delete($table, $criteria)` |队列删除|
| `truncate($table)` |队列截断|
| `executeQueue($force)` |执行排队操作 |
| `resetQueue()` |清空队列 |
| `addToQueue($sql)` |添加原始SQL |
| `getLastError()` |获取最后一条错误消息 |
| `getLastErrNo()`|获取最后一个错误代码 |

### XMF\Database\Migrate

|方法|描述 |
|--------|-------------|
| `__construct($dirname)` |为模区块创建 |
| `synchronizeSchema()`|将数据库同步到目标 |
| `getSynchronizeDDL()`|获取 DDL 声明 |
| `preSyncActions()` |覆盖自定义操作 |
| `getCurrentSchema()` |获取当前数据库架构 |
| `getTargetDefinitions()` |获取目标架构 |
| `saveCurrentSchema()` |为开发人员保存架构 |

### XMF\Database\TableLoad

|方法|描述 |
|--------|-------------|
| `loadTableFromArray($table, $data)`|从数组加载 |
| `loadTableFromYamlFile($table, $file)`|从 YAML 加载 |
| `truncateTable($table)`|空桌子|
| `countRows($table, $criteria)` |计算行数 |
| `extractRows($table, $criteria, $skip)`|提取行|
| `saveTableToYamlFile($table, $file, $criteria, $skip)` |保存至YAML|

## 另请参阅

- ../XMF-Framework - 框架概述
- ../Basics/XMF-Module-Helper - 模区块助手类
- Metagen - 元数据实用程序

---

#xmf #database #migration #schema #tables #ddl