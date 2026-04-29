---
title: "付録 5: XOOPSインストール のセキュリティを向上"
---

XOOPS 2.7.0をインストール後、セキュリティを強化するために以下のステップを取ります。各ステップは個別にはオプションですが、一緒にインストールのベースラインセキュリティを大幅に向上させます。

## 1. Protectorモジュール をインストールして設定

バンドルされた `protector` モジュールはXOOPSファイアウォールです。初期ウィザード中にインストールしなかった場合は、Admin → Modulesの画面から今すぐインストールします。

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Protectorの管理パネルを開いて、表示される警告を確認します。`register_globals` などのレガシーPHPディレクティブは存在しなくなります（PHP 8.2+で削除されました）ので、これらの警告は表示されません。現在の警告は通常、ディレクトリのパーミッション、セッション設定、信頼パス構成に関連しています。

## 2. `mainfile.php` および `secure.php` をロック

インストーラーが完了しようとしたら、両方のファイルを読み取り専用としてマークしますが、一部のホストはパーミッションを復元します。必要に応じて検証して再度適用します：

- `mainfile.php` → `0444` (オーナー、グループ、その他読み取り専用)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` は、パス定数（`XOOPS_ROOT_PATH`、`XOOPS_PATH`、`XOOPS_VAR_PATH`、`XOOPS_URL`、`XOOPS_COOKIE_DOMAIN`、`XOOPS_COOKIE_DOMAIN_USE_PSL`）と本番フラグを定義しています。`secure.php` はデータベース認証情報を保持します：

- 2.5.xでは、データベース認証情報は `mainfile.php` にありました。これらはXOOPS 2.7.0では `xoops_data/data/secure.php` に保存され、実行時に `mainfile.php` によってロードされます。`secure.php` を `xoops_data/` 内に保管することを推奨されるディレクトリ内に保つことでは、攻撃者がHTTP経由で認証情報に到達しにくくなります。

## 3. `xoops_lib/` および `xoops_data/` をドキュメント ルートの外に移動

まだ行っていない場合は、これら2つのディレクトリをウェブルートの1レベル上に移動して、名前を変更します。次に、`mainfile.php` の対応する定数を更新します：

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

これらのディレクトリをドキュメントルートの外に配置すると、Composerの `vendor/` ツリー、キャッシュされたテンプレート、セッションファイル、アップロード済みデータ、および `secure.php` 内のデータベース認証情報への直接アクセスが防止されます。

## 4. クッキー ドメイン構成

XOOPS 2.7.0は `mainfile.php` に2つのクッキードメイン定数を導入します：

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

ガイドライン：

- `XOOPS_COOKIE_DOMAIN` を空白のままにしておきます（単一のホスト名またはIPからXOOPSをサービスする場合）。
- そのホスト名のみにクッキーの範囲を設定するために、完全なホスト（例 `www.example.com`）を使用します。
- `www.example.com`、 `blog.example.com` などの間でクッキーを共有したい場合は、レジストラ可能なドメイン（例 `example.com`）を使用します。
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` でXOOPSが複合TLD（ `co.uk` 、 `com.au` など）を正しく分割して、偶然実効TLDでクッキーを設定するのを避けることができます。

## 5. `mainfile.php` での本番 フラグ

`mainfile.dist.php` には、本番環境用にこれら2つのフラグが `false` に設定されています：

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

本番環境ではそれらをオフのままにします。開発またはステージング環境で一時的にそれらを有効化します（以下を探す場合）：

- 古いデータベース呼び出しを追跡してください（ `XOOPS_DB_LEGACY_LOG = true` ）；
- `E_USER_DEPRECATED` 通知および他のデバッグ出力を表面化してください（ `XOOPS_DEBUG = true` ）。

## 6. インストーラー を削除

インストール完了後：

1. ウェブルートから名前を変更した `install_remove_*` ディレクトリを削除します。
2. ウィザードがクリーンアップ中に作成した `install_cleanup_*.php` スクリプトを削除します。
3. `install/` ディレクトリがHTTP経由でリーチ可能でないことを確認します。

無効ですが存在するインストーラーディレクトリを残すことは、低い重大度ですが回避可能なリスクです。

## 7. XOOPSおよび モジュール を最新に保つ

XOOPSは定期的なパッチケージング に従います。XoopsCore27 GitHubリポジトリを購読してリリース 通知を受け取り、新しいリリースが配信されるたびにサイトおよび任意のサードパーティ モジュールを更新します。2.7.xのセキュリティ更新はリポジトリのReleasesページで公開されています。
