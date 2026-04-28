---
title: "Elementi di Modulo XOOPS"
---

## Panoramica

XOOPS fornisce un set completo di elementi di modulo attraverso la gerarchia della classe `XoopsFormElement`. Questi elementi gestiscono il rendering, la validazione e l'elaborazione dei dati per i moduli web.

## Gerarchia di Elementi di Modulo

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

## Elementi di Input di Testo

### XoopsFormText

Input di testo su una singola riga:

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

Input di password con mascheramento:

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

Input di testo su più righe:

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

## Elementi di Selezione

### XoopsFormSelect

Selezione a discesa:

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

Input casella di controllo:

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

Gruppo di pulsanti radio:

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

## Caricamento di File

### XoopsFormFile

Input di caricamento di file:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Data e Ora

### XoopsFormDateTime

Picker data/ora:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Elementi Speciali

### XoopsFormHidden

Campo nascosto:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

Etichetta di sola visualizzazione:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

Pulsanti del modulo:

```php
use XoopsFormButton;

// Pulsante di invio
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Pulsante di ripristino
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Personalizzazione dell'Elemento

### Aggiunta di Classi CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### Aggiunta di Attributi Personalizzati

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Impostazione della Descrizione

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Documentazione Correlata

- Forms Overview
- Form Validation
- Custom Renderers
