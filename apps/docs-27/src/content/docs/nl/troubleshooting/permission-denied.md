---
title: "Fouten met geweigerde toestemming"
description: "Problemen met bestands- en maprechten oplossen in XOOPS"
---
Problemen met bestands- en maprechten komen vaak voor bij XOOPS-installaties, vooral na upload- of servermigratie. Deze handleiding helpt bij het diagnosticeren en oplossen van toestemmingsproblemen.

## Bestandsrechten begrijpen

### Basisprincipes van Linux/Unix-machtigingen

Bestandsrechten worden weergegeven als driecijferige codes:

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

## Veelvoorkomende toestemmingsfouten

### "Toestemming geweigerd" in Uploaden

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Kan bestand niet schrijven"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Kan map niet aanmaken"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Kritieke XOOPS-mappen

### Directory's waarvoor schrijfrechten vereist zijn

| Telefoonboek | Minimaal | Doel |
|-----------|---------|---------|
| `/uploads` | 755 | Gebruikersuploads |
| `/cache` | 755 | Cachebestanden |
| `/templates_c` | 755 | Samengestelde sjablonen |
| `/var` | 755 | Variabele gegevens |
| `mainfile.php` | 644 | Configuratie (leesbaar) |

## Linux/Unix-probleemoplossing

### Stap 1: Controleer de huidige machtigingen

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Stap 2: Identificeer de webservergebruiker

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Stap 3: Eigendom herstellen

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Stap 4: machtigingen herstellen

#### Optie A: Beperkende machtigingen (aanbevolen)

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

#### Optie B: Alles-in-één-script

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

## Toestemmingsproblemen per directory

### Uploadmap

**Probleem:** Kan geen bestanden uploaden

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Cachemap

**Probleem:** Cachebestanden worden niet geschreven

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Sjablonencache

**Probleem:** Sjablonen worden niet gecompileerd

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows-probleemoplossing

### Stap 1: Controleer de bestandseigenschappen

1. Klik met de rechtermuisknop op bestand → Eigenschappen
2. Klik op het tabblad "Beveiliging".
3. Klik op de knop "Bewerken".
4. Selecteer een gebruiker en controleer de machtigingen

### Stap 2: Verleen schrijfrechten

#### Via GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Via opdrachtregel (PowerShell):

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

## PHP-script om machtigingen te controleren

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

## Beste praktijken

### 1. Principe van de minste privileges

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Back-up vóór wijzigingen

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Snelle referentie

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Gerelateerde documentatie

- White-Screen-of-Death - Andere veel voorkomende fouten
- Databaseverbindingsfouten - Databaseproblemen
- ../../01-Aan de slag/Configuratie/Systeeminstellingen - XOOPS-configuratie

---

**Laatst bijgewerkt:** 31-01-2026
**Van toepassing op:** XOOPS 2.5.7+
**Besturingssysteem:** Linux, Windows, macOS