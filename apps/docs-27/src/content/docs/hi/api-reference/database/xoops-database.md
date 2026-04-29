---
title: "XoopsDatabase कक्षा"
description: "डेटाबेस एब्स्ट्रैक्शन परत कनेक्शन प्रबंधन, क्वेरी निष्पादन और परिणाम प्रबंधन प्रदान करती है"
---
`XoopsDatabase` वर्ग XOOPS के लिए एक डेटाबेस एब्स्ट्रैक्शन परत प्रदान करता है, जो कनेक्शन प्रबंधन, क्वेरी निष्पादन, परिणाम प्रसंस्करण और त्रुटि प्रबंधन को संभालता है। यह ड्राइवर आर्किटेक्चर के माध्यम से एकाधिक डेटाबेस ड्राइवरों का समर्थन करता है।

## कक्षा अवलोकन

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## वर्ग पदानुक्रम

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## एक डेटाबेस इंस्टेंस प्राप्त करना

### फ़ैक्टरी का उपयोग करना

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### getInstance का उपयोग करना

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### वैश्विक चर

```php
// Legacy: Use global variable
global $xoopsDB;
```

## कोर तरीके

### कनेक्ट करें

एक डेटाबेस कनेक्शन स्थापित करता है.

```php
abstract public function connect(bool $selectdb = true): bool
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$selectdb` | बूल | डेटाबेस का चयन करना है या नहीं |

**रिटर्न:** `bool` - सफल कनेक्शन पर सत्य

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### प्रश्न

SQL क्वेरी निष्पादित करता है.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$sql` | स्ट्रिंग | SQL क्वेरी स्ट्रिंग |
| `$limit` | int | लौटने के लिए अधिकतम पंक्तियाँ (0 = कोई सीमा नहीं) |
| `$start` | int | ऑफसेट शुरू करना |

**रिटर्न:** `resource|bool` - विफलता पर परिणाम संसाधन या गलत

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Simple query
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query with limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // First 10 rows

// Query with offset
$result = $db->query($sql, 10, 20); // 10 rows starting at row 20
```

---

### क्वेरीएफ

ऑपरेशन को बाध्य करने वाली क्वेरी निष्पादित करता है (सुरक्षा जांच को बायपास करता है)।

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**उपयोग के मामले:**
- INSERT, UPDATE, DELETE संचालन
- जब आपको केवल पढ़ने योग्य प्रतिबंधों को बायपास करने की आवश्यकता हो

**उदाहरण:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### उपसर्ग

डेटाबेस तालिका उपसर्ग जोड़ता है।

```php
public function prefix(string $table = ''): string
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$table` | स्ट्रिंग | उपसर्ग के बिना तालिका का नाम |

**रिटर्न:** `string` - उपसर्ग के साथ तालिका का नाम

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### फ़ेचअरे

एक परिणाम पंक्ति को एक सहयोगी सरणी के रूप में लाता है।

```php
abstract public function fetchArray($result): ?array
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$result` | संसाधन | क्वेरी परिणाम संसाधन |

**रिटर्न:** `array|null` - यदि कोई पंक्तियाँ नहीं हैं तो सहयोगी सरणी या शून्य

**उदाहरण:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### फ़ेचऑब्जेक्ट

परिणाम पंक्ति को ऑब्जेक्ट के रूप में लाता है।

```php
abstract public function fetchObject($result): ?object
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$result` | संसाधन | क्वेरी परिणाम संसाधन |

**रिटर्न:** `object|null` - प्रत्येक कॉलम के लिए गुणों वाली वस्तु

**उदाहरण:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### फ़ेचरो

परिणाम पंक्ति को संख्यात्मक सरणी के रूप में लाता है।

```php
abstract public function fetchRow($result): ?array
```

**उदाहरण:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### दोनों प्राप्त करें

परिणाम पंक्ति को साहचर्य और संख्यात्मक सरणी दोनों के रूप में लाता है।

```php
abstract public function fetchBoth($result): ?array
```

**उदाहरण:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

परिणाम सेट में पंक्तियों की संख्या प्राप्त करता है।

```php
abstract public function getRowsNum($result): int
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$result` | संसाधन | क्वेरी परिणाम संसाधन |

**रिटर्न:** `int` - पंक्तियों की संख्या

**उदाहरण:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### प्रभावित पंक्तियाँ प्राप्त करें

अंतिम क्वेरी से प्रभावित पंक्तियों की संख्या प्राप्त करता है।

```php
abstract public function getAffectedRows(): int
```

**रिटर्न:** `int` - प्रभावित पंक्तियों की संख्या

