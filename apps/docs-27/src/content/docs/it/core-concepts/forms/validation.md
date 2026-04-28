---
title: "Validazione del Modulo"
---

## Panoramica

XOOPS fornisce validazione sia lato client che lato server per gli input del modulo. Questa guida copre tecniche di validazione, validatori integrati e implementazione di validazione personalizzata.

## Architettura di Validazione

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

## Validazione Lato Server

### Utilizzo di XoopsFormValidator

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
    // Gestisci gli errori
}
```

### Regole di Validazione Integrate

| Regola | Descrizione | Esempio |
|--------|-------------|---------|
| `required` | Il campo non deve essere vuoto | `required` |
| `email` | Formato email valido | `email` |
| `url` | Formato URL valido | `url` |
| `numeric` | Solo valore numerico | `numeric` |
| `integer` | Solo valore intero | `integer` |
| `minLength` | Lunghezza minima della stringa | `minLength:3` |
| `maxLength` | Lunghezza massima della stringa | `maxLength:100` |
| `min` | Valore numerico minimo | `min:1` |
| `max` | Valore numerico massimo | `max:100` |
| `regex` | Modello regex personalizzato | `regex:/^[a-z]+$/` |
| `in` | Valore in lista | `in:draft,published,archived` |
| `date` | Formato data valido | `date` |
| `alpha` | Solo lettere | `alpha` |
| `alphanumeric` | Lettere e numeri | `alphanumeric` |

### Regole di Validazione Personalizzate

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Validazione della Richiesta

### Sanitizzazione dell'Input

```php
use Xoops\Core\Request;

// Ottieni valori sanitizzati
$username = Request::getString('username', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$age = Request::getInt('age', 0, 'POST');
$price = Request::getFloat('price', 0.0, 'POST');
$tags = Request::getArray('tags', [], 'POST');

// Con validazione
$username = Request::getString('username', '', 'POST', [
    'minLength' => 3,
    'maxLength' => 50
]);
```

### Prevenzione XSS

```php
use Xoops\Core\Text\Sanitizer;

$sanitizer = Sanitizer::getInstance();

// Sanitizza contenuto HTML
$cleanContent = $sanitizer->sanitizeForDisplay($userContent);

// Rimuovi tutto l'HTML
$plainText = $sanitizer->stripHtml($userContent);

// Consenti tag specifici
$content = $sanitizer->sanitizeForDisplay($userContent, [
    'allowedTags' => '<p><br><strong><em><a>'
]);
```

## Validazione Lato Client

### Attributi di Validazione HTML5

```php
// Campo obbligatorio
$element->setExtra('required');

// Validazione del modello
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Vincoli di lunghezza
$element->setExtra('minlength="3" maxlength="50"');

// Vincoli numerici
$element->setExtra('min="1" max="100"');
```

### Validazione JavaScript

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

## Protezione CSRF

### Generazione del Token

```php
// Genera il token nel modulo
$form->addElement(new \XoopsFormHiddenToken());

// Questo aggiunge un campo nascosto con il token di sicurezza
```

### Verifica del Token

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Validazione del Caricamento di File

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

## Visualizzazione degli Errori

### Raccolta degli Errori

```php
$errors = [];

if (empty($username)) {
    $errors['username'] = 'Username is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if (!empty($errors)) {
    // Archivia nella sessione per la visualizzazione dopo il reindirizzamento
    $_SESSION['form_errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit;
}
```

### Visualizzazione degli Errori

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

## Best Practice

1. **Valida sempre lato server** - La validazione lato client può essere bypassata
2. **Usa query parametrizzate** - Previeni l'iniezione SQL
3. **Sanitizza l'output** - Previeni gli attacchi XSS
4. **Valida i caricamenti di file** - Controlla i tipi MIME e le dimensioni
5. **Usa i token CSRF** - Previeni la falsificazione di richieste cross-site
6. **Limitare la frequenza degli invii** - Previeni gli abusi

## Documentazione Correlata

- Form Elements Reference
- Forms Overview
- Security Best Practices
