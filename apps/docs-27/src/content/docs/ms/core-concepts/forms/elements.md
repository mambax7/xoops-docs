---
title: "XOOPS Elemen Borang"
---
## Gambaran KeseluruhanXOOPS menyediakan set lengkap elemen bentuk melalui hierarki kelas `XoopsFormElement`nya. Elemen ini mengendalikan pemaparan, pengesahan dan pemprosesan data untuk borang web.## Hierarki Elemen Bentuk
```
mermaid
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
## Elemen Input Teks### XoopsFormTextInput teks satu baris:
```
php
use XoopsFormText;

$element = new XoopsFormText(
    caption: 'Username',
    name: 'username',
    size: 30,
    maxlength: 50,
    value: $currentValue
);
```
### XoopsFormPasswordInput kata laluan dengan penyamaran:
```
php
use XoopsFormPassword;

$element = new XoopsFormPassword(
    caption: 'Password',
    name: 'password',
    size: 30,
    maxlength: 100
);
```
### XoopsFormTextAreaInput teks berbilang baris:
```
php
use XoopsFormTextArea;

$element = new XoopsFormTextArea(
    caption: 'Description',
    name: 'description',
    value: $currentValue,
    rows: 5,
    cols: 50
);
```
## Elemen Pemilihan### XoopsFormSelectPilih lungsur turun:
```
php
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
### XoopsFormCheckBoxInput kotak semak:
```
php
use XoopsFormCheckBox;

$element = new XoopsFormCheckBox(
    caption: 'Features',
    name: 'features',
    value: $selected
);

$element->addOption('comments', 'Enable Comments');
$element->addOption('ratings', 'Enable Ratings');
```
### XoopsFormRadioKumpulan butang radio:
```
php
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
## Muat Naik Fail### XoopsFormFileInput muat naik fail:
```
php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```
## Tarikh dan Masa### XoopsFormDateTimePemilih Date/time:
```
php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```
## Elemen Khas### XoopsFormHiddenMedan tersembunyi:
```
php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```
### XoopsFormLabelLabel paparan sahaja:
```
php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```
### Butang XoopsFormButang borang:
```
php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```
## Penyesuaian Elemen### Menambah Kelas CSS
```
php
$element->setExtra('class="form-control custom-class"');
```
### Menambah Atribut Tersuai
```
php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```
### Penerangan Tetapan
```
php
$element->setDescription('Enter a unique username (3-20 characters)');
```
## Dokumentasi Berkaitan- Gambaran Keseluruhan Borang
- Pengesahan Borang
- Penyampai Tersuai