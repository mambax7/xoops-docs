---
title: "XOOPS สถาปัตยกรรม"
description: "ภาพรวมที่ครอบคลุมของสถาปัตยกรรมระบบ XOOPS รวมถึงส่วนประกอบหลัก วงจรการใช้งานของคำขอ และจุดขยาย"
---
:::note[เกี่ยวกับเอกสารนี้]
หน้านี้อธิบาย **สถาปัตยกรรมแนวความคิด** ของ XOOPS ที่ใช้ได้กับทั้งเวอร์ชันปัจจุบัน (2.5.x) และเวอร์ชันอนาคต (4.0.x) ไดอะแกรมบางอันแสดงวิสัยทัศน์การออกแบบแบบเลเยอร์

**สำหรับรายละเอียดเฉพาะเวอร์ชัน:**
- **XOOPS 2.5.x วันนี้:** ใช้ `mainfile.php`, globals (`$xoopsDB`, `$xoopsUser`¤), โหลดล่วงหน้า, และรูปแบบตัวจัดการ
- **XOOPS 4.0 เป้าหมาย:** PSR-15 มิดเดิลแวร์, DI คอนเทนเนอร์, เราเตอร์ - ดู [แผนการทำงาน](../../07-XOOPS-4.0/XOOPS-4.0-Roadmap.md¤)
::::::

เอกสารนี้ให้ภาพรวมที่ครอบคลุมของสถาปัตยกรรมระบบ XOOPS โดยอธิบายว่าส่วนประกอบต่างๆ ทำงานร่วมกันเพื่อสร้างระบบการจัดการเนื้อหาที่ยืดหยุ่นและขยายได้อย่างไร

## ภาพรวม

XOOPS ดำเนินตามสถาปัตยกรรมแบบโมดูลาร์ที่แยกข้อกังวลออกเป็นเลเยอร์ที่แตกต่างกัน ระบบถูกสร้างขึ้นตามหลักการสำคัญหลายประการ:

- **โมดูลาร์**: ฟังก์ชันการทำงานถูกจัดเป็นโมดูลอิสระที่สามารถติดตั้งได้
- **ความสามารถในการขยาย**: ระบบสามารถขยายได้โดยไม่ต้องแก้ไขโค้ดหลัก
- **บทคัดย่อ**: ฐานข้อมูลและเลเยอร์การนำเสนอถูกแยกออกจากตรรกะทางธุรกิจ
- **ความปลอดภัย**: กลไกความปลอดภัยในตัวป้องกันช่องโหว่ทั่วไป

## เลเยอร์ระบบ
```
mermaid
graph TB
    subgraph Presentation["🎨 Presentation Layer"]
        Themes["Themes"]
        Templates["Smarty Templates"]
        Blocks["Blocks"]
    end

    subgraph Application["⚙️ Application Layer"]
        Modules["Modules"]
        Preloads["Preloads"]
        Controllers["Controllers"]
        BlockHandlers["Block Handlers"]
    end

    subgraph Domain["📦 Domain Layer"]
        XoopsObject["XoopsObject"]
        Handlers["Object Handlers"]
        Criteria["Criteria System"]
    end

    subgraph Infrastructure["🔧 Infrastructure Layer"]
        Database["XoopsDatabase"]
        Cache["Cache System"]
        Session["Session Manager"]
        Security["Security Layer"]
    end

    Presentation --> Application
    Application --> Domain
    Domain --> Infrastructure

    style Presentation fill:#e8f5e9,stroke:#388e3c
    style Application fill:#e3f2fd,stroke:#1976d2
    style Domain fill:#fff3e0,stroke:#f57c00
    style Infrastructure fill:#fce4ec,stroke:#c2185b
```
### 1. เลเยอร์การนำเสนอ

เลเยอร์การนำเสนอจัดการการเรนเดอร์ส่วนต่อประสานกับผู้ใช้โดยใช้กลไกเทมเพลต Smarty

**ส่วนประกอบสำคัญ:**
- **ธีม**: การจัดรูปแบบและการจัดวางภาพ
- **เทมเพลต Smarty**: การแสดงเนื้อหาแบบไดนามิก
- **บล็อก**: วิดเจ็ตเนื้อหาที่นำมาใช้ซ้ำได้

### 2. เลเยอร์แอปพลิเคชัน

เลเยอร์แอปพลิเคชันประกอบด้วยตรรกะทางธุรกิจ ตัวควบคุม และฟังก์ชันการทำงานของโมดูล

**ส่วนประกอบสำคัญ:**
- **โมดูล**: แพ็คเกจฟังก์ชันการทำงานที่มีในตัวเอง
- **ตัวจัดการ**: คลาสการจัดการข้อมูล
- **โหลดล่วงหน้า**: ผู้ฟังเหตุการณ์และตะขอ

