---
title: "प्रपत्र सत्यापन"
---
## अवलोकन

XOOPS फॉर्म इनपुट के लिए क्लाइंट-साइड और सर्वर-साइड सत्यापन दोनों प्रदान करता है। यह मार्गदर्शिका सत्यापन तकनीकों, अंतर्निहित सत्यापनकर्ताओं और कस्टम सत्यापन कार्यान्वयन को शामिल करती है।

## सत्यापन वास्तुकला

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

## सर्वर-साइड सत्यापन

### XoopsFormValidator का उपयोग करना

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

### अंतर्निहित सत्यापन नियम

| नियम | विवरण | उदाहरण |
|------|----|------|
| `required` | फ़ील्ड खाली नहीं होनी चाहिए | `required` |
| `email` | वैध ईमेल प्रारूप | `email` |
| `url` | वैध URL प्रारूप | `url` |
| `numeric` | केवल संख्यात्मक मान | `numeric` |
| `integer` | केवल पूर्णांक मान | `integer` |
| `minLength` | न्यूनतम स्ट्रिंग लंबाई | `minLength:3` |
| `maxLength` | अधिकतम स्ट्रिंग लंबाई | `maxLength:100` |
| `min` | न्यूनतम संख्यात्मक मान | `min:1` |
| `max` | अधिकतम संख्यात्मक मान | `max:100` |
| `regex` | कस्टम रेगेक्स पैटर्न | `regex:/^[a-z]+$/` |
| `in` | सूची में मूल्य | `in:draft,published,archived` |
| `date` | वैध तिथि प्रारूप | `date` |
| `alpha` | केवल पत्र | `alpha` |
| `alphanumeric` | अक्षर और अंक | `alphanumeric` |

### कस्टम सत्यापन नियम

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## सत्यापन का अनुरोध करें

### इनपुट को सैनिटाइज़ करना

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

### एक्सएसएस रोकथाम

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

## क्लाइंट-साइड सत्यापन

### HTML5 सत्यापन विशेषताएँ

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

### JavaScript सत्यापन

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

## CSRF सुरक्षा

### टोकन जनरेशन

```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```

### टोकन सत्यापन

```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## फ़ाइल अपलोड सत्यापन

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

## त्रुटि प्रदर्शन

### त्रुटियाँ एकत्रित करना

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

### त्रुटियाँ प्रदर्शित करना

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

## सर्वोत्तम प्रथाएँ

1. **हमेशा सर्वर-साइड को मान्य करें** - क्लाइंट-साइड सत्यापन को बायपास किया जा सकता है
2. **पैरामीटरयुक्त प्रश्नों का उपयोग करें** - SQL इंजेक्शन को रोकें
3. **आउटपुट को सैनिटाइज़ करें** - XSS हमलों को रोकें
4. **फ़ाइल अपलोड मान्य करें** - MIME प्रकार और आकार जांचें
5. **CSRF टोकन का उपयोग करें** - क्रॉस-साइट अनुरोध जालसाजी को रोकें
6. **दर सीमा प्रस्तुतियाँ** - दुरुपयोग रोकें

## संबंधित दस्तावेज़ीकरण

- प्रपत्र तत्व संदर्भ
- प्रपत्र अवलोकन
- सुरक्षा सर्वोत्तम प्रथाएँ