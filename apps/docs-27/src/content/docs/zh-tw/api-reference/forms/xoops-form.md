---
title: "XoopsForm API 參考"
description: "XoopsForm 和表單元素類別的完整 API 參考"
---

> XOOPS 表單產生系統的完整 API 文件。

---

## 類別階層

```mermaid
classDiagram
    class XoopsForm {
        <<abstract>>
        #string $title
        #string $name
        #string $action
        #string $method
        #array $elements
        #string $extra
        #bool $required
        +addElement(element, required)
        +getElements()
        +getElement(name)
        +setExtra(extra)
        +render()
        +display()
    }

    class XoopsThemeForm {
        +render()
    }

    class XoopsSimpleForm {
        +render()
    }

    class XoopsTableForm {
        +render()
    }

    XoopsForm <|-- XoopsThemeForm
    XoopsForm <|-- XoopsSimpleForm
    XoopsForm <|-- XoopsTableForm

    class XoopsFormElement {
        <<abstract>>
        #string $name
        #string $caption
        #string $description
        #string $extra
        #bool $required
        +getName()
        +getCaption()
        +setCaption(caption)
        +getDescription()
        +setDescription(desc)
        +isRequired()
        +setRequired(required)
        +render()
    }

    XoopsFormElement <|-- XoopsFormText
    XoopsFormElement <|-- XoopsFormTextArea
    XoopsFormElement <|-- XoopsFormSelect
    XoopsFormElement <|-- XoopsFormCheckBox
    XoopsFormElement <|-- XoopsFormRadio
    XoopsFormElement <|-- XoopsFormButton
    XoopsFormElement <|-- XoopsFormFile
    XoopsFormElement <|-- XoopsFormHidden
    XoopsFormElement <|-- XoopsFormLabel
    XoopsFormElement <|-- XoopsFormPassword
    XoopsFormElement <|-- XoopsFormElementTray
```

---

## XoopsForm（抽象基礎）

### 建構函式

```php
public function __construct(
    string $title,      // Form title
    string $name,       // Form name attribute
    string $action,     // Form action URL
    string $method = 'post',  // HTTP method
    bool $addToken = false    // Add CSRF token
)
```

### 方法

| 方法 | 參數 | 傳回值 | 描述 |
|--------|------------|---------|-------------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | 將元素添加到表單 |
| `getElements` | - | `array` | 取得所有元素 |
| `getElement` | `string $name` | `XoopsFormElement|null` | 按名稱取得元素 |
| `setExtra` | `string $extra` | `void` | 設定額外 HTML 屬性 |
| `getExtra` | - | `string` | 取得額外屬性 |
| `getTitle` | - | `string` | 取得表單標題 |
| `setTitle` | `string $title` | `void` | 設定表單標題 |
| `getName` | - | `string` | 取得表單名稱 |
| `getAction` | - | `string` | 取得操作 URL |
| `render` | - | `string` | 呈現表單 HTML |
| `display` | - | `void` | 輸出呈現的表單 |
| `insertBreak` | `string $extra = ''` | `void` | 插入視覺中斷 |
| `setRequired` | `XoopsFormElement $element` | `void` | 標記元素為必需的 |

---

## XoopsThemeForm

最常用的表單類別，使用主題感知樣式呈現。

### 用法

```php
<?php
$form = new XoopsThemeForm(
    'User Registration',
    'registration_form',
    'register.php',
    'post',
    true  // Include CSRF token
);

$form->addElement(new XoopsFormText('Username', 'uname', 25, 255, ''), true);
$form->addElement(new XoopsFormPassword('Password', 'pass', 25, 255), true);
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

echo $form->render();
```

### 呈現輸出

```html
<form name="registration_form" action="register.php" method="post"
      enctype="application/x-www-form-urlencoded">
  <table class="outer" cellspacing="1">
    <tr><th colspan="2">User Registration</th></tr>
    <tr class="odd">
      <td class="head">Username <span class="required">*</span></td>
      <td class="even">
        <input type="text" name="uname" size="25" maxlength="255" value="">
      </td>
    </tr>
    <!-- ... more fields ... -->
  </table>
  <input type="hidden" name="XOOPS_TOKEN_REQUEST" value="...">
</form>
```

---

## 表單元素

### XoopsFormText

單行文字輸入。

```php
$text = new XoopsFormText(
    string $caption,    // Label text
    string $name,       // Input name
    int $size,          // Display width
    int $maxlength,     // Max characters
    mixed $value = ''   // Default value
);

// Methods
$text->getValue();
$text->setValue($value);
$text->getSize();
$text->getMaxlength();
```

### XoopsFormTextArea

多行文字輸入。

```php
$textarea = new XoopsFormTextArea(
    string $caption,
    string $name,
    mixed $value = '',
    int $rows = 5,
    int $cols = 50
);

// Methods
$textarea->getRows();
$textarea->getCols();
```

### XoopsFormSelect

下拉式清單或多選清單。

