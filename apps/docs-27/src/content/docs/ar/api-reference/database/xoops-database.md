---
title: "فئة XoopsDatabase"
description: "طبقة تجريد قاعدة البيانات توفر إدارة الاتصال وتنفيذ الاستعلامات ومعالجة النتائج"
dir: rtl
lang: ar
---

توفر فئة `XoopsDatabase` طبقة تجريد قاعدة البيانات لـ XOOPS، وتتعامل مع إدارة الاتصال وتنفيذ الاستعلامات ومعالجة النتائج ومعالجة الأخطاء. وهي تدعم برامج تشغيل قواعد البيانات المتعددة من خلال معمارية برنامج التشغيل.

## نظرة عامة على الفئة

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

## التسلسل الهرمي للفئة

```
XoopsDatabase (القاعدة المجردة)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (وكيل الأمان)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (وكيل الأمان)

XoopsDatabaseFactory
└── ينشئ مثيلات برنامج التشغيل المناسب
```

## الحصول على مثيل قاعدة البيانات

### استخدام المصنع

```php
// موصى به: استخدام المصنع
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### استخدام getInstance

```php
// البديل: الوصول المباشر إلى الفئة الفريدة
$db = XoopsDatabase::getInstance();
```

### متغير عام

```php
// وراثي: استخدام متغير عام
global $xoopsDB;
```

## الطرق الأساسية

### connect

إنشاء اتصال قاعدة البيانات.

```php
abstract public function connect(bool $selectdb = true): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$selectdb` | bool | ما إذا كان يجب تحديد قاعدة البيانات |

**الإرجاع:** `bool` - صحيح عند الاتصال بنجاح

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "تم الاتصال بنجاح";
}
```

---

### query

تنفيذ استعلام SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$sql` | string | سلسلة استعلام SQL |
| `$limit` | int | أقصى عدد صفوف للإرجاع (0 = لا توجد حدود) |
| `$start` | int | إزاحة البداية |

**الإرجاع:** `resource|bool` - موارد النتيجة أو خطأ في الفشل

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// استعلام بسيط
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// الاستعلام مع الحد
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // أول 10 صفوف

// الاستعلام مع الإزاحة
$result = $db->query($sql, 10, 20); // 10 صفوف بدءاً من الصف 20
```

---

### queryF

تنفيذ استعلام فرض العملية (يتجاوز فحوصات الأمان).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**حالات الاستخدام:**
- عمليات INSERT و UPDATE و DELETE
- عندما تحتاج إلى تجاوز قيود القراءة فقط

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

### prefix

إضافة بادئة جدول قاعدة البيانات.

```php
public function prefix(string $table = ''): string
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$table` | string | اسم الجدول بدون بادئة |

**الإرجاع:** `string` - اسم الجدول مع البادئة

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (إذا كانت البادئة "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (مجرد البادئة)
```

---

### fetchArray

جلب صف النتيجة كمصفوفة ترابطية.

```php
abstract public function fetchArray($result): ?array
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$result` | resource | مورد نتيجة الاستعلام |

**الإرجاع:** `array|null` - مصفوفة ترابطية أو فارغ إذا لم تكن هناك صفوف أخرى

**مثال:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "المستخدم: " . $row['uname'] . "\n";
    echo "البريد الإلكتروني: " . $row['email'] . "\n";
}
```

---

### fetchObject

جلب صف النتيجة كائن.

```php
abstract public function fetchObject($result): ?object
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$result` | resource | مورد نتيجة الاستعلام |

**الإرجاع:** `object|null` - كائن به خصائص لكل عمود

**مثال:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "اسم المستخدم: " . $user->uname;
    echo "البريد الإلكتروني: " . $user->email;
}
```

---

### fetchRow

جلب صف النتيجة كمصفوفة رقمية.

```php
abstract public function fetchRow($result): ?array
```

**مثال:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "اسم المستخدم: " . $row[0] . ", البريد الإلكتروني: " . $row[1];
}
```

---

### fetchBoth

جلب صف النتيجة كمصفوفة ترابطية وأيضاً رقمية.

```php
abstract public function fetchBoth($result): ?array
```

**مثال:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // بالاسم
echo $row[0];        // بالفهرس
```

---

### getRowsNum

الحصول على عدد الصفوف في مجموعة النتائج.

```php
abstract public function getRowsNum($result): int
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$result` | resource | مورد نتيجة الاستعلام |

**الإرجاع:** `int` - عدد الصفوف

**مثال:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "وجدت $count مستخدمين نشطين";
```

---

### getAffectedRows

الحصول على عدد الصفوف المتأثرة من آخر استعلام.

```php
abstract public function getAffectedRows(): int
```

**الإرجاع:** `int` - عدد الصفوف المتأثرة

