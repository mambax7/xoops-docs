---
title: "سلام ماژول جهان"
description: "آموزش گام به گام برای ایجاد اولین ماژول XOOPS"
---
# آموزش ماژول Hello World

این آموزش شما را در ایجاد اولین ماژول XOOPS راهنمایی می کند. در پایان، یک ماژول کار خواهید داشت که "Hello World" را هم در قسمت جلویی و هم در قسمت مدیریت نمایش می دهد.

## پیش نیاز

- XOOPS 2.5.x نصب و اجرا شده است
- PHP 8.0 یا بالاتر
- دانش پایه PHP
- ویرایشگر متن یا IDE (PhpStorm توصیه می شود)

## مرحله 1: ساختار دایرکتوری را ایجاد کنید

ساختار دایرکتوری زیر را در `/modules/helloworld/` ایجاد کنید:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## مرحله 2: تعریف ماژول را ایجاد کنید

`xoops_version.php` را ایجاد کنید:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## مرحله 3: ایجاد فایل های زبان

### modinfo.php (اطلاعات ماژول)

`language/english/modinfo.php` را ایجاد کنید:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (زبان اصلی)

`language/english/main.php` را ایجاد کنید:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (زبان مدیریت)

`language/english/admin.php` را ایجاد کنید:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## مرحله 4: نمایه Frontend را ایجاد کنید

`index.php` را در ریشه ماژول ایجاد کنید:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use XMF\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \XMF\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## مرحله 5: قالب Frontend را ایجاد کنید

`templates/helloworld_index.tpl` را ایجاد کنید:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## مرحله 6: فایل های مدیریت ایجاد کنید

### سربرگ مدیریت

`admin/admin_header.php` را ایجاد کنید:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \XMF\Module\Helper::getHelper('helloworld');
$adminObject = \XMF\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### پاورقی مدیریت

`admin/admin_footer.php` را ایجاد کنید:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### منوی مدیریت

`admin/menu.php` را ایجاد کنید:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### صفحه فهرست مدیریت

`admin/index.php` را ایجاد کنید:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## مرحله 7: ایجاد قالب مدیریت

`templates/admin/helloworld_admin_index.tpl` را ایجاد کنید:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## مرحله 8: لوگوی ماژول را ایجاد کنید

یک تصویر PNG (اندازه پیشنهادی: 92x92 پیکسل) ایجاد یا کپی کنید:
`assets/images/logo.png`

می توانید از هر ویرایشگر تصویری برای ایجاد یک لوگوی ساده استفاده کنید یا از یک مکان نگهدار از سایتی مانند placeholder.com استفاده کنید.

## مرحله 9: ماژول را نصب کنید

1. به عنوان مدیر وارد سایت XOOPS خود شوید
2. به **System Admin** > **Modules** بروید
3. "Hello World" را در لیست ماژول های موجود پیدا کنید
4. روی دکمه **Install** کلیک کنید
5. نصب را تایید کنید

## مرحله 10: ماژول خود را تست کنید

### تست Frontend

1. به سایت XOOPS خود بروید
2. در منوی اصلی بر روی "Hello World" کلیک کنید
3. باید پیام خوش آمدگویی و زمان فعلی را ببینید

### تست مدیریت

1. به قسمت مدیریت بروید
2. در منوی مدیریت بر روی "Hello World" کلیک کنید
3. باید داشبورد مدیریت را ببینید

## عیب یابی

### ماژول در لیست نصب ظاهر نمی شود

- بررسی مجوزهای فایل (755 برای دایرکتوری ها، 644 برای فایل ها)
- بررسی کنید که `xoops_version.php` هیچ خطای نحوی ندارد
- کش XOOPS را پاک کنید

### قالب بارگیری نمی شود

- مطمئن شوید که فایل های قالب در دایرکتوری صحیح قرار دارند
- بررسی کنید که نام فایل های قالب با `xoops_version.php` مطابقت داشته باشد
- بررسی کنید که نحو Smarty درست است

### رشته های زبان نمایش داده نمی شوند

- مسیرهای فایل زبان را بررسی کنید
- مطمئن شوید که ثابت های زبان تعریف شده اند
- بررسی کنید که پوشه زبان صحیح وجود داشته باشد

## مراحل بعدی

اکنون که یک ماژول کار دارید، به یادگیری ادامه دهید:

- Building-a-CRUD-Module - افزودن قابلیت پایگاه داده
- ../Patterns/MVC-Pattern - کد خود را به درستی سازماندهی کنید
- ../Best-Practices/Testing - تست های PHPUnit را اضافه کنید

## مرجع کامل فایل

ماژول تکمیل شده شما باید این فایل ها را داشته باشد:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## خلاصه

تبریک می گویم! شما اولین ماژول XOOPS خود را ایجاد کرده اید. مفاهیم کلیدی تحت پوشش:

1. **ساختار ماژول** - طرح دایرکتوری ماژول استاندارد XOOPS
2. **xoops_version.php** - تعریف و پیکربندی ماژول
3. **فایل های زبان ** - پشتیبانی بین المللی
4. **قالب** - ادغام قالب هوشمند
5. **رابط مدیریت ** - پنل مدیریت پایه

همچنین ببینید: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern