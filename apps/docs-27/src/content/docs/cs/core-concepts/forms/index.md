---
title: "Formuláře XOOPS"
description: "Kompletní průvodce systémem generování formulářů XOOPS, včetně všech prvků formuláře, ověřování a vykreslování"
---

# 📝 Formulářový systém XOOPS

> Komplexní generování, ověřování a vykreslování formulářů pro moduly XOOPS.

---

## Přehled

Formulářový systém XOOPS poskytuje výkonný, objektově orientovaný přístup k vytváření formulářů HTML. Zvládá generování formulářů, ověřování, ochranu CSRF a flexibilní vykreslování s podporou různých rámců CSS.

---

## 🚀 Rychlý start

### Vytvoření základního formuláře

```php
<?php
use XOOPSFormButton;
use XOOPSFormHidden;
use XOOPSFormHiddenToken;
use XOOPSFormText;
use XOOPSThemeForm;

// Create a form
$form = new XOOPSThemeForm(
    'Contact Form',           // Title
    'contact_form',           // Name
    'submit.php',             // Action
    'post',                   // Method
    true                      // Use token
);

// Add elements
$form->addElement(new XOOPSFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XOOPSFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XOOPSFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XOOPSFormHiddenToken());
$form->addElement(new XOOPSFormButton('', 'submit', _SUBMIT, 'submit'));

// Render
echo $form->render();
```

---

## 📦 Třídy formulářů

### XOOPSForm (základní třída)

Abstraktní základní třída pro všechny formy.

```php
// Available form types
$simpleForm = new XOOPSSimpleForm($title, $name, $action, $method);
$themeForm = new XOOPSThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XOOPSTableForm($title, $name, $action, $method, $addToken);
```

### XOOPSThemeForm

Nejčastěji používaná třída formulářů, rendery se styly motivu.

```php
$form = new XOOPSThemeForm('My Form', 'myform', 'process.php', 'post', true);

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

## 🧩 Prvky formuláře

### Textový vstup

```php
// Single-line text
$text = new XOOPSFormText(
    'Username',     // Caption
    'username',     // Name
    50,             // Size
    255,            // Max length
    $defaultValue   // Default value
);

// With placeholder
$text->setExtra('placeholder="Enter username"');
```

### Zadání hesla

```php
$password = new XOOPSFormPassword(
    'Password',
    'password',
    50,             // Size
    255             // Max length
);
```

### Textová oblast

```php
$textarea = new XOOPSFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Rows
    60              // Cols
);
```

### Vyberte rozbalovací nabídku

```php
$select = new XOOPSFormSelect(
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

### Vícenásobný výběr

```php
$multiSelect = new XOOPSFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // Visible rows
    true            // Multiple selection
);
$multiSelect->addOptionArray($tagOptions);
```

### Zaškrtávací políčko

```php
// Single checkbox
$checkbox = new XOOPSFormCheckBox(
    'Active',
    'active',
    1               // Checked if value matches
);
$checkbox->addOption(1, 'Enable this feature');

// Multiple checkboxes
$checkboxGroup = new XOOPSFormCheckBox(
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

### Přepínače

```php
$radio = new XOOPSFormRadio(
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

### Nahrání souboru

```php
$file = new XOOPSFormFile(
    'Upload Image',
    'image',
    1048576         // Max size in bytes (1MB)
);

// Multiple files
$file->setExtra('multiple accept="image/*"');
```

### Skryté pole

```php
$hidden = new XOOPSFormHidden('item_id', $itemId);

// CSRF Token (always include!)
$token = new XOOPSFormHiddenToken();
```

### Tlačítko

```php
// Submit button
$submit = new XOOPSFormButton('', 'submit', _SUBMIT, 'submit');

// Reset button
$reset = new XOOPSFormButton('', 'reset', _CANCEL, 'reset');

// Custom button
$custom = new XOOPSFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Štítek (pouze zobrazení)

```php
$label = new XOOPSFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Sběrač Date/Time

```php
$date = new XOOPSFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Size
    $timestamp      // Default timestamp
);

// Date only (text input)
$dateText = new XOOPSFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### Editor WYSIWYG

```php
$editor = new XOOPSFormEditor(
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

### Panel prvků (prvky skupiny)

```php
$tray = new XOOPSFormElementTray('Date Range', ' - ');
$tray->addElement(new XOOPSFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XOOPSFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Ověření formuláře

### Povinná pole

```php
// Mark as required (second parameter)
$form->addElement(new XOOPSFormText('Name', 'name', 50, 255, ''), true);

// Or set on element
$element = new XOOPSFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Vlastní ověření

```php
// Server-side validation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Get sanitized input
    $name = \XMF\Request::getString('name', '', 'POST');
    $email = \XMF\Request::getString('email', '', 'POST');

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

### Ověření na straně klienta

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

## 🎨 Vlastní renderery

### Bootstrap 5 Renderer

```php
// Register custom renderer
XOOPSFormRenderer::getInstance()->set(
    new XOOPSFormRendererBootstrap5()
);

// Now all forms use Bootstrap 5 styling
$form = new XOOPSThemeForm('My Form', 'myform', 'process.php');
```

### Vytvoření vlastního vykreslovače

```php
<?php

class XOOPSFormRendererBulma implements XOOPSFormRendererInterface
{
    public function renderFormText(XOOPSFormText $element): string
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

    public function renderFormSelect(XOOPSFormSelect $element): string
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

## 🔐 Zabezpečení

### Ochrana CSRF

Vždy zahrňte skrytý token:

```php
$form->addElement(new XOOPSFormHiddenToken());

// Or automatic with useToken parameter
$form = new XOOPSThemeForm('Form', 'form', 'action.php', 'post', true);
```

### Při odeslání ověřte token

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Sanitizace vstupu

```php
use XMF\Request;

// Always sanitize input
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Úplný příklad

```php
<?php
require_once dirname(__DIR__) . '/mainfile.php';

use XMF\Request;
use XOOPSFormButton;
use XOOPSFormHiddenToken;
use XOOPSFormRadio;
use XOOPSFormSelect;
use XOOPSFormText;
use XOOPSFormTextArea;
use XOOPSThemeForm;

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
$form = new XOOPSThemeForm('Add New Item', 'item_form', 'form.php', 'post', true);

$form->addElement(new XOOPSFormText('Title', 'title', 50, 255, $title ?? ''), true);

$categorySelect = new XOOPSFormSelect('Category', 'category_id', $categoryId ?? 0);
$categorySelect->addOptionArray($categories);
$form->addElement($categorySelect, true);

$form->addElement(new XOOPSFormTextArea('Content', 'content', $content ?? '', 10, 60));

$statusRadio = new XOOPSFormRadio('Status', 'status', $status ?? 'draft');
$statusRadio->addOptionArray([
    'draft' => 'Draft',
    'published' => 'Published'
]);
$form->addElement($statusRadio);

$form->addElement(new XOOPSFormHiddenToken());
$form->addElement(new XOOPSFormButton('', 'submit', _SUBMIT, 'submit'));

// Display
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Související dokumentace

- Odkaz na prvky formuláře
- Ověření formuláře
- Custom Form Renderers
- Ochrana CSRF
- Dezinfekce vstupu

---

#xoops #formuláře #ověření #zabezpečení #ui #prvky