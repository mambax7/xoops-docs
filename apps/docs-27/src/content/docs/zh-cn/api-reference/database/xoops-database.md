---
title：“XOOPSDatabase 类”
description：“提供连接管理、查询执行和结果处理的数据库抽象层”
---

`XOOPSDatabase`类为XOOPS提供数据库抽象层，处理连接管理、查询执行、结果处理和错误处理。它通过驱动程序架构支持多个数据库驱动程序。

## 类概述

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

## 类层次结构

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## 获取数据库实例

### 使用工厂

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### 使用 getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### 全局变量

```php
// Legacy: Use global variable
global $xoopsDB;
```

## 核心方法

### 连接

建立数据库连接。

```php
abstract public function connect(bool $selectdb = true): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$selectdb` |布尔 |是否选择数据库 |

**返回：** `bool` - 连接成功时为真

**示例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

###查询

执行 SQL 查询。

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$sql` |字符串| SQL查询字符串|
| `$limit`|整数 |返回的最大行数（0 = 无限制）|
| `$start` |整数 |起始偏移|

**返回：** `resource|bool` - 结果资源或失败时返回 false

**示例：**
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

### 查询F

执行强制操作的查询（绕过安全检查）。

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**使用案例：**
- INSERT、UPDATE、DELETE操作
- 当您需要绕过阅读-only限制时

**示例：**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### 前缀

添加数据库表前缀。

```php
public function prefix(string $table = ''): string
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$table` |字符串|不带前缀的表名 |

**返回：** `string` - 带前缀的表名称

**示例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### 获取数组

以关联数组的形式获取结果行。

```php
abstract public function fetchArray($result): ?array
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$result` |资源|查询结果资源 |

**返回：** `array|null` - 关联数组，如果没有更多行则为 null

**示例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### 获取对象

获取结果行作为对象。

```php
abstract public function fetchObject($result): ?object
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$result` |资源|查询结果资源 |

**返回：** `object|null` - 具有每列属性的对象

**示例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### 获取行

以数值数组形式获取结果行。

```php
abstract public function fetchRow($result): ?array
```

**示例：**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### 获取两者

以关联数组和数值数组的形式获取结果行。

```php
abstract public function fetchBoth($result): ?array
```

**示例：**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### 获取行数

获取结果集中的行数。

```php
abstract public function getRowsNum($result): int
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$result` |资源|查询结果资源 |

**返回：** `int` - 行数

**示例：**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### 获取AffectedRows

获取上次查询中受影响的行数。

```php
abstract public function getAffectedRows(): int
```

**返回：** `int` - 受影响的行数

**示例：**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### 获取插入Id

从最后一个INSERT中获取自动-generated ID。

```php
abstract public function getInsertId(): int
```

**返回：** `int` - 最后插入 ID

**示例：**
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

### 逃脱

转义字符串以便在 SQL 查询中安全使用。

```php
abstract public function escape(string $string): string
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$string` |字符串|要转义的字符串 |

**返回：** `string` - 转义字符串（不带引号）

**示例：**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### 引用字符串

转义并引用 SQL 的字符串。

```php
public function quoteString(string $string): string
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$string` |字符串|引用字符串 |

**返回：** `string` - 转义并带引号的字符串

**示例：**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### 自由记录集

释放与结果相关的内存。

```php
abstract public function freeRecordSet($result): void
```**示例：**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## 错误处理

### 错误

获取最后一条错误消息。

```php
abstract public function error(): string
```

**示例：**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### 错误号

获取最后一个错误号。

```php
abstract public function errno(): int
```

**示例：**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## 准备语句 (MySQLi)

MySQLi 驱动程序支持准备好的语句以增强安全性。

### 准备

创建准备好的语句。

```php
public function prepare(string $sql): mysqli_stmt|false
```

**示例：**
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

### 带有多个参数的准备语句

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

## 交易支持

### 开始交易

开始交易。

```php
public function beginTransaction(): bool
```

### 提交

提交当前事务。

```php
public function commit(): bool
```

### 回滚

回滚当前事务。

```php
public function rollback(): bool
```

**示例：**
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

## 完整的用法示例

### 基本CRUD操作

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

### 分页查询

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

### 使用 LIKE 进行搜索查询

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

### 加入查询

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

## SqlUtility 类

用于SQL文件操作的帮助程序类。

### splitMySqlFile

将 SQL 文件拆分为单独的查询。

```php
public static function splitMySqlFile(string $content): array
```

**示例：**
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

### 前缀查询

用带前缀的表名称替换表占位符。

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**示例：**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## 最佳实践

### 安全

1. **始终转义用户输入**：
```php
$safe = $db->escape($_POST['input']);
```

2. **使用准备好的语句（如果可用）**：
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **使用 quoteString 作为值**：
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### 性能

1. **对于大型表，请始终使用 LIMIT**：
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **完成后免费结果集**：
```php
$db->freeRecordSet($result);
```

3. **在表定义中使用适当的索引**

4. **尽可能选择处理程序而不是原始的SQL**

### 错误处理

1. **始终检查错误**：
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **使用事务进行多个相关操作**：
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## 相关文档

- Criteria - 查询条件系统
- QueryBuilder - 流畅的查询构建
- ../Core/XOOPSObjectHandler - 对象持久性

---

*另请参阅：[XOOPS Source Code](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class/database)*