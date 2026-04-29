---
title: "JWT - Mã thông báo web JSON"
description: "Triển khai XMF JWT để xác thực dựa trên mã thông báo an toàn và bảo vệ AJAX"
---
Không gian tên `Xmf\Jwt` cung cấp hỗ trợ Mã thông báo Web JSON (JWT) cho XOOPS modules. JWT cho phép xác thực an toàn, không trạng thái và đặc biệt hữu ích để bảo vệ các yêu cầu AJAX.

## Mã thông báo Web JSON là gì?

Mã thông báo Web JSON là một cách tiêu chuẩn để xuất bản một tập hợp *xác nhận quyền sở hữu* (dữ liệu) dưới dạng chuỗi văn bản, với xác minh bằng mật mã rằng các xác nhận quyền sở hữu đó không bị giả mạo. Để biết thông số kỹ thuật chi tiết, xem:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Đặc điểm chính

- **Đã ký**: Mã thông báo được ký bằng mật mã để phát hiện hành vi giả mạo
- **Độc lập**: Tất cả thông tin cần thiết đều có trong chính token
- **Không trạng thái**: Không cần lưu trữ phiên phía máy chủ
- **Có thể hết hạn**: Token có thể include về thời gian hết hạn

> **Lưu ý:** JWT được ký, không được mã hóa. Dữ liệu được mã hóa Base64 và hiển thị. Sử dụng JWT để xác minh tính toàn vẹn, không phải để ẩn dữ liệu nhạy cảm.

## Tại sao nên sử dụng JWT trong XOOPS?

### Vấn đề về mã thông báo AJAX

Các biểu mẫu XOOPS sử dụng mã thông báo nonce để bảo vệ CSRF. Tuy nhiên, nonces hoạt động kém với AJAX vì:

1. **Sử dụng một lần**: Nonces thường có giá trị cho một lần gửi
2. **Sự cố không đồng bộ**: Nhiều yêu cầu AJAX có thể không theo thứ tự
3. **Làm mới độ phức tạp**: Không có cách đáng tin cậy nào để làm mới mã thông báo một cách không đồng bộ
4. **Liên kết bối cảnh**: Mã thông báo tiêu chuẩn không xác minh tập lệnh nào đã phát hành chúng

### Ưu điểm JWT

JWT giải quyết những vấn đề này bằng cách:

- Bao gồm thời gian hết hạn (yêu cầu `exp`) để có hiệu lực trong thời gian giới hạn
- Hỗ trợ các xác nhận quyền sở hữu tùy chỉnh để liên kết mã thông báo với các tập lệnh cụ thể
- Cho phép nhiều yêu cầu trong thời hạn hiệu lực
- Cung cấp xác minh mật mã nguồn gốc mã thông báo

## Lớp học cốt lõi

### JsonWebToken

`Xmf\Jwt\JsonWebToken` class xử lý việc tạo và giải mã mã thông báo.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Create a key
$key = KeyFactory::build('my_application_key');

// Create a JsonWebToken instance
$jwt = new JsonWebToken($key, 'HS256');

// Create a token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expires in 300 seconds

// Decode and verify a token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Phương thức

**`new JsonWebToken($key, $algorithm)`**

Tạo trình xử lý JWT mới.
- `$key`: Đối tượng `Xmf\Key\KeyAbstract`
- `$algorithm`: Thuật toán ký (mặc định: ‘HS256’)

**`create($payload, $expirationOffset)`**

Tạo chuỗi mã thông báo đã ký.
- `$payload`: Mảng yêu cầu
- `$expirationOffset`: Số giây cho đến khi hết hạn (tùy chọn)

**`decode($jwtString, $assertClaims)`**

Giải mã và xác thực mã thông báo.
- `$jwtString`: Token để giải mã
- `$assertClaims`: Yêu cầu xác minh (không có mảng trống)
- Trả về: tải trọng stdClass hoặc sai nếu không hợp lệ

**`setAlgorithm($algorithm)`**

Thay đổi thuật toán ký/xác minh.

### Nhà máy mã thông báo

`Xmf\Jwt\TokenFactory` cung cấp một cách thuận tiện để tạo mã thông báo.

