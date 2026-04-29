---
title: "XOOPS Sistem modulov"
description: "Življenjski cikel modula, razred XoopsModule, modul installation/uninstallation, kavlji modula in upravljanje modula"
---
Sistem modulov XOOPS zagotavlja popoln okvir za razvoj, namestitev, upravljanje in razširitev funkcionalnosti modulov. Moduli so samostojni paketi, ki razširjajo XOOPS z dodatnimi funkcijami in zmožnostmi.

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

Standardna struktura imenika modulov XOOPS:
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
## Razred XoopsModule

Razred XoopsModule predstavlja nameščen modul XOOPS.

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
### Lastnosti

| Lastnina | Vrsta | Opis |
|----------|------|-------------|
| `$moduleid` | int | Enolični ID modula |
| `$name` | niz | Prikazno ime modula |
| `$dirname` | niz | Ime imenika modula |
| `$version` | niz | Trenutna različica modula |
| `$description` | niz | Opis modula |
| `$config` | niz | Konfiguracija modula |
| `$blocks` | niz | Bloki modulov |
| `$adminPages` | niz | Strani skrbniške plošče |
| `$userPages` | niz | Uporabniške strani |

### Konstruktor
```php
public function __construct()
```
Ustvari nov primerek modula in inicializira spremenljivke.

### Osnovne metode

#### getName

Pridobi prikazno ime modula.
```php
public function getName(): string
```
**Vrnitve:** `string` - Prikazno ime modula

**Primer:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```
#### getDirname

Pridobi ime imenika modula.
```php
public function getDirname(): string
```
**Vrne:** `string` - ime imenika modula

**Primer:**
```php
echo $module->getDirname(); // "publisher"
```
#### getVersion

Pridobi trenutno različico modula.
```php
public function getVersion(): string
```
**Vrne:** `string` - Niz različice

**Primer:**
```php
echo $module->getVersion(); // "2.1.0"
```
#### getDescription

Pridobi opis modula.
```php
public function getDescription(): string
```
**Vrnitve:** `string` - Opis modula

**Primer:**
```php
$desc = $module->getDescription();
```
#### getConfig

Pridobi konfiguracijo modula.
```php
public function getConfig(string $key = null): mixed
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Konfiguracijski ključ (null za vse) |

**Vrne:** `mixed` - Konfiguracijska vrednost ali polje

**Primer:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```
#### setConfig

Nastavi konfiguracijo modula.
```php
public function setConfig(string $key, mixed $value): void
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Konfiguracijski ključ |
| `$value` | mešano | Vrednost konfiguracije |

**Primer:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```
#### getPath

Pridobi celotno pot datotečnega sistema do modula.
```php
public function getPath(): string
```
**Vrne:** `string` - Absolutna pot imenika modula

**Primer:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```
#### getUrl

Pridobi URL modulu.
```php
public function getUrl(): string
```
**Vračila:** `string` - Modul URL

**Primer:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```
## Postopek namestitve modula

### Funkcija xoops_module_install

Funkcija namestitve modula, definirana v `xoops_version.php`:
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

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$module` | XoopsModule | Modul, ki se namesti |

**Vrne:** `bool` - True ob uspehu, false ob neuspehu

**Primer:**
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
### Funkcija xoops_module_uninstall

Funkcija odstranitve modula:
```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```
**Primer:**
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
## Kavlji za module

Kavlji za module omogočajo integracijo modulov z drugimi moduli in sistemom.

### Hook deklaracija

V `xoops_version.php`:
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
### Izvedba kljuke
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
### Razpoložljive sistemske kljuke

| Kavelj | Parametri | Opis |
|------|-----------|-------------|
| `system.page.header` | Brez | Izpis glave strani |
| `system.page.footer` | Brez | Izpis noge strani |
| `user.login.success` | $user objekt | Po prijavi uporabnika |
| `user.logout` | $user objekt | Po odjavi uporabnika |
| `user.profile.view` | $user_id | Ogled uporabniškega profila |
| `module.install` | $module objekt | Namestitev modula |
| `module.uninstall` | $module objekt | Odstranitev modula |

## Storitev upravitelja modulov

Storitev ModuleManager obravnava operacije modulov.

### Metode

#### getModule

Pridobi modul po imenu.
```php
public function getModule(string $dirname): ?XoopsModule
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$dirname` | niz | Ime imenika modula |

**Vrne:** `?XoopsModule` - primerek modula ali nič

**Primer:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```
#### getAllModules

Dobi vse nameščene module.
```php
public function getAllModules(bool $activeOnly = true): array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$activeOnly` | bool | Vrni samo aktivne module |

**Vrne:** `array` - niz predmetov XoopsModule

**Primer:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```
#### isModuleActive

Preveri, ali je modul aktiven.
```php
public function isModuleActive(string $dirname): bool
```
**Primer:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```
#### activateModule

Aktivira modul.
```php
public function activateModule(string $dirname): bool
```
**Primer:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```
#### deaktiviraj modul

Deaktivira modul.
```php
public function deactivateModule(string $dirname): bool
```
**Primer:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```
## Konfiguracija modula (xoops_version.php)

Celoten primer manifesta modula:
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
## Najboljše prakse

1. **Imenski prostor Vaši razredi** – uporabite imenske prostore, specifične za modul, da se izognete sporom

2. **Uporabite obdelovalce** - Vedno uporabite razrede obdelovalcev za operacije baze podatkov

3. **Internacionalizacija vsebine** - Uporabite jezikovne konstante za vse uporabniku usmerjene nize

4. **Ustvarite namestitvene skripte** - Zagotovite SQL shem za tabele baze podatkov

5. **Kljuki za dokumente** - Jasno dokumentirajte, katere kljuke ponuja vaš modul

6. **Različica vašega modula** - Povečajte številke različic z izdajami

7. **Preskusna namestitev** - temeljito preizkusite install/uninstall procese

8. **Obravnava dovoljenj** - Preverite uporabniška dovoljenja, preden dovolite dejanja

## Celoten primer modula
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

- ../Kernel/Kernel-Classes - Inicializacija jedra in osnovne storitve
- ../Template/Template-System - Predloge modulov in integracija tem
- ../Database/QueryBuilder - Gradnja poizvedbe po bazi podatkov
- ../Core/XoopsObject - Osnovni objektni razred

---

*Glejte tudi: [XOOPS Vodnik za razvoj modulov](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*