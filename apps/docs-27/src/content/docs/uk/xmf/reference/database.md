---
title: "Утиліти бази даних"
description: "XMF утиліти бази даних для керування схемами, міграції та завантаження даних"
---
Простір імен `XMF\Database` надає класи для спрощення завдань обслуговування бази даних, пов’язаних із встановленням та оновленням модулів XOOPS. Ці утиліти обробляють міграції схем, модифікації таблиць і початкове завантаження даних.

## Огляд

Утиліти бази даних включають:

- **Таблиці** - Створення та виконання операторів DDL для модифікації таблиць
- **Migrate** - Синхронізація схеми бази даних між версіями модуля
- **TableLoad** - Завантаження початкових даних у таблиці

## XMF\Database\Tables

Клас `Tables` спрощує створення та модифікацію таблиць бази даних. Він створює робочу чергу операторів DDL (мова визначення даних), які виконуються разом.

### Ключові характеристики

- Завантажує поточну схему з існуючих таблиць
- Черги змін без негайного виконання
- Враховує поточний стан при визначенні роботи, яку потрібно виконати
- Автоматично обробляє префікс таблиці XOOPS

### Початок роботи
```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```
### Операції з таблицею

#### Перейменувати таблицю
```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```
#### Налаштувати параметри таблиці
```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```
#### Опустіть таблицю
```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```
#### Копіювати таблицю
```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```
### Робота зі стовпцями

#### Додати стовпець
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
#### Змінити стовпець
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
#### Отримати атрибути стовпців
```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```
#### Опустіть стовпець
```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```
### Робота з індексами

#### Отримати індекси таблиць
```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```
#### Додати первинний ключ
```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```
#### Додати індекс
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
#### Індекс падіння
```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```
#### Видалити всі неосновні індекси
```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```
#### Відкинути первинний ключ
```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```
### Операції з даними

#### Вставити дані
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
#### Оновити дані
```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```
#### Видалити дані
```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```
#### Обрізати таблицю
```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```
### Керування робочою чергою

#### Черга виконання
```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```
#### Скинути чергу
```php
// Clear queue without executing
$tables->resetQueue();
```
#### Додати Raw SQL
```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```
### Обробка помилок
```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```
## XMF\Database\Migrate

Клас `Migrate` спрощує синхронізацію змін бази даних між версіями модуля. Він розширює `Tables` порівнянням схем і автоматичною синхронізацією.

### Основне використання
```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```
### В оновленні модуля

Зазвичай викликається у функції `xoops_module_pre_update_*` модуля:
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
### Отримання DDL виписок

Для великих баз даних або міграцій командного рядка:
```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```
### Дії перед синхронізацією

Деякі зміни потребують явної обробки перед синхронізацією. Розширити `Migrate` для комплексних міграцій:
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
### Керування схемами

#### Отримати поточну схему
```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```
#### Отримати цільову схему
```php
$targetSchema = $migrate->getTargetDefinitions();
```
#### Зберегти поточну схему

Для розробників модулів для захоплення схеми після змін бази даних:
```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```
> **Примітка розробника:** завжди спочатку вносьте зміни в базу даних, а потім запускайте `saveCurrentSchema()`. Не редагуйте вручну створений файл схеми.

## XMF\Database\TableLoad

Клас `TableLoad` спрощує завантаження початкових даних у таблиці. Корисно для заповнення таблиць стандартними даними під час встановлення модуля.

### Завантаження даних з масивів
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
### Завантаження даних з YAML
```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```
YAML формат:
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
### Вилучення даних

#### Підрахувати рядки
```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```
#### Витягти рядки
```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```
### Збереження даних у YAML
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
### Обрізати таблицю
```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```
## Повний приклад міграції

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
## API Посилання

### XMF\Database\Tables

| Метод | Опис |
|--------|-------------|
| `addTable($table)` | Завантажити або створити схему таблиці |
| `useTable($table)` | Завантажити лише існуючу таблицю |
| `renameTable($table, $newName)` | Перейменування таблиці черги |
| `setTableOptions($table, $options)` | Зміна параметрів таблиці черги |
| `dropTable($table)` | Видалення таблиці черги |
| `copyTable($table, $newTable, $withData)` | Копія таблиці черги |
| `addColumn($table, $column, $attributes)` | Додавання стовпця черги |
| `alterColumn($table, $column, $attributes, $newName)` | Зміна колонки черги |
| `getColumnAttributes($table, $column)` | Отримати визначення стовпця |
| `dropColumn($table, $column)` | Відкинути стовпець черги |
| `getTableIndexes($table)` | Отримати визначення індексів |
| `addPrimaryKey($table, $column)` | Первинний ключ черги |
| `addIndex($name, $table, $column, $unique)` | Індекс черги |
| `dropIndex($name, $table)` | Зниження індексу черги |
| `dropIndexes($table)` | Поставити в чергу всі падіння індексу |
| `dropPrimaryKey($table)` | Відкидання первинного ключа черги |
| `insert($table, $columns, $quote)` | Вставка черги |
| `update($table, $columns, $criteria, $quote)` | Оновлення черги |
| `delete($table, $criteria)` | Видалити чергу |
| `truncate($table)` | Скорочення черги |
| `executeQueue($force)` | Виконати операції в черзі |
| `resetQueue()` | Очистити чергу |
| `addToQueue($sql)` | Додати необроблений SQL |
| `getLastError()` | Отримати останнє повідомлення про помилку |
| `getLastErrNo()` | Отримати останній код помилки |### XMF\Database\Migrate

| Метод | Опис |
|--------|-------------|
| `__construct($dirname)` | Створити для модуля |
| `synchronizeSchema()` | Синхронізувати базу даних із цільовою |
| `getSynchronizeDDL()` | Отримати DDL виписки |
| `preSyncActions()` | Перевизначення для спеціальних дій |
| `getCurrentSchema()` | Отримати поточну схему бази даних |
| `getTargetDefinitions()` | Отримати цільову схему |
| `saveCurrentSchema()` | Зберегти схему для розробників |

### XMF\Database\TableLoad

| Метод | Опис |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Завантажити з масиву |
| `loadTableFromYamlFile($table, $file)` | Завантажити з YAML |
| `truncateTable($table)` | Порожня таблиця |
| `countRows($table, $criteria)` | Підрахувати рядки |
| `extractRows($table, $criteria, $skip)` | Витяг рядків |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Зберегти до YAML |

## Дивіться також

- ../XMF-Framework - Огляд фреймворку
- ../Basics/XMF-Module-Helper - Клас допоміжного модуля
- Metagen - утиліти метаданих

---

#XMF #база даних #міграція #схема #таблиці #ddl