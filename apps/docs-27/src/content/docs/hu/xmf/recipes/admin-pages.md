---
title: "modul adminisztrátori oldalai"
description: "Szabványosított és előre kompatibilis moduladminisztrációs oldalak létrehozása XMF-fel"
---
A `XMF\module\Admin` osztály konzisztens módot biztosít a moduladminisztrációs felületek létrehozására. A XMF használata az adminisztrátori oldalakon biztosítja a jövőbeli XOOPS verziókkal való előrehaladási kompatibilitást, miközben fenntartja az egységes felhasználói élményt.

## Áttekintés

A XOOPS Frameworks moduleAdmin osztálya megkönnyítette az adminisztrációt, de a API változatok között fejlődött. A `XMF\module\Admin` csomagolóanyag:

- Stabil API-t biztosít, amely a XOOPS verziókban működik
- Automatikusan kezeli a API verziók közötti különbségeket
- Biztosítja, hogy az adminisztrátori kód továbbításkompatibilis
- Kényelmes statikus módszereket kínál a gyakori feladatokhoz

## Első lépések

### Adminisztrátori példány létrehozása

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Ez vagy egy `XMF\module\Admin` példányt vagy egy natív rendszerosztályt ad vissza, ha már kompatibilis.

## Ikonkezelés

### Az ikonok helyének problémája

Az ikonok a XOOPS verziók között mozogtak, ami karbantartási fejfájást okoz. A XMF ezt segédprogramokkal oldja meg.

### Ikonok keresése

**Régi módszer (verziófüggő):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF módon:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

A `iconUrl()` metódus teljes URL-t ad vissza, így nem kell aggódnia az útvonal kialakítása miatt.

### Ikonméretek

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Menü ikonok

Adminisztrátori menu.php fájlok esetén:

**Régi módszer:**
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

**XMF módon:**
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

## Szabványos adminisztrátori oldalak

### Index oldal

**Régi formátum:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF formátum:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Az oldalról

**Régi formátum:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF formátum:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Megjegyzés:** A jövőbeli XOOPS-verziókban a PayPal-információk a xoops_version.php-ban vannak beállítva. A `setPaypal()` hívás biztosítja a kompatibilitást a jelenlegi verziókkal, miközben nincs hatása az újabbakra.

## Navigáció

### Navigációs menü megjelenítése

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Információs dobozok

### Információs dobozok létrehozása

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

## Konfigurációs dobozok

A konfigurációs mezők a rendszerkövetelményeket és az állapotellenőrzéseket jelenítik meg.

### Alapvető konfigurációs sorok

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

### Kényelmes módszerek

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

### Konfigurációs doboz típusai

| Típus | Érték | Viselkedés |
|------|-------|----------|
| `default` | Üzenetkarakterlánc | Közvetlenül megjeleníti az üzenetet |
| `folder` | Címtár elérési útja | Megjeleníti az elfogadást, ha létezik, hibát, ha nem |
| `chmod` | `[path, permission]` | Ellenőrzi, hogy létezik-e a könyvtár engedélyével |
| `module` | modul neve | Elfogadás, ha telepítve van, hiba, ha nincs |
| `module` | `[name, 'warning']` | Elfogadás, ha telepítve van, figyelmeztetés, ha nincs |

## Elem gombok

Műveletgombok hozzáadása az adminisztrátori oldalakhoz:

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

## Példák teljes adminisztrátori oldalra

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

## API Referencia

### Statikus módszerek

| Módszer | Leírás |
|--------|--------------|
| `getInstance()` | Admin példány letöltése |
| `iconUrl($name, $size)` | Ikon lekérése URL (méret: 16 vagy 32) |
| `menuIconPath($image)` | A menu.php | ikon elérési útja
| `setPaypal($paypal)` | A PayPal ID beállítása körülbelül |

### Példánymódszerek

| Módszer | Leírás |
|--------|--------------|
| `displayNavigation($menu)` | Navigációs menü megjelenítése |
| `renderNavigation($menu)` | Navigáció vissza HTML |
| `addInfoBox($title)` | Információs doboz hozzáadása |
| `addInfoBoxLine($text, $type, $color)` | Sor hozzáadása az információs mezőhöz |
| `displayInfoBox()` | Információs doboz megjelenítése |
| `renderInfoBox()` | Visszaküldési információs doboz HTML |
| `addConfigBoxLine($value, $type)` | Konfig ellenőrző sor hozzáadása |
| `addConfigError($value)` | Hiba hozzáadása a konfigurációs dobozhoz |
| `addConfigAccept($value)` | Siker hozzáadása a konfigurációs dobozhoz |
| `addConfigWarning($value)` | Figyelmeztetés hozzáadása a konfigurációs dobozhoz |
| `addConfigmoduleVersion($moddir, $version)` | modul verziójának ellenőrzése |
| `addItemButton($title, $link, $icon, $extra)` | Művelet gomb hozzáadása |
| `displayButton($position, $delimiter)` | Kijelző gombok |
| `renderButton($position, $delimiter)` | Vissza gomb HTML |
| `displayIndex()` | Indexoldal megjelenítése |
| `renderIndex()` | Indexoldal visszaküldése HTML |
| `displayAbout($logo_xoops)` | Megjelenítés az oldalról |
| `renderAbout($logo_xoops)` | Vissza a következő oldalra: HTML |

## Lásd még- ../Basics/XMF-module-Helper - modul segítő osztály
- Engedély-Helper - Engedélykezelés
- ../XMF-Framework - A keretrendszer áttekintése

---

#xmf #admin #modul-fejlesztés #navigáció #ikonok
