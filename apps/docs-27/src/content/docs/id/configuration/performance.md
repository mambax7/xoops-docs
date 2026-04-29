---
title: "Optimasi Kinerja"
description: "Panduan pengoptimalan kecepatan untuk XOOPS termasuk caching, pengoptimalan database, integrasi CDN, dan pemantauan kinerja"
---

# XOOPS Optimasi Kinerja

Panduan komprehensif untuk mengoptimalkan XOOPS untuk kecepatan dan efisiensi maksimum.

## Ikhtisar Pengoptimalan Kinerja

```mermaid
graph TD
    A[Performance] --> B[Caching]
    A --> C[Database]
    A --> D[Web Server]
    A --> E[front-end]
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

## Konfigurasi Caching

Caching adalah cara tercepat untuk meningkatkan kinerja.

### Caching Tingkat Halaman

Aktifkan cache halaman penuh di XOOPS:

**Panel Admin > Sistem > Preferensi > Pengaturan Cache**

```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```

### Caching Berbasis File

Konfigurasikan lokasi cache file:

```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```

### Penembolokan APCu

APCu menyediakan cache dalam memori (sangat cepat):

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

Aktifkan di XOOPS:

**Panel Admin > Sistem > Preferensi > Pengaturan Cache**

```
Cache Type: APCu
```

### Penembolokan Memcache/Redis

Caching terdistribusi untuk situs dengan lalu lintas tinggi:

**Instal Memcache:**

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

**Konfigurasi di XOOPS:**

Sunting mainfile.php:

```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```

Atau di panel admin:

```
Cache Type: Memcache
Memcache Host: localhost:11211
```

### Penyimpanan template

Kompilasi dan cache template XOOPS:

```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```

Konfigurasikan dalam theme:

```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```

## Optimasi Basis Data

### Tambahkan Indeks Basis Data

Basis data yang diindeks dengan benar membuat kueri lebih cepat.

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

### Optimalkan Tabel

Pengoptimalan tabel reguler meningkatkan kinerja:

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

Buat skrip pengoptimalan otomatis:

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

Jadwalkan dengan cron:

```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```

### Optimasi Kueri

Tinjau kueri yang lambat:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```

Teknik optimasi umum:

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

### Meningkatkan Kumpulan Buffer

Konfigurasikan MySQL untuk caching yang lebih baik:

Sunting `/etc/mysql/mysql.conf.d/mysqld.cnf`:

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

Mulai ulang MySQL:

```bash
systemctl restart mysql
```

## Optimasi Server Web

### Aktifkan Kompresi Gzip

Kompres respons untuk mengurangi bandwidth:

**Konfigurasi Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```

**Konfigurasi Nginx:**

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```

Verifikasi kompresi:

```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```

### Header Caching Browser

Tetapkan masa berlaku cache untuk aset statis:

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

### Koneksi Tetap Hidup

Aktifkan koneksi HTTP persisten:

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

## Optimasi Bagian Depan

### Optimalkan Gambar

Kurangi ukuran file gambar:

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

### Perkecil CSS dan JavaScript

Kurangi ukuran file CSS/JS:

**Menggunakan alat Node.js:**

```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```

**Menggunakan alat online:**
- CSS Pengurang: https://cssminifier.com/
- JavaScript Pengurang: https://www.minifycode.com/javascript-minifier/

### Malas Memuat Gambar

Muat gambar hanya bila diperlukan:

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

### Kurangi Sumber Daya yang Memblokir Render

Muat CSS/JS secara strategis:

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

## Integrasi CDN

Gunakan Jaringan Pengiriman Konten untuk akses global yang lebih cepat.

### CDN Populer

| CDN | Biaya | Fitur |
|---|---|---|
| awan suar | Free/Paid | DDoS, DNS, Cache, Analisis |
| AWS CloudFront | Berbayar | Performa tinggi, global |
| Kelinci CDN | Terjangkau | Penyimpanan, video, cache |
| jsDelivr | Gratis | Perpustakaan JavaScript |
| cdnjs | Gratis | Perpustakaan populer |

### Pengaturan Cloudflare

1. Daftar di https://www.cloudflare.com/
2. Tambahkan domain Anda
3. Perbarui server nama dengan Cloudflare
4. Aktifkan opsi cache:
   - Tingkat Cache: Agresif
   - Menyimpan cache pada semuanya: Aktif
   - TTL Caching Browser: 1 bulan

5. Di XOOPS, perbarui domain Anda untuk menggunakan Cloudflare DNS

### Konfigurasikan CDN di XOOPS

Perbarui URL gambar ke CDN:

Edit template theme:

```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```

Atau atur di PHP:

```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```

## Pemantauan Kinerja

### Pengujian Wawasan PageSpeed

Uji kinerja situs Anda:

1. Kunjungi Google PageSpeed ​​Insights: https://pagespeed.web.dev/
2. Masukkan XOOPS URL Anda
3. Tinjau rekomendasi
4. Melaksanakan perbaikan yang disarankan

### Pemantauan Kinerja Server

Pantau metrik server waktu nyata:

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

### Profil Kinerja PHP

Identifikasi kode PHP yang lambat:

```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```

### Pemantauan Kueri MySQL

Lacak kueri lambat:

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

## Daftar Periksa Pengoptimalan KinerjaTerapkan ini untuk kinerja terbaik:

- [ ] **Caching:** Aktifkan cache file/APCu/Memcache
- [ ] **Database:** Tambahkan indeks, optimalkan tabel
- [ ] **Kompresi:** Aktifkan kompresi Gzip
- [ ] **Cache Browser:** Menyetel header cache
- [ ] **Gambar:** Optimalkan dan kompres
- [ ] **CSS/JS:** Perkecil file
- [ ] **Pemuatan Lambat:** Implementasi untuk gambar
- [ ] **CDN:** Digunakan untuk aset statis
- [ ] **Keep-Alive:** Mengaktifkan koneksi persisten
- [ ] **module:** Nonaktifkan module yang tidak digunakan
- [ ] **theme:** Gunakan theme ringan dan optimal
- [ ] **Pemantauan:** Melacak metrik kinerja
- [ ] **Pemeliharaan Reguler:** Hapus cache, optimalkan DB

## Skrip Pengoptimalan Kinerja

Pengoptimalan otomatis:

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

## Metrik Sebelum dan Sesudah

Lacak peningkatan:

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

## Langkah Selanjutnya

1. Tinjau konfigurasi dasar
2. Pastikan langkah-langkah keamanan
3. Menerapkan cache
4. Pantau kinerja dengan alat
5. Sesuaikan berdasarkan metrik

---

**Tag:** #kinerja #optimisasi #caching #database #cdn

**Artikel Terkait:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Pengaturan Sistem
- Konfigurasi Keamanan
- ../Installation/Server-Requirements
