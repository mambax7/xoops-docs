---
title: "การกำหนดค่าความปลอดภัย"
description: "คู่มือการรักษาความปลอดภัยฉบับสมบูรณ์สำหรับ XOOPS รวมถึงสิทธิ์ของไฟล์ SSL/HTTPS ไดเรกทอรีที่ละเอียดอ่อน และแนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย"
---
# XOOPS การกำหนดค่าความปลอดภัย

คำแนะนำที่ครอบคลุมเพื่อรักษาความปลอดภัยการติดตั้ง XOOPS จากช่องโหว่บนเว็บทั่วไป

## รายการตรวจสอบความปลอดภัย

ก่อนเปิดตัวไซต์ของคุณ ให้ใช้มาตรการรักษาความปลอดภัยเหล่านี้:

- [ ] ตั้งค่าการอนุญาตไฟล์อย่างถูกต้อง (644/755)
- [ ] ติดตั้งโฟลเดอร์ที่ถูกลบหรือป้องกัน
- [ ] mainfile.php ได้รับการปกป้องจากการดัดแปลง
- [ ] SSL/HTTPS เปิดใช้งานในทุกหน้า
- [ ] โฟลเดอร์ผู้ดูแลระบบเปลี่ยนชื่อหรือป้องกัน
- [ ] ไฟล์ละเอียดอ่อนไม่สามารถเข้าถึงเว็บได้
- [ ] มีข้อจำกัด .htaccess
- [ ] การสำรองข้อมูลปกติโดยอัตโนมัติ
- [ ] ส่วนหัวการรักษาความปลอดภัยได้รับการกำหนดค่าแล้ว
- [ ] CSRF เปิดใช้งานการป้องกันแล้ว
- [ ] SQL การป้องกันการฉีดทำงานอยู่
- [ ] อัปเดตโมดูล/ส่วนขยายแล้ว

## ความปลอดภัยของระบบไฟล์

### สิทธิ์ของไฟล์

การอนุญาตไฟล์ที่เหมาะสมมีความสำคัญอย่างยิ่งต่อความปลอดภัย

#### แนวทางการอนุญาต

| เส้นทาง | สิทธิ์ | เจ้าของ | เหตุผล |
|---|---|---|---|
| mainfile.php | 644 | ราก | มีข้อมูลประจำตัว DB |
| *.php ไฟล์ | 644 | ราก | ป้องกันการดัดแปลงโดยไม่ได้รับอนุญาต |
| ไดเรกทอรี | 755 | ราก | อนุญาตให้อ่านป้องกันการเขียน |
| แคช/ | 777 | www-ข้อมูล | เว็บเซิร์ฟเวอร์จะต้องเขียน |
| templates_c/ | 777 | www-ข้อมูล | เทมเพลตที่เรียบเรียง |
| อัพโหลด/ | 777 | www-ข้อมูล | การอัพโหลดของผู้ใช้ |
| var/ | 777 | www-ข้อมูล | ข้อมูลตัวแปร |
| ติดตั้ง/ | ลบ | - | ลบหลังการติดตั้ง |
| กำหนดค่า/ | 755 | ราก | อ่านได้ เขียนไม่ได้ |

#### การตั้งค่าสคริปต์การอนุญาต
```bash
#!/bin/bash
# File: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
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
เรียกใช้สคริปต์:
```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```
### ลบโฟลเดอร์การติดตั้ง

**CRITICAL:** โฟลเดอร์การติดตั้งจะต้องถูกลบออกหลังการติดตั้ง!
```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```
### ปกป้องไดเรกทอรีที่ละเอียดอ่อน

สร้างไฟล์ .htaccess เพื่อบล็อกการเข้าถึงเว็บไปยังโฟลเดอร์ที่ละเอียดอ่อน:

**ไฟล์: /var/www/html/xoops/var/.htaccess**
```
apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```
**ไฟล์: /var/www/html/xoops/templates_c/.htaccess**
```
apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```
**ไฟล์: /var/www/html/xoops/cache/.htaccess**
```
apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```
### ป้องกันไดเรกทอรีการอัปโหลด

ป้องกันการดำเนินการสคริปต์ในการอัปโหลด:

**ไฟล์: /var/www/html/xoops/uploads/.htaccess**
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
    RewriteBase /xoops/uploads/

    # Block suspicious files
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```
## SSL/HTTPS การกำหนดค่า

เข้ารหัสการรับส่งข้อมูลทั้งหมดระหว่างผู้ใช้และเซิร์ฟเวอร์ของคุณ

### รับใบรับรอง SSL

**ตัวเลือกที่ 1: ใบรับรองฟรีจาก Let's Encrypt**
```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```
**ตัวเลือกที่ 2: ใบรับรองเชิงพาณิชย์ SSL**

ติดต่อผู้ให้บริการหรือผู้รับจดทะเบียน SSL:
1. ซื้อใบรับรอง SSL
2. ตรวจสอบความเป็นเจ้าของโดเมน
3. ติดตั้งไฟล์ใบรับรองบนเซิร์ฟเวอร์
4. กำหนดค่าเว็บเซิร์ฟเวอร์

### การกำหนดค่า Apache SSL

สร้างโฮสต์เสมือน HTTPS:

