---
title: "XMF module Yardımcısı"
description: 'Xmf\Module\Helper sınıfını ve ilgili yardımcıları kullanarak basitleştirilmiş module işlemleri'
---
`Xmf\Module\Helper` sınıfı, modülle ilgili bilgilere, yapılandırmalara, işleyicilere ve daha fazlasına erişmenin kolay bir yolunu sağlar. module yardımcısını kullanmak kodunuzu basitleştirir ve ortak metinleri azaltır.

## Genel Bakış

module yardımcısı şunları sağlar:

- Basitleştirilmiş konfigürasyon erişimi
- module nesnesi alımı
- İşleyici örneklemesi
- Yol ve URL çözünürlüğü
- İzin ve oturum yardımcıları
- cache yönetimi

## Bir module Yardımcısı Alma

### Temel Kullanım
```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```
### Mevcut Modülden

Bir module adı belirtmezseniz geçerli etkin modülü kullanır:
```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```
## Yapılandırma Erişimi

### Geleneksel XOOPS Yolu

module konfigürasyonunu eski yöntemle almak ayrıntılıdır:
```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```
### XMF Yol

module yardımcısı ile aynı görev basitleşir:
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```
## Yardımcı Yöntemler

### getModule()

Yardımcı module için XoopsModule nesnesini döndürür.
```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```
### getConfig($name, $default)

Bir module yapılandırma değerini veya tüm yapılandırmaları döndürür.
```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```
### getHandler($name)

module için bir nesne işleyicisi döndürür.
```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```
### loadLanguage($name)

module için bir dil dosyası yükler.
```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```
### isCurrentModule()

Bu modülün şu anda aktif olan module olup olmadığını kontrol eder.
```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```
### isUserAdmin()

Geçerli kullanıcının bu module için yönetici haklarına sahip olup olmadığını kontrol eder.
```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```
## Yol ve URL Yöntemleri

### url($url)

Modüle bağlı bir yol için mutlak bir URL döndürür.
```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```
### yol($path)

Modüle bağlı bir yol için mutlak bir dosya sistemi yolu döndürür.
```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```
### uploadUrl($url)

module yükleme dosyaları için mutlak bir URL döndürür.
```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```
### uploadPath($path)

module yükleme dosyaları için mutlak bir dosya sistemi yolu döndürür.
```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```
### yönlendirme($url, $time, $message)

module içinde modüle bağlı bir URL'ya yönlendirme yapar.
```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```
## Hata Ayıklama Desteği

### setDebug($bool)

Yardımcı için hata ayıklama modunu etkinleştirin veya devre dışı bırakın.
```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```
### addLog($log)

module günlüğüne bir mesaj ekleyin.
```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```
## İlgili Yardımcı Sınıflar

XMF, `Xmf\Module\Helper\AbstractHelper`'nin kapsamını genişleten özel yardımcılar sağlar:

### İzin Yardımcısı

Ayrıntılı belgeler için ../Recipes/Permission-Helper'ye bakın.
```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```
### Oturum Yardımcısı

Otomatik anahtar ön eki ile module uyumlu oturum depolama.
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
### cache Yardımcısı

Otomatik anahtar ön eki ile module bilinçli önbelleğe alma.
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
## Tam Örnek

module yardımcısını kullanan kapsamlı bir örneği burada bulabilirsiniz:
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
## Soyut Yardımcı Temel Sınıf

Tüm XMF yardımcı sınıfları, aşağıdakileri sağlayan `Xmf\Module\Helper\AbstractHelper`'yi genişletir:

### Yapıcı
```php
public function __construct($dirname)
```
Bir module dizini adıyla örneklenir. Boşsa geçerli modülü kullanır.

### dirname()

Yardımcıyla ilişkili module dizini adını döndürür.
```php
$dirname = $helper->dirname();
```
### init()

module yüklendikten sonra yapıcı tarafından çağrılır. Başlatma mantığı için özel yardımcıları geçersiz kılın.

## Özel Yardımcılar Oluşturma

Yardımcıyı modüle özgü işlevler için genişletebilirsiniz:
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
## Ayrıca Bakınız

- XMF ile Başlarken - Temel XMF kullanımı
- XMF-İstek - İstek işleme
- ../Recipes/Permission-Helper - İzin yönetimi
- ../Recipes/Module-Admin-Pages - Yönetici arayüzü oluşturma

---

#xmf #module yardımcısı #yapılandırma #işleyiciler #oturum #cache