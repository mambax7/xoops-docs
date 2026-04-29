---
title: "Βελτιστοποίηση απόδοσης"
description: "Οδηγός βελτιστοποίησης ταχύτητας για XOOPS συμπεριλαμβανομένης της προσωρινής αποθήκευσης, της βελτιστοποίησης βάσης δεδομένων, της ενσωμάτωσης CDN και της παρακολούθησης απόδοσης"
---

# XOOPS Βελτιστοποίηση απόδοσης

Πλήρης οδηγός για τη βελτιστοποίηση του XOOPS για μέγιστη ταχύτητα και απόδοση.

## Επισκόπηση βελτιστοποίησης απόδοσης

```mermaid
graph TD
    A[Performance] --> B[Caching]
    A --> C[Database]
    A --> D[Web Server]
    A --> E[Frontend]
    A --> F[Code]
    B --> B1[Page Cache]
    B --> B2[Query Cache]
    B --> B3[Template Cache]
    C --> C1[Indexes]
    C --> C2[Queries]
    C --> C3[Optimization]
    D --> D1[Compression]
    D --> D2[Headers]
    D --> D3[Connection]
    E --> E1[Images]
    E --> E2[CSS/JS]
    E --> E3[Lazy Load]
    F --> F1[Modules]
    F --> F2[Queries]
```

## Διαμόρφωση προσωρινής αποθήκευσης

Η προσωρινή αποθήκευση είναι ο ταχύτερος τρόπος βελτίωσης της απόδοσης.

## # Προσωρινή αποθήκευση σε επίπεδο σελίδας

Ενεργοποίηση προσωρινής αποθήκευσης πλήρους σελίδας στο XOOPS:

**Πίνακας διαχειριστή > Σύστημα > Προτιμήσεις > Ρυθμίσεις προσωρινής μνήμης**

```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```

## # Προσωρινή αποθήκευση βάσει αρχείων

Διαμόρφωση θέσης προσωρινής μνήμης αρχείου:

```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```

## # APCu Caching

Το APCu παρέχει προσωρινή αποθήκευση στη μνήμη (πολύ γρήγορα):

```bash
# Install APCu
apt-get install php-apcu

# Verify installation
php -m | grep apcu

# Configure in php.ini
apc.enabled = 1
apc.memory_size = 128M
apc.ttl = 0
apc.user_ttl = 3600
apc.shm_size = 128
```

Ενεργοποίηση στο XOOPS:

**Πίνακας διαχειριστή > Σύστημα > Προτιμήσεις > Ρυθμίσεις προσωρινής μνήμης**

```
Cache Type: APCu
```

## # Memcache/Redis Προσωρινή αποθήκευση

Κατανεμημένη προσωρινή αποθήκευση για ιστότοπους υψηλής επισκεψιμότητας:

**Εγκατάσταση Memcache:**

```bash
# Install Memcache server
apt-get install memcached

# Start service
systemctl start memcached
systemctl enable memcached

# Verify running
netstat -tlnp | grep memcached
# Should show listening on port 11211
```

**Διαμόρφωση σε XOOPS:**

Επεξεργασία mainfile.php:

```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```

Ή στον πίνακα διαχείρισης:

```
Cache Type: Memcache
Memcache Host: localhost:11211
```

## # Προσωρινή αποθήκευση προτύπων

Μεταγλώττιση και αποθήκευση προτύπων XOOPS:

```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```

Διαμόρφωση στο θέμα:

```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```

## Βελτιστοποίηση βάσης δεδομένων

## # Προσθήκη ευρετηρίων βάσεων δεδομένων

Οι σωστά ευρετηριασμένες βάσεις δεδομένων υποβάλλουν ερωτήματα πολύ πιο γρήγορα.

```sql
-- Check current indexes
SHOW INDEXES FROM xoops_users;

-- Common indexes to add
ALTER TABLE xoops_users ADD INDEX idx_uname (uname);
ALTER TABLE xoops_users ADD INDEX idx_email (email);
ALTER TABLE xoops_users ADD INDEX idx_uid_active (uid, user_actkey);

-- Add indexes to posts/content tables
ALTER TABLE xoops_posts ADD INDEX idx_post_published (post_published);
ALTER TABLE xoops_posts ADD INDEX idx_post_uid (post_uid);
ALTER TABLE xoops_posts ADD INDEX idx_post_created (post_created);

-- Verify indexes created
SHOW INDEXES FROM xoops_users\G
```

