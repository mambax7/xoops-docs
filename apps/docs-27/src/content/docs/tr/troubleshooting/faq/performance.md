---
title: "Performans FAQ"
description: "XOOPS performans optimizasyonu hakkında sık sorulan sorular"
---
# Performans Sıkça Sorulan Sorular

> XOOPS performansını optimize etme ve yavaş siteleri teşhis etme hakkında sık sorulan sorular ve yanıtlar.

---

## Genel Performans

### S: XOOPS sitemin yavaş olup olmadığını nasıl anlarım?

**C:** Bu araçları ve ölçümleri kullanın:

1. **Sayfa Yükleme Süresi**:
```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://yoursite.com

# Or use online tools
# - PageSpeed Insights (Google)
# - GTmetrix
# - WebPageTest
```
2. **Hedef Metrikler**:
- İlk İçerikli Boya (FCP): < 1,8s
- En Büyük İçerikli Boya (LCP): < 2,5s
- İlk Bayta Kadar Geçen Süre (TTFB): < 0,6s
- Toplam sayfa boyutu: < 2-3 MB

3. **Sunucu Günlüklerini Kontrol Edin**:
```bash
# Apache
tail -100 /var/log/apache2/access.log

# Nginx
tail -100 /var/log/nginx/access.log

# Look for slow requests (> 1 second)
```
---

### S: En yaygın performans sorunları nelerdir?

**A:**
```mermaid
pie title Common Performance Issues
    "Unoptimized Database Queries" : 25
    "Large Uncompressed Assets" : 20
    "Missing Caching" : 20
    "Too Many Extensions/Plugins" : 15
    "Insufficient Server Resources" : 12
    "Unoptimized Images" : 8
```
---

### S: Optimizasyon çalışmalarımı nereye odaklamalıyım?

**C:** Optimizasyon önceliğini izleyin:
```mermaid
graph TD
    A[Performance Optimization] --> B["1. Caching"]
    A --> C["2. Database Queries"]
    A --> D["3. Asset Optimization"]
    A --> E["4. Code Optimization"]

    B --> B1["✓ Page caching"]
    B --> B2["✓ Object caching"]
    B --> B3["✓ Query caching"]

    C --> C1["✓ Add indexes"]
    C --> C2["✓ Optimize queries"]
    C --> C3["✓ Remove N+1"]

    D --> D1["✓ Compress images"]
    D --> D2["✓ Minify CSS/JS"]
    D --> D3["✓ Enable gzip"]

    E --> E1["✓ Remove bloat"]
    E --> E2["✓ Lazy loading"]
    E --> E3["✓ Code refactoring"]
```
---

## Önbelleğe alma

### S: XOOPS'de önbelleğe almayı nasıl etkinleştiririm?

**A:** XOOPS yerleşik önbelleğe alma özelliğine sahiptir. Yönetici > Ayarlar > Performans'ta yapılandırın:
```php
<?php
// Check cache settings in mainfile.php or admin
// Common cache types:
// 1. file - File-based cache (default)
// 2. memcache - Memcached (if installed)
// 3. redis - Redis (if installed)

// In code, use cache:
$cache = xoops_cache_handler::getInstance();

// Read from cache
$data = $cache->read('cache_key');

if ($data === false) {
    // Not in cache, get from source
    $data = expensive_operation();

    // Write to cache (3600 = 1 hour)
    $cache->write('cache_key', $data, 3600);
}
?>
```
---

### S: Ne tür önbelleğe alma kullanmalıyım?

**C:**
- **Dosya Önbelleği**: Varsayılan, basit, ekstra kurulum gerektirmez. Küçük siteler için iyi.
- **Memcache**: Daha hızlı, bellek tabanlı. Yüksek trafikli siteler için daha iyidir.
- **Redis**: En güçlüsü, daha fazla veri türünü destekler. Ölçeklendirme için en iyisi.

Yükleyin ve etkinleştirin:
```bash
# Install Memcached
sudo apt-get install memcached php-memcached

# Or install Redis
sudo apt-get install redis-server php-redis

# Restart PHP-FPM or Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```
Daha sonra XOOPS admin'de etkinleştirin.

---

### S: XOOPS önbelleğini nasıl temizlerim?

**A:**
```bash
# Clear all cache
rm -rf xoops_data/caches/*

# Clear Smarty cache specifically
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Or in admin panel
Go to Admin > System > Maintenance > Clear Cache
```
Kodda:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// Or clear specific keys
$cache->delete('cache_key');
?>
```
---

### S: Verileri ne kadar süreyle önbelleğe almalıyım?

**C:** Veri güncelliği gereksinimlerine bağlıdır:
```php
<?php
// 5 minutes - Frequently changing data
$cache->write('key', $data, 300);

// 1 hour - Semi-static data
$cache->write('key', $data, 3600);

// 24 hours - Static data, images, etc.
$cache->write('key', $data, 86400);

// No expiration (until manual clear)
$cache->write('key', $data, 0);

// Cache during current request only
$cache->write('key', $data, 1);
?>
```
---

## database Optimizasyonu

### S: Yavaş database sorgularını nasıl bulabilirim?

**A:** Sorgu günlüğünü etkinleştirin:
```php
<?php
// In mainfile.php
define('XOOPS_DB_DEBUGMODE', true);
define('XOOPS_SQL_DEBUG', true);

// Then check xoops_log table
SELECT * FROM xoops_log WHERE logid > SOME_NUMBER
ORDER BY created DESC LIMIT 20;
?>
```
Veya MySQL yavaş sorgu günlüğünü kullanın:
```bash
# Enable in /etc/mysql/my.cnf
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1  # Log queries > 1 second

# View slow queries
tail -100 /var/log/mysql/slow.log
```
---

### S: database sorgularını nasıl optimize edebilirim?

**C:** Şu adımları izleyin:

**1. database Dizinleri Ekle**
```sql
-- Add index to frequently searched columns
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- Check if index helps
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```
**2. LIMIT ve Sayfalandırma** kullanın
```php
<?php
// WRONG - Gets all records
$result = $db->query("SELECT * FROM xoops_articles");

// CORRECT - Gets 10 records starting at offset
$limit = 10;
$offset = 0;  // Change with pagination
$result = $db->query(
    "SELECT * FROM xoops_articles LIMIT $limit OFFSET $offset"
);
?>
```
**3. Yalnızca Gerekli Sütunları Seçin**
```php
<?php
// WRONG
$result = $db->query("SELECT * FROM xoops_articles");

// CORRECT
$result = $db->query(
    "SELECT id, title, author_id, created FROM xoops_articles"
);
?>
```
**4. N+1 Sorgudan Kaçının**
```php
<?php
// WRONG - N+1 problem
$articles = $db->query("SELECT * FROM xoops_articles");
while ($article = $articles->fetch_assoc()) {
    // This query runs once per article!
    $author = $db->query(
        "SELECT * FROM xoops_users WHERE uid = " . $article['author_id']
    );
}

// CORRECT - Use JOIN
$result = $db->query("
    SELECT a.*, u.uname, u.email
    FROM xoops_articles a
    JOIN xoops_users u ON a.author_id = u.uid
");

while ($row = $result->fetch_assoc()) {
    echo $row['title'] . " by " . $row['uname'];
}
?>
```
**5. Sorguları Analiz Etmek İçin EXPLAIN'yi Kullanın**
```sql
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5 AND status = 1;

-- Look for:
-- - type: ALL (bad), INDEX (ok), const/ref (good)
-- - possible_keys: Should show available indexes
-- - key: Should use best index
-- - rows: Should be low number
```
---

### S: database yükünü nasıl azaltabilirim?

**C:**
1. **Sorgu sonuçlarını önbelleğe alın**:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$articles = $cache->read('all_articles');

if ($articles === false) {
    $result = $db->query("SELECT * FROM xoops_articles");
    $articles = $result->fetch_all();
    $cache->write('all_articles', $articles, 3600);
}
?>
```
2. **Eski verileri arşivleyin** ayrı tablolara
3. **Günlükleri düzenli olarak temizleyin**:
```bash
# Delete old log entries (older than 30 days)
DELETE FROM xoops_log WHERE created < NOW() - INTERVAL 30 DAY;
```
4. **Sorgu önbelleğini etkinleştir** (MySQL):
```sql
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456;  -- 256 MB
```
---

## Varlık Optimizasyonu

### S: CSS ve JavaScript'yi nasıl optimize edebilirim?

**C:**

**1. Dosyaları Küçült**:
```bash
# Using online tools
# - cssminifier.com
# - javascript-minifier.com
# - minify.org

# Or with command-line tools
sudo apt-get install yui-compressor closure-compiler
yui-compressor file.css -o file.min.css
```
**2. İlgili Dosyaları Birleştir**:
```html
{* Instead of many files *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style1.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style2.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style3.css">

{* Combine into one *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
```
**3. Kritik Olmayan Ertele JavaScript**:
```html
{* Critical JS - load immediately *}
<script src="critical.js"></script>

{* Non-critical JS - load after page *}
<script src="analytics.js" defer></script>
<script src="ads.js" async></script>
```
**4. Gzip Sıkıştırmasını Etkinleştir** (.htaccess):
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/xml
</IfModule>
```
---

### S: Görüntüleri nasıl optimize ederim?

**C:**

**1. Doğru Formatı Seçin**:
- JPG: Fotoğraflar ve karmaşık görüntüler
- PNG: Şeffaf grafikler ve resimler
- WebP: Modern tarayıcılar, daha iyi sıkıştırma
- AVIF: En yeni, en iyi sıkıştırma

**2. Görüntüleri Sıkıştırın**:
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# Using ImageOptim
imageoptim image.jpg

# Online tools
# - imagecompressor.com
# - tinypng.com
```
**3. Duyarlı Görseller Sunma**:
```html
{* Serve different sizes *}
<picture>
    <source srcset="image-large.webp" type="image/webp" media="(min-width: 1200px)">
    <source srcset="image-medium.webp" type="image/webp" media="(min-width: 768px)">
    <source srcset="image-small.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```
**4. Tembel Yükleme Resimleri**:
```html
{* Native lazy loading *}
<img src="image.jpg" loading="lazy" alt="description">

{* Or with JavaScript library *}
<script src="https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js"></script>
<img src="placeholder.jpg" data-src="image.jpg" class="lazyload" alt="description">
```
---

## Sunucu Yapılandırması

### S: Sunucu performansını nasıl kontrol ederim?

**A:**
```bash
# CPU and Memory
top -b -n 1 | head -20
free -h
df -h

# Check PHP-FPM processes
ps aux | grep php-fpm

# Check Apache/Nginx connections
netstat -an | grep ESTABLISHED | wc -l

# Monitor in real-time
watch 'free -h && echo "---" && df -h'
```
---

### S: PHP'yi XOOPS için nasıl optimize edebilirim?

**A:** Düzenle `/etc/php/8.x/fpm/php.ini`:
```ini
; Increase limits for XOOPS
max_execution_time = 300         ; 30 seconds default
memory_limit = 512M              ; 128MB default
upload_max_filesize = 100M       ; 2MB default
post_max_size = 100M             ; 8MB default

; Enable opcache for performance
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 0   ; Production: 0 (reload on restart)
opcache.revalidate_freq = 0       ; Production: 0 or high number

; Database
default_socket_timeout = 60
mysqli.default_socket = /run/mysqld/mysqld.sock
```
Ardından PHP'yi yeniden başlatın:
```bash
sudo systemctl restart php8.2-fpm
# or
sudo systemctl restart apache2
```
---

### S: HTTP/2 ve sıkıştırmayı nasıl etkinleştiririm?

**C:** Apache (.htaccess) için:
```apache
# Enable HTTPS (required for HTTP/2)
<IfModule mod_ssl.c>
    Protocols h2 http/1.1
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```
Nginx için (nginx.conf):
```nginx
http {
    # Enable gzip
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;

    # Enable HTTP/2
    listen 443 ssl http2;

    # Browser caching
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```
---

## İzleme ve Teşhis

### S: XOOPS performansını zaman içinde nasıl izlerim?

**C:**

**1. Google Analytics'i kullanın**:
- Önemli Web Verileri
- Sayfa yükleme süreleri
- user davranışı

**2. Sunucu İzleme Araçlarını Kullanın**:
```bash
# Install Glances (system monitor)
sudo apt-get install glances
glances

# Or use New Relic, DataDog, etc.
```
**3. İstekleri Günlüğe Kaydedip Analiz Edin**:
```bash
# Get average response time
grep "GET /index.php" /var/log/apache2/access.log | \
  awk '{print $NF}' | \
  sort -n | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count " ms"}'
```
---

### S: Bellek sızıntılarını nasıl tespit edebilirim?

**A:**
```php
<?php
// In code, track memory usage
$start_memory = memory_get_usage();

// Do operations
for ($i = 0; $i < 1000; $i++) {
    $array[] = expensive_operation();
}

$end_memory = memory_get_usage();
$used = ($end_memory - $start_memory) / 1024 / 1024;

if ($used > 50) {  // Alert if > 50MB
    error_log("Memory leak detected: " . $used . " MB");
}

// Check peak memory
$peak = memory_get_peak_usage();
echo "Peak memory: " . ($peak / 1024 / 1024) . " MB";
?>
```
---

## Performans Kontrol Listesi
```mermaid
graph TD
    A[Performance Optimization Checklist] --> B["Infrastructure"]
    A --> C["Caching"]
    A --> D["Database"]
    A --> E["Assets"]

    B --> B1["✓ PHP 8.x installed"]
    B --> B2["✓ Opcache enabled"]
    B --> B3["✓ Sufficient RAM"]
    B --> B4["✓ SSD storage"]

    C --> C1["✓ Page caching enabled"]
    C --> C2["✓ Object caching enabled"]
    C --> C3["✓ Browser caching set"]
    C --> C4["✓ CDN configured"]

    D --> D1["✓ Indexes added"]
    D --> D2["✓ Slow queries fixed"]
    D --> D3["✓ Old data archived"]
    D --> D4["✓ Query logs cleaned"]

    E --> E1["✓ CSS minified"]
    E --> E2["✓ JS minified"]
    E --> E3["✓ Images optimized"]
    E --> E4["✓ Gzip enabled"]
```
---

## İlgili Belgeler

- database Hata Ayıklama
- Hata Ayıklama Modunu Etkinleştir
- module FAQ
- Performans Optimizasyonu

---

#xoops #performans #optimizasyon #sss #sorun giderme #önbelleğe alma