**उदाहरण:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

अंतिम INSERT से स्वचालित रूप से जेनरेट की गई आईडी प्राप्त होती है।

```php
abstract public function getInsertId(): int
```

**रिटर्न:** `int` - अंतिम प्रविष्टि आईडी

**उदाहरण:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```

---

###बचना

SQL क्वेरीज़ में सुरक्षित उपयोग के लिए एक स्ट्रिंग से बच जाता है।

```php
abstract public function escape(string $string): string
```

**पैरामीटर:**

| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$string` | स्ट्रिंग | बचने के लिए स्ट्रिंग |

**रिटर्न:** `string` - एस्केप्ड स्ट्रिंग (उद्धरण के बिना)

**उदाहरण:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### कोटस्ट्रिंग

SQL के लिए एक स्ट्रिंग को एस्केप और उद्धृत करता है।

```php
public function quoteString(string $string): string
```

**पैरामीटर:**| पैरामीटर | प्रकार | विवरण |
|----|------|----|
| `$string` | स्ट्रिंग | उद्धृत करने के लिए स्ट्रिंग |

**रिटर्न:** `string` - एस्केप्ड और उद्धृत स्ट्रिंग

**उदाहरण:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### फ्रीरिकॉर्डसेट

किसी परिणाम से जुड़ी स्मृति को मुक्त करता है.

```php
abstract public function freeRecordSet($result): void
```

**उदाहरण:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## त्रुटि प्रबंधन

### त्रुटि

अंतिम त्रुटि संदेश प्राप्त होता है.

```php
abstract public function error(): string
```

**उदाहरण:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### ग़लती

अंतिम त्रुटि संख्या प्राप्त होती है.

```php
abstract public function errno(): int
```

**उदाहरण:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## तैयार विवरण (MySQLi)

MySQLi ड्राइवर उन्नत सुरक्षा के लिए तैयार कथनों का समर्थन करता है।

###तैयारी करो

एक तैयार कथन बनाता है.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### अनेक मापदंडों के साथ तैयार वक्तव्य

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## लेनदेन सहायता

### लेन-देन शुरू करें

लेन-देन प्रारंभ करता है.

```php
public function beginTransaction(): bool
```

### प्रतिबद्ध

वर्तमान लेनदेन करता है।

```php
public function commit(): bool
```

### रोलबैक

वर्तमान लेनदेन को वापस ले आता है।

```php
public function rollback(): bool
```

**उदाहरण:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Multiple operations
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Check for errors
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```

---

## संपूर्ण उपयोग के उदाहरण

### बुनियादी CRUD संचालन

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### पेजिनेशन क्वेरी

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Get total count
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Get page of results
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### LIKE के साथ खोज क्वेरी

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limit to 50 results

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### क्वेरी में शामिल हों

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## SqlUtility कक्षा

SQL फ़ाइल संचालन के लिए सहायक वर्ग।

### स्प्लिटMySqlफ़ाइल

SQL फ़ाइल को अलग-अलग क्वेरीज़ में विभाजित करता है।

```php
public static function splitMySqlFile(string $content): array
```

**उदाहरण:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```

### उपसर्गक्वेरी

तालिका प्लेसहोल्डर्स को पूर्वलग्न तालिका नामों से बदल देता है।

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**उदाहरण:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## सर्वोत्तम प्रथाएँ

### सुरक्षा

1. **हमेशा उपयोगकर्ता इनपुट से बचें**:
```php
$safe = $db->escape($_POST['input']);
```

2. **उपलब्ध होने पर तैयार विवरण का उपयोग करें**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **मानों के लिए quoteString का उपयोग करें**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### प्रदर्शन

1. **बड़ी तालिकाओं के लिए हमेशा LIMIT का उपयोग करें**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **पूरा होने पर निःशुल्क परिणाम सेट**:
```php
$db->freeRecordSet($result);
```

3. **अपनी तालिका परिभाषाओं में उचित अनुक्रमणिका का उपयोग करें**

4. **संभव होने पर कच्चे SQL की तुलना में हैंडलर को प्राथमिकता दें**

### त्रुटि प्रबंधन

1. **हमेशा त्रुटियों की जांच करें**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **कई संबंधित कार्यों के लिए लेनदेन का उपयोग करें**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## संबंधित दस्तावेज़ीकरण

- Criteria - क्वेरी मानदंड प्रणाली
- QueryBuilder - धाराप्रवाह क्वेरी बिल्डिंग
- ../Core/XoopsObjectHandler - वस्तु दृढ़ता

---

*यह भी देखें: [XOOPS सोर्स कोड](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*