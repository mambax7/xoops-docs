---
title: "Διαμόρφωση ασφαλείας"
description: "Πλήρης οδηγός σκλήρυνσης ασφαλείας για το XOOPS συμπεριλαμβανομένων των δικαιωμάτων αρχείων, του SSL/HTTPS, των ευαίσθητων καταλόγων και των βέλτιστων πρακτικών ασφαλείας"
---

# XOOPS Διαμόρφωση ασφαλείας

Πλήρης οδηγός για την ασφάλεια της εγκατάστασης XOOPS από κοινά τρωτά σημεία ιστού.

## Λίστα ελέγχου ασφαλείας

Πριν ξεκινήσετε τον ιστότοπό σας, εφαρμόστε αυτά τα μέτρα ασφαλείας:

- [ ] Τα δικαιώματα αρχείου ορίστηκαν σωστά (644/755)
- [ ] Ο φάκελος εγκατάστασης αφαιρέθηκε ή προστατεύτηκε
- [ ] κύριο αρχείο.php protected from modification
- [ ] SSL/HTTPS ενεργοποιημένο σε όλες τις σελίδες
- [ ] Ο φάκελος διαχειριστή μετονομάστηκε ή προστατεύεται
- [ ] Τα ευαίσθητα αρχεία δεν είναι προσβάσιμα στον ιστό
- [ ] .htaccess ισχύουν περιορισμοί
- [ ] Αυτοματοποιημένα τακτικά αντίγραφα ασφαλείας
- [ ] Οι κεφαλίδες ασφαλείας διαμορφώθηκαν
- [ ] CSRF ενεργοποιημένη η προστασία
- [ ] SQL ενεργές προστασίες έγχυσης
- [ ] Modules/extensions ενημερώθηκε

## Ασφάλεια συστήματος αρχείων

## # Δικαιώματα αρχείου

Τα σωστά δικαιώματα αρχείων είναι ζωτικής σημασίας για την ασφάλεια.

### # Οδηγίες άδειας

| Μονοπάτι | Άδειες | Ιδιοκτήτης | Λόγος |
|---|---|---|---|
| κύριο αρχείο.php | 644 | root | Contains DB credentials |
| *.php files | 644 | root | Prevent unauthorized modification |
| Κατάλογοι | 755 | ρίζα | Επιτρέψτε την ανάγνωση, αποτρέψτε τη γραφή |
| cache/ | 777 | www-data | Ο διακομιστής Ιστού πρέπει να γράφει |
| templates_c/ | 777 | www-data | Μεταγλωττισμένα πρότυπα |
| μεταφορτώσεις/ | 777 | www-data | Μεταφορτώσεις χρηστών |
| var/ | 777 | www-data | Μεταβλητά δεδομένα |
| εγκατάσταση/ | Αφαίρεση | - | Διαγραφή μετά την εγκατάσταση |
| configs/ | 755 | ρίζα | Αναγνώσιμο, μη εγγράψιμο |

### # Ρύθμιση σεναρίου δικαιωμάτων

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

Εκτελέστε το σενάριο:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

## # Κατάργηση φακέλου εγκατάστασης

**CRITICAL:** Ο φάκελος εγκατάστασης πρέπει να αφαιρεθεί μετά την εγκατάσταση!

```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```

## # Προστασία ευαίσθητων καταλόγων

Δημιουργήστε αρχεία .htaccess για να αποκλείσετε την πρόσβαση στον ιστό σε ευαίσθητους φακέλους:

**Αρχείο: /var/www/html/XOOPS/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**Αρχείο: /var/www/html/XOOPS/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**Αρχείο: /var/www/html/XOOPS/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

## # Προστασία καταλόγου μεταφόρτωσης

Αποτρέψτε την εκτέλεση σεναρίων στις μεταφορτώσεις:

**Αρχείο: /var/www/html/XOOPS/uploads/.htaccess**

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

## SSL/HTTPS Διαμόρφωση

Κρυπτογραφήστε όλη την κίνηση μεταξύ των χρηστών και του διακομιστή σας.

## # Λήψη πιστοποιητικού SSL

**Επιλογή 1: Δωρεάν πιστοποιητικό από το Let's Encrypt**

```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```

**Επιλογή 2: Εμπορικό Πιστοποιητικό SSL**

Επικοινωνήστε με τον πάροχο ή τον καταχωρητή SSL:
1. Αγορά πιστοποιητικού SSL
2. Επαληθεύστε την ιδιοκτησία του τομέα
3. Εγκαταστήστε αρχεία πιστοποιητικών στον διακομιστή
4. Διαμόρφωση διακομιστή web

