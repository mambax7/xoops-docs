---
title: "XOOPS 用語集"
description: "XOOPS固有の用語と概念の定義"
---

> XOOPS固有の用語と概念の包括的な用語集。

---

## A

### 管理フレームワーク
XOOPS 2.3 で導入された標準化された管理インターフェースフレームワークで、モジュール全体で一貫した管理ページを提供します。

### オートロード
PHP クラスが必要な場合に自動的にロードされる機能で、最新の XOOPS では PSR-4 標準を使用しています。

---

## B

### ブロック
テーマ領域に配置できる自己完結型のコンテンツユニット。ブロックはモジュールコンテンツ、カスタム HTML、または動的データを表示できます。

```php
// ブロック定義
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### ブートストラップ
モジュールコードを実行する前に XOOPS コアを初期化するプロセス。通常は `mainfile.php` と `header.php` を通じて行われます。

---

## C

### 条件 / 条件コンポ
オブジェクト指向的な方法でデータベースクエリ条件を構築するクラス。

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (クロスサイトリクエストフォージェリ)
XOOPS で `XoopsFormHiddenToken` を通じてセキュリティトークンを使用して防止されるセキュリティ攻撃。

---

## D

### DI (依存性注入)
XOOPS 4.0 で計画されている設計パターンで、依存関係は内部で作成されるのではなく注入されます。

### ディレクトリ名
モジュールのディレクトリ名。システム全体で一意の識別子として使用されます。

### DTYPE (データ型)
XoopsObject 変数がどのように保存およびサニタイズされるかを定義する定数:
- `XOBJ_DTYPE_INT` - 整数
- `XOBJ_DTYPE_TXTBOX` - テキスト(1行)
- `XOBJ_DTYPE_TXTAREA` - テキスト(複数行)
- `XOBJ_DTYPE_EMAIL` - メールアドレス

---

## E

### イベント
XOOPS ライフサイクルで発生し、プリロードまたはフックを通じてカスタムコードをトリガーできます。

---

## F

### フレームワーク
XMF(XOOPS Module Framework) を参照してください。

### フォーム要素
HTML フォームフィールドを表す XOOPS フォームシステムのコンポーネント。

---

## G

### グループ
共有パーミッションを持つユーザーの集合。コアグループには: ウェブマスター、登録ユーザー、匿名ユーザーが含まれます。

---

## H

### ハンドラー
XoopsObject インスタンスの CRUD 操作を管理するクラス。

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### ヘルパー
モジュールハンドラー、構成、およびサービスへの簡単なアクセスを提供するユーティリティクラス。

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### カーネル
データベースアクセス、ユーザー管理、セキュリティなど、基本的な機能を提供するコア XOOPS クラス。

---

## L

### 言語ファイル
国際化用の定数を含む PHP ファイル。`language/[code]/` ディレクトリに保存されます。

---

## M

### mainfile.php
データベース認証情報とパス定義を含む XOOPS の主要な設定ファイル。

### MCP (モデル-コントローラー-プレゼンター)
MVC に似た設計パターン。XOOPS モジュール開発でよく使用されます。

### ミドルウェア
リクエストとレスポンスの間に位置するソフトウェア。XOOPS 4.0 で PSR-15 を使用して計画されています。

### モジュール
XOOPS 機能を拡張する自己完結型パッケージ。`modules/` ディレクトリにインストールされます。

### MOC (コンテンツマップ)
関連コンテンツにリンクする概要ノートの Obsidian コンセプト。

---

## N

### ネームスペース
クラスを整理するための PHP 機能。XOOPS 2.5以降で使用されます:
```php
namespace XoopsModules\MyModule;
```

### 通知
ユーザーにメールまたは PM を通じてイベントを通知する XOOPS システム。

---

## O

### オブジェクト
XoopsObject を参照してください。

---

## P

### パーミッション
グループとパーミッションハンドラーを通じて管理されるアクセス制御。

### プリロード
XOOPS イベントにフックするクラス。`preloads/` ディレクトリから自動的にロードされます。

### PSR (PHP 標準推奨事項)
PHP-FIG の標準で、XOOPS 4.0 で完全に実装される予定です。

---

## R

### レンダラー
特定の形式(Bootstrap など)でフォーム要素またはその他の UI コンポーネントを出力するクラス。

---

## S

### Smarty
プレゼンテーションとロジックを分離するために XOOPS で使用されるテンプレートエンジン。

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### サービス
再利用可能なビジネスロジックを提供するクラス。通常はヘルパーを通じてアクセスされます。

---

## T

### テンプレート
モジュールのプレゼンテーション層を定義する Smarty ファイル(`.tpl` または `.html`)。

### テーマ
サイトの外観を定義するテンプレートとアセットの集合。

### トークン
セキュリティメカニズム(CSRF 保護)。フォーム送信が正当なソースから発信されていることを確保します。

---

## U

### uid
ユーザー ID - システム内の各ユーザーの一意の識別子。

---

## V

### 変数 (Var)
`initVar()` を使用して XoopsObject に定義されたフィールド。

---

## W

### ウィジェット
ブロックに似た小さな自己完結型の UI コンポーネント。

---

## X

### XMF (XOOPS Module Framework)
最新の XOOPS モジュール開発用のユーティリティとクラスの集合。

### XOBJ_DTYPE
XoopsObject で変数データ型を定義するための定数。

### XoopsDatabase
クエリ実行とエスケーピングを提供するデータベース抽象化レイヤー。

### XoopsForm
HTML フォームをプログラム的に作成するためのフォーム生成システム。

### XoopsObject
XOOPS のすべてのデータオブジェクトの基本クラス。変数管理とサニタイズを提供します。

### xoops_version.php
モジュールプロパティ、テーブル、ブロック、テンプレート、および構成を定義するモジュールマニフェストファイル。

---

## 一般的な略語

| 略語 | 意味 |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System(拡張可能なオブジェクト指向ポータルシステム) |
| XMF | XOOPS Module Framework(XOOPS モジュールフレームワーク) |
| CSRF | Cross-Site Request Forgery(クロスサイトリクエストフォージェリ) |
| XSS | Cross-Site Scripting(クロスサイトスクリプティング) |
| ORM | Object-Relational Mapping(オブジェクト関係マッピング) |
| PSR | PHP Standards Recommendation(PHP 標準推奨事項) |
| DI | Dependency Injection(依存性注入) |
| MVC | Model-View-Controller(モデル-ビュー-コントローラー) |
| CRUD | Create, Read, Update, Delete(作成、読み取り、更新、削除) |

---

## 関連ドキュメント

- コアコンセプト
- API リファレンス
- 外部リソース

---

#xoops #glossary #reference #terminology #definitions
