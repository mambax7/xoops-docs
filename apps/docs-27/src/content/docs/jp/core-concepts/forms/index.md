---
title: "XOOPS フォーム"
description: "フォーム生成、検証、レンダリングを含むXOOPSフォームシステムの完全ガイド"
---

# 📝 XOOPS フォームシステム

> XOOPSモジュール用の包括的なフォーム生成、検証、レンダリング。

---

## 概要

XOOPSフォームシステムはHTML フォームを作成するための強力なオブジェクト指向アプローチを提供します。フォーム生成、検証、CSRF保護、さまざまなCSSフレームワークをサポートする柔軟なレンダリングを処理します。

---

## 🚀 クイックスタート

### 基本的なフォーム作成

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// フォームを作成
$form = new XoopsThemeForm(
    'Contact Form',           // タイトル
    'contact_form',           // 名前
    'submit.php',             // アクション
    'post',                   // メソッド
    true                      // トークンを使用
);

// 要素を追加
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// レンダリング
echo $form->render();
```

---

## 📦 フォームクラス

### XoopsForm（基本クラス）

すべてのフォームの抽象基本クラス。

```php
// 利用可能なフォームタイプ
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

最も一般的に使用されるフォームクラス。テーマスタイリングでレンダリングされます。

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// フォームメソッド
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // 追加のHTML属性
$form->render();
$form->display();               // 直接エコー
```

---

## 🧩 フォーム要素

### テキスト入力

```php
// シングルラインテキスト
$text = new XoopsFormText(
    'Username',     // キャプション
    'username',     // 名前
    50,             // サイズ
    255,            // 最大長
    $defaultValue   // デフォルト値
);

// プレースホルダー付き
$text->setExtra('placeholder="Enter username"');
```

### パスワード入力

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // サイズ
    255             // 最大長
);
```

### テキストエリア

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // 行
    60              // 列
);
```

### セレクトドロップダウン

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // サイズ（1 = ドロップダウン）
    false           // 複数選択
);

// オプションを追加
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// または配列を追加
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### マルチセレクト

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // 表示行
    true            // 複数選択
);
$multiSelect->addOptionArray($tagOptions);
```

### チェックボックス

```php
// 単一チェックボックス
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // 値が一致する場合にチェック
);
$checkbox->addOption(1, 'Enable this feature');

// 複数チェックボックス
$checkboxGroup = new XoopsFormCheckBox(
    'Features',
    'features[]',
    $selectedFeatures
);
$checkboxGroup->addOptionArray([
    'comments' => 'Enable Comments',
    'ratings' => 'Enable Ratings',
    'sharing' => 'Enable Sharing'
]);
```

### ラジオボタン

```php
$radio = new XoopsFormRadio(
    'Status',
    'status',
    $defaultStatus
);
$radio->addOptionArray([
    'draft' => 'Draft',
    'published' => 'Published',
    'archived' => 'Archived'
]);
```

### ファイルアップロード

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // 最大サイズ（バイト）（1MB）
);

// 複数ファイル
$file->setExtra('multiple accept="image/*"');
```

### 隠しフィールド

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// CSRFトークン（常に含める！）
$token = new XoopsFormHiddenToken();
```

### ボタン

```php
// サブミットボタン
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// リセットボタン
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// カスタムボタン
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### ラベル（表示のみ）

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### 日付/時刻ピッカー

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // サイズ
    $timestamp      // デフォルトタイムスタンプ
);

// 日付のみ（テキスト入力）
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### WYSIWYGエディター

```php
$editor = new XoopsFormEditor(
    'Content',
    'content',
    [
        'name' => 'content',
        'value' => $defaultContent,
        'rows' => 15,
        'cols' => 60,
        'width' => '100%',
        'height' => '400px'
    ],
    false,          // HTMLは許可されません
    'textarea'      // フォールバックエディター
);
```

### 要素トレイ（グループ要素）

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ フォーム検証

### 必須フィールド

```php
// 必須としてマーク（2番目のパラメーター）
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// または要素で設定
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### カスタム検証

