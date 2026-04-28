---
title: "وحدة Hello World"
description: "دليل خطوة بخطوة لإنشاء وحدة XOOPS الأولى لك"
dir: rtl
lang: ar
---

# دليل وحدة Hello World

يوضح هذا الدليل كيفية إنشاء وحدة XOOPS الأولى. في النهاية، سيكون لديك وحدة عاملة تعرض "Hello World" على الواجهات الأمامية ومناطق الإدارة.

## المتطلبات الأساسية

- XOOPS 2.5.x مثبت وقيد التشغيل
- PHP 8.0 أو أعلى
- معرفة أساسية بـ PHP
- محرر نصوص أو IDE (يُنصح به PhpStorm)

## الخطوة 1: إنشاء هيكل الدليل

أنشئ هيكل الدليل التالي في `/modules/helloworld/`:

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

## الخطوة 2: إنشاء تعريف الوحدة

أنشئ `xoops_version.php`:

```php
<?php
/**
 * وحدة Hello World - تعريف الوحدة
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

// معلومات الوحدة الأساسية
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

// حالة الوحدة
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// إعدادات الإدارة
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// القائمة الرئيسية
$modversion['hasMain'] = 1;

// القوالب
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// قوالب الإدارة
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// لا توجد جداول قاعدة بيانات مطلوبة لهذه الوحدة البسيطة
$modversion['tables'] = [];
```

## الخطوة 3: إنشاء ملفات اللغة

### modinfo.php (معلومات الوحدة)

أنشئ `language/english/modinfo.php`:

```php
<?php
/**
 * ثوابت لغة معلومات الوحدة
 */

// معلومات الوحدة
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// وصفات القوالب
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (لغة الواجهة الأمامية)

أنشئ `language/english/main.php`:

```php
<?php
/**
 * ثوابت لغة الواجهة الأمامية
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (لغة الإدارة)

أنشئ `language/english/admin.php`:

```php
<?php
/**
 * ثوابت لغة الإدارة
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## الخطوة 4: إنشاء الفهرس للواجهة الأمامية

أنشئ `index.php` في جذر الوحدة:

```php
<?php
/**
 * وحدة Hello World - الفهرس الأمامي
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// تحميل ملف اللغة
xoops_loadLanguage('main', 'helloworld');

// احصل على مساعد الوحدة
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// اضبط قالب الصفحة
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// قم بتضمين رأس XOOPS
require XOOPS_ROOT_PATH . '/header.php';

// احصل على تكوين الوحدة
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// إنشاء محتوى الصفحة
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// عداد زائر بسيط (باستخدام الجلسة)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// عيّن المتغيرات للقالب
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// قم بتضمين تذييل XOOPS
require XOOPS_ROOT_PATH . '/footer.php';
```

## الخطوة 5: إنشاء قالب الواجهة الأمامية

أنشئ `templates/helloworld_index.tpl`:

```smarty
<{* وحدة Hello World - قالب الفهرس *}>

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

## الخطوة 6: إنشاء ملفات الإدارة

### رأس الإدارة

أنشئ `admin/admin_header.php`:

```php
<?php
/**
 * رأس الإدارة
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// تحميل ملف لغة الإدارة
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// احصل على مساعد الوحدة
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// دليل الوحدة
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### تذييل الإدارة

أنشئ `admin/admin_footer.php`:

```php
<?php
/**
 * تذييل الإدارة
 */

// اعرض تذييل الإدارة
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### قائمة الإدارة

أنشئ `admin/menu.php`:

```php
<?php
/**
 * تكوين قائمة الإدارة
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// لوحة التحكم
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### صفحة فهرس الإدارة

أنشئ `admin/index.php`:

```php
<?php
/**
 * صفحة فهرس الإدارة
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// اعرض ملاحة الإدارة
$adminObject->displayNavigation('index.php');

// إنشاء صندوق معلومات الإدارة
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// اعرض صندوق المعلومات
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// اعرض تذييل الإدارة
require_once __DIR__ . '/admin_footer.php';
```

## الخطوة 7: إنشاء قالب الإدارة

أنشئ `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* وحدة Hello World - قالب فهرس الإدارة *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## الخطوة 8: إنشاء شعار الوحدة

أنشئ أو انسخ صورة PNG (الحجم الموصى به: 92x92 بكسل) إلى:
`assets/images/logo.png`

يمكنك استخدام أي محرر صور لإنشاء شعار بسيط، أو استخدام عنصر نائب من موقع مثل placeholder.com.

## الخطوة 9: تثبيت الوحدة

1. قم بتسجيل الدخول إلى موقع XOOPS الخاص بك كمسؤول
2. انتقل إلى **System Admin** > **Modules**
3. ابحث عن "Hello World" في قائمة الوحدات المتاحة
4. انقر على الزر **Install**
5. أكد التثبيت

## الخطوة 10: اختبر وحدتك

### اختبار الواجهة الأمامية

1. انتقل إلى موقع XOOPS الخاص بك
2. انقر على "Hello World" في القائمة الرئيسية
3. يجب أن ترى رسالة الترحيب والوقت الحالي

### اختبار الإدارة

1. انتقل إلى منطقة الإدارة
2. انقر على "Hello World" في قائمة الإدارة
3. يجب أن ترى لوحة تحكم الإدارة

## استكشاف الأخطاء

### الوحدة لا تظهر في قائمة التثبيت

- تحقق من أذونات الملفات (755 للدلائل، 644 للملفات)
- تحقق من عدم وجود أخطاء بناء الجملة في `xoops_version.php`
- امسح ذاكرة تخزين مؤقتة XOOPS

### القالب لا يتم تحميله

- تأكد من وجود ملفات القوالب في الدليل الصحيح
- تحقق من أن أسماء ملفات القوالب تطابق تلك الموجودة في `xoops_version.php`
- تحقق من صحة بناء جملة Smarty

### سلاسل اللغة لا تظهر

- تحقق من مسارات ملفات اللغة
- تأكد من تعريف ثوابت اللغة
- تحقق من وجود مجلد اللغة الصحيح

## الخطوات التالية

الآن بعد أن لديك وحدة عاملة، استمر في التعلم باستخدام:

- Building-a-CRUD-Module - أضف وظيفة قاعدة البيانات
- ../Patterns/MVC-Pattern - نظم الكود الخاص بك بشكل صحيح
- ../Best-Practices/Testing - أضف اختبارات PHPUnit

## مرجع الملف الكامل

يجب أن تحتوي وحدتك المكتملة على هذه الملفات:

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

## الملخص

تهانينا! لقد أنشأت وحدة XOOPS الأولى. المفاهيم الرئيسية المغطاة:

1. **هيكل الوحدة** - تخطيط دليل وحدة XOOPS القياسي
2. **xoops_version.php** - تعريف وتكوين الوحدة
3. **ملفات اللغة** - دعم التدويل
4. **القوالب** - تكامل قالب Smarty
5. **واجهة الإدارة** - لوحة إدارة أساسية

انظر أيضاً: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
