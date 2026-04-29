---
title: "Pengoptimuman Prestasi"
description: "Panduan pengoptimuman kelajuan untuk XOOPS termasuk caching, pengoptimuman pangkalan data, penyepaduan CDN dan pemantauan prestasi"
---
# XOOPS Pengoptimuman PrestasiPanduan komprehensif untuk mengoptimumkan XOOPS untuk kelajuan dan kecekapan maksimum.## Gambaran Keseluruhan Pengoptimuman Prestasi
```
mermaid
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
## Konfigurasi CachingCaching ialah cara terpantas untuk meningkatkan prestasi.### Caching Tahap HalamanDayakan caching halaman penuh dalam XOOPS:**Panel Pentadbiran > Sistem > Keutamaan > Tetapan Cache**
```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```
### Caching Berasaskan FailKonfigurasi lokasi cache fail:
```
bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/XOOPS
chown www-data:www-data /var/cache/XOOPS
chmod 755 /var/cache/XOOPS

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/XOOPS/');
```
### Caching APCuAPCu menyediakan caching dalam memori (sangat pantas):
```
bash
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
Dayakan dalam XOOPS:**Panel Pentadbiran > Sistem > Keutamaan > Tetapan Cache**
```
Cache Type: APCu
```
### Memcache/Redis CachingCache yang diedarkan untuk tapak trafik tinggi:**Pasang Memcache:**
```
bash
# Install Memcache server
apt-get install memcached

# Start service
systemctl start memcached
systemctl enable memcached

# Verify running
netstat -tlnp | grep memcached
# Should show listening on port 11211
```
**Konfigurasikan dalam XOOPS:**Edit mainfile.php:
```
php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```
Atau dalam panel pentadbir:
```
Cache Type: Memcache
Memcache Host: localhost:11211
```
### Caching TemplatSusun dan cache templat XOOPS:
```
bash
# Ensure templates_c is writable
chmod 777 /var/www/html/XOOPS/templates_c/

# Clear old cached templates
rm -rf /var/www/html/XOOPS/templates_c/*
```
Konfigurasikan dalam tema:
```
html
<!-- In theme xoops_version.php -->
{Smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```
## Pengoptimuman Pangkalan Data### Tambah Indeks Pangkalan DataPangkalan data yang diindeks dengan betul membuat pertanyaan dengan lebih pantas.
```
sql
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
### Optimumkan JadualPengoptimuman jadual biasa meningkatkan prestasi:
```
sql
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
Buat skrip pengoptimuman automatik:
```
bash
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
Jadualkan dengan cron:
```
bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-XOOPS-db.sh
```
### Pengoptimuman PertanyaanSemak pertanyaan perlahan:
```
sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```
Teknik pengoptimuman biasa:
```
php
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
### Tingkatkan Kolam PenampanKonfigurasikan MySQL untuk caching yang lebih baik:Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```
ini
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
Mulakan semula MySQL:
```
bash
systemctl restart mysql
```
## Pengoptimuman Pelayan Web### Dayakan Pemampatan GzipMampatkan respons untuk mengurangkan lebar jalur:**Konfigurasi Apache:**
```
apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```
**Konfigurasi Nginx:**
```
nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```
Sahkan pemampatan:
```
bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/XOOPS/

# Should show:
# Content-Encoding: gzip
```
### Pengepala Caching PelayarTetapkan tamat tempoh cache untuk aset statik:**Apache:**
```
apache
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
```
nginx
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
### Sambungan Keep-AliveDayakan sambungan HTTP berterusan:**Apache:**
```
apache
<IfModule mod_http.c>
    KeepAlive On
    KeepAliveTimeout 15
    MaxKeepAliveRequests 100
</IfModule>
```
**Nginx:**
```
nginx
keepalive_timeout 15s;
keepalive_requests 100;
```
## Pengoptimuman Bahagian Hadapan### Optimumkan ImejKurangkan saiz fail imej:
```
bash
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
### Kecilkan CSS dan JavaScriptKurangkan saiz fail CSS/JS:**Menggunakan alat Node.js:**
```
bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```
**Menggunakan alat dalam talian:**
- Pemkecil CSS: https://cssminifier.com/
- Pengecil JavaScript: https://www.minifycode.com/javascript-minifier/### Muatkan Imej MalasMuatkan imej hanya apabila diperlukan:
```
html
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
### Kurangkan Sumber Menyekat RenderMuatkan CSS/JS secara strategik:
```
html
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
## Integrasi CDNGunakan Rangkaian Penyampaian Kandungan untuk akses global yang lebih pantas.### CDN popular| CDN | Kos | Ciri |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, Cache, Analitis |
| AWS CloudFront | Dibayar | Prestasi tinggi, global |
| Bunny CDN | Mampu Milik | Storan, video, cache |
| jsDelivr | Percuma | Perpustakaan JavaScript |
| cdnjs | Percuma | Perpustakaan popular |### Persediaan Cloudflare1. Daftar di https://www.cloudflare.com/
2. Tambahkan domain anda
3. Kemas kini pelayan nama dengan Cloudflare
4. Dayakan pilihan caching:
   - Tahap Cache: Agresif
   - Caching pada semua: Hidup
   - Caching Pelayar TTL: 1 bulan5. Dalam XOOPS, kemas kini domain anda untuk menggunakan Cloudflare DNS### Konfigurasikan CDN dalam XOOPSKemas kini URL imej kepada CDN:Edit templat tema:
```
html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```
Atau tetapkan dalam PHP:
```
php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$Smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```
## Pemantauan Prestasi### Ujian PageSpeed ​​InsightsUji prestasi tapak anda:1. Lawati Google PageSpeed Insights: https://pagespeed.web.dev/
2. Masukkan URL XOOPS anda
3. Semak cadangan
4. Melaksanakan cadangan penambahbaikan### Pemantauan Prestasi PelayanPantau metrik pelayan masa nyata:
```
bash
# Install monitoring tools
apt-get install htop iotop nethogs

