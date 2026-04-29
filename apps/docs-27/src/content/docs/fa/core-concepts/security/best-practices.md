---
title: "بهترین شیوه های امنیتی"
description: "راهنمای امنیتی جامع برای توسعه ماژول XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip [API های امنیتی در تمام نسخه ها پایدار هستند]
اقدامات امنیتی و APIهای مستند شده در اینجا در XOOPS 2.5.x و XOOPS 4.0.x کار می کنند. کلاس های امنیتی اصلی (`XoopsSecurity`، `MyTextSanitizer`) پایدار می مانند.
:::

این سند بهترین شیوه های امنیتی جامع را برای توسعه دهندگان ماژول XOOPS ارائه می دهد. پیروی از این دستورالعمل‌ها به شما کمک می‌کند تا مطمئن شوید که ماژول‌های شما ایمن هستند و آسیب‌پذیری‌هایی را در نصب‌های XOOPS وارد نمی‌کنند.

## اصول امنیتی

هر توسعه دهنده XOOPS باید این اصول اساسی امنیتی را دنبال کند:

1. **دفاع در عمق**: چندین لایه از کنترل های امنیتی را پیاده سازی کنید
2. **حداقل امتیاز**: فقط حداقل حقوق دسترسی لازم را ارائه دهید
3. **Input Validation**: هرگز به ورودی کاربر اعتماد نکنید
4. **Secure by Default**: امنیت باید پیکربندی پیش فرض باشد
5. **ساده نگه دارید**: امنیت سیستم های پیچیده سخت تر است

## مستندات مرتبط

- CSRF-Protection - سیستم توکن و کلاس XoopsSecurity
- Input-Sanitization - MyTextSanitizer و اعتبارسنجی
- SQL-Injection-Prevention - شیوه های امنیتی پایگاه داده

## چک لیست مرجع سریع

قبل از انتشار ماژول خود، بررسی کنید:

- [ ] همه فرم ها شامل توکن های XOOPS هستند
- [ ] تمام ورودی های کاربر تایید و پاکسازی می شوند
- [ ] تمام خروجی به درستی خارج شده است
- [ ] همه پرس و جوهای پایگاه داده از عبارات پارامتری استفاده می کنند
- [ ] آپلودهای فایل به درستی تایید شده است
- [ ] بررسی های احراز هویت و مجوز وجود دارد
- [ ] رسیدگی به خطا اطلاعات حساس را نشان نمی دهد
- [ ] پیکربندی حساس محافظت می شود
- [ ] کتابخانه های شخص ثالث به روز هستند
- [ ] تست امنیتی انجام شده است

## احراز هویت و مجوز

### بررسی احراز هویت کاربر

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### بررسی مجوزهای کاربر

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### تنظیم مجوزهای ماژول

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## امنیت جلسه

### بهترین شیوه های مدیریت جلسه

1. اطلاعات حساس را در جلسه ذخیره نکنید
2. پس از تغییرات login/privilege، شناسه های جلسه را بازسازی کنید
3. قبل از استفاده از داده‌های جلسه اعتبارسنجی کنید

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### جلوگیری از تثبیت جلسه

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## امنیت آپلود فایل

### تایید بارگذاری فایل

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### با استفاده از XOOPS Uploader

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### ذخیره سازی ایمن فایل های آپلود شده

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## مدیریت خطا و ثبت نام

### مدیریت ایمن خطا

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### ثبت رویدادهای امنیتی

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## امنیت پیکربندی

### ذخیره سازی پیکربندی حساس

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### محافظت از فایل های پیکربندی

از `.htaccess` برای محافظت از فایل های پیکربندی استفاده کنید:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## کتابخانه های شخص ثالث

### انتخاب کتابخانه ها

1. کتابخانه هایی را انتخاب کنید که به طور فعال نگهداری می شوند
2. آسیب پذیری های امنیتی را بررسی کنید
3. بررسی کنید که مجوز کتابخانه با XOOPS سازگار است

### به روز رسانی کتابخانه ها

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### جداسازی کتابخانه ها

```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## تست امنیتی

### چک لیست تست دستی

1. همه فرم‌های دارای ورودی نامعتبر را تست کنید
2. تلاش برای دور زدن احراز هویت و مجوز
3. قابلیت آپلود فایل را با فایل های مخرب تست کنید
4. آسیب پذیری های XSS را در همه خروجی ها بررسی کنید
5. برای تزریق SQL در تمام کوئری های پایگاه داده تست کنید

### تست خودکار

از ابزارهای خودکار برای اسکن آسیب پذیری ها استفاده کنید:

1. ابزار تجزیه و تحلیل کد استاتیک
2. اسکنرهای برنامه کاربردی وب
3. بررسی وابستگی برای کتابخانه های شخص ثالث

## خروجی فرار

### زمینه HTML

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### زمینه جاوا اسکریپت

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### زمینه URL

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### متغیرهای قالب

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## منابع

- [ده برتر OWASP](https://owasp.org/www-project-top-ten/)
- [برگ تقلب امنیتی PHP](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [اسناد XOOPS](https://xoops.org/)

---#امنیت #بهترین روشها #xoops #توسعه ماژول #احراز هویت #مجوز