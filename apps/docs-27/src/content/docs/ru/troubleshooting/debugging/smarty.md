---
title: "Отладка - Smarty шаблоны"
description: "Отладка и диагностика проблем в шаблонах Smarty XOOPS"
---

# Отладка шаблонов Smarty

> Как отлаживать проблемы в шаблонах Smarty в XOOPS.

---

## Включение отладки Smarty

### В PHP коде

```php
$tpl = new XoopsTpl();
$tpl->debugging = true;
```

### В конфигурации

```php
// В xoops_lib/Xoops/Smarty.php
$tpl->_smarty->debugging = true;
```

---

## Использование {debug}

В любом шаблоне:

```smarty
{debug}
```

Откроет отладочное окно со всеми переменными.

---

## Вывод значений для отладки

```smarty
{* Выведите значение *}
{$variable}

{* Выведите как JSON *}
{$variable|@json_encode}

{* Выведите как print_r *}
{$variable|@print_r}

{* Выведите массив как таблицу *}
<pre>{$array|@print_r}</pre>
```

---

## Проверка существования переменной

```smarty
{if isset($variable)}
    Переменная существует: {$variable}
{else}
    Переменная НЕ существует
{/if}
```

---

## Проверка синтаксиса

```bash
# Используйте Smarty для проверки синтаксиса
php -r "require_once 'vendor/autoload.php'; 
require_once 'modules/publisher/class/Smarty.php';
\$tpl = new XoopsTpl();
\$tpl->configLoad('path/to/template');
echo 'OK';"
```

---

## Похожие руководства

- [Режим отладки](debug-mode.md)
- [Ошибки шаблонов](../template-errors.md)

---

#debugging #smarty #templates #xoops
