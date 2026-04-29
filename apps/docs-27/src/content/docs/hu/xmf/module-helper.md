---
title: "XMF modul segítő"
description: "Egyszerűsített modulműveletek az XMF\module\Helper osztály és a kapcsolódó segítők segítségével"
---
A `XMF\module\Helper` osztály egyszerű módot biztosít a modullal kapcsolatos információk, konfigurációk, kezelők és egyebek elérésére. A modulsegéd használata leegyszerűsíti a kódot és csökkenti a kazán.

## Áttekintés

A modulsegéd a következőket nyújtja:

- Egyszerűsített konfigurációs hozzáférés
- modul objektum visszakeresés
- Kezelő példányosítás
- Útvonal és URL felbontás
- Engedély és munkamenet segítők
- Gyorsítótár kezelése

## modulsegéd beszerzése

### Alapvető használat

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Az aktuális modulból

Ha nem ad meg modulnevet, akkor az aktuális aktív modult használja:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Konfigurációs hozzáférés

### Hagyományos XOOPS módszer

A modulkonfiguráció lekérése a régi módon bőbeszédű:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF Way

A modulsegéddel ugyanez a feladat egyszerűvé válik:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Segítő módszerek

### getmodule()

A segítő modul XOOPSmodule objektumát adja vissza.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Egy modul konfigurációs értékét vagy az összes konfigurációt adja vissza.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler ($name)

Egy objektumkezelőt ad vissza a modulhoz.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Betölt egy nyelvi fájlt a modulhoz.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentmodule()

Ellenőrzi, hogy ez a modul az aktuálisan aktív modul-e.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Ellenőrzi, hogy az aktuális felhasználó rendelkezik-e rendszergazdai jogokkal ehhez a modulhoz.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Útvonal és URL módszerek

### url ($url)

Egy abszolút URL értéket ad vissza a modul-relatív elérési úthoz.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### elérési út ($path)

A modul-relatív elérési út abszolút fájlrendszer-útvonalát adja vissza.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Abszolút URL értéket ad vissza a modul feltöltési fájljaihoz.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Egy abszolút fájlrendszer-útvonalat ad vissza a modul feltöltési fájljaihoz.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### átirányítás ($url, $time, $message)

Átirányítja a modulon belül egy modul-relatív URL-ra.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Hibakeresési támogatás

### setDebug($bool)

Engedélyezze vagy tiltsa le a súgó hibakeresési módját.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Üzenet hozzáadása a modulnaplóhoz.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Kapcsolódó segítő osztályok

A XMF speciális segítőket biztosít, amelyek kiterjesztik a `XMF\module\Helper\AbstractHelper`-t:

### Engedélysegítő

A részletes dokumentációért lásd: ../Recipes/Permission-Helper.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Session Helper

modul-tudatos munkamenet-tárolás automatikus kulcselőtaggal.

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

### Cache Helper

modul-tudatos gyorsítótár automatikus kulcs-előtagozással.

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

## Teljes példa

Íme egy átfogó példa a modulsegéd használatára:

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

## AbstractHelper alaposztály

Minden XMF segédosztály kiterjeszti a `XMF\module\Helper\AbstractHelper`-t, amely a következőket nyújtja:

### Konstruktor

```php
public function __construct($dirname)
```

Példányosodik egy modul könyvtárnévvel. Ha üres, akkor az aktuális modult használja.

### dirname()

A segítőhöz társított modulkönyvtár nevét adja vissza.

```php
$dirname = $helper->dirname();
```

### init()

A konstruktor meghívja a modul betöltése után. Felülbírálás az egyéni segítőkben az inicializálási logikához.

## Egyéni segítők létrehozása

A segédprogramot bővítheti a modulspecifikus funkciókhoz:

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

## Lásd még

- Kezdő lépések-XMF - Alapvető XMF használat
- XMF-Kérés - Kérelemkezelés
- ../Recipes/Permission-Helper - Engedélykezelés
- ../Recipes/module-Admin-Pages - Admin felület létrehozása

---

#xmf #modul-segítő #konfiguráció #kezelők #munkamenet #gyorsítótár