## # Βελτιστοποίηση πινάκων

Η κανονική βελτιστοποίηση πίνακα βελτιώνει την απόδοση:

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;

-- Or optimize all at once
REPAIR TABLE xoops_users;
OPTIMIZE TABLE xoops_users;
REPAIR TABLE xoops_posts;
OPTIMIZE TABLE xoops_posts;
```

Δημιουργία σεναρίου αυτοματοποιημένης βελτιστοποίησης:

```bash
#!/bin/bash
# Database optimization script

echo "Optimizing XOOPS database..."

mysql -u xoops_user -p xoops_db << EOF
-- Optimize all tables
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;
OPTIMIZE TABLE xoops_users_online;

-- Show database size
SELECT table_schema,
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as total_mb
FROM information_schema.tables
WHERE table_schema = 'xoops_db'
GROUP BY table_schema;
EOF

echo "Database optimization completed!"
```

Πρόγραμμα με cron:

```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```

## # Βελτιστοποίηση ερωτημάτων

Έλεγχος αργών ερωτημάτων:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```

Κοινές τεχνικές βελτιστοποίησης:

```php
// SLOW - Avoid unnecessary queries in loops
foreach ($users as $user) {
    $profile = getUserProfile($user['uid']);  // Query in loop!
    echo $profile['name'];
}

// FAST - Get all data at once
$profiles = getAllUserProfiles($user_ids);
foreach ($users as $user) {
    echo $profiles[$user['uid']]['name'];
}
```

## # Αύξηση του Buffer Pool

Διαμόρφωση MySQL for better caching:

Επεξεργασία `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
# InnoDB Buffer Pool (50-80% of system RAM)
innodb_buffer_pool_size = 1G

# Query Cache (optional, can be disabled in MySQL 5.7+)
query_cache_size = 64M
query_cache_type = 1

# Max Connections
max_connections = 500

# Max Allowed Packet
max_allowed_packet = 256M

# Connection timeout
connect_timeout = 10
```

Επανεκκινήστε τη MySQL:

```bash
systemctl restart mysql
```

## Βελτιστοποίηση διακομιστή Ιστού

## # Ενεργοποιήστε τη συμπίεση Gzip

Συμπίεση αποκρίσεων για μείωση του εύρους ζώνης:

**Διαμόρφωση Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```

**Διαμόρφωση Nginx:**

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```

Επαλήθευση συμπίεσης:

```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```

## # Κεφαλίδες προσωρινής αποθήκευσης προγράμματος περιήγησης

Ορισμός λήξης προσωρινής μνήμης για στατικά στοιχεία:

**Apache:**

```apache
<IfModule mod_expires.c>
    ExpiresActive On

    # Cache images for 30 days
    ExpiresByType image/jpeg "access plus 30 days"
    ExpiresByType image/gif "access plus 30 days"
    ExpiresByType image/png "access plus 30 days"
    ExpiresByType image/svg+xml "access plus 30 days"

    # Cache CSS/JS for 30 days
    ExpiresByType text/css "access plus 30 days"
    ExpiresByType application/javascript "access plus 30 days"
    ExpiresByType text/javascript "access plus 30 days"

    # Cache fonts for 1 year
    ExpiresByType font/eot "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"

    # Don't cache HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

**Nginx:**

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(css|js)$ {
    expires 30d;
    add_header Cache-Control "public";
}

location ~ \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

## # Σύνδεση Keep-Alive

Ενεργοποίηση μόνιμων συνδέσεων HTTP:

**Apache:**

```apache
<IfModule mod_http.c>
    KeepAlive On
    KeepAliveTimeout 15
    MaxKeepAliveRequests 100
</IfModule>
```

**Nginx:**

```nginx
keepalive_timeout 15s;
keepalive_requests 100;
```

## Βελτιστοποίηση Frontend

## # Βελτιστοποίηση εικόνων

Μειώστε τα μεγέθη αρχείων εικόνας:

```bash
# Batch compress JPEG images
for img in *.jpg; do
    convert "$img" -quality 85 "optimized_$img"
