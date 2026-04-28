---
title: "故障排除"
description: "XOOPS 常見問題的解決方案、除錯技術和常見問題解答"
---

> XOOPS CMS 常見問題解決方案和除錯技術。

---

## 📋 快速診斷

深入特定問題之前，檢查這些常見原因：

1. **檔案權限** - 目錄需要 755，檔案需要 644
2. **PHP 版本** - 確保 PHP 7.4+ (建議 8.x)
3. **錯誤日誌** - 檢查 `xoops_data/logs/` 和 PHP 錯誤日誌
4. **快取** - 在管理員 → 系統 → 維護中清除快取

---

## 🗂️ 章節內容

### 常見問題
- 白色死亡螢幕 (WSOD)
- 資料庫連接錯誤
- 權限被拒錯誤
- 模組安裝失敗
- 樣板編譯錯誤

### 常見問題解答
- 安裝常見問題解答
- 模組常見問題解答
- 主題常見問題解答
- 效能常見問題解答

### 除錯
- 啟用除錯模式
- 使用 Ray 偵錯工具
- 資料庫查詢除錯
- Smarty 樣板除錯

---

## 🚨 常見問題與解決方案

### 白色死亡螢幕 (WSOD)

**症狀：** 空白白色頁面，無錯誤訊息

**解決方案：**

1. **暫時啟用 PHP 錯誤顯示：**
   ```php
   // 暫時添加到 mainfile.php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **檢查 PHP 錯誤日誌：**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **常見原因：**
   - 超出記憶體限制
   - 致命 PHP 語法錯誤
   - 缺少必需的擴充套件

4. **修復記憶體問題：**
   ```php
   // 在 mainfile.php 或 php.ini 中
   ini_set('memory_limit', '256M');
   ```

---

### 資料庫連接錯誤

**症狀：** 「無法連接到資料庫」或類似訊息

**解決方案：**

1. **驗證 mainfile.php 中的認證資訊：**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **手動測試連接：**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **檢查 MySQL 服務：**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **驗證使用者權限：**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### 權限被拒錯誤

**症狀：** 無法上傳檔案、無法保存設置

**解決方案：**

1. **設置正確的權限：**
   ```bash
   # 目錄
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # 檔案
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # 可寫的目錄
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **設置正確的擁有權：**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **檢查 SELinux (CentOS/RHEL)：**
   ```bash
   # 檢查狀態
   sestatus

   # 允許 httpd 寫入
   setsebool -P httpd_unified 1
   ```

---

### 模組安裝失敗

**症狀：** 模組不會安裝，SQL 錯誤

**解決方案：**

1. **檢查模組要求：**
   - PHP 版本相容性
   - 必需的 PHP 擴充套件
   - XOOPS 版本相容性

2. **手動 SQL 安裝：**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **清除模組快取：**
   ```php
   // 在 xoops_data/caches/ 中
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **檢查 xoops_version.php 語法：**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### 樣板編譯錯誤

**症狀：** Smarty 錯誤、找不到樣板

**解決方案：**

1. **清除 Smarty 快取：**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **檢查樣板語法：**
   ```smarty
   {* 正確 *}
   {$variable}

   {* 不正確 - 缺少 $ *}
   {variable}
   ```

3. **驗證樣板存在：**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **重新產生樣板：**
   - 管理員 → 系統 → 維護 → 樣板 → 重新產生

---

## 🐛 除錯技術

### 啟用 XOOPS 除錯模式

```php
// 在 mainfile.php 中
define('XOOPS_DEBUG_LEVEL', 2);

// 等級：
// 0 = 關閉
// 1 = PHP 除錯
// 2 = PHP + SQL 除錯
// 3 = PHP + SQL + Smarty 樣板
```

### 使用 Ray 偵錯工具

Ray 是 PHP 的優秀除錯工具：

```php
// 透過 Composer 安裝
composer require spatie/ray --dev

// 在程式碼中使用
ray($variable);
ray($object)->expand();
ray()->measure();

// 資料庫查詢
ray($sql)->label('Query');
```

### Smarty 除錯控制台

```smarty
{* 在樣板中啟用 *}
{debug}

{* 或在 PHP 中 *}
$xoopsTpl->debugging = true;
```

### 資料庫查詢記錄

```php
// 啟用查詢記錄
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// 取得所有查詢
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ 常見問題解答

### 安裝

**問：安裝精靈顯示空白頁面**
答：檢查 PHP 錯誤日誌，確保 PHP 有足夠的記憶體，驗證檔案權限。

**問：在安裝期間無法寫入 mainfile.php**
答：設置權限：安裝期間 `chmod 666 mainfile.php`，之後 `chmod 444`。

**問：資料庫表未建立**
答：檢查 MySQL 使用者是否有 CREATE TABLE 特權，驗證資料庫存在。

### 模組

**問：模組管理員頁面為空白**
答：清除快取，檢查模組的 admin/menu.php 是否有語法錯誤。

**問：模組區塊不顯示**
答：在管理員 → 區塊中檢查區塊權限，驗證區塊已分配到頁面。

**問：模組更新失敗**
答：備份資料庫，嘗試手動 SQL 更新，檢查版本要求。

### 主題

**問：主題未正確套用**
答：清除 Smarty 快取，檢查 theme.html 是否存在，驗證主題權限。

**問：自訂 CSS 未加載**
答：檢查檔案路徑，清除瀏覽器快取，驗證 CSS 語法。

**問：圖片不顯示**
答：檢查圖片路徑，驗證上傳資料夾權限。

### 效能

**問：網站非常慢**
答：啟用快取，最佳化資料庫，檢查慢速查詢，啟用 OpCache。

**問：記憶體使用量大**
答：增加 memory_limit，最佳化大型查詢，實現分頁。

---

## 🔧 維護指令

### 清除所有快取

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### 資料庫最佳化

```sql
-- 最佳化所有表
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- 對其他表重複

-- 或一次最佳化所有表
mysqlcheck -o -u user -p database
```

### 檢查檔案完整性

```bash
# 與全新安裝進行比較
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 相關文件

- 入門指南
- 安全最佳實踐
- XOOPS 4.0 藍圖

---

## 📚 外部資源

- [XOOPS 論壇](https://xoops.org/modules/newbb/)
- [GitHub 問題](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP 錯誤參考](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
