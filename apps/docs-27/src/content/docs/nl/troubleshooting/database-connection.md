---
title: "Databaseverbindingsfouten"
description: "Gids voor probleemoplossing voor XOOPS-databaseverbindingsproblemen"
---
Databaseverbindingsfouten behoren tot de meest voorkomende problemen bij XOOPS-installaties. Deze handleiding biedt systematische stappen voor probleemoplossing om verbindingsproblemen te identificeren en op te lossen.

## Veelvoorkomende foutmeldingen

### "Kan geen verbinding maken met MySQL-server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Deze fout geeft doorgaans aan dat de MySQL-server niet actief is of niet toegankelijk is.

### "Toegang geweigerd voor gebruiker"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Dit duidt op onjuiste databasereferenties in uw configuratie.

### "Onbekende database"

```
Error: Unknown database 'xoops_db'
```

De opgegeven database bestaat niet op de MySQL-server.

## Configuratiebestanden

### XOOPS-configuratielocatie

Het hoofdconfiguratiebestand bevindt zich op:

```
/mainfile.php
```

Belangrijke database-instellingen:

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

## Stappen voor probleemoplossing

### Stap 1: Controleer of de MySQL-service actief is

#### Op Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Stap 2: MySQL-connectiviteit testen

#### Met behulp van de opdrachtregel

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Stap 3: Databasereferenties verifiëren

#### Controleer de XOOPS-configuratie

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Stap 4: Controleer of de database bestaat

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

### Stap 5: Controleer gebruikersrechten

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

## Veelvoorkomende problemen en oplossingen

### Probleem 1: MySQL werkt niet

**Symptomen:**
- Fout bij verbinding geweigerd
- Kan geen verbinding maken met localhost

**Oplossingen:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Probleem 2: Onjuiste inloggegevens

**Symptomen:**
- Fout 'Toegang geweigerd'
- "met wachtwoord: YES" of "met wachtwoord: NEE"

**Oplossingen:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Probleem 3: Database niet gemaakt

**Symptomen:**
- Fout 'Onbekende database'
- Installatie mislukt bij het maken van de database

**Oplossingen:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Diagnostisch script

Maak een uitgebreid diagnostisch script:

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

## Gerelateerde documentatie

- White-Screen-of-Death - Veel voorkomende probleemoplossing voor WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Afstemming van databaseprestaties
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Initiële XOOPS-installatie
- ../../04-API-Reference/Database/XoopsDatabase - Database API referentie

---

**Laatst bijgewerkt:** 31-01-2026
**Van toepassing op:** XOOPS 2.5.7+
**PHP-versies:** 7.4+