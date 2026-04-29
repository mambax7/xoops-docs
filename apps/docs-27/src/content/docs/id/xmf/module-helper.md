---
title: "XMF module Pembantu"
description: 'Operasi module yang disederhanakan menggunakan kelas Xmf\Module\Helper dan pembantu terkait'
---

Kelas `Xmf\Module\Helper` menyediakan cara mudah untuk mengakses informasi terkait module, konfigurasi, handler, dan banyak lagi. Menggunakan module pembantu menyederhanakan kode Anda dan mengurangi boilerplate.

## Ikhtisar

Pembantu module menyediakan:

- Akses konfigurasi yang disederhanakan
- Pengambilan objek module
- Instansiasi pengendali
- Resolusi jalur dan URL
- Izin dan pembantu sesi
- Manajemen cache

## Mendapatkan module Pembantu

### Penggunaan Dasar

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### Dari module Saat Ini

Jika Anda tidak menentukan nama module, module tersebut akan menggunakan module aktif saat ini:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Akses Konfigurasi

### Cara Tradisional XOOPS

Mendapatkan konfigurasi module dengan cara lama adalah bertele-tele:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### Cara XMF

Dengan bantuan module, tugas yang sama menjadi sederhana:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Metode Pembantu

### getModule()

Mengembalikan objek XoopsModule untuk module pembantu.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Mengembalikan nilai konfigurasi module atau semua konfigurasi.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Mengembalikan pengendali objek untuk module.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### memuatBahasa($name)

Memuat file bahasa untuk module.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Memeriksa apakah module ini adalah module yang sedang aktif.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

Memeriksa apakah pengguna saat ini memiliki hak admin untuk module ini.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Jalur dan Metode URL

### url($url)

Mengembalikan URL absolut untuk jalur relatif module.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### jalur($path)

Mengembalikan jalur sistem file absolut untuk jalur relatif module.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### unggahUrl($url)

Mengembalikan URL absolut untuk file unggahan module.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### jalur unggah($path)

Mengembalikan jalur sistem file absolut untuk file unggahan module.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### pengalihan($url, $time, $message)

Pengalihan dalam module ke module-relatif URL.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Dukungan Debugging

### setDebug($bool)

Mengaktifkan atau menonaktifkan mode debug untuk pembantu.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### tambahkanLog($log)

Tambahkan pesan ke log module.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Kelas Pembantu Terkait

XMF menyediakan pembantu khusus yang memperluas `Xmf\Module\Helper\AbstractHelper`:

### Izin Pembantu

Lihat ../Recipes/Permission-Helper untuk dokumentasi detail.

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

Penyimpanan sesi yang sadar module dengan awalan kunci otomatis.

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

Caching yang sadar module dengan awalan kunci otomatis.

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

Berikut contoh lengkap penggunaan module pembantu:

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

## Kelas Basis Pembantu Abstrak

Semua kelas pembantu XMF memperluas `Xmf\Module\Helper\AbstractHelper`, yang menyediakan:

### Konstruktor

```php
public function __construct($dirname)
```

Membuat instance dengan nama direktori module. Jika kosong, gunakan module saat ini.

### dirname()

Mengembalikan nama direktori module yang terkait dengan helper.

```php
$dirname = $helper->dirname();
```

### init()

Dipanggil oleh konstruktor setelah module dimuat. Ganti pembantu khusus untuk logika inisialisasi.

## Membuat Pembantu Khusus

Anda dapat memperluas helper untuk fungsionalitas khusus module:

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

- Memulai-dengan-XMF - Penggunaan dasar XMF
- XMF-Permintaan - Penanganan permintaan
- ../Recipes/Permission-Helper - Manajemen izin
- ../Recipes/Module-Admin-Pages - Pembuatan antarmuka admin

---

#xmf #module-helper #configuration #handlers #session #cache
