---
title: "عناصر فرم XOOPS"
---
## بررسی اجمالی

XOOPS مجموعه ای جامع از عناصر فرم را از طریق سلسله مراتب کلاس `XoopsFormElement` ارائه می دهد. این عناصر رندر، اعتبارسنجی و پردازش داده‌ها را برای فرم‌های وب انجام می‌دهند.

## سلسله مراتب عناصر فرم

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

## عناصر ورودی متن

### XoopsFormText

ورودی متن تک خطی:

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

### رمز عبور XoopsForm

ورود رمز عبور با پوشش:

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

ورودی متن چند خطی:

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

## عناصر انتخاب

### XoopsFormSelect

انتخاب کشویی:

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

ورودی چک باکس:

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

گروه دکمه های رادیویی:

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

## آپلود فایل

### XoopsFormFile

ورودی آپلود فایل:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## تاریخ و زمان

### XoopsFormDateTime

انتخابگر Date/time:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## عناصر ویژه

### XoopsFormHidden

فیلد پنهان:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

برچسب فقط نمایشگر:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### دکمه XoopsForm

دکمه های فرم:

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## سفارشی سازی عنصر

### اضافه کردن کلاس های CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### اضافه کردن ویژگی های سفارشی

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### توضیحات تنظیمات

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## مستندات مرتبط

- بررسی اجمالی فرم ها
- اعتبار سنجی فرم
- رندرهای سفارشی