---
title: "Yêu cầu XMF"
description: 'Xử lý yêu cầu HTTP an toàn và xác thực đầu vào với Xmf\Request class'
---
`Xmf\Request` class cung cấp quyền truy cập có kiểm soát vào các biến yêu cầu HTTP với chức năng dọn dẹp và chuyển đổi loại tích hợp sẵn. Theo mặc định, nó bảo vệ chống lại các thao tác tiêm có thể gây hại trong khi tuân thủ đầu vào với các loại được chỉ định.

## Tổng quan

Xử lý yêu cầu là một trong những khía cạnh quan trọng nhất về bảo mật trong phát triển web. Yêu cầu XMF class:

- Tự động vệ sinh đầu vào để ngăn chặn các cuộc tấn công XSS
- Cung cấp các trình truy cập an toàn kiểu cho các kiểu dữ liệu phổ biến
- Hỗ trợ nhiều nguồn yêu cầu (GET, POST, COOKIE, v.v.)
- Cung cấp khả năng xử lý giá trị mặc định nhất quán

## Cách sử dụng cơ bản

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Phương thức yêu cầu

### getMethod()

Trả về phương thức yêu cầu HTTP cho yêu cầu hiện tại.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Phương thức cốt lõi mà hầu hết các phương thức `get*()` khác gọi ra. Tìm nạp và trả về một biến được đặt tên từ dữ liệu yêu cầu.

**Thông số:**
- `$name` - Tên biến cần tìm nạp
- `$default` - Giá trị mặc định nếu biến không tồn tại
- `$hash` - Mã băm nguồn: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD hoặc REQUEST (mặc định)
- `$type` - Kiểu dữ liệu để làm sạch (xem các loại FilterInput bên dưới)
- `$mask` - Bitmask cho các tùy chọn làm sạch

**Giá trị mặt nạ:**

| Mặt nạ Hằng | Hiệu ứng |
|---------------|--------|
| `MASK_NO_TRIM` | Không cắt bớt khoảng trắng ở đầu/cuối |
| `MASK_ALLOW_RAW` | Bỏ qua việc dọn dẹp, cho phép nhập liệu thô |
| `MASK_ALLOW_HTML` | Cho phép một bộ đánh dấu HTML "an toàn" có giới hạn |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Phương thức dành riêng cho từng loại

### getInt($name, $default, $hash)

Trả về một giá trị số nguyên. Chỉ cho phép chữ số.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Trả về một giá trị float. Chỉ cho phép chữ số và dấu chấm.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Trả về một giá trị boolean.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Trả về một chuỗi chỉ có các chữ cái và dấu gạch dưới `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Trả về chuỗi lệnh chỉ có `[A-Za-z0-9.-_]`, buộc phải viết thường.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Trả về một chuỗi đã được làm sạch với mã HTML bị loại bỏ (trừ khi bị ghi đè bởi mặt nạ).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Trả về một mảng, được xử lý đệ quy để loại bỏ XSS và mã xấu.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Trả về văn bản thô mà không cần làm sạch. Sử dụng một cách thận trọng.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Trả về một trang web đã được xác thực URL (chỉ các lược đồ tương đối, http hoặc https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Trả về một hệ thống tập tin hoặc đường dẫn web đã được xác thực.

```php
$filePath = Request::getPath('file', '');
```### nhậnEmail($name, $default, $hash)

Trả về địa chỉ email được xác thực hoặc mặc định.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Trả về địa chỉ IPv4 hoặc IPv6 đã được xác thực.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Trả về giá trị tiêu đề yêu cầu HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Phương pháp tiện ích

### hasVar($name, $hash)

Kiểm tra xem một biến có tồn tại trong hàm băm được chỉ định hay không.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Đặt một biến trong hàm băm được chỉ định. Trả về giá trị trước đó hoặc null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### nhận được($hash, $mask)

Trả về bản sao sạch của toàn bộ mảng băm.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### bộ($array, $hash, $overwrite)

Đặt nhiều biến từ một mảng.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## Tích hợp bộ lọc đầu vào

Yêu cầu class sử dụng `Xmf\FilterInput` để làm sạch. Các loại bộ lọc có sẵn:

| Loại | Mô tả |
|------|-------------|
| ALPHANUM / ALNUM | Chỉ chữ và số |
| Mảng | Làm sạch đệ quy từng phần tử |
| CƠ SỞ64 | Chuỗi mã hóa Base64 |
| BOOLEAN / BOOL | Đúng hay sai |
| CMD | Lệnh - A-Z, 0-9, gạch dưới, dấu gạch ngang, dấu chấm (chữ thường) |
| EMAIL | Địa chỉ email hợp lệ |
| PHAO / NHÂN ĐÔI | Số dấu phẩy động |
| INTEGER / INT | Giá trị nguyên |
| IP | Địa chỉ IP hợp lệ |
| ĐƯỜNG | Hệ thống tập tin hoặc đường dẫn web |
| CHUỖI | Chuỗi chung (mặc định) |
| TÊN NGƯỜI DÙNG | Định dạng tên người dùng |
| URL TRANG | Web URL |
| TỪ | Chỉ các chữ cái A-Z và dấu gạch dưới |

## Ví dụ thực tế

### Xử lý biểu mẫu

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### Trình xử lý AJAX

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### Phân trang

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Mẫu tìm kiếm

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Các phương pháp bảo mật tốt nhất

1. **Luôn sử dụng các phương pháp dành riêng cho từng loại** - Sử dụng `getInt()` cho ID, `getEmail()` cho email, v.v.

2. **Cung cấp các giá trị mặc định hợp lý** - Không bao giờ cho rằng đầu vào tồn tại

3. **Xác thực sau khi khử trùng** - Quá trình khử trùng sẽ loại bỏ dữ liệu xấu, quá trình xác thực đảm bảo dữ liệu chính xác

4. **Sử dụng hàm băm thích hợp** - Chỉ định POST cho dữ liệu biểu mẫu, GET cho tham số truy vấn

5. **Tránh nhập liệu thô** - Chỉ sử dụng `getText()` hoặc `MASK_ALLOW_RAW` khi thực sự cần thiết

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Xem thêm

- Bắt đầu với XMF - Các khái niệm cơ bản về XMF
- XMF-Module-Helper - Trình trợ giúp mô-đun class
- ../XMF-Framework - Tổng quan về khung

---

#xmf #request #security #input-validation #sanitization