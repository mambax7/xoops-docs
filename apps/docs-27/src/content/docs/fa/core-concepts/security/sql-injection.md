---
title: "پیشگیری از تزریق SQL"
description: "شیوه های امنیتی پایگاه داده و جلوگیری از تزریق SQL در XOOPS"
---
تزریق SQL یکی از خطرناک ترین و رایج ترین آسیب پذیری های برنامه های وب است. این راهنما نحوه محافظت از ماژول های XOOPS خود را در برابر حملات تزریق SQL را پوشش می دهد.

## مستندات مرتبط

- Security-Best-Practices - راهنمای جامع امنیتی
- CSRF-Protection - سیستم توکن و کلاس XoopsSecurity
- Input-Sanitization - MyTextSanitizer و اعتبارسنجی

## درک SQL Injection

تزریق SQL زمانی اتفاق می‌افتد که ورودی کاربر مستقیماً در کوئری‌های SQL بدون پاکسازی یا پارامترسازی مناسب گنجانده شود.

### مثال کد آسیب پذیر

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

اگر کاربر `1 OR 1=1` را به عنوان شناسه ارسال کند، پرس و جو به صورت زیر در می آید:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

این به جای تنها یک رکورد، همه رکوردها را برمی گرداند.

## با استفاده از پرس و جوهای پارامتری

موثرترین دفاع در برابر تزریق SQL استفاده از پرس و جوهای پارامتری (عبارات آماده شده) است.

### پرس و جوی پارامتری پایه

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### پارامترهای چندگانه

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### پارامترهای نامگذاری شده

برخی از انتزاعات پایگاه داده از پارامترهای نامگذاری شده پشتیبانی می کنند:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## با استفاده از XoopsObject و XoopsObjectHandler

XOOPS دسترسی به پایگاه داده شی گرا را فراهم می کند که به جلوگیری از تزریق SQL از طریق سیستم Criteria کمک می کند.

### استفاده از معیارهای اساسی

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo برای شرایط چندگانه

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

### اپراتورهای معیار

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

### یا شرایط

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## پیشوندهای جدول

همیشه از سیستم پیشوند جدول XOOPS استفاده کنید:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## پرس و جوها را درج کنید

### با استفاده از بیانیه های آماده شده

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

### با استفاده از XoopsObject

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

## درخواست ها را به روز کنید

### با استفاده از بیانیه های آماده شده

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

### با استفاده از XoopsObject

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

## پرس و جوها را حذف کنید

### با استفاده از بیانیه های آماده شده

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### با استفاده از XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### حذف انبوه با معیارها

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## فرار در صورت لزوم

اگر نمی توانید از عبارات آماده شده استفاده کنید، از فرار مناسب استفاده کنید:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

با این حال، **همیشه اظهارات آماده** را به فرار ترجیح دهید.

## پرس و جوهای پویا را ایمن بسازید

### نامهای ستون پویا ایمن

نام ستون ها را نمی توان پارامتر کرد. اعتبارسنجی در برابر لیست سفید:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### نام جدول پویا ایمن

به طور مشابه، نام جدول را تأیید کنید:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Building WHERE Clauses به صورت پویا

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

## پرس و جوها را لایک کنید

مراقب پرس و جوهای LIKE باشید تا از تزریق حروف عام جلوگیری کنید:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## بندهای IN

هنگام استفاده از بندهای IN، مطمئن شوید که همه مقادیر به درستی تایپ شده اند:

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

یا با معیارهای:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## ایمنی معاملات

هنگام انجام چندین پرس و جو مرتبط:

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

## رسیدگی به خطا

هرگز خطاهای SQL را در معرض دید کاربران قرار ندهید:

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

## اشتباهات رایجی که باید از آنها اجتناب کرد

### اشتباه 1: درونیابی متغیر مستقیم

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### اشتباه 2: استفاده از addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### اشتباه 3: اعتماد به شناسه های عددی

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### اشتباه 4: تزریق مرتبه دوم

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

## تست امنیتی

### سوالات خود را تست کنید

فرم های خود را با این ورودی ها برای بررسی تزریق SQL آزمایش کنید:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

اگر هر یک از اینها باعث رفتار یا خطاهای غیرمنتظره شود، آسیب پذیری دارید.

### تست خودکار

در طول توسعه از ابزارهای تست تزریق خودکار SQL استفاده کنید:

- SQLMap
- سوئیت آروغ
- OWASP ZAP

## خلاصه بهترین شیوه ها1. **همیشه از پرس و جوهای پارامتری استفاده کنید ** (عبارات آماده شده)
2. **در صورت امکان از XoopsObject/XoopsObjectHandler** استفاده کنید
3. **از کلاس های Criteria** برای ساخت کوئری ها استفاده کنید
4. **مقادیر مجاز در لیست سفید** برای ستون ها و نام جدول
5. **ارسال مقادیر عددی** به صراحت با `(int)` یا `(float)`
6. **هرگز خطاهای پایگاه داده** را در معرض دید کاربران قرار ندهید
7. **از تراکنش ها** برای پرس و جوهای متعدد مرتبط استفاده کنید
8. **تست تزریق SQL** در حین توسعه
9. **Escape LIKE wildcards** در عبارت جستجو
10. **مقادیر بند IN را به صورت جداگانه پاکسازی کنید**

---

#امنیت #sql-injection #پایگاه داده #xoops #prepared-statements #معیارها
