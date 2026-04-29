---
title: "Hoạt động cơ sở dữ liệu"
---
## Tổng quan

XOOPS cung cấp lớp trừu tượng hóa cơ sở dữ liệu hỗ trợ cả các mẫu thủ tục cũ và các phương pháp tiếp cận hướng đối tượng hiện đại. Hướng dẫn này bao gồm các hoạt động cơ sở dữ liệu phổ biến để phát triển mô-đun.

## Kết nối cơ sở dữ liệu

### Lấy phiên bản cơ sở dữ liệu

```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Các thao tác cơ bản

### Truy vấn CHỌN

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

### Thao tác INSERT

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

### Hoạt động CẬP NHẬT

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

### Thao tác XÓA

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Sử dụng tiêu chí

Hệ thống Tiêu chí cung cấp một cách an toàn về loại để xây dựng truy vấn:

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

### Toán tử tiêu chí

| Nhà điều hành | Mô tả |
|----------|-------------|
| `=` | Bằng (mặc định) |
| `!=` | Không bằng |
| `<` | Ít hơn |
| `>` | Lớn hơn |
| `<=` | Nhỏ hơn hoặc bằng |
| `>=` | Lớn hơn hoặc bằng |
| `LIKE` | Khớp mẫu |
| `IN` | Trong bộ giá trị |

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

## Trình xử lý đối tượng

### Phương thức xử lý

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

### Phương thức xử lý tùy chỉnh

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

## Giao dịch

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

## Tuyên bố đã chuẩn bị (Hiện đại)

```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Quản lý lược đồ

### Tạo bảng

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

### Di chuyển

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

## Các phương pháp hay nhất

1. **Luôn trích dẫn chuỗi** - Sử dụng `$db->quoteString()` cho đầu vào của người dùng
2. **Sử dụng Intval** - Truyền số nguyên với `intval()` hoặc khai báo kiểu
3. **Ưu tiên Trình xử lý** - Sử dụng trình xử lý đối tượng thay vì SQL thô khi có thể
4. **Sử dụng Tiêu chí** - Xây dựng truy vấn với Tiêu chí về an toàn loại
5. **Xử lý lỗi** - Kiểm tra giá trị trả về và xử lý lỗi
6. **Sử dụng Giao dịch** - Bao gồm các hoạt động liên quan trong giao dịch

## Tài liệu liên quan

- ../04-API-Reference/Kernel/Criteria - Xây dựng truy vấn với Tiêu chí
- ../04-API-Reference/Core/XoopsObjectHandler - Mẫu trình xử lý
- ../02-Core-Concepts/Database/Database-Layer - Trừu tượng hóa cơ sở dữ liệu
- Cơ sở dữ liệu/Database-Schema - Hướng dẫn thiết kế lược đồ