---
title: "XOOPS 양식"
description: "모든 양식 요소, 유효성 검사 및 렌더링을 포함하는 XOOPS 양식 생성 시스템에 대한 전체 가이드"
---

# 📝 XOOPS 양식 시스템

> XOOPS 모듈을 위한 포괄적인 양식 생성, 검증 및 렌더링.

---

## 개요

XOOPS 양식 시스템은 HTML 양식 작성에 대한 강력한 객체 지향 접근 방식을 제공합니다. 다양한 CSS 프레임워크를 지원하여 양식 생성, 유효성 검사, CSRF 보호 및 유연한 렌더링을 처리합니다.

---

## 🚀 빠른 시작

### 기본 양식 작성

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// Create a form
$form = new XoopsThemeForm(
    'Contact Form',           // Title
    'contact_form',           // Name
    'submit.php',             // Action
    'post',                   // Method
    true                      // Use token
);

// Add elements
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Render
echo $form->render();
```

---

## 📦 양식 클래스

### XoopsForm(기본 클래스)

모든 양식에 대한 추상 기본 클래스입니다.

```php
// Available form types
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

가장 일반적으로 사용되는 양식 클래스는 테마 스타일을 사용하여 렌더링합니다.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// Form methods
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Extra HTML attributes
$form->render();
$form->display();               // Echo directly
```

---

## 🧩 양식 요소

### 텍스트 입력

```php
// Single-line text
$text = new XoopsFormText(
    'Username',     // Caption
    'username',     // Name
    50,             // Size
    255,            // Max length
    $defaultValue   // Default value
);

// With placeholder
$text->setExtra('placeholder="Enter username"');
```

### 비밀번호 입력

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // Size
    255             // Max length
);
```

### 텍스트 영역

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Rows
    60              // Cols
);
```

### 드롭다운 선택

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // Size (1 = dropdown)
    false           // Multiple
);

// Add options
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// Or add array
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### 다중 선택

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // Visible rows
    true            // Multiple selection
);
$multiSelect->addOptionArray($tagOptions);
```

### 체크박스

```php
// Single checkbox
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // Checked if value matches
);
$checkbox->addOption(1, 'Enable this feature');

// Multiple checkboxes
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

### 라디오 버튼

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

### 파일 업로드

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Max size in bytes (1MB)
);

// Multiple files
$file->setExtra('multiple accept="image/*"');
```

### 숨겨진 필드

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// CSRF Token (always include!)
$token = new XoopsFormHiddenToken();
```

### 버튼

```php
// Submit button
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Custom button
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### 라벨(표시 전용)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### 날짜/시간 선택기

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Size
    $timestamp      // Default timestamp
);

// Date only (text input)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### WYSIWYG 편집자

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
    false,          // No HTML allowed
    'textarea'      // Fallback editor
);
```

### 요소 트레이(그룹 요소)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ 양식 확인

### 필수 입력사항

```php
// Mark as required (second parameter)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// Or set on element
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### 사용자 정의 검증

```php
// Server-side validation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Get sanitized input
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Validate
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // Show errors
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Process form
    }
}
```

### 클라이언트측 검증

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

## 🎨 맞춤 렌더러

### 부트스트랩 5 렌더러

```php
// Register custom renderer
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Now all forms use Bootstrap 5 styling
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### 사용자 정의 렌더러 만들기

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

    // ... implement other render methods
}
```

---

## 🔐 보안

### CSRF 보호

항상 숨겨진 토큰을 포함하십시오.

```php
$form->addElement(new XoopsFormHiddenToken());

// Or automatic with useToken parameter
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### 제출 시 토큰 확인

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### 입력 삭제

```php
use Xmf\Request;

// Always sanitize input
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 전체 예

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

// Process form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // Get and validate input
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // Save to database
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

// Get categories for dropdown
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Build form
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

// Display
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 관련 문서

- 양식 요소 참조
- 양식 유효성 검사
- 사용자 정의 양식 렌더러
- CSRF 보호
- 입력 위생화

---

#xoops #forms #validation #security #ui #elements
