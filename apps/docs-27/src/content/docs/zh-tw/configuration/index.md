---
title: "基本組態"
description: "初始 XOOPS 設定，包括 mainfile.php 設定、網站名稱、電子郵件和時區組態"
---

# 基本 XOOPS 組態

本指南涵蓋基本組態設定，以在安裝後讓您的 XOOPS 網站正常執行。

## mainfile.php 組態

`mainfile.php` 檔案包含 XOOPS 安裝的關鍵組態。它是在安裝期間建立的，但您可能需要手動編輯它。

### 位置

```
/var/www/html/xoops/mainfile.php
```

### 檔案結構

```php
<?php
// 資料庫組態
define('XOOPS_DB_TYPE', 'mysqli');  // 資料庫類型
define('XOOPS_DB_HOST', 'localhost');  // 資料庫主機
define('XOOPS_DB_USER', 'xoops_user');  // 資料庫使用者
define('XOOPS_DB_PASS', 'password');  // 資料庫密碼
define('XOOPS_DB_NAME', 'xoops_db');  // 資料庫名稱
define('XOOPS_DB_PREFIX', 'xoops_');  // 表格字首

// 網站組態
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // 檔案系統路徑
define('XOOPS_URL', 'http://your-domain.com/xoops');  // 網頁 URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // 受信任路徑

// 字元集
define('XOOPS_DB_CHARSET', 'utf8mb4');  // 資料庫字集
define('_CHARSET', 'UTF-8');  // 頁面字集

// 偵錯模式（在生產環境中設定為 0）
define('XOOPS_DEBUG', 0);  // 設定為 1 以進行偵錯
?>
```

### 關鍵設定說明

| 設定 | 用途 | 範例 |
|---|---|---|
| `XOOPS_DB_TYPE` | 資料庫系統 | `mysqli`、`mysql`、`pdo` |
| `XOOPS_DB_HOST` | 資料庫伺服器位置 | `localhost`、`192.168.1.1` |
| `XOOPS_DB_USER` | 資料庫使用者名稱 | `xoops_user` |
| `XOOPS_DB_PASS` | 資料庫密碼 | [secure_password] |
| `XOOPS_DB_NAME` | 資料庫名稱 | `xoops_db` |
| `XOOPS_DB_PREFIX` | 表格名稱字首 | `xoops_`（允許在一個資料庫中多個 XOOPS） |
| `XOOPS_ROOT_PATH` | 物理檔案系統路徑 | `/var/www/html/xoops` |
| `XOOPS_URL` | 網頁可存取的 URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | 受信任路徑（網路根目錄外） | `/var/www/xoops_var` |

### 編輯 mainfile.php

在文字編輯器中開啟 mainfile.php：

```bash
# 使用 nano
nano /var/www/html/xoops/mainfile.php

# 使用 vi
vi /var/www/html/xoops/mainfile.php

# 使用 sed（尋找和取代）
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### 常見的 mainfile.php 變更

**變更網站 URL：**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**啟用偵錯模式（僅開發）：**
```php
define('XOOPS_DEBUG', 1);
```

**變更表格字首（如果需要）：**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**將信任路徑移出網路根目錄（進階）：**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## 管理面板組態

透過 XOOPS 管理面板組態基本設定。

### 存取系統設定

1. 登入管理面板：`http://your-domain.com/xoops/admin/`
2. 導覽至：**System > Preferences > General Settings**
3. 修改設定（見下文）
4. 按一下底部的「儲存」

### 網站名稱和描述

組態您的網站外觀方式：

```
網站名稱：我的 XOOPS 網站
網站描述：一個動態內容管理系統
網站標語：使用 XOOPS 建立
```

### 聯絡資訊

設定網站聯絡詳細資訊：

```
網站管理員電子郵件：admin@your-domain.com
網站管理員名稱：網站管理員
聯絡表單電子郵件：support@your-domain.com
支援電子郵件：help@your-domain.com
```

### 語言和地區

設定預設語言和地區：

```
預設語言：英文
預設時區：America/New_York（或您的時區）
日期格式：%Y-%m-%d
時間格式：%H:%M:%S
```

