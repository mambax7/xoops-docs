---
title: "Konfigurasi Keselamatan"
description: "Panduan pengerasan keselamatan lengkap untuk XOOPS termasuk kebenaran fail, direktori sensitif SSL/HTTPS, dan amalan terbaik keselamatan"
---
# XOOPS Konfigurasi KeselamatanPanduan komprehensif untuk melindungi pemasangan XOOPS anda daripada kelemahan web biasa.## Senarai Semak KeselamatanSebelum melancarkan tapak anda, laksanakan langkah keselamatan ini:- [ ] Kebenaran fail ditetapkan dengan betul (644/755)
- [ ] Pasang folder dialih keluar atau dilindungi
- [ ] mainfile.php dilindungi daripada pengubahsuaian
- [ ] SSL/HTTPS didayakan pada semua halaman
- [ ] Folder pentadbir dinamakan semula atau dilindungi
- [ ] Fail sensitif tidak boleh diakses web
- [ ] .sekatan htaccess berlaku
- [ ] Sandaran biasa automatik
- [ ] Pengepala keselamatan dikonfigurasikan
- [ ] Perlindungan CSRF didayakan
- [ ] Perlindungan suntikan SQL aktif
- [ ] Modules/extensions dikemas kini## Keselamatan Sistem Fail### Kebenaran FailKebenaran fail yang betul adalah penting untuk keselamatan.#### Garis Panduan Kebenaran| Laluan | Kebenaran | Pemilik | Sebab |
|---|---|---|---|
| mainfile.php | 644 | akar | Mengandungi kelayakan DB |
| *.php fail | 644 | akar | Cegah pengubahsuaian tanpa kebenaran |
| Direktori | 755 | akar | Benarkan membaca, halang menulis |
| cache/ | 777 | www-data | Pelayan web mesti menulis |
| templates_c/ | 777 | www-data | Templat yang disusun |
| muat naik/ | 777 | www-data | Muat naik pengguna |
| var/ | 777 | www-data | Data boleh ubah |
| pasang/ | Alih keluar | - | Padam selepas pemasangan |
| konfigurasi/ | 755 | akar | Boleh dibaca, tidak boleh ditulis |#### Menetapkan Skrip Kebenaran
```
bash
#!/bin/bash
# File: /usr/local/bin/XOOPS-secure.sh

XOOPS_PATH="/var/www/html/XOOPS"
WEB_USER="www-data"

# Set ownership
echo "Setting ownership..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set restrictive default permissions
echo "Setting base permissions..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Make specific directories writable
echo "Setting writable directories..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# Protect sensitive files
echo "Protecting sensitive files..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # If it exists (read-only)

# Verify permissions
echo "Verifying permissions..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "Security hardening completed!"
```
Jalankan skrip:
```
bash
chmod +x /usr/local/bin/XOOPS-secure.sh
/usr/local/bin/XOOPS-secure.sh
```
### Alih Keluar Folder Pemasangan**CRITICAL:** Folder pemasangan mesti dialih keluar selepas pemasangan!
```
bash
# Option 1: Delete completely
rm -rf /var/www/html/XOOPS/install/

# Option 2: Rename and keep for reference
mv /var/www/html/XOOPS/install/ /var/www/html/XOOPS/install.bak/

# Verify removal
ls -la /var/www/html/XOOPS/ | grep install
```
### Lindungi Direktori SensitifCipta fail .htaccess untuk menyekat akses web kepada folder sensitif:**Fail: /var/www/html/XOOPS/var/.htaccess**
```
apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```
**Fail: /var/www/html/XOOPS/templates_c/.htaccess**
```
apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```
**Fail: /var/www/html/XOOPS/cache/.htaccess**
```
apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```
### Lindungi Direktori Muat NaikCegah pelaksanaan skrip dalam muat naik:**Fail: /var/www/html/XOOPS/uploads/.htaccess**
```
apache
# Prevent script execution
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# Prevent directory listing
Options -Indexes

# Additional protection
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /XOOPS/uploads/

    # Block suspicious files
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```
## SSL/HTTPS KonfigurasiSulitkan semua trafik antara pengguna dan pelayan anda.### Dapatkan Sijil SSL**Pilihan 1: Sijil Percuma daripada Let's Encrypt**
```
bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```
**Pilihan 2: Sijil SSL Komersial**Hubungi pembekal atau pendaftar SSL:
1. Beli sijil SSL
2. Sahkan pemilikan domain
3. Pasang fail sijil pada pelayan
4. Konfigurasikan pelayan web### Konfigurasi SSL ApacheCipta hos maya HTTPS:**Fail: /etc/apache2/sites-available/XOOPS-ssl.conf**
```
apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/XOOPS

    # SSL Configuration
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    <Directory /var/www/html/XOOPS>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Restrict install folder
    <Directory /var/www/html/XOOPS/install>
        Deny from all
    </Directory>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```
