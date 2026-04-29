---
title: "XOOPS API ข้อมูลอ้างอิง"
description: "เอกสาร API ที่ครอบคลุมสำหรับ XOOPS CMS คลาสหลัก เลเยอร์ฐานข้อมูล แบบฟอร์ม และโมดูล"
---
ยินดีต้อนรับสู่เอกสารอ้างอิง XOOPS API ที่ครอบคลุม ส่วนนี้ให้เอกสารประกอบโดยละเอียดสำหรับคลาสหลัก วิธีการ และระบบทั้งหมดที่ประกอบขึ้นเป็น XOOPS Content Management System

## ภาพรวม

XOOPS API ได้รับการจัดระเบียบเป็นระบบย่อยหลักหลายระบบ โดยแต่ละระบบจะรับผิดชอบในด้านเฉพาะของฟังก์ชัน CMS การทำความเข้าใจ API เหล่านี้ถือเป็นสิ่งสำคัญสำหรับการพัฒนาโมดูล ธีม และส่วนขยายสำหรับ XOOPS

## API ส่วนต่างๆ

### คลาสหลัก

คลาสพื้นฐานที่ส่วนประกอบ XOOPS อื่นๆ ทั้งหมดสร้างขึ้น

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| XoopsObject | คลาสฐานสำหรับวัตถุข้อมูลทั้งหมดใน XOOPS |
| XoopsObjectHandler | รูปแบบตัวจัดการสำหรับการดำเนินงาน CRUD |

### ชั้นฐานข้อมูล

นามธรรมฐานข้อมูลและยูทิลิตี้การสร้างแบบสอบถาม

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| Xoopsฐานข้อมูล | เลเยอร์นามธรรมของฐานข้อมูล |
| ระบบเกณฑ์ | เกณฑ์และเงื่อนไขการสืบค้น |
| QueryBuilder | การสร้างแบบสอบถามที่ทันสมัยอย่างคล่องแคล่ว |

### ระบบแบบฟอร์ม

HTML การสร้างแบบฟอร์มและการตรวจสอบ

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| XoopsForm | สร้างคอนเทนเนอร์และการเรนเดอร์ |
| องค์ประกอบของแบบฟอร์ม | ประเภทองค์ประกอบแบบฟอร์มที่มีอยู่ทั้งหมด |

### คลาสเคอร์เนล

ส่วนประกอบและบริการของระบบหลัก

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| คลาสเคอร์เนล | เคอร์เนลของระบบและส่วนประกอบหลัก |

### ระบบโมดูล

การจัดการโมดูลและวงจรชีวิต

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| ระบบโมดูล | การโหลดโมดูล การติดตั้ง และการจัดการ |

### ระบบเทมเพลต

การรวมเทมเพลตอันชาญฉลาด

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| ระบบเทมเพลต | การบูรณาการอย่างชาญฉลาดและการจัดการเทมเพลต |

### ระบบผู้ใช้

การจัดการผู้ใช้และการรับรองความถูกต้อง

| เอกสารประกอบ | คำอธิบาย |
|--------------|-------------|
| ระบบผู้ใช้ | บัญชีผู้ใช้ กลุ่ม และการอนุญาต |

## ภาพรวมสถาปัตยกรรม
```
mermaid
flowchart TB
    subgraph "Foundation Layer"
        XO[XoopsObject<br/>Base Class]
        XD[XoopsDatabase<br/>DB Abstraction]
        XF[XoopsForm<br/>Form Generation]
    end

    subgraph "Handler Layer"
        XOH[XoopsObjectHandler<br/>CRUD Operations]
        CR[Criteria<br/>Query Building]
        XFE[XoopsFormElement<br/>Input Types]
    end

    subgraph "Module Layer"
        XM[XoopsModule<br/>Module Management]
    end

    subgraph "Presentation Layer"
        XT[XoopsTpl<br/>Template Engine]
    end

    XO --> XOH
    XD --> CR
    XF --> XFE
    XOH --> XM
    CR --> XM
    XFE --> XM
    XM --> XT
```
## ลำดับชั้นของชั้นเรียน

