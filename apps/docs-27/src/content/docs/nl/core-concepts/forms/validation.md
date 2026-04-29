---
title: "Formuliervalidatie"
---
## Overzicht

XOOPS biedt zowel client- als server-side validatie voor formulierinvoer. Deze handleiding behandelt validatietechnieken, ingebouwde validators en aangepaste validatie-implementatie.

## Validatiearchitectuur

```mermaid
flowchart TB
    A[Form Submission] --> B{Client-Side Validation}
    B -->|Pass| C[Server Request]
    B -->|Fail| D[Show Client Errors]
    C --> E{Server-Side Validation}
    E -->|Pass| F[Process Data]
    E -->|Fail| G[Return Errors]
    G --> H[Display Server Errors]
```

## Validatie aan de serverzijde

### XoopsFormValidator gebruiken

```php
use Xoops\Core\Form\Validator;

$validator = new Validator();

$validator->addRule('username', 'required', 'Username is required');
$validator->addRule('username', 'minLength:3', 'Username must be at least 3 characters');
$validator->addRule('username', 'maxLength:50', 'Username cannot exceed 50 characters');
$validator->addRule('email', 'email', 'Please enter a valid email address');
$validator->addRule('password', 'minLength:8', 'Password must be at least 8 characters');

if (!$validator->validate($_POST)) {
    $errors = $validator->getErrors();
    // Handle errors
}
```

### Ingebouwde validatieregels

| Regel | Beschrijving | Voorbeeld |
|-----|-------------|---------|
| `required` | Veld mag niet leeg zijn | `required` |
| `email` | Geldig e-mailformaat | `email` |
| `url` | Geldig URL-formaat | `url` |
| `numeric` | Alleen numerieke waarde | `numeric` |
| `integer` | Alleen gehele waarde | `integer` |
| `minLength` | Minimale snaarlengte | `minLength:3` |
| `maxLength` | Maximale snaarlengte | `maxLength:100` |
| `min` | Minimale numerieke waarde | `min:1` |
| `max` | Maximale numerieke waarde | `max:100` |
| `regex` | Aangepast regex-patroon | `regex:/^[a-z]+$/` |
| `in` | Waarde in lijst | `in:draft,published,archived` |
| `date` | Geldig datumformaat | `date` |
| `alpha` | Alleen brieven | `alpha` |
| `alphanumeric` | Letters en cijfers | `alphanumeric` |

### Aangepaste validatieregels

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Validatie aanvragen

### Sanitaire invoer

```php
use Xoops\Core\Request;

// Get sanitized values
$username = Request::getString('username', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$age = Request::getInt('age', 0, 'POST');
$price = Request::getFloat('price', 0.0, 'POST');
$tags = Request::getArray('tags', [], 'POST');

// With validation
$username = Request::getString('username', '', 'POST', [
    'minLength' => 3,
    'maxLength' => 50
]);
```

### XSS Preventie

```php
use Xoops\Core\Text\Sanitizer;

$sanitizer = Sanitizer::getInstance();

// Sanitize HTML content
$cleanContent = $sanitizer->sanitizeForDisplay($userContent);

// Strip all HTML
$plainText = $sanitizer->stripHtml($userContent);

// Allow specific tags
$content = $sanitizer->sanitizeForDisplay($userContent, [
    'allowedTags' => '<p><br><strong><em><a>'
]);
```

## Validatie aan de clientzijde

### HTML5 Validatiekenmerken

```php
// Required field
$element->setExtra('required');

// Pattern validation
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Length constraints
$element->setExtra('minlength="3" maxlength="50"');

// Numeric constraints
$element->setExtra('min="1" max="100"');
```

### JavaScript-validatie

```javascript
document.getElementById('myForm').addEventListener('submit', function(e) {
    const username = document.getElementById('username').value;
    const errors = [];

    if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (errors.length > 0) {
        e.preventDefault();
        displayErrors(errors);
    }
});
```

## CSRF-bescherming

### Token genereren

```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```

### Tokenverificatie

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Validatie van bestandsupload

```php
use Xoops\Core\Uploader;

$uploader = new Uploader(
    uploadDir: XOOPS_UPLOAD_PATH . '/images/',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 1920,
    maxHeight: 1080
);

if ($uploader->fetchMedia('image_upload')) {
    if ($uploader->upload()) {
        $savedFile = $uploader->getSavedFileName();
    } else {
        $errors[] = $uploader->getErrors();
    }
}
```

## Foutweergave

### Fouten verzamelen

```php
$errors = [];

if (empty($username)) {
    $errors['username'] = 'Username is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (!empty($errors)) {
    // Store in session for display after redirect
    $_SESSION['form_errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
}
```

### Fouten weergeven

```smarty
{if $errors}
<div class="alert alert-danger">
    <ul>
        {foreach $errors as $field => $message}
        <li>{$message}</li>
        {/foreach}
    </ul>
</div>
{/if}
```

## Beste praktijken

1. **Altijd valideren aan de serverzijde** - Validatie aan de clientzijde kan worden omzeild
2. **Gebruik geparametriseerde zoekopdrachten** - Voorkom injectie van SQL
3. **Uitvoer opschonen** - Voorkom XSS-aanvallen
4. **Bestandsuploads valideren** - Controleer de typen en formaten van MIME
5. **Gebruik CSRF-tokens** - Voorkom vervalsing van verzoeken tussen sites
6. **Tarieflimietinzendingen** - Voorkom misbruik

## Gerelateerde documentatie

- Referentie voor formulierelementen
- Formulierenoverzicht
- Beste praktijken op het gebied van beveiliging