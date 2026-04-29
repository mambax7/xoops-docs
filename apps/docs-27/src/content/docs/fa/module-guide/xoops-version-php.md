---
title: "xoops_version.php - Module Manifest"
---
## بررسی اجمالی

فایل `xoops_version.php` قلب هر ماژول XOOPS است. فراداده ماژول، جداول پایگاه داده، قالب ها، بلوک ها، گزینه های پیکربندی و قلاب های نصب را تعریف می کند.

## ساختار اساسی

```php
<?php
/**
 * Module manifest file
 */

$modversion = [
    // Module identity
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

    // Images
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // System settings
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

## مرجع کامل

### هویت ماژول

| کلید | نوع | توضیحات |
|-----|------|-------------|
| `name` | رشته | نام نمایشی (استفاده از ثابت زبان) |
| `version` | رشته | نسخه معنایی (MAJOR.MINOR.PATCH) |
| `description` | رشته | توضیحات ماژول |
| `author` | رشته | نام نویسنده اصلی |
| `credits` | رشته | مشارکت کنندگان اضافی |
| `license` | رشته | نام مجوز |
| `dirname` | رشته | نام دایرکتوری ماژول |

### جداول پایگاه داده

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### الگوها

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

### بلوک

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

### گزینه های پیکربندی

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

### انواع فرم

| نوع فرم | نوع ارزش | توضیحات |
|----------|----------|-------------|
| `textbox` | `text`/`int` | ورودی تک خطی |
| `textarea` | `text` | ورودی چند خطی |
| `yesno` | `int` | رادیو Yes/No |
| `select` | `text` | کشویی را انتخاب کنید |
| `select_multi` | `array` | چند انتخابی |
| `group` | `int` | انتخابگر گروه |
| `group_multi` | `array` | انتخابگر چند گروهی |
| `user` | `int` | انتخابگر کاربر |
| `color` | `text` | انتخابگر رنگ |
| `hidden` | `text` | فیلد پنهان |

### آیتم های منو

```php
// Main menu
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

### قلاب های نصب

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### یکپارچه سازی جستجو

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### ادغام نظرات

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### اطلاعیه ها

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

## مستندات مرتبط

- ماژول-توسعه - راهنمای کامل ماژول
- ماژول-ساختار - ساختار دایرکتوری
- بلوک توسعه - ایجاد بلوک
- پایگاه داده-عملیات - راه اندازی پایگاه داده