### โมเดลวัตถุ
```
mermaid
classDiagram
    class XoopsObject {
        <<Base>>
        +getVar()
        +setVar()
        +toArray()
    }
    XoopsObject <|-- XoopsUser
    XoopsObject <|-- XoopsGroup
    XoopsObject <|-- XoopsModule
    XoopsObject <|-- XoopsBlock
    XoopsObject <|-- XoopsComment
    XoopsObject <|-- XoopsNotification
```
### โมเดลแฮนด์เลอร์
```
mermaid
classDiagram
    class XoopsObjectHandler {
        <<Base>>
        +create()
        +get()
        +insert()
        +delete()
    }
    class XoopsPersistableObjectHandler {
        +getObjects()
        +getCount()
        +deleteAll()
    }
    XoopsObjectHandler <|-- XoopsPersistableObjectHandler
    XoopsPersistableObjectHandler <|-- XoopsUserHandler
    XoopsPersistableObjectHandler <|-- XoopsGroupHandler
    XoopsPersistableObjectHandler <|-- XoopsModuleHandler
    XoopsPersistableObjectHandler <|-- XoopsBlockHandler
    XoopsObjectHandler <|-- CustomModuleHandlers
```
### ฟอร์มโมเดล
```
mermaid
classDiagram
    class XoopsForm {
        <<Base>>
        +addElement()
        +render()
        +display()
    }
    XoopsForm <|-- XoopsThemeForm
    XoopsForm <|-- XoopsSimpleForm

    class XoopsFormElement {
        <<Base>>
        +getName()
        +render()
        +getValue()
    }
    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormEditor
```
## รูปแบบการออกแบบ

XOOPS API นำรูปแบบการออกแบบที่มีชื่อเสียงหลายรูปแบบไปใช้:

### ลายซิงเกิลตัน
ใช้สำหรับบริการระดับโลก เช่น การเชื่อมต่อฐานข้อมูลและอินสแตนซ์คอนเทนเนอร์
```php
$db = XoopsDatabase::getInstance();
$container = XoopsContainer::getInstance();
```
### ลายโรงงาน
ตัวจัดการวัตถุสร้างวัตถุโดเมนอย่างสม่ำเสมอ
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
```
### รูปแบบคอมโพสิต
แบบฟอร์มประกอบด้วยองค์ประกอบแบบฟอร์มหลายรายการ เกณฑ์สามารถมีเกณฑ์ที่ซ้อนกันได้
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new CriteriaCompo(...)); // Nested
```
### รูปแบบผู้สังเกตการณ์
ระบบเหตุการณ์ช่วยให้การเชื่อมต่อระหว่างโมดูลหลวม
```php
$dispatcher->addListener('module.news.article_published', $callback);
```
## ตัวอย่างการเริ่มต้นอย่างรวดเร็ว

### การสร้างและบันทึกวัตถุ
```php
// Get the handler
$handler = xoops_getHandler('user');

// Create a new object
$user = $handler->create();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'user@example.com');

// Save to database
$handler->insert($user);
```
### การสืบค้นตามเกณฑ์
```php
// Build criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('level', 0, '>'));
$criteria->setSort('uname');
$criteria->setOrder('ASC');
$criteria->setLimit(10);

// Get objects
$handler = xoops_getHandler('user');
$users = $handler->getObjects($criteria);
```
### การสร้างแบบฟอร์ม
```php
$form = new XoopsThemeForm('User Profile', 'userform', 'save.php', 'post', true);
$form->addElement(new XoopsFormText('Username', 'uname', 50, 255, $user->getVar('uname')));
$form->addElement(new XoopsFormTextArea('Bio', 'bio', $user->getVar('bio')));
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
echo $form->render();
```
## API อนุสัญญา

### แบบแผนการตั้งชื่อ

