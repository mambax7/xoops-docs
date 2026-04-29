---
title: "Kako začeti z XMF"
description: "Namestitev, osnovni koncepti in prvi koraki z XOOPS Module Framework"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ta priročnik pokriva temeljne koncepte ogrodja modulov XOOPS (XMF) in kako ga začeti uporabljati v svojih modulih.

## Predpogoji

- XOOPS 2.5.8 ali novejši nameščen
- PHP 7.2 ali novejši
- Osnovno razumevanje PHP objektno orientiranega programiranja

## Razumevanje imenskih prostorov

XMF uporablja imenske prostore PHP za organiziranje svojih razredov in izogibanje sporom pri poimenovanju. Vsi razredi XMF so v imenskem prostoru `XMF`.

### Globalni vesoljski problem

Brez imenskih prostorov si vsi razredi PHP delijo globalni prostor. To lahko povzroči konflikte:
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
### Rešitev imenskih prostorov

Imenski prostori ustvarjajo izolirane kontekste poimenovanja:
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
### Uporaba XMF imenskih prostorov

Razrede XMF lahko sklicujete na več načinov:

**Celotna pot imenskega prostora:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```
**Z izjavo o uporabi:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```
**Večkratni uvozi:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```
## Samodejno nalaganje

Ena izmed največjih ugodnosti XMF je samodejno nalaganje razredov. Nikoli vam ni treba ročno vključiti datotek razreda XMF.

### Tradicionalno XOOPS Nalaganje

Stari način je zahteval izrecno nalaganje:
```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```
### XMF Samodejno nalaganje

Z XMF se razredi samodejno naložijo ob sklicevanju:
```php
$input = Xmf\Request::getString('input', '');
```
Ali z izjavo o uporabi:
```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```
Samodejni nalagalnik sledi standardu [PSR-4](http://www.php-fig.org/psr/psr-4/) in upravlja tudi odvisnosti, na katere se opira XMF.

## Osnovni primeri uporabe

### Vnos zahteve za branje
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
### Uporaba pomočnika za module
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
### Pot in URL pomočnikov
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
## Odpravljanje napak z XMF

XMF ponuja koristna orodja za odpravljanje napak:
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
Izhod za odpravljanje napak je mogoče strniti in prikazuje predmete in nize v lahko berljivi obliki.

## Priporočilo za strukturo projekta

Ko gradite module, ki temeljijo na XMF, organizirajte svojo kodo:
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
## Skupni vzorec vključitve

Tipična vstopna točka modula:
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
## Naslednji koraki

Zdaj, ko razumete osnove, raziščite:

- XMF-Zahtevek - Podrobna dokumentacija za obravnavo zahtevka
- XMF-Module-Helper - Celotna referenca pomočnika modula
- ../Recipes/Permission-Helper - Upravljanje uporabniških dovoljenj
- ../Recipes/Module-Admin-Pages - Gradnja skrbniških vmesnikov

## Glej tudi

- ../XMF-Framework - Pregled okvira
- ../Reference/JWT - JSON Podpora za spletne žetone
- ../Reference/Database - Pripomočki za zbirke podatkov

---

#XMF #začetek #imenski prostori #samodejno nalaganje #osnove