## # Διαμόρφωση Apache SSL

Δημιουργία εικονικού κεντρικού υπολογιστή HTTPS:

**Αρχείο: /etc/apache2/sites-available/XOOPS-ssl.conf**

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

Ενεργοποιήστε τη διαμόρφωση:

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

## # Nginx SSL Διαμόρφωση

**Αρχείο: /etc/nginx/sites-available/XOOPS**

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

Ενεργοποιήστε τη διαμόρφωση:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## # Επαλήθευση HTTPS εγκατάστασης

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

## # Αυτόματη ανανέωση Let's Encrypt Certificate

```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```

## Ασφάλεια εφαρμογών Ιστού

## # Προστασία από SQL ένεση

Το XOOPS χρησιμοποιεί παραμετροποιημένα ερωτήματα (ασφαλή από προεπιλογή), αλλά πάντα:

```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

## # Πρόληψη σεναρίων μεταξύ τοποθεσιών (XSS)

Να απολυμαίνονται πάντα τα στοιχεία του χρήστη:

```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

## # Παραχάραξη αιτημάτων μεταξύ τοποθεσιών (CSRF) Πρόληψη

Το XOOPS περιλαμβάνει προστασία διακριτικού CSRF. Να συμπεριλαμβάνετε πάντα κουπόνια:

```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

## # Απενεργοποιήστε την εκτέλεση PHP στον φάκελο μεταφόρτωσης

Αποτρέψτε τους εισβολείς να ανεβάσουν και να εκτελέσουν το PHP:

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

## # Κεφαλίδες ασφαλείας

Διαμόρφωση σημαντικών κεφαλίδων ασφαλείας HTTP:

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

## Ασφάλεια πίνακα διαχειριστή

## # Μετονομασία φακέλου διαχειριστή

Προστατέψτε το φάκελο διαχειριστή μετονομάζοντάς τον:

```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```

Διαμορφώστε το XOOPS για να χρησιμοποιήσετε τον μετονομασμένο φάκελο:

Επεξεργασία mainfile.php:

```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

## # Λευκή λίστα IP για διαχειριστή

Περιορίστε την πρόσβαση διαχειριστή σε συγκεκριμένες IP:

**Αρχείο: /var/www/html/XOOPS/myadmin123/.htaccess**

```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```

Ή με το Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

## # Ισχυρά διαπιστευτήρια διαχειριστή

Επιβολή ισχυρών κωδικών πρόσβασης για διαχειριστές:

1. Χρησιμοποιήστε τουλάχιστον 16 χαρακτήρες
2. Αναμείξτε κεφαλαία, πεζά, αριθμούς, σύμβολα
3. Αλλάζετε τον κωδικό πρόσβασης τακτικά (κάθε 90 ημέρες)
4. Χρησιμοποιήστε έναν διαχειριστή κωδικών πρόσβασης
5. Ενεργοποιήστε τον έλεγχο ταυτότητας δύο παραγόντων εάν είναι διαθέσιμος

## # Παρακολούθηση δραστηριότητας διαχειριστή

Ενεργοποίηση καταγραφής σύνδεσης διαχειριστή:

**Πίνακας διαχειριστή > Σύστημα > Προτιμήσεις > Ρυθμίσεις χρήστη**

```
Log Admin Logins: Yes
Log Failed Login Attempts: Yes
Alert Email on Admin Login: Yes
```

Ελέγχετε τακτικά τα αρχεία καταγραφής:

```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Τακτική συντήρηση

## # Ενημερώστε το XOOPS και τις ενότητες

Διατηρήστε ενημερωμένα το XOOPS και όλες τις ενότητες:

```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```

## # Αυτοματοποιημένη σάρωση ασφαλείας

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

## # Τακτικά αντίγραφα ασφαλείας

Αυτοματοποιήστε τα καθημερινά αντίγραφα ασφαλείας:

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

Πρόγραμμα με cron:

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Πρότυπο λίστας ελέγχου ασφαλείας

Χρησιμοποιήστε αυτό το πρότυπο για τακτικούς ελέγχους ασφαλείας:

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

## Πόροι ασφαλείας

- Απαιτήσεις διακομιστή
- Βασική διαμόρφωση
- Βελτιστοποίηση απόδοσης
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Ετικέτες:** #security #ssl #https #hardening #best-practices

**Σχετικά άρθρα:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Ρυθμίσεις συστήματος
- ../Installation/Upgrading-XOOPS
