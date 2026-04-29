---
title: "Επικύρωση φόρμας"
---

## Επισκόπηση

Το XOOPS παρέχει επικύρωση τόσο από την πλευρά του πελάτη όσο και από την πλευρά του διακομιστή για εισόδους φόρμας. Αυτός ο οδηγός καλύπτει τεχνικές επικύρωσης, ενσωματωμένους επικυρωτές και προσαρμοσμένη εφαρμογή επικύρωσης.

## Αρχιτεκτονική επικύρωσης

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

## Επικύρωση από την πλευρά του διακομιστή

## # Χρήση XoopsFormValidator

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

## # Ενσωματωμένοι κανόνες επικύρωσης

| Κανόνας | Περιγραφή | Παράδειγμα |
|------|-------------|---------|
| `required ` | Το πεδίο δεν πρέπει να είναι κενό | ` required` |
| `email ` | Έγκυρη μορφή email | ` email` |
| `url ` | Έγκυρη μορφή URL | ` url` |
| `numeric ` | Μόνο αριθμητική τιμή | ` numeric` |
| `integer ` | Μόνο ακέραια τιμή | ` integer` |
| `minLength ` | Ελάχιστο μήκος χορδής | ` minLength:3` |
| `maxLength ` | Μέγιστο μήκος χορδής | ` maxLength:100` |
| `min ` | Ελάχιστη αριθμητική τιμή | ` min:1` |
| `max ` | Μέγιστη αριθμητική τιμή | ` max:100` |
| `regex ` | Προσαρμοσμένο μοτίβο regex | ` regex:/^[a-z]+$/` |
| `in ` | Τιμή στη λίστα | ` in:draft,published,archived` |
| `date ` | Έγκυρη μορφή ημερομηνίας | ` date` |
| `alpha ` | Μόνο γράμματα | ` alpha` |
| `alphanumeric ` | Γράμματα και αριθμοί | ` alphanumeric` |

## # Προσαρμοσμένοι κανόνες επικύρωσης

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## Αίτημα επικύρωσης

## # Είσοδος απολύμανσης

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

## # XSS Πρόληψη

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

## Επικύρωση από την πλευρά του πελάτη

## # HTML5 Χαρακτηριστικά επικύρωσης

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

## # Επικύρωση JavaScript

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

## CSRF Προστασία

## # Δημιουργία διακριτικών

```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```

## # Επαλήθευση διακριτικού

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## Επικύρωση μεταφόρτωσης αρχείου

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

## Εμφάνιση σφαλμάτων

## # Σφάλματα συλλογής

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

## # Εμφάνιση σφαλμάτων

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

## Βέλτιστες πρακτικές

1. **Να επικυρώνεται πάντα από την πλευρά του διακομιστή** - Η επικύρωση από την πλευρά του πελάτη μπορεί να παρακαμφθεί
2. **Χρησιμοποιήστε παραμετροποιημένα ερωτήματα** - Αποτρέψτε την έγχυση SQL
3. **Απολαύστε την έξοδο** - Αποτρέψτε XSS επιθέσεις
4. **Επικύρωση μεταφορτώσεων αρχείων** - Ελέγξτε MIME τύπους και μεγέθη
5. **Χρησιμοποιήστε διακριτικά CSRF** - Αποτρέψτε την πλαστογραφία αιτημάτων μεταξύ τοποθεσιών
6. **Υποβολές ορίων τιμών** - Αποτρέψτε την κατάχρηση

## Σχετική τεκμηρίωση

- Αναφορά στοιχείων φόρμας
- Επισκόπηση φορμών
- Βέλτιστες πρακτικές ασφάλειας