```php
// サーバー側検証
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRFトークンを検証
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // サニタイズされた入力を取得
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // 検証
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // エラーを表示
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // フォームを処理
    }
}
```

### クライアント側検証

```php
$form->setExtra('onsubmit="return validateForm()"');
```

```javascript
function validateForm() {
    const name = document.forms['myform']['name'].value;
    if (name.trim() === '') {
        alert('Name is required');
        return false;
    }
    return true;
}
```

---

## 🎨 カスタムレンダラー

### Bootstrap 5 レンダラー

```php
// カスタムレンダラーを登録
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// これからすべてのフォームはBootstrap 5スタイリングを使用
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### カスタムレンダラーを作成

```php
<?php

class XoopsFormRendererBulma implements XoopsFormRendererInterface
{
    public function renderFormText(XoopsFormText $element): string
    {
        return sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <input class="input" type="text" name="%s" value="%s" size="%d" maxlength="%d" %s>
                </div>
            </div>',
            $element->getCaption(),
            $element->getName(),
            htmlspecialchars($element->getValue(), ENT_QUOTES),
            $element->getSize(),
            $element->getMaxlength(),
            $element->getExtra()
        );
    }

    public function renderFormSelect(XoopsFormSelect $element): string
    {
        $html = sprintf(
            '<div class="field">
                <label class="label">%s</label>
                <div class="control">
                    <div class="select">
                        <select name="%s" %s>',
            $element->getCaption(),
            $element->getName(),
            $element->getExtra()
        );

        foreach ($element->getOptions() as $value => $label) {
            $selected = ($value == $element->getValue()) ? ' selected' : '';
            $html .= sprintf(
                '<option value="%s"%s>%s</option>',
                htmlspecialchars($value, ENT_QUOTES),
                $selected,
                htmlspecialchars($label, ENT_QUOTES)
            );
        }

        $html .= '</select></div></div></div>';

        return $html;
    }

    // ... 他のレンダーメソッドを実装
}
```

---

## 🔐 セキュリティ

### CSRF保護

常に隠しトークンを含める:

```php
$form->addElement(new XoopsFormHiddenToken());

// またはuseTokenパラメーターで自動
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### サブミット時にトークンを検証

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### 入力サニタイズ

```php
use Xmf\Request;

// 常に入力をサニタイズ
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 完全な例

```php
<?php
require_once dirname(__DIR__) . '/mainfile.php';

use Xmf\Request;
use XoopsFormButton;
use XoopsFormHiddenToken;
use XoopsFormRadio;
use XoopsFormSelect;
use XoopsFormText;
use XoopsFormTextArea;
use XoopsThemeForm;

// フォームを処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRFを検証
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // 入力を取得して検証
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // データベースに保存
        $itemHandler = xoops_getModuleHandler('item', 'mymodule');
        $item = $itemHandler->create();
        $item->setVar('title', $title);
        $item->setVar('content', $content);
        $item->setVar('category_id', $categoryId);
        $item->setVar('status', $status);
        $item->setVar('created', time());

        if ($itemHandler->insert($item)) {
            redirect_header('index.php', 2, 'Item saved successfully');
            exit;
        } else {
            $error = 'Error saving item';
        }
    }
}

// ドロップダウン用のカテゴリーを取得
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// フォームを構築
$form = new XoopsThemeForm('Add New Item', 'item_form', 'form.php', 'post', true);

$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title ?? ''), true);

$categorySelect = new XoopsFormSelect('Category', 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

$form->addElement(new XoopsFormTextArea('Content', 'content', $content ?? '', 10, 60));

$statusRadio = new XoopsFormRadio('Status', 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => 'Draft',
    'published' => 'Published'
]);
$form->addElement($statusRadio);

$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// 表示
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 関連ドキュメント

- Form Elements Reference
- Form Validation
- Custom Form Renderers
- CSRF Protection
- Input Sanitization

---

#xoops #forms #validation #security #ui #elements
