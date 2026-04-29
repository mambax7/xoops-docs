---
title: "Stránky správce modulu"
description: "Vytváření standardizovaných a dopředně kompatibilních stránek pro správu modulů pomocí XMF"
---

Třída `XMF\Module\Admin` poskytuje konzistentní způsob vytváření rozhraní pro správu modulů. Použití XMF pro administrátorské stránky zajišťuje dopřednou kompatibilitu s budoucími verzemi XOOPS při zachování jednotné uživatelské zkušenosti.

## Přehled

Třída ModuleAdmin v rámcích XOOPS usnadnila správu, ale její API se napříč verzemi vyvíjel. Obal `XMF\Module\Admin`:

- Poskytuje stabilní API, který funguje napříč verzemi XOOPS
- Automaticky zpracovává rozdíly API mezi verzemi
- Zajišťuje, že váš administrátorský kód je dopředně kompatibilní
- Nabízí pohodlné statické metody pro běžné úkoly

## Začínáme

### Vytvoření instance správce

```php
$admin = \XMF\Module\Admin::getInstance();
```

To vrátí buď instanci `XMF\Module\Admin`, nebo nativní systémovou třídu, pokud je již kompatibilní.

## Správa ikon

### Problém s umístěním ikony

Ikony se přesunuly mezi verzemi XOOPS, což způsobilo problémy s údržbou. XMF to řeší obslužnými metodami.

### Hledání ikon

**Starý způsob (závisí na verzi):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF způsob:**
```php
$img_src = \XMF\Module\Admin::iconUrl('delete.png', 16);
```

Metoda `iconUrl()` vrací plné URL, takže se nemusíte starat o stavbu cesty.

### Velikosti ikon

```php
// 16x16 icons
$smallIcon = \XMF\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \XMF\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \XMF\Module\Admin::iconUrl('', 16);
```

### Ikony nabídky

Pro soubory správce menu.php:

**Starý způsob:**
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

**XMF způsob:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('XMF\Module\Admin', true)) {
    $pathIcon32 = \XMF\Module\Admin::menuIconPath('');
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

## Standardní stránky administrátora

### Stránka indexu

**Starý formát:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Formát XMF:**
```php
$indexAdmin = \XMF\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### O stránce

**Starý formát:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Formát XMF:**
```php
$aboutAdmin = \XMF\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\XMF\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Poznámka:** V budoucích verzích XOOPS jsou informace PayPal nastaveny v xoops_version.php. Volání `setPaypal()` zajišťuje kompatibilitu s aktuálními verzemi, přičemž nemá žádný vliv na novější.

## Navigace

### Zobrazení navigační nabídky

```php
$admin = \XMF\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Informační pole

### Vytváření informačních polí

```php
$admin = \XMF\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## Konfigurační boxy

Konfigurační pole zobrazují systémové požadavky a kontroly stavu.

### Základní konfigurační řádky

```php
$admin = \XMF\Module\Admin::getInstance();

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

### Metody pohodlí

```php
$admin = \XMF\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Typy konfiguračních polí

| Typ | Hodnota | Chování |
|------|-------|----------|
| `default` | Řetězec zprávy | Zobrazí zprávu přímo |
| `folder` | Cesta k adresáři | Zobrazí přijmout, pokud existuje, chybu, pokud ne |
| `chmod` | `[path, permission]` | Kontroluje existenci adresáře s oprávněním |
| `module` | Název modulu | Přijmout, pokud je nainstalován, chyba, pokud není |
| `module` | `[name, 'warning']` | Přijmout, pokud je nainstalován, upozornění, pokud není |

## Tlačítka položek

Přidejte tlačítka akcí na stránky správce:

```php
$admin = \XMF\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Kompletní příklady stránek pro administrátory

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \XMF\Module\Admin::getInstance();

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

$adminObject = \XMF\Module\Admin::getInstance();

// Get operation
$op = \XMF\Request::getCmd('op', 'list');

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
            echo '<a href="' . $editUrl . '"><img src="' . \XMF\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \XMF\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
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

$adminObject = \XMF\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\XMF\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

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
if (class_exists('XMF\Module\Admin', true)) {
    $pathIcon32 = \XMF\Module\Admin::menuIconPath('');
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

## Reference API

### Statické metody

| Metoda | Popis |
|--------|-------------|
| `getInstance()` | Získat instanci správce |
| `iconUrl($name, $size)` | Získat ikonu URL (velikost: 16 nebo 32) |
| `menuIconPath($image)` | Získejte cestu k ikoně pro menu.php |
| `setPaypal($paypal)` | Nastavit PayPal ID pro stránku o |

### Metody instance

| Metoda | Popis |
|--------|-------------|
| `displayNavigation($menu)` | Zobrazit navigační menu |
| `renderNavigation($menu)` | Zpětná navigace HTML |
| `addInfoBox($title)` | Přidat informační pole |
| `addInfoBoxLine($text, $type, $color)` | Přidat řádek do informačního pole |
| `displayInfoBox()` | Zobrazit informační pole |
| `renderInfoBox()` | Zpětná infobox HTML |
| `addConfigBoxLine($value, $type)` | Přidat kontrolní řádek konfigurace |
| `addConfigError($value)` | Přidat chybu do konfiguračního pole |
| `addConfigAccept($value)` | Přidejte úspěch do konfiguračního pole |
| `addConfigWarning($value)` | Přidat varování do konfiguračního pole |
| `addConfigModuleVersion($moddir, $version)` | Zkontrolujte verzi modulu |
| `addItemButton($title, $link, $icon, $extra)` | Přidat akční tlačítko |
| `displayButton($position, $delimiter)` | Tlačítka displeje |
| `renderButton($position, $delimiter)` | Tlačítko návratu HTML |
| `displayIndex()` | Zobrazit stránku indexu |
| `renderIndex()` | Návratová stránka indexu HTML |
| `displayAbout($logo_xoops)` | Zobrazit o stránce |
| `renderAbout($logo_xoops)` | Zpět na stránku HTML |

## Viz také

- ../Basics/XMF-Module-Helper - Pomocná třída modulu
- Permission-Helper - Správa oprávnění
- ../XMF-Framework - Přehled rámce

---

#xmf #admin #modul-development #navigation #icons