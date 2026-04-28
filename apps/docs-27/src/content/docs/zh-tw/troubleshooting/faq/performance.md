---
title: "效能常見問題解答"
description: "關於 XOOPS 效能最佳化的常見問題和解答"
---

# 效能常見問題解答

> 關於最佳化 XOOPS 效能和診斷慢速網站的常見問題和解答。

---

## 常見效能問題

### 問：最常見的效能問題是什麼？

**答：** 優先順序：
1. 未最佳化的資料庫查詢 - 25%
2. 大型未壓縮的資產 - 20%
3. 缺少快取 - 20%
4. 過多的擴充套件/外掛程式 - 15%
5. 不充分的伺服器資源 - 12%
6. 未最佳化的影像 - 8%

---

### 問：我應該把重點放在效能最佳化的哪裡？

**答：** 遵循最佳化優先順序：

1. **快取** - 啟用頁面、物件、查詢快取
2. **資料庫查詢** - 添加索引、最佳化查詢、移除 N+1
3. **資產最佳化** - 壓縮影像、縮小 CSS/JS、啟用 gzip
4. **程式碼最佳化** - 移除膨脹、延遲加載、重構程式碼

---

## 快取

### 問：我如何在 XOOPS 中啟用快取？

**答：** XOOPS 有內建快取。在管理員 > 設置 > 效能中設定：

```php
<?php
// 在程式碼中使用快取
$cache = xoops_cache_handler::getInstance();

// 從快取讀取
$data = $cache->read('cache_key');

if ($data === false) {
    // 不在快取中，從來源取得
    $data = expensive_operation();

    // 寫入快取 (3600 = 1 小時)
    $cache->write('cache_key', $data, 3600);
}
?>
```

---

### 問：我應該使用什麼類型的快取？

**答：**
- **檔案快取**：預設、簡單、無額外設置。適合小型網站。
- **Memcache**：更快、基於記憶體。更適合高流量網站。
- **Redis**：最強大，支援更多資料類型。最適合擴展。

安裝和啟用：
```bash
# 安裝 Memcached
sudo apt-get install memcached php-memcached

# 或安裝 Redis
sudo apt-get install redis-server php-redis

# 重新啟動 PHP-FPM 或 Apache
sudo systemctl restart php-fpm
sudo systemctl restart apache2
```

---

### 問：我如何清除 XOOPS 快取？

**答：**
```bash
# 清除所有快取
rm -rf xoops_data/caches/*

# 或透過管理員面板
# 進入管理員 > 系統 > 維護 > 清除快取
```

在程式碼中：
```php
<?php
$cache = xoops_cache_handler::getInstance();
$cache->deleteAll();

// 或清除特定鍵
$cache->delete('cache_key');
?>
```

---

## 資料庫最佳化

### 問：我如何找到慢速資料庫查詢？

**答：** 啟用查詢記錄：

```php
<?php
// 在 mainfile.php 中
define('XOOPS_DB_DEBUGMODE', true);
define('XOOPS_SQL_DEBUG', true);

// 然後檢查 xoops_log 表
SELECT * FROM xoops_log WHERE logid > SOME_NUMBER
ORDER BY created DESC LIMIT 20;
?>
```

或使用 MySQL 慢查詢日誌：
```bash
# 在 /etc/mysql/my.cnf 中啟用
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1  # 記錄 > 1 秒的查詢

# 檢視慢速查詢
tail -100 /var/log/mysql/slow.log
```

---

### 問：我如何最佳化資料庫查詢？

**答：** 遵循這些步驟：

**1. 添加資料庫索引**
```sql
-- 為經常搜尋的欄位添加索引
ALTER TABLE `xoops_articles` ADD INDEX `author_id` (`author_id`);
ALTER TABLE `xoops_articles` ADD INDEX `created` (`created`);

-- 檢查索引是否有幫助
ANALYZE TABLE `xoops_articles`;
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;
```

**2. 避免 N+1 查詢**
```php
<?php
// 錯誤 - N+1 問題
$articles = $db->query("SELECT * FROM xoops_articles");
while ($article = $articles->fetch_assoc()) {
    // 此查詢每篇文章運行一次！
    $author = $db->query("SELECT * FROM xoops_users WHERE uid = " . $article['author_id']);
}

// 正確 - 使用 JOIN
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

**3. 使用 LIMIT 和分頁**
```php
<?php
// 錯誤 - 取得所有記錄
$result = $db->query("SELECT * FROM xoops_articles");

// 正確 - 從偏移 10 條記錄開始取得
$limit = 10;
$offset = 0;  // 透過分頁變更
$result = $db->query("SELECT * FROM xoops_articles LIMIT $limit OFFSET $offset");
?>
```

---

## 資產最佳化

### 問：我如何最佳化 CSS 和 JavaScript？

**答：**

1. **縮小檔案** - 使用線上工具或命令行工具
2. **合併相關檔案** - 使用單一 CSS 檔案而不是多個
3. **延遲非關鍵 JavaScript** - 使用 defer 和 async 屬性
4. **啟用 Gzip 壓縮** (.htaccess)：
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

---

### 問：我如何最佳化影像？

**答：**

1. **選擇正確的格式**：JPG (照片)、PNG (透明度)、WebP (現代瀏覽器)
2. **壓縮影像** - 使用 ImageMagick、tinypng.com
3. **延遲加載影像**：
```html
{* 原生延遲加載 *}
<img src="image.jpg" loading="lazy" alt="description">
```

---

## 相關文件

- 資料庫除錯
- 啟用除錯模式
- 模組常見問題解答
- 效能最佳化

---

#xoops #performance #optimization #faq #troubleshooting #caching