## 電子郵件組態

為通知和使用者通訊組態電子郵件設定。

### 電子郵件設定位置

**管理面板：** System > Preferences > Email Settings

### SMTP 組態

為了可靠的電子郵件傳遞，請使用 SMTP 而不是 PHP mail()：

```
使用 SMTP：是
SMTP 主機：smtp.gmail.com（或您的 SMTP 提供者）
SMTP 連接埠：587（TLS）或 465（SSL）
SMTP 使用者名稱：your-email@gmail.com
SMTP 密碼：[app_password]
SMTP 安全性：TLS 或 SSL
```

### Gmail 組態範例

設定 XOOPS 以透過 Gmail 傳送電子郵件：

```
SMTP 主機：smtp.gmail.com
SMTP 連接埠：587
SMTP 安全性：TLS
SMTP 使用者名稱：your-email@gmail.com
SMTP 密碼：[Google 應用程式密碼 - 不是常規密碼]
寄件人位址：your-email@gmail.com
寄件人名稱：您的網站名稱
```

**注意：** Gmail 需要應用程式密碼，而不是 Gmail 密碼：
1. 前往 https://myaccount.google.com/apppasswords
2. 為「郵件」和「Windows 電腦」產生應用程式密碼
3. 在 XOOPS 中使用產生的密碼

### PHP mail() 組態（更簡單但可靠性較低）

如果 SMTP 無可用，請使用 PHP mail()：

```
使用 SMTP：否
寄件人位址：noreply@your-domain.com
寄件人名稱：您的網站名稱
```

確保您的伺服器已設定 sendmail 或 postfix：

```bash
# 檢查 sendmail 是否可用
which sendmail

# 或檢查 postfix
systemctl status postfix
```

### 電子郵件函數設定

組態什麼會觸發電子郵件：

```
傳送通知：是
在使用者註冊時通知管理員：是
向新使用者傳送歡迎電子郵件：是
傳送密碼重設連結：是
啟用使用者電子郵件：是
啟用私人訊息：是
通知管理動作：是
```

## 時區組態

設定適當的時區以獲得正確的時間戳記和排程。

### 在管理面板中設定時區

**路徑：** System > Preferences > General Settings

```
預設時區：[選擇您的時區]
```

**常見時區：**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### 驗證時區

檢查目前的伺服器時區：

```bash
# 顯示目前時區
timedatectl

# 或檢查日期
date +%Z

# 列出可用的時區
timedatectl list-timezones
```

### 設定系統時區 (Linux)

```bash
# 設定時區
timedatectl set-timezone America/New_York

# 或使用符號連結方法
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# 驗證
date
```

## URL 組態

### 啟用簡潔 URL（友善 URL）

對於 `/page/about` 之類的 URL，而不是 `/index.php?page=about`

**需求：**
- 啟用 mod_rewrite 的 Apache
- XOOPS 根目錄中的 `.htaccess` 檔案

**在管理面板中啟用：**

1. 移至：**System > Preferences > URL Settings**
2. 核取：「啟用友善 URL」
3. 選擇：「URL 類型」（路徑資訊或查詢）
4. 儲存

**驗證 .htaccess 存在：**

```bash
cat /var/www/html/xoops/.htaccess
```

範例 .htaccess 內容：

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**疑難排解簡潔 URL：**

```bash
# 驗證已啟用 mod_rewrite
apache2ctl -M | grep rewrite

# 如果需要啟用
a2enmod rewrite

# 重新啟動 Apache
systemctl restart apache2

# 測試重寫規則
curl -I http://your-domain.com/xoops/index.php
```

### 組態網站 URL

**管理面板：** System > Preferences > General Settings

為您的網域設定正確的 URL：

```
網站 URL：http://your-domain.com/xoops/
```

或如果 XOOPS 在根目錄：

```
網站 URL：http://your-domain.com/
```

## 搜尋引擎最佳化 (SEO)

為搜尋引擎可見性組態 SEO 設定。

### 中繼標籤

設定全域中繼標籤：

**管理面板：** System > Preferences > SEO Settings