```php
$select = new XoopsFormSelect(
    string $caption,
    string $name,
    mixed $value = null,
    int $size = 1,        // 1 = dropdown, >1 = listbox
    bool $multiple = false
);

// Methods
$select->addOption(mixed $value, string $name = '');
$select->addOptionArray(array $options);
$select->getOptions();
$select->getValue();
$select->isMultiple();
```

### XoopsFormCheckBox

核取方塊或核取方塊群組。

```php
$checkbox = new XoopsFormCheckBox(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Methods
$checkbox->addOption(mixed $value, string $name = '');
$checkbox->addOptionArray(array $options);
$checkbox->getValue();
```

### XoopsFormRadio

單選按鈕群組。

```php
$radio = new XoopsFormRadio(
    string $caption,
    string $name,
    mixed $value = null,
    string $delimeter = '&nbsp;'
);

// Methods
$radio->addOption(mixed $value, string $name = '');
$radio->addOptionArray(array $options);
```

### XoopsFormButton

提交、重置或自訂按鈕。

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XoopsFormFile

檔案上載輸入。

```php
$file = new XoopsFormFile(
    string $caption,
    string $name,
    int $maxFileSize = 0
);

// Methods
$file->getMaxFileSize();
$file->setMaxFileSize(int $size);
```

### XoopsFormHidden

隱藏輸入欄位。

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XoopsFormHiddenToken

CSRF 保護權杖。

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XoopsFormLabel

僅顯示標籤（不是輸入）。

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XoopsFormPassword

密碼輸入欄位。

```php
$password = new XoopsFormPassword(
    string $caption,
    string $name,
    int $size,
    int $maxlength,
    mixed $value = ''
);
```

### XoopsFormElementTray

將多個元素分組在一起。

```php
$tray = new XoopsFormElementTray(
    string $caption,
    string $delimeter = '&nbsp;'
);

// Methods
$tray->addElement(XoopsFormElement $element, bool $required = false);
$tray->getElements();
```

---

## 表單流程圖

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Form
    participant Security
    participant Handler
    participant Database

    User->>Browser: Fill form
    Browser->>Form: Submit POST
    Form->>Security: Validate CSRF token

    alt Token Invalid
        Security-->>Browser: Error: Invalid token
        Browser-->>User: Show error
    else Token Valid
        Security->>Handler: Process data
        Handler->>Handler: Validate input

        alt Validation Failed
            Handler-->>Browser: Show form with errors
            Browser-->>User: Display errors
        else Validation Passed
            Handler->>Database: Save data
            Database-->>Handler: Success
            Handler-->>Browser: Redirect
            Browser-->>User: Success message
        end
    end
```

---

## 完整範例

```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$helper = \XoopsModules\MyModule\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Process form submission
if (Request::hasVar('submit', 'POST')) {
    // Verify CSRF token
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    }

    // Get validated input
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    // Create and populate object
    $item = $itemHandler->create();
    $item->setVars([
        'title' => $title,
        'content' => $content,
        'category_id' => $categoryId,
        'status' => $status,
        'created' => time(),
        'uid' => $GLOBALS['xoopsUser']->getVar('uid')
    ]);

    // Save
    if ($itemHandler->insert($item)) {
        redirect_header('index.php', 2, _MD_MYMODULE_SAVED);
    } else {
        $error = _MD_MYMODULE_ERROR_SAVING;
    }
}

// Build form
$form = new XoopsThemeForm(_MD_MYMODULE_ADD_ITEM, 'itemform', 'form.php', 'post', true);

// Title field
$titleElement = new XoopsFormText(_MD_MYMODULE_TITLE, 'title', 50, 255, $title ?? '');
$titleElement->setDescription(_MD_MYMODULE_TITLE_DESC);
$form->addElement($titleElement, true);

// Category dropdown
$categoryHandler = $helper->getHandler('Category');
$categories = $categoryHandler->getList();
$categorySelect = new XoopsFormSelect(_MD_MYMODULE_CATEGORY, 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

// Content textarea with editor
$editorConfigs = [
    'name' => 'content',
    'value' => $content ?? '',
    'rows' => 15,
    'cols' => 60,
    'width' => '100%',
    'height' => '400px',
];
$form->addElement(new XoopsFormEditor(_MD_MYMODULE_CONTENT, 'content', $editorConfigs));

// Status radio buttons
$statusRadio = new XoopsFormRadio(_MD_MYMODULE_STATUS, 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => _MD_MYMODULE_DRAFT,
    'published' => _MD_MYMODULE_PUBLISHED,
    'archived' => _MD_MYMODULE_ARCHIVED
]);
$form->addElement($statusRadio);

// Submit button
$buttonTray = new XoopsFormElementTray('', '&nbsp;');
$buttonTray->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
$buttonTray->addElement(new XoopsFormButton('', 'reset', _CANCEL, 'reset'));
$form->addElement($buttonTray);

// Display
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 相關文件

- XoopsObject API
- Forms Guide
- CSRF Protection

---

#xoops #api #forms #xoopsform #reference
