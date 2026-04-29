---
title: "پاکسازی ورودی"
description: "استفاده از MyTextSanitizer و تکنیک های اعتبار سنجی در XOOPS"
---
هرگز به ورودی کاربر اعتماد نکنید. همیشه قبل از استفاده تمام داده های ورودی را تأیید و ضدعفونی کنید. XOOPS کلاس `MyTextSanitizer` را برای پاکسازی ورودی متن و عملکردهای کمکی مختلف برای اعتبار سنجی ارائه می کند.

## مستندات مرتبط

- Security-Best-Practices - راهنمای جامع امنیتی
- CSRF-Protection - سیستم توکن و کلاس XoopsSecurity
- SQL-Injection-Prevention - شیوه های امنیتی پایگاه داده

## قانون طلایی

**هرگز به ورودی کاربر اعتماد نکنید.** همه داده های منابع خارجی باید:

1. **تأیید شده**: بررسی کنید که با فرمت و نوع مورد انتظار مطابقت داشته باشد
2. **Sanitized **: حذف یا فرار از شخصیت های بالقوه خطرناک
3. **Escaped**: هنگام خروجی، escape برای زمینه خاص (HTML، JavaScript، SQL)

## کلاس MyTextSanitizer

XOOPS کلاس `MyTextSanitizer` (که معمولاً با نام مستعار `$myts`) برای پاکسازی متن ارائه می شود.

### دریافت نمونه

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### پاکسازی متن اولیه

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### پردازش محتوای Textarea

روش `displayTarea()` پردازش جامع متنی را ارائه می دهد:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

### روشهای رایج ضدعفونی

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## اعتبار سنجی ورودی

### اعتبارسنجی مقادیر عدد صحیح

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### اعتبار سنجی آدرس های ایمیل

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### اعتبار سنجی URL ها

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### اعتبارسنجی تاریخ ها

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### اعتبارسنجی نام فایل ها

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## مدیریت انواع ورودی های مختلف

### ورودی رشته

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### ورودی عددی

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### ورودی بولی

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### ورودی آرایه

```php
// Validate array input (e.g., multiple checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### ورودی Select/Option

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## درخواست شی (XMF)

هنگام استفاده از XMF، کلاس Request مدیریت ورودی تمیزتری را ارائه می دهد:

```php
use XMF\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## ایجاد کلاس اعتبار سنجی

برای فرم های پیچیده، یک کلاس اعتبار سنجی اختصاصی ایجاد کنید:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

استفاده:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## پاکسازی برای ذخیره سازی پایگاه داده

هنگام ذخیره داده ها در پایگاه داده:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## ضد عفونی برای نمایش

زمینه های مختلف نیاز به فرار متفاوت دارند:

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## مشکلات رایج

### کدگذاری دوگانه

**مشکل**: داده ها چندین بار رمزگذاری می شوند

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### کدگذاری ناسازگار

**مشکل**: برخی از خروجی ها کدگذاری شده اند، برخی نه

**راه حل**: همیشه از یک رویکرد ثابت استفاده کنید، ترجیحاً روی خروجی کدگذاری کنید:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### اعتبارسنجی وجود ندارد

**مشکل**: فقط ضدعفونی کردن بدون تأیید اعتبار

**راه حل**: همیشه ابتدا اعتبارسنجی کنید، سپس ضدعفونی کنید:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## خلاصه بهترین شیوه ها

1. **از MyTextSanitizer** برای پردازش محتوای متنی استفاده کنید
2. **از filter_var()** برای اعتبارسنجی فرمت خاص استفاده کنید
3. **از نوع ریخته گری** برای مقادیر عددی استفاده کنید
4. **لیست سفید مقادیر مجاز** برای ورودی های انتخابی
5. **قبل از ضدعفونی کردن اعتبارسنجی کنید**
6. **Escape در خروجی**، نه در ورودی
7. **از دستورات آماده شده** برای پرس و جوهای پایگاه داده استفاده کنید
8. ** کلاس های اعتبارسنجی ** برای فرم های پیچیده ایجاد کنید
9. **هرگز به اعتبار سنجی سمت مشتری اعتماد نکنید ** - همیشه سمت سرور را تأیید کنید

---

#امنیت #ضدعفونی #اعتبارسنجی #xoops #MyTextSanitizer #input-handling