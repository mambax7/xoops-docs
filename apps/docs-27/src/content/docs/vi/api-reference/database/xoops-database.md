---
title: "Lớp cơ sở dữ liệu Xoops"
description: "Lớp trừu tượng cơ sở dữ liệu cung cấp quản lý kết nối, thực hiện truy vấn và xử lý kết quả"
---
`XoopsDatabase` class cung cấp lớp trừu tượng hóa cơ sở dữ liệu cho XOOPS, xử lý quản lý kết nối, thực hiện truy vấn, xử lý kết quả và xử lý lỗi. Nó hỗ trợ nhiều trình điều khiển cơ sở dữ liệu thông qua kiến ​​trúc trình điều khiển.

## Tổng quan về lớp học

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

## Hệ thống phân cấp lớp

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## Lấy một phiên bản cơ sở dữ liệu

### Sử dụng Nhà máy

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### Sử dụng getInstance

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### Biến toàn cục

```php
// Legacy: Use global variable
global $xoopsDB;
```

## Phương pháp cốt lõi

### kết nối

Thiết lập kết nối cơ sở dữ liệu.

```php
abstract public function connect(bool $selectdb = true): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$selectdb` | bool | Có nên chọn cơ sở dữ liệu |

**Trả về:** `bool` - Đúng khi kết nối thành công

**Ví dụ:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### truy vấn

Thực hiện truy vấn SQL.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$sql` | chuỗi | Chuỗi truy vấn SQL |
| `$limit` | int | Số hàng tối đa cần trả về (0 = không giới hạn) |
| `$start` | int | Bắt đầu bù đắp |

**Trả về:** `resource|bool` - Tài nguyên kết quả hoặc sai khi thất bại

**Ví dụ:**
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

### truy vấnF

Thực hiện truy vấn buộc thực hiện thao tác (bỏ qua kiểm tra bảo mật).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**Trường hợp sử dụng:**
- Các thao tác CHÈN, CẬP NHẬT, XÓA
- Khi bạn cần bỏ qua các hạn chế chỉ đọc

**Ví dụ:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

tiền tố ###

Thêm tiền tố bảng cơ sở dữ liệu.

```php
public function prefix(string $table = ''): string
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$table` | chuỗi | Tên bảng không có tiền tố |

**Trả về:** `string` - Tên bảng có tiền tố

**Ví dụ:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### tìm nạpArray

Tìm nạp một hàng kết quả dưới dạng một mảng kết hợp.

```php
abstract public function fetchArray($result): ?array
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$result` | tài nguyên | Tài nguyên kết quả truy vấn |

**Trả về:** `array|null` - Mảng kết hợp hoặc null nếu không còn hàng

**Ví dụ:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### tìm nạpObject

Lấy một hàng kết quả làm đối tượng.

```php
abstract public function fetchObject($result): ?object
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$result` | tài nguyên | Tài nguyên kết quả truy vấn |

**Trả về:** `object|null` - Đối tượng có thuộc tính cho mỗi cột

**Ví dụ:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### tìm nạpRow

Tìm nạp một hàng kết quả dưới dạng một mảng số.

```php
abstract public function fetchRow($result): ?array
```

**Ví dụ:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### tìm nạpCả hai

Tìm nạp một hàng kết quả dưới dạng cả mảng kết hợp và mảng số.

```php
abstract public function fetchBoth($result): ?array
```

**Ví dụ:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

Lấy số hàng trong một tập kết quả.

```php
abstract public function getRowsNum($result): int
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$result` | tài nguyên | Tài nguyên kết quả truy vấn |

**Trả về:** `int` - Số lượng hàng

**Ví dụ:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

Lấy số lượng hàng bị ảnh hưởng từ truy vấn cuối cùng.

```php
abstract public function getAffectedRows(): int
```

**Trả về:** `int` - Số lượng hàng bị ảnh hưởng

**Ví dụ:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

Lấy ID được tạo tự động từ INSERT cuối cùng.

```php
abstract public function getInsertId(): int
```**Trả về:** `int` - ID chèn cuối cùng

**Ví dụ:**
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

### trốn thoát

Thoát khỏi một chuỗi để sử dụng an toàn trong các truy vấn SQL.

```php
abstract public function escape(string $string): string
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$string` | chuỗi | Chuỗi để thoát |

**Trả về:** `string` - Chuỗi thoát (không có dấu ngoặc kép)

**Ví dụ:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

Thoát và trích dẫn một chuỗi cho SQL.

```php
public function quoteString(string $string): string
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$string` | chuỗi | Chuỗi để trích dẫn |

**Trả về:** `string` - Chuỗi thoát và trích dẫn

**Ví dụ:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### Bộ bản ghi miễn phí

Giải phóng bộ nhớ liên quan đến kết quả.

```php
abstract public function freeRecordSet($result): void
```

**Ví dụ:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## Xử lý lỗi

lỗi ###

Nhận được thông báo lỗi cuối cùng.

```php
abstract public function error(): string
```

**Ví dụ:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### không có lỗi

Lấy số lỗi cuối cùng.

```php
abstract public function errno(): int
```

**Ví dụ:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## Báo cáo được chuẩn bị sẵn (MySQLi)

Trình điều khiển MySQLi hỗ trợ các câu lệnh đã chuẩn bị sẵn để tăng cường bảo mật.

### chuẩn bị

Tạo một tuyên bố chuẩn bị.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**Ví dụ:**
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

### Câu lệnh được chuẩn bị sẵn với nhiều tham số

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

## Hỗ trợ giao dịch

### bắt đầuGiao dịch

Bắt đầu một giao dịch.

```php
public function beginTransaction(): bool
```

### cam kết

Cam kết giao dịch hiện tại.

```php
public function commit(): bool
```

### quay lại

Khôi phục giao dịch hiện tại.

```php
public function rollback(): bool
```

**Ví dụ:**
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

## Ví dụ sử dụng hoàn chỉnh

### Hoạt động CRUD cơ bản

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

### Truy vấn phân trang

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

### Truy vấn tìm kiếm với THÍCH

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

### Truy vấn tham gia

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

## Lớp SqlUtility

Trình trợ giúp class cho các thao tác với tệp SQL.

### táchMySqlFile

Chia tệp SQL thành các truy vấn riêng lẻ.

```php
public static function splitMySqlFile(string $content): array
```

**Ví dụ:**
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

### tiền tốTruy vấn

Thay thế phần giữ chỗ của bảng bằng tên bảng có tiền tố.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**Ví dụ:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## Các phương pháp hay nhất

### Bảo mật

1. **Luôn thoát khỏi thao tác nhập của người dùng**:
```php
$safe = $db->escape($_POST['input']);
```

2. **Sử dụng các câu đã chuẩn bị sẵn nếu có**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **Sử dụng quoteString cho các giá trị**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### Hiệu suất

1. **Luôn sử dụng LIMIT cho các bảng lớn**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **Bộ kết quả miễn phí khi hoàn thành**:
```php
$db->freeRecordSet($result);
```

3. **Sử dụng các chỉ mục thích hợp** trong định nghĩa bảng của bạn

4. **Ưu tiên các trình xử lý hơn SQL thô** khi có thể

### Xử lý lỗi

1. **Luôn kiểm tra lỗi**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **Sử dụng giao dịch cho nhiều hoạt động liên quan**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## Tài liệu liên quan

- Tiêu chí - Hệ thống tiêu chí truy vấn
- QueryBuilder - Xây dựng truy vấn thông thạo
- ../Core/XoopsObjectHandler - Tính bền vững của đối tượng

---

*Xem thêm: [Mã nguồn XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*