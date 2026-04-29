---
title: "Proměnné šablony"
description: "Dostupné proměnné Smarty v šablonách XOOPS"
---

XOOPS automaticky poskytuje mnoho proměnných šablonám Smarty. Tento odkaz dokumentuje dostupné proměnné pro vývoj šablony motivu a modulu.

## Související dokumentace

- Smarty-Základy - Základy Smarty v XOOPS
- Vývoj motivů - Vytváření motivů XOOPS
- Smarty-4-Migration - Upgrade ze Smarty 3 na 4

## Proměnné globálního tématu

Tyto proměnné jsou dostupné v šablonách motivů (`theme.tpl`):

### Informace o webu

| Proměnná | Popis | Příklad |
|----------|-------------|---------|
| `$xoops_sitename` | Název webu z předvoleb | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Název aktuální stránky | `"Welcome"` |
| `$xoops_slogan` | Slogan stránky | `"Just Use It!"` |
| `$xoops_url` | Kompletní XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Kód jazyka | `"en"` |
| `$xoops_charset` | Sada znaků | `"UTF-8"` |

### Meta tagy

| Proměnná | Popis |
|----------|-------------|
| `$xoops_meta_keywords` | Meta klíčová slova |
| `$xoops_meta_description` | Meta popis |
| `$xoops_meta_robots` | Meta tag roboti |
| `$xoops_meta_rating` | Hodnocení obsahu |
| `$xoops_meta_author` | Meta tag autora |
| `$xoops_meta_copyright` | Informace o autorských právech |

### Informace o tématu

| Proměnná | Popis |
|----------|-------------|
| `$xoops_theme` | Název aktuálního tématu |
| `$xoops_imageurl` | Adresář obrázků motivů URL |
| `$xoops_themecss` | Hlavní motiv CSS soubor URL |
| `$xoops_icons32_url` | 32x32 ikon URL |
| `$xoops_icons16_url` | 16x16 ikon URL |

### Obsah stránky

| Proměnná | Popis |
|----------|-------------|
| `$xoops_contents` | Hlavní obsah stránky |
| `$xoops_module_header` | Obsah hlavy specifický pro modul |
| `$xoops_footer` | Obsah zápatí |
| `$xoops_js` | JavaScript pro zahrnutí |

### Navigace a nabídky

| Proměnná | Popis |
|----------|-------------|
| `$xoops_mainmenu` | Hlavní navigační menu |
| `$xoops_usermenu` | Uživatelské menu |

### Blokovat proměnné

| Proměnná | Popis |
|----------|-------------|
| `$xoops_lblocks` | Pole levých bloků |
| `$xoops_rblocks` | Pole pravých bloků |
| `$xoops_cblocks` | Pole středových bloků |
| `$xoops_showlblock` | Zobrazit levé bloky (booleovské) |
| `$xoops_showrblock` | Zobrazit pravé bloky (booleovské) |
| `$xoops_showcblock` | Zobrazit středové bloky (booleovské) |

## Uživatelské proměnné

Když je uživatel přihlášen:

| Proměnná | Popis |
|----------|-------------|
| `$xoops_isuser` | Uživatel je přihlášen (logická hodnota) |
| `$xoops_isadmin` | Uživatel je admin (booleovský) |
| `$xoops_userid` | ID uživatele |
| `$xoops_uname` | Uživatelské jméno |
| `$xoops_isowner` | Uživatel vlastní aktuální obsah (logická hodnota) |

### Přístup k vlastnostem objektu uživatele

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Modulové proměnné

V šablonách modulů:

| Proměnná | Popis |
|----------|-------------|
| `$xoops_dirname` | Název adresáře modulu |
| `$xoops_modulename` | Zobrazovaný název modulu |
| `$mod_url` | Modul URL (je-li přiřazen) |

### Vzor šablony společného modulu

```php
// In PHP
$helper = \XOOPSModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## Blokovat proměnné

Každý blok v `$xoops_lblocks`, `$xoops_rblocks` a `$xoops_cblocks` má:

| Nemovitost | Popis |
|----------|-------------|
| `$block.id` | ID bloku |
| `$block.title` | Název bloku |
| `$block.content` | Obsah bloku HTML |
| `$block.template` | Název šablony bloku |
| `$block.module` | Název modulu |
| `$block.weight` | Blok weight/order |

### Příklad zobrazení bloku

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

## Proměnné formuláře

Při použití tříd XOOPSForm:

```php
// PHP
$form = new XOOPSThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XOOPSFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```

## Proměnné stránkování

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XOOPSPageNav($total, $limit, $start, 'start');
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

## Přiřazení vlastních proměnných

### Jednoduché hodnoty

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

### Pole

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

### Objekty

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Or for XOOPSObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Array access *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Object method access *}
<h2><{$item_obj->getVar('title')}></h2>
```

### Vnořená pole

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

## Smarty Vestavěné proměnné

### $smarty.nyní

Aktuální časové razítko:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.konst

Přístup ke konstantám PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Proměnné požadavku na přístup (používejte opatrně):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Proměnné serveru:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informace o smyčce:

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

## Pomocné proměnné XMFPři použití XMF jsou k dispozici další pomocníci:

```php
// In PHP
use XMF\Module\Helper;

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

## Adresy URL obrázků a podkladů

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

## Podmíněné zobrazení na základě uživatele

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

## Jazykové proměnné

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

Nebo použijte konstanty přímo:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Ladění proměnných

Chcete-li zobrazit všechny dostupné proměnné:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#chytré #šablony #proměnné #xoops #odkaz