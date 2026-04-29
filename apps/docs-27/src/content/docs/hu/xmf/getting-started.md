---
title: "Kezdő lépések az XMF-fel"
description: "Telepítés, alapkoncepciók és első lépések a XOOPS module Framework segítségével"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ez az útmutató a XOOPS modulkeretrendszer (XMF) alapvető fogalmait és a modulokban való használatának megkezdését ismerteti.

## Előfeltételek

- XOOPS 2.5.8 vagy újabb telepítve
- PHP 7.2 vagy újabb
- A PHP objektumorientált programozás alapvető ismerete

## A névterek értelmezése

A XMF PHP névtereket használ az osztályok rendszerezésére és az elnevezési ütközések elkerülésére. Az összes XMF osztály a `XMF` névtérben található.

### Globális űrprobléma

Névterek nélkül az összes PHP osztály egy globális területen osztozik. Ez konfliktusokat okozhat:

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

### Névterek megoldása

A névterek elszigetelt elnevezési kontextusokat hoznak létre:

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

### XMF névterek használata

A XMF osztályokra többféleképpen hivatkozhat:

**A teljes névtér elérési útja:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Használati nyilatkozattal:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Többszörös importálás:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Automatikus betöltés

A XMF egyik legnagyobb kényelme az automatikus osztálybetöltés. Soha nem kell manuálisan hozzáadnia a XMF osztály fájljait.

### Hagyományos XOOPS Betöltés

A régi módszer kifejezett betöltést igényelt:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Automatikus betöltés

A XMF esetén az osztályok automatikusan betöltődnek, amikor hivatkoznak rájuk:

```php
$input = Xmf\Request::getString('input', '');
```

Vagy használati nyilatkozattal:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Az automatikus betöltő a [PSR-4](http://www.php-fig.org/psr/psr-4/) szabványt követi, és kezeli a függőségeket is, amelyekre a XMF támaszkodik.

## Alapvető használati példák

### Olvasási kérés bevitele

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

### A modul Helper használata

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

### Path és URL segítők

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

## Hibakeresés a XMF segítségével

A XMF hasznos hibakereső eszközöket kínál:

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

A hibakereső kimenet összecsukható, és könnyen olvasható formátumban jeleníti meg az objektumokat és tömböket.

## Projektszerkezeti ajánlás

XMF-alapú modulok építésénél rendszerezze a kódot:

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

## Gyakori befoglaló minta

Egy tipikus modul belépési pont:

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

## Következő lépések

Most, hogy megértette az alapokat, fedezze fel:

- XMF-Request - Részletes kérelemkezelési dokumentáció
- XMF-modul-Helper - Teljes modul segítő referencia
- ../Recipes/Permission-Helper - Felhasználói engedélyek kezelése
- ../Recipes/module-Admin-Pages - Admin felületek építése

## Lásd még

- ../XMF-Framework - A keretrendszer áttekintése
- ../Reference/JWT - JSON Web Token támogatás
- ../Reference/Database - Adatbázis segédprogramok

---

#xmf #első lépések #névterek #automatikus betöltés #alapok
