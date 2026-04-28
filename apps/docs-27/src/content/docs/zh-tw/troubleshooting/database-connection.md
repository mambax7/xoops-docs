---
title: "資料庫連接錯誤"
description: "XOOPS 資料庫連接問題故障排除指南"
---

XOOPS 安裝中資料庫連接錯誤是最常見的問題之一。本指南提供系統化的故障排除步驟，以識別和解決連接問題。

## 常見錯誤訊息

### 「無法連接到 MySQL 伺服器」

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

此錯誤通常表示 MySQL 伺服器未運行或無法訪問。

### 「使用者訪問被拒」

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

這表示設定中的資料庫認證資訊不正確。

### 「未知的資料庫」

```
Error: Unknown database 'xoops_db'
```

MySQL 伺服器上不存在指定的資料庫。

## 設定檔案

### XOOPS 設定位置

主要設定檔案位於：

```
/mainfile.php
```

關鍵資料庫設置：

```php
// 資料庫設定
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## 故障排除步驟

### 步驟 1：驗證 MySQL 服務正在運行

#### 在 Linux/Unix 上

```bash
# 檢查 MySQL 是否運行
sudo systemctl status mysql

# 如果未運行，啟動 MySQL
sudo systemctl start mysql

# 重新啟動 MySQL
sudo systemctl restart mysql
```

### 步驟 2：測試 MySQL 連接

#### 使用命令行

```bash
# 使用認證資訊測試連接
mysql -h localhost -u xoops_user -p xoops_db

# 如果提示輸入密碼，輸入密碼
# 成功顯示：mysql>

# 退出 MySQL
mysql> EXIT;
```

### 步驟 3：驗證資料庫認證資訊

#### 檢查 XOOPS 設定

```php
// 在 mainfile.php 中，驗證這些常數：
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### 步驟 4：驗證資料庫存在

```bash
# 連接到 MySQL
mysql -u root -p

# 列出所有資料庫
SHOW DATABASES;

# 檢查您的資料庫
SHOW DATABASES LIKE 'xoops_db';

# 如果未找到，建立它
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
EXIT;
```

### 步驟 5：檢查使用者權限

```bash
# 以 root 身份連接
mysql -u root -p

# 檢查使用者特權
SHOW GRANTS FOR 'xoops_user'@'localhost';

# 如果需要，授予所有特權
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# 重新載入特權
FLUSH PRIVILEGES;
```

## 常見問題和解決方案

### 問題 1：MySQL 未運行

**症狀：**
- 連接被拒錯誤
- 無法連接到 localhost

**解決方案：**

```bash
# Linux：檢查並啟動 MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### 問題 2：認證資訊不正確

**症狀：**
- 「訪問被拒」錯誤
- 「using password: YES」或「using password: NO」

**解決方案：**

```bash
# 以 root 身份重設密碼
mysql -u root -p

# 變更使用者密碼
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# 更新 mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### 問題 3：資料庫未建立

**症狀：**
- 「未知的資料庫」錯誤
- 安裝失敗於資料庫建立

**解決方案：**

```bash
# 檢查資料庫是否存在
mysql -u root -p -e "SHOW DATABASES;"

# 如果缺少，建立資料庫
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## 診斷指令碼

建立綜合診斷指令碼：

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// 檢查常數定義
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// 檢查 PHP MySQL 擴充套件
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// 測試連接
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## 相關文件

- 白色死亡螢幕 - 常見 WSOD 故障排除
- ../../01-Getting-Started/Configuration/Performance-Optimization - 資料庫效能調整
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - 初始 XOOPS 設置
- ../../04-API-Reference/Database/XoopsDatabase - 資料庫 API 參考

---

**最後更新：** 2026-01-31
**適用於：** XOOPS 2.5.7+
**PHP 版本：** 7.4+
