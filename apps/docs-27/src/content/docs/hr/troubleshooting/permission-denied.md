---
title: "Pogreške odbijene dozvole"
description: "Rješavanje problema s dopuštenjima datoteka i direktorija u XOOPS"
---
Problemi s dozvolama za datoteke i direktorije česti su u instalacijama XOOPS, posebno nakon prijenosa ili migracije poslužitelja. Ovaj vodič pomaže u dijagnosticiranju i rješavanju problema s dozvolama.

## Razumijevanje dopuštenja za datoteke

### Osnove dozvola za Linux/Unix

dozvole za datoteke predstavljene su kao troznamenkasti kodovi:

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

## Uobičajene pogreške dopuštenja

### "dozvola odbijena" u prijenosu

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Nije moguće napisati datoteku"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Ne mogu stvoriti imenik"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Kritični direktoriji XOOPS

### Direktoriji koji zahtijevaju dozvole za pisanje

| Imenik | Minimalno | Svrha |
|-----------|---------|---------|
| `/uploads` | 755 | Korisnik uploads |
| `/cache` | 755 | Datoteke predmemorije |
| `/templates_c` | 755 | Sastavljeno templates |
| `/var` | 755 | Varijabilni podaci |
| `mainfile.php` | 644 | Konfiguracija (čitko) |

## Linux/Unix Rješavanje problema

### Korak 1: Provjerite trenutne dozvole

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Korak 2: Identificirajte korisnika web poslužitelja

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Korak 3: Popravite vlasništvo

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Korak 4: Popravite dozvole

#### Opcija A: Restriktivna dopuštenja (preporučeno)

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

#### Opcija B: Sveobuhvatna skripta

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

## Problemi s dozvolama prema imeniku

### Imenik prijenosa

**Problem:** Ne mogu učitati datoteke

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Imenik predmemorije

**Problem:** Datoteke u predmemoriju se ne zapisuju

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### predmemorija predložaka

**Problem:** predlošci se ne kompiliraju

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows Rješavanje problema

### Korak 1: Provjerite svojstva datoteke

1. Desnom tipkom miša kliknite datoteku → Svojstva
2. Pritisnite karticu "Sigurnost".
3. Pritisnite gumb "Uredi".
4. Odaberite korisnika i potvrdite dopuštenja

### Korak 2: Dodijelite dozvole za pisanje

#### Preko GUI-ja:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Preko naredbenog retka (PowerShell):

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

## PHP Skripta za provjeru dopuštenja

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

## Najbolji primjeri iz prakse

### 1. Načelo najmanje privilegije

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Sigurnosna kopija prije promjena

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Brza referenca

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Povezana dokumentacija

- Bijeli ekran smrti - Ostale uobičajene pogreške
- Database-Connection-Errors - Database problems
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS konfiguracija

---

**Zadnje ažuriranje:** 2026-01-31
**Odnosi se na:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS
