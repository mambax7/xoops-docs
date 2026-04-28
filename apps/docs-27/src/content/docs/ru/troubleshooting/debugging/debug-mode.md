---
title: "Отладка - Режим отладки XOOPS"
description: "Включение и использование режима отладки для решения проблем XOOPS"
---

# Режим отладки XOOPS

> Как включить и использовать режим отладки для выявления и решения проблем.

---

## Включение режима отладки

### Способ 1: mainfile.php

```php
// В /var/www/xoops/mainfile.php найдите:
// define('XOOPS_DEBUG_MODE', 0);
// Измените на:
define('XOOPS_DEBUG_MODE', 1);
```

### Способ 2: .htaccess

```apache
SetEnv XOOPS_DEBUG_MODE 1
```

### Способ 3: php.ini

```ini
display_errors = On
error_reporting = E_ALL | E_STRICT
```

---

## Что показывает режим отладки

Когда режим включен, XOOPS показывает:
- SQL запросы
- Переменные сессии
- Переменные контекста
- Ошибки парсинга
- Время выполнения

---

## Просмотр отладочной информации

В режиме отладки информация выводится:
1. В коде страницы HTML (комментарии)
2. В error_log
3. На экран (если display_errors = On)

---

## Отключение режима отладки

Не забудьте отключить для production!

```php
define('XOOPS_DEBUG_MODE', 0);  // Отключить
```

---

## Похожие руководства

- [Ray отладчик](ray.md)
- [Smarty отладка](smarty.md)
- [Белый экран](../white-screen.md)

---

#debugging #xoops #development #mode
