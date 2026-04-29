---
title: "سوالات متداول ماژول"
description: "سوالات متداول در مورد ماژول های XOOPS"
---
# ماژول سوالات متداول

> پرسش ها و پاسخ های متداول در مورد ماژول های XOOPS، نصب و مدیریت.

---

## نصب و فعال سازی

### س: چگونه یک ماژول را در XOOPS نصب کنم؟

**الف:**
1. فایل فشرده ماژول را دانلود کنید
2. به XOOPS Admin > Modules > Manage Modules بروید
3. روی «مرور» کلیک کنید و فایل فشرده را انتخاب کنید
4. روی «آپلود» کلیک کنید
5. ماژول در لیست ظاهر می شود (معمولاً غیرفعال می شود)
6. روی نماد فعال سازی کلیک کنید تا فعال شود

متناوبا، فایل فشرده را مستقیماً در `/xoops_root/modules/` استخراج کنید و به پنل مدیریت بروید.

---

### س: آپلود ماژول با "مجوز رد شد" ناموفق بود

**A:** این یک مشکل مجوز فایل است:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

برای جزئیات بیشتر به خطاهای نصب ماژول مراجعه کنید.

---

### س: چرا بعد از نصب نمی توانم ماژول را در پنل مدیریت ببینم؟

**A:** موارد زیر را بررسی کنید:

1. **ماژول فعال نشده** - روی نماد چشم در لیست ماژول ها کلیک کنید
2. **صفحه مدیریت گم شده** - ماژول باید `hasAdmin = 1` در xoopsversion.php داشته باشد
3. **فایل های زبان موجود نیست** - نیاز به `language/english/admin.php`
4. **حافظه پنهان پاک نشده** - کش را پاک کنید و مرورگر را تازه کنید

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### س: چگونه یک ماژول را حذف نصب کنم؟

**الف:**
1. به XOOPS Admin > Modules > Manage Modules بروید
2. ماژول را غیرفعال کنید (روی نماد چشم کلیک کنید)
3. روی نماد trash/delete کلیک کنید
4. اگر می خواهید به طور کامل حذف شود، پوشه ماژول را به صورت دستی حذف کنید:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## مدیریت ماژول

### س: تفاوت بین غیرفعال کردن و حذف نصب چیست؟

**الف:**
- **غیرفعال کردن**: ماژول را غیرفعال کنید (روی نماد چشم کلیک کنید). جداول پایگاه داده باقی مانده است.
- **حذف نصب**: ماژول را حذف کنید. جداول پایگاه داده را حذف می کند و از لیست حذف می کند.

برای حذف واقعی، پوشه را نیز حذف کنید:
```bash
rm -rf modules/modulename
```

---

### س: چگونه می توانم بررسی کنم که آیا یک ماژول به درستی نصب شده است؟

**A:** از اسکریپت اشکال زدایی استفاده کنید:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### س: آیا می توانم چندین نسخه از یک ماژول را اجرا کنم؟

**A:** نه، XOOPS به صورت بومی از این پشتیبانی نمی کند. با این حال، شما می توانید:

1. یک کپی با نام دایرکتوری متفاوت ایجاد کنید: `mymodule` و `mymodule2`
2. نام dirname را در هر دو ماژول xoopsversion.php به روز کنید
3. از نام های جداول پایگاه داده منحصر به فرد اطمینان حاصل کنید

این توصیه نمی شود زیرا آنها یک کد را به اشتراک می گذارند.

---

## پیکربندی ماژول

### س: کجا تنظیمات ماژول را پیکربندی کنم؟

**الف:**
1. به XOOPS Admin > Modules بروید
2. روی نماد settings/gear در کنار ماژول کلیک کنید
3. تنظیمات برگزیده را پیکربندی کنید

تنظیمات در جدول `xoops_config` ذخیره می شوند.

**دسترسی در کد:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### س: چگونه گزینه های پیکربندی ماژول را تعریف کنم؟

**A:** در xoopsversion.php:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## ویژگی های ماژول

### س: چگونه می توانم یک صفحه مدیریت به ماژول خود اضافه کنم؟

**A:** ساختار را ایجاد کنید:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

در xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` را ایجاد کنید:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### س: چگونه قابلیت جستجو را به ماژول خود اضافه کنم؟

**الف:**
1. در xoopsversion.php تنظیم کنید:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. `search.php` را ایجاد کنید:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

### س: چگونه اعلان ها را به ماژول خود اضافه کنم؟

**الف:**
1. در xoopsversion.php تنظیم کنید:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. اطلاع رسانی در کد:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## مجوزهای ماژول

### س: چگونه مجوزهای ماژول را تنظیم کنم؟

**الف:**
1. به XOOPS Admin > Modules > Module Permissions بروید
2. ماژول را انتخاب کنید
3. user/group و سطح مجوز را انتخاب کنید
4. ذخیره کنید

**در کد:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## پایگاه داده ماژول

### س: جداول پایگاه داده ماژول در کجا ذخیره می شوند؟

**A:** همه در پایگاه داده اصلی XOOPS، با پیشوند جدول شما (معمولا `xoops_`):

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### س: چگونه جداول پایگاه داده ماژول را به روز کنم؟

**A:** یک اسکریپت به روز رسانی در ماژول خود ایجاد کنید:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## وابستگی های ماژول

### س: چگونه می توانم بررسی کنم که آیا ماژول های مورد نیاز نصب شده اند؟

**الف:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

### س: آیا ماژول ها می توانند به ماژول های دیگر وابسته باشند؟**A:** بله، در xoopsversion.php اعلام کنید:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## عیب یابی

### س: ماژول در لیست ظاهر می شود اما فعال نمی شود

**A:** بررسی کنید:
1. نحو xoopsversion.php - از PHP linter استفاده کنید:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. فایل SQL پایگاه داده:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. فایل های زبان:
```bash
ls -la modules/mymodule/language/english/
```

برای تشخیص دقیق، به خرابی‌های نصب ماژول مراجعه کنید.

---

### س: ماژول فعال شده است اما در سایت اصلی نمایش داده نمی شود

**الف:**
1. `hasMain = 1` را در xoopsversion.php تنظیم کنید:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. `modules/mymodule/index.php` را ایجاد کنید:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### س: ماژول باعث "صفحه سفید مرگ" می شود

**A:** برای یافتن خطا، اشکال زدایی را فعال کنید:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

گزارش خطا را بررسی کنید:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

برای راه حل به صفحه سفید مرگ مراجعه کنید.

---

## عملکرد

### س: ماژول کند است، چگونه بهینه سازی کنم؟

**الف:**
1. **پرس و جوهای پایگاه داده را بررسی کنید** - از ثبت درخواست استفاده کنید
2. **داده های کش** - از حافظه نهان XOOPS استفاده کنید:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **بهینه سازی قالب ها** - از حلقه ها در قالب ها اجتناب کنید
4. **فعال کردن PHP اپکد کش** - APCu، XDebug، و غیره.

برای جزئیات بیشتر به سوالات متداول عملکرد مراجعه کنید.

---

## توسعه ماژول

### س: کجا می توانم اسناد توسعه ماژول را پیدا کنم؟

**A:** ببینید:
- راهنمای توسعه ماژول
- ساختار ماژول
- ایجاد اولین ماژول شما

---

## مستندات مرتبط

- خرابی های نصب ماژول
- ساختار ماژول
- سوالات متداول عملکرد
- حالت Debug Mode را فعال کنید

---

#xoops #modules #faq #عیب‌یابی