---
title: "特別 なトピック"
---

特定のシステム ソフトウェアの組み合わせは、XOOPSで機能するための追加構成を必要とする場合があります。ここに、既知の問題と対処するための指針の詳細があります。

## SELinuxの環境

特定のファイルとディレクトリは、XOOPSのインストール、アップグレード、および通常の操作中に書き込み可能である必要があります。従来のLinux環境では、これはウェブサーバーが実行するシステムユーザーがXOOPSディレクトリに権限を持つことを確認することで達成されます。通常、これらのディレクトリのための適切なグループを設定することによって。

SELinux有効化システム（CentOSやRHELなど）には、セキュリティコンテキストという追加の機能があり、プロセスのファイルシステムを変更する能力を制限できます。これらのシステムでは、XOOPSが正常に機能するためにセキュリティコンテキストへの変更が必要な場合があります。

XOOPSは、通常の操作中に特定のディレクトリへのファイルの書き込み能力を自由に有すること期待します。さらに、XOOPS installs およびupgradesの間、特定のファイルは書き込み可能である必要があります。

通常の操作中、XOOPSは次のディレクトリ内にファイルとサブディレクトリを作成できる能力期待します：

- main XOOPS web root内の `uploads` 
- install中に再配置される `xoops_data` 

install またはupgradeプロセス中、XOOPSはこのファイルに書き込む必要があります：

- main XOOPS web root内の `mainfile.php`

典型的なCentOS Apacheベースのシステムでは、セキュリティコンテキストの変更はこれらのコマンドで実現できます：

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

mainfile.phpを書き込み可能にすることができます：

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

注：インストール時に、*extras* ディレクトリから空のmainfile.phpをコピーできます。

また、httpdにメール送信を許可する必要があります：

```
setsebool -P httpd_can_sendmail=1
```

他の設定には次を含める可能性があります：

httpdがネットワーク接続を作成できる、つまりrss feedsをフェッチするか、API呼び出しを作成できます：

```
setsebool -P httpd_can_network_connect 1
```

ネットワーク接続を以下でデータベースに有効化します：

```
setsebool -P httpd_can_network_connect_db=1
```

詳細については、システムドキュメント および/またはシステム管理者に相談してください。

## Smarty 4 およびカスタム テーマ

XOOPS 2.7.0はテンプレート エンジンをSmarty 3からSmarty 4にアップグレードしました。**Smarty 4** はSmarty 3よりもテンプレート構文についてより厳しく、古いテンプレートで許容された少数のパターンがエラーを引き起こします。XOOPSの2.7.0の新しいコピーをインストール時にリリースで出荷されたテーマとモジュールのみを使用している場合、心配することはありません。すべての出荷されたテンプレートはSmarty 4互換性のために更新されています。

懸念は次の場合に適用されます：

- カスタムテーマがある既存のXOOPS 2.5.xサイトをアップグレードしているか、
- カスタムテーマまたは古いサードパーティ モジュール をXOOPS 2.7.0にインストール しています。

アップグレードされたサイトへのライブトラフィック を切り替える前に、`/upgrade/` ディレクトリで出荷されるpreflight scannerを実行してください。これは `/themes/` および `/modules/` をスキャンしてSmarty 4互換性を探し、多くの問題を自動的に修復できます。詳細については、 [Preflight Check](../upgrading/upgrade/preflight.md) ページを参照してください。

install またはupgrade後にテンプレート エラーが発生する場合：

1. `/upgrade/preflight.php` を再実行して、報告されたいずれかの問題に対応します。
2. `xoops_data/caches/smarty_compile/` から `index.html` を除くすべてを削除することでコンパイル済みテンプレート キャッシュをクリアします。
3. `xbootstrap5` または `default` などの出荷されたテーマに一時的に切り替えて、問題がテーマ固有ではなく全サイト問題かどうかを確認します。
4. サイトを本番環境に戻す前に、カスタムテーマまたはモジュール テンプレート変更を検証してください。
