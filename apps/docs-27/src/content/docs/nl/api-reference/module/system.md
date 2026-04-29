---
title: "XOOPS-modulesysteem"
description: "Levenscyclus van modules, XoopsModule-klasse, installatie/verwijdering van modules, modulehooks en modulebeheer"
---
Het XOOPS-modulesysteem biedt een compleet raamwerk voor het ontwikkelen, installeren, beheren en uitbreiden van modulefunctionaliteit. Modules zijn op zichzelf staande pakketten die XOOPS uitbreiden met extra functies en mogelijkheden.

## Module-architectuur

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

## Modulestructuur

Standaard XOOPS-modulemapstructuur:

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

## XoopsModule-klasse

De klasse XoopsModule vertegenwoordigt een geïnstalleerde XOOPS-module.

### Klassenoverzicht

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

### Eigenschappen

| Eigendom | Typ | Beschrijving |
|----------|------|-------------|
| `$moduleid` | int | Unieke module-ID |
| `$name` | tekenreeks | Moduleweergavenaam |
| `$dirname` | tekenreeks | Naam modulemap |
| `$version` | tekenreeks | Huidige moduleversie |
| `$description` | tekenreeks | Modulebeschrijving |
| `$config` | array | Moduleconfiguratie |
| `$blocks` | array | Moduleblokken |
| `$adminPages` | array | Pagina's van het beheerdersdashboard |
| `$userPages` | array | Gebruikersgerichte pagina's |

### Constructeur

```php
public function __construct()
```

Creëert een nieuwe module-instantie en initialiseert variabelen.

### Kernmethoden

#### getName

Haalt de weergavenaam van de module op.

```php
public function getName(): string
```

**Retourneert:** `string` - Weergavenaam van module

**Voorbeeld:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```

#### getDirnaam

Haalt de mapnaam van de module op.

```php
public function getDirname(): string
```

**Retourneert:** `string` - Naam van modulemap

**Voorbeeld:**
```php
echo $module->getDirname(); // "publisher"
```

#### getVersion

Haalt de huidige moduleversie op.

```php
public function getVersion(): string
```

**Retourneert:** `string` - Versietekenreeks

**Voorbeeld:**
```php
echo $module->getVersion(); // "2.1.0"
```

#### getDescription

Haalt de modulebeschrijving op.

```php
public function getDescription(): string
```

**Retourzendingen:** `string` - Modulebeschrijving

**Voorbeeld:**
```php
$desc = $module->getDescription();
```

#### getConfig

Haalt de moduleconfiguratie op.

```php
public function getConfig(string $key = null): mixed
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Configuratiesleutel (null voor alles) |

**Retourneert:** `mixed` - Configuratiewaarde of array

**Voorbeeld:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```

#### setConfig

Stelt de moduleconfiguratie in.

```php
public function setConfig(string $key, mixed $value): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Configuratiesleutel |
| `$value` | gemengd | Configuratiewaarde |

**Voorbeeld:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```

#### getPath

Haalt het volledige bestandssysteempad naar de module op.

```php
public function getPath(): string
```

**Retourneert:** `string` - Absoluut modulemappad

**Voorbeeld:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```

#### getUrl

Haalt de URL naar de module.

```php
public function getUrl(): string
```

**Retourzendingen:** `string` - Module URL

**Voorbeeld:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```

## Module-installatieproces

### xoops_module_install Functie

De module-installatiefunctie gedefinieerd in `xoops_version.php`:

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

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$module` | XoopsModule | De module die wordt geïnstalleerd |

**Retouren:** `bool` - Waar bij succes, onwaar bij mislukking

**Voorbeeld:**
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

### xoops_module_uninstall Functie

De module-verwijderingsfunctie:

```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```

**Voorbeeld:**
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

## Modulehaken

Modulehaken zorgen ervoor dat modules kunnen worden geïntegreerd met andere modules en het systeem.

### Hook-verklaring

In `xoops_version.php`:

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

### Hook-implementatie

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

### Beschikbare systeemhaken

| Haak | Parameters | Beschrijving |
|------|-----------|------------|
| `system.page.header` | Geen | Uitvoer van paginakop |
| `system.page.footer` | Geen | Uitvoer van paginavoettekst |
| `user.login.success` | $user-object | Na het inloggen van de gebruiker |
| `user.logout` | $user-object | Na het uitloggen van de gebruiker |
| `user.profile.view` | $user_id | Gebruikersprofiel bekijken |
| `module.install` | $module-object | Module-installatie |
| `module.uninstall` | $module-object | Module-verwijdering |

## Modulebeheerservice

De ModuleManager-service verwerkt modulebewerkingen.

### Methoden

#### getModule

Haalt een module op naam op.

```php
public function getModule(string $dirname): ?XoopsModule
```

**Parameters:**| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$dirname` | tekenreeks | Naam modulemap |

**Retourneert:** `?XoopsModule` - Module-instantie of null

**Voorbeeld:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```

#### getAllModules

Haalt alle geïnstalleerde modules op.

```php
public function getAllModules(bool $activeOnly = true): array
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$activeOnly` | bool | Alleen actieve modules retourneren |

**Retourneert:** `array` - Array van XoopsModule-objecten

**Voorbeeld:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```

#### isModuleActive

Controleert of een module actief is.

```php
public function isModuleActive(string $dirname): bool
```

**Voorbeeld:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```

#### activeerModule

Activeert een module.

```php
public function activateModule(string $dirname): bool
```

**Voorbeeld:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```

#### Module deactiveren

Deactiveert een module.

```php
public function deactivateModule(string $dirname): bool
```

**Voorbeeld:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```

## Moduleconfiguratie (xoops_version.php)

Compleet modulemanifestvoorbeeld:

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

## Beste praktijken

1. **Naamruimte van uw klassen** - Gebruik modulespecifieke naamruimten om conflicten te voorkomen

2. **Gebruik handlers** - Gebruik altijd handlerklassen voor databasebewerkingen

3. **Inhoud internationaliseren** - Gebruik taalconstanten voor alle gebruikersgerichte tekenreeksen

4. **Installatiescripts maken** - Geef SQL-schema's op voor databasetabellen

5. **Documenthaken** - Documenteer duidelijk welke haken uw module biedt

6. **Versie van uw module** - Verhoog de versienummers met releases

7. **Testinstallatie** - Test de installatie-/verwijderingsprocessen grondig

8. **Machtigingen afhandelen** - Controleer de gebruikersmachtigingen voordat u acties toestaat

## Compleet modulevoorbeeld

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

## Gerelateerde documentatie

- ../Kernel/Kernel-Classes - Kernel-initialisatie en kernservices
- ../Template/Template-System - Modulesjablonen en thema-integratie
- ../Database/QueryBuilder - Databasequery's bouwen
- ../Core/XoopsObject - Basisobjectklasse

---

*Zie ook: [XOOPS Module-ontwikkelingshandleiding](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*