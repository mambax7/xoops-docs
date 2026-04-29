---
title: "Modul Hello World"
description: "Vadnica po korakih za ustvarjanje vašega prvega XOOPS modula"
---
# Vadnica modula Hello World

Ta vadnica vas vodi skozi ustvarjanje vašega prvega modula XOOPS. Na koncu boste imeli delujoč modul, ki prikazuje "Hello World" na sprednjem in skrbniškem področju.

## Predpogoji

- XOOPS 2.5.x nameščen in deluje
- PHP 8.0 ali višje
- Osnovno PHP znanje
- Urejevalnik besedil ali IDE (priporočeno PhpStorm)

## 1. korak: Ustvarite strukturo imenika

Ustvarite naslednjo strukturo imenika v `/modules/helloworld/`:
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
## 2. korak: Ustvarite definicijo modula

Ustvari `xoops_version.php`:
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
## 3. korak: Ustvarite jezikovne datoteke

### modinfo.php (Module Information)

Ustvari `language/english/modinfo.php`:
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
### glavno.php (Frontend Language)

Ustvari `language/english/main.php`:
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
### admin.php (Admin Language)

Ustvari `language/english/admin.php`:
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
## 4. korak: Ustvarite sprednji indeks

Ustvarite `index.php` v korenu modula:
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
## 5. korak: Ustvarite predlogo Frontend

Ustvari `templates/helloworld_index.tpl`:
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
## 6. korak: Ustvarite skrbniške datoteke

### Skrbniška glava

Ustvari `admin/admin_header.php`:
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
### Administratorska noga

Ustvari `admin/admin_footer.php`:
```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```
### Skrbniški meni

Ustvari `admin/menu.php`:
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
### Administratorska indeksna stran

Ustvari `admin/index.php`:
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
## 7. korak: Ustvarite skrbniško predlogo

Ustvari `templates/admin/helloworld_admin_index.tpl`:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## 8. korak: Ustvarite logotip modula

Ustvarite ali kopirajte sliko PNG (priporočena velikost: 92x92 slikovnih pik) na:
`assets/images/logo.png`

Za ustvarjanje preprostega logotipa lahko uporabite kateri koli urejevalnik slik ali uporabite ogrado s spletnega mesta, kot je placeholder.com.

## Korak 9: Namestite modul

1. Prijavite se na svoje spletno mesto XOOPS kot skrbnik
2. Pojdite na **Sistemski skrbnik** > **Moduli**
3. Na seznamu razpoložljivih modulov poiščite "Hello World".
4. Kliknite gumb **Namesti**
5. Potrdite namestitev

## 10. korak: Preizkusite svoj modul

### Frontend Test

1. Pomaknite se na svoje spletno mesto XOOPS
2. V glavnem meniju kliknite »Hello World«.
3. Morali bi videti pozdravno sporočilo in trenutni čas

### Administratorski test

1. Pojdite v skrbniško območje
2. V skrbniškem meniju kliknite »Hello World«.
3. Morali bi videti skrbniško nadzorno ploščo

## Odpravljanje težav

### Modul ni prikazan na seznamu namestitve

- Preverite dovoljenja za datoteke (755 za imenike, 644 za datoteke)
- Preverite, da `xoops_version.php` nima sintaktičnih napak
- Počisti predpomnilnik XOOPS

### Predloga se ne nalaga

- Zagotovite, da so datoteke predloge v pravilnem imeniku
- Preverite, ali se imena datotek predlog ujemajo s tistimi v `xoops_version.php`
- Preverite, ali je sintaksa Smarty pravilna

### Jezikovni nizi niso prikazani

- Preverite poti jezikovnih datotek
- Zagotovite, da so jezikovne konstante definirane
- Preverite, ali obstaja pravilna jezikovna mapa## Naslednji koraki

Zdaj, ko imate delujoč modul, nadaljujte z učenjem z:

- Gradnja-CRUD-modula - Dodajte funkcionalnost baze podatkov
- ../Patterns/MVC-Pattern - pravilno organizirajte svojo kodo
- ../Best-Practices/Testing - Dodajte teste PHPUnit

## Popolna referenca datoteke

Vaš dokončan modul mora imeti te datoteke:
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
## Povzetek

čestitke! Ustvarili ste svoj prvi XOOPS modul. Zajeti ključni pojmi:

1. **Struktura modula** - Standardna postavitev imenika modulov XOOPS
2. **xoops_version.php** - Definicija in konfiguracija modula
3. **Jezikovne datoteke** - podpora za internacionalizacijo
4. **Predloge** – integracija predlog Smarty
5. **Administratorski vmesnik** - Osnovna skrbniška plošča

Glej tudi: ../Module-Development | Izdelava-CRUD-modula | ../Patterns/MVC-Vzorec