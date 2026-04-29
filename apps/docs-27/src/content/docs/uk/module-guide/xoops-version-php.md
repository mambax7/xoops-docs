---
title: "xoops_version.php - Маніфест модуля"
---
## Огляд

Файл `xoops_version.php` є основою кожного модуля XOOPS. Він визначає метадані модуля, таблиці бази даних, шаблони, блоки, параметри конфігурації та перехоплювачі встановлення.

## Базова структура
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
## Повна довідка

### Ідентифікація модуля

| Ключ | Тип | Опис |
|-----|------|-------------|
| `name` | рядок | Відображуване ім'я (використовуйте константу мови) |
| `version` | рядок | Семантична версія (MAJOR.MINOR.PATCH) |
| `description` | рядок | Опис модуля |
| `author` | рядок | Ім'я основного автора |
| `credits` | рядок | Додаткові учасники |
| `license` | рядок | Назва ліцензії |
| `dirname` | рядок | Назва каталогу модуля |

### Таблиці бази даних
```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```
### Шаблони
```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```
### Блоки
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
### Параметри конфігурації
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
### Типи форм

| тип форми | значення типу | Опис |
|----------|-----------|------------|
| `textbox` | `text`/`int` | Однорядковий вхід |
| `textarea` | `text` | Багаторядкове введення |
| `yesno` | `int` | Yes/No радіо |
| `select` | `text` | Виберіть у розкривному списку |
| `select_multi` | `array` | Множинний вибір |
| `group` | `int` | Селектор групи |
| `group_multi` | `array` | Багатогруповий селектор |
| `user` | `int` | Селектор користувача |
| `color` | `text` | Вибір кольору |
| `hidden` | `text` | Приховане поле |

### Пункти меню
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
### Інсталяційні хуки
```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```
### Інтеграція пошуку
```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```
### Інтеграція коментарів
```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```
### Сповіщення
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
## Пов'язана документація

- Розробка модулів - повний посібник з модуля
- Структура модуля - Структура каталогу
- Block-Development - Створення блоків
- Database-Operations - Налаштування бази даних