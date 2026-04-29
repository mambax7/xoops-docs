---
title: "パーミッション拒否エラー"
description: "XOOPSのファイルとディレクトリパーミッション問題のトラブルシューティング"
---

ファイルおよびディレクトリパーミッションの問題はXOOPSインストールでよくあり、特にアップロードやサーバー移行後に発生します。このガイドはパーミッション問題の診断と解決を支援します。

## ファイルパーミッションの理解

### Linux/Unix パーミッション基礎

ファイルパーミッションは3桁のコードで表されます：

```
rwxrwxrwx
||| ||| |||
||| ||| +-- 他のユーザー
||| +------ グループ
+--------- 所有者

r = 読み取り (4)
w = 書き込み (2)
x = 実行 (1)

755 = rwxr-xr-x （所有者は完全、グループと他は読み取り/実行）
644 = rw-r--r-- （所有者は読み取り/書き込み、グループと他は読み取り）
777 = rwxrwxrwx （全員に完全アクセス - 非推奨）
```

## 一般的なパーミッションエラー

### アップロードで「パーミッション拒否」

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### 「ファイルに書き込みできません」

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### 「ディレクトリを作成できません」

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## XOOPSの重要なディレクトリ

### 書き込みパーミッションが必要なディレクトリ

| ディレクトリ | 最小値 | 目的 |
|-----------|---------|---------|
| `/uploads` | 755 | ユーザーアップロード |
| `/cache` | 755 | キャッシュファイル |
| `/templates_c` | 755 | コンパイル済みテンプレート |
| `/var` | 755 | 変数データ |
| `mainfile.php` | 644 | 設定（読み取り可能） |

## Linux/Unix トラブルシューティング

### ステップ 1：現在のパーミッションをチェック

```bash
# ファイルパーミッションをチェック
ls -l /var/www/html/xoops/

# 特定のファイルをチェック
ls -l /var/www/html/xoops/mainfile.php

# ディレクトリパーミッションをチェック
ls -ld /var/www/html/xoops/uploads/
```

### ステップ 2：Web サーバーユーザーを特定

```bash
# Apache ユーザーをチェック
ps aux | grep -E '[a]pache|[h]ttpd'
# 通常：www-data（Debian/Ubuntu）または apache（RedHat/CentOS）

# Nginx ユーザーをチェック
ps aux | grep -E '[n]ginx'
# 通常：www-data または nginx
```

### ステップ 3：所有権を修正

```bash
# 正しい所有権を設定（www-data ユーザーと仮定）
sudo chown -R www-data:www-data /var/www/html/xoops/

# Web に書き込み可能なディレクトリのみ修正
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### ステップ 4：パーミッションを修正

#### オプション A：制限的なパーミッション（推奨）

```bash
# すべてのディレクトリ：755（rwxr-xr-x）
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# すべてのファイル：644（rw-r--r--）
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# 書き込み可能なディレクトリを除いて
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### オプション B：すべてをまとめたスクリプト

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "XOOPS パーミッションを修正しています..."

# 所有権を設定
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# ディレクトリパーミッションを設定
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# ファイルパーミッションを設定
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# 書き込み可能なディレクトリを確認
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "完了！パーミッションを修正しました。"
```

## ディレクトリごとのパーミッション問題

### uploads ディレクトリ

**問題：** ファイルをアップロードできない

```bash
# 解決策
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### cache ディレクトリ

**問題：** キャッシュファイルが書き込まれない

```bash
# 解決策
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### templates cache

**問題：** テンプレートがコンパイルされない

```bash
# 解決策
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Windows トラブルシューティング

### ステップ 1：ファイルプロパティをチェック

1. ファイルを右クリック → プロパティ
2. 「セキュリティ」タブをクリック
3. 「編集」ボタンをクリック
4. ユーザーを選択してパーミッションを確認

### ステップ 2：書き込みパーミッションを付与

#### GUI 経由：

```
1. フォルダを右クリック → プロパティ
2. 「セキュリティ」タブを選択
3. 「編集」をクリック
4. 「IIS_IUSRS」または「NETWORK SERVICE」を選択
5. 「変更」と「書き込み」をチェック
6. 「適用」と「OK」をクリック
```

#### コマンドライン（PowerShell）：

```powershell
# PowerShell を管理者として実行

# IIS アプリプールパーミッションを付与
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## PHP スクリプトでパーミッションをチェック

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS パーミッションチェック</h2>";
echo "<table border='1'>";
echo "<tr><th>パス</th><th>読み取り可能</th><th>書き込み可能</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## ベストプラクティス

### 1. 最小権限の原則

```bash
# 必要なパーミッションのみを付与
# 777 や 666 を使用しない

# 悪い例
chmod 777 /var/www/html/xoops/uploads/  # 危険！

# 良い例
chmod 755 /var/www/html/xoops/uploads/  # セキュア
```

### 2. 変更前にバックアップ

```bash
# 現在の状態をバックアップ
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## クイックリファレンス

```bash
# クイック修正（Linux）
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## 関連ドキュメント

- White-Screen-of-Death - その他の一般的なエラー
- Database-Connection-Errors - データベースの問題
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS設定

---

**最終更新：** 2026-01-31
**適用対象：** XOOPS 2.5.7+
**OS：** Linux、Windows、macOS
