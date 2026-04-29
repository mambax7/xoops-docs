---
title: "トラブルシューティング"
description: "XOOPSの一般的な問題、デバッグテクニック、FAQへの解決策"
---

> XOOPSの一般的な問題と、デバッグテクニックの解決策。

---

## 📋 クイック診断

特定の問題に飛び込む前に、これらの一般的な原因をチェックしてください：

1. **ファイルパーミッション** - ディレクトリは755、ファイルは644が必要
2. **PHPバージョン** - PHP 7.4以上を確認（8.x推奨）
3. **エラーログ** - `xoops_data/logs/`とPHPエラーログを確認
4. **キャッシュ** - 管理者 → システム → メンテナンスでキャッシュをクリア

---

## 🗂️ セクションのコンテンツ

### 一般的な問題
- ホワイトスクリーン（WSOD）
- データベース接続エラー
- パーミッション拒否エラー
- モジュールインストール失敗
- テンプレートコンパイルエラー

### FAQ
- インストール FAQ
- モジュール FAQ
- テーマ FAQ
- パフォーマンス FAQ

### デバッグ
- デバッグモード有効化
- Ray デバッガの使用
- データベースクエリデバッグ
- Smartyテンプレートデバッグ

---

## 🚨 一般的な問題と解決策

### ホワイトスクリーン（WSOD）

**症状：** 空白のページ、エラーメッセージなし

**解決策：**

1. **PHP エラー表示を一時的に有効化：**
   ```php
   // mainfile.php に一時的に追加
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **PHP エラーログを確認：**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **一般的な原因：**
   - メモリ制限超過
   - PHPの致命的な構文エラー
   - 必要な拡張機能が見つかりません

4. **メモリの問題を修正：**
   ```php
   // mainfile.php または php.ini
   ini_set('memory_limit', '256M');
   ```

---

### データベース接続エラー

**症状：** 「データベースに接続できません」またはそれに類する

**解決策：**

1. **mainfile.php の認証情報を確認：**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **接続を手動でテスト：**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **MySQL サービスを確認：**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **ユーザーパーミッションを確認：**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### パーミッション拒否エラー

**症状：** ファイルをアップロードできない、設定を保存できない

**解決策：**

1. **正しいパーミッションを設定：**
   ```bash
   # ディレクトリ
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # ファイル
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # 書き込み可能なディレクトリ
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **正しい所有権を設定：**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **SELinux を確認（CentOS/RHEL）：**
   ```bash
   # ステータス確認
   sestatus

   # httpd が書き込みを許可
   setsebool -P httpd_unified 1
   ```

---

### モジュールインストール失敗

**症状：** モジュールがインストールできない、SQL エラー

**解決策：**

1. **モジュール要件を確認：**
   - PHPバージョン互換性
   - 必要なPHP拡張機能
   - XOOPSバージョン互換性

2. **SQL を手動でインストール：**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **モジュールキャッシュをクリア：**
   ```php
   // xoops_data/caches/ に
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **xoops_version.php の構文をチェック：**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### テンプレートコンパイルエラー

**症状：** Smarty エラー、テンプレートが見つかりません

**解決策：**

1. **Smarty キャッシュをクリア：**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **テンプレート構文を確認：**
   ```smarty
   {* 正しい *}
   {$variable}

   {* 誤り - $ が見つかりません *}
   {variable}
   ```

3. **テンプレートが存在することを確認：**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **テンプレートを再生成：**
   - 管理者 → システム → メンテナンス → テンプレート → 再生成

---

## 🐛 デバッグテクニック

### XOOPS デバッグモードを有効化

```php
// mainfile.php 内
define('XOOPS_DEBUG_LEVEL', 2);

// レベル：
// 0 = オフ
// 1 = PHPデバッグ
// 2 = PHP + SQLデバッグ
// 3 = PHP + SQL + Smartyテンプレート
```

### Ray デバッガを使用

Ray は PHP のための優れたデバッグツールです：

```php
// Composer経由でインストール
composer require spatie/ray

// コード内での使用
ray($variable);
ray($object)->expand();
ray()->measure();

// データベースクエリ
ray($sql)->label('Query');
```

### Smarty デバッグコンソール

```smarty
{* テンプレート内で有効化 *}
{debug}

{* または PHP 内 *}
$xoopsTpl->debugging = true;
```

### データベースクエリログ

```php
// クエリログを有効化
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// すべてのクエリを取得
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ よくある質問

### インストール

**Q: インストールウィザードが空白ページを表示します**
A: PHPエラーログを確認し、PHPが十分なメモリを持っていることを確認し、ファイルパーミッションを確認します。

**Q: インストール中に mainfile.php に書き込むことができません**
A: パーミッションを設定します：インストール中は `chmod 666 mainfile.php`、その後 `chmod 444` に設定します。

**Q: データベーステーブルが作成されていません**
A: MySQLユーザーが CREATE TABLE 権限を持っていることを確認し、データベースが存在することを確認します。

### モジュール

**Q: モジュール管理ページが空白です**
A: キャッシュをクリアし、モジュールの admin/menu.php の構文エラーを確認します。

**Q: モジュールブロックが表示されません**
A: 管理者 → ブロックでブロックパーミッションを確認し、ブロックがページに割り当てられていることを確認します。

**Q: モジュール更新が失敗します**
A: データベースをバックアップして、手動でSQLを更新し、バージョン要件を確認します。

### テーマ

**Q: テーマが正しく適用されていません**
A: Smartyキャッシュをクリアし、theme.html が存在することを確認し、テーマパーミッションを確認します。

**Q: カスタム CSS が読み込まれていません**
A: ファイルパスを確認し、ブラウザキャッシュをクリアし、CSS構文を確認します。

**Q: 画像が表示されていません**
A: 画像パスを確認し、uploadsフォルダパーミッションを確認します。

### パフォーマンス

**Q: サイトが非常に遅いです**
A: キャッシュを有効化し、データベースを最適化し、遅いクエリを確認し、OpCache を有効化します。

**Q: メモリ使用量が多いです**
A: memory_limit を増やし、大規模なクエリを最適化し、ページネーションを実装します。

---

## 🔧 メンテナンスコマンド

### すべてのキャッシュをクリア

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### データベース最適化

```sql
-- すべてのテーブルを最適化
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- 他のテーブルに対して繰り返します

-- または一度にすべてを最適化
mysqlcheck -o -u user -p database
```

### ファイル整合性をチェック

```bash
# 新規インストールと比較
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 関連ドキュメント

- はじめに
- セキュリティベストプラクティス
- XOOPS 4.0 ロードマップ

---

## 📚 外部リソース

- [XOOPS Forums](https://xoops.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Error Reference](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #troubleshooting #debugging #faq #errors #solutions
