---
title: "付録3: XOOPSをローカル言語に翻訳"
---

XOOPS 2.7.0は英語言語ファイルのみで提供されます。他の言語への翻訳はコミュニティによって保守され、GitHubとさまざまなローカルXOOPSサポートサイトを通じて配布されます。

## 既存の翻訳を見つける場所

- **GitHub** — コミュニティの翻訳はますます[XOOPSオーガニゼーション](https://github.com/XOOPS)の下の個別のリポジトリとして公開されており、個々の貢献者のアカウントにもあります。`xoops-language-<your-language>`を検索するか、XOOPSオーガニゼーションを参照して現在のパッケージを確認してください
- **ローカルXOOPSサポートサイト** — 多くの地域XOOPSコミュニティは自分のサイトで翻訳を公開しています。[https://xoops.org](https://xoops.org)を訪問し、ローカルコミュニティへのリンクをたどってください
- **モジュール翻訳** — 個別のコミュニティモジュールの翻訳は通常、`XoopsModules25x` GitHubオーガニゼーション内のモジュール自体の隣に存在します(名前の`25x`は歴史的で、そこのモジュールはXOOPS 2.5.xおよび2.7.xの両方で保守されています)

お使いの言語の翻訳がすでに存在する場合は、言語ディレクトリをXOOPSインストール内にドロップします(下の「翻訳をインストールする方法」を参照)

## 翻訳が必要なもの

XOOPS 2.7.0は言語ファイルをそれを使用するコードの隣に保持しています。完全な翻訳は以下のすべてのロケーションをカバーします:

- **コア** — `htdocs/language/english/` — すべてのページで使用されるサイト全体の定数(ログイン、一般的なエラー、日付、メールテンプレート、その他)
- **インストール** — `htdocs/install/language/english/` — インストールウィザードによって表示される文字列。ローカライズされたインストール体験が必要な場合は、インストーラを実行する前にこれらを翻訳します
- **システムモジュール** — `htdocs/modules/system/language/english/` — これまでで最大のセット。管理コントロールパネン全体をカバー
- **バンドルされたモジュール** — `htdocs/modules/pm/language/english/`、`htdocs/modules/profile/language/english/`、`htdocs/modules/protector/language/english/`、および`htdocs/modules/debugbar/language/english/`の各々
- **テーマ** — いくつかのテーマは独自の言語ファイルを提供します。`htdocs/themes/<theme>/language/`が存在するか確認

「コアのみ」翻訳は最小限の有用なユニットであり、上記の最初の2つの項目に対応します

## 翻訳方法

1. 隣の`english/`ディレクトリをコピーしてコピーを言語にリネームします。ディレクトリ名は言語の小文字の英名である必要があります(`spanish`、`german`、`french`、`japanese`、`arabic`、その他)

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. 新しいディレクトリの各`.php`ファイルを開き、`define()`呼び出し内の**文字列値**を翻訳します。定数名を変更しないでください。これらはコア全体のPHPコードから参照されます

   ```php
   // 前:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // 後(スペイン語):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **すべてのファイルをUTF-8**(BOMなし)として保存します。XOOPS 2.7.0はエンドツーエンドで`utf8mb4`を使用(データベース、セッション、出力)し、バイトオーダーマークを持つファイルを拒否します。Notepad++では、これは**"UTF-8"**オプションです。"UTF-8-BOM"ではありません。VS Codeではデフォルトです。ステータスバーでエンコーディングを確認してください

4. 言語とcharsetのメタデータを各ファイルの上部で更新して、お使いの言語と一致させます:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE`は[ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php)は、お使いの言語のコードです。`_CHARSET`はXOOPS 2.7.0では常に`UTF-8`です。ISO-8859-1バリアントはもはやありません

5. インストーラ、システムモジュール、および必要なバンドルされたモジュールで繰り返します

## 翻訳をインストール方法

完成した翻訳をディレクトリツリーとして取得した場合:

1. 各`<language>/`ディレクトリをXOOPSインストール内の一致する`language/english/`親にコピーします。たとえば、`language/spanish/`を`htdocs/language/`に、`install/language/spanish/`を`htdocs/install/language/`に、その他にコピーします
2. ファイルの所有権とアクセス許可がWebサーバーで読み取り可能であることを確認します
3. インストール時に新しい言語を選択するか(ウィザードが`htdocs/language/`をスキャンして利用可能な言語)、既存のサイト上で**管理者→システム→設定→一般設定**の言語を変更してください

## 翻訳をコミュニティにシェア

翻訳をコミュニティにコントリビュートしてください。

1. GitHubリポジトリを作成(またはお使いの言語に既存の言語リポジトリが存在する場合はフォーク)
2. `xoops-language-<language-code>`など明確な名前を使用します(例えば`xoops-language-es`、`xoops-language-pt-br`)
3. リポジトリ内のXOOPSディレクトリ構造をミラーして、ファイルが配置される場所と並ぶようにします:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. 以下を文書化する`README.md`を含めます:
   - 言語名とISOコード
   - XOOPSバージョンの互換性(例えば`XOOPS 2.7.0+`)
   - 翻訳者とクレジット
   - 翻訳がコアのみかバンドルモジュールをカバーするか
5. GitHubの関連モジュール/コアリポジトリに対してプルリクエストを開くか、[https://xoops.org](https://xoops.org)にアナウンスを投稿して、コミュニティがそれを見つけることができます

> **注**
>
> お使いの言語が日付またはカレンダーフォーマットのコアへの変更が必要な場合は、それらの変更もパッケージに含めます。右から左のスクリプト(アラビア語、ヘブライ語、ペルシア語、ウルドゥー語)を使用する言語はXOOPS 2.7.0では既製で機能します。このリリースではRTLサポートが追加され、個別のテーマが自動的にそれを採用します