| พิมพ์ | อนุสัญญา | ตัวอย่าง |
|------|-----------|---------|
| ชั้นเรียน | PascalCase | `XoopsUser`, `CriteriaCompo` |
| วิธีการ | อูฐกรณี | `getVar()`, `setVar()` |
| คุณสมบัติ | CamelCase (ป้องกัน) | `$_vars`, `$_handler` |
| ค่าคงที่ | UPPER_SNAKE_CASE | `XOBJ_DTYPE_INT` |
| ตารางฐานข้อมูล | งู_กรณี | `users`, `groups_users_link` |

### ประเภทข้อมูล

XOOPS กำหนดประเภทข้อมูลมาตรฐานสำหรับตัวแปรวัตถุ:

| ค่าคงที่ | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `XOBJ_DTYPE_TXTBOX` | สตริง | การป้อนข้อความ (ฆ่าเชื้อ) |
| `XOBJ_DTYPE_TXTAREA` | สตริง | เนื้อหาพื้นที่ข้อความ |
| `XOBJ_DTYPE_INT` | จำนวนเต็ม | ค่าตัวเลข |
| `XOBJ_DTYPE_URL` | สตริง | URL การตรวจสอบความถูกต้อง |
| `XOBJ_DTYPE_EMAIL` | สตริง | การตรวจสอบอีเมล์ |
| `XOBJ_DTYPE_ARRAY` | อาร์เรย์ | อาร์เรย์แบบอนุกรม |
| `XOBJ_DTYPE_OTHER` | ผสม | การจัดการแบบกำหนดเอง |
| `XOBJ_DTYPE_SOURCE` | สตริง | ซอร์สโค้ด (การฆ่าเชื้อขั้นต่ำ) |
| `XOBJ_DTYPE_STIME` | จำนวนเต็ม | การประทับเวลาแบบสั้น |
| `XOBJ_DTYPE_MTIME` | จำนวนเต็ม | การประทับเวลาปานกลาง |
| `XOBJ_DTYPE_LTIME` | จำนวนเต็ม | การประทับเวลาแบบยาว |

## วิธีการรับรองความถูกต้อง

API รองรับวิธีการตรวจสอบความถูกต้องหลายวิธี:

### API การตรวจสอบคีย์
```
X-API-Key: your-api-key
```
### โทเค็นผู้ถือ OAuth
```
Authorization: Bearer your-oauth-token
```
### การรับรองความถูกต้องตามเซสชัน
ใช้เซสชัน XOOPS ที่มีอยู่เมื่อเข้าสู่ระบบ

## REST API จุดสิ้นสุด

เมื่อเปิดใช้งาน REST API:

| จุดสิ้นสุด | วิธีการ | คำอธิบาย |
|----------|--------|-------------|
| `/api.php/rest/users` | GET | รายชื่อผู้ใช้ |
| `/api.php/rest/users/{id}` | GET | รับผู้ใช้โดย ID |
| `/api.php/rest/users` | POST | สร้างผู้ใช้ |
| `/api.php/rest/users/{id}` | PUT | อัปเดตผู้ใช้ |
| `/api.php/rest/users/{id}` | DELETE | ลบผู้ใช้ |
| `/api.php/rest/modules` | GET | แสดงรายการโมดูล |

## เอกสารที่เกี่ยวข้อง

- คู่มือการพัฒนาโมดูล
- คู่มือการพัฒนาธีม
- การกำหนดค่าระบบ
- แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย

## ประวัติเวอร์ชัน

| เวอร์ชั่น | การเปลี่ยนแปลง |
|---------|---------|
| 2.5.11 | รุ่นเสถียรปัจจุบัน |
| 2.5.10 | เพิ่มการสนับสนุน GraphQL API |
| 2.5.9 | ระบบเกณฑ์ขั้นสูง |
| 2.5.8 | PSR-4 รองรับการโหลดอัตโนมัติ |

---

*เอกสารนี้เป็นส่วนหนึ่งของฐานความรู้ XOOPS สำหรับการอัปเดตล่าสุด โปรดไปที่ [XOOPS พื้นที่เก็บข้อมูล GitHub](https://github.com/XOOPS)*