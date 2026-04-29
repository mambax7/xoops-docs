---
title: "Pomocník modulu XMF"
description: 'Zjednodušené operace modulu pomocí třídy Xmf\Module\Helper a souvisejících pomocníků'
---

Třída `XMF\Module\Helper` poskytuje snadný způsob přístupu k informacím souvisejícím s modulem, konfiguracím, ovladačům a dalším. Použití pomocníka modulu zjednodušuje váš kód a snižuje standardizovanost.

## Přehled

Pomocník modulu poskytuje:

- Zjednodušený přístup ke konfiguraci
- Načítání objektů modulu
- Instanciace obsluhy
- Cesta a rozlišení URL
- Pomocníci pro povolení a relace
- Správa mezipaměti

## Získání pomocníka modulu

### Základní použití

```php
use XMF\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Z aktuálního modulu

Pokud nezadáte název modulu, použije se aktuální aktivní modul:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Přístup ke konfiguraci

### Tradiční způsob XOOPS

Získání konfigurace modulu starým způsobem je podrobné:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Způsob XMF

S pomocníkem modulu se stejný úkol zjednoduší:

```php
$helper = \XMF\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Pomocné metody

### getModule()

Vrátí objekt XOOPSModule pro modul pomocníka.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Vrátí hodnotu konfigurace modulu nebo všechny konfigurace.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Vrátí obslužnou rutinu objektu pro modul.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Načte jazykový soubor pro modul.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Zkontroluje, zda je tento modul aktuálně aktivním modulem.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Zkontroluje, zda má aktuální uživatel administrátorská práva pro tento modul.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Metody cesty a URL

### url($url)

Vrátí absolutní URL pro cestu relativní k modulu.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### cesta ($path)

Vrátí absolutní cestu souborového systému pro cestu relativní k modulu.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Vrátí absolutní URL pro soubory nahrání modulu.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Vrátí absolutní cestu k souborovému systému pro soubory nahrané moduly.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### přesměrování ($url, $time, $message)

Přesměruje v rámci modulu na modul relativní URL.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Podpora ladění

### setDebug($bool)

Povolit nebo zakázat režim ladění pro pomocníka.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Přidejte zprávu do protokolu modulu.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Související pomocné třídy

XMF poskytuje specializované pomocníky, kteří rozšiřují `XMF\Module\Helper\AbstractHelper`:

### Pomocník pro oprávnění

Viz ../Recipes/Permission-Helper pro podrobnou dokumentaci.

```php
$permHelper = new \XMF\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Pomocník relace

Ukládání relací s ohledem na moduly s automatickým předřazením klíče.

```php
$session = new \XMF\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### Pomocník mezipaměti

Modul-aware caching s automatickým prefixem klíče.

```php
$cache = new \XMF\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```

## Úplný příklad

Zde je komplexní příklad pomocí pomocníka modulu:

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;
use XMF\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Základní třída AbstractHelper

Všechny pomocné třídy XMF rozšiřují `XMF\Module\Helper\AbstractHelper`, který poskytuje:

### Konstruktér

```php
public function __construct($dirname)
```

Vytvoří instanci s názvem adresáře modulu. Pokud je prázdný, použije aktuální modul.

### dirname()

Vrátí název adresáře modulu spojený s pomocníkem.

```php
$dirname = $helper->dirname();
```

### init()

Volá konstruktorem po načtení modulu. Přepsat ve vlastních pomocníkech pro inicializační logiku.

## Vytváření vlastních pomocníků

Pomocníka můžete rozšířit o funkce specifické pro modul:

```php
<?php
// mymodule/class/Helper.php
namespace XOOPSModules\Mymodule;

class Helper extends \XMF\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## Viz také

- Začínáme s-XMF - Základní použití XMF
- XMF-Request - Zpracování požadavku
- ../Recipes/Permission-Helper - Správa oprávnění
- ../Recipes/Module-Admin-Pages - Vytvoření administrátorského rozhraní

---

#xmf #modul-helper #configuration #handlers #session #cache