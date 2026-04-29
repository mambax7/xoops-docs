---
title: "Sjabloonvariabelen"
description: "Beschikbare Smarty-variabelen in XOOPS-sjablonen"
---
XOOPS levert automatisch veel variabelen aan Smarty-sjablonen. Deze referentie documenteert de beschikbare variabelen voor de ontwikkeling van thema- en modulesjablonen.

## Gerelateerde documentatie

- Smarty-Basics - Grondbeginselen van Smarty in XOOPS
- Thema-ontwikkeling - XOOPS-thema's maken
- Smarty-4-Migration - Upgraden van Smarty 3 naar 4

## Globale themavariabelen

Deze variabelen zijn beschikbaar in themasjablonen (`theme.tpl`):

### Site-informatie

| Variabel | Beschrijving | Voorbeeld |
|----------|-------------|---------|
| `$xoops_sitename` | Sitenaam uit voorkeuren | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Huidige paginatitel | `"Welcome"` |
| `$xoops_slogan` | Siteslogan | `"Just Use It!"` |
| `$xoops_url` | Volledig XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Taalcode | `"en"` |
| `$xoops_charset` | Tekenset | `"UTF-8"` |

### Metatags

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_meta_keywords` | Meta-trefwoorden |
| `$xoops_meta_description` | Metabeschrijving |
| `$xoops_meta_robots` | Robots-metatag |
| `$xoops_meta_rating` | Inhoudsbeoordeling |
| `$xoops_meta_author` | Metatag van auteur |
| `$xoops_meta_copyright` | Copyrightvermelding |

### Thema-informatie

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_theme` | Huidige themanaam |
| `$xoops_imageurl` | Map met themaafbeeldingen URL |
| `$xoops_themecss` | Hoofdthema CSS bestand URL |
| `$xoops_icons32_url` | 32x32 pictogrammen URL |
| `$xoops_icons16_url` | 16x16 pictogrammen URL |

### Pagina-inhoud

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_contents` | Inhoud hoofdpagina |
| `$xoops_module_header` | Modulespecifieke hoofdinhoud |
| `$xoops_footer` | Voettekstinhoud |
| `$xoops_js` | JavaScript om op te nemen |

### Navigatie en menu's

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_mainmenu` | Hoofdnavigatiemenu |
| `$xoops_usermenu` | Gebruikersmenu |

### Blokvariabelen

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_lblocks` | Array van linkerblokken |
| `$xoops_rblocks` | Array van juiste blokken |
| `$xoops_cblocks` | Array van middenblokken |
| `$xoops_showlblock` | Linkerblokken weergeven (Boolean) |
| `$xoops_showrblock` | Toon rechterblokken (Boolean) |
| `$xoops_showcblock` | Middenblokken weergeven (Boolean) |

## Gebruikersvariabelen

Wanneer een gebruiker is ingelogd:

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_isuser` | Gebruiker is ingelogd (booleaans) |
| `$xoops_isadmin` | Gebruiker is beheerder (booleaans) |
| `$xoops_userid` | Gebruikers-ID |
| `$xoops_uname` | Gebruikersnaam |
| `$xoops_isowner` | Gebruiker is eigenaar van huidige inhoud (Boolean) |

### Toegang tot eigenschappen van gebruikersobjecten

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Modulevariabelen

In modulesjablonen:

| Variabel | Beschrijving |
|----------|------------|
| `$xoops_dirname` | Naam modulemap |
| `$xoops_modulename` | Moduleweergavenaam |
| `$mod_url` | Module URL (indien toegewezen) |

### Gemeenschappelijk modulesjabloonpatroon

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

## Blokvariabelen

Elk blok in `$xoops_lblocks`, `$xoops_rblocks` en `$xoops_cblocks` heeft:

| Eigendom | Beschrijving |
|----------|------------|
| `$block.id` | Blok-ID |
| `$block.title` | Bloktitel |
| `$block.content` | HTML-inhoud blokkeren |
| `$block.template` | Naam bloksjabloon |
| `$block.module` | Modulenaam |
| `$block.weight` | Blokgewicht/bestelling |

### Voorbeeld van blokweergave

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

## Vormvariabelen

Bij gebruik van XoopsForm-klassen:

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

## Pagineringsvariabelen

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

## Aangepaste variabelen toewijzen

### Eenvoudige waarden

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

### Objecten

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

### Geneste arrays

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

## Slimme ingebouwde variabelen

### $smarty.nu

Huidige tijdstempel:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Toegang tot PHP-constanten:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Variabelen van toegangsverzoeken (gebruik met voorzichtigheid):
```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Servervariabelen:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Lusinformatie:

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

## XMF Helpervariabelen

Bij gebruik van XMF zijn extra helpers beschikbaar:

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

## Afbeeldings- en item-URL's

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

## Voorwaardelijke weergave op basis van gebruiker

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

## Taalvariabelen

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

Of gebruik constanten rechtstreeks:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Fouten opsporen in variabelen

Om alle beschikbare variabelen te zien:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#Smarty #templates #variabelen #xoops #referentie