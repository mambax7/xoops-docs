---
title: "डेटाबेस संचालन"
---
## अवलोकन

XOOPS एक डेटाबेस एब्स्ट्रैक्शन परत प्रदान करता है जो विरासत प्रक्रियात्मक पैटर्न और आधुनिक ऑब्जेक्ट-ओरिएंटेड दृष्टिकोण दोनों का समर्थन करता है। यह मार्गदर्शिका मॉड्यूल विकास के लिए सामान्य डेटाबेस संचालन को कवर करती है।

## डेटाबेस कनेक्शन

### डेटाबेस इंस्टेंस प्राप्त करना

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## बुनियादी संचालन

### SELECT प्रश्न

```php
// Simple query
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// With parameters (safe approach)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Single row
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### INSERT संचालन

```php
// Basic insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Get last insert ID
$newId = $db->getInsertId();
```

### UPDATE संचालन

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Check affected rows
$affectedRows = $db->getAffectedRows();
```

### DELETE संचालन

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Criteria का उपयोग करना

Criteria सिस्टम क्वेरीज़ बनाने का एक प्रकार-सुरक्षित तरीका प्रदान करता है:

```php
use Criteria;
use CriteriaCompo;

// Simple criteria
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Compound criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Criteria ऑपरेटर्स

| ऑपरेटर | विवरण |
|---|----|
| `=` | समान (डिफ़ॉल्ट) |
| `!=` | बराबर नहीं |
| `<` | से कम |
| `>` | से भी बड़ा |
| `<=` | से कम या बराबर |
| `>=` | से बड़ा या बराबर |
| `LIKE` | पैटर्न मिलान |
| `IN` | मूल्यों के सेट में |

```php
// LIKE criteria
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN criteria
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Date range
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## ऑब्जेक्ट हैंडलर

### हैंडलर तरीके

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Create new object
$item = $handler->create();

// Get by ID
$item = $handler->get($id);

// Get multiple
$items = $handler->getObjects($criteria);

// Get as array
$items = $handler->getAll($criteria);

// Count
$count = $handler->getCount($criteria);

// Save
$success = $handler->insert($item);

// Delete
$success = $handler->delete($item);
```

### कस्टम हैंडलर तरीके

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## लेन-देन

```php
// Begin transaction
$db->query('START TRANSACTION');

try {
    // Perform multiple operations
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Commit if all succeed
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Rollback on error
    $db->query('ROLLBACK');
    throw $e;
}
```

## तैयार विवरण (आधुनिक)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## स्कीमा प्रबंधन

### तालिकाएँ बनाना

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### प्रवास

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## सर्वोत्तम प्रथाएँ

1. **हमेशा उद्धरण स्ट्रिंग्स** - उपयोगकर्ता इनपुट के लिए `$db->quoteString()` का उपयोग करें
2. **इंटवल का उपयोग करें** - `intval()` के साथ पूर्णांक कास्ट करें या घोषणाएँ टाइप करें
3. **हैंडलर को प्राथमिकता दें** - जब संभव हो तो कच्चे SQL पर ऑब्जेक्ट हैंडलर का उपयोग करें
4. **Criteria** का उपयोग करें - प्रकार की सुरक्षा के लिए Criteria के साथ क्वेरी बनाएं
5. **त्रुटियों को संभालें** - रिटर्न मानों की जांच करें और विफलताओं को संभालें
6. **लेन-देन का उपयोग करें** - लेन-देन में संबंधित परिचालन को लपेटें

## संबंधित दस्तावेज़ीकरण

- ../04-API-रेफरेंस/कर्नेल/Criteria - Criteria के साथ क्वेरी बिल्डिंग
- ../04-API-रेफरेंस/कोर/XoopsObjectHandler - हैंडलर पैटर्न
- ../02-कोर-कॉन्सेप्ट्स/डेटाबेस/डेटाबेस-लेयर - डेटाबेस एब्स्ट्रैक्शन
- डेटाबेस/डेटाबेस-स्कीमा - स्कीमा डिज़ाइन गाइड