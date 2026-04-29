---
title: "کمک کننده ماژول XMF"
description: 'عملیات ماژول ساده شده با استفاده از کلاس XMF\Module\Helper و کمک های مرتبط'
---
کلاس `XMF\Module\Helper` راهی آسان برای دسترسی به اطلاعات مربوط به ماژول، پیکربندی ها، کنترل کننده ها و موارد دیگر را فراهم می کند. استفاده از کمک ماژول کد شما را ساده می کند و صفحه دیگ بخار را کاهش می دهد.

## بررسی اجمالی

کمک کننده ماژول ارائه می دهد:

- دسترسی به پیکربندی ساده
- بازیابی شی ماژول
- نمونه سازی هندلر
- وضوح مسیر و URL
- کمک های اجازه و جلسه
- مدیریت کش

## دریافت کمک ماژول

### استفاده اولیه

```php
use XMF\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### از ماژول فعلی

اگر نام ماژول را مشخص نکنید، از ماژول فعال فعلی استفاده می کند:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## دسترسی به پیکربندی

### روش سنتی XOOPS

دریافت پیکربندی ماژول به روش قدیمی پرمخاطب است:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### راه XMF

با کمک ماژول، همان کار ساده می شود:

```php
$helper = \XMF\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## روش های کمکی

### getModule()

شی XoopsModule را برای ماژول کمک کننده برمی گرداند.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name، $default)

یک مقدار پیکربندی ماژول یا همه تنظیمات را برمی‌گرداند.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

یک شیء کنترل کننده را برای ماژول برمی گرداند.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

یک فایل زبان برای ماژول بارگیری می کند.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

بررسی می کند که آیا این ماژول ماژول فعال فعلی است یا خیر.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

بررسی می کند که آیا کاربر فعلی حقوق مدیریت این ماژول را دارد یا خیر.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## روش‌های مسیر و URL

### آدرس اینترنتی ($url)

یک URL مطلق برای یک مسیر مرتبط با ماژول برمی‌گرداند.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

مسیر ### ($path)

یک مسیر سیستم فایل مطلق را برای یک مسیر مرتبط با ماژول برمی‌گرداند.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

یک URL مطلق برای فایل‌های آپلود ماژول برمی‌گرداند.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### مسیر آپلود ($path)

یک مسیر سیستم فایل مطلق را برای فایل‌های آپلود ماژول برمی‌گرداند.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### تغییر مسیر($url، $time، $message)

در داخل ماژول به یک URL مرتبط با ماژول هدایت می شود.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## پشتیبانی از اشکال زدایی

### setDebug($bool)

حالت اشکال زدایی را برای کمک کننده فعال یا غیرفعال کنید.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

یک پیام به گزارش ماژول اضافه کنید.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## کلاس های کمکی مرتبط

XMF کمک های تخصصی را ارائه می دهد که `XMF\Module\Helper\AbstractHelper` را گسترش می دهد:

### یاور مجوز

برای مستندات دقیق به ../Recipes/Permission-Helper مراجعه کنید.

```php
$permHelper = new \XMF\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### Session Helper

ذخیره سازی جلسه آگاه از ماژول با پیشوند کلید خودکار.

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

### Cache Helper

حافظه پنهان ماژول با پیشوند کلید خودکار.

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

## مثال کامل

در اینجا یک مثال جامع با استفاده از ماژول کمکی آورده شده است:

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

## AbstractHelper کلاس پایه

تمام کلاس‌های کمکی XMF `XMF\Module\Helper\AbstractHelper` را گسترش می‌دهند، که ارائه می‌کند:

### سازنده

```php
public function __construct($dirname)
```

نمونه سازی با نام دایرکتوری ماژول. اگر خالی باشد، از ماژول فعلی استفاده می کند.

### dirname()

نام دایرکتوری ماژول مرتبط با کمک کننده را برمی گرداند.

```php
$dirname = $helper->dirname();
```

### init()

پس از بارگذاری ماژول توسط سازنده فراخوانی می شود. برای منطق اولیه سازی کمک های سفارشی را لغو کنید.

## ایجاد کمک های سفارشی

می توانید کمک کننده را برای عملکردهای خاص ماژول گسترش دهید:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

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

## همچنین ببینید

- شروع به کار با XMF - استفاده اولیه از XMF
- XMF-Request - رسیدگی به درخواست
- ../Recipes/Permission-Helper - مدیریت مجوز
- ../Recipes/Module-Admin-Pages - ایجاد رابط مدیریت

---

#xmf #module-helper #configuration #handlers #session #cache