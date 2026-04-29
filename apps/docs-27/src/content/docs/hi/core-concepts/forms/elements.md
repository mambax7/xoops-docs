---
title: "XOOPS प्रपत्र तत्व"
---
## अवलोकन

XOOPS अपने `XoopsFormElement` वर्ग पदानुक्रम के माध्यम से फॉर्म तत्वों का एक व्यापक सेट प्रदान करता है। ये तत्व वेब फॉर्म के लिए रेंडरिंग, सत्यापन और डेटा प्रोसेसिंग को संभालते हैं।

## प्रपत्र तत्व पदानुक्रम

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

## टेक्स्ट इनपुट तत्व

### XoopsFormText

एकल-पंक्ति पाठ इनपुट:

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

मास्किंग के साथ पासवर्ड इनपुट:

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

बहु-पंक्ति पाठ इनपुट:

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

## चयन तत्व

### XoopsFormSelect

ड्रॉपडाउन चयन:

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

चेकबॉक्स इनपुट:

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

रेडियो बटन समूह:

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

## फ़ाइल अपलोड

### XoopsFormFile

फ़ाइल अपलोड इनपुट:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## दिनांक और समय

### XoopsFormDateTime

दिनांक/समय चयनकर्ता:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## विशेष तत्व

### XoopsFormHidden

छिपा हुआ क्षेत्र:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

केवल-प्रदर्शन लेबल:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

प्रपत्र बटन:

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## तत्व अनुकूलन

### CSS कक्षाएं जोड़ना

```php
$element->setExtra('class="form-control custom-class"');
```

### कस्टम विशेषताएँ जोड़ना

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### सेटिंग विवरण

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## संबंधित दस्तावेज़ीकरण

- प्रपत्र अवलोकन
- प्रपत्र सत्यापन
- कस्टम रेंडरर्स