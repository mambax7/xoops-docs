---
title: "Zmienne szablonu"
description: "Dostępne zmienne Smarty w szablonach XOOPS"
---

XOOPS automatycznie dostarcza wiele zmiennych do szablonów Smarty. Ta referenca dokumentuje dostępne zmienne do tworzenia motywów i szablonów modułów.

## Powiązana dokumentacja

- Smarty-Basics - Fundamenty Smarty w XOOPS
- Theme-Development - Tworzenie motywów XOOPS
- Smarty-4-Migration - Aktualizacja z Smarty 3 na 4

## Globalne zmienne motywu

Te zmienne są dostępne w szablonach motywu (`theme.tpl`):

### Informacje witryny

| Zmienna | Opis | Przykład |
|----------|-------------|---------|
| `$xoops_sitename` | Nazwa witryny z preferencji | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Tytuł bieżącej strony | `"Welcome"` |
| `$xoops_slogan` | Slogan witryny | `"Just Use It!"` |
| `$xoops_url` | Pełny URL XOOPS | `"https://example.com"` |
| `$xoops_langcode` | Kod języka | `"en"` |
| `$xoops_charset` | Zestaw znaków | `"UTF-8"` |

### Meta tags

| Zmienna | Opis |
|----------|-------------|
| `$xoops_meta_keywords` | Meta słowa kluczowe |
| `$xoops_meta_description` | Meta opis |
| `$xoops_meta_robots` | Meta tag robots |
| `$xoops_meta_rating` | Ocena zawartości |
| `$xoops_meta_author` | Meta tag autor |
| `$xoops_meta_copyright` | Powiadomienie o prawach autorskich |

### Informacje motywu

| Zmienna | Opis |
|----------|-------------|
| `$xoops_theme` | Nazwa bieżącego motywu |
| `$xoops_imageurl` | URL katalogu obrazów motywu |
| `$xoops_themecss` | URL głównego pliku CSS motywu |
| `$xoops_icons32_url` | URL ikon 32x32 |
| `$xoops_icons16_url` | URL ikon 16x16 |

### Zawartość strony

| Zmienna | Opis |
|----------|-------------|
| `$xoops_contents` | Główna zawartość strony |
| `$xoops_module_header` | Zawartość nagłówka specyficzna dla modułu |
| `$xoops_footer` | Zawartość stopki |
| `$xoops_js` | JavaScript do dołączenia |

### Nawigacja i menu

| Zmienna | Opis |
|----------|-------------|
| `$xoops_mainmenu` | Menu nawigacyjne główne |
| `$xoops_usermenu` | Menu użytkownika |

### Zmienne bloków

| Zmienna | Opis |
|----------|-------------|
| `$xoops_lblocks` | Tablica bloków lewych |
| `$xoops_rblocks` | Tablica bloków prawych |
| `$xoops_cblocks` | Tablica bloków centralnych |
| `$xoops_showlblock` | Pokaż bloki lewe (boolean) |
| `$xoops_showrblock` | Pokaż bloki prawe (boolean) |
| `$xoops_showcblock` | Pokaż bloki centralne (boolean) |

## Zmienne użytkownika

Gdy użytkownik jest zalogowany:

| Zmienna | Opis |
|----------|-------------|
| `$xoops_isuser` | Użytkownik jest zalogowany (boolean) |
| `$xoops_isadmin` | Użytkownik jest administratorem (boolean) |
| `$xoops_userid` | ID użytkownika |
| `$xoops_uname` | Nazwa użytkownika |
| `$xoops_isowner` | Użytkownik jest właścicielem bieżącej zawartości (boolean) |

### Dostęp do właściwości obiektu użytkownika

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Zmienne modułu

W szablonach modułu:

| Zmienna | Opis |
|----------|-------------|
| `$xoops_dirname` | Nazwa katalogu modułu |
| `$xoops_modulename` | Nazwa wyświetlania modułu |
| `$mod_url` | URL modułu (gdy przypisany) |

### Powszechny wzorzec szablonu modułu

```php
// W PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* W szablonie *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## Zmienne bloków

Każdy blok w `$xoops_lblocks`, `$xoops_rblocks` i `$xoops_cblocks` ma:

| Właściwość | Opis |
|----------|-------------|
| `$block.id` | ID bloku |
| `$block.title` | Tytuł bloku |
| `$block.content` | Zawartość HTML bloku |
| `$block.template` | Nazwa szablonu bloku |
| `$block.module` | Nazwa modułu |
| `$block.weight` | Waga/kolejność bloku |

### Przykład wyświetlenia bloku

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

## Zmienne formularza

Gdy używasz klasy XoopsForm:

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Szablon *}
<div class="form-container">
    <{$form}>
</div>
```

## Zmienne paginacji

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Szablon *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## Przypisywanie niestandardowych zmiennych

### Proste wartości

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

### Tablice

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

### Obiekty

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Lub dla XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Dostęp do tablicy *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Dostęp do metody obiektu *}
<h2><{$item_obj->getVar('title')}></h2>
```

### Zagnieżdżone tablice

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

## Wbudowane zmienne Smarty

### $smarty.now

Bieżący timestamp:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Dostęp do stałych PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Dostęp do zmiennych żądania (używaj z ostrożnością):

```smarty
{* Tylko do odczytu, zawsze zescapuj wyjście! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Zmienne serwera:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informacje pętli:

```smarty
<{foreach $items as $item name=itemloop}>
    <{* Indeks (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteracja (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* Pierwszy element *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{{* Ostatni element *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Całkowita liczba *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## Zmienne pomocnika XMF

Gdy używasz XMF, dostępni są dodatkowi pomocnicy:

```php
// W PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* W szablonie *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* HTML breadcrumb *}
<{/if}>
```

## Adresy URL obrazu i zasobu

```smarty
{* Obrazy motywu *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Obrazy modułu *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Katalog wgrywania *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Używanie ikon *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## Warunkowe wyświetlanie na podstawie użytkownika

```smarty
{* Pokaż tylko zalogowanym użytkownikom *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Pokaż tylko administratorom *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Pokaż tylko właścicielowi zawartości *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## Zmienne języka

```php
// W PHP - załaduj plik języka
xoops_loadLanguage('main', 'mymodule');

// Przypisz stałe języka
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* W szablonie *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

Lub używaj stałych bezpośrednio:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Debugowanie zmiennych

Aby zobaczyć wszystkie dostępne zmienne:

```smarty
{* Wyświetl konsole debugowania *}
<{debug}>

{* Wypisz określoną zmienną *}
<pre><{$myvar|@print_r}></pre>

{* Eksportuj zmienną *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #szablony #zmienne #xoops #referenca
