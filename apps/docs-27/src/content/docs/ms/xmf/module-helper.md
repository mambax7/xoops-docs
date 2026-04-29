---
title: "XMF Pembantu Modul"
description: 'Operasi modul dipermudahkan menggunakan kelas XMF\Module\Helper dan pembantu yang berkaitan'
---
Kelas `XMF\Module\Helper` menyediakan cara mudah untuk mengakses maklumat berkaitan modul, konfigurasi, pengendali dan banyak lagi. Menggunakan pembantu modul memudahkan kod anda dan mengurangkan boilerplate.

## Gambaran Keseluruhan

Pembantu modul menyediakan:

- Akses konfigurasi dipermudahkan
- Pengambilan semula objek modul
- Instalasi pengendali
- Laluan dan URL resolusi
- Kebenaran dan pembantu sesi
- Pengurusan cache

## Mendapatkan Pembantu Modul

### Penggunaan Asas
```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```
### Daripada Modul Semasa

Jika anda tidak menentukan nama modul, ia menggunakan modul aktif semasa:
```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```
## Akses Konfigurasi

### Cara XOOPS Tradisional

Mendapatkan konfigurasi modul dengan cara lama adalah verbose:
```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```
### XMF Cara

Dengan pembantu modul, tugas yang sama menjadi mudah:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```
## Kaedah Pembantu

### getModule()

Mengembalikan objek XoopsModule untuk modul pembantu.
```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```
### getConfig($name, $default)

Mengembalikan nilai konfigurasi modul atau semua konfigurasi.
```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```
### getHandler($name)

Mengembalikan pengendali objek untuk modul.
```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```
### loadBahasa($name)

Memuatkan fail bahasa untuk modul.
```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```
### isCurrentModule()

Menyemak sama ada modul ini ialah modul yang sedang aktif.
```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```
### isUserAdmin()

Menyemak sama ada pengguna semasa mempunyai hak pentadbir untuk modul ini.
```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```
## Laluan dan URL Kaedah

### url($url)

Mengembalikan URL mutlak untuk laluan relatif modul.
```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```
### laluan($path)

Mengembalikan laluan sistem fail mutlak untuk laluan relatif modul.
```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```
### muat naikUrl($url)

Mengembalikan URL mutlak untuk fail muat naik modul.
```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```
### uploadPath($path)

Mengembalikan laluan sistem fail mutlak untuk fail muat naik modul.
```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```
### ubah hala($url, $time, $message)

Mengubah hala dalam modul kepada relatif modul URL.
```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```
## Sokongan Penyahpepijatan

### setDebug($bool)

Dayakan atau lumpuhkan mod nyahpepijat untuk pembantu.
```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```
### addLog($log)

Tambahkan mesej pada log modul.
```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```
## Kelas Pembantu Berkaitan

XMF menyediakan pembantu khusus yang memanjangkan `XMF\Module\Helper\AbstractHelper`:

### Pembantu Kebenaran

Lihat ../Recipes/Permission-Helper untuk dokumentasi terperinci.
```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```
### Pembantu Sesi

Storan sesi sedar modul dengan awalan kunci automatik.
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
### Pembantu Cache

Caching sedar modul dengan awalan kunci automatik.
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
## Contoh Lengkap

Berikut ialah contoh komprehensif menggunakan pembantu modul:
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
## Kelas Asas AbstractHelper

Semua XMF kelas pembantu melanjutkan `XMF\Module\Helper\AbstractHelper`, yang menyediakan:

### Pembina
```php
public function __construct($dirname)
```
Instantiate dengan nama direktori modul. Jika kosong, gunakan modul semasa.

### dirname()

Mengembalikan nama direktori modul yang dikaitkan dengan pembantu.
```php
$dirname = $helper->dirname();
```
### init()

Dipanggil oleh pembina selepas modul dimuatkan. Gantikan dalam pembantu tersuai untuk logik permulaan.

## Mencipta Pembantu Tersuai

Anda boleh melanjutkan pembantu untuk kefungsian khusus modul:
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
## Lihat Juga

- Bermula-dengan-XMF - Asas XMF penggunaan
- XMF-Permintaan - Permintaan pengendalian
- ../Recipes/Permission-Helper - Pengurusan kebenaran
- ../Recipes/Module-Admin-Pages - Penciptaan antara muka pentadbir

---

#XMF #module-helper #konfigurasi #pengendali #sesi #cache