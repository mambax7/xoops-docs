---
title: "คลาสฐานข้อมูล Xoops"
description: "เลเยอร์นามธรรมของฐานข้อมูลที่ให้การจัดการการเชื่อมต่อ การดำเนินการสืบค้น และการจัดการผลลัพธ์"
---
คลาส `XoopsDatabase`¤ จัดให้มีเลเยอร์นามธรรมของฐานข้อมูลสำหรับ XOOPS การจัดการการจัดการการเชื่อมต่อ การดำเนินการสืบค้น การประมวลผลผลลัพธ์ และการจัดการข้อผิดพลาด รองรับไดรเวอร์ฐานข้อมูลหลายตัวผ่านสถาปัตยกรรมไดรเวอร์

## ภาพรวมชั้นเรียน
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
## ลำดับชั้นของชั้นเรียน
```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```
## การรับอินสแตนซ์ฐานข้อมูล

### การใช้โรงงาน
```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```
### การใช้ getInstance
```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```
### ตัวแปรร่วม
```php
// Legacy: Use global variable
global $xoopsDB;
```
## วิธีการหลัก

### เชื่อมต่อ

สร้างการเชื่อมต่อฐานข้อมูล
```php
abstract public function connect(bool $selectdb = true): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$selectdb` | บูล | ไม่ว่าจะเลือกฐานข้อมูล |

**ผลตอบแทน:** `bool` - จริงเมื่อเชื่อมต่อสำเร็จ

**ตัวอย่าง:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```
---

###สอบถาม

ดำเนินการค้นหา SQL
```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$sql` | สตริง | SQL สตริงการสืบค้น |
| `$limit` | อินท์ | แถวสูงสุดที่จะส่งคืน (0 = ไม่มีขีดจำกัด) |
| `$start` | อินท์ | เริ่มต้นออฟเซ็ต |

**ผลตอบแทน:** `resource|bool` - ทรัพยากรผลลัพธ์หรือเท็จเมื่อล้มเหลว

**ตัวอย่าง:**
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

### แบบสอบถามF

ดำเนินการค้นหาที่บังคับให้ดำเนินการ (ข้ามการตรวจสอบความปลอดภัย)
```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```
**กรณีการใช้งาน:**
- การดำเนินการ INSERT, UPDATE, DELETE
- เมื่อคุณต้องการข้ามข้อจำกัดแบบอ่านอย่างเดียว

**ตัวอย่าง:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```
---

### คำนำหน้า

นำหน้าคำนำหน้าตารางฐานข้อมูล
```php
public function prefix(string $table = ''): string
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$table` | สตริง | ชื่อตารางที่ไม่มีคำนำหน้า |

**ผลตอบแทน:** `string` - ชื่อตารางที่มีคำนำหน้า

**ตัวอย่าง:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```
---

### fetchArray

ดึงข้อมูลแถวผลลัพธ์เป็นอาร์เรย์ที่เชื่อมโยง
```php
abstract public function fetchArray($result): ?array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$result` | ทรัพยากร | ทรัพยากรผลลัพธ์แบบสอบถาม |

**ผลตอบแทน:** `array|null` - Associative array หรือ null หากไม่มีแถวอีกต่อไป

**ตัวอย่าง:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```
---

### ดึงวัตถุ

ดึงข้อมูลแถวผลลัพธ์เป็นวัตถุ
```php
abstract public function fetchObject($result): ?object
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$result` | ทรัพยากร | ทรัพยากรผลลัพธ์แบบสอบถาม |

**ผลตอบแทน:** `object|null` - วัตถุที่มีคุณสมบัติสำหรับแต่ละคอลัมน์

**ตัวอย่าง:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```
---

### ดึงข้อมูลแถว

ดึงข้อมูลแถวผลลัพธ์เป็นอาร์เรย์ตัวเลข
```php
abstract public function fetchRow($result): ?array
```
**ตัวอย่าง:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```
---

### ดึงทั้งสองอย่าง

ดึงข้อมูลแถวผลลัพธ์เป็นทั้งอาร์เรย์แบบเชื่อมโยงและตัวเลข
```php
abstract public function fetchBoth($result): ?array
```
**ตัวอย่าง:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```
---

### getRowsNum

รับจำนวนแถวในชุดผลลัพธ์
```php
abstract public function getRowsNum($result): int
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$result` | ทรัพยากร | ทรัพยากรผลลัพธ์แบบสอบถาม |

**ผลตอบแทน:** `int` - จำนวนแถว

**ตัวอย่าง:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```
---

### รับแถวที่ได้รับผลกระทบ

รับจำนวนแถวที่ได้รับผลกระทบจากการสืบค้นครั้งล่าสุด
```php
abstract public function getAffectedRows(): int
```
**ผลตอบแทน:** `int` - จำนวนแถวที่ได้รับผลกระทบ

