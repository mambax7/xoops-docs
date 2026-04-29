---
title: "Modulový systém XOOPS"
description: "Životní cyklus modulu, třída XoopsModule, modul installation/uninstallation, háky modulů a správa modulů"
---

Modulový systém XOOPS poskytuje kompletní rámec pro vývoj, instalaci, správu a rozšiřování funkčnosti modulů. Moduly jsou samostatné balíčky, které rozšiřují XOOPS o další funkce a možnosti.

## Architektura modulů

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

## Struktura modulu

Standardní adresářová struktura modulu XOOPS:

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

## Třída XOOPSModule

Třída XOOPSModule představuje nainstalovaný modul XOOPS.

### Přehled třídy

```php
namespace XOOPS\Core\Module;

class XOOPSModule extends XOOPSObject
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

### Vlastnosti

| Nemovitost | Typ | Popis |
|----------|------|-------------|
| `$moduleid` | int | Jedinečné ID modulu |
| `$name` | řetězec | Zobrazovaný název modulu |
| `$dirname` | řetězec | Název adresáře modulu |
| `$version` | řetězec | Aktuální verze modulu |
| `$description` | řetězec | Popis modulu |
| `$config` | pole | Konfigurace modulu |
| `$blocks` | pole | Modulové bloky |
| `$adminPages` | pole | Stránky administrátorského panelu |
| `$userPages` | pole | Uživatelsky orientované stránky |

### Konstruktér

```php
public function __construct()
```

Vytvoří novou instanci modulu a inicializuje proměnné.

### Základní metody

#### getName

Získá zobrazovaný název modulu.

```php
public function getName(): string
```

**Vrátí:** `string` - Zobrazovaný název modulu

**Příklad:**
```php
$module = new XOOPSModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### getDirname

Získá název adresáře modulu.

```php
public function getDirname(): string
```

**Vrátí:** `string` - Název adresáře modulu

**Příklad:**
```php
echo $module->getDirname(); // "publisher"
```

#### getVersion

Získá aktuální verzi modulu.

```php
public function getVersion(): string
```

**Vrátí:** `string` – Řetězec verze

**Příklad:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### getDescription

Získá popis modulu.

```php
public function getDescription(): string
```

**Vrátí:** `string` - Popis modulu

**Příklad:**
```php
$desc = $module->getDescription();
```

#### getConfig

Načte konfiguraci modulu.

```php
public function getConfig(string $key = null): mixed
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Konfigurační klíč (nulový pro všechny) |

**Vrátí:** `mixed` – Konfigurační hodnota nebo pole

**Příklad:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

Nastaví konfiguraci modulu.

```php
public function setConfig(string $key, mixed $value): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Konfigurační klíč |
| `$value` | smíšené | Hodnota konfigurace |

**Příklad:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### getPath

Získá úplnou cestu systému souborů k modulu.

```php
public function getPath(): string
```

**Vrátí:** `string` - Absolutní cesta k adresáři modulu

**Příklad:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

Získá URL do modulu.

```php
public function getUrl(): string
```

**Vrácení:** `string` - Modul URL

**Příklad:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## Proces instalace modulu

### Funkce xoops_module_install

Funkce instalace modulu definovaná v `xoops_version.php`:

```php
function xoops_module_install_modulename($module)
{
    // $module is an XOOPSModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$module` | XOOPSModule | Instalovaný modul |

**Vrátí se:** `bool` – Pravda při úspěchu, nepravda při neúspěchu

**Příklad:**
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

### Funkce xoops_module_uninstall

Funkce odinstalace modulu:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**Příklad:**
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

## Modulové háky

Modulové háčky umožňují integraci modulů s jinými moduly a systémem.

### Prohlášení o háku

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

### Implementace háku

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

### Dostupné systémové háky

| Háček | Parametry | Popis |
|------|-----------|-------------|
| `system.page.header` | Žádné | Výstup záhlaví stránky |
| `system.page.footer` | Žádné | Výstup zápatí stránky |
| `user.login.success` | Objekt $user | Po přihlášení uživatele |
| `user.logout` | Objekt $user | Po odhlášení uživatele |
| `user.profile.view` | $user_id | Zobrazení uživatelského profilu |
| `module.install` | Objekt $module | Instalace modulu |
| `module.uninstall` | Objekt $module | Odinstalace modulu |

## Služba Správce modulů

Služba ModuleManager zpracovává operace modulů.

### Metody

#### getModule

Načte modul podle názvu.

```php
public function getModule(string $dirname): ?XOOPSModule
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$dirname` | řetězec | Název adresáře modulu |

**Vrátí:** `?XOOPSModule` - Instance modulu nebo null

**Příklad:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### getAllModules

Získá všechny nainstalované moduly.

```php
public function getAllModules(bool $activeOnly = true): array
```

**Parametry:**| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$activeOnly` | bool | Vraťte pouze aktivní moduly |

**Vrátí:** `array` - Pole objektů XOOPSModule

**Příklad:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### isModuleActive

Kontroluje, zda je modul aktivní.

```php
public function isModuleActive(string $dirname): bool
```

**Příklad:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### aktivovat modul

Aktivuje modul.

```php
public function activateModule(string $dirname): bool
```

**Příklad:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### deaktivovat modul

Deaktivuje modul.

```php
public function deactivateModule(string $dirname): bool
```

**Příklad:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## Konfigurace modulu (xoops_version.php)

Kompletní příklad manifestu modulu:

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

## Nejlepší postupy

1. **Jmenný prostor Vaše třídy** – Použijte jmenné prostory specifické pro moduly, abyste se vyhnuli konfliktům

2. **Použít obslužné rutiny** – Vždy používejte pro databázové operace třídy obslužných rutin

3. **Internacionalizace obsahu** – Používejte jazykové konstanty pro všechny uživatelské řetězce

4. **Vytvoření instalačních skriptů** – Poskytněte schémata SQL pro databázové tabulky

5. **Dokumentové háčky** – Jasně zdokumentujte, jaké háčky váš modul poskytuje

6. **Verze vašeho modulu** – Zvyšte čísla verzí podle vydání

7. **Testovací instalace** – Důkladně otestujte procesy install/uninstall

8. **Zpracování oprávnění** – Před povolením akcí zkontrolujte uživatelská oprávnění

## Příklad kompletního modulu

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

## Související dokumentace

- ../Kernel/Kernel-Classes - Inicializace jádra a základní služby
- ../Template/Template-System - Šablony modulů a integrace témat
- ../Database/QueryBuilder - Vytvoření dotazu na databázi
- ../Core/XOOPSObject - Základní třída objektu

---

*Viz také: [Příručka vývoje modulu XOOPS](https://github.com/XOOPS/XOOPSCore27/wiki/Module-Development)*