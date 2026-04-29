---
title: "شروع کار با XMF"
description: "نصب، مفاهیم اولیه و مراحل اولیه با چارچوب ماژول XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

این راهنما مفاهیم اساسی چارچوب ماژول XOOPS (XMF) و نحوه شروع استفاده از آن در ماژول های خود را پوشش می دهد.

## پیش نیاز

- XOOPS 2.5.8 یا بالاتر نصب شده است
- PHP 7.2 یا بالاتر
- درک اولیه از برنامه نویسی شی گرا PHP

## درک فضاهای نام

XMF از فضاهای نام PHP برای سازماندهی کلاس های خود و جلوگیری از تداخل نامگذاری استفاده می کند. تمام کلاس های XMF در فضای نام `XMF` قرار دارند.

### مشکل فضای جهانی

بدون فضاهای نام، تمام کلاس های PHP یک فضای جهانی مشترک دارند. این می تواند باعث درگیری شود:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### راه حل فضاهای نام

فضاهای نام زمینه های نامگذاری مجزا را ایجاد می کنند:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### با استفاده از فضای نام XMF

شما می توانید کلاس های XMF را به چند روش ارجاع دهید:

**مسیر فضای نام کامل:**
```php
$helper = \XMF\Module\Helper::getHelper('mymodule');
```

**با بیانیه استفاده:**
```php
use XMF\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**واردات چندگانه:**
```php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## بارگذاری خودکار

یکی از بزرگترین امکانات XMF بارگیری کلاس خودکار است. شما هرگز نیازی به اضافه کردن دستی فایل های کلاس XMF ندارید.

### XOOPS سنتی در حال بارگیری

روش قدیمی نیاز به بارگذاری صریح داشت:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### بارگیری خودکار XMF

با XMF، کلاس ها به صورت خودکار بارگیری می شوند:

```php
$input = XMF\Request::getString('input', '');
```

یا با عبارت استفاده:

```php
use XMF\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

بارگذاری خودکار از استاندارد [PSR-4](http://www.php-fig.org/psr/psr-4/) پیروی می کند و همچنین وابستگی هایی را که XMF به آنها متکی است مدیریت می کند.

## مثال های استفاده پایه

### ورودی درخواست خواندن

```php
use XMF\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### با استفاده از Module Helper

```php
use XMF\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### راهنماها و راهنماهای URL

```php
use XMF\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## اشکال زدایی با XMF

XMF ابزارهای رفع اشکال مفیدی را ارائه می دهد:

```php
// Dump a variable with nice formatting
\XMF\Debug::dump($myVariable);

// Dump multiple variables
\XMF\Debug::dump($var1, $var2, $var3);

// Dump POST data
\XMF\Debug::dump($_POST);

// Show a backtrace
\XMF\Debug::backtrace();
```

خروجی اشکال زدایی قابل جمع شدن است و اشیا و آرایه ها را در قالبی خوانا نمایش می دهد.

## توصیه ساختار پروژه

هنگام ساخت ماژول های مبتنی بر XMF، کد خود را سازماندهی کنید:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## مشترک شامل الگو

یک نقطه ورودی ماژول معمولی:

```php
<?php
// mymodule/index.php

use XMF\Request;
use XMF\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## مراحل بعدی

اکنون که اصول اولیه را فهمیدید، بررسی کنید:

- XMF-Request - مستندات رسیدگی دقیق به درخواست
- XMF-Module-Helper - مرجع کمکی کامل ماژول
- ../Recipes/Permission-Helper - مدیریت مجوزهای کاربر
- ../Recipes/Module-Admin-Pages - ساخت رابط های مدیریت

## همچنین ببینید

- ../XMF-Framework - نمای کلی چارچوب
- ../Reference/JWT - پشتیبانی از JSON Web Token
- ../Reference/Database - ابزارهای پایگاه داده

---

#xmf #شروع به کار #فضای نام #بارگیری خودکار #اصول