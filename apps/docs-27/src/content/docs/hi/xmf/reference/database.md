---
title: "डेटाबेस उपयोगिताएँ"
description: "स्कीमा प्रबंधन, माइग्रेशन और डेटा लोडिंग के लिए XMF डेटाबेस उपयोगिताएँ"
---
`Xmf\Database` नेमस्पेस XOOPS मॉड्यूल को स्थापित करने और अपडेट करने से जुड़े डेटाबेस रखरखाव कार्यों को सरल बनाने के लिए कक्षाएं प्रदान करता है। ये उपयोगिताएँ स्कीमा माइग्रेशन, तालिका संशोधन और प्रारंभिक डेटा लोडिंग को संभालती हैं।

## अवलोकन

डेटाबेस उपयोगिताओं में शामिल हैं:

- **टेबल्स** - टेबल संशोधनों के लिए डीडीएल स्टेटमेंट बनाना और निष्पादित करना
- **माइग्रेट** - मॉड्यूल संस्करणों के बीच डेटाबेस स्कीमा को सिंक्रनाइज़ करना
- **TableLoad** - प्रारंभिक डेटा को तालिकाओं में लोड किया जा रहा है

## Xmf\Database\Tables

`Tables` वर्ग डेटाबेस तालिकाएँ बनाने और संशोधित करने को सरल बनाता है। यह DDL (डेटा डेफिनिशन लैंग्वेज) स्टेटमेंट्स की एक कार्य कतार बनाता है जिन्हें एक साथ निष्पादित किया जाता है।

### मुख्य विशेषताएं

- मौजूदा तालिकाओं से वर्तमान स्कीमा लोड करता है
- कतारें तत्काल निष्पादन के बिना बदल जाती हैं
- किए जाने वाले कार्य का निर्धारण करते समय वर्तमान स्थिति पर विचार करता है
- स्वचालित रूप से XOOPS तालिका उपसर्ग को संभालता है

### आरंभ करना

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### टेबल संचालन

#### किसी तालिका का नाम बदलें

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### तालिका विकल्प सेट करें

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### एक टेबल गिराएं

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### तालिका की प्रतिलिपि बनाएँ

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### कॉलम के साथ कार्य करना

#### एक कॉलम जोड़ें

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

#### एक कॉलम बदलें

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

#### कॉलम विशेषताएँ प्राप्त करें

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### एक कॉलम छोड़ें

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### इंडेक्स के साथ काम करना

#### टेबल इंडेक्स प्राप्त करें

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### प्राथमिक कुंजी जोड़ें

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### अनुक्रमणिका जोड़ें

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

#### ड्रॉप इंडेक्स

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### सभी गैर-प्राथमिक सूचकांक हटाएं

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### प्राथमिक कुंजी छोड़ें

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### डेटा संचालन

#### डेटा डालें

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

#### डेटा अपडेट करें

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### डेटा हटाएं

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### ट्रंकेट टेबल

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### कार्य कतार प्रबंधन

#### कतार निष्पादित करें

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### कतार रीसेट करें

```php
// Clear queue without executing
$tables->resetQueue();
```

#### रॉ SQL जोड़ें

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### त्रुटि प्रबंधन

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

`Migrate` वर्ग मॉड्यूल संस्करणों के बीच डेटाबेस परिवर्तनों को सिंक्रनाइज़ करना सरल बनाता है। यह स्कीमा तुलना और स्वचालित सिंक्रनाइज़ेशन के साथ `Tables` तक विस्तारित होता है।

### मूल उपयोग

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### मॉड्यूल अद्यतन में

आमतौर पर मॉड्यूल के `xoops_module_pre_update_*` फ़ंक्शन में कॉल किया जाता है:

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

### डीडीएल विवरण प्राप्त करना

बड़े डेटाबेस या कमांड-लाइन माइग्रेशन के लिए:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### प्री-सिंक क्रियाएँ

कुछ परिवर्तनों के लिए सिंक्रनाइज़ेशन से पहले स्पष्ट प्रबंधन की आवश्यकता होती है। जटिल माइग्रेशन के लिए `Migrate` बढ़ाएँ:

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

### स्कीमा प्रबंधन

#### वर्तमान स्कीमा प्राप्त करें

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### लक्ष्य स्कीमा प्राप्त करें

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### वर्तमान स्कीमा सहेजें

मॉड्यूल डेवलपर्स के लिए डेटाबेस परिवर्तन के बाद स्कीमा कैप्चर करना:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **डेवलपर नोट:** हमेशा पहले डेटाबेस में बदलाव करें, फिर `saveCurrentSchema()` चलाएँ। जनरेट की गई स्कीमा फ़ाइल को मैन्युअल रूप से संपादित न करें.

