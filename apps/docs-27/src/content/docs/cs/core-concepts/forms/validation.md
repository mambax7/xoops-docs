---
title: "Ověření formuláře"
---

## Přehled

XOOPS poskytuje ověření vstupních formulářů na straně klienta i serveru. Tato příručka pokrývá ověřovací techniky, vestavěné validátory a vlastní implementaci ověřování.

## Architektura ověřování

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

## Ověření na straně serveru

### Použití XOOPSFormValidator

```php
use XOOPS\Core\Form\Validator;

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

### Vestavěná pravidla ověřování

| Pravidlo | Popis | Příklad |
|------|-------------|---------|
| `required` | Pole nesmí být prázdné | `required` |
| `email` | Platný formát emailu | `email` |
| `url` | Platný formát URL | `url` |
| `numeric` | Pouze číselná hodnota | `numeric` |
| `integer` | Pouze celočíselná hodnota | `integer` |
| `minLength` | Minimální délka struny | `minLength:3` |
| `maxLength` | Maximální délka struny | `maxLength:100` |
| `min` | Minimální číselná hodnota | `min:1` |
| `max` | Maximální číselná hodnota | `max:100` |
| `regex` | Vlastní vzor regulárního výrazu | `regex:/^[a-z]+$/` |
| `in` | Hodnota v seznamu | `in:draft,published,archived` |
| `date` | Platný formát data | `date` |
| `alpha` | Pouze písmena | `alpha` |
| `alphanumeric` | Písmena a číslice | `alphanumeric` |

### Vlastní pravidla ověřování

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Žádost o ověření

### Vstup dezinfekce

```php
use XOOPS\Core\Request;

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

### XSS Prevence

```php
use XOOPS\Core\Text\Sanitizer;

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

## Ověření na straně klienta

### Atributy ověření HTML5

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

### JavaScript Ověření

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

## Ochrana CSRF

### Generování tokenů

```php
// Generate token in form
$form->addElement(new \XOOPSFormHiddenToken());

// This adds a hidden field with security token
```

### Ověření tokenu

```php
use XOOPS\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Ověření nahrání souboru

```php
use XOOPS\Core\Uploader;

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

## Zobrazení chyb

### Shromažďování chyb

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

### Zobrazení chyb

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

## Nejlepší postupy

1. **Vždy ověřit na straně serveru** – Ověření na straně klienta lze obejít
2. **Používejte parametrizované dotazy** – Zabraňte injektování SQL
3. **Dezinfikujte výstup** – Zabraňte útokům XSS
4. **Ověření nahraných souborů** – Zkontrolujte typy a velikosti MIME
5. **Použijte tokeny CSRF** – Zabraňte padělání požadavků mezi weby
6. **Omezení sazby** – Zabraňte zneužití

## Související dokumentace

- Odkaz na prvky formuláře
- Přehled formulářů
- Nejlepší bezpečnostní postupy