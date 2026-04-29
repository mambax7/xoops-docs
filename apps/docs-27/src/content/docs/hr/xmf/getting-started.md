---
title: "Početak rada s XMF"
description: "Instalacija, osnovni koncepti i prvi koraci s okvirom modula XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ovaj vodič pokriva temeljne koncepte okvira modula XOOPS (XMF) i kako ga početi koristiti u svom modules.

## Preduvjeti

- XOOPS 2.5.8 ili noviji instaliran
- PHP 7.2 ili noviji
- Osnovno razumijevanje PHP objektno orijentiranog programiranja

## Razumijevanje prostora imena

XMF koristi prostore imena PHP za organiziranje svog classes i izbjegavanje sukoba naziva. Svi XMF classes su u `Xmf` imenskom prostoru.

### Globalni svemirski problem

Bez prostora imena, svi PHP classes dijele globalni prostor. To može uzrokovati sukobe:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### Namespaces Rješenje

Prostori imena stvaraju izolirane kontekste imenovanja:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### Korištenje prostora imena XMF

XMF classes možete uputiti na nekoliko načina:

**Puni put prostora imena:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**S izjavom o upotrebi:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Višestruki uvozi:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Automatsko učitavanje

Jedna od najvećih pogodnosti XMF je automatsko učitavanje class. Nikada ne morate ručno kopirati include XMF class datoteke.

### Tradicionalni XOOPS Učitavanje

Stari način je zahtijevao eksplicitno učitavanje:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Automatsko učitavanje

Sa XMF, classes učitava se automatski kada se referencira:

```php
$input = Xmf\Request::getString('input', '');
```

Ili s izjavom o upotrebi:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Automatsko učitavanje slijedi standard [PSR-4](http://www.php-fig.org/psr/psr-4/) i također upravlja ovisnostima na koje se oslanja XMF.

## Osnovni primjeri upotrebe

### Unos zahtjeva za čitanje

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### Korištenje pomoćnika modula

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### Put i pomoćnici URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Otklanjanje pogrešaka sa XMF

XMF pruža korisne alate za otklanjanje pogrešaka:

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

Izlaz otklanjanja pogrešaka je sklopiv i prikazuje objekte i nizove u formatu koji je jednostavan za čitanje.

## Preporuka strukture projekta

Prilikom izgradnje XMF temeljenog na modules, organizirajte svoj kod:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Uobičajeni obrazac uključivanja

Tipična ulazna točka modula:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Sljedeći koraci

Sada kada razumijete osnove, istražite:

- XMF-Zahtjev - Detaljna dokumentacija za obradu zahtjeva
- XMF-Module-Helper - Kompletna referenca za pomoć modula
- ../Recipes/Permission-Helper - Upravljanje korisničkim dopuštenjima
- ../Recipes/Module-Admin-Pages - Izgradnja admin sučelja

## Vidi također

- ../XMF-Framework - Pregled okvira
- ../Reference/JWT - Podrška za web token JSON
- ../Reference/Database - Pomoćni programi baze podataka

---

#xmf #početak rada #namespaces #autoloading #basics
