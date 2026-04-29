---
title: "セキュリティ設定"
description: "ファイルのパーミッション、SSL/HTTPS、機密ディレクトリ、セキュリティベストプラクティスを含むXOOPSセキュリティ強化ガイド"
---

# XOOPSセキュリティ設定

一般的なWeb脆弱性からXOOPSインストールを保護するための包括的ガイド。

## セキュリティチェックリスト

サイト公開前にこれらのセキュリティ対策を実装:

- [ ] ファイルのパーミッションが正しく設定 (644/755)
- [ ] インストールフォルダーが削除または保護
- [ ] mainfile.phpが修正から保護
- [ ] すべてのページでSSL/HTTPS有効化
- [ ] 管理フォルダーが名前変更または保護
- [ ] 機密ファイルがWebからアクセス不可
- [ ] .htaccess制限が配置
- [ ] 定期バックアップが自動化
- [ ] セキュリティヘッダーが設定
- [ ] CSRF保護が有効化
- [ ] SQLインジェクション保護がアクティブ
- [ ] モジュール/拡張機能が更新

## ファイルシステムセキュリティ

### ファイルのパーミッション

適切なファイルのパーミッションはセキュリティに不可欠です。

#### パーミッションガイドライン

| パス | パーミッション | オーナー | 理由 |
|---|---|---|---|
| mainfile.php | 644 | root | DB認証情報を含む |
| *.php ファイル | 644 | root | 無許可の修正を防止 |
| ディレクトリ | 755 | root | 読み取りを許可、書き込みを防止 |
| cache/ | 777 | www-data | Webサーバーが書き込み必要 |
| templates_c/ | 777 | www-data | コンパイルテンプレート |
| uploads/ | 777 | www-data | ユーザーアップロード |
| var/ | 777 | www-data | 可変データ |
| install/ | 削除 | - | インストール後に削除 |
| configs/ | 755 | root | 読み取り可能、書き込み不可 |

#### パーミッション設定スクリプト

```bash
#!/bin/bash
# ファイル: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# 所有権を設定
echo "所有権を設定中..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# 制限的なデフォルトのパーミッションを設定
echo "基本パーミッションを設定中..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# 特定のディレクトリを書き込み可能にする
echo "書き込み可能なディレクトリを設定中..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# 機密ファイルを保護
echo "機密ファイルを保護中..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # 存在する場合 (読み取り専用)

# パーミッションを確認
echo "パーミッションを確認中..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "セキュリティ強化が完了しました!"
```

スクリプトを実行:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### インストールフォルダーを削除

**重要:** インストールフォルダーはインストール後に削除する必要があります!

```bash
# オプション1: 完全に削除
rm -rf /var/www/html/xoops/install/

# オプション2: 参照のために名前変更して保持
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# 削除を確認
ls -la /var/www/html/xoops/ | grep install
```

### 機密ディレクトリを保護

Webアクセスをブロックするための.htaccessファイルを作成:

**ファイル: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**ファイル: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**ファイル: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### アップロードディレクトリを保護

アップロードディレクトリでのスクリプト実行を防止:

**ファイル: /var/www/html/xoops/uploads/.htaccess**

```apache
# スクリプト実行を防止
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# ディレクトリリストを防止
Options -Indexes

# 追加保護
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # 疑わしいファイルをブロック
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## SSL/HTTPS設定

ユーザーとサーバー間のすべてのトラフィックを暗号化します。

### SSL証明書を取得

**オプション1: Let's Encryptから無料証明書**

```bash
# Certbotをインストール
apt-get install certbot python3-certbot-apache

# 証明書を取得 (Apacheを自動設定)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# 証明書がインストールされたことを確認
ls /etc/letsencrypt/live/your-domain.com/
```

**オプション2: 商用SSL証明書**

SSLプロバイダーまたはレジストラに連絡:
1. SSL証明書を購入
2. ドメイン所有権を確認
3. 証明書ファイルをサーバーにインストール
4. Webサーバーを設定

### Apache SSL設定

HTTPSバーチャルホストを作成:

**ファイル: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # SSL設定
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # セキュリティヘッダー
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    <Directory /var/www/html/xoops>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # インストールフォルダーを制限
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # ロギング
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# HTTPをHTTPSにリダイレクト
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

設定を有効化:

```bash
# SSLモジュールを有効化
a2enmod ssl

# サイトを有効化
a2ensite xoops-ssl

# 非SSLサイトを無効化 (存在する場合)
a2dissite 000-default

# 設定をテスト
apache2ctl configtest
# 出力: Syntax OK

# Apacheを再起動
systemctl restart apache2
```

### Nginx SSL設定

**ファイル: /etc/nginx/sites-available/xoops**

```nginx
# HTTPをHTTPSにリダイレクト
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPSサーバー
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # SSL証明書設定
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # モダンSSL設定
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTSヘッダー
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # セキュリティヘッダー
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # インストールフォルダーを制限
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # 隠しファイルへのアクセスを拒否
    location ~ /\. {
        deny all;
    }

    # PHP-FPMバックエンド
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # 静的ファイルのキャッシング
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # URLリライト
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # ロギング
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

設定を有効化:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### HTTPS インストールを確認

```bash
# SSL設定をテスト
openssl s_client -connect your-domain.com:443 -tls1_2

# 証明書の有効性を確認
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLSをオンラインでテスト
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Let's Encrypt証明書を自動更新

```bash
# 自動更新を有効化
systemctl enable certbot.timer
systemctl start certbot.timer

