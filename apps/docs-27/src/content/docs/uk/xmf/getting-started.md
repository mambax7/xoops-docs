---
title: "Початок роботи з XMF"
description: "Встановлення, основні концепції та перші кроки з XOOPS Module Framework"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Цей посібник охоплює основні поняття XOOPS Module Framework (XMF) і те, як почати використовувати його у своїх модулях.

## Передумови

- XOOPS 2.5.8 або новіша версія
- PHP 7.2 або новіша версія
- Базове розуміння PHP об’єктно-орієнтованого програмування

## Розуміння просторів імен

XMF використовує простори імен PHP для організації своїх класів і уникнення конфліктів імен. Усі класи XMF знаходяться в просторі імен `XMF`.

### Глобальна космічна проблема

Без просторів імен усі класи PHP спільно використовують глобальний простір. Це може спричинити конфлікти:
```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```
### Рішення про простори імен

Простори імен створюють ізольовані контексти імен:
```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```
### Використання XMF просторів імен

Ви можете посилатися на класи XMF кількома способами:

**Повний шлях до простору імен:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```
**З інструкцією про використання:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```
**Кілька імпортів:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```
## Автозавантаження

Однією з найбільших зручностей XMF є автоматичне завантаження класів. Вам ніколи не потрібно вручну включати файли класу XMF.

### Традиційний XOOPS Завантаження

Старий спосіб вимагав явного завантаження:
```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```
### XMF Автозавантаження

З XMF класи завантажуються автоматично при посиланні:
```php
$input = Xmf\Request::getString('input', '');
```
Або з оператором використання:
```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```
Автозавантажувач відповідає стандарту [PSR-4](http://www.php-fig.org/psr/psr-4/), а також керує залежностями, на які покладається XMF.

## Основні приклади використання

### Введення запиту на читання
```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```
### Використання помічника модулів
```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```
### Шлях і URL Помічники
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```
## Налагодження за допомогою XMF

XMF надає корисні інструменти налагодження:
```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```
Вихідні дані налагодження можна згорнути й відображати об’єкти та масиви в зручному для читання форматі.

## Рекомендація щодо структури проекту

Під час створення модулів на основі XMF упорядкуйте свій код:
```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```
## Загальний шаблон включення

Типова точка входу в модуль:
```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```
## Наступні кроки

Тепер, коли ви розумієте основи, дослідіть:

- XMF-Запит - Детальна документація обробки запиту
- XMF-Module-Helper - Повна довідка про допоміжний модуль
- ../Recipes/Permission-Helper - Керування дозволами користувача
- ../Recipes/Module-Admin-Pages - Створення інтерфейсів адміністратора

## Дивіться також

- ../XMF-Framework - Огляд фреймворку
- ../Reference/JWT - JSON Підтримка веб-токенів
- ../Reference/Database - Утиліти бази даних

---

#XMF #початок роботи #простори імен #автозавантаження #основи