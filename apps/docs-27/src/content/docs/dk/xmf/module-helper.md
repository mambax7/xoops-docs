---
title: "XMF Modulhjælper"
description: 'Forenklede moduloperationer ved hjælp af Xmf\Module\Helper-klassen og relaterede hjælpere'
---

Klassen `Xmf\Module\Helper` giver en nem måde at få adgang til modulrelateret information, konfigurationer, handlere og mere. Brug af modulhjælperen forenkler din kode og reducerer boilerplate.

## Oversigt

Modulhjælperen giver:

- Forenklet konfigurationsadgang
- Hentning af modulobjekter
- Handler-instansiering
- Sti og URL opløsning
- Tilladelse og session hjælpere
- Cachehåndtering

## Få en modulhjælper

### Grundlæggende brug

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Fra nuværende modul

Hvis du ikke angiver et modulnavn, bruger det det aktuelle aktive modul:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Konfigurationsadgang

### Traditionel XOOPS måde

At få modulkonfigurationen på den gamle måde er udførligt:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF måde

Med modulhjælperen bliver den samme opgave enkel:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Hjælpemetoder

### getModule()

Returnerer XoopsModule-objektet for hjælperens modul.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Returnerer en modulkonfigurationsværdi eller alle konfigurationer.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Returnerer en objektbehandler for modulet.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Indlæser en sprogfil til modulet.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Kontrollerer, om dette modul er det aktuelt aktive modul.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Kontrollerer, om den aktuelle bruger har administratorrettigheder til dette modul.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Sti- og URL-metoder

### url($url)

Returnerer en absolut URL for en modulrelativ sti.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### sti($path)

Returnerer en absolut filsystemsti for en modulrelativ sti.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Returnerer en absolut URL for moduluploadfiler.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Returnerer en absolut filsystemsti for moduluploadfiler.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### omdirigering($url, $time, $message)

Omdirigerer i modulet til en modul-relativ URL.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Fejlfindingssupport

### setDebug($bool)

Aktiver eller deaktiver fejlretningstilstand for hjælperen.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Tilføj en besked til modulloggen.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Relaterede hjælperklasser

XMF leverer specialiserede hjælpere, der udvider `Xmf\Module\Helper\AbstractHelper`:

### Tilladelseshjælper

Se ../Recipes/Permission-Helper for detaljeret dokumentation.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Sessionshjælper

Modulbevidst sessionslagring med automatisk nøglepræfiks.

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

### Cachehjælper

Modulbevidst caching med automatisk nøglepræfiks.

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

## Komplet eksempel

Her er et omfattende eksempel ved hjælp af modulhjælperen:

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

## AbstractHelper Basisklasse

Alle XMF hjælperklasser udvider `Xmf\Module\Helper\AbstractHelper`, som giver:

### Konstruktør

```php
public function __construct($dirname)
```

Instantierer med et modulbiblioteksnavn. Hvis tom, bruger det aktuelle modul.

### dirname()

Returnerer det modulbiblioteksnavn, der er knyttet til hjælperen.

```php
$dirname = $helper->dirname();
```

### init()

Kaldes af konstruktøren efter at modulet er indlæst. Tilsidesæt i brugerdefinerede hjælpere til initialiseringslogik.

## Oprettelse af brugerdefinerede hjælpere

Du kan udvide hjælperen til modulspecifik funktionalitet:

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

## Se også

- Kom godt i gang med-XMF - Grundlæggende brug af XMF
- XMF-Request - Anmodningshåndtering
- ../Recipes/Permission-Helper - Administration af tilladelser
- ../Recipes/Module-Admin-Pages - Oprettelse af administratorgrænseflade

---

#xmf #modulhjælper #konfiguration #handlere #session #cache
