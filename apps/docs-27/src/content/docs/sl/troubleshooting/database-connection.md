---
title: "Napake povezave z bazo podatkov"
description: "Priročnik za odpravljanje težav pri XOOPS težavah s povezavo baze podatkov"
---
Napake v povezavi z bazo podatkov so med najpogostejšimi težavami pri XOOPS namestitvah. Ta priročnik ponuja sistematične korake za odpravljanje težav za prepoznavanje in reševanje težav s povezavo.

## Pogosta sporočila o napakah

### "Ne morem se povezati s strežnikom MySQL"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
Ta napaka običajno pomeni, da strežnik MySQL ne deluje ali ni dostopen.

### "Uporabniku zavrnjen dostop"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
To kaže na nepravilne poverilnice baze podatkov v vaši konfiguraciji.

### "Neznana zbirka podatkov"
```
Error: Unknown database 'xoops_db'
```
Navedena zbirka podatkov ne obstaja na strežniku MySQL.

## Konfiguracijske datoteke

### XOOPS Lokacija konfiguracije

Glavna konfiguracijska datoteka se nahaja na:
```
/mainfile.php
```
Ključne nastavitve baze podatkov:
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
## Koraki za odpravljanje težav

### 1. korak: Preverite, ali se storitev MySQL izvaja

#### Na Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### 2. korak: preizkusite povezljivost MySQL

#### Uporaba ukazne vrstice
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### 3. korak: Preverite poverilnice baze podatkov

#### Preverite XOOPS konfiguracijo
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### 4. korak: Preverite, ali zbirka podatkov obstaja
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
### 5. korak: Preverite uporabniška dovoljenja
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
## Pogoste težave in rešitve

### 1. težava: MySQL ne deluje

**Simptomi:**
- Napaka zavrnjena povezava
- Ni mogoče vzpostaviti povezave z lokalnim gostiteljem

**Rešitve:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### 2. težava: Napačne poverilnice

**Simptomi:**
- Napaka "Dostop zavrnjen".
- "z uporabo gesla: YES" ali "z uporabo gesla: NE"

**Rešitve:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### Težava 3: Zbirka podatkov ni ustvarjena

**Simptomi:**
- Napaka "Neznana zbirka podatkov".
- Namestitev ni uspela pri ustvarjanju baze podatkov

**Rešitve:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## Diagnostični skript

Ustvarite celovit diagnostični skript:
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

- White-Screen-of-Death - Pogosta WSOD odpravljanje težav
- ../../01-Getting-Started/Configuration/Performance-Optimization - Uravnavanje delovanja baze podatkov
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Začetna nastavitev XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Referenca zbirke podatkov API

---

**Nazadnje posodobljeno:** 2026-01-31
**Velja za:** XOOPS 2.5.7+
**PHP Različice:** 7.4+