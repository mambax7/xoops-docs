---
title: "XOOPS ระบบโมดูล"
description: "วงจรการใช้งานโมดูล, คลาส XoopsModule, การติดตั้ง/ถอนการติดตั้งโมดูล, hooks โมดูล และการจัดการโมดูล"
---
XOOPS Module System มอบเฟรมเวิร์กที่สมบูรณ์สำหรับการพัฒนา ติดตั้ง จัดการ และขยายฟังก์ชันการทำงานของโมดูล โมดูลเป็นแพ็คเกจในตัวเองที่ขยาย XOOPS ด้วยคุณสมบัติและความสามารถเพิ่มเติม

## สถาปัตยกรรมโมดูล
```
mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```
## โครงสร้างโมดูล

โครงสร้างไดเรกทอรีโมดูลมาตรฐาน XOOPS:
```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```
## คลาส XoopsModule

คลาส XoopsModule แสดงถึงโมดูล XOOPS ที่ติดตั้งไว้

### ภาพรวมชั้นเรียน
```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```
### คุณสมบัติ

| คุณสมบัติ | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `$moduleid` | อินท์ | โมดูลที่ไม่ซ้ำ ID |
| `$name` | สตริง | ชื่อที่แสดงโมดูล |
| `$dirname` | สตริง | ชื่อไดเร็กทอรีโมดูล |
| `$version` | สตริง | เวอร์ชันโมดูลปัจจุบัน |
| `$description` | สตริง | คำอธิบายโมดูล |
| `$config` | อาร์เรย์ | การกำหนดค่าโมดูล |
| `$blocks` | อาร์เรย์ | บล็อกโมดูล |
| `$adminPages` | อาร์เรย์ | หน้าแผงผู้ดูแลระบบ |
| `$userPages` | อาร์เรย์ | หน้าต่อหน้าผู้ใช้ |

### ตัวสร้าง
```php
public function __construct()
```
สร้างอินสแตนซ์โมดูลใหม่และเตรียมใช้งานตัวแปร

### วิธีการหลัก

#### รับชื่อ

รับชื่อที่แสดงของโมดูล
```php
public function getName(): string
```
**ผลตอบแทน:** `string` - ชื่อที่แสดงของโมดูล

**ตัวอย่าง:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```
#### รับDirname

รับชื่อไดเร็กทอรีของโมดูล
```php
public function getDirname(): string
```
**ผลตอบแทน:** `string` - ชื่อไดเรกทอรีของโมดูล

**ตัวอย่าง:**
```php
echo $module->getDirname(); // "publisher"
```
####getVersion

รับเวอร์ชันโมดูลปัจจุบัน
```php
public function getVersion(): string
```
**ผลตอบแทน:** `string` - สตริงเวอร์ชัน

**ตัวอย่าง:**
```php
echo $module->getVersion(); // "2.1.0"
```
#### รับคำอธิบาย

รับคำอธิบายโมดูล
```php
public function getDescription(): string
```
**ผลตอบแทน:** `string` - คำอธิบายโมดูล

**ตัวอย่าง:**
```php
$desc = $module->getDescription();
```
#### รับ Config

ดึงข้อมูลการกำหนดค่าโมดูล
```php
public function getConfig(string $key = null): mixed
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | รหัสการกำหนดค่า (null สำหรับทั้งหมด) |

**ผลตอบแทน:** `mixed` - ค่าการกำหนดค่าหรืออาร์เรย์

**ตัวอย่าง:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```
#### setConfig

ตั้งค่าการกำหนดค่าโมดูล
```php
public function setConfig(string $key, mixed $value): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$key` | สตริง | รหัสการกำหนดค่า |
| `$value` | ผสม | ค่าการกำหนดค่า |

**ตัวอย่าง:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```
#### รับเส้นทาง

รับเส้นทางระบบไฟล์แบบเต็มไปยังโมดูล
```php
public function getPath(): string
```
**ผลตอบแทน:** `string` - เส้นทางไดเรกทอรีโมดูลสัมบูรณ์

**ตัวอย่าง:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```
####getUrl

รับ URL ไปยังโมดูล
```php
public function getUrl(): string
```
**ผลตอบแทน:** `string` - โมดูล URL

**ตัวอย่าง:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```
## กระบวนการติดตั้งโมดูล

### ฟังก์ชั่น xoops_module_install

ฟังก์ชันการติดตั้งโมดูลที่กำหนดไว้ใน `xoops_version.php`:
```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$module` | XoopsModule | โมดูลที่กำลังติดตั้ง |

**ผลตอบแทน:** `bool` - จริงเมื่อสำเร็จ เท็จเมื่อล้มเหลว

