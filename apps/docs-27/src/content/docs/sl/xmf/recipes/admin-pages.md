---
title: "Skrbniške strani modula"
description: "Ustvarjanje standardiziranih in naprej združljivih skrbniških strani modulov z XMF"
---
Razred `XMF\Module\Admin` zagotavlja dosleden način za ustvarjanje skrbniških vmesnikov modulov. Uporaba XMF za skrbniške strani zagotavlja združljivost naprej s prihodnjimi različicami XOOPS, hkrati pa ohranja enotno uporabniško izkušnjo.

## Pregled

Razred ModuleAdmin v XOOPS Frameworks je olajšal administracijo, vendar se je njegov API razvil med različicami. Ovoj `XMF\Module\Admin`:

- Zagotavlja stabilen API, ki deluje v vseh različicah XOOPS
- Samodejno obravnava API razlike med različicami
- Zagotavlja, da je vaša skrbniška koda združljiva naprej
- Ponuja priročne statične metode za običajna opravila

## Kako začeti

### Ustvarjanje skrbniškega primerka
```php
$admin = \Xmf\Module\Admin::getInstance();
```
To vrne primerek `XMF\Module\Admin` ali izvorni sistemski razred, če je že združljiv.

## Upravljanje ikon

### Težava z lokacijo ikone

Ikone so se premikale med različicami XOOPS, kar povzroča preglavice pri vzdrževanju. XMF to rešuje s pomožnimi metodami.

### Iskanje ikon

**Star način (odvisno od različice):**
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
Metoda `iconUrl()` vrne celoten URL, tako da vam ni treba skrbeti za konstrukcijo poti.

### Velikosti ikon
```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```
### Ikone menija

Za skrbniški meni.php files:

**Star način:**
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
## Standardne skrbniške strani

### Indeksna stran

**Stara oblika:**
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
### O strani

**Stara oblika:**
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
> **Opomba:** V prihodnjih različicah XOOPS so informacije o PayPal nastavljene v xoops_version.php. Klic `setPaypal()` zagotavlja združljivost s trenutnimi različicami, pri novejših pa nima učinka.

## Navigacija

### Prikaz navigacijskega menija
```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```
## Informacijska polja

### Ustvarjanje informacijskih polj
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
## Konfiguracijska polja

Konfiguracijska polja prikazujejo sistemske zahteve in preverjanja stanja.

### Osnovne konfiguracijske vrstice
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
### Priročne metode
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
### Vrste konfiguracijskih polj

| Vrsta | Vrednost | Vedenje |
|------|-------|----------|
| `default` | Niz sporočila | Neposredno prikaže sporočilo |
| `folder` | Pot imenika | Prikaže sprejme, če obstaja, napako, če ne |
| `chmod` | `[path, permission]` | Preveri, ali imenik obstaja z dovoljenjem |
| `module` | Ime modula | Sprejmi, če je nameščen, napaka, če ni |
| `module` | `[name, 'warning']` | Sprejmi, če je nameščen, opozorilo, če ni |

## Gumbi elementov

Dodajte akcijske gumbe skrbniškim stranem:
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
## Popolni primeri skrbniških strani

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
## API Referenca

### Statične metode

| Metoda | Opis |
|--------|-------------|
| `getInstance()` | Pridobite skrbniški primerek |
| `iconUrl($name, $size)` | Pridobi ikono URL (velikost: 16 ali 32) |
| `menuIconPath($image)` | Pridobite pot ikone za meni.php |
| `setPaypal($paypal)` | Nastavite PayPal ID za približno stran |

### Metode primerkov

| Metoda | Opis |
|--------|-------------|
| `displayNavigation($menu)` | Prikaži navigacijski meni |
| `renderNavigation($menu)` | Povratna navigacija HTML |
| `addInfoBox($title)` | Dodaj polje z informacijami |
| `addInfoBoxLine($text, $type, $color)` | Dodaj vrstico v polje z informacijami |
| `displayInfoBox()` | Prikaži polje z informacijami |
| `renderInfoBox()` | Info polje za vračilo HTML |
| `addConfigBoxLine($value, $type)` | Dodaj vrstico za preverjanje konfiguracije |
| `addConfigError($value)` | Dodaj napako v konfiguracijsko polje |
| `addConfigAccept($value)` | Dodaj uspeh v konfiguracijsko polje |
| `addConfigWarning($value)` | Dodaj opozorilo v konfiguracijsko polje |
| `addConfigModuleVersion($moddir, $version)` | Preverite različico modula |
| `addItemButton($title, $link, $icon, $extra)` | Dodaj akcijski gumb |
| `displayButton($position, $delimiter)` | Prikaz gumbov |
| `renderButton($position, $delimiter)` | Gumb za vrnitev HTML |
| `displayIndex()` | Prikaži indeksno stran |
| `renderIndex()` | Vrni indeksno stran HTML |
| `displayAbout($logo_xoops)` | Prikaz o strani |
| `renderAbout($logo_xoops)` | Vrni se na stran HTML |## Glej tudi

- ../Basics/XMF-Module-Helper - Razred za pomoč modulom
- Permission-Helper - Upravljanje dovoljenj
- ../XMF-Framework - Pregled okvira

---

#XMF #admin #module-development #navigation #icons