done

# Batch compress PNG images
for img in *.png; do
    optipng -o2 "$img"
done

# Or use imagemin CLI
npm install -g imagemin-cli
imagemin images/ --out-dir=images-optimized
```

## # Ελαχιστοποίηση CSS και JavaScript

Μειώστε τα μεγέθη αρχείων CSS/JS:

**Χρήση εργαλείων Node.js:**

```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```

**Χρήση διαδικτυακών εργαλείων:**
- CSS Ελαχιστοποιητής: https://cssminifier.com/
- JavaScript Minifier: https://www.minifycode.com/javascript-minifier/

## # Lazy Load Images

Φόρτωση εικόνων μόνο όταν χρειάζεται:

```html
<!-- Add loading="lazy" attribute -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Or use JavaScript library for older browsers -->
<img class="lazy" src="placeholder.jpg" data-src="image.jpg" alt="Description">

<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/17.1.2/lazyload.min.js"></script>
<script>
    var lazyLoad = new LazyLoad({
        elements_selector: ".lazy"
    });
</script>
```

## # Μειώστε τους πόρους αποκλεισμού απόδοσης

Φορτώστε το CSS/JS στρατηγικά:

```html
<!-- Load critical CSS inline -->
<style>
    /* Critical styles for above-the-fold */
</style>

<!-- Defer non-critical CSS -->
<link rel="stylesheet" href="style.css" media="print" onload="this.media='all'">

<!-- Defer JavaScript -->
<script src="script.js" defer></script>

<!-- Or use async for non-critical scripts -->
<script src="analytics.js" async></script>
```

## CDN Ενσωμάτωση

Χρησιμοποιήστε ένα δίκτυο παράδοσης περιεχομένου για ταχύτερη παγκόσμια πρόσβαση.

## # Δημοφιλή CDN

| CDN | Κόστος | Χαρακτηριστικά |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, προσωρινή μνήμη, Analytics |
| AWS CloudFront | Πληρωμένο | Υψηλή απόδοση, παγκόσμια |
| Λαγουδάκι CDN | Προσιτό | Αποθήκευση, βίντεο, προσωρινή μνήμη |
| jsDelivr | Δωρεάν | Βιβλιοθήκες JavaScript |
| cdnjs | Δωρεάν | Δημοφιλείς βιβλιοθήκες |

## # Ρύθμιση Cloudflare

1. Εγγραφείτε στο https://www.cloudflare.com/
2. Προσθέστε τον τομέα σας
3. Ενημερώστε τους nameservers με τους Cloudflare's
4. Ενεργοποιήστε τις επιλογές προσωρινής αποθήκευσης:
   - Επίπεδο προσωρινής μνήμης: Επιθετικό
   - Προσωρινή αποθήκευση σε όλα: Ενεργό
   - Προσωρινή αποθήκευση προγράμματος περιήγησης TTL: 1 μήνας

5. Στο XOOPS, ενημερώστε τον τομέα σας για να χρησιμοποιήσετε το Cloudflare DNS

## # Ρύθμιση παραμέτρων CDN στο XOOPS

Ενημερώστε τις διευθύνσεις URL εικόνων στο CDN:

Επεξεργασία προτύπου θέματος:

```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```

Ή ορίστε στο PHP:

```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```

## Παρακολούθηση απόδοσης

## # Δοκιμή PageSpeed Insights

Δοκιμάστε την απόδοση του ιστότοπού σας:

1. Επισκεφτείτε το Google PageSpeed Insights: https://pagespeed.web.dev/
2. Εισαγάγετε το XOOPS URL
3. Ελέγξτε τις συστάσεις
4. Εφαρμογή προτεινόμενων βελτιώσεων

## # Παρακολούθηση απόδοσης διακομιστή

Παρακολούθηση μετρήσεων διακομιστή σε πραγματικό χρόνο:

```bash
# Install monitoring tools
apt-get install htop iotop nethogs

# Monitor CPU and memory
htop

# Monitor disk I/O
iotop

