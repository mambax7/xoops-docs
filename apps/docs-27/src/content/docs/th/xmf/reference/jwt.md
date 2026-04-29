---
title: "JWT - JSON เว็บโทเค็น"
description: "XMF JWT การใช้งานเพื่อการรับรองความถูกต้องโดยใช้โทเค็นที่ปลอดภัยและการป้องกัน AJAX"
---
เนมสเปซ `Xmf\Jwt` มีการสนับสนุน JSON Web Token (JWT) สำหรับโมดูล XOOPS JWT เปิดใช้งานการตรวจสอบสิทธิ์แบบไร้สถานะที่ปลอดภัย และมีประโยชน์อย่างยิ่งในการปกป้องคำขอ AJAX

## JSON Web Token คืออะไร

JSON Web Tokens เป็นวิธีมาตรฐานในการเผยแพร่ชุด *การอ้างสิทธิ์* (ข้อมูล) เป็นสตริงข้อความ พร้อมการตรวจสอบด้วยการเข้ารหัสว่าการอ้างสิทธิ์ไม่ได้ถูกแก้ไข สำหรับข้อมูลจำเพาะโดยละเอียด โปรดดู:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### ลักษณะสำคัญ

- **ลงนามแล้ว**: โทเค็นได้รับการลงนามแบบเข้ารหัสเพื่อตรวจจับการปลอมแปลง
- **มีอยู่ในตัวเอง**: ข้อมูลที่จำเป็นทั้งหมดอยู่ในโทเค็นเอง
- **ไร้สถานะ**: ไม่ต้องใช้พื้นที่เก็บข้อมูลเซสชันฝั่งเซิร์ฟเวอร์
- **หมดอายุ**: โทเค็นสามารถรวมเวลาหมดอายุได้

> **หมายเหตุ:** JWT ได้รับการลงนาม ไม่ได้เข้ารหัส ข้อมูลถูกเข้ารหัส Base64 และมองเห็นได้ ใช้ JWT เพื่อยืนยันความสมบูรณ์ ไม่ใช่เพื่อซ่อนข้อมูลที่ละเอียดอ่อน

## เหตุใดจึงใช้ JWT ใน XOOPS

### ปัญหาโทเค็น AJAX

แบบฟอร์ม XOOPS ใช้โทเค็น nonce สำหรับการป้องกัน CSRF อย่างไรก็ตาม nonce ทำงานได้ไม่ดีกับ AJAX เพราะ:

1. **การใช้งานครั้งเดียว**: โดยทั่วไปแล้ว Nonces จะใช้ได้กับการส่งหนึ่งครั้ง
2. **ปัญหาอะซิงโครนัส**: คำขอ AJAX หลายรายการอาจไม่เป็นไปตามลำดับ
3. **รีเฟรชความซับซ้อน**: ไม่มีวิธีที่เชื่อถือได้ในการรีเฟรชโทเค็นแบบอะซิงโครนัส
4. **การเชื่อมโยงบริบท**: โทเค็นมาตรฐานไม่ได้ตรวจสอบว่าสคริปต์ใดออกให้

### JWT ข้อดี

JWT แก้ไขปัญหาเหล่านี้โดย:

- รวมเวลาหมดอายุ (`exp` การเรียกร้อง) สำหรับความถูกต้องแบบจำกัดเวลา
- รองรับการอ้างสิทธิ์แบบกำหนดเองเพื่อผูกโทเค็นกับสคริปต์เฉพาะ
- เปิดใช้งานคำขอหลายรายการภายในระยะเวลาที่มีผลบังคับใช้
- ให้การตรวจสอบการเข้ารหัสของแหล่งกำเนิดโทเค็น

## คลาสหลัก

### JsonWebToken

คลาส `Xmf\Jwt\JsonWebToken` คลาสจัดการการสร้างและถอดรหัสโทเค็น
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
#### วิธีการ

**`new JsonWebToken($key, $algorithm)`**

สร้างตัวจัดการ JWT ใหม่
- `$key`¤: วัตถุ `Xmf\Key\KeyAbstract`
- `$algorithm`: อัลกอริทึมการลงนาม (ค่าเริ่มต้น: 'HS256')

**`create($payload, $expirationOffset)`**

สร้างสตริงโทเค็นที่เซ็นชื่อ
- `$payload`: อาร์เรย์ของการอ้างสิทธิ์
- `$expirationOffset`: วินาทีจนกว่าจะหมดอายุ (ไม่บังคับ)

**`decode($jwtString, $assertClaims)`**

ถอดรหัสและตรวจสอบโทเค็น
- `$jwtString`: โทเค็นที่จะถอดรหัส
- `$assertClaims`: การอ้างสิทธิ์ในการตรวจสอบ (อาร์เรย์ว่างสำหรับไม่มี)
- ส่งคืน: เพย์โหลด stdClass หรือเท็จหากไม่ถูกต้อง

