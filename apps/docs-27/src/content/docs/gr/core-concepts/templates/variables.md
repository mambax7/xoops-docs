---
title: "Μεταβλητές προτύπου"
description: "Διαθέσιμες μεταβλητές Smarty σε πρότυπα XOOPS"
---

Το XOOPS παρέχει αυτόματα πολλές μεταβλητές στα πρότυπα Smarty. Αυτή η αναφορά τεκμηριώνει τις διαθέσιμες μεταβλητές για την ανάπτυξη προτύπων θέματος και λειτουργικής μονάδας.

## Σχετική τεκμηρίωση

- Smarty-Basics - Fundamentals of Smarty στο XOOPS
- Ανάπτυξη θεμάτων - Δημιουργία XOOPS θεμάτων
- Smarty-4-Migration - Αναβάθμιση από Smarty 3 σε 4

## Καθολικές μεταβλητές θέματος

Αυτές οι μεταβλητές είναι διαθέσιμες σε πρότυπα θεμάτων (`theme.tpl`):

## # Πληροφορίες τοποθεσίας

| Μεταβλητή | Περιγραφή | Παράδειγμα |
|----------|-------------|---------|
| `$xoops_sitename ` | Όνομα ιστότοπου από τις προτιμήσεις | `"My XOOPS Site"` |
| `$xoops_pagetitle ` | Τρέχουσα τίτλος σελίδας | `"Welcome"` |
| `$xoops_slogan ` | Σύνθημα ιστότοπου | `"Just Use It!"` |
| `$xoops_url ` | Πλήρης XOOPS URL | `"https://example.com"` |
| `$xoops_langcode ` | Κωδικός γλώσσας | `"en"` |
| `$xoops_charset ` | Σύνολο χαρακτήρων | `"UTF-8"` |

## # Meta Tags

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_meta_keywords` | Meta λέξεις-κλειδιά |
| `$xoops_meta_description` | Meta περιγραφή |
| `$xoops_meta_robots` | Μετα-ετικέτα ρομπότ |
| `$xoops_meta_rating` | Αξιολόγηση περιεχομένου |
| `$xoops_meta_author` | Μετα-ετικέτα συγγραφέα |
| `$xoops_meta_copyright` | Σημείωση πνευματικών δικαιωμάτων |

## # Πληροφορίες θέματος

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_theme` | Όνομα τρέχοντος θέματος |
| `$xoops_imageurl` | Κατάλογος εικόνων θέματος URL |
| `$xoops_themecss` | Κύριο θέμα CSS αρχείο URL |
| `$xoops_icons32_url` | εικονίδια 32x32 URL |
| `$xoops_icons16_url` | 16x16 εικονίδια URL |

## # Περιεχόμενο σελίδας

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_contents` | Περιεχόμενο της κύριας σελίδας |
| `$xoops_module_header` | Περιεχόμενο κεφαλίδας για συγκεκριμένη ενότητα |
| `$xoops_footer` | Περιεχόμενο υποσέλιδου |
| `$xoops_js` | JavaScript για συμπερίληψη |

## # Πλοήγηση και μενού

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_mainmenu` | Κύριο μενού πλοήγησης |
| `$xoops_usermenu` | Μενού χρήστη |

## # Αποκλεισμός μεταβλητών

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_lblocks` | Συστοιχία αριστερών μπλοκ |
| `$xoops_rblocks` | Συστοιχία δεξιών μπλοκ |
| `$xoops_cblocks` | Συστοιχία κεντρικών μπλοκ |
| `$xoops_showlblock` | Εμφάνιση αριστερών μπλοκ (boolean) |
| `$xoops_showrblock` | Εμφάνιση δεξιών μπλοκ (boolean) |
| `$xoops_showcblock` | Εμφάνιση κεντρικών μπλοκ (boolean) |

## Μεταβλητές χρήστη

Όταν ένας χρήστης είναι συνδεδεμένος:

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_isuser` | Ο χρήστης είναι συνδεδεμένος (boolean) |
| `$xoops_isadmin` | Ο χρήστης είναι διαχειριστής (boolean) |
| `$xoops_userid` | Αναγνωριστικό χρήστη |
| `$xoops_uname` | Όνομα χρήστη |
| `$xoops_isowner` | Ο χρήστης κατέχει το τρέχον περιεχόμενο (boolean) |

## # Πρόσβαση στις ιδιότητες αντικειμένου χρήστη

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Μεταβλητές ενότητας

Σε πρότυπα λειτουργικών μονάδων:

| Μεταβλητή | Περιγραφή |
|----------|-------------|
| `$xoops_dirname` | Όνομα καταλόγου μονάδας |
| `$xoops_modulename` | Εμφανιζόμενο όνομα μονάδας |
| `$mod_url` | Ενότητα URL (όταν εκχωρείται) |

## # Μοτίβο προτύπου κοινής μονάδας

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

## Αποκλεισμός μεταβλητών

Κάθε μπλοκ στα `$xoops_lblocks `, `$xoops_rblocks ` και `$xoops_cblocks` έχει:

| Ακίνητα | Περιγραφή |
|----------|-------------|
| `$block.id` | Αναγνωριστικό μπλοκ |
| `$block.title` | Τίτλος μπλοκ |
| `$block.content` | Αποκλεισμός περιεχομένου HTML |
| `$block.template` | Όνομα προτύπου αποκλεισμού |
| `$block.module` | Όνομα ενότητας |
| `$block.weight` | Μπλοκ weight/order |

## # Παράδειγμα εμφάνισης αποκλεισμού

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

## Μεταβλητές φόρμας

Όταν χρησιμοποιείτε τάξεις XoopsForm:

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

## Μεταβλητές σελιδοποίησης

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

## Εκχώρηση προσαρμοσμένων μεταβλητών

## # Απλές τιμές

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

## # Πίνακες

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

## # Αντικείμενα

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

## # Ένθετοι πίνακες

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

## Έξυπνες ενσωματωμένες μεταβλητές

## # $Smarty.τώρα

Τρέχουσα χρονική σήμανση:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

## # $Smarty.συντ

Πρόσβαση στις σταθερές PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

## # $Smarty.get, $Smarty.post, $Smarty. request

Μεταβλητές αιτήματος πρόσβασης (χρησιμοποιήστε με προσοχή):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

## # $Smarty.διακομιστής

Μεταβλητές διακομιστή:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

## # $Smarty.foreach

Πληροφορίες βρόχου:

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

## XMF Βοηθητικές μεταβλητές

Όταν χρησιμοποιείτε το XMF, διατίθενται επιπλέον βοηθοί:

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

## Διεύθυνση URL εικόνας και στοιχείου

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

## Προβολή υπό όρους βάσει χρήστη

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

## Μεταβλητές γλώσσας

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

Ή χρησιμοποιήστε απευθείας σταθερές:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Αποσφαλμάτωση μεταβλητών

Για να δείτε όλες τις διαθέσιμες μεταβλητές:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

# Smarty #templates #variables #XOOPS #reference
