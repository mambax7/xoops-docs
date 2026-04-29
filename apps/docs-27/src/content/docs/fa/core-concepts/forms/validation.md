---
title: "اعتبار سنجی فرم"
---
## بررسی اجمالی

XOOPS اعتبار سنجی سمت کلاینت و سمت سرور را برای ورودی های فرم فراهم می کند. این راهنما تکنیک‌های اعتبارسنجی، اعتبارسنجی‌های داخلی و اجرای اعتبارسنجی سفارشی را پوشش می‌دهد.

## معماری اعتبارسنجی

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

## اعتبار سنجی سمت سرور

### با استفاده از XoopsFormValidator

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

### قوانین اعتبار سنجی داخلی

| قانون | توضیحات | مثال |
|------|-------------|---------|
| `required` | فیلد نباید خالی باشد | `required` |
| `email` | فرمت ایمیل معتبر | `email` |
| `url` | فرمت URL معتبر | `url` |
| `numeric` | فقط مقدار عددی | `numeric` |
| `integer` | فقط مقدار صحیح | `integer` |
| `minLength` | حداقل طول رشته | `minLength:3` |
| `maxLength` | حداکثر طول رشته | `maxLength:100` |
| `min` | حداقل مقدار عددی | `min:1` |
| `max` | حداکثر مقدار عددی | `max:100` |
| `regex` | الگوی regex سفارشی | `regex:/^[a-z]+$/` |
| `in` | مقدار در لیست | `in:draft,published,archived` |
| `date` | فرمت تاریخ معتبر | `date` |
| `alpha` | فقط حروف | `alpha` |
| `alphanumeric` | حروف و اعداد | `alphanumeric` |

### قوانین اعتبارسنجی سفارشی

```php
$validator->addCustomRule('unique_username', function($value) {
    $memberHandler = xoops_getHandler('member');
    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('uname', $value));
    return $memberHandler->getUserCount($criteria) === 0;
}, 'Username already exists');

$validator->addRule('username', 'unique_username');
```

## درخواست اعتبار

### ورودی ضدعفونی کننده

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

### پیشگیری از XSS

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

## اعتبار سنجی سمت مشتری

### ویژگی های اعتبارسنجی HTML5

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

### اعتبار سنجی جاوا اسکریپت

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

## حفاظت CSRF

### تولید توکن

```php
// Generate token in form
$form->addElement(new \XoopsFormHiddenToken());

// This adds a hidden field with security token
```

### تایید رمز

```php
use XOOPS\Core\Security;

if (!Security::checkReferer()) {
    die('Invalid request origin');
}

if (!Security::checkToken()) {
    die('Invalid security token');
}
```

## اعتبار آپلود فایل

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

## نمایش خطا

### جمع آوری خطاها

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

### نمایش خطاها

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

## بهترین شیوه ها

1. **همیشه سمت سرور اعتبارسنجی شود** - اعتبار سنجی سمت سرویس گیرنده را می توان دور زد
2. **از پرس و جوهای پارامتری استفاده کنید** - از تزریق SQL جلوگیری کنید
3. **عفونی کردن خروجی** - جلوگیری از حملات XSS
4. **تأیید اعتبار آپلود فایل** - انواع و اندازه های MIME را بررسی کنید
5. **از توکن های CSRF** - از جعل درخواست های متقابل سایت جلوگیری کنید
6. ** ارسال محدودیت نرخ ** - جلوگیری از سوء استفاده

## مستندات مرتبط

- مرجع عناصر فرم
- بررسی اجمالی فرم ها
- بهترین شیوه های امنیتی