---
title: "Vệ sinh đầu vào"
description: "Sử dụng MyTextSanitizer và các kỹ thuật xác thực trong XOOPS"
---
Không bao giờ tin tưởng đầu vào của người dùng. Luôn xác thực và vệ sinh tất cả dữ liệu đầu vào trước khi sử dụng. XOOPS cung cấp `MyTextSanitizer` class để vệ sinh đầu vào văn bản và các chức năng trợ giúp khác nhau để xác thực.

## Tài liệu liên quan

- Bảo mật-Thực hành tốt nhất - Hướng dẫn bảo mật toàn diện
- CSRF-Protection - Hệ thống Token và XoopsSecurity class
- SQL-Injection-Prevention - Thực hành bảo mật cơ sở dữ liệu

## Nguyên tắc vàng

**Không bao giờ tin tưởng thông tin đầu vào của người dùng.** Tất cả dữ liệu từ các nguồn bên ngoài phải:

1. **Đã xác thực**: Kiểm tra xem nó có phù hợp với định dạng và loại dự kiến không
2. **Khử trùng**: Loại bỏ hoặc thoát khỏi các ký tự nguy hiểm tiềm tàng
3. **Thoát**: Khi xuất, thoát cho ngữ cảnh cụ thể (HTML, JavaScript, SQL)

## Lớp MyTextSanitizer

XOOPS cung cấp `MyTextSanitizer` class (thường có bí danh là `$myts`) để dọn dẹp văn bản.

### Lấy phiên bản

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### Làm sạch văn bản cơ bản

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### Xử lý nội dung vùng văn bản

Phương pháp `displayTarea()` cung cấp khả năng xử lý vùng văn bản toàn diện:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

### Các phương pháp vệ sinh thông thường

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Xác thực đầu vào

### Xác thực các giá trị số nguyên

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### Xác thực địa chỉ email

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### Xác thực URL

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### Ngày xác thực

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### Xác thực tên tệp

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Xử lý các loại đầu vào khác nhau

### Nhập chuỗi

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### Nhập số

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### Đầu vào Boolean

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Đầu vào mảng

```php
// Validate array input (e.g., multiple checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Chọn/Tùy chọn Đầu vào

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Đối tượng yêu cầu (XMF)

Khi sử dụng XMF, Yêu cầu class cung cấp khả năng xử lý đầu vào rõ ràng hơn:

```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Tạo lớp xác thực

Đối với các biểu mẫu phức tạp, hãy tạo xác thực chuyên dụng class:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Cách sử dụng:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## Vệ sinh để lưu trữ cơ sở dữ liệu

Khi lưu trữ dữ liệu vào cơ sở dữ liệu:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Khử trùng trưng bày

Các bối cảnh khác nhau yêu cầu lối thoát khác nhau:

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Những cạm bẫy thường gặp

### Mã hóa kép

**Sự cố**: Dữ liệu được mã hóa nhiều lần

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### Mã hóa không nhất quán

**Sự cố**: Một số đầu ra được mã hóa, một số thì không

**Giải pháp**: Luôn sử dụng phương pháp nhất quán, tốt nhất là mã hóa trên đầu ra:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Thiếu xác thực

**Vấn đề**: Chỉ vệ sinh mà không xác thực

**Giải pháp**: Luôn xác thực trước, sau đó vệ sinh:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Tóm tắt các phương pháp hay nhất

1. **Sử dụng MyTextSanitizer** để xử lý nội dung văn bản
2. **Sử dụng filter_var()** để xác thực định dạng cụ thể
3. **Sử dụng kiểu ép kiểu** cho các giá trị số
4. **Các giá trị được phép đưa vào danh sách trắng** cho các đầu vào được chọn
5. **Xác nhận trước khi vệ sinh**
6. **Thoát ở đầu ra**, không phải ở đầu vào
7. **Sử dụng các câu lệnh đã chuẩn bị sẵn** cho các truy vấn cơ sở dữ liệu
8. **Tạo xác thực classes** cho các biểu mẫu phức tạp
9. **Không bao giờ tin tưởng xác thực phía máy khách** - luôn xác thực phía máy chủ

---

#bảo mật #khử trùng #xác thực #xoops #MyTextSanitizer #xử lý đầu vào