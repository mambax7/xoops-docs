---
title: "Modul Ahoj světe"
description: "Výukový program krok za krokem pro vytvoření vašeho prvního modulu XOOPS"
---

# Výukový program modulu Hello World

Tento tutoriál vás provede vytvořením vašeho prvního modulu XOOPS. Na konci budete mít funkční modul, který zobrazí „Hello World“ na frontendu i v oblasti admin.

## Předpoklady

- XOOPS 2.5.x nainstalován a spuštěn
- PHP 8.0 nebo vyšší
- Základní znalosti PHP
- Textový editor nebo IDE (doporučeno PHPStorm)

## Krok 1: Vytvořte adresářovou strukturu

Vytvořte následující adresářovou strukturu v `/modules/helloworld/`:

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

## Krok 2: Vytvořte definici modulu

Vytvořit `xoops_version.php`:

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

## Krok 3: Vytvořte jazykové soubory

### modinfo.php (informace o modulu)

Vytvořit `language/english/modinfo.php`:

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

### main.php (frontový jazyk)

Vytvořit `language/english/main.php`:

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

### admin.php (jazyk správce)

Vytvořit `language/english/admin.php`:

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

## Krok 4: Vytvořte Frontend Index

Vytvořte `index.php` v kořenovém adresáři modulu:

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

use XMF\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \XMF\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XOOPSModule $xoopsModule */
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

## Krok 5: Vytvořte šablonu frontendu

Vytvořit `templates/helloworld_index.tpl`:

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

## Krok 6: Vytvořte soubory správce

### Záhlaví správce

Vytvořit `admin/admin_header.php`:

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
$helper = \XMF\Module\Helper::getHelper('helloworld');
$adminObject = \XMF\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Zápatí správce

Vytvořit `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Nabídka správce

Vytvořit `admin/menu.php`:

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

### Stránka indexu administrátora

Vytvořit `admin/index.php`:

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

## Krok 7: Vytvořte šablonu správce

Vytvořit `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Krok 8: Vytvořte logo modulu

Vytvořte nebo zkopírujte obrázek PNG (doporučená velikost: 92x92 pixelů) do:
`assets/images/logo.png`

K vytvoření jednoduchého loga můžete použít libovolný editor obrázků nebo použít zástupný symbol z webu, jako je placeholder.com.

## Krok 9: Nainstalujte modul

1. Přihlaste se na svůj web XOOPS jako správce
2. Přejděte na **Správce systému** > **Moduly**
3. V seznamu dostupných modulů najděte "Hello World".
4. Klikněte na tlačítko **Instalovat**
5. Potvrďte instalaci

## Krok 10: Otestujte svůj modul

### Test frontendu

1. Přejděte na svůj web XOOPS
2. Klikněte na "Hello World" v hlavní nabídce
3. Měli byste vidět uvítací zprávu a aktuální čas

### Test administrátora

1. Přejděte do oblasti pro správu
2. Klikněte na "Hello World" v nabídce správce
3. Měli byste vidět administrační panel

## Odstraňování problémů

### Modul se nezobrazuje v seznamu instalací

- Zkontrolujte oprávnění k souborům (755 pro adresáře, 644 pro soubory)
- Ověřte, že `xoops_version.php` neobsahuje žádné syntaktické chyby
- Vymažte mezipaměť XOOPS

### Šablona se nenačítá

- Ujistěte se, že soubory šablon jsou ve správném adresáři
- Zkontrolujte, zda se názvy souborů šablon shodují s názvy v `xoops_version.php`
- Ověřte správnost syntaxe Smarty

### Řetězce jazyka se nezobrazují

- Zkontrolujte cesty k jazykovým souborům
- Ujistěte se, že jsou definovány jazykové konstanty
- Ověřte, zda existuje složka správného jazyka

## Další kroky

Nyní, když máte pracovní modul, pokračujte ve výuce pomocí:

- Modul Building-a-CRUD - Přidání funkcí databáze
- ../Patterns/MVC-Pattern - Uspořádejte svůj kód správně
- ../Best-Practices/Testing - Přidat testy PHPUnit

## Kompletní odkaz na soubor

Váš dokončený modul by měl mít tyto soubory:

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

## Shrnutí

Gratulujeme! Vytvořili jste svůj první modul XOOPS. Klíčové pojmy:

1. **Struktura modulu** – Standardní rozložení adresáře modulu XOOPS
2. **xoops_version.php** - Definice a konfigurace modulu
3. **Jazykové soubory** – Podpora internacionalizace
4. **Šablony** – integrace šablony Smarty
5. **Administrátorské rozhraní** – Základní administrátorský panel

Viz také: ../Vývoj modulů | Modul Building-a-CRUD | ../Patterns/MVC-Pattern