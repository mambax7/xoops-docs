---
title: "Databaseforbindelsesfejl"
description: "Fejlfindingsvejledning til XOOPS-databaseforbindelsesproblemer"
---

Databaseforbindelsesfejl er blandt de mest almindelige problemer i XOOPS-installationer. Denne vejledning indeholder systematiske fejlfindingstrin for at identificere og løse forbindelsesproblemer.

## Almindelige fejlmeddelelser

### "Kan ikke oprette forbindelse til MySQL-serveren"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Denne fejl angiver typisk, at MySQL-serveren ikke kører eller ikke er tilgængelig.

### "Adgang nægtet for bruger"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Dette indikerer forkerte databaselegitimationsoplysninger i din konfiguration.

### "Ukendt database"

```
Error: Unknown database 'xoops_db'
```

Den angivne database findes ikke på MySQL-serveren.

## Konfigurationsfiler

### XOOPS Konfigurationsplacering

Hovedkonfigurationsfilen er placeret på:

```
/mainfile.php
```

Nøgledatabaseindstillinger:

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

## Fejlfindingstrin

### Trin 1: Bekræft, at MySQL-tjenesten kører

#### På Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Trin 2: Test MySQL-forbindelsen

#### Bruger kommandolinjen

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Trin 3: Bekræft databaselegitimationsoplysninger

#### Tjek XOOPS-konfigurationen

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Trin 4: Bekræft, at databasen eksisterer

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

### Trin 5: Tjek brugertilladelser

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

## Almindelige problemer og løsninger

### Problem 1: MySQL kører ikke

**Symptomer:**
- Fejl afvist forbindelse
- Kan ikke oprette forbindelse til localhost

**Løsninger:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problem 2: Forkerte legitimationsoplysninger

**Symptomer:**
- "Adgang nægtet" fejl
- "bruger adgangskode: YES" eller "bruger adgangskode: NEJ"

**Løsninger:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problem 3: Database ikke oprettet

**Symptomer:**
- "Ukendt database" fejl
- Installation mislykkedes ved oprettelse af database

**Løsninger:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Diagnostisk script

Opret et omfattende diagnostisk script:

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

## Relateret dokumentation

- White-Screen-of-Death - Almindelig WSOD fejlfinding
- ../../01-Getting-Started/Configuration/Performance-Optimization - Indstilling af databaseydelse
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Indledende XOOPS opsætning
- ../../04-API-Reference/Database/XoopsDatabase - Database API reference

---

**Sidst opdateret:** 31-01-2026
**Gælder for:** XOOPS 2.5.7+
**PHP versioner:** 7.4+