# 更新プロセスをテスト
certbot renew --dry-run

# 必要に応じて手動更新
certbot renew --force-renewal
```

## Webアプリケーションセキュリティ

### SQLインジェクション対策

XOOPSはデフォルトでパラメーター化されたクエリ (安全) を使用しますが、常に:

```php
// 安全でない - これは決行わないこと!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// 安全 - プリペアドステートメントを使用
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### クロスサイトスクリプティング (XSS) 防止

常にユーザー入力をサニタイズ:

```php
// 安全でない
echo $_GET['user_input'];

// 安全 - XOOPSサニタイズ機能を使用
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// またはXOOPS機能を使用
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### クロスサイトリクエストフォージェリ (CSRF) 防止

XOOPSはCSRF トークン保護を含みます。常にトークンを含める:

```html
<!-- フォームで -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### アップロードフォルダーでPHP実行を無効化

攻撃者がPHPをアップロードして実行するのを防止:

```bash
# アップロードフォルダーで.htaccessを作成
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# または グローバルにアップロードを無効化
chmod 444 /var/www/html/xoops/uploads/  # 読み取り専用
```

### セキュリティヘッダー

重要なHTTPセキュリティヘッダーを設定:

```apache
# Strict-Transport-Security (HSTS)
# 1年間HTTPSを強制
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# MIMEタイプスニッピングを防止
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# クリックジャッキング攻撃を防止
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# ブラウザXSS保護
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Referrer情報を制御
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# リソースロードを制御
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## 管理パネルセキュリティ

### 管理フォルダーを名前変更

管理フォルダーを名前変更して保護:

```bash
# 管理フォルダーを名前変更
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# 管理アクセスURL を更新
# 旧: http://your-domain.com/xoops/admin/
# 新: http://your-domain.com/xoops/myadmin123/
```

XOOPSで名前変更したフォルダーを使用するように設定:

mainfile.phpを編集:

```php
// この行を変更
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### IP ホワイトリストで管理へアクセス

特定のIPに管理アクセスを制限:

**ファイル: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# 特定のIPのみを許可
<RequireAll>
    Require ip 192.168.1.100   # オフィスIP
    Require ip 203.0.113.50    # 自宅IP
    Deny from all
</RequireAll>
```

またはApache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### 強力な管理者認証情報

管理者に強いパスワードを強制:

1. 最低16文字を使用
2. 大文字、小文字、数字、シンボルを混在
3. 定期的に変更 (90日ごと)
4. パスワードマネージャーを使用
5. 利用可能な場合は二要素認証を有効化

### 管理アクティビティを監視

管理ログイン ログを有効化:

**管理パネル > システム > 設定 > ユーザー設定**

```
管理者ログインをログ: はい
失敗したログイン試行をログ: はい
管理者ログイン時にメール通知: はい
```

ログを定期的に確認:

```bash
# ログイン試行をデータベースで確認
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## 定期的なメンテナンス

### XOOPSとモジュールを更新

XOOPSとすべてのモジュールを最新に保つ:

```bash
# 管理パネルで更新を確認
# 管理 > モジュール > 更新を確認

# またはコマンドラインで
cd /var/www/html/xoops
# 最新バージョンをダウンロードしてインストール
# アップグレードガイドを実行
```

### 自動セキュリティスキャン

```bash
#!/bin/bash
# セキュリティ監査スクリプト

# ファイルのパーミッションを確認
echo "ファイルのパーミッションを確認中..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# 疑わしいファイルを確認
echo "疑わしいファイルを確認中..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# データベースで疑わしいアクティビティを確認
echo "失敗したログイン試行をチェック中..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### 定期的なバックアップ

毎日のバックアップを自動化:

```bash
#!/bin/bash
# 日次バックアップスクリプト

BACKUP_DIR="/backups/xoops"
RETENTION=30  # 30日間保持

# データベースをバックアップ
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# ファイルをバックアップ
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# 古いバックアップを削除
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "バックアップが$(date)に完了しました"
```

cronでスケジュール:

```bash
# Crontabを編集
crontab -e

# 行を追加 (毎日午前2時に実行)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## セキュリティチェックリストテンプレート

定期的なセキュリティ監査に使用:

```
週間セキュリティチェックリスト
========================

日付: ___________
チェック者: ___________

ファイルシステム:
[ ] パーミッションが正しい (644/755)
[ ] インストールフォルダーが削除
[ ] 疑わしいファイルなし
[ ] mainfile.phpが保護

Webセキュリティ:
[ ] HTTPS/SSLが動作
[ ] セキュリティヘッダーが存在
[ ] 管理パネルが制限
[ ] ファイルアップロード制限がアクティブ
[ ] ログイン試行がログされている

アプリケーション:
[ ] XOOPSバージョンが現在
[ ] すべてのモジュールが更新
[ ] ログにエラーメッセージなし
[ ] データベースが最適化
[ ] キャッシュがクリア

バックアップ:
[ ] データベースがバックアップ
[ ] ファイルがバックアップ
[ ] バックアップがテスト
[ ] オフサイトコピーが確認

見つかった問題:
1. ___________
2. ___________
3. ___________

取られたアクション:
1. ___________
2. ___________
```

## セキュリティリソース

- Server Requirements
- Basic Configuration
- Performance Optimization
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**タグ:** #security #ssl #https #hardening #best-practices

**関連記事:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