```
中繼關鍵字：xoops、cms、內容管理
中繼描述：一個動態內容管理系統
```

這些在頁面 `<head>` 中出現：

```html
<meta name="keywords" content="xoops, cms, 內容管理">
<meta name="description" content="一個動態內容管理系統">
```

### 網站地圖

為搜尋引擎啟用 XML 網站地圖：

1. 移至：**System > Modules**
2. 尋找「Sitemap」模組
3. 按一下安裝並啟用
4. 存取網站地圖位置：`/xoops/sitemap.xml`

### Robots.txt

控制搜尋引擎爬蟲：

建立 `/var/www/html/xoops/robots.txt`：

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## 使用者設定

組態預設使用者相關設定。

### 使用者註冊

**管理面板：** System > Preferences > User Settings

```
允許使用者註冊：是/否
使用者註冊類型：
  - 即時（自動核准）
  - 需要核准（需要管理員核准）
  - 電子郵件驗證（需要電子郵件確認）

需要電子郵件確認：是/否
帳戶啟用方法：自動/手動
```

### 使用者個人檔案

```
啟用使用者個人檔案：是
顯示成員清單：是
顯示使用者頭像：是
最大頭像大小：100KB
頭像尺寸：100x100 像素
```

### 使用者電子郵件顯示

```
顯示使用者電子郵件：否（為保護隱私）
使用者可以隱藏電子郵件：是
使用者可以變更頭像：是
使用者可以上傳檔案：是
```

## 快取組態

透過適當的快取改善效能。

### 快取設定

**管理面板：** System > Preferences > Cache Settings

```
啟用快取：是
快取方法：檔案（或 APCu/Memcache 如果可用）
快取壽命：3600 秒（1 小時）
```

### 清除快取

清除舊快取檔案：

```bash
# 手動快取清除
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# 從管理面板：
# System > Dashboard > Tools > Clear Cache
```

## 初始設定檢查清單

安裝後，組態：

- [ ] 正確設定網站名稱和描述
- [ ] 已組態管理員電子郵件
- [ ] 已組態並測試 SMTP 電子郵件設定
- [ ] 時區設定為您的地區
- [ ] URL 正確組態
- [ ] 已啟用簡潔 URL（如果需要）
- [ ] 已組態使用者註冊設定
- [ ] 已組態 SEO 的中繼標籤
- [ ] 已選擇預設語言
- [ ] 已啟用快取設定
- [ ] 管理員使用者密碼很強（16 個以上字元）
- [ ] 已測試使用者註冊
- [ ] 已測試電子郵件功能
- [ ] 已測試檔案上傳
- [ ] 訪問首頁並驗證外觀

## 測試組態

### 測試電子郵件

傳送測試電子郵件：

**管理面板：** System > Email Test

或手動：

```php
<?php
// 建立測試檔案：/var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS 電子郵件測試');
$mailer->setBody('這是來自 XOOPS 的測試電子郵件');

if ($mailer->send()) {
    echo "電子郵件已成功傳送！";
} else {
    echo "無法傳送電子郵件：" . $mailer->getError();
}
?>
```

### 測試資料庫連線

```php
<?php
// 建立測試檔案：/var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "資料庫已成功連線！";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "查詢成功！";
    }
} else {
    echo "資料庫連線失敗！";
}
?>
```

**重要：** 測試後刪除測試檔案！

```bash
rm /var/www/html/xoops/test-*.php
```

## 組態檔案摘要

| 檔案 | 用途 | 編輯方法 |
|---|---|---|
| mainfile.php | 資料庫和核心設定 | 文字編輯器 |
| 管理面板 | 大多數設定 | 網頁介面 |
| .htaccess | URL 重寫 | 文字編輯器 |
| robots.txt | 搜尋引擎爬蟲 | 文字編輯器 |

## 後續步驟

在基本組態後：

1. 詳細組態系統設定
2. 強化安全性
3. 探索管理面板
4. 建立您的第一個內容
5. 設定使用者帳戶

---

**標籤：** #configuration #setup #email #timezone #seo

**相關文章：**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
