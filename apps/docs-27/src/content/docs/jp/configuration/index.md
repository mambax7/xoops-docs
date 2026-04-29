---
title: "基本的な設定"
description: "mainfile.php設定、サイト名、メール、タイムゾーン設定を含むXOOPS初期セットアップ"
---

# XOOPS基本設定

インストール後にXOOPSサイトを正しく実行するための重要な設定について説明します。

## mainfile.php設定

`mainfile.php`ファイルはXOOPS インストールのための重要な設定が含まれています。インストール時に作成されますが、手動で編集が必要な場合があります。

### 場所

```
/var/www/html/xoops/mainfile.php
```

### ファイル構造

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### 重要な設定の説明

| 設定 | 目的 | 例 |
|---|---|---|
| `XOOPS_DB_TYPE` | データベースシステム | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | データベースサーバーの場所 | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | データベースユーザー名 | `xoops_user` |
| `XOOPS_DB_PASS` | データベースパスワード | [secure_password] |
| `XOOPS_DB_NAME` | データベース名 | `xoops_db` |
| `XOOPS_DB_PREFIX` | テーブル名プレフィックス | `xoops_` (1つのデータベースに複数のXOOPSを許可) |
| `XOOPS_ROOT_PATH` | 物理ファイルシステムパス | `/var/www/html/xoops` |
| `XOOPS_URL` | Webアクセス可能なURL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | 信頼できるパス (ウェブルートの外) | `/var/www/xoops_var` |

### mainfile.phpの編集

テキストエディタでmainfile.phpを開く:

```bash
# nanoを使用
nano /var/www/html/xoops/mainfile.php

# viを使用
vi /var/www/html/xoops/mainfile.php

# sed (検索と置換)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### mainfile.phpの一般的な変更

**サイトURLを変更:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**デバッグモードを有効化 (開発のみ):**
```php
define('XOOPS_DEBUG', 1);
```

**テーブルプレフィックスを変更 (必要な場合):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**信頼できるパスをウェブルートの外に移動 (高度な設定):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## 管理パネル設定

XOOPS管理パネルで基本的な設定を行います。

### システム設定へアクセス

1. 管理パネルにログイン: `http://your-domain.com/xoops/admin/`
2. 移動: **システム > 設定 > 一般設定**
3. 設定を変更 (下記参照)
4. 下部の「保存」をクリック

### サイト名と説明

サイトの表示方法を設定:

```
サイト名: My XOOPS Site
サイト説明: 動的なコンテンツ管理システム
サイトスローガン: XOOPSで構築
```

### 連絡先情報

サイトの連絡先詳細を設定:

```
サイト管理者メール: admin@your-domain.com
サイト管理者名: サイト管理者
お問い合わせメール: support@your-domain.com
サポートメール: help@your-domain.com
```

### 言語と地域

デフォルト言語と地域を設定:

```
デフォルト言語: English
デフォルトタイムゾーン: America/New_York (またはあなたのタイムゾーン)
日付形式: %Y-%m-%d
時刻形式: %H:%M:%S
```

## メール設定

通知とユーザー通信用のメール設定を行います。

### メール設定の場所

**管理パネル:** システム > 設定 > メール設定

### SMTP設定

信頼できるメール配信には、PHP mail()ではなくSMTPを使用:

```
SMTP を使用: はい
SMTP ホスト: smtp.gmail.com (またはSMTPプロバイダー)
SMTP ポート: 587 (TLS) または 465 (SSL)
SMTP ユーザー名: your-email@gmail.com
SMTP パスワード: [app_password]
SMTP セキュリティ: TLS または SSL
```

### Gmail設定例

GmailでXOOPSメールを送信するために設定:

```
SMTP ホスト: smtp.gmail.com
SMTP ポート: 587
SMTP セキュリティ: TLS
SMTP ユーザー名: your-email@gmail.com
SMTP パスワード: [Google App Password - 通常のGmailパスワードではない]
差出人アドレス: your-email@gmail.com
差出人名: Your Site Name
```

**注:** Gmailは通常のGmailパスワードではなくアプリパスワードが必要です:
1. https://myaccount.google.com/apppasswords に移動
2. 「メール」と「Windows コンピュータ」のアプリパスワードを生成
3. 生成されたパスワードをXOOPSで使用

### PHP mail()設定 (シンプルだが信頼性は低い)

SMTPが利用できない場合、PHP mail()を使用:

```
SMTP を使用: いいえ
差出人アドレス: noreply@your-domain.com
差出人名: Your Site Name
```

サーバーにsendmailまたはpostfixが設定されていることを確認:

```bash
# sendmailが利用可能かを確認
which sendmail

# またはpostfixを確認
systemctl status postfix
```

### メール機能設定

メールをトリガーするものを設定:

```
通知を送信: はい
ユーザー登録時に管理者に通知: はい
新規ユーザーにウェルカムメールを送信: はい
パスワードリセットリンクを送信: はい
ユーザーメールを有効化: はい
プライベートメッセージを有効化: はい
管理者アクションで通知: はい
```

## タイムゾーン設定

タイムスタンプとスケジューリングを正確に行うための適切なタイムゾーンを設定します。

### 管理パネルでタイムゾーンを設定

**パス:** システム > 設定 > 一般設定

```
デフォルトタイムゾーン: [タイムゾーンを選択]
```

**一般的なタイムゾーン:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### タイムゾーンを確認

現在のサーバーのタイムゾーンを確認:

```bash
# 現在のタイムゾーンを表示
timedatectl

# または日付を確認
date +%Z

# 利用可能なタイムゾーンの一覧
timedatectl list-timezones
```

### システムタイムゾーンを設定 (Linux)

```bash
# タイムゾーンを設定
timedatectl set-timezone America/New_York

# またはシンボリックリンク方法を使用
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# 確認
date
```

## URL設定

### クリーンURL (フレンドリーURL) を有効化

`/index.php?page=about`ではなく`/page/about`のようなURLを使用する場合

**要件:**
- mod_rewriteが有効なApache
- XOOPSルートの`.htaccess`ファイル

**管理パネルで有効化:**

1. 移動: **システム > 設定 > URL設定**
2. 確認: 「フレンドリーURLを有効化」
3. 選択: 「URLタイプ」 (Path InfoまたはQuery)
4. 保存

**.htaccessが存在することを確認:**

```bash
cat /var/www/html/xoops/.htaccess
```

.htaccessのサンプル内容:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**クリーンURLのトラブルシューティング:**

```bash
# mod_rewriteが有効か確認
apache2ctl -M | grep rewrite

# 必要な場合は有効化
a2enmod rewrite

# Apacheを再起動
systemctl restart apache2

# リライトルールをテスト
curl -I http://your-domain.com/xoops/index.php
```

### サイトURLを設定

**管理パネル:** システム > 設定 > 一般設定

ドメイン用の正しいURLを設定:

```
サイトURL: http://your-domain.com/xoops/
```

またはXOOPSがルートの場合:

```
サイトURL: http://your-domain.com/
```

## 検索エンジン最適化 (SEO)

検索エンジンの視認性を向上させるためにSEO設定を行います。

### メタタグ

グローバルメタタグを設定:

**管理パネル:** システム > 設定 > SEO設定

```
メタキーワード: xoops, cms, content management
メタ説明: 動的なコンテンツ管理システム
```

ページの`<head>`に表示されます:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### サイトマップ

検索エンジン用のXMLサイトマップを有効化:

1. 移動: **システム > モジュール**
2. 「サイトマップ」モジュールを探す
3. クリックしてインストールと有効化
4. サイトマップにアクセス: `/xoops/sitemap.xml`

### robots.txt

検索エンジンのクローリングを制御:

`/var/www/html/xoops/robots.txt`を作成:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## ユーザー設定

ユーザー関連のデフォルト設定を行います。

### ユーザー登録

**管理パネル:** システム > 設定 > ユーザー設定

```
ユーザー登録を許可: はい/いいえ
ユーザー登録タイプ:
  - 即座 (自動承認)
  - 承認が必要 (管理者の承認が必要)
  - メール確認 (メール確認が必要)

メール確認が必要: はい/いいえ
アカウント有効化方法: 自動/手動
```

### ユーザープロフィール

```
ユーザープロフィールを有効化: はい
ユーザーアバターを表示: はい
最大アバターサイズ: 100KB
アバター寸法: 100x100 pixels
```

### ユーザーメール表示

```
ユーザーメールを表示: いいえ (プライバシー)
ユーザーはメールを非表示にできる: はい
ユーザーはアバターを変更できる: はい
ユーザーはファイルをアップロードできる: はい
```

## キャッシュ設定

適切なキャッシングでパフォーマンスを向上させます。

### キャッシュ設定

**管理パネル:** システム > 設定 > キャッシュ設定

```
キャッシングを有効化: はい
キャッシュ方法: ファイル (またはAPCu/Memcache)
キャッシュ有効期限: 3600秒 (1時間)
```

### キャッシュをクリア

古いキャッシュファイルをクリア:

```bash
# 手動キャッシュクリア
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# 管理パネルから:
# システム > ダッシュボード > ツール > キャッシュをクリア
```

## 初期設定チェックリスト

インストール後に設定:

- [ ] サイト名と説明が正しく設定
- [ ] 管理者メールが設定
- [ ] SMTPメール設定が設定され、テスト
- [ ] タイムゾーンがあなたの地域に設定
- [ ] URLが正しく設定
- [ ] クリーンURL (フレンドリーURL) が有効化 (希望の場合)
- [ ] ユーザー登録設定が設定
- [ ] SEO用のメタタグが設定
- [ ] デフォルト言語が選択
- [ ] キャッシュ設定が有効化
- [ ] 管理者ユーザーパスワードは強力 (16文字以上)
- [ ] ユーザー登録をテスト
- [ ] メール機能をテスト
- [ ] ファイルアップロードをテスト
- [ ] ホームページにアクセスして表示を確認

## 設定のテスト

### メールをテスト

テストメール送信:

**管理パネル:** システム > メールテスト

または手動で:

```php
<?php
// テストファイルを作成: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### データベース接続をテスト

```php
<?php
// テストファイルを作成: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**重要:** テスト後にテストファイルを削除!

```bash
rm /var/www/html/xoops/test-*.php
```

## 設定ファイル概要

| ファイル | 目的 | 編集方法 |
|---|---|---|
| mainfile.php | データベースとコア設定 | テキストエディタ |
| 管理パネル | ほとんどの設定 | Webインターフェース |
| .htaccess | URLリライト | テキストエディタ |
| robots.txt | 検索エンジンのクローリング | テキストエディタ |

## 次のステップ

基本設定後:

1. システム設定を詳細に設定
2. セキュリティを強化
3. 管理パネルを探索
4. 最初のコンテンツを作成
5. ユーザーアカウントを設定

---

**タグ:** #configuration #setup #email #timezone #seo

**関連記事:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
