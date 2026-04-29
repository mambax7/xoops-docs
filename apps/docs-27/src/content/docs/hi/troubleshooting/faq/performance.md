---
title: "प्रदर्शन अक्सर पूछे जाने वाले प्रश्न"
description: "XOOPS प्रदर्शन अनुकूलन के बारे में अक्सर पूछे जाने वाले प्रश्न"
---
# प्रदर्शन अक्सर पूछे जाने वाले प्रश्न

> XOOPS प्रदर्शन को अनुकूलित करने और धीमी साइटों का निदान करने के बारे में सामान्य प्रश्न और उत्तर।

---

## सामान्य प्रदर्शन

### प्रश्न: मैं कैसे बता सकता हूं कि मेरी XOOPS साइट धीमी है?

**ए:** इन टूल और मेट्रिक्स का उपयोग करें:

1. **पेज लोड समय**:
```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://yoursite.com

# Or use online tools
# - PageSpeed Insights (Google)
# - GTmetrix
# - WebPageTest
```

2. **लक्ष्य मेट्रिक्स**:
- पहला कंटेंटफुल पेंट (एफसीपी): <1.8 सेकेंड
- सबसे बड़ा कंटेंटफुल पेंट (एलसीपी): <2.5 सेकेंड
- पहली बाइट का समय (TTFB): <0.6 सेकंड
- कुल पृष्ठ आकार: <2-3 एमबी

3. **सर्वर लॉग जांचें**:
```bash
# Apache
tail -100 /var/log/apache2/access.log

# Nginx
tail -100 /var/log/nginx/access.log

# Look for slow requests (> 1 second)
```

---

### प्रश्न: सबसे आम प्रदर्शन समस्याएं क्या हैं?

**ए:**
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

### प्रश्न: मुझे अपने अनुकूलन प्रयासों को कहाँ केंद्रित करना चाहिए?

**ए:** अनुकूलन प्राथमिकता का पालन करें:

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

## कैशिंग

### प्रश्न: मैं XOOPS में कैशिंग कैसे सक्षम करूं?

**ए:** XOOPS में अंतर्निहित कैशिंग है। व्यवस्थापक > सेटिंग्स > प्रदर्शन में कॉन्फ़िगर करें:

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

### प्रश्न: मुझे किस प्रकार की कैशिंग का उपयोग करना चाहिए?

**ए:**
- **फ़ाइल कैश**: डिफ़ॉल्ट, सरल, कोई अतिरिक्त सेटअप नहीं। छोटी साइटों के लिए अच्छा है.
- **मेमकेचे**: तेज़, मेमोरी-आधारित। उच्च-ट्रैफ़िक वाली साइटों के लिए बेहतर.
- **रेडिस**: सबसे शक्तिशाली, अधिक डेटा प्रकारों का समर्थन करता है। स्केलिंग के लिए सर्वोत्तम.

स्थापित करें और सक्षम करें:
```bash
# Install Memcached
sudo apt-get install memcached php-memcached

# Or install Redis
sudo apt-get install redis-server php-redis

# Restart PHP-FPM or Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```

फिर XOOPS एडमिन में सक्षम करें।

---

### प्रश्न: मैं XOOPS कैशे कैसे साफ़ करूँ?

**ए:**
```bash
# Clear all cache
rm -rf xoops_data/caches/*

# Clear Smarty cache specifically
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Or in admin panel
Go to Admin > System > Maintenance > Clear Cache
```

कोड में:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// Or clear specific keys
$cache->delete('cache_key');
?>
```

---

### प्रश्न: मुझे कब तक डेटा कैश करना चाहिए?

**ए:** डेटा ताज़ाता आवश्यकताओं पर निर्भर करता है:

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

## डेटाबेस अनुकूलन

### प्रश्न: मैं धीमी डेटाबेस क्वेरीज़ का पता कैसे लगा सकता हूँ?

**ए:** क्वेरी लॉगिंग सक्षम करें:

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

या MySQL धीमी क्वेरी लॉग का उपयोग करें:
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

### प्रश्न: मैं डेटाबेस क्वेरीज़ को कैसे अनुकूलित करूं?

**ए:** इन चरणों का पालन करें:

**1. डेटाबेस इंडेक्स जोड़ें**
```sql
-- Add index to frequently searched columns
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- Check if index helps
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```

**2. LIMIT और पेजिनेशन** का उपयोग करें
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

**3. केवल आवश्यक कॉलम चुनें**
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

**4. एन+1 प्रश्नों से बचें**
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

**5. प्रश्नों का विश्लेषण करने के लिए EXPLAIN का उपयोग करें**
```sql
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5 AND status = 1;

