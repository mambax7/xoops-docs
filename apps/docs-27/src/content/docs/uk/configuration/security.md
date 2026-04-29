---
title: "Конфігурація безпеки"
description: "Повний посібник із посилення безпеки для XOOPS, включаючи дозволи на файли, SSL/HTTPS, конфіденційні каталоги та найкращі методи безпеки"
---
# XOOPS Конфігурація безпеки

Вичерпний посібник із захисту інсталяції XOOPS від поширених уразливостей у мережі.

## Контрольний список безпеки

Перш ніж запускати свій сайт, застосуйте такі заходи безпеки:

- [ ] Дозволи файлу встановлено правильно (644/755)
- [] Інсталяційна папка видалена або захищена
- [ ] mainfile.php захищено від модифікації
- [ ] SSL/HTTPS увімкнено на всіх сторінках
- [ ] Admin folder renamed or protected
- [ ] Конфіденційні файли недоступні в Інтернеті
- [ ] .htaccess обмеження на місці
- [ ] Regular backups automated
- [ ] Налаштовано заголовки безпеки
- [ ] CSRF захист увімкнено
- [ ] SQL Захист ін'єкції активний
- [ ] Modules/extensions оновлено

## Безпека файлової системи

### Права доступу до файлу

Належні дозволи на файли мають вирішальне значення для безпеки.

#### Рекомендації щодо дозволів

| Шлях | Дозволи | Власник | Причина |
|---|---|---|---|
| основний файл.php | 644 | корінь | Містить облікові дані БД |
| Файли *.php | 644 | корінь | Запобігання неавторизованій модифікації |
| Directories | 755 | корінь | Дозволити читання, заборонити запис |
| кеш/ | 777 | www-дані | Веб-сервер повинен писати |
| templates_c/ | 777 | www-дані | Складені шаблони |
| завантаження/ | 777 | www-дані | Завантаження користувачів |
| змінна/ | 777 | www-дані | Змінні дані |
| встановити/ | Видалити | - | Видалити після встановлення |
| конфігурації/ | 755 | корінь | Читається, не записується |

#### Налаштування сценарію дозволів
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
Запустіть сценарій:
```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```
### Видалити папку встановлення

**КРИТИЧНО:** папку встановлення потрібно видалити після встановлення!
```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```
### Захист конфіденційних каталогів

Створіть файли .htaccess, щоб заблокувати веб-доступ до конфіденційних папок:

**Файл: /var/www/html/xoops/var/.htaccess**
```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```
**Файл: /var/www/html/xoops/templates_c/.htaccess**
```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```
**Файл: /var/www/html/xoops/cache/.htaccess**
```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```
### Захистіть каталог завантажень

Заборонити виконання сценаріїв у завантаженнях:

**Файл: /var/www/html/xoops/uploads/.htaccess**
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
## Конфігурація SSL/HTTPS

Шифруйте весь трафік між користувачами та вашим сервером.

### Отримайте сертифікат SSL

**Варіант 1: безкоштовний сертифікат від Let's Encrypt**
```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```
**Варіант 2: комерційний SSL-сертифікат**

Зверніться до постачальника або реєстратора SSL:
1. Придбайте сертифікат SSL
2. Підтвердьте право власності на домен
3. Встановіть файли сертифікатів на сервер
4. Налаштувати веб-сервер

### Apache Конфігурація SSL

Створіть віртуальний хост HTTPS:

**Файл: /etc/apache2/sites-available/xoops-ssl.conf**
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
Увімкніть конфігурацію:
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
### Nginx Конфігурація SSL

**Файл: /etc/nginx/sites-available/xoops**
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
Увімкніть конфігурацію:
```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
### Перевірте встановлення HTTPS
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```
### Автоматичне оновлення сертифіката Let's Encrypt
```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```
## Безпека веб-додатків

### Захист від ін'єкції SQL

XOOPS використовує параметризовані запити (безпечні за замовчуванням), але завжди:
```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```
### Запобігання міжсайтовому сценарію (XSS).

Завжди очищайте дані користувача:
```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```
### Запобігання підробці міжсайтового запиту (CSRF)

XOOPS містить захист токенів CSRF. Завжди включайте маркери:
```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```
### Вимкнути виконання PHP у папці завантаження

Запобігайте зловмисникам завантажувати та виконувати PHP:
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
### Заголовки безпеки

Налаштуйте важливі заголовки безпеки HTTP:
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
## Безпека панелі адміністратора

### Перейменувати папку адміністратора

Захистіть папку адміністратора, перейменувавши її:
```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```
Налаштуйте XOOPS на використання перейменованої папки:

Відредагуйте mainfile.php:
```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```
### Білий список IP для адміністратора

Обмежити доступ адміністратора до певних IP-адрес:

**Файл: /var/www/html/xoops/myadmin123/.htaccess**
```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```
Або з Apache 2.2:
```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```
### Надійні облікові дані адміністратора

Застосуйте надійні паролі для адміністраторів:

1. Використовуйте щонайменше 16 символів
2. Змішайте великі, малі літери, цифри, символи
3. Регулярно змінюйте пароль (кожні 90 днів)
4. Використовуйте менеджер паролів
5. Увімкніть двофакторну автентифікацію, якщо вона доступна

### Відстежуйте діяльність адміністратора

Увімкнути журнал входу адміністратора:

**Панель адміністратора > Система > Параметри > Параметри користувача**
```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```
Регулярно переглядайте журнали:
```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```
## Регулярне технічне обслуговування

### Оновити XOOPS і модулі

Оновлюйте XOOPS і всі модулі:
```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```
### Автоматичне сканування безпеки
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
### Регулярне резервне копіювання

Автоматизуйте щоденне резервне копіювання:
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
Розклад із cron:
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```
## Шаблон контрольного списку безпеки

Використовуйте цей шаблон для регулярних перевірок безпеки:
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
## Ресурси безпеки

- Вимоги до сервера
- Базова конфігурація
- Оптимізація продуктивності
- Топ-10 OWASP: https://owasp.org/www-project-top-ten/

---

**Теги:** #безпека #ssl #https #зміцнення #найкращі практики

**Пов’язані статті:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Параметри системи
- ../Installation/Upgrading-XOOPS