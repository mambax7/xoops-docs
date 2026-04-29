---
title: "ประสิทธิภาพ FAQ"
description: "คำถามที่พบบ่อยเกี่ยวกับการเพิ่มประสิทธิภาพ XOOPS"
---
# ประสิทธิภาพคำถามที่พบบ่อย

> คำถามและคำตอบทั่วไปเกี่ยวกับการเพิ่มประสิทธิภาพ XOOPS และการวินิจฉัยไซต์ที่ช้า

---

## ประสิทธิภาพทั่วไป

### ถาม: ฉันจะรู้ได้อย่างไรว่าไซต์ XOOPS ของฉันช้าหรือไม่

**ตอบ:** ใช้เครื่องมือและเมตริกเหล่านี้:

1. **เวลาในการโหลดหน้าเว็บ**:
```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://yoursite.com

# Or use online tools
# - PageSpeed Insights (Google)
# - GTmetrix
# - WebPageTest
```
2. **ตัวชี้วัดเป้าหมาย**:
- ระบายสีเนื้อหาครั้งแรก (FCP): < 1.8 วินาที
- สีที่มีเนื้อหามากที่สุด (LCP): < 2.5 วินาที
- เวลาในการไบต์แรก (TTFB): < 0.6 วินาที
- ขนาดหน้าทั้งหมด: < 2-3 MB

3. **ตรวจสอบบันทึกเซิร์ฟเวอร์**:
```bash
# Apache
tail -100 /var/log/apache2/access.log

# Nginx
tail -100 /var/log/nginx/access.log

# Look for slow requests (> 1 second)
```
---

### ถาม: อะไรคือปัญหาด้านประสิทธิภาพที่พบบ่อยที่สุด?

**ก:**
```
mermaid
pie title Common Performance Issues
    "Unoptimized Database Queries" : 25
    "Large Uncompressed Assets" : 20
    "Missing Caching" : 20
    "Too Many Extensions/Plugins" : 15
    "Insufficient Server Resources" : 12
    "Unoptimized Images" : 8
```
---

### ถาม: ฉันควรมุ่งเน้นการเพิ่มประสิทธิภาพไปที่ใด

**ก:** ปฏิบัติตามลำดับความสำคัญในการเพิ่มประสิทธิภาพ:
```
mermaid
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

## แคช

### ถาม: ฉันจะเปิดใช้งานการแคชใน XOOPS ได้อย่างไร

**ตอบ:** XOOPS มีแคชในตัว กำหนดค่าในผู้ดูแลระบบ > การตั้งค่า > ประสิทธิภาพ:
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

### ถาม: ฉันควรใช้แคชประเภทใด?

**ก:**
- **แคชไฟล์**: ค่าเริ่มต้น เรียบง่าย ไม่มีการตั้งค่าเพิ่มเติม เหมาะสำหรับไซต์ขนาดเล็ก
- **Memcache**: เร็วขึ้น อิงตามหน่วยความจำ ดีกว่าสำหรับไซต์ที่มีการเข้าชมสูง
- **Redis**: ทรงพลังที่สุด รองรับประเภทข้อมูลได้มากกว่า ดีที่สุดสำหรับการปรับขนาด

ติดตั้งและเปิดใช้งาน:
```bash
# Install Memcached
sudo apt-get install memcached php-memcached

# Or install Redis
sudo apt-get install redis-server php-redis

# Restart PHP-FPM or Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```
จากนั้นเปิดใช้งานใน XOOPS admin

---

### ถาม: ฉันจะล้างแคช XOOPS ได้อย่างไร

**ก:**
```bash
# Clear all cache
rm -rf xoops_data/caches/*

# Clear Smarty cache specifically
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Or in admin panel
Go to Admin > System > Maintenance > Clear Cache
```
ในรหัส:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// Or clear specific keys
$cache->delete('cache_key');
?>
```
---

### ถาม: ฉันควรแคชข้อมูลนานแค่ไหน?

**ตอบ:** ขึ้นอยู่กับข้อกำหนดความใหม่ของข้อมูล:
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

## การเพิ่มประสิทธิภาพฐานข้อมูล

### ถาม: ฉันจะค้นหาการสืบค้นฐานข้อมูลที่ช้าได้อย่างไร

**ก:** เปิดใช้งานการบันทึกคำค้นหา:
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
หรือใช้บันทึกการสืบค้นที่ช้าของ MySQL:
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

### ถาม: ฉันจะเพิ่มประสิทธิภาพการสืบค้นฐานข้อมูลได้อย่างไร

**ก:** ทำตามขั้นตอนเหล่านี้:

**1. เพิ่มดัชนีฐานข้อมูล**
```sql
-- Add index to frequently searched columns
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- Check if index helps
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```
**2. ใช้ LIMIT และการแบ่งหน้า**
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
**3. เลือกเฉพาะคอลัมน์ที่ต้องการ**
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
**4. หลีกเลี่ยงการสืบค้น N+1**
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
**5. ใช้ EXPLAIN เพื่อวิเคราะห์คำค้นหา**
```sql
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5 AND status = 1;

-- Look for:
-- - type: ALL (bad), INDEX (ok), const/ref (good)
-- - possible_keys: Should show available indexes
-- - key: Should use best index
-- - rows: Should be low number
```
---

### ถาม: ฉันจะลดภาระฐานข้อมูลได้อย่างไร?

**ก:**
1. **ผลลัพธ์การค้นหาแคช**:
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
2. **เก็บข้อมูลเก่า** ลงในตารางแยกกัน
3. **ล้างบันทึก** เป็นประจำ:
```bash
# Delete old log entries (older than 30 days)
DELETE FROM xoops_log WHERE created < NOW() - INTERVAL 30 DAY;
```
4. **เปิดใช้งานแคชแบบสอบถาม** (MySQL):
```sql
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456;  -- 256 MB
```
---

## การเพิ่มประสิทธิภาพสินทรัพย์

### ถาม: ฉันจะเพิ่มประสิทธิภาพ CSS และ JavaScript ได้อย่างไร

**ก:**

**1. ย่อขนาดไฟล์**:
```bash
# Using online tools
# - cssminifier.com
# - javascript-minifier.com
# - minify.org

# Or with command-line tools
sudo apt-get install yui-compressor closure-compiler
yui-compressor file.css -o file.min.css
```
**2. รวมไฟล์ที่เกี่ยวข้อง**:
```html
{* Instead of many files *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style1.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style2.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style3.css">

{* Combine into one *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
```
**3. เลื่อน JavaScript ที่ไม่สำคัญ**:
```html
{* Critical JS - load immediately *}
<script src="critical.js"></script>

{* Non-critical JS - load after page *}
<script src="analytics.js" defer></script>
<script src="ads.js" async></script>
```
**4. เปิดใช้งานการบีบอัด Gzip** (.htaccess):
```
apache
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

### ถาม: ฉันจะปรับภาพให้เหมาะสมได้อย่างไร

**ก:**

**1. เลือกรูปแบบที่ถูกต้อง**:
- JPG: รูปภาพและรูปภาพที่ซับซ้อน
- PNG: กราฟิกและรูปภาพที่มีความโปร่งใส
- WebP: เบราว์เซอร์สมัยใหม่ การบีบอัดที่ดีขึ้น
- AVIF: ใหม่ล่าสุด การบีบอัดที่ดีที่สุด

**2. บีบอัดรูปภาพ**:
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# Using ImageOptim
imageoptim image.jpg

# Online tools
# - imagecompressor.com
# - tinypng.com
```
**3. แสดงภาพที่ตอบสนอง**:
```html
{* Serve different sizes *}
<picture>
    <source srcset="image-large.webp" type="image/webp" media="(min-width: 1200px)">
    <source srcset="image-medium.webp" type="image/webp" media="(min-width: 768px)">
    <source srcset="image-small.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```
**4. รูปภาพโหลดขี้เกียจ**:
```html
{* Native lazy loading *}
<img src="image.jpg" loading="lazy" alt="description">

{* Or with JavaScript library *}
<script src="https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js"></script>
<img src="placeholder.jpg" data-src="image.jpg" class="lazyload" alt="description">
```
---

## การกำหนดค่าเซิร์ฟเวอร์

### ถาม: ฉันจะตรวจสอบประสิทธิภาพของเซิร์ฟเวอร์ได้อย่างไร?

**ก:**
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

### ถาม: ฉันจะเพิ่มประสิทธิภาพ PHP สำหรับ XOOPS ได้อย่างไร

**ตอบ:** แก้ไข `/etc/php/8.x/fpm/php.ini`:
```
ini
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
จากนั้นรีสตาร์ท PHP:
```bash
sudo systemctl restart php8.2-fpm
# or
sudo systemctl restart apache2
```
---

### ถาม: ฉันจะเปิดใช้งาน HTTP/2 และการบีบอัดได้อย่างไร

**ตอบ:** สำหรับ Apache (.htaccess):
```
apache
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
สำหรับ Nginx (nginx.conf):
```
nginx
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

## การตรวจสอบและวินิจฉัย

### ถาม: ฉันจะตรวจสอบประสิทธิภาพ XOOPS เมื่อเวลาผ่านไปได้อย่างไร

**ก:**

**1. ใช้ Google Analytics**:
- Core Web Vitals
- เวลาในการโหลดหน้า
- พฤติกรรมผู้ใช้

**2. ใช้เครื่องมือตรวจสอบเซิร์ฟเวอร์**:
```bash
# Install Glances (system monitor)
sudo apt-get install glances
glances

# Or use New Relic, DataDog, etc.
```
**3. บันทึกและวิเคราะห์คำขอ**:
```bash
# Get average response time
grep "GET /index.php" /var/log/apache2/access.log | \
  awk '{print $NF}' | \
  sort -n | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count " ms"}'
```
---

### ถาม: ฉันจะระบุหน่วยความจำรั่วได้อย่างไร

**ก:**
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

## รายการตรวจสอบประสิทธิภาพ
```
mermaid
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

## เอกสารที่เกี่ยวข้อง

- การดีบักฐานข้อมูล
- เปิดใช้งานโหมดแก้ไขข้อบกพร่อง
- โมดูล FAQ
- การเพิ่มประสิทธิภาพการทำงาน

---

#xoops #ประสิทธิภาพ #การเพิ่มประสิทธิภาพ #คำถามที่พบบ่อย #การแก้ไขปัญหา #แคช