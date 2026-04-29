---
title: "Lớp XoopsObject"
description: "Cơ sở class cho tất cả các đối tượng dữ liệu trong hệ thống XOOPS cung cấp quản lý, xác thực và tuần tự hóa thuộc tính"
---
`XoopsObject` class là cơ sở cơ bản class cho tất cả các đối tượng dữ liệu trong hệ thống XOOPS. Nó cung cấp một giao diện được tiêu chuẩn hóa để quản lý các thuộc tính đối tượng, xác thực, theo dõi bẩn và tuần tự hóa.

## Tổng quan về lớp học

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Hệ thống phân cấp lớp

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## Thuộc tính

| Bất động sản | Loại | Tầm nhìn | Mô tả |
|----------|------|-------------|-------------|
| `$vars` | mảng | được bảo vệ | Lưu trữ các định nghĩa và giá trị biến |
| `$cleanVars` | mảng | được bảo vệ | Lưu trữ các giá trị đã được khử trùng cho các hoạt động cơ sở dữ liệu |
| `$isNew` | bool | được bảo vệ | Cho biết đối tượng có mới hay không (chưa có trong cơ sở dữ liệu) |
| `$errors` | mảng | được bảo vệ | Lưu trữ thông báo xác thực và lỗi |

## Trình xây dựng

```php
public function __construct()
```

Tạo một phiên bản XoopsObject mới. Đối tượng được đánh dấu là mới theo mặc định.

**Ví dụ:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Phương pháp cốt lõi

### initVar

Khởi tạo một định nghĩa biến cho đối tượng.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$key` | chuỗi | Tên biến |
| `$dataType` | int | Hằng số kiểu dữ liệu (xem Kiểu dữ liệu) |
| `$value` | hỗn hợp | Giá trị mặc định |
| `$required` | bool | Trường có bắt buộc hay không |
| `$maxlength` | int | Độ dài tối đa cho các loại chuỗi |
| `$options` | chuỗi | Tùy chọn bổ sung |

**Các loại dữ liệu:**

| Hằng số | Giá trị | Mô tả |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Nhập hộp văn bản |
| `XOBJ_DTYPE_TXTAREA` | 2 | Nội dung vùng văn bản |
| `XOBJ_DTYPE_INT` | 3 | Giá trị nguyên |
| `XOBJ_DTYPE_URL` | 4 | Chuỗi URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Địa chỉ email |
| `XOBJ_DTYPE_ARRAY` | 6 | Mảng nối tiếp |
| `XOBJ_DTYPE_OTHER` | 7 | Loại tùy chỉnh |
| `XOBJ_DTYPE_SOURCE` | 8 | Mã nguồn |
| `XOBJ_DTYPE_STIME` | 9 | Định dạng thời gian ngắn |
| `XOBJ_DTYPE_MTIME` | 10 | Định dạng thời gian trung bình |
| `XOBJ_DTYPE_LTIME` | 11 | Định dạng thời gian dài |
| `XOBJ_DTYPE_FLOAT` | 12 | Điểm nổi |
| `XOBJ_DTYPE_DECIMAL` | 13 | Số thập phân |
| `XOBJ_DTYPE_ENUM` | 14 | Đếm |

**Ví dụ:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

Đặt giá trị của một biến.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$key` | chuỗi | Tên biến |
| `$value` | hỗn hợp | Giá trị cần đặt |
| `$notGpc` | bool | Nếu đúng, giá trị không phải từ GET/POST/COOKIE |

**Trả về:** `bool` - Đúng nếu thành công, nếu không thì sai

**Ví dụ:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Truy xuất giá trị của một biến với định dạng tùy chọn.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$key` | chuỗi | Tên biến |
| `$format` | chuỗi | Định dạng đầu ra |

**Tùy chọn định dạng:**

| Định dạng | Mô tả |
|--------|-------------|
| `'s'` | Hiển thị - Các thực thể HTML đã thoát để hiển thị |
| `'e'` | Chỉnh sửa - Đối với giá trị đầu vào của biểu mẫu |
| `'p'` | Xem trước - Tương tự như hiển thị |
| `'f'` | Dữ liệu biểu mẫu - Nguyên để xử lý biểu mẫu |
| `'n'` | Không có - Giá trị thô, không có định dạng |**Trả về:** `mixed` - Giá trị được định dạng

**Ví dụ:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### setVars

Đặt nhiều biến cùng một lúc từ một mảng.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$values` | mảng | Mảng kết hợp các cặp khóa => giá trị |
| `$notGpc` | bool | Nếu đúng, các giá trị không phải từ GET/POST/COOKIE |

**Ví dụ:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

### nhận các giá trị

Truy xuất tất cả các giá trị biến.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$keys` | mảng | Các khóa cụ thể để truy xuất (null cho tất cả) |
| `$format` | chuỗi | Định dạng đầu ra |
| `$maxDepth` | int | Độ sâu tối đa cho các đối tượng lồng nhau |

**Trả về:** `array` - Mảng giá trị kết hợp

**Ví dụ:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

### gánVar

Gán một giá trị trực tiếp mà không cần xác nhận (sử dụng một cách thận trọng).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$key` | chuỗi | Tên biến |
| `$value` | hỗn hợp | Giá trị để gán |

**Ví dụ:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Vệ sinh tất cả các biến cho hoạt động cơ sở dữ liệu.

```php
public function cleanVars(): bool
```

**Trả về:** `bool` - Đúng nếu tất cả các biến đều hợp lệ

**Ví dụ:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

### là Mới

Kiểm tra hoặc đặt xem đối tượng có mới hay không.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Ví dụ:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Phương pháp xử lý lỗi

### setLỗi

Thêm một thông báo lỗi.

```php
public function setErrors(string|array $error): void
```

**Ví dụ:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### gặp lỗi

Truy xuất tất cả các thông báo lỗi.

```php
public function getErrors(): array
```

**Ví dụ:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlLỗi

Trả về lỗi được định dạng là HTML.

```php
public function getHtmlErrors(): string
```

**Ví dụ:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Phương pháp tiện ích

### toArray

Chuyển đổi đối tượng thành một mảng.

```php
public function toArray(): array
```

**Ví dụ:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Trả về các định nghĩa biến.

```php
public function getVars(): array
```

**Ví dụ:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Ví dụ sử dụng hoàn chỉnh

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Các phương pháp hay nhất

1. **Luôn khởi tạo các biến**: Xác định tất cả các biến trong hàm tạo bằng `initVar()`

2. **Sử dụng các loại dữ liệu phù hợp**: Chọn hằng số `XOBJ_DTYPE_*` chính xác để xác thực

3. **Xử lý dữ liệu nhập của người dùng một cách cẩn thận**: Sử dụng `setVar()` với `$notGpc = false` cho dữ liệu nhập của người dùng

4. **Xác thực trước khi lưu**: Luôn gọi `cleanVars()` trước khi thao tác với cơ sở dữ liệu

5. **Sử dụng tham số định dạng**: Sử dụng định dạng thích hợp trong `getVar()` cho ngữ cảnh

6. **Mở rộng cho Logic tùy chỉnh**: Thêm các phương thức dành riêng cho miền trong các lớp con

## Tài liệu liên quan

- XoopsObjectHandler - Mẫu trình xử lý để duy trì đối tượng
- ../Database/Criteria - Xây dựng truy vấn với các tiêu chí
- ../Database/XoopsDatabase - Thao tác với cơ sở dữ liệu

---

*Xem thêm: [Mã nguồn XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*