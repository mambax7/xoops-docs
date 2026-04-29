---
title: "サイトの移動"
---

新しいXOOPSサイトをローカルシステムまたは開発サーバーでプロトタイプ化することは非常に有用な手法です。本番サイトのコピーをテストしてからアップグレードをテストするのは非常に慎重です。これらを達成するには、XOOPSサイトを別のサイトから別のサイトに移動することができる必要があります。ここに、XOOPSサイトの移動に成功するために知っておく必要があることがあります。

最初のステップは、新しいサイト環境を確立することです。セクション [事前準備](../installation/preparations/) でカバーされているのと同じアイテムがここにも適用されます。

レビューでは、これらのステップは：

* ホスティングを取得し、任意のドメイン名またはメール要件を含みます
* MySQLユーザーアカウントとパスワードを取得
* 上記のユーザーがすべての権限を持つMySQLデータベースを取得

プロセスの残りは、通常のインストールに非常に似ていますが、以下が異なります：

* XOOPSディストリビューションからファイルをコピーする代わりに、既存のサイトからコピーします
* インストーラーを実行する代わりに、すでに入力されているデータベースをインポートします
* インストーラーで回答を入力する代わりに、ファイルとデータベース内の以前の回答を変更します

## 既存サイト ファイルをコピー

既存サイトのファイル全体をローカルマシンにコピーして、編集できるようにします。リモートホストで作業している場合、FTPを使用してファイルをコピーできます。サイトがローカルマシンで実行されている場合でも、そのサイトのディレクトリの別のコピーを作成するだけでも、作業コピーが必要です。

_xoops_data_ および _xoops_lib_ ディレクトリも、名前が変更されたおよび/または再配置された場合でも、含めることを覚えておくことが重要です。

物事をよりスムーズにするために、コピーからキャッシュとSmartyコンパイル済みテンプレートファイルを削除する必要があります。これらのファイルは新しい環境で再作成され、クリアされない場合は古い不正な情報が保持される可能性があります。これを行うには、これら3つのディレクトリすべてで _index.html_ を除くすべてのファイルを削除します：

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Note:** Smarty compile のクリアは、サイトをXOOPS 2.7.0から XOOPSに移動する場合は特に重要です。XOOPS 2.7.0はSmarty 4を使用しており、Smarty 4コンパイルテンプレートはSmarty 3コンパイルテンプレートと相互交換できません。新しいサイトの最初のページロード時に、古いコンパイルファイルをそのまま残すとテンプレートエラーが発生します。

### `xoops_lib` および Composer 依存関係

XOOPS 2.7.0は、Composer経由でPHP依存関係を `xoops_lib/` 内で管理します。`xoops_lib/vendor/` ディレクトリには、XOOPSが実行時に必要とするサードパーティライブラリが含まれています（Smarty 4、PHPMailer、HTMLPurifier等）。サイトを移動する場合、`vendor/` を含む `xoops_lib/` ツリー全体をターゲットホストにコピーする必要があります。カスタマイズされた `composer.json` を持っているおよびターゲットホストでComposerが利用可能な開発者でない限り、ターゲットホストで `vendor/` を再生成しないでください。

## 新しい環境 をセットアップ

セクション [事前準備](../installation/preparations/) でカバーされているのと同じアイテムがここに適用されます。ここでは、移動するサイトに必要なホスティングを持っていると仮定します。

### キー 情報 (mainfile.phpおよびsecure.php)

サイトを正常に移動するには、絶対ファイルとパス名、URL、データベースパラメータおよびアクセス認証情報への参照を変更する必要があります。

2つのファイル、サイトのウェブルートの `mainfile.php` 、およびサイトの（名前を変更および/または再配置された）_xoops_data_ ディレクトリの `data/secure.php` は、サイトの基本パラメータを定義します。URL、ホストファイルシステム内の位置、およびデータベースへの接続方法が含まれます。

古いシステムでの値が何であるか、および新しいシステムでそれらが何になるかの両方を知る必要があります。

#### mainfile.php

| Name | Old Value in mainfile.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

エディターで _mainfile.php_ を開きます。上記のチャートに示されているdefinesの値を古い値から新しいサイトの適切な値に変更します。

後のステップで同様の変更を他の場所で行う必要があるため、古い値と新しい値のメモを保管してください。

例として、ローカルPCから商用ホスティングサービスへサイトを移動する場合、値は次のようになります：

| Name | Old Value in mainfile.php | New Value in mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

_mainfile.php_ を変更した後、保存します。

一部の他のファイルは、URLまたはパスへのハードコード参照を含む可能性があります。これはカスタマイズされたテーマとメニューでより可能性が高いですが、エディターを使用して、すべてのファイルをチェックするだけで済みます。

エディターで、コピー内のファイルをSearchし、古いXOOPS_URL値を検索し、それを新しい値に置き換えます。

古いXOOPS_ROOT_PATH値に対して同じ操作を実行し、すべての出現をそれぞれの値に置き換えます。

データベースを移動する際に後で再度使用する必要があるため、メモを保管してください。

#### data/secure.php

| Name | Old Value in data/secure.php | New Value in data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

エディターで、名前が変更および/または再配置された _xoops_data_ ディレクトリの _data/secure.php_ を開きます。上記のチャートに示されているdefinesの値を古い値から新しいサイトの適切な値に変更します。

#### その他 のファイル

サイトが移動する時に注意を必要とする可能性がある他のファイルがあります。いくつかの一般的な例は、ドメインに結びついているような様々なサービスのAPIキーです：

* Google Maps
* Recaptch2
* [いいね！] ボタン
* リンク共有および/または広告（ShareaholicまたはAddThisなど）

これらのタイプの関連付けの変更は、古いドメインへの接続は通常サービス側の登録の一部であるため、自動化することはできません。場合によっては、これはサービスに関連付けられたドメインの追加または変更に過ぎません。

### ファイル を新しいサイトにコピー

変更されたファイルを新しいサイトにコピーします。テクニックは [インストール](../installation/installation/) 中に使用されたのと同じです。FTPを使用してください。

## 既存サイト データベース をコピー

### 古い サーバーからのデータベース をバックアップ

このステップでは、_phpMyAdmin_ の使用を強くお勧めします。既存のサイトの _phpMyAdmin_ にログインし、データベースを選択して、_Export_ を選択します。

デフォルト設定は通常問題ないため、「Export method」を _Quick_ 、「Format」を _SQL_ で選択するだけです。

_Go_ ボタンを使用してデータベースバックアップをダウンロードします。

![Exporting a Database with phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

データベースにXOOPSおよびそのモジュール以外のテーブルがあり、移動することになっていない場合は、「Export method」を _Custom_ として選択し、データベース内のXOOPS関連テーブルのみを選択する必要があります。(これらは、インストール中に指定した「prefix」で始まります。`xoops_data/data/secure.php` ファイルでデータベースプレフィックスを検索できます。)

### データベース を新しいサーバーに復元

新しいホストで、新しいデータベースを使用して、[tools](../tools/tools.md) などを使用してデータベースを復元します（_phpMyAdmin_ の _Import_ タブまたは_bigdump_（必要な場合）など）。

### データベース 内のURLおよびパスを更新

サイトのリソースに対する任意のhttpリンクをデータベースで更新します。これは大変な努力が発生することもでき、 [tool](../tools/tools.md) でこれをより簡単にすることができます。

Interconnect/itは、Search-Replace-DBという製品があります。WordPressおよびDrupal環境の認識がビルトインで付属しています。そのままでは、このツールは非常に役立つことができますが、XOOPSを認識すると、さらに良くなります。[https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) でXOOPS対応バージョンを見つけることができます

README.mdファイル内の指示に従い、このユーティリティをサイトにダウンロードして一時的にインストールします。前に、XOOPS_URLを定義したことで、このツールを実行するときに、元のXOOPS_URLの定義を新しい定義に置き換える必要があります。つまり、 [http://localhost/xoops](http://localhost/xoops) を [https://example.com](https://example.com) に置き換えてください。

![Using Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

古いURLと新しいURLを入力して、ドライラン オプションを選択します。変更を確認し、すべてが良く見えたら、ライブラン オプションに移動してください。このステップは、サイトのURLを参照する構成項目とコンテンツ内のリンクをキャッチします。

![Reviewing Changes in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

XOOPS_ROOT_PATHの古い値と新しい値を使用してプロセスを繰り返します。

#### SRDBなしで代替 アプローチ

このステップを srdbツールなしで実現するもう1つの方法は、データベースをダンプして、ダンプをテキストエディターで編集して、URLとパスを変更し、編集されたダンプからデータベースを再ロードすることです。はい、そのプロセスは十分に関連があり、Search-Replace-DBなどの専門のツールを作成するほど十分なリスクがありましたに人々が動機づけられました。

## 再配置されたサイト を試す

この時点で、サイトは新しい環境で実行する準備ができています！

もちろん、常に問題が存在する可能性があります。 [xoops.org Forums](https://xoops.org/modules/newbb/index.php) に質問を投稿することを恐れないでください。
