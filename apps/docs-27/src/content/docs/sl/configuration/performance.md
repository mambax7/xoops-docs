---
title: "Optimizacija zmogljivosti"
description: "Priročnik za optimizacijo hitrosti za XOOPS vključno s predpomnjenjem, optimizacijo baze podatkov, CDN integracijo in spremljanjem zmogljivosti"
---
# XOOPS Optimizacija delovanja

Obsežen vodnik za optimizacijo XOOPS za največjo hitrost in učinkovitost.

## Pregled optimizacije delovanja
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
## Konfiguracija predpomnjenja

Predpomnjenje je najhitrejši način za izboljšanje zmogljivosti.

### Predpomnjenje na ravni strani

Omogoči predpomnjenje celotne strani v XOOPS:

**Skrbniška plošča > Sistem > Nastavitve > Nastavitve predpomnilnika**
```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```
### Predpomnjenje na podlagi datotek

Konfigurirajte lokacijo predpomnilnika datotek:
```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```
### Predpomnjenje APCu

APCu zagotavlja predpomnjenje v pomnilniku (zelo hitro):
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
Omogoči v XOOPS:

**Skrbniška plošča > Sistem > Nastavitve > Nastavitve predpomnilnika**
```
Cache Type: APCu
```
### Memcache/Redis Predpomnjenje

Porazdeljeno predpomnjenje za mesta z velikim prometom:

**Namesti Memcache:**
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
**Konfiguriraj v XOOPS:**

Uredite mainfile.php:
```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```
Ali v skrbniški plošči:
```
Cache Type: Memcache
Memcache Host: localhost:11211
```
### Predpomnjenje predlog

Prevedite in predpomnite XOOPS predloge:
```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```
Konfiguriraj v temi:
```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```
## Optimizacija baze podatkov

### Dodajte indekse baze podatkov

Pravilno indeksirane baze podatkov poizvedujejo veliko hitreje.
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
### Optimizirajte tabele

Redna optimizacija tabel izboljša zmogljivost:
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
Ustvarite samodejni optimizacijski skript:
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
Urnik s cronom:
```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```
### Optimizacija poizvedb

Preglejte počasne poizvedbe:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```
Pogoste tehnike optimizacije:
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
### Povečajte vmesni pomnilnik

Konfigurirajte MySQL za boljše predpomnjenje:

Uredi `/etc/mysql/mysql.conf.d/mysqld.cnf`:
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
Ponovno zaženite MySQL:
```bash
systemctl restart mysql
```
## Optimizacija spletnega strežnika

### Omogoči stiskanje Gzip

Stisnite odgovore, da zmanjšate pasovno širino:

**Konfiguracija Apache:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```
**Konfiguracija Nginx:**
```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```
Preverite stiskanje:
```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```
### Glave predpomnjenja brskalnika

Nastavite potek predpomnilnika za statična sredstva:

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
### Connection Keep-Alive

Omogoči trajne povezave HTTP:

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
## Optimizacija sprednjega dela

### Optimizirajte slike

Zmanjšajte velikost slikovnih datotek:
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
### Pomanjšajte CSS in JavaScript

Zmanjšajte velikost datoteke CSS/JS:

**Uporaba orodij Node.js:**
```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```
**Uporaba spletnih orodij:**
- CSS Minifier: https://cssminifier.com/
- JavaScript Minifier: https://www.minifycode.com/javascript-minifier/

### Leno nalaganje slik

Naloži slike samo, ko je to potrebno:
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
### Zmanjšajte vire, ki blokirajo upodabljanje

Strateško naložite CSS/JS:
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
## CDN Integracija

Uporabite omrežje za dostavo vsebine za hitrejši globalni dostop.

### Priljubljeni CDN-ji

| CDN | Stroški | Lastnosti |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, predpomnilnik, analitika |
| AWS CloudFront | Plačano | Visoka zmogljivost, globalno |
| Zajček CDN | Ugodno | Shramba, video, predpomnilnik |
| jsDelivr | Brezplačno | Knjižnice JavaScript |
| cdnjs | Brezplačno | Priljubljene knjižnice |

### Nastavitev Cloudflare

1. Prijavite se na https://www.cloudflare.com/
2. Dodajte svojo domeno
3. Posodobite imenske strežnike s strežniki Cloudflare
4. Omogočite možnosti predpomnjenja:
   - Raven predpomnilnika: Agresivno
   - Predpomnjenje vsega: Vklopljeno
   - Predpomnjenje brskalnika TTL: 1 mesec

5. V XOOPS posodobite svojo domeno za uporabo Cloudflare DNS

### Konfigurirajte CDN v XOOPS

Posodobite URL-je slik na CDN:

Uredi predlogo teme:
```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```
Ali nastavite v PHP:
```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```
## Spremljanje uspešnosti

### Testiranje PageSpeed Insights

Preizkusite delovanje svojega spletnega mesta:

1. Obiščite Google PageSpeed Insights: https://pagespeed.web.dev/
2. Vnesite svoj XOOPS URL
3. Preglejte priporočila
4. Izvedite predlagane izboljšave

### Spremljanje delovanja strežnika

Spremljajte meritve strežnika v realnem času:
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
### PHP Profiliranje uspešnosti

Prepoznajte kodo počasne PHP:
```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```
### Spremljanje poizvedb MySQL

Sledite počasnim poizvedbam:
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
## Kontrolni seznam za optimizacijo delovanja

Izvedite te za najboljšo učinkovitost:

- [ ] **Caching:** Omogoči predpomnjenje file/APCu/Memcache
- [ ] **Baza podatkov:** Dodajte indekse, optimizirajte tabele
- [ ] **Stiskanje:** Omogoči stiskanje Gzip
- [ ] **Predpomnilnik brskalnika:** Nastavite glave predpomnilnika
- [ ] **Slike:** Optimizirajte in stisnite
- [ ] **CSS/JS:** Pomanjšaj datoteke
- [ ] **Leno nalaganje:** Implementacija za slike
- [ ] **CDN:** Uporabite za statična sredstva
- [ ] **Keep-Alive:** Omogoči trajne povezave
- [ ] **Moduli:** Onemogoči neuporabljene module
- [ ] **Teme:** Uporabite lahke, optimizirane teme
- [ ] **Spremljanje:** Sledite meritvam uspešnosti
- [ ] **Redno vzdrževanje:** Počisti predpomnilnik, optimiziraj DB

## Skript za optimizacijo delovanja

Samodejna optimizacija:
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
## Meritve pred in po

Sledite izboljšavam:
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
## Naslednji koraki

1. Preglejte osnovno konfiguracijo
2. Zagotovite varnostne ukrepe
3. Izvedite predpomnjenje
4. Spremljajte delovanje z orodji
5. Prilagodite na podlagi meritev

---

**Oznake:** #zmogljivost #optimizacija #predpomnjenje #baza podatkov #cdn

**Povezani članki:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Sistemske nastavitve
- Varnostna konfiguracija
- ../Installation/Server-Requirements