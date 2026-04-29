---
title: "Aan de slag met XMF"
description: "Installatie, basisconcepten en eerste stappen met het XOOPS Module Framework"
---
<span class="version-badge versie-25x">2.5.x ✅</span> <span class="version-badge versie-40x">4.0.x ✅</span>

Deze handleiding behandelt de fundamentele concepten van het XOOPS Module Framework (XMF) en hoe u dit in uw modules kunt gaan gebruiken.

## Vereisten

- XOOPS 2.5.8 of hoger geïnstalleerd
- PHP 7.2 of hoger
- Basiskennis van objectgeoriënteerd programmeren PHP

## Naamruimten begrijpen

XMF gebruikt PHP-naamruimten om de klassen te organiseren en naamgevingsconflicten te voorkomen. Alle XMF-klassen bevinden zich in de `Xmf`-naamruimte.

### Mondiaal ruimteprobleem

Zonder naamruimten delen alle PHP-klassen een globale ruimte. Dit kan conflicten veroorzaken:

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

### Naamruimteoplossing

Naamruimten creëren geïsoleerde naamgevingscontexten:

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

### XMF-naamruimten gebruiken

U kunt op verschillende manieren naar XMF-klassen verwijzen:

**Volledig naamruimtepad:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Met gebruiksverklaring:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Meerdere importen:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Automatisch laden

Een van de grootste gemakken van XMF is het automatisch laden van klassen. U hoeft nooit handmatig XMF-klassebestanden op te nemen.

### Traditioneel XOOPS laden

De oude manier vereiste expliciet laden:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Automatisch laden

Met XMF worden klassen automatisch geladen wanneer er naar wordt verwezen:

```php
$input = Xmf\Request::getString('input', '');
```

Of met een gebruiksverklaring:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

De autoloader volgt de standaard [PSR-4](http://www.php-fig.org/psr/psr-4/) en beheert ook de afhankelijkheden waarvan XMF afhankelijk is.

## Basisgebruiksvoorbeelden

### Invoer van leesverzoek

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

### De Modulehelper gebruiken

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

### Pad en URL-helpers

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

## Foutopsporing met XMF

XMF biedt handige foutopsporingstools:

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

De debug-uitvoer is samenvouwbaar en geeft objecten en arrays weer in een gemakkelijk leesbaar formaat.

## Aanbeveling projectstructuur

Wanneer u op XMF gebaseerde modules bouwt, organiseert u uw code:

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

## Algemeen Inclusief patroon

Een typisch module-ingangspunt:

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

## Volgende stappen

Nu u de basisbeginselen begrijpt, kunt u het volgende onderzoeken:

- XMF-Request - Gedetailleerde documentatie voor het afhandelen van verzoeken
- XMF-Module-Helper - Complete modulehelper-referentie
- ../Recepten/Permission-Helper - Gebruikersrechten beheren
- ../Recepten/Module-Admin-Pages - Beheerinterfaces bouwen

## Zie ook

- ../XMF-Framework - Kaderoverzicht
- ../Reference/JWT - JSON Web Token-ondersteuning
- ../Reference/Database - Databasehulpprogramma's

---

#xmf #aan de slag #namespaces #autoloading #basics