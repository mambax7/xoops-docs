---
title: "Các lớp Tiêu chí và Tiêu chíCompo"
description: "Xây dựng truy vấn và lọc nâng cao bằng Tiêu chí classes"
---
`Criteria` và `CriteriaCompo` classes cung cấp giao diện hướng đối tượng, trôi chảy để xây dựng các truy vấn cơ sở dữ liệu phức tạp. Các mệnh đề classes trừu tượng SQL WHERE này cho phép các nhà phát triển xây dựng các truy vấn động một cách an toàn và dễ đọc.

## Tổng quan về lớp học

### Lớp tiêu chí

`Criteria` class đại diện cho một điều kiện duy nhất trong mệnh đề WHERE:

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## Cách sử dụng cơ bản

### Tiêu chí đơn giản

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### Toán tử khác nhau

```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Xây dựng các truy vấn phức tạp

### VÀ Logic (Mặc định)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### HOẶC Logic

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Tích hợp với mẫu kho lưu trữ

### Ví dụ về kho lưu trữ

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## An toàn và bảo mật

### Tự động thoát

`Criteria` class tự động thoát các giá trị để ngăn chặn việc tiêm SQL:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API Tham khảo

### Phương pháp tiêu chí

| Phương pháp | Mô tả | Trở về |
|--------|-------------|--------|
| `__construct()` | Khởi tạo điều kiện tiêu chí | trống |
| `render($prefix = '')` | Kết xuất thành đoạn mệnh đề SQL WHERE | chuỗi |
| `getColumn()` | Lấy tên cột | chuỗi |
| `getValue()` | Lấy giá trị so sánh | hỗn hợp |
| `getOperator()` | Lấy toán tử so sánh | chuỗi |

### Phương thức CriteriaCompo

| Phương pháp | Mô tả | Trở về |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Khởi tạo tiêu chí tổng hợp | trống |
| `add($criteria, $logic = null)` | Thêm tiêu chí hoặc tổ hợp lồng nhau | trống |
| `render($prefix = '')` | Kết xuất để hoàn thành mệnh đề WHERE | chuỗi |
| `count()` | Lấy số tiêu chí | int |
| `clear()` | Xóa tất cả tiêu chí | trống |

## Tài liệu liên quan

- XoopsDatabase - Cơ sở dữ liệu tham khảo class
- ../../03-Module-Development/Patterns/Repository-Pattern - Mẫu kho lưu trữ trong XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Mẫu lớp dịch vụ

## Thông tin phiên bản

- **Giới thiệu:** XOOPS 2.5.0
- **Cập nhật lần cuối:** XOOPS 4.0
- **Khả năng tương thích:** PHP 7.4+