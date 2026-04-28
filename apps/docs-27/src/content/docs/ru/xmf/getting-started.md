---
title: "Начало работы с XMF"
description: "Установка, базовые концепции и первые шаги с фреймворком модулей XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Это руководство охватывает фундаментальные концепции фреймворка модулей XOOPS (XMF) и как начать его использовать в ваших модулях.

## Предварительные требования

- XOOPS 2.5.8 или позже установлен
- PHP 7.2 или позже
- Базовое понимание объектно-ориентированного программирования PHP

## Понимание пространств имен

XMF использует PHP пространства имен для организации своих классов и избежания конфликтов имен. Все классы XMF находятся в пространстве имен `Xmf`.

### Проблема глобального пространства

Без пространств имен все PHP классы делят глобальное пространство. Это может привести к конфликтам:

```php
<?php
// Это будет конфликтовать с встроенным ArrayObject PHP
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Фатальная ошибка: Cannot redeclare class ArrayObject
```

### Решение пространств имен

Пространства имен создают изолированные контексты именования:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Нет конфликта - это \MyNamespace\ArrayObject
```

### Использование пространств имен XMF

Вы можете ссылаться на классы XMF несколькими способами:

**Полный путь пространства имен:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**С оператором use:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Множественные импорты:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Автозагрузка

Одна из самых больших удобств XMF - автоматическая загрузка классов. Вам никогда не нужно вручную включать файлы классов XMF.

### Традиционная загрузка XOOPS

Старый способ требовал явной загрузки:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### Автозагрузка XMF

С XMF классы загружаются автоматически при упоминании:

```php
$input = Xmf\Request::getString('input', '');
```

Или с оператором use:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Автозагрузчик следует стандарту [PSR-4](http://www.php-fig.org/psr/psr-4/) и также управляет зависимостями, на которые полагается XMF.

## Примеры базового использования

### Чтение входных данных запроса

```php
use Xmf\Request;

// Получить целочисленное значение с значением по умолчанию 0
$id = Request::getInt('id', 0);

// Получить строковое значение с пустой строкой по умолчанию
$title = Request::getString('title', '');

// Получить команду (буквенно-цифровая, нижний регистр)
$op = Request::getCmd('op', 'list');

// Получить электронную почту с валидацией
$email = Request::getEmail('email', '');

// Получить из конкретного хэша (POST, GET и т.д.)
$formData = Request::getString('data', '', 'POST');
```

### Использование помощника модулей

```php
use Xmf\Module\Helper;

// Получить помощника для вашего модуля
$helper = Helper::getHelper('mymodule');

// Прочитать конфигурацию модуля
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Доступ к объекту модуля
$module = $helper->getModule();
$version = $module->getVar('version');

// Получить обработчик
$itemHandler = $helper->getHandler('items');

// Загрузить файл языка
$helper->loadLanguage('admin');

// Проверить, если текущий модуль
if ($helper->isCurrentModule()) {
    // Мы находимся в страницах этого модуля
}

// Проверить права администратора
if ($helper->isUserAdmin()) {
    // У пользователя есть доступ администратора
}
```

### Помощники путей и URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Получить URL модуля
$moduleUrl = $helper->url('images/logo.png');
// Возвращает: https://example.com/modules/mymodule/images/logo.png

// Получить путь модуля
$modulePath = $helper->path('templates/view.tpl');
// Возвращает: /var/www/html/modules/mymodule/templates/view.tpl

// Пути загрузки
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Отладка с XMF

XMF предоставляет полезные инструменты отладки:

```php
// Дамп переменной с красивым форматированием
\Xmf\Debug::dump($myVariable);

// Дамп нескольких переменных
\Xmf\Debug::dump($var1, $var2, $var3);

// Дамп данных POST
\Xmf\Debug::dump($_POST);

// Показать трассу стека
\Xmf\Debug::backtrace();
```

Вывод отладки сворачиваемый и отображает объекты и массивы в легко читаемом формате.

## Рекомендуемая структура проекта

При построении модулей на основе XMF организуйте ваш код:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Опциональный пользовательский помощник
    ItemHandler.php     # Ваши обработчики
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

## Общий паттерн включения

Типичная точка входа модуля:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Получить операцию из запроса
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Включить заголовок XOOPS
require_once XOOPS_ROOT_PATH . '/header.php';

// Логика вашего модуля здесь
switch ($op) {
    case 'view':
        // Обработать просмотр
        break;
    case 'list':
    default:
        // Обработать список
        break;
}

// Включить подвал XOOPS
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Следующие шаги

Теперь, когда вы поняли основы, исследуйте:

- XMF-Request - Детальная документация обработки запросов
- XMF-Module-Helper - Полный справочник помощника модулей
- ../Recipes/Permission-Helper - Управление разрешениями пользователей
- ../Recipes/Module-Admin-Pages - Построение административных интерфейсов

## Также см.

- ../XMF-Framework - Обзор фреймворка
- ../Reference/JWT - Поддержка JSON Web Token
- ../Reference/Database - Утилиты базы данных

---

#xmf #getting-started #namespaces #autoloading #basics
