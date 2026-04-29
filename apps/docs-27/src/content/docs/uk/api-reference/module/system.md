---
title: "Модульна система XOOPS"
description: "Життєвий цикл модуля, клас XoopsModule, модуль installation/uninstallation, перехоплення модулів і керування модулями"
---
Модульна система XOOPS забезпечує повну структуру для розробки, встановлення, керування та розширення функціональних можливостей модулів. Модулі — це автономні пакети, які розширюють XOOPS додатковими функціями та можливостями.

## Архітектура модуля
```mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```
## Структура модуля

Стандартна структура каталогу модуля XOOPS:
```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```
## Клас модуля Xoops

Клас XoopsModule представляє встановлений модуль XOOPS.

### Огляд класу
```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```
### Властивості

| Власність | Тип | Опис |
|----------|------|-------------|
| `$moduleid` | int | Унікальний ID модуля |
| `$name` | рядок | Відображуване ім'я модуля |
| `$dirname` | рядок | Назва каталогу модуля |
| `$version` | рядок | Поточна версія модуля |
| `$description` | рядок | Опис модуля |
| `$config` | масив | Конфігурація модуля |
| `$blocks` | масив | Модульні блоки |
| `$adminPages` | масив | Сторінки панелі адмін |
| `$userPages` | масив | Сторінки користувача |

### Конструктор
```php
public function __construct()
```
Створює новий екземпляр модуля та ініціалізує змінні.

### Основні методи

#### getName

Отримує відображуване ім'я модуля.
```php
public function getName(): string
```
**Повертає:** `string` – відображуване ім’я модуля

**Приклад:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```
#### getDirname

Отримує назву каталогу модуля.
```php
public function getDirname(): string
```
**Повертає:** `string` - назва каталогу модуля

**Приклад:**
```php
echo $module->getDirname(); // "publisher"
```
#### getVersion

Отримує поточну версію модуля.
```php
public function getVersion(): string
```
**Повертає:** `string` - рядок версії

**Приклад:**
```php
echo $module->getVersion(); // "2.1.0"
```
#### getDescription

Отримує опис модуля.
```php
public function getDescription(): string
```
**Повернення:** `string` - опис модуля

**Приклад:**
```php
$desc = $module->getDescription();
```
#### getConfig

Отримує конфігурацію модуля.
```php
public function getConfig(string $key = null): mixed
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ключ конфігурації (нульовий для всіх) |

**Повертає:** `mixed` - значення або масив конфігурації

**Приклад:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```
#### setConfig

Встановлює конфігурацію модуля.
```php
public function setConfig(string $key, mixed $value): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ключ конфігурації |
| `$value` | змішаний | Значення конфігурації |

**Приклад:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```
#### getPath

Отримує повний шлях файлової системи до модуля.
```php
public function getPath(): string
```
**Повертає:** `string` - абсолютний шлях до каталогу модуля

**Приклад:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```
#### getUrl

Отримує URL до модуля.
```php
public function getUrl(): string
```
**Повернення:** `string` - модуль URL

**Приклад:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```
## Процес встановлення модуля

### Функція xoops_module_install

Функція встановлення модуля, визначена в `xoops_version.php`:
```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$module` | XoopsModule | Модуль, що встановлюється |

**Повертає:** `bool` - True у разі успіху, false у разі невдачі

**Приклад:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```
### Функція xoops_module_uninstall

Функція видалення модуля:
```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```
**Приклад:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```
## Гачки модулів

Гачки модулів дозволяють модулям інтегруватися з іншими модулями та системою.

### Оголошення хука

У `xoops_version.php`:
```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```
### Реалізація гака
```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```
### Доступні системні хуки

| Гачок | Параметри | Опис |
|------|-----------|-------------|
| `system.page.header` | Жодного | Виведення заголовка сторінки |
| `system.page.footer` | Жодного | Виведення нижнього колонтитула сторінки |
| `user.login.success` | Об'єкт $user | Після входу користувача |
| `user.logout` | Об'єкт $user | Після виходу користувача |
| `user.profile.view` | $user_id | Перегляд профілю користувача |
| `module.install` | Об'єкт $module | Установка модуля |
| `module.uninstall` | Об'єкт $module | Видалення модуля |

## Служба диспетчера модулів

Служба ModuleManager обробляє операції модуля.

### Методи

#### getModule

Отримує модуль за назвою.
```php
public function getModule(string $dirname): ?XoopsModule
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$dirname` | рядок | Назва каталогу модуля |

**Повертає:** `?XoopsModule` - екземпляр модуля або null

**Приклад:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```
#### getAllModules

Отримує всі встановлені модулі.
```php
public function getAllModules(bool $activeOnly = true): array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$activeOnly` | bool | Повертати лише активні модулі |

**Повертає:** `array` – масив об’єктів XoopsModule

**Приклад:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```
#### isModuleActive

Перевіряє, чи активний модуль.
```php
public function isModuleActive(string $dirname): bool
```
**Приклад:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```
#### activateModule

Активує модуль.
```php
public function activateModule(string $dirname): bool
```
**Приклад:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```
#### деактивувати модуль

Дезактивує модуль.
```php
public function deactivateModule(string $dirname): bool
```
**Приклад:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```
## Конфігурація модуля (xoops_version.php)

Повний приклад маніфесту модуля:
```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```
## Найкращі практики

1. **Простір імен Ваші класи** - Використовуйте простори імен для окремих модулів, щоб уникнути конфліктів

2. **Використовуйте обробники** - завжди використовуйте класи обробників для операцій з базою даних

3. **Інтернаціоналізація вмісту** - Використовуйте мовні константи для всіх призначених для користувача рядків

4. **Створіть сценарії встановлення** – надайте схеми SQL для таблиць бази даних

5. **Документні гачки** - чітко задокументуйте, які гачки надає ваш модуль

6. **Версія вашого модуля** - збільшуйте номери версій з випусками

7. **Тестова інсталяція** - Ретельно протестуйте процеси install/uninstall

8. **Обробляти дозволи** - перевірте дозволи користувача, перш ніж дозволяти дії

## Повний приклад модуля
```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```
## Пов'язана документація

- ../Kernel/Kernel-Classes - Ініціалізація ядра та основні служби
- ../Template/Template-System - Шаблони модулів і інтеграція тем
- ../Database/QueryBuilder - Побудова запитів до бази даних
- ../Core/XoopsObject - Базовий клас об'єктів

---

*Див. також: [XOOPS Посібник із розробки модуля](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*