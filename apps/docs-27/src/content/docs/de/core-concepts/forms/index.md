---
title: "XOOPS Forms"
description: "Vollständiger Leitfaden zum XOOPS Form-Generierungssystem, einschließlich aller Form-Elemente, Validierung und Rendering"
---

# 📝 XOOPS Form System

> Umfassende Form-Generierung, Validierung und Rendering für XOOPS Module.

---

## Übersicht

Das XOOPS Form System bietet einen leistungsstarken, objektorientierten Ansatz zur Erstellung von HTML-Formularen. Es handelt Formulargenerierung, Validierung, CSRF-Schutz und flexibles Rendering mit Unterstützung für verschiedene CSS-Frameworks.

---

## 🚀 Quick Start

### Basis Form-Erstellung

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// Form erstellen
$form = new XoopsThemeForm(
    'Contact Form',           // Title
    'contact_form',           // Name
    'submit.php',             // Action
    'post',                   // Method
    true                      // Use token
);

// Elemente hinzufügen
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Rendern
echo $form->render();
```

---

## 📦 Form Klassen

### XoopsForm (Base Class)

Die abstrakte Basisklasse für alle Formulare.

```php
// Verfügbare Form-Typen
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

Die am häufigsten verwendete Form-Klasse, wird mit Theme-Styling gerendert.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// Form Methoden
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Extra HTML Attribute
$form->render();
$form->display();               // Echo direkt
```

---

## 🧩 Form Elemente

### Text Input

```php
// Einzeiliger Text
$text = new XoopsFormText(
    'Username',     // Caption
    'username',     // Name
    50,             // Size
    255,            // Max length
    $defaultValue   // Default value
);

// Mit Placeholder
$text->setExtra('placeholder="Enter username"');
```

### Password Input

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

### Select Dropdown

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // Size (1 = dropdown)
    false           // Multiple
);

// Optionen hinzufügen
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// Oder Array hinzufügen
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### Multi-Select

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

### Checkbox

```php
// Einzelne Checkbox
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // Checked wenn Wert passt
);
$checkbox->addOption(1, 'Enable this feature');

// Mehrere Checkboxes
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

### Radio Buttons

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

### File Upload

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Max Größe in Bytes (1MB)
);

// Mehrere Dateien
$file->setExtra('multiple accept="image/*"');
```

### Hidden Field

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// CSRF Token (immer einschließen!)
$token = new XoopsFormHiddenToken();
```

### Button

```php
// Submit Button
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Reset Button
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Custom Button
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Label (Display Only)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Date/Time Picker

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Size
    $timestamp      // Default timestamp
);

// Nur Datum (Text Input)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### WYSIWYG Editor

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

### Element Tray (Elemente gruppieren)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Form Validierung

### Erforderliche Felder

```php
// Markieren Sie als erforderlich (zweiter Parameter)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// Oder auf Element setzen
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Custom Validierung

```php
// Server-seitige Validierung
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF Token verifizieren
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Bereinigte Eingabe abrufen
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Validierung
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // Fehler anzeigen
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Form verarbeiten
    }
}
```

### Client-Side Validierung

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

## 🎨 Custom Renderers

### Bootstrap 5 Renderer

```php
// Custom Renderer registrieren
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Jetzt nutzen alle Forms Bootstrap 5 Styling
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### Custom Renderer erstellen

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

    // ... andere Render-Methoden implementieren
}
```

---

## 🔐 Sicherheit

### CSRF Schutz

Immer das Hidden Token einschließen:

```php
$form->addElement(new XoopsFormHiddenToken());

// Oder automatisch mit useToken Parameter
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### Token beim Submit verifizieren

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Input Sanitization

```php
use Xmf\Request;

// Immer Eingabe bereinigen
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Komplettes Beispiel

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

// Form verarbeiten
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF verifizieren
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // Eingabe abrufen und validieren
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // In Datenbank speichern
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

// Kategorien für Dropdown abrufen
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Form bauen
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

// Anzeigen
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Verwandte Dokumentation

- Form Elements Reference
- Form Validation
- Custom Form Renderers
- CSRF Protection
- Input Sanitization

---

#xoops #forms #validation #security #ui #elements
