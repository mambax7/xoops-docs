---
title: "عناصر نموذج XOOPS"
dir: rtl
lang: ar
---

## نظرة عامة

يوفر XOOPS مجموعة شاملة من عناصر النموذج من خلال الهرمية الفئة `XoopsFormElement`. تتعامل هذه العناصر مع العرض والتحقق من الصحة ومعالجة البيانات للنماذج الويب.

## هرمية عنصر النموذج

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

## عناصر إدخال النص

### XoopsFormText

إدخال نص سطر واحد:

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

إدخال كلمة المرور مع إخفاء:

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

إدخال نص متعدد الأسطر:

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

## عناصر التحديد

### XoopsFormSelect

اختيار منسدل:

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

إدخال خانة اختيار:

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

مجموعة أزرار الراديو:

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

## تحميل الملف

### XoopsFormFile

إدخال تحميل الملف:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## التاريخ والوقت

### XoopsFormDateTime

منتقي التاريخ والوقت:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## عناصر خاصة

### XoopsFormHidden

حقل مخفي:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

تسمية عرض فقط:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

أزرار النموذج:

```php
use XoopsFormButton;

// زر الإرسال
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// زر إعادة تعيين
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## تخصيص العنصر

### إضافة فئات CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### إضافة خصائص مخصصة

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### تعيين الوصف

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## الوثائق ذات الصلة

- نظرة عامة على النماذج
- التحقق من صحة النموذج
- عارضات مخصصة
