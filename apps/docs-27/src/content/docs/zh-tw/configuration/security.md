---
title: "安全組態"
description: "XOOPS 完整的安全強化指南，包括檔案權限、SSL/HTTPS、敏感目錄和安全最佳做法"
---

# XOOPS 安全組態

強化您的 XOOPS 安裝以抵禦常見網頁漏洞的完整指南。

## 安全檢查清單

在啟動網站前，實施這些安全措施：

- [ ] 檔案權限設定正確 (644/755)
- [ ] 安裝資料夾已移除或受保護
- [ ] mainfile.php 受保護免於修改
- [ ] 在所有頁面上啟用 SSL/HTTPS
- [ ] 管理資料夾已重新命名或受保護
- [ ] 敏感檔案不可網頁存取
- [ ] .htaccess 限制已就位
- [ ] 定期備份自動化
- [ ] 安全標頭已組態
- [ ] CSRF 保護已啟用
- [ ] SQL 注入保護有效
- [ ] 模組/擴充功能已更新

## 檔案系統安全

### 檔案權限

正確的檔案權限對安全至關重要。

#### 權限指南

| 路徑 | 權限 | 擁有者 | 原因 |
|---|---|---|---|
| mainfile.php | 644 | root | 包含資料庫認證 |
| *.php 檔案 | 644 | root | 防止未授權修改 |
| 目錄 | 755 | root | 允許讀取，防止寫入 |
| cache/ | 777 | www-data | 網頁伺服器必須寫入 |
| templates_c/ | 777 | www-data | 已編譯的範本 |
| uploads/ | 777 | www-data | 使用者上傳 |
| var/ | 777 | www-data | 變數資料 |
| install/ | 移除 | - | 安裝後刪除 |
| configs/ | 755 | root | 可讀，不可寫 |

#### 設定權限指令碼

```bash
#!/bin/bash
# 檔案：/usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# 設定擁有權
echo "設定擁有權..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# 設定限制性預設權限
echo "設定基本權限..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# 使特定目錄可寫入
echo "設定可寫入目錄..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# 保護敏感檔案
echo "保護敏感檔案..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # 如果存在（唯讀）

# 驗證權限
echo "驗證權限..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "安全強化已完成！"
```

執行指令碼：

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### 移除安裝資料夾

**關鍵：** 安裝資料夾必須在安裝後移除！

```bash
# 選項 1：完全刪除
rm -rf /var/www/html/xoops/install/

# 選項 2：重新命名並保留作為參考
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# 驗證移除
ls -la /var/www/html/xoops/ | grep install
```

### 保護敏感目錄

建立 .htaccess 檔案以封鎖對敏感資料夾的網頁存取：

**檔案：/var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**檔案：/var/www/html/xoops/uploads/.htaccess**

```apache
# 防止指令碼執行
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# 防止目錄清單
Options -Indexes

# 其他保護
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # 封鎖可疑檔案
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## SSL/HTTPS 組態

加密使用者和伺服器之間的所有流量。

### 獲取 SSL 憑證

**選項 1：Let's Encrypt 的免費憑證**

```bash
# 安裝 Certbot
apt-get install certbot python3-certbot-apache

# 獲得憑證（自動設定 Apache）
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# 驗證憑證已安裝
ls /etc/letsencrypt/live/your-domain.com/
```

**選項 2：商業 SSL 憑證**

聯絡 SSL 提供者或註冊商：
1. 購買 SSL 憑證
2. 驗證網域所有權
3. 在伺服器上安裝憑證檔案
4. 組態網頁伺服器

### Apache SSL 組態

建立 HTTPS 虛擬主機：

**檔案：/etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # SSL 組態
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # 安全標頭
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"

    <Directory /var/www/html/xoops>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # 限制安裝資料夾
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # 日誌記錄
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# 將 HTTP 重新導向到 HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

啟用組態：

```bash
# 啟用 SSL 模組
a2enmod ssl

# 啟用網站
a2ensite xoops-ssl

# 停用非 SSL 網站（如存在）
a2dissite 000-default

# 測試組態
apache2ctl configtest
# 應輸出：語法 OK

# 重新啟動 Apache
systemctl restart apache2
```

### Nginx SSL 組態

**檔案：/etc/nginx/sites-available/xoops**

```nginx
# HTTP 至 HTTPS 重新導向
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 伺服器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # SSL 憑證組態
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 現代 SSL 組態
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS 標頭
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # 安全標頭
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # 限制安裝資料夾
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # 拒絕存取敏感檔案
    location ~ /\. {
        deny all;
    }

    # PHP-FPM 後端
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    # 存取日誌
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

