---
title: "付録 2: FTP経由でXOOPSをアップロード"
---

このappendixは、FTPまたはSFTPを使用してXOOPS 2.7.0をリモートホストにデプロイするプロセスについて説明しています。任意のコントロールパネル（cPanel、Plesk、DirectAdmin等）は、同じ基本的なステップを公開します。

## 1. データベース を準備

ホストのコントロールパネルから：

1. XOOPSに新しいMySQLデータベースを作成します。
2. 強力なパスワードでデータベースユーザーを作成します。
3. ユーザーに新しく作成されたデータベースに対する完全な権限を付与します。
4. データベース名、ユーザー名、パスワード、ホストを記録してください。XOOPSインストーラーに入力します。

> **Tip**
>
> 最新のコントロールパネルは強力なパスワードをあなたのために生成します。アプリケーションはパスワードを `xoops_data/data/secure.php` に保存しているため、入力する頻度は多くありません。長く、ランダムに生成された値を使用することを優先してください。

## 2. 管理者 メールボックスを作成

サイト管理通知を受け取るメールボックスを作成してください。XOOPSインストーラーは、ウェブマスターアカウントセットアップ中にこのアドレスを要求し、 `FILTER_VALIDATE_EMAIL` で検証します。

## 3. ファイル をアップロード

XOOPS 2.7.0には、`xoops_lib/vendor/` にプリインストールされたサードパーティの依存関係があります（Composerパッケージ、Smarty 4、HTMLPurifier、PHPMailer、Monolog、TCPDFなど）。これにより、`xoops_lib/` は2.5.xよりも大幅に大きくなります。数十メガバイトを期待してください。

**Composer vendor tree内のファイルを選択的にスキップしないでください。** vendor tree内のファイルをスキップすると、オートロードが破損し、インストールが失敗します。

アップロード構造（`public_html` がドキュメントルートと仮定）：

1. `xoops_data/` および `xoops_lib/` を `public_html` 内ではなく、その横にアップロードします。ウェブルートの外にそれらを配置することは、XOOPS 2.7.0の推奨されるセキュリティ態勢です。

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. distribution `htdocs/` ディレクトリの残りの内容を `public_html/` にアップロードします。

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **ホストが ドキュメント ルートの外のディレクトリを許可しない場合**
>
> `xoops_data/` および `xoops_lib/` を `public_html/` **内に**アップロードし、**明白でない名前に名前を変更** （例えば `xdata_8f3k2/` および `xlib_7h2m1/`）。インストーラーがXOOPS Data PathおよびXOOPS Library Pathを要求するときに、名前を変更したパスを入力します。

## 4. 書き込み可能なディレクトリ を書き込み可能にする

FTPクライアントのCHMODダイアログ（またはSSH）を通じて、Chapter 2にリストされているディレクトリをウェブサーバーで書き込み可能にします。ほとんどの共有ホストでは、ディレクトリで `0775` 、 `mainfile.php` で `0664` で十分です。PHPが FTPユーザー以外のユーザーの下で実行されている場合、インストール中は `0777` が許容されますが、インストール完了後はパーミッションを厳しくしてください。

## 5. インストーラー を起動

ブラウザをサイトのパブリックURLにポイントしてください。すべてのファイルが配置されている場合、XOOPSインストール ウィザードが起動され、 [Chapter 2](chapter-2-introduction.md) 以降のこのガイドの残りを従うことができます。
