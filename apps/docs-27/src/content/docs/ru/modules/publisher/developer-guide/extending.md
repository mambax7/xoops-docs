---
title: "Publisher - Расширение модуля"
description: "Руководство по расширению функциональности Publisher через крючки, события и плагины"
---

# Расширение модуля Publisher

> Полное руководство по расширению функциональности Publisher через крючки, события, плагины и кастомизацию.

---

## Методы расширения

### 1. Крючки (Hooks)

Крючки позволяют вашему коду реагировать на события Publisher:

```php
// Перехватить сохранение статьи
$GLOBALS['xoops_hooks']['publisher']->executeHooks(
    'publisher.item.insert.end',
    $item
);

// Перехватить удаление статьи
$GLOBALS['xoops_hooks']['publisher']->executeHooks(
    'publisher.item.delete.end',
    $item
);
```

### 2. Обработчики событий

Зарегистрируйте обработчик для события:

```php
$eventManager = xoops_getModuleHandler('event', 'publisher');
$eventManager->register('item_saved', 'myModule', 'handleItemSaved');

// Метод обработчика
public function handleItemSaved($item) {
    // Ваша логика здесь
    doSomething($item);
}
```

### 3. Плагины

Создайте плагин Publisher:

```
mymodule/publisher/
├── filters/
│   └── MyFilter.php
├── blocks/
│   └── MyBlock.php
└── manifest.php
```

---

## Примеры расширения

### Интеграция с другим модулем

```php
// Получить handler Publisher
$itemHandler = xoops_getModuleHandler('Item', 'publisher');

// Получить все статьи категории 1
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('categoryid', 1));
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria);

// Обработать статьи
foreach ($items as $item) {
    // Ваша логика
}
```

---

## Похожие руководства

- Hooks and Events
- API Reference
- Plugin Development

---

#publisher #extending #hooks #plugins #development #xoops
