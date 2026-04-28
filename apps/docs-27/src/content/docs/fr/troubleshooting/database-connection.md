---
title: "Erreurs de connexion à la base de données"
description: "Guide de dépannage pour les problèmes de connexion à la base de données XOOPS"
---

Les erreurs de connexion à la base de données sont parmi les problèmes les plus courants dans les installations XOOPS. Ce guide fournit des étapes de dépannage systématiques pour identifier et résoudre les problèmes de connexion.

## Messages d'erreur courants

### "Can't connect to MySQL server"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Cette erreur indique généralement que le serveur MySQL n'est pas en cours d'exécution ou qu'il n'est pas accessible.

### "Access denied for user"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Cela indique des identifiants de base de données incorrects dans votre configuration.

### "Unknown database"

```
Error: Unknown database 'xoops_db'
```

La base de données spécifiée n'existe pas sur le serveur MySQL.

## Fichiers de configuration

### Emplacement de la configuration XOOPS

Le fichier de configuration principal est situé à:

```
/mainfile.php
```

Paramètres clés de la base de données:

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

## Étapes de dépannage

### Étape 1: Vérifier que le service MySQL est en cours d'exécution

#### Sur Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Étape 2: Tester la connectivité MySQL

#### Utilisation de la ligne de commande

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Étape 3: Vérifier les identifiants de la base de données

#### Vérifier la configuration XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Étape 4: Vérifier que la base de données existe

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

### Étape 5: Vérifier les permissions de l'utilisateur

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

## Problèmes courants et solutions

### Problème 1: MySQL ne fonctionne pas

**Symptômes:**
- Erreur de connexion refusée
- Impossible de se connecter à localhost

**Solutions:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Problème 2: Identifiants incorrects

**Symptômes:**
- Erreur "Access denied"
- "using password: YES" ou "using password: NO"

**Solutions:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Problème 3: Base de données non créée

**Symptômes:**
- Erreur "Unknown database"
- L'installation a échoué à la création de la base de données

**Solutions:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Script de diagnostic

Créez un script de diagnostic complet:

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

## Documentation connexe

- White-Screen-of-Death - Dépannage courant WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Optimisation des performances de la base de données
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Configuration initiale de XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Référence API de la base de données

---

**Dernière mise à jour:** 2026-01-31
**S'applique à:** XOOPS 2.5.7+
**Versions PHP:** 7.4+
