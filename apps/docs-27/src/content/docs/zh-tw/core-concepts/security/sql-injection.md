---
title: "SQL注入預防"
description: "XOOPS中的資料庫安全實踐和SQL注入預防"
---

SQL注入是最危險和最常見的Web應用程式漏洞之一。本指南涵蓋了如何保護XOOPS模組免受SQL注入攻擊。

## 相關文檔

- 安全最佳實踐 - 綜合安全指南
- CSRF保護 - 標記系統和XoopsSecurity類
- 輸入淨化 - MyTextSanitizer和驗證

## 理解SQL注入

當用戶輸入直接包含在SQL查詢中而沒有適當的淨化或參數化時，就會發生SQL注入。

### 易受攻擊的代碼示例

```php
// 危險 - 請勿使用
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

如果用戶傳遞`1 OR 1=1`作為ID，查詢變成：
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

這會返回所有記錄，而不是只返回一條。

## 使用參數化查詢

針對SQL注入的最有效防禦是使用參數化查詢(準備語句)。

### 基本參數化查詢

```php
// 取得資料庫連接
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// 安全 - 使用參數化查詢
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### 多個參數

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### 命名參數

某些資料庫抽象支援命名參數：

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## 使用XoopsObject和XoopsObjectHandler

XOOPS提供了物件導向的資料庫存取，通過Criteria系統幫助防止SQL注入。

### 基本Criteria使用

```php
// 取得處理器
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// 建立criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// 取得對象 - 自動防止SQL注入
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo用於多個條件

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// 選項：新增排序和限制
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Criteria運算符

```php
// 等於(預設)
$criteria->add(new Criteria('status', 'active'));

// 不等於
$criteria->add(new Criteria('status', 'deleted', '!='));

// 大於
$criteria->add(new Criteria('count', 100, '>'));

// 小於或等於
$criteria->add(new Criteria('price', 50, '<='));

// LIKE(用於部分匹配)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN(多個值)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### OR條件

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR條件
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## 表首碼

始終使用XOOPS表首碼系統：

```php
// 正確 - 使用首碼
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// 也正確
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT查詢

### 使用參數化語句

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

### 使用XoopsObject

```php
// 建立新對象
$item = $itemHandler->create();

// 設定值 - 處理器自動轉義
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// 插入
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## UPDATE查詢

### 使用參數化語句

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

### 使用XoopsObject

```php
// 取得現有對象
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## DELETE查詢

### 使用參數化語句

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 使用XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### 使用Criteria的批量刪除

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## 必要時轉義

如果您無法使用參數化語句，請使用適當的轉義：

```php
// 使用mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

但是，**始終優先使用參數化語句而不是轉義**。

## 安全地構建動態查詢

### 安全的動態列名

列名無法參數化。根據白名單進行驗證：

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // 預設安全值
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### 安全的動態表名

同樣地，驗證表名：

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### 動態構建WHERE子句

```php
$criteria = new CriteriaCompo();

// 根據輸入新增條件
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

## LIKE查詢

小心LIKE查詢以避免通配符注入：

```php
// 轉義搜尋詞中的特殊字符
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// 然後在LIKE中使用
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN子句

使用IN子句時，確保所有值都正確類型化：

```php
// 來自用戶輸入的ID數組
$inputIds = $_POST['ids'] ?? [];

// 淨化：確保全部是整數
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

或使用Criteria：

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## 交易安全

執行多個相關查詢時：

```php
// 啟動交易
$xoopsDB->query("START TRANSACTION");

try {
    // 查詢1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // 查詢2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // 提交
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // 錯誤時回滾
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## 錯誤處理

永遠不要向用戶洩露SQL錯誤：

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // 記錄實際錯誤以供調試
    error_log('Database error: ' . $xoopsDB->error());

    // 向用戶顯示通用訊息
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## 需要避免的常見錯誤

### 錯誤1：直接變數插值

```php
// 不好
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// 正確
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 錯誤2：使用addslashes()

```php
// 不好 - addslashes不充分
$safe = addslashes($_GET['input']);

// 正確 - 使用參數化查詢或適當的轉義
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### 錯誤3：信任數字ID

```php
// 不好 - 假設輸入是數字
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// 正確 - 明確轉換為整數
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### 錯誤4：二階注入

```php
// 資料庫中的數據不是自動安全的
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// 不好 - 信任資料庫中的數據
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// 正確 - 始終使用參數
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## 安全測試

### 測試您的查詢

使用這些輸入測試您的表單以檢查SQL注入：

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

如果其中任何一個造成意外行為或錯誤，您有漏洞。

### 自動化測試

在開發期間使用自動化SQL注入測試工具：

- SQLMap
- Burp Suite
- OWASP ZAP

## 最佳實踐摘要

1. **始終使用參數化查詢**(準備語句)
2. **在可能的情況下使用XoopsObject/XoopsObjectHandler**
3. **使用Criteria類**來構建查詢
4. **白名單允許的值**用於列和表名
5. **明確轉換數值**，使用`(int)`或`(float)`
6. **永遠不要向用戶公開資料庫錯誤**
7. **為多個相關查詢使用交易**
8. **在開發期間測試SQL注入**
9. **在搜尋查詢中轉義LIKE通配符**
10. **單獨淨化IN子句值**

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
