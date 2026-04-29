---
title: "โมดูล FAQ"
description: "คำถามที่พบบ่อยเกี่ยวกับโมดูล XOOPS"
---
# โมดูลคำถามที่พบบ่อย

> คำถามและคำตอบทั่วไปเกี่ยวกับโมดูล XOOPS การติดตั้ง และการจัดการ

---

## การติดตั้งและการเปิดใช้งาน

### ถาม: ฉันจะติดตั้งโมดูลใน XOOPS ได้อย่างไร

**ก:**
1. ดาวน์โหลดไฟล์ zip ของโมดูล
2. ไปที่ XOOPS ผู้ดูแลระบบ > โมดูล > จัดการโมดูล
3. คลิก "เรียกดู" และเลือกไฟล์ zip
4. คลิก "อัปโหลด"
5. โมดูลปรากฏในรายการ (โดยปกติจะปิดใช้งาน)
6. คลิกไอคอนเปิดใช้งานเพื่อเปิดใช้งาน

หรือแตกไฟล์ zip โดยตรงไปที่ `/xoops_root/modules/` และไปที่แผงผู้ดูแลระบบ

---

### ถาม: การอัปโหลดโมดูลล้มเหลวด้วย "สิทธิ์ถูกปฏิเสธ"

**A:** นี่เป็นปัญหาเรื่องการอนุญาตไฟล์:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
ดูความล้มเหลวในการติดตั้งโมดูลสำหรับรายละเอียดเพิ่มเติม

---

### ถาม: เหตุใดฉันจึงไม่เห็นโมดูลในแผงผู้ดูแลระบบหลังการติดตั้ง?

**ก:** ตรวจสอบสิ่งต่อไปนี้:

1. **ไม่ได้เปิดใช้งานโมดูล** - คลิกไอคอนรูปตาในรายการโมดูล
2. **ไม่มีหน้าผู้ดูแลระบบ** - โมดูลต้องมี `hasAdmin = 1` ใน xoopsversion.php
3. **ไฟล์ภาษาหายไป** - ต้องการ `language/english/admin.php`
4. **ไม่ได้ล้างแคช** - ล้างแคชและรีเฟรชเบราว์เซอร์
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### ถาม: ฉันจะถอนการติดตั้งโมดูลได้อย่างไร?

**ก:**
1. ไปที่ XOOPS ผู้ดูแลระบบ > โมดูล > จัดการโมดูล
2. ปิดการใช้งานโมดูล (คลิกที่ไอคอนรูปตา)
3. คลิกไอคอนถังขยะ/ลบ
4. ลบโฟลเดอร์โมดูลด้วยตนเองหากคุณต้องการลบออกทั้งหมด:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## การจัดการโมดูล

### ถาม: การปิดใช้งานและการถอนการติดตั้งแตกต่างกันอย่างไร?

**ก:**
- **ปิดการใช้งาน**: ปิดการใช้งานโมดูล (คลิกที่ไอคอนรูปตา) ตารางฐานข้อมูลยังคงอยู่
- **ถอนการติดตั้ง**: ถอดโมดูลออก ลบตารางฐานข้อมูลและลบออกจากรายการ

หากต้องการลบอย่างแท้จริง ให้ลบโฟลเดอร์ด้วย:
```bash
rm -rf modules/modulename
```
---

### ถาม: ฉันจะตรวจสอบได้อย่างไรว่าโมดูลได้รับการติดตั้งอย่างถูกต้องหรือไม่?

**ตอบ:** ใช้สคริปต์แก้ไขข้อบกพร่อง:
```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```
---

### ถาม: ฉันสามารถรันโมดูลเดียวกันหลายเวอร์ชันได้หรือไม่

**ตอบ:** ไม่ XOOPS ไม่รองรับสิ่งนี้โดยกำเนิด อย่างไรก็ตาม คุณสามารถ:

1. สร้างสำเนาด้วยชื่อไดเรกทอรีอื่น: `mymodule` และ `mymodule2`
2. อัปเดต dirname ในทั้งสองโมดูล ' xoopsversion.php
3. ตรวจสอบให้แน่ใจว่าชื่อตารางฐานข้อมูลไม่ซ้ำกัน

ไม่แนะนำเนื่องจากใช้รหัสเดียวกัน

---

## การกำหนดค่าโมดูล

### ถาม: ฉันจะกำหนดการตั้งค่าโมดูลได้ที่ไหน?

**ก:**
1. ไปที่ XOOPS ผู้ดูแลระบบ > โมดูล
2. คลิกไอคอนการตั้งค่า/เกียร์ถัดจากโมดูล
3. กำหนดการตั้งค่า

การตั้งค่าจะถูกจัดเก็บไว้ในตาราง `xoops_config`

