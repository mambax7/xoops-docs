---
title: "XOOPS องค์ประกอบของแบบฟอร์ม"
---
## ภาพรวม

XOOPS มีชุดองค์ประกอบแบบฟอร์มที่ครอบคลุมผ่านลำดับชั้นของคลาส `XoopsFormElement` องค์ประกอบเหล่านี้จัดการการเรนเดอร์ การตรวจสอบ และการประมวลผลข้อมูลสำหรับเว็บฟอร์ม

## ลำดับชั้นองค์ประกอบแบบฟอร์ม
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
## องค์ประกอบการป้อนข้อความ

### XoopsFormText

การป้อนข้อความบรรทัดเดียว:
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

การป้อนรหัสผ่านพร้อมการปิดบัง:
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

การป้อนข้อความหลายบรรทัด:
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
## องค์ประกอบการเลือก

### XoopsFormSelect

เลือกแบบเลื่อนลง:
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

ช่องทำเครื่องหมายอินพุต:
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

กลุ่มปุ่มตัวเลือก:
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
## อัพโหลดไฟล์

### XoopsFormFile

อินพุตการอัพโหลดไฟล์:
```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```
## วันที่และเวลา

### XoopsFormDateTime

เครื่องมือเลือกวันที่/เวลา:
```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```
## องค์ประกอบพิเศษ

### XoopsFormHidden

ช่องที่ซ่อนอยู่:
```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```
### XoopsFormLabel

ป้ายกำกับที่แสดงอย่างเดียว:
```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```
### XoopsFormButton

ปุ่มแบบฟอร์ม:
```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```
## การปรับแต่งองค์ประกอบ

### กำลังเพิ่มคลาส CSS
```php
$element->setExtra('class="form-control custom-class"');
```
### การเพิ่มคุณสมบัติที่กำหนดเอง
```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```
### คำอธิบายการตั้งค่า
```php
$element->setDescription('Enter a unique username (3-20 characters)');
```
## เอกสารที่เกี่ยวข้อง

- ภาพรวมแบบฟอร์ม
- การตรวจสอบแบบฟอร์ม
- การเรนเดอร์แบบกำหนดเอง