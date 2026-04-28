---
title: "XoopsDatabase 類別"
description: "提供連線管理、查詢執行和結果處理的資料庫抽象層"
---

`XoopsDatabase` 類別為 XOOPS 提供資料庫抽象層，處理連線管理、查詢執行、結果處理和錯誤處理。它透過驅動程式架構支援多個資料庫驅動程式。

## 類別概述

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

## 類別階層

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## 取得資料庫實例

### 使用工廠

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### 使用 getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### 全域變數

```php
// Legacy: Use global variable
global $xoopsDB;
```

## 核心方法

### connect

建立資料庫連線。

```php
abstract public function connect(bool $selectdb = true): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$selectdb` | bool | 是否選擇資料庫 |

**傳回值：** `bool` - 成功連線時為 true

**範例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### query

執行 SQL 查詢。

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$sql` | string | SQL 查詢字串 |
| `$limit` | int | 返回的最大列數（0 = 無限制） |
| `$start` | int | 起始偏移 |

**傳回值：** `resource|bool` - 結果資源或失敗時為 false

**範例：**
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

### queryF

執行強制查詢（繞過安全檢查）。

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**用途：**
- INSERT、UPDATE、DELETE 操作
- 當您需要繞過唯讀限制時

**範例：**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### prefix

預先設定資料庫表格前綴。

```php
public function prefix(string $table = ''): string
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$table` | string | 不含前綴的表格名稱 |

**傳回值：** `string` - 含前綴的表格名稱

**範例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

將結果列提取為關聯陣列。

```php
abstract public function fetchArray($result): ?array
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$result` | resource | 查詢結果資源 |

**傳回值：** `array|null` - 關聯陣列或如果沒有更多列則為 null

**範例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

將結果列提取為物件。

```php
abstract public function fetchObject($result): ?object
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$result` | resource | 查詢結果資源 |

**傳回值：** `object|null` - 具有各欄位屬性的物件

**範例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

將結果列提取為數值陣列。

```php
abstract public function fetchRow($result): ?array
```

**範例：**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### fetchBoth

將結果列提取為關聯陣列和數值陣列。

```php
abstract public function fetchBoth($result): ?array
```

**範例：**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

取得結果集中的列數。

```php
abstract public function getRowsNum($result): int
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$result` | resource | 查詢結果資源 |

**傳回值：** `int` - 列數

**範例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

取得上次查詢受影響的列數。

```php
abstract public function getAffectedRows(): int
```

**傳回值：** `int` - 受影響的列數

**範例：**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

取得上次 INSERT 自動產生的 ID。

```php
abstract public function getInsertId(): int
```

**傳回值：** `int` - 上次插入 ID

**範例：**
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

### escape

逃脫字串以安全地在 SQL 查詢中使用。

```php
abstract public function escape(string $string): string
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$string` | string | 要逃脫的字串 |

**傳回值：** `string` - 逃脫的字串（不含引號）

**範例：**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

逃脫和引用字串以用於 SQL。

```php
public function quoteString(string $string): string
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$string` | string | 要引用的字串 |

**傳回值：** `string` - 逃脫和引用的字串

**範例：**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

釋放與結果相關的記憶體。

```php
abstract public function freeRecordSet($result): void
```

**範例：**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## 錯誤處理

### error

取得上次錯誤訊息。

```php
abstract public function error(): string
```

**範例：**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### errno

取得上次錯誤號碼。

```php
abstract public function errno(): int
```

**範例：**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## 預備語句（MySQLi）

MySQLi 驅動程式支援預備語句以增強安全性。

### prepare

建立預備語句。

```php
public function prepare(string $sql): mysqli_stmt|false
```

**範例：**
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

### 具有多個參數的預備語句

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

## 交易支援

### beginTransaction

開始交易。

```php
public function beginTransaction(): bool
```

### commit

提交目前的交易。

```php
public function commit(): bool
```

### rollback

回復目前的交易。

```php
public function rollback(): bool
```

**範例：**
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

## 完整使用範例

### 基本 CRUD 操作

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

### 分頁查詢

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

### 使用 LIKE 的搜尋查詢

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

### Join 查詢

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

## SqlUtility 類別

SQL 檔案操作的協助程式類別。

### splitMySqlFile

將 SQL 檔案分割為單個查詢。

```php
public static function splitMySqlFile(string $content): array
```

**範例：**
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

### prefixQuery

使用首碼表格名稱替換表格預留位置。

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**範例：**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## 最佳實踐

### 安全性

1. **始終逃脫使用者輸入**：
```php
$safe = $db->escape($_POST['input']);
```

2. **在可用時使用預備語句**：
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **對值使用 quoteString**：
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### 效能

1. **始終對大型表使用 LIMIT**：
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **在完成後釋放結果集**：
```php
$db->freeRecordSet($result);
```

3. **在表格定義中使用適當的索引**

4. **盡可能優先使用處理程式而不是原始 SQL**

### 錯誤處理

1. **始終檢查錯誤**：
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **對多個相關操作使用交易**：
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## 相關文件

- Criteria - 查詢條件系統
- QueryBuilder - 流暢查詢構建
- ../Core/XoopsObjectHandler - 物件持久化

---

*另請參閱：[XOOPS 原始程式碼](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
