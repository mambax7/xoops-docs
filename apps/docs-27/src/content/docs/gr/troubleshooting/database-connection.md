---
title: "Σφάλματα σύνδεσης βάσης δεδομένων"
description: "Οδηγός αντιμετώπισης προβλημάτων για προβλήματα σύνδεσης βάσης δεδομένων XOOPS"
---

Τα σφάλματα σύνδεσης βάσης δεδομένων είναι από τα πιο κοινά ζητήματα στις εγκαταστάσεις XOOPS. Αυτός ο οδηγός παρέχει συστηματικά βήματα αντιμετώπισης προβλημάτων για τον εντοπισμό και την επίλυση προβλημάτων σύνδεσης.

## Συνήθη μηνύματα σφάλματος

## # "Δεν είναι δυνατή η σύνδεση στο MySQL server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Αυτό το σφάλμα συνήθως υποδεικνύει το MySQL server is not running or not accessible.

## # "Απαγορεύεται η πρόσβαση για χρήστη"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Αυτό υποδεικνύει λανθασμένα διαπιστευτήρια βάσης δεδομένων στη διαμόρφωσή σας.

## # "Άγνωστη βάση δεδομένων"

```
Error: Unknown database 'xoops_db'
```

Η καθορισμένη βάση δεδομένων δεν υπάρχει στο MySQL server.

## Αρχεία διαμόρφωσης

## # XOOPS Θέση διαμόρφωσης

Το κύριο αρχείο ρυθμίσεων βρίσκεται στη διεύθυνση:

```
/mainfile.php
```

Βασικές ρυθμίσεις βάσης δεδομένων:

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

## Βήματα αντιμετώπισης προβλημάτων

## # Βήμα 1: Επαληθεύστε το MySQL Service is Running

### # Στο Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

## # Βήμα 2: Δοκιμή MySQL Connectivity

### # Χρήση γραμμής εντολών

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

## # Βήμα 3: Επαληθεύστε τα διαπιστευτήρια βάσης δεδομένων

### # Ελέγξτε τη διαμόρφωση XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

## # Βήμα 4: Βεβαιωθείτε ότι υπάρχει βάση δεδομένων

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

## # Βήμα 5: Ελέγξτε τα δικαιώματα χρήστη

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

## Κοινά ζητήματα και λύσεις

## # Τεύχος 1: MySQL Not Running

**Συμπτώματα:**
- Σφάλμα απόρριψης σύνδεσης
- Δεν είναι δυνατή η σύνδεση με τον localhost

**Λύσεις:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

## # Θέμα 2: Λανθασμένα διαπιστευτήρια

**Συμπτώματα:**
- Σφάλμα "Δεν επιτρέπεται η πρόσβαση".
- "χρήση κωδικού πρόσβασης: YES" ή "χρήση κωδικού πρόσβασης: ΟΧΙ"

**Λύσεις:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

## # Θέμα 3: Η βάση δεδομένων δεν δημιουργήθηκε

**Συμπτώματα:**
- Σφάλμα "Άγνωστη βάση δεδομένων".
- Η εγκατάσταση απέτυχε κατά τη δημιουργία βάσης δεδομένων

**Λύσεις:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Διαγνωστικό σενάριο

Δημιουργήστε ένα ολοκληρωμένο διαγνωστικό σενάριο:

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

## Σχετική τεκμηρίωση

- White-Screen-of-Death - Συνήθης αντιμετώπιση προβλημάτων WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Συντονισμός απόδοσης βάσης δεδομένων
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Αρχική ρύθμιση XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Βάση δεδομένων API αναφορά

---

**Τελευταία ενημέρωση: ** 31-01-2026
**Ισχύει για:** XOOPS 2.5.7+
**PHP Εκδόσεις:** 7.4+
