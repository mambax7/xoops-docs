---
title: "Kesalahan Koneksi Basis Data"
description: "Panduan pemecahan masalah untuk masalah koneksi database XOOPS"
---

Kesalahan koneksi database adalah salah satu masalah paling umum dalam instalasi XOOPS. Panduan ini memberikan langkah-langkah pemecahan masalah sistematis untuk mengidentifikasi dan menyelesaikan masalah koneksi.

## Pesan Kesalahan Umum

### "Tidak dapat terhubung ke server MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Kesalahan ini biasanya menunjukkan server MySQL tidak berjalan atau tidak dapat diakses.

### "Akses ditolak untuk pengguna"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Hal ini menunjukkan kredensial database yang salah dalam konfigurasi Anda.

### "Basis data tidak dikenal"

```
Error: Unknown database 'xoops_db'
```

Basis data yang ditentukan tidak ada di server MySQL.

## File Konfigurasi

### Lokasi Konfigurasi XOOPS

File konfigurasi utama terletak di:

```
/mainfile.php
```

Pengaturan basis data utama:

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

## Langkah Mengatasi Masalah

### Langkah 1: Verifikasi Layanan MySQL Berjalan

#### Di Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Langkah 2: Uji Konektivitas MySQL

#### Menggunakan Baris Perintah

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Langkah 3: Verifikasi Kredensial Basis Data

#### Periksa Konfigurasi XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Langkah 4: Verifikasi Keberadaan Basis Data

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

### Langkah 5: Periksa Izin Pengguna

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

## Masalah Umum dan Solusinya

### Edisi 1: MySQL Tidak Berjalan

**Gejala:**
- Kesalahan koneksi ditolak
- Tidak dapat terhubung ke localhost

**Solusi:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Masalah 2: Kredensial Salah

**Gejala:**
- Kesalahan "Akses ditolak".
- "menggunakan kata sandi: YA" atau "menggunakan kata sandi: TIDAK"

**Solusi:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Masalah 3: Basis Data Tidak Dibuat

**Gejala:**
- Kesalahan "Basis data tidak dikenal".
- Instalasi gagal pada pembuatan database

**Solusi:**

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

## Dokumentasi Terkait

- Layar Putih Kematian - Pemecahan masalah umum WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Penyetelan kinerja basis data
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Penyiapan awal XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Referensi basis data API

---

**Terakhir Diperbarui:** 31-01-2026
**Berlaku Untuk:** XOOPS 2.5.7+
**Versi PHP:** 7.4+
