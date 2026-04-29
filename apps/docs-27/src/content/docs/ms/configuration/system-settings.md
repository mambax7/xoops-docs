---
title: "Tetapan Sistem"
description: "Panduan komprehensif untuk tetapan sistem pentadbir XOOPS, pilihan konfigurasi dan hierarki keutamaan"
---
# XOOPS Tetapan SistemPanduan ini merangkumi tetapan sistem lengkap yang tersedia dalam panel pentadbir XOOPS, disusun mengikut kategori.## Seni Bina Tetapan Sistem
```
mermaid
graph TD
    A[System Settings] --> B[General Settings]
    A --> C[User Settings]
    A --> D[Module Settings]
    A --> E[Meta Tags & Footer]
    A --> F[Email Settings]
    A --> G[Cache Settings]
    A --> H[URL Settings]
    A --> I[Security Settings]
    B --> B1[Site Name]
    B --> B2[Timezone]
    B --> B3[Language]
    C --> C1[Registration]
    C --> C2[Profiles]
    C --> C3[Permissions]
    F --> F1[SMTP Config]
    F --> F2[Notification Rules]
```
## Mengakses Tetapan Sistem### Lokasi**Panel Pentadbiran > Sistem > Keutamaan**Atau navigasi terus:
```
http://your-domain.com/XOOPS/admin/index.php?fct=preferences
```
### Keperluan Kebenaran- Hanya pentadbir (juruweb) boleh mengakses tetapan sistem
- Perubahan mempengaruhi keseluruhan tapak
- Kebanyakan perubahan berkuat kuasa serta-merta## Tetapan UmumKonfigurasi asas untuk pemasangan XOOPS anda.### Maklumat Asas
```
Site Name: [Your Site Name]
Default Description: [Brief description of your site]
Site Slogan: [Catchy slogan]
Admin Email: admin@your-domain.com
Webmaster Name: Administrator Name
Webmaster Email: admin@your-domain.com
```
### Tetapan Rupa
```
Default Theme: [Select theme]
Default Language: English (or preferred language)
Items Per Page: 15 (typically 10-25)
Words in Snippet: 25 (for search results)
Theme Upload Permission: Disabled (security)
```
### Tetapan Serantau
```
Default Timezone: [Your timezone]
Date Format: %Y-%m-%d (YYYY-MM-DD format)
Time Format: %H:%M:%S (HH:MM:SS format)
Daylight Saving Time: [Auto/Manual/None]
```
**Jadual Format Zon Waktu:**| Wilayah | Zon waktu | Offset UTC |
|---|---|---|
| Timur AS | America/New_York | -5 / -4 |
| Pusat AS | America/Chicago | -6 / -5 |
| Gunung AS | America/Denver | -7 / -6 |
| Pasifik AS | America/Los_Angeles | -8 / -7 |
| UK/London | Europe/London | 0 / +1 |
| France/Germany | Europe/Paris | +1 / +2 |
| Jepun | Asia/Tokyo | +9 |
| China | Asia/Shanghai | +8 |
| Australia/Sydney | Australia/Sydney | +10 / +11 |### Konfigurasi Carian
```
Enable Search: Yes
Search Admin Pages: Yes/No
Search Archives: Yes
Default Search Type: All / Pages only
Words Excluded from Search: [Comma-separated list]
```
**Perkataan biasa dikecualikan:** the, a, an, and, or, but, in, on, at, by, to, from## Tetapan PenggunaKawal tingkah laku akaun pengguna dan proses pendaftaran.### Pendaftaran Pengguna
```
Allow User Registration: Yes/No
Registration Type:
  ☐ Auto-activate (Instant access)
  ☐ Admin approval (Admin must approve)
  ☐ Email verification (User must verify email)

Notification to Users: Yes/No
User Email Verification: Required/Optional
```
### Konfigurasi Pengguna Baharu
```
Auto-login New Users: Yes/No
Assign Default User Group: Yes
Default User Group: [Select group]
Create User Avatar: Yes/No
Initial User Avatar: [Select default]
```
### Tetapan Profil Pengguna
```
Allow User Profiles: Yes
Show Member List: Yes
Show User Statistics: Yes
Show Last Online Time: Yes
Allow User Avatar: Yes
Avatar Max File Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### Tetapan E-mel Pengguna
```
Allow Users to Hide Email: Yes
Show Email on Profile: Yes
Notification Email Interval: Immediately/Daily/Weekly/Never
```
### Penjejakan Aktiviti Pengguna
```
Track User Activity: Yes
Log User Logins: Yes
Log Failed Logins: Yes
Track IP Address: Yes
Clear Activity Logs Older Than: 90 days
```
### Had Akaun
```
Allow Duplicate Email: No
Minimum Username Length: 3 characters
Maximum Username Length: 15 characters
Minimum Password Length: 6 characters
Require Special Characters: Yes
Require Numbers: Yes
Password Expiration: 90 days (or Never)
Accounts Inactive Days to Delete: 365 days
```
## Tetapan ModulKonfigurasikan tingkah laku modul individu.### Pilihan Modul BiasaUntuk setiap modul yang dipasang, anda boleh menetapkan:
```
Module Status: Active/Inactive
Display in Menu: Yes/No
Module Weight: [1-999] (higher = lower in display)
Homepage Default: This module shows when visiting /
Admin Access: [Allowed user groups]
User Access: [Allowed user groups]
```
### Tetapan Modul Sistem
```
Show Homepage as: Portal / Module / Static Page
Default Homepage Module: [Select module]
Show Footer Menu: Yes
Footer Color: [Color selector]
Show System Stats: Yes
Show Memory Usage: Yes
```
### Konfigurasi setiap ModulSetiap modul boleh mempunyai tetapan khusus modul:**Contoh - Modul Halaman:**
```
Enable Comments: Yes/No
Moderate Comments: Yes/No
Comments Per Page: 10
Enable Ratings: Yes
Allow Anonymous Ratings: Yes
```
**Contoh - Modul Pengguna:**
```
Avatar Upload Folder: ./uploads/
Maximum Upload Size: 100KB
Allow File Upload: Yes
Allowed File Types: jpg, gif, png
```
Akses tetapan khusus modul:
- **Pentadbir > Modul > [Nama Modul] > Keutamaan**## Tag Meta & Tetapan SEOKonfigurasikan tag meta untuk pengoptimuman enjin carian.### Teg Meta Global
```
Meta Keywords: XOOPS, cms, content management system
Meta Description: A powerful content management system for building dynamic websites
Meta Author: Your Name
Meta Copyright: Copyright 2025, Your Company
Meta Robots: index, follow
Meta Revisit: 30 days
```
### Amalan Terbaik Tag Meta| Tag | Tujuan | Pengesyoran |
|---|---|---|
| Kata kunci | Istilah carian | 5-10 kata kunci yang berkaitan, dipisahkan koma |
| Penerangan | Penyenaraian carian | 150-160 aksara |
| Pengarang | Pencipta halaman | Nama atau syarikat anda |
| Hak Cipta | Undang-undang | Notis hak cipta anda |
| Robot | Arahan crawler | indeks, ikuti (benarkan pengindeksan) |### Tetapan Pengaki
```
Show Footer: Yes
Footer Color: Dark/Light
Footer Background: [Color code]
Footer Text: [HTML allowed]
Additional Footer Links: [URL and text pairs]
```
**Pengaki Contoh HTML:**
```
html
<p>Copyright &copy; 2025 Your Company. All rights reserved.</p>
<p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Use</a></p>
```
### Teg Meta Sosial (Graf Terbuka)
```
Enable Open Graph: Yes
Facebook App ID: [App ID]
Twitter Card Type: summary / summary_large_image / player
Default Share Image: [Image URL]
```
## Tetapan E-melKonfigurasikan penghantaran e-mel dan sistem pemberitahuan.### Kaedah Penghantaran E-mel
```
Use SMTP: Yes/No