# Monitor network
nethogs
```

## # PHP Προφίλ απόδοσης

Προσδιορίστε τον αργό κωδικό PHP:

```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```

## # MySQL Query Monitoring

Παρακολούθηση αργών ερωτημάτων:

```bash
# Enable query logging
mysql -u root -p

SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'FILE';
SET GLOBAL general_log_file = '/var/log/mysql/query.log';

# Review slow queries
tail -f /var/log/mysql/slow.log

# Analyze query with EXPLAIN
EXPLAIN SELECT * FROM xoops_users WHERE uid = 1\G
```

## Λίστα ελέγχου βελτιστοποίησης απόδοσης

Εφαρμόστε αυτά για καλύτερη απόδοση:

- [ ] **Caching:** Ενεργοποίηση file/APCu/Memcache προσωρινής αποθήκευσης
- [ ] **Βάση δεδομένων:** Προσθήκη ευρετηρίων, βελτιστοποίηση πινάκων
- [ ] **Συμπίεση:** Ενεργοποιήστε τη συμπίεση Gzip
- [ ] **Προσωρινή μνήμη προγράμματος περιήγησης:** Ορισμός κεφαλίδων προσωρινής μνήμης
- [ ] **Εικόνες:** Βελτιστοποίηση και συμπίεση
- [ ] **CSS/JS:** Ελαχιστοποίηση αρχείων
- [ ] **Lazy Loading:** Εφαρμογή για εικόνες
- [ ] **CDN:** Χρήση για στατικά στοιχεία
- [ ] **Keep-Alive:** Ενεργοποίηση μόνιμων συνδέσεων
- [ ] **Ενότητες:** Απενεργοποιήστε τις αχρησιμοποίητες μονάδες
- [ ] **Θέματα:** Χρησιμοποιήστε ελαφριά, βελτιστοποιημένα θέματα
- [ ] **Παρακολούθηση:** Παρακολούθηση μετρήσεων απόδοσης
- [ ] **Τακτική συντήρηση:** Εκκαθάριση προσωρινής μνήμης, βελτιστοποίηση DB

## Σενάριο βελτιστοποίησης απόδοσης

Αυτοματοποιημένη βελτιστοποίηση:

```bash
#!/bin/bash
# Performance optimization script

echo "=== XOOPS Performance Optimization ==="

# Clear cache
echo "Clearing cache..."
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Optimize database
echo "Optimizing database..."
mysql -u xoops_user -p xoops_db << EOF
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;
EOF

# Check file permissions
echo "Verifying file permissions..."
find /var/www/html/xoops -type f -exec chmod 644 {} \;
find /var/www/html/xoops -type d -exec chmod 755 {} \;
chmod 777 /var/www/html/xoops/cache
chmod 777 /var/www/html/xoops/templates_c
chmod 777 /var/www/html/xoops/uploads
chmod 777 /var/www/html/xoops/var

# Generate performance report
echo "Performance Optimization Complete!"
echo ""
echo "Next steps:"
echo "1. Test site at https://pagespeed.web.dev/"
echo "2. Monitor performance in admin panel"
echo "3. Consider CDN for static assets"
echo "4. Review slow queries in MySQL"
```

## Μετρήσεις πριν και μετά

Βελτιώσεις παρακολούθησης:

```
Before Optimization:
- Page Load Time: 3.5 seconds
- Database Queries: 45
- Cache Hit Rate: 0%
- Database Size: 250MB

After Optimization:
- Page Load Time: 0.8 seconds (77% faster)
- Database Queries: 8 (cached)
- Cache Hit Rate: 85%
- Database Size: 120MB (optimized)
```

## Επόμενα βήματα

1. Ελέγξτε τη βασική διαμόρφωση
2. Εξασφαλίστε μέτρα ασφαλείας
3. Εφαρμογή προσωρινής αποθήκευσης
4. Παρακολούθηση της απόδοσης με εργαλεία
5. Προσαρμογή βάσει μετρήσεων

---

**Ετικέτες:** #performance #optimization #caching #database #cdn

**Σχετικά άρθρα:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Ρυθμίσεις συστήματος
- Ασφάλεια-Διαμόρφωση
- ../Installation/Server-Requirements
