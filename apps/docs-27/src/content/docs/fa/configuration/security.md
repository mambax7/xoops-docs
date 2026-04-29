---
title: "پیکربندی امنیتی"
description: "راهنمای کامل سخت‌سازی امنیتی برای XOOPS از جمله مجوزهای فایل، SSL/HTTPS، دایرکتوری‌های حساس و بهترین شیوه‌های امنیتی"
---
# پیکربندی امنیتی XOOPS

راهنمای جامع برای ایمن سازی نصب XOOPS در برابر آسیب پذیری های رایج وب.

## چک لیست امنیتی

قبل از راه اندازی سایت خود، این اقدامات امنیتی را اجرا کنید:

- [ ] مجوزهای فایل به درستی تنظیم شده است (644/755)
- [ ] نصب پوشه حذف یا محافظت شده است
- [ ] mainfile.php از تغییر محافظت می شود
- [ ] SSL/HTTPS در همه صفحات فعال است
- [ ] پوشه مدیریت تغییر نام داد یا محافظت شد
- [ ] فایل های حساس در وب قابل دسترسی نیستند
- [ ] محدودیت های htaccess وجود دارد
- [ ] پشتیبان گیری منظم خودکار
- [ ] سرصفحه های امنیتی پیکربندی شدند
- [ ] حفاظت CSRF فعال است
- [ ] حفاظت های تزریق SQL فعال است
- [ ] Modules/extensions به روز شد

## امنیت سیستم فایل

### مجوزهای فایل

مجوزهای فایل مناسب برای امنیت بسیار مهم هستند.

#### دستورالعمل های مجوز

| مسیر | مجوزها | مالک | دلیل |
|---|---|---|---|
| mainfile.php | 644 | ریشه | حاوی اعتبارنامه DB |
| *.php files | 644 | ریشه | جلوگیری از اصلاح غیر مجاز |
| دایرکتوری ها | 755 | ریشه | اجازه خواندن، جلوگیری از نوشتن |
| کش/ | 777 | www-data | وب سرور باید بنویسد |
| templates_c/ | 777 | www-data | قالب های کامپایل شده |
| آپلودها/ | 777 | www-data | بارگذاری کاربران |
| var/ | 777 | www-data | داده های متغیر |
| نصب/ | حذف | - | حذف پس از نصب |
| تنظیمات/ | 755 | ریشه | خواندنی، غیرقابل نوشتن |

#### تنظیم اسکریپت مجوزها

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

اسکریپت را اجرا کنید:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### پوشه نصب را حذف کنید

** مهم:** پوشه نصب باید پس از نصب حذف شود!

```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```

### از دایرکتوری های حساس محافظت کنید

برای مسدود کردن دسترسی وب به پوشه های حساس، فایل های .htaccess ایجاد کنید:

**فایل: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**فایل: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**فایل: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### از دایرکتوری آپلود محافظت کنید

جلوگیری از اجرای اسکریپت ها در آپلود:

**فایل: /var/www/html/xoops/uploads/.htaccess**

```apache
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

## پیکربندی SSL/HTTPS

تمام ترافیک بین کاربران و سرور خود را رمزگذاری کنید.

### گواهی SSL را دریافت کنید

**گزینه 1: گواهی رایگان از Let's Encrypt**

```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```

**گزینه 2: گواهینامه تجاری SSL**

با ارائه دهنده یا ثبت کننده SSL تماس بگیرید:
1. گواهی SSL را خریداری کنید
2. مالکیت دامنه را تأیید کنید
3. فایل های گواهی را روی سرور نصب کنید
4. وب سرور را پیکربندی کنید

### پیکربندی Apache SSL

ایجاد میزبان مجازی HTTPS:

**فایل: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
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

تنظیمات را فعال کنید:

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

### پیکربندی Nginx SSL

**فایل: /etc/nginx/sites-available/xoops**

```nginx
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

تنظیمات را فعال کنید:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### نصب HTTPS را تأیید کنید

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### تمدید خودکار اجازه دهید گواهی را رمزگذاری کنیم

```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```

## امنیت برنامه های وب

### محافظت در برابر تزریق SQL

XOOPS از پرس و جوهای پارامتری (به طور پیش فرض ایمن) استفاده می کند، اما همیشه:

```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### پیشگیری از اسکریپت بین سایتی (XSS).

ورودی کاربر را همیشه پاکسازی کنید:

```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### پیشگیری از جعل درخواست بین سایتی (CSRF).

XOOPS شامل حفاظت توکن CSRF است. همیشه توکن‌ها را شامل شود:

```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### اجرای PHP را در پوشه آپلود غیرفعال کنید

جلوگیری از آپلود و اجرای PHP توسط مهاجمان:

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

### سرصفحه های امنیتی

هدرهای امنیتی مهم HTTP را پیکربندی کنید:

```apache
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

## امنیت پنل مدیریت

### تغییر نام پوشه مدیریت

با تغییر نام از پوشه مدیریت محافظت کنید:

```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```

XOOPS را برای استفاده از پوشه تغییر نام داده پیکربندی کنید:

ویرایش mainfile.php:

```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### لیست سفید IP برای Admin

محدود کردن دسترسی ادمین به IP های خاص:

**فایل: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```

یا با آپاچی 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### اعتبار ادمین قوی

گذرواژه‌های قوی را برای مدیران اجرا کنید:1. حداقل از 16 کاراکتر استفاده کنید
2. حروف بزرگ، کوچک، اعداد، نمادها را مخلوط کنید
3. رمز عبور را به طور منظم تغییر دهید (هر 90 روز)
4. از یک مدیر رمز عبور استفاده کنید
5. در صورت وجود، احراز هویت دو مرحله ای را فعال کنید

### نظارت بر فعالیت مدیر

فعال کردن ورود به سیستم مدیریت:

**پنل مدیریت > سیستم > تنظیمات برگزیده > تنظیمات کاربر**

```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```

گزارش ها را به طور منظم مرور کنید:

```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## تعمیر و نگهداری منظم

### XOOPS و ماژول ها را به روز کنید

XOOPS و همه ماژول ها را به روز نگه دارید:

```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```

### اسکن امنیتی خودکار

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

### پشتیبان گیری منظم

پشتیبان گیری روزانه را خودکار کنید:

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

برنامه ریزی با cron:

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## الگوی چک لیست امنیتی

از این الگو برای ممیزی های امنیتی منظم استفاده کنید:

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

## منابع امنیتی

- مورد نیاز سرور
- پیکربندی اولیه
- بهینه سازی عملکرد
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**برچسب ها:** #امنیت #ssl #https #سخت شدن #بهترین شیوه ها

**مقالات مرتبط:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- تنظیمات سیستم
- ../Installation/Upgrading-XOOPS