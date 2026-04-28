---
title: "Руководство Hello World Module"
description: "Пошаговое руководство по созданию вашего первого модуля XOOPS"
---

# Руководство Hello World Module

Это руководство проведит вас через создание вашего первого модуля XOOPS. В конце вы будете иметь рабочий модуль, отображающий "Hello World" как на фронтенде, так и в области администратора.

## Предусловия

- Установленный и работающий XOOPS 2.5.x
- PHP 8.0 или выше
- Базовые знания PHP
- Текстовый редактор или IDE (PhpStorm рекомендуется)

## Шаг 1: Создайте структуру каталогов

Создайте следующую структуру каталогов в `/modules/helloworld/`:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Шаг 2: Создайте определение модуля

Создайте `xoops_version.php`:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## Шаг 3: Создайте файлы языков

### modinfo.php (Module Information)

Создайте `language/english/modinfo.php`:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (Frontend Language)

Создайте `language/english/main.php`:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Admin Language)

Создайте `language/english/admin.php`:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Шаг 4: Создайте индекс фронтенда

Создайте `index.php` в корне модуля:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## Шаг 5: Создайте шаблон фронтенда

Создайте `templates/helloworld_index.tpl`:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Шаг 6: Создайте файлы администратора

### Admin Header

Создайте `admin/admin_header.php`:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Admin Footer

Создайте `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Admin Menu

Создайте `admin/menu.php`:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Admin Index Page

Создайте `admin/index.php`:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## Шаг 7: Создайте шаблон администратора

Создайте `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Шаг 8: Создайте логотип модуля

Создайте или скопируйте PNG изображение (рекомендуемый размер: 92x92 пикселей) в:
`assets/images/logo.png`

Вы можете использовать любой редактор изображений для создания простого логотипа, или использовать заполнитель с сайта вроде placeholder.com.

## Шаг 9: Установите модуль

1. Логинитесь в вашем сайте XOOPS как администратор
2. Перейдите в **System Admin** > **Modules**
3. Найдите "Hello World" в списке доступных модулей
4. Нажмите на кнопку **Install**
5. Подтвердите установку

## Шаг 10: Тестируйте ваш модуль

### Тест фронтенда

1. Перейдите на ваш сайт XOOPS
2. Нажмите на "Hello World" в главном меню
3. Вы должны увидеть приветственное сообщение и текущее время

### Тест администратора

1. Перейдите в область администратора
2. Нажмите на "Hello World" в меню администратора
3. Вы должны увидеть панель администратора

## Устранение неполадок

### Модуль не появляется в списке установки

- Проверьте права доступа к файлам (755 для каталогов, 644 для файлов)
- Проверьте синтаксис `xoops_version.php`
- Очистите кэш XOOPS

### Шаблон не загружается

- Убедитесь, что файлы шаблонов в правильном каталоге
- Проверьте, что имена файлов шаблонов совпадают с указанными в `xoops_version.php`
- Проверьте синтаксис Smarty

### Строки языка не отображаются

- Проверьте пути файлов языков
- Убедитесь, что константы языка определены
- Проверьте, что существует правильный каталог языка

## Следующие шаги

Теперь, когда у вас есть рабочий модуль, продолжайте учиться с помощью:

- Building-a-CRUD-Module - Добавьте функциональность базы данных
- ../Patterns/MVC-Pattern - Организуйте ваш код правильно
- ../Best-Practices/Testing - Добавьте PHPUnit тесты

## Полная справка файлов

Ваш завершенный модуль должен иметь эти файлы:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Резюме

Поздравляем! Вы создали ваш первый модуль XOOPS. Ключевые концепции, которые были изучены:

1. **Module Structure** - Стандартная структура каталогов модуля XOOPS
2. **xoops_version.php** - Определение модуля и конфигурация
3. **Language Files** - Поддержка интернационализации
4. **Templates** - Интеграция шаблонов Smarty
5. **Admin Interface** - Базовая панель администратора

See also: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
