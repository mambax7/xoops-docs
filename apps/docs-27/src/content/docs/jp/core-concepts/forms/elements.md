---
title: "XOOPS フォーム要素"
---

## 概要

XOOPSは`XoopsFormElement`クラス階層を通じてフォーム要素の包括的なセットを提供します。これらの要素はHTMLレンダリング、検証、データ処理を処理します。

## フォーム要素の階層

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

## テキスト入力要素

### XoopsFormText

シングルラインテキスト入力:

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

マスキング付きパスワード入力:

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

マルチラインテキスト入力:

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

## 選択要素

### XoopsFormSelect

ドロップダウンセレクト:

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

チェックボックス入力:

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

ラジオボタングループ:

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

## ファイルアップロード

### XoopsFormFile

ファイルアップロード入力:

```php
use XoopsFormFile;

$element = new XoopsFormFile(
    caption: 'Upload Image',
    name: 'image'
);

$element->setMaxFileSize(2 * 1024 * 1024); // 2MB
```

## 日付と時刻

### XoopsFormDateTime

日付/時刻ピッカー:

```php
use XoopsFormDateTime;

$element = new XoopsFormDateTime(
    caption: 'Publish Date',
    name: 'publish_date',
    size: 15,
    value: time()
);
```

## 特別な要素

### XoopsFormHidden

隠しフィールド:

```php
use XoopsFormHidden;

$element = new XoopsFormHidden('article_id', $articleId);
```

### XoopsFormLabel

表示のみのラベル:

```php
use XoopsFormLabel;

$element = new XoopsFormLabel(
    caption: 'Created By',
    value: $authorName
);
```

### XoopsFormButton

フォームボタン:

```php
use XoopsFormButton;

// サブミットボタン
$submit = new XoopsFormButton('', 'submit', 'Save', 'submit');

// リセットボタン
$reset = new XoopsFormButton('', 'reset', 'Reset', 'reset');
```

## 要素カスタマイズ

### CSSクラスを追加

```php
$element->setExtra('class="form-control custom-class"');
```

### カスタム属性を追加

```php
$element->setExtra('data-validate="required" placeholder="Enter text..."');
```

### 説明を設定

```php
$element->setDescription('Enter a unique username (3-20 characters)');
```

## 関連ドキュメント

- Forms Overview
- Form Validation
- Custom Renderers
