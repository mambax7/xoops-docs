---
title: "שגיאות חיבור למסד נתונים"
description: "מדריך לפתרון בעיות עבור בעיות בחיבור מסד נתונים XOOPS"
---
שגיאות חיבור למסד נתונים הן בין הבעיות הנפוצות ביותר בהתקנות XOOPS. מדריך זה מספק שלבי פתרון בעיות שיטתיים לזיהוי ופתרון בעיות חיבור.

## הודעות שגיאה נפוצות

### "לא ניתן להתחבר לשרת MySQL"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
שגיאה זו מציינת בדרך כלל ששרת MySQL אינו פועל או אינו נגיש.

### "הגישה נדחתה למשתמש"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
זה מצביע על אישורי מסד נתונים שגויים בתצורה שלך.

### "בסיס נתונים לא ידוע"
```
Error: Unknown database 'xoops_db'
```
מסד הנתונים שצוין אינו קיים בשרת MySQL.

## קבצי תצורה

### XOOPS מיקום תצורה

קובץ התצורה הראשי נמצא בכתובת:
```
/mainfile.php
```
הגדרות מפתח של מסד נתונים:
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
## שלבי פתרון בעיות

### שלב 1: ודא שהשירות MySQL פועל

#### ב-Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### שלב 2: בדוק MySQL קישוריות

#### באמצעות שורת הפקודה
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### שלב 3: אמת את אישורי מסד הנתונים

#### בדוק את XOOPS תצורה
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### שלב 4: ודא שבסיס הנתונים קיים
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
### שלב 5: בדוק את הרשאות המשתמש
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
## בעיות ופתרונות נפוצים

### גיליון 1: MySQL לא פועל

**סימפטומים:**
- שגיאה סירבה לחיבור
- לא מצליח להתחבר ל-localhost

**פתרונות:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### בעיה 2: אישורים שגויים

**סימפטומים:**
- שגיאת "הגישה נדחתה".
- "באמצעות סיסמה: YES" או "באמצעות סיסמה: לא"

**פתרונות:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### בעיה 3: מסד נתונים לא נוצר

**סימפטומים:**
- שגיאת "מסד נתונים לא ידוע".
- ההתקנה נכשלה ביצירת מסד הנתונים

**פתרונות:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## סקריפט אבחון

צור סקריפט אבחון מקיף:
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
## תיעוד קשור

- לבן-מסך-מוות - פתרון בעיות נפוץ WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - כוונון ביצועי מסד נתונים
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - הגדרה ראשונית של XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - מסד נתונים API הפניה

---

**עדכון אחרון:** 2026-01-31
**חל על:** XOOPS 2.5.7+
**PHP גרסאות:** 7.4+