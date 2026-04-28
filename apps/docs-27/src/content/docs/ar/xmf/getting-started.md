---
title: "البدء مع XMF"
description: "التثبيت والمفاهيم الأساسية والخطوات الأولى مع إطار عمل وحدات XOOPS"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

يغطي هذا الدليل المفاهيم الأساسية لإطار عمل وحدات XOOPS (XMF) وكيفية البدء في استخدامه في وحداتك.

## المتطلبات الأساسية

- XOOPS 2.5.8 أو أحدث مثبت
- PHP 7.2 أو أحدث
- فهم أساسي للبرمجة الموجهة للكائنات في PHP

## فهم الفضاءات

يستخدم XMF فضاءات PHP لتنظيم فئاته وتجنب تضارب الأسماء. جميع فئات XMF موجودة في فضاء `Xmf`.

### مشكلة الفضاء العام

بدون فضاءات، جميع فئات PHP تشترك في فضاء عام. قد يسبب هذا تضاربات:

```php
<?php
// هذا سيتضارب مع ArrayObject المدمج في PHP
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### حل الفضاءات

تنشئ الفضاءات سياقات تسمية معزولة:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// لا يوجد تضارب - هذا هو \MyNamespace\ArrayObject
```

### استخدام فضاءات XMF

يمكنك الإشارة إلى فئات XMF بعدة طرق:

**مسار الفضاء الكامل:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**مع بيان use:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**استيراد متعدد:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## التحميل التلقائي

واحدة من أكبر مزايا XMF هي تحميل الفئات التلقائي. لن تحتاج أبداً إلى تضمين ملفات فئات XMF يدوياً.

### تحميل XOOPS التقليدي

الطريقة القديمة تتطلب تحميلاً صريحاً:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### تحميل XMF التلقائي

مع XMF، تُحمّل الفئات تلقائياً عند الإشارة إليها:

```php
$input = Xmf\Request::getString('input', '');
```

أو مع بيان use:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

يتبع المحمل [PSR-4](http://www.php-fig.org/psr/psr-4/) المعيار ويدير أيضاً التبعيات التي يعتمد عليها XMF.

## أمثلة الاستخدام الأساسي

### قراءة إدخال الطلب

```php
use Xmf\Request;

// احصل على قيمة عددية مع افتراضي 0
$id = Request::getInt('id', 0);

// احصل على قيمة سلسلة مع افتراضي سلسلة فارغة
$title = Request::getString('title', '');

// احصل على الأمر (حروف أبجدية رقمية وأحرف صغيرة)
$op = Request::getCmd('op', 'list');

// احصل على بريد إلكتروني مع التحقق
$email = Request::getEmail('email', '');

// احصل من hash محددة (POST, GET, إلخ)
$formData = Request::getString('data', '', 'POST');
```

### استخدام مساعد الوحدة

```php
use Xmf\Module\Helper;

// احصل على مساعد للوحدة الخاصة بك
$helper = Helper::getHelper('mymodule');

// اقرأ تكوين الوحدة
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// الوصول إلى كائن الوحدة
$module = $helper->getModule();
$version = $module->getVar('version');

// احصل على معالج
$itemHandler = $helper->getHandler('items');

// حمّل ملف اللغة
$helper->loadLanguage('admin');

// فحص ما إذا كانت الوحدة الحالية
if ($helper->isCurrentModule()) {
    // نحن في هذه الوحدة
}

// فحص حقوق الإدارة
if ($helper->isUserAdmin()) {
    // المستخدم لديه وصول إداري
}
```

### مساعدون المسار والرابط

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// احصل على رابط الوحدة
$moduleUrl = $helper->url('images/logo.png');
// يعود: https://example.com/modules/mymodule/images/logo.png

// احصل على مسار الوحدة
$modulePath = $helper->path('templates/view.tpl');
// يعود: /var/www/html/modules/mymodule/templates/view.tpl

// مسارات التحميل
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## التصحيح مع XMF

يوفر XMF أدوات تصحيح مفيدة:

```php
// طبع متغير مع تنسيق جميل
\Xmf\Debug::dump($myVariable);

// طبع متغيرات متعددة
\Xmf\Debug::dump($var1, $var2, $var3);

// طبع بيانات POST
\Xmf\Debug::dump($_POST);

// عرض تتبع العودة
\Xmf\Debug::backtrace();
```

يعرض مخرجات التصحيح قابلة للطي ويعرض الكائنات والصفائف بصيغة سهلة القراءة.

## توصية هيكل المشروع

عند بناء وحدات قائمة على XMF، نظّم الكود الخاص بك:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # مساعد مخصص اختياري
    ItemHandler.php     # معالجاتك
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

## نمط الإدراج الشائع

نقطة دخول وحدة نموذجية:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// احصل على العملية من الطلب
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// أدرج رأس XOOPS
require_once XOOPS_ROOT_PATH . '/header.php';

// منطق الوحدة الخاص بك هنا
switch ($op) {
    case 'view':
        // التعامل مع العرض
        break;
    case 'list':
    default:
        // التعامل مع القائمة
        break;
}

// أدرج تذييل XOOPS
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## الخطوات التالية

الآن بعد أن فهمت الأساسيات، استكشف:

- XMF-Request - توثيق معالجة الطلبات المفصلة
- XMF-Module-Helper - مرجع مساعد الوحدة الكامل
- ../Recipes/Permission-Helper - إدارة أذونات المستخدم
- ../Recipes/Module-Admin-Pages - بناء واجهات الإدارة

## انظر أيضاً

- ../XMF-Framework - نظرة عامة على الإطار
- ../Reference/JWT - دعم JSON Web Token
- ../Reference/Database - أدوات قاعدة البيانات

---

#xmf #getting-started #namespaces #autoloading #basics
