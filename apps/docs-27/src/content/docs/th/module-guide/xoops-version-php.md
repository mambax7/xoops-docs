---
title: "xoops_version.php - รายการโมดูล"
---
## ภาพรวม

ไฟล์ `xoops_version.php` เป็นหัวใจของโมดูล XOOPS ทุกโมดูล โดยจะกำหนดข้อมูลเมตาของโมดูล ตารางฐานข้อมูล เทมเพลต บล็อก ตัวเลือกการกำหนดค่า และฮุกการติดตั้ง

## โครงสร้างพื้นฐาน
```php
<?php
/**
 * Module manifest file
 */

$modversion = [
    // Module identity
    'name'           => _MI_MYMODULE_NAME,
    'version'        => '1.0.0',
    'description'    => _MI_MYMODULE_DESC,
    'author'         => 'Your Name',
    'author_mail'    => 'your@email.com',
    'author_website' => 'https://yoursite.com',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0 or later',
    'license_url'    => 'https://www.gnu.org/licenses/gpl-2.0.html',
    'dirname'        => basename(__DIR__),

    // Images
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // System settings
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,
    'hasSearch'      => 1,
    'hasComments'    => 0,
    'hasNotification'=> 0,
];
```
## การอ้างอิงที่สมบูรณ์

### เอกลักษณ์ของโมดูล

| คีย์ | พิมพ์ | คำอธิบาย |
|-----|-|-------------|
| `name` | สตริง | ชื่อที่แสดง (ใช้ค่าคงที่ภาษา) |
| `version` | สตริง | เวอร์ชันความหมาย (MAJOR.MINOR.PATCH) |
| `description` | สตริง | คำอธิบายโมดูล |
| `author` | สตริง | ชื่อผู้แต่งหลัก |
| `credits` | สตริง | ผู้มีส่วนร่วมเพิ่มเติม |
| `license` | สตริง | ชื่อใบอนุญาต |
| `dirname` | สตริง | ชื่อไดเร็กทอรีโมดูล |

### ตารางฐานข้อมูล
```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```
### เทมเพลต
```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```
### บล็อก
```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0',  // default options
    'can_clone'   => true,
];
```
### ตัวเลือกการกำหนดค่า
```php
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

$modversion['config'][] = [
    'name'        => 'enable_comments',
    'title'       => '_MI_MYMODULE_ENABLE_COMMENTS',
    'description' => '',
    'formtype'    => 'yesno',
    'valuetype'   => 'int',
    'default'     => 1,
];

$modversion['config'][] = [
    'name'        => 'display_mode',
    'title'       => '_MI_MYMODULE_DISPLAY_MODE',
    'description' => '',
    'formtype'    => 'select',
    'valuetype'   => 'text',
    'default'     => 'list',
    'options'     => [
        _MI_MYMODULE_MODE_LIST => 'list',
        _MI_MYMODULE_MODE_GRID => 'grid',
    ],
];
```
### ประเภทแบบฟอร์ม

| แบบฟอร์ม | ประเภทค่า | คำอธิบาย |
|----------|-----------|-------------|
| `textbox` | `text`/`int` | อินพุตบรรทัดเดียว |
| `textarea` | `text` | อินพุตหลายบรรทัด |
| `yesno` | `int` | ใช่/ไม่ใช่ วิทยุ |
| `select` | `text` | ดรอปดาวน์เลือก |
| `select_multi` | `array` | เลือกหลายรายการ |
| `group` | `int` | ตัวเลือกกลุ่ม |
| `group_multi` | `array` | ตัวเลือกหลายกลุ่ม |
| `user` | `int` | ตัวเลือกผู้ใช้ |
| `color` | `text` | ตัวเลือกสี |
| `hidden` | `text` | ฟิลด์ที่ซ่อนอยู่ |

### รายการเมนู
```php
// Main menu
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```
### ตะขอติดตั้ง
```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```
### บูรณาการการค้นหา
```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```
### บูรณาการความคิดเห็น
```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```
### การแจ้งเตือน
```php
$modversion['hasNotification'] = 1;
$modversion['notification'] = [
    'lookup_file' => 'include/notification.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => '',
            'subscribe_from' => 'index.php',
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => '',
            'subscribe_from' => 'item.php',
            'item_name'      => 'item_id',
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SUBJ,
        ],
    ],
];
```
## เอกสารที่เกี่ยวข้อง

- การพัฒนาโมดูล - คู่มือโมดูลฉบับสมบูรณ์
- โครงสร้างโมดูล - โครงสร้างไดเร็กทอรี
- บล็อกการพัฒนา - การสร้างบล็อก
- ฐานข้อมูลการดำเนินงาน - การตั้งค่าฐานข้อมูล