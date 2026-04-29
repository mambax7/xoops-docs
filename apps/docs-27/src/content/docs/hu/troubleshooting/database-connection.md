---
title: "Adatbázis-kapcsolati hibák"
description: "Hibaelhárítási útmutató XOOPS adatbázis-kapcsolati problémákhoz"
---
Az adatbázis-kapcsolati hibák a XOOPS-telepítések leggyakoribb problémái közé tartoznak. Ez az útmutató szisztematikus hibaelhárítási lépéseket tartalmaz a csatlakozási problémák azonosítására és megoldására.

## Gyakori hibaüzenetek

### "Nem lehet csatlakozni a MySQL szerverhez"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Ez a hiba általában azt jelzi, hogy a MySQL szerver nem fut vagy nem érhető el.

### "A felhasználó hozzáférése megtagadva"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Ez helytelen adatbázis hitelesítő adatokat jelez a konfigurációban.

### "Ismeretlen adatbázis"

```
Error: Unknown database 'xoops_db'
```

A megadott adatbázis nem létezik a MySQL kiszolgálón.

## Konfigurációs fájlok

### XOOPS konfigurációs hely

A fő konfigurációs fájl itt található:

```
/mainfile.php
```

Főbb adatbázisbeállítások:

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

## Hibaelhárítási lépések

### 1. lépés: Ellenőrizze, hogy a MySQL szolgáltatás fut-e

#### A Linux/Unix-n

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### 2. lépés: A MySQL kapcsolat tesztelése

#### A parancssor használata

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### 3. lépés: Ellenőrizze az adatbázis hitelesítő adatait

#### Ellenőrizze a XOOPS konfigurációt

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### 4. lépés: Ellenőrizze az adatbázis létezését

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

### 5. lépés: Ellenőrizze a felhasználói engedélyeket

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

## Gyakori problémák és megoldások

### 1. probléma: MySQL nem fut

**Tünetek:**
- Kapcsolódás elutasítva hiba
- Nem lehet csatlakozni a localhosthoz

**Megoldások:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### 2. probléma: hibás hitelesítő adatok

**Tünetek:**
- "Hozzáférés megtagadva" hiba
- "jelszó használata: YES" vagy "jelszó használata: NEM"

**Megoldások:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### 3. probléma: Az adatbázis nem jött létre

**Tünetek:**
- "Ismeretlen adatbázis" hiba
- A telepítés nem sikerült az adatbázis létrehozásakor

**Megoldások:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Diagnosztikai szkript

Hozzon létre egy átfogó diagnosztikai szkriptet:

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

## Kapcsolódó dokumentáció

- White-Screen-of-Death - Általános WSOD hibaelhárítás
- ../../01-Getting-Started/Configuration/Performance-Optimization - Adatbázis teljesítmény hangolás
- ../../06-Publisher-module/User-Guide/Basic-Configuration - A XOOPS kezdeti beállítása
- ../../04-API-Reference/Database/XOOPSDatabase - Adatbázis API hivatkozás

---

**Utolsó frissítés:** 2026.01.31
**Érvényes:** XOOPS 2.5.7+
**PHP verziók:** 7.4+
