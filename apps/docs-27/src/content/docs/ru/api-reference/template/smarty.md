---
title: "Интеграция Smarty"
description: "Управление шаблонами Smarty в XOOPS"
---

XOOPS использует механизм шаблонов Smarty для отделения логики представления от кода приложения.

## XoopsTpl

Основной класс для работы с Smarty шаблонами.

```php
namespace Xoops\Template;

class XoopsTpl
{
    public function assign(string $name, mixed $value): void;
    public function display(string $template): string;
    public function fetch(string $template): string;
}
```

## Основные методы

### assign

Присваивает переменную для шаблона.

```php
$tpl = new XoopsTpl();
$tpl->assign('username', 'john');
$tpl->assign('email', 'john@example.com');
```

### display

Отображает шаблон.

```php
$tpl->display('profile.html');
```

### fetch

Получает результат шаблона в виде строки.

```php
$output = $tpl->fetch('profile.html');
echo $output;
```

## Синтаксис Smarty

```smarty
{* Комментарий *}
{$variable}
{foreach $items as $item}
  {$item}
{/foreach}
```

## Использование в модулях

```php
$tpl = new XoopsTpl();
$tpl->assign('articles', $articles);
$tpl->assign('title', 'Мои статьи');
$tpl->display('module:news/articles.html');
```

## Связанная документация

- System - Система управления шаблонами
- ../Core/XoopsObject - Объекты данных

---

*Smarty предоставляет мощный и гибкий способ создания шаблонов в XOOPS.*
