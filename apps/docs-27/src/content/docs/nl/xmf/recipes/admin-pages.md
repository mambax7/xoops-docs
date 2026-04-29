---
title: "Modulebeheerpagina's"
description: "Creëer gestandaardiseerde en voorwaarts compatibele modulebeheerpagina's met XMF"
---
De klasse `Xmf\Module\Admin` biedt een consistente manier om modulebeheerinterfaces te maken. Het gebruik van XMF voor beheerderspagina's zorgt voor voorwaartse compatibiliteit met toekomstige XOOPS-versies, terwijl een uniforme gebruikerservaring behouden blijft.

## Overzicht

De klasse ModuleAdmin in XOOPS Frameworks maakte het beheer eenvoudiger, maar de API is in verschillende versies geëvolueerd. De `Xmf\Module\Admin`-wikkelaar:

- Biedt een stabiele API die werkt met alle XOOPS-versies
- Verwerkt automatisch API-verschillen tussen versies
- Zorgt ervoor dat uw beheerderscode voorwaarts compatibel is
- Biedt handige statische methoden voor algemene taken

## Aan de slag

### Een beheerdersinstantie maken

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Dit retourneert een `Xmf\Module\Admin`-instantie of een systeemeigen systeemklasse, indien deze al compatibel is.

## Pictogrambeheer

### Het pictogramlocatieprobleem

Pictogrammen zijn verplaatst tussen de XOOPS-versies, wat onderhoudsproblemen veroorzaakt. XMF lost dit op met hulpprogramma-methoden.

### Pictogrammen zoeken

**Oude manier (versie-afhankelijk):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF manier:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

De methode `iconUrl()` retourneert een volledige URL, zodat u zich geen zorgen hoeft te maken over de padconstructie.

### Pictogramgroottes

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Menupictogrammen

Voor beheerders menu.php-bestanden:

**Oude manier:**
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

**XMF manier:**
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

## Standaard beheerderspagina's

### Indexpagina

**Oud formaat:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF-indeling:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Over pagina

**Oud formaat:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF-indeling:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Opmerking:** In toekomstige XOOPS-versies worden PayPal-gegevens ingesteld in xoops_version.php. De `setPaypal()`-oproep zorgt voor compatibiliteit met huidige versies, maar heeft geen effect op nieuwere versies.

## Navigatie

### Navigatiemenu weergeven

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Infoboxen

### Infoboxen maken

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

## Configuratievakken

Configuratievakken geven systeemvereisten en statuscontroles weer.

### Basisconfiguratieregels

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

### Gemaksmethoden

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

### Configuratieboxtypen

| Typ | Waarde | Gedrag |
|------|-------|----------|
| `default` | Berichtreeks | Toont bericht direct |
| `folder` | Directorypad | Toont accepteren als dit bestaat, fout als dat niet het geval is |
| `chmod` | `[path, permission]` | De map Controles bestaat met toestemming |
| `module` | Modulenaam | Accepteer indien geïnstalleerd, fout indien niet |
| `module` | `[name, 'warning']` | Accepteren indien geïnstalleerd, waarschuwing indien niet |

## Itemknoppen

Actieknoppen toevoegen aan beheerderspagina's:

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

## Volledige voorbeelden van beheerderspagina's

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

### about.php

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

## API-referentie

### Statische methoden

| Werkwijze | Beschrijving |
|--------|-------------|
| `getInstance()` | Beheerinstantie verkrijgen |
| `iconUrl($name, $size)` | Pictogram ophalen URL (maat: 16 of 32) |
| `menuIconPath($image)` | Pictogrampad ophalen voor menu.php |
| `setPaypal($paypal)` | Stel PayPal-ID in voor ongeveer pagina |

### Instantiemethoden

| Werkwijze | Beschrijving |
|--------|-------------|
| `displayNavigation($menu)` | Navigatiemenu weergeven |
| `renderNavigation($menu)` | Terugnavigatie HTML |
| `addInfoBox($title)` | Infobox toevoegen |
| `addInfoBoxLine($text, $type, $color)` | Regel toevoegen aan infobox |
| `displayInfoBox()` | Infobox weergeven |
| `renderInfoBox()` | Infobox retourzending HTML |
| `addConfigBoxLine($value, $type)` | Configuratiecontroleregel toevoegen |
| `addConfigError($value)` | Fout toevoegen aan configuratievak |
| `addConfigAccept($value)` | Voeg succes toe aan configuratievak |
| `addConfigWarning($value)` | Waarschuwing toevoegen aan configuratievak |
| `addConfigModuleVersion($moddir, $version)` | Controleer moduleversie |
| `addItemButton($title, $link, $icon, $extra)` | Actieknop toevoegen |
| `displayButton($position, $delimiter)` | Weergaveknoppen |
| `renderButton($position, $delimiter)` | Terugknop HTML |
| `displayIndex()` | Indexpagina weergeven |
| `renderIndex()` | Terug indexpagina HTML |
| `displayAbout($logo_xoops)` | Toon over pagina |
| `renderAbout($logo_xoops)` | Terug naar pagina HTML |

## Zie ook- ../Basics/XMF-Module-Helper - Modulehelperklasse
- Toestemmingshelper - Toestemmingsbeheer
- ../XMF-Framework - Kaderoverzicht

---

#xmf #admin #module-ontwikkeling #navigatie #icons