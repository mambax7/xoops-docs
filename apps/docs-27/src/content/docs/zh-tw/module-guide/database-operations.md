---
title: "資料庫操作"
---

## 概述

XOOPS 提供資料庫抽象層，支援舊版程序模式和現代物件導向方法。本指南涵蓋模組開發的常見資料庫操作。

## 資料庫連線

### 取得資料庫實例

```php
// 舊版方法
global $xoopsDB;

// 透過協助者的現代方法
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// 透過 XMF 協助者
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## 基本操作

### SELECT 查詢

```php
// 簡單查詢
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// 具有參數 (安全方法)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// 單一列
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### INSERT 操作

```php
// 基本插入
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// 取得上次插入的識別碼
$newId = $db->getInsertId();
```

### UPDATE 操作

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// 檢查受影響的列
$affectedRows = $db->getAffectedRows();
```

### DELETE 操作

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## 使用 Criteria

Criteria 系統提供型別安全的查詢建立方式：

```php
use Criteria;
use CriteriaCompo;

// 簡單條件
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// 複合條件
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

### Criteria 運算子

| 運算子 | 說明 |
|----------|-------------|
| `=` | 等於 (預設) |
| `!=` | 不等於 |
| `<` | 小於 |
| `>` | 大於 |
| `<=` | 小於或等於 |
| `>=` | 大於或等於 |
| `LIKE` | 模式匹配 |
| `IN` | 在值集中 |

```php
// LIKE 條件
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN 條件
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// 日期範圍
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## 物件處理器

### 處理器方法

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// 建立新物件
$item = $handler->create();

// 按識別碼取得
$item = $handler->get($id);

// 取得多個
$items = $handler->getObjects($criteria);

// 作為陣列取得
$items = $handler->getAll($criteria);

// 計數
$count = $handler->getCount($criteria);

// 儲存
$success = $handler->insert($item);

// 刪除
$success = $handler->delete($item);
```

### 自訂處理器方法

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

## 交易

```php
// 開始交易
$db->query('START TRANSACTION');

try {
    // 執行多個操作
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // 如果全部成功則提交
    $db->query('COMMIT');
} catch (\Exception $e) {
    // 錯誤時回復
    $db->query('ROLLBACK');
    throw $e;
}
```

## 預備陳述式 (現代)

```php
// 透過 XOOPS 資料庫層使用 PDO
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## 架構管理

### 建立表格

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

### 遷移

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

## 最佳實踐

1. **始終引用字串** - 對使用者輸入使用 `$db->quoteString()`
2. **使用 Intval** - 使用 `intval()` 或型別宣告轉換整數
3. **偏好處理器** - 盡可能使用物件處理器而非原始 SQL
4. **使用 Criteria** - 使用 Criteria 建立具有型別安全的查詢
5. **處理錯誤** - 檢查傳回值並處理失敗
6. **使用交易** - 在交易中包裝相關操作

## 相關文件

- ../04-API-Reference/Kernel/Criteria - 使用 Criteria 建立查詢
- ../04-API-Reference/Core/XoopsObjectHandler - 處理器模式
- ../02-Core-Concepts/Database/Database-Layer - 資料庫抽象
- Database/Database-Schema - 架構設計指南
