---
title: "Система шаблонов"
description: "Управление шаблонами в XOOPS"
---

Система шаблонов XOOPS управляет всеми аспектами отображения содержимого через Smarty.

## Основные функции

### Расположение шаблонов

Шаблоны располагаются в:
- `/themes/{theme_name}/` - для шаблонов темы
- `/modules/{module_name}/templates/` - для шаблонов модуля

### Обработчик шаблонов

```php
$templateHandler = xoops_getHandler('tplfile');
$template = $templateHandler->getByName('index.html');
```

### Переменные шаблона

Переменные можно присвоить через:

```php
$GLOBALS['xoopsTpl']->assign('myvar', $value);
```

## Наследование шаблонов

Можно наследовать шаблоны от базовой темы:

```smarty
{extends file="base.html"}
{block name="content"}
  Мое содержимое
{/block}
```

## Использование в модулях

```php
$tpl = new XoopsTpl();
$tpl->assign('data', $data);
$tpl->display('module:mymodule/index.html');
```

## Связанная документация

- Smarty - Интеграция Smarty
- ../Core/XoopsObject - Объекты данных

---

*Система шаблонов обеспечивает гибкое управление внешним видом XOOPS.*