### 3. เลเยอร์โดเมน

เลเยอร์โดเมนประกอบด้วยออบเจ็กต์และกฎทางธุรกิจหลัก

**ส่วนประกอบสำคัญ:**
- **XoopsObject**: คลาสพื้นฐานสำหรับออบเจ็กต์โดเมนทั้งหมด
- **ตัวจัดการ**: การดำเนินการ CRUD สำหรับวัตถุโดเมน

### 4. เลเยอร์โครงสร้างพื้นฐาน

เลเยอร์โครงสร้างพื้นฐานให้บริการหลัก เช่น การเข้าถึงฐานข้อมูลและการแคช

## ขอวงจรชีวิต

การทำความเข้าใจวงจรชีวิตของคำขอเป็นสิ่งสำคัญสำหรับการพัฒนา XOOPS ที่มีประสิทธิผล

### XOOPS 2.5.x โฟลว์ตัวควบคุมเพจ

XOOPS 2.5.x ปัจจุบันใช้รูปแบบ **Page Controller** โดยที่ไฟล์ PHP แต่ละไฟล์จัดการคำขอของตัวเอง Globals (`$xoopsDB`, `$xoopsUser`, `$xoopsTpl` ฯลฯ) ได้รับการเตรียมใช้งานระหว่างบูตสแตรปและพร้อมใช้งานตลอดการดำเนินการ
```
mermaid
sequenceDiagram
    participant Browser
    participant Entry as modules/mymod/index.php
    participant Main as mainfile.php
    participant Kernel as XOOPS Kernel
    participant DB as $xoopsDB
    participant User as $xoopsUser
    participant Handler as MyObjectHandler
    participant Tpl as $xoopsTpl (Smarty)
    participant Theme

    Browser->>Entry: GET /modules/mymod/index.php

    rect rgb(240, 248, 255)
        Note over Entry,User: Bootstrap Phase (mainfile.php)
        Entry->>Main: include mainfile.php
        Main->>Kernel: Initialize Core
        Kernel->>DB: Create XoopsDatabase (singleton)
        Kernel->>User: Load Session → $xoopsUser
        Kernel->>Tpl: Initialize Smarty → $xoopsTpl
        Main-->>Entry: Globals Ready
    end

    rect rgb(255, 250, 240)
        Note over Entry,Handler: Page Controller Execution
        Entry->>Handler: xoops_getModuleHandler('myobject')
        Handler->>DB: query via Criteria
        DB-->>Handler: Result Set
        Handler-->>Entry: XoopsObject[]
    end

    rect rgb(240, 255, 240)
        Note over Entry,Theme: Rendering Phase
        Entry->>Tpl: $xoopsTpl->assign('items', $objects)
        Entry->>Theme: include header.php
        Entry->>Tpl: $xoopsTpl->display('mymod_index.tpl')
        Entry->>Theme: include footer.php
        Theme-->>Browser: Complete HTML Page
    end
```
### Key Globals ใน 2.5.x

| ทั่วโลก | พิมพ์ | เริ่มต้น | วัตถุประสงค์ |
|----------------------|-|-------------|---------|
| `$xoopsDB` | `XoopsDatabase` | บูตสแตรป | การเชื่อมต่อฐานข้อมูล (ซิงเกิลตัน) |
| `$xoopsUser` | `XoopsUser\|null` | โหลดเซสชัน | ผู้ใช้ที่เข้าสู่ระบบปัจจุบัน |
| `$xoopsTpl` | `XoopsTpl` | เทมเพลตเริ่มต้น | เอ็นจิ้นเทมเพลต Smarty |
| `$xoopsModule` | `XoopsModule` | โหลดโมดูล | บริบทของโมดูลปัจจุบัน |
| `$xoopsConfig` | `array` | กำหนดค่าโหลด | การกำหนดค่าระบบ |

:::note[XOOPS 4.0 การเปรียบเทียบ]
ใน XOOPS 4.0 รูปแบบ Page Controller จะถูกแทนที่ด้วย **PSR-15 Middleware Pipeline** และการจัดส่งแบบใช้เราเตอร์ Globals จะถูกแทนที่ด้วยการฉีดการพึ่งพา ดู [สัญญาโหมดไฮบริด](../../07-XOOPS-4.0/Specifications/Hybrid-Mode-Contract.md) เพื่อรับประกันความเข้ากันได้ระหว่างการย้ายข้อมูล
::::::

