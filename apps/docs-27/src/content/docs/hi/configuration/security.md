---
title: "सुरक्षा विन्यास"
description: "फ़ाइल अनुमतियाँ, SSL/HTTPS, संवेदनशील निर्देशिकाएँ और सुरक्षा सर्वोत्तम प्रथाओं सहित XOOPS के लिए पूर्ण सुरक्षा सख्त मार्गदर्शिका"
---
# XOOPS सुरक्षा कॉन्फ़िगरेशन

आपके XOOPS इंस्टॉलेशन को सामान्य वेब कमजोरियों से सुरक्षित करने के लिए व्यापक मार्गदर्शिका।

## सुरक्षा जाँच सूची

अपनी साइट लॉन्च करने से पहले, इन सुरक्षा उपायों को लागू करें:

- [ ] फ़ाइल अनुमतियाँ सही ढंग से सेट की गईं (644/755)
- [ ] इंस्टॉल किया गया फ़ोल्डर हटा दिया गया है या सुरक्षित कर दिया गया है
- [ ] mainfile.php संशोधन से सुरक्षित
- [ ] सभी पेजों पर SSL/HTTPS सक्षम
- [ ] व्यवस्थापक फ़ोल्डर का नाम बदला गया या संरक्षित किया गया
- [ ] संवेदनशील फ़ाइलें वेब-सुलभ नहीं हैं
- [ ] .htaccess प्रतिबंध लागू
- [ ] नियमित बैकअप स्वचालित
- [ ] सुरक्षा हेडर कॉन्फ़िगर किया गया
- [ ] CSRF सुरक्षा सक्षम
- [ ] SQL इंजेक्शन सुरक्षा सक्रिय
- [ ] मॉड्यूल/एक्सटेंशन अपडेट किए गए

## फ़ाइल सिस्टम सुरक्षा

### फ़ाइल अनुमतियाँ

सुरक्षा के लिए उचित फ़ाइल अनुमतियाँ महत्वपूर्ण हैं।

#### अनुमति दिशानिर्देश

| पथ | अनुमतियाँ | मालिक | कारण |
|---|---|---|---|
| मेनफ़ाइल.php | 644 | जड़ | डीबी क्रेडेंशियल्स शामिल हैं |
| *.php फ़ाइलें | 644 | जड़ | अनधिकृत संशोधन रोकें |
| निर्देशिकाएँ | 755 | जड़ | पढ़ने की अनुमति दें, लिखने से रोकें |
| कैश/ | 777 | www-डेटा | वेब सर्वर को लिखना होगा |
| टेम्पलेट्स_सी/ | 777 | www-डेटा | संकलित टेम्पलेट्स |
| अपलोड/ | 777 | www-डेटा | उपयोगकर्ता अपलोड |
| वर/ | 777 | www-डेटा | परिवर्तनीय डेटा |
| इंस्टॉल/ | हटाओ | - | इंस्टालेशन के बाद डिलीट करें |
| कॉन्फ़िगरेशन/ | 755 | जड़ | पढ़ने योग्य, लिखने योग्य नहीं |

#### अनुमतियाँ स्क्रिप्ट सेट करना

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

स्क्रिप्ट चलाएँ:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### इंस्टालेशन फ़ोल्डर हटाएँ

**CRITICAL:** इंस्टालेशन के बाद इंस्टाल फोल्डर को हटा देना चाहिए!

```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```

### संवेदनशील निर्देशिकाओं को सुरक्षित रखें

संवेदनशील फ़ोल्डरों तक वेब पहुंच को अवरुद्ध करने के लिए .htaccess फ़ाइलें बनाएं:

**फ़ाइल: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**फ़ाइल: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**फ़ाइल: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### अपलोड निर्देशिका को सुरक्षित रखें

अपलोड में स्क्रिप्ट के निष्पादन को रोकें:

**फ़ाइल: /var/www/html/xoops/uploads/.htaccess**

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

## एसएसएल/HTTPS कॉन्फ़िगरेशन

उपयोगकर्ताओं और आपके सर्वर के बीच सभी ट्रैफ़िक को एन्क्रिप्ट करें।

### एसएसएल प्रमाणपत्र प्राप्त करें

**विकल्प 1: लेट्स एनक्रिप्ट की ओर से निःशुल्क प्रमाणपत्र**

```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```

**विकल्प 2: वाणिज्यिक एसएसएल प्रमाणपत्र**