# Monitor CPU and memory
htop

# Monitor disk I/O
iotop

# Monitor network
nethogs
```
### Pemprofilan Prestasi PHPKenal pasti kod PHP perlahan:
```
php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```
### Pemantauan Pertanyaan MySQLJejaki pertanyaan perlahan:
```
bash
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
## Senarai Semak Pengoptimuman PrestasiLaksanakan ini untuk prestasi terbaik:- [ ] **Caching:** Dayakan file/APCu/Memcache caching
- [ ] **Pangkalan data:** Tambah indeks, optimumkan jadual
- [ ] **Mampatan:** Dayakan pemampatan Gzip
- [ ] **Cache Pelayar:** Tetapkan pengepala cache
- [ ] **Imej:** Optimumkan dan mampatkan
- [ ] **CSS/JS:** Kecilkan fail
- [ ] **Lazy Loading:** Laksanakan untuk imej
- [ ] **CDN:** Gunakan untuk aset statik
- [ ] **Keep-Alive:** Dayakan sambungan berterusan
- [ ] **Modul:** Lumpuhkan modul yang tidak digunakan
- [ ] **Tema:** Gunakan tema yang ringan dan dioptimumkan
- [ ] **Pemantauan:** Jejaki metrik prestasi
- [ ] **Penyelenggaraan Tetap:** Kosongkan cache, optimumkan DB## Skrip Pengoptimuman PrestasiPengoptimuman automatik:
```
bash
#!/bin/bash
# Performance optimization script

echo "=== XOOPS Performance Optimization ==="

# Clear cache
echo "Clearing cache..."
rm -rf /var/www/html/XOOPS/cache/*
rm -rf /var/www/html/XOOPS/templates_c/*

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
find /var/www/html/XOOPS -type f -exec chmod 644 {} \;
find /var/www/html/XOOPS -type d -exec chmod 755 {} \;
chmod 777 /var/www/html/XOOPS/cache
chmod 777 /var/www/html/XOOPS/templates_c
chmod 777 /var/www/html/XOOPS/uploads
chmod 777 /var/www/html/XOOPS/var

# Generate performance report
echo "Performance Optimization Complete!"
echo ""
echo "Next steps:"
echo "1. Test site at https://pagespeed.web.dev/"
echo "2. Monitor performance in admin panel"
echo "3. Consider CDN for static assets"
echo "4. Review slow queries in MySQL"
```
## Metrik Sebelum dan SelepasJejaki penambahbaikan:
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
## Langkah Seterusnya1. Semak konfigurasi asas
2. Memastikan langkah keselamatan
3. Laksanakan caching
4. Pantau prestasi dengan alatan
5. Laraskan berdasarkan metrik---

**Tag:** #prestasi #pengoptimuman #caching #database #cdn**Artikel Berkaitan:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Tetapan Sistem
- Konfigurasi Keselamatan
- ../Installation/Server-Requirements