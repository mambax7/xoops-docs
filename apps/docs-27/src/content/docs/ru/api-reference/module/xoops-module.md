---
title: "Класс XoopsModule"
description: "Представляет модуль XOOPS с метаинформацией и управлением"
---

Класс `XoopsModule` представляет модуль в системе XOOPS, хранит его метаинформацию и управляет его состоянием.

## Обзор класса

```php
namespace Xoops;

class XoopsModule extends XoopsObject
{
    protected $dirname;
    protected $name;
    protected $version;
    protected $author;
    protected $status;
}
```

## Основные методы

### getVar

Получает значение свойства модуля.

```php
$name = $module->getVar('name');
$version = $module->getVar('version');
$dirname = $module->getVar('dirname');
```

### setVar

Устанавливает значение свойства модуля.

```php
$module->setVar('name', 'Новый модуль');
$module->setVar('version', '2.0');
```

### isActive

Проверяет, активен ли модуль.

```php
if ($module->isActive()) {
    // Модуль активен
}
```

## Использование

```php
$handler = xoops_getHandler('module');
$module = $handler->getByDirname('news');

if ($module && $module->isActive()) {
    echo 'Модуль: ' . $module->getVar('name');
    echo 'Версия: ' . $module->getVar('version');
}
```

## Связанная документация

- ../Core/XoopsObject - Базовый класс объекта
- System - Система управления модулями

---

*Класс XoopsModule использует объектную модель XOOPS для представления модулей.*
