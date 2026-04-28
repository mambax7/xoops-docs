---
title: "Erste Schritte mit XMF"
description: "Installation, Grundkonzepte und erste Schritte mit dem XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Dieser Leitfaden behandelt die grundlegenden Konzepte des XOOPS Module Framework (XMF) und wie Sie es in Ihren Modulen verwenden.

## Voraussetzungen

- XOOPS 2.5.8 oder später installiert
- PHP 7.2 oder später
- Grundverständnis der PHP objektorientierten Programmierung

## Namespaces verstehen

XMF verwendet PHP-Namespaces, um seine Klassen zu organisieren und Namenskonflikte zu vermeiden. Alle XMF-Klassen befinden sich im `Xmf`-Namespace.

### Global-Space-Problem

Ohne Namespaces teilen sich alle PHP-Klassen einen globalen Bereich. Dies kann zu Konflikten führen:

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

### Namespaces-Lösung

Namespaces erstellen isolierte Benennungskontexte:

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

### Verwendung von XMF-Namespaces

Sie können auf XMF-Klassen auf mehrere Arten verweisen:

**Vollständiger Namespace-Pfad:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Mit Use-Anweisung:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Mehrere Importe:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Automatisches Laden

Einer der größten Vorteile von XMF ist das automatische Laden von Klassen. Sie müssen niemals manuell XMF-Klassendateien einbinden.

### Traditionelles XOOPS-Laden

Die alte Methode erforderte explizites Laden:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF-Automatisches Laden

Mit XMF werden Klassen automatisch geladen, wenn auf sie verwiesen wird:

```php
$input = Xmf\Request::getString('input', '');
```

Or with a use statement:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Der Autoloader folgt dem [PSR-4](http://www.php-fig.org/psr/psr-4/)-Standard und verwaltet auch Abhängigkeiten, auf die sich XMF verlässt.

## Grundlegende Verwendungsbeispiele

### Request-Eingabe lesen

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

### Verwenden des Modul-Helfers

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

### Pfad- und URL-Helfer

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

## Debugging mit XMF

XMF bietet hilfreiche Debug-Tools:

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

Die Debug-Ausgabe ist einklappbar und zeigt Objekte und Arrays in einem leicht lesbaren Format an.

## Empfehlung zur Projektstruktur

Organisieren Sie Ihren Code beim Erstellen von XMF-basierten Modulen:

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

## Gemeinsames Include-Muster

Ein typischer Modul-Einstiegspunkt:

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

## Nächste Schritte

Jetzt, da Sie die Grundlagen verstehen, erkunden Sie:

- XMF-Request - Detaillierte Request-Verarbeitungsdokumentation
- XMF-Module-Helper - Komplette Modul-Helper-Referenz
- ../Recipes/Permission-Helper - Verwaltung von Benutzerberechtigungen
- ../Recipes/Module-Admin-Pages - Erstellung von Admin-Schnittstellen

## Siehe auch

- ../XMF-Framework - Framework-Übersicht
- ../Reference/JWT - JSON Web Token-Unterstützung
- ../Reference/Database - Datenbankdienstprogramme

---

#xmf #getting-started #namespaces #autoloading #basics
