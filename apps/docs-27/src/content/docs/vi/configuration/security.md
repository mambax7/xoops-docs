---
title: "Cấu hình bảo mật"
description: "Hướng dẫn tăng cường bảo mật hoàn chỉnh cho XOOPS bao gồm quyền truy cập tệp, SSL/HTTPS, thư mục nhạy cảm và các phương pháp bảo mật tốt nhất"
---
# Cấu hình bảo mật XOOPS

Hướng dẫn toàn diện để bảo mật cài đặt XOOPS của bạn trước các lỗ hổng web phổ biến.

## Danh sách kiểm tra bảo mật

Trước khi khởi chạy trang web của bạn, hãy thực hiện các biện pháp bảo mật sau:

- [ ] Quyền của tệp được đặt chính xác (644/755)
- [] Thư mục cài đặt bị xóa hoặc được bảo vệ
- [ ] mainfile.php được bảo vệ khỏi sửa đổi
- [ ] Đã bật SSL/HTTPS trên tất cả các trang
- [] Thư mục quản trị được đổi tên hoặc bảo vệ
- [] Các tập tin nhạy cảm không thể truy cập được trên web
- [ ] .htaccess hạn chế tại chỗ
- [] Sao lưu thường xuyên tự động
- [] Tiêu đề bảo mật được định cấu hình
- [] Đã bật tính năng bảo vệ CSRF
- [ ] Bảo vệ tiêm SQL đang hoạt động
- [] Đã cập nhật mô-đun/tiện ích mở rộng

## Bảo mật hệ thống tệp

### Quyền đối với tệp

Quyền truy cập tệp thích hợp là rất quan trọng để bảo mật.

#### Nguyên tắc cấp phép

| Đường dẫn | Quyền | Chủ sở hữu | Lý do |
|---|---|---|---|
| mainfile.php | 644 | gốc | Chứa thông tin xác thực DB |
| *.php files | 644 | root | Prevent unauthorized modification |
| Thư mục | 755 | gốc | Cho phép đọc, cấm viết |
| bộ đệm/ | 777 | dữ liệu www | Máy chủ web phải viết |
| templates_c/ | 777 | dữ liệu www | Đã biên soạn templates |
| uploads/ | 777 | dữ liệu www | Người dùng uploads |
| var/ | 777 | dữ liệu www | Dữ liệu biến đổi |
| cài đặt/ | Xóa | - | Xóa sau khi cài đặt |
| cấu hình/ | 755 | gốc | Có thể đọc được, không thể ghi được |

#### Tập lệnh thiết lập quyền

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

Chạy tập lệnh:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### Xóa thư mục cài đặt

** QUAN TRỌNG: ** Thư mục cài đặt phải được xóa sau khi cài đặt!

```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```

### Bảo vệ các thư mục nhạy cảm

Tạo tệp .htaccess để chặn truy cập web vào các thư mục nhạy cảm:

**Tệp: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**Tệp: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**Tệp: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### Bảo vệ thư mục tải lên

Ngăn chặn việc thực thi các tập lệnh trong uploads:

**Tệp: /var/www/html/xoops/uploads/.htaccess**

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

## Cấu hình SSL/HTTPS

Mã hóa tất cả lưu lượng truy cập giữa người dùng và máy chủ của bạn.

### Lấy chứng chỉ SSL

**Tùy chọn 1: Chứng chỉ miễn phí từ Let's Encrypt**

```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```

**Tùy chọn 2: Chứng chỉ SSL thương mại**

Liên hệ với nhà cung cấp hoặc nhà đăng ký SSL:
1. Mua chứng chỉ SSL
2. Xác minh quyền sở hữu tên miền
3. Cài đặt file chứng chỉ trên máy chủ
4. Cấu hình máy chủ web

### Cấu hình SSL Apache

Tạo máy chủ ảo HTTPS:

**Tệp: /etc/apache2/sites-available/xoops-ssl.conf**

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

Kích hoạt cấu hình:

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

### Cấu hình SSL Nginx

**Tệp: /etc/nginx/sites-available/xoops**

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

Kích hoạt cấu hình:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Xác minh cài đặt HTTPS

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Tự động gia hạn chứng chỉ Let's Encrypt

```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```

## Bảo mật ứng dụng web

### Bảo vệ khỏi việc tiêm SQL

XOOPS sử dụng các truy vấn được tham số hóa (an toàn theo mặc định), nhưng luôn:

```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### Ngăn chặn tập lệnh chéo trang (XSS)

Luôn vệ sinh đầu vào của người dùng:

```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### Ngăn chặn giả mạo yêu cầu trên nhiều trang web (CSRF)

Bảo vệ mã thông báo XOOPS includes CSRF. Luôn là mã thông báo include:

```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```### Tắt thực thi PHP trong thư mục tải lên

Ngăn chặn kẻ tấn công tải lên và thực thi PHP:

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

### Tiêu đề bảo mật

Định cấu hình các tiêu đề bảo mật HTTP quan trọng:

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

## Bảo mật bảng quản trị

### Đổi tên thư mục quản trị

Bảo vệ thư mục admin bằng cách đổi tên nó:

```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```

Định cấu hình XOOPS để sử dụng thư mục đã đổi tên:

Chỉnh sửa mainfile.php:

```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### Danh sách trắng IP dành cho quản trị viên

Hạn chế quyền truy cập admin vào các IP cụ thể:

**Tệp: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```

Hoặc với Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### Thông tin xác thực quản trị viên mạnh

Thực thi mật khẩu mạnh cho administrators:

1. Sử dụng ít nhất 16 ký tự
2. Trộn chữ hoa, chữ thường, số, ký hiệu
3. Thay đổi mật khẩu thường xuyên (90 ngày một lần)
4. Sử dụng trình quản lý mật khẩu
5. Kích hoạt xác thực hai yếu tố nếu có

### Giám sát hoạt động của quản trị viên

Kích hoạt tính năng ghi nhật ký đăng nhập admin:

**Bảng quản trị > Hệ thống > Tùy chọn > Cài đặt người dùng**

```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```

Xem lại nhật ký thường xuyên:

```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Bảo trì thường xuyên

### Cập nhật XOOPS và các Mô-đun

Luôn cập nhật XOOPS và tất cả modules:

```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```

### Quét bảo mật tự động

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

### Sao lưu thường xuyên

Tự động sao lưu hàng ngày:

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

Lên lịch với cron:

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Mẫu danh sách kiểm tra bảo mật

Sử dụng mẫu này để kiểm tra bảo mật thường xuyên:

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

## Tài nguyên bảo mật

- Yêu cầu máy chủ
- Cấu hình cơ bản
- Tối ưu hóa hiệu suất
- Top 10 OWASP: https://owasp.org/www-project-top-ten/

---

**Tags:** #security #ssl #https #hardening #best-practices

**Bài viết liên quan:**
- ../Cài đặt/Cài đặt
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Cài đặt hệ thống
- ../Cài đặt/Nâng cấp-XOOPS