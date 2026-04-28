---
title: "Datenbankverbindungsfehler"
description: "Fehlerbehebungsleitfaden für XOOPS-Datenbankverbindungsprobleme"
---

Datenbankverbindungsfehler gehören zu den häufigsten Problemen bei XOOPS-Installationen. Dieser Leitfaden bietet systematische Fehlerbehebungsschritte, um Verbindungsprobleme zu identifizieren und zu beheben.

## Häufige Fehlermeldungen

### "Can't connect to MySQL server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Dieser Fehler zeigt typischerweise an, dass der MySQL-Server nicht läuft oder nicht erreichbar ist.

### "Access denied for user"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Dies zeigt falsche Datenbank-Anmeldeinformationen in Ihrer Konfiguration an.

### "Unknown database"

```
Error: Unknown database 'xoops_db'
```

Die angegebene Datenbank existiert nicht auf dem MySQL-Server.

## Konfigurationsdateien

### XOOPS-Konfigurationsort

Die Hauptkonfigurationsdatei befindet sich unter:

```
/mainfile.php
```

Wichtige Datenbankeinstellungen:

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

## Fehlerbehebungsschritte

### Schritt 1: Überprüfen Sie, ob der MySQL-Service läuft

#### Auf Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Schritt 2: Testen Sie die MySQL-Verbindung

#### Verwenden Sie die Befehlszeile

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Schritt 3: Überprüfen Sie die Datenbankierungsdaten

#### Überprüfen Sie die XOOPS-Konfiguration

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Schritt 4: Überprüfen Sie, ob die Datenbank existiert

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

### Schritt 5: Überprüfen Sie die Benutzerberechtigungen

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

## Häufige Probleme und Lösungen

### Problem 1: MySQL läuft nicht

**Symptome:**
- Verbindung abgelehnt Fehler
- Kann nicht zu localhost verbinden

**Lösungen:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problem 2: Falsche Anmeldeinformationen

**Symptome:**
- "Access denied" Fehler
- "using password: YES" oder "using password: NO"

**Lösungen:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problem 3: Datenbank nicht erstellt

**Symptome:**
- "Unknown database" Fehler
- Installation fehlgeschlagen bei Datenbankerstellung

**Lösungen:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Diagnose-Skript

Erstellen Sie ein umfassendes Diagnose-Skript:

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

## Verwandte Dokumentation

- White-Screen-of-Death - Allgemeine WSOD-Fehlerbehebung
- ../../01-Getting-Started/Configuration/Performance-Optimization - Datenbankleistungs-Tuning
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Initiales XOOPS-Setup
- ../../04-API-Reference/Database/XoopsDatabase - Datenbank-API-Referenz

---

**Zuletzt aktualisiert:** 2026-01-31
**Gilt für:** XOOPS 2.5.7+
**PHP-Versionen:** 7.4+
