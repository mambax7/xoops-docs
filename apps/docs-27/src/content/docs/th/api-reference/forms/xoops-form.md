---
title: "XoopsForm API ข้อมูลอ้างอิง"
description: "กรอกการอ้างอิง API สำหรับ XoopsForm และคลาสองค์ประกอบแบบฟอร์ม"
---
> กรอกเอกสาร API สำหรับระบบการสร้างแบบฟอร์ม XOOPS ให้ครบถ้วน

---

## ลำดับชั้นของชั้นเรียน
```
mermaid
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

## XoopsForm (ฐานนามธรรม)

### ตัวสร้าง
```php
public function __construct(
    string $title,      // Form title
    string $name,       // Form name attribute
    string $action,     // Form action URL
    string $method = 'post',  // HTTP method
    bool $addToken = false    // Add CSRF token
)
```
### วิธีการ

| วิธีการ | พารามิเตอร์ | ส่งคืน | คำอธิบาย |
|--------|------------|---------|-------------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | เพิ่มองค์ประกอบในรูปแบบ |
| `getElements` | - | `array` | รับองค์ประกอบทั้งหมด |
| `getElement` | `string $name` | `XoopsFormElement|null` | รับองค์ประกอบตามชื่อ |
| `setExtra` | `string $extra` | `void` | ตั้งค่าแอตทริบิวต์ HTML เพิ่มเติม |
| `getExtra` | - | `string` | รับคุณสมบัติพิเศษ |
| `getTitle` | - | `string` | รับชื่อฟอร์ม |
| `setTitle` | `string $title` | `void` | ตั้งชื่อแบบฟอร์ม |
| `getName` | - | `string` | รับชื่อฟอร์ม |
| `getAction` | - | `string` | รับการดำเนินการ URL |
| `render` | - | `string` | แสดงผลแบบฟอร์ม HTML |
| `display` | - | `void` | แบบฟอร์มการแสดงผล Echo |
| `insertBreak` | `string $extra = ''` | `void` | แทรกตัวแบ่งภาพ |
| `setRequired` | `XoopsFormElement $element` | `void` | ทำเครื่องหมายองค์ประกอบที่ต้องการ |

---

## XoopsThemeForm

คลาสฟอร์มที่ใช้บ่อยที่สุด เรนเดอร์ด้วยสไตล์ตามธีม

### การใช้งาน
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
### เอาต์พุตที่แสดงผล
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

## องค์ประกอบของแบบฟอร์ม

### XoopsFormText

การป้อนข้อความบรรทัดเดียว
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

การป้อนข้อความหลายบรรทัด
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

ดรอปดาวน์หรือเลือกหลายรายการ
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

ช่องทำเครื่องหมายหรือกลุ่มช่องทำเครื่องหมาย
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

กลุ่มปุ่มตัวเลือก
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

ปุ่มส่ง รีเซ็ต หรือกำหนดเอง
```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```
### XoopsFormFile

อินพุตการอัพโหลดไฟล์
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

ช่องป้อนข้อมูลที่ซ่อนอยู่
```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```
### XoopsFormHiddenToken

โทเค็นการป้องกัน CSRF
```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```
### XoopsFormLabel

ป้ายกำกับที่แสดงอย่างเดียว (ไม่ใช่อินพุต)
```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```
### XoopsFormPassword

ช่องป้อนรหัสผ่าน
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

จัดกลุ่มองค์ประกอบหลายรายการเข้าด้วยกัน
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

## แผนภาพการไหลของแบบฟอร์ม
```
mermaid
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

## ตัวอย่างที่สมบูรณ์
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

## เอกสารที่เกี่ยวข้อง

- XoopsObject API
- คู่มือแบบฟอร์ม
- CSRF การป้องกัน

---

#xoops #api #forms #xoopsform #reference