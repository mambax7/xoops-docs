---
title: "תצורת אבטחה"
description: "מדריך מלא להקשחת אבטחה עבור XOOPS כולל הרשאות קבצים, SSL/HTTPS, ספריות רגישות ושיטות אבטחה מומלצות"
---
# XOOPS תצורת אבטחה

מדריך מקיף לאבטחת התקנת XOOPS שלך מפני פרצות אינטרנט נפוצות.

## רשימת אבטחה

לפני השקת האתר שלך, יישם את אמצעי האבטחה הבאים:

- [ ] הרשאות הקובץ מוגדרות כהלכה (644/755)
- [ ] תיקיית ההתקנה הוסרה או מוגנת
- [ ] mainfile.php מוגן מפני שינויים
- [ ] SSL/HTTPS מופעל בכל הדפים
- [ ] שם תיקיית הניהול שונה או מוגנת
- [ ] קבצים רגישים אינם נגישים לאינטרנט
- [ ] הגבלות .htaccess קיימות
- [ ] גיבויים רגילים אוטומטיים
- [ ] כותרות אבטחה מוגדרות
- [ ] הגנה CSRF מופעלת
- [ ] SQL הגנות הזרקה פעילות
- [ ] Modules/extensions עודכן

## אבטחת מערכת הקבצים

### הרשאות קובץ

הרשאות קבצים נכונות הן קריטיות לאבטחה.

#### הנחיות הרשאה

| נתיב | הרשאות | בעלים | סיבה |
|---|---|---|---|
| mainfile.php | 644 | שורש | מכיל אישורי DB |
| * קבצי php | 644 | שורש | מנע שינוי לא מורשה |
| מדריכים | 755 | שורש | אפשר קריאה, מנע כתיבה |
| cache/ | 777 | www-data | שרת האינטרנט חייב לכתוב |
| templates_c/ | 777 | www-data | תבניות מלוקטות |
| העלאות/ | 777 | www-data | העלאות משתמשים |
| var/ | 777 | www-data | נתונים משתנים |
| התקן/ | הסר | - | מחק לאחר ההתקנה |
| configs/ | 755 | שורש | קריא, לא ניתן לכתיבה |

#### סקריפט הגדרת הרשאות
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
הפעל את הסקריפט:
```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```
### הסר את תיקיית ההתקנה

**CRITICAL:** יש להסיר את תיקיית ההתקנה לאחר ההתקנה!
```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```
### הגן על ספריות רגישות

צור קובצי Htaccess כדי לחסום גישה לאינטרנט לתיקיות רגישות:

**קובץ: /var/www/html/xoops/var/.htaccess**
```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```
**קובץ: /var/www/html/xoops/templates_c/.htaccess**
```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```
**קובץ: /var/www/html/xoops/cache/.htaccess**
```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```
### הגן על ספריית העלאות

מנע ביצוע של סקריפטים בהעלאות:

**קובץ: /var/www/html/xoops/uploads/.htaccess**
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
## SSL/HTTPS תצורה

הצפין את כל התעבורה בין המשתמשים לשרת שלך.

### השג SSL תעודה

**אפשרות 1: אישור חינם מ-Let's Encrypt**
```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```
**אפשרות 2: אישור מסחרי SSL**

פנה לספק או לרשם SSL:
1. רכישת תעודת SSL
2. אמת את הבעלות על הדומיין
3. התקן קבצי אישור בשרת
4. הגדר את שרת האינטרנט

### Apache SSL תצורה

צור HTTPS מארח וירטואלי:

**קובץ: /etc/apache2/sites-available/xoops-ssl.conf**
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
אפשר את התצורה:
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
### Nginx SSL תצורה

**קובץ: /etc/nginx/sites-available/xoops**
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
אפשר את התצורה:
```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
### ודא HTTPS התקנה
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```
### חידוש אוטומטי בואו נצפין אישור
```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```
## אבטחת יישומי אינטרנט

### הגן מפני SQL הזרקה

XOOPS משתמש בשאילתות עם פרמטרים (בטוחים כברירת מחדל), אבל תמיד:
```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```
### מניעת סקריפטים בין אתרים (XSS).

חיטא תמיד את קלט המשתמש:
```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```
### זיוף בקשות חוצות אתרים (CSRF) מניעה

XOOPS כולל הגנת אסימון CSRF. כלול תמיד אסימונים:
```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```
### השבת PHP ביצוע בתיקיית העלאה

מנע מתוקפים להעלות ולהפעיל PHP:
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
### כותרות אבטחה

הגדר כותרות אבטחה חשובות HTTP:
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
## אבטחת לוח הניהול

### שנה את שם תיקיית הניהול

הגן על תיקיית הניהול על ידי שינוי שמה:
```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```
הגדר את XOOPS לשימוש בתיקייה ששמה שונה:

ערוך mainfile.php:
```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```
### רישום הלבנה של IP עבור מנהל מערכת

הגבל גישת מנהל לכתובות IP ספציפיות:

**קובץ: /var/www/html/xoops/myadmin123/.htaccess**
```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```
או עם Apache 2.2:
```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```
### אישורי מנהל חזקים

לאכוף סיסמאות חזקות עבור מנהלי מערכת:

1. השתמש ב-16 תווים לפחות
2. מערבבים אותיות רישיות, קטנות, מספרים, סמלים
3. שנה סיסמה באופן קבוע (כל 90 יום)
4. השתמש במנהל סיסמאות
5. אפשר אימות דו-גורמי אם זמין

### עקוב אחר פעילות הניהול

אפשר רישום התחברות של מנהל מערכת:

**לוח ניהול > מערכת > העדפות > הגדרות משתמש**
```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```
סקור יומנים באופן קבוע:
```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```
## תחזוקה שוטפת

### עדכן XOOPS ומודולים

שמור את XOOPS ואת כל המודולים מעודכנים:
```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```
### סריקת אבטחה אוטומטית
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
### גיבויים רגילים

הפוך גיבויים יומיים לאוטומטיים:
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
לוח זמנים עם cron:
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```
## תבנית רשימת אבטחה

השתמש בתבנית זו עבור ביקורות אבטחה רגילות:
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
## משאבי אבטחה

- דרישות שרת
- תצורה בסיסית
- מיטוב ביצועים
- OWASP 10 המובילים: https://owasp.org/www-project-top-ten/

---

**תגים:** #בטחון #ssl #https #הקשחה #שיטות עבודה מומלצות

**מאמרים קשורים:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- הגדרות מערכת
- ../Installation/Upgrading-XOOPS