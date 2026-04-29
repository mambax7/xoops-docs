---
title: "Konfigurasi Dasar"
description: "Pengaturan awal XOOPS termasuk pengaturan mainfile.php, nama situs, email, dan konfigurasi zona waktu"
---

# Konfigurasi Dasar XOOPS

Panduan ini mencakup pengaturan konfigurasi penting agar situs XOOPS Anda berjalan dengan baik setelah instalasi.

## Konfigurasi mainfile.php

File `mainfile.php` berisi konfigurasi penting untuk instalasi XOOPS Anda. Itu dibuat saat instalasi tetapi Anda mungkin perlu mengeditnya secara manual.

### Lokasi

```
/var/www/html/xoops/mainfile.php
```

### Struktur Berkas

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### Pengaturan Kritis Dijelaskan

| Pengaturan | Tujuan | Contoh |
|---|---|---|
| `XOOPS_DB_TYPE` | Sistem basis data | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Lokasi server basis data | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Nama pengguna basis data | `xoops_user` |
| `XOOPS_DB_PASS` | Kata sandi basis data | [kata sandi_aman] |
| `XOOPS_DB_NAME` | Nama basis data | `xoops_db` |
| `XOOPS_DB_PREFIX` | Awalan nama tabel | `xoops_` (memungkinkan beberapa XOOPS dalam satu DB) |
| `XOOPS_ROOT_PATH` | Jalur sistem file fisik | `/var/www/html/xoops` |
| `XOOPS_URL` | URL yang dapat diakses melalui web | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Jalur tepercaya (di luar root web) | `/var/www/xoops_var` |

### Mengedit mainfile.php

Buka mainfile.php di editor teks:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Perubahan Umum mainfile.php

**Ubah situs URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Aktifkan mode debug (hanya pengembangan):**
```php
define('XOOPS_DEBUG', 1);
```

**Ubah awalan tabel (jika diperlukan):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Pindahkan jalur kepercayaan di luar root web (lanjutan):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Konfigurasi Panel Admin

Konfigurasikan pengaturan dasar melalui panel admin XOOPS.

### Mengakses Pengaturan Sistem

1. Masuk ke panel admin: `http://your-domain.com/xoops/admin/`
2. Navigasikan ke: **Sistem > Preferensi > Pengaturan Umum**
3. Ubah pengaturan (lihat di bawah)
4. Klik "Simpan" di bagian bawah

### Nama dan Deskripsi Situs

Konfigurasikan tampilan situs Anda:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Informasi Kontak

Tetapkan detail kontak situs:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Bahasa dan Wilayah

Tetapkan bahasa dan wilayah default:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## Konfigurasi Email

Konfigurasikan pengaturan email untuk notifikasi dan komunikasi pengguna.

### Lokasi Setelan Email

**Panel Admin:** Sistem > Preferensi > Setelan Email

### Konfigurasi SMTP

Untuk pengiriman email yang andal, gunakan SMTP, bukan PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Contoh Konfigurasi Gmail

Siapkan XOOPS untuk mengirim email melalui Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Catatan:** Gmail memerlukan Kata Sandi Aplikasi, bukan kata sandi Gmail Anda:
1. Buka https://myaccount.google.com/apppasswords
2. Hasilkan kata sandi aplikasi untuk "Mail" dan "Komputer Windows"
3. Gunakan kata sandi yang dibuat di XOOPS

### Konfigurasi PHP mail() (Lebih Sederhana namun Kurang Dapat Diandalkan)

Jika SMTP tidak tersedia, gunakan PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Pastikan server Anda telah mengkonfigurasi sendmail atau postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Pengaturan Fungsi Email

Konfigurasikan apa yang memicu email:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Konfigurasi Zona Waktu

Tetapkan zona waktu yang tepat untuk stempel waktu dan penjadwalan yang benar.

### Mengatur Zona Waktu di Panel Admin

**Jalur:** Sistem > Preferensi > Pengaturan Umum

```
Default Timezone: [Select your timezone]
```

**Zona Waktu Umum:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Verifikasi Zona Waktu

