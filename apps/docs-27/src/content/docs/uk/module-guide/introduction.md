---
title: "Розробка модуля"
description: "Вичерпний посібник із розробки модулів XOOPS з використанням сучасних практик PHP"
---
У цьому розділі міститься вичерпна документація для розробки модулів XOOPS з використанням сучасних практик PHP, шаблонів проектування та найкращих практик.

## Огляд

З роками розробка модулів XOOPS значно розвинулася. Сучасні модулі використовують:

- **Архітектура MVC** - Чітке розділення проблем
- **PHP 8.x Features** - Оголошення типів, атрибути, іменовані аргументи
- **Шаблони проектування** - Репозиторій, DTO, Шаблони рівня обслуговування
- **Тестування** - PHPUnit із сучасними методами тестування
- **XMF Framework** - XOOPS Module Framework утиліти

## Структура документації

### Підручники

Покрокові інструкції зі створення модулів XOOPS з нуля.

- Tutorials/Hello-World-Module - Ваш перший модуль XOOPS
- Tutorials/Building-a-CRUD-Module - повна функція створення, читання, оновлення та видалення

### Патерни проектування

Архітектурні шаблони, що використовуються в сучасній розробці модуля XOOPS.

- Patterns/MVC-Pattern - Архітектура Model-View-Controller
- Patterns/Repository-Pattern - Абстракція доступу до даних
- Patterns/DTO-Pattern - Об'єкти передачі даних для чистого потоку даних

### Найкращі практики

Інструкції з написання супроводжуваного високоякісного коду.

- Best-Practices/Clean-Code - принципи чистого коду для XOOPS
- Best-Practices/Code-Smells - Загальні антишаблони та способи їх усунення
- Best-Practices/Testing - Стратегії тестування PHPUnit

### Приклади

Реальний аналіз модулів і приклади впровадження.

- Publisher-Module-Analysis - Глибоке занурення в модуль Publisher

## Структура каталогу модулів

Добре організований модуль XOOPS має таку структуру каталогу:
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
## Пояснення ключових файлів

### xoops_version.php

Файл визначення модуля, який повідомляє XOOPS про ваш модуль:
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
### Загальний файл включення

Створіть загальний файл початкового завантаження для вашого модуля:
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
## PHP Вимоги до версії

Сучасні модулі XOOPS мають орієнтуватися на PHP 8.0 або вище, щоб використовувати:

- **Просування нерухомості будівельників**
- **Іменовані аргументи**
- **Типи союзів**
- **Збіг виразів**
- **Атрибути**
- **Оператор Nullsafe**

## Початок роботи

1. Почніть із підручника Tutorials/Hello-World-Module
2. Перехід до Tutorials/Building-a-CRUD-Module
3. Вивчіть Patterns/MVC-Pattern для отримання вказівок щодо архітектури
4. Застосовуйте практики Best-Practices/Clean-Code у всьому
5. Впровадити Best-Practices/Testing з самого початку

## Пов'язані ресурси

- ../05-XMF-Framework/XMF-Framework - XOOPS Утиліти Module Framework
- Database-Operations - Робота з базою даних XOOPS
- ../04-API-Reference/Template/Template-System - Smarty шаблонування в XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Захист вашого модуля

## Історія версій

| Версія | Дата | Зміни |
|---------|------|---------|
| 1,0 | 2025-01-28 | Вихідна документація |