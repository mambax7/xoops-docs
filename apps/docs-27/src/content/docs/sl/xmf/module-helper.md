---
title: "XMF Pomočnik za module"
description: 'Poenostavljene operacije modulov z uporabo razreda XMF\Module\Helper in povezanih pomočnikov'
---
Razred `XMF\Module\Helper` zagotavlja enostaven način za dostop do informacij, povezanih z modulom, konfiguracij, upravljavcev in drugega. Uporaba modulnega pomočnika poenostavi vašo kodo in zmanjša standardno kodo.

## Pregled

Pomočnik modula nudi:

- Poenostavljen dostop do konfiguracije
- Priklic predmeta modula
- Instantiranje upravljalnika
- Pot in ločljivost URL
- Pomočniki za dovoljenja in seje
- Upravljanje predpomnilnika

## Pridobivanje pomočnika za module

### Osnovna uporaba
```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```
### Iz trenutnega modula

Če ne podate imena modula, se uporablja trenutni aktivni modul:
```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```
## Dostop do konfiguracije

### Tradicionalni XOOPS način

Pridobivanje konfiguracije modula na stari način je podrobno:
```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```
### XMF Način

S pomožnim modulom postane ista naloga preprosta:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```
## Pomožne metode

### getModule()

Vrne predmet XoopsModule za pomožni modul.
```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```
### getConfig($name, $default)

Vrne konfiguracijsko vrednost modula ali vse konfiguracije.
```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```
### getHandler($name)

Vrne obravnavo predmetov za modul.
```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```
### loadLanguage($name)

Naloži jezikovno datoteko za modul.
```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```
### isCurrentModule()

Preveri, ali je ta modul trenutno aktivni modul.
```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```
### isUserAdmin()

Preveri, ali ima trenutni uporabnik skrbniške pravice za ta modul.
```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```
## Pot in URL Metode

### url($url)

Vrne absolutno URL za modulsko relativno pot.
```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```
### pot($path)

Vrne absolutno pot datotečnega sistema za relativno pot modula.
```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```
### uploadUrl($url)

Vrne absolutno URL za datoteke za nalaganje modulov.
```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```
### uploadPath($path)

Vrne absolutno pot do datotečnega sistema za datoteke za nalaganje modulov.
```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```
### preusmeritev($url, $time, $message)

Preusmerja znotraj modula na relativni modul URL.
```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```
## Podpora za odpravljanje napak

### setDebug($bool)

Omogoči ali onemogoči način odpravljanja napak za pomočnika.
```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```
### addLog($log)

Dodajte sporočilo v dnevnik modula.
```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```
## Sorodni pomožni razredi

XMF ponuja specializirane pomočnike, ki razširijo `XMF\Module\Helper\AbstractHelper`:

### Pomočnik za dovoljenja

Glej ../Recipes/Permission-Helper za podrobno dokumentacijo.
```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```
### Pomočnik za seje

Shranjevanje seje glede na module s samodejno predpono ključa.
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
### Pomočnik za predpomnilnik

Predpomnjenje glede na module s samodejnim predponašanjem ključev.
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
## Celoten primer

Tukaj je izčrpen primer uporabe pomočnika za module:
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
## Osnovni razred AbstractHelper

Vsi XMF pomožni razredi razširijo `XMF\Module\Helper\AbstractHelper`, ki zagotavlja:

### Konstruktor
```php
public function __construct($dirname)
```
Ustvari primerek z imenom imenika modula. Če je prazno, uporablja trenutni modul.

### dirname()

Vrne ime imenika modula, povezano s pomočnikom.
```php
$dirname = $helper->dirname();
```
### init()

Pokliče ga konstruktor po nalaganju modula. Preglasitev v pomočnikih po meri za logiko inicializacije.

## Ustvarjanje pomočnikov po meri

Pomočnik lahko razširite za funkcionalnost, specifično za modul:
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
## Glej tudi

- Začetek-s-XMF - Osnovna XMF uporaba
- XMF-Zahtevek - Obravnava zahtevka
- ../Recipes/Permission-Helper - Upravljanje dovoljenj
- ../Recipes/Module-Admin-Pages - Izdelava skrbniškega vmesnika

---

#XMF #module-helper #configuration #handlers #session #cache