**ตัวอย่าง:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```
---

### getInsertId

รับ ID ที่สร้างขึ้นอัตโนมัติจาก INSERT สุดท้าย
```php
abstract public function getInsertId(): int
```
**ผลตอบแทน:** `int` - การแทรกครั้งสุดท้าย ID

**ตัวอย่าง:**
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

### หลบหนี

เลี่ยงสตริงเพื่อการใช้งานอย่างปลอดภัยในการสืบค้น SQL
```php
abstract public function escape(string $string): string
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$string` | สตริง | สตริงที่จะหนี |

**ผลตอบแทน:** `string` - สตริงที่ใช้ Escape (ไม่มีเครื่องหมายคำพูด)

**ตัวอย่าง:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```
---

### quoteString

Escape และใส่เครื่องหมายคำพูดสตริงสำหรับ SQL
```php
public function quoteString(string $string): string
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$string` | สตริง | สตริงที่จะอ้างอิง |

**ผลตอบแทน:** `string` - สตริงที่ใช้ Escape และเครื่องหมายคำพูด

**ตัวอย่าง:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```
---

### ชุดบันทึกฟรี

เพิ่มหน่วยความจำที่เกี่ยวข้องกับผลลัพธ์
```php
abstract public function freeRecordSet($result): void
```
**ตัวอย่าง:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```
---

## การจัดการข้อผิดพลาด

### ข้อผิดพลาด

ได้รับข้อความแสดงข้อผิดพลาดล่าสุด
```php
abstract public function error(): string
```
**ตัวอย่าง:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```
---

### เอ่อ.

รับหมายเลขข้อผิดพลาดล่าสุด
```php
abstract public function errno(): int
```
**ตัวอย่าง:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```
---

## คำสั่งที่เตรียมไว้ (MySQLi)

ไดรเวอร์ MySQLi รองรับคำสั่งที่เตรียมไว้เพื่อเพิ่มความปลอดภัย

###เตรียมตัว

สร้างคำสั่งที่เตรียมไว้
```php
public function prepare(string $sql): mysqli_stmt|false
```
**ตัวอย่าง:**
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
### คำสั่งที่เตรียมไว้พร้อมพารามิเตอร์หลายตัว
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

## การสนับสนุนการทำธุรกรรม

### เริ่มต้นการทำธุรกรรม

เริ่มการทำธุรกรรม
```php
public function beginTransaction(): bool
```
### กระทำ

ยืนยันธุรกรรมปัจจุบัน
```php
public function commit(): bool
```
### ย้อนกลับ

ย้อนกลับธุรกรรมปัจจุบัน
```php
public function rollback(): bool
```
**ตัวอย่าง:**
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

## ตัวอย่างการใช้งานที่สมบูรณ์

### การดำเนินงานขั้นพื้นฐาน CRUD
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
### สอบถามการแบ่งหน้า
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
### ข้อความค้นหาด้วย LIKE
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
### เข้าร่วมแบบสอบถาม
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

## คลาส SqlUtility

คลาสตัวช่วยสำหรับการดำเนินการกับไฟล์ SQL

### แยกไฟล์ MySqlFile

แยกไฟล์ SQL ออกเป็นข้อความค้นหาแต่ละรายการ
```php
public static function splitMySqlFile(string $content): array
```
**ตัวอย่าง:**
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
### คำนำหน้าแบบสอบถาม

แทนที่ตัวยึดตารางด้วยชื่อตารางที่นำหน้า
```php
public static function prefixQuery(string $sql, string $prefix): string
```
**ตัวอย่าง:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```
---

## แนวทางปฏิบัติที่ดีที่สุด

### ความปลอดภัย

1. **หลีกเลี่ยงอินพุตของผู้ใช้เสมอ**:
```php
$safe = $db->escape($_POST['input']);
```
2. **ใช้ข้อความที่เตรียมไว้เมื่อมี**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```
3. **ใช้ quoteString สำหรับค่า**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```
### ประสิทธิภาพ

1. **ใช้ LIMIT เสมอสำหรับตารางขนาดใหญ่**:
```php
$result = $db->query($sql, 100);  // Limit results
```
2. **ชุดผลลัพธ์ฟรีเมื่อเสร็จสิ้น**:
```php
$db->freeRecordSet($result);
```
3. **ใช้ดัชนีที่เหมาะสม** ในคำจำกัดความของตารางของคุณ

4. **ต้องการตัวจัดการมากกว่า raw SQL** เมื่อเป็นไปได้

### การจัดการข้อผิดพลาด

1. **ตรวจสอบข้อผิดพลาดเสมอ**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```
2. **ใช้ธุรกรรมสำหรับการดำเนินการที่เกี่ยวข้องหลายอย่าง**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```
## เอกสารที่เกี่ยวข้อง

- เกณฑ์ - ระบบเกณฑ์การค้นหา
- QueryBuilder - การสร้างแบบสอบถามอย่างคล่องแคล่ว
- ../Core/XoopsObjectHandler - การคงอยู่ของวัตถุ

---

*ดูเพิ่มเติมที่: [¤XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*