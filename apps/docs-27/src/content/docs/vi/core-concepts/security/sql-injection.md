---
title: "Phòng chống tiêm SQL"
description: "Thực hành bảo mật cơ sở dữ liệu và ngăn chặn việc tiêm SQL vào XOOPS"
---
SQL là một trong những lỗ hổng ứng dụng web nguy hiểm và phổ biến nhất. Hướng dẫn này bao gồm cách bảo vệ XOOPS modules của bạn khỏi các cuộc tấn công tiêm nhiễm SQL.

## Tài liệu liên quan

- Bảo mật-Thực hành tốt nhất - Hướng dẫn bảo mật toàn diện
- CSRF-Protection - Hệ thống token và XoopsSecurity class
- Vệ sinh đầu vào - MyTextSanitizer và xác thực

## Tìm hiểu về tiêm SQL

Việc chèn SQL xảy ra khi đầu vào của người dùng là included trực tiếp trong các truy vấn SQL mà không có sự chuẩn hóa hoặc tham số hóa thích hợp.

### Ví dụ về mã dễ bị tổn thương

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Nếu người dùng chuyển `1 OR 1=1` làm ID thì truy vấn sẽ trở thành:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Điều này trả về tất cả các bản ghi thay vì chỉ một bản ghi.

## Sử dụng truy vấn được tham số hóa

Cách bảo vệ hiệu quả nhất chống lại việc tiêm SQL là sử dụng các truy vấn được tham số hóa (các câu lệnh đã chuẩn bị sẵn).

### Truy vấn tham số cơ bản

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### Nhiều tham số

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### Tham số được đặt tên

Một số tóm tắt cơ sở dữ liệu hỗ trợ các tham số được đặt tên:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Sử dụng XoopsObject và XoopsObjectHandler

XOOPS cung cấp quyền truy cập cơ sở dữ liệu hướng đối tượng giúp ngăn chặn việc tiêm SQL thông qua hệ thống Tiêu chí.

### Cách sử dụng tiêu chí cơ bản

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo cho nhiều điều kiện

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

### Toán tử tiêu chí

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

### HOẶC Điều kiện

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Tiền tố bảng

Luôn sử dụng hệ thống tiền tố bảng XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## CHÈN Truy vấn

### Sử dụng câu lệnh đã chuẩn bị sẵn

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

### Sử dụng XoopsObject

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

## CẬP NHẬT Truy vấn

### Sử dụng câu lệnh đã chuẩn bị sẵn

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

### Sử dụng XoopsObject

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

## XÓA Truy vấn

### Sử dụng câu lệnh đã chuẩn bị sẵn

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Sử dụng XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Xóa hàng loạt có tiêu chí

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Thoát hiểm khi cần thiết

Nếu bạn không thể sử dụng các câu lệnh đã chuẩn bị sẵn, hãy sử dụng lối thoát thích hợp:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Tuy nhiên, **luôn thích các câu lệnh được chuẩn bị sẵn** hơn là thoát.

## Xây dựng truy vấn động một cách an toàn

### Tên cột động an toàn

Tên cột không thể được tham số hóa. Xác thực theo danh sách trắng:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### Tên bảng động an toàn

Tương tự, xác thực tên bảng:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### Xây dựng mệnh đề WHERE một cách linh hoạt

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

## THÍCH Truy vấn

Hãy cẩn thận với các truy vấn THÍCH để tránh chèn ký tự đại diện:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN khoản

Khi sử dụng mệnh đề IN, hãy đảm bảo tất cả các giá trị được nhập đúng:

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

Hoặc với Tiêu chí:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## An toàn giao dịch

Khi thực hiện nhiều truy vấn liên quan:

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

## Xử lý lỗi

Đừng bao giờ để lộ lỗi SQL cho người dùng:

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

## Những sai lầm thường gặp cần tránh

### Sai lầm 1: Nội suy biến trực tiếp

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### Sai lầm 2: Sử dụng addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### Sai lầm 3: Tin tưởng ID số

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### Sai lầm 4: Tiêm bậc 2

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

## Kiểm tra bảo mật

### Kiểm tra truy vấn của bạn

Kiểm tra biểu mẫu của bạn với các thông tin đầu vào sau để kiểm tra việc tiêm SQL:- `' OR '1'='1`
- `1; DROP TABLE users--`
-`1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Nếu bất kỳ điều nào trong số này gây ra hành vi hoặc lỗi không mong muốn thì bạn có một lỗ hổng.

### Kiểm tra tự động

Sử dụng các công cụ kiểm tra tiêm SQL tự động trong quá trình phát triển:

- Bản đồ SQL
- Suite ợ
- OWASP ZAP

## Tóm tắt các phương pháp hay nhất

1. **Luôn sử dụng các truy vấn được tham số hóa** (các câu lệnh được chuẩn bị sẵn)
2. **Sử dụng XoopsObject/XoopsObjectHandler** khi có thể
3. **Sử dụng Tiêu chí classes** để xây dựng truy vấn
4. **Các giá trị được phép đưa vào danh sách trắng** cho các cột và tên bảng
5. **Truyền các giá trị số** một cách rõ ràng với `(int)` hoặc `(float)`
6. **Không bao giờ để lộ lỗi cơ sở dữ liệu** cho người dùng
7. **Sử dụng giao dịch** cho nhiều truy vấn liên quan
8. **Kiểm tra việc tiêm SQL** trong quá trình phát triển
9. **Thoát THÍCH ký tự đại diện** trong truy vấn tìm kiếm
10. **Sạch hóa các giá trị mệnh đề IN** riêng lẻ

---

#security #sql-injection #database #xoops #prepared-statements #Criteria