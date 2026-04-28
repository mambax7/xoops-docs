---
title: "Leistungsoptimierung"
description: "Optimierungsleitfaden für Geschwindigkeit von XOOPS einschließlich Caching, Datenbankoptimierung, CDN-Integration und Leistungsüberwachung"
---

# XOOPS-Leistungsoptimierung

Umfassender Leitfaden zur Optimierung von XOOPS für maximale Geschwindigkeit und Effizienz.

## Übersicht der Leistungsoptimierung

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

## Cache-Konfiguration

Caching ist der schnellste Weg zur Leistungsverbesserung.

### Caching auf Seitenebene

Aktivieren Sie vollständiges Seiten-Caching in XOOPS:

**Admin-Panel > System > Preferences > Cache Settings**

```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```

### Datei-basiertes Caching

Konfigurieren Sie den Cache-Speicherort:

```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```

### APCu-Caching

APCu bietet In-Memory-Caching (sehr schnell):

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

Aktivieren Sie in XOOPS:

**Admin-Panel > System > Preferences > Cache Settings**

```
Cache Type: APCu
```

### Memcache/Redis-Caching

Verteiltes Caching für Websites mit hohem Traffic:

**Memcache installieren:**

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

**Konfigurieren Sie in XOOPS:**

Bearbeiten Sie mainfile.php:

```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```

Oder im Admin-Panel:

```
Cache Type: Memcache
Memcache Host: localhost:11211
```

### Template-Caching

Kompilieren und Cache XOOPS-Templates:

```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```

Konfigurieren Sie im Theme:

```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```

## Datenbankoptimierung

### Datenbankindizes hinzufügen

Ordnungsgemäß indizierte Datenbanken führen viel schneller Abfragen durch.

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

### Tabellen optimieren

Regelmäßige Tabellenoptimierung verbessert die Leistung:

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

Erstellen Sie ein Optimierungsskript:

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

Planen Sie mit cron:

```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```

### Abfrage-Optimierung

Überprüfen Sie langsame Abfragen:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```

Häufige Optimierungstechniken:

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

### Puffer-Pool erhöhen

Konfigurieren Sie MySQL für besseres Caching:

Bearbeiten Sie `/etc/mysql/mysql.conf.d/mysqld.cnf`:

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

MySQL neu starten:

```bash
systemctl restart mysql
```

## Web-Server-Optimierung

### Gzip-Kompression aktivieren

Komprimieren Sie Antworten zur Bandbreiteneinsparung:

**Apache-Konfiguration:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```

**Nginx-Konfiguration:**

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```

Überprüfen Sie die Kompression:

```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```

### Browser-Caching-Header

Legen Sie Ablaufdaten für statische Assets fest:

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

### Dauerhafte HTTP-Verbindungen

Aktivieren Sie persistente HTTP-Verbindungen:

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

## Frontend-Optimierung

### Bilder optimieren

Reduzieren Sie die Größe von Bilddateien:

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

### CSS und JavaScript komprimieren

Reduzieren Sie CSS/JS-Dateigröße:

**Mit Node.js-Tools:**

```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```

**Mit Online-Tools:**
- CSS Minifier: https://cssminifier.com/
- JavaScript Minifier: https://www.minifycode.com/javascript-minifier/

### Bilder verzögert laden

Laden Sie Bilder nur bei Bedarf:

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

### Rendering-blockierende Ressourcen reduzieren

Laden Sie CSS/JS strategisch:

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

## CDN-Integration

Verwenden Sie ein Content Delivery Network für schnelleren globalen Zugriff.

### Beliebte CDNs

| CDN | Kosten | Features |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, Cache, Analytics |
| AWS CloudFront | Paid | High performance, global |
| Bunny CDN | Affordable | Storage, video, cache |
| jsDelivr | Free | JavaScript libraries |
| cdnjs | Free | Popular libraries |

### Cloudflare-Setup

1. Melden Sie sich unter https://www.cloudflare.com/ an
2. Fügen Sie Ihre Domain hinzu
3. Aktualisieren Sie Nameserver mit Cloudflare
4. Aktivieren Sie Caching-Optionen:
   - Cache Level: Aggressive
   - Caching on everything: On
   - Browser Caching TTL: 1 month

5. Aktualisieren Sie in XOOPS Ihre Domain zur Verwendung von Cloudflare DNS

### CDN in XOOPS konfigurieren

Aktualisieren Sie Bild-URLs zu CDN:

Bearbeiten Sie Theme-Template:

```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```

Oder legen Sie in PHP fest:

```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```

## Leistungsüberwachung

### PageSpeed Insights Test

Testen Sie die Leistung Ihrer Site:

1. Besuchen Sie Google PageSpeed Insights: https://pagespeed.web.dev/
2. Geben Sie Ihre XOOPS-URL ein
3. Überprüfen Sie Empfehlungen
4. Implementieren Sie vorgeschlagene Verbesserungen

### Server-Leistungsüberwachung

Überwachen Sie Metriken in Echtzeit:

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

### PHP-Leistungs-Profilierung

Identifizieren Sie langsamen PHP-Code:

```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```

### MySQL-Abfrage-Überwachung

Verfolgen Sie langsame Abfragen:

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

## Checkliste zur Leistungsoptimierung

Implementieren Sie diese für beste Leistung:

- [ ] **Caching:** Aktivieren Sie Datei/APCu/Memcache-Caching
- [ ] **Datenbank:** Indizes hinzufügen, Tabellen optimieren
- [ ] **Kompression:** Gzip-Kompression aktivieren
- [ ] **Browser-Cache:** Cache-Header einstellen
- [ ] **Bilder:** Optimieren und komprimieren
- [ ] **CSS/JS:** Dateien minimieren
- [ ] **Lazy Loading:** Für Bilder implementieren
- [ ] **CDN:** Für statische Assets verwenden
- [ ] **Keep-Alive:** Persistente Verbindungen aktivieren
- [ ] **Module:** Ungenutzte Module deaktivieren
- [ ] **Themes:** Leichte, optimierte Themes verwenden
- [ ] **Monitoring:** Leistungsmetriken verfolgen
- [ ] **Regelmäßige Wartung:** Cache löschen, DB optimieren

## Leistungsoptimierungs-Skript

Automatisierte Optimierung:

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

## Metriken vor und nach der Optimierung

Verfolgen Sie Verbesserungen:

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

## Nächste Schritte

1. Überprüfen Sie die Grundkonfiguration
2. Stellen Sie Sicherheitsmaßnahmen sicher
3. Implementieren Sie Caching
4. Überwachen Sie die Leistung mit Tools
5. Passen Sie basierend auf Metriken an

---

**Tags:** #performance #optimization #caching #database #cdn

**Related Articles:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- Security-Configuration
- ../Installation/Server-Requirements
