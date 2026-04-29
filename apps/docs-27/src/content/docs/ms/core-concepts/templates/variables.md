---
title: "Pembolehubah Templat"
description: "Pembolehubah Smarty tersedia dalam templat XOOPS"
---
XOOPS secara automatik menyediakan banyak pembolehubah kepada templat Smarty. Rujukan ini mendokumenkan pembolehubah yang tersedia untuk pembangunan templat tema dan modul.## Dokumentasi Berkaitan- Smarty-Basics - Asas Smarty dalam XOOPS
- Pembangunan Tema - Mencipta tema XOOPS
- Smarty-4-Migration - Menaik taraf daripada Smarty 3 kepada 4## Pembolehubah Tema GlobalPembolehubah ini tersedia dalam templat tema (`theme.tpl`):### Maklumat Tapak| Pembolehubah | Penerangan | Contoh |
|----------|-------------|---------|
| `$xoops_sitename` | Nama tapak daripada pilihan | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Tajuk halaman semasa | `"Welcome"` |
| `$xoops_slogan` | Slogan tapak | `"Just Use It!"` |
| `$xoops_url` | URL XOOPS penuh | `"https://example.com"` |
| `$xoops_langcode` | Kod bahasa | `"en"` |
| `$xoops_charset` | Set aksara | `"UTF-8"` |### Tag Meta| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_meta_keywords` | Kata kunci meta |
| `$xoops_meta_description` | Perihalan meta |
| `$xoops_meta_robots` | Tag meta robot |
| `$xoops_meta_rating` | Penilaian kandungan |
| `$xoops_meta_author` | Tag meta pengarang |
| `$xoops_meta_copyright` | Notis hak cipta |### Maklumat Tema| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_theme` | Nama tema semasa |
| `$xoops_imageurl` | URL direktori imej tema |
| `$xoops_themecss` | URL fail CSS tema utama |
| `$xoops_icons32_url` | URL ikon 32x32 |
| `$xoops_icons16_url` | URL ikon 16x16 |### Kandungan Halaman| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_contents` | Kandungan halaman utama |
| `$xoops_module_header` | Kandungan kepala khusus modul |
| `$xoops_footer` | Kandungan pengaki |
| `$xoops_js` | JavaScript untuk memasukkan |### Navigasi dan Menu| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_mainmenu` | Menu navigasi utama |
| `$xoops_usermenu` | Menu pengguna |### Pembolehubah Sekat| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_lblocks` | Tatasusunan blok kiri |
| `$xoops_rblocks` | Tatasusunan blok kanan |
| `$xoops_cblocks` | Susunan blok tengah |
| `$xoops_showlblock` | Tunjukkan blok kiri (boolean) |
| `$xoops_showrblock` | Tunjukkan blok kanan (boolean) |
| `$xoops_showcblock` | Tunjukkan blok tengah (boolean) |## Pembolehubah PenggunaApabila pengguna log masuk:| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_isuser` | Pengguna telah log masuk (boolean) |
| `$xoops_isadmin` | Pengguna ialah pentadbir (boolean) |
| `$xoops_userid` | ID Pengguna |
| `$xoops_uname` | Nama pengguna |
| `$xoops_isowner` | Pengguna memiliki kandungan semasa (boolean) |### Akses Sifat Objek Pengguna
```
Smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## Pembolehubah ModulDalam templat modul:| Pembolehubah | Penerangan |
|----------|-------------|
| `$xoops_dirname` | Nama direktori modul |
| `$xoops_modulename` | Nama paparan modul |
| `$mod_url` | URL modul (apabila diberikan) |### Corak Templat Modul Biasa
```
php
// In PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```
```
Smarty
{* In template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```
## Pembolehubah SekatSetiap blok dalam `$xoops_lblocks`, `$xoops_rblocks` dan `$xoops_cblocks` mempunyai:| Hartanah | Penerangan |
|----------|-------------|
| `$block.id` | ID Sekat |
| `$block.title` | Sekat tajuk |
| `$block.content` | Sekat kandungan HTML |
| `$block.template` | Sekat nama templat |
| `$block.module` | Nama modul |
| `$block.weight` | Sekat weight/order |### Contoh Paparan Blok
```
Smarty
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
## Pembolehubah BentukApabila menggunakan kelas XoopsForm:
```
php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```
```
Smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```
## Pembolehubah Penomboran
```
php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```
```
Smarty
{* Template *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
## Menetapkan Pembolehubah Tersuai### Nilai Mudah
```
php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```
```
Smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```
### Tatasusunan
```
php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```
```
Smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```
### Objek
```
php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Or for XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```
```
Smarty
{* Array access *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Object method access *}
<h2><{$item_obj->getVar('title')}></h2>
```
### Tatasusunan Bersarang
```
php
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
```
Smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```
## Pembolehubah Terbina Dalam Pintar### $Smarty.kiniCap masa semasa:
```
Smarty
<p>Current year: <{$Smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$Smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$Smarty.now|date_format:"%H:%M:%S"}></p>
```
### $Smarty.constAkses pemalar PHP:
```
Smarty
<p>XOOPS URL: <{$Smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$Smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$Smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $Smarty.get, $Smarty.post, $Smarty.requestPembolehubah permintaan akses (gunakan dengan berhati-hati):
```
Smarty
{* Only for reading, always escape output! *}
<{if $Smarty.get.page}>
    Page: <{$Smarty.get.page|escape}>
<{/if}>
```
### $Smarty.pelayanPembolehubah pelayan:
```
Smarty
<p>Server: <{$Smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$Smarty.server.REQUEST_URI|escape}></p>
```
### $Smarty.foreachMaklumat gelung:
```
Smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$Smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$Smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $Smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $Smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$Smarty.foreach.itemloop.total}>
<{/foreach}>
```
## Pembolehubah Pembantu XMFApabila menggunakan XMF, pembantu tambahan tersedia:
```
php
// In PHP
use XMF\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```
```
Smarty
{* In template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```
## Imej dan URL Aset
```
Smarty
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
## Paparan Bersyarat Berdasarkan Pengguna
```
Smarty
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
## Pembolehubah Bahasa
```
php
// In PHP - load language file
xoops_loadLanguage('main', 'mymodule');

// Assign language constants
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```
```
Smarty
{* In template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```
Atau gunakan pemalar secara langsung:
```
Smarty
<h1><{$Smarty.const._MD_MYMODULE_TITLE}></h1>
```
## Penyahpepijatan PembolehubahUntuk melihat semua pembolehubah yang tersedia:
```
Smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#Smarty #templates #variables #XOOPS #reference