### 1. เฟส Bootstrap
```php
// mainfile.php is the entry point
include_once XOOPS_ROOT_PATH . '/mainfile.php';

// Core initialization
$xoops = Xoops::getInstance();
$xoops->boot();
```
**ขั้นตอน:**
1. โหลดการกำหนดค่า (`mainfile.php`)
2. เริ่มต้นการโหลดอัตโนมัติ
3. ตั้งค่าการจัดการข้อผิดพลาด
4. สร้างการเชื่อมต่อฐานข้อมูล
5. โหลดเซสชันผู้ใช้
6. เริ่มต้นเอ็นจิ้นเทมเพลต Smarty

### 2. ขั้นตอนการกำหนดเส้นทาง
```php
// Request routing to appropriate module
$module = $GLOBALS['xoopsModule'];
$controller = $module->getController();
$controller->dispatch($request);
```
**ขั้นตอน:**
1. แยกวิเคราะห์คำขอ URL
2. ระบุโมดูลเป้าหมาย
3. การกำหนดค่าโมดูลโหลด
4. ตรวจสอบสิทธิ์
5. กำหนดเส้นทางไปยังผู้ดูแลที่เหมาะสม

### 3. ขั้นตอนการดำเนินการ
```php
// Controller execution
$data = $handler->getObjects($criteria);
$xoopsTpl->assign('items', $data);
```
**ขั้นตอน:**
1. ดำเนินการตรรกะตัวควบคุม
2. โต้ตอบกับชั้นข้อมูล
3. ประมวลผลกฎเกณฑ์ทางธุรกิจ
4. เตรียมข้อมูลการดู

### 4. ขั้นตอนการเรนเดอร์
```php
// Template rendering
include XOOPS_ROOT_PATH . '/header.php';
$xoopsTpl->display('db:module_template.tpl');
include XOOPS_ROOT_PATH . '/footer.php';
```
**ขั้นตอน:**
1. ใช้เค้าโครงธีม
2. เรนเดอร์เทมเพลตโมดูล
3. บล็อกกระบวนการ
4. การตอบสนองเอาต์พุต

## ส่วนประกอบหลัก

### XoopsObject

คลาสพื้นฐานสำหรับวัตถุข้อมูลทั้งหมดใน XOOPS
```php
<?php
class MyModuleItem extends XoopsObject
{
    public function __construct()
    {
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
    }
}
```
**วิธีการหลัก:**
- `initVar()` - กำหนดคุณสมบัติของวัตถุ
- `getVar()` - ดึงค่าคุณสมบัติ
- `setVar()` - ตั้งค่าคุณสมบัติ
- `assignVars()` - มอบหมายจำนวนมากจากอาร์เรย์

### XoopsPersistableObjectHandler

จัดการการดำเนินการ CRUD สำหรับอินสแตนซ์ XoopsObject
```php
<?php
class MyModuleItemHandler extends XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db)
    {
        parent::__construct($db, 'mymodule_items', 'MyModuleItem', 'id', 'title');
    }

    public function getActiveItems($limit = 10)
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 1));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```
**วิธีการหลัก:**
- `create()` - สร้างอินสแตนซ์วัตถุใหม่
- `get()` - ดึงวัตถุโดย ID
- `insert()` - บันทึกวัตถุลงในฐานข้อมูล
- `delete()` - ลบวัตถุออกจากฐานข้อมูล
- `getObjects()` - ดึงหลายวัตถุ
- `getCount()` - นับวัตถุที่ตรงกัน

### โครงสร้างโมดูล

ทุกโมดูล XOOPS มีโครงสร้างไดเร็กทอรีมาตรฐาน:
```
modules/mymodule/
├── class/                  # PHP classes
│   ├── MyModuleItem.php
│   └── MyModuleItemHandler.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── mymodule_index.tpl
│   └── mymodule_item.tpl
├── admin/                  # Admin area
│   ├── index.php
│   └── menu.php
├── language/               # Translations
│   └── english/
│       ├── main.php
│       └── modinfo.php
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
├── index.php               # Module entry
└── header.php              # Module header
```
## คอนเทนเนอร์ฉีดพึ่งพา

การพัฒนา XOOPS สมัยใหม่สามารถใช้ประโยชน์จากการฉีดการพึ่งพาเพื่อการทดสอบที่ดีขึ้น

