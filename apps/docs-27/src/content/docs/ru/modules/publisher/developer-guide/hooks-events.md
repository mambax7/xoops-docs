---
title: "Publisher - Крючки и события"
description: "Полный справочник по крючкам и событиям Publisher для интеграции и расширения"
---

# Крючки и события Publisher

> Полный справочник по доступным крючкам и событиям в Publisher для интеграции с другими модулями.

---

## Доступные крючки

### Крючки статей (Item Hooks)

```php
// При создании статьи
'publisher.item.insert.before'
'publisher.item.insert.after'

// При обновлении статьи
'publisher.item.update.before'
'publisher.item.update.after'

// При удалении статьи
'publisher.item.delete.before'
'publisher.item.delete.after'

// При публикации статьи
'publisher.item.publish.before'
'publisher.item.publish.after'
```

### Крючки категорий (Category Hooks)

```php
// При создании категории
'publisher.category.insert.before'
'publisher.category.insert.after'

// При удалении категории
'publisher.category.delete.before'
'publisher.category.delete.after'
```

### Крючки комментариев (Comment Hooks)

```php
// При добавлении комментария
'publisher.comment.insert.before'
'publisher.comment.insert.after'

// При удалении комментария
'publisher.comment.delete.before'
'publisher.comment.delete.after'
```

---

## Регистрация крючков

### В xoops_version.php

```php
$modversion['hooks'] = [
    ['name' => 'publisher.item.insert.after',
     'function' => 'my_item_saved']
];
```

### Динамическая регистрация

```php
$hookManager = xoops_getHandler('hook');
$hookManager->register(
    'publisher.item.insert.after',
    'mymodule',
    'my_item_saved'
);
```

---

## События (Events)

Publisher использует объекты Event для передачи данных крючкам:

```php
$event = new Event('publisher.item.created');
$event->setData(['item' => $item, 'user' => $user]);
$dispatcher->dispatch($event);
```

---

## Похожие руководства

- API Reference
- Extending Publisher
- Module Integration

---

#publisher #hooks #events #integration #xoops
