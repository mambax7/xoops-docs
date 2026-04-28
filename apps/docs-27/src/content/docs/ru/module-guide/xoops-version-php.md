---
title: "xoops_version.php - Манифест модуля"
---

## Обзор

Файл `xoops_version.php` - это сердце каждого модуля XOOPS. Он определяет метаданные модуля, таблицы базы данных, шаблоны, блоки, параметры конфигурации и хуки установки.

## Базовая структура

```php
<?php
/**
 * Файл манифеста модуля
 */

$modversion = [
    // Идентичность модуля
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

    // Изображения
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // Системные настройки
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

## Полный справочник

### Идентичность модуля

| Ключ | Тип | Описание |
|-----|------|-------------|
| `name` | string | Отображаемое имя (используйте языковую константу) |
| `version` | string | Семантическая версия (MAJOR.MINOR.PATCH) |
| `description` | string | Описание модуля |
| `author` | string | Имя основного автора |
| `credits` | string | Дополнительные соавторы |
| `license` | string | Название лицензии |
| `dirname` | string | Имя директории модуля |

### Таблицы базы данных

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### Шаблоны

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
    'options'     => '10|0',  // опции по умолчанию
    'can_clone'   => true,
];
```

### Параметры конфигурации

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

### Типы форм

| formtype | valuetype | Описание |
|----------|-----------|-------------|
| `textbox` | `text`/`int` | Однострочный ввод |
| `textarea` | `text` | Многострочный ввод |
| `yesno` | `int` | Радиокнопка Да/Нет |
| `select` | `text` | Выпадающий список |
| `select_multi` | `array` | Множественный выбор |
| `group` | `int` | Селектор группы |
| `group_multi` | `array` | Селектор множественной группы |
| `user` | `int` | Селектор пользователя |
| `color` | `text` | Средство выбора цвета |
| `hidden` | `text` | Скрытое поле |

### Элементы меню

```php
// Главное меню
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

### Хуки установки

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### Интеграция поиска

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### Интеграция комментариев

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### Уведомления

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

## Связанная документация

- Module-Development - Полное руководство модуля
- Module-Structure - Структура директории
- Block-Development - Создание блоков
- Database-Operations - Настройка базы данных
