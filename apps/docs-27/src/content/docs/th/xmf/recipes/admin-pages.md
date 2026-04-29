---
title: "หน้าผู้ดูแลระบบโมดูล"
description: "การสร้างหน้าการดูแลระบบโมดูลที่เป็นมาตรฐานและเข้ากันได้กับการส่งต่อด้วย XMF"
---
คลาส `Xmf\Module\Admin` มีวิธีที่สอดคล้องกันในการสร้างอินเทอร์เฟซการดูแลระบบโมดูล การใช้ XMF สำหรับหน้าผู้ดูแลระบบช่วยให้มั่นใจได้ถึงความเข้ากันได้ในอนาคตกับเวอร์ชัน XOOPS ในอนาคต ในขณะที่ยังคงรักษาประสบการณ์ผู้ใช้ที่เหมือนกัน

## ภาพรวม

คลาส ModuleAdmin ใน XOOPS Frameworks ทำให้การดูแลระบบง่ายขึ้น แต่ API ได้พัฒนาข้ามเวอร์ชันต่างๆ wrapper `Xmf\Module\Admin`:

- ให้ API ที่เสถียร ซึ่งทำงานได้กับเวอร์ชัน XOOPS
- จัดการความแตกต่าง API ระหว่างเวอร์ชันโดยอัตโนมัติ
- ตรวจสอบให้แน่ใจว่ารหัสผู้ดูแลระบบของคุณเข้ากันได้กับการส่งต่อ
- เสนอวิธีการคงที่ที่สะดวกสำหรับงานทั่วไป

## เริ่มต้นใช้งาน

### การสร้างอินสแตนซ์ของผู้ดูแลระบบ
```php
$admin = \Xmf\Module\Admin::getInstance();
```
ซึ่งจะส่งคืนอินสแตนซ์ `Xmf\Module\Admin` หรือคลาสระบบเนทีฟหากเข้ากันได้อยู่แล้ว

## การจัดการไอคอน

### ปัญหาตำแหน่งไอคอน

ไอคอนถูกย้ายไปมาระหว่างเวอร์ชัน XOOPS ทำให้เกิดอาการปวดหัวในการบำรุงรักษา XMF แก้ปัญหานี้ด้วยวิธีอรรถประโยชน์

### กำลังค้นหาไอคอน

**วิธีเก่า (ขึ้นอยู่กับเวอร์ชัน):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```
**XMF วิธี:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```
เมธอด `iconUrl()` ส่งคืน URL แบบเต็ม ดังนั้นคุณจึงไม่ต้องกังวลเกี่ยวกับการสร้างเส้นทาง

### ขนาดไอคอน
```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```
### ไอคอนเมนู

สำหรับไฟล์ menu.php ของผู้ดูแลระบบ:

**วิธีเก่า:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```
**XMF วิธี:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## หน้าผู้ดูแลระบบมาตรฐาน

### หน้าดัชนี

**รูปแบบเก่า:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```
**XMF รูปแบบ:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```
### เกี่ยวกับเพจ

**รูปแบบเก่า:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```
**XMF รูปแบบ:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```
> **หมายเหตุ:** ในเวอร์ชัน XOOPS ในอนาคต ข้อมูล PayPal จะถูกตั้งค่าเป็น xoops_version.php การเรียก `setPaypal()`¤ ช่วยให้มั่นใจว่าเข้ากันได้กับเวอร์ชันปัจจุบัน ในขณะที่ไม่มีผลกระทบกับเวอร์ชันที่ใหม่กว่า

## การนำทาง

### แสดงเมนูนำทาง
```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```
## กล่องข้อมูล

### การสร้างกล่องข้อมูล
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```
## กล่องกำหนดค่า

กล่องกำหนดค่าจะแสดงข้อกำหนดของระบบและการตรวจสอบสถานะ

### บรรทัดการกำหนดค่าพื้นฐาน
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```
### วิธีการที่สะดวก
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```
### ประเภทกล่องกำหนดค่า

| พิมพ์ | ค่า | พฤติกรรม |
|------|-------|----------|
| `default` | สตริงข้อความ | แสดงข้อความโดยตรง |
| `folder` | เส้นทางไดเรกทอรี | แสดงว่ายอมรับหากมี ข้อผิดพลาดหากไม่ใช่ |
| `chmod` | `[path, permission]` | ตรวจสอบไดเรกทอรีที่มีอยู่โดยได้รับอนุญาต |
| `module` | ชื่อโมดูล | ยอมรับหากติดตั้งแล้ว เกิดข้อผิดพลาดหากไม่ใช่ |
| `module` | `[name, 'warning']` | ยอมรับหากติดตั้งแล้ว เตือนหากไม่ใช่ |

## ปุ่มรายการ

เพิ่มปุ่มการกระทำในหน้าผู้ดูแลระบบ:
```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```
## ตัวอย่างหน้าผู้ดูแลระบบที่สมบูรณ์

### index.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```
### items.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```
### about.php
```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```
### menu.php
```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```
## API ข้อมูลอ้างอิง

### วิธีการคงที่

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `getInstance()` | รับอินสแตนซ์ของผู้ดูแลระบบ |
| `iconUrl($name, $size)` | รับไอคอน URL (ขนาด: 16 หรือ 32) |
| `menuIconPath($image)` | รับเส้นทางไอคอนสำหรับ menu.php |
| `setPaypal($paypal)` | ตั้งค่า PayPal ID สำหรับหน้าเกี่ยวกับ |

### วิธีการอินสแตนซ์

| วิธีการ | คำอธิบาย |
|--------|-------------|
| `displayNavigation($menu)` | แสดงเมนูการนำทาง |
| `renderNavigation($menu)` | กลับการนำทาง HTML |
| `addInfoBox($title)` | เพิ่มกล่องข้อมูล |
| `addInfoBoxLine($text, $type, $color)` | เพิ่มบรรทัดลงในกล่องข้อมูล |
| `displayInfoBox()` | แสดงกล่องข้อมูล |
| `renderInfoBox()` | กล่องข้อมูลการคืนสินค้า HTML |
| `addConfigBoxLine($value, $type)` | เพิ่มบรรทัดตรวจสอบการกำหนดค่า |
| `addConfigError($value)` | เพิ่มข้อผิดพลาดในกล่องกำหนดค่า |
| `addConfigAccept($value)` | เพิ่มความสำเร็จให้กับกล่องกำหนดค่า |
| `addConfigWarning($value)` | เพิ่มคำเตือนลงในกล่องกำหนดค่า |
| `addConfigModuleVersion($moddir, $version)` | ตรวจสอบเวอร์ชันของโมดูล |
| `addItemButton($title, $link, $icon, $extra)` | เพิ่มปุ่มการกระทำ |
| `displayButton($position, $delimiter)` | ปุ่มแสดงผล |
| `renderButton($position, $delimiter)` | ปุ่มย้อนกลับ HTML |
| `displayIndex()` | แสดงหน้าดัชนี |
| `renderIndex()` | กลับหน้าดัชนี HTML |
| `displayAbout($logo_xoops)` | แสดงเกี่ยวกับหน้า |
| `renderAbout($logo_xoops)` | ย้อนกลับเกี่ยวกับหน้า HTML |

## ดูเพิ่มเติม

- ../พื้นฐาน/XMF-Module-Helper - คลาสตัวช่วยโมดูล
- ผู้ช่วยอนุญาต - การจัดการสิทธิ์
- ../XMF-Framework - ภาพรวมของเฟรมเวิร์ก

---

#xmf #admin #module-development #navigation #icons