啟用組態：

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 驗證 HTTPS 安裝

```bash
# 測試 SSL 組態
openssl s_client -connect your-domain.com:443 -tls1_2

# 檢查憑證有效性
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS 線上測試
# https://www.ssllabs.com/ssltest/
```

### 自動更新 Let's Encrypt 憑證

```bash
# 啟用自動更新
systemctl enable certbot.timer
systemctl start certbot.timer

# 測試更新流程
certbot renew --dry-run

# 手動更新（如果需要）
certbot renew --force-renewal
```

## 網頁應用程式安全

### 保護免於 SQL 注入

XOOPS 預設使用參數化查詢（安全），但始終：

```php
// 不安全 - 永遠不要這樣做！
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// 安全 - 使用準備陳述式
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### 跨站點指令碼 (XSS) 防止

始終清理使用者輸入：

```php
// 不安全
echo $_GET['user_input'];

// 安全 - 使用 XOOPS 清理函數
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');
```

### 跨站點請求偽造 (CSRF) 防止

XOOPS 包含 CSRF 權杖保護。始終包含權杖：

```html
<!-- 在表單中 -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

## 管理面板安全

### 重新命名管理資料夾

透過重新命名管理資料夾來保護它：

```bash
# 重新命名管理資料夾
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# 更新管理存取 URL
# 舊：http://your-domain.com/xoops/admin/
# 新：http://your-domain.com/xoops/myadmin123/
```

編輯 mainfile.php：

```php
// 變更此行
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### IP 白名單用於管理

將管理員存取限制在特定 IP：

**檔案：/var/www/html/xoops/myadmin123/.htaccess**

```apache
# 僅允許特定 IP
<RequireAll>
    Require ip 192.168.1.100   # 您的辦公室 IP
    Require ip 203.0.113.50    # 您的家用 IP
    Deny from all
</RequireAll>
```

### 強管理員認證

為管理員強制使用強密碼：

1. 至少 16 個字元
2. 混合大小寫、數字、符號
3. 定期變更密碼（每 90 天）
4. 使用密碼管理員
5. 啟用雙因素驗證（如果可用）

## 定期維護

### 更新 XOOPS 和模組

保持 XOOPS 和所有模組更新。

### 自動化安全掃描

```bash
#!/bin/bash
# 安全稽核指令碼

# 檢查檔案權限
echo "檢查檔案權限..."
find /var/www/html/xoops -type f ! -perm 644 | head -10

# 檢查可疑檔案
echo "檢查可疑檔案..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# 檢查資料庫的可疑活動
echo "檢查登入失敗的嘗試..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### 定期備份

自動化每日備份：

```bash
#!/bin/bash
# 每日備份指令碼

BACKUP_DIR="/backups/xoops"
RETENTION=30  # 保留 30 天

# 備份資料庫
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# 備份檔案
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# 移除舊備份
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "備份已在 $(date) 完成"
```

用 cron 進行排程：

```bash
# 編輯 crontab
crontab -e

# 新增行（每天凌晨 2 點執行）
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## 安全檢查清單範本

用此範本進行定期安全稽核：

```
每週安全檢查清單
========================

日期：___________
檢查者：___________

檔案系統：
[ ] 權限正確 (644/755)
[ ] 安裝資料夾已移除
[ ] 沒有可疑檔案
[ ] mainfile.php 已保護

網頁安全：
[ ] HTTPS/SSL 有效
[ ] 安全標頭存在
[ ] 管理面板已受限制
[ ] 檔案上傳限制有效
[ ] 登入嘗試已記錄

應用程式：
[ ] XOOPS 版本為目前版本
[ ] 所有模組已更新
[ ] 日誌中沒有錯誤訊息
[ ] 資料庫已最佳化
[ ] 快取已清除

備份：
[ ] 資料庫已備份
[ ] 檔案已備份
[ ] 備份已測試
[ ] 異地副本已驗證

發現的問題：
1. ___________
2. ___________

採取的動作：
1. ___________
2. ___________
```

## 安全資源

- 伺服器需求
- 基本組態
- 效能最佳化
- OWASP Top 10：https://owasp.org/www-project-top-ten/

---

**標籤：** #security #ssl #https #hardening #best-practices

**相關文章：**
- ../Installation/Installation
- System-Settings
- ../Installation/Upgrading-XOOPS
