---
title: "การตรวจสอบแบบฟอร์ม"
---
## ภาพรวม

XOOPS ให้การตรวจสอบอินพุตแบบฟอร์มทั้งฝั่งไคลเอ็นต์และฝั่งเซิร์ฟเวอร์ คู่มือนี้ครอบคลุมเทคนิคการตรวจสอบ เครื่องมือตรวจสอบในตัว และการใช้งานการตรวจสอบที่กำหนดเอง

## สถาปัตยกรรมการตรวจสอบ
```
mermaid
flowchart TB
    A[Form Submission] --> B{Client-Side Validation}
    B -->|Pass| C[Server Request]
    B -->|Fail| D[Show Client Errors]
    C --> E{Server-Side Validation}
    E -->|Pass| F[Process Data]
    E -->|Fail| G[Return Errors]
    G --> H[Display Server Errors]
```
## การตรวจสอบฝั่งเซิร์ฟเวอร์

### การใช้ XoopsFormValidator
```php
use Xoops\Core\Form\Validator;

$validator = new Validator();

$validator->addRule('username', 'required', 'Username is required');
$validator->addRule('username', 'minLength:3', 'Username must be at least 3 characters');
$validator->addRule('username', 'maxLength:50', 'Username cannot exceed 50 characters');
$validator->addRule('email', 'email', 'Please enter a valid email address');
$validator->addRule('password', 'minLength:8', 'Password must be at least 8 characters');

if (!$validator->validate($_POST)) {
    $errors = $validator->getErrors();
    // Handle errors
}
```
### กฎการตรวจสอบในตัว

| กฎ | คำอธิบาย | ตัวอย่าง |
|------|-------------|---------|
| `required` | ฟิลด์ต้องไม่ว่างเปล่า | `required` |
| `email` | รูปแบบอีเมลที่ถูกต้อง | `email` |
| `url` | รูปแบบ URL ที่ถูกต้อง | `url` |
| `numeric` | ค่าตัวเลขเท่านั้น | `numeric` |
| `integer` | ค่าจำนวนเต็มเท่านั้น | `integer` |
| `minLength` | ความยาวสตริงขั้นต่ำ | `minLength:3` |
| `maxLength` | ความยาวสตริงสูงสุด | `maxLength:100` |
| `min` | ค่าตัวเลขขั้นต่ำ | `min:1` |
| `max` | ค่าตัวเลขสูงสุด | `max:100` |
| `regex` | รูปแบบ regex ที่กำหนดเอง | `regex:/^[a-z]+$/` |
| `in` | ค่าในรายการ | `in:draft,published,archived` |
| `date` | รูปแบบวันที่ที่ถูกต้อง | `date` |
| `alpha` | ตัวอักษรเท่านั้น | `alpha` |
| `alphanumeric` | ตัวอักษรและตัวเลข | `alphanumeric` |

### กฎการตรวจสอบที่กำหนดเอง
```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```
## ขอการตรวจสอบ

### กำลังฆ่าเชื้ออินพุต
```php
use Xoops\Core\Request;

// Get sanitized values
$username = Request::getString('username', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$age = Request::getInt('age', 0, 'POST');
$price = Request::getFloat('price', 0.0, 'POST');
$tags = Request::getArray('tags', [], 'POST');

// With validation
$username = Request::getString('username', '', 'POST', [
    'minLength' => 3,
    'maxLength' => 50
]);
```
### XSS การป้องกัน
```php
use Xoops\Core\Text\Sanitizer;

$sanitizer = Sanitizer::getInstance();

// Sanitize HTML content
$cleanContent = $sanitizer->sanitizeForDisplay($userContent);

// Strip all HTML
$plainText = $sanitizer->stripHtml($userContent);

// Allow specific tags
$content = $sanitizer->sanitizeForDisplay($userContent, [
    'allowedTags' => '<p><br><strong><em><a>'
]);
```
## การตรวจสอบฝั่งไคลเอ็นต์

### HTML5 แอตทริบิวต์การตรวจสอบ
```php
// Required field
$element->setExtra('required');

// Pattern validation
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Length constraints
$element->setExtra('minlength="3" maxlength="50"');

// Numeric constraints
$element->setExtra('min="1" max="100"');
```
### การตรวจสอบ JavaScript
```javascript
document.getElementById('myForm').addEventListener('submit', function(e) {
    const username = document.getElementById('username').value;
    const errors = [];

    if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (errors.length > 0) {
        e.preventDefault();
        displayErrors(errors);
    }
});
```
## CSRF การป้องกัน

### การสร้างโทเค็น
```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```
### การยืนยันโทเค็น
```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```
## การตรวจสอบการอัพโหลดไฟล์
```php
use Xoops\Core\Uploader;

$uploader = new Uploader(
    uploadDir: XOOPS_UPLOAD_PATH . '/images/',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1920,
    maxHeight: 1080
);

if ($uploader->fetchMedia('image_upload')) {
    if ($uploader->upload()) {
        $savedFile = $uploader->getSavedFileName();
    } else {
        $errors[] = $uploader->getErrors();
    }
}
```
## การแสดงข้อผิดพลาด

### กำลังรวบรวมข้อผิดพลาด
```php
$errors = [];

if (empty($username)) {
    $errors['username'] = 'Username is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (!empty($errors)) {
    // Store in session for display after redirect
    $_SESSION['form_errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
}
```
### การแสดงข้อผิดพลาด
```smarty
{if $errors}
<div class="alert alert-danger">
    <ul>
        {foreach $errors as $field => $message}
        <li>{$message}</li>
        {/foreach}
    </ul>
</div>
{/if}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **ตรวจสอบฝั่งเซิร์ฟเวอร์เสมอ** - สามารถข้ามการตรวจสอบฝั่งไคลเอ็นต์ได้
2. **ใช้การสืบค้นแบบกำหนดพารามิเตอร์** - ป้องกันการแทรก SQL
3. **ฆ่าเชื้อเอาต์พุต** - ป้องกันการโจมตี XSS
4. **ตรวจสอบการอัปโหลดไฟล์** - ตรวจสอบประเภทและขนาด MIME
5. **ใช้โทเค็น CSRF** - ป้องกันการปลอมแปลงคำขอข้ามไซต์
6. **การส่งขีดจำกัดอัตรา** - ป้องกันการละเมิด

## เอกสารที่เกี่ยวข้อง

- การอ้างอิงองค์ประกอบของแบบฟอร์ม
- ภาพรวมแบบฟอร์ม
- แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย