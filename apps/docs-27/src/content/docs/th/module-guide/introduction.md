---
title: "การพัฒนาโมดูล"
description: "คู่มือที่ครอบคลุมในการพัฒนาโมดูล XOOPS โดยใช้แนวทางปฏิบัติ PHP สมัยใหม่"
---
ส่วนนี้ให้เอกสารประกอบที่ครอบคลุมสำหรับการพัฒนาโมดูล XOOPS โดยใช้แนวทางปฏิบัติ PHP สมัยใหม่ รูปแบบการออกแบบ และแนวทางปฏิบัติที่ดีที่สุด

## ภาพรวม

XOOPS การพัฒนาโมดูลมีการพัฒนาอย่างมากในช่วงหลายปีที่ผ่านมา โมดูลสมัยใหม่ใช้ประโยชน์จาก:

- **MVC Architecture** - การแยกข้อกังวลอย่างชัดเจน
- **PHP 8.x คุณสมบัติ** - การประกาศประเภท คุณลักษณะ อาร์กิวเมนต์ที่มีชื่อ
- **รูปแบบการออกแบบ** - พื้นที่เก็บข้อมูล DTO รูปแบบเลเยอร์บริการ
- **การทดสอบ** - PHPUnit พร้อมแนวทางการทดสอบที่ทันสมัย
- **XMF Framework** - XOOPS ยูทิลิตี้ Module Framework

## โครงสร้างเอกสาร

### บทช่วยสอน

คำแนะนำทีละขั้นตอนสำหรับการสร้างโมดูล XOOPS ตั้งแต่เริ่มต้น

- บทช่วยสอน/Hello-World-Module - โมดูล XOOPS แรกของคุณ
- บทช่วยสอน/การสร้าง-a-CRUD-โมดูล - สร้าง อ่าน อัปเดต ลบฟังก์ชันการทำงานให้เสร็จสมบูรณ์

### รูปแบบการออกแบบ

รูปแบบสถาปัตยกรรมที่ใช้ในการพัฒนาโมดูล XOOPS สมัยใหม่

- รูปแบบ/MVC-รูปแบบ - สถาปัตยกรรม Model-View-Controller
- รูปแบบ/พื้นที่เก็บข้อมูล-รูปแบบ - นามธรรมการเข้าถึงข้อมูล
- รูปแบบ/DTO-รูปแบบ - ออบเจ็กต์การถ่ายโอนข้อมูลเพื่อการไหลของข้อมูลที่สะอาด

### แนวทางปฏิบัติที่ดีที่สุด

แนวทางการเขียนโค้ดคุณภาพสูงที่สามารถดูแลรักษาได้

- แนวปฏิบัติที่ดีที่สุด/Clean-Code - หลักการของ Clean Code สำหรับ XOOPS
- แนวทางปฏิบัติที่ดีที่สุด/กลิ่นโค้ด - รูปแบบการต่อต้านที่พบบ่อยและวิธีแก้ไข
- แนวทางปฏิบัติที่ดีที่สุด/การทดสอบ - กลยุทธ์การทดสอบ PHPUnit

### ตัวอย่าง

ตัวอย่างการวิเคราะห์และการใช้งานโมดูลในโลกแห่งความเป็นจริง

- ผู้เผยแพร่-โมดูล-การวิเคราะห์ - เจาะลึกโมดูลผู้เผยแพร่

## โครงสร้างไดเรกทอรีโมดูล

โมดูล XOOPS ที่มีการจัดระเบียบอย่างดีเป็นไปตามโครงสร้างไดเร็กทอรีนี้:
```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```
## อธิบายไฟล์สำคัญแล้ว

### xoops_version.php

ไฟล์คำจำกัดความของโมดูลที่บอก XOOPS เกี่ยวกับโมดูลของคุณ:
```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```
### ไฟล์รวมทั่วไป

สร้างไฟล์บูตสแตรปทั่วไปสำหรับโมดูลของคุณ:
```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```
## PHP ข้อกำหนดเวอร์ชัน

โมดูล XOOPS สมัยใหม่ควรกำหนดเป้าหมาย PHP 8.0 หรือสูงกว่าเพื่อใช้ประโยชน์:

- **การส่งเสริมทรัพย์สินผู้รับเหมา**
- **อาร์กิวเมนต์ที่มีชื่อ**
- **ประเภทสหภาพ**
- **จับคู่นิพจน์**
- **คุณสมบัติ**
- **ตัวดำเนินการ Nullsafe**

## เริ่มต้นใช้งาน

1. เริ่มต้นด้วยบทช่วยสอน/บทช่วยสอน Hello-World-Module
2. ความคืบหน้าสู่บทช่วยสอน/การสร้าง-a-CRUD-โมดูล
3. ศึกษารูปแบบ/MVC-รูปแบบเพื่อเป็นแนวทางด้านสถาปัตยกรรม
4. ใช้แนวทางปฏิบัติที่ดีที่สุด/แนวทางปฏิบัติที่สะอาดตลอด
5. นำแนวทางปฏิบัติที่ดีที่สุด/การทดสอบไปใช้ตั้งแต่ต้น

## แหล่งข้อมูลที่เกี่ยวข้อง

- ../05-XMF-Framework/XMF-Framework - XOOPS อรรถประโยชน์กรอบงานโมดูล
- การดำเนินงานฐานข้อมูล - การทำงานกับฐานข้อมูล XOOPS
- ../04-API-อ้างอิง/เทมเพลต/เทมเพลต-ระบบ - เทมเพลตที่ชาญฉลาดใน XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - การรักษาความปลอดภัยโมดูลของคุณ

## ประวัติเวอร์ชัน

| เวอร์ชั่น | วันที่ | การเปลี่ยนแปลง |
|---------|-|---------|
| 1.0 | 2025-01-28 | เอกสารเบื้องต้น |