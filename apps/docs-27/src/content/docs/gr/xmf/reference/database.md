---
title: "Βοηθητικά προγράμματα βάσης δεδομένων"
description: "XMF βοηθητικά προγράμματα βάσης δεδομένων για διαχείριση σχήματος, μετεγκατάσταση και φόρτωση δεδομένων"
---

Ο χώρος ονομάτων `XMF\Database` παρέχει κλάσεις για την απλοποίηση των εργασιών συντήρησης της βάσης δεδομένων που σχετίζονται με την εγκατάσταση και την ενημέρωση των μονάδων XOOPS. Αυτά τα βοηθητικά προγράμματα χειρίζονται μετεγκαταστάσεις σχήματος, τροποποιήσεις πίνακα και αρχική φόρτωση δεδομένων.

## Επισκόπηση

Τα βοηθητικά προγράμματα της βάσης δεδομένων περιλαμβάνουν:

- **Πίνακες** - Δημιουργία και εκτέλεση δηλώσεων DDL για τροποποιήσεις πίνακα
- **Μετεγκατάσταση** - Συγχρονισμός σχήματος βάσης δεδομένων μεταξύ των εκδόσεων της μονάδας
- **TableLoad** - Φόρτωση αρχικών δεδομένων σε πίνακες

## XMF\Database\Tables

Η κλάση `Tables` απλοποιεί τη δημιουργία και την τροποποίηση πινάκων βάσης δεδομένων. Δημιουργεί μια ουρά εργασίας από δηλώσεις DDL (Γλώσσα ορισμού δεδομένων) που εκτελούνται μαζί.

## # Βασικά χαρακτηριστικά

- Φορτώνει το τρέχον σχήμα από υπάρχοντες πίνακες
- Οι ουρές αλλάζουν χωρίς άμεση εκτέλεση
- Λαμβάνει υπόψη την τρέχουσα κατάσταση κατά τον καθορισμό της εργασίας που πρέπει να κάνει
- Χειρίζεται αυτόματα το πρόθεμα πίνακα XOOPS

## # Ξεκινώντας

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

## # Λειτουργίες πίνακα

### # Μετονομασία πίνακα

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

### # Ορισμός επιλογών πίνακα

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

### # Ρίξτε έναν πίνακα

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

### # Αντιγράψτε έναν πίνακα

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

## # Εργασία με στήλες

### # Προσθήκη στήλης

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

### # Αλλαγή στήλης

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

### # Λάβετε χαρακτηριστικά στήλης

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

### # Ρίξτε μια στήλη

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

## # Εργασία με ευρετήρια

### # Λήψη ευρετηρίων πίνακα

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

### # Προσθήκη πρωτεύοντος κλειδιού

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

### # Προσθήκη ευρετηρίου

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

### # Απόθεση ευρετηρίου

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

### # Απόρριψη όλων των μη βασικών ευρετηρίων

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

### # Απόθεση πρωτεύοντος κλειδιού

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

## # Λειτουργίες δεδομένων

### # Εισαγωγή δεδομένων

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

### # Ενημέρωση δεδομένων

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

### # Διαγραφή δεδομένων

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

### # Περικοπή πίνακα

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

## # Διαχείριση ουράς εργασίας

### # Εκτέλεση ουράς

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

### # Επαναφορά ουράς

```php
// Clear queue without executing
$tables->resetQueue();
```

### # Προσθήκη Raw SQL

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

## # Χειρισμός σφαλμάτων

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## XMF\Database\Migrate

Η κλάση `Migrate ` απλοποιεί τον συγχρονισμό των αλλαγών της βάσης δεδομένων μεταξύ των εκδόσεων της μονάδας. Επεκτείνεται το ` Tables` με σύγκριση σχημάτων και αυτόματο συγχρονισμό.

## # Βασική χρήση

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

## # Στην ενημέρωση ενότητας

Συνήθως καλείται στη συνάρτηση `xoops_module_pre_update_*` της μονάδας:

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

## # Λήψη δηλώσεων DDL

Για μεγάλες βάσεις δεδομένων ή μετεγκαταστάσεις γραμμής εντολών:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

## # Ενέργειες προ-συγχρονισμού

Ορισμένες αλλαγές απαιτούν ρητό χειρισμό πριν από το συγχρονισμό. Επέκταση `Migrate` για σύνθετες μετεγκαταστάσεις:

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

## # Διαχείριση Σχήματος

### # Λήψη τρέχοντος σχήματος

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

### # Λήψη σχήματος στόχου

```php
$targetSchema = $migrate->getTargetDefinitions();
```

### # Αποθήκευση τρέχοντος σχήματος

