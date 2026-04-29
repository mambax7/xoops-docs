---
title: "XMF Modulehelper"
description: 'Vereenvoudigde modulebewerkingen met behulp van de klasse Xmf\Module\Helper en gerelateerde helpers'
---
De klasse `Xmf\Module\Helper` biedt een eenvoudige manier om toegang te krijgen tot modulegerelateerde informatie, configuraties, handlers en meer. Het gebruik van de modulehelper vereenvoudigt uw code en vermindert de boilerplate.

## Overzicht

De modulehelper biedt:

- Vereenvoudigde configuratietoegang
- Ophalen van moduleobjecten
- Instantiatie van handler
- Pad en URL-resolutie
- Toestemming en sessiehelpers
- Cachebeheer

## Een modulehelper krijgen

### Basisgebruik

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Van huidige module

Als u geen modulenaam opgeeft, wordt de huidige actieve module gebruikt:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Configuratietoegang

### Traditionele XOOPS-manier

De moduleconfiguratie op de oude manier verkrijgen is uitgebreid:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF-manier

Met de modulehelper wordt dezelfde taak eenvoudig:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Helpermethoden

### getModule()

Retourneert het XoopsModule-object voor de module van de helper.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Retourneert een moduleconfiguratiewaarde of alle configuraties.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Retourneert een objecthandler voor de module.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### laadTaal($name)

Laadt een taalbestand voor de module.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Controleert of deze module de momenteel actieve module is.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isGebruikerAdmin()

Controleert of de huidige gebruiker beheerdersrechten heeft voor deze module.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Pad en URL-methoden

### url($url)

Retourneert een absolute URL voor een module-relatief pad.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### pad($path)

Retourneert een absoluut bestandssysteempad voor een module-relatief pad.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Retourneert een absolute URL voor module-uploadbestanden.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadpad($path)

Retourneert een absoluut bestandssysteempad voor module-uploadbestanden.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### omleiding($url, $time, $message)

Leidt binnen de module om naar een module-relatieve URL.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Ondersteuning voor foutopsporing

### setDebug($bool)

Schakel de foutopsporingsmodus voor de helper in of uit.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Voeg een bericht toe aan het modulelogboek.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Gerelateerde helperklassen

XMF biedt gespecialiseerde helpers die `Xmf\Module\Helper\AbstractHelper` uitbreiden:

### Toestemmingshelper

Zie ../Recepten/Permission-Helper voor gedetailleerde documentatie.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Sessiehelper

Modulebewuste sessieopslag met automatische sleutelvoorvoeging.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### Cachehulp

Modulebewuste caching met automatische sleutelvoorvoeging.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

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

## Compleet voorbeeld

Hier is een uitgebreid voorbeeld met behulp van de modulehelper:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

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

## AbstractHelper-basisklasse

Alle XMF-helperklassen breiden `Xmf\Module\Helper\AbstractHelper` uit, wat het volgende biedt:

### Constructeur

```php
public function __construct($dirname)
```

Instantiseert met een modulemapnaam. Indien leeg: gebruikt de huidige module.

### mapnaam()

Retourneert de naam van de modulemap die aan de helper is gekoppeld.

```php
$dirname = $helper->dirname();
```

### begin()

Aangeroepen door de constructor nadat de module is geladen. Overschrijven in aangepaste helpers voor initialisatielogica.

## Aangepaste helpers maken

U kunt de helper voor modulespecifieke functionaliteit uitbreiden:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
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

## Zie ook

- Aan de slag met XMF - Basisgebruik van XMF
- XMF-Request - Verzoekafhandeling
- ../Recepten/Permission-Helper - Toestemmingsbeheer
- ../Recepten/Module-Admin-Pages - Beheerinterface maken

---

#xmf #module-helper #configuratie #handlers #sessie #cache