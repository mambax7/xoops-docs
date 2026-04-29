---
title: "Ralat Sambungan Pangkalan Data"
description: "Panduan penyelesaian masalah untuk XOOPS masalah sambungan pangkalan data"
---
Ralat sambungan pangkalan data adalah antara isu yang paling biasa dalam XOOPS pemasangan. Panduan ini menyediakan langkah penyelesaian masalah yang sistematik untuk mengenal pasti dan menyelesaikan masalah sambungan.

## Mesej Ralat Biasa

### "Tidak dapat menyambung ke pelayan MySQL"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
Ralat ini biasanya menunjukkan pelayan MySQL tidak berjalan atau tidak boleh diakses.

### "Akses ditolak untuk pengguna"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
Ini menunjukkan bukti kelayakan pangkalan data yang salah dalam konfigurasi anda.

### "Pangkalan data tidak diketahui"
```
Error: Unknown database 'xoops_db'
```
Pangkalan data yang ditentukan tidak wujud pada pelayan MySQL.

## Fail Konfigurasi

### XOOPS Lokasi Konfigurasi

Fail konfigurasi utama terletak di:
```
/mainfile.php
```
Tetapan pangkalan data utama:
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
## Langkah Penyelesaian Masalah

### Langkah 1: Sahkan Perkhidmatan MySQL Berjalan

#### Pada Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### Langkah 2: Uji Kesambungan MySQL

#### Menggunakan Baris Perintah
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### Langkah 3: Sahkan Bukti Kelayakan Pangkalan Data

#### Semak XOOPS Konfigurasi
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### Langkah 4: Sahkan Pangkalan Data Wujud
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
### Langkah 5: Semak Kebenaran Pengguna
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
## Isu dan Penyelesaian Biasa

### Isu 1: MySQL Tidak Berjalan

**Simptom:**
- Ralat penolakan sambungan
- Tidak dapat menyambung ke localhost

**Penyelesaian:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### Isu 2: Bukti Kelayakan Salah

**Simptom:**
- Ralat "Akses ditolak".
- "menggunakan kata laluan: YES" atau "menggunakan kata laluan: TIDAK"

**Penyelesaian:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### Isu 3: Pangkalan Data Tidak Dicipta

**Simptom:**
- Ralat "Pangkalan data tidak diketahui".
- Pemasangan gagal pada penciptaan pangkalan data

**Penyelesaian:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## Skrip Diagnostik

Buat skrip diagnostik yang komprehensif:
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
## Dokumentasi Berkaitan

- Skrin Kematian Putih - Penyelesaian masalah WSOD biasa
- ../../01-Getting-Started/Configuration/Performance-Optimization - Penalaan prestasi pangkalan data
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Persediaan awal XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Rujukan Pangkalan Data API

---

**Terakhir Dikemaskini:** 2026-01-31
**Terpakai Kepada:** XOOPS 2.5.7+
**PHP Versi:** 7.4+