Για τους προγραμματιστές λειτουργικών μονάδων να καταγράφουν σχήμα μετά από αλλαγές στη βάση δεδομένων:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **Σημείωση προγραμματιστή:** Πάντα να κάνετε αλλαγές στη βάση δεδομένων πρώτα και μετά να εκτελέσετε το `saveCurrentSchema()`. Μην επεξεργαστείτε μη αυτόματα το αρχείο σχήματος που δημιουργήθηκε.

## XMF\Database\TableLoad

Η κλάση `TableLoad` απλοποιεί τη φόρτωση αρχικών δεδομένων σε πίνακες. Χρήσιμο για τη σπορά πινάκων με προεπιλεγμένα δεδομένα κατά την εγκατάσταση της μονάδας.

## # Φόρτωση δεδομένων από πίνακες

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

## # Φόρτωση δεδομένων από YAML

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Μορφή YAML:

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

## # Εξαγωγή δεδομένων

### # Μετρήστε σειρές

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

### # Εξαγωγή σειρών

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

## # Αποθήκευση δεδομένων στο YAML

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

## # Περικοπή πίνακα

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Παράδειγμα πλήρους μετανάστευσης

## # xoops_version.php

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_settings'
];
```

## # include/onupdate.php

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

## API Αναφορά

## # XMF\Database\Tables

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `addTable($table)` | Φόρτωση ή δημιουργία σχήματος πίνακα |
| `useTable($table)` | Φόρτωση μόνο υπάρχοντος πίνακα |
| `renameTable($table, $newName)` | Μετονομασία πίνακα ουράς |
| `setTableOptions($table, $options)` | Αλλαγή επιλογών πίνακα ουράς |
| `dropTable($table)` | Πτώση πίνακα ουράς |
| `copyTable($table, $newTable, $withData)` | Αντίγραφο πίνακα ουράς |
| `addColumn($table, $column, $attributes)` | Προσθήκη στήλης ουράς |
| `alterColumn($table, $column, $attributes, $newName)` | Αλλαγή στήλης ουράς |
| `getColumnAttributes($table, $column)` | Λήψη ορισμού στήλης |
| `dropColumn($table, $column)` | Πτώση στήλης ουράς |
| `getTableIndexes($table)` | Λάβετε ορισμούς ευρετηρίου |
| `addPrimaryKey($table, $column)` | Ουρά πρωτεύοντος κλειδιού |
| `addIndex($name, $table, $column, $unique)` | Ευρετήριο ουράς |
| `dropIndex($name, $table)` | Πτώση ευρετηρίου ουράς |
| `dropIndexes($table)` | Ουρά όλων των πτώσεων ευρετηρίου |
| `dropPrimaryKey($table)` | Απόπτωση πρωτεύοντος κλειδιού στην ουρά |
| `insert($table, $columns, $quote)` | Ένθετο ουράς |
| `update($table, $columns, $criteria, $quote)` | Ενημέρωση ουράς |
| `delete($table, $criteria)` | Διαγραφή ουράς |
| `truncate($table)` | Περικοπή ουράς |
| `executeQueue($force)` | Εκτέλεση λειτουργιών στην ουρά |
| `resetQueue()` | Καθαρισμός ουράς |
| `addToQueue($sql)` | Προσθήκη ακατέργαστου SQL |
| `getLastError()` | Λήψη τελευταίου μηνύματος σφάλματος |
| `getLastErrNo()` | Λήψη τελευταίου κωδικού σφάλματος |

## # XMF\Database\Migrate

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `__construct($dirname)` | Δημιουργία για ενότητα |
| `synchronizeSchema()` | Συγχρονισμός βάσης δεδομένων με στόχο |
| `getSynchronizeDDL()` | Λάβετε δηλώσεις DDL |
| `preSyncActions()` | Παράκαμψη για προσαρμοσμένες ενέργειες |
| `getCurrentSchema()` | Λήψη τρέχοντος σχήματος βάσης δεδομένων |
| `getTargetDefinitions()` | Λήψη σχήματος στόχου |
| `saveCurrentSchema()` | Αποθήκευση σχήματος για προγραμματιστές |

## # XMF\Database\TableLoad

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Φόρτωση από πίνακα |
| `loadTableFromYamlFile($table, $file)` | Φόρτωση από YAML |
| `truncateTable($table)` | Άδειο τραπέζι |
| `countRows($table, $criteria)` | Μέτρηση σειρών |
| `extractRows($table, $criteria, $skip)` | Εξαγωγή σειρών |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Αποθήκευση στο YAML |

## Δείτε επίσης

- ../XMF-Framework - Επισκόπηση πλαισίου
- ../Basics/XMF-Module-Helper - Βοηθητική τάξη ενότητας
- Metagen - Βοηθητικά προγράμματα μεταδεδομένων

---

# XMF #βάση δεδομένων #migration #schema #tables #ddl
