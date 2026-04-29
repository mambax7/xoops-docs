---
title: "Wit scherm des doods (WSOD)"
description: "Diagnose en oplossing van het witte scherm van de dood in XOOPS"
---
> Hoe u lege witte pagina's kunt diagnosticeren en repareren in XOOPS.

---

## Diagnostisch stroomdiagram

```mermaid
flowchart TD
    A[White Screen] --> B{PHP Errors Visible?}
    B -->|No| C[Enable Error Display]
    B -->|Yes| D[Read Error Message]

    C --> E{Errors Now Visible?}
    E -->|Yes| D
    E -->|No| F[Check PHP Error Log]

    D --> G{Error Type?}
    G -->|Memory| H[Increase memory_limit]
    G -->|Syntax| I[Fix PHP Syntax]
    G -->|Missing File| J[Restore File]
    G -->|Permission| K[Fix Permissions]
    G -->|Database| L[Check DB Connection]

    F --> M{Log Has Errors?}
    M -->|Yes| D
    M -->|No| N[Check Web Server Logs]

    N --> O{Found Issue?}
    O -->|Yes| D
    O -->|No| P[Enable XOOPS Debug]
```

---

## Snelle diagnose

### Stap 1: Schakel PHP-foutweergave in

Tijdelijk toevoegen aan `mainfile.php`:

```php
<?php
// Add at the very top, after <?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
```

### Stap 2: Controleer het PHP-foutenlogboek

```bash
# Common log locations
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
tail -100 /var/log/nginx/error.log

# Or check PHP info for log location
php -i | grep error_log
```

### Stap 3: Schakel XOOPS-foutopsporing in

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);
```

---

## Veel voorkomende oorzaken en oplossingen

```mermaid
pie title WSOD Common Causes
    "Memory Limit" : 25
    "PHP Syntax Error" : 20
    "Missing Files" : 15
    "Database Issues" : 15
    "Permissions" : 10
    "Template Errors" : 10
    "Timeout" : 5
```

### 1. Geheugenlimiet overschreden

**Symptomen:**
- Blanco pagina bij grote operaties
- Werkt voor kleine gegevens, mislukt voor grote gegevens

**Fout:**
```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

**Oplossingen:**

```php
// In mainfile.php
ini_set('memory_limit', '256M');

// Or in .htaccess
php_value memory_limit 256M

// Or in php.ini
memory_limit = 256M
```

### 2. Syntaxisfout PHP

**Symptomen:**
- WSOD na het bewerken van het PHP-bestand
- Specifieke pagina mislukt, andere werken

**Fout:**
```
Parse error: syntax error, unexpected '}' in /path/file.php on line 123
```

**Oplossingen:**

```bash
# Check file for syntax errors
php -l /path/to/file.php

# Check all PHP files in module
find modules/mymodule -name "*.php" -exec php -l {} \;
```

### 3. Vereist bestand ontbreekt

**Symptomen:**
- WSOD na upload/migratie
- Willekeurige pagina's mislukken

**Fout:**
```
Fatal error: require_once(): Failed opening required 'class/Helper.php'
```

**Oplossingen:**

```bash
# Re-upload missing files
# Compare against fresh installation
diff -r /path/to/xoops /path/to/fresh-xoops

# Check file permissions
ls -la class/
```

### 4. Databaseverbinding mislukt

**Symptomen:**
- Op alle pagina's wordt WSOD weergegeven
- Statische bestanden (afbeeldingen, CSS) werken

**Fout:**
```
Warning: mysqli_connect(): Access denied for user
```

**Oplossingen:**

```php
// Verify credentials in mainfile.php
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_USER', 'your_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'your_database');

// Test connection manually
<?php
$conn = new mysqli('localhost', 'user', 'pass', 'database');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

### 5. Toestemmingsproblemen

**Symptomen:**
- WSOD bij het schrijven van bestanden
- Cache-/compileerfouten

**Oplossingen:**

```bash
# Fix directory permissions
chmod -R 755 htdocs/
chmod -R 777 xoops_data/
chmod -R 777 uploads/

