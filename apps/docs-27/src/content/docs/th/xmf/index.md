---
title: "XMF กรอบงาน"
description: "XOOPS Module Framework - ไลบรารีที่ครอบคลุมสำหรับการพัฒนาโมดูล XOOPS สมัยใหม่"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[สะพานสู่ความทันสมัย XOOPS]
XMF ทำงานใน **ทั้ง XOOPS 2.5.x และ XOOPS 4.0.x** นี่เป็นวิธีที่แนะนำในการปรับปรุงโมดูลของคุณให้ทันสมัยตั้งแต่วันนี้ขณะเตรียมพร้อมสำหรับ XOOPS 4.0 XMF มี PSR-4 การโหลดอัตโนมัติ เนมสเปซ และผู้ช่วยเหลือที่ทำให้การเปลี่ยนแปลงราบรื่น
::::::

**XOOPS Module Framework (XMF)** เป็นไลบรารีที่มีประสิทธิภาพซึ่งได้รับการออกแบบมาเพื่อทำให้การพัฒนาโมดูล XOOPS ง่ายขึ้นและเป็นมาตรฐาน XMF มีแนวทางปฏิบัติ PHP ที่ทันสมัย ​​รวมถึงเนมสเปซ การโหลดอัตโนมัติ และชุดคลาสตัวช่วยที่ครอบคลุม ซึ่งจะลดโค้ดสำเร็จรูปและปรับปรุงการบำรุงรักษา

## XMF คืออะไร?

XMF คือชุดของคลาสและยูทิลิตี้ที่ให้:

- **การสนับสนุน PHP สมัยใหม่** - การสนับสนุนเนมสเปซเต็มรูปแบบพร้อมการโหลดอัตโนมัติ PSR-4
- **การจัดการคำขอ** - การตรวจสอบอินพุตและการฆ่าเชื้อที่ปลอดภัย
- **ตัวช่วยโมดูล** - เข้าถึงการกำหนดค่าและอ็อบเจ็กต์ของโมดูลได้ง่ายขึ้น
- **ระบบการอนุญาต** - การจัดการการอนุญาตที่ใช้งานง่าย
- **ยูทิลิตี้ฐานข้อมูล** - เครื่องมือการย้ายสคีมาและการจัดการตาราง
- **JWT Support** - JSON การใช้โทเค็นเว็บเพื่อการรับรองความถูกต้องที่ปลอดภัย
- **การสร้างข้อมูลเมตา** - SEO และยูทิลิตี้การแยกเนื้อหา
- **อินเทอร์เฟซผู้ดูแลระบบ** - หน้าการดูแลระบบโมดูลที่ได้มาตรฐาน

### XMF ภาพรวมส่วนประกอบ
```
mermaid
graph TB
    subgraph XMF["XMF Framework"]
        direction TB
        subgraph Core["Core Components"]
            Request["🔒 Request<br/>Input Handling"]
            Module["📦 Module Helper<br/>Config & Handlers"]
            Perm["🔑 Permission<br/>Access Control"]
        end

        subgraph Utils["Utilities"]
            DB["🗄️ Database<br/>Schema Tools"]
            JWT["🎫 JWT<br/>Token Auth"]
            Meta["📊 Metagen<br/>SEO Utils"]
        end

        subgraph Admin["Admin Tools"]
            AdminUI["🎨 Admin UI<br/>Standardized Pages"]
            Icons["🖼️ Icons<br/>Font Awesome"]
        end
    end

    subgraph Module["Your Module"]
        Controller["Controller"]
        Handler["Handler"]
        Template["Template"]
    end

    Controller --> Request
    Controller --> Module
    Controller --> Perm
    Handler --> DB
    Template --> AdminUI

    style XMF fill:#e3f2fd,stroke:#1976d2
    style Core fill:#e8f5e9,stroke:#388e3c
    style Utils fill:#fff3e0,stroke:#f57c00
    style Admin fill:#fce4ec,stroke:#c2185b
```
## คุณสมบัติที่สำคัญ

### เนมสเปซและการโหลดอัตโนมัติ

คลาส XMF ทั้งหมดอยู่ในเนมสเปซ `Xmf` คลาสจะถูกโหลดโดยอัตโนมัติเมื่อมีการอ้างอิง - ไม่จำเป็นต้องรวมคู่มือ
```php
use Xmf\Request;
use Xmf\Module\Helper;

// Classes load automatically when used
$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
```
### การจัดการคำขอที่ปลอดภัย

[คลาสคำขอ](../05-XMF-Framework/Basics/XMF-Request.md) ให้การเข้าถึงข้อมูลคำขอ HTTP แบบปลอดภัย ด้วยการฆ่าเชื้อในตัว:
```
mermaid
flowchart LR
    subgraph Input["Raw Input"]
        GET["$_GET"]
        POST["$_POST"]
        REQUEST["$_REQUEST"]
    end

    subgraph XMF["Xmf\\Request"]
        Validate["Type Validation"]
        Sanitize["Sanitization"]
        Default["Default Values"]
    end

    subgraph Output["Safe Output"]
        Int["getInt()"]
        Str["getString()"]
        Email["getEmail()"]
        Bool["getBool()"]
    end

    GET --> XMF
    POST --> XMF
    REQUEST --> XMF
    XMF --> Int
    XMF --> Str
    XMF --> Email
    XMF --> Bool

    style Input fill:#ffcdd2,stroke:#c62828
    style XMF fill:#fff3e0,stroke:#f57c00
    style Output fill:#c8e6c9,stroke:#2e7d32
```

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$name = Request::getString('name', '');
$email = Request::getEmail('email', '');
```
### ระบบตัวช่วยโมดูล

[ตัวช่วยโมดูล](../05-XMF-Framework/Basics/XMF-Module-Helper.md) ช่วยให้เข้าถึงฟังก์ชันที่เกี่ยวข้องกับโมดูลได้อย่างสะดวก:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// Access module configuration
$configValue = $helper->getConfig('setting_name', 'default');

// Get module object
$module = $helper->getModule();

// Access handlers
$handler = $helper->getHandler('items');
```
### การจัดการสิทธิ์

[Permission-Helper](../05-XMF-Framework/Recipes/Permission-Helper.md) ช่วยให้การจัดการสิทธิ์ XOOPS ง่ายขึ้น:
```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Check user permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}
```
## โครงสร้างเอกสาร

### พื้นฐาน

- [เริ่มต้นใช้งาน-XMF](../05-XMF-Framework/Basics/Getting-Started-with-XMF.md¤) - การติดตั้งและการใช้งานพื้นฐาน
- [XMF-คำขอ](../05-XMF-Framework/Basics/XMF-Request.md¤) - การจัดการคำขอและการตรวจสอบอินพุต
- [XMF-Module-Helper](../05-XMF-Framework/Basics/XMF-Module-Helper.md¤) - การใช้คลาสตัวช่วยโมดูล

### สูตรอาหาร

- [ผู้ช่วยอนุญาต](../05-XMF-Framework/Recipes/Permission-Helper.md) - การทำงานด้วยการอนุญาต
- [โมดูล-ผู้ดูแลระบบ-หน้า](../05-XMF-Framework/Recipes/Module-Admin-Pages.md) - การสร้างอินเทอร์เฟซผู้ดูแลระบบมาตรฐาน

### อ้างอิง

- [JWT](../05-XMF-Framework/Reference/JWT.md) - JSON การใช้งานโทเค็นเว็บ
- [ฐานข้อมูล](../05-XMF-Framework/Reference/Database.md) - ยูทิลิตี้ฐานข้อมูลและการจัดการสคีมา
- [Metagen](Reference/Metagen.md) - ข้อมูลเมตาและยูทิลิตี้ SEO

## ข้อกำหนด

- XOOPS 2.5.8 หรือใหม่กว่า
- PHP 7.2 หรือใหม่กว่า (PHP 8.x แนะนำ)

## การติดตั้ง

XMF รวมอยู่ใน XOOPS 2.5.8 และเวอร์ชันที่ใหม่กว่า สำหรับเวอร์ชันก่อนหน้าหรือการติดตั้งด้วยตนเอง:

1. ดาวน์โหลดแพ็คเกจ XMF จากที่เก็บ XOOPS
2. แยกไปยังไดเร็กทอรี XOOPS `/class/xmf/` ของคุณ
3. ตัวโหลดอัตโนมัติจะจัดการการโหลดคลาสโดยอัตโนมัติ

## ตัวอย่างการเริ่มต้นอย่างรวดเร็ว

นี่คือตัวอย่างที่สมบูรณ์ที่แสดงรูปแบบการใช้งาน XMF ทั่วไป:
```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

// Get module helper
$helper = Helper::getHelper('mymodule');

// Get configuration values
$itemsPerPage = $helper->getConfig('items_per_page', 10);

// Handle request input
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Check permissions
$permHelper = new Permission();
if (!$permHelper->checkPermission('view', $id)) {
    redirect_header('index.php', 3, 'Access denied');
}

// Process based on operation
switch ($op) {
    case 'view':
        $handler = $helper->getHandler('items');
        $item = $handler->get($id);
        // ... display item
        break;
    case 'list':
    default:
        // ... list items
        break;
}
```
## แหล่งข้อมูล

- [XMF พื้นที่เก็บข้อมูล GitHub](https://github.com/XOOPS/XMF)
- [XOOPS เว็บไซต์โครงการ](https://xoops.org)

---

#xmf #xoops #framework #php #การพัฒนาโมดูล