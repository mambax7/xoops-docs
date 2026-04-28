---
title: "صفحات إدارة الوحدة"
description: "إنشاء صفحات إدارة وحدة موحدة وقابلة للتوافق المستقبلي مع XMF"
dir: rtl
lang: ar
---

توفر فئة `Xmf\Module\Admin` طريقة متسقة لإنشاء واجهات إدارة الوحدات. يضمن استخدام XMF لصفحات الإدارة التوافق المستقبلي مع إصدارات XOOPS المقبلة مع الحفاظ على تجربة المستخدم الموحدة.

## نظرة عامة

جعلت فئة ModuleAdmin في أطر عمل XOOPS الإدارة أسهل، لكن واجهتها البرمجية تطورت عبر الإصدارات. غلاف `Xmf\Module\Admin`:

- يوفر واجهة برمجية مستقرة تعمل عبر إصدارات XOOPS
- يتعامل تلقائياً مع اختلافات API بين الإصدارات
- يضمن أن الكود الإداري الخاص بك متوافق مع المستقبل
- يقدم طرق ثابتة مريحة للمهام الشائعة

## البدء

### إنشاء مثيل إدارة

```php
$admin = \Xmf\Module\Admin::getInstance();
```

هذا يعود إما مثيل `Xmf\Module\Admin` أو فئة نظام أصلية إذا كانت بالفعل متوافقة.

## إدارة الأيقونات

### مشكلة موقع الأيقونة

تحركت الأيقونات بين إصدارات XOOPS، مما تسبب في صداع الصيانة. يحل XMF هذا مع طرق الأداة المساعدة.

### البحث عن الأيقونات

**الطريقة القديمة (تعتمد على الإصدار):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**طريقة XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

تعيد طريقة `iconUrl()` URL كاملة، لذلك لا تحتاج إلى القلق بشأن بناء المسار.

### أحجام الأيقونات

```php
// أيقونات 16x16
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// أيقونات 32x32 (الافتراضي)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// المسار فقط (بدون اسم ملف)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### أيقونات القائمة

لملفات menu.php الإدارية:

**الطريقة القديمة:**
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

**طريقة XMF:**
```php
// احصل على مسار الأيقونات
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
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

## صفحات الإدارة القياسية

### صفحة الفهرس

**الصيغة القديمة:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**صيغة XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### صفحة حول

**الصيغة القديمة:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**صيغة XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **ملاحظة:** في إصدارات XOOPS المستقبلية، يتم تعيين معلومات PayPal في xoops_version.php. استدعاء `setPaypal()` يضمن التوافق مع الإصدارات الحالية بينما ليس له تأثير في الإصدارات الأحدث.

## التنقل

### عرض قائمة التنقل

```php
$admin = \Xmf\Module\Admin::getInstance();

// عرض التنقل للصفحة الحالية
$admin->displayNavigation('items.php');

// أو احصل على سلسلة HTML
$navHtml = $admin->renderNavigation('items.php');
```

## صناديق المعلومات

### إنشاء صناديق المعلومات

```php
$admin = \Xmf\Module\Admin::getInstance();

// أضف صندوق معلومات
$admin->addInfoBox('Module Statistics');

// أضف أسطر إلى صندوق المعلومات
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// عرض صندوق المعلومات
$admin->displayInfoBox();
```

## صناديق التكوين

تعرض صناديق التكوين متطلبات النظام وفحوصات الحالة.

### أسطر التكوين الأساسية

```php
$admin = \Xmf\Module\Admin::getInstance();

// أضف رسالة بسيطة
$admin->addConfigBoxLine('Module is properly configured', 'default');

// فحص وجود الدليل
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// فحص الدليل مع الأذونات
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// فحص تثبيت الوحدة
$admin->addConfigBoxLine('xlanguage', 'module');

// فحص الوحدة مع تحذير بدلاً من خطأ إذا كانت مفقودة
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### طرق سهلة الاستخدام

```php
$admin = \Xmf\Module\Admin::getInstance();

// أضف رسالة خطأ
$admin->addConfigError('Upload directory is not writable');

