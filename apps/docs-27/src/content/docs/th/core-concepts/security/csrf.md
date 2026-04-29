---
title: "CSRF การป้องกัน"
description: "ทำความเข้าใจและใช้งานการป้องกัน CSRF ใน XOOPS โดยใช้คลาส XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

การโจมตีการปลอมแปลงคำขอข้ามไซต์ (CSRF) หลอกผู้ใช้ให้ดำเนินการที่ไม่พึงประสงค์บนไซต์ที่ได้รับการตรวจสอบสิทธิ์ XOOPS มีการป้องกัน CSRF ในตัวผ่านคลาส `XoopsSecurity`

## เอกสารที่เกี่ยวข้อง

- แนวปฏิบัติด้านความปลอดภัยที่ดีที่สุด - คู่มือความปลอดภัยที่ครอบคลุม
- การฆ่าเชื้ออินพุต - MyTextSanitizer และการตรวจสอบ
- SQL-การป้องกันการฉีด - แนวปฏิบัติด้านความปลอดภัยของฐานข้อมูล

## ทำความเข้าใจการโจมตี CSRF

การโจมตี CSRF เกิดขึ้นเมื่อ:

1. ผู้ใช้ได้รับการรับรองความถูกต้องบนไซต์ XOOPS ของคุณ
2. ผู้ใช้เยี่ยมชมเว็บไซต์ที่เป็นอันตราย
3. ไซต์ที่เป็นอันตรายส่งคำขอไปยังไซต์ XOOPS ของคุณโดยใช้เซสชันของผู้ใช้
4. ไซต์ของคุณประมวลผลคำขอราวกับว่ามาจากผู้ใช้ที่ถูกต้องตามกฎหมาย

## คลาส XoopsSecurity

XOOPS มีคลาส `XoopsSecurity` เพื่อป้องกันการโจมตี CSRF คลาสนี้จัดการโทเค็นความปลอดภัยที่ต้องรวมอยู่ในแบบฟอร์มและตรวจสอบเมื่อประมวลผลคำขอ

### การสร้างโทเค็น

คลาสความปลอดภัยสร้างโทเค็นเฉพาะที่จัดเก็บไว้ในเซสชันของผู้ใช้และต้องรวมอยู่ในแบบฟอร์ม:
```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### การยืนยันโทเค็น

เมื่อประมวลผลการส่งแบบฟอร์ม ให้ตรวจสอบว่าโทเค็นถูกต้อง:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## การใช้ระบบโทเค็น XOOPS

### ด้วยคลาส XoopsForm

เมื่อใช้คลาสแบบฟอร์ม XOOPS การป้องกันโทเค็นจะตรงไปตรงมา:
```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```
### ด้วยแบบฟอร์มที่กำหนดเอง

สำหรับแบบฟอร์ม HTML แบบกำหนดเองที่ไม่ได้ใช้ XoopsForm:
```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```
### ในเทมเพลต Smarty

เมื่อสร้างแบบฟอร์มในเทมเพลต Smarty:
```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```
## กำลังดำเนินการส่งแบบฟอร์ม

### การตรวจสอบโทเค็นพื้นฐาน
```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```
### พร้อมการจัดการข้อผิดพลาดแบบกำหนดเอง
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```
### สำหรับคำขอ AJAX

เมื่อทำงานกับคำขอ AJAX ให้รวมโทเค็นในคำขอของคุณ:
```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```
## กำลังตรวจสอบ HTTP ผู้อ้างอิง

สำหรับการป้องกันเพิ่มเติม โดยเฉพาะอย่างยิ่งสำหรับคำขอ AJAX คุณสามารถตรวจสอบผู้อ้างอิง HTTP ได้:
```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
### รวมการตรวจสอบความปลอดภัย
```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## การกำหนดค่าโทเค็น

### อายุการใช้งานโทเค็น

โทเค็นมีอายุการใช้งานที่จำกัดเพื่อป้องกันการโจมตีซ้ำ คุณสามารถกำหนดค่านี้ได้ในการตั้งค่า XOOPS หรือจัดการโทเค็นที่หมดอายุอย่างสวยงาม:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### หลายแบบฟอร์มในหน้าเดียวกัน

เมื่อคุณมีหลายแบบฟอร์มในหน้าเดียวกัน แต่ละแบบฟอร์มควรมีโทเค็นของตัวเอง:
```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## แนวทางปฏิบัติที่ดีที่สุด

### ใช้โทเค็นสำหรับการดำเนินการเปลี่ยนแปลงสถานะเสมอ

รวมโทเค็นในรูปแบบใด ๆ ที่:

- สร้างข้อมูล
- อัปเดตข้อมูล
- ลบข้อมูล
- เปลี่ยนการตั้งค่าผู้ใช้
- ดำเนินการด้านการบริหารใด ๆ

### อย่าพึ่งพาการตรวจสอบผู้อ้างอิงแต่เพียงผู้เดียว

ส่วนหัวผู้อ้างอิง HTTP สามารถเป็น:

- ปล้นโดยเครื่องมือความเป็นส่วนตัว
- หายไปในเบราว์เซอร์บางตัว
- มีการปลอมแปลงในบางกรณี

ใช้การยืนยันโทเค็นเป็นการป้องกันหลักของคุณเสมอ

### สร้างโทเค็นใหม่อย่างเหมาะสม

พิจารณาสร้างโทเค็นใหม่:

- หลังจากส่งแบบฟอร์มสำเร็จ
- หลังจากเข้าสู่ระบบ/ออกจากระบบ
- เป็นระยะๆ เป็นระยะเวลานาน

### จัดการการหมดอายุของโทเค็นอย่างสง่างาม
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```
## ปัญหาทั่วไปและแนวทางแก้ไข

### ไม่พบโทเค็นผิดพลาด

**ปัญหา**: การตรวจสอบความปลอดภัยล้มเหลวด้วย "ไม่พบโทเค็น"

**วิธีแก้ไข**: ตรวจสอบให้แน่ใจว่าได้รวมฟิลด์โทเค็นไว้ในแบบฟอร์มของคุณแล้ว:
```php
$form->addElement(new XoopsFormHiddenToken());
```
### ข้อผิดพลาดโทเค็นหมดอายุ

**ปัญหา**: ผู้ใช้เห็น "โทเค็นหมดอายุ" หลังจากกรอกแบบฟอร์มเป็นเวลานาน

**วิธีแก้ไข**: ลองใช้ JavaScript เพื่อรีเฟรชโทเค็นเป็นระยะ:
```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```
### AJAX ปัญหาโทเค็น

**ปัญหา**: คำขอ AJAX ไม่ผ่านการตรวจสอบโทเค็น

**วิธีแก้ปัญหา**: ตรวจสอบให้แน่ใจว่าโทเค็นถูกส่งผ่านทุกคำขอ AJAX และยืนยันฝั่งเซิร์ฟเวอร์:
```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```
## ตัวอย่าง: การกรอกแบบฟอร์มให้สมบูรณ์
```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```
---

#ความปลอดภัย #csrf #xoops #forms #tokens #XoopsSecurity