Dayakan konfigurasi:
```
bash
# Enable SSL module
a2enmod ssl

# Enable site
a2ensite XOOPS-ssl

# Disable non-SSL site if exists
a2dissite 000-default

# Test configuration
apache2ctl configtest
# Should output: Syntax OK

# Restart Apache
systemctl restart apache2
```
### Konfigurasi SSL Nginx**Fail: /etc/nginx/sites-available/XOOPS**
```
nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/XOOPS;
    index index.php index.html;

    # SSL Certificate Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Modern SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS Header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # Restrict install folder
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    # PHP-FPM backend
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # URL rewriting
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Logging
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```
Dayakan konfigurasi:
```
bash
ln -s /etc/nginx/sites-available/XOOPS /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
### Sahkan Pemasangan HTTPS
```
bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```
### Auto-Perbaharui Sijil Mari Sulitkan
```
bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```
## Keselamatan Aplikasi Web### Lindungi Terhadap Suntikan SQLXOOPS menggunakan pertanyaan berparameter (selamat secara lalai), tetapi sentiasa:
```
php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```
### Pencegahan Skrip Tapak (XSS).Sentiasa bersihkan input pengguna:
```
php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```
### Pencegahan Pemalsuan Permintaan Merentas Tapak (CSRF).XOOPS termasuk perlindungan token CSRF. Sentiasa sertakan token:
```
html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```
### Lumpuhkan Perlaksanaan PHP dalam Folder Muat NaikHalang penyerang daripada memuat naik dan melaksanakan PHP:
```
bash
# Create .htaccess in uploads folder
cat > /var/www/html/XOOPS/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternative: Disable execution globally in uploads
chmod 444 /var/www/html/XOOPS/uploads/  # Read-only
```
### Pengepala KeselamatanKonfigurasikan pengepala keselamatan HTTP yang penting:
```
apache
# Strict-Transport-Security (HSTS)
# Forces HTTPS for 1 year
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# Prevents MIME type sniffing
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# Prevents clickjacking attacks
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# Browser XSS protection
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Controls referrer information
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# Controls resource loading
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```
## Keselamatan Panel Pentadbiran### Namakan semula Folder PentadbirLindungi folder pentadbir dengan menamakan semula:
```
bash
# Rename admin folder
mv /var/www/html/XOOPS/admin /var/www/html/XOOPS/myadmin123

# Update admin access URL
# Old: http://your-domain.com/XOOPS/admin/
# New: http://your-domain.com/XOOPS/myadmin123/
```
Konfigurasikan XOOPS untuk menggunakan folder yang dinamakan semula:Edit mainfile.php:
```
php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/XOOPS/myadmin123');
```
### Penyenaraian Putih IP untuk PentadbirHadkan akses pentadbir kepada IP tertentu:**Fail: /var/www/html/XOOPS/myadmin123/.htaccess**
```
apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```
Atau dengan Apache 2.2:
```
apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```
### Kelayakan Pentadbir yang TeguhKuatkuasakan kata laluan yang kukuh untuk pentadbir:1. Gunakan sekurang-kurangnya 16 aksara
2. Campurkan huruf besar, huruf kecil, nombor, simbol
3. Tukar kata laluan dengan kerap (setiap 90 hari)
4. Gunakan pengurus kata laluan
5. Dayakan pengesahan dua faktor jika tersedia### Pantau Aktiviti PentadbirDayakan pengelogan log masuk pentadbir:**Panel Pentadbiran > Sistem > Keutamaan > Tetapan Pengguna**
```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```
Semak log dengan kerap:
```
bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```
## Penyelenggaraan Berkala### Kemas kini XOOPS dan ModulPastikan XOOPS dan semua modul dikemas kini:
```
bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/XOOPS
# Download and install latest version
# Follow upgrade guide
```
### Pengimbasan Keselamatan Automatik
```
bash
#!/bin/bash
# Security audit script

# Check file permissions
echo "Checking file permissions..."
find /var/www/html/XOOPS -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Check for suspicious files
echo "Checking for suspicious files..."
find /var/www/html/XOOPS -type f -name "*.php" -newer /var/www/html/XOOPS/install/ 2>/dev/null

# Check database for suspicious activity
echo "Checking for failed login attempts..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```
### Sandaran BiasaAutomatikkan sandaran harian:
```
bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/XOOPS"
RETENTION=30  # Keep 30 days

# Backup database
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/XOOPS --exclude=cache --exclude=templates_c

# Remove old backups
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Backup completed at $(date)"
```
Jadualkan dengan cron:
```
bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/XOOPS-backup.sh >> /var/log/xoops_backup.log 2>&1
```
## Templat Senarai Semak KeselamatanGunakan templat ini untuk audit keselamatan biasa:
```
Weekly Security Checklist
========================

Date: ___________
Checked by: ___________

File System:
[ ] Permissions correct (644/755)
[ ] Install folder removed
[ ] No suspicious files
[ ] mainfile.php protected

Web Security:
[ ] HTTPS/SSL working
[ ] Security headers present
[ ] Admin panel restricted
[ ] File upload restrictions active
[ ] Login attempts logged

Application:
[ ] XOOPS version current
[ ] All modules updated
[ ] No error messages in logs
[ ] Database optimized
[ ] Cache cleared

Backups:
[ ] Database backed up
[ ] Files backed up
[ ] Backup tested
[ ] Offsite copy verified

Issues Found:
1. ___________
2. ___________
3. ___________

Actions Taken:
1. ___________
2. ___________
```
## Sumber Keselamatan- Keperluan Pelayan
- Konfigurasi Asas
- Pengoptimuman Prestasi
- OWASP Top 10: https://owasp.org/www-project-top-ten/---

**Tag:** #security #ssl #https #hardening #best-practices**Artikel Berkaitan:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Tetapan Sistem
- ../Installation/Upgrading-XOOPS