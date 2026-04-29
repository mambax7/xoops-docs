---
title: "Panduan Pemasangan Lengkap"
description: "Panduan langkah demi langkah untuk memasang XOOPS dengan wizard pemasangan, pengerasan keselamatan dan penyelesaian masalah"
---
# Panduan Pemasangan XOOPS LengkapPanduan ini menyediakan panduan menyeluruh untuk memasang XOOPS dari awal menggunakan wizard pemasangan.## PrasyaratSebelum memulakan pemasangan, pastikan anda mempunyai:- Akses ke pelayan web anda melalui FTP atau SSH
- Akses pentadbir ke pelayan pangkalan data anda
- Nama domain berdaftar
- Keperluan pelayan disahkan
- Alat sandaran tersedia## Proses Pemasangan
```
mermaid
flowchart TD
    A[Download XOOPS] --> B[Extract Files]
    B --> C[Set File Permissions]
    C --> D[Create Database]
    D --> E[Visit Installation Wizard]
    E --> F{License Accepted?}
    F -->|No| G[Review License]
    G --> F
    F -->|Yes| H[System Check]
    H --> I{All Checks Pass?}
    I -->|No| J[Fix Issues]
    J --> I
    I -->|Yes| K[Database Configuration]
    K --> L[Admin Account Setup]
    L --> M[Module Installation]
    M --> N[Installation Complete]
    N --> O[Remove install Folder]
    O --> P[Secure Installation]
    P --> Q[Begin Using XOOPS]
```
## Pemasangan Langkah demi Langkah### Langkah 1: Muat turun XOOPSMuat turun versi terkini daripada [https://XOOPS.org/](https://XOOPS.org/):
```
bash
# Using wget
wget https://XOOPS.org/download/XOOPS-2.5.8.zip

# Using curl
curl -O https://XOOPS.org/download/XOOPS-2.5.8.zip
```
### Langkah 2: Ekstrak FailEkstrak arkib XOOPS ke akar web anda:
```
bash
# Navigate to web root
cd /var/www/html

# Extract XOOPS
unzip XOOPS-2.5.8.zip

# Rename folder (optional, but recommended)
mv XOOPS-2.5.8 XOOPS
cd XOOPS
```
### Langkah 3: Tetapkan Kebenaran FailTetapkan kebenaran yang betul untuk direktori XOOPS:
```
bash
# Make directories writable (755 for dirs, 644 for files)
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# Make specific directories writable by web server
chmod 777 uploads/
chmod 777 templates_c/
chmod 777 var/
chmod 777 cache/

# Secure mainfile.php after installation
chmod 644 mainfile.php
```
### Langkah 4: Cipta Pangkalan DataCipta pangkalan data baharu untuk XOOPS menggunakan MySQL:
```
sql
-- Create database
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'xoops_user'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';
FLUSH PRIVILEGES;
```
Atau menggunakan phpMyAdmin:1. Log masuk ke phpMyAdmin
2. Klik tab "Pangkalan Data".
3. Masukkan nama pangkalan data: `xoops_db`
4. Pilih pengumpulan "utf8mb4_unicode_ci".
5. Klik "Buat"
6. Buat pengguna dengan nama yang sama dengan pangkalan data
7. Berikan semua keistimewaan### Langkah 5: Jalankan Wizard PemasanganBuka penyemak imbas anda dan navigasi ke:
```
http://your-domain.com/XOOPS/install/
```
#### Fasa Semakan SistemWizard menyemak konfigurasi pelayan anda:- Versi PHP >= 5.6.0
- MySQL/MariaDB tersedia
- Sambungan PHP yang diperlukan (GD, PDO, dll.)
- Kebenaran direktori
- Kesambungan pangkalan data**Jika semakan gagal:**Lihat bahagian #Isu-Pemasangan Biasa untuk penyelesaian.#### Konfigurasi Pangkalan DataMasukkan kelayakan pangkalan data anda:
```
Database Host: localhost
Database Name: xoops_db
Database User: xoops_user
Database Password: [your_secure_password]
Table Prefix: xoops_
```
**Nota Penting:**
- Jika hos pangkalan data anda berbeza daripada localhost (cth., pelayan jauh), masukkan nama hos yang betul
- Awalan jadual membantu jika menjalankan berbilang kejadian XOOPS dalam satu pangkalan data
- Gunakan kata laluan yang kukuh dengan huruf besar bercampur, nombor dan simbol#### Persediaan Akaun PentadbirBuat akaun pentadbir anda:
```
Admin Username: admin (or choose custom)
Admin Email: admin@your-domain.com
Admin Password: [strong_unique_password]
Confirm Password: [repeat_password]
```
**Amalan Terbaik:**
- Gunakan nama pengguna yang unik, bukan "admin"
- Gunakan kata laluan dengan 16+ aksara
- Simpan bukti kelayakan dalam pengurus kata laluan yang selamat
- Jangan sekali-kali berkongsi kelayakan pentadbir#### Pemasangan ModulPilih modul lalai untuk dipasang:- **Modul Sistem** (diperlukan) - Fungsi Teras XOOPS
- **Modul Pengguna** (diperlukan) - Pengurusan pengguna
- **Modul Profil** (disyorkan) - Profil pengguna
- **Modul PM (Mesej Peribadi)** (disyorkan) - Pemesejan dalaman
- **Modul Saluran WF** (pilihan) - Pengurusan kandunganPilih semua modul yang disyorkan untuk pemasangan lengkap.### Langkah 6: Selesaikan PemasanganSelepas semua langkah, anda akan melihat skrin pengesahan:
```
Installation Complete!

Your XOOPS installation is ready to use.
Admin Panel: http://your-domain.com/XOOPS/admin/
User Panel: http://your-domain.com/XOOPS/
```
### Langkah 7: Lindungi Pemasangan Anda#### Keluarkan Folder Pemasangan
```
bash
# Remove the install directory (CRITICAL for security)
rm -rf /var/www/html/XOOPS/install/

# Or rename it
mv /var/www/html/XOOPS/install/ /var/www/html/XOOPS/install.bak
```
**WARNING:** Jangan biarkan folder pemasangan boleh diakses dalam pengeluaran!#### Selamat mainfile.php
```
bash
# Make mainfile.php read-only
chmod 644 /var/www/html/XOOPS/mainfile.php

# Set ownership
chown www-data:www-data /var/www/html/XOOPS/mainfile.php
```
#### Tetapkan Kebenaran Fail yang Betul
```
bash
# Recommended production permissions
find . -type f -name "*.php" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Writable directories for web server
chmod 777 uploads/ var/ cache/ templates_c/
```
#### Dayakan HTTPS/SSLKonfigurasikan SSL dalam pelayan web anda (nginx atau Apache).**Untuk Apache:**
```
apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/html/XOOPS

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/your-cert.crt
    SSLCertificateKeyFile /etc/ssl/private/your-key.key

    # Force HTTPS redirect
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{HTTPS} off
        RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    </IfModule>
</VirtualHost>
```
## Konfigurasi Selepas Pemasangan### 1. Akses Panel PentadbirNavigasi ke:
```
http://your-domain.com/XOOPS/admin/
```
Log masuk dengan kelayakan pentadbir anda.### 2. Konfigurasikan Tetapan AsasKonfigurasikan perkara berikut:- Nama tapak dan penerangan
- Alamat e-mel pentadbir
- Zon waktu dan format tarikh
- Pengoptimuman enjin carian### 3. Ujian Pemasangan- [ ] Lawati laman utama
- [ ] Periksa beban modul
- [ ] Sahkan pendaftaran pengguna berfungsi
- [ ] Uji fungsi panel pentadbir
- [ ] Sahkan SSL/HTTPS berfungsi### 4. Jadual SandaranSediakan sandaran automatik:
```
bash
# Create backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/XOOPS"
XOOPS_DIR="/var/www/html/XOOPS"

# Backup database
mysqldump -u xoops_user -p[password] xoops_db > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $XOOPS_DIR

echo "Backup completed: $DATE"
```
Jadualkan dengan cron:
```
bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup.sh
```
## Isu Pemasangan Biasa### Isu: Kebenaran Ditolak Ralat**Simptom:** "Kebenaran ditolak" semasa memuat naik atau membuat fail**Penyelesaian:**
```
bash
# Check web server user
ps aux | grep apache  # For Apache
ps aux | grep nginx   # For Nginx

# Fix permissions (replace www-data with your web server user)
chown -R www-data:www-data /var/www/html/XOOPS
chmod -R 755 /var/www/html/XOOPS
chmod 777 uploads/ var/ cache/ templates_c/
```
### Isu: Sambungan Pangkalan Data Gagal**Simptom:** "Tidak dapat menyambung ke pelayan pangkalan data"**Penyelesaian:**
1. Sahkan kelayakan pangkalan data dalam wizard pemasangan
2. Semak MySQL/MariaDB sedang berjalan:
   
