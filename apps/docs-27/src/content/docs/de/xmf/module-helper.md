---
title: "XMF Modul-Helfer"
description: 'Vereinfachte Moduloperationen mit der Xmf\Module\Helper-Klasse und zugehörigen Helfern'
---

Die Klasse `Xmf\Module\Helper` bietet eine einfache Möglichkeit, auf modulbezogene Informationen, Konfigurationen, Handler und vieles mehr zuzugreifen. Die Verwendung des Modul-Helfers vereinfacht Ihren Code und reduziert Boilerplate.

## Überblick

Der Modul-Helfer bietet:

- Vereinfachter Konfigurationszugriff
- Modul-Objekt-Abruf
- Handler-Instanziierung
- Pfad- und URL-Auflösung
- Berechtigung- und Session-Helfer
- Cache-Verwaltung

## Einen Modul-Helfer abrufen

### Grundlegende Verwendung

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Aus dem aktuellen Modul

Wenn Sie keinen Modulnamen angeben, verwendet es das aktuell aktive Modul:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Configuration Access

### Traditionelle XOOPS-Weise

Das Abrufen der Modulkonfiguration auf die alte Weise ist ausführlich:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF-Weise

Mit dem Modul-Helper wird die gleiche Aufgabe einfach:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Helper-Methoden

### getModule()

Gibt das XoopsModule-Objekt für das Modul des Helpers zurück.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Gibt einen Modulkonfigurationswert oder alle Konfigurationen zurück.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Gibt einen Objekt-Handler für das Modul zurück.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Lädt eine Sprachdatei für das Modul.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Überprüft, ob dieses Modul das aktuell aktive Modul ist.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Überprüft, ob der aktuelle Benutzer Admin-Rechte für dieses Modul hat.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Pfad- und URL-Methoden

### url($url)

Gibt eine absolute URL für einen modulrelativen Pfad zurück.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

Gibt einen absoluten Dateisystempfad für einen modulrelativen Pfad zurück.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Gibt eine absolute URL für Modul-Upload-Dateien zurück.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Gibt einen absoluten Dateisystempfad für Modul-Upload-Dateien zurück.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

Leitet innerhalb des Moduls zu einer modulrelativen URL um.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Debug-Unterstützung

### setDebug($bool)

Aktivieren oder deaktivieren Sie den Debug-Modus für den Helper.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

Fügen Sie eine Meldung zum Modul-Protokoll hinzu.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Zugehörige Helper-Klassen

XMF bietet spezialisierte Helper, die `Xmf\Module\Helper\AbstractHelper` erweitern:

### Permission Helper

Siehe ../Recipes/Permission-Helper für detaillierte Dokumentation.

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

Modulbewusste Session-Speicherung mit automatischem Schlüsselpräfix.

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

Modulbewusstes Caching mit automatischem Schlüsselpräfix.

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

## Complete Example

Here's a comprehensive example using the module helper:

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

## AbstractHelper-Basisklasse

Alle XMF-Helper-Klassen erweitern `Xmf\Module\Helper\AbstractHelper`, das Folgendes bietet:

### Konstruktor

```php
public function __construct($dirname)
```

Instantiates with a module directory name. If empty, uses the current module.

### dirname()

Gibt den mit dem Helper verknüpften Modulverzeichnisnamen zurück.

```php
$dirname = $helper->dirname();
```

### init()

Wird vom Konstruktor nach dem Laden des Moduls aufgerufen. Überschreiben Sie in benutzerdefinierten Helfern für Initialisierungslogik.

## Erstellen benutzerdefinierter Helfer

Sie können den Helper für modulspezifische Funktionalität erweitern:

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

## Siehe auch

- Getting-Started-with-XMF - Grundlegende XMF-Verwendung
- XMF-Request - Request-Verarbeitung
- ../Recipes/Permission-Helper - Berechtigungsverwaltung
- ../Recipes/Module-Admin-Pages - Admin-Schnittstelle-Erstellung

---

#xmf #module-helper #configuration #handlers #session #cache
