---
title: "Система модулей"
description: "Управление модулями и жизненный цикл модулей в XOOPS"
---

Система модулей XOOPS обеспечивает управление жизненным циклом модулей, включая загрузку, установку, активацию и удаление.

## Основные компоненты

### Загрузка модулей

Модули загружаются из директории modules системы.

```php
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('news');
```

### Активация модулей

```php
// Модуль должен быть активирован администратором
if ($module->isActive()) {
    // Использовать модуль
}
```

## Информация о модуле

Каждый модуль содержит xoops_version.php с метаинформацией.

```php
return [
    'name' => 'Новости',
    'description' => 'Модуль управления новостями',
    'version' => '2.0',
    'author' => 'XOOPS Team',
    'module_status' => 'Final'
];
```

## Обработчик модулей

### XoopsModuleHandler

Получает и управляет модулями.

```php
$handler = xoops_getHandler('module');
$modules = $handler->getAll();
$module = $handler->get($id);
```

## Связанная документация

- XoopsModule - Класс модуля
- ../Core/XoopsObject - Объекты данных

---

*Система модулей обеспечивает основу для расширяемости XOOPS.*