### การใช้งานคอนเทนเนอร์ขั้นพื้นฐาน
```php
<?php
class XoopsDependencyContainer
{
    private array $services = [];

    public function register(string $name, callable $factory): void
    {
        $this->services[$name] = $factory;
    }

    public function resolve(string $name): mixed
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }

        $factory = $this->services[$name];

        if (is_callable($factory)) {
            return $factory($this);
        }

        return $factory;
    }

    public function has(string $name): bool
    {
        return isset($this->services[$name]);
    }
}
```
### PSR-11 คอนเทนเนอร์ที่เข้ากันได้
```php
<?php
namespace Xmf\Di;

use Psr\Container\ContainerInterface;

class BasicContainer implements ContainerInterface
{
    protected array $definitions = [];

    public function set(string $id, mixed $value): void
    {
        $this->definitions[$id] = $value;
    }

    public function get(string $id): mixed
    {
        if (!$this->has($id)) {
            throw new \InvalidArgumentException("Service not found: $id");
        }

        $entry = $this->definitions[$id];

        if (is_callable($entry)) {
            return $entry($this);
        }

        return $entry;
    }

    public function has(string $id): bool
    {
        return isset($this->definitions[$id]);
    }
}
```
### ตัวอย่างการใช้งาน
```php
<?php
// Service registration
$container = new XoopsDependencyContainer();

$container->register('database', function () {
    return XoopsDatabaseFactory::getDatabaseConnection();
});

$container->register('userHandler', function ($c) {
    return new XoopsUserHandler($c->resolve('database'));
});

// Service resolution
$userHandler = $container->resolve('userHandler');
$user = $userHandler->get($userId);
```
## จุดต่อขยาย

XOOPS มีกลไกการขยายหลายประการ:

### 1. โหลดล่วงหน้า

โหลดล่วงหน้าอนุญาตให้โมดูลเชื่อมต่อกับเหตุการณ์หลัก
```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreHeaderEnd($args)
    {
        // Execute when header processing ends
    }

    public static function eventCoreFooterStart($args)
    {
        // Execute when footer processing starts
    }
}
```
### 2. ปลั๊กอิน

ปลั๊กอินขยายฟังก์ชันการทำงานเฉพาะภายในโมดูล
```php
<?php
// modules/mymodule/plugins/notify.php
class MymoduleNotifyPlugin
{
    public function onItemCreate($item)
    {
        // Send notification when item is created
    }
}
```
### 3. ฟิลเตอร์

ตัวกรองแก้ไขข้อมูลเมื่อผ่านระบบ
```php
<?php
// Content filter example
$myts = MyTextSanitizer::getInstance();
$content = $myts->displayTarea($rawContent, 1, 1, 1);
```
## แนวทางปฏิบัติที่ดีที่สุด

### องค์กรรหัส

1. **ใช้เนมสเปซ** สำหรับโค้ดใหม่:
   
```php
   เนมสเปซ XoopsModules\MyModule;

   คลาสไอเท็มขยาย \XoopsObject
   {
       // การนำไปปฏิบัติ
   }
   
```

2. **ติดตาม PSR-4 การโหลดอัตโนมัติ**:
   ```.json
   {
       "โหลดอัตโนมัติ": {
           "psr-4": {
               "XoopsModules\\MyModule\\": "คลาส/"
           }
       }
   }
   
```

3. **ข้อกังวลแยกต่างหาก**:
   - ตรรกะของโดเมนใน `class/`
   - การนำเสนอใน `templates/`
   - คอนโทรลเลอร์ในรูทโมดูล

### ประสิทธิภาพ

1. **ใช้แคช** สำหรับการดำเนินการที่มีราคาแพง
2. ทรัพยากร **Lazy Load** เมื่อเป็นไปได้
3. **ลดการสืบค้นฐานข้อมูล** โดยใช้การแบทช์เกณฑ์
4. **เพิ่มประสิทธิภาพเทมเพลต** โดยหลีกเลี่ยงตรรกะที่ซับซ้อน

### ความปลอดภัย

1. **ตรวจสอบอินพุตทั้งหมด** โดยใช้ `Xmf\Request`
2. **Escape เอาต์พุต** ในเทมเพลต
3. **ใช้คำสั่งที่เตรียมไว้** สำหรับการสืบค้นฐานข้อมูล
4. **ตรวจสอบสิทธิ์** ก่อนดำเนินการที่ละเอียดอ่อน

## เอกสารที่เกี่ยวข้อง

- [การออกแบบ-รูปแบบ](Design-Patterns.md) - รูปแบบการออกแบบที่ใช้ใน XOOPS
- [เลเยอร์ฐานข้อมูล](../Database/Database-Layer.md) - รายละเอียดนามธรรมของฐานข้อมูล
- [พื้นฐานอันชาญฉลาด](../Templates/Smarty-Basics.md) - เอกสารระบบเทมเพลต
- [แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย](../Security/Security-Best-Practices.md) - หลักเกณฑ์ด้านความปลอดภัย

---

#xoops #architecture #core #design #การออกแบบระบบ