-- Look for:
-- - type: ALL (bad), INDEX (ok), const/ref (good)
-- - possible_keys: Should show available indexes
-- - key: Should use best index
-- - rows: Should be low number
```

---

### प्रश्न: मैं डेटाबेस लोड कैसे कम करूं?

**ए:**
1. **कैश क्वेरी परिणाम**:
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

2. **पुराने डेटा को अलग-अलग तालिकाओं में संग्रहीत करें**
3. **लॉग साफ़ करें** नियमित रूप से:
```bash
# Delete old log entries (older than 30 days)
DELETE FROM xoops_log WHERE created < NOW() - INTERVAL 30 DAY;
```

4. **क्वेरी कैश सक्षम करें** (MySQL):
```sql
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456;  -- 256 MB
```

---

## संपत्ति अनुकूलन

### प्रश्न: मैं CSS और JavaScript को कैसे अनुकूलित करूं?

**ए:**

**1. फ़ाइलें छोटा करें**:
```bash
# Using online tools
# - cssminifier.com
# - javascript-minifier.com
# - minify.org

# Or with command-line tools
sudo apt-get install yui-compressor closure-compiler
yui-compressor file.css -o file.min.css
```

**2. संबंधित फ़ाइलें संयोजित करें**:
```html
{* Instead of many files *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style1.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style2.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style3.css">

{* Combine into one *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
```

**3. गैर-महत्वपूर्ण को स्थगित करें JavaScript**:
```html
{* Critical JS - load immediately *}
<script src="critical.js"></script>

{* Non-critical JS - load after page *}
<script src="analytics.js" defer></script>
<script src="ads.js" async></script>
```

**4. Gzip संपीड़न सक्षम करें** (.htaccess):
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

### प्रश्न: मैं छवियों को कैसे अनुकूलित करूं?

**ए:**

**1. सही प्रारूप चुनें**:
- जेपीजी: तस्वीरें और जटिल छवियां
- पीएनजी: पारदर्शिता के साथ ग्राफिक्स और छवियां
- WebP: आधुनिक ब्राउज़र, बेहतर संपीड़न
- AVIF: नवीनतम, सर्वोत्तम संपीड़न

**2. छवियाँ संपीड़ित करें**:
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# Using ImageOptim
imageoptim image.jpg

# Online tools
# - imagecompressor.com
# - tinypng.com
```

**3. प्रतिक्रियाशील छवियाँ परोसें**:
```html
{* Serve different sizes *}
<picture>
    <source srcset="image-large.webp" type="image/webp" media="(min-width: 1200px)">
    <source srcset="image-medium.webp" type="image/webp" media="(min-width: 768px)">
    <source srcset="image-small.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```

**4. आलसी लोड छवियां**:
```html
{* Native lazy loading *}
<img src="image.jpg" loading="lazy" alt="description">

{* Or with JavaScript library *}
<script src="https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js"></script>
<img src="placeholder.jpg" data-src="image.jpg" class="lazyload" alt="description">
```

---

## सर्वर कॉन्फ़िगरेशन

### प्रश्न: मैं सर्वर के प्रदर्शन की जाँच कैसे करूँ?

**ए:**

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

### प्रश्न: मैं XOOPS के लिए PHP को कैसे अनुकूलित करूं?

**ए:** संपादित करें `/etc/php/8.x/fpm/php.ini`:

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

फिर PHP पुनः आरंभ करें:
```bash
sudo systemctl restart php8.2-fpm
# or
sudo systemctl restart apache2
```

---

### प्रश्न: मैं HTTP/2 और कम्प्रेशन कैसे सक्षम करूं?

**ए:** अपाचे (.htaccess) के लिए:
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

Nginx के लिए (nginx.conf):
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

## निगरानी एवं निदान

### प्रश्न: मैं समय के साथ XOOPS प्रदर्शन की निगरानी कैसे करूँ?

**ए:**

**1. Google Analytics का उपयोग करें**:
- कोर वेब वाइटल्स
- पेज लोड समय
- उपयोगकर्ता व्यवहार

**2. सर्वर मॉनिटरिंग टूल का उपयोग करें**:
```bash
# Install Glances (system monitor)
sudo apt-get install glances
glances

# Or use New Relic, DataDog, etc.
```

**3. अनुरोध लॉग करें और उनका विश्लेषण करें**:
```bash
# Get average response time
grep "GET /index.php" /var/log/apache2/access.log | \
  awk '{print $NF}' | \
  sort -n | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count " ms"}'
```

---

### प्रश्न: मैं मेमोरी लीक की पहचान कैसे करूँ?

**ए:**

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

## प्रदर्शन चेकलिस्ट

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

## संबंधित दस्तावेज़ीकरण- डेटाबेस डिबगिंग
- डिबग मोड सक्षम करें
- मॉड्यूल अक्सर पूछे जाने वाले प्रश्न
- प्रदर्शन अनुकूलन

---

#xoops #प्रदर्शन #अनुकूलन #faq #समस्या निवारण #कैशिंग