If SMTP:
  SMTP Host: smtp.gmail.com
  SMTP Port: 587 (TLS) or 465 (SSL)
  SMTP Security: TLS / SSL / None
  SMTP Username: [email@example.com]
  SMTP Password: [password]
  SMTP Authentication: Yes/No
  SMTP Timeout: 10 seconds

If PHP mail():
  Sendmail Path: /usr/sbin/sendmail -t -i
```
### Konfigurasi E-mel
```
From Address: noreply@your-domain.com
From Name: Your Site Name
Reply-To Address: support@your-domain.com
BCC Admin Emails: Yes/No
```
### Tetapan Pemberitahuan
```
Send Welcome Email: Yes/No
Welcome Email Subject: Welcome to [Site Name]
Welcome Email Body: [Custom message]

Send Password Reset Email: Yes/No
Include Random Password: Yes/No
Token Expiration: 24 hours
```
### Pemberitahuan Pentadbir
```
Notify Admin on Registration: Yes
Notify Admin on Comments: Yes
Notify Admin on Submissions: Yes
Notify Admin on Errors: Yes
```
### Pemberitahuan Pengguna
```
Notify User on Registration: Yes
Notify User on Comments: Yes
Notify User on Private Messages: Yes
Allow Users to Disable Notifications: Yes
Default Notification Frequency: Immediately
```
### Templat E-melSesuaikan e-mel pemberitahuan dalam panel pentadbir:**Laluan:** Sistem > Templat E-melTemplat yang tersedia:
- Pendaftaran Pengguna
- Tetapan Semula Kata Laluan
- Pemberitahuan Komen
- Mesej Peribadi
- Makluman Sistem
- E-mel khusus modul## Tetapan CacheOptimumkan prestasi melalui caching.### Konfigurasi Cache
```
Enable Caching: Yes/No
Cache Type:
  ☐ File Cache
  ☐ APCu (Alternative PHP Cache)
  ☐ Memcache (Distributed caching)
  ☐ Redis (Advanced caching)

