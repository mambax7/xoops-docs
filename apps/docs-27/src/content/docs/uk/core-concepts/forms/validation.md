---
title: "Перевірка форми"
---
## Огляд

XOOPS забезпечує перевірку як на стороні клієнта, так і на стороні сервера для вводу форми. У цьому посібнику розглядаються методи перевірки, вбудовані засоби перевірки та реалізація спеціальної перевірки.

## Архітектура перевірки
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
## Перевірка на стороні сервера

### Використання XoopsFormValidator
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
### Вбудовані правила перевірки

| Правило | Опис | Приклад |
|------|-------------|---------|
| `required` | Поле не повинно бути порожнім | `required` |
| `email` | Дійсний формат електронної пошти | `email` |
| `url` | Дійсний формат URL | `url` |
| `numeric` | Тільки числове значення | `numeric` |
| `integer` | Лише ціле значення | `integer` |
| `minLength` | Мінімальна довжина рядка | `minLength:3` |
| `maxLength` | Максимальна довжина рядка | `maxLength:100` |
| `min` | Мінімальне числове значення | `min:1` |
| `max` | Максимальне числове значення | `max:100` |
| `regex` | Спеціальний шаблон регулярного виразу | `regex:/^[a-z]+$/` |
| `in` | Значення в списку | `in:draft,published,archived` |
| `date` | Дійсний формат дати | `date` |
| `alpha` | Лише букви | `alpha` |
| `alphanumeric` | Букви і цифри | `alphanumeric` |

### Спеціальні правила перевірки
```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```
## Перевірка запиту

### Введення дезінфекції
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
### Запобігання XSS
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
## Перевірка на стороні клієнта

### Атрибути перевірки HTML5
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
### JavaScript Перевірка
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
## CSRF Захист

### Генерація маркерів
```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```
### Перевірка маркера
```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```
## Перевірка завантаження файлу
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
## Відображення помилок

### Збір помилок
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
### Відображення помилок
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
## Найкращі практики

1. **Завжди перевіряти на стороні сервера** – перевірку на стороні клієнта можна обійти
2. **Використовуйте параметризовані запити** - запобігайте впровадження SQL
3. **Очистити вихід** - Запобігання атакам XSS
4. **Перевірте завантаження файлів** - перевірте типи та розміри MIME
5. **Використовуйте токени CSRF** - запобігайте підробці міжсайтових запитів
6. **Подання ліміту швидкості** - Запобігайте зловживанням

## Пов'язана документація

- Довідка про елементи форми
- Огляд форм
- Найкращі методи безпеки