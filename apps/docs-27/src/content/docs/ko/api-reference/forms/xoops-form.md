---
title: "XoopsForm API 참조"
description: "XoopsForm 및 양식 요소 클래스에 대한 완전한 API 참조"
---

> XOOPS 양식 생성 시스템에 대한 완전한 API 문서입니다.

---

## 클래스 계층

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

## XoopsForm(추상 베이스)

### 생성자

```php
public function __construct(
    string $title,      // Form title
    string $name,       // Form name attribute
    string $action,     // Form action URL
    string $method = 'post',  // HTTP method
    bool $addToken = false    // Add CSRF token
)
```

### 방법

| 방법 | 매개변수 | 반품 | 설명 |
|--------|------------|---------|-------------|
| `addElement` | `XoopsFormElement $element, bool $required = false` | `void` | 양식에 요소 추가 |
| `getElements` | - | `array` | 모든 요소 가져오기 |
| `getElement` | `string $name` | `XoopsFormElement|null` | 이름으로 요소 가져오기 |
| `setExtra` | `string $extra` | `void` | 추가 HTML 속성 설정 |
| `getExtra` | - | `string` | 추가 속성 얻기 |
| `getTitle` | - | `string` | 양식 제목 가져오기 |
| `setTitle` | `string $title` | `void` | 양식 제목 설정 |
| `getName` | - | `string` | 양식 이름 가져오기 |
| `getAction` | - | `string` | 작업 URL 가져오기 |
| `render` | - | `string` | 양식 HTML 렌더링 |
| `display` | - | `void` | 에코 렌더링 양식 |
| `insertBreak` | `string $extra = ''` | `void` | 시각적 중단 삽입 |
| `setRequired` | `XoopsFormElement $element` | `void` | 마크 요소 필수 |

---

## XoopsThemeForm

가장 일반적으로 사용되는 양식 클래스는 테마 인식 스타일로 렌더링됩니다.

### 사용법

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

### 렌더링된 출력

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

## 양식 요소

### XoopsFormText

한 줄 텍스트 입력.

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

여러 줄의 텍스트 입력.

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

드롭다운 또는 다중 선택.

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

체크박스 또는 체크박스 그룹.

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

라디오 버튼 그룹.

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

제출, 재설정 또는 사용자 정의 버튼.

```php
$button = new XoopsFormButton(
    string $caption,
    string $name,
    string $value = '',
    string $type = 'button'  // 'submit', 'reset', 'button'
);
```

### XoopsFormFile

파일 업로드 입력.

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

숨겨진 입력 필드.

```php
$hidden = new XoopsFormHidden(
    string $name,
    mixed $value
);
```

### XoopsFormHiddenToken

CSRF 보호 토큰.

```php
$token = new XoopsFormHiddenToken(
    string $name = 'XOOPS_TOKEN_REQUEST'
);
```

### XoopsFormLabel

표시 전용 레이블(입력 아님)

```php
$label = new XoopsFormLabel(
    string $caption,
    string $value
);
```

### XoopsFormPassword

비밀번호 입력란입니다.

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

여러 요소를 함께 그룹화합니다.

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

## 양식 흐름도

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

## 완전한 예

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

## 관련 문서

- XoopsObject API
- 양식 가이드
- CSRF 보호

---

#xoops #api #forms #xoopsform #참조
