---
title: "Устранение неполадок - Ошибки шаблонов"
description: "Решение проблем отображения, парсинга и ошибок шаблонов Smarty в XOOPS"
---

# Ошибки шаблонов и отображения

> Решение проблем с шаблонами Smarty, парсингом и отображением на сайте.

---

## Проблемы парсинга Smarty

### "Undefined variable"

**Причина:** Переменная не передана в шаблон

**Решение:**
```php
// В контроллере убедитесь передаете переменную
$tpl->assign('my_variable', $value);

// В шаблоне проверьте
{if isset($my_variable)}
    {$my_variable}
{/if}
```

### "Template syntax error"

**Причина:** Неверный синтаксис Smarty

**Решение:**
```smarty
{* Неверно *}
{$variable
{if condition}

{* Верно *}
{$variable}
{if condition}...{/if}
```

## Проблемы отображения

### Пустая страница

**Причины:**
- Ошибка в шаблоне
- Отсутствует переменная
- Проблема с PHP

**Решение:**
```
1. Включите режим отладки (см. debug-mode.md)
2. Проверьте error.log
3. Проверьте синтаксис шаблона
```

---

## Отладка шаблонов

```smarty
{* Выведите значение для отладки *}
{$variable|print_r}

{* Проверьте существование переменной *}
{if isset($variable)}Variable exists{/if}

{* Выведите всплывающее окно debugger *}
{debug}
```

---

## Похожие руководства

- [Smarty отладка](debugging/smarty.md)
- [Белый экран](white-screen.md)

---

#troubleshooting #templates #smarty #debugging #xoops
