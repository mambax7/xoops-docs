---
title: "Variabili di Template"
description: "Variabili Smarty disponibili nei template XOOPS"
---

XOOPS fornisce automaticamente molte variabili ai template Smarty. Questo documento di riferimento documenta le variabili disponibili per lo sviluppo di tema e modulo.

## Documentazione Correlata

- Smarty-Basics - Fondamenti di Smarty in XOOPS
- Theme-Development - Creazione di temi XOOPS
- Smarty-4-Migration - Aggiornamento da Smarty 3 a 4

## Variabili di Tema Globali

Queste variabili sono disponibili nei template di tema (`theme.tpl`):

### Informazioni del Sito

| Variabile | Descrizione | Esempio |
|----------|-------------|---------|
| `$xoops_sitename` | Nome del sito dalle preferenze | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Titolo della pagina corrente | `"Welcome"` |
| `$xoops_slogan` | Slogan del sito | `"Just Use It!"` |
| `$xoops_url` | URL XOOPS completo | `"https://example.com"` |
| `$xoops_langcode` | Codice lingua | `"en"` |
| `$xoops_charset` | Set di caratteri | `"UTF-8"` |

### Meta Tag

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_meta_keywords` | Meta parole chiave |
| `$xoops_meta_description` | Meta descrizione |
| `$xoops_meta_robots` | Meta tag robots |
| `$xoops_meta_rating` | Valutazione del contenuto |
| `$xoops_meta_author` | Meta tag autore |
| `$xoops_meta_copyright` | Avviso di copyright |

### Informazioni del Tema

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_theme` | Nome del tema corrente |
| `$xoops_imageurl` | URL della directory delle immagini del tema |
| `$xoops_themecss` | URL del file CSS principale del tema |
| `$xoops_icons32_url` | URL delle icone 32x32 |
| `$xoops_icons16_url` | URL delle icone 16x16 |

### Contenuto della Pagina

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_contents` | Contenuto principale della pagina |
| `$xoops_module_header` | Contenuto dell'intestazione specifico del modulo |
| `$xoops_footer` | Contenuto del piè di pagina |
| `$xoops_js` | JavaScript da includere |

### Navigazione e Menu

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_mainmenu` | Menu di navigazione principale |
| `$xoops_usermenu` | Menu dell'utente |

### Variabili di Blocco

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_lblocks` | Array di blocchi sinistri |
| `$xoops_rblocks` | Array di blocchi destri |
| `$xoops_cblocks` | Array di blocchi centrali |
| `$xoops_showlblock` | Mostra blocchi sinistri (booleano) |
| `$xoops_showrblock` | Mostra blocchi destri (booleano) |
| `$xoops_showcblock` | Mostra blocchi centrali (booleano) |

## Variabili dell'Utente

Quando un utente è collegato:

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_isuser` | L'utente è collegato (booleano) |
| `$xoops_isadmin` | L'utente è admin (booleano) |
| `$xoops_userid` | ID dell'utente |
| `$xoops_uname` | Nome utente |
| `$xoops_isowner` | L'utente possiede il contenuto corrente (booleano) |

### Accedi alle Proprietà dell'Oggetto Utente

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Variabili del Modulo

Nei template del modulo:

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_dirname` | Nome della directory del modulo |
| `$xoops_modulename` | Nome di visualizzazione del modulo |
| `$mod_url` | URL del modulo (quando assegnato) |

### Pattern Comune di Template del Modulo

```php
// In PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* Nel template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## Variabili di Blocco

Ogni blocco in `$xoops_lblocks`, `$xoops_rblocks` e `$xoops_cblocks` ha:

| Proprietà | Descrizione |
|----------|-------------|
| `$block.id` | ID del blocco |
| `$block.title` | Titolo del blocco |
| `$block.content` | Contenuto HTML del blocco |
| `$block.template` | Nome del template del blocco |
| `$block.module` | Nome del modulo |
| `$block.weight` | Peso/ordine del blocco |

### Esempio di Visualizzazione di Blocco

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

## Variabili del Modulo

Quando usi le classi XoopsForm:

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

## Variabili di Paginazione

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

## Assegnazione di Variabili Personalizzate

### Valori Semplici

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

### Oggetti

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Oppure per XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Accesso all'array *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Accesso al metodo dell'oggetto *}
<h2><{$item_obj->getVar('title')}></h2>
```

### Array Annidati

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

## Variabili Integrate di Smarty

### $smarty.now

Timestamp corrente:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Accedi alle costanti PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Accedi alle variabili di richiesta (usa con cautela):

```smarty
{* Solo per la lettura, sempre sfuggi l'output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Variabili del server:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Informazioni sul ciclo:

```smarty
<{foreach $items as $item name=itemloop}>
    {* Indice (basato su 0) *}
    Index: <{$smarty.foreach.itemloop.index}>

    {* Iterazione (basata su 1) *}
    Number: <{$smarty.foreach.itemloop.iteration}>

    {* Primo elemento *}
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    {* Ultimo elemento *}
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    {* Conteggio totale *}
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## Variabili Helper XMF

Quando usi XMF, sono disponibili helper aggiuntivi:

```php
// In PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* Nel template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```

## URL di Immagini e Asset

```smarty
{* Immagini del tema *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Immagini del modulo *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Directory di caricamento *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Utilizzo di icone *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## Visualizzazione Condizionale in Base all'Utente

```smarty
{* Mostra solo agli utenti collegati *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Mostra solo agli admin *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Mostra solo al proprietario del contenuto *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## Variabili di Lingua

```php
// In PHP - carica il file di lingua
xoops_loadLanguage('main', 'mymodule');

// Assegna le costanti di lingua
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* Nel template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

Oppure usa direttamente le costanti:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Debug delle Variabili

Per vedere tutte le variabili disponibili:

```smarty
{* Visualizza console di debug *}
<{debug}>

{* Stampa variabile specifica *}
<pre><{$myvar|@print_r}></pre>

{* Esporta variabile *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #templates #variables #xoops #reference
