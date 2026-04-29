---
title: "JWT - JSON Web Tokens"
description: "اجرای XMF JWT برای احراز هویت ایمن مبتنی بر توکن و محافظت AJAX"
---
فضای نام `XMF\Jwt` پشتیبانی JSON Web Token (JWT) را برای ماژول های XOOPS فراهم می کند. JWT ها احراز هویت ایمن و بدون حالت را فعال می کنند و به ویژه برای محافظت از درخواست های AJAX مفید هستند.

## توکن های وب JSON چیست؟

JSON Web Tokens یک روش استاندارد برای انتشار مجموعه ای از *ادعاها* (داده ها) به عنوان یک رشته متنی با تأیید رمزنگاری است که ادعاها دستکاری نشده اند. برای مشخصات دقیق، نگاه کنید به:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### ویژگی های کلیدی

- **امضا**: توکن ها به صورت رمزنگاری برای تشخیص دستکاری امضا می شوند
- **خود مختار**: تمام اطلاعات لازم در خود توکن موجود است
- **Stateless**: بدون نیاز به ذخیره سازی جلسه سمت سرور
- **قابل انقضا**: توکن ها می توانند شامل زمان انقضا باشند

> **توجه:** JWT ها امضا شده اند، نه رمزگذاری شده. داده ها Base64 کدگذاری شده و قابل مشاهده هستند. از JWT ها برای تأیید یکپارچگی استفاده کنید، نه برای پنهان کردن داده های حساس.

## چرا از JWT در XOOPS استفاده کنیم؟

### مشکل توکن AJAX

فرم های XOOPS از توکن های nonce برای محافظت CSRF استفاده می کنند. با این حال، nonces با AJAX ضعیف کار می کنند زیرا:

1. **تک استفاده**: Nonها معمولاً برای یک ارسال معتبر هستند
2. **مشکلات ناهمزمان**: چندین درخواست AJAX ممکن است خارج از دستور وارد شوند
3. **پیچیدگی Refresh**: هیچ روش قابل اعتمادی برای تازه کردن توکن ها به صورت ناهمزمان وجود ندارد
4. **Context Binding**: توکن های استاندارد تأیید نمی کنند که کدام اسکریپت آنها را صادر کرده است.

### مزایای JWT

JWT ها این مشکلات را با موارد زیر حل می کنند:

- شامل زمان انقضا (ادعای `exp`) برای اعتبار محدود زمانی
- پشتیبانی از ادعاهای سفارشی برای اتصال نشانه ها به اسکریپت های خاص
- فعال کردن چندین درخواست در مدت اعتبار
- ارائه تایید رمزنگاری منشاء رمز

## کلاس های اصلی

### JsonWebToken

کلاس `XMF\Jwt\JsonWebToken` ایجاد و رمزگشایی توکن را انجام می دهد.

```php
use XMF\Jwt\JsonWebToken;
use XMF\Jwt\KeyFactory;

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

#### روشها

**`new JsonWebToken($key, $algorithm)`**

یک کنترلر JWT جدید ایجاد می کند.
- `$key`: یک شی `XMF\Key\KeyAbstract`
- `$algorithm`: الگوریتم امضا (پیش‌فرض: 'HS256')

**`create($payload, $expirationOffset)`**

یک رشته نشانه امضا شده ایجاد می کند.
- `$payload`: مجموعه ای از ادعاها
- `$expirationOffset`: ثانیه تا انقضا (اختیاری)

**`decode($jwtString, $assertClaims)`**

رمزگشایی و تأیید اعتبار یک نشانه.
- `$jwtString`: رمزی برای رمزگشایی
- `$assertClaims`: ادعاهایی برای تأیید (آرایه خالی برای هیچ کدام)
- برمی‌گرداند: stdClass payload یا false اگر نامعتبر باشد

**`setAlgorithm($algorithm)`**

الگوریتم signing/verification را تغییر می دهد.

### TokenFactory

`XMF\Jwt\TokenFactory` یک راه راحت برای ایجاد توکن ارائه می دهد.

```php
use XMF\Jwt\TokenFactory;

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

