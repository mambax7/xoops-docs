---
title: "Sablonváltozók"
description: "Elérhető Smarty-változók XOOPS-sablonokban"
---
A XOOPS automatikusan számos változót biztosít a Smarty sablonokhoz. Ez a referencia a téma- és modulsablonok fejlesztéséhez rendelkezésre álló változókat dokumentálja.

## Kapcsolódó dokumentáció

- Smarty-alapok - A Smarty alapjai XOOPS-ban
- Témafejlesztés - XOOPS témák létrehozása
- Smarty-4-migráció - Frissítés Smarty 3-ról 4-re

## Globális témaváltozók

Ezek a változók témasablonokban érhetők el (`theme.tpl`):

### Webhely információ

| Változó | Leírás | Példa |
|----------|-------------|---------|
| `$xoops_sitename` | Webhely neve a beállításokból | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Az aktuális oldal címe | `"Welcome"` |
| `$xoops_slogan` | Az oldal szlogenje | `"Just Use It!"` |
| `$xoops_url` | Teljes XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Nyelvkód | `"en"` |
| `$xoops_charset` | Karakterkészlet | `"UTF-8"` |

### Metacímkék

| Változó | Leírás |
|----------|-------------|
| `$xoops_meta_keywords` | Meta kulcsszavak |
| `$xoops_meta_description` | Meta leírás |
| `$xoops_meta_robots` | Robots meta tag |
| `$xoops_meta_rating` | Tartalom értékelése |
| `$xoops_meta_author` | Szerző meta tag |
| `$xoops_meta_copyright` | Szerzői jogi megjegyzés |

### Téma információ

| Változó | Leírás |
|----------|-------------|
| `$xoops_theme` | Jelenlegi téma neve |
| `$xoops_imageurl` | Témaképek könyvtára URL |
| `$xoops_themecss` | Fő téma CSS fájl URL |
| `$xoops_icons32_url` | 32x32 ikonok URL |
| `$xoops_icons16_url` | 16x16 ikonok URL |

### Oldaltartalom

| Változó | Leírás |
|----------|-------------|
| `$xoops_contents` | Főoldal tartalma |
| `$xoops_module_header` | modulspecifikus fejtartalom |
| `$xoops_footer` | Lábléc tartalom |
| `$xoops_js` | JavaScript belefoglalva |

### Navigáció és menük

| Változó | Leírás |
|----------|-------------|
| `$xoops_mainmenu` | Fő navigációs menü |
| `$xoops_usermenu` | Felhasználói menü |

### Blokkváltozók

| Változó | Leírás |
|----------|-------------|
| `$xoops_lblocks` | Bal oldali blokkok tömbje |
| `$xoops_rblocks` | Jobb oldali blokkok tömbje |
| `$xoops_cblocks` | Központi blokkok tömbje |
| `$xoops_showlblock` | Bal oldali blokkok megjelenítése (logikai érték) |
| `$xoops_showrblock` | Jobb oldali blokkok megjelenítése (boolean) |
| `$xoops_showcblock` | Középső blokkok megjelenítése (boolean) |

## Felhasználói változók

Amikor egy felhasználó bejelentkezik:

| Változó | Leírás |
|----------|-------------|
| `$xoops_isuser` | A felhasználó bejelentkezett (logikai érték) |
| `$xoops_isadmin` | A felhasználó admin (logikai érték) |
| `$xoops_userid` | Felhasználó ID |
| `$xoops_uname` | Felhasználónév |
| `$xoops_isowner` | A felhasználó az aktuális tartalom tulajdonosa (logikai érték) |

### Hozzáférés a felhasználói objektum tulajdonságaihoz

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## modulváltozók

A modulsablonokban:

| Változó | Leírás |
|----------|-------------|
| `$xoops_dirname` | modul könyvtár neve |
| `$xoops_modulename` | modul megjelenített neve |
| `$mod_url` | URL modul (ha hozzá van rendelve) |

### Közös modulsablon minta

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

## Változók blokkolása

A `$xoops_lblocks`, `$xoops_rblocks` és `$xoops_cblocks` minden blokkja a következőket tartalmazza:

| Ingatlan | Leírás |
|----------|-------------|
| `$block.id` | Blokk ID |
| `$block.title` | Cím blokkolása |
| `$block.content` | A HTML tartalom blokkolása |
| `$block.template` | Sablonnév blokkolása |
| `$block.module` | modul neve |
| `$block.weight` | Blokk weight/order |

### Blokk megjelenítési példa

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

## Űrlapváltozók

XOOPSForm osztályok használatakor:

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

## Lapozási változók

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

## Egyéni változók hozzárendelése

### Egyszerű értékek

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

### Tömbök

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

### Objektumok

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

### Beágyazott tömbök

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

## Smarty beépített változók

### $smarty.most

Jelenlegi időbélyeg:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Hozzáférés a PHP konstansokhoz:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.requestHozzáférés kérési változókhoz (használja óvatosan):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.szerver

Szerver változók:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Hurok információ:

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

## XMF segédváltozók

A XMF használatakor további segítők állnak rendelkezésre:

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

## Kép és tartalom URL-jei

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

## Feltételes megjelenítés a felhasználó alapján

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

## Nyelvi változók

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

Vagy használjon konstansokat közvetlenül:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Hibakeresési változók

Az összes elérhető változó megtekintéséhez:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#okos #sablonok #változók #xoops #referencia
