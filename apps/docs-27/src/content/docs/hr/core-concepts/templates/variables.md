---
title: "Varijable predloška"
description: "Dostupne varijable Smarty u XOOPS templates"
---
XOOPS automatski daje mnoge varijable za Smarty templates. Ova referenca dokumentira dostupne varijable za razvoj predložaka teme i modula.

## Povezana dokumentacija

- Smarty-Osnove - Osnove Smarty u XOOPS
- Razvoj teme - Stvaranje XOOPS themes
- Smarty-4-Migracija - Nadogradnja sa Smarty 3 na 4

## Globalne varijable teme

Ove varijable dostupne su u temi templates (`theme.tpl`):

### Informacije o stranici

| Varijabla | Opis | Primjer |
|----------|-------------|---------|
| `$xoops_sitename` | Naziv stranice iz postavki | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Naslov trenutne stranice | `"Welcome"` |
| `$xoops_slogan` | Slogan stranice | `"Just Use It!"` |
| `$xoops_url` | Cijeli XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | Kod jezika | `"en"` |
| `$xoops_charset` | Skup znakova | `"UTF-8"` |

### Meta oznake

| Varijabla | Opis |
|----------|-------------|
| `$xoops_meta_keywords` | Meta ključne riječi |
| `$xoops_meta_description` | Meta opis |
| `$xoops_meta_robots` | Meta oznaka robota |
| `$xoops_meta_rating` | Ocjena sadržaja |
| `$xoops_meta_author` | Meta oznaka autora |
| `$xoops_meta_copyright` | Obavijest o autorskim pravima |

### Informacije o temi

| Varijabla | Opis |
|----------|-------------|
| `$xoops_theme` | Naziv trenutne teme |
| `$xoops_imageurl` | Direktorij tematskih slika URL |
| `$xoops_themecss` | Glavna tema CSS datoteka URL |
| `$xoops_icons32_url` | 32x32 ikone URL |
| `$xoops_icons16_url` | 16x16 ikone URL |

### Sadržaj stranice

| Varijabla | Opis |
|----------|-------------|
| `$xoops_contents` | Sadržaj glavne stranice |
| `$xoops_module_header` | Sadržaj glave specifičan za modul |
| `$xoops_footer` | Sadržaj podnožja |
| `$xoops_js` | JavaScript do include |

### Navigacija i izbornici

| Varijabla | Opis |
|----------|-------------|
| `$xoops_mainmenu` | Glavni navigacijski izbornik |
| `$xoops_usermenu` | Korisnički izbornik |

### Varijable bloka

| Varijabla | Opis |
|----------|-------------|
| `$xoops_lblocks` | Niz lijevih blokova |
| `$xoops_rblocks` | Niz desnih blokova |
| `$xoops_cblocks` | Niz središnjih blokova |
| `$xoops_showlblock` | Prikaži lijeve blokove (booleov) |
| `$xoops_showrblock` | Prikaži desne blokove (booleov) |
| `$xoops_showcblock` | Prikaži središnje blokove (booleov) |

## Korisničke varijable

Kada je korisnik prijavljen:

| Varijabla | Opis |
|----------|-------------|
| `$xoops_isuser` | Korisnik je prijavljen (boolean) |
| `$xoops_isadmin` | Korisnik je admin (booleov) |
| `$xoops_userid` | ID korisnika |
| `$xoops_uname` | Korisničko ime |
| `$xoops_isowner` | Korisnik posjeduje trenutni sadržaj (booleov) |

### Pristup svojstvima korisničkog objekta

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Varijable modula

U modulu templates:

| Varijabla | Opis |
|----------|-------------|
| `$xoops_dirname` | Naziv direktorija modula |
| `$xoops_modulename` | Naziv za prikaz modula |
| `$mod_url` | modul URL (kada je dodijeljen) |

### Uzorak zajedničkog predloška modula

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

## Varijable blokaSvaki blok u `$xoops_lblocks`, `$xoops_rblocks` i `$xoops_cblocks` ima:

| Vlasništvo | Opis |
|----------|-------------|
| `$block.id` | ID bloka |
| `$block.title` | Naslov bloka |
| `$block.content` | Blokirajte HTML sadržaj |
| `$block.template` | Naziv predloška bloka |
| `$block.module` | Naziv modula |
| `$block.weight` | Težina bloka/narudžba |

### Primjer blok prikaza

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

## Varijable obrasca

Kada koristite XoopsForm classes:

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

## Varijable paginacije

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

## Dodjeljivanje prilagođenih varijabli

### Jednostavne vrijednosti

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

### Nizovi

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

### Objekti

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

### Ugniježđeni nizovi

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

## Smarty Ugrađene varijable

### $smarty.sada

Trenutačna vremenska oznaka:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.konst

Pristup PHP konstantama:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Varijable zahtjeva za pristup (koristite s oprezom):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.poslužitelj

Varijable poslužitelja:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informacije o petlji:

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

## XMF Pomoćne varijable

Kada koristite XMF, dostupni su dodatni pomoćnici:

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

## URL-ovi slika i sredstava

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

## Uvjetni prikaz na temelju korisnika

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

## Jezične varijable

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

Ili izravno upotrijebite konstante:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Varijable za otklanjanje pogrešaka

Da biste vidjeli sve dostupne varijable:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#pametan #templates #varijable #xoops #referenca
