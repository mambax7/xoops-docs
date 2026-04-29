---
title: "Form Doğrulama"
---
## Genel Bakış

XOOPS, form girişleri için hem istemci hem de sunucu tarafı doğrulaması sağlar. Bu kılavuz doğrulama tekniklerini, yerleşik doğrulayıcıları ve özel doğrulama uygulamasını kapsar.

## Doğrulama Mimarisi
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
## Sunucu Tarafı Doğrulaması

### XoopsFormValidator'yi kullanma
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
### Yerleşik Doğrulama Kuralları

| Kural | Açıklama | Örnek |
|------|-------------|--------|
| `required` | Alan boş olmamalıdır | `required` |
| `email` | Geçerli e-posta biçimi | `email` |
| `url` | Geçerli URL biçimi | `url` |
| `numeric` | Yalnızca sayısal değer | `numeric` |
| `integer` | Yalnızca tam sayı değeri | `integer` |
| `minLength` | Minimum dizi uzunluğu | `minLength:3` |
| `maxLength` | Maksimum dizi uzunluğu | `maxLength:100` |
| `min` | Minimum sayısal değer | `min:1` |
| `max` | Maksimum sayısal değer | `max:100` |
| `regex` | Özel normal ifade modeli | `regex:/^[a-z]+$/` |
| `in` | Listedeki değer | `in:draft,published,archived` |
| `date` | Geçerli tarih biçimi | `date` |
| `alpha` | Yalnızca harfler | `alpha` |
| `alphanumeric` | Harfler ve sayılar | `alphanumeric` |

### Özel Doğrulama Kuralları
```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```
## Doğrulama İste

### Sterilizasyon Girişi
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
### XSS Önleme
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
## İstemci Tarafı Doğrulaması

### HTML5 Doğrulama Nitelikleri
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
### JavaScript Doğrulama
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
## CSRF Koruma

### Token Üretimi
```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```
### Jeton Doğrulaması
```php
use Xoops\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```
## Dosya Yükleme Doğrulaması
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
## Hata Ekranı

### Hataları Toplama
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
### Hataları Görüntüleme
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
## En İyi Uygulamalar

1. **Her zaman sunucu tarafını doğrula** - İstemci tarafı doğrulaması atlanabilir
2. **Parametreli sorgular kullanın** - SQL enjeksiyonunu önleyin
3. **Çıktıyı temizleyin** - XSS saldırılarını önleyin
4. **Dosya yüklemelerini doğrulayın** - MIME türlerini ve boyutlarını kontrol edin
5. **CSRF jetonlarını kullanın** - Siteler arası istek sahteciliğini önleyin
6. **Oran limiti gönderimleri** - Kötüye kullanımı önleyin

## İlgili Belgeler

- Form Öğeleri Referansı
- Formlara Genel Bakış
- En İyi Güvenlik Uygulamaları