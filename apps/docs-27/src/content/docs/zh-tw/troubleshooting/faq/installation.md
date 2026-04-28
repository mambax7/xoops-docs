---
title: "安裝常見問題解答"
description: "關於 XOOPS 安裝的常見問題和解答"
---

> 關於安裝 XOOPS 的常見問題和解答。

---

## 安裝前

### 問：最少的伺服器要求是什麼？

**答：** XOOPS 2.5.x 要求：
- PHP 7.4 或更新版本 (建議 PHP 8.x)
- MySQL 5.7+ 或 MariaDB 10.3+
- Apache with mod_rewrite 或 Nginx
- 至少 64MB PHP 記憶體限制 (建議 128MB+)

### 問：我可以在共享主機上安裝 XOOPS 嗎？

**答：** 是的，XOOPS 適用於大多數滿足要求的共享主機。檢查您的主機是否提供：
- 具有必需擴充套件的 PHP (mysqli、gd、curl、json、mbstring)
- MySQL 資料庫訪問
- 檔案上傳功能
- .htaccess 支援 (用於 Apache)

### 問：需要哪些 PHP 擴充套件？

**答：** 必需擴充套件：
- `mysqli` - 資料庫連接
- `gd` - 影像處理
- `json` - JSON 處理
- `mbstring` - 多位元組字串支援

---

## 安裝過程

### 問：安裝精靈顯示空白頁面

**答：** 這通常是 PHP 錯誤。嘗試：

1. 啟用錯誤顯示：
```php
// 添加到 htdocs/install/index.php 頂部
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

2. 檢查 PHP 錯誤日誌
3. 驗證 PHP 版本相容性
4. 確保所有必需的擴充套件已加載

### 問：我收到「無法寫入 mainfile.php」

**答：** 在安裝前設置寫入權限：

```bash
chmod 666 mainfile.php
# 安裝後，保護它：
chmod 444 mainfile.php
```

### 問：資料庫表未被建立

**答：** 檢查：

1. MySQL 使用者有 CREATE TABLE 特權：
```sql
GRANT ALL PRIVILEGES ON xoopsdb.* TO 'xoopsuser'@'localhost';
FLUSH PRIVILEGES;
```

2. 資料庫存在：
```sql
CREATE DATABASE xoopsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. 精靈中的認證資訊與資料庫設置相符

---

## 設定

### 問：設定檔案在哪裡？

**答：** 主要設定在根目錄中的 `mainfile.php`。關鍵設置：

```php
define('XOOPS_ROOT_PATH', '/path/to/htdocs');
define('XOOPS_VAR_PATH', '/path/to/xoops_data');
define('XOOPS_URL', 'https://yoursite.com');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_USER', 'username');
define('XOOPS_DB_PASS', 'password');
define('XOOPS_DB_NAME', 'database');
define('XOOPS_DB_PREFIX', 'xoops');
```

### 問：如何變更網站 URL？

**答：** 編輯 `mainfile.php`：

```php
define('XOOPS_URL', 'https://newdomain.com');
```

然後清除快取並更新資料庫中的任何硬編碼 URL。

### 問：如何將 XOOPS 移動到其他目錄？

**答：**

1. 將檔案移動到新位置
2. 更新 `mainfile.php` 中的路徑：
```php
define('XOOPS_ROOT_PATH', '/new/path/to/htdocs');
define('XOOPS_VAR_PATH', '/new/path/to/xoops_data');
```
3. 如果需要，更新資料庫
4. 清除所有快取

---

## 升級

### 問：我忘記了管理員密碼

**答：** 透過資料庫重設：

```sql
-- 產生新密碼雜湊
UPDATE xoops_users
SET pass = MD5('newpassword')
WHERE uname = 'admin';
```

或使用密碼重設功能 (如果已設定電子郵件)。

### 問：安裝後網站很慢

**答：**

1. 在管理員 → 系統 → 偏好設定中啟用快取
2. 最佳化資料庫：
```sql
OPTIMIZE TABLE xoops_session;
OPTIMIZE TABLE xoops_online;
```
3. 在除錯模式下檢查慢速查詢
4. 啟用 PHP OpCache

---

## 相關文件

- 安裝指南
- 基本設定
- 白色死亡螢幕

---

#xoops #faq #installation #troubleshooting
