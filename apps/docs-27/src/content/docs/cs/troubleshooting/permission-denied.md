---
title: "Chyby povolení odepřeno"
description: "Odstraňování problémů s oprávněními k souborům a adresářům v XOOPS"
---

Problémy s oprávněním k souborům a adresářům jsou běžné v instalacích XOOPS, zejména po uploadu nebo migraci serveru. Tato příručka pomáhá diagnostikovat a řešit problémy s oprávněními.

## Vysvětlení oprávnění souborů

### Základy oprávnění Linux/Unix

Oprávnění k souboru jsou reprezentována jako třímístné kódy:

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

## Běžné chyby oprávnění

### "Oprávnění odepřeno" v Upload

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Nelze zapsat soubor"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Nelze vytvořit adresář"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Kritické adresáře XOOPS

### Adresáře vyžadující oprávnění k zápisu

| Adresář | Minimálně | Účel |
|-----------|---------|---------|
| `/uploads` | 755 | Uživatelské uploady |
| `/cache` | 755 | Soubory mezipaměti |
| `/templates_c` | 755 | Kompilované šablony |
| `/var` | 755 | Proměnné údaje |
| `mainfile.php` | 644 | Konfigurace (čitelná) |

## Linux/Unix Odstraňování problémů

### Krok 1: Zkontrolujte aktuální oprávnění

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Krok 2: Identifikujte uživatele webového serveru

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Krok 3: Opravte vlastnictví

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Krok 4: Opravte oprávnění

#### Možnost A: Omezující oprávnění (doporučeno)

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

#### Možnost B: All-at-once Script

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

## Problémy s oprávněními podle adresáře

### Adresář pro nahrávání

**Problém:** Nelze nahrát soubory

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Adresář mezipaměti

**Problém:** Soubory mezipaměti se nezapisují

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Mezipaměť šablon

**Problém:** Šablony se nezkompilují

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Odstraňování problémů se systémem Windows

### Krok 1: Zkontrolujte vlastnosti souboru

1. Klepněte pravým tlačítkem na soubor → Vlastnosti
2. Klikněte na kartu „Zabezpečení“.
3. Klikněte na tlačítko "Upravit".
4. Vyberte uživatele a ověřte oprávnění

### Krok 2: Udělte oprávnění k zápisu

#### Přes GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Přes příkazový řádek (PowerShell):

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

## Skript PHP pro kontrolu oprávnění

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

## Nejlepší postupy

### 1. Princip nejmenšího privilegia

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Zálohování před změnami

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Rychlý průvodce

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Související dokumentace

- White-Screen-of-Death - Další běžné chyby
- Database-Connection-Errors - Databázové problémy
- ../../01-Getting-Started/Configuration/System-Settings - Konfigurace XOOPS

---

**Poslední aktualizace:** 2026-01-31
**Platí pro:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS