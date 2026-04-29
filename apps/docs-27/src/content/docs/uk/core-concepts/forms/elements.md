---
title: "Елементи форми XOOPS"
---
## Огляд

XOOPS надає повний набір елементів форми через свою ієрархію класів `XoopsFormElement`. Ці елементи керують рендерингом, перевіркою та обробкою даних для веб-форм.

## Ієрархія елементів форми
```mermaid
classDiagram
    class XoopsFormElement {
        +getName()
        +getCaption()
        +render()
        +setValue()
        +getValue()
    }

    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormDateTime
```
## Елементи введення тексту

### XoopsFormText

Однорядкове введення тексту:
```php
use XoopsFormText;

$element = new XoopsFormText(
    caption: 'Username',
    name: 'username',
    size: 30,
    maxlength: 50,
    value: $currentValue
);
```
### XoopsFormPassword

Введення пароля з маскуванням:
```php
use XoopsFormPassword;

$element = new XoopsFormPassword(
    caption: 'Password',
    name: 'password',
    size: 30,
    maxlength: 100
);
```
### XoopsFormTextArea

Багаторядкове введення тексту:
```php
use XoopsFormTextArea;

$element = new XoopsFormTextArea(
    caption: 'Description',
    name: 'description',
    value: $currentValue,
    rows: 5,
    cols: 50
);
```
## Елементи вибору

### XoopsFormSelect

Виберіть у спадному меню:
```php
use XoopsFormSelect;

$element = new XoopsFormSelect(
    caption: 'Category',
    name: 'category_id',
    value: $selected,
    size: 1,
    multiple: false
);

$element->addOption(1, 'Category 1');
$element->addOption(2, 'Category 2');
$element->addOptionArray([
    3 => 'Category 3',
    4 => 'Category 4'
]);
```
### XoopsFormCheckBox

Введення прапорця:
```php
use XoopsFormCheckBox;

$element = new XoopsFormCheckBox(
    caption: 'Features',
    name: 'features',
    value: $selected
);

$element->addOption('comments', 'Enable Comments');
$element->addOption('ratings', 'Enable Ratings');
```
### XoopsFormRadio

Група радіокнопок:
```php
use XoopsFormRadio;

$element = new XoopsFormRadio(
    caption: 'Status',
    name: 'status',
    value: $currentValue
);

$element->addOption('draft', 'Draft');
$element->addOption('published', 'Published');
$element->addOption('archived', 'Archived');
```
## Завантаження файлу

### XoopsFormFile

Вхід для завантаження файлу:
```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```
## Дата й час

### XoopsFormDateTime

Збірник Date/time:
```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```
## Спеціальні елементи

### XoopsFormHidden

Приховане поле:
```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```
### XoopsFormLabel

Мітка лише для відображення:
```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```
### XoopsFormButton

Кнопки форми:
```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```
## Налаштування елемента

### Додавання класів CSS
```php
$element->setExtra('class="form-control custom-class"');
```
### Додавання спеціальних атрибутів
```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```
### Опис налаштування
```php
$element->setDescription('Enter a unique username (3-20 characters)');
```
## Пов'язана документація

- Огляд форм
- Перевірка форми
- Користувальницькі рендерери