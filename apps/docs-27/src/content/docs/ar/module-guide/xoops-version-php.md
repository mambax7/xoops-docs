---
title: "xoops_version.php - بيان الوحدة"
dir: rtl
lang: ar
---

## نظرة عامة

ملف `xoops_version.php` هو قلب كل وحدة XOOPS. يحدد البيانات الوصفية للوحدة وجداول قاعدة البيانات والقوالب والكتل وخيارات التكوين وخطاطيف التثبيت.

## البنية الأساسية

```php
<?php
/**
 * ملف بيان الوحدة
 */

$modversion = [
    // هوية الوحدة
    'name'           => _MI_MYMODULE_NAME,
    'version'        => '1.0.0',
    'description'    => _MI_MYMODULE_DESC,
    'author'         => 'Your Name',
    'author_mail'    => 'your@email.com',
    'author_website' => 'https://yoursite.com',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0 or later',
    'license_url'    => 'https://www.gnu.org/licenses/gpl-2.0.html',
    'dirname'        => basename(__DIR__),

    // الصور
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // إعدادات النظام
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,
    'hasSearch'      => 1,
    'hasComments'    => 0,
    'hasNotification'=> 0,
];
```

## مرجع شامل

### هوية الوحدة

| المفتاح | النوع | الوصف |
|-----|------|-------------|
| `name` | string | اسم العرض (استخدم ثابت اللغة) |
| `version` | string | الإصدار الدلالي (MAJOR.MINOR.PATCH) |
| `description` | string | وصف الوحدة |
| `author` | string | اسم المؤلف الأساسي |
| `credits` | string | المساهمون الإضافيون |
| `license` | string | اسم الترخيص |
| `dirname` | string | اسم دليل الوحدة |

### جداول قاعدة البيانات

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### القوالب

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

### الكتل

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0',  // default options
    'can_clone'   => true,
];
```

### خيارات التكوين

```php
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

$modversion['config'][] = [
    'name'        => 'enable_comments',
    'title'       => '_MI_MYMODULE_ENABLE_COMMENTS',
    'description' => '',
    'formtype'    => 'yesno',
    'valuetype'   => 'int',
    'default'     => 1,
];

$modversion['config'][] = [
    'name'        => 'display_mode',
    'title'       => '_MI_MYMODULE_DISPLAY_MODE',
    'description' => '',
    'formtype'    => 'select',
    'valuetype'   => 'text',
    'default'     => 'list',
    'options'     => [
        _MI_MYMODULE_MODE_LIST => 'list',
        _MI_MYMODULE_MODE_GRID => 'grid',
    ],
];
```

### أنواع النموذج

| formtype | valuetype | الوصف |
|----------|-----------|-------------|
| `textbox` | `text`/`int` | إدخال سطر واحد |
| `textarea` | `text` | إدخال متعدد الأسطر |
| `yesno` | `int` | راديو نعم/لا |
| `select` | `text` | تحديد القائمة المنسدلة |
| `select_multi` | `array` | متعدد التحديد |
| `group` | `int` | محدد المجموعة |
| `group_multi` | `array` | محدد المجموعة المتعددة |
| `user` | `int` | محدد المستخدم |
| `color` | `text` | منتقي اللون |
| `hidden` | `text` | حقل مخفي |

### عناصر القائمة

```php
// القائمة الرئيسية
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

### خطاطيف التثبيت

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### تكامل البحث

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### تكامل التعليقات

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### الإخطارات

```php
$modversion['hasNotification'] = 1;
$modversion['notification'] = [
    'lookup_file' => 'include/notification.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => '',
            'subscribe_from' => 'index.php',
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => '',
            'subscribe_from' => 'item.php',
            'item_name'      => 'item_id',
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SUBJ,
        ],
    ],
];
```

## الوثائق ذات الصلة

- Module-Development - دليل الوحدة الكامل
- Module-Structure - هيكل الدليل
- Block-Development - إنشاء الكتل
- Database-Operations - إعداد قاعدة البيانات
