---
title: "Formularze XOOPS"
description: "Kompletny przewodnik po systemie generowania formularzy XOOPS, obejmujący wszystkie elementy formularza, walidację i renderowanie"
---

# 📝 System formularzy XOOPS

> Kompletne generowanie formularzy, walidacja i renderowanie dla modułów XOOPS.

---

## Przegląd

System formularzy XOOPS zapewnia potężne, zorientowane obiektowo podejście do tworzenia formularzy HTML. Obsługuje generowanie formularzy, walidację, ochronę CSRF i elastyczne renderowanie z obsługą różnych frameworków CSS.

---

## 🚀 Szybki start

### Podstawowe tworzenie formularza

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// Utwórz formularz
$form = new XoopsThemeForm(
    'Contact Form',           // Tytuł
    'contact_form',           // Nazwa
    'submit.php',             // Akcja
    'post',                   // Metoda
    true                      // Użyj tokena
);

// Dodaj elementy
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Renderuj
echo $form->render();
```

---

## 📦 Klasy formularza

### XoopsForm (klasa bazowa)

Abstrakcyjna klasa bazowa dla wszystkich formularzy.

```php
// Dostępne typy formularzy
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

Najczęściej używana klasa formularza, renderuje się z stylizacją motywu.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// Metody formularza
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Dodatkowe atrybuty HTML
$form->render();
$form->display();               // Wypisz bezpośrednio
```

---

## 🧩 Elementy formularza

### Wejście tekstowe

```php
// Jedno-liniowy tekst
$text = new XoopsFormText(
    'Username',     // Podpis
    'username',     // Nazwa
    50,             // Rozmiar
    255,            // Długość max
    $defaultValue   // Wartość domyślna
);

// Z placeholder
$text->setExtra('placeholder="Enter username"');
```

### Wejście hasła

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // Rozmiar
    255             // Długość max
);
```

### Textarea

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Wiersze
    60              // Kolumny
);
```

### Select dropdown

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // Rozmiar (1 = dropdown)
    false           // Wielokrotny
);

// Dodaj opcje
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// Lub dodaj tablicę
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
    5,              // Widoczne wiersze
    true            // Wielokrotny wybór
);
$multiSelect->addOptionArray($tagOptions);
```

### Checkbox

```php
// Pojedynczy checkbox
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // Zaznaczony jeśli wartość pasuje
);
$checkbox->addOption(1, 'Enable this feature');

// Wielokrotne checkboxy
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

### Radio buttons

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

### Wgrywanie pliku

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Rozmiar max w bajtach (1MB)
);

// Wielokrotne pliki
$file->setExtra('multiple accept="image/*"');
```

### Pole ukryte

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// Token CSRF (zawsze dołączaj!)
$token = new XoopsFormHiddenToken();
```

### Przycisk

```php
// Przycisk submit
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Przycisk reset
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Niestandardowy przycisk
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Etykieta (tylko do wyświetlania)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Selektor daty/czasu

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Rozmiar
    $timestamp      // Domyślny timestamp
);

// Tylko data (wejście tekstowe)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### Edytor WYSIWYG

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
    false,          // Brak HTML dozwolony
    'textarea'      // Fallback edytor
);
```

### Element Tray (elementy grupowe)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Walidacja formularza

### Pola wymagane

```php
// Oznacz jako wymagane (drugi parametr)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// Lub ustaw na elemencie
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Walidacja niestandardowa

```php
// Walidacja po stronie serwera
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Weryfikuj token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Pobierz oczyszczone wejście
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Waliduj
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // Pokaż błędy
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Przetwórz formularz
    }
}
```

### Walidacja po stronie klienta

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

## 🎨 Niestandardowe renderery

### Renderer Bootstrap 5

```php
// Zarejestruj niestandardowy renderer
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Teraz wszystkie formularze używają stylizacji Bootstrap 5
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### Tworzenie niestandardowego renderera

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

    // ... implementuj inne metody renderowania
}
```

---

## 🔐 Bezpieczeństwo

### Ochrona CSRF

Zawsze dołączaj token ukryty:

```php
$form->addElement(new XoopsFormHiddenToken());

// Lub automatycznie z parametrem useToken
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### Weryfikuj token na submit

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Czyszczenie wejścia

```php
use Xmf\Request;

// Zawsze czyszcz wejście
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Kompletny przykład

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

// Przetwórz formularz
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Weryfikuj CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // Pobierz i waliduj wejście
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // Zapisz do bazy danych
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

// Pobierz kategorie dla dropdown
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Zbuduj formularz
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

// Wyświetl
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Powiązana dokumentacja

- Form Elements Reference
- Form Validation
- Custom Form Renderers
- CSRF Protection
- Input Sanitization

---

#xoops #formularze #walidacja #bezpieczeństwo #ui #elementy
