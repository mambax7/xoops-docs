---
title: "Các phần tử biểu mẫu XOOPS"
---
## Tổng quan

XOOPS cung cấp một tập hợp toàn diện các phần tử biểu mẫu thông qua hệ thống phân cấp `XoopsFormElement` class. Các phần tử này xử lý việc hiển thị, xác thực và xử lý dữ liệu cho các biểu mẫu web.

## Phân cấp thành phần biểu mẫu

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

## Các phần tử nhập văn bản

### XoopsFormText

Nhập văn bản một dòng:

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

### XoopsFormMật khẩu

Nhập mật khẩu có che:

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

Nhập văn bản nhiều dòng:

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

## Phần tử lựa chọn

### XoopsFormSelect

Chọn thả xuống:

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

Đầu vào hộp kiểm:

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

Nhóm nút radio:

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

## Tải lên tệp

### XoopsFormFile

Đầu vào tải lên tệp:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## Ngày và giờ

### XoopsFormDateTime

Bộ chọn ngày/giờ:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## Yếu tố đặc biệt

### XoopsFormẨn

Trường ẩn:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

Nhãn chỉ hiển thị:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

Các nút biểu mẫu:

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## Tùy chỉnh phần tử

### Thêm các lớp CSS

```php
$element->setExtra('class="form-control custom-class"');
```

### Thêm thuộc tính tùy chỉnh

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### Mô tả cài đặt

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## Tài liệu liên quan

- Tổng quan về biểu mẫu
- Xác thực mẫu
- Trình kết xuất tùy chỉnh