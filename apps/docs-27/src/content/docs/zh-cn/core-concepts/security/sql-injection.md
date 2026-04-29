---
title: “SQL注射预防”
description: “数据库安全实践和防止SQL注入XOOPS”
---

SQL注入是最危险和最常见的Web应用程序漏洞之一。本指南介绍了如何保护您的 XOOPS 模区块免受 SQL 注入攻击。

## 相关文档

- 安全-Best-Practices - 全面的安全指南
- CSRF-Protection - 令牌系统和 XOOPSSecurity 类
- 输入-Sanitization - MyTextSanitizer 和验证

## 了解SQL 注入

当用户输入直接包含在 SQL 查询中而没有进行适当的清理或参数化时，就会发生SQL注入。

### 易受攻击的代码示例

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

如果用户传递 `1 OR 1=1` 作为 ID，查询将变为：
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

这将返回所有记录，而不是仅返回一条记录。

## 使用参数化查询

针对 SQL 注入的最有效防御是使用参数化查询（准备好的语句）。

### 基本参数化查询

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### 多个参数

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### 命名参数

一些数据库抽象支持命名参数：

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## 使用 XOOPSObject 和 XOOPSObjectHandler

XOOPS提供对象-oriented数据库访问，有助于防止SQL通过Criteria系统注入。

### 基本标准用法

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### 多个条件的 CriteriaCompo

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

### 标准运算符

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

### 或条件

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## 表前缀

始终使用 XOOPS 表前缀系统：

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT 查询

### 使用准备好的语句

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

### 使用 XOOPSObject

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

## UPDATE 查询

### 使用准备好的语句

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

### 使用 XOOPSObject

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

## DELETE 查询

### 使用准备好的语句

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 使用 XOOPSObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### 使用条件批量删除

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## 必要时逃跑

如果无法使用准备好的语句，请使用正确的转义：

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

然而，**总是更喜欢准备好的语句**而不是转义。

## 安全地构建动态查询

### 安全动态列名称

列名不能参数化。根据白名单进行验证：

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### 安全动态表名称

同样，验证表名：

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### 动态构建 WHERE 条款

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

## LIKE 查询

请小心 LIKE 查询以避免通配符注入：

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN 子句

使用 IN 子句时，请确保正确键入所有值：

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

或者使用标准：

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## 交易安全

当执行多个相关查询时：

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

## 错误处理

切勿向用户公开 SQL 错误：

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

## 要避免的常见错误

### 错误1：直接变量插值

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 错误 2：使用 addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### 错误 3：信任数字 ID

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### 错误 4：第二次-Order注射

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

## 安全测试

### 测试您的查询

使用这些输入测试您的表单以检查是否有 SQL 注入：

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

如果其中任何一个导致意外行为或错误，那么您就存在漏洞。

### 自动化测试

在开发过程中使用自动化SQL注入测试工具：

- SQLMap
- 打嗝套件
- OWASPZAP

## 最佳实践总结1. **始终使用参数化查询**（准备好的语句）
2. **尽可能使用XOOPSObject/XOOPSObjectHandler**
3. **使用 Criteria 类**来构建查询
4. **列和表名称的允许值**
5. **使用 `(int)` 或 `(float)` 显式转换数值**
6. **永远不要向用户暴露数据库错误**
7. **使用事务**进行多个相关查询
8. **开发期间测试SQL注入**
9. **在搜索查询中转义LIKE通配符**
10. **单独清理 IN 子句值**

---

#安全#sql-injection#数据库#XOOPS#准备-statements#条件