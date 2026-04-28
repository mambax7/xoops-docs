---
title: "Modul-Adminseiten"
description: "Erstellen standardisierter und zukunftsicherer Modul-Verwaltungsseiten mit XMF"
---

Die Klasse `Xmf\Module\Admin` bietet eine konsistente Methode zur Erstellung von Modul-Verwaltungsschnittstellen. Die Verwendung von XMF für Adminseiten gewährleistet Vorwärtskompatibilität mit zukünftigen XOOPS-Versionen und erhält gleichzeitig eine einheitliche Benutzererfahrung.

## Übersicht

Die ModuleAdmin-Klasse in XOOPS Frameworks vereinfachte die Verwaltung, aber ihre API hat sich über Versionen hinweg entwickelt. Der `Xmf\Module\Admin`-Wrapper:

- Bietet eine stabile API, die über XOOPS-Versionen hinweg funktioniert
- Behandelt automatisch API-Unterschiede zwischen Versionen
- Stellt sicher, dass Ihr Admin-Code vorwärtskompatibel ist
- Bietet praktische statische Methoden für häufige Aufgaben

## Erste Schritte

### Erstellen einer Admin-Instanz

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Dies gibt entweder eine `Xmf\Module\Admin`-Instanz oder eine native System-Klasse zurück, wenn bereits kompatibel.

## Icon-Verwaltung

### Das Icon-Speicherort-Problem

Symbole haben sich zwischen XOOPS-Versionen verschoben, was zu Wartungskopfschmerzen führt. XMF löst dies mit Utility-Methoden.

### Symbole finden

**Alte Weise (versionsabhängig):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF-Weise:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Die Methode `iconUrl()` gibt eine vollständige URL zurück, sodass Sie sich keine Sorgen um die Pfadkonstruktion machen müssen.

### Icon-Größen

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Menü-Symbole

Für Admin-menu.php-Dateien:

**Alte Weise:**
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

**XMF-Weise:**
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

## Standard-Admin-Seiten

### Index-Seite

**Altes Format:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF-Format:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Über-Seite

**Old format:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF-Format:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Note:** In future XOOPS versions, PayPal information is set in xoops_version.php. The `setPaypal()` call ensures compatibility with current versions while having no effect in newer ones.

## Navigation

### Navigationsmenü anzeigen

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Info-Felder

### Info-Felder erstellen

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

## Config-Felder

Config-Felder zeigen Systemanforderungen und Statusüberprüfungen an.

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

### Convenience Methods

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

### Config Box Types

| Type | Value | Behavior |
|------|-------|----------|
| `default` | Message string | Displays message directly |
| `folder` | Directory path | Shows accept if exists, error if not |
| `chmod` | `[path, permission]` | Checks directory exists with permission |
| `module` | Module name | Accept if installed, error if not |
| `module` | `[name, 'warning']` | Accept if installed, warning if not |

## Element-Schaltflächen

Fügen Sie Aktionsschaltflächen zu Admin-Seiten hinzu:

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

## Vollständige Admin-Seiten-Beispiele

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

## API-Referenz

### Statische Methoden

| Methode | Beschreibung |
|--------|-------------|
| `getInstance()` | Get admin instance |
| `iconUrl($name, $size)` | Get icon URL (size: 16 or 32) |
| `menuIconPath($image)` | Get icon path for menu.php |
| `setPaypal($paypal)` | Set PayPal ID for about page |

### Instanz-Methoden

| Method | Description |
|--------|-------------|
| `displayNavigation($menu)` | Display navigation menu |
| `renderNavigation($menu)` | Return navigation HTML |
| `addInfoBox($title)` | Add info box |
| `addInfoBoxLine($text, $type, $color)` | Add line to info box |
| `displayInfoBox()` | Display info box |
| `renderInfoBox()` | Return info box HTML |
| `addConfigBoxLine($value, $type)` | Add config check line |
| `addConfigError($value)` | Add error to config box |
| `addConfigAccept($value)` | Add success to config box |
| `addConfigWarning($value)` | Add warning to config box |
| `addConfigModuleVersion($moddir, $version)` | Check module version |
| `addItemButton($title, $link, $icon, $extra)` | Add action button |
| `displayButton($position, $delimiter)` | Display buttons |
| `renderButton($position, $delimiter)` | Return button HTML |
| `displayIndex()` | Display index page |
| `renderIndex()` | Return index page HTML |
| `displayAbout($logo_xoops)` | Display about page |
| `renderAbout($logo_xoops)` | Return about page HTML |

## Siehe auch

- ../Basics/XMF-Module-Helper - Modul-Helper-Klasse
- Permission-Helper - Berechtigungsverwaltung
- ../XMF-Framework - Framework-Übersicht

---

#xmf #admin #module-development #navigation #icons
