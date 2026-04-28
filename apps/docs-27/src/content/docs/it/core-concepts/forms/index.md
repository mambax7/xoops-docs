---
title: "Moduli XOOPS"
description: "Guida completa al sistema di generazione dei moduli XOOPS, inclusi tutti gli elementi del modulo, la validazione e il rendering"
---

# 📝 Sistema moduli XOOPS

> Generazione completa di moduli, validazione e rendering per i moduli XOOPS.

---

## Panoramica

Il sistema di moduli XOOPS fornisce un approccio potente e orientato agli oggetti per la creazione di moduli HTML. Gestisce la generazione di moduli, la validazione, la protezione CSRF e il rendering flessibile con supporto per vari framework CSS.

---

## 🚀 Avvio rapido

### Creazione di moduli di base

```php
<?php
use XoopsFormButton;
use XoopsFormHidden;
use XoopsFormHiddenToken;
use XoopsFormText;
use XoopsThemeForm;

// Crea un modulo
$form = new XoopsThemeForm(
    'Contact Form',           // Titolo
    'contact_form',           // Nome
    'submit.php',             // Azione
    'post',                   // Metodo
    true                      // Usa token
);

// Aggiungi elementi
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);
$form->addElement(new XoopsFormText('Email', 'email', 50, 255, ''), true);
$form->addElement(new XoopsFormTextArea('Message', 'message', '', 5, 60), true);
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

// Rendering
echo $form->render();
```

---

## 📦 Classi di moduli

### XoopsForm (classe base)

La classe base astratta per tutti i moduli.

```php
// Tipi di modulo disponibili
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

La classe di modulo più comunemente utilizzata, esegue il rendering con lo stile del tema.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// Metodi dei moduli
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Attributi HTML extra
$form->render();
$form->display();               // Echo diretto
```

---

## 🧩 Elementi del modulo

### Input di testo

```php
// Testo a riga singola
$text = new XoopsFormText(
    'Username',     // Didascalia
    'username',     // Nome
    50,             // Dimensione
    255,            // Lunghezza massima
    $defaultValue   // Valore predefinito
);

// Con placeholder
$text->setExtra('placeholder="Enter username"');
```

### Input di password

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // Dimensione
    255             // Lunghezza massima
);
```

### Textarea

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Righe
    60              // Colonne
);
```

### Elenco a discesa di selezione

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // Dimensione (1 = elenco a discesa)
    false           // Multiplo
);

// Aggiungi opzioni
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// Oppure aggiungi array
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### Selezione multipla

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // Righe visibili
    true            // Selezione multipla
);
$multiSelect->addOptionArray($tagOptions);
```

### Casella di controllo

```php
// Casella di controllo singola
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // Selezionato se il valore corrisponde
);
$checkbox->addOption(1, 'Enable this feature');

// Più caselle di controllo
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

### Pulsanti radio

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

### Caricamento file

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Dimensione massima in byte (1MB)
);

// File multipli
$file->setExtra('multiple accept="image/*"');
```

### Campo nascosto

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// Token CSRF (sempre includi!)
$token = new XoopsFormHiddenToken();
```

### Pulsante

```php
// Pulsante di invio
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Pulsante di reset
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Pulsante personalizzato
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Etichetta (solo visualizzazione)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Selettore data/ora

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Dimensione
    $timestamp      // Timestamp predefinito
);

// Solo data (input di testo)
$dateText = new XoopsFormTextDateSelect(
    'Event Date',
    'event_date',
    15,
    $timestamp
);
```

### Editor WYSIWYG

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
    false,          // HTML non consentito
    'textarea'      // Editor alternativo
);
```

### Element Tray (Raggruppa elementi)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Validazione modulo

### Campi obbligatori

```php
// Contrassegna come obbligatorio (secondo parametro)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// O imposta su elemento
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Validazione personalizzata

```php
// Validazione lato server
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Ottieni input sanificato
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Valida
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // Mostra errori
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Elabora il modulo
    }
}
```

### Validazione lato client

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

## 🎨 Renderer personalizzati

### Renderer Bootstrap 5

```php
// Registra renderer personalizzato
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Ora tutti i moduli utilizzano lo stile Bootstrap 5
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### Creazione di renderer personalizzato

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

    // ... implementa altri metodi di rendering
}
```

---

## 🔐 Sicurezza

### Protezione CSRF

Includi sempre il token nascosto:

```php
$form->addElement(new XoopsFormHiddenToken());

// O automatico con parametro useToken
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### Verifica token all'invio

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Sanificazione dell'input

```php
use Xmf\Request;

// Sanifica sempre l'input
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Esempio completo

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

// Elabora il modulo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // Ottieni e valida l'input
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // Salva nel database
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

// Ottieni categorie per il dropdown
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Costruisci modulo
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

// Visualizza
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Documentazione correlata

- Riferimento elementi modulo
- Validazione modulo
- Renderer modulo personalizzati
- Protezione CSRF
- Sanificazione dell'input

---

#xoops #forms #validation #security #ui #elements
