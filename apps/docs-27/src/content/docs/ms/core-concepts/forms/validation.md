---
title: "Pengesahan Borang"
---
## Gambaran KeseluruhanXOOPS menyediakan kedua-dua bahagian klien dan bahagian pelayan pengesahan untuk input borang. Panduan ini merangkumi teknik pengesahan, pengesah terbina dalam dan pelaksanaan pengesahan tersuai.## Seni Bina Pengesahan
```
mermaid
flowchart TB
    A[Form Submission] --> B{Client-Side Validation}
    B -->|Pass| C[Server Request]
    B -->|Fail| D[Show Client Errors]
    C --> E{Server-Side Validation}
    E -->|Pass| F[Process Data]
    E -->|Fail| G[Return Errors]
    G --> H[Display Server Errors]
```
## Pengesahan Bahagian Pelayan### Menggunakan XoopsFormValidator
```
php
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
### Peraturan Pengesahan Terbina dalam| Peraturan | Penerangan | Contoh |
|------|-------------|---------|
| `required` | Medan tidak boleh kosong | `required` |
| `email` | Format e-mel yang sah | `email` |
| `url` | Format URL yang sah | `url` |
| `numeric` | Nilai angka sahaja | `numeric` |
| `integer` | Nilai integer sahaja | `integer` |
| `minLength` | Panjang rentetan minimum | `minLength:3` |
| `maxLength` | Panjang rentetan maksimum | `maxLength:100` |
| `min` | Nilai angka minimum | `min:1` |
| `max` | Nilai angka maksimum | `max:100` |
| `regex` | Corak regex tersuai | `regex:/^[a-z]+$/` |
| `in` | Nilai dalam senarai | `in:draft,published,archived` |
| `date` | Format tarikh yang sah | `date` |
| `alpha` | Surat sahaja | `alpha` |
| `alphanumeric` | Huruf dan nombor | `alphanumeric` |### Peraturan Pengesahan Tersuai
```
php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```
## Minta Pengesahan### Input Mencuci
```
php
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
### Pencegahan XSS
```
php
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
## Pengesahan Bahagian Pelanggan### HTML5 Atribut Pengesahan
```
php
// Required field
$element->setExtra('required');

// Pattern validation
$element->setExtra('pattern="[a-zA-Z0-9]+" title="Alphanumeric only"');

// Length constraints
$element->setExtra('minlength="3" maxlength="50"');

// Numeric constraints
$element->setExtra('min="1" max="100"');
```
### Pengesahan JavaScript
```
javascript
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
## Perlindungan CSRF### Penjanaan Token
```
php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```
### Pengesahan Token
```
php
use XOOPS\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```
## Pengesahan Muat Naik Fail
```
php
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
## Paparan Ralat### Ralat Pengumpulan
```
php
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
### Memaparkan Ralat
```
Smarty
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
## Amalan Terbaik1. **Sentiasa sahkan bahagian pelayan** - Pengesahan pihak pelanggan boleh dipintas
2. **Gunakan pertanyaan berparameter** - Halang suntikan SQL
3. **Sanitize output** - Cegah serangan XSS
4. **Sahkan muat naik fail** - Semak jenis dan saiz MIME
5. **Gunakan token CSRF** - Cegah pemalsuan permintaan merentas tapak
6. **Had kadar penyerahan** - Cegah penyalahgunaan## Dokumentasi Berkaitan- Rujukan Elemen Bentuk
- Gambaran Keseluruhan Borang
- Amalan Terbaik Keselamatan