**مثال:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "تم تحديث $affected صفوف";
```

---

### getInsertId

الحصول على المعرف الذي تم إنشاؤه تلقائياً من آخر INSERT.

```php
abstract public function getInsertId(): int
```

**الإرجاع:** `int` - آخر معرف تم إدراجه

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
echo "تم إنشاء المقالة برقم: $newId";
```

---

### escape

الهروب من سلسلة نصية للاستخدام الآمن في استعلامات SQL.

```php
abstract public function escape(string $string): string
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$string` | string | سلسلة نصية للهروب |

**الإرجاع:** `string` - سلسلة نصية بالهروب (بدون علامات اقتباس)

**مثال:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

الهروب واستقطاع سلسلة نصية لـ SQL.

```php
public function quoteString(string $string): string
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$string` | string | سلسلة نصية للاستقطاع |

**الإرجاع:** `string` - سلسلة نصية بالهروب والاستقطاع

**مثال:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

تحرير الذاكرة المرتبطة بالنتيجة.

```php
abstract public function freeRecordSet($result): void
```

**مثال:**
```php
$result = $db->query($sql);
// معالجة النتائج...
$db->freeRecordSet($result);  // تحرير الذاكرة
```

---

## معالجة الأخطاء

### error

الحصول على آخر رسالة خطأ.

```php
abstract public function error(): string
```

**مثال:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "خطأ قاعدة البيانات: " . $db->error();
}
```

---

### errno

الحصول على آخر رقم خطأ.

```php
abstract public function errno(): int
```

**مثال:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "الخطأ #" . $db->errno() . ": " . $db->error();
}
```

---

## البيانات المحضرة (MySQLi)

يدعم برنامج التشغيل MySQLi البيانات المحضرة لتعزيز الأمان.

### prepare

إنشاء بيانات محضرة.

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

### البيانات المحضرة مع معاملات متعددة

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "مقالتي";
$content = "محتوى المقالة هنا";
$authorId = 1;

if ($stmt->execute()) {
    echo "تم إنشاء المقالة برقم: " . $stmt->insert_id;
}

$stmt->close();
```

---

## دعم المعاملات

### beginTransaction

بدء معاملة.

```php
public function beginTransaction(): bool
```

### commit

التزام المعاملة الحالية.

```php
public function commit(): bool
```

### rollback

التراجع عن المعاملة الحالية.

```php
public function rollback(): bool
```

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // عمليات متعددة
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // التحقق من الأخطاء
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "اكتملت المعاملة";

} catch (Exception $e) {
    $db->rollback();
    echo "فشلت المعاملة: " . $e->getMessage();
}
```

---

## أمثلة الاستخدام الكاملة

### عمليات CRUD الأساسية

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// الإنشاء
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('مقالة جديدة'),
    $db->quoteString('محتوى المقالة'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// القراءة
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// التحديث
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('عنوان محدّث'),
    time(),
    $articleId
);
$db->queryF($sql);

// الحذف
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### استعلام الترقيم

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // الحصول على العدد الإجمالي
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // احصل على صفحة من النتائج
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

### البحث عن استعلام مع LIKE

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // حد 50 نتيجة

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### الانضمام إلى الاستعلام

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

## فئة SqlUtility

فئة مساعدة لعمليات ملف SQL.

### splitMySqlFile

قسم ملف SQL إلى استعلامات فردية.

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
        echo "خطأ في التنفيذ: " . $query . "\n";
        echo "الخطأ: " . $db->error() . "\n";
    }
}
```

### prefixQuery

استبدل عناصر نائبة للجدول بأسماء جداول البادئة.

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

## أفضل الممارسات

### الأمان

1. **الهروب دائماً من إدخال المستخدم**:
```php
$safe = $db->escape($_POST['input']);
```

2. **استخدم البيانات المحضرة عند توفرها**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **استخدم quoteString للقيم**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### الأداء

1. **استخدم دائماً LIMIT للجداول الكبيرة**:
```php
$result = $db->query($sql, 100);  // حد النتائج
```

2. **تحرير مجموعات النتائج عند الانتهاء**:
```php
$db->freeRecordSet($result);
```

3. **استخدم الفهارس المناسبة** في تعريفات الجداول

4. **فضل المعالجات على SQL الخام** عند الإمكان

### معالجة الأخطاء

1. **تحقق دائماً من الأخطاء**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **استخدم المعاملات للعمليات المترابطة المتعددة**:
```php
$db->beginTransaction();
// ... عمليات ...
$db->commit();  // أو $db->rollback();
```

## التوثيق ذي الصلة

- Criteria - نظام معايير الاستعلام
- QueryBuilder - بناء الاستعلام السلس
- ../Core/XoopsObjectHandler - استمرارية الكائن

---

*انظر أيضاً: [كود مصدر XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
