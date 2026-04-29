---
title: "پیکربندی پایه"
description: "راه اندازی اولیه XOOPS شامل تنظیمات mainfile.php، نام سایت، ایمیل و پیکربندی منطقه زمانی"
---
# پیکربندی پایه XOOPS

این راهنما تنظیمات پیکربندی ضروری را برای اجرای صحیح سایت XOOPS شما پس از نصب پوشش می دهد.

## پیکربندی mainfile.php

فایل `mainfile.php` حاوی پیکربندی حیاتی برای نصب XOOPS شما است. در حین نصب ایجاد شده است اما ممکن است لازم باشد آن را به صورت دستی ویرایش کنید.

### مکان

```
/var/www/html/xoops/mainfile.php
```

### ساختار فایل

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### تنظیمات بحرانی توضیح داده شد

| تنظیم | هدف | مثال |
|---|---|---|
| `XOOPS_DB_TYPE` | سیستم پایگاه داده | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | مکان سرور پایگاه داده | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | نام کاربری پایگاه داده | `xoops_user` |
| `XOOPS_DB_PASS` | رمز پایگاه داده | [گذرواژه_ایمن] |
| `XOOPS_DB_NAME` | نام پایگاه داده | `xoops_db` |
| `XOOPS_DB_PREFIX` | پیشوند نام جدول | `xoops_` (اجازه می دهد چندین XOOPS در یک DB) |
| `XOOPS_ROOT_PATH` | مسیر سیستم فایل فیزیکی | `/var/www/html/xoops` |
| `XOOPS_URL` | آدرس وب قابل دسترسی | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | مسیر مورد اعتماد (خارج از ریشه وب) | `/var/www/xoops_var` |

### ویرایش mainfile.php

mainfile.php را در یک ویرایشگر متن باز کنید:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### تغییرات رایج mainfile.php

**تغییر آدرس سایت:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**فعال کردن حالت اشکال زدایی (فقط توسعه):**
```php
define('XOOPS_DEBUG', 1);
```

**تغییر پیشوند جدول (در صورت نیاز):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**انتقال مسیر اعتماد به خارج از ریشه وب (پیشرفته):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## پیکربندی پنل مدیریت

تنظیمات اولیه را از طریق پنل مدیریت XOOPS پیکربندی کنید.

### دسترسی به تنظیمات سیستم

1. وارد پنل مدیریت شوید: `http://your-domain.com/xoops/admin/`
2. به: **سیستم > تنظیمات برگزیده > تنظیمات عمومی** بروید
3. تنظیمات را تغییر دهید (به زیر مراجعه کنید)
4. روی "ذخیره" در پایین کلیک کنید

### نام و توضیحات سایت

نحوه نمایش سایت خود را پیکربندی کنید:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### اطلاعات تماس

تنظیم جزئیات تماس سایت:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### زبان و منطقه

تنظیم زبان و منطقه پیش فرض:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## پیکربندی ایمیل

تنظیمات ایمیل را برای اعلان ها و ارتباطات کاربر پیکربندی کنید.

### مکان تنظیمات ایمیل

**پنل مدیریت:** سیستم > تنظیمات برگزیده > تنظیمات ایمیل

### پیکربندی SMTP

برای تحویل مطمئن ایمیل، از SMTP به جای PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### مثال پیکربندی Gmail

XOOPS را برای ارسال ایمیل از طریق Gmail تنظیم کنید:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**توجه:** Gmail به رمز عبور برنامه نیاز دارد، نه رمز عبور جیمیل شما:
1. به https://myaccount.google.com/apppasswords بروید
2. ایجاد رمز عبور برنامه برای "Mail" و "Windows Computer"
3. از رمز عبور تولید شده در XOOPS استفاده کنید

### پیکربندی نامه PHP() (ساده تر اما کمتر قابل اعتماد)

اگر SMTP در دسترس نیست، از PHP mail ():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

مطمئن شوید که سرور شما sendmail یا postfix را پیکربندی کرده است:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### تنظیمات عملکرد ایمیل

پیکربندی آنچه باعث ایجاد ایمیل می شود:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## پیکربندی منطقه زمانی

منطقه زمانی مناسب را برای مُهرهای زمانی و زمان‌بندی صحیح تنظیم کنید.

### تنظیم منطقه زمانی در پنل مدیریت

**مسیر:** سیستم > تنظیمات > تنظیمات عمومی

```
Default Timezone: [Select your timezone]
```

**مناطق زمانی مشترک:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### منطقه زمانی را تأیید کنید

منطقه زمانی سرور فعلی را بررسی کنید:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### تنظیم منطقه زمانی سیستم (لینوکس)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## پیکربندی URL

### URL های پاک (URL های دوستانه) را فعال کنید

برای URL هایی مانند `/page/about` به جای `/index.php?page=about`

