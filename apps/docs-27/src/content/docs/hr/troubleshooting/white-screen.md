---
title: "Bijeli ekran smrti (WSOD)"
description: "Dijagnosticiranje i popravljanje bijelog ekrana smrti u XOOPS"
---
> Kako dijagnosticirati i popraviti prazne bijele stranice u XOOPS.

---

## Dijagram toka dijagnostike

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

## Brza dijagnoza

### Korak 1: Omogućite prikaz pogreške PHP

Privremeno dodaj u `mainfile.php`:

```php
<?php
// Add at the very top, after <?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
```

### Korak 2: Provjerite zapisnik pogrešaka PHP

```bash
# Common log locations
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
tail -100 /var/log/nginx/error.log

# Or check PHP info for log location
php -i | grep error_log
```

### Korak 3: Omogućite otklanjanje pogrešaka XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);
```

---

## Uobičajeni uzroci i rješenja

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

### 1. Ograničenje memorije premašeno

**Simptomi:**
- Prazna stranica o velikim operacijama
- Radi za male podatke, ne uspijeva za velike

**Pogreška:**
```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

**Rješenja:**

```php
// In mainfile.php
ini_set('memory_limit', '256M');

// Or in .htaccess
php_value memory_limit 256M

// Or in php.ini
memory_limit = 256M
```

### 2. PHP Sintaktička pogreška

**Simptomi:**
- WSOD nakon uređivanja datoteke PHP
- Određena stranica ne uspijeva, druge rade

**Pogreška:**
```
Parse error: syntax error, unexpected '}' in /path/file.php on line 123
```

**Rješenja:**

```bash
# Check file for syntax errors
php -l /path/to/file.php

# Check all PHP files in module
find modules/mymodule -name "*.php" -exec php -l {} \;
```

### 3. Nedostaje potrebna datoteka

**Simptomi:**
- WSOD nakon učitavanja/migracije
- Nasumične stranice ne uspijevaju

**Pogreška:**
```
Fatal error: require_once(): Failed opening required 'class/Helper.php'
```

**Rješenja:**

```bash
# Re-upload missing files
# Compare against fresh installation
diff -r /path/to/xoops /path/to/fresh-xoops

# Check file permissions
ls -la class/
```

### 4. Povezivanje baze podataka nije uspjelo

**Simptomi:**
- Sve stranice prikazuju WSOD
- Statičke datoteke (slike, CSS) rade

**Pogreška:**
```
Warning: mysqli_connect(): Access denied for user
```

**Rješenja:**

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

### 5. Problemi s dozvolama

**Simptomi:**
- WSOD prilikom pisanja datoteka
- Pogreške predmemorije/kompilacije

**Rješenja:**

```bash
# Fix directory permissions
chmod -R 755 htdocs/
chmod -R 777 xoops_data/
chmod -R 777 uploads/

# Fix ownership
chown -R www-data:www-data /path/to/xoops
```

### 6. Pogreška predloška Smarty

**Simptomi:**
- WSOD na određenim stranicama
- Radi nakon brisanja cache

**Rješenja:**

```bash
# Clear Smarty cache
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Check template syntax
```

### 7. Maksimalno vrijeme izvršenja

**Simptomi:**
- WSOD nakon ~30 sekundi
- Duge operacije ne uspijevaju

**Pogreška:**
```
Fatal error: Maximum execution time of 30 seconds exceeded
```

**Rješenja:**

```php
// In mainfile.php
set_time_limit(300);

// Or in .htaccess
php_value max_execution_time 300
```

---

## Skripta za otklanjanje pogrešaka

Stvorite `debug.php` u korijenu XOOPS:

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

## Prevencija

```mermaid
graph LR
    A[Backup Before Changes] --> E[Stable Site]
    B[Test in Development] --> E
    C[Monitor Error Logs] --> E
    D[Use Version Control] --> E
```

1. **Uvijek napravite sigurnosnu kopiju** prije unošenja promjena
2. **Testirajte lokalno** prije implementacije
3. **Redovno pratite zapise o pogreškama**
4. **Koristite git** za praćenje promjena
5. **Držite PHP ažuriranim** unutar podržanih verzija

---

## Povezana dokumentacija

- Pogreške veze s bazom podataka
- Pogreške odbijene dozvole
- Omogućite način otklanjanja pogrešaka

---

#xoops #otklanjanje problema #wsod #debugging #errors
