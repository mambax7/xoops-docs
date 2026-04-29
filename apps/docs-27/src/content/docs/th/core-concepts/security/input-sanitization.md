---
title: "การฆ่าเชื้ออินพุต"
description: "การใช้ MyTextSanitizer และเทคนิคการตรวจสอบใน XOOPS"
---
อย่าเชื่อถือข้อมูลของผู้ใช้ ตรวจสอบและฆ่าเชื้อข้อมูลอินพุตทั้งหมดก่อนใช้งานเสมอ XOOPS มีคลาส `MyTextSanitizer` สำหรับการป้อนข้อความที่สะอาดและฟังก์ชันตัวช่วยต่างๆ สำหรับการตรวจสอบ

## เอกสารที่เกี่ยวข้อง

- แนวปฏิบัติด้านความปลอดภัยที่ดีที่สุด - คู่มือความปลอดภัยที่ครอบคลุม
- CSRF-การป้องกัน - ระบบโทเค็นและคลาส XoopsSecurity
- SQL-การป้องกันการฉีด - แนวปฏิบัติด้านความปลอดภัยของฐานข้อมูล

## กฎทอง

**อย่าเชื่อถือข้อมูลที่ผู้ใช้กรอก** ข้อมูลทั้งหมดจากแหล่งภายนอกจะต้องเป็น:

1. **ตรวจสอบแล้ว**: ตรวจสอบว่าตรงกับรูปแบบและประเภทที่ต้องการ
2. **ฆ่าเชื้อแล้ว**: ลบหรือหลบหนีตัวละครที่อาจเป็นอันตราย
3. **Escaped**: เมื่อแสดงผล ให้ Escape สำหรับบริบทเฉพาะ (HTML, JavaScript, SQL)

## คลาส MyTextSanitizer

XOOPS มีคลาส `MyTextSanitizer` (เรียกโดยทั่วไปว่า `$myts`) สำหรับการฆ่าเชื้อข้อความ

### กำลังรับอินสแตนซ์
```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```
### การฆ่าเชื้อข้อความขั้นพื้นฐาน
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
### การประมวลผลเนื้อหา Textarea

เมธอด `displayTarea()` ให้การประมวลผลพื้นที่ข้อความที่ครอบคลุม:
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
### วิธีการฆ่าเชื้อทั่วไป
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
## การตรวจสอบอินพุต

### การตรวจสอบความถูกต้องของค่าจำนวนเต็ม
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
### กำลังตรวจสอบที่อยู่อีเมล
```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```
### กำลังตรวจสอบ URL
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
### กำลังตรวจสอบวันที่
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
### กำลังตรวจสอบชื่อไฟล์
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
## การจัดการประเภทอินพุตที่แตกต่างกัน

### อินพุตสตริง
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
### การป้อนตัวเลข
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
### อินพุตบูลีน
```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```
### อินพุตอาร์เรย์
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
### เลือก/อินพุตตัวเลือก
```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```
## คำขอวัตถุ (XMF)

เมื่อใช้ XMF คลาส Request จะให้การจัดการอินพุตที่สะอาดยิ่งขึ้น:
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
## การสร้างคลาสการตรวจสอบ

สำหรับรูปแบบที่ซับซ้อน ให้สร้างคลาสการตรวจสอบเฉพาะ:
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
การใช้งาน:
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
## การฆ่าเชื้อสำหรับการจัดเก็บฐานข้อมูล

เมื่อจัดเก็บข้อมูลในฐานข้อมูล:
```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```
## ฆ่าเชื้อเพื่อการแสดงผล

บริบทที่ต่างกันต้องการการหลบหนีที่แตกต่างกัน:
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
## ข้อผิดพลาดทั่วไป

### การเข้ารหัสสองครั้ง

**ปัญหา**: ข้อมูลถูกเข้ารหัสหลายครั้ง
```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```
### การเข้ารหัสไม่สอดคล้องกัน

**ปัญหา**: เอาต์พุตบางตัวมีการเข้ารหัส บางตัวไม่ได้เข้ารหัส

**วิธีแก้ปัญหา**: ใช้แนวทางที่สอดคล้องกันเสมอ โดยควรเข้ารหัสที่เอาต์พุต:
```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```
### ขาดการตรวจสอบ

**ปัญหา**: ฆ่าเชื้อเท่านั้นโดยไม่ผ่านการตรวจสอบ

**วิธีแก้ไข**: ตรวจสอบความถูกต้องก่อนเสมอ จากนั้นจึงฆ่าเชื้อ:
```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```
## สรุปแนวทางปฏิบัติที่ดีที่สุด

1. **ใช้ MyTextSanitizer** สำหรับการประมวลผลเนื้อหาข้อความ
2. **ใช้ filter_var()** สำหรับการตรวจสอบรูปแบบเฉพาะ
3. **ใช้การหล่อประเภท** สำหรับค่าตัวเลข
4. **ค่าที่อนุญาตในไวท์ลิสต์** สำหรับอินพุตที่เลือก
5. **ตรวจสอบก่อนฆ่าเชื้อ**
6. **Escape บนเอาต์พุต** ไม่ใช่ที่อินพุต
7. **ใช้คำสั่งที่เตรียมไว้** สำหรับการสืบค้นฐานข้อมูล
8. **สร้างคลาสการตรวจสอบ** สำหรับแบบฟอร์มที่ซับซ้อน
9. **อย่าเชื่อถือการตรวจสอบฝั่งไคลเอ็นต์** - ตรวจสอบฝั่งเซิร์ฟเวอร์เสมอ

---

#ความปลอดภัย #การฆ่าเชื้อ #การตรวจสอบความถูกต้อง #xoops #MyTextSanitizer #การจัดการอินพุต