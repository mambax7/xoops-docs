---
title: "XOOPS 表單"
description: "XOOPS 表單產生系統的完整指南，包括所有表單元素、驗證和呈現"
---

# 📝 XOOPS 表單系統

> XOOPS 模組的綜合表單產生、驗證和呈現。

---

## 概述

XOOPS 表單系統提供了建立 HTML 表單的強大、物件導向的方法。它處理表單產生、驗證、CSRF 保護和支援各種 CSS 框架的靈活呈現。

---

## 🚀 快速入門

### 基本表單建立

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// 建立表單
$form = new XoopsThemeForm(
    'Contact Form',           // 標題
    'contact_form',           // 名稱
    'submit.php',             // 動作
    'post',                   // 方法
    true                      // 使用令牌
);

// 新增元素
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// 呈現
echo $form->render();
```

---

## 📦 表單類別

### XoopsForm (基類)

所有表單的抽象基類。

```php
// 可用表單類型
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

最常用的表單類別，使用主題樣式呈現。

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// 表單方法
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // 額外 HTML 屬性
$form->render();
$form->display();               // 直接回響
```

---

## 🧩 表單元素

### 文字輸入

```php
// 單行文字
$text = new XoopsFormText(
    'Username',     // 標題
    'username',     // 名稱
    50,             // 大小
    255,            // 最大長度
    $defaultValue   // 預設值
);

// 帶預留位置
$text->setExtra('placeholder="Enter username"');
```

### 密碼輸入

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // 大小
    255             // 最大長度
);
```

### Textarea

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // 列數
    60              // 欄數
);
```

### 選擇下拉式清單

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // 大小 (1 = 下拉式清單)
    false           // 多個
);

// 新增選項
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// 或新增陣列
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### 多選

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // 可見列
    true            // 多選
);
$multiSelect->addOptionArray($tagOptions);
```

### 核取方塊

```php
// 單一核取方塊
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // 如果值匹配則勾選
);
$checkbox->addOption(1, 'Enable this feature');

// 多個核取方塊
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

### 選項按鈕

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

### 檔案上傳

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // 以位元組為單位的最大大小 (1MB)
);

// 多個檔案
$file->setExtra('multiple accept="image/*"');
```

### 隱藏欄位

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// CSRF 令牌 (始終包括!)
$token = new XoopsFormHiddenToken();
```

### 按鈕

```php
// 提交按鈕
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// 重設按鈕
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// 自訂按鈕
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### 標籤 (僅顯示)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### 日期/時間選擇器

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // 大小
    $timestamp      // 預設時間戳
);

// 僅日期 (文字輸入)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### WYSIWYG 編輯器

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
    false,          // 不允許 HTML
    'textarea'      // 備用編輯器
);
```

### 元素托盤 (群組元素)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ 表單驗證

### 必需欄位

```php
// 標記為必需 (第二個參數)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// 或在元素上設定
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### 自訂驗證

```php
// 伺服器端驗證
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 驗證 CSRF 令牌
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // 取得已清理的輸入
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // 驗證
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // 顯示錯誤
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // 處理表單
    }
}
```

### 用戶端驗證

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

## 🎨 自訂呈現器

### Bootstrap 5 呈現器

```php
// 登錄自訂呈現器
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// 現在所有表單都使用 Bootstrap 5 樣式
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### 建立自訂呈現器

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

    // ... 實現其他呈現方法
}
```

---

## 🔐 安全性

### CSRF 保護

始終包含隱藏令牌：

```php
$form->addElement(new XoopsFormHiddenToken());

// 或使用 useToken 參數自動
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### 在提交時驗證令牌

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### 輸入清理

```php
use Xmf\Request;

// 始終清理輸入
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 完整示例

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

// 處理表單
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 驗證 CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // 取得並驗證輸入
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // 儲存到資料庫
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

// 取得分類用於下拉式清單
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// 建構表單
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

// 顯示
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 相關文檔

- 表單元素參考
- 表單驗證
- 自訂表單呈現器
- CSRF 保護
- 輸入清理

---

#xoops #forms #validation #security #ui #elements
