---
title: "Elementy formularza XOOPS"
---

## Przegląd

XOOPS zapewnia kompleksowy zestaw elementów formularza poprzez hierarchię klasy `XoopsFormElement`. Elementy te obsługują renderowanie, walidację i przetwarzanie danych dla formularzy sieciowych.

## Hierarchia elementów formularza

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

## Elementy wejścia tekstowego

### XoopsFormText

Jedno-liniowe wejście tekstowe:

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

Wejście hasła z maskowaniem:

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

Wieloliniowe wejście tekstowe:

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

## Elementy wyboru

### XoopsFormSelect

Dropdown select:

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

Wejście checkbox:

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

Grupa radio buttons:

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

## Wgrywanie pliku

### XoopsFormFile

Wejście wgrywania pliku:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Data i czas

### XoopsFormDateTime

Selektor daty/czasu:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Elementy specjalne

### XoopsFormHidden

Pole ukryte:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

Etykieta tylko do wyświetlania:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

Przyciski formularza:

```php
use XoopsFormButton;

// Przycisk submit
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Przycisk reset
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Dostosowanie elementów

### Dodawanie klas CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### Dodawanie niestandardowych atrybutów

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Ustawianie opisu

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Powiązana dokumentacja

- Forms Overview
- Form Validation
- Custom Renderers
