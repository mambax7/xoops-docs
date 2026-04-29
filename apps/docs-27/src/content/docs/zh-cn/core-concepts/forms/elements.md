---
title: “XOOPS表单元素”
---

## 概述

XOOPS 通过其 `XOOPSFormElement` 类层次结构提供了一组全面的表单元素。这些元素处理 Web 表单的呈现、验证和数据处理。

## 表单元素层次结构

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

## 文本输入元素

### XOOPSFormText

单-line文本输入：

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

### XOOPSForm密码

带屏蔽的密码输入：

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

多-line文本输入：

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

## 选择元素

### XOOPSFormSelect

下拉选择：

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

复选框输入：

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

单选按钮组：

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

## 文件上传

### XOOPSFormFile

文件上传输入：

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## 日期和时间

### XOOPSFormDateTime

Date/time选择器：

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## 特殊元素

### XOOPSFormHidden

隐藏字段：

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XOOPSFormLabel

显示-only标签：

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XOOPSFormButton

表单按钮：

```php
use XoopsFormButton;

// Submit button
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## 元素定制

### 添加 CSS 类

```php
$element->setExtra('class="form-control custom-class"');
```

### 添加自定义属性

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### 设置说明

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## 相关文档

- 表格概览
- 表单验证
- 自定义渲染器