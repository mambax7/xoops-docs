---
title: "ตัวแปรเทมเพลต"
description: "ตัวแปร Smarty ที่มีอยู่ในเทมเพลต XOOPS"
---
XOOPS จัดเตรียมตัวแปรจำนวนมากให้กับเทมเพลต Smarty โดยอัตโนมัติ ข้อมูลอ้างอิงนี้บันทึกตัวแปรที่พร้อมใช้งานสำหรับการพัฒนาธีมและเทมเพลตโมดูล

## เอกสารที่เกี่ยวข้อง

- Smarty-Basics - พื้นฐานของ Smarty ใน XOOPS
- การพัฒนาธีม - การสร้างธีม XOOPS
- Smarty-4-Migration - อัปเกรดจาก Smarty 3 เป็น 4

## ตัวแปรธีมสากล

ตัวแปรเหล่านี้มีอยู่ในเทมเพลตธีม (`theme.tpl`):

### ข้อมูลไซต์

| ตัวแปร | คำอธิบาย | ตัวอย่าง |
|----------|-------------|---------|
| `$xoops_sitename` | ชื่อไซต์จากการตั้งค่า | `"My XOOPS Site"` |
| `$xoops_pagetitle` | ชื่อหน้าปัจจุบัน | `"Welcome"` |
| `$xoops_slogan` | สโลแกนของเว็บไซต์ | `"Just Use It!"` |
| `$xoops_url` | เต็ม XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | รหัสภาษา | `"en"` |
| `$xoops_charset` | ชุดอักขระ | `"UTF-8"` |

### เมตาแท็ก

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_meta_keywords` | เมตาคีย์เวิร์ด |
| `$xoops_meta_description` | คำอธิบายเมตา |
| `$xoops_meta_robots` | เมตาแท็กโรบ็อต |
| `$xoops_meta_rating` | การให้คะแนนเนื้อหา |
| `$xoops_meta_author` | เมตาแท็กผู้เขียน |
| `$xoops_meta_copyright` | ประกาศเกี่ยวกับลิขสิทธิ์ |

### ข้อมูลธีม

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_theme` | ชื่อธีมปัจจุบัน |
| `$xoops_imageurl` | ไดเร็กทอรีรูปภาพธีม URL |
| `$xoops_themecss` | ธีมหลัก CSS ไฟล์ URL |
| `$xoops_icons32_url` | ไอคอน 32x32 URL |
| `$xoops_icons16_url` | ไอคอน 16x16 URL |

### เนื้อหาเพจ

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_contents` | เนื้อหาหน้าหลัก |
| `$xoops_module_header` | เนื้อหาส่วนหัวเฉพาะโมดูล |
| `$xoops_footer` | เนื้อหาส่วนท้าย |
| `$xoops_js` | JavaScript ที่จะรวม |

### การนำทางและเมนู

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_mainmenu` | เมนูนำทางหลัก |
| `$xoops_usermenu` | เมนูผู้ใช้ |

### ตัวแปรบล็อก

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_lblocks` | อาร์เรย์ของบล็อกด้านซ้าย |
| `$xoops_rblocks` | อาร์เรย์ของบล็อกด้านขวา |
| `$xoops_cblocks` | อาร์เรย์ของบล็อกกลาง |
| `$xoops_showlblock` | แสดงบล็อกด้านซ้าย (บูลีน) |
| `$xoops_showrblock` | แสดงบล็อกด้านขวา (บูลีน) |
| `$xoops_showcblock` | แสดงบล็อกกลาง (บูลีน) |

## ตัวแปรผู้ใช้

เมื่อผู้ใช้เข้าสู่ระบบ:

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_isuser` | ผู้ใช้เข้าสู่ระบบ (บูลีน) |
| `$xoops_isadmin` | ผู้ใช้คือผู้ดูแลระบบ (บูลีน) |
| `$xoops_userid` | ผู้ใช้ ID |
| `$xoops_uname` | ชื่อผู้ใช้ |
| `$xoops_isowner` | ผู้ใช้เป็นเจ้าของเนื้อหาปัจจุบัน (บูลีน) |

### เข้าถึงคุณสมบัติของวัตถุผู้ใช้
```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## ตัวแปรโมดูล

ในเทมเพลตโมดูล:

| ตัวแปร | คำอธิบาย |
|----------|-------------|
| `$xoops_dirname` | ชื่อไดเร็กทอรีโมดูล |
| `$xoops_modulename` | ชื่อที่แสดงโมดูล |
| `$mod_url` | โมดูล URL (เมื่อได้รับมอบหมาย) |

### รูปแบบเทมเพลตโมดูลทั่วไป
```php
// In PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```
## บล็อกตัวแปร

แต่ละบล็อกใน `$xoops_lblocks`, `$xoops_rblocks` และ `$xoops_cblocks` มี:

| คุณสมบัติ | คำอธิบาย |
|----------|-------------|
| `$block.id` | บล็อก ID |
| `$block.title` | ชื่อบล็อก |
| `$block.content` | บล็อกเนื้อหา HTML |
| `$block.template` | ชื่อเทมเพลตบล็อก |
| `$block.module` | ชื่อโมดูล |
| `$block.weight` | น้ำหนักบล็อก/ลำดับ |

### ตัวอย่างการแสดงบล็อก
```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```
## ตัวแปรแบบฟอร์ม

เมื่อใช้คลาส XoopsForm:
```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```
## ตัวแปรการแบ่งหน้า
```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Template *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
## การกำหนดตัวแปรที่กำหนดเอง

### ค่านิยมง่ายๆ
```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```
### อาร์เรย์
```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```
### วัตถุ
```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Or for XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Array access *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Object method access *}
<h2><{$item_obj->getVar('title')}></h2>
```
### อาร์เรย์ที่ซ้อนกัน
```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```
## ตัวแปรในตัว Smarty

### $smarty.ตอนนี้

ประทับเวลาปัจจุบัน:
```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $smarty.const

เข้าถึงค่าคงที่ PHP:
```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $smarty.get, $smarty.post, $smarty.request

ตัวแปรคำขอเข้าถึง (ใช้ด้วยความระมัดระวัง):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```
### $smarty.server

ตัวแปรเซิร์ฟเวอร์:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```
### $smarty.foreach

ข้อมูลวง:
```smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```
## XMF ตัวแปรตัวช่วย

เมื่อใช้ XMF จะมีตัวช่วยเพิ่มเติม:
```php
// In PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```
## URL รูปภาพและเนื้อหา
```smarty
{* Theme images *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Module images *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Upload directory *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Using icons *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```
## การแสดงผลแบบมีเงื่อนไขขึ้นอยู่กับผู้ใช้
```smarty
{* Show only to logged-in users *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Show only to admins *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Show only to content owner *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```
## ตัวแปรภาษา
```php
// In PHP - load language file
xoops_loadLanguage('main', 'mymodule');

// Assign language constants
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* In template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```
หรือใช้ค่าคงที่โดยตรง:
```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```
## การดีบักตัวแปร

หากต้องการดูตัวแปรที่มีอยู่ทั้งหมด:
```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#smarty #templates #variables #xoops #reference