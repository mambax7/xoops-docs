---
title: "כלי עזר למסד נתונים"
description: "XMF כלי עזר למסד נתונים לניהול סכימה, העברות וטעינת נתונים"
---

מרחב השמות `Xmf\Database` מספק שיעורים כדי לפשט את משימות תחזוקת מסד הנתונים הקשורות להתקנה ועדכון של מודולי XOOPS. כלי עזר אלה מטפלים בהעברת סכימה, שינויי טבלה וטעינת נתונים ראשונית.

## סקירה כללית

כלי השירות של מסד הנתונים כוללים:

- **טבלאות** - בנייה וביצוע של הצהרות DDL עבור שינויים בטבלה
- **הגירה** - סנכרון סכימת מסד נתונים בין גרסאות מודול
- **TableLoad** - טעינת נתונים ראשוניים לטבלאות

## Xmf\Database\Tables

המחלקה `Tables` מפשטת יצירה ושינוי של טבלאות מסד נתונים. הוא בונה תור עבודה של הצהרות DDL (שפת הגדרת נתונים) המבוצעות יחד.

### תכונות עיקריות

- טוען סכימה נוכחית מטבלאות קיימות
- שינויים בתורים ללא ביצוע מיידי
- לוקח בחשבון את המצב הנוכחי בעת קביעת העבודה
- מטפל אוטומטית בקידומת הטבלה XOOPS

### תחילת העבודה

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### פעולות טבלה

#### שנה שם של טבלה

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### הגדר אפשרויות טבלה

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### זרוק טבלה

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### העתק טבלה

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### עבודה עם עמודות

#### הוסף עמודה

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

#### שנה עמודה

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

#### קבל תכונות עמודות

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### שחרר עמודה

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### עבודה עם אינדקסים

#### קבל אינדקסים של טבלאות

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### הוסף מפתח ראשי

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### הוסף אינדקס

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

#### זרוק אינדקס

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### שחרר את כל האינדקסים הלא ראשיים

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### שחרר מפתח ראשי

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### פעולות נתונים

#### הוסף נתונים

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

#### עדכן נתונים

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### מחק נתונים

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### חתוך טבלה

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### ניהול תורי עבודה

#### ביצוע תור

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### אפס תור

```php
// Clear queue without executing
$tables->resetQueue();
```

#### הוסף Raw SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### טיפול בשגיאות

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

מחלקה `Migrate` מפשטת סנכרון של שינויים במסד הנתונים בין גרסאות מודול. זה מרחיב את `Tables` עם השוואת סכמות וסנכרון אוטומטי.

### שימוש בסיסי

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### בעדכון מודול

נקרא בדרך כלל בפונקציית `xoops_module_pre_update_*` של המודול:

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

### קבלת הצהרות DDL

עבור מסדי נתונים גדולים או העברות שורת פקודה:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### פעולות לפני סנכרון

שינויים מסוימים דורשים טיפול מפורש לפני סנכרון. הארך את `Migrate` עבור העברות מורכבות:

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

### ניהול סכימה

#### קבל סכימה נוכחית

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### קבל סכימת יעד

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### שמור סכימה נוכחית

למפתחי מודול ללכוד סכימה לאחר שינויים במסד הנתונים:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **הערת מפתח:** בצע תחילה שינויים במסד הנתונים ולאחר מכן הפעל את `saveCurrentSchema()`. אל תערוך ידנית את קובץ הסכימה שנוצר.

## Xmf\Database\TableLoad

מחלקה `TableLoad` מפשטת טעינת נתונים ראשוניים לטבלאות. שימושי לזריעת טבלאות עם נתוני ברירת מחדל במהלך התקנת המודול.

### טעינת נתונים ממערכים

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

### טוען נתונים מ-YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

פורמט YAML:

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

### חילוץ נתונים

#### סופר שורות

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### חלץ שורות

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### שמירת נתונים ב-YAML

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

### חתוך טבלה

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## דוגמה להגירה מלאה

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

## API הפניה

### Xmf\Database\Tables

| שיטה | תיאור |
|--------|----------------|
| `addTable($table)` | טען או צור סכימת טבלה |
| `useTable($table)` | טען טבלה קיימת בלבד |
| `renameTable($table, $newName)` | שינוי שם טבלת התורים |
| `setTableOptions($table, $options)` | שינוי אפשרויות טבלת התורים |
| `dropTable($table)` | ירידת טבלת תור |
| `copyTable($table, $newTable, $withData)` | עותק טבלת תור |
| `addColumn($table, $column, $attributes)` | הוספת עמודות בתור |
| `alterColumn($table, $column, $attributes, $newName)` | שינוי עמודה בתור |
| `getColumnAttributes($table, $column)` | קבל הגדרת עמודה |
| `dropColumn($table, $column)` | ירידת עמודה בתור |
| `getTableIndexes($table)` | קבל הגדרות אינדקס |
| `addPrimaryKey($table, $column)` | מפתח ראשי בתור |
| `addIndex($name, $table, $column, $unique)` | מדד התורים |
| `dropIndex($name, $table)` | ירידה במדד התור |
| `dropIndexes($table)` | תור את כל ירידות המדד |
| `dropPrimaryKey($table)` | הורדת מפתח ראשי בתור |
| `insert($table, $columns, $quote)` | הוספת תור |
| `update($table, $columns, $criteria, $quote)` | עדכון תור |
| `delete($table, $criteria)` | מחיקת תור |
| `truncate($table)` | קיצור תור |
| `executeQueue($force)` | ביצוע פעולות בתור |
| `resetQueue()` | נקה תור |
| `addToQueue($sql)` | הוסף גולמי SQL |
| `getLastError()` | קבל הודעת שגיאה אחרונה |
| `getLastErrNo()` | קבל קוד שגיאה אחרון |

### Xmf\Database\Migrate

| שיטה | תיאור |
|--------|----------------|
| `__construct($dirname)` | צור עבור מודול |
| `synchronizeSchema()` | סנכרן מסד נתונים למיקוד |
| `getSynchronizeDDL()` | קבל הצהרות DDL |
| `preSyncActions()` | ביטול עבור פעולות מותאמות אישית |
| `getCurrentSchema()` | קבל סכימת מסד נתונים נוכחית |
| `getTargetDefinitions()` | קבל סכימת יעד |
| `saveCurrentSchema()` | שמור סכימה למפתחים |

### Xmf\Database\TableLoad

| שיטה | תיאור |
|--------|----------------|
| `loadTableFromArray($table, $data)` | טען ממערך |
| `loadTableFromYamlFile($table, $file)` | טען מ-YAML |
| `truncateTable($table)` | שולחן ריק |
| `countRows($table, $criteria)` | ספירת שורות |
| `extractRows($table, $criteria, $skip)` | חלץ שורות |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | שמור ב-YAML |

## ראה גם

- ../XMF-Framework - סקירת מסגרת
- ../Basics/XMF-Module-Helper - כיתת עוזר מודול
- Metagen - כלי עזר ל- Metadata

---

#xmf #בסיס נתונים #הגירה #סכימה #טבלאות #ddl
