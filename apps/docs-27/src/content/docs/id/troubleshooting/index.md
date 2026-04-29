---
title: "Pemecahan Masalah"
description: "Solusi untuk masalah umum XOOPS, teknik debugging, dan FAQ"
---

> Solusi untuk masalah umum dan teknik debugging untuk XOOPS CMS.

---

## 📋 Diagnosis Cepat

Sebelum mendalami masalah tertentu, periksa penyebab umum berikut:

1. **Izin File** - Direktori memerlukan 755, file memerlukan 644
2. **Versi PHP** - Pastikan PHP 7.4+ (disarankan 8.x)
3. **Log Kesalahan** - Periksa log kesalahan `xoops_data/logs/` dan PHP
4. **Cache** - Hapus cache di Admin → Sistem → Pemeliharaan

---

## 🗂️ Bagian Isi

### Masalah Umum
- Layar Putih Kematian (WSOD)
- Kesalahan Koneksi Basis Data
- Izin Ditolak Kesalahan
- Kegagalan Instalasi module
- Kesalahan Kompilasi Template

### Pertanyaan Umum
- FAQ Instalasi
- module FAQ
- FAQ theme
- FAQ Kinerja

### Men-debug
- Mengaktifkan Mode Debug
- Menggunakan Ray Debugger
- Debugging Kueri Basis Data
- Proses Debugging template Smarty

---

## 🚨 Masalah & Solusi Umum

### Layar Putih Kematian (WSOD)

**Gejala:** Halaman putih kosong, tidak ada pesan kesalahan

**Solusi:**

1. **Aktifkan tampilan kesalahan PHP sementara:**
   
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
   ```

2. **Periksa log kesalahan PHP:**
   
   ```bash
   tail -f /var/log/php/error.log
   
   ```

3. **Penyebab umum:**
   - Batas memori terlampaui
   - Kesalahan sintaksis PHP yang fatal
   - Ekstensi yang diperlukan tidak ada

4. **Memperbaiki masalah memori:**
   
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
   ```

---

### Kesalahan Koneksi Basis Data

**Gejala:** "Tidak dapat terhubung ke database" atau serupa

**Solusi:**

1. **Verifikasi kredensial di mainfile.php:**
   
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
   ```

2. **Uji koneksi secara manual:**
   
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
   ```

3. **Periksa layanan MySQL:**
   
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
   ```

4. **Verifikasi izin pengguna:**
   
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
   ```

---

### Izin Ditolak Kesalahan

**Gejala:** Tidak dapat mengunggah file, tidak dapat menyimpan pengaturan

**Solusi:**

1. **Setel izin yang benar:**
   
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
   ```

2. **Tetapkan kepemilikan yang benar:**
   
   ```bash
   chown -R www-data:www-data /path/to/xoops
   
   ```

3. **Periksa SELinux (CentOS/RHEL):**
   
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
   ```

---

### Kegagalan Instalasi module

**Gejala:** module tidak dapat dipasang, kesalahan SQL

**Solusi:**

1. **Periksa persyaratan module:**
   - Kompatibilitas versi PHP
   - Ekstensi PHP yang diperlukan
   - Kompatibilitas versi XOOPS

2. **Pemasangan manual SQL:**
   
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
   ```

3. **Hapus cache module:**
   
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
   ```

4. **Periksa sintaks xoops_version.php:**
   
   ```bash
   php -l modules/mymodule/xoops_version.php
   
   ```

---

### Kesalahan Kompilasi template

**Gejala:** Kesalahan Smarty, template tidak ditemukan

**Solusi:**

1. **Hapus cache Smarty:**
   
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
   ```

2. **Periksa sintaks template:**
   
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
   ```

3. **Verifikasi template yang ada:**
   
   ```bash
   ls modules/mymodule/templates/
   
   ```

4. **Buat ulang template:**
   - Admin → Sistem → Pemeliharaan → template → Regenerasi

---

## 🐛 Teknik Debugging

### Aktifkan Mode Debug XOOPS

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

Ray adalah alat debugging yang luar biasa untuk PHP:

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

### Konsol Debug Smarty

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Pencatatan Kueri Basis Data

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

## ❓ Pertanyaan yang Sering Diajukan

### Instalasi

**Q: Wizard instalasi menampilkan halaman kosong**
J: Periksa log kesalahan PHP, pastikan PHP memiliki cukup memori, verifikasi izin file.

**Q: Tidak dapat menulis ke mainfile.php selama instalasi**
J: Tetapkan izin: `chmod 666 mainfile.php` selama instalasi, lalu `chmod 444` setelahnya.

**Q: Tabel database tidak dibuat**
A: Periksa pengguna MySQL memiliki hak istimewa CREATE TABLE, verifikasi database ada.

### module

**Q: Halaman admin module kosong**
A: Hapus cache, periksa admin/menu.php module untuk kesalahan sintaksis.

**Q: block module tidak muncul**
A: Periksa izin block di Admin → block, verifikasi block ditugaskan ke halaman.

**Q: Pembaruan module gagal**
A: Cadangkan basis data, coba pembaruan manual SQL, periksa persyaratan versi.

### theme

**Q: theme tidak diterapkan dengan benar**
A: Hapus cache Smarty, periksa keberadaan theme.html, verifikasi izin theme.

**Q: CSS khusus tidak dimuat**
A: Periksa jalur file, hapus cache browser, verifikasi sintaks CSS.**Q: Gambar tidak ditampilkan**
A: Periksa jalur gambar, verifikasi izin folder unggahan.

### Performa

**T: Situs sangat lambat**
J: Aktifkan caching, optimalkan database, periksa kueri lambat, aktifkan OpCache.

**T: Penggunaan memori tinggi**
J: Tingkatkan memory_limit, optimalkan kueri besar, terapkan penomoran halaman.

---

## 🔧 Perintah Pemeliharaan

### Hapus Semua Cache

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optimasi Basis Data

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Periksa Integritas File

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Dokumentasi Terkait

- Memulai
- Praktik Terbaik Keamanan
- Peta Jalan XOOPS 4.0

---

## 📚 Sumber Daya Eksternal

- [Forum XOOPS](https://xoops.org/modules/newbb/)
- [Masalah GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [Referensi Kesalahan PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #pemecahan masalah #debugging #faq #errors #solutions
