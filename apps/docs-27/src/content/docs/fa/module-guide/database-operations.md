---
title: "عملیات پایگاه داده"
---
## بررسی اجمالی

XOOPS یک لایه انتزاعی پایگاه داده را فراهم می کند که از الگوهای رویه ای قدیمی و رویکردهای شی گرا مدرن پشتیبانی می کند. این راهنما عملیات رایج پایگاه داده برای توسعه ماژول را پوشش می دهد.

## اتصال به پایگاه داده

### دریافت نمونه پایگاه داده

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \XMF\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## عملیات اساسی

### پرس و جوها را انتخاب کنید

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

### عملیات درج

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

### عملیات به روز رسانی

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

### عملیات حذف

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## با استفاده از معیارها

سیستم Criteria یک روش ایمن برای ایجاد پرس و جو ارائه می دهد:

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

### اپراتورهای معیار

| اپراتور | توضیحات |
|----------|-------------|
| `=` | برابر (پیش فرض) |
| `!=` | برابر نیست |
| `<` | کمتر از |
| `>` | بزرگتر از |
| `<=` | کمتر یا مساوی |
| `>=` | بزرگتر یا مساوی |
| `LIKE` | تطبیق الگو |
| `IN` | در مجموعه مقادیر |

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

## کنترل کننده اشیا

### روش های هندلر

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

### روش های کنترل کننده سفارشی

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

## معاملات

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

## بیانیه های آماده (مدرن)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## مدیریت طرحواره

### ایجاد جداول

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

### مهاجرت

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

## بهترین شیوه ها

1. ** رشته ها را همیشه نقل قول کنید ** - از `$db->quoteString()` برای ورودی کاربر استفاده کنید
2. **از Intval** استفاده کنید - اعداد صحیح را با `intval()` ارسال کنید یا اعلان‌های نوع
3. **Prefer Handlers** - در صورت امکان از کنترل کننده های شی بر روی SQL خام استفاده کنید
4. **استفاده از معیارها** - ساخت پرس و جو با معیارها برای ایمنی نوع
5. **Errors Handle ** - مقادیر بازگشتی را بررسی کنید و خرابی ها را مدیریت کنید
6. **استفاده از تراکنش ها** - عملیات مرتبط را در تراکنش ها بپیچید

## مستندات مرتبط

- ../04-API-Reference/Kernel/Criteria - ساخت پرس و جو با معیارها
- ../04-API-Reference/Core/XoopsObjectHandler - الگوی هندلر
- ../02-Core-Concepts/Database/Database-Layer - انتزاع پایگاه داده
- Database/Database-Schema - راهنمای طراحی طرحواره