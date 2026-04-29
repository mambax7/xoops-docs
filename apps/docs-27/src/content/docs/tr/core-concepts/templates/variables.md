---
title: "template Değişkenleri"
description: "XOOPS şablonlarında mevcut Smarty değişkenleri"
---
XOOPS, Smarty şablonlarına birçok değişkeni otomatik olarak sağlar. Bu referans, theme ve module şablonu geliştirme için mevcut değişkenleri belgelemektedir.

## İlgili Belgeler

- Smarty-Basics - XOOPS'de Smarty'nin temelleri
- theme Geliştirme - XOOPS temaları oluşturma
- Smarty-4-Migration - Smarty 3'ten 4'e yükseltme

## Genel theme Değişkenleri

Bu değişkenler theme şablonlarında mevcuttur (`theme.tpl`):

### Site Bilgileri

| Değişken | Açıklama | Örnek |
|----------|----------------|-----------|
| `$xoops_sitename` | Tercihlerden site adı | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Geçerli sayfa başlığı | `"Welcome"` |
| `$xoops_slogan` | Site sloganı | `"Just Use It!"` |
| `$xoops_url` | Tam XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Dil kodu | `"en"` |
| `$xoops_charset` | Karakter seti | `"UTF-8"` |

### Meta Etiketleri

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_meta_keywords` | Meta anahtar kelimeler |
| `$xoops_meta_description` | Meta açıklaması |
| `$xoops_meta_robots` | Robotlar meta etiketi |
| `$xoops_meta_rating` | İçerik derecelendirmesi |
| `$xoops_meta_author` | Yazar meta etiketi |
| `$xoops_meta_copyright` | Telif hakkı bildirimi |

### theme Bilgileri

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_theme` | Geçerli theme adı |
| `$xoops_imageurl` | theme görselleri dizini URL |
| `$xoops_themecss` | Ana theme CSS dosya URL |
| `$xoops_icons32_url` | 32x32 simgeler URL |
| `$xoops_icons16_url` | 16x16 simgeler URL |

### Sayfa İçeriği

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_contents` | Ana sayfa içeriği |
| `$xoops_module_header` | Modüle özel başlık içeriği |
| `$xoops_footer` | Altbilgi içeriği |
| `$xoops_js` | JavaScript dahil edilecek |

### Gezinme ve Menüler

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_mainmenu` | Ana gezinme menüsü |
| `$xoops_usermenu` | user menüsü |

### Blok Değişkenleri

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_lblocks` | Sol blok dizisi |
| `$xoops_rblocks` | Sağ blok dizisi |
| `$xoops_cblocks` | Orta blok dizisi |
| `$xoops_showlblock` | Sol blokları göster (boolean) |
| `$xoops_showrblock` | Sağ blokları göster (boolean) |
| `$xoops_showcblock` | Orta blokları göster (boolean) |

## user Değişkenleri

Bir user oturum açtığında:

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_isuser` | user oturum açtı (boolean) |
| `$xoops_isadmin` | user admin (boolean) |
| `$xoops_userid` | user Kimliği |
| `$xoops_uname` | user adı |
| `$xoops_isowner` | user mevcut içeriğin sahibidir (boolean) |

### user Nesnesi Özelliklerine Erişim
```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## module Değişkenleri

module şablonlarında:

| Değişken | Açıklama |
|----------|----------------|
| `$xoops_dirname` | module dizini adı |
| `$xoops_modulename` | module görünen adı |
| `$mod_url` | module URL (atandığında) |

### Ortak module Şablonu Deseni
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
## Değişkenleri Blokla

`$xoops_lblocks`, `$xoops_rblocks` ve `$xoops_cblocks`'deki her blokta şunlar bulunur:

| Emlak | Açıklama |
|----------|----------------|
| `$block.id` | Blok Kimliği |
| `$block.title` | Blok başlığı |
| `$block.content` | HTML içeriğini engelle |
| `$block.template` | template adını engelle |
| `$block.module` | module adı |
| `$block.weight` | Blok weight/order |

### Blok Görüntüleme Örneği
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
## Form Değişkenleri

XoopsForm sınıflarını kullanırken:
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
## Sayfalandırma Değişkenleri
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
## Özelleştirilebilen Değişkenler Atama

### Basit Değerler
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
### Diziler
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
### Nesneler
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
### İç İçe Diziler
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
## Smarty Yerleşik Değişkenler

### $smarty.now

Geçerli zaman damgası:
```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $smarty.const

PHP sabitlerine erişin:
```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $smarty.get, $smarty.post, $smarty.request

Erişim isteği değişkenleri (dikkatli kullanın):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```
### $smarty.sunucu

Sunucu değişkenleri:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```
### $smarty.foreach

Döngü bilgisi:
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
## XMF Yardımcı Değişkenler

XMF kullanıldığında ek yardımcılar mevcuttur:
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
## Resim ve Varlık URLs
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
## Kullanıcıya Göre Koşullu Görüntüleme
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
## Dil Değişkenleri
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
Veya sabitleri doğrudan kullanın:
```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```
## Değişkenlerde Hata Ayıklama

Mevcut tüm değişkenleri görmek için:
```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#Smarty #templates #değişkenler #xoops #referans