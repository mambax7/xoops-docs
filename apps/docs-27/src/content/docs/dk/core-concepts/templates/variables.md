---
title: "Skabelonvariabler"
description: "Tilgængelige Smarty-variabler i XOOPS-skabeloner"
---

XOOPS giver automatisk mange variabler til Smarty-skabeloner. Denne reference dokumenterer de tilgængelige variabler til udvikling af tema- og modulskabeloner.

## Relateret dokumentation

- Smarty-Basics - Fundamentals of Smarty i XOOPS
- Temaudvikling - Oprettelse af XOOPS-temaer
- Smarty-4-Migration - Opgradering fra Smarty 3 til 4

## Globale temavariabler

Disse variabler er tilgængelige i temaskabeloner (`theme.tpl`):

### Site Information

| Variabel | Beskrivelse | Eksempel |
|--------|-------------|--------|
| `$xoops_sitename` | Webstedets navn fra præferencer | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Aktuel sidetitel | `"Welcome"` |
| `$xoops_slogan` | Site slogan | `"Just Use It!"` |
| `$xoops_url` | Fuld XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Sprogkode | `"en"` |
| `$xoops_charset` | Tegnsæt | `"UTF-8"` |

### Metatags

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_meta_keywords` | Meta søgeord |
| `$xoops_meta_description` | Meta beskrivelse |
| `$xoops_meta_robots` | Robots metatag |
| `$xoops_meta_rating` | Indholdsvurdering |
| `$xoops_meta_author` | Forfatter metatag |
| `$xoops_meta_copyright` | Ophavsretsmeddelelse |

### Temaoplysninger

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_theme` | Aktuelt temanavn |
| `$xoops_imageurl` | Temabilleder bibliotek URL |
| `$xoops_themecss` | Hovedtema CSS fil URL |
| `$xoops_icons32_url` | 32x32 ikoner URL |
| `$xoops_icons16_url` | 16x16 ikoner URL |

### Sideindhold

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_contents` | Hovedsideindhold |
| `$xoops_module_header` | Modulspecifikt hovedindhold |
| `$xoops_footer` | Sidefod indhold |
| `$xoops_js` | JavaScript at inkludere |

### Navigation og menuer

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_mainmenu` | Hovednavigationsmenu |
| `$xoops_usermenu` | Brugermenu |

### Blokvariabler

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_lblocks` | Array af venstre blokke |
| `$xoops_rblocks` | Array af højre blokke |
| `$xoops_cblocks` | Array af midterblokke |
| `$xoops_showlblock` | Vis venstre blokke (boolesk) |
| `$xoops_showrblock` | Vis højre blokke (boolesk) |
| `$xoops_showcblock` | Vis midterblokke (boolesk) |

## Brugervariabler

Når en bruger er logget ind:

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_isuser` | Bruger er logget ind (boolesk) |
| `$xoops_isadmin` | Brugeren er admin (boolesk) |
| `$xoops_userid` | Bruger ID |
| `$xoops_uname` | Brugernavn |
| `$xoops_isowner` | Brugeren ejer aktuelt indhold (boolesk) |

### Få adgang til brugerobjektegenskaber

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Modulvariabler

I modulskabeloner:

| Variabel | Beskrivelse |
|--------|-------------|
| `$xoops_dirname` | Modulkatalognavn |
| `$xoops_modulename` | Modulets visningsnavn |
| `$mod_url` | Modul URL (når tildelt) |

### Fælles modulskabelonmønster

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

## Blokvariabler

Hver blok i `$xoops_lblocks`, `$xoops_rblocks` og `$xoops_cblocks` har:

| Ejendom | Beskrivelse |
|--------|-------------|
| `$block.id` | Bloker ID |
| `$block.title` | Blok titel |
| `$block.content` | Bloker HTML indhold |
| `$block.template` | Bloker skabelonnavn |
| `$block.module` | Modulnavn |
| `$block.weight` | Blokvægt/orden |

### Eksempel på blokvisning

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

## Formvariabler

Når du bruger XoopsForm klasser:

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

## Pagineringsvariabler

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

## Tildeling af brugerdefinerede variabler

### Simple værdier

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

### Arrays

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

### Objekter

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

### Indlejrede arrays

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

## Smarte indbyggede variabler

### $smarty.nu

Aktuelt tidsstempel:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Få adgang til PHP konstanter:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Adgangsanmodningsvariabler (brug med forsigtighed):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Servervariabler:
```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Loop information:

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

## XMF Hjælpevariabler

Når du bruger XMF, er yderligere hjælpere tilgængelige:

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

## Billed- og aktivwebadresser

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

## Betinget visning baseret på bruger

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

## Sprogvariabler

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

Eller brug konstanter direkte:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Fejlretning af variabler

For at se alle tilgængelige variabler:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #skabeloner #variabler #xoops #reference
