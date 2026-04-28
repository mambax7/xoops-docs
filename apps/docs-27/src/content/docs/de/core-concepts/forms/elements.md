---
title: "XOOPS Form Elemente"
---

## Übersicht

XOOPS bietet einen umfassenden Satz von Form-Elementen durch seine `XoopsFormElement` Klassen-Hierarchie. Diese Elemente handhaben Rendering, Validierung und Datenverarbeitung für Web-Formulare.

## Form Element Hierarchie

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

## Text Input Elemente

### XoopsFormText

Einzeiliger Text-Input:

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

Passwort-Input mit Maskierung:

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

Mehrzeiliger Text-Input:

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

## Selection Elemente

### XoopsFormSelect

Dropdown Select:

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

Checkbox-Input:

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

Radio-Button-Gruppe:

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

## File Upload

### XoopsFormFile

File-Upload-Input:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Datum und Zeit

### XoopsFormDateTime

Date/Time Picker:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Spezielle Elemente

### XoopsFormHidden

Hidden Field:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

Display-Only Label:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

Form Buttons:

```php
use XoopsFormButton;

// Submit Button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset Button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Element Anpassung

### CSS Classes hinzufügen

```php
$element->setExtra('class="form-control custom-class"');
```

### Custom Attributes hinzufügen

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Description setzen

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Verwandte Dokumentation

- Forms Overview
- Form Validation
- Custom Renderers