## Xmf\Database\TableLoad

`TableLoad` वर्ग प्रारंभिक डेटा को तालिकाओं में लोड करना सरल बनाता है। मॉड्यूल स्थापना के दौरान डिफ़ॉल्ट डेटा के साथ सीडिंग तालिकाओं के लिए उपयोगी।

### ऐरे से डेटा लोड हो रहा है

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

### YAML से डेटा लोड हो रहा है

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML प्रारूप:

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

### डेटा निकालना

#### पंक्तियाँ गिनें

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### पंक्तियाँ निकालें

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### डेटा को YAML पर सहेजा जा रहा है

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

### ट्रंकेट टेबल

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## संपूर्ण प्रवासन उदाहरण

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

## API संदर्भ

### Xmf\Database\Tables| विधि | विवरण |
|-------|----|
| `addTable($table)` | टेबल स्कीमा लोड करें या बनाएं |
| `useTable($table)` | केवल मौजूदा तालिका लोड करें |
| `renameTable($table, $newName)` | कतार तालिका का नाम बदलें |
| `setTableOptions($table, $options)` | कतार तालिका विकल्प बदलते हैं |
| `dropTable($table)` | कतार तालिका ड्रॉप |
| `copyTable($table, $newTable, $withData)` | कतार तालिका प्रति |
| `addColumn($table, $column, $attributes)` | कतार स्तंभ जोड़ |
| `alterColumn($table, $column, $attributes, $newName)` | कतार स्तंभ परिवर्तन |
| `getColumnAttributes($table, $column)` | कॉलम परिभाषा प्राप्त करें |
| `dropColumn($table, $column)` | कतार स्तंभ ड्रॉप |
| `getTableIndexes($table)` | सूचकांक परिभाषाएँ प्राप्त करें |
| `addPrimaryKey($table, $column)` | कतार प्राथमिक कुंजी |
| `addIndex($name, $table, $column, $unique)` | कतार सूचकांक |
| `dropIndex($name, $table)` | कतार सूचकांक में गिरावट |
| `dropIndexes($table)` | सभी सूचकांक ड्रॉप्स को कतारबद्ध करें |
| `dropPrimaryKey($table)` | कतार प्राथमिक कुंजी ड्रॉप |
| `insert($table, $columns, $quote)` | कतार सम्मिलित करें |
| `update($table, $columns, $criteria, $quote)` | कतार अद्यतन |
| `delete($table, $criteria)` | कतार हटाएं |
| `truncate($table)` | कतार काट-छाँट |
| `executeQueue($force)` | पंक्तिबद्ध संचालन निष्पादित करें |
| `resetQueue()` | कतार साफ़ करें |
| `addToQueue($sql)` | कच्चा SQL जोड़ें |
| `getLastError()` | अंतिम त्रुटि संदेश प्राप्त करें |
| `getLastErrNo()` | अंतिम त्रुटि कोड प्राप्त करें |

### Xmf\Database\Migrate

| विधि | विवरण |
|-------|----|
| `__construct($dirname)` | मॉड्यूल के लिए बनाएं |
| `synchronizeSchema()` | लक्ष्य के साथ डेटाबेस सिंक करें |
| `getSynchronizeDDL()` | डीडीएल विवरण प्राप्त करें |
| `preSyncActions()` | कस्टम कार्रवाइयों के लिए ओवरराइड |
| `getCurrentSchema()` | वर्तमान डेटाबेस स्कीमा प्राप्त करें |
| `getTargetDefinitions()` | लक्ष्य स्कीमा प्राप्त करें |
| `saveCurrentSchema()` | डेवलपर्स के लिए स्कीमा सहेजें |

### Xmf\Database\TableLoad

| विधि | विवरण |
|-------|----|
| `loadTableFromArray($table, $data)` | सरणी से लोड करें |
| `loadTableFromYamlFile($table, $file)` | YAML | से लोड करें
| `truncateTable($table)` | खाली टेबल |
| `countRows($table, $criteria)` | पंक्तियाँ गिनें |
| `extractRows($table, $criteria, $skip)` | पंक्तियाँ निकालें |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | YAML पर सहेजें |

## यह भी देखें

- ../XMF-फ्रेमवर्क - फ्रेमवर्क सिंहावलोकन
- ../बेसिक्स/XMF-मॉड्यूल-हेल्पर - मॉड्यूल सहायक वर्ग
- मेटाजेन - मेटाडेटा उपयोगिताएँ

---

#XMF #डेटाबेस #माइग्रेशन #स्कीमा #टेबल्स #डीडीएल