---
title: "Provjera valjanosti obrasca"
---
## Pregled

XOOPS pruža provjeru valjanosti i na strani klijenta i na strani poslužitelja za unose obrazaca. Ovaj vodič pokriva tehnike provjere valjanosti, ugrađene validatore i implementaciju prilagođene provjere valjanosti.

## Arhitektura provjere valjanosti

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

## Provjera valjanosti na strani poslužitelja

### Korištenje XoopsFormValidatora

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

### Ugrađena pravila provjere valjanosti

| Pravilo | Opis | Primjer |
|------|-------------|---------|
| `required` | Polje ne smije biti prazno | `required` |
| `email` | Valjani format e-pošte | `email` |
| `url` | Važeći format URL | `url` |
| `numeric` | Samo numerička vrijednost | `numeric` |
| `integer` | Samo cjelobrojna vrijednost | `integer` |
| `minLength` | Minimalna duljina niza | `minLength:3` |
| `maxLength` | Maksimalna duljina niza | `maxLength:100` |
| `min` | Minimalna brojčana vrijednost | `min:1` |
| `max` | Maksimalna numerička vrijednost | `max:100` |
| `regex` | Prilagođeni uzorak regularnog izraza | `regex:/^[a-z]+$/` |
| `in` | Vrijednost na popisu | `in:draft,published,archived` |
| `date` | Valjani format datuma | `date` |
| `alpha` | Samo slova | `alpha` |
| `alphanumeric` | Slova i brojke | `alphanumeric` |

### Prilagođena pravila provjere valjanosti

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Zahtjev za provjeru valjanosti

### Ulaz za dezinfekciju

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

### XSS prevencija

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

## Provjera valjanosti na strani klijenta

### HTML5 atributi provjere valjanosti

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

### JavaScript Validacija

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

## CSRF Zaštita

### Generiranje tokena

```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```

### Provjera tokena

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Provjera valjanosti prijenosa datoteke

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

## Prikaz pogreške

### Prikupljanje pogrešaka

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

### Prikaz grešaka

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

## Najbolji primjeri iz prakse

1. **Uvijek potvrdi valjanost na strani poslužitelja** - Validacija na strani klijenta može se zaobići
2. **Koristite parametrizirane upite** - Spriječite ubacivanje SQL
3. **Sanitize output** - Spriječite XSS napade
4. **Provjeri valjanost datoteke uploads** - Provjerite MIME vrste i veličine
5. **Koristite CSRF tokene** - Spriječite krivotvorenje zahtjeva s druge stranice
6. **Podnošenja ograničenja brzine** - Spriječite zlouporabu

## Povezana dokumentacija

- Referenca elemenata obrasca
- Pregled obrazaca
- Najbolje sigurnosne prakse
