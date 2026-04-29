---
title: "Модуль Hello World"
description: "Покроковий посібник зі створення вашого першого модуля XOOPS"
---
# Підручник модуля Hello World

Цей посібник допоможе вам створити свій перший модуль XOOPS. Наприкінці у вас буде робочий модуль, який відображає «Hello World» як у інтерфейсі, так і в адмінобласті.

## Передумови

- XOOPS 2.5.x встановлено та працює
- PHP 8.0 або вище
- Базові знання PHP
- Текстовий редактор або IDE (рекомендується PhpStorm)

## Крок 1: Створіть структуру каталогу

Створіть таку структуру каталогів у `/modules/helloworld/`:
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
## Крок 2: Створіть визначення модуля

Створити `xoops_version.php`:
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
## Крок 3: Створення мовних файлів

### modinfo.php (Інформація про модуль)

Створити `language/english/modinfo.php`:
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
### main.php (мова інтерфейсу)

Створити `language/english/main.php`:
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
### admin.php (мова адміністратора)

Створити `language/english/admin.php`:
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
## Крок 4: Створіть зовнішній індекс

Створіть `index.php` у корені модуля:
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
## Крок 5: Створіть шаблон інтерфейсу

Створити `templates/helloworld_index.tpl`:
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
## Крок 6: Створіть файли адміністратора

### Заголовок адміністратора

Створити `admin/admin_header.php`:
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
### Нижній колонтитул адміністратора

Створити `admin/admin_footer.php`:
```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```
### Меню адміністратора

Створити `admin/menu.php`:
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
### Індексна сторінка адміністратора

Створити `admin/index.php`:
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
## Крок 7: Створіть шаблон адміністратора

Створити `templates/admin/helloworld_admin_index.tpl`:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## Крок 8: Створіть логотип модуля

Створіть або скопіюйте зображення PNG (рекомендований розмір: 92x92 пікселів) у:
`assets/images/logo.png`

Ви можете використовувати будь-який редактор зображень, щоб створити простий логотип, або використати заповнювач із сайту, наприклад placeholder.com.

## Крок 9: Встановіть модуль

1. Увійдіть на свій сайт XOOPS як адміністратор
2. Перейдіть до **Системний адміністратор** > **Модулі**
3. У списку доступних модулів знайдіть «Hello World».
4. Натисніть кнопку **Встановити**
5. Підтвердьте встановлення

## Крок 10: Перевірте свій модуль

### Тест інтерфейсу

1. Перейдіть на свій сайт XOOPS
2. Натисніть «Hello World» у головному меню
3. Ви повинні побачити вітальне повідомлення та поточний час

### Тест адміністратора

1. Перейдіть в адмінку
2. Натисніть «Hello World» в меню адміністратора
3. Ви повинні побачити інформаційну панель адміністратора

## Усунення несправностей

### Модуль не відображається в списку встановлення

- Перевірити права доступу до файлів (755 для каталогів, 644 для файлів)
- Переконайтеся, що `xoops_version.php` не має синтаксичних помилок
— Очистити кеш XOOPS

### Шаблон не завантажується

- Переконайтеся, що файли шаблонів знаходяться у правильному каталозі
- Перевірте, чи збігаються імена файлів шаблонів із `xoops_version.php`
- Переконайтеся, що синтаксис Smarty правильний

### Мовні рядки не відображаються

— Перевірте шляхи до мовних файлів
- Переконайтеся, що константи мови визначені
- Перевірте наявність папки з правильною мовою

## Наступні кроки

Тепер, коли у вас є робочий модуль, продовжуйте навчання за допомогою:

- Building-a-CRUD-Module - Додавання функцій бази даних
- ../Patterns/MVC-Pattern - Упорядкуйте свій код належним чином
- ../Best-Practices/Testing - Додано тести PHPUnit

## Повне посилання на файл

Ваш завершений модуль повинен містити такі файли:
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

Щиро вітаю! Ви створили свій перший модуль XOOPS. Основні поняття, що розглядаються:

1. **Структура модуля** - стандартний макет каталогу модулів XOOPS
2. **xoops_version.php** - Визначення та налаштування модуля
3. **Мовні файли** - підтримка інтернаціоналізації
4. **Шаблони** - інтеграція шаблону Smarty
5. **Інтерфейс адміністратора** - базова панель адміністратора

Дивіться також: ../Module-Development | Збірка-модуля-CRUD | ../Patterns/MVC-Pattern