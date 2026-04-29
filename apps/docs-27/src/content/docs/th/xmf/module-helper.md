---
title: "XMF ตัวช่วยโมดูล"
description: 'การทำงานของโมดูลง่ายขึ้นโดยใช้คลาส Xmf\Module\Helper และผู้ช่วยเหลือที่เกี่ยวข้อง'
---
คลาส `Xmf\Module\Helper` เป็นวิธีง่ายๆ ในการเข้าถึงข้อมูลที่เกี่ยวข้องกับโมดูล การกำหนดค่า ตัวจัดการ และอื่นๆ การใช้ตัวช่วยโมดูลทำให้โค้ดของคุณง่ายขึ้นและลดขนาดสำเร็จรูป

## ภาพรวม

ตัวช่วยโมดูลให้:

- การเข้าถึงการกำหนดค่าที่ง่ายขึ้น
- การดึงวัตถุโมดูล
- การสร้างอินสแตนซ์ของตัวจัดการ
- เส้นทางและความละเอียด URL
- การอนุญาตและผู้ช่วยเซสชั่น
- การจัดการแคช

## รับตัวช่วยโมดูล

### การใช้งานพื้นฐาน
```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```
### จากโมดูลปัจจุบัน

หากคุณไม่ระบุชื่อโมดูล ระบบจะใช้โมดูลที่ใช้งานอยู่ในปัจจุบัน:
```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```
## การเข้าถึงการกำหนดค่า

### แบบดั้งเดิม XOOPS Way

การรับการกำหนดค่าโมดูลแบบเก่านั้นมีรายละเอียดมาก:
```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```
### XMF เยี่ยมเลย

ด้วยตัวช่วยโมดูล งานเดียวกันจะกลายเป็นเรื่องง่าย:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```
## วิธีการช่วยเหลือ

### getModule()

ส่งกลับวัตถุ XoopsModule สำหรับโมดูลของผู้ช่วยเหลือ
```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```
### getConfig($name, $default)

ส่งคืนค่าการกำหนดค่าโมดูลหรือการกำหนดค่าทั้งหมด
```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```
### getHandler($name)

ส่งคืนตัวจัดการวัตถุสำหรับโมดูล
```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```
### โหลดภาษา($name)

โหลดไฟล์ภาษาสำหรับโมดูล
```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```
### isCurrentModule()

ตรวจสอบว่าโมดูลนี้เป็นโมดูลที่ใช้งานอยู่ในปัจจุบันหรือไม่
```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```
### isUserAdmin()

ตรวจสอบว่าผู้ใช้ปัจจุบันมีสิทธิ์ผู้ดูแลระบบสำหรับโมดูลนี้หรือไม่
```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```
## เส้นทางและ URL วิธีการ

### URL($url)

ส่งกลับค่าสัมบูรณ์ URL สำหรับเส้นทางที่สัมพันธ์กับโมดูล
```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```
### เส้นทาง($path)

ส่งกลับเส้นทางระบบไฟล์สัมบูรณ์สำหรับเส้นทางที่สัมพันธ์กับโมดูล
```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```
### uploadUrl($url)

ส่งกลับค่าสัมบูรณ์ URL สำหรับไฟล์อัปโหลดโมดูล
```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```
### เส้นทางการอัปโหลด($path)

ส่งคืนเส้นทางระบบไฟล์สัมบูรณ์สำหรับไฟล์อัพโหลดโมดูล
```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```
### เปลี่ยนเส้นทาง($url, $time, $message¤)

เปลี่ยนเส้นทางภายในโมดูลไปยังโมดูลสัมพันธ์ URL
```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```
## การสนับสนุนการดีบัก

### setDebug($bool)

เปิดหรือปิดโหมดแก้ไขข้อบกพร่องสำหรับผู้ช่วยเหลือ
```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```
### addLog($log)

เพิ่มข้อความลงในบันทึกของโมดูล
```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```
## คลาสผู้ช่วยที่เกี่ยวข้อง

XMF มีผู้ช่วยพิเศษที่ขยาย `Xmf\Module\Helper\AbstractHelper`:

### ผู้ช่วยอนุญาต

ดู ../Recipes/Permission-Helper สำหรับเอกสารโดยละเอียด
```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```
### ตัวช่วยเซสชัน

พื้นที่จัดเก็บเซสชั่นที่รับรู้โมดูลพร้อมการเติมคีย์อัตโนมัติ
```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```
### ตัวช่วยแคช

การแคชแบบรับรู้โมดูลพร้อมคำนำหน้าคีย์อัตโนมัติ
```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```
## ตัวอย่างที่สมบูรณ์

นี่คือตัวอย่างที่ครอบคลุมโดยใช้ตัวช่วยโมดูล:
```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```
## คลาสฐาน AbstractHelper

คลาสตัวช่วย XMF ทั้งหมดขยาย `Xmf\Module\Helper\AbstractHelper` ซึ่งให้:

### ตัวสร้าง
```php
public function __construct($dirname)
```
สร้างอินสแตนซ์ด้วยชื่อไดเร็กทอรีโมดูล หากว่างเปล่า ให้ใช้โมดูลปัจจุบัน

### dirname()

ส่งคืนชื่อไดเร็กทอรีโมดูลที่เกี่ยวข้องกับตัวช่วย
```php
$dirname = $helper->dirname();
```
### init()

เรียกโดยตัวสร้างหลังจากโหลดโมดูลแล้ว แทนที่ในตัวช่วยแบบกำหนดเองสำหรับตรรกะการเริ่มต้น

## การสร้างตัวช่วยที่กำหนดเอง

คุณสามารถขยายตัวช่วยสำหรับฟังก์ชันการทำงานเฉพาะโมดูลได้:
```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```
## ดูเพิ่มเติม

- การเริ่มต้นใช้งาน-XMF - การใช้งานพื้นฐาน XMF
- XMF-คำขอ - การจัดการคำขอ
- ../Recipes/Permission-Helper - การจัดการสิทธิ์
- ../Recipes/Module-Admin-Pages - การสร้างอินเทอร์เฟซผู้ดูแลระบบ

---

#xmf #module-helper #configuration #handlers #session #cache