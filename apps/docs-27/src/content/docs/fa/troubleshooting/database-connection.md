---
title: "خطاهای اتصال پایگاه داده"
description: "راهنمای عیب یابی مشکلات اتصال پایگاه داده XOOPS"
---
خطاهای اتصال پایگاه داده یکی از رایج ترین مشکلات در نصب XOOPS است. این راهنما مراحل عیب یابی سیستماتیک را برای شناسایی و حل مشکلات اتصال ارائه می دهد.

## پیام های خطای رایج

### "نمی توان به سرور MySQL متصل شد"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

این خطا معمولاً نشان می دهد که سرور MySQL در حال اجرا نیست یا در دسترس نیست.

### "دسترسی برای کاربر ممنوع شد"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

این نشان دهنده اعتبارنامه نادرست پایگاه داده در پیکربندی شما است.

### "پایگاه داده ناشناخته"

```
Error: Unknown database 'xoops_db'
```

پایگاه داده مشخص شده در سرور MySQL وجود ندارد.

## فایل های پیکربندی

### محل پیکربندی XOOPS

فایل پیکربندی اصلی در آدرس زیر قرار دارد:

```
/mainfile.php
```

تنظیمات کلیدی پایگاه داده:

```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## مراحل عیب یابی

### مرحله 1: بررسی کنید که سرویس MySQL در حال اجرا است

#### در Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### مرحله 2: تست اتصال MySQL

#### با استفاده از خط فرمان

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### مرحله 3: تأیید اعتبار پایگاه داده

#### پیکربندی XOOPS را بررسی کنید

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### مرحله 4: بررسی وجود پایگاه داده

```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### مرحله 5: مجوزهای کاربر را بررسی کنید

```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```

## مسائل و راه حل های رایج

### مسئله 1: MySQL اجرا نمی شود

**علائم:**
- خطای اتصال رد شد
- نمی توان به لوکال هاست متصل شد

**راه حل:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### مسئله 2: اعتبارنامه نادرست

**علائم:**
- خطای «دسترسی ممنوع است».
- "استفاده از رمز عبور: بله" یا "استفاده از رمز عبور: خیر"

**راه حل:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### مسئله 3: پایگاه داده ایجاد نشد

**علائم:**
- خطای "پایگاه داده ناشناخته".
- نصب در ایجاد پایگاه داده ناموفق بود

**راه حل:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## اسکریپت تشخیصی

یک اسکریپت تشخیصی جامع ایجاد کنید:

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## مستندات مرتبط

- White-Screen-of-Death - عیب یابی رایج WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - تنظیم عملکرد پایگاه داده
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - راه اندازی اولیه XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - مرجع API پایگاه داده

---

**آخرین به روز رسانی: ** 31-01-2026
** برای:** XOOPS 2.5.7+ اعمال می شود
**نسخه PHP:** 7.4+