एसएसएल प्रदाता या रजिस्ट्रार से संपर्क करें:
1. एसएसएल प्रमाणपत्र खरीदें
2. डोमेन स्वामित्व सत्यापित करें
3. सर्वर पर प्रमाणपत्र फ़ाइलें स्थापित करें
4. वेब सर्वर कॉन्फ़िगर करें

### अपाचे एसएसएल कॉन्फ़िगरेशन

HTTPS वर्चुअल होस्ट बनाएं:

**फ़ाइल: /etc/apache2/sites-available/xoops-ssl.conf**

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

कॉन्फ़िगरेशन सक्षम करें:

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

### Nginx SSL कॉन्फ़िगरेशन

**फ़ाइल: /etc/nginx/साइट्स-उपलब्ध/xoops**

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

कॉन्फ़िगरेशन सक्षम करें:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### सत्यापित करें HTTPS इंस्टालेशन

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### स्वतः नवीनीकरण आइए प्रमाणपत्र एन्क्रिप्ट करें

```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```

## वेब एप्लिकेशन सुरक्षा

### SQL इंजेक्शन से बचाव

XOOPS पैरामीटरयुक्त प्रश्नों का उपयोग करता है (डिफ़ॉल्ट रूप से सुरक्षित), लेकिन हमेशा:

```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### क्रॉस-साइट स्क्रिप्टिंग (XSS) रोकथाम

उपयोगकर्ता इनपुट को हमेशा स्वच्छ रखें:

```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### क्रॉस-साइट अनुरोध जालसाजी (CSRF) रोकथाम

XOOPS में CSRF टोकन सुरक्षा शामिल है। हमेशा टोकन शामिल करें:

```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### अपलोड फ़ोल्डर में PHP निष्पादन अक्षम करें

हमलावरों को PHP अपलोड करने और निष्पादित करने से रोकें:

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

### सुरक्षा शीर्षलेख

महत्वपूर्ण HTTP सुरक्षा शीर्षलेख कॉन्फ़िगर करें:

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

## एडमिन पैनल सुरक्षा

### एडमिन फ़ोल्डर का नाम बदलें

व्यवस्थापक फ़ोल्डर का नाम बदलकर उसे सुरक्षित रखें:

```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```

पुनर्नामित फ़ोल्डर का उपयोग करने के लिए XOOPS कॉन्फ़िगर करें:

Mainfile.php संपादित करें:

```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### एडमिन के लिए आईपी व्हाइटलिस्टिंगविशिष्ट आईपी तक व्यवस्थापक पहुंच प्रतिबंधित करें:

**फ़ाइल: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```

या अपाचे 2.2 के साथ:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### मजबूत व्यवस्थापक साख

प्रशासकों के लिए मजबूत पासवर्ड लागू करें:

1. कम से कम 16 अक्षरों का प्रयोग करें
2. अपरकेस, लोअरकेस, संख्याएं, प्रतीकों को मिलाएं
3. पासवर्ड नियमित रूप से बदलें (हर 90 दिन में)
4. पासवर्ड मैनेजर का उपयोग करें
5. यदि उपलब्ध हो तो दो-कारक प्रमाणीकरण सक्षम करें

### व्यवस्थापक गतिविधि की निगरानी करें

व्यवस्थापक लॉगिन लॉगिंग सक्षम करें:

**एडमिन पैनल > सिस्टम > प्राथमिकताएँ > उपयोगकर्ता सेटिंग्स**

```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```

लॉग की नियमित रूप से समीक्षा करें:

```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## नियमित रखरखाव

### अद्यतन XOOPS और मॉड्यूल

XOOPS और सभी मॉड्यूल अपडेट रखें:

```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```

### स्वचालित सुरक्षा स्कैनिंग

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

### नियमित बैकअप

दैनिक बैकअप स्वचालित करें:

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

क्रॉन के साथ शेड्यूल करें:

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## सुरक्षा चेकलिस्ट टेम्पलेट

नियमित सुरक्षा ऑडिट के लिए इस टेम्पलेट का उपयोग करें:

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

## सुरक्षा संसाधन

- सर्वर आवश्यकताएँ
- बुनियादी विन्यास
- प्रदर्शन अनुकूलन
- OWASP शीर्ष 10: https://owasp.org/www-project-top-ten/

---

**टैग्स:** #सुरक्षा #एसएसएल #https #हार्डनिंग #सर्वोत्तम अभ्यास

**संबंधित लेख:**
- ../स्थापना/स्थापना
- ../../06-प्रकाशक-मॉड्यूल/उपयोगकर्ता-गाइड/बेसिक-कॉन्फ़िगरेशन
- सिस्टम-सेटिंग्स
- ../इंस्टालेशन/अपग्रेडिंग-XOOPS