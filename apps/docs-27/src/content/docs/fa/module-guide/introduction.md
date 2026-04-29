---
title: "توسعه ماژول"
description: "راهنمای جامع توسعه ماژول های XOOPS با استفاده از شیوه های مدرن PHP"
---
این بخش مستندات جامعی را برای توسعه ماژول های XOOPS با استفاده از شیوه های مدرن PHP، الگوهای طراحی و بهترین شیوه ها ارائه می دهد.

## بررسی اجمالی

توسعه ماژول XOOPS در طول سال ها به طور قابل توجهی تکامل یافته است. اهرم ماژول های مدرن:

- ** معماری MVC ** - جداسازی تمیز نگرانی ها
- **ویژگی های PHP 8.x** - اعلان ها، ویژگی ها، آرگومان های نامگذاری شده را تایپ کنید
- ** الگوهای طراحی ** - مخزن، DTO، الگوهای لایه سرویس
- **تست ** - PHPUnit با شیوه های آزمایش مدرن
- ** چارچوب XMF ** - ابزارهای فریم ورک ماژول XOOPS

## ساختار اسناد و مدارک

### آموزش

راهنمای گام به گام برای ساخت ماژول های XOOPS از ابتدا.

- Tutorials/Hello-World-Module - اولین ماژول XOOPS شما
- Tutorials/Building-a-CRUD-Module - عملکرد کامل ایجاد، خواندن، به‌روزرسانی، حذف

### الگوهای طراحی

الگوهای معماری مورد استفاده در توسعه ماژول XOOPS مدرن.

- Patterns/MVC-Pattern - معماری Model-View-Controller
- Patterns/Repository-Pattern - انتزاع دسترسی به داده
- Patterns/DTO-Pattern - اشیاء انتقال داده برای جریان داده های تمیز

### بهترین شیوه ها

دستورالعمل هایی برای نوشتن کد قابل نگهداری و با کیفیت بالا.

- Best-Practices/Clean-Code - اصول کد پاک برای XOOPS
- Best-Practices/Code-Smells - ضد الگوهای رایج و نحوه رفع آنها
- Best-Practices/Testing - استراتژی های تست واحد PHPU

### مثالها

نمونه های تحلیل و پیاده سازی ماژول در دنیای واقعی

- ناشر-ماژول-تحلیل - شیرجه عمیق به ماژول ناشر

## ساختار دایرکتوری ماژول

یک ماژول XOOPS به خوبی سازماندهی شده از این ساختار دایرکتوری پیروی می کند:

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

## فایل های کلیدی توضیح داده شده است

### xoops_version.php

The module definition file that tells XOOPS درباره ماژول شما:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Common Include File

یک فایل بوت استرپ مشترک برای ماژول خود ایجاد کنید:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## مورد نیاز نسخه PHP

ماژول‌های XOOPS مدرن باید PHP 8.0 یا بالاتر را برای اهرم هدف قرار دهند:

- **تبلیغ املاک سازنده**
- **استدلال های نامگذاری شده**
- **انواع اتحادیه**
- **عبارات مطابقت **
- **ویژگی ها**
- **اپراتور Nullsafe**

## شروع به کار

1. با آموزش Tutorials/Hello-World-Module شروع کنید
2. پیشرفت به Tutorials/Building-a-CRUD-Module
3. Patterns/MVC-Pattern را برای راهنمایی معماری مطالعه کنید
4. روش های Best-Practices/Clean-Code را در سراسر جهان اعمال کنید
5. Best-Practices/Testing را از ابتدا پیاده سازی کنید

## منابع مرتبط

- ../05-XMF-Framework/XMF-Framework - ابزارهای XOOPS Module Framework
- Database-Operations - کار با پایگاه داده XOOPS
- ../04-API-Reference/Template/Template-System - قالب هوشمند در XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - ایمن کردن ماژول شما

## تاریخچه نسخه

| نسخه | تاریخ | تغییرات |
|---------|------|---------|
| 1.0 | 2025-01-28 | مستندات اولیه |