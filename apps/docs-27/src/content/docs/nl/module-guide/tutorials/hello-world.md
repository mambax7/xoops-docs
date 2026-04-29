---
title: "Hallo wereldmodule"
description: "Stapsgewijze handleiding voor het maken van uw eerste XOOPS-module"
---
# Hallo wereld module-tutorial

Deze tutorial begeleidt u bij het maken van uw eerste XOOPS-module. Aan het einde zul je een werkende module hebben die "Hallo Wereld" weergeeft op zowel het frontend- als het beheerdersgedeelte.

## Vereisten

- XOOPS 2.5.x geïnstalleerd en actief
- PHP 8.0 of hoger
- Basiskennis PHP
- Teksteditor of IDE (PhpStorm aanbevolen)

## Stap 1: Maak de directorystructuur

Maak de volgende directorystructuur in `/modules/helloworld/`:

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

## Stap 2: Maak de moduledefinitie

`xoops_version.php` aanmaken:

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

## Stap 3: Taalbestanden maken

### modinfo.php (Module-informatie)

`language/english/modinfo.php` aanmaken:

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

### main.php (frontendtaal)

`language/english/main.php` aanmaken:

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

### admin.php (beheerderstaal)

`language/english/admin.php` aanmaken:

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

## Stap 4: Maak de frontendindex

Maak `index.php` in de moduleroot:

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

## Stap 5: Maak de frontend-sjabloon

`templates/helloworld_index.tpl` aanmaken:

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

## Stap 6: Beheerbestanden maken

### Beheerderkop

`admin/admin_header.php` aanmaken:

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

### Beheerdervoettekst

`admin/admin_footer.php` aanmaken:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Beheerdersmenu

`admin/menu.php` aanmaken:

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

### Beheerdersindexpagina

`admin/index.php` aanmaken:

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

## Stap 7: Beheersjabloon maken

`templates/admin/helloworld_admin_index.tpl` aanmaken:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Stap 8: Maak het modulelogo

Maak of kopieer een PNG-afbeelding (aanbevolen formaat: 92x92 pixels) naar:
`assets/images/logo.png`

U kunt elke afbeeldingseditor gebruiken om een eenvoudig logo te maken, of u kunt een tijdelijke aanduiding van een site als placeholder.com gebruiken.

## Stap 9: Installeer de module

1. Meld u als beheerder aan bij uw XOOPS-site
2. Ga naar **Systeembeheerder** > **Modules**
3. Zoek "Hello World" in de lijst met beschikbare modules
4. Klik op de knop **Installeren**
5. Bevestig de installatie

## Stap 10: Test uw module

### Frontend-test

1. Navigeer naar uw XOOPS-site
2. Klik op "Hallo wereld" in het hoofdmenu
3. U zou het welkomstbericht en de huidige tijd moeten zien

### Beheerderstest

1. Ga naar het admin-gedeelte
2. Klik op "Hallo wereld" in het beheerdersmenu
3. U zou het beheerdersdashboard moeten zien

## Problemen oplossen

### Module verschijnt niet in installatielijst

- Controleer bestandsrechten (755 voor mappen, 644 voor bestanden)
- Controleer of `xoops_version.php` geen syntaxisfouten bevat
- Wis de XOOPS-cache

### Sjabloon wordt niet geladen

- Zorg ervoor dat de sjabloonbestanden in de juiste map staan
- Controleer of de sjabloonbestandsnamen overeenkomen met die in `xoops_version.php`
- Controleer of de Smarty-syntaxis correct is

### Taalreeksen worden niet weergegeven

- Controleer de taalbestandspaden
- Zorg ervoor dat taalconstanten zijn gedefinieerd
- Controleer of de juiste taalmap bestaat

## Volgende stappen

Nu je een werkende module hebt, kun je verder leren met:

- Een-CRUD-module bouwen - Databasefunctionaliteit toevoegen
- ../Patterns/MVC-Pattern - Organiseer uw code op de juiste manier
- ../Best-Practices/Testing - PHPUnit-tests toevoegen

## Volledige bestandsreferentie

Uw voltooide module zou deze bestanden moeten bevatten:

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

## Samenvatting

Gefeliciteerd! U hebt uw eerste XOOPS-module aangemaakt. Belangrijke concepten die aan bod komen:

1. **Modulestructuur** - Standaard XOOPS modulemapindeling
2. **xoops_version.php** - Moduledefinitie en -configuratie
3. **Taalbestanden** - Ondersteuning van internationalisering
4. **Sjablonen** - Smarty-sjabloonintegratie
5. **Beheerinterface** - Basis beheerderspaneel

Zie ook: ../Module-ontwikkeling | Een-CRUD-module bouwen | ../Patronen/MVC-Patroon