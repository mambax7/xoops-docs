---
title: "Класс XoopsForm"
description: "Генерирование HTML форм и управление элементами форм с валидацией"
---

Класс `XoopsForm` предоставляет объектно-ориентированный способ создания и управления HTML формами в XOOPS. Он обрабатывает отрисовку элементов, валидацию и интеграцию с системой безопасности XOOPS.

## Обзор класса

```php
namespace Xoops\Form;

class XoopsForm
{
    protected $name;
    protected $title;
    protected $action;
    protected $method;
    protected $elements = [];
    protected $required = [];
}
```

## Основные методы

### Конструктор

```php
public function __construct(
    string $title,
    string $name,
    string $action,
    string $method = 'post',
    bool $addToken = true
)
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$title` | string | Заголовок формы |
| `$name` | string | Имя формы |
| `$action` | string | Действие обработки формы |
| `$method` | string | GET или POST |
| `$addToken` | bool | Добавить токен безопасности |

**Пример:**
```php
$form = new XoopsThemeForm('Профиль пользователя', 'userform', 'save.php', 'post', true);
```

### addElement

Добавляет элемент в форму.

```php
public function addElement(XoopsFormElement $element, bool $required = false): void
```

**Пример:**
```php
$form->addElement(new XoopsFormText('Имя', 'name', 50, 255, $user->getVar('name')), true);
$form->addElement(new XoopsFormTextArea('Биография', 'bio', 4, 60, $user->getVar('bio')));
```

### render

Визуализирует форму в HTML.

```php
public function render(): string
```

**Пример:**
```php
echo $form->render();
```

## Элементы формы

### XoopsFormText

Текстовое поле ввода.

```php
new XoopsFormText($caption, $name, $size, $maxlength, $value)
```

### XoopsFormTextArea

Область для ввода многострочного текста.

```php
new XoopsFormTextArea($caption, $name, $rows, $cols, $value)
```

### XoopsFormSelect

Выпадающий список для выбора.

```php
new XoopsFormSelect($caption, $name, $value, $size, $multiple)
```

### XoopsFormCheckBox

Чекбокс для единичного выбора.

```php
new XoopsFormCheckBox($caption, $name, $value, $checked)
```

### XoopsFormRadio

Радиокнопки для выбора одного варианта.

```php
new XoopsFormRadio($caption, $name, $value)
```

### XoopsFormButton

Кнопка для отправки или другого действия.

```php
new XoopsFormButton($caption, $name, $value, $type)
```

## Связанная документация

- XoopsFormElement - Базовый класс элементов
- ../Core/XoopsObject - Объекты данных

---

*Элементы формы используются для создания интерактивных пользовательских интерфейсов в XOOPS.*
