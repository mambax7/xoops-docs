---
title: "حفاظت CSRF"
description: "درک و پیاده سازی حفاظت CSRF در XOOPS با استفاده از کلاس XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

حملات جعل درخواست متقابل (CSRF) کاربران را فریب می دهد تا در سایتی که احراز هویت شده اند، اقدامات ناخواسته انجام دهند. XOOPS حفاظت داخلی CSRF را از طریق کلاس `XoopsSecurity` فراهم می کند.

## مستندات مرتبط

- Security-Best-Practices - راهنمای جامع امنیتی
- Input-Sanitization - MyTextSanitizer و اعتبارسنجی
- SQL-Injection-Prevention - شیوه های امنیتی پایگاه داده

## درک حملات CSRF

حمله CSRF زمانی رخ می دهد که:

1. یک کاربر در سایت XOOPS شما احراز هویت می شود
2. کاربر از یک وب سایت مخرب بازدید می کند
3. سایت مخرب با استفاده از جلسه کاربر درخواستی را به سایت XOOPS شما ارسال می کند
4. سایت شما درخواست را طوری پردازش می کند که گویی از طرف کاربر قانونی آمده است

## کلاس امنیت XOOPS

XOOPS کلاس `XoopsSecurity` را برای محافظت در برابر حملات CSRF فراهم می کند. این کلاس توکن های امنیتی را مدیریت می کند که باید در فرم ها گنجانده شوند و هنگام پردازش درخواست ها تأیید شوند.

### تولید توکن

کلاس امنیتی توکن‌های منحصر به فردی تولید می‌کند که در جلسه کاربر ذخیره می‌شوند و باید در فرم‌های زیر گنجانده شوند:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### تایید رمز

هنگام پردازش فرم های ارسالی، تأیید کنید که رمز معتبر است:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## با استفاده از سیستم توکن XOOPS

### با کلاس های XoopsForm

هنگام استفاده از کلاس‌های فرم XOOPS، محافظت توکن ساده است:

```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### با فرم های سفارشی

برای فرم‌های HTML سفارشی که از XoopsForm استفاده نمی‌کنند:

```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### در قالب های هوشمند

هنگام تولید فرم ها در قالب های Smarty:

```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## پردازش فرم های ارسالی

### تایید رمز اولیه

```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```

### با مدیریت خطای سفارشی

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### برای درخواست های AJAX

هنگام کار با درخواست های AJAX، توکن را در درخواست خود قرار دهید:

```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```

## بررسی ارجاع HTTP

برای محافظت بیشتر، به خصوص برای درخواست های AJAX، می توانید ارجاع دهنده HTTP را نیز بررسی کنید:

```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### بررسی امنیت ترکیبی

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## پیکربندی توکن

### طول عمر رمز

توکن ها طول عمر محدودی برای جلوگیری از حملات تکراری دارند. می‌توانید این را در تنظیمات XOOPS پیکربندی کنید یا توکن‌های منقضی شده را به خوبی مدیریت کنید:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### چندین فرم در یک صفحه

وقتی چندین فرم در یک صفحه دارید، هر کدام باید توکن خاص خود را داشته باشند:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## بهترین شیوه ها

### همیشه از نشانه ها برای عملیات تغییر حالت استفاده کنید

توکن ها را به هر شکلی که:

- ایجاد داده
- به روز رسانی داده ها
- داده ها را حذف می کند
- تنظیمات کاربر را تغییر می دهد
- انجام هرگونه اقدام اداری

### فقط به بررسی ارجاع اعتماد نکنید

هدر ارجاع دهنده HTTP می تواند:

- حذف شده توسط ابزارهای حفظ حریم خصوصی
- در برخی از مرورگرها وجود ندارد
- در برخی موارد جعل شده است

همیشه از تأیید رمز به عنوان دفاع اصلی خود استفاده کنید.

### توکن ها را به طور مناسب بازسازی کنید

بازسازی توکن ها را در نظر بگیرید:

- پس از ارسال موفق فرم
- بعد از login/logout
- در فواصل منظم برای جلسات طولانی

### انقضای توکن را به خوبی مدیریت کنید

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## مسائل و راه حل های رایج

### خطای نشانه یافت نشد

**مشکل**: بررسی امنیتی با "توکن یافت نشد" ناموفق است

**راه حل**: مطمئن شوید که فیلد نشانه در فرم شما گنجانده شده است:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### خطای منقضی شده توکن

**مشکل**: کاربران پس از تکمیل فرم طولانی، "توکن منقضی شده" را مشاهده می کنند

**راه حل**: استفاده از جاوا اسکریپت را برای به روز رسانی دوره ای توکن در نظر بگیرید:

```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### مشکلات توکن AJAX

**مشکل**: درخواست های AJAX اعتبار سنجی رمز را با شکست مواجه می کند

**راه حل**: مطمئن شوید که توکن با هر درخواست AJAX ارسال می شود و آن را در سمت سرور تأیید کنید:

```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## مثال: تکمیل فرم پیاده سازی

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#امنیت #csrf #xoops #forms #tokens #XoopsSecurity