- `$key`: رشته نام کلید یا شیء KeyAbstract
- `$payload`: مجموعه ای از ادعاها
- `$expirationOffset`: انقضا در چند ثانیه

موارد استثنا را در صورت شکست: `DomainException`، `InvalidArgumentException`، `UnexpectedValueException`

### TokenReader

کلاس `XMF\Jwt\TokenReader` خواندن توکن ها را از منابع مختلف ساده می کند.

```php
use XMF\Jwt\TokenReader;

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

همه روش‌ها در صورت نامعتبر بودن، محموله را به‌عنوان `stdClass` یا `false` برمی‌گردانند.

### KeyFactory

`XMF\Jwt\KeyFactory` کلیدهای رمزنگاری را ایجاد و مدیریت می کند.

```php
use XMF\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \XMF\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

کلیدها به طور مداوم ذخیره می شوند. ذخیره سازی پیش فرض از سیستم فایل استفاده می کند.

## مثال حفاظت AJAX

در اینجا یک مثال کامل نشان می دهد که AJAX محافظت شده با JWT را نشان می دهد.

### صفحه اسکریپت (توکن تولید می کند)

```php
<?php
use XMF\Jwt\TokenFactory;
use XMF\Jwt\TokenReader;
use XMF\Module\Helper;
use XMF\Request;

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

## بهترین شیوه ها

### انقضای توکن

زمان انقضا مناسب را بر اساس موارد استفاده تنظیم کنید:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### تأیید ادعا

همیشه ادعای `aud` (مخاطبان) را تأیید کنید تا مطمئن شوید که نشانه‌ها با اسکریپت مورد نظر استفاده می‌شوند:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### نامگذاری کلید

از نام های کلیدی توصیفی برای اهداف مختلف استفاده کنید:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### رسیدگی به خطا

```php
use XMF\Jwt\TokenFactory;
use XMF\Jwt\TokenReader;

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

## روش های حمل و نقل توکن

### سرصفحه مجوز (توصیه می شود)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### کوکی

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### پارامتر درخواست

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```## ملاحظات امنیتی

1. **استفاده از HTTPS**: همیشه از HTTPS برای جلوگیری از رهگیری توکن استفاده کنید
2. **انقضای کوتاه**: از کوتاه ترین زمان انقضای عملی استفاده کنید
3. **ادعاهای خاص**: شامل ادعاهایی می شود که نشانه ها را به زمینه های خاص مرتبط می کند
4. ** اعتبار سنجی سمت سرور **: همیشه نشانه های سمت سرور را تأیید کنید
5. **داده های حساس را ذخیره نکنید**: به یاد داشته باشید که نشانه ها قابل خواندن هستند (رمزگذاری نشده)

## مرجع API

### XMF\Jwt\JsonWebToken

| روش | توضیحات |
|--------|------------|
| `__construct($key, $algorithm)` | ایجاد JWT handler |
| `setAlgorithm($algorithm)` | تنظیم الگوریتم امضا |
| `create($payload, $expiration)` | ایجاد نشانه امضا شده |
| `decode($token, $assertClaims)` | رمزگشایی و تأیید رمز |

### XMF\Jwt\TokenFactory

| روش | توضیحات |
|--------|------------|
| `build($key, $payload, $expiration)` | ایجاد رشته رمز |

### XMF\Jwt\TokenReader

| روش | توضیحات |
|--------|------------|
| `fromString($key, $token, $claims)` | رمزگشایی از رشته |
| `fromCookie($key, $name, $claims)` | رمزگشایی از کوکی |
| `fromRequest($key, $name, $claims)` | رمزگشایی از درخواست |
| `fromHeader($key, $claims, $header)` | رمزگشایی از سربرگ |

### XMF\Jwt\KeyFactory

| روش | توضیحات |
|--------|------------|
| `build($name, $storage)` | دریافت یا ایجاد کلید |

## همچنین ببینید

- ../Basics/XMF-Request - رسیدگی به درخواست
- ../XMF-Framework - مروری بر چارچوب
- پایگاه داده - ابزارهای پایگاه داده

---

#xmf #jwt #امنیت #آژاکس #احراز هویت #توکن‌ها