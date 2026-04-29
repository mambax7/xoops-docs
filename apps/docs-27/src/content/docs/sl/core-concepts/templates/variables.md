---
title: "Spremenljivke predloge"
description: "Spremenljivke Smarty so na voljo v XOOPS predlogah"
---
XOOPS samodejno zagotovi številne spremenljivke predlogam Smarty. Ta referenca dokumentira razpoložljive spremenljivke za razvoj tem in predlog modulov.

## Povezana dokumentacija

- Osnove Smarty - Osnove Smarty v XOOPS
- Razvoj tem - Ustvarjanje XOOPS tem
- Smarty-4-Migration - Nadgradnja s Smarty 3 na 4

## Globalne spremenljivke teme

Te spremenljivke so na voljo v predlogah tem (`theme.tpl`):

### Informacije o mestu

| Spremenljivka | Opis | Primer |
|----------|-------------|---------|
| `$xoops_sitename` | Ime mesta iz nastavitev | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Naslov trenutne strani | `"Welcome"` |
| `$xoops_slogan` | Slogan spletnega mesta | `"Just Use It!"` |
| `$xoops_url` | Celotno XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Koda jezika | `"en"` |
| `$xoops_charset` | Nabor znakov | `"UTF-8"` |

### Meta oznake

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_meta_keywords` | Meta ključne besede |
| `$xoops_meta_description` | Meta opis |
| `$xoops_meta_robots` | Meta oznaka robotov |
| `$xoops_meta_rating` | Ocena vsebine |
| `$xoops_meta_author` | Meta oznaka avtorja |
| `$xoops_meta_copyright` | Obvestilo o avtorskih pravicah |

### Informacije o temi| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_theme` | Ime trenutne teme |
| `$xoops_imageurl` | Imenik tematskih slik URL |
| `$xoops_themecss` | Glavna tema CSS datoteka URL |
| `$xoops_icons32_url` | Ikone 32x32 URL |
| `$xoops_icons16_url` | Ikone 16x16 URL |

### Vsebina strani

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_contents` | Vsebina glavne strani |
| `$xoops_module_header` | Vsebina glave, specifična za modul |
| `$xoops_footer` | Vsebina noge |
| `$xoops_js` | JavaScript za vključitev |

### Navigacija in meniji

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_mainmenu` | Glavni navigacijski meni |
| `$xoops_usermenu` | Uporabniški meni |

### Spremenljivke bloka

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_lblocks` | Niz levih blokov |
| `$xoops_rblocks` | Niz desnih blokov |
| `$xoops_cblocks` | Niz sredinskih blokov |
| `$xoops_showlblock` | Pokaži leve bloke (boolean) |
| `$xoops_showrblock` | Pokaži desne bloke (boolean) |
| `$xoops_showcblock` | Pokaži sredinske bloke (boolean) |

## Uporabniške spremenljivke

Ko je uporabnik prijavljen:

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_isuser` | Uporabnik je prijavljen (boolean) |
| `$xoops_isadmin` | Uporabnik je skrbnik (boolean) |
| `$xoops_userid` | ID uporabnika |
| `$xoops_uname` | Uporabniško ime |
| `$xoops_isowner` | Uporabnik je lastnik trenutne vsebine (boolean) |### Dostop do lastnosti uporabniškega objekta
```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```
## Spremenljivke modula

V predlogah modulov:

| Spremenljivka | Opis |
|----------|-------------|
| `$xoops_dirname` | Ime imenika modula |
| `$xoops_modulename` | Prikazno ime modula |
| `$mod_url` | Modul URL (če je dodeljen) |

### Skupni vzorec predloge modula
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
## Blokiraj spremenljivke

Vsak blok v `$xoops_lblocks`, `$xoops_rblocks` in `$xoops_cblocks` ima:

| Lastnina | Opis |
|----------|-------------|
| `$block.id` | ID bloka |
| `$block.title` | Naslov bloka |
| `$block.content` | Blokiraj HTML vsebino |
| `$block.template` | Ime predloge bloka |
| `$block.module` | Ime modula |
| `$block.weight` | Blokiraj weight/order |

### Primer blokovnega prikaza
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
## Spremenljivke obrazca

Pri uporabi razredov XoopsForm:
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
## Spremenljivke strani
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
## Dodeljevanje spremenljivk po meri

### Preproste vrednote
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
### Nizi
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
### Predmeti
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
### Ugnezdeni nizi
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
## Vgrajene spremenljivke Smarty

### $Smarty.zdaj

Trenutni časovni žig:
```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```
### $Smarty.konst

Dostop do PHP konstant:
```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```
### $Smarty.get, $Smarty.post, $Smarty.request

Spremenljivke zahteve za dostop (uporabljajte previdno):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```
### $Smarty.strežnik

Spremenljivke strežnika:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```
### $Smarty.foreach

Informacije o zanki:
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
## XMF Pomožne spremenljivke

Pri uporabi XMF so na voljo dodatni pomočniki:
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
## URL-ji slik in sredstev
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
## Pogojni prikaz glede na uporabnika
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
## Spremenljivke jezika
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
Ali pa neposredno uporabite konstante:
```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```
## Spremenljivke za odpravljanje napak

Za ogled vseh razpoložljivih spremenljivk:
```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```
---

#Smarty #templates #variables #XOOPS #reference