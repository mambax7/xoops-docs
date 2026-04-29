---
title: "سوالات متداول عملکرد"
description: "سوالات متداول در مورد بهینه سازی عملکرد XOOPS"
---
# عملکرد سوالات متداول

> پرسش ها و پاسخ های رایج در مورد بهینه سازی عملکرد XOOPS و تشخیص سایت های کند.

---

## عملکرد عمومی

### س: چگونه می توانم بفهمم که سایت XOOPS من کند است؟

**A:** از این ابزارها و معیارها استفاده کنید:

1. **زمان بارگذاری صفحه**:
```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://yoursite.com

# Or use online tools
# - PageSpeed Insights (Google)
# - GTmetrix
# - WebPageTest
```

2. ** معیارهای هدف **:
- First Contentful Paint (FCP): < 1.8s
- بزرگترین رنگ محتوایی (LCP): < 2.5 ثانیه
- زمان تا اولین بایت (TTFB): < 0.6 ثانیه
- حجم کل صفحه: < 2-3 مگابایت

3. **گزارش سرور را بررسی کنید**:
```bash
# Apache
tail -100 /var/log/apache2/access.log

# Nginx
tail -100 /var/log/nginx/access.log

# Look for slow requests (> 1 second)
```

---

### س: رایج ترین مشکلات عملکرد چیست؟

**الف:**
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

### س: کجا باید تلاش های بهینه سازی خود را متمرکز کنم؟

**A:** اولویت بهینه سازی را دنبال کنید:

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

## ذخیره سازی

### س: چگونه کش کردن را در XOOPS فعال کنم؟

**A:** XOOPS دارای کش داخلی است. در Admin > Settings > Performance پیکربندی کنید:

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

### س: از چه نوع ذخیره سازی باید استفاده کنم؟

**الف:**
- **کش فایل**: پیش فرض، ساده، بدون راه اندازی اضافی. برای سایت های کوچک خوب است.
- **Memcache**: سریعتر، مبتنی بر حافظه. برای سایت های پربازدید بهتر است.
- **Redis**: قدرتمندترین، از انواع داده های بیشتری پشتیبانی می کند. بهترین برای مقیاس بندی

نصب و فعال کنید:
```bash
# Install Memcached
sudo apt-get install memcached php-memcached

# Or install Redis
sudo apt-get install redis-server php-redis

# Restart PHP-FPM or Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```

سپس در XOOPS admin فعال کنید.

---

### س: چگونه کش XOOPS را پاک کنم؟

**الف:**
```bash
# Clear all cache
rm -rf xoops_data/caches/*

# Clear Smarty cache specifically
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Or in admin panel
Go to Admin > System > Maintenance > Clear Cache
```

در کد:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// Or clear specific keys
$cache->delete('cache_key');
?>
```

---

### س: چه مدت باید داده ها را کش کنم؟

**A:** بستگی به نیازهای تازگی داده ها دارد:

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

## بهینه سازی پایگاه داده

### س: چگونه می توانم پرس و جوهای پایگاه داده کند را پیدا کنم؟

**A:** فعال کردن ثبت پرس و جو:

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

یا از گزارش کند پرس و جو MySQL استفاده کنید:
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

### س: چگونه پرس و جوهای پایگاه داده را بهینه کنم؟

**A:** مراحل زیر را دنبال کنید:

**1. افزودن نمایه های پایگاه داده**
```sql
-- Add index to frequently searched columns
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- Check if index helps
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```

**2. از LIMIT و صفحه بندی استفاده کنید**
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

**3. فقط ستون های مورد نیاز را انتخاب کنید**
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

**4. اجتناب از N+1 Query **
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

**5. برای تجزیه و تحلیل پرس و جوها از EXPLAIN استفاده کنید**
```sql
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5 AND status = 1;

