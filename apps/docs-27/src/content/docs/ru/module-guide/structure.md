---
title: "Структура модуля"
---

## Обзор

Хорошо организованная структура модуля является основой поддерживаемой разработки XOOPS. Это руководство охватывает как устаревшие, так и современные (PSR-4) макеты модулей.

## Стандартный макет модуля

### Устаревшая структура

```
modules/mymodule/
├── admin/                      # Файлы панели администратора
│   ├── index.php              # Панель управления администратора
│   ├── menu.php               # Определение меню администратора
│   ├── permissions.php        # Управление разрешениями
│   └── templates/             # Шаблоны администратора
├── assets/                     # Ресурсы фронтенда
│   ├── css/
│   ├── js/
│   └── images/
├── class/                      # PHP классы
│   ├── Common/                # Общие утилиты
│   │   ├── Breadcrumb.php
│   │   └── Configurator.php
│   ├── Form/                  # Пользовательские элементы формы
│   └── Handler/               # Обработчики объектов
├── include/                    # Файлы подключения
│   ├── common.php             # Общая инициализация
│   ├── functions.php          # Вспомогательные функции
│   ├── oninstall.php          # Хуки установки
│   ├── onupdate.php           # Хуки обновления
│   └── onuninstall.php        # Хуки удаления
├── language/                   # Переводы
│   ├── english/
│   │   ├── admin.php          # Строки администратора
│   │   ├── main.php           # Строки фронтенда
│   │   ├── modinfo.php        # Строки информации модуля
│   │   └── help/              # Справочные файлы
│   └── other_language/
├── sql/                        # Схемы базы данных
│   └── mysql.sql              # Схема MySQL
├── templates/                  # Шаблоны Smarty
│   ├── admin/
│   └── blocks/
├── blocks/                     # Функции блоков
├── preloads/                   # Классы предварительной загрузки
├── xoops_version.php          # Манифест модуля
├── header.php                 # Заголовок модуля
├── footer.php                 # Подвал модуля
└── index.php                  # Главная точка входа
```

### Современная структура PSR-4

```
modules/mymodule/
├── src/                        # Исходный код с автозагрузкой PSR-4
│   ├── Controller/            # Обработчики запросов
│   │   ├── ArticleController.php
│   │   └── CategoryController.php
│   ├── Service/               # Бизнес-логика
│   │   ├── ArticleService.php
│   │   └── CategoryService.php
│   ├── Repository/            # Доступ к данным
│   │   ├── ArticleRepository.php
│   │   └── ArticleRepositoryInterface.php
│   ├── Entity/                # Объекты домена
│   │   ├── Article.php
│   │   └── Category.php
│   ├── DTO/                   # Объекты передачи данных
│   │   ├── CreateArticleDTO.php
│   │   └── UpdateArticleDTO.php
│   ├── Event/                 # События домена
│   │   └── ArticleCreatedEvent.php
│   ├── Exception/             # Пользовательские исключения
│   │   └── ArticleNotFoundException.php
│   ├── ValueObject/           # Типы значений
│   │   └── ArticleId.php
│   └── Middleware/            # HTTP-промежуточное ПО
│       └── AuthenticationMiddleware.php
├── config/                     # Конфигурация
│   ├── routes.php             # Определения маршрутов
│   ├── services.php           # Конфиг контейнера DI
│   └── events.php             # Слушатели событий
├── migrations/                 # Миграции базы данных
│   ├── 001_create_articles.php
│   └── 002_add_indexes.php
├── tests/                      # Файлы тестов
│   ├── Unit/
│   └── Integration/
├── templates/                  # Шаблоны Smarty
├── language/                   # Переводы (JSON)
│   ├── en/
│   │   └── main.json
│   └── de/
├── assets/                     # Ресурсы фронтенда
├── module.json                 # Манифест модуля (XOOPS 4.0)
└── composer.json              # Конфиг Composer
```

## Основные файлы объяснены

### xoops_version.php (Манифест устаревшей версии)

```php
<?php
$modversion = [
    'name'           => 'My Module',
    'version'        => '1.0.0',
    'description'    => 'Module description',
    'author'         => 'Your Name',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0',
    'dirname'        => basename(__DIR__),
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',
    'image'          => 'assets/images/logo.png',

    // Система
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,

    // База данных
    'sqlfile'        => ['mysql' => 'sql/mysql.sql'],
    'tables'         => ['mymodule_items', 'mymodule_categories'],

    // Шаблоны
    'templates'      => [
        ['file' => 'mymodule_index.tpl', 'description' => 'Index page'],
        ['file' => 'mymodule_item.tpl', 'description' => 'Item detail'],
    ],

    // Блоки
    'blocks'         => [
        [
            'file'        => 'blocks/recent.php',
            'name'        => '_MI_MYMOD_BLOCK_RECENT',
            'description' => '_MI_MYMOD_BLOCK_RECENT_DESC',
            'show_func'   => 'mymodule_recent_show',
            'edit_func'   => 'mymodule_recent_edit',
            'template'    => 'mymodule_block_recent.tpl',
            'options'     => '5|0',
        ],
    ],

    // Конфиг
    'config'         => [
        [
            'name'        => 'items_per_page',
            'title'       => '_MI_MYMOD_ITEMS_PER_PAGE',
            'description' => '_MI_MYMOD_ITEMS_PER_PAGE_DESC',
            'formtype'    => 'textbox',
            'valuetype'   => 'int',
            'default'     => 10,
        ],
    ],
];
```

### module.json (Манифест XOOPS 4.0)

```json
{
    "name": "My Module",
    "slug": "mymodule",
    "version": "1.0.0",
    "description": "Module description",
    "author": "Your Name",
    "license": "GPL-2.0-or-later",
    "php": ">=8.2",

    "namespace": "XoopsModules\\MyModule",
    "autoload": "src/",

    "admin": {
        "menu": "config/admin-menu.php"
    },

    "routes": "config/routes.php",
    "services": "config/services.php",
    "events": "config/events.php",

    "templates": [
        {"file": "index.tpl", "description": "Index page"}
    ],

    "config": {
        "items_per_page": {
            "type": "int",
            "default": 10,
            "title": "@mymodule.config.items_per_page"
        }
    }
}
```

## Назначение директорий

| Директория | Назначение |
|-----------|---------|
| `admin/` | Интерфейс администрирования |
| `assets/` | CSS, JavaScript, изображения |
| `blocks/` | Функции отрисовки блоков |
| `class/` | PHP классы (устаревшие) |
| `config/` | Файлы конфигурации (современные) |
| `include/` | Общие файлы подключения |
| `language/` | Файлы переводов |
| `migrations/` | Миграции базы данных |
| `sql/` | Начальная схема базы данных |
| `src/` | Исходный код PSR-4 |
| `templates/` | Шаблоны Smarty |
| `tests/` | Файлы тестов |

## Лучшие практики

1. **Разделение ответственности** - Держите бизнес-логику отдельно от шаблонов
2. **Используйте пространства имен** - Организуйте код с правильным использованием пространств имен
3. **Следуйте PSR-4** - Используйте стандартные соглашения автозагрузки
4. **Вынесите конфиг** - Держите конфигурацию отдельно от кода
5. **Документируйте структуру** - Включите README, объясняющий организацию

## Связанная документация

- Module-Development - Полное руководство по разработке
- Best-Practices/Code-Organization - Паттерны организации кода
- Module Manifest - Конфигурация манифеста
- Database/Database-Schema - Проектирование базы данных