```
bash
   perkhidmatan mysql status # atau mariadb
   
```
3. Sahkan pangkalan data wujud:
   
```
sql
   SHOW DATABASES;
   
```
4. Uji sambungan daripada baris arahan:
   
```
bash
   mysql -h localhost -u xoops_user -p xoops_db
   ```### Isu: Skrin Putih Kosong**Simptom:** Melawat XOOPS menunjukkan halaman kosong**Penyelesaian:**
1. Semak log ralat PHP:
   
```
bash
   ekor -f /var/log/apache2/error.log
   
```
2. Dayakan mod nyahpepijat dalam mainfile.php:
   
```
php
   define('XOOPS_DEBUG', 1);
   
```
3. Semak kebenaran fail pada mainfile.php dan fail konfigurasi
4. Sahkan sambungan PHP-MySQL dipasang### Isu: Tidak Boleh Menulis ke Direktori Muat Naik**Simptom:** Ciri muat naik gagal, "Tidak boleh menulis kepada uploads/"**Penyelesaian:**
```
bash
# Check current permissions
ls -la uploads/

# Fix permissions
chmod 777 uploads/
chown www-data:www-data uploads/

# For specific files
chmod 644 uploads/*
```
### Isu: Sambungan PHP Tiada**Simptom:** Semakan sistem gagal dengan sambungan yang tiada (GD, MySQL, dll.)**Penyelesaian (Ubuntu/Debian):**
```
bash
# Install PHP GD library
apt-get install php-gd

# Install PHP MySQL support
apt-get install php-mysql

# Restart web server
systemctl restart apache2  # or nginx
```
**Penyelesaian (CentOS/RHEL):**
```
bash
# Install PHP GD library
yum install php-gd

# Install PHP MySQL support
yum install php-mysql

# Restart web server
systemctl restart httpd
```
### Isu: Proses Pemasangan yang Lambat**Simptom:** Wizard pemasangan tamat masa atau berjalan sangat perlahan**Penyelesaian:**
1. Tingkatkan tamat masa PHP dalam php.ini:
   