**نیازها:**
- آپاچی با mod_rewrite فعال است
- فایل `.htaccess` در ریشه XOOPS

**فعال کردن در پنل مدیریت:**1. به: **System > Preferences > URL Settings** بروید
2. بررسی کنید: "Enable Friendly URLs"
3. انتخاب کنید: "نوع URL" (اطلاعات مسیر یا درخواست)
4. ذخیره کنید

**بررسی وجود .htaccess:**

```bash
cat /var/www/html/xoops/.htaccess
```

نمونه محتوای htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**عیب یابی URL های تمیز:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### URL سایت را پیکربندی کنید

**پنل مدیریت:** سیستم > تنظیمات > تنظیمات عمومی

URL صحیح را برای دامنه خود تنظیم کنید:

```
Site URL: http://your-domain.com/xoops/
```

یا اگر XOOPS در روت است:

```
Site URL: http://your-domain.com/
```

## بهینه سازی موتورهای جستجو (SEO)

تنظیمات SEO را برای مشاهده بهتر موتورهای جستجو پیکربندی کنید.

### متا تگ ها

تنظیم متا تگ های جهانی:

**پنل مدیریت:** سیستم > تنظیمات برگزیده > تنظیمات سئو

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

اینها در صفحه `<head>` ظاهر می شوند:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### نقشه سایت

فعال کردن نقشه سایت XML برای موتورهای جستجو:

1. به: **سیستم > ماژول ها** بروید
2. ماژول "Sitemap" را پیدا کنید
3. برای نصب و فعال کردن کلیک کنید
4. به نقشه سایت در: `/xoops/sitemap.xml` دسترسی داشته باشید

### Robots.txt

کنترل خزیدن موتور جستجو:

`/var/www/html/xoops/robots.txt` را ایجاد کنید:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## تنظیمات کاربر

تنظیمات پیش فرض مربوط به کاربر را پیکربندی کنید.

### ثبت نام کاربر

**پنل مدیریت:** سیستم > تنظیمات برگزیده > تنظیمات کاربر

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### نمایه کاربر

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### نمایش ایمیل کاربر

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## پیکربندی کش

بهبود عملکرد با کش مناسب.

### تنظیمات کش

**پنل مدیریت:** سیستم > تنظیمات برگزیده > تنظیمات حافظه پنهان

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### کش را پاک کنید

فایل های کش قدیمی را پاک کنید:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## چک لیست تنظیمات اولیه

پس از نصب، پیکربندی کنید:

- [ ] نام سایت و توضیحات به درستی تنظیم شده است
- [ ] ایمیل مدیریت پیکربندی شد
- [ ] تنظیمات ایمیل SMTP پیکربندی و آزمایش شده است
- [ ] منطقه زمانی برای منطقه شما تنظیم شده است
- [ ] URL به درستی پیکربندی شده است
- [ ] URL های پاک (URL دوستانه) در صورت تمایل فعال می شود
- [ ] تنظیمات ثبت نام کاربر پیکربندی شد
- [ ] متا تگ ها برای SEO پیکربندی شده است
- [ ] زبان پیش فرض انتخاب شده است
- [ ] تنظیمات کش فعال شد
- [ ] رمز عبور کاربر مدیریت قوی است (بیش از 16 کاراکتر)
- [ ] تست ثبت نام کاربر
- [ ] تست عملکرد ایمیل
- [ ] بارگذاری فایل آزمایشی
- [ ] از صفحه اصلی دیدن کنید و ظاهر را بررسی کنید

## پیکربندی تست

### ایمیل تست

ارسال یک ایمیل آزمایشی:

**پنل مدیریت:** سیستم > تست ایمیل

یا به صورت دستی:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### تست اتصال پایگاه داده

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**مهم:** فایل های تست را بعد از تست حذف کنید!

```bash
rm /var/www/html/xoops/test-*.php
```

## خلاصه فایل های پیکربندی

| فایل | هدف | روش ویرایش |
|---|---|---|
| mainfile.php | پایگاه داده و تنظیمات هسته | ویرایشگر متن |
| پنل مدیریت | اکثر تنظیمات | رابط وب |
| htaccess | بازنویسی URL | ویرایشگر متن |
| robots.txt | خزیدن موتور جستجو | ویرایشگر متن |

## مراحل بعدی

پس از پیکربندی اولیه:

1. تنظیمات سیستم را با جزئیات پیکربندی کنید
2. امنیت را سخت کنید
3. پنل مدیریت را کاوش کنید
4. اولین محتوای خود را ایجاد کنید
5. حساب های کاربری را تنظیم کنید

---

**برچسب ها:** #پیکربندی #راه اندازی #ایمیل #منطقه زمانی #سئو

**مقالات مرتبط:**
- ../Installation/Installation
- تنظیمات سیستم
- امنیت-پیکربندی
- بهینه سازی عملکرد