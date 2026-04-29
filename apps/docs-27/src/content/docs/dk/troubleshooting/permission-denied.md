---
title: "Permission Denied Errors"
description: "Fejlfinding af fil- og mappetilladelsesproblemer i XOOPS"
---

Fil- og mappetilladelsesproblemer er almindelige i XOOPS-installationer, især efter upload eller servermigrering. Denne vejledning hjælper med at diagnosticere og løse tilladelsesproblemer.

## Forstå filtilladelser

### Grundlæggende om Linux/Unix-tilladelser

Filtilladelser er repræsenteret som trecifrede koder:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```

## Almindelige tilladelsesfejl

### "Tilladelse nægtet" i Upload

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Kan ikke skrive fil"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Kan ikke oprette mappe"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Kritiske XOOPS mapper

### Mapper, der kræver skrivetilladelser

| Katalog | Minimum | Formål |
|--------|--------|--------|
| `/uploads` | 755 | Bruger uploads |
| `/cache` | 755 | Cache-filer |
| `/templates_c` | 755 | Kompilerede skabeloner |
| `/var` | 755 | Variable data |
| `mainfile.php` | 644 | Konfiguration (læsbar) |

## Linux/Unix fejlfinding

### Trin 1: Tjek aktuelle tilladelser

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Trin 2: Identificer webserverbruger

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Trin 3: Ret ejerskab

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Trin 4: Ret tilladelser

#### Mulighed A: Restriktive tilladelser (anbefales)

```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### Mulighed B: Alt på én gang script

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## Tilladelsesproblemer efter katalog

### Uploads Directory

**Problem:** Kan ikke uploade filer

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Cache-mappe

**Problem:** Cachefiler bliver ikke skrevet

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Skabeloncache

**Problem:** Skabeloner kompileres ikke

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows Fejlfinding

### Trin 1: Tjek filegenskaber

1. Højreklik på fil → Egenskaber
2. Klik på fanen "Sikkerhed".
3. Klik på knappen "Rediger".
4. Vælg bruger, og bekræft tilladelser

### Trin 2: Giv skrivetilladelser

#### Via GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Via kommandolinje (PowerShell):

```powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## PHP Script til at kontrollere tilladelser

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## Bedste praksis

### 1. Princippet om mindste privilegium

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Backup før ændringer

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Hurtig reference

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Relateret dokumentation

- White-Screen-of-Death - Andre almindelige fejl
- Database-Forbindelse-Fejl - Databaseproblemer
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS konfiguration

---

**Sidst opdateret:** 31-01-2026
**Gælder for:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS
