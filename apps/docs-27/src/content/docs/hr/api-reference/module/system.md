---
title: "Sustav modula XOOPS"
description: "Životni ciklus modula, XoopsModule class, instalacija/deinstalacija modula, priključnice modula i upravljanje modulom"
---
Sustav modula XOOPS pruža kompletan okvir za razvoj, instaliranje, upravljanje i proširenje funkcionalnosti modula. moduli su samostalni paketi koji proširuju XOOPS dodatnim značajkama i mogućnostima.

## Arhitektura modula

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

## Struktura modula

Standardna struktura direktorija modula XOOPS:

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

## XoopsModule klasa

XoopsModule class predstavlja instalirani modul XOOPS.

### Pregled razreda

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

### Svojstva

| Vlasništvo | Upišite | Opis |
|----------|------|-------------|
| `$moduleid` | int | Jedinstveni ID modula |
| `$name` | niz | Naziv za prikaz modula |
| `$dirname` | niz | Naziv direktorija modula |
| `$version` | niz | Trenutna verzija modula |
| `$description` | niz | Opis modula |
| `$config` | niz | Konfiguracija modula |
| `$blocks` | niz | Blokovi modula |
| `$adminPages` | niz | Stranice administrativne ploče |
| `$userPages` | niz | Stranice okrenute korisnicima |

### Konstruktor

```php
public function __construct()
```

Stvara novu instancu modula i inicijalizira varijable.

### Osnovne metode

#### getName

Dobiva ime za prikaz modula.

```php
public function getName(): string
```

**Povrat:** `string` - Prikazni naziv modula

**Primjer:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### getDirname

Dobiva naziv direktorija modula.

```php
public function getDirname(): string
```

**Vraća:** `string` - Naziv direktorija modula

**Primjer:**
```php
echo $module->getDirname(); // "publisher"
```

#### getVersion

Dobiva trenutnu verziju modula.

```php
public function getVersion(): string
```

**Vraća:** `string` - Niz verzije

**Primjer:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### getDescription

Dobiva opis modula.

```php
public function getDescription(): string
```

**Povrat:** `string` - Opis modula

**Primjer:**
```php
$desc = $module->getDescription();
```

#### getConfig

Dohvaća konfiguraciju modula.

```php
public function getConfig(string $key = null): mixed
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Konfiguracijski ključ (nula za sve) |

**Vraća:** `mixed` - vrijednost konfiguracije ili niz

**Primjer:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

Postavlja konfiguraciju modula.

```php
public function setConfig(string $key, mixed $value): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Konfiguracijski ključ |
| `$value` | mješoviti | Vrijednost konfiguracije |

**Primjer:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### getPath

Dobiva potpuni put sustava datoteka do modula.

```php
public function getPath(): string
```

**Vraća:** `string` - Apsolutni put direktorija modula

**Primjer:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

Dovodi URL do modula.

```php
public function getUrl(): string
```

**Povrat:** `string` - modul URL

**Primjer:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## Proces instalacije modula

### funkcija xoops_module_install

Funkcija instalacije modula definirana u `xoops_version.php`:

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

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$module` | XoopsModule | modul koji se instalira |

**Vraća:** `bool` - Točno u slučaju uspjeha, Netočno u slučaju neuspjeha

**Primjer:**
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

### funkcija xoops_module_uninstall

Funkcija deinstalacije modula:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**Primjer:**
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
## Kuke za module

Kuke modula omogućuju integraciju modules s drugim modules i sustavom.

### Deklaracija kuke

U `xoops_version.php`:

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

### Implementacija kuke

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

### Dostupne kuke sustava

| Kuka | Parametri | Opis |
|------|-----------|-------------|
| `system.page.header` | Ništa | Ispis zaglavlja stranice |
| `system.page.footer` | Ništa | Ispis podnožja stranice |
| `user.login.success` | $user objekt | Nakon prijave korisnika |
| `user.logout` | $user objekt | Nakon odjave korisnika |
| `user.profile.view` | $user_id | Pregled korisničkog profila |
| `module.install` | $module objekt | Instalacija modula |
| `module.uninstall` | $module objekt | Deinstalacija modula |

## Usluga upravitelja modula

Usluga ModuleManager upravlja operacijama modula.

### Metode

#### getModule

Dohvaća modul po imenu.

```php
public function getModule(string $dirname): ?XoopsModule
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$dirname` | niz | Naziv direktorija modula |

**Vraća:** `?XoopsModule` - Instanca modula ili null

**Primjer:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### getAllModules

Dobiva sve instalirane modules.

```php
public function getAllModules(bool $activeOnly = true): array
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$activeOnly` | bool | Vrati samo aktivno modules |

**Vraća:** `array` - niz XoopsModule objekata

**Primjer:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### je aktivan modul

Provjerava je li modul aktivan.

```php
public function isModuleActive(string $dirname): bool
```

**Primjer:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### aktivirajModul

Aktivira modul.

```php
public function activateModule(string $dirname): bool
```

**Primjer:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### deaktivirajModul

Deaktivira modul.

```php
public function deactivateModule(string $dirname): bool
```

**Primjer:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## Konfiguracija modula (xoops_version.php)

Primjer potpunog manifesta modula:

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

## Najbolji primjeri iz prakse

1. **Prostor imena Vaši razredi** - Koristite prostore imena specifične za modul kako biste izbjegli sukobe

2. **Koristite rukovatelje** - Uvijek koristite rukovatelj classes za operacije baze podataka

3. **Internacionalizacija sadržaja** - Koristite konstante language za sve nizove okrenute prema korisniku

4. **Stvorite instalacijske skripte** - Osigurajte SQL sheme za tablice baze podataka

5. **Kučice za dokumente** - Jasno dokumentirajte koje kukice vaš modul nudi

6. **Verzirajte svoj modul** - Povećajte brojeve verzija s izdanjima

7. **Probna instalacija** - Temeljito testirajte procese instalacije/deinstalacije

8. **Handle Permissions** - Provjerite korisnička dopuštenja prije dopuštanja radnji

## Cijeli primjer modula

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

## Povezana dokumentacija

- ../Kernel/Kernel-Classes - Inicijalizacija jezgre i osnovne usluge
- ../Template/Template-System - modul templates i integracija teme
- ../Database/QueryBuilder - Izgradnja upita baze podataka
- ../Core/XoopsObject - Osnovni objekt class

---

*Pogledajte također: [XOOPS Vodič za razvoj modula](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*
