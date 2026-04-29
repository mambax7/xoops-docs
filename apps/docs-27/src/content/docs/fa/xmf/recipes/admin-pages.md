---
title: "صفحات مدیریت ماژول"
description: "ایجاد صفحات مدیریت ماژول استاندارد و سازگار با جلو با XMF"
---
کلاس `XMF\Module\Admin` یک راه ثابت برای ایجاد رابط های مدیریت ماژول ارائه می دهد. استفاده از XMF برای صفحات مدیریت، سازگاری رو به جلو با نسخه های XOOPS آینده را تضمین می کند و در عین حال تجربه کاربری یکنواختی را حفظ می کند.

## بررسی اجمالی

کلاس ModuleAdmin در XOOPS Frameworks مدیریت را آسان‌تر کرده است، اما API آن در نسخه‌های مختلف تکامل یافته است. بسته بندی `XMF\Module\Admin`:

- یک API پایدار ارائه می دهد که در نسخه های XOOPS کار می کند
- به طور خودکار تفاوت های API بین نسخه ها را کنترل می کند
- اطمینان حاصل می کند که کد مدیریت شما با فوروارد سازگار است
- روش های ایستا مناسب را برای کارهای رایج ارائه می دهد

## شروع به کار

### ایجاد یک نمونه مدیریت

```php
$admin = \XMF\Module\Admin::getInstance();
```

این یک نمونه `XMF\Module\Admin` یا یک کلاس سیستم بومی را در صورتی که از قبل سازگار باشد برمی گرداند.

## مدیریت آیکون

### مشکل مکان نماد

آیکون‌ها بین نسخه‌های XOOPS جابه‌جا شده‌اند و باعث سردرد تعمیر و نگهداری می‌شوند. XMF این مشکل را با روش های کاربردی حل می کند.

### پیدا کردن نمادها

**روش قدیمی (وابسته به نسخه):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**راه XMF:**
```php
$img_src = \XMF\Module\Admin::iconUrl('delete.png', 16);
```

روش `iconUrl()` یک URL کامل را برمی گرداند، بنابراین نیازی نیست نگران ساخت مسیر باشید.

### اندازه نمادها

```php
// 16x16 icons
$smallIcon = \XMF\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \XMF\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \XMF\Module\Admin::iconUrl('', 16);
```

### نمادهای منو

برای فایل های مدیریت menu.php:

**روش قدیم:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**راه XMF:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('XMF\Module\Admin', true)) {
    $pathIcon32 = \XMF\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## صفحات مدیریت استاندارد

### صفحه فهرست

**فرمت قدیمی:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**فرمت XMF:**
```php
$indexAdmin = \XMF\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### درباره صفحه

**فرمت قدیمی:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**فرمت XMF:**
```php
$aboutAdmin = \XMF\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\XMF\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **توجه:** در نسخه های بعدی XOOPS، اطلاعات PayPal در xoops_version.php تنظیم می شود. تماس `setPaypal()` سازگاری با نسخه های فعلی را تضمین می کند در حالی که در نسخه های جدید تأثیری ندارد.

## ناوبری

### نمایش منوی ناوبری

```php
$admin = \XMF\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## جعبه اطلاعات

### ایجاد جعبه اطلاعات

```php
$admin = \XMF\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## جعبه های پیکربندی

جعبه های پیکربندی نیازمندی های سیستم و بررسی وضعیت را نمایش می دهند.

### خطوط اصلی پیکربندی

```php
$admin = \XMF\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### روش های راحتی

```php
$admin = \XMF\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### انواع جعبه پیکربندی

| نوع | ارزش | رفتار |
|------|-------|----------|
| `default` | رشته پیام | پیام را مستقیماً نمایش می دهد |
| `folder` | مسیر دایرکتوری | در صورت وجود پذیرفتن، اگر وجود ندارد خطا را نشان می‌دهد
| `chmod` | `[path, permission]` | فهرست چک ها با مجوز وجود دارد |
| `module` | نام ماژول | قبول در صورت نصب، خطا در غیر این صورت |
| `module` | `[name, 'warning']` | پذیرش در صورت نصب، هشدار در صورت عدم نصب |

## دکمه های مورد

افزودن دکمه های عمل به صفحات مدیریت:

```php
$admin = \XMF\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## نمونه های کامل صفحه مدیریت

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \XMF\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \XMF\Module\Admin::getInstance();

// Get operation
$op = \XMF\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \XMF\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \XMF\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \XMF\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\XMF\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('XMF\Module\Admin', true)) {
    $pathIcon32 = \XMF\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## مرجع API

### روشهای استاتیک

| روش | توضیحات |
|--------|------------|
| `getInstance()` | دریافت نمونه مدیریت |
| `iconUrl($name, $size)` | دریافت آدرس آیکون (سایز: 16 یا 32) |
| `menuIconPath($image)` | دریافت مسیر نماد برای menu.php |
| `setPaypal($paypal)` | تنظیم PayPal ID برای صفحه مربوط به |

### روش های نمونه| روش | توضیحات |
|--------|------------|
| `displayNavigation($menu)` | نمایش منوی پیمایش |
| `renderNavigation($menu)` | پیمایش بازگشت HTML |
| `addInfoBox($title)` | افزودن جعبه اطلاعات |
| `addInfoBoxLine($text, $type, $color)` | افزودن خط به جعبه اطلاعات |
| `displayInfoBox()` | نمایش جعبه اطلاعات |
| `renderInfoBox()` | جعبه اطلاعات بازگشت HTML |
| `addConfigBoxLine($value, $type)` | افزودن خط چک پیکربندی |
| `addConfigError($value)` | افزودن خطا به کادر پیکربندی |
| `addConfigAccept($value)` | افزودن موفقیت به کادر پیکربندی |
| `addConfigWarning($value)` | افزودن هشدار به کادر پیکربندی |
| `addConfigModuleVersion($moddir, $version)` | بررسی نسخه ماژول |
| `addItemButton($title, $link, $icon, $extra)` | افزودن دکمه اقدام |
| `displayButton($position, $delimiter)` | دکمه های نمایش |
| `renderButton($position, $delimiter)` | دکمه بازگشت HTML |
| `displayIndex()` | نمایش صفحه فهرست |
| `renderIndex()` | بازگشت صفحه فهرست HTML |
| `displayAbout($logo_xoops)` | نمایش درباره صفحه |
| `renderAbout($logo_xoops)` | بازگشت درباره HTML صفحه |

## همچنین ببینید

- ../Basics/XMF-Module-Helper - کلاس کمکی ماژول
- Permission-Helper - مدیریت مجوز
- ../XMF-Framework - نمای کلی چارچوب

---

#xmf #admin #توسعه ماژول #نمادهای ناوبری