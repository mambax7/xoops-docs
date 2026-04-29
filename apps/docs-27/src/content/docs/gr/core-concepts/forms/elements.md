---
title: "XOOPS Στοιχεία Μορφής"
---

## Επισκόπηση

Το XOOPS παρέχει ένα ολοκληρωμένο σύνολο στοιχείων φόρμας μέσω της ιεραρχίας κλάσης `XoopsFormElement`. Αυτά τα στοιχεία χειρίζονται την απόδοση, την επικύρωση και την επεξεργασία δεδομένων για φόρμες ιστού.

## Ιεραρχία στοιχείων φόρμας

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

## Στοιχεία εισαγωγής κειμένου

## # XoopsFormText

Εισαγωγή κειμένου σε μία γραμμή:

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

## # XoopsFormPassword

Εισαγωγή κωδικού πρόσβασης με κάλυψη:

```php
use XoopsFormPassword;

$element = new XoopsFormPassword(
    caption: 'Password',
    name: 'password',
    size: 30,
    maxlength: 100
);
```

## # XoopsFormTextArea

Εισαγωγή κειμένου σε πολλές γραμμές:

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

## Στοιχεία επιλογής

## # XoopsFormSelect

Επιλογή με αναπτυσσόμενο μενού:

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

## # XoopsFormCheckBox

Εισαγωγή πλαισίου ελέγχου:

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

## # XoopsFormRadio

Ομάδα κουμπιών ραδιοφώνου:

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

## Μεταφόρτωση αρχείου

## # XoopsFormFile

Είσοδος μεταφόρτωσης αρχείου:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Ημερομηνία και ώρα

## # XoopsFormDateTime

Επιλογέας Date/time:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Ειδικά Στοιχεία

## # XoopsFormHidden

Κρυφό πεδίο:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

## # XoopsFormLabel

Ετικέτα μόνο για εμφάνιση:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

## # XoopsFormButton

Κουμπιά φόρμας:

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Προσαρμογή στοιχείων

## # Προσθήκη CSS τάξεων

```php
$element->setExtra('class="form-control custom-class"');
```

## # Προσθήκη προσαρμοσμένων χαρακτηριστικών

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

## # Περιγραφή ρύθμισης

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Σχετική τεκμηρίωση

- Επισκόπηση φορμών
- Επικύρωση φόρμας
- Προσαρμοσμένα Renderers
