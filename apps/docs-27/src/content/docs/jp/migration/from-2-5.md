---
title: XOOPS 2.5 から 2.7 へのアップグレード
description: XOOPS インストールを 2.5.x から 2.7.x に安全にアップグレードするためのステップバイステップガイド。
---

:::caution[最初にバックアップ]
アップグレード前に常にデータベースとファイルをバックアップしてください。例外はありません。
:::

## 2.7 で何が変更されたか

- **PHP 8.2+ が必須** — PHP 7.x はもはやサポートされていません
- **Composer 管理の依存関係** — `composer.json` で管理されるコアライブラリ
- **PSR-4 オートロード** — モジュールクラスはネームスペースを使用できます
- **改善された XoopsObject** — 新しい `getVar()` 型安全性、`obj2Array()` は廃止
- **Bootstrap 5 管理** — Bootstrap 5 で再構築された管理パネル

## アップグレード前チェックリスト

- [ ] PHP 8.2+ がサーバーで利用可能
- [ ] 完全なデータベースバックアップ (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] インストール全体の完全なファイルバックアップ
- [ ] インストール済みモジュールとそのバージョンのリスト
- [ ] カスタムテーマは個別にバックアップ

## アップグレード手順

### 1. サイトをメンテナンスモードに設定

```php
// mainfile.php — 一時的に追加
define('XOOPS_MAINTENANCE', true);
```

### 2. XOOPS 2.7 をダウンロード

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. コアファイルを置き換え

新しいファイルをアップロード、**ただし以下を除外**:
- `uploads/` — アップロード済みファイル
- `xoops_data/` — 構成
- `modules/` — インストール済みモジュール
- `themes/` — テーマ
- `mainfile.php` — サイト構成

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. アップグレードスクリプトを実行

ブラウザで `https://yourdomain.com/upgrade/` に移動します。
アップグレードウィザードはデータベース移行を適用します。

### 5. モジュールを更新

XOOPS 2.7 モジュールは PHP 8.2 互換である必要があります。
更新されたバージョンについては [モジュールエコシステム](/xoops-docs/2.7/module-guide/introduction/) を確認してください。

Admin → モジュール で、インストール済みの各モジュールの **Update** をクリックします。

### 6. メンテナンスモードを削除してテスト

`mainfile.php` から `XOOPS_MAINTENANCE` 行を削除し、
すべてのページが正しく読み込まれることを確認してください。

## よくある問題

**アップグレード後の「クラスが見つかりません」エラー**
- XOOPS ルートで `composer dump-autoload` を実行します
- `xoops_data/caches/` ディレクトリをクリアします

**更新後にモジュールが破損**
- 2.7 互換バージョンについてモジュールの GitHub リリースを確認してください
- モジュールは PHP 8.2 用のコード変更が必要な場合があります (廃止関数、型指定プロパティ)

**管理パネル CSS が破損**
- ブラウザキャッシュをクリアします
- ファイルアップロード中に `xoops_lib/` が完全に置き換えられたことを確認します
