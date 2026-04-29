---
title: "کلاس XoopsDatabase"
description: "لایه انتزاعی پایگاه داده که مدیریت اتصال، اجرای پرس و جو و مدیریت نتیجه را ارائه می دهد"
---
کلاس `XoopsDatabase` یک لایه انتزاعی پایگاه داده برای XOOPS، مدیریت اتصال، اجرای پرس و جو، پردازش نتیجه و مدیریت خطا را فراهم می کند. از چندین درایور پایگاه داده از طریق معماری درایور پشتیبانی می کند.

## نمای کلی کلاس

```php
namespace XOOPS\Database;

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

## سلسله مراتب کلاس

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## دریافت نمونه پایگاه داده

### با استفاده از کارخانه

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### با استفاده از getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### متغیر جهانی

```php
// Legacy: Use global variable
global $xoopsDB;
```

## روش های اصلی

### اتصال

اتصال پایگاه داده را برقرار می کند.

```php
abstract public function connect(bool $selectdb = true): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$selectdb` | bool | انتخاب پایگاه داده |

**بازگشت:** `bool` - درست در صورت اتصال موفق

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### پرس و جو

پرس و جوی SQL را اجرا می کند.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$sql` | رشته | رشته پرس و جو SQL |
| `$limit` | int | حداکثر ردیف برای بازگشت (0 = بدون محدودیت) |
| `$start` | int | شروع افست |

**برگرداندن:** `resource|bool` - منبع نتیجه یا نادرست در صورت شکست

**مثال:**
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

درخواستی را اجرا می کند که عملیات را مجبور می کند (بررسی های امنیتی را دور می زند).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

** موارد استفاده:**
- عملیات درج، به روز رسانی، حذف
- زمانی که نیاز به دور زدن محدودیت های فقط خواندنی دارید

**مثال:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

پیشوند ###

پیشوند جدول پایگاه داده را آماده می کند.

```php
public function prefix(string $table = ''): string
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$table` | رشته | نام جدول بدون پیشوند |

**برگرداندن:** `string` - نام جدول با پیشوند

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

یک ردیف نتیجه را به عنوان یک آرایه انجمنی واکشی می کند.

```php
abstract public function fetchArray($result): ?array
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$result` | منبع | منبع نتیجه پرس و جو |

**برمی‌گرداند:** `array|null` - آرایه انجمنی یا تهی اگر ردیف بیشتری وجود نداشته باشد

**مثال:**
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

یک ردیف نتیجه را به عنوان یک شی واکشی می کند.

```php
abstract public function fetchObject($result): ?object
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$result` | منبع | منبع نتیجه پرس و جو |

**برگرداندن:** `object|null` - شی با ویژگی های هر ستون

**مثال:**
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

یک ردیف نتیجه را به عنوان یک آرایه عددی واکشی می کند.

```php
abstract public function fetchRow($result): ?array
```

**مثال:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### واکشی هر دو

یک ردیف نتیجه را هم به عنوان آرایه انجمنی و هم به عنوان آرایه عددی واکشی می کند.

```php
abstract public function fetchBoth($result): ?array
```

**مثال:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### تعداد ردیفها را دریافت کنید

تعداد ردیف های یک مجموعه نتیجه را دریافت می کند.

```php
abstract public function getRowsNum($result): int
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$result` | منبع | منبع نتیجه پرس و جو |

**برگرداندن:** `int` - تعداد ردیف

**مثال:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

تعداد ردیف های تحت تأثیر را از آخرین پرس و جو دریافت می کند.

```php
abstract public function getAffectedRows(): int
```

**برگرداندن:** `int` - تعداد ردیف های تحت تأثیر

**مثال:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

شناسه تولید شده خودکار را از آخرین INSERT دریافت می کند.

```php
abstract public function getInsertId(): int
```

**برگرداندن:** `int` - آخرین شناسه درج

**مثال:**
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

### فرار

از یک رشته برای استفاده ایمن در پرس و جوهای SQL فرار می کند.

```php
abstract public function escape(string $string): string
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$string` | رشته | ریسمان برای فرار |

**برگرداند:** `string` - رشته فرار (بدون نقل قول)

**مثال:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Escape می کند و یک رشته را برای SQL نقل می کند.

```php
public function quoteString(string $string): string
```

**پارامترها:**| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$string` | رشته | رشته نقل قول |

**برگرداند:** `string` - رشته فرار و نقل قول

**مثال:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

حافظه مرتبط با نتیجه را آزاد می کند.

```php
abstract public function freeRecordSet($result): void
```

**مثال:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## رسیدگی به خطا

خطای ###

آخرین پیغام خطا را دریافت می کند.

```php
abstract public function error(): string
```

**مثال:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### اشتباه است

آخرین شماره خطا را دریافت می کند.

```php
abstract public function errno(): int
```

**مثال:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## بیانیه های آماده (MySQLi)

درایور MySQLi از بیانیه های آماده شده برای افزایش امنیت پشتیبانی می کند.

### آماده کنید

یک بیانیه آماده ایجاد می کند.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**مثال:**
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

### بیانیه آماده با پارامترهای متعدد

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

## پشتیبانی تراکنش

### شروع معامله

تراکنش را شروع می کند.

```php
public function beginTransaction(): bool
```

### متعهد شوید

تراکنش جاری را انجام می دهد.

```php
public function commit(): bool
```

### عقبگرد

تراکنش فعلی را به عقب برمی گرداند.

```php
public function rollback(): bool
```

**مثال:**
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

## نمونه های استفاده کامل

### عملیات اساسی CRUD

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

### پرس و جو صفحه بندی

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

### جستجو با LIKE

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

### به Query بپیوندید

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

## کلاس SqlUtility

کلاس کمکی برای عملیات فایل SQL.

### splitMySqlFile

یک فایل SQL را به پرس و جوهای فردی تقسیم می کند.

```php
public static function splitMySqlFile(string $content): array
```

**مثال:**
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

### پیشوندQuery

جانشین های جدول را با نام جدول های پیشوند جایگزین می کند.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**مثال:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## بهترین شیوه ها

### امنیت

1. **همیشه از ورودی کاربر فرار کنید**:
```php
$safe = $db->escape($_POST['input']);
```

2. **در صورت موجود بودن از اظهارات آماده استفاده کنید**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **از quoteString برای مقادیر** استفاده کنید:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### عملکرد

1. **همیشه از LIMIT برای میزهای بزرگ استفاده کنید**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. ** مجموعه نتایج رایگان پس از اتمام **:
```php
$db->freeRecordSet($result);
```

3. **در تعاریف جدول خود از شاخص های مناسب** استفاده کنید

4. **در صورت امکان هندلرها را به SQL خام ترجیح دهید **

### رسیدگی به خطا

1. **همیشه خطاها را بررسی کنید**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **از تراکنش ها برای چندین عملیات مرتبط استفاده کنید**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## مستندات مرتبط

- معیارها - سیستم معیارهای پرس و جو
- QueryBuilder - ساختمان پرس و جو روان
- ../Core/XoopsObjectHandler - ماندگاری شی

---

*همچنین ببینید: [کد منبع XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*