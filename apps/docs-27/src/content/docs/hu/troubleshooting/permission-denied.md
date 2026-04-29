---
title: "Engedély megtagadott hibák"
description: "Fájl- és könyvtárengedélyekkel kapcsolatos problémák hibaelhárítása XOOPS-ban"
---
A fájl- és könyvtárengedélyezési problémák gyakoriak a XOOPS telepítéseknél, különösen feltöltés vagy kiszolgáló áttelepítése után. Ez az útmutató segít az engedélyekkel kapcsolatos problémák diagnosztizálásában és megoldásában.

## A fájlengedélyek értelmezése

### Linux/Unix Az engedély alapjai

A fájljogosultságok háromjegyű kódokként jelennek meg:

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

## Általános engedélyezési hibák

### "Engedély megtagadva" a Feltöltésben

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Nem lehet fájlt írni"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Nem lehet könyvtárat létrehozni"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Kritikus XOOPS-könyvtárak

### Írási engedélyt igénylő könyvtárak

| Címtár | Minimum | Cél |
|-----------|---------|----------|
| `/uploads` | 755 | Felhasználói feltöltések |
| `/cache` | 755 | Gyorsítótár fájlok |
| `/templates_c` | 755 | Összeállított sablonok |
| `/var` | 755 | Változó adatok |
| `mainfile.php` | 644 | Konfiguráció (olvasható) |

## Linux/Unix Hibaelhárítás

### 1. lépés: Ellenőrizze a jelenlegi engedélyeket

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### 2. lépés: A webszerver felhasználó azonosítása

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### 3. lépés: Javítsa ki a tulajdonjogot

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### 4. lépés: Javítsa ki az engedélyeket

#### A lehetőség: Korlátozó engedélyek (ajánlott)

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

#### B lehetőség: All-at-once Script

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

## Engedélyproblémák címtár szerint

### Feltöltési könyvtár

**Probléma:** Nem lehet fájlokat feltölteni

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Gyorsítótár könyvtár

**Probléma:** A gyorsítótár-fájlok nem íródnak

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Sablonok gyorsítótár

**Probléma:** A sablonok fordítása nem történik meg

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows hibaelhárítás

### 1. lépés: Ellenőrizze a fájl tulajdonságait

1. Kattintson jobb gombbal a fájl → Tulajdonságok menüpontra
2. Kattintson a "Biztonság" fülre
3. Kattintson a "Szerkesztés" gombra
4. Válassza ki a felhasználót, és ellenőrizze az engedélyeket

### 2. lépés: Adjon írási engedélyt

#### GUI-n keresztül:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Parancssoron keresztül (PowerShell):

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

## PHP szkript az engedélyek ellenőrzéséhez

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

## Bevált gyakorlatok

### 1. A legkisebb kiváltság elve

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Biztonsági mentés a változtatások előtt

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Gyors referencia

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Kapcsolódó dokumentáció

- White-Screen-of-Death - Egyéb gyakori hibák
- Adatbázis-kapcsolat-hibák - Adatbázis-problémák
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS konfiguráció

---

**Utolsó frissítés:** 2026.01.31
**Érvényes:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS
