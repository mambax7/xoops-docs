---
title: "開発者向けノート"
---

XOOPSの通常インストールと同様ですが、開発者用システムを構築する場合にはいくつかの重要な違いがあります。

開発者インストールの大きな違いの1つは、_htdocs_ディレクトリのコンテンツのみにフォーカスするのではなく、すべてのファイルを保持し、gitを使用してソースコード管理下に置くことです。

別の違いは、_xoops_data_および_xoops_lib_ディレクトリは通常、開発システムがインターネットに直接アクセス可能でない限り(つまり、ルータの背後などのプライベートネットワーク上)、リネームせずにそのまま配置できることです。

ほとんどの開発者は、ソースコード、Webサーバースタック、およびコードとデータベースを操作するために必要なツールを備えた_localhost_システムで作業します。

詳細については、[ツール](../tools/tools.md)チャプターをご覧ください。

## Gitとバーチャルホスト

ほとんどの開発者は現在のソースを最新に保ち、変更をアップストリーム[XOOPSのXoopsCore27リポジトリ](https://github.com/XOOPS/XoopsCore27)にコントリビュートしたいと考えています。つまり、リリースアーカイブをダウンロードするのではなく、XOOPSを[フォーク](https://help.github.com/articles/fork-a-repo/)し、**git**を使用してそのリポジトリを開発用ボックスに[クローン](https://help.github.com/categories/bootcamp/)することが必要です。

リポジトリは特定の構造を持っているため、_htdocs_ディレクトリからWebサーバーにファイルを_コピー_するのではなく、ローカルにクローンされたリポジトリ内のhtdocsフォルダをWebサーバーに指すほうがよいです。これを実行するには、通常、新しい_仮想ホスト_または_vhost_を作成し、git制御下のソースコードを指します。

[WAMP](http://www.wampserver.com/)環境では、デフォルトの[localhost](http://localhost/)ページの_ツール_セクションに_仮想ホストを追加_へのリンクがあり、これは次のようになります:

![WAMPの仮想ホストを追加](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

これを使用して、(まだ)gitで制御されているリポジトリに直接ドロップするVirtualHostエントリをセットアップできます。

以下は`wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`のエントリ例です

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

`Windows/System32/drivers/etc/hosts`にもエントリを追加する必要があるかもしれません:

```text
127.0.0.1    xoops.localhost
```

これで`http://xoops.localhost/`にインストールしてテストができますが、リポジトリはそのままで、Webサーバーはhtdocsディレクトリ内にシンプルなURLで配置されます。さらに、リポジトリのローカルコピーをいつでも最新のマスターに更新でき、ファイルを再インストールまたはコピーする必要がなく、GitHubを通じてコードに機能強化と修正をコントリビュートできます。

## Composerの依存関係

XOOPS 2.7.0は[Composer](https://getcomposer.org/)を使用してPHP依存関係を管理します。依存関係ツリーはソースリポジトリ内の`htdocs/xoops_lib/`にあります:

* `composer.dist.json`はリリースで提供される依存関係のマスターリスト
* `composer.json`はローカルコピー。必要に応じて開発環境用にカスタマイズできます
* `composer.lock`は正確なバージョンをピンして、インストールの再現性を確保します
* `vendor/`にはインストール済みライブラリが含まれています(Smarty 4、PHPMailer、HTMLPurifier、firebase/php-jwt、monolog、symfony/var-dumper、xoops/xmf、xoops/regdom、その他)

XOOPS 2.7.0のgitクローンをフレッシュにするには、リポジトリルートから開始して、次を実行します:

```text
cd htdocs/xoops_lib
composer install
```

リポジトリルートには`composer.json`がないことに注意してください。プロジェクトは`htdocs/xoops_lib/`の下に存在するため、Composerを実行する前にそのディレクトリに`cd`する必要があります。

リリースtarballは`vendor/`が事前に追加されていますが、gitクローンは追加されていない場合があります。開発インストールで`vendor/`を完全に保つ。XOOPSは実行時にそこから依存関係をロードします。

[XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf)ライブラリは2.7.0でComposer依存関係として提供されるため、追加インストールなしにモジュールコード内で`Xmf\Request`、`Xmf\Database\TableLoad`、および関連クラスを使用できます。

## DebugBar モジュール

XOOPS 2.7.0はSymfony VarDumperに基づいた**DebugBar**モジュールを搭載しています。レンダリングされたページにデバッグツールバーを追加して、リクエスト、データベース、およびテンプレート情報を公開します。開発環境とステージング環境でそれをModulesアドミン領域からインストールします。公開する本番サイトにインストールされたままでないようにしてください。