```
ini
   max_execution_time = 300 # 5 minit
   
```
2. Tingkatkan MySQL max_allowed_packet:
   
```
sql
   SET GLOBAL max_allowed_packet = 256M;
   
```
3. Semak sumber pelayan:
   
```
bash
   percuma -h # Semak RAM
   df -h # Semak ruang cakera
   ```### Isu: Panel Pentadbir Tidak Boleh Diakses**Simptom:** Tidak dapat mengakses panel pentadbir selepas pemasangan**Penyelesaian:**
1. Sahkan pengguna pentadbir wujud dalam pangkalan data:
   
```
sql
   SELECT * FROM xoops_users WHERE uid = 1;
   
```
2. Kosongkan cache dan kuki penyemak imbas
3. Semak sama ada folder sesi boleh ditulis:
   
```
bash
   chmod 777 var/
   
```
4. Sahkan peraturan htaccess tidak menyekat akses pentadbir## Senarai Semak PengesahanSelepas pemasangan, sahkan:- [x] Halaman utama XOOPS dimuatkan dengan betul
- [x] Panel pentadbir boleh diakses di /XOOPS/admin/
- [x] SSL/HTTPS berfungsi
- [x] Folder pemasangan dialih keluar atau tidak boleh diakses
- [x] Kebenaran fail adalah selamat (644 untuk fail, 755 untuk dir)
- [x] Sandaran pangkalan data dijadualkan
- [x] Modul dimuatkan tanpa ralat
- [x] Sistem pendaftaran pengguna berfungsi
- [x] Fungsi muat naik fail berfungsi
- [x] Pemberitahuan e-mel dihantar dengan betul## Langkah SeterusnyaSetelah pemasangan selesai:1. Baca panduan Konfigurasi Asas
2. Lindungi pemasangan anda
3. Teroka panel pentadbir
4. Pasang modul tambahan
5. Sediakan kumpulan pengguna dan kebenaran---

**Tag:** #pemasangan #penyediaan #bermula #penyelesaian masalah**Artikel Berkaitan:**
- Keperluan Pelayan
- Menaik taraf-XOOPS
- ../Configuration/Security-Configuration