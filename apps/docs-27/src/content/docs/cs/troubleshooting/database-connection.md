---
title: "Chyby připojení k databázi"
description: "Průvodce odstraňováním problémů pro problémy s připojením k databázi XOOPS"
---

Chyby připojení k databázi patří mezi nejčastější problémy v instalacích XOOPS. Tato příručka poskytuje systematické kroky pro odstraňování problémů k identifikaci a řešení problémů s připojením.

## Běžné chybové zprávy

### "Nelze se připojit k serveru MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Tato chyba obvykle znamená, že server MySQL není spuštěn nebo není přístupný.

### "Přístup uživateli odepřen"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

To označuje nesprávné přihlašovací údaje databáze ve vaší konfiguraci.

### "Neznámá databáze"

```
Error: Unknown database 'xoops_db'
```

Zadaná databáze na serveru MySQL neexistuje.

## Konfigurační soubory

### Umístění konfigurace XOOPS

Hlavní konfigurační soubor se nachází na adrese:

```
/mainfile.php
```

Klíčová nastavení databáze:

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

## Kroky pro odstraňování problémů

### Krok 1: Ověřte, že služba MySQL běží

#### Na Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Krok 2: Otestujte připojení MySQL

#### Použití příkazového řádku

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Krok 3: Ověřte přihlašovací údaje k databázi

#### Zkontrolujte konfiguraci XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Krok 4: Ověřte existenci databáze

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

### Krok 5: Zkontrolujte uživatelská oprávnění

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

## Běžné problémy a řešení

### Problém 1: MySQL neběží

**Příznaky:**
- Chyba připojení odmítnuta
- Nelze se připojit k localhost

**Řešení:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problém 2: Nesprávné přihlašovací údaje

**Příznaky:**
- Chyba "Přístup odepřen".
- "používáte heslo: YES" nebo "používáte heslo: NE"

**Řešení:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problém 3: Databáze nebyla vytvořena

**Příznaky:**
- Chyba "Neznámá databáze".
- Instalace se nezdařila při vytváření databáze

**Řešení:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Diagnostický skript

Vytvořte komplexní diagnostický skript:

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

## Související dokumentace

- White-Screen-of-Death - Běžné odstraňování problémů WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Ladění výkonu databáze
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Počáteční nastavení XOOPS
- ../../04-API-Reference/Database/XOOPSDatabase - Reference databáze API

---

**Poslední aktualizace:** 2026-01-31
**Platí pro:** XOOPS 2.5.7+
**PHP Verze:** 7.4+