# Fix ownership
chown -R www-data:www-data /path/to/xoops
```

### 6. Smarty-sjabloonfout

**Symptomen:**
- WSOD op specifieke pagina's
- Werkt na het wissen van de cache

**Oplossingen:**

```bash
# Clear Smarty cache
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Check template syntax
```

### 7. Maximale uitvoeringstijd

**Symptomen:**
- WSOD na ~30 seconden
- Lange operaties mislukken

**Fout:**
```
Fatal error: Maximum execution time of 30 seconds exceeded
```

**Oplossingen:**

```php
// In mainfile.php
set_time_limit(300);

// Or in .htaccess
php_value max_execution_time 300
```

---

## Foutopsporingsscript

Maak `debug.php` aan in de XOOPS-hoofdmap:

```php
<?php
/**
 * XOOPS Debug Script
 * Delete after troubleshooting!
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>XOOPS Debug</h1>";

// Check PHP version
echo "<h2>PHP Version</h2>";
echo "PHP " . PHP_VERSION . "<br>";

// Check required extensions
echo "<h2>Required Extensions</h2>";
$required = ['mysqli', 'gd', 'curl', 'json', 'mbstring'];
foreach ($required as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "$status $ext<br>";
}

// Check file permissions
echo "<h2>Directory Permissions</h2>";
$dirs = [
    'xoops_data' => 'xoops_data',
    'uploads' => 'uploads',
    'cache' => 'xoops_data/caches'
];
foreach ($dirs as $name => $path) {
    $writable = is_writable($path) ? '✓ Writable' : '✗ Not writable';
    echo "$name: $writable<br>";
}

// Test database connection
echo "<h2>Database Connection</h2>";
if (file_exists('mainfile.php')) {
    // Extract credentials (simple regex, not production safe)
    $mainfile = file_get_contents('mainfile.php');
    preg_match("/XOOPS_DB_HOST.*'(.+?)'/", $mainfile, $host);
    preg_match("/XOOPS_DB_USER.*'(.+?)'/", $mainfile, $user);
    preg_match("/XOOPS_DB_PASS.*'(.+?)'/", $mainfile, $pass);
    preg_match("/XOOPS_DB_NAME.*'(.+?)'/", $mainfile, $name);

    if (!empty($host[1])) {
        $conn = @new mysqli($host[1], $user[1], $pass[1], $name[1]);
        if ($conn->connect_error) {
            echo "✗ Connection failed: " . $conn->connect_error;
        } else {
            echo "✓ Connected to database";
            $conn->close();
        }
    }
} else {
    echo "mainfile.php not found";
}

// Memory info
echo "<h2>Memory</h2>";
echo "Memory Limit: " . ini_get('memory_limit') . "<br>";
echo "Current Usage: " . round(memory_get_usage() / 1024 / 1024, 2) . " MB<br>";

// Check error log location
echo "<h2>Error Log</h2>";
echo "Location: " . ini_get('error_log');
```

---

## Preventie

```mermaid
graph LR
    A[Backup Before Changes] --> E[Stable Site]
    B[Test in Development] --> E
    C[Monitor Error Logs] --> E
    D[Use Version Control] --> E
```

1. **Maak altijd een back-up** voordat u wijzigingen aanbrengt
2. **Test lokaal** voordat u het implementeert
3. **Controleer de foutenlogboeken** regelmatig
4. **Gebruik git** voor het bijhouden van wijzigingen
5. **Houd PHP up-to-date** binnen ondersteunde versies

---

## Gerelateerde documentatie

- Databaseverbindingsfouten
- Toestemming geweigerde fouten
- Schakel de foutopsporingsmodus in

---

#xoops #troubleshooting #wsod #debugging #errors