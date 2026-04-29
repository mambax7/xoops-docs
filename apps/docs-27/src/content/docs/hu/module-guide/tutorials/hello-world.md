---
title: "Hello World module"
description: "Lépésről lépésre bemutató útmutató az első XOOPS-modul létrehozásához"
---
# Hello World module bemutatója

Ez az oktatóanyag végigvezeti az első XOOPS modul létrehozásán. A végére lesz egy működő modul, amely a „Hello World” feliratot jeleníti meg mind a frontend, mind az adminisztrációs területen.

## Előfeltételek

- XOOPS 2.5.x telepítve és futva
- PHP 8.0 vagy újabb
- Alapvető PHP ismeretek
- Szövegszerkesztő vagy IDE (PhpStorm ajánlott)

## 1. lépés: Hozza létre a címtárszerkezetet

Hozza létre a következő könyvtárstruktúrát a `/modules/helloworld/` fájlban:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## 2. lépés: Hozza létre a moduldefiníciót

`xoops_version.php` létrehozása:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## 3. lépés: Nyelvi fájlok létrehozása

### modinfo.php (modulinformáció)

`language/english/modinfo.php` létrehozása:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (elülső nyelv)

`language/english/main.php` létrehozása:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (rendszergazdai nyelv)

`language/english/admin.php` létrehozása:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## 4. lépés: Hozd létre a Frontend Indexet

Hozzon létre `index.php`-t a modul gyökerében:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## 5. lépés: Hozd létre a Frontend sablont

`templates/helloworld_index.tpl` létrehozása:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## 6. lépés: Adminisztrátori fájlok létrehozása

### Admin fejléc

`admin/admin_header.php` létrehozása:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Admin lábléc

`admin/admin_footer.php` létrehozása:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Adminisztrációs menü

`admin/menu.php` létrehozása:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Rendszergazdai indexoldal

`admin/index.php` létrehozása:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## 7. lépés: Adminisztrátori sablon létrehozása

`templates/admin/helloworld_admin_index.tpl` létrehozása:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## 8. lépés: Hozza létre a modul logót

Hozzon létre vagy másoljon PNG képet (ajánlott méret: 92x92 pixel) ide:
`assets/images/logo.png`

Bármilyen képszerkesztővel létrehozhat egyszerű logót, vagy használhat helyőrzőt egy olyan webhelyről, mint a placeholder.com.

## 9. lépés: Telepítse a modult

1. Jelentkezzen be a XOOPS webhelyére rendszergazdaként
2. Lépjen a **Rendszeradminisztráció** > **modulok** oldalra.
3. Keresse meg a „Hello World” elemet az elérhető modulok listájában
4. Kattintson a **Telepítés** gombra
5. Erősítse meg a telepítést

## 10. lépés: Tesztelje modulját

### Frontend teszt

1. Navigáljon a XOOPS webhelyére
2. Kattintson a "Hello World" lehetőségre a főmenüben
3. Látnia kell az üdvözlő üzenetet és a pontos időt

### Admin teszt

1. Lépjen az adminisztrációs területre
2. Kattintson a "Hello World" elemre az adminisztrációs menüben
3. Látnia kell az adminisztrációs vezérlőpultot

## Hibaelhárítás

### A modul nem jelenik meg a telepítési listában

- Ellenőrizze a fájljogosultságokat (755 könyvtárak, 644 fájlok)
- Ellenőrizze, hogy a `xoops_version.php`-ban nincsenek szintaktikai hibák
- Törölje a XOOPS gyorsítótárat

### A sablon nem töltődik be

- Győződjön meg arról, hogy a sablonfájlok a megfelelő könyvtárban vannak
- Ellenőrizze, hogy a sablonfájlnevek megegyeznek-e a `xoops_version.php` fájlnevekkel
- Ellenőrizze, hogy a Smarty szintaxis helyes-e

### A nyelvi karakterláncok nem jelennek meg

- Ellenőrizze a nyelvi fájl elérési útját
- Győződjön meg arról, hogy a nyelvi állandók meg vannak határozva
- Ellenőrizze, hogy létezik-e a megfelelő nyelvű mappa

## Következő lépések

Most, hogy rendelkezik egy működő modullal, folytassa a tanulást a következőkkel:

- CRUD-modul építése - Adatbázis-funkciók hozzáadása
- ../Patterns/MVC-Pattern - Rendezze meg megfelelően a kódot
- ../Best-Practices/Testing - PHPUnit tesztek hozzáadása

## Teljes fájlreferencia

Az elkészült modulnak a következő fájlokkal kell rendelkeznie:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Összegzés

Gratulálunk! Létrehozta első XOOPS modulját. Az érintett kulcsfogalmak:

1. **modul felépítés** - Szabványos XOOPS modulkönyvtár-elrendezés
2. **xoops_version.php** - modul meghatározása és konfigurációja
3. **Nyelvi fájlok** - Internacionalizálás támogatása
4. **Sablonok** - Intelligens sablonintegráció
5. **Adminisztrációs felület** – Alapvető adminisztrációs panel

Lásd még: ../module-Development | Building-a-CRUD-modul | ../Patterns/MVC-Pattern
