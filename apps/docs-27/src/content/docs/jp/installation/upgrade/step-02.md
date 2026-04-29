---
title: "アップグレード実行"
---

メインアップグレーダーを実行する前に、[プリフライトチェック](preflight.md)を完了していることを確認してください。アップグレードUIはプリフライトが少なくとも1回実行されることを必要とし、実行していない場合はそこに導きます。

サイトの_upgrade_ディレクトリをブラウザで指定してアップグレードを起動します:

```text
http://example.com/upgrade/
```

これは以下のようなページを表示する必要があります:

![XOOPSアップグレード起動](/xoops-docs/2.7/img/installation/upgrade-01.png)

「続行」ボタンを選択して進めます。

各「続行」は別のパッチを通して進みます。すべてのパッチが適用されるまで、システムモジュール更新ページが表示されるまで続けて進めます。

![XOOPSアップグレード適用パッチ](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## 2.5.11 → 2.7.0アップグレードの適用内容

XOOPS 2.5.11からXOOPS 2.7.0にアップグレードする場合、アップグレーダーは以下のパッチを適用します。各ステップはウィザード内の別のステップとして表示されるため、変更内容を確認できます:

1. **廃止されたバンドルPHPMailerを削除する。** Protectorモジュール内のPHPMailerのバンドルコピーは削除されます。PHPMailerは現在、Composerを通じて`xoops_lib/vendor/`で提供されています。
2. **廃止されたHTMLPurifierフォルダを削除する。** 同様に、Protectorモジュール内の古いHTMLPurifierフォルダは削除されます。HTMLPurifierはComposerを通じて提供されています。
3. **`tokens`テーブルを作成する。** 新しい`tokens`テーブルが汎用スコープ付きトークンストレージ用に追加されます。テーブルにはトークンID、ユーザーID、スコープ、ハッシュ、および発行済み/有効期限切れ/使用済みタイムスタンプ用の列があり、XOOPS 2.7.0のトークンベースの機能で使用されます。
4. **`bannerclient.passwd`を拡張する。** `bannerclient.passwd`列は`VARCHAR(255)`に拡張され、レガシーの狭い列の代わりに最新のパスワードハッシュ(bcrypt、argon2)を保存できるようになります。
5. **セッションクッキー設定を追加する。** 2つの新しい設定が挿入されます: `session_cookie_samesite`(SameSiteクッキー属性用)と`session_cookie_secure`(HTTPS専用クッキーを強制)。これらをレビューする方法については、[アップグレード後](./step-04.md)を参照してください。

これらのステップはコンテンツデータに触れません。ユーザー、投稿、画像、モジュールデータは変わりません。

## 言語を選択する

主なXOOPS配布は英語サポート付きで付属します。追加ロケールのサポートは[XOOPSローカルサポートサイト](https://xoops.org/modules/xoopspartners/)によって提供されます。このサポートはカスタマイズされた配布、またはメイン配布に追加するための追加ファイルの形式で提供できます。

XOOPSの翻訳は[transifex](https://www.transifex.com/xoops/public/)で管理されています

XOOPSアップグレーダーに追加の言語サポートがある場合は、トップメニューの言語アイコンを選択して別の言語を選択することで、言語を変更できます。

![XOOPSアップグレード言語](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png
