---
title: "Menyelesaikan masalah"
description: "Penyelesaian untuk XOOPS isu biasa, teknik penyahpepijatan dan FAQ"
---
> Penyelesaian kepada masalah biasa dan teknik nyahpepijat untuk XOOPS CMS.

---

## 📋 Diagnosis Pantas

Sebelum menyelami isu khusus, semak punca biasa berikut:

1. **Kebenaran Fail** - Direktori memerlukan 755, fail memerlukan 644
2. **PHP Versi** - Pastikan PHP 7.4+ (8.x disyorkan)
3. **Log Ralat** - Semak log ralat `xoops_data/logs/` dan PHP
4. **Cache** - Kosongkan cache dalam Admin → Sistem → Penyelenggaraan

---

## 🗂️ Kandungan Bahagian

### Isu Biasa
- Skrin Putih Kematian (WSOD)
- Ralat Sambungan Pangkalan Data
- Kebenaran Ditolak Ralat
- Kegagalan Pemasangan Modul
- Ralat Penyusunan Templat

### FAQ
- Pemasangan FAQ
- Modul FAQ
- Tema FAQ
- Prestasi FAQ

### Penyahpepijatan
- Mendayakan Mod Nyahpepijat
- Menggunakan Ray Debugger
- Penyahpepijatan Pertanyaan Pangkalan Data
- Penyahpepijatan Templat Smarty

---

## 🚨 Isu & Penyelesaian Biasa

### Skrin Kematian Putih (WSOD)

**Simptom:** Halaman putih kosong, tiada mesej ralat

**Penyelesaian:**

1. **Dayakan paparan ralat PHP buat sementara waktu:**   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```
2. **Semak PHP log ralat:**   
```bash
   tail -f /var/log/php/error.log
   
```
3. **Punca biasa:**
   - Had memori melebihi
   - Fatal PHP ralat sintaks
   - Tiada sambungan yang diperlukan

4. **Selesaikan masalah ingatan:**   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```
---

### Ralat Sambungan Pangkalan Data

**Simptom:** "Tidak dapat menyambung ke pangkalan data" atau yang serupa

**Penyelesaian:**

1. **Sahkan kelayakan dalam mainfile.php:**   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```
2. **Uji sambungan secara manual:**   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```
3. **Semak perkhidmatan MySQL:**   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```
4. **Sahkan kebenaran pengguna:**   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```
---

### Kebenaran Ditolak Ralat

**Simptom:** Tidak boleh memuat naik fail, tidak boleh menyimpan tetapan

**Penyelesaian:**

1. **Tetapkan kebenaran yang betul:**   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```
2. **Tetapkan pemilikan yang betul:**   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```
3. **Semak SELinux (CentOS/RHEL):**   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```
---

### Kegagalan Pemasangan Modul

**Simptom:** Modul tidak dapat dipasang, SQL ralat

**Penyelesaian:**

1. **Semak keperluan modul:**
   - PHP keserasian versi
   - Diperlukan PHP sambungan
   - XOOPS keserasian versi

2. **Pemasangan SQL manual:**   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```
3. **Kosongkan cache modul:**   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```
4. **Semak xoops_version.php syntax:**   
```bash
   php -l modules/mymodule/xoops_version.php
   
```
---

### Ralat Penyusunan Templat

**Simptom:** Ralat pintar, templat tidak ditemui

**Penyelesaian:**

1. **Kosongkan cache Smarty:**   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```
2. **Semak sintaks templat:**   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```
3. **Sahkan templat wujud:**   
```bash
   ls modules/mymodule/templates/
   
```
4. **Jana semula templat:**
   - Pentadbir → Sistem → Penyelenggaraan → Templat → Menjana semula

---

## 🐛 Teknik Nyahpepijat

### Dayakan XOOPS Mod Nyahpepijat
```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```
### Menggunakan Ray Debugger

Ray ialah alat penyahpepijatan yang sangat baik untuk PHP:
```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```
### Konsol Nyahpepijat Pintar
```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```
### Pengelogan Pertanyaan Pangkalan Data
```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```
---

## ❓ Soalan Lazim

### Pemasangan

**S: Wizard pemasangan menunjukkan halaman kosong**
J: Semak PHP log ralat, pastikan PHP mempunyai memori yang mencukupi, sahkan kebenaran fail.

**S: Tidak boleh menulis ke fail utama.php during installation**
A: Tetapkan kebenaran: `chmod 666 mainfile.php` semasa pemasangan, kemudian `chmod 444` selepas itu.

**S: Jadual pangkalan data tidak dibuat**
J: Semak pengguna MySQL mempunyai CREATE TABLE keistimewaan, sahkan pangkalan data wujud.

### Modul

**S: Halaman pentadbir modul kosong**
J: Kosongkan cache, semak modul admin/menu.php untuk ralat sintaks.

**S: Blok modul tidak dipaparkan**
J: Semak kebenaran blok dalam Pentadbir → Sekat, sahkan blok diberikan kepada halaman.

**S: Kemas kini modul gagal**
J: Sandaran pangkalan data, cuba kemas kini manual SQL, semak keperluan versi.

### Tema

**S: Tema tidak digunakan dengan betul**
J: Kosongkan cache Smarty, semak theme.html wujud, sahkan kebenaran tema.

**S: Tersuai CSS tidak dimuatkan**
J: Semak laluan fail, kosongkan cache penyemak imbas, sahkan sintaks CSS.

**S: Imej tidak dipaparkan**
J: Semak laluan imej, sahkan kebenaran folder muat naik.

### Prestasi

**S: Tapak sangat perlahan**
A: Dayakan caching, optimumkan pangkalan data, semak pertanyaan lambat, dayakan OpCache.

**S: Penggunaan memori yang tinggi**
J: Tingkatkan had_memori, optimumkan pertanyaan besar, laksanakan penomboran.---

## 🔧 Arahan Penyelenggaraan

### Kosongkan Semua Cache
```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```
### Pengoptimuman Pangkalan Data
```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```
### Semak Integriti Fail
```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```
---

## 🔗 Dokumentasi Berkaitan

- Bermula
- Amalan Terbaik Keselamatan
- XOOPS 4.0 Pelan Hala Tuju

---

## 📚 Sumber Luaran

- [XOOPS Forum](https://XOOPS.org/modules/newbb/)
- [Isu GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Rujukan Ralat](https://www.php.net/manual/en/errorfunc.constants.php)

---

#XOOPS #penyelesaian masalah #penyahpepijat #faq #ralat #penyelesaian