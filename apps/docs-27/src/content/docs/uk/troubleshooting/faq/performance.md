---
title: "Продуктивність FAQ"
description: "Часті запитання про оптимізацію продуктивності XOOPS"
---
# Ефективність Часті запитання

> Поширені запитання та відповіді щодо оптимізації продуктивності XOOPS та діагностики повільних сайтів.

---

## Загальна продуктивність

### З: Як я можу визначити, чи мій сайт XOOPS працює повільно?

**A:** Використовуйте ці інструменти та показники:

1. **Час завантаження сторінки**:
```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://yoursite.com

# Or use online tools
# - PageSpeed Insights (Google)
# - GTmetrix
# - WebPageTest
```
2. **Цільові показники**:
- Перше фарбування вмісту (FCP): < 1,8 с
- Найбільше малювання вмісту (LCP): < 2,5 с
- Час до першого байта (TTFB): < 0,6 с
- Загальний розмір сторінки: < 2-3 МБ

3. **Перевірте журнали сервера**:
```bash
# Apache
tail -100 /var/log/apache2/access.log

# Nginx
tail -100 /var/log/nginx/access.log

# Look for slow requests (> 1 second)
```
---

### Q: Які найпоширеніші проблеми з продуктивністю?

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

### Q: Де я маю зосередити свої зусилля з оптимізації?

**A:** Дотримуйтеся пріоритету оптимізації:
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

## Кешування

### Q: Як увімкнути кешування в XOOPS?

**A:** XOOPS має вбудоване кешування. Налаштуйте в Адміністратор > Налаштування > Продуктивність:
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

### Q: Який тип кешування мені слід використовувати?

**A:**
- **Кеш файлів**: за замовчуванням, просто, без додаткових налаштувань. Добре підходить для невеликих сайтів.
- **Memcache**: швидше, на основі пам'яті. Краще для сайтів із високим трафіком.
- **Redis**: найпотужніший, підтримує більше типів даних. Найкраще підходить для масштабування.

Встановіть і ввімкніть:
```bash
# Install Memcached
sudo apt-get install memcached php-memcached

# Or install Redis
sudo apt-get install redis-server php-redis

# Restart PHP-FPM or Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```
Потім увімкніть у XOOPS admin.

---

### Q: Як очистити кеш XOOPS?

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
У коді:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// Or clear specific keys
$cache->delete('cache_key');
?>
```
---

### З: Як довго я маю кешувати дані?

**A:** Залежить від вимог до актуальності даних:
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

## Оптимізація бази даних

### Q: Як я можу знайти повільні запити до бази даних?

**A:** Увімкнути журналювання запитів:
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
Або скористайтеся повільним журналом запитів MySQL:
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

### З: Як оптимізувати запити до бази даних?

**A:** Виконайте такі дії:

**1. Додати індекси бази даних**
```sql
-- Add index to frequently searched columns
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- Check if index helps
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```
**2. Використовуйте LIMIT та нумерацію сторінок**
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
**3. Виберіть лише потрібні стовпці**
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
**4. Уникайте N+1 запитів**
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
**5. Використовуйте EXPLAIN для аналізу запитів**
```sql
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5 AND status = 1;

-- Look for:
-- - type: ALL (bad), INDEX (ok), const/ref (good)
-- - possible_keys: Should show available indexes
-- - key: Should use best index
-- - rows: Should be low number
```
---

### З: Як зменшити навантаження на базу даних?

**A:**
1. **Кешувати результати запиту**:
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
2. **Заархівуйте старі дані** в окремі таблиці
3. **Регулярно очищайте журнали**:
```bash
# Delete old log entries (older than 30 days)
DELETE FROM xoops_log WHERE created < NOW() - INTERVAL 30 DAY;
```
4. **Увімкнути кеш запитів** (MySQL):
```sql
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 268435456;  -- 256 MB
```
---

## Оптимізація активів

### З: Як оптимізувати CSS і JavaScript?

**A:**

**1. Зменшити файли**:
```bash
# Using online tools
# - cssminifier.com
# - javascript-minifier.com
# - minify.org

# Or with command-line tools
sudo apt-get install yui-compressor closure-compiler
yui-compressor file.css -o file.min.css
```
**2. Об’єднати пов’язані файли**:
```html
{* Instead of many files *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style1.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style2.css">
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style3.css">

{* Combine into one *}
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
```
**3. Відкласти некритичний JavaScript**:
```html
{* Critical JS - load immediately *}
<script src="critical.js"></script>

{* Non-critical JS - load after page *}
<script src="analytics.js" defer></script>
<script src="ads.js" async></script>
```
**4. Увімкнути стиснення Gzip** (.htaccess):
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

### З: Як оптимізувати зображення?

**A:**

**1. Виберіть правильний формат**:
- JPG: Фотографії та складні зображення
- PNG: Графіка та зображення з прозорістю
— WebP: сучасні браузери, краще стиснення
- AVIF: найновіше, найкраще стиснення

**2. Стиснути зображення**:
```bash
# Using ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# Using ImageOptim
imageoptim image.jpg

# Online tools
# - imagecompressor.com
# - tinypng.com
```
**3. Подавати адаптивні зображення**:
```html
{* Serve different sizes *}
<picture>
    <source srcset="image-large.webp" type="image/webp" media="(min-width: 1200px)">
    <source srcset="image-medium.webp" type="image/webp" media="(min-width: 768px)">
    <source srcset="image-small.webp" type="image/webp">
    <img src="image.jpg" alt="description">
</picture>
```
**4. Відкладене завантаження зображень**:
```html
{* Native lazy loading *}
<img src="image.jpg" loading="lazy" alt="description">

{* Or with JavaScript library *}
<script src="https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js"></script>
<img src="placeholder.jpg" data-src="image.jpg" class="lazyload" alt="description">
```
---

## Конфігурація сервера

### З: Як перевірити продуктивність сервера?

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

### З: Як оптимізувати PHP для XOOPS?

**A:** Редагувати `/etc/php/8.x/fpm/php.ini`:
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
Потім перезапустіть PHP:
```bash
sudo systemctl restart php8.2-fpm
# or
sudo systemctl restart apache2
```
---

### З: Як увімкнути HTTP/2 і стиснення?

**A:** Для Apache (.htaccess):
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
Для Nginx (nginx.conf):
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

## Моніторинг і діагностика

### З: Як відстежувати продуктивність XOOPS з часом?

**A:**

**1. Використовуйте Google Analytics**:
- Основні веб-показники
- Час завантаження сторінки
- Поведінка користувача

**2. Використовуйте інструменти моніторингу сервера**:
```bash
# Install Glances (system monitor)
sudo apt-get install glances
glances

# Or use New Relic, DataDog, etc.
```
**3. Реєстрація та аналіз запитів**:
```bash
# Get average response time
grep "GET /index.php" /var/log/apache2/access.log | \
  awk '{print $NF}' | \
  sort -n | \
  awk '{sum+=$1; count++} END {print "Average: " sum/count " ms"}'
```
---

### Q: Як визначити витік пам'яті?

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

## Контрольний список продуктивності
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

## Пов'язана документація

- Налагодження бази даних
- Увімкнути режим налагодження
- Модуль FAQ
- Оптимізація продуктивності

---

#XOOPS #performance #optimization #faq #troubleshooting #caching