---
title: "SQL इंजेक्शन रोकथाम"
description: "डेटाबेस सुरक्षा प्रथाएँ और XOOPS में SQL इंजेक्शन को रोकना"
---
SQL इंजेक्शन सबसे खतरनाक और सामान्य वेब एप्लिकेशन कमजोरियों में से एक है। यह मार्गदर्शिका बताती है कि आपके XOOPS मॉड्यूल को SQL इंजेक्शन हमलों से कैसे बचाया जाए।

## संबंधित दस्तावेज़ीकरण

- सुरक्षा-सर्वोत्तम अभ्यास - व्यापक सुरक्षा मार्गदर्शिका
- CSRF-संरक्षण - टोकन प्रणाली और XoopsSecurity वर्ग
- इनपुट-स्वच्छता - MyTextSanitizer और सत्यापन

## SQL इंजेक्शन को समझना

SQL इंजेक्शन तब होता है जब उपयोगकर्ता इनपुट को उचित स्वच्छता या पैरामीटराइजेशन के बिना सीधे SQL क्वेरी में शामिल किया जाता है।

### कमजोर कोड उदाहरण

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

यदि कोई उपयोगकर्ता आईडी के रूप में `1 OR 1=1` पास करता है, तो क्वेरी बन जाती है:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

यह केवल एक के बजाय सभी रिकॉर्ड लौटाता है।

## पैरामीटरयुक्त प्रश्नों का उपयोग करना

SQL इंजेक्शन के विरुद्ध सबसे प्रभावी बचाव पैरामीटरयुक्त क्वेरीज़ (तैयार कथन) का उपयोग करना है।

### बुनियादी पैरामीटरयुक्त क्वेरी

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### एकाधिक पैरामीटर

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### नामित पैरामीटर

कुछ डेटाबेस अमूर्त नामित पैरामीटर का समर्थन करते हैं:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## XoopsObject और XoopsObjectHandler का उपयोग करना

XOOPS ऑब्जेक्ट-ओरिएंटेड डेटाबेस एक्सेस प्रदान करता है जो Criteria सिस्टम के माध्यम से SQL इंजेक्शन को रोकने में मदद करता है।

### बुनियादी Criteria उपयोग

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo एकाधिक स्थितियों के लिए

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Criteria ऑपरेटर्स

```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### या शर्तें

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## टेबल उपसर्ग

हमेशा XOOPS तालिका उपसर्ग प्रणाली का उपयोग करें:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT प्रश्न

### तैयार कथनों का उपयोग करना

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### XoopsObject का उपयोग करना

```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## UPDATE प्रश्न

### तैयार कथनों का उपयोग करना

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### XoopsObject का उपयोग करना

```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## DELETE प्रश्न

### तैयार कथनों का उपयोग करना

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### XoopsObject का उपयोग करना

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### थोक में Criteria से हटाएं

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## आवश्यक होने पर भाग जाना

यदि आप तैयार कथनों का उपयोग नहीं कर सकते, तो उचित एस्केपिंग का उपयोग करें:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

हालाँकि, भागने की बजाय **हमेशा तैयार किए गए बयानों को प्राथमिकता दें**।

## सुरक्षित रूप से गतिशील क्वेरीज़ का निर्माण

### सुरक्षित गतिशील कॉलम नाम

कॉलम नामों को पैरामीटराइज़ नहीं किया जा सकता. श्वेतसूची के विरुद्ध सत्यापन करें:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### सुरक्षित गतिशील तालिका नाम

इसी प्रकार, तालिका नाम मान्य करें:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### गतिशील रूप से WHERE क्लॉज का निर्माण

```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## LIKE प्रश्न

वाइल्डकार्ड इंजेक्शन से बचने के लिए LIKE प्रश्नों से सावधान रहें:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## खंडों में

IN क्लॉज़ का उपयोग करते समय, सुनिश्चित करें कि सभी मान ठीक से टाइप किए गए हैं:

```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

या Criteria के साथ:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## लेनदेन सुरक्षा

एकाधिक संबंधित क्वेरी निष्पादित करते समय:

```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## त्रुटि प्रबंधन

उपयोगकर्ताओं के सामने कभी भी SQL त्रुटियाँ उजागर न करें:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## सामान्य गलतियों से बचना चाहिए

### गलती 1: प्रत्यक्ष चर अंतर्वेशन

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### गलती 2: addslashes() का उपयोग करना

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### गलती 3: संख्यात्मक आईडी पर भरोसा करना

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### गलती 4: दूसरे क्रम का इंजेक्शन

```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## सुरक्षा परीक्षण

### अपने प्रश्नों का परीक्षण करें

SQL इंजेक्शन की जांच के लिए इन इनपुट के साथ अपने फॉर्म का परीक्षण करें:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

यदि इनमें से कोई भी अप्रत्याशित व्यवहार या त्रुटियों का कारण बनता है, तो आपके पास एक भेद्यता है।

### स्वचालित परीक्षण

विकास के दौरान स्वचालित SQL इंजेक्शन परीक्षण उपकरण का उपयोग करें:

- SQLमैप
- बर्प सूट
- OWASP जैप

## सर्वोत्तम प्रथाओं का सारांश1. **हमेशा पैरामीटरयुक्त प्रश्नों का उपयोग करें** (तैयार कथन)
2. **जब संभव हो तो XoopsObject/XoopsObjectHandler** का उपयोग करें
3. **प्रश्न निर्माण के लिए Criteria कक्षाओं** का उपयोग करें
4. कॉलम और तालिका नामों के लिए **श्वेतसूची अनुमत मान**
5. **संख्यात्मक मान कास्ट करें** स्पष्ट रूप से `(int)` या `(float)` के साथ
6. **डेटाबेस त्रुटियों को कभी भी उपयोगकर्ताओं के सामने उजागर न करें**
7. अनेक संबंधित प्रश्नों के लिए **लेन-देन का उपयोग करें**
8. विकास के दौरान **SQL इंजेक्शन के लिए परीक्षण**
9. खोज क्वेरी में **LIKE वाइल्डकार्ड से बचें**
10. **क्लॉज मानों को अलग-अलग साफ करें**

---

#सुरक्षा #SQL-इंजेक्शन #डेटाबेस #xoops #तैयार-कथन #Criteria