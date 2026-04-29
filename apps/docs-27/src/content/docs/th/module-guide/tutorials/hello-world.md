---
title: "สวัสดีโลกโมดูล"
description: "บทช่วยสอนทีละขั้นตอนสำหรับการสร้างโมดูล XOOPS แรกของคุณ"
---
# บทช่วยสอนโมดูล Hello World

บทช่วยสอนนี้จะแนะนำคุณตลอดการสร้างโมดูล XOOPS แรกของคุณ ในตอนท้าย คุณจะมีโมดูลการทำงานที่แสดง "Hello World" ทั้งในส่วนส่วนหน้าและส่วนผู้ดูแลระบบ

## ข้อกำหนดเบื้องต้น

- XOOPS 2.5.x ติดตั้งและใช้งานอยู่
- PHP 8.0 หรือสูงกว่า
- ความรู้พื้นฐาน PHP
- โปรแกรมแก้ไขข้อความหรือ IDE (แนะนำ PhpStorm)

## ขั้นตอนที่ 1: สร้างโครงสร้างไดเรกทอรี

สร้างโครงสร้างไดเร็กทอรีต่อไปนี้ใน `/modules/helloworld/`:
```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```
## ขั้นตอนที่ 2: สร้างคำจำกัดความของโมดูล

สร้าง `xoops_version.php`:
```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```
## ขั้นตอนที่ 3: สร้างไฟล์ภาษา

### modinfo.php (ข้อมูลโมดูล)

สร้าง `language/english/modinfo.php`:
```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```
### main.php (ภาษาส่วนหน้า)

สร้าง `language/english/main.php`:
```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```
### admin.php (ภาษาของผู้ดูแลระบบ)

สร้าง `language/english/admin.php`:
```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```
## ขั้นตอนที่ 4: สร้างดัชนีส่วนหน้า

สร้าง `index.php` ในรูทของโมดูล:
```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```
## ขั้นตอนที่ 5: สร้างเทมเพลตส่วนหน้า

สร้าง `templates/helloworld_index.tpl`:
```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```
## ขั้นตอนที่ 6: สร้างไฟล์ผู้ดูแลระบบ

### ส่วนหัวของผู้ดูแลระบบ

สร้าง `admin/admin_header.php`:
```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```
### ส่วนท้ายของผู้ดูแลระบบ

สร้าง `admin/admin_footer.php`:
```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```
### เมนูผู้ดูแลระบบ

สร้าง `admin/menu.php`:
```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```
### หน้าดัชนีผู้ดูแลระบบ

สร้าง `admin/index.php`:
```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```
## ขั้นตอนที่ 7: สร้างเทมเพลตผู้ดูแลระบบ

สร้าง `templates/admin/helloworld_admin_index.tpl`:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## ขั้นตอนที่ 8: สร้างโลโก้โมดูล

สร้างหรือคัดลอกรูปภาพ PNG (ขนาดที่แนะนำ: 92x92 พิกเซล) ไปที่:
`assets/images/logo.png`

คุณสามารถใช้โปรแกรมแก้ไขรูปภาพเพื่อสร้างโลโก้แบบง่ายๆ หรือใช้ตัวยึดตำแหน่งจากไซต์เช่น placeholder.com

## ขั้นตอนที่ 9: ติดตั้งโมดูล

1. เข้าสู่ระบบไซต์ XOOPS ของคุณในฐานะผู้ดูแลระบบ
2. ไปที่ **ผู้ดูแลระบบ** > **โมดูล**
3. ค้นหา "Hello World" ในรายการโมดูลที่มี
4. คลิกปุ่ม **ติดตั้ง**
5. ยืนยันการติดตั้ง

## ขั้นตอนที่ 10: ทดสอบโมดูลของคุณ

### การทดสอบส่วนหน้า

1. ไปที่ไซต์ XOOPS ของคุณ
2. คลิกที่ "Hello World" ในเมนูหลัก
3. คุณควรเห็นข้อความต้อนรับและเวลาปัจจุบัน

### การทดสอบผู้ดูแลระบบ

1. ไปที่พื้นที่ผู้ดูแลระบบ
2. คลิกที่ "Hello World" ในเมนูผู้ดูแลระบบ
3. คุณควรเห็นแดชบอร์ดผู้ดูแลระบบ

## การแก้ไขปัญหา

### โมดูลไม่ปรากฏในรายการการติดตั้ง

- ตรวจสอบการอนุญาตไฟล์ (755 สำหรับไดเร็กทอรี, 644 สำหรับไฟล์)
- ตรวจสอบว่า `xoops_version.php` ไม่มีข้อผิดพลาดทางไวยากรณ์
- ล้างแคช XOOPS

### เทมเพลตไม่โหลด

- ตรวจสอบให้แน่ใจว่าไฟล์เทมเพลตอยู่ในไดเร็กทอรีที่ถูกต้อง
- ตรวจสอบชื่อไฟล์เทมเพลตให้ตรงกับที่อยู่ใน `xoops_version.php`
- ตรวจสอบว่าไวยากรณ์ Smarty ถูกต้อง

### สตริงภาษาไม่แสดง

- ตรวจสอบเส้นทางไฟล์ภาษา
- ตรวจสอบให้แน่ใจว่าได้กำหนดค่าคงที่ของภาษาแล้ว
- ตรวจสอบว่ามีโฟลเดอร์ภาษาที่ถูกต้อง

## ขั้นตอนต่อไป

เมื่อคุณมีโมดูลการทำงานแล้ว ให้เรียนรู้ต่อด้วย:

- การสร้าง-a-CRUD-Module - เพิ่มฟังก์ชันการทำงานของฐานข้อมูล
- ../Patterns/MVC-Pattern - จัดระเบียบโค้ดของคุณอย่างเหมาะสม
- ../Best-Practices/Testing - เพิ่มการทดสอบ PHPUnit

## การอ้างอิงไฟล์ที่สมบูรณ์

โมดูลที่เสร็จสมบูรณ์ของคุณควรมีไฟล์เหล่านี้:
```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```
## สรุป

ขอแสดงความยินดี! คุณได้สร้างโมดูล XOOPS แรกของคุณแล้ว แนวคิดหลักครอบคลุม:

1. **โครงสร้างโมดูล** - รูปแบบไดเร็กทอรีโมดูล XOOPS มาตรฐาน
2. **xoops_version.php** - คำจำกัดความและการกำหนดค่าโมดูล
3. **ไฟล์ภาษา** - รองรับการทำให้เป็นสากล
4. **เทมเพลต** - การรวมเทมเพลตอันชาญฉลาด
5. **อินเทอร์เฟซผู้ดูแลระบบ** - แผงผู้ดูแลระบบขั้นพื้นฐาน

ดูเพิ่มเติม: ../โมดูล-การพัฒนา | การสร้าง-CRUD-โมดูล | ../รูปแบบ/MVC-รูปแบบ