Periksa zona waktu server saat ini:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Tetapkan Zona Waktu Sistem (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## Konfigurasi URL

### Aktifkan URL Bersih (URL Ramah)

Untuk URL seperti `/page/about`, bukan `/index.php?page=about`

**Persyaratan:**
- Apache dengan mod_rewrite diaktifkan
- File `.htaccess` di root XOOPS

**Aktifkan di Panel Admin:**1. Buka: **Sistem > Preferensi > Pengaturan URL**
2. Centang: "Aktifkan URL Ramah"
3. Pilih: "URL Type" (Info Jalur atau Kueri)
4. Simpan

**Verifikasi .htaccess Ada:**

```bash
cat /var/www/html/xoops/.htaccess
```

Contoh konten .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Pemecahan Masalah URL Bersih:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### Konfigurasikan Situs URL

**Panel Admin:** Sistem > Preferensi > Pengaturan Umum

Tetapkan URL yang benar untuk domain Anda:

```
Site URL: http://your-domain.com/xoops/
```

Atau jika XOOPS berada di root:

```
Site URL: http://your-domain.com/
```

## Pengoptimalan Mesin Pencari (SEO)

Konfigurasikan pengaturan SEO untuk visibilitas mesin pencari yang lebih baik.

### Tag Meta

Tetapkan tag meta global:

**Panel Admin:** Sistem > Preferensi > Pengaturan SEO

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Ini muncul di halaman `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Peta Situs

Aktifkan peta situs XML untuk mesin pencari:

1. Buka: **Sistem > module**
2. Temukan module "Peta Situs".
3. Klik untuk menginstal dan mengaktifkan
4. Akses peta situs di: `/xoops/sitemap.xml`

### Robot.txt

Kontrol perayapan mesin pencari:

Buat `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Pengaturan Pengguna

Konfigurasikan pengaturan default terkait pengguna.

### Pendaftaran Pengguna

**Panel Admin:** Sistem > Preferensi > Pengaturan Pengguna

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Profil Pengguna

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Tampilan Email Pengguna

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Konfigurasi Tembolok

Tingkatkan kinerja dengan caching yang tepat.

### Pengaturan Tembolok

**Panel Admin:** Sistem > Preferensi > Pengaturan Cache

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Hapus Tembolok

Hapus file cache lama:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Daftar Periksa Pengaturan Awal

Setelah instalasi, konfigurasikan:

- [ ] Nama dan deskripsi situs diatur dengan benar
- [ ] Email admin dikonfigurasi
- [ ] Pengaturan email SMTP dikonfigurasi dan diuji
- [ ] Zona waktu diatur ke wilayah Anda
- [ ] URL dikonfigurasi dengan benar
- [ ] URL Bersih (URL ramah) diaktifkan jika diinginkan
- [ ] Pengaturan pendaftaran pengguna dikonfigurasi
- [ ] Meta tag untuk SEO dikonfigurasi
- [ ] Bahasa default dipilih
- [ ] Pengaturan cache diaktifkan
- [ ] Kata sandi pengguna admin kuat (16+ karakter)
- [ ] Uji pendaftaran pengguna
- [ ] Uji fungsionalitas email
- [ ] Uji unggah file
- [ ] Kunjungi beranda dan verifikasi tampilan

## Konfigurasi Pengujian

### Tes Email

Kirim email percobaan:

**Panel Admin:** Sistem > Tes Email

Atau secara manual:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### Uji Koneksi Basis Data

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**Penting:** Hapus file pengujian setelah pengujian!

```bash
rm /var/www/html/xoops/test-*.php
```

## Ringkasan File Konfigurasi

| Berkas | Tujuan | Sunting Metode |
|---|---|---|
| mainfile.php | Pengaturan basis data dan core | Penyunting teks |
| Panel Admin | Sebagian besar pengaturan | Antarmuka web |
| .htaccess | URL menulis ulang | Penyunting teks |
| robots.txt | Perayapan mesin pencari | Penyunting teks |

## Langkah Selanjutnya

Setelah konfigurasi dasar:

1. Konfigurasikan pengaturan sistem secara detail
2. Memperkuat keamanan
3. Jelajahi panel admin
4. Buat konten pertama Anda
5. Siapkan akun pengguna

---

**Tag:** #konfigurasi #penyiapan #email #zona waktu #seo

**Artikel Terkait:**
- ../Installation/Installation
- Pengaturan Sistem
- Konfigurasi Keamanan
- Optimasi Kinerja
