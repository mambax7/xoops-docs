---
title: "JWT - رموز الويب JSON"
description: "تنفيذ JWT في XMF للمصادقة الآمنة القائمة على الرموز وحماية AJAX"
dir: rtl
lang: ar
---

توفر مساحة اسم `Xmf\Jwt` دعم JSON Web Token (JWT) لوحدات XOOPS. تمكّن JWTs المصادقة الآمنة وغير الحالة وتكون مفيدة بشكل خاص لحماية طلبات AJAX.

## ما هي رموز الويب JSON؟

رموز الويب JSON هي طريقة قياسية لنشر مجموعة من *المطالبات* (البيانات) كسلسلة نصية، مع التحقق التشفيري من أن المطالبات لم يتم التلاعب بها. للمواصفات التفصيلية، انظر:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### الخصائص الرئيسية

- **موقعة**: الرموز موقعة تشفيرياً للكشف عن العبث
- **مستقلة بذاتها**: جميع المعلومات الضرورية موجودة في الرمز نفسه
- **بدون حالة**: لا يلزم تخزين الجلسات من جانب الخادم
- **قابلة للانتهاء**: يمكن أن تتضمن الرموز أوقات انتهاء الصلاحية

> **ملاحظة:** رموز JWT موقعة وليست مشفرة. البيانات مشفرة بـ Base64 وقابلة للرؤية. استخدم JWTs للتحقق من السلامة، وليس لإخفاء البيانات الحساسة.

## لماذا تستخدم JWT في XOOPS؟

### مشكلة رمز AJAX

تستخدم نماذج XOOPS رموز nonce لحماية CSRF. ومع ذلك، تعمل nonces بشكل سيء مع AJAX لأن:

1. **الاستخدام الفردي**: Nonces عادة ما تكون صالحة لتقديم واحد
2. **مشاكل غير المتزامن**: قد تصل طلبات AJAX متعددة بترتيب مختلف
3. **تعقيد التحديث**: لا توجد طريقة موثوقة لتحديث الرموز بشكل غير متزامن
4. **ربط السياق**: الرموز القياسية لا تتحقق من البرنامج النصي الذي أصدرها

### مزايا JWT

تحل JWTs هذه المشاكل من خلال:

- تضمين وقت انتهاء الصلاحية (`exp` claim) للصلاحية المحدودة بالوقت
- دعم المطالبات المخصصة لربط الرموز بنصوص معينة
- تفعيل طلبات متعددة ضمن فترة الصلاحية
- توفير التحقق التشفيري من أصل الرمز

## الفئات الأساسية

### JsonWebToken

تتعامل فئة `Xmf\Jwt\JsonWebToken` مع إنشاء الرموز وفك تشفيرها.

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

#### الطرق

**`new JsonWebToken($key, $algorithm)`**

ينشئ معالج JWT جديد.
- `$key`: كائن `Xmf\Key\KeyAbstract`
- `$algorithm`: خوارزمية التوقيع (الافتراضي: 'HS256')

**`create($payload, $expirationOffset)`**

ينشئ سلسلة رمز موقعة.
- `$payload`: مصفوفة من المطالبات
- `$expirationOffset`: الثواني حتى انتهاء الصلاحية (اختياري)

**`decode($jwtString, $assertClaims)`**

فك تشفير والتحقق من الرمز.
- `$jwtString`: الرمز المراد فك تشفيره
- `$assertClaims`: المطالبات للتحقق (مصفوفة فارغة لا شيء)
- العودة: stdClass payload أو false إذا كان غير صالح

**`setAlgorithm($algorithm)`**

يغير خوارزمية التوقيع/التحقق.

### TokenFactory

توفر `Xmf\Jwt\TokenFactory` طريقة مريحة لإنشاء الرموز.

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

- `$key`: سلسلة اسم المفتاح أو كائن KeyAbstract
- `$payload`: مصفوفة من المطالبات
- `$expirationOffset`: انتهاء الصلاحية بالثواني

ترمي الاستثناءات عند الفشل: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

تبسط فئة `Xmf\Jwt\TokenReader` قراءة الرموز من مصادر مختلفة.

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

جميع الطرق تعيد الحمل كـ `stdClass` أو `false` إذا كان غير صالح.

### KeyFactory

ينشئ `Xmf\Jwt\KeyFactory` ويدير المفاتيح التشفيرية.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

يتم تخزين المفاتيح بشكل دائم. التخزين الافتراضي يستخدم نظام الملفات.

## مثال حماية AJAX

إليك مثال كامل يوضح AJAX محمي بـ JWT.

### نص الصفحة (ينشئ الرمز)

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

## أفضل الممارسات

### انتهاء صلاحية الرمز

اضبط أوقات انتهاء الصلاحية المناسبة بناءً على حالة الاستخدام:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### التحقق من المطالبات

تحقق دائماً من مطالبة `aud` (الجمهور) للتأكد من استخدام الرموز مع البرنامج النصي المقصود:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### تسمية المفتاح

استخدم أسماء مفاتيح وصفية لأغراض مختلفة:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### معالجة الأخطاء

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

## طرق نقل الرموز

### رأس التفويض (الموصى به)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### الكعكة

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### معامل الطلب

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
