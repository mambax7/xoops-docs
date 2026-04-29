---
title: "Napake zavrnjenega dovoljenja"
description: "Odpravljanje težav z dovoljenji za datoteke in imenike v XOOPS"
---
Težave z dovoljenji za datoteke in imenike so pogoste pri namestitvah XOOPS, zlasti po nalaganju ali selitvi strežnika. Ta vodnik pomaga pri diagnosticiranju in reševanju težav z dovoljenji.

## Razumevanje dovoljenj za datoteke

### Linux/Unix Osnove dovoljenj

Dovoljenja za datoteke so predstavljena kot trimestne kode:
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
## Pogoste napake pri dovoljenju

### "Dovoljenje zavrnjeno" v nalaganju
```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```
### "Datoteke ni mogoče zapisati"
```
Error: Unable to write file to /var/www/html/xoops/cache/
```
### "Ne morem ustvariti imenika"
```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```
## Kritični XOOPS Imeniki

### Imeniki, ki zahtevajo dovoljenja za pisanje

| Imenik | Najmanj | Namen |
|-----------|---------|---------|
| `/uploads` | 755 | Uporabniški prenosi |
| `/cache` | 755 | Predpomnilnik datotek |
| `/templates_c` | 755 | Prevedene predloge |
| `/var` | 755 | Spremenljivi podatki |
| `mainfile.php` | 644 | Konfiguracija (berljivo) |

## Linux/Unix Odpravljanje težav

### 1. korak: Preverite trenutna dovoljenja
```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```
### 2. korak: Identificirajte uporabnika spletnega strežnika
```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```
### 3. korak: Popravite lastništvo
```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```
### 4. korak: Popravite dovoljenja

#### Možnost A: omejevalna dovoljenja (priporočeno)
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
#### Možnost B: skript vse naenkrat
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
## Težave z dovoljenji po imeniku

### Imenik naloženih datotek

**Težava:** Ni mogoče naložiti datotek
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```
### Imenik predpomnilnika

**Težava:** Datoteke v predpomnilnik se ne zapisujejo
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```
### Predpomnilnik predlog

**Težava:** Predloge se ne prevajajo
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```
## Odpravljanje težav v sistemu Windows

### 1. korak: Preverite lastnosti datoteke

1. Z desno tipko miške kliknite datoteko → Lastnosti
2. Kliknite zavihek "Varnost".
3. Kliknite gumb "Uredi".
4. Izberite uporabnika in preverite dovoljenja

### 2. korak: podelite dovoljenja za pisanje

#### Prek GUI:
```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```
#### Prek ukazne vrstice (PowerShell):
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
## PHP Skript za preverjanje dovoljenj
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
## Najboljše prakse

### 1. Načelo najmanjšega privilegija
```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```
### 2. Varnostno kopiranje pred spremembami
```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```
## Hitra referenca
```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```
## Povezana dokumentacija

- White-Screen-of-Death - Druge pogoste napake
- Database-Connection-Errors - Database Težave
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS konfiguracija

---

**Nazadnje posodobljeno:** 2026-01-31
**Velja za:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS