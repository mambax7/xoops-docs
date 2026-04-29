---
title: "XMF คำขอ"
description: 'รักษาความปลอดภัย HTTP การจัดการคำขอและการตรวจสอบอินพุตด้วยคลาส Xmf\Request'
---
คลาส `Xmf\Request`¤ ให้การควบคุมการเข้าถึงตัวแปรคำขอ HTTP ด้วยการฆ่าเชื้อและการแปลงประเภทในตัว โดยจะป้องกันการฉีดที่อาจเป็นอันตรายตามค่าเริ่มต้น ในขณะที่ปรับอินพุตตามประเภทที่ระบุ

## ภาพรวม

การจัดการคำขอถือเป็นหนึ่งในแง่มุมที่มีความสำคัญต่อความปลอดภัยมากที่สุดในการพัฒนาเว็บ คลาสคำขอ XMF:

- ฆ่าเชื้ออินพุตโดยอัตโนมัติเพื่อป้องกันการโจมตี XSS
- จัดเตรียมตัวเข้าถึงประเภทข้อมูลที่ปลอดภัยสำหรับประเภทข้อมูลทั่วไป
- รองรับแหล่งคำขอหลายแหล่ง (GET, POST, COOKIE ฯลฯ)
- เสนอการจัดการค่าเริ่มต้นที่สอดคล้องกัน

## การใช้งานขั้นพื้นฐาน
```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```
## วิธีการขอ

### getMethod()

ส่งกลับวิธีการร้องขอ HTTP สำหรับคำขอปัจจุบัน
```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```
### getVar($name, $default, $hash, $type, $mask)

วิธีการหลักที่วิธี `get*()` อื่นๆ ส่วนใหญ่เรียกใช้ ดึงข้อมูลและส่งคืนตัวแปรที่มีชื่อจากข้อมูลคำขอ

**พารามิเตอร์:**
- `$name` - ชื่อตัวแปรที่จะดึงข้อมูล
- `$default` - ค่าเริ่มต้นหากไม่มีตัวแปรอยู่
- `$hash` - แหล่งที่มาของแฮช: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, หรือ REQUEST (ค่าเริ่มต้น)
- `$type` - ประเภทข้อมูลสำหรับการทำความสะอาด (ดูประเภทตัวกรองอินพุตด้านล่าง)
- `$mask` - Bitmask สำหรับตัวเลือกการทำความสะอาด

**ค่ามาส์ก:**

| หน้ากากคง | เอฟเฟกต์ |
|---------|--------|
| `MASK_NO_TRIM` | อย่าตัดช่องว่างนำหน้า/ต่อท้าย |
| `MASK_ALLOW_RAW` | ข้ามการทำความสะอาด อนุญาตให้ป้อนข้อมูลดิบ |
| `MASK_ALLOW_HTML` | อนุญาตชุดมาร์กอัป HTML | "ปลอดภัย" แบบจำกัด
```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```
## วิธีการเฉพาะประเภท

### getInt($name, $default, $hash¤)

ส่งกลับค่าจำนวนเต็ม อนุญาตให้ใช้เฉพาะตัวเลขเท่านั้น
```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```
### getFloat($name, $default, $hash)

ส่งกลับค่าทศนิยม อนุญาตเฉพาะตัวเลขและจุดเท่านั้น
```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```
### getBool($name, $default, $hash¤)

ส่งคืนค่าบูลีน
```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```
### getWord($name, $default, $hash¤)

ส่งกลับสตริงที่มีเฉพาะตัวอักษรและขีดล่าง `[A-Za-z_]`
```php
$action = Request::getWord('action', 'view');
```
### getCmd($name, $default, $hash)

ส่งกลับสตริงคำสั่งที่มีเพียง `[A-Za-z0-9.-_]` เท่านั้น ซึ่งบังคับให้เป็นตัวพิมพ์เล็ก
```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```
### getString($name, $default, $hash, $mask¤)

ส่งกลับสตริงที่ล้างแล้วโดยนำโค้ด HTML ที่ไม่ถูกต้องออก (เว้นแต่จะมีการแทนที่ด้วยมาสก์)
```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```
### getArray($name, $default, $hash¤)

ส่งคืนอาร์เรย์ที่ประมวลผลแบบวนซ้ำเพื่อลบ XSS และโค้ดที่ไม่ถูกต้อง
```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```
### getText($name, $default, $hash¤)

ส่งกลับข้อความดิบโดยไม่ต้องทำความสะอาด ใช้ด้วยความระมัดระวัง
```php
$rawContent = Request::getText('raw_content', '');
```
### getUrl($name, $default, $hash¤)

ส่งคืนเว็บที่ได้รับการตรวจสอบ URL (แบบสัมพันธ์, http หรือ https เท่านั้น)
```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```
### getPath($name, $default, $hash)

ส่งคืนระบบไฟล์หรือเส้นทางเว็บที่ผ่านการตรวจสอบแล้ว
```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash¤)

ส่งกลับที่อยู่อีเมลที่ตรวจสอบแล้วหรือค่าเริ่มต้น
```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```
### getIP($name, $default, $hash¤)

ส่งกลับที่อยู่ IPv4 หรือ IPv6 ที่ได้รับการตรวจสอบแล้ว
```php
$userIp = Request::getIP('client_ip', '');
```
### getHeader($headerName, $default)

ส่งกลับค่าส่วนหัวคำขอ HTTP
```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```
## วิธีการอรรถประโยชน์

### hasVar($name, $hash)

ตรวจสอบว่ามีตัวแปรอยู่ในแฮชที่ระบุหรือไม่
```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```
### setVar($name, $value, $hash, $overwrite¤)

ตั้งค่าตัวแปรในแฮชที่ระบุ ส่งคืนค่าก่อนหน้าหรือค่าว่าง
```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```
### รับ($hash, $mask)

ส่งคืนสำเนาที่ล้างแล้วของอาร์เรย์แฮชทั้งหมด
```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```
### ชุด($array, $hash, $overwrite¤)

ตั้งค่าตัวแปรหลายตัวจากอาร์เรย์
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```
## การรวมตัวกรองอินพุต

คลาสคำขอใช้ `Xmf\FilterInput` ในการทำความสะอาด ประเภทตัวกรองที่ใช้ได้:

| พิมพ์ | คำอธิบาย |
|-|-------------|
| ALPHANUM / ALNUM | ตัวอักษรและตัวเลขเท่านั้น |
| ARRAY | ทำความสะอาดแต่ละองค์ประกอบซ้ำ |
| BASE64 | สตริงที่เข้ารหัส Base64 |
| BOOLEAN / BOOL | จริงหรือเท็จ |
| CMD | คำสั่ง - A-Z, 0-9, ขีดล่าง, ขีดกลาง, มหัพภาค (ตัวพิมพ์เล็ก) |
| EMAIL | ที่อยู่อีเมลที่ถูกต้อง |
| FLOAT / DOUBLE | หมายเลขจุดลอยตัว |
| INTEGER / INT | ค่าจำนวนเต็ม |
| IP | ที่อยู่ IP ที่ถูกต้อง |
| PATH | ระบบไฟล์หรือเส้นทางเว็บ |
| STRING | สตริงทั่วไป (ค่าเริ่มต้น) |
| USERNAME | รูปแบบชื่อผู้ใช้ |
| WEBURL | เว็บ URL |
| WORD | ตัวอักษร A-Z และขีดเส้นใต้เท่านั้น |

## ตัวอย่างการปฏิบัติ

### กำลังประมวลผลแบบฟอร์ม
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
### AJAX ตัวจัดการ
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
### การแบ่งหน้า
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
### แบบฟอร์มการค้นหา
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
## แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย

1. **ใช้วิธีการเฉพาะประเภทเสมอ** - ใช้ `getInt()` สำหรับ ID, `getEmail()` สำหรับอีเมล ฯลฯ

2. **ระบุค่าเริ่มต้นที่สมเหตุสมผล** - อย่าถือว่ามีอินพุตอยู่

3. **ตรวจสอบหลังจากการฆ่าเชื้อ** - การฆ่าเชื้อจะลบข้อมูลที่ไม่ถูกต้อง การตรวจสอบความถูกต้องทำให้มั่นใจได้ว่าข้อมูลถูกต้อง

4. **ใช้แฮชที่เหมาะสม** - ระบุ POST สำหรับข้อมูลแบบฟอร์ม GET สำหรับพารามิเตอร์การสืบค้น

5. **หลีกเลี่ยงการป้อนข้อมูลดิบ** - ใช้ `getText()` หรือ `MASK_ALLOW_RAW` เมื่อจำเป็นจริงๆ เท่านั้น
```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```
## ดูเพิ่มเติม

- การเริ่มต้นใช้งาน-XMF - แนวคิดพื้นฐาน XMF
- XMF-Module-Helper - คลาสตัวช่วยโมดูล
- ../XMF-Framework - ภาพรวมของเฟรมเวิร์ก

---

#xmf #request #security #input-validation #sanitization