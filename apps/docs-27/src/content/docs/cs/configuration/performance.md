---
title: "Optimalizace výkonu"
description: "Průvodce optimalizací rychlosti pro XOOPS včetně ukládání do mezipaměti, optimalizace databáze, integrace CDN a monitorování výkonu"
---

# XOOPS Optimalizace výkonu

Komplexní průvodce optimalizací XOOPS pro maximální rychlost a efektivitu.

## Přehled optimalizace výkonu

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

## Konfigurace ukládání do mezipaměti

Ukládání do mezipaměti je nejrychlejší způsob, jak zlepšit výkon.

### Ukládání do mezipaměti na úrovni stránky

Povolit ukládání celé stránky do mezipaměti v XOOPS:

**Panel správce > Systém > Předvolby > Nastavení mezipaměti**

```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```

### Ukládání do mezipaměti založené na souborech

Konfigurace umístění mezipaměti souborů:

```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```

### Ukládání do mezipaměti APCu

APCu poskytuje ukládání do mezipaměti (velmi rychlé):

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

Povolit v XOOPS:

**Panel správce > Systém > Předvolby > Nastavení mezipaměti**

```
Cache Type: APCu
```

### Memcache/Redis Ukládání do mezipaměti

Distribuované ukládání do mezipaměti pro stránky s vysokou návštěvností:

**Nainstalovat Memcache:**

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

**Konfigurovat v XOOPS:**

Upravit mainfile.php:

```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```

Nebo v administračním panelu:

```
Cache Type: Memcache
Memcache Host: localhost:11211
```

### Ukládání šablon do mezipaměti

Zkompilujte a uložte do mezipaměti šablony XOOPS:

```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```

Konfigurovat v motivu:

```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```

## Optimalizace databáze

### Přidat databázové indexy

Správně indexované databáze se dotazují mnohem rychleji.

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

### Optimalizace tabulek

Pravidelná optimalizace tabulek zlepšuje výkon:

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

Vytvořte automatický optimalizační skript:

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

Plán s cronem:

```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```

### Optimalizace dotazů

Zkontrolujte pomalé dotazy:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```

Běžné optimalizační techniky:

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

### Zvyšte fond vyrovnávacích pamětí

Nakonfigurujte MySQL pro lepší ukládání do mezipaměti:

Upravit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

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

Restartujte MySQL:

```bash
systemctl restart mysql
```

## Optimalizace webového serveru

### Povolit kompresi Gzip

Komprimujte odezvy pro snížení šířky pásma:

**Konfigurace Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```

**Konfigurace Nginx:**

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```

Ověřte kompresi:

```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```

### Záhlaví ukládání do mezipaměti prohlížeče

Nastavení vypršení platnosti mezipaměti pro statické podklady:

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

Povolit trvalá připojení HTTP:

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

## Optimalizace frontendu

### Optimalizujte obrázky

Zmenšit velikost souboru obrázku:

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

### Minifikujte CSS a JavaScript

Zmenšení velikosti souborů CSS/JS:

**Pomocí nástrojů Node.js:**

```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```

**Pomocí online nástrojů:**
- Minifikátor CSS: https://cssminifier.com/
- Minifikátor JavaScript: https://www.minifycode.com/javascript-minifier/

### Líné načítání obrázků

Obrázky načítat pouze v případě potřeby:

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

### Snižte zdroje blokující vykreslování

Načtěte CSS/JS strategicky:

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

## Integrace CDN

Pro rychlejší globální přístup použijte síť pro doručování obsahu.

### Populární sítě CDN

| CDN | Cena | Vlastnosti |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, Cache, Analytics |
| AWS CloudFront | Zaplaceno | Vysoký výkon, globální |
| Zajíček CDN | Cenově dostupné | Úložiště, video, mezipaměť |
| jsDelivr | Zdarma | Knihovny JavaScript |
| cdnjs | Zdarma | Oblíbené knihovny |

### Nastavení Cloudflare

1. Zaregistrujte se na https://www.cloudflare.com/
2. Přidejte svou doménu
3. Aktualizujte jmenné servery pomocí Cloudflare's
4. Povolte možnosti ukládání do mezipaměti:
   - Úroveň mezipaměti: Agresivní
   - Ukládání do mezipaměti u všeho: Zapnuto
   - Mezipaměť prohlížeče TTL: 1 měsíc

5. V XOOPS aktualizujte svou doménu, aby používala Cloudflare DNS

### Konfigurace CDN v XOOPS

Aktualizujte adresy URL obrázků na CDN:

Upravit šablonu motivu:

```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```

Nebo nastavit v PHP:

```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```

## Monitorování výkonu

### Testování PageSpeed Insights

Otestujte výkon svého webu:

1. Navštivte Google PageSpeed Insights: https://pagespeed.web.dev/
2. Zadejte svůj XOOPS URL
3. Zkontrolujte doporučení
4. Implementujte navrhovaná vylepšení

### Monitorování výkonu serveru

Sledujte metriky serveru v reálném čase:

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

### Profilování výkonu PHP

Identifikujte pomalý kód PHP:

```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```

### Monitorování dotazů MySQL

Sledovat pomalé dotazy:

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

## Kontrolní seznam optimalizace výkonu

Pro nejlepší výkon implementujte tyto:- [ ] **Ukládání do mezipaměti:** Povolit ukládání do mezipaměti file/APCu/Memcache
- [ ] **Databáze:** Přidat indexy, optimalizovat tabulky
- [ ] **Komprese:** Povolit kompresi Gzip
- [ ] **Vyrovnávací paměť prohlížeče:** Nastavení záhlaví mezipaměti
- [ ] **Obrázky:** Optimalizujte a komprimujte
- [ ] **CSS/JS:** Minimalizujte soubory
- [ ] **Léné načítání:** Implementace pro obrázky
- [ ] **CDN:** Použijte pro statické podklady
- [ ] **Keep-Alive:** Povolit trvalá připojení
- [ ] **Moduly:** Zakázat nepoužívané moduly
- [ ] **Motivy:** Používejte odlehčená, optimalizovaná témata
- [ ] **Monitorování:** Sledujte metriky výkonu
- [ ] **Pravidelná údržba:** Vymažte mezipaměť, optimalizujte DB

## Skript optimalizace výkonu

Automatická optimalizace:

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

## Metriky před a po

Vylepšení sledování:

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

## Další kroky

1. Zkontrolujte základní konfiguraci
2. Zajistit bezpečnostní opatření
3. Implementujte ukládání do mezipaměti
4. Monitorujte výkon pomocí nástrojů
5. Upravte na základě metrik

---

**Značky:** #výkon #optimalizace #cachování #databáze #cdn

**Související články:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Nastavení systému
- Konfigurace zabezpečení
- ../Installation/Server-Requirements