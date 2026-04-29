---
title: "XOOPS modulrendszer"
description: "modul életciklusa, XOOPSmodule osztály, modul telepítése/eltávolítása, modul akasztók és modulkezelés"
---
A XOOPS modulrendszer teljes keretet biztosít a modulfunkciók fejlesztéséhez, telepítéséhez, kezeléséhez és bővítéséhez. A modulok önálló csomagok, amelyek további funkciókkal és képességekkel bővítik a XOOPS-t.

## modul architektúra

```mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```

## modul felépítése

Szabványos XOOPS modul könyvtárszerkezet:

```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```

## XOOPSmodule osztály

A XOOPSmodule osztály egy telepített XOOPS modult jelent.

### Osztály áttekintése

```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```

### Tulajdonságok

| Ingatlan | Típus | Leírás |
|----------|------|--------------|
| `$moduleid` | int | Egyedi modul ID |
| `$name` | húr | modul megjelenített neve |
| `$dirname` | húr | modul könyvtár neve |
| `$version` | húr | A modul aktuális verziója |
| `$description` | húr | modul leírása |
| `$config` | tömb | modul konfiguráció |
| `$blocks` | tömb | modulblokkok |
| `$adminPages` | tömb | Felügyeleti panel oldalai |
| `$userPages` | tömb | Felhasználó felé néző oldalak |

### Konstruktor

```php
public function __construct()
```

Létrehoz egy új modulpéldányt, és inicializálja a változókat.

### Alapvető módszerek

#### getName

Lekéri a modul megjelenített nevét.

```php
public function getName(): string
```

**Visszaküldés:** `string` - modul megjelenített neve

**Példa:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### getDirname

Lekéri a modul könyvtárnevét.

```php
public function getDirname(): string
```

**Vissza:** `string` - modulkönyvtár neve

**Példa:**
```php
echo $module->getDirname(); // "publisher"
```

#### getVersion

Lekéri a modul aktuális verzióját.

```php
public function getVersion(): string
```

**Visszaküldés:** `string` - Verzió karakterlánc

**Példa:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### getDescription

Lekéri a modul leírását.

```php
public function getDescription(): string
```

**Visszaküldés:** `string` - modul leírása

**Példa:**
```php
$desc = $module->getDescription();
```

#### getConfig

Lekéri a modul konfigurációját.

```php
public function getConfig(string $key = null): mixed
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Konfigurációs kulcs (null az összeshez) |

**Vissza:** `mixed` - Konfigurációs érték vagy tömb

**Példa:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

Beállítja a modul konfigurációját.

```php
public function setConfig(string $key, mixed $value): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Konfigurációs kulcs |
| `$value` | vegyes | Konfigurációs érték |

**Példa:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### getPath

Lekéri a modul teljes fájlrendszer-útvonalát.

```php
public function getPath(): string
```

**Vissza:** `string` - Abszolút modulkönyvtár elérési út

**Példa:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

A URL-t eljuttatja a modulhoz.

```php
public function getUrl(): string
```

**Visszaküldés:** `string` - URL modul

**Példa:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## A modul telepítési folyamata

### xoops_module_install függvény

A `xoops_version.php`-ban meghatározott modultelepítési funkció:

```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$module` | XOOPSmodule | A modul telepítése |

**Visszaküldés:** `bool` - Siker esetén igaz, kudarc esetén hamis

**Példa:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```

### xoops_module_uninstall függvény

A modul eltávolítási funkciója:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**Példa:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```

## modul hookok

A modulkampók lehetővé teszik a modulok integrálását más modulokkal és a rendszerrel.

### Hook nyilatkozat

A `xoops_version.php`-ban:

```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```

### Hook megvalósítás

```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### Rendelkezésre álló rendszerhookok

| Horog | Paraméterek | Leírás |
|------|-----------|--------------|
| `system.page.header` | Nincs | Oldalfejléc kimenet |
| `system.page.footer` | Nincs | Oldalláb-kimenet |
| `user.login.success` | $user objektum | Felhasználói bejelentkezés után |
| `user.logout` | $user objektum | A felhasználó kijelentkezése után |
| `user.profile.view` | $user_id | Felhasználói profil megtekintése |
| `module.install` | $module objektum | modul telepítés |
| `module.uninstall` | $module objektum | modul eltávolítása |

## modulkezelő szolgáltatás

A moduleManager szolgáltatás kezeli a modulműveleteket.

### Módszerek

#### getmodule

Név szerint kér le egy modult.

```php
public function getModule(string $dirname): ?XoopsModule
```

**Paraméterek:**| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$dirname` | húr | modul könyvtár neve |

**Vissza:** `?XOOPSmodule` - modul példány vagy null

**Példa:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### getAllmodules

Megkapja az összes telepített modult.

```php
public function getAllModules(bool $activeOnly = true): array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$activeOnly` | bool | Csak az aktív modulokat adja vissza |

**Visszaküldés:** `array` - XOOPSmodule objektumok tömbje

**Példa:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### ismoduleActive

Ellenőrzi, hogy egy modul aktív-e.

```php
public function isModuleActive(string $dirname): bool
```

**Példa:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### aktiválja a modult

Aktivál egy modult.

```php
public function activateModule(string $dirname): bool
```

**Példa:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### deaktiválja a modult

Deaktivál egy modult.

```php
public function deactivateModule(string $dirname): bool
```

**Példa:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## modulkonfiguráció (xoops_version.php)

Példa a teljes moduljegyzékre:

```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```

## Bevált gyakorlatok

1. **Az osztályok névterei** – Az ütközések elkerülése érdekében használjon modulspecifikus névtereket

2. **Kezelők használata** - Mindig használjon kezelőosztályokat az adatbázis-műveletekhez

3. **Tartalom nemzetközivé tétele** - Használjon nyelvi konstansokat az összes felhasználó számára elérhető karakterlánchoz

4. **Telepítési parancsfájlok létrehozása** – SQL sémák biztosítása adatbázistáblákhoz

5. **Dokumentum akasztók** - Világosan dokumentálja, hogy a modul milyen akasztókat biztosít

6. **modul verziószáma** - Növelje a verziószámot a kiadásokkal

7. **Teszttelepítés** – A install/uninstall folyamatok alapos tesztelése

8. **Engedélyek kezelése** – A műveletek engedélyezése előtt ellenőrizze a felhasználói engedélyeket

## Teljes modul példa

```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```

## Kapcsolódó dokumentáció

- ../Kernel/Kernel-Classes - Kernel inicializálása és alapvető szolgáltatások
- ../Template/Template-System - modulsablonok és téma integráció
- ../Database/QueryBuilder - Adatbázis lekérdezés épület
- ../Core/XOOPSObject - Alap objektumosztály

---

*Lásd még: [XOOPS modulfejlesztési útmutató](https://github.com/XOOPS/XOOPSCore27/wiki/module-Development)*