**ตัวอย่าง:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```
### ฟังก์ชั่น xoops_module_uninstall

ฟังก์ชั่นการถอนการติดตั้งโมดูล:
```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```
**ตัวอย่าง:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```
## ตะขอโมดูล

ตะขอโมดูลอนุญาตให้โมดูลรวมเข้ากับโมดูลอื่นและระบบ

### ประกาศเกี่ยวเบ็ด

ใน `xoops_version.php`:
```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```
### การใช้งานตะขอ
```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```
### ตะขอระบบที่มีอยู่

| ฮุค | พารามิเตอร์ | คำอธิบาย |
|------|-----------|-------------|
| `system.page.header` | ไม่มี | เอาต์พุตส่วนหัวของหน้า |
| `system.page.footer` | ไม่มี | เอาต์พุตส่วนท้ายของหน้า |
| `user.login.success` | $user วัตถุ | หลังจากผู้ใช้เข้าสู่ระบบ |
| `user.logout` | $user วัตถุ | หลังจากผู้ใช้ออกจากระบบ |
| `user.profile.view` | $user_id | กำลังดูโปรไฟล์ผู้ใช้ |
| `module.install` | $module วัตถุ | การติดตั้งโมดูล |
| `module.uninstall` | $module วัตถุ | การถอนการติดตั้งโมดูล |

## บริการตัวจัดการโมดูล

บริการ ModuleManager จัดการการทำงานของโมดูล

### วิธีการ

#### รับโมดูล

ดึงข้อมูลโมดูลตามชื่อ
```php
public function getModule(string $dirname): ?XoopsModule
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$dirname` | สตริง | ชื่อไดเร็กทอรีโมดูล |

**ผลตอบแทน:** `?XoopsModule` - อินสแตนซ์ของโมดูลหรือค่าว่าง

**ตัวอย่าง:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```
#### รับ AllModules

รับโมดูลที่ติดตั้งทั้งหมด
```php
public function getAllModules(bool $activeOnly = true): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$activeOnly` | บูล | ส่งคืนเฉพาะโมดูลที่ใช้งานอยู่ |

**ผลตอบแทน:** `array` - อาร์เรย์ของวัตถุ XoopsModule

**ตัวอย่าง:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```
#### isModuleActive

ตรวจสอบว่าโมดูลทำงานอยู่หรือไม่
```php
public function isModuleActive(string $dirname): bool
```
**ตัวอย่าง:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```
#### เปิดใช้งานโมดูล

เปิดใช้งานโมดูล
```php
public function activateModule(string $dirname): bool
```
**ตัวอย่าง:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```
#### ปิดการใช้งานโมดูล

ปิดใช้งานโมดูล
```php
public function deactivateModule(string $dirname): bool
```
**ตัวอย่าง:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```
## การกำหนดค่าโมดูล (xoops_version.php)

ตัวอย่างรายการโมดูลที่สมบูรณ์:
```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **เนมสเปซคลาสของคุณ** - ใช้เนมสเปซเฉพาะโมดูลเพื่อหลีกเลี่ยงความขัดแย้ง

2. **ใช้ตัวจัดการ** - ใช้คลาสตัวจัดการสำหรับการดำเนินการฐานข้อมูลเสมอ

3. **ทำให้เนื้อหาเป็นสากล** - ใช้ค่าคงที่ภาษาสำหรับสตริงที่ผู้ใช้เห็นทั้งหมด

4. **สร้างสคริปต์การติดตั้ง** - จัดเตรียมสคีมา SQL สำหรับตารางฐานข้อมูล

5. **Document Hooks** - จัดทำเอกสารอย่างชัดเจนว่าโมดูลของคุณมี hook อะไรบ้าง

6. **เวอร์ชันโมดูลของคุณ** - เพิ่มหมายเลขเวอร์ชันพร้อมกับการเผยแพร่

7. **ทดสอบการติดตั้ง** - ทดสอบกระบวนการติดตั้ง/ถอนการติดตั้งอย่างละเอียด

8. **จัดการสิทธิ์** - ตรวจสอบสิทธิ์ผู้ใช้ก่อนอนุญาตการดำเนินการ

## ตัวอย่างโมดูลที่สมบูรณ์
```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```
## เอกสารที่เกี่ยวข้อง

- ../Kernel/Kernel-Classes - การเริ่มต้นเคอร์เนลและบริการหลัก
- ../Template/Template-System - เทมเพลตโมดูลและการรวมธีม
- ../Database/QueryBuilder - การสร้างแบบสอบถามฐานข้อมูล
- ../Core/XoopsObject - คลาสอ็อบเจ็กต์ฐาน

---

*ดูเพิ่มเติมที่: [XOOPS คู่มือการพัฒนาโมดูล](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*