---
title: "تطوير الوحدة"
description: "دليل شامل لتطوير وحدات XOOPS باستخدام ممارسات PHP الحديثة"
dir: rtl
lang: ar
---

يوفر هذا القسم وثائق شاملة لتطوير وحدات XOOPS باستخدام ممارسات PHP الحديثة والأنماط والممارسات الأفضل.

## نظرة عامة

لقد تطورت تطوير وحدات XOOPS بشكل كبير على مر السنين. وحدات حديثة الاستفادة من:

- **عمارة MVC** - فصل نظيف للاهتمامات
- **ميزات PHP 8.x** - إعلانات النوع والسمات والمعاملات المسماة
- **أنماط التصميم** - أنماط Repository و DTO و Service Layer
- **الاختبار** - PHPUnit مع ممارسات اختبار حديثة
- **إطار XMF** - أدوات XOOPS Module Framework

## هيكل الوثائق

### الدروس

أدلة خطوة بخطوة لبناء وحدات XOOPS من الصفر.

- Tutorials/Hello-World-Module - أول وحدة XOOPS لك
- Tutorials/Building-a-CRUD-Module - إنشاء وحدة Create و Read و Update و Delete الكاملة

### أنماط التصميم

الأنماط المعمارية المستخدمة في تطوير وحدة XOOPS الحديثة.

- Patterns/MVC-Pattern - معمارية Model-View-Controller
- Patterns/Repository-Pattern - تجريد الوصول إلى البيانات
- Patterns/DTO-Pattern - كائنات نقل البيانات للتدفق النظيف للبيانات

### أفضل الممارسات

إرشادات لكتابة كود قابل للصيانة ذو جودة عالية.

- Best-Practices/Clean-Code - مبادئ الكود النظيف لـ XOOPS
- Best-Practices/Code-Smells - مضادات شائعة وكيفية إصلاحها
- Best-Practices/Testing - استراتيجيات اختبار PHPUnit

### أمثلة

تحليل وحدة حقيقية وأمثلة التنفيذ.

- Publisher-Module-Analysis - الغوص العميق في وحدة Publisher

## هيكل دليل الوحدة

وحدة XOOPS منظمة بشكل جيد تتبع هيكل الدليل التالي:

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## ملفات مفتاح موضحة

### xoops_version.php

ملف تعريف الوحدة الذي يخبر XOOPS عن وحدتك:

```php
<?php
$modversion = [];

// معلومات أساسية
$modversion['name']        = 'وحدتي';
$modversion['version']     = 1.00;
$modversion['description'] = 'وحدة عينة XOOPS';
$modversion['author']      = 'اسمك';
$modversion['credits']     = 'فريقك';
$modversion['license']     = 'GPL 2.0 أو لاحقاً';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// أعلام الوحدة
$modversion['hasMain']     = 1;  // لديها صفحات الواجهة الأمامية
$modversion['hasAdmin']    = 1;  // لديها قسم الإدارة
$modversion['system_menu'] = 1;  // الظهور في القائمة الإدارية

// تكوين الإدارة
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// قاعدة البيانات
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// القوالب
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'قالب الصفحة الرئيسية',
];

// الكتل
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'كتلتي',
    'description' => 'عرض العناصر الأخيرة',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// تفضيلات الوحدة
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### ملف التضمين المشترك

أنشئ ملف bootstrap مشترك لوحدتك:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('لم يتم تحديد مسار جذر XOOPS');
}

// ثوابت الوحدة
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// التحميل التلقائي للفئات
require_once MYMODULE_PATH . '/class/autoload.php';
```

## متطلبات إصدار PHP

يجب على وحدات XOOPS الحديثة أن تستهدف PHP 8.0 أو إصدار أحدث للاستفادة من:

- **ترقية خصائص المنشئ**
- **المعاملات المسماة**
- **أنواع الاتحاد**
- **تطابق التعبيرات**
- **السمات**
- **عامل Nullsafe**

## الخطوات الأولى

1. ابدأ بدليل Tutorials/Hello-World-Module
2. انتقل إلى Tutorials/Building-a-CRUD-Module
3. ادرس Patterns/MVC-Pattern للإرشاد المعماري
4. طبق ممارسات Best-Practices/Clean-Code طوال الوقت
5. طبق Best-Practices/Testing من البداية

## الموارد ذات الصلة

- ../05-XMF-Framework/XMF-Framework - أدوات XOOPS Module Framework
- Database-Operations - العمل مع قاعدة بيانات XOOPS
- ../04-API-Reference/Template/Template-System - قالب Smarty في XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - تأمين وحدتك

## سجل الإصدارات

| الإصدار | التاريخ | التغييرات |
|---------|--------|---------|
| 1.0 | 2025-01-28 | الوثائق الأولية |