```php
use Xmf\Jwt\TokenFactory;

// Create a token with automatic key handling
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expires in 120 seconds
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: Chuỗi tên khóa hoặc đối tượng KeyAbstract
- `$payload`: Mảng yêu cầu bồi thường
- `$expirationOffset`: Hết hạn tính bằng giây

Ném ra ngoại lệ khi thất bại: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### Trình đọc mã thông báo

`Xmf\Jwt\TokenReader` class đơn giản hóa việc đọc mã thông báo từ nhiều nguồn khác nhau.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// From a string
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// From a cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// From a request parameter
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// From Authorization header (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Tất cả các phương thức đều trả về tải trọng dưới dạng `stdClass` hoặc `false` nếu không hợp lệ.

### Nhà máy chính

`Xmf\Jwt\KeyFactory` tạo và quản lý khóa mật mã.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Chìa khóa được lưu trữ liên tục. Bộ nhớ mặc định sử dụng hệ thống tập tin.

## Ví dụ về bảo vệ AJAXDưới đây là ví dụ hoàn chỉnh minh họa AJAX được bảo vệ JWT.

### Tập lệnh trang (Tạo mã thông báo)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims to include and verify
$assertClaims = ['aud' => basename(__FILE__)];

// Check if this is an AJAX request
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Handle AJAX request
    $GLOBALS['xoopsLogger']->activated = false;

    // Verify the token from the Authorization header
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token is valid - process the request
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Your AJAX logic here
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Regular page request - generate token and display page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Create token with claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valid for 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript for AJAX calls
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Update UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Các phương pháp hay nhất

### Mã thông báo hết hạn

Đặt thời gian hết hạn phù hợp dựa trên trường hợp sử dụng:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Xác minh yêu cầu

Luôn xác minh xác nhận quyền sở hữu `aud` (đối tượng) để đảm bảo mã thông báo được sử dụng với tập lệnh dự định:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Đặt tên khóa

Sử dụng tên khóa mô tả cho các mục đích khác nhau:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Xử lý lỗi

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Invalid algorithm
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Invalid argument
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Unexpected value
    error_log('JWT Error: ' . $e->getMessage());
}

// Reading tokens returns false on failure (no exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token invalid, expired, or tampered
}
```

## Phương thức vận chuyển mã thông báo

### Tiêu đề ủy quyền (Được khuyến nghị)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Bánh quy

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Tham số yêu cầu

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Cân nhắc về bảo mật

1. **Sử dụng HTTPS**: Luôn sử dụng HTTPS để ngăn chặn việc chặn mã thông báo
2. **Hết hạn ngắn**: Sử dụng thời gian hết hạn thực tế ngắn nhất
3. **Tuyên bố cụ thể**: Bao gồm các tuyên bố gắn mã thông báo với các ngữ cảnh cụ thể
4. **Xác thực phía máy chủ**: Luôn xác thực mã thông báo phía máy chủ
5. **Không lưu trữ dữ liệu nhạy cảm**: Hãy nhớ rằng mã thông báo có thể đọc được (không được mã hóa)

## Tham khảo API

### Xmf\Jwt\JsonWebToken

| Phương pháp | Mô tả |
|--------|-------------|
| `__construct($key, $algorithm)` | Tạo trình xử lý JWT |
| `setAlgorithm($algorithm)` | Đặt thuật toán ký |
| `create($payload, $expiration)` | Tạo mã thông báo đã ký |
| `decode($token, $assertClaims)` | Giải mã và xác minh mã thông báo |

### Xmf\Jwt\TokenFactory

| Phương pháp | Mô tả |
|--------|-------------|
| `build($key, $payload, $expiration)` | Tạo chuỗi mã thông báo |

### Xmf\Jwt\TokenReader

| Phương pháp | Mô tả |
|--------|-------------|
| `fromString($key, $token, $claims)` | Giải mã từ chuỗi |
| `fromCookie($key, $name, $claims)` | Giải mã từ cookie |
| `fromRequest($key, $name, $claims)` | Giải mã từ yêu cầu |
| `fromHeader($key, $claims, $header)` | Giải mã từ tiêu đề |

### Xmf\Jwt\KeyFactory

| Phương pháp | Mô tả |
|--------|-------------|
| `build($name, $storage)` | Nhận hoặc tạo khóa |

## Xem thêm

- ../Basics/XMF-Request - Xử lý yêu cầu
- ../XMF-Framework - Tổng quan về khung
- Cơ sở dữ liệu - Tiện ích cơ sở dữ liệu

---

#xmf #jwt #bảo mật #ajax #xác thực #token