// أضف رسالة نجاح/قبول
$admin->addConfigAccept('Database tables verified');

// أضف رسالة تحذير
$admin->addConfigWarning('Cache directory should be cleared');

// فحص إصدار الوحدة
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### أنواع صناديق التكوين

| النوع | القيمة | السلوك |
|-------|--------|--------|
| `default` | سلسلة الرسالة | عرض الرسالة مباشرة |
| `folder` | مسار الدليل | عرض قبول إذا كان موجوداً، خطأ إذا لم يكن |
| `chmod` | `[path, permission]` | فحص وجود الدليل مع الإذن |
| `module` | اسم الوحدة | قبول إذا تم تثبيتها، خطأ إذا لم تكن |
| `module` | `[name, 'warning']` | قبول إذا تم تثبيتها، تحذير إذا لم تكن |

## أزرار العناصر

أضف أزرار إجراء إلى صفحات الإدارة:

```php
$admin = \Xmf\Module\Admin::getInstance();

// أضف أزرار
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// عرض الأزرار (محاذاة يسار افتراضية)
$admin->displayButton('left');

// أو احصل على HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## أمثلة صفحات الإدارة الكاملة

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// عرض التنقل
$adminObject->displayNavigation(basename(__FILE__));

// أضف صندوق معلومات مع الإحصائيات
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// فحص التكوين
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// فحص الوحدات الاختيارية
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// عرض صفحة الفهرس
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// احصل على العملية
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // أضف أزرار العمل
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // اعرض العناصر
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // عرض الجدول
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // كود معالجة النموذج...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// عيّن معرف PayPal للتبرعات (اختياري)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// عرض صفحة حول
// مرر false لإخفاء شعار XOOPS، true لإظهاره
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// احصل على مسار الأيقونة باستخدام XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// لوحة المعلومات
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// العناصر
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// الفئات
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// الأذونات
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// حول
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## مرجع API

### الطرق الثابتة

| الطريقة | الوصف |
|--------|-------|
| `getInstance()` | احصل على مثيل الإدارة |
| `iconUrl($name, $size)` | احصل على عنوان URL للأيقونة (الحجم: 16 أو 32) |
| `menuIconPath($image)` | احصل على مسار الأيقونة لـ menu.php |
| `setPaypal($paypal)` | عيّن معرف PayPal لصفحة حول |

### طرق المثيل

| الطريقة | الوصف |
|--------|-------|
| `displayNavigation($menu)` | عرض قائمة التنقل |
| `renderNavigation($menu)` | إرجاع HTML التنقل |
| `addInfoBox($title)` | أضف صندوق معلومات |
| `addInfoBoxLine($text, $type, $color)` | أضف سطر إلى صندوق المعلومات |
| `displayInfoBox()` | عرض صندوق المعلومات |
| `renderInfoBox()` | إرجاع HTML صندوق المعلومات |
| `addConfigBoxLine($value, $type)` | أضف سطر فحص التكوين |
| `addConfigError($value)` | أضف خطأ إلى صندوق التكوين |
| `addConfigAccept($value)` | أضف نجاح إلى صندوق التكوين |
| `addConfigWarning($value)` | أضف تحذير إلى صندوق التكوين |
| `addConfigModuleVersion($moddir, $version)` | فحص إصدار الوحدة |
| `addItemButton($title, $link, $icon, $extra)` | أضف زر إجراء |
| `displayButton($position, $delimiter)` | عرض الأزرار |
| `renderButton($position, $delimiter)` | إرجاع HTML الأزرار |
| `displayIndex()` | عرض صفحة الفهرس |
| `renderIndex()` | إرجاع HTML صفحة الفهرس |
| `displayAbout($logo_xoops)` | عرض صفحة حول |
| `renderAbout($logo_xoops)` | إرجاع HTML صفحة حول |

## انظر أيضاً

- ../Basics/XMF-Module-Helper - فئة مساعد الوحدة
- Permission-Helper - إدارة الأذونات
- ../XMF-Framework - نظرة عامة على الإطار

---

#xmf #admin #module-development #navigation #icons