**เข้าใช้รหัส:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```
---

### ถาม: ฉันจะกำหนดตัวเลือกการกำหนดค่าโมดูลได้อย่างไร?

**ตอบ:** ใน xoopsversion.php:
```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```
---

## คุณสมบัติโมดูล

### ถาม: ฉันจะเพิ่มหน้าผู้ดูแลระบบในโมดูลของฉันได้อย่างไร

**A:** สร้างโครงสร้าง:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
ใน xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
สร้าง `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### ถาม: ฉันจะเพิ่มฟังก์ชันการค้นหาลงในโมดูลของฉันได้อย่างไร

**ก:**
1. ตั้งค่าเป็น xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. สร้าง `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```
---

### ถาม: ฉันจะเพิ่มการแจ้งเตือนไปยังโมดูลของฉันได้อย่างไร

**ก:**
1. ตั้งค่าเป็น xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```
2. ทริกเกอร์การแจ้งเตือนในรหัส:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```
---

## สิทธิ์ของโมดูล

### ถาม: ฉันจะตั้งค่าการอนุญาตของโมดูลได้อย่างไร?

**ก:**
1. ไปที่ XOOPS ผู้ดูแลระบบ > โมดูล > สิทธิ์ของโมดูล
2. เลือกโมดูล
3. เลือกผู้ใช้/กลุ่มและระดับสิทธิ์
4. บันทึก

**ในรหัส:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```
---

## ฐานข้อมูลโมดูล

### ถาม: ตารางฐานข้อมูลโมดูลถูกเก็บไว้ที่ไหน?

**ตอบ:** ทั้งหมดในฐานข้อมูล XOOPS หลัก ซึ่งขึ้นต้นด้วยคำนำหน้าตารางของคุณ (โดยทั่วไปคือ `xoops_`):
```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```
---

### ถาม: ฉันจะอัพเดตตารางฐานข้อมูลโมดูลได้อย่างไร?

**A:** สร้างสคริปต์อัปเดตในโมดูลของคุณ:
```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```
---

## การพึ่งพาโมดูล

### ถาม: ฉันจะตรวจสอบได้อย่างไรว่ามีการติดตั้งโมดูลที่จำเป็นแล้ว?

**ก:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```
---

### ถาม: โมดูลสามารถพึ่งพาโมดูลอื่นได้หรือไม่?

**ตอบ:** ใช่ ประกาศใน xoopsversion.php:
```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```
---

## การแก้ไขปัญหา

### ถาม: โมดูลปรากฏในรายการแต่จะไม่เปิดใช้งาน

**ก:** ตรวจสอบ:
1. ไวยากรณ์ xoopsversion.php - ใช้ PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. ไฟล์ฐานข้อมูล SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. ไฟล์ภาษา:
```bash
ls -la modules/mymodule/language/english/
```
ดูความล้มเหลวในการติดตั้งโมดูลสำหรับการวินิจฉัยโดยละเอียด

---

### ถาม: โมดูลเปิดใช้งานแล้ว แต่ไม่แสดงในไซต์หลัก

**ก:**
1. ตั้งค่า `hasMain = 1` ใน xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. สร้าง `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### ถาม: โมดูลทำให้เกิด "หน้าจอสีขาวแห่งความตาย"

**A:** เปิดใช้งานการแก้ไขข้อบกพร่องเพื่อค้นหาข้อผิดพลาด:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
ตรวจสอบบันทึกข้อผิดพลาด:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
ดู White Screen of Death สำหรับวิธีแก้ปัญหา

---

## ประสิทธิภาพ

### ถาม: โมดูลช้า ฉันจะเพิ่มประสิทธิภาพได้อย่างไร

**ก:**
1. **ตรวจสอบการสืบค้นฐานข้อมูล** - ใช้การบันทึกการสืบค้น
2. **ข้อมูลแคช** - ใช้แคช XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```
3. **เพิ่มประสิทธิภาพเทมเพลต** - หลีกเลี่ยงการวนซ้ำในเทมเพลต
4. **เปิดใช้งาน PHP opcode cache** - APCu, XDebug ฯลฯ

ดูประสิทธิภาพ FAQ สำหรับรายละเอียดเพิ่มเติม

---

## การพัฒนาโมดูล

### ถาม: ฉันจะหาเอกสารการพัฒนาโมดูลได้จากที่ไหน?

**ก:** ดู:
- คู่มือการพัฒนาโมดูล
- โครงสร้างโมดูล
- การสร้างโมดูลแรกของคุณ

---

## เอกสารที่เกี่ยวข้อง

- ความล้มเหลวในการติดตั้งโมดูล
- โครงสร้างโมดูล
- ประสิทธิภาพ FAQ
- เปิดใช้งานโหมดแก้ไขข้อบกพร่อง

---

#xoops #modules #faq #การแก้ไขปัญหา