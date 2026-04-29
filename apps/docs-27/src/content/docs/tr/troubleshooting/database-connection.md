---
title: "database Bağlantı Hataları"
description: "XOOPS database bağlantı sorunları için sorun giderme kılavuzu"
---
database bağlantı hataları XOOPS kurulumlarında en sık karşılaşılan sorunların başında gelir. Bu kılavuz, bağlantı sorunlarını tanımlamak ve çözmek için sistematik sorun giderme adımları sağlar.

## Yaygın Hata Mesajları

### "MySQL sunucusuna bağlanılamıyor"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
Bu hata genellikle MySQL sunucusunun çalışmadığını veya erişilebilir olmadığını gösterir.

### "Kullanıcının erişimi reddedildi"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
Bu, yapılandırmanızdaki yanlış database kimlik bilgilerini gösterir.

### "Bilinmeyen database"
```
Error: Unknown database 'xoops_db'
```
Belirtilen database MySQL sunucusunda mevcut değil.

## Yapılandırma Dosyaları

### XOOPS Yapılandırma Konumu

Ana yapılandırma dosyası şu konumda bulunur:
```
/mainfile.php
```
Anahtar database ayarları:
```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```
## Sorun Giderme Adımları

### Adım 1: MySQL Hizmetinin Çalıştığını Doğrulayın

#### Üzerinde Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### Adım 2: MySQL Bağlantısını Test Edin

#### Komut Satırını Kullanma
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### Adım 3: database Kimlik Bilgilerini Doğrulayın

#### XOOPS Yapılandırmasını kontrol edin
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### Adım 4: Veritabanının Varlığını Doğrulayın
```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```
### Adım 5: user İzinlerini Kontrol Edin
```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```
## Yaygın Sorunlar ve Çözümler

### Sayı 1: MySQL Çalışmıyor

**Belirtiler:**
- Bağlantı reddedildi hatası
- localhost'a bağlanılamıyor

**Çözümler:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### Sorun 2: Yanlış Kimlik Bilgileri

**Belirtiler:**
- "Erişim reddedildi" hatası
- "şifre kullanılıyor: YES" veya "şifre kullanılıyor: HAYIR"

**Çözümler:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### Sayı 3: database Oluşturulmadı

**Belirtiler:**
- "Bilinmeyen database" hatası
- database oluşturma sırasında kurulum başarısız oldu

**Çözümler:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## Teşhis Komut Dosyası

Kapsamlı bir teşhis komut dosyası oluşturun:
```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```
## İlgili Belgeler

- Ölümün Beyaz Ekranı - Yaygın WSOD sorun giderme
- ../../01-Getting-Started/Configuration/Performance-Optimization - database performans ayarı
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - İlk XOOPS kurulumu
- ../../04-API-Reference/Database/XoopsDatabase - database API referansı

---

**Son Güncelleme:** 2026-01-31
**Geçerli olduğu yerler:** XOOPS 2.5.7+
**PHP Versiyonlar:** 7.4+