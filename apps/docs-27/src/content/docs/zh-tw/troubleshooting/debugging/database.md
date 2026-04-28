---
title: "資料庫除錯"
description: "XOOPS 中的 SQL 和資料庫問題除錯"
---

# 資料庫除錯技術

> XOOPS 應用程式中除錯 SQL 查詢和資料庫問題的方法和工具。

---

## 啟用查詢記錄

### 方法 1：XOOPS 除錯模式

```php
<?php
// 在 mainfile.php 中
define('XOOPS_DEBUG_LEVEL', 2);

// 現在所有查詢都出現在 xoops_log 表中
// 或在檔案中：xoops_data/logs/
?>
```

檢查結果：
```bash
# 檢視日誌
tail -100 xoops_data/logs/*.log

# 或查詢資料庫
SELECT * FROM xoops_log ORDER BY created DESC LIMIT 20;
```

---

### 方法 2：MySQL 慢查詢日誌

在 `/etc/mysql/my.cnf` 中啟用：

```ini
[mysqld]
# 啟用慢查詢記錄
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1          # 記錄查詢 > 1 秒
log_queries_not_using_indexes = 1
```

重新啟動 MySQL：
```bash
sudo systemctl restart mysql
# 或
sudo systemctl restart mariadb
```

檢視日誌：
```bash
tail -100 /var/log/mysql/slow.log

# 或使用 mysqldumpslow 分析
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

---

## 在程式碼中除錯 SQL

### 記錄查詢執行

```php
<?php
require_once 'mainfile.php';

$ray = ray();  // 如果使用 Ray 偵錯工具

// 執行查詢
$query = "SELECT u.uid, u.uname, COUNT(a.id) as total_articles
          FROM xoops_users u
          LEFT JOIN xoops_articles a ON u.uid = a.author_id
          GROUP BY u.uid
          ORDER BY total_articles DESC";

$ray->label('Query')->info($query);

$result = $GLOBALS['xoopsDB']->query($query);

if (!$result) {
    $ray->error("SQL Error: " . $GLOBALS['xoopsDB']->error);
    exit;
}

// 記錄結果
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$ray->label('Results')->dump($data);
$ray->info("Found " . count($data) . " rows");
?>
```

---

### 衡量查詢效能

```php
<?php
$db = $GLOBALS['xoopsDB'];
$ray = ray();

// 衡量執行時間
$start = microtime(true);

$query = "SELECT * FROM xoops_articles LIMIT 1000";
$result = $db->query($query);

$exec_time = (microtime(true) - $start) * 1000;  // 毫秒

$ray->info("Query executed in: {$exec_time}ms");

// 記錄慢速查詢
if ($exec_time > 100) {  // 如果 > 100ms 發出警報
    $ray->warning("Slow query detected: {$exec_time}ms");
    $ray->info($query);
}
?>
```

---

## 分析查詢效能

### EXPLAIN 命令

使用 EXPLAIN 分析查詢執行：

```sql
-- 分析一個查詢
EXPLAIN SELECT * FROM xoops_articles WHERE author_id = 5;

-- 使用 JSON 格式 (顯示更多詳細資訊)
EXPLAIN FORMAT=JSON SELECT * FROM xoops_articles WHERE author_id = 5\G
```

**要檢查的關鍵欄位：**

```
type: ALL           (差) - 全表掃描
      INDEX         (可以) - 索引掃描
      ref/const     (好) - 直接索引查找
      range         (可以) - 使用索引的範圍掃描

possible_keys:      可用索引
key:                實際使用的索引
key_len:            使用的索引長度
rows:               預估的檢查行數
Extra:              附加資訊 (使用 where、使用索引等)
```

---

## 常見 SQL 問題

### 1. N+1 查詢問題

**問題：**
```php
<?php
// 錯誤：迴圈中的多個查詢
$authors = $db->query("SELECT uid FROM xoops_users LIMIT 100");
while ($author = $authors->fetch_assoc()) {
    // 這執行 100 次！
    $articles = $db->query(
        "SELECT COUNT(*) FROM xoops_articles WHERE author_id = " . $author['uid']
    );
    echo $articles->fetch_row()[0];
}
?>
```

**解決方案：使用 JOIN**
```php
<?php
// 正確：一個查詢
$result = $db->query("
    SELECT u.uid, u.uname, COUNT(a.id) as total
    FROM xoops_users u
    LEFT JOIN xoops_articles a ON u.uid = a.author_id
    GROUP BY u.uid
    LIMIT 100
");

while ($row = $result->fetch_assoc()) {
    echo $row['total'];
}
?>
```

---

### 2. 缺少索引

**識別：**
```sql
-- 查詢掃描所有行
SELECT * FROM xoops_log
WHERE info LIKE '%type: ALL%'
ORDER BY created DESC;
```

**新增索引：**
```sql
-- 單欄索引
ALTER TABLE xoops_articles ADD INDEX (author_id);
ALTER TABLE xoops_articles ADD INDEX (created);

-- 複合索引
ALTER TABLE xoops_articles ADD INDEX (author_id, created);

-- 唯一索引
ALTER TABLE xoops_articles ADD UNIQUE INDEX (slug);
```

---

## 有用的 MySQL 查詢

```sql
-- 尋找慢表
SELECT * FROM xoops_log
WHERE info LIKE '%type: ALL%'
ORDER BY created DESC LIMIT 20;

-- 列出所有索引
SHOW INDEX FROM xoops_articles;

-- 表大小
SELECT table_name,
       ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'xoops_db'
ORDER BY size_mb DESC;
```

---

## 相關文件

- 啟用除錯模式
- 使用 Ray 偵錯工具
- 效能常見問題解答
- 資料庫基礎

---

#xoops #database #debugging #sql #optimization #mysql
