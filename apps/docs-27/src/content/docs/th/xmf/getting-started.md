---
title: "เริ่มต้นใช้งาน XMF"
description: "การติดตั้ง แนวคิดพื้นฐาน และขั้นตอนแรกด้วย XOOPS Module Framework"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

คู่มือนี้ครอบคลุมแนวคิดพื้นฐานของ XOOPS Module Framework (XMF) และวิธีการเริ่มใช้งานในโมดูลของคุณ

## ข้อกำหนดเบื้องต้น

- XOOPS 2.5.8 หรือใหม่กว่าที่ติดตั้ง
- PHP 7.2 หรือใหม่กว่า
- ความเข้าใจพื้นฐานเกี่ยวกับการเขียนโปรแกรมเชิงวัตถุ PHP

## ทำความเข้าใจกับเนมสเปซ

XMF ใช้ PHP เนมสเปซ เพื่อจัดระเบียบคลาสและหลีกเลี่ยงความขัดแย้งในการตั้งชื่อ คลาส XMF ทั้งหมดอยู่ในเนมสเปซ `Xmf`

### ปัญหาอวกาศโลก

หากไม่มีเนมสเปซ คลาส PHP ทั้งหมดจะใช้พื้นที่ร่วมกัน สิ่งนี้อาจทำให้เกิดความขัดแย้ง:
```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```
### โซลูชันเนมสเปซ

เนมสเปซสร้างบริบทการตั้งชื่อแบบแยก:
```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```
### การใช้ XMF เนมสเปซ

คุณสามารถอ้างอิงคลาส XMF ได้หลายวิธี:

**เส้นทางเนมสเปซแบบเต็ม:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```
**พร้อมข้อความการใช้งาน:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```
**นำเข้าหลายรายการ:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```
## โหลดอัตโนมัติ

สิ่งอำนวยความสะดวกที่ยิ่งใหญ่ที่สุดของ XMF คือการโหลดคลาสอัตโนมัติ คุณไม่จำเป็นต้องรวมไฟล์คลาส XMF ด้วยตนเอง

### กำลังโหลดแบบดั้งเดิม XOOPS

วิธีเก่าต้องการการโหลดที่ชัดเจน:
```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```
### XMF กำลังโหลดอัตโนมัติ

ด้วย XMF คลาสจะโหลดโดยอัตโนมัติเมื่อมีการอ้างอิง:
```php
$input = Xmf\Request::getString('input', '');
```
หรือด้วยคำสั่ง use:
```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```
ตัวโหลดอัตโนมัติเป็นไปตามมาตรฐาน [PSR-4](http://www.php-fig.org/psr/psr-4/) และยังจัดการการขึ้นต่อกันที่ XMF พึ่งพาด้วย

## ตัวอย่างการใช้งานพื้นฐาน

### อินพุตคำขอการอ่าน
```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```
### การใช้ตัวช่วยโมดูล
```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```
### เส้นทางและ URL ผู้ช่วยเหลือ
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```
## การดีบักด้วย XMF

XMF มีเครื่องมือแก้ไขข้อบกพร่องที่เป็นประโยชน์:
```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```
เอาต์พุตการแก้ไขข้อบกพร่องสามารถยุบได้ และแสดงออบเจ็กต์และอาร์เรย์ในรูปแบบที่อ่านง่าย

## ข้อเสนอแนะโครงสร้างโครงการ

เมื่อสร้างโมดูลที่ใช้ XMF ให้จัดระเบียบโค้ดของคุณ:
```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```
## รูปแบบการรวมทั่วไป

จุดเข้าโมดูลทั่วไป:
```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```
## ขั้นตอนต่อไป

เมื่อคุณเข้าใจพื้นฐานแล้ว ให้สำรวจ:

- XMF-คำขอ - เอกสารการจัดการคำขอโดยละเอียด
- XMF-Module-Helper - การอ้างอิงตัวช่วยโมดูลที่สมบูรณ์
- ../Recipes/Permission-Helper - การจัดการสิทธิ์ของผู้ใช้
- ../Recipes/Module-Admin-Pages - สร้างอินเทอร์เฟซผู้ดูแลระบบ

## ดูเพิ่มเติม

- ../XMF-Framework - ภาพรวมของเฟรมเวิร์ก
- ../อ้างอิง/JWT - JSON รองรับโทเค็นเว็บ
- ../อ้างอิง/ฐานข้อมูล - ยูทิลิตี้ฐานข้อมูล

---

#xmf #เริ่มต้นใช้งาน #namespaces #การโหลดอัตโนมัติ #พื้นฐาน