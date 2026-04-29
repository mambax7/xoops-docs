---
title: "Module Admin Pages"
description: "Oprettelse af standardiserede og fremadkompatible moduladministrationssider med XMF"
---

Klassen `Xmf\Module\Admin` giver en ensartet måde at skabe moduladministrationsgrænseflader på. Brug af XMF til admin-sider sikrer fremadrettet kompatibilitet med fremtidige XOOPS-versioner, samtidig med at en ensartet brugeroplevelse bevares.

## Oversigt

Klassen ModuleAdmin i XOOPS Frameworks gjorde administrationen nemmere, men dens API har udviklet sig på tværs af versioner. `Xmf\Module\Admin`-indpakningen:

- Giver en stabil API, der fungerer på tværs af XOOPS versioner
- Håndterer automatisk API forskelle mellem versioner
- Sikrer, at din administratorkode er forward-kompatibel
- Tilbyder praktiske statiske metoder til almindelige opgaver

## Kom godt i gang

### Oprettelse af en administratorinstans

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Dette returnerer enten en `Xmf\Module\Admin`-instans eller en indbygget systemklasse, hvis den allerede er kompatibel.

## Ikonstyring

### Ikonets placeringsproblem

Ikoner har flyttet sig mellem XOOPS-versioner, hvilket forårsager vedligeholdelseshovedpine. XMF løser dette med hjælpemetoder.

### Find ikoner

**gammeldags (versionsafhængig):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF måde:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()`-metoden returnerer en fuld URL, så du behøver ikke bekymre dig om stikonstruktion.

### Ikonstørrelser

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Menuikoner

For admin menu.php filer:

**gammel måde:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF måde:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Standard administratorsider

### Indeksside

**Gamle format:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF format:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Om side

**Gamle format:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF format:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Bemærk:** I fremtidige XOOPS-versioner er PayPal-oplysninger indstillet i xoops_version.php. `setPaypal()`-opkaldet sikrer kompatibilitet med nuværende versioner, mens det ikke har nogen effekt i nyere.

## Navigation

### Vis navigationsmenu

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Infobokse

### Oprettelse af infobokse

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## Konfigurationsbokse

Konfigurationsbokse viser systemkrav og statustjek.

### Basic Config Lines

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### Bekvemmelighedsmetoder

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Konfigurationsbokstyper

| Skriv | Værdi | Adfærd |
|------|-------|---------|
| `default` | Meddelelsesstreng | Viser besked direkte |
| `folder` | Katalogsti | Viser accept hvis eksisterer, fejl hvis ikke |
| `chmod` | `[path, permission]` | Tjek bibliotek findes med tilladelse |
| `module` | Modulnavn | Accepter hvis installeret, fejl hvis ikke |
| `module` | `[name, 'warning']` | Accepter hvis installeret, advarsel hvis ikke |

## Genstandsknapper

Tilføj handlingsknapper til administratorsider:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Komplet eksempler på administratorside

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### om.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## API Reference

### Statiske metoder

| Metode | Beskrivelse |
|--------|-------------|
| `getInstance()` | Hent admin instans |
| `iconUrl($name, $size)` | Hent ikon URL (størrelse: 16 eller 32) |
| `menuIconPath($image)` | Hent ikonsti til menu.php |
| `setPaypal($paypal)` | Indstil PayPal ID for omkring side |

### Forekomstmetoder

| Metode | Beskrivelse |
|--------|-------------|
| `displayNavigation($menu)` | Vis navigationsmenu |
| `renderNavigation($menu)` | Returnavigation HTML |
| `addInfoBox($title)` | Tilføj infoboks |
| `addInfoBoxLine($text, $type, $color)` | Tilføj linje til infoboks |
| `displayInfoBox()` | Vis infoboks |
| `renderInfoBox()` | Returinfoboks HTML |
| `addConfigBoxLine($value, $type)` | Tilføj konfigurationskontrollinje |
| `addConfigError($value)` | Tilføj fejl til konfigurationsboks |
| `addConfigAccept($value)` | Tilføj succes til konfigurationsboksen |
| `addConfigWarning($value)` | Tilføj advarsel til konfigurationsboksen |
| `addConfigModuleVersion($moddir, $version)` | Tjek modulversion |
| `addItemButton($title, $link, $icon, $extra)` | Tilføj handlingsknap |
| `displayButton($position, $delimiter)` | Displayknapper |
| `renderButton($position, $delimiter)` | Returknap HTML |
| `displayIndex()` | Vis indeksside |
| `renderIndex()` | Returner indeksside HTML |
| `displayAbout($logo_xoops)` | Vis om side |
| `renderAbout($logo_xoops)` | Tilbage om side HTML |

## Se også

- ../Basics/XMF-Module-Helper - Modulhjælperklasse
- Tilladelse-Hjælper - Tilladelsesstyring
- ../XMF-Framework - Rammeoversigt

---#xmf #admin #moduludvikling #navigation #ikoner
