---
title: "Formularios XOOPS"
description: "Guía completa del sistema de generación de formularios de XOOPS, incluidos todos los elementos de formulario, validación y representación"
---

# 📝 Sistema de formularios de XOOPS

> Generación de formularios, validación y representación completas para módulos XOOPS.

---

## Descripción general

El sistema de formularios de XOOPS proporciona un enfoque potente y orientado a objetos para crear formularios HTML. Maneja la generación de formularios, validación, protección CSRF y representación flexible con soporte para varios marcos CSS.

---

## 🚀 Inicio rápido

### Creación básica de formularios

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

## 📦 Clases de formulario

### XoopsForm (clase base)

La clase base abstracta para todos los formularios.

```php
// Tipos de formularios disponibles
$simpleForm = new XoopsSimpleForm($title, $name, $action, $method);
$themeForm = new XoopsThemeForm($title, $name, $action, $method, $addToken);
$tableForm = new XoopsTableForm($title, $name, $action, $method, $addToken);
```

### XoopsThemeForm

La clase de formulario más utilizada, se representa con el estilo del tema.

```php
$form = new XoopsThemeForm('My Form', 'myform', 'process.php', 'post', true);

// Métodos de formulario
$form->addElement($element, $required = false);
$form->insertElement($position, $element, $required = false);
$form->getElement($name);
$form->getElements();
$form->setExtra($extra);        // Atributos HTML adicionales
$form->render();
$form->display();               // Mostrar directamente
```

---

## 🧩 Elementos del formulario

### Entrada de texto

```php
// Texto de una sola línea
$text = new XoopsFormText(
    'Username',     // Título
    'username',     // Nombre
    50,             // Tamaño
    255,            // Longitud máxima
    $defaultValue   // Valor predeterminado
);

// Con marcador de posición
$text->setExtra('placeholder="Enter username"');
```

### Entrada de contraseña

```php
$password = new XoopsFormPassword(
    'Password',
    'password',
    50,             // Tamaño
    255             // Longitud máxima
);
```

### Área de texto

```php
$textarea = new XoopsFormTextArea(
    'Description',
    'description',
    $defaultValue,
    5,              // Filas
    60              // Columnas
);
```

### Desplegable de selección

```php
$select = new XoopsFormSelect(
    'Category',
    'category_id',
    $defaultValue,
    1,              // Tamaño (1 = desplegable)
    false           // Múltiple
);

// Agregar opciones
$select->addOption(1, 'Option 1');
$select->addOption(2, 'Option 2');

// O agregar matriz
$options = [
    1 => 'Category A',
    2 => 'Category B',
    3 => 'Category C'
];
$select->addOptionArray($options);
```

### Selección múltiple

```php
$multiSelect = new XoopsFormSelect(
    'Tags',
    'tags[]',
    $selectedValues,
    5,              // Filas visibles
    true            // Selección múltiple
);
$multiSelect->addOptionArray($tagOptions);
```

### Casilla de verificación

```php
// Casilla de verificación única
$checkbox = new XoopsFormCheckBox(
    'Active',
    'active',
    1               // Marcado si el valor coincide
);
$checkbox->addOption(1, 'Enable this feature');

// Múltiples casillas de verificación
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

### Botones de radio

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

### Carga de archivo

```php
$file = new XoopsFormFile(
    'Upload Image',
    'image',
    1048576         // Tamaño máximo en bytes (1 MB)
);

// Múltiples archivos
$file->setExtra('multiple accept="image/*"');
```

### Campo oculto

```php
$hidden = new XoopsFormHidden('item_id', $itemId);

// Token CSRF (siempre incluir!)
$token = new XoopsFormHiddenToken();
```

### Botón

```php
// Botón de envío
$submit = new XoopsFormButton('', 'submit', _SUBMIT, 'submit');

// Botón de restablecimiento
$reset = new XoopsFormButton('', 'reset', _CANCEL, 'reset');