Cache Lifetime: 3600 seconds (1 hour)
```
### Pilihan Cache mengikut Jenis**Cache Fail:**
```
Cache Directory: /var/www/html/XOOPS/cache/
Clear Interval: Daily
Maximum Cache Files: 1000
```
**Cache APCU:**
```
Memory Allocation: 128MB
Fragmentation Level: Low
```
**Memcache/Redis:**
```
Server Host: localhost
Server Port: 11211 (Memcache) / 6379 (Redis)
Persistent Connection: Yes
```
### Perkara yang Dicache
```
Cache Module Lists: Yes
Cache Configuration Data: Yes
Cache Template Data: Yes
Cache User Session Data: Yes
Cache Search Results: Yes
Cache Database Queries: Yes
Cache RSS Feeds: Yes
Cache Images: Yes
```
## Tetapan URLKonfigurasikan penulisan semula dan pemformatan URL.### Tetapan URL Mesra
```
Enable Friendly URLs: Yes/No
Friendly URL Type:
  ☐ Path Info: /page/about
  ☐ Query String: /index.php?p=about

Trailing Slash: Include / Omit
URL Case: Lower case / Case sensitive
```
### Peraturan Tulis Semula URL
```
.htaccess Rules: [Display current]
Nginx Rules: [Display current if Nginx]
IIS Rules: [Display current if IIS]
```
## Tetapan KeselamatanKawal konfigurasi berkaitan keselamatan.### Keselamatan Kata Laluan
```
Password Policy:
  ☐ Require uppercase letters
  ☐ Require lowercase letters
  ☐ Require numbers
  ☐ Require special characters

Minimum Password Length: 8 characters
Password Expiration: 90 days
Password History: Remember last 5 passwords
Force Password Change: On next login
```
### Keselamatan Log Masuk
```
Lock Account After Failed Attempts: 5 attempts
Lock Duration: 15 minutes
Log All Login Attempts: Yes
Log Failed Logins: Yes
Admin Login Alert: Send email on admin login
Two-Factor Authentication: Disabled/Enabled
```
### Keselamatan Muat Naik Fail
```
Allow File Uploads: Yes/No
Maximum File Size: 128MB
Allowed File Types: jpg, gif, png, pdf, zip, doc, docx
Scan Uploads for Malware: Yes (if available)
Quarantine Suspicious Files: Yes
```
### Keselamatan Sesi
```
Session Management: Database/Files
Session Timeout: 1800 seconds (30 min)
Session Cookie Lifetime: 0 (until browser closes)
Secure Cookie: Yes (HTTPS only)
HTTP Only Cookie: Yes (prevent JavaScript access)
```
### Tetapan CORS
```
Allow Cross-Origin Requests: No
Allowed Origins: [List domains]
Allow Credentials: No
Allowed Methods: GET, POST
```
## Tetapan LanjutanPilihan konfigurasi tambahan untuk pengguna lanjutan.### Mod Nyahpepijat
```
Debug Mode: Disabled/Enabled
Log Level: Error / Warning / Info / Debug
Debug Log File: /var/log/xoops_debug.log
Display Errors: Disabled (production)
```
### Penalaan Prestasi
```
Optimize Database Queries: Yes
Use Query Cache: Yes
Compress Output: Yes
Minify CSS/JavaScript: Yes
Lazy Load Images: Yes
```
### Tetapan Kandungan
```
Allow HTML in Posts: Yes/No
Allowed HTML Tags: [Configure]
Strip Harmful Code: Yes
Allow Embed: Yes/No
Content Moderation: Automatic/Manual
Spam Detection: Yes
```
## Tetapan Export/Import### Tetapan SandaranEksport tetapan semasa:**Panel Pentadbiran > Sistem > Alat > Tetapan Eksport**
```
bash
# Settings exported as JSON file
# Download and store securely
```
### Pulihkan TetapanImport tetapan yang dieksport sebelum ini:**Panel Pentadbiran > Sistem > Alat > Tetapan Import**
```
bash
# Upload JSON file
# Verify changes before confirming
```
## Hierarki KonfigurasiXOOPS hierarki tetapan (atas ke bawah - perlawanan pertama menang):
```
1. mainfile.php (Constants)
2. Module-specific config
3. Admin System Settings
4. Theme configuration
5. User preferences (for user-specific settings)
```
## Tetapan Skrip SandaranBuat sandaran tetapan semasa:
```
php
<?php
// Backup script: /var/www/html/XOOPS/backup-settings.php
require_once __DIR__ . '/mainfile.php';

