---
title: "İzin Reddedildi Hataları"
description: "XOOPS'de dosya ve dizin izni sorunlarını giderme"
---
XOOPS kurulumlarında, özellikle yükleme veya sunucu geçişinden sonra dosya ve dizin izni sorunları yaygındır. Bu kılavuz, izin sorunlarını tanılamanıza ve çözmenize yardımcı olur.

## Dosya İzinlerini Anlamak

### Linux/Unix İzin Esasları

Dosya izinleri üç basamaklı kodlarla temsil edilir:
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
## Yaygın İzin Hataları

### Yüklemede "İzin reddedildi"
```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```
### "Dosya yazılamıyor"
```
Error: Unable to write file to /var/www/html/xoops/cache/
```
### "Dizin oluşturulamıyor"
```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```
## Kritik XOOPS Dizinler

### Yazma İzni Gerektiren Dizinler

| Dizin | Asgari | Amaç |
|-----------|------------|------------|
| `/uploads` | 755 | user yüklemeleri |
| `/cache` | 755 | cache dosyaları |
| `/templates_c` | 755 | Derlenmiş templates |
| `/var` | 755 | Değişken veriler |
| `mainfile.php` | 644 | Yapılandırma (okunabilir) |

## Linux/Unix Sorun Giderme

### 1. Adım: Mevcut İzinleri Kontrol Edin
```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```
### Adım 2: Web Sunucusu Kullanıcısını Tanımlayın
```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```
### 3. Adım: Sahipliği Düzeltin
```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```
### 4. Adım: İzinleri Düzeltin

#### Seçenek A: Kısıtlayıcı permissions (Önerilir)
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
#### Seçenek B: Hepsi Bir Arada Komut Dosyası
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
## Dizine Göre İzin Sorunları

### Yükleme Dizini

**Sorun:** Dosyalar yüklenemiyor
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```
### cache Dizini

**Sorun:** cache dosyaları yazılamıyor
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```
### template Önbelleği

**Sorun:** templates derlenmiyor
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```
## Windows Sorun Giderme

### Adım 1: Dosya Özelliklerini Kontrol Edin

1. Dosyaya sağ tıklayın → Özellikler
2. "Güvenlik" sekmesine tıklayın
3. "Düzenle" düğmesini tıklayın
4. Kullanıcıyı seçin ve izinleri doğrulayın

### Adım 2: Yazma İzinleri Verin

#### GUI aracılığıyla:
```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```
#### Komut Satırı (PowerShell) aracılığıyla:
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
## PHP İzinleri Kontrol Eden Komut Dosyası
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
## En İyi Uygulamalar

### 1. En Az Ayrıcalık İlkesi
```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```
### 2. Değişikliklerden Önce Yedekleme
```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```
## Hızlı Başvuru
```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```
## İlgili Belgeler

- Ölümün Beyaz Ekranı - Diğer yaygın hatalar
- database Bağlantısı Hataları - database sorunları
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS yapılandırması

---

**Son Güncelleme:** 2026-01-31
**Geçerli olduğu yerler:** XOOPS 2.5.7+
**İşletim Sistemi:** Linux, Windows, macOS