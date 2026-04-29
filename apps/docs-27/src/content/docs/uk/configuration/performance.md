---
title: "Оптимізація продуктивності"
description: "Посібник з оптимізації швидкості для XOOPS, включаючи кешування, оптимізацію бази даних, інтеграцію CDN і моніторинг продуктивності"
---
# XOOPS Оптимізація продуктивності

Вичерпний посібник з оптимізації XOOPS для максимальної швидкості та ефективності.

## Огляд оптимізації продуктивності
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
## Конфігурація кешування

Кешування — найшвидший спосіб покращити продуктивність.

### Кешування на рівні сторінки

Увімкнути кешування повної сторінки в XOOPS:

**Панель адміністратора > Система > Параметри > Параметри кешу**
```
Enable Caching: Yes
Cache Type: File Cache (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
Cache Module Lists: Yes
Cache Configuration: Yes
Cache Search Results: Yes
```
### Кешування на основі файлів

Налаштувати розташування кешу файлів:
```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```
### Кешування APCu

APCu забезпечує кешування в пам'яті (дуже швидко):
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
Увімкнути в XOOPS:

**Панель адміністратора > Система > Параметри > Параметри кешу**
```
Cache Type: APCu
```
### Memcache/Redis Кешування

Розподілене кешування для сайтів з високим трафіком:

**Встановити Memcache:**
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
**Налаштувати в XOOPS:**

Відредагуйте mainfile.php:
```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```
Або в адміністративній панелі:
```
Cache Type: Memcache
Memcache Host: localhost:11211
```
### Кешування шаблонів

Скомпілюйте та кешуйте шаблони XOOPS:
```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```
Налаштувати в темі:
```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```
## Оптимізація бази даних

### Додати індекси бази даних

Правильно проіндексовані бази даних надсилають запити набагато швидше.
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
### Оптимізація таблиць

Регулярна оптимізація таблиці покращує продуктивність:
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
Створіть автоматизований сценарій оптимізації:
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
Розклад із cron:
```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```
### Оптимізація запитів

Перегляньте повільні запити:
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```
Загальні методи оптимізації:
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
### Збільшити пул буферів

Налаштуйте MySQL для кращого кешування:

Редагувати `/etc/mysql/mysql.conf.d/mysqld.cnf`:
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
Перезапустіть MySQL:
```bash
systemctl restart mysql
```
## Оптимізація веб-сервера

### Увімкнути стиснення Gzip

Стисніть відповіді, щоб зменшити пропускну здатність:

**Конфігурація Apache:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```
**Конфігурація Nginx:**
```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```
Перевірте стиснення:
```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```
### Заголовки кешування браузера

Встановити термін дії кешу для статичних активів:

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

Увімкнути постійні з'єднання HTTP:

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
## Оптимізація інтерфейсу

### Оптимізація зображень

Зменшити розмір файлу зображення:
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
### Зменшити CSS і JavaScript

Зменшити розмір файлу CSS/JS:

**Використання інструментів Node.js:**
```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```
**Використання онлайн-інструментів:**
- CSS Мініфікатор: https://cssminifier.com/
- JavaScript Мініфікатор: https://www.minifycode.com/javascript-minifier/

### Відкладене завантаження зображень

Завантажувати зображення лише за потреби:
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
### Зменште ресурси, що блокують рендеринг

Стратегічно завантажте CSS/JS:
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
## Інтеграція CDN

Використовуйте мережу доставки вмісту для швидшого глобального доступу.

### Популярні CDN

| CDN | Вартість | Особливості |
|---|---|---|
| Cloudflare | Free/Paid | DDoS, DNS, кеш, аналітика |
| AWS CloudFront | Оплачено | Висока продуктивність, глобальна |
| Зайчик CDN | Доступний | Зберігання, відео, кеш |
| jsDelivr | Безкоштовно | Бібліотеки JavaScript |
| cdnjs | Безкоштовно | Популярні бібліотеки |

### Налаштування Cloudflare

1. Зареєструйтеся на https://www.cloudflare.com/
2. Додайте свій домен
3. Оновіть сервери імен за допомогою Cloudflare
4. Увімкніть параметри кешування:
   - Рівень кешу: агресивний
   - Кешування всього: увімк
   - Кешування браузера TTL: 1 місяць

5. У XOOPS оновіть свій домен, щоб використовувати Cloudflare DNS

### Налаштуйте CDN у XOOPS

Оновіть URL-адреси зображень у CDN:

Редагувати шаблон теми:
```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```
Або встановіть у PHP:
```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```
## Моніторинг продуктивності

### Тестування PageSpeed Insights

Перевірте ефективність свого сайту:

1. Відвідайте Google PageSpeed Insights: https://pagespeed.web.dev/
2. Введіть свій XOOPS URL
3. Перегляньте рекомендації
4. Впровадити запропоновані вдосконалення

### Моніторинг продуктивності сервера

Відстежуйте показники сервера в режимі реального часу:
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
### PHP Профілювання продуктивності

Визначте повільний код PHP:
```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```
### MySQL Моніторинг запитів

Відстежуйте повільні запити:
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
## Контрольний список для оптимізації продуктивності

Застосуйте це для найкращої продуктивності:

- [] **Кешування:** Увімкнути кешування file/APCu/Memcache
- [ ] **База даних:** Додати індекси, оптимізувати таблиці
- [ ] **Стиснення:** увімкнути стиснення Gzip
- [] **Кеш веб-переглядача:** Встановити заголовки кешу
- [ ] **Зображення: ** Оптимізація та стиснення
- [ ] **CSS/JS:** Зменште файли
- [ ] **Відкладене завантаження:** Реалізовано для зображень
- [ ] **CDN:** Використовуйте для статичних ресурсів
- [ ] **Keep-Alive:** Увімкнути постійні підключення
- [ ] **Модулі:** Вимкнути невикористовувані модулі
- [ ] **Теми:** Використовуйте легкі оптимізовані теми
- [ ] **Моніторинг:** Відстежуйте показники ефективності
- [ ] **Регулярне технічне обслуговування:** Очистити кеш, оптимізувати БД

## Скрипт оптимізації продуктивності

Автоматична оптимізація:
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
## Метрики до і після

Відстежуйте покращення:
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
## Наступні кроки

1. Перегляньте базову конфігурацію
2. Забезпечити заходи безпеки
3. Реалізувати кешування
4. Контролюйте продуктивність за допомогою інструментів
5. Налаштуйте на основі показників

---

**Теги:** #продуктивність #оптимізація #кешування #база даних #cdn

**Пов’язані статті:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Параметри системи
- Конфігурація безпеки
- ../Installation/Server-Requirements