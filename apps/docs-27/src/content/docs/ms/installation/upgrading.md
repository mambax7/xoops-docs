---
title: "Menaik taraf XOOPS"
description: "Panduan lengkap untuk menaik taraf XOOPS termasuk sandaran, pemindahan pangkalan data dan penyelesaian masalah"
---
Panduan ini merangkumi peningkatan XOOPS daripada versi lama kepada keluaran terkini sambil mengekalkan data dan penyesuaian anda.> **Maklumat Versi**
> - **Stabil:** XOOPS 2.5.11
> - **Beta:** XOOPS 2.7.0 (ujian)
> - **Masa hadapan:** XOOPS 4.0 (dalam pembangunan - lihat Pelan Hala Tuju)## Senarai Semak Pra-Naik TarafSebelum memulakan naik taraf, sahkan:- [ ] Versi XOOPS semasa didokumenkan
- [ ] Versi sasaran XOOPS dikenal pasti
- [ ] Sandaran sistem penuh selesai
- [ ] Sandaran pangkalan data disahkan
- [ ] Senarai modul yang dipasang direkodkan
- [ ] Pengubahsuaian tersuai didokumenkan
- [ ] Persekitaran ujian tersedia
- [ ] Laluan naik taraf diperiksa (sesetengah versi melangkau keluaran perantaraan)
- [ ] Sumber pelayan disahkan (ruang cakera yang mencukupi, memori)
- [ ] Mod penyelenggaraan didayakan## Panduan Laluan Naik TarafLaluan naik taraf berbeza bergantung pada versi semasa:
```
mermaid
graph LR
    A[2.3.x] -->|Requires 2.4.x| B[2.4.x]
    B -->|Direct or via 2.5.x| C[2.5.x]
    A -->|Via 2.4.x| C
    C -->|Stable| D[2.5.11]
    E[2.5.0-2.5.10] -->|Direct| D
    D -->|Beta| F[2.7.0]
```
**Penting:** Jangan sekali-kali melangkau versi utama. Jika menaik taraf daripada 2.3.x, mula-mula naik taraf kepada 2.4.x, kemudian kepada 2.5.x.## Langkah 1: Lengkapkan Sandaran Sistem### Sandaran Pangkalan DataGunakan mysqldump untuk membuat sandaran pangkalan data:
```
bash
# Full database backup
mysqldump -u xoops_user -p xoops_db > /backups/xoops_db_backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
mysqldump -u xoops_user -p xoops_db | gzip > /backups/xoops_db_backup_$(date +%Y%m%d_%H%M%S).sql.gz
```
Atau menggunakan phpMyAdmin:1. Pilih pangkalan data XOOPS anda
2. Klik tab "Eksport".
3. Pilih format "SQL".
4. Pilih "Simpan sebagai fail"
5. Klik "Pergi"Sahkan fail sandaran:
```
bash
# Check backup size
ls -lh /backups/xoops_db_backup*.sql

# Verify backup integrity (uncompressed)
head -20 /backups/xoops_db_backup_*.sql

# Verify compressed backup
zcat /backups/xoops_db_backup_*.sql.gz | head -20
```
### Sandaran Sistem FailSandarkan semua fail XOOPS:
```
bash
# Compressed file backup
tar -czf /backups/xoops_files_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/html/XOOPS

# Uncompressed (faster, requires more disk space)
tar -cf /backups/xoops_files_$(date +%Y%m%d_%H%M%S).tar /var/www/html/XOOPS

# Show backup progress
tar -czf /backups/xoops_files_$(date +%Y%m%d_%H%M%S).tar.gz --verbose /var/www/html/XOOPS | tail
```
Simpan sandaran dengan selamat:
```
bash
# Secure backup storage
chmod 600 /backups/xoops_*
ls -lah /backups/

# Optional: Copy to remote storage
scp /backups/xoops_* user@backup-server:/secure/backups/
```
### Uji Pemulihan Sandaran**CRITICAL:** Sentiasa uji sandaran anda berfungsi:
```
bash
# Verify tar archive contents
tar -tzf /backups/xoops_files_*.tar.gz | head -20

# Extract to test location
mkdir /tmp/restore_test
cd /tmp/restore_test
tar -xzf /backups/xoops_files_*.tar.gz

# Verify key files exist
ls -la XOOPS/mainfile.php
ls -la XOOPS/install/
```
## Langkah 2: Dayakan Mod PenyelenggaraanHalang pengguna daripada mengakses tapak semasa naik taraf:### Pilihan 1: Panel Pentadbiran XOOPS1. Log masuk ke panel pentadbir
2. Pergi ke Sistem > Penyelenggaraan
3. Dayakan "Mod Penyelenggaraan Tapak"
4. Tetapkan mesej penyelenggaraan
5. Jimat### Pilihan 2: Mod Penyelenggaraan ManualBuat fail penyelenggaraan di akar web:
```
html
<!-- /var/www/html/maintenance.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Under Maintenance</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #333; }
        p { color: #666; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Site Under Maintenance</h1>
    <p>We're currently upgrading our site.</p>
    <p>Expected time: approximately 30 minutes.</p>
    <p>Thank you for your patience!</p>
</body>
</html>
```
Konfigurasikan Apache untuk menunjukkan halaman penyelenggaraan:
```
apache
# In .htaccess or vhost config
ErrorDocument 503 /maintenance.html

# Redirect all traffic to maintenance page
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REMOTE_ADDR} !^192\.168\.1\.100$  # Your IP
    RewriteRule ^(.*)$ - [R=503,L]
</IfModule>
```
## Langkah 3: Muat Turun Versi BaharuMuat turun XOOPS dari tapak rasmi:
```
bash
# Download latest version
cd /tmp
wget https://XOOPS.org/download/XOOPS-2.5.8.zip

# Verify checksum (if provided)
sha256sum XOOPS-2.5.8.zip
# Compare with official SHA256 hash

# Extract to temporary location
unzip XOOPS-2.5.8.zip
cd XOOPS-2.5.8
```
## Langkah 4: Pra-Naik Taraf Penyediaan Fail### Kenal pasti Pengubahsuaian TersuaiSemak fail teras tersuai:
```
bash
# Look for modified files (files with newer mtime)
find /var/www/html/XOOPS -type f -newer /var/www/html/XOOPS/install.php

# Check for custom themes
ls /var/www/html/XOOPS/themes/
# Note any custom themes

# Check for custom modules
ls /var/www/html/XOOPS/modules/
# Note any custom modules created by you
```
### Dokumen Keadaan SemasaBuat laporan peningkatan:
```
bash
cat > /tmp/upgrade_report.txt << EOF
=== XOOPS Upgrade Report ===
Date: $(date)
Current Version: 2.5.6
Target Version: 2.5.8

=== Installed Modules ===
$(ls /var/www/html/XOOPS/modules/)

=== Custom Modifications ===
[Document any custom theme or module modifications]

=== Themes ===
$(ls /var/www/html/XOOPS/themes/)

=== Plugin Status ===
[List any custom code modifications]

EOF
```
## Langkah 5: Gabungkan Fail Baharu dengan Pemasangan Semasa### Strategi: Kekalkan Fail TersuaiGantikan fail teras XOOPS tetapi simpan:
- `mainfile.php` (konfigurasi pangkalan data anda)
- Tema tersuai dalam `themes/`
- Modul tersuai dalam `modules/`
- Muat naik pengguna dalam `uploads/`
- Data tapak dalam `var/`### Proses Gabungan Manual
```
bash
# Set variables
XOOPS_OLD="/var/www/html/XOOPS"
XOOPS_NEW="/tmp/XOOPS-2.5.8"
BACKUP="/backups/pre-upgrade"

# Create pre-upgrade backup in place
mkdir -p $BACKUP
cp -r $XOOPS_OLD/* $BACKUP/

# Copy new files (but preserve sensitive files)
# Copy everything except protected directories
rsync -av --exclude='mainfile.php' \
    --exclude='modules/custom*' \
    --exclude='themes/custom*' \
    --exclude='uploads' \
    --exclude='var' \
    --exclude='cache' \
    --exclude='templates_c' \
    $XOOPS_NEW/ $XOOPS_OLD/

# Verify critical files preserved
ls -la $XOOPS_OLD/mainfile.php
```
### Menggunakan upgrade.php (Jika Ada)Beberapa versi XOOPS termasuk skrip peningkatan automatik:
```
bash
# Copy new files with installer
cp -r /tmp/XOOPS-2.5.8/* /var/www/html/XOOPS/

# Run upgrade wizard
# Visit: http://your-domain.com/XOOPS/upgrade/
```
### Kebenaran Fail Selepas GabungPulihkan kebenaran yang betul:
```
bash
# Set ownership
chown -R www-data:www-data /var/www/html/XOOPS

# Set directory permissions
find /var/www/html/XOOPS -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/html/XOOPS -type f -exec chmod 644 {} \;

# Make writable directories
chmod 777 /var/www/html/XOOPS/cache
chmod 777 /var/www/html/XOOPS/templates_c
chmod 777 /var/www/html/XOOPS/uploads
chmod 777 /var/www/html/XOOPS/var

# Secure mainfile.php
chmod 644 /var/www/html/XOOPS/mainfile.php
```
## Langkah 6: Migrasi Pangkalan Data### Semak Perubahan Pangkalan DataSemak nota keluaran XOOPS untuk perubahan struktur pangkalan data:
```
bash
# Extract and review SQL migration files
find /tmp/XOOPS-2.5.8 -name "*.sql" -type f
# Document all .sql files found
```
### Jalankan Kemas Kini Pangkalan Data### Pilihan 1: Kemas Kini Automatik (jika ada)Gunakan panel pentadbir:1. Log masuk ke admin
2. Pergi ke **Sistem > Pangkalan Data**
3. Klik "Semak Kemas Kini"
4. Semak perubahan yang belum selesai
5. Klik "Guna Kemas Kini"### Pilihan 2: Kemas Kini Pangkalan Data ManualLaksanakan fail SQL migrasi:
```
bash
# Connect to database
mysql -u xoops_user -p xoops_db

# View pending changes (varies by version)
SELECT * FROM xoops_config WHERE conf_name LIKE '%version%';

# Run migration scripts manually if needed
SOURCE /tmp/XOOPS-2.5.8/migrate_2.5.6_to_2.5.8.sql;
```
### Pengesahan Pangkalan DataSahkan integriti pangkalan data selepas kemas kini:
```
sql
-- Check database consistency
REPAIR TABLE xoops_users;
OPTIMIZE TABLE xoops_users;

-- Verify key tables exist
SHOW TABLES LIKE 'xoops_%';

-- Check row counts (should increase or stay same)
SELECT COUNT(*) FROM xoops_users;
SELECT COUNT(*) FROM xoops_posts;
```
## Langkah 7: Sahkan Peningkatan### Semakan Halaman UtamaLawati halaman utama XOOPS anda:
```
http://your-domain.com/XOOPS/
```
Dijangka: Halaman dimuatkan tanpa ralat, dipaparkan dengan betul### Semakan Panel PentadbirAkses pentadbir:
```
http://your-domain.com/XOOPS/admin/
```
Sahkan:
- [ ] Panel pentadbir dimuatkan
- [ ] Navigasi berfungsi
- [ ] Papan pemuka dipaparkan dengan betul
- [ ] Tiada ralat pangkalan data dalam log### Pengesahan ModulSemak modul yang dipasang:1. Pergi ke **Modules > Modules** dalam admin
2. Sahkan semua modul masih dipasang
3. Semak sebarang mesej ralat
4. Dayakan mana-mana modul yang telah dilumpuhkan### Semakan Fail LogSemak log sistem untuk ralat:
```
bash
# Check web server error log
tail -50 /var/log/apache2/error.log

# Check PHP error log
tail -50 /var/log/php_errors.log

# Check XOOPS system log (if available)
# In admin panel: System > Logs
```
### Fungsi Teras Uji- [ ] Pengguna login/logout berfungsi
- [ ] Pendaftaran pengguna berfungsi
- [ ] Fungsi muat naik fail
- [ ] Pemberitahuan e-mel dihantar
- [ ] Fungsi carian berfungsi
- [ ] Pentadbir berfungsi beroperasi
- [ ] Kefungsian modul utuh## Langkah 8: Pembersihan Selepas Naik Taraf### Alih Keluar Fail Sementara
```
bash
# Remove extraction directory
rm -rf /tmp/XOOPS-2.5.8

# Clear template cache (safe to delete)
rm -rf /var/www/html/XOOPS/templates_c/*

# Clear site cache
rm -rf /var/www/html/XOOPS/cache/*
```
### Alih Keluar Mod PenyelenggaraanDayakan semula akses tapak biasa:
```
apache
# Remove maintenance mode redirect from .htaccess
# Or delete maintenance.html file
rm /var/www/html/maintenance.html
```
### Kemas Kini DokumentasiKemas kini nota peningkatan anda:
```
bash
# Document successful upgrade
cat >> /tmp/upgrade_report.txt << EOF

=== Upgrade Results ===
Status: SUCCESS
Upgrade Date: $(date)
New Version: 2.5.8
Duration: [time in minutes]

Post-Upgrade Tests:
- [x] Homepage loads
- [x] Admin panel accessible
- [x] Modules functional
- [x] User registration works
- [x] Database optimized

EOF
```
## Menyelesaikan Masalah Peningkatan### Isu: Skrin Putih Kosong Selepas Naik Taraf**Simptom:** Halaman utama tidak menunjukkan apa-apa**Penyelesaian:**
```
bash
# Check PHP errors
tail -f /var/log/apache2/error.log

# Enable debug mode temporarily
echo "define('XOOPS_DEBUG', 1);" >> /var/www/html/XOOPS/mainfile.php

# Check file permissions
ls -la /var/www/html/XOOPS/mainfile.php

# Restore from backup if needed
cp /backups/xoops_files_*.tar.gz /tmp/
cd /tmp && tar -xzf xoops_files_*.tar.gz
```
### Isu: Ralat Sambungan Pangkalan Data**Simptom:** Mesej "Tidak dapat menyambung ke pangkalan data".**Penyelesaian:**
```
bash
# Verify database credentials in mainfile.php
grep -i "database\|host\|user" /var/www/html/XOOPS/mainfile.php

# Test connection
mysql -h localhost -u xoops_user -p xoops_db -e "SELECT 1"

# Check MySQL status
systemctl status mysql

# Verify database still exists
mysql -u xoops_user -p -e "SHOW DATABASES" | grep XOOPS
```
### Isu: Panel Pentadbir Tidak Boleh Diakses**Simptom:** Tidak dapat mengakses /XOOPS/admin/**Penyelesaian:**
```
bash
# Check .htaccess rules
cat /var/www/html/XOOPS/.htaccess

# Verify admin files exist
ls -la /var/www/html/XOOPS/admin/

# Check mod_rewrite enabled
apache2ctl -M | grep rewrite

# Restart web server
systemctl restart apache2
```
### Isu: Modul Tidak Memuatkan**Simptom:** Modul menunjukkan ralat atau dinyahaktifkan**Penyelesaian:**
```
bash
# Verify module files exist
ls /var/www/html/XOOPS/modules/

# Check module permissions
ls -la /var/www/html/XOOPS/modules/*/

# Check module configuration in database
mysql -u xoops_user -p xoops_db -e "SELECT * FROM xoops_modules WHERE module_status = 0"

# Reactivate modules in admin panel
# System > Modules > Click module > Update Status
```
### Isu: Kebenaran Ditolak Ralat**Simptom:** "Kebenaran ditolak" semasa memuat naik atau menyimpan**Penyelesaian:**
```
bash
# Check file ownership
ls -la /var/www/html/XOOPS/ | head -20

# Fix ownership
chown -R www-data:www-data /var/www/html/XOOPS

# Fix directory permissions
find /var/www/html/XOOPS -type d -exec chmod 755 {} \;

# Make cache/uploads writable
chmod 777 /var/www/html/XOOPS/cache
chmod 777 /var/www/html/XOOPS/templates_c
chmod 777 /var/www/html/XOOPS/uploads
chmod 777 /var/www/html/XOOPS/var
```
### Isu: Pemuatan Halaman Lambat**Simptom:** Halaman dimuatkan dengan sangat perlahan selepas naik taraf**Penyelesaian:**
```
bash
# Clear all caches
rm -rf /var/www/html/XOOPS/cache/*
rm -rf /var/www/html/XOOPS/templates_c/*

# Optimize database
mysql -u xoops_user -p xoops_db << EOF
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
ANALYZE TABLE xoops_users;
EOF

# Check PHP error log for warnings
grep -i "deprecated\|warning" /var/log/php_errors.log | tail -20

# Increase PHP memory/execution time temporarily
# Edit php.ini:
memory_limit = 256M
max_execution_time = 300
```
## Prosedur RollbackJika peningkatan gagal secara kritikal, pulihkan daripada sandaran:### Pulihkan Pangkalan Data
```
bash
# Restore from backup
mysql -u xoops_user -p xoops_db < /backups/xoops_db_backup_YYYYMMDD_HHMMSS.sql

# Or from compressed backup
gunzip < /backups/xoops_db_backup_YYYYMMDD_HHMMSS.sql.gz | mysql -u xoops_user -p xoops_db

# Verify restoration
mysql -u xoops_user -p xoops_db -e "SELECT COUNT(*) FROM xoops_users"
```
### Pulihkan Sistem Fail
```
bash
# Stop web server
systemctl stop apache2

# Remove current installation
rm -rf /var/www/html/XOOPS/*

# Extract backup
cd /var/www/html
tar -xzf /backups/xoops_files_YYYYMMDD_HHMMSS.tar.gz

# Fix permissions
chown -R www-data:www-data XOOPS/
find XOOPS -type d -exec chmod 755 {} \;
find XOOPS -type f -exec chmod 644 {} \;
chmod 777 XOOPS/cache XOOPS/templates_c XOOPS/uploads XOOPS/var

# Start web server
systemctl start apache2

# Verify restoration
# Visit http://your-domain.com/XOOPS/
```
## Naik Taraf Senarai Semak PengesahanSelepas naik taraf selesai, sahkan:- [ ] Versi XOOPS dikemas kini (semak pentadbir > Maklumat sistem)
- [ ] Halaman utama dimuatkan tanpa ralat
- [ ] Semua modul berfungsi
- [ ] Log masuk pengguna berfungsi
- [ ] Panel pentadbir boleh diakses
- [ ] Muat naik fail berfungsi
- [ ] Pemberitahuan e-mel berfungsi
- [ ] Integriti pangkalan data disahkan
- [ ] Kebenaran fail betul
- [ ] Mod penyelenggaraan dialih keluar
- [ ] Sandaran dijamin dan diuji
- [ ] Prestasi boleh diterima
- [ ] SSL/HTTPS berfungsi
- [ ] Tiada mesej ralat dalam log## Langkah SeterusnyaSelepas naik taraf berjaya:1. Kemas kini mana-mana modul tersuai kepada versi terkini
2. Semak nota keluaran untuk ciri yang tidak digunakan
3. Pertimbangkan untuk mengoptimumkan prestasi
4. Kemas kini tetapan keselamatan
5. Uji semua fungsi dengan teliti
6. Pastikan fail sandaran selamat---

**Tag:** #naik taraf #penyelenggaraan #sandaran #penghijrahan pangkalan data**Artikel Berkaitan:**
- ../../06-Publisher-Module/User-Guide/Installation
- Keperluan Pelayan
- ../Configuration/Basic-Configuration
- ../Configuration/Security-Configuration