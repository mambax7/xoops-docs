---
title: "Разработка модулей"
description: "Полное руководство по разработке модулей XOOPS с использованием современных практик PHP"
---

В этом разделе представлена полная документация по разработке модулей XOOPS с использованием современных практик PHP, паттернов проектирования и лучших практик.

## Обзор

Разработка модулей XOOPS значительно эволюционировала на протяжении многих лет. Современные модули используют:

- **MVC-архитектура** - Четкое разделение ответственности
- **Функции PHP 8.x** - Объявления типов, атрибуты, именованные аргументы
- **Паттерны проектирования** - Паттерны Repository, DTO, Service Layer
- **Тестирование** - PHPUnit с современными практиками тестирования
- **Фреймворк XMF** - Утилиты XOOPS Module Framework

## Структура документации

### Учебные материалы

Пошаговые руководства по созданию модулей XOOPS с нуля.

- Tutorials/Hello-World-Module - Ваш первый модуль XOOPS
- Tutorials/Building-a-CRUD-Module - Полная функциональность Create, Read, Update, Delete

### Паттерны проектирования

Архитектурные паттерны, используемые в современной разработке модулей XOOPS.

- Patterns/MVC-Pattern - Архитектура Model-View-Controller
- Patterns/Repository-Pattern - Абстракция доступа к данным
- Patterns/DTO-Pattern - Data Transfer Objects для чистого потока данных

### Лучшие практики

Рекомендации по написанию удобного в обслуживании и качественного кода.

- Best-Practices/Clean-Code - Принципы чистого кода для XOOPS
- Best-Practices/Code-Smells - Распространенные антипаттерны и способы их устранения
- Best-Practices/Testing - Стратегии тестирования PHPUnit

### Примеры

Анализ реальных модулей и примеры реализации.

- Publisher-Module-Analysis - Глубокий анализ модуля Publisher

## Структура директории модуля

Хорошо организованный модуль XOOPS следует этой структуре директорий:

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

## Основные файлы объяснены

### xoops_version.php

Файл определения модуля, который сообщает XOOPS о вашем модуле:

```php
<?php
$modversion = [];

// Основная информация
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Флаги модуля
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Конфигурация администратора
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// База данных
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Шаблоны
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Блоки
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Предпочтения модуля
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Общий файл подключения

Создайте общий файл начальной загрузки для вашего модуля:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Константы модуля
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Автозагрузка классов
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Требования к версии PHP

Современные модули XOOPS должны быть ориентированы на PHP 8.0 или выше для использования:

- **Constructor Property Promotion**
- **Named Arguments**
- **Union Types**
- **Match Expressions**
- **Attributes**
- **Nullsafe Operator**

## Начало работы

1. Начните с учебного материала Tutorials/Hello-World-Module
2. Переходите к Tutorials/Building-a-CRUD-Module
3. Изучите Patterns/MVC-Pattern для получения рекомендаций по архитектуре
4. Применяйте практики Best-Practices/Clean-Code во всем
5. Внедрите Best-Practices/Testing с самого начала

## Связанные ресурсы

- ../05-XMF-Framework/XMF-Framework - Утилиты XOOPS Module Framework
- Database-Operations - Работа с базой данных XOOPS
- ../04-API-Reference/Template/Template-System - Система Smarty-шаблонизации в XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - Безопасность вашего модуля

## История версий

| Версия | Дата | Изменения |
|---------|------|---------|
| 1.0 | 2025-01-28 | Начальная документация |
