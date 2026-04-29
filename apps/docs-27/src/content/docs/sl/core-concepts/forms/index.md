---
title: "XOOPS Obrazci"
description: "Popoln vodnik po sistemu za generiranje obrazcev XOOPS, vključno z vsemi elementi obrazcev, preverjanjem veljavnosti in upodabljanjem"
---
# 📝 XOOPS Sistem obrazcev

> Izčrpno ustvarjanje, preverjanje in upodabljanje obrazcev za module XOOPS.

---

## Pregled

Sistem obrazcev XOOPS zagotavlja zmogljiv, objektno usmerjen pristop k ustvarjanju obrazcev HTML. Ukvarja se z ustvarjanjem obrazcev, preverjanjem, zaščito CSRF in prilagodljivim upodabljanjem s podporo za različna ogrodja CSS.

---

## 🚀 Hiter začetek

### Ustvarjanje osnovnega obrazca
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

## 📦 Oblikujte razrede

### XoopsForm (osnovni razred)

Abstraktni osnovni razred za vse oblike.
```php
// Available form types
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```
### XoopsThemeForm

Najpogosteje uporabljen razred oblike, upodobitve s stilom teme.
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

## 🧩 Elementi obrazca

### Vnos besedila
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
### Vnos gesla
```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // Size
    255             // Max length
);
```
### Textarea
```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Rows
    60              // Cols
);
```
### Izberite spustni meni
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
### Večkratna izbira
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
### Potrditveno polje
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
### Radijski gumbi
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
### Nalaganje datoteke
```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Max size in bytes (1MB)
);

// Multiple files
$file->setExtra('multiple accept="image/*"');
```
### Skrito polje
```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// CSRF Token (always include!)
$token = new XoopsFormHiddenToken();
```
### Gumb
```php
// Submit button
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Reset button
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Custom button
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```
### Oznaka (samo prikaz)
```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```
### Date/Time Izbirnik
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
### WYSIWYG Urednik
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
### Pladenj za elemente (Elementi skupine)
```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```
---

## ✅ Preverjanje obrazca

### Obvezna polja
```php
// Mark as required (second parameter)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// Or set on element
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```
### Preverjanje po meri
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
### Preverjanje na strani odjemalca
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

## 🎨 Upodabljalniki po meri

### Upodabljalnik Bootstrap 5
```php
// Register custom renderer
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Now all forms use Bootstrap 5 styling
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```
### Ustvarjanje upodabljalnika po meri
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

## 🔐 Varnost

### CSRF Zaščita

Vedno vključite skriti žeton:
```php
$form->addElement(new XoopsFormHiddenToken());

// Or automatic with useToken parameter
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```
### Preveri žeton ob predložitvi
```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```
### Sanitizacija vnosa
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

## 📋 Celoten primer
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

## 🔗 Povezana dokumentacija

- Referenca elementov obrazca
- Preverjanje obrazca
- Upodabljalniki obrazcev po meri
- CSRF Zaščita
- Sanitizacija vhoda

---

#XOOPS #forms #validation #security #ui #elements