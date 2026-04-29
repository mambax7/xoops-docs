---
title: "Administratorske stranice modula"
description: "Stvaranje standardiziranih i naprijed kompatibilnih stranica modula administration sa XMF"
---
`Xmf\Module\Admin` class pruža dosljedan način za stvaranje sučelja modula administration. Korištenje stranica XMF za admin osigurava kompatibilnost s budućim XOOPS verzijama uz zadržavanje jedinstvenog korisničkog iskustva.

## Pregled

ModuleAdmin class u XOOPS Frameworks učinio je administration lakšim, ali njegov API evoluirao je u više verzija. Omot `Xmf\Module\Admin`:

- Pruža stabilan API koji radi na svim verzijama XOOPS
- Automatski obrađuje API razlike između verzija
- Osigurava da je vaš kod admin kompatibilan s naprijed
- Nudi prikladne statičke metode za uobičajene zadatke

## Početak

### Stvaranje administrativne instance

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Ovo vraća ili instancu `Xmf\Module\Admin` ili izvorni sustav class ako je već kompatibilan.

## Upravljanje ikonama

### Problem lokacije ikone

Ikone su se premještale između verzija XOOPS, uzrokujući glavobolje pri održavanju. XMF to rješava pomoću pomoćnih metoda.

### Pronalaženje ikona

**Stari način (ovisno o verziji):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF način:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Metoda `iconUrl()` vraća puni URL, tako da ne morate brinuti o konstrukciji staze.

### Veličine ikona

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Ikone izbornika

Za admin izbornik.php files:

**Stari način:**
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

**XMF način:**
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

## Standardne administratorske stranice

### Indeksna stranica

**Stari format:**
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

### O stranici

**Stari format:**
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

> **Napomena:** U budućim XOOPS verzijama, PayPal informacije postavljene su u xoops_version.php. Poziv `setPaypal()` osigurava kompatibilnost s trenutnim verzijama dok nema učinka na novije.

## Navigacija

### Prikaz navigacijskog izbornika

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Info okviri

### Stvaranje info okvira

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

## Konfiguracijski okviri

Konfiguracijski okviri prikazuju zahtjeve sustava i provjere statusa.

### Osnovne konfiguracijske linije

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

### Pogodne metode

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

### Vrste konfiguracijskih okvira

| Upišite | Vrijednost | Ponašanje |
|------|-------|----------|
| `default` | Niz poruke | Izravno prikazuje poruku |
| `folder` | Put direktorija | Prikazuje prihvaćanje ako postoji, pogrešku ako ne |
| `chmod` | `[path, permission]` | Provjerava postojanje imenika uz dopuštenje |
| `module` | Naziv modula | Prihvati ako je instaliran, greška ako nije |
| `module` | `[name, 'warning']` | Prihvati ako je instaliran, upozorenje ako nije |

## Gumbi stavki

Dodajte akcijske gumbe stranicama admin:

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

## Potpuni primjeri administratorskih stranica

### indeks.php

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

### stavke.php

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

### oko.php

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

### izbornik.php

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

## API Referenca

### Statičke metode| Metoda | Opis |
|--------|-------------|
| `getInstance()` | Nabavite instancu admin |
| `iconUrl($name, $size)` | Preuzmi ikonu URL (veličina: 16 ili 32) |
| `menuIconPath($image)` | Dohvaćanje putanje ikone za izbornik.php |
| `setPaypal($paypal)` | Postavite PayPal ID za stranicu o |

### Metode instance

| Metoda | Opis |
|--------|-------------|
| `displayNavigation($menu)` | Prikaži navigacijski izbornik |
| `renderNavigation($menu)` | Navigacija za povratak HTML |
| `addInfoBox($title)` | Dodaj info okvir |
| `addInfoBoxLine($text, $type, $color)` | Dodaj redak u info okvir |
| `displayInfoBox()` | Prikaz info okvira |
| `renderInfoBox()` | Info okvir za povrat HTML |
| `addConfigBoxLine($value, $type)` | Dodaj redak za provjeru konfiguracije |
| `addConfigError($value)` | Dodaj pogrešku u konfiguracijski okvir |
| `addConfigAccept($value)` | Dodaj uspjeh u konfiguracijski okvir |
| `addConfigWarning($value)` | Dodaj upozorenje u konfiguracijski okvir |
| `addConfigModuleVersion($moddir, $version)` | Provjerite verziju modula |
| `addItemButton($title, $link, $icon, $extra)` | Dodaj akcijski gumb |
| `displayButton($position, $delimiter)` | Tipke za prikaz |
| `renderButton($position, $delimiter)` | Gumb za povratak HTML |
| `displayIndex()` | Prikaz indeksne stranice |
| `renderIndex()` | Vrati indeksnu stranicu HTML |
| `displayAbout($logo_xoops)` | Prikaz o stranici |
| `renderAbout($logo_xoops)` | Povratak o stranici HTML |

## Vidi također

- ../Basics/XMF-Module-Helper - Module helper class
- Permission-Helper - Upravljanje dozvolama
- ../XMF-Framework - Pregled okvira

---

#xmf #admin #modul-development #navigation #icons
