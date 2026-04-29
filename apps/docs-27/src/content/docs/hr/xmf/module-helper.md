---
title: "XMF Module Helper"
description: 'Pojednostavljene operacije modula pomoću Xmf\Module\Helper class i povezanih pomoćnika'
---
`Xmf\Module\Helper` class pruža jednostavan način pristupa informacijama vezanim uz module, konfiguracijama, rukovateljima i više. Korištenje pomoćnika modula pojednostavljuje vaš kod i smanjuje šablon.

## Pregled

Pomoćnik modula pruža:

- Pojednostavljen pristup konfiguraciji
- Dohvaćanje objekta modula
- Instantiranje rukovatelja
- Put i rezolucija URL
- Dopuštenja i pomoćnici sesije
- Upravljanje predmemorijom

## Dobivanje pomoćnog modula

### Osnovna upotreba

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Iz trenutnog modula

Ako ne navedete naziv modula, koristi se trenutno aktivni modul:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Pristup konfiguraciji

### Tradicionalni XOOPS način

Dohvaćanje konfiguracije modula na stari način je opširno:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF Način

S pomoćnikom modula, isti zadatak postaje jednostavan:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Pomoćne metode

### getModule()

Vraća objekt XoopsModule za pomoćni modul.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Vraća vrijednost konfiguracije modula ili sve konfiguracije.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Vraća rukovatelj objektom za modul.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Učitava datoteku language za modul.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Provjerava je li ovaj modul trenutno aktivan modul.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Provjerava ima li trenutni korisnik admin prava za ovaj modul.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Put i metode URL

### url($url)

Vraća apsolutni URL za relativnu putanju modula.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### put($path)

Vraća apsolutnu putanju datotečnog sustava za relativnu putanju modula.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Vraća apsolutni URL za datoteke za učitavanje modula.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Vraća apsolutnu putanju datotečnog sustava za datoteke za učitavanje modula.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### preusmjeravanje ($url, $time, $message)

Preusmjerava unutar modula na URL relativan modul.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Podrška za otklanjanje pogrešaka

### setDebug($bool)

Omogućite ili onemogućite način otklanjanja pogrešaka za pomoćnika.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Dodajte poruku u dnevnik modula.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Srodne pomoćne klase

XMF pruža specijalizirane pomoćnike koji proširuju `Xmf\Module\Helper\AbstractHelper`:

### Pomoćnik za dozvole

Pogledajte ../Recipes/Permission-Helper za detaljnu dokumentaciju.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Pomoćnik sesije

Pohrana sesije s obzirom na module s automatskim prefiksom ključa.

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

### Pomoćnik predmemorije

predmemorija svjesna modula s automatskim prefiksom ključa.

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

## Kompletan primjer

Evo opsežnog primjera korištenja pomoćnog modula:

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

## Osnovna klasa AbstractHelper

Svi XMF pomagači classes proširuju `Xmf\Module\Helper\AbstractHelper`, koji pruža:

### Konstruktor

```php
public function __construct($dirname)
```

Instancira naziv direktorija modula. Ako je prazno, koristi trenutni modul.

### dirname()

Vraća ime direktorija modula povezanog s pomoćnikom.

```php
$dirname = $helper->dirname();
```

### init()Poziva ga konstruktor nakon učitavanja modula. Nadjačavanje u prilagođenim pomoćnicima za logiku inicijalizacije.

## Stvaranje prilagođenih pomagača

Pomoćnik možete proširiti za funkcionalnost specifičnu za modul:

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

## Vidi također

- Početak rada sa XMF - Osnovna upotreba XMF
- XMF-Zahtjev - Obrada zahtjeva
- ../Recipes/Permission-Helper - Upravljanje dozvolama
- ../Recipes/Module-Admin-Pages - Izrada administratorskog sučelja

---

#xmf #module-helper #configuration #handlers #session #cache
