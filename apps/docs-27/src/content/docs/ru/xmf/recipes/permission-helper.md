---
title: "Помощник разрешений"
description: "Управление разрешениями группы XOOPS с помощником разрешений XMF"
---

XOOPS имеет мощную и гибкую систему разрешений, основанную на членстве в группе пользователей. Помощник разрешений XMF упрощает работу с этими разрешениями, уменьшая сложные проверки разрешений к одиночным вызовам методов.

## Обзор

Система разрешений XOOPS связывает группы с:
- ID модуля
- Названием разрешения
- ID элемента

Проверка разрешений традиционно требует поиска групп пользователей, поиска ID модулей и запроса таблиц разрешений. Помощник разрешений XMF автоматически обрабатывает все это.

## Начало работы

### Создание помощника разрешений

```php
// Для текущего модуля
$permHelper = new \Xmf\Module\Helper\Permission();

// Для конкретного модуля
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

Помощник автоматически использует группы текущего пользователя и ID указанного модуля.

## Проверка разрешений

### Есть ли у пользователя разрешение?

Проверить, имеет ли текущий пользователь конкретное разрешение на элемент:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Проверить, может ли пользователь просмотреть тему ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Отобразить тему
} else {
    // Показать сообщение об отказе в доступе
}
```

### Проверить с перенаправлением

Автоматически перенаправить пользователей, у которых нет разрешения:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Перенаправляет на index.php через 3 секунды, если нет разрешения
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Код здесь выполняется только, если пользователь имеет разрешение
displayTopic($topicId);
```

## Управление разрешениями

### Получить разрешения для элемента

Найти какие группы имеют конкретное разрешение:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Получить группы, которые могут просмотреть тему 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Возвращает: [1, 2, 5] (массив ID групп)
```

### Сохранить разрешения

Предоставить разрешение конкретным группам:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Разрешить группам 1, 2 и 3 просмотреть тему 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Удалить разрешения

Удалить все разрешения для элемента (обычно при удалении элемента):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Удалить разрешение просмотра для этой темы
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

## API справочник

| Метод | Описание |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Проверить, имеет ли пользователь разрешение |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Проверить и перенаправить при отказе |
| `getItemIds($name, $groupIds)` | Получить ID элементов, доступных группам |
| `getGroupsForItem($name, $itemId)` | Получить группы с разрешением |
| `savePermissionForItem($name, $itemId, $groups)` | Сохранить разрешения |
| `deletePermissionForItem($name, $itemId)` | Удалить разрешения |

---

#xmf #permissions #security #groups #forms
