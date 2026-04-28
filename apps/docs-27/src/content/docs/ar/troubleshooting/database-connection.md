---
title: "أخطاء الاتصال بقاعدة البيانات"
description: "دليل استكشاف الأخطاء وإصلاح مشاكل اتصال قاعدة البيانات في XOOPS"
dir: rtl
lang: ar
---

أخطاء الاتصال بقاعدة البيانات من بين المشاكل الأكثر شيوعاً في تثبيتات XOOPS. يوفر هذا الدليل خطوات استكشاف منهجية لتحديد وحل مشاكل الاتصال.

## رسائل الخطأ الشائعة

### "لا يمكن الاتصال بخادم MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

عادة ما يشير هذا الخطأ إلى أن خادم MySQL لا يعمل أو لا يمكن الوصول إليه.

### "تم رفض الوصول للمستخدم"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

هذا يشير إلى بيانات اعتماد قاعدة بيانات غير صحيحة في التكوين الخاص بك.

### "قاعدة بيانات غير معروفة"

```
Error: Unknown database 'xoops_db'
```

قاعدة البيانات المحددة غير موجودة على خادم MySQL.

## ملفات التكوين

### موقع تكوين XOOPS

ملف التكوين الرئيسي يقع في:

```
/mainfile.php
```

إعدادات قاعدة البيانات الرئيسية:

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

## خطوات استكشاف الأخطاء

### الخطوة 1: التحقق من تشغيل خدمة MySQL

#### على Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### الخطوة 2: اختبار اتصال MySQL

#### باستخدام سطر الأوامر

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### الخطوة 3: التحقق من بيانات اعتماد قاعدة البيانات

#### تحقق من تكوين XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### الخطوة 4: التحقق من وجود قاعدة البيانات

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

### الخطوة 5: التحقق من صلاحيات المستخدم

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

## المشاكل الشائعة والحلول

### المشكلة 1: MySQL لا يعمل

**الأعراض:**
- خطأ في الاتصال مرفوض
- لا يمكن الاتصال بـ localhost

**الحلول:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### المشكلة 2: بيانات اعتماد غير صحيحة

**الأعراض:**
- خطأ "تم رفض الوصول"
- "using password: YES" أو "using password: NO"

**الحلول:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### المشكلة 3: لم يتم إنشاء قاعدة البيانات

**الأعراض:**
- خطأ "قاعدة بيانات غير معروفة"
- فشل التثبيت عند إنشاء قاعدة البيانات

**الحلول:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## برنامج نصي للتشخيص

قم بإنشاء برنامج نصي شامل للتشخيص:

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

## الوثائق ذات الصلة

- White-Screen-of-Death - استكشاف WSOD الشائع
- ../../01-Getting-Started/Configuration/Performance-Optimization - ضبط أداء قاعدة البيانات
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - إعداد XOOPS الأولي
- ../../04-API-Reference/Database/XoopsDatabase - مرجع API قاعدة البيانات

---

**آخر تحديث:** 2026-01-31
**ينطبق على:** XOOPS 2.5.7+
**إصدارات PHP:** 7.4+
