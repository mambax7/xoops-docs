---
title: "Walidacja formularza"
---

## Przegląd

XOOPS zapewnia zarówno walidację po stronie klienta, jak i po stronie serwera dla wejść formularza. Ten przewodnik obejmuje techniki walidacji, wbudowane walidatory i wdrażanie walidacji niestandardowej.

## Architektura walidacji

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

## Walidacja po stronie serwera

### Używając XoopsFormValidator

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
    // Obsługuj błędy
}
```

### Wbudowane reguły walidacji

| Reguła | Opis | Przykład |
|------|-------------|---------|
| `required` | Pole nie może być puste | `required` |
| `email` | Prawidłowy format email | `email` |
| `url` | Prawidłowy format URL | `url` |
| `numeric` | Tylko wartość numeryczna | `numeric` |
| `integer` | Tylko wartość całkowita | `integer` |
| `minLength` | Minimalna długość ciągu | `minLength:3` |
| `maxLength` | Maksymalna długość ciągu | `maxLength:100` |
| `min` | Minimalna wartość numeryczna | `min:1` |
| `max` | Maksymalna wartość numeryczna | `max:100` |
| `regex` | Niestandardowy wzorzec regex | `regex:/^[a-z]+$/` |
| `in` | Wartość na liście | `in:draft,published,archived` |
| `date` | Prawidłowy format daty | `date` |
| `alpha` | Tylko litery | `alpha` |
| `alphanumeric` | Litery i cyfry | `alphanumeric` |

### Niestandardowe reguły walidacji

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Walidacja żądania

### Czyszczenie wejścia

```php
use Xoops\Core\Request;

// Pobierz oczyszczone wartości
$username = Request::getString('username', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$age = Request::getInt('age', 0, 'POST');
$price = Request::getFloat('price', 0.0, 'POST');
$tags = Request::getArray('tags', [], 'POST');

// Z walidacją
$username = Request::getString('username', '', 'POST', [
    'minLength' => 3,
    'maxLength' => 50
]);
```

### Zabezpieczenie XSS

```php
use Xoops\Core\Text\Sanitizer;

$sanitizer = Sanitizer::getInstance();

// Czyszcz HTML zawartość
$cleanContent = $sanitizer->sanitizeForDisplay($userContent);

// Usuń cały HTML
$plainText = $sanitizer->stripHtml($userContent);

// Zezwól na określone tagi
$content = $sanitizer->sanitizeForDisplay($userContent, [
    'allowedTags' => '<p><br><strong><em><a>'
]);
```

## Walidacja po stronie klienta

### Atrybuty walidacji HTML5

```php
// Wymagane pole
$element->setExtra('required');

// Walidacja wzorca
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Ograniczenia długości
$element->setExtra('minlength="3" maxlength="50"');

// Ograniczenia numeryczne
$element->setExtra('min="1" max="100"');
```

### Walidacja JavaScript

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

## Ochrona CSRF

### Generowanie tokena

```php
// Generuj token w formularzu
$form->addElement(new \XoopsFormHiddenToken());

// To dodaje ukryte pole z tokenem bezpieczeństwa
```

### Weryfikacja tokena

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Walidacja wgrywania pliku

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

## Wyświetlanie błędów

### Zbieranie błędów

```php
$errors = [];

if (empty($username)) {
    $errors['username'] = 'Username is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (!empty($errors)) {
    // Przechowuj w sesji do wyświetlenia po przekierowaniu
    $_SESSION['form_errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
}
```

### Wyświetlanie błędów

```smarty
{if $errors}
<div class="alert alert-danger">
    <ul>
        {foreach $errors as $field => $message}
        <li>{$message}</li>
        {/foreach}>
    </ul>
</div>
{/if}
```

## Najlepsze praktyki

1. **Zawsze waliduj po stronie serwera** - Walidacja po stronie klienta może być ominiętą
2. **Używaj sparametryzowanych zapytań** - Zapobiegaj SQL injection
3. **Czyszcz wyjście** - Zapobiegaj atakom XSS
4. **Waliduj wgrywania plików** - Sprawdzaj typy MIME i rozmiary
5. **Używaj tokenów CSRF** - Zapobiegaj cross-site request forgery
6. **Ogranicza wskaźnik przesyłań** - Zapobiegaj nadużyciom

## Powiązana dokumentacja

- Form Elements Reference
- Forms Overview
- Security Best Practices