$config_handler = xoops_getHandler('config');
$configs = $config_handler->getConfigs();

$backup = [
    'exported_date' => date('Y-m-d H:i:s'),
    'xoops_version' => XOOPS_VERSION,
    'php_version' => PHP_VERSION,
    'settings' => []
];

foreach ($configs as $config) {
    $backup['settings'][$config->getVar('conf_name')] = [
        'value' => $config->getVar('conf_value'),
        'description' => $config->getVar('conf_desc'),
        'type' => $config->getVar('conf_type'),
    ];
}

// Save to JSON file
file_put_contents(
    '/backups/xoops_settings_' . date('YmdHis') . '.json',
    json_encode($backup, JSON_PRETTY_PRINT)
);

echo "Settings backed up successfully!";
?>
```
## Perubahan Tetapan Biasa### Tukar Nama Tapak1. Pentadbir > Sistem > Keutamaan > Tetapan Umum
2. Ubah suai "Nama Tapak"
3. Klik "Simpan"### Pendaftaran Enable/Disable1. Pentadbir > Sistem > Keutamaan > Tetapan Pengguna
2. Togol "Benarkan Pendaftaran Pengguna"
3. Pilih jenis pendaftaran
4. Klik "Simpan"### Tukar Tema Lalai1. Pentadbir > Sistem > Keutamaan > Tetapan Umum
2. Pilih "Tema Lalai"
3. Klik "Simpan"
4. Kosongkan cache untuk perubahan berkuat kuasa### Kemas kini E-mel Kenalan1. Pentadbir > Sistem > Keutamaan > Tetapan Umum
2. Ubah suai "E-mel Pentadbir"
3. Ubah suai "E-mel Juruweb"
4. Klik "Simpan"## Senarai Semak PengesahanSelepas mengkonfigurasi tetapan sistem, sahkan:- [ ] Nama tapak dipaparkan dengan betul
- [ ] Zon waktu menunjukkan masa yang betul
- [ ] Pemberitahuan e-mel dihantar dengan betul
- [ ] Pendaftaran pengguna berfungsi seperti yang dikonfigurasikan
- [ ] Halaman utama memaparkan lalai yang dipilih
- [ ] Fungsi carian berfungsi
- [ ] Cache menambah baik masa muat halaman
- [ ] URL mesra berfungsi (jika didayakan)
- [ ] Teg meta muncul dalam sumber halaman
- [ ] Pemberitahuan pentadbir diterima
- [ ] Tetapan keselamatan dikuatkuasakan## Tetapan Penyelesaian Masalah### Tetapan Tidak Menyimpan**Penyelesaian:**
```
bash
# Check file permissions on config directory
chmod 755 /var/www/html/XOOPS/var/

# Verify database writable
# Try saving again in admin panel
```
### Perubahan Tidak Berlaku**Penyelesaian:**
```
bash
# Clear cache
rm -rf /var/www/html/XOOPS/cache/*
rm -rf /var/www/html/XOOPS/templates_c/*

# If still not working, restart web server
systemctl restart apache2
```
### E-mel Tidak Dihantar**Penyelesaian:**
1. Sahkan kelayakan SMTP dalam tetapan e-mel
2. Uji dengan butang "Hantar E-mel Ujian".
3. Semak log ralat
4. Cuba gunakan PHP mail() dan bukannya SMTP## Langkah SeterusnyaSelepas konfigurasi tetapan sistem:1. Konfigurasikan tetapan keselamatan
2. Optimumkan prestasi
3. Terokai ciri panel pentadbir
4. Sediakan pengurusan pengguna---

**Tag:** #sistem-tetapan #konfigurasi #keutamaan #panelpentadbir**Artikel Berkaitan:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Konfigurasi Keselamatan
- Pengoptimuman Prestasi
- ../First-Steps/Admin-Panel-Overview