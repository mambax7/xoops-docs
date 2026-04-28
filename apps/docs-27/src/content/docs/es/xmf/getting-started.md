---
title: "Comenzando con XMF"
description: "Instalación, conceptos básicos y primeros pasos con el Marco de Módulo de XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Esta guía cubre los conceptos fundamentales del Marco de Módulo de XOOPS (XMF) y cómo comenzar a usarlo en sus módulos.

## Requisitos previos

- XOOPS 2.5.8 o posterior instalado
- PHP 7.2 o posterior
- Comprensión básica de programación orientada a objetos en PHP

## Comprendiendo espacios de nombres

XMF utiliza espacios de nombres de PHP para organizar sus clases y evitar conflictos de nombres. Todas las clases de XMF están en el espacio de nombres `Xmf`.

### Problema del espacio global

Sin espacios de nombres, todas las clases PHP comparten un espacio global. Esto puede causar conflictos:

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

### Solución de espacios de nombres

Los espacios de nombres crean contextos de nomenclatura aislados:

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

### Usando espacios de nombres de XMF

Puede hacer referencia a clases de XMF de varias maneras:

**Ruta de espacio de nombres completa:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Con declaración de uso:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Múltiples importaciones:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Autocarga

Una de las mayores conveniencias de XMF es la carga automática de clases. Nunca necesita incluir manualmente archivos de clases de XMF.

### Carga tradicional de XOOPS

La forma antigua requería carga explícita:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### Autocarga de XMF

Con XMF, las clases se cargan automáticamente cuando se hace referencia a ellas:

```php
$input = Xmf\Request::getString('input', '');
```

O con una declaración de uso:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

El cargador automático sigue el estándar [PSR-4](http://www.php-fig.org/psr/psr-4/) y también gestiona las dependencias en las que confía XMF.

## Ejemplos de uso básico

### Leyendo entrada de solicitud

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

### Usando el ayudante de módulo

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

### Ayudantes de rutas y URLs

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

## Depurando con XMF

XMF proporciona herramientas de depuración útiles:

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

La salida de depuración es plegable y muestra objetos y arreglos en un formato fácil de leer.

## Recomendación de estructura de proyecto

Cuando construya módulos basados en XMF, organice su código:

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

## Patrón de inclusión común

Un punto de entrada típico del módulo:

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

## Próximos pasos

Ahora que comprende los conceptos básicos, explore:

- XMF-Request - Documentación detallada de manejo de solicitudes
- XMF-Module-Helper - Referencia completa del ayudante de módulo
- ../Recipes/Permission-Helper - Gestión de permisos de usuario
- ../Recipes/Module-Admin-Pages - Construcción de interfaces de administración

## Ver también

- ../XMF-Framework - Descripción general del marco
- ../Reference/JWT - Soporte de Token Web JSON
- ../Reference/Database - Utilidades de base de datos

---

#xmf #getting-started #namespaces #autoloading #basics
