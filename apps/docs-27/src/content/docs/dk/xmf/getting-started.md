---
title: "Kom godt i gang med XMF"
description: "Installation, grundlæggende koncepter og første trin med XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Denne vejledning dækker de grundlæggende begreber i XOOPS Module Framework (XMF), og hvordan du begynder at bruge det i dine moduler.

## Forudsætninger

- XOOPS 2.5.8 eller nyere installeret
- PHP 7.2 eller nyere
- Grundlæggende forståelse for PHP objektorienteret programmering

## Forstå navnerum

XMF bruger PHP navnerum til at organisere sine klasser og undgå navnekonflikter. Alle XMF-klasser er i `Xmf`-navneområdet.

### Globalt rumproblem

Uden navnerum deler alle PHP-klasser et globalt rum. Dette kan forårsage konflikter:

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

### Navnerumsløsning

Navneområder skaber isolerede navngivningskontekster:

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

### Brug af XMF navnerum

Du kan referere til XMF-klasser på flere måder:

**Fuld navneområdesti:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Med brugserklæring:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Flere importer:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Autoloading

En af XMF' største bekvemmeligheder er automatisk klasseindlæsning. Du behøver aldrig manuelt at inkludere XMF klassefiler.

### Traditionel XOOPS Indlæser

Den gamle måde krævede eksplicit indlæsning:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Autoloader

Med XMF indlæses klasser automatisk, når der henvises til:

```php
$input = Xmf\Request::getString('input', '');
```

Eller med en brugserklæring:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Autoloaderen følger [PSR-4](http://www.php-fig.org/psr/psr-4/) standarden og administrerer også afhængigheder, som XMF er afhængig af.

## Eksempler på grundlæggende brug

### Læseanmodningsinput

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

### Brug af modulhjælperen

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

### Sti og URL hjælpere

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

## Fejlretning med XMF

XMF giver nyttige fejlfindingsværktøjer:

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

Debug-outputtet er sammenklappeligt og viser objekter og arrays i et letlæseligt format.

## Projektstrukturanbefaling

Når du bygger XMF-baserede moduler, skal du organisere din kode:

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

## Fælles inkluderende mønster

Et typisk modulindgangspunkt:

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

## Næste trin

Nu hvor du forstår det grundlæggende, kan du udforske:

- XMF-Request - Detaljeret dokumentation for anmodningshåndtering
- XMF-Module-Helper - Komplet modulhjælpereference
- ../Recipes/Permission-Helper - Håndtering af brugertilladelser
- ../Recipes/Module-Admin-Pages - Opbygning af admin-grænseflader

## Se også

- ../XMF-Framework - Rammeoversigt
- ../Reference/JWT - JSON Web Token support
- ../Reference/Database - Databaseværktøjer

---

#xmf #kom godt i gang #navnerum #autoloading #basics
