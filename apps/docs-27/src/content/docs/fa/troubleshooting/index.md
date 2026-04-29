---
title: "عیب یابی"
description: "راه حل هایی برای مشکلات رایج XOOPS، تکنیک های اشکال زدایی و پرسش های متداول"
---
> راه حل های مشکلات رایج و تکنیک های اشکال زدایی XOOPS CMS.

---

## 📋 تشخیص سریع

قبل از پرداختن به مسائل خاص، این دلایل رایج را بررسی کنید:

1. **مجوزهای فایل** - فهرست ها به 755 و فایل ها به 644 نیاز دارند
2. **نسخه PHP** - از PHP 7.4+ اطمینان حاصل کنید (8.x توصیه می شود)
3. **گزارش های خطا** - گزارش های خطای `xoops_data/logs/` و PHP را بررسی کنید
4. **کش** - کش را در Admin → System → Maintenance پاک کنید

---

## 🗂️ محتویات بخش

### مسائل رایج
- صفحه سفید مرگ (WSOD)
- خطاهای اتصال پایگاه داده
- خطاهای مجوز رد شده
- خرابی های نصب ماژول
- خطاهای کامپایل قالب

### سوالات متداول
- سوالات متداول نصب
- سوالات متداول ماژول
- سوالات متداول تم
- سوالات متداول عملکرد

### اشکال زدایی
- فعال کردن حالت اشکال زدایی
- استفاده از ری دیباگر
- دیباگ پرس و جو در پایگاه داده
- اشکال زدایی قالب هوشمند

---

## 🚨 مسائل و راه حل های رایج

### صفحه سفید مرگ (WSOD)

**علائم:** صفحه سفید خالی، بدون پیغام خطا

**راه حل:**

1. **نمایش خطای PHP را به طور موقت فعال کنید:**
 
  ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
 
  ```

2. ** ثبت خطای PHP را بررسی کنید:**
 
  ```bash
   tail -f /var/log/php/error.log
 
  ```

3. **علل شایع:**
   - بیش از حد حافظه
   - خطای دستوری PHP مرگبار
   - از دست رفته پسوند مورد نیاز

4. **رفع مشکلات حافظه:**
 
  ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
 
  ```

---

### خطاهای اتصال پایگاه داده

**علائم:** "نمی توان به پایگاه داده متصل شد" یا موارد مشابه

**راه حل:**

1. ** تأیید اعتبار در mainfile.php:**
 
  ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
 
  ```

2. **آزمایش اتصال به صورت دستی:**
 
  ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
 
  ```

3. **سرویس MySQL را بررسی کنید:**
 
  ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
 
  ```

4. **تأیید مجوزهای کاربر:**
 
  ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
 
  ```

---

### خطاهای مجوز رد شده

**علائم:** نمی توان فایل ها را آپلود کرد، نمی توان تنظیمات را ذخیره کرد

**راه حل:**

1. **تنظیم مجوزهای صحیح:**
 
  ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
 
  ```

2. **تنظیم مالکیت صحیح:**
 
  ```bash
   chown -R www-data:www-data /path/to/xoops
 
  ```

3. **SELinux (CentOS/RHEL) را بررسی کنید:**
 
  ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
 
  ```

---

### شکست در نصب ماژول

** علائم: ** ماژول نصب نمی شود، خطاهای SQL

**راه حل:**

1. ** الزامات ماژول را بررسی کنید:**
   - سازگاری نسخه PHP
   - پسوندهای PHP مورد نیاز
   - سازگاری نسخه XOOPS

2. **نصب دستی SQL:**
 
  ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
 
  ```

3. **پاک کردن حافظه پنهان ماژول:**
 
  ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
 
  ```

4. ** xoops_version.php syntax: را بررسی کنید**
 
  ```bash
   php -l modules/mymodule/xoops_version.php
 
  ```

---

### خطاهای کامپایل الگو

** علائم: ** خطاهای هوشمند، الگو پیدا نشد

**راه حل:**

1. **پاک کردن حافظه پنهان Smarty:**
 
  ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
 
  ```

2. **سینتکس الگو را بررسی کنید:**
 
  ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
 
  ```

3. **تأیید وجود الگو:**
 
  ```bash
   ls modules/mymodule/templates/
 
  ```

4. **قالب ها را بازسازی کنید:**
   - Admin → System → Maintenance → Templates → Regenerate

---

## 🐛 تکنیک های اشکال زدایی

### حالت اشکال زدایی XOOPS را فعال کنید

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### با استفاده از Ray Debugger

Ray یک ابزار اشکال زدایی عالی برای PHP است:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Smarty Debug Console

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### ثبت پرس و جو پایگاه داده

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ سوالات متداول

### نصب

**سؤال: جادوگر نصب صفحه خالی را نشان می دهد**
پاسخ: گزارش های خطای PHP را بررسی کنید، مطمئن شوید که PHP حافظه کافی دارد، مجوزهای فایل را تأیید کنید.

**سؤال: در حین نصب نمی توان به mainfile.php نوشت**
A: مجوزها را تنظیم کنید: `chmod 666 mainfile.php` در حین نصب، سپس `chmod 444` بعد از آن.

**سؤال: جداول پایگاه داده ایجاد نشد**
پاسخ: بررسی کنید که کاربر MySQL دارای امتیازات CREATE TABLE است، تأیید کنید که پایگاه داده وجود دارد.

### ماژول ها

**سؤال: صفحه مدیریت ماژول خالی است**
A: حافظه پنهان را پاک کنید، admin/menu.php ماژول را برای خطاهای نحوی بررسی کنید.

** س: بلوک های ماژول نشان داده نمی شوند **
پاسخ: مجوزهای بلوک را در Admin → Blocks بررسی کنید، تأیید کنید که بلوک به صفحات اختصاص داده شده است.

**سؤال: به روز رسانی ماژول ناموفق بود**
پاسخ: از پایگاه داده پشتیبان تهیه کنید، به‌روزرسانی‌های دستی SQL را امتحان کنید، الزامات نسخه را بررسی کنید.

### تم ها

** س: تم به درستی اعمال نمی شود **
پاسخ: حافظه پنهان Smarty را پاک کنید، بررسی کنید theme.html وجود دارد، مجوزهای موضوع را تأیید کنید.

**سؤال: CSS سفارشی بارگیری نمی شود**
A: مسیر فایل را بررسی کنید، حافظه پنهان مرورگر را پاک کنید، نحو CSS را تأیید کنید.**سؤال: تصاویر نمایش داده نمی شوند**
A: مسیرهای تصویر را بررسی کنید، مجوزهای پوشه آپلود را تأیید کنید.

### عملکرد

**سؤال: سایت بسیار کند است**
پاسخ: کش را فعال کنید، پایگاه داده را بهینه کنید، جستجوهای کند را بررسی کنید، OpCache را فعال کنید.

**سؤال: استفاده از حافظه بالا**
A: حافظه_limit را افزایش دهید، پرس و جوهای بزرگ را بهینه کنید، صفحه بندی را پیاده سازی کنید.

---

## 🔧 دستورات تعمیر و نگهداری

### همه کش ها را پاک کنید

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### بهینه سازی پایگاه داده

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### یکپارچگی فایل را بررسی کنید

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 مستندات مرتبط

- شروع به کار
- بهترین شیوه های امنیتی
- نقشه راه XOOPS 4.0

---

## 📚 منابع خارجی

- [تالارهای XOOPS](https://xoops.org/modules/newbb/)
- [مشکلات GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [مرجع خطای PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #عیب یابی #اشکال زدایی #FAQ #خطاها #راهکارها