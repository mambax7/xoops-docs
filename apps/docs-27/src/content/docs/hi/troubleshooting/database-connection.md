---
title: "डेटाबेस कनेक्शन त्रुटियाँ"
description: "XOOPS डेटाबेस कनेक्शन समस्याओं के लिए समस्या निवारण मार्गदर्शिका"
---
डेटाबेस कनेक्शन त्रुटियाँ XOOPS इंस्टॉलेशन में सबसे आम समस्याओं में से हैं। यह मार्गदर्शिका कनेक्शन समस्याओं की पहचान करने और उन्हें हल करने के लिए व्यवस्थित समस्या निवारण चरण प्रदान करती है।

## सामान्य त्रुटि संदेश

### "MySQL सर्वर से कनेक्ट नहीं हो सकता"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

यह त्रुटि आम तौर पर इंगित करती है कि MySQL सर्वर नहीं चल रहा है या पहुंच योग्य नहीं है।

### "उपयोगकर्ता के लिए प्रवेश निषेध"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

यह आपके कॉन्फ़िगरेशन में गलत डेटाबेस क्रेडेंशियल्स को इंगित करता है।

### "अज्ञात डेटाबेस"

```
Error: Unknown database 'xoops_db'
```

निर्दिष्ट डेटाबेस MySQL सर्वर पर मौजूद नहीं है।

## कॉन्फ़िगरेशन फ़ाइलें

### XOOPS कॉन्फ़िगरेशन स्थान

मुख्य कॉन्फ़िगरेशन फ़ाइल यहां स्थित है:

```
/mainfile.php
```

मुख्य डेटाबेस सेटिंग्स:

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

## समस्या निवारण चरण

### चरण 1: सत्यापित करें MySQL सेवा चल रही है

#### लिनक्स/यूनिक्स पर

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### चरण 2: MySQL कनेक्टिविटी का परीक्षण करें

#### कमांड लाइन का उपयोग करना

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### चरण 3: डेटाबेस क्रेडेंशियल सत्यापित करें

#### XOOPS कॉन्फ़िगरेशन जांचें

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### चरण 4: सत्यापित करें कि डेटाबेस मौजूद है

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

### चरण 5: उपयोगकर्ता अनुमतियाँ जाँचें

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

## सामान्य मुद्दे और समाधान

### अंक 1: MySQL नहीं चल रहा है

**लक्षण:**
- कनेक्शन अस्वीकृत त्रुटि
- लोकलहोस्ट से कनेक्ट नहीं हो सकता

**समाधान:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### अंक 2: गलत क्रेडेंशियल

**लक्षण:**
- "प्रवेश निषेध" त्रुटि
- "पासवर्ड का उपयोग करना: हाँ" या "पासवर्ड का उपयोग करना: नहीं"

**समाधान:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### अंक 3: डेटाबेस नहीं बनाया गया

**लक्षण:**
- "अज्ञात डेटाबेस" त्रुटि
- डेटाबेस निर्माण के समय इंस्टालेशन विफल रहा

**समाधान:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## डायग्नोस्टिक स्क्रिप्ट

एक व्यापक डायग्नोस्टिक स्क्रिप्ट बनाएं:

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

## संबंधित दस्तावेज़ीकरण

- व्हाइट-स्क्रीन-ऑफ़-डेथ - सामान्य WSOD समस्या निवारण
- ../../01-प्रारंभ करना/कॉन्फ़िगरेशन/प्रदर्शन-अनुकूलन - डेटाबेस प्रदर्शन ट्यूनिंग
- ../../06-प्रकाशक-मॉड्यूल/उपयोगकर्ता-गाइड/बेसिक-कॉन्फ़िगरेशन - प्रारंभिक XOOPS सेटअप
- ../../04-API-संदर्भ/डेटाबेस/XoopsDatabase - डेटाबेस API संदर्भ

---

**अंतिम अद्यतन:** 2026-01-31
**इस पर लागू होता है:** XOOPS 2.5.7+
**PHP संस्करण:** 7.4+