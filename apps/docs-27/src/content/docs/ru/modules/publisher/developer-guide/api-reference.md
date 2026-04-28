---
title: "Publisher - Справка по API"
description: "Полная справка по API модуля Publisher с классами, методами и примерами кода"
---

# Справка по API Publisher

> Полная справка для классов, методов, функций модуля Publisher и конечных точек API.

---

## Структура модуля

### Организация классов

```
Классы модуля Publisher:

├── Item / ItemHandler
│   ├── Получить статьи
│   ├── Создать статьи
│   ├── Обновить статьи
│   └── Удалить статьи
│
├── Category / CategoryHandler
│   ├── Получить категории
│   ├── Создать категории
│   ├── Обновить категории
│   └── Удалить категории
│
├── Comment / CommentHandler
│   ├── Получить комментарии
│   ├── Создать комментарии
│   ├── Модерировать комментарии
│   └── Удалить комментарии
│
└── Helper
    ├── Функции утилит
    ├── Функции форматирования
    └── Проверки разрешений
```

---

## Класс Item

### Обзор

Класс `Item` представляет одну статью/элемент в Publisher.

**Пространство имен:** `XoopsModules\Publisher\`

**Файл:** `modules/publisher/class/Item.php`

### Конструктор

```php
// Создать новый элемент
$item = new Item();

// Получить существующий элемент
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Свойства и методы

#### Получить свойства

```php
// Получить ID статьи
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Получить название
$title = $item->getVar('title');
$title = $item->title();

// Получить описание
$description = $item->getVar('description');
$description = $item->description();

// Получить тело/контент
$body = $item->getVar('body');
$body = $item->body();

// Получить подзаголовок
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Получить автора
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Получить имя автора
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Получить категорию
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Получить статус
$status = $item->getVar('status');
$status = $item->status();

// Получить дату публикации
$date = $item->getVar('datesub');
$date = $item->date();

// Получить дату изменения
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Получить количество просмотров
$views = $item->getVar('counter');
$views = $item->views();

// Получить изображение
$image = $item->getVar('image');
$image = $item->image();

// Получить статус featured
$featured = $item->getVar('featured');
```

#### Установить свойства

```php
// Установить название
$item->setVar('title', 'Новое название статьи');

// Установить тело
$item->setVar('body', '<p>Содержание статьи здесь</p>');

// Установить описание
$item->setVar('description', 'Краткое описание');

// Установить категорию
$item->setVar('categoryid', 5);

// Установить статус (0=черновик, 1=опубликовано, и т.д)
$item->setVar('status', 1);

// Установить featured
$item->setVar('featured', 1);

// Установить изображение
$item->setVar('image', 'path/to/image.jpg');
```

---

## ItemHandler класс

### Получить статью

```php
$itemHandler = xoops_getModuleHandler('Item', 'publisher');

// Получить по ID
$item = $itemHandler->get($itemId);

// Получить все статьи
$items = $itemHandler->getAll();

// Получить с фильтром
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria);
```

### Создать статью

```php
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = new Item();

$item->setVar('title', 'Моя статья');
$item->setVar('body', '<p>Содержание</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', xoops_getUserId());
$item->setVar('status', 1);

if ($itemHandler->insert($item)) {
    echo "Статья создана";
} else {
    echo "Ошибка при создании";
}
```

### Обновить статью

```php
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

$item->setVar('title', 'Обновленное название');
$item->setVar('body', '<p>Обновленное содержание</p>');

if ($itemHandler->insert($item)) {
    echo "Статья обновлена";
}
```

### Удалить статью

```php
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
if ($itemHandler->delete($item)) {
    echo "Статья удалена";
}
```

---

## Category класс

### Свойства

```php
// Получить ID категории
$catId = $category->getVar('categoryid');

// Получить название
$name = $category->getVar('name');

// Получить описание
$desc = $category->getVar('description');

// Получить родительскую категорию
$parentId = $category->getVar('parentid');

// Получить изображение
$image = $category->getVar('image');
```

---

## Похожие руководства

- Custom Templates
- Extending Publisher
- Hooks and Events

---

#publisher #api #development #reference #xoops
