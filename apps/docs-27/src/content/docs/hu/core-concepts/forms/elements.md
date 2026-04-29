---
title: "XOOPS űrlapelemek"
---
## Áttekintés

A XOOPS az űrlapelemek átfogó készletét biztosítja a `XOOPSFormElement` osztályhierarchiáján keresztül. Ezek az elemek kezelik a webes űrlapok megjelenítését, érvényesítését és adatfeldolgozását.

## Űrlapelem-hierarchia

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

## Szövegbeviteli elemek

### XOOPSFormText

Egysoros szövegbevitel:

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

### XOOPSFormPassword

Jelszóbevitel maszkolással:

```php
use XoopsFormPassword;

$element = new XoopsFormPassword(
    caption: 'Password',
    name: 'password',
    size: 30,
    maxlength: 100
);
```

### XOOPSFormTextArea

Többsoros szövegbevitel:

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

## Kijelölési elemek

### XOOPSFormSelect

Válassza ki a legördülő menüből:

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

### XOOPSFormCheckBox

Jelölőnégyzet bevitele:

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

### XOOPSFormRadio

Rádiógomb csoport:

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

## Fájl feltöltése

### XOOPSFormFile

Fájl feltöltési bemenet:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Dátum és idő

### XOOPSFormDateTime

Date/time picker:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Speciális elemek

### XOOPSFormHidden

Rejtett mező:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XOOPSFormLabel

Csak megjelenítési címke:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XOOPSFormButton

Űrlap gombok:

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Elemek testreszabása

### CSS osztályok hozzáadása

```php
$element->setExtra('class="form-control custom-class"');
```

### Egyéni attribútumok hozzáadása

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Beállítás leírása

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Kapcsolódó dokumentáció

- Űrlapok áttekintése
- Űrlap érvényesítése
- Egyedi megjelenítők
