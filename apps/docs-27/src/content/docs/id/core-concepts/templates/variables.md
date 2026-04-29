---
title: "Variabel template"
description: "Variabel Smarty tersedia di template XOOPS"
---

XOOPS secara otomatis menyediakan banyak variabel ke template Smarty. Referensi ini mendokumentasikan variabel yang tersedia untuk pengembangan template theme dan module.

## Dokumentasi Terkait

- Smarty-Dasar - Dasar-dasar Smarty di XOOPS
- Pengembangan theme - Membuat theme XOOPS
- Smarty-4-Migrasi - Peningkatan dari Smarty 3 ke 4

## Variabel theme Global

Variabel-variabel ini tersedia di template theme (`theme.tpl`):

### Informasi Situs

| Variabel | Deskripsi | Contoh |
|----------|-------------|---------|
| `$xoops_sitename` | Nama situs dari preferensi | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Judul halaman saat ini | `"Welcome"` |
| `$xoops_slogan` | Slogan situs | `"Just Use It!"` |
| `$xoops_url` | XOOPS URL Penuh | `"https://example.com"` |
| `$xoops_langcode` | Kode bahasa | `"en"` |
| `$xoops_charset` | Kumpulan karakter | `"UTF-8"` |

### Tag Meta

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_meta_keywords` | Kata kunci meta |
| `$xoops_meta_description` | Deskripsi meta |
| `$xoops_meta_robots` | Tag meta robot |
| `$xoops_meta_rating` | Peringkat konten |
| `$xoops_meta_author` | Tag meta penulis |
| `$xoops_meta_copyright` | Pemberitahuan hak cipta |

### Informasi theme

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_theme` | Nama theme saat ini |
| `$xoops_imageurl` | Direktori gambar theme URL |
| `$xoops_themecss` | theme utama CSS file URL |
| `$xoops_icons32_url` | Ikon 32x32 URL |
| `$xoops_icons16_url` | Ikon 16x16 URL |

### Konten Halaman

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_contents` | Konten halaman utama |
| `$xoops_module_header` | Konten kepala khusus module |
| `$xoops_footer` | Konten catatan kaki |
| `$xoops_js` | JavaScript untuk memasukkan |

### Navigasi dan Menu

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_mainmenu` | Menu navigasi utama |
| `$xoops_usermenu` | Menu pengguna |

### Blokir Variabel

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_lblocks` | Array block kiri |
| `$xoops_rblocks` | Array block kanan |
| `$xoops_cblocks` | Array block tengah |
| `$xoops_showlblock` | Tampilkan block kiri (boolean) |
| `$xoops_showrblock` | Tampilkan block kanan (boolean) |
| `$xoops_showcblock` | Tampilkan block tengah (boolean) |

## Variabel Pengguna

Saat pengguna masuk:

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_isuser` | Pengguna masuk (boolean) |
| `$xoops_isadmin` | Pengguna adalah admin (boolean) |
| `$xoops_userid` | ID Pengguna |
| `$xoops_uname` | Nama pengguna |
| `$xoops_isowner` | Pengguna memiliki konten saat ini (boolean) |

### Akses Properti Objek Pengguna

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Variabel module

Dalam template module:

| Variabel | Deskripsi |
|----------|-------------|
| `$xoops_dirname` | Nama direktori module |
| `$xoops_modulename` | Nama tampilan module |
| `$mod_url` | module URL (bila ditugaskan) |

### Pola template module Umum

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

## Blokir Variabel

Setiap block di `$xoops_lblocks`, `$xoops_rblocks`, dan `$xoops_cblocks` memiliki:

| Properti | Deskripsi |
|----------|-------------|
| `$block.id` | Blokir ID |
| `$block.title` | Blokir judul |
| `$block.content` | Blokir konten HTML |
| `$block.template` | Blokir nama template |
| `$block.module` | Nama module |
| `$block.weight` | Blokir weight/order |

### Contoh Tampilan Blokir

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

## Variabel Bentuk

Saat menggunakan kelas XoopsForm:

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

## Variabel Penomoran Halaman

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

## Menetapkan Variabel Khusus

### Nilai Sederhana

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

### Array

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

### Objek

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

### Array Bersarang

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

## Smarty Variabel Bawaan

### $smarty.sekarang

Stempel waktu saat ini:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $smarty.const

Akses konstanta PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.dapatkan, $smarty.posting, $smarty.permintaan

Variabel permintaan akses (gunakan dengan hati-hati):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Variabel server:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informasi lingkaran:

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

## XMF Variabel Pembantu

Saat menggunakan XMF, tersedia pembantu tambahan:

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

## URL Gambar dan Aset

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

## Tampilan Bersyarat Berdasarkan Pengguna

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

## Variabel Bahasa

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

Atau gunakan konstanta secara langsung:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Men-debug Variabel

Untuk melihat semua variabel yang tersedia:

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
