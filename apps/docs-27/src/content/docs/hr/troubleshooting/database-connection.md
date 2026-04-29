---
title: "Pogreške veze s bazom podataka"
description: "Vodič za rješavanje problema za probleme povezivanja baze podataka XOOPS"
---
Pogreške u vezi s bazom podataka među najčešćim su problemima u instalacijama XOOPS. Ovaj vodič pruža sustavne korake za rješavanje problema za prepoznavanje i rješavanje problema s vezom.

## Uobičajene poruke o pogrešci

### "Ne mogu se spojiti na poslužitelj MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Ova pogreška obično znači da poslužitelj MySQL nije pokrenut ili nije dostupan.

### "Pristup odbijen za korisnika"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Ovo ukazuje na netočne vjerodajnice baze podataka u vašoj konfiguraciji.

### "Nepoznata baza podataka"

```
Error: Unknown database 'xoops_db'
```

Navedena baza podataka ne postoji na poslužitelju MySQL.

## Konfiguracijske datoteke

### XOOPS Lokacija konfiguracije

Glavna konfiguracijska datoteka nalazi se na:

```
/mainfile.php
```

Ključne postavke baze podataka:

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

## Koraci za rješavanje problema

### Korak 1: Provjerite radi li usluga MySQL

#### Na Linuxu/Unixu

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### 2. korak: testirajte povezivost MySQL

#### Korištenje naredbenog retka

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Korak 3: Provjerite vjerodajnice baze podataka

#### Provjerite XOOPS konfiguraciju

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Korak 4: Provjerite postoji li baza podataka

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

### Korak 5: Provjerite korisničke dozvole

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

## Uobičajeni problemi i rješenja

### Problem 1: MySQL ne radi

**Simptomi:**
- Pogreška odbijene veze
- Ne mogu se spojiti na localhost

**Rješenja:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problem 2: netočne vjerodajnice

**Simptomi:**
- Greška "Pristup odbijen".
- "upotrebom lozinke: DA" ili "upotrebom lozinke: NE"

**Rješenja:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problem 3: baza podataka nije stvorena

**Simptomi:**
- Pogreška "Nepoznata baza podataka".
- Instalacija nije uspjela pri stvaranju baze podataka

**Rješenja:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Dijagnostička skripta

Napravite sveobuhvatnu dijagnostičku skriptu:

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

## Povezana dokumentacija

- White-Screen-of-Death - Uobičajeno rješavanje problema s WSOD-om
- ../../01-Getting-Started/Configuration/Performance-Optimization - Podešavanje performansi baze podataka
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Početno postavljanje XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Referenca baze podataka API

---

**Zadnje ažuriranje:** 2026-01-31
**Odnosi se na:** XOOPS 2.5.7+
**PHP Verzije:** 7.4+
