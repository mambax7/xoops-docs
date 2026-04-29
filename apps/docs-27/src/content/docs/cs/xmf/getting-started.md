---
title: "Začínáme s XMF"
description: "Instalace, základní koncepty a první kroky s modulem XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Tato příručka pokrývá základní koncepty XOOPS Module Framework (XMF) a jak jej začít používat ve vašich modulech.

## Předpoklady

- Nainstalovaný XOOPS 2.5.8 nebo novější
- PHP 7.2 nebo novější
- Základní znalost objektově orientovaného programování PHP

## Pochopení jmenných prostorů

XMF používá jmenné prostory PHP k uspořádání svých tříd a předcházení konfliktům v názvech. Všechny třídy XMF jsou v oboru názvů `XMF`.

### Globální vesmírný problém

Bez jmenných prostorů sdílejí všechny třídy PHP globální prostor. To může způsobit konflikty:

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

### Řešení jmenných prostorů

Jmenné prostory vytvářejí izolované názvové kontexty:

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

### Použití jmenných prostorů XMF

Na třídy XMF můžete odkazovat několika způsoby:

**Úplná cesta jmenného prostoru:**
```php
$helper = \XMF\Module\Helper::getHelper('mymodule');
```

**S příkazem použití:**
```php
use XMF\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Vícenásobné importy:**
```php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Automatické načítání

Jednou z největších vymožeností XMF je automatické načítání tříd. Soubory třídy XMF nikdy nemusíte ručně vkládat.

### Tradiční XOOPS Načítání

Starý způsob vyžadoval explicitní načítání:

```php
XOOPSLoad('xoopsrequest');
$cleanInput = XOOPSRequest::getString('input', '');
```

### XMF Automatické načítání

S XMF se třídy načtou automaticky, když je odkazováno:

```php
$input = XMF\Request::getString('input', '');
```

Nebo s příkazem použití:

```php
use XMF\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Autoloader se řídí standardem [PSR-4](http://www.php-fig.org/psr/psr-4/) a také spravuje závislosti, na které XMF spoléhá.

## Základní příklady použití

### Zadání požadavku na čtení

```php
use XMF\Request;

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

### Použití Pomocníka modulu

```php
use XMF\Module\Helper;

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

### Pomocníci cesty a URL

```php
use XMF\Module\Helper;

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

## Ladění pomocí XMF

XMF poskytuje užitečné nástroje pro ladění:

```php
// Dump a variable with nice formatting
\XMF\Debug::dump($myVariable);

// Dump multiple variables
\XMF\Debug::dump($var1, $var2, $var3);

// Dump POST data
\XMF\Debug::dump($_POST);

// Show a backtrace
\XMF\Debug::backtrace();
```

Výstup ladění je sbalitelný a zobrazuje objekty a pole ve snadno čitelném formátu.

## Doporučení týkající se struktury projektu

Při sestavování modulů založených na XMF uspořádejte svůj kód:

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

## Společný vzor zahrnutí

Typický vstupní bod modulu:

```php
<?php
// mymodule/index.php

use XMF\Request;
use XMF\Module\Helper;

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

## Další kroky

Nyní, když rozumíte základům, prozkoumejte:

- XMF-Request - Podrobná dokumentace pro vyřizování požadavků
- XMF-Module-Helper - Kompletní reference pomocníka modulu
- ../Recipes/Permission-Helper - Správa uživatelských oprávnění
- ../Recipes/Module-Admin-Pages - Vytváření rozhraní pro správu

## Viz také

- ../XMF-Framework - Přehled rámce
- ../Reference/JWT - Podpora webových tokenů JSON
- ../Reference/Database - Databázové nástroje

---

#xmf #začínáme #jmenné prostory #automatické načítání #základy