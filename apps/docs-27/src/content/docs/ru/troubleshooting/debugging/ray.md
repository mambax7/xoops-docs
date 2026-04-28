---
title: "Отладка - Ray отладчик"
description: "Использование Ray для отладки приложений XOOPS"
---

# Ray отладчик для XOOPS

> Как использовать Ray для удаленной отладки и логирования в XOOPS.

---

## Что такое Ray

Ray - это отладчик реального времени для PHP приложений, включая XOOPS.

---

## Установка Ray

### Через Composer

```bash
composer require spatie/ray
```

### Минимальная конфигурация

```php
// В вашем коде
ray('Debug message');
ray($variable);
ray()->measure('operation');
```

---

## Использование в XOOPS

```php
// В модулях XOOPS
ray()->info('Module loaded: Publisher');

$items = $itemHandler->getAll();
ray()->debug('Items fetched', $items);

ray()->table($items);  // Выведите как таблицу
```

---

## Команды Ray

```php
ray('message');              // Простое сообщение
ray()->info('info');         // Информация
ray()->warning('warning');   // Предупреждение
ray()->error('error');       // Ошибка
ray()->table($array);        // Таблица
ray()->measure();            // Время выполнения
```

---

## Похожие руководства

- [Режим отладки](debug-mode.md)
- [Smarty отладка](smarty.md)

---

#debugging #ray #development #monitoring #xoops