**ไฟล์: /etc/apache2/sites-available/xoops-ssl.conf**
```
apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

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

    <Directory /var/www/html/xoops>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Restrict install folder
    <Directory /var/www/html/xoops/install>
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
เปิดใช้งานการกำหนดค่า:
```bash
# Enable SSL module
a2enmod ssl

# Enable site
a2ensite xoops-ssl

# Disable non-SSL site if exists
a2dissite 000-default

# Test configuration
apache2ctl configtest
# Should output: Syntax OK

# Restart Apache
systemctl restart apache2
```
### การกำหนดค่า Nginx SSL

**ไฟล์: /etc/nginx/sites-available/xoops**
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
    root /var/www/html/xoops;
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
เปิดใช้งานการกำหนดค่า:
```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
### ตรวจสอบการติดตั้ง HTTPS
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```
### ต่ออายุอัตโนมัติมาเข้ารหัสใบรับรองกันดีกว่า
```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```
## ความปลอดภัยของแอปพลิเคชันเว็บ

### ป้องกันการฉีด SQL

XOOPS ใช้การสืบค้นแบบกำหนดพารามิเตอร์ (ปลอดภัยโดยค่าเริ่มต้น) แต่เสมอ:
```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```
### การป้องกันการเขียนสคริปต์ข้ามไซต์ (XSS)

ฆ่าเชื้ออินพุตของผู้ใช้เสมอ:
```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```
### การป้องกันการปลอมแปลงคำขอข้ามไซต์ (CSRF)

XOOPS มีการป้องกันโทเค็น CSRF รวมโทเค็นเสมอ:
```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```
### ปิดการใช้งาน PHP การดำเนินการในโฟลเดอร์อัปโหลด

ป้องกันไม่ให้ผู้โจมตีอัปโหลดและดำเนินการ PHP:
```bash
# Create .htaccess in uploads folder
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternative: Disable execution globally in uploads
chmod 444 /var/www/html/xoops/uploads/  # Read-only
```
### ส่วนหัวการรักษาความปลอดภัย

กำหนดค่าส่วนหัวความปลอดภัย HTTP ที่สำคัญ:
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
## ความปลอดภัยของแผงผู้ดูแลระบบ

### เปลี่ยนชื่อโฟลเดอร์ผู้ดูแลระบบ

ป้องกันโฟลเดอร์ผู้ดูแลระบบโดยเปลี่ยนชื่อ:
```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```
กำหนดค่า XOOPS เพื่อใช้โฟลเดอร์ที่เปลี่ยนชื่อ:

แก้ไข mainfile.php:
```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```
### IP ไวท์ลิสต์สำหรับผู้ดูแลระบบ

จำกัดการเข้าถึงของผู้ดูแลระบบสำหรับ IP ที่เฉพาะเจาะจง:

**ไฟล์: /var/www/html/xoops/myadmin123/.htaccess**
```
apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```
หรือด้วย Apache 2.2:
```
apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```
### ข้อมูลรับรองผู้ดูแลระบบที่แข็งแกร่ง

บังคับใช้รหัสผ่านที่รัดกุมสำหรับผู้ดูแลระบบ:

1. ใช้อักขระอย่างน้อย 16 ตัว
2. ผสมตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข สัญลักษณ์
3. เปลี่ยนรหัสผ่านสม่ำเสมอ (ทุก 90 วัน)
4. ใช้ตัวจัดการรหัสผ่าน
5. เปิดใช้งานการรับรองความถูกต้องด้วยสองปัจจัย หากมี

### ตรวจสอบกิจกรรมของผู้ดูแลระบบ

เปิดใช้งานการบันทึกการเข้าสู่ระบบของผู้ดูแลระบบ:

**แผงผู้ดูแลระบบ > ระบบ > การตั้งค่า > การตั้งค่าผู้ใช้**
```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```
ตรวจสอบบันทึกอย่างสม่ำเสมอ:
```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```
## การบำรุงรักษาตามปกติ

### อัปเดต XOOPS และโมดูล

อัปเดต XOOPS และโมดูลทั้งหมดอยู่เสมอ:
```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```
### การสแกนความปลอดภัยอัตโนมัติ
```bash
#!/bin/bash
# Security audit script

# Check file permissions
echo "Checking file permissions..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Check for suspicious files
echo "Checking for suspicious files..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# Check database for suspicious activity
echo "Checking for failed login attempts..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```
### การสำรองข้อมูลปกติ

สำรองข้อมูลรายวันอัตโนมัติ:
```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/xoops"
RETENTION=30  # Keep 30 days

# Backup database
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# Remove old backups
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Backup completed at $(date)"
```
กำหนดเวลาด้วย cron:
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```
## เทมเพลตรายการตรวจสอบความปลอดภัย

ใช้เทมเพลตนี้สำหรับการตรวจสอบความปลอดภัยเป็นประจำ:
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
## แหล่งข้อมูลด้านความปลอดภัย

- ข้อกำหนดของเซิร์ฟเวอร์
- การกำหนดค่าพื้นฐาน
- การเพิ่มประสิทธิภาพการทำงาน
- OWASP 10 อันดับแรก: https://owasp.org/www-project-top-ten/

---

**Tags:** #ความปลอดภัย #ssl #https #hardening #best-practices

**บทความที่เกี่ยวข้อง:**
- ../การติดตั้ง/การติดตั้ง
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- ระบบ-การตั้งค่า
- ../การติดตั้ง/การอัพเกรด-XOOPS