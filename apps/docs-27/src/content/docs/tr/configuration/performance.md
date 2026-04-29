---
title: "Performans Optimizasyonu"
description: "Önbelleğe alma, database optimizasyonu, CDN entegrasyonu ve performans izlemeyi içeren XOOPS için hız optimizasyon kılavuzu"
---
# XOOPS Performans Optimizasyonu

Maksimum hız ve verimlilik için XOOPS'yi optimize etmeye yönelik kapsamlı kılavuz.

## Performans Optimizasyonuna Genel Bakış
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
## Önbelleğe Alma Yapılandırması

Önbelleğe alma, performansı artırmanın en hızlı yoludur.

### Sayfa Düzeyinde Önbelleğe Alma

XOOPS'de tam sayfa önbelleğe almayı etkinleştirin:

**Yönetici Paneli > Sistem > Tercihler > cache Ayarları**
```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```
### Dosya Tabanlı Önbelleğe Alma

Dosya cache konumunu yapılandırın:
```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```
### APCu Önbelleğe Alma

APCu bellek içi önbelleğe alma sağlar (çok hızlı):
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
XOOPS'de etkinleştirin:

**Yönetici Paneli > Sistem > Tercihler > cache Ayarları**
```
Cache Type: APCu
```
### Memcache/Redis Önbelleğe alma

Yüksek trafikli siteler için dağıtılmış önbelleğe alma:

**Memcache'i yükleyin:**
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
**XOOPS'de yapılandırın:**

Mainfile.php'yi düzenleyin:
```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```
Veya yönetici panelinde:
```
Cache Type: Memcache
Memcache Host: localhost:11211
```
### template Önbelleğe Alma

XOOPS şablonlarını derleyin ve önbelleğe alın:
```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```
Temada yapılandırın:
```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```
## database Optimizasyonu

### database Dizinleri Ekle

Düzgün şekilde indekslenmiş veritabanları çok daha hızlı sorgulanır.
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
### Tabloları Optimize Et

Düzenli tablo optimizasyonu performansı artırır:
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
Otomatik optimizasyon komut dosyası oluşturun:
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
Cron ile zamanlama:
```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```
### Sorgu Optimizasyonu

Yavaş sorguları inceleyin:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```
Yaygın optimizasyon teknikleri:
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
### Tampon Havuzunu Artırın

Daha iyi önbelleğe alma için MySQL'yi yapılandırın:

`/etc/mysql/mysql.conf.d/mysqld.cnf`'yi düzenleyin:
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
MySQL'yi yeniden başlatın:
```bash
systemctl restart mysql
```
## Web Sunucusu Optimizasyonu

### Gzip Sıkıştırmasını Etkinleştir

Bant genişliğini azaltmak için yanıtları sıkıştırın:

**Apache Yapılandırması:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```
**Nginx Yapılandırması:**
```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```
Sıkıştırmayı doğrulayın:
```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```
### Tarayıcı Önbelleğe Alma Başlıkları

Statik varlıklar için cache süresinin dolmasını ayarlayın:

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
### Bağlantıyı Canlı Tutma

Kalıcı HTTP bağlantılarını etkinleştirin:

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
## Ön Uç Optimizasyonu

### Görselleri Optimize Etme

Resim dosyası boyutlarını azaltın:
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
### CSS ve JavaScript'yi küçültün

CSS/JS dosya boyutlarını azaltın:

**Node.js araçlarını kullanma:**
```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```
**Çevrimiçi araçları kullanma:**
- CSS Küçültücü: https://cssminifier.com/
- JavaScript Küçültücü: https://www.minifycode.com/javascript-minifier/

### Tembel Yükleme Resimleri

Resimleri yalnızca gerektiğinde yükleyin:
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
### Oluşturmayı Engelleyen Kaynakları Azaltın

CSS/JS'yi stratejik olarak yükleyin:
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
## CDN Entegrasyon

Daha hızlı küresel erişim için İçerik Dağıtım Ağı kullanın.

### Popüler CDN'ler

| CDN | Maliyet | Özellikler |
|---|---|---|
| Bulut parlaması | Free/Paid | DDoS, DNS, cache, Analitik |
| AWS CloudFront | Ücretli | Yüksek performanslı, küresel |
| Tavşan CDN | Uygun fiyatlı | Depolama, video, cache |
| jsDelivr | Ücretsiz | JavaScript kütüphaneleri |
| cdnj'ler | Ücretsiz | Popüler kütüphaneler |

### Cloudflare Kurulumu

1. https://www.cloudflare.com/ adresinden kaydolun
2. Alanınızı ekleyin
3. Ad sunucularını Cloudflare ile güncelleyin
4. Önbelleğe alma seçeneklerini etkinleştirin:
   - cache Düzeyi: Agresif
   - Her şeyi önbelleğe alma: Açık
   - Tarayıcı Önbelleğe Alma TTL: 1 ay

5. XOOPS'de alan adınızı Cloudflare DNS kullanacak şekilde güncelleyin

### CDN'yi XOOPS'de yapılandırın

URLs resmini CDN olarak güncelleyin:

theme şablonunu düzenle:
```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```
Veya PHP olarak ayarlayın:
```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```
## Performans İzleme

### PageSpeed Insights Testi

Sitenizin performansını test edin:

1. Google PageSpeed Insights'ı ziyaret edin: https://pagespeed.web.dev/
2. XOOPS URL numaranızı girin
3. Önerileri inceleyin
4. Önerilen iyileştirmeleri uygulayın

### Sunucu Performansı İzleme

Gerçek zamanlı sunucu ölçümlerini izleyin:
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
### PHP Performans Profili Oluşturma

Yavaş PHP kodunu tanımlayın:
```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```
### MySQL Sorgu İzleme

Yavaş sorguları izleyin:
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
## Performans Optimizasyonu Kontrol Listesi

En iyi performans için bunları uygulayın:

- [ ] **Önbelleğe alma:** file/APCu/Memcache önbelleğe almayı etkinleştir
- [ ] **database:** Dizinler ekleyin, tabloları optimize edin
- [ ] **Sıkıştırma:** Gzip sıkıştırmasını etkinleştir
- [ ] **Tarayıcı Önbelleği:** cache başlıklarını ayarlayın
- [ ] **Resimler:** Optimize edin ve sıkıştırın
- [ ] **CSS/JS:** Dosyaları küçült
- [ ] **Tembel Yükleme:** Resimler için uygulama
- [ ] **CDN:** Statik varlıklar için kullanın
- [ ] **Canlı Tut:** Kalıcı bağlantıları etkinleştir
- [ ] **modules:** Kullanılmayan modülleri devre dışı bırakın
- [ ] **themes:** Hafif, optimize edilmiş themes kullanın
- [ ] **İzleme:** Performans ölçümlerini izleyin
- [ ] **Düzenli Bakım:** Önbelleği temizleyin, Veritabanını optimize edin

## Performans Optimizasyonu Komut Dosyası

Otomatik optimizasyon:
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
## Metriklerden Önce ve Sonra

İyileştirmeleri izleyin:
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
## Sonraki Adımlar

1. Temel yapılandırmayı gözden geçirin
2. Güvenlik önlemlerini sağlayın
3. Önbelleğe almayı uygulayın
4. Performansı araçlarla izleyin
5. Metriklere göre ayarlama yapın

---

**Etiketler:** #performans #optimizasyon #önbelleğe alma #database #cdn

**İlgili Makaleler:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Sistem Ayarları
- Güvenlik Yapılandırması
- ../Installation/Server-Requirements