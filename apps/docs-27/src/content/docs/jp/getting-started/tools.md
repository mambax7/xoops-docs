---
title: "業務用ツール"
---

XOOPSサイトをカスタマイズおよび保守するために必要な多くのことがXOOPS外で、またはそこで行うのが簡単です。

これはあなたが利用可能にしたいツールのタイプのリストです。XOOPSウェブマスターが有用であると感じた特定のツールの提案とともに。

## エディタ

エディタは非常に個人的な選択であり、人々は彼らのお気に入りについて非常に情熱的になることができます。いくつかの可能性のうちのいくつかだけを提示します。

XOOPS使用では、一部の設定オプションをツイークし、サイト用テーマをカスタマイズするためのエディターが必要になります。これらの用途については、同時に複数のファイルで作業でき、多くのファイル全体で検索と置換を行い、構文強調表示を提供できるエディターが非常に便利です。非常にシンプル、無しのエディターを使用できます。しかし、あなたはいくつかのタスクを達成するためにより難しく働くでしょう。

_JetBrains_からの**PhpStorm**は、PHP Web開発用に特別に調整されたIDE (統合開発環境) です。_JetBrains_はXOOPSのスポンサーに非常に役立ち、その製品は多くの開発者のお気に入りです。それは商用製品であり、新しいウェブマスターの一部に対して費用がかかる可能性がありますが、それが節約できる時間は経験豊富な開発者にとって魅力的です。

**Visual Studio Code**は、Microsoftからの無料、マルチプラットフォーム ソースコード エディターです。組み込みまたは拡張機能による、HTMLなどのコア Web技術、JavaScriptおよびPHP。XMLOPSの使用に適しているため、適切です。

**Notepad++**は、Windowsの無料でよく考えられた候補であり、ロイヤルユーザーがいます。

**Meld**はエディターではありませんが、テキスト ファイルを比較して差分を示し、変更を選択的にマージでき、小さな編集を可能にします。設定ファイル、テーマ テンプレート、もちろんPHPコードを比較する際に非常に便利です。

| 名前 | リンク | ライセンス | プラットフォーム |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | 商用 | 任意 |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | 任意 |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | 任意 |

## FTPクライアント

ファイル転送プロトコル (FTP) またはそのバリエーションは、1つのコンピューターから別のコンピューターにファイルを移動するために使用されます。ほとんどのXOOPSインストールには、XOOPS配布から出てくるファイルをサイトが配置されるホストシステムに移動するためのFTPクライアントが必要になります。

**FileZilla**は、ほとんどのプラットフォームで利用可能な無料で強力なFTPクライアントです。クロスプラットフォームの一貫性により、本書のFTPの例の選択肢になりました。

**PuTTY**は無料のSSHクライアント、サーバーへのシェルアクセスに役立つ、およびSCPでのファイル転送機能を提供しています

**WinSCP**は、Windowsシステム用のFTP/SFTP/SCPクライアントです。

| 名前 | リンク | ライセンス | プラットフォーム |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | 任意 |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

データベースにはサイトのすべてのコンテンツ、サイトをカスタマイズする設定、サイトのユーザーに関する情報などが含まれています。その情報の保護と保守は、特にデータベースで直接処理するいくつかの余分なツールで簡単になる場合があります。

**phpMyAdmin**は、1回限りのバックアップを作成するなど、MySQLデータベースで作業するための最も人気のあるWebベースのツールです。

**BigDump**は、限定的なホスティング アカウントのための天の恵みです。タイムアウトとサイズ制限を回避しながら、大規模なデータベース バックアップ ダンプを復元するのに役立ちます。

**srdb** (XOOPSのSearch Replace DB) は、XOOPSサイトを移動するときにMySQLデータに変更されたURLとファイルシステム参照を変更するのに特に役立つinterconnect/itからの[Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB)のXOOPS適応です。

| 名前 | リンク | ライセンス | プラットフォーム |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | 任意 |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | 任意 |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | 任意 |

## 開発者スタック

Ubuntu などのプラットフォームには、XOOPSを実行するために必要なスタック全体が組み込まれていますが、他のプラットフォームにはいくつかの追加が必要です。

**WAMP**と**Uniform Server Zero**はすべて1つのスタックのwindowsです。

**XAMPP** (Apache Friendsから) は、複数のプラットフォームで利用可能なオールイン1スタックです。

**bitnami**は、仮想マシンとコンテナ イメージを含む、事前に組み込まれたアプリケーション スタックの広い範囲を提供しています。彼らの提供はアプリケーション (XOOPS を含む) またはさまざまなWeb技術をすぐに試すための貴重なリソースになることができます。また、開発とプロダクション の両方の使用に適している場合があります。

**Docker**は、カスタム環境を実装するためのコンテナーを作成および実行するために使用されるアプリケーション コンテナー プラットフォームです。

**Devilbox**は、簡単に構成されたDockerベースの開発スタックです。スタック コンポーネントのすべてのバージョンの幅広い範囲を提供し、開発者が再現可能で共有可能な環境でテストできるようにしています。

| 名前 | リンク | ライセンス | プラットフォーム |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | 複数 | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | 複数 | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | 複数 | 任意 |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | 複数 | 任意 |
| Docker | [https://www.docker.com/](https://www.docker.com/) | 複数 | 任意 |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | 任意 |