**`setAlgorithm($algorithm)`**

เปลี่ยนอัลกอริธึมการลงนาม/การตรวจสอบ

### โรงงานโทเค็น

`Xmf\Jwt\TokenFactory` มอบวิธีที่สะดวกในการสร้างโทเค็น
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

- `$key`: สตริงชื่อคีย์หรือวัตถุ KeyAbstract
- `$payload`¤: อาร์เรย์ของการอ้างสิทธิ์
- `$expirationOffset`: หมดอายุในไม่กี่วินาที

โยนข้อยกเว้นสำหรับความล้มเหลว: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### เครื่องอ่านโทเค็น

คลาส `Xmf\Jwt\TokenReader` ช่วยลดความยุ่งยากในการอ่านโทเค็นจากแหล่งต่างๆ
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
วิธีการทั้งหมดส่งคืนเพย์โหลดเป็น `stdClass` หรือ `false` หากไม่ถูกต้อง

### คีย์แฟคทอรี

`Xmf\Jwt\KeyFactory` สร้างและจัดการคีย์การเข้ารหัส
```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
คีย์จะถูกเก็บไว้อย่างต่อเนื่อง ที่เก็บข้อมูลเริ่มต้นใช้ระบบไฟล์

## AJAX ตัวอย่างการป้องกัน

นี่คือตัวอย่างที่สมบูรณ์ซึ่งแสดงให้เห็น JWT ที่มีการป้องกัน AJAX

### สคริปต์หน้า (สร้างโทเค็น)
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
## แนวทางปฏิบัติที่ดีที่สุด

### โทเค็นหมดอายุ

ตั้งเวลาหมดอายุที่เหมาะสมตามกรณีการใช้งาน:
```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```
### การยืนยันการเรียกร้อง

ตรวจสอบการอ้างสิทธิ์ `aud` (ผู้ชม) ทุกครั้งเพื่อให้แน่ใจว่ามีการใช้โทเค็นกับสคริปต์ที่ต้องการ:
```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```
### การตั้งชื่อคีย์

ใช้ชื่อคีย์ที่สื่อความหมายเพื่อวัตถุประสงค์ที่แตกต่างกัน:
```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```
### การจัดการข้อผิดพลาด
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
## วิธีการขนส่งโทเค็น

### ส่วนหัวการอนุญาต (แนะนำ)
```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```
### คุกกี้
```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```
### พารามิเตอร์คำขอ
```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```
## ข้อควรพิจารณาด้านความปลอดภัย

1. **ใช้ HTTPS**: ใช้ HTTPS ทุกครั้งเพื่อป้องกันการสกัดกั้นโทเค็น
2. **การหมดอายุสั้น**: ใช้เวลาหมดอายุในทางปฏิบัติที่สั้นที่สุด
3. **การกล่าวอ้างเฉพาะเจาะจง**: รวมการกล่าวอ้างที่ผูกโทเค็นเข้ากับบริบทเฉพาะ
4. **การตรวจสอบฝั่งเซิร์ฟเวอร์**: ตรวจสอบโทเค็นฝั่งเซิร์ฟเวอร์เสมอ
5. **อย่าจัดเก็บข้อมูลที่ละเอียดอ่อน**: จำไว้ว่าโทเค็นสามารถอ่านได้ (ไม่ได้เข้ารหัส)

## API ข้อมูลอ้างอิง

### Xmf\Jwt\JsonWebToken

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `__construct($key, $algorithm)` | สร้างตัวจัดการ JWT |
| `setAlgorithm($algorithm)` | ตั้งค่าอัลกอริธึมการลงนาม |
| `create($payload, $expiration)` | สร้างโทเค็นที่ลงนามแล้ว |
| `decode($token, $assertClaims)` | ถอดรหัสและตรวจสอบโทเค็น |

### Xmf\Jwt\TokenFactory

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `build($key, $payload, $expiration)` | สร้างสตริงโทเค็น |

### Xmf\Jwt\TokenReader

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `fromString($key, $token, $claims)` | ถอดรหัสจากสตริง |
| `fromCookie($key, $name, $claims)` | ถอดรหัสจากคุกกี้ |
| `fromRequest($key, $name, $claims)` | ถอดรหัสจากคำขอ |
| `fromHeader($key, $claims, $header)` | ถอดรหัสจากส่วนหัว |

### Xmf\Jwt\KeyFactory

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `build($name, $storage)` | รับหรือสร้างรหัส |

## ดูเพิ่มเติม

- ../พื้นฐาน/XMF-คำขอ - การจัดการคำขอ
- ../XMF-Framework - ภาพรวมของเฟรมเวิร์ก
- ฐานข้อมูล - ยูทิลิตี้ฐานข้อมูล

---

#xmf #jwt #security #ajax #authentication #tokens