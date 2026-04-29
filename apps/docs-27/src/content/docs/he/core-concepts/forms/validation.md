---
title: "אימות טופס"
---
## סקירה כללית

XOOPS מספק גם אימות בצד הלקוח וגם בצד השרת עבור קלט טפסים. מדריך זה מכסה טכניקות אימות, מאמתים מובנים ויישום אימות מותאם אישית.

## ארכיטקטורת אימות
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
## אימות בצד השרת

### באמצעות XoopsFormValidator
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
### כללי אימות מובנים

| כלל | תיאור | דוגמה |
|------|----------------|--------|
| `required` | השדה לא יכול להיות ריק | `required` |
| `email` | פורמט דוא"ל תקף | `email` |
| `url` | פורמט URL תקף | `url` |
| `numeric` | ערך מספרי בלבד | `numeric` |
| `integer` | ערך מספר שלם בלבד | `integer` |
| `minLength` | אורך מיתר מינימלי | `minLength:3` |
| `maxLength` | אורך מיתר מקסימלי | `maxLength:100` |
| `min` | ערך מספרי מינימלי | `min:1` |
| `max` | ערך מספרי מקסימלי | `max:100` |
| `regex` | דפוס רגולרי מותאם אישית | `regex:/^[a-z]+$/` |
| `in` | ערך ברשימה | `in:draft,published,archived` |
| `date` | פורמט תאריך תקף | `date` |
| `alpha` | אותיות בלבד | `alpha` |
| `alphanumeric` | אותיות ומספרים | `alphanumeric` |

### כללי אימות מותאמים אישית
```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```
## בקש אימות

### קלט חיטוי
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
### XSS מניעה
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
## אימות צד לקוח

### HTML5 תכונות אימות
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
### JavaScript אימות
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
## CSRF הגנה

### יצירת אסימונים
```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```
### אימות אסימון
```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```
## אימות העלאת קבצים
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
## תצוגת שגיאה

### איסוף שגיאות
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
### מציג שגיאות
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
## שיטות עבודה מומלצות

1. **אמת תמיד בצד השרת** - ניתן לעקוף את האימות בצד הלקוח
2. **השתמש בשאילתות עם פרמטרים** - מנע הזרקת SQL
3. **ניקוי פלט** - מניעת התקפות XSS
4. **אמת העלאות קבצים** - בדוק MIME סוגים וגדלים
5. **השתמש באסימוני CSRF** - מניעת זיוף בקשות בין אתרים
6. **הגשת הגשת תעריפים** - מנע ניצול לרעה

## תיעוד קשור

- הפניה לרכיבי טופס
- סקירת טפסים
- שיטות עבודה מומלצות לאבטחה