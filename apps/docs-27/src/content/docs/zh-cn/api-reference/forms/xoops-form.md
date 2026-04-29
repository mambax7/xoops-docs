---
title：“XOOPSForm API参考”
description：“XOOPSForm 和表单元素类的完整API参考”
---

> 完成 XOOPS 表格生成系统的 API 文档。

---

## 类层次结构

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

## XOOPSForm（抽象基础）

### 构造函数

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

|方法|参数|返回|描述 |
|--------|------------|---------|------------|
| `addElement` | `XOOPSFormElement $element, bool $required = false` | `void` |添加元素到表单 |
| `getElements` | - | `array` |获取所有元素 |
| `getElement` | `string $name` | `XOOPSFormElement|null` |按名称获取元素 |
| `setExtra` | `string $extra`| `void` |设置额外的HTML属性|
| `getExtra` | - | `string` |获得额外属性 |
| `getTitle` | - | `string` |获取表单标题 |
| `setTitle` | `string $title` | `void` |设置表单标题 |
| `getName` | - | `string` |获取表单名称 |
| `getAction`| - | `string` |采取行动URL |
| `render` | - | `string` |渲染形式HTML |
| `display` | - | `void` |回声渲染形式 |
| `insertBreak` | `string $extra = ''` | `void` |插入视觉中断 |
| `setRequired` | `XOOPSFormElement $element` | `void` |需要标记元素 |

---

## XOOPS主题表单

最常用的表单类，以主题-aware样式呈现。

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

### 渲染输出

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

## 表单元素

### XOOPSFormText

单-line文本输入。

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

### XOOPSFormTextArea

多-line文本输入。

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

### XOOPSFormSelect

下拉菜单或多-select。

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

### XOOPSFormCheckBox

复选框或复选框组。

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

### XOOPSFormRadio

单选按钮组。

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

### XOOPSFormButton

提交、重置或自定义按钮。

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XOOPSFormFile

文件上传输入。

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

### XOOPSFormHidden

隐藏输入字段。

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XOOPSFormHiddenToken

CSRF保护令牌。

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XOOPSFormLabel

显示-only标签（不是输入）。

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XOOPSForm密码

密码输入字段。

```php
$password = new XoopsFormPassword(
    string $caption,
    string $name,
    int $size,
    int $maxlength,
    mixed $value = ''
);
```

### XOOPSFormElementTray

将多个元素组合在一起。

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

## 形成流程图

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

## 完整示例

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

## 相关文档

- XOOPSObject API
- 表格指南
- CSRF保护

---

#XOOPS #api #forms #XOOPSform #reference