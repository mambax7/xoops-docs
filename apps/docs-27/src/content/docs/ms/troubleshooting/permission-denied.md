---
title: "Kebenaran Ditolak Ralat"
description: "Menyelesaikan masalah kebenaran fail dan direktori dalam XOOPS"
---
Isu kebenaran fail dan direktori adalah perkara biasa dalam XOOPS pemasangan, terutamanya selepas muat naik atau pemindahan pelayan. Panduan ini membantu mendiagnosis dan menyelesaikan masalah kebenaran.

## Memahami Kebenaran Fail

### Linux/Unix Asas Kebenaran

Kebenaran fail diwakili sebagai kod tiga digit:
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
## Ralat Kebenaran Biasa

### "Kebenaran ditolak" dalam Muat Naik
```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```
### "Tidak dapat menulis fail"
```
Error: Unable to write file to /var/www/html/xoops/cache/
```
### "Tidak boleh membuat direktori"
```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```
## Direktori XOOPS Kritikal

### Direktori Memerlukan Kebenaran Tulis

| Direktori | Minimum | Tujuan |
|-----------|---------|---------|
| `/uploads` | 755 | Muat naik pengguna |
| `/cache` | 755 | Cache fail |
| `/templates_c` | 755 | Templat yang disusun |
| `/var` | 755 | Data boleh ubah |
| `mainfile.php` | 644 | Konfigurasi (boleh dibaca) |

## Linux/Unix Menyelesaikan masalah

### Langkah 1: Semak Kebenaran Semasa
```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```
### Langkah 2: Kenal pasti Pengguna Pelayan Web
```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```
### Langkah 3: Betulkan Pemilikan
```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```
### Langkah 4: Betulkan Kebenaran

#### Pilihan A: Kebenaran Terhad (Disyorkan)
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
#### Pilihan B: Skrip Sekaligus
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
## Isu Kebenaran oleh Direktori

### Direktori Muat Naik

**Masalah:** Tidak dapat memuat naik fail
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```
### Direktori Cache

**Masalah:** Fail cache tidak ditulis
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```
### Cache Templat

**Masalah:** Templat tidak disusun
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```
## Penyelesaian Masalah Windows

### Langkah 1: Semak Sifat Fail

1. Klik kanan fail → Properties
2. Klik tab "Keselamatan".
3. Klik butang "Edit".
4. Pilih pengguna dan sahkan kebenaran

### Langkah 2: Berikan Kebenaran Tulis

#### Melalui GUI:
```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```
#### Melalui Baris Perintah (PowerShell):
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
## PHP Skrip untuk Semak Kebenaran
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
## Amalan Terbaik

### 1. Prinsip Keistimewaan Paling Rendah
```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```
### 2. Sandaran Sebelum Perubahan
```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```
## Rujukan Pantas
```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```
## Dokumentasi Berkaitan

- White-Screen-of-Death - Ralat biasa lain
- Ralat Sambungan Pangkalan Data - Isu pangkalan data
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS konfigurasi

---

**Terakhir Dikemaskini:** 2026-01-31
**Terpakai Kepada:** XOOPS 2.5.7+
**OS:** Linux, Windows, macOS