-- Look for:
-- - type: ALL (bad), INDEX (ok), const/ref (good)
-- - possible_keys: Should show available indexes
-- - key: Should use best index
-- - rows: Should be low number
```

---

### س: چگونه بار پایگاه داده را کاهش دهم؟

**الف:**
1. **نتایج جستجوی حافظه پنهان**:
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

2. **داده های قدیمی** را در جداول جداگانه بایگانی کنید
3. ** سیاهههای مربوط** را مرتباً تمیز کنید:
```bash
# Delete old log entries (older than 30 days)
DELETE FROM xoops_log WHERE created < NOW() - INTERVAL 30 DAY;
```

4. **فعال کردن کش کوئری** (MySQL):
```sql
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456;  -- 256 MB
```

---

## بهینه سازی دارایی

### س: چگونه CSS و جاوا اسکریپت را بهینه کنم؟

**الف:**

**1. کوچک کردن فایل ها**:
```bash
# Using online tools
# - cssminifier.com
# - javascript-minifier.com
# - minify.org

# Or with command-line tools
sudo apt-get install yui-compressor closure-compiler
yui-compressor file.css -o file.min.css
```

**2. ترکیب فایل های مرتبط**:
```html
{* Instead of many files *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style1.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style2.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style3.css">

{* Combine into one *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
```

**3. به تعویق انداختن جاوا اسکریپت غیر بحرانی**:
```html
{* Critical JS - load immediately *}
<script src="critical.js"></script>

{* Non-critical JS - load after page *}
<script src="analytics.js" defer></script>
<script src="ads.js" async></script>
```

**4. فشرده سازی Gzip** (htaccess.) را فعال کنید:
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

### س: چگونه تصاویر را بهینه کنم؟

**الف:**

**1. فرمت مناسب را انتخاب کنید**:
- JPG: عکس ها و تصاویر پیچیده
- PNG: گرافیک و تصاویر با شفافیت
- WebP: مرورگرهای مدرن، فشرده سازی بهتر
- AVIF: جدیدترین، بهترین فشرده سازی

**2. فشرده سازی تصاویر**:
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# Using ImageOptim
imageoptim image.jpg

# Online tools
# - imagecompressor.com
# - tinypng.com
```

**3. ارائه تصاویر واکنش گرا **:
```html
{* Serve different sizes *}
<picture>
    <source srcset="image-large.webp" type="image/webp" media="(min-width: 1200px)">
    <source srcset="image-medium.webp" type="image/webp" media="(min-width: 768px)">
    <source srcset="image-small.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```

**4. تصاویر بارگذاری تنبل**:
```html
{* Native lazy loading *}
<img src="image.jpg" loading="lazy" alt="description">

{* Or with JavaScript library *}
<script src="https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js"></script>
<img src="placeholder.jpg" data-src="image.jpg" class="lazyload" alt="description">
```

---

## پیکربندی سرور

### س: چگونه عملکرد سرور را بررسی کنم؟

**الف:**

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

### س: چگونه PHP را برای XOOPS بهینه کنم؟

**A:** ویرایش `/etc/php/8.x/fpm/php.ini`:

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

سپس PHP را ریستارت کنید:
```bash
sudo systemctl restart php8.2-fpm
# or
sudo systemctl restart apache2
```

---

### س: چگونه HTTP/2 و فشرده سازی را فعال کنم؟

**A:** برای آپاچی (htaccess.):
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

برای Nginx (nginx.conf):
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

## نظارت و تشخیص

### س: چگونه عملکرد XOOPS را در طول زمان نظارت کنم؟

**الف:**

**1. از Google Analytics** استفاده کنید:
- Core Web Vitals
- زمان بارگذاری صفحه
- رفتار کاربر

**2. از ابزارهای مانیتورینگ سرور** استفاده کنید:
```bash
# Install Glances (system monitor)
sudo apt-get install glances
glances

# Or use New Relic, DataDog, etc.
```

**3. ثبت و تجزیه و تحلیل درخواست ها**:
```bash
# Get average response time
grep "GET /index.php" /var/log/apache2/access.log | \
  awk '{print $NF}' | \
  sort -n | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count " ms"}'
```

---

### س: چگونه نشت حافظه را شناسایی کنم؟

**الف:**

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

## چک لیست عملکرد

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

## مستندات مرتبط

- اشکال زدایی پایگاه داده
- حالت Debug Mode را فعال کنید
- سوالات متداول ماژول
- بهینه سازی عملکرد

---

#xoops #عملکرد #بهینه سازی #FAQ #عیب یابی #کش کردن