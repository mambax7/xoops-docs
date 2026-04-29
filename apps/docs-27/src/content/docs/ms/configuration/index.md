---
title: "Konfigurasi Asas"
description: "Persediaan XOOPS awal termasuk tetapan mainfile.php, nama tapak, e-mel dan konfigurasi zon waktu"
---
# Konfigurasi XOOPS AsasPanduan ini merangkumi tetapan konfigurasi penting untuk membolehkan tapak XOOPS anda berjalan dengan betul selepas pemasangan.## mainfile.php KonfigurasiFail `mainfile.php` mengandungi konfigurasi kritikal untuk pemasangan XOOPS anda. Ia dibuat semasa pemasangan tetapi anda mungkin perlu mengeditnya secara manual.### Lokasi
```
/var/www/html/XOOPS/mainfile.php
```
### Struktur Fail
```
php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/XOOPS');  // File system path
define('XOOPS_URL', 'http://your-domain.com/XOOPS');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/XOOPS/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```
### Tetapan Kritikal Diterangkan| Tetapan | Tujuan | Contoh |
|---|---|---|
| `XOOPS_DB_TYPE` | Sistem pangkalan data | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Lokasi pelayan pangkalan data | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Nama pengguna pangkalan data | `xoops_user` |
| `XOOPS_DB_PASS` | Kata laluan pangkalan data | [kata laluan_selamat] |
| `XOOPS_DB_NAME` | Nama pangkalan data | `xoops_db` |
| `XOOPS_DB_PREFIX` | Awalan nama jadual | `xoops_` (membolehkan berbilang XOOPS pada satu DB) |
| `XOOPS_ROOT_PATH` | Laluan sistem fail fizikal | `/var/www/html/XOOPS` |
| `XOOPS_URL` | URL boleh diakses web | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Laluan yang dipercayai (di luar akar web) | `/var/www/xoops_var` |### Mengedit mainfile.phpBuka mainfile.php dalam editor teks:
```
bash
# Using nano
nano /var/www/html/XOOPS/mainfile.php

# Using vi
vi /var/www/html/XOOPS/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/XOOPS/mainfile.php
```
### Perubahan mainfile.php Biasa**Tukar URL tapak:**
```
php
define('XOOPS_URL', 'https://yourdomain.com');
```
**Dayakan mod nyahpepijat (pembangunan sahaja):**
```
php
define('XOOPS_DEBUG', 1);
```
**Tukar awalan jadual (jika perlu):**
```
php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**Alihkan laluan kepercayaan di luar akar web (lanjutan):**
```
php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## Konfigurasi Panel PentadbiranKonfigurasikan tetapan asas melalui panel pentadbir XOOPS.### Mengakses Tetapan Sistem1. Log masuk ke panel pentadbir: `http://your-domain.com/XOOPS/admin/`
2. Navigasi ke: **Sistem > Keutamaan > Tetapan Umum**
3. Ubah suai tetapan (lihat di bawah)
4. Klik "Simpan" di bahagian bawah### Nama Tapak dan PeneranganKonfigurasikan cara tapak anda muncul:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### Maklumat HubunganTetapkan butiran hubungan tapak:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### Bahasa dan WilayahTetapkan bahasa dan wilayah lalai:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## Konfigurasi E-melKonfigurasikan tetapan e-mel untuk pemberitahuan dan komunikasi pengguna.### Lokasi Tetapan E-mel**Panel Pentadbiran:** Sistem > Keutamaan > Tetapan E-mel### Konfigurasi SMTPUntuk penghantaran e-mel yang boleh dipercayai, gunakan SMTP dan bukannya PHP mail():
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### Contoh Konfigurasi GmailSediakan XOOPS untuk menghantar e-mel melalui Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**Nota:** Gmail memerlukan Kata Laluan Apl, bukan kata laluan Gmail anda:
1. Pergi ke https://myaccount.google.com/apppasswords
2. Jana kata laluan apl untuk "Mel" dan "Komputer Windows"
3. Gunakan kata laluan yang dijana dalam XOOPS### Konfigurasi mel PHP() (Lebih Mudah tetapi Kurang Boleh Dipercayai)Jika SMTP tidak tersedia, gunakan mel PHP():
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
Pastikan pelayan anda telah dikonfigurasikan sendmail atau postfix:
```
bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### Tetapan Fungsi E-melKonfigurasikan perkara yang mencetuskan e-mel:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## Konfigurasi Zon WaktuTetapkan zon waktu yang sesuai untuk cap masa dan penjadualan yang betul.### Menetapkan Zon Waktu dalam Panel Pentadbiran**Laluan:** Sistem > Keutamaan > Tetapan Umum
```
Default Timezone: [Select your timezone]
```
**Zon Waktu Biasa:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)### Sahkan Zon WaktuSemak zon waktu pelayan semasa:
```
bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### Tetapkan Zon Waktu Sistem (Linux)
```
bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## Konfigurasi URL### Dayakan URL Bersih (URL Mesra)Untuk URL seperti `/page/about` dan bukannya `/index.php?page=about`**Keperluan:**
- Apache dengan mod_rewrite didayakan
- Fail `.htaccess` dalam akar XOOPS**Dayakan dalam Panel Pentadbiran:**1. Pergi ke: **Sistem > Keutamaan > Tetapan URL**
2. Semak: "Dayakan URL Mesra"
3. Pilih: "Jenis URL" (Maklumat atau Pertanyaan Laluan)
4. Jimat**Sahkan .htaccess Wujud:**
```
bash
cat /var/www/html/XOOPS/.htaccess
```
Contoh kandungan .htaccess:
```
apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /XOOPS/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**Menyelesaikan masalah URL Bersih:**
```
bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/XOOPS/index.php
```
### Konfigurasikan URL Tapak**Panel Pentadbiran:** Sistem > Keutamaan > Tetapan UmumTetapkan URL yang betul untuk domain anda:
```
Site URL: http://your-domain.com/XOOPS/
```
Atau jika XOOPS berada dalam akar:
```
Site URL: http://your-domain.com/
```
## Pengoptimuman Enjin Carian (SEO)Konfigurasikan tetapan SEO untuk keterlihatan enjin carian yang lebih baik.### Tag MetaTetapkan teg meta global:**Panel Pentadbiran:** Sistem > Keutamaan > Tetapan SEO
```
Meta Keywords: XOOPS, cms, content management
Meta Description: A dynamic content management system
```
Ini muncul dalam halaman `<head>`:
```
html
<meta name="keywords" content="XOOPS, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### Peta lamanDayakan peta laman XML untuk enjin carian:1. Pergi ke: **Sistem > Modul**
2. Cari modul "Peta Laman".
3. Klik untuk memasang dan mendayakan
4. Akses peta laman di: `/XOOPS/sitemap.xml`### Robots.txtKawal merangkak enjin carian:Cipta `/var/www/html/XOOPS/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/XOOPS/sitemap.xml
```
## Tetapan PenggunaKonfigurasikan tetapan lalai berkaitan pengguna.### Pendaftaran Pengguna**Panel Pentadbiran:** Sistem > Keutamaan > Tetapan Pengguna
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
### Paparan E-mel Pengguna
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## Konfigurasi CacheTingkatkan prestasi dengan caching yang betul.### Tetapan Cache**Panel Pentadbiran:** Sistem > Keutamaan > Tetapan Cache
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### Kosongkan CacheKosongkan fail cache lama:
```
bash
# Manual cache clear
rm -rf /var/www/html/XOOPS/cache/*
rm -rf /var/www/html/XOOPS/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## Senarai Semak Tetapan AwalSelepas pemasangan, konfigurasikan:- [ ] Nama tapak dan penerangan ditetapkan dengan betul
- [ ] E-mel pentadbir dikonfigurasikan
- [ ] SMTP tetapan e-mel dikonfigurasikan dan diuji
- [ ] Zon waktu ditetapkan kepada rantau anda
- [ ] URL dikonfigurasikan dengan betul
- [ ] URL bersih (URL mesra) didayakan jika dikehendaki
- [ ] Tetapan pendaftaran pengguna dikonfigurasikan
- [ ] Tag meta untuk SEO dikonfigurasikan
- [ ] Bahasa lalai dipilih
- [ ] Tetapan cache didayakan
- [ ] Kata laluan pengguna pentadbir kuat (16+ aksara)
- [ ] Uji pendaftaran pengguna
- [ ] Uji kefungsian e-mel
- [ ] Uji muat naik fail
- [ ] Lawati halaman utama dan sahkan penampilan## Konfigurasi Pengujian### E-mel UjianHantar e-mel ujian:**Panel Pentadbiran:** Sistem > Ujian E-melAtau secara manual:
```
php
<?php
// Create test file: /var/www/html/XOOPS/test-email.php
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
### Uji Sambungan Pangkalan Data
```
php
<?php
// Create test file: /var/www/html/XOOPS/test-db.php
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
**Penting:** Padamkan fail ujian selepas ujian!
```
bash
rm /var/www/html/XOOPS/test-*.php
```
## Ringkasan Fail Konfigurasi| Fail | Tujuan | Kaedah Edit |
|---|---|---|
| mainfile.php | Pangkalan data dan tetapan teras | Penyunting teks |
| Panel Pentadbiran | Kebanyakan tetapan | Antara muka web |
| .htaccess | Penulisan semula URL | Penyunting teks |
| robots.txt | Merangkak enjin carian | Penyunting teks |## Langkah SeterusnyaSelepas konfigurasi asas:1. Konfigurasikan tetapan sistem secara terperinci
2. Mengeraskan keselamatan
3. Teroka panel pentadbir
4. Buat kandungan pertama anda
5. Sediakan akaun pengguna---

**Tag:** #konfigurasi #persediaan #e-mel #zonmasa #seo**Artikel Berkaitan:**
- ../Installation/Installation
- Tetapan Sistem
- Konfigurasi Keselamatan
- Pengoptimuman Prestasi