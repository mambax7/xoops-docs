---
title: "データベース接続エラー"
description: "XOOPSデータベース接続の問題のトラブルシューティングガイド"
---

XOOPSインストールの中で最も一般的な問題の1つはデータベース接続エラーです。このガイドは、接続の問題を特定し解決するための段階的なトラブルシューティングステップを提供します。

## 一般的なエラーメッセージ

### 「MySQL サーバーに接続できません」

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

このエラーは通常、MySQLサーバーが実行されていないか、アクセスできないことを示しています。

### 「ユーザーのアクセスが拒否されました」

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

これは設定内のデータベース認証情報が正確でないことを示しています。

### 「未知のデータベース」

```
Error: Unknown database 'xoops_db'
```

指定されたデータベースがMySQLサーバーに存在しません。

## 設定ファイル

### XOOPS 設定の場所

メイン設定ファイルは以下の場所にあります：

```
/mainfile.php
```

キーとなるデータベース設定：

```php
// データベース設定
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## トラブルシューティングステップ

### ステップ 1：MySQL サービスが実行されていることを確認

#### Linux/Unix では

```bash
# MySQL が実行されているかを確認
sudo systemctl status mysql

# MySQL が実行されていない場合は開始
sudo systemctl start mysql

# MySQL を再起動
sudo systemctl restart mysql
```

### ステップ 2：MySQL 接続をテスト

#### コマンドラインを使用

```bash
# 認証情報を使用して接続をテスト
mysql -h localhost -u xoops_user -p xoops_db

# パスワードを求められたら入力
# 成功時は：mysql>

# MySQL を終了
mysql> EXIT;
```

### ステップ 3：データベース認証情報を確認

#### XOOPS 設定を確認

```php
// mainfile.php では、これらの定数を確認：
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### ステップ 4：データベースが存在することを確認

```bash
# MySQL に接続
mysql -u root -p

# すべてのデータベースを表示
SHOW DATABASES;

# あなたのデータベースをチェック
SHOW DATABASES LIKE 'xoops_db';

# 見つからない場合は、作成
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 終了
EXIT;
```

### ステップ 5：ユーザーパーミッションをチェック

```bash
# root として接続
mysql -u root -p

# ユーザー権限をチェック
SHOW GRANTS FOR 'xoops_user'@'localhost';

# 必要に応じてすべてのパーミッションを付与
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# 権限をリロード
FLUSH PRIVILEGES;
```

## 一般的な問題と解決策

### 問題 1：MySQL が実行されていない

**症状：**
- 接続拒否エラー
- localhost に接続できません

**解決策：**

```bash
# Linux：MySQL を確認して開始
sudo systemctl status mysql
sudo systemctl start mysql
```

### 問題 2：正しくない認証情報

**症状：**
- 「アクセスが拒否されました」エラー
- 「パスワードを使用：YES」または「パスワードを使用：NO」

**解決策：**

```bash
# root として接続
mysql -u root -p

# ユーザーパスワードを変更
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# mainfile.php を更新
define('XOOPS_DB_PASS', 'new_password');
```

### 問題 3：データベースが作成されていない

**症状：**
- 「未知のデータベース」エラー
- インストール中にデータベース作成失敗

**解決策：**

```bash
# データベースが存在するかを確認
mysql -u root -p -e "SHOW DATABASES;"

# データベースが見つからない場合は作成
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## 診断スクリプト

総合的な診断スクリプトを作成します：

```php
<?php
// diagnose-db.php

echo "=== XOOPS データベース診断 ===\n\n";

// 定数定義をチェック
echo "1. 設定チェック：\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "未定義") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "未定義") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "未定義") . "\n\n";

// PHP MySQL 拡張をチェック
echo "2. 拡張チェック：\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// 接続をテスト
echo "3. 接続テスト：\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   失敗：" . $conn->connect_error . "\n";
    } else {
        echo "   成功：MySQL に接続\n";
        echo "   サーバー情報：" . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   例外：" . $e->getMessage() . "\n";
}

echo "\n=== 診断終了 ===\n";
?>
```

## 関連ドキュメント

- White-Screen-of-Death - 一般的なWSoDのトラブルシューティング
- ../../01-Getting-Started/Configuration/Performance-Optimization - データベースパフォーマンスチューニング
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - 初期XOOPS設定
- ../../04-API-Reference/Database/XoopsDatabase - データベース API リファレンス

---

**最終更新：** 2026-01-31
**適用対象：** XOOPS 2.5.7+
**PHPバージョン：** 7.4+