// Botón personalizado
$custom = new XoopsFormButton('', 'preview', 'Preview', 'button');
$custom->setExtra('onclick="previewContent()"');
```

### Etiqueta (solo para mostrar)

```php
$label = new XoopsFormLabel(
    'Created',
    date('Y-m-d H:i:s', $item->getVar('created'))
);
```

### Selector de fecha/hora

```php
$date = new XoopsFormDateTime(
    'Publish Date',
    'publish_date',
    15,             // Tamaño
    $timestamp      // Marca de tiempo predeterminada
);

// Solo la fecha (entrada de texto)
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
    false,          // Sin HTML permitido
    'textarea'      // Editor de respaldo
);
```

### Bandeja de elemento (agrupar elementos)

```php
$tray = new XoopsFormElementTray('Date Range', ' - ');
$tray->addElement(new XoopsFormTextDateSelect('', 'start_date', 10, $startDate));
$tray->addElement(new XoopsFormTextDateSelect('', 'end_date', 10, $endDate));
$form->addElement($tray);
```

---

## ✅ Validación del formulario

### Campos requeridos

```php
// Marcar como requerido (segundo parámetro)
$form->addElement(new XoopsFormText('Name', 'name', 50, 255, ''), true);

// O establecer en el elemento
$element = new XoopsFormText('Email', 'email', 50, 255, '');
$form->addElement($element, true);
```

### Validación personalizada

```php
// Validación del lado del servidor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar token CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Security token invalid');
        exit;
    }

    // Obtener entrada saneada
    $name = \Xmf\Request::getString('name', '', 'POST');
    $email = \Xmf\Request::getString('email', '', 'POST');

    $errors = [];

    // Validar
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (!empty($errors)) {
        // Mostrar errores
        foreach ($errors as $error) {
            echo "<div class='errorMsg'>$error</div>";
        }
    } else {
        // Procesar formulario
    }
}
```

### Validación en el lado del cliente

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

## 🎨 Representadores personalizados

### Representador de Bootstrap 5

```php
// Registrar representador personalizado
XoopsFormRenderer::getInstance()->set(
    new XoopsFormRendererBootstrap5()
);

// Ahora todos los formularios usan el estilo de Bootstrap 5
$form = new XoopsThemeForm('My Form', 'myform', 'process.php');
```

### Creación de representador personalizado

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

    // ... implementar otros métodos de representación
}
```

---

## 🔐 Seguridad

### Protección CSRF

Siempre incluya el token oculto:

```php
$form->addElement(new XoopsFormHiddenToken());

// O automático con el parámetro useToken
$form = new XoopsThemeForm('Form', 'form', 'action.php', 'post', true);
```

### Verificar token en el envío

```php
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, implode('<br>', $GLOBALS['xoopsSecurity']->getErrors()));
    exit;
}
```

### Saneamiento de entrada

```php
use Xmf\Request;

// Siempre sanear la entrada
$string = Request::getString('field', 'default', 'POST');
$int = Request::getInt('id', 0, 'POST');
$array = Request::getArray('items', [], 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');
```

---

## 📋 Ejemplo completo

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

// Procesar formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('form.php', 3, 'Invalid security token');
        exit;
    }

    // Obtener y validar entrada
    $title = Request::getString('title', '', 'POST');
    $content = Request::getText('content', '', 'POST');
    $categoryId = Request::getInt('category_id', 0, 'POST');
    $status = Request::getString('status', 'draft', 'POST');

    if (empty($title)) {
        $error = 'Title is required';
    } else {
        // Guardar en la base de datos
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

// Obtener categorías para desplegable
$categoryHandler = xoops_getModuleHandler('category', 'mymodule');
$categories = $categoryHandler->getList();

// Construir formulario
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

// Mostrar
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($error)) {
    echo "<div class='errorMsg'>$error</div>";
}

$form->display();

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## 🔗 Documentación relacionada

- Referencia de elementos de formulario
- Validación de formulario
- Representadores de formulario personalizados
- Protección CSRF
- Saneamiento de entrada

---

#xoops #formularios #validación #seguridad #ui #elementos
