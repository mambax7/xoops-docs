---
title: "XMFを使い始める"
description: "XOOPS Module Frameworkのインストール、基本概念、最初のステップ"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

このガイドでは、XOOPS Module Framework (XMF) の基本的な概念と、モジュールで使用を開始する方法について説明します。

## 前提条件

- XOOPS 2.5.8 以降がインストールされている
- PHP 7.2 以降
- PHP オブジェクト指向プログラミングの基本的な理解

## 名前空間を理解する

XMFはPHP名前空間を使用してクラスを整理し、命名競合を回避します。すべてのXMFクラスは `Xmf` 名前空間に存在します。

### グローバルスペースの問題

名前空間がない場合、すべてのPHPクラスはグローバルスペースを共有します。これは競合を引き起こす可能性があります:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// 致命的エラー: クラスArrayObjectを再宣言できません
```

### 名前空間のソリューション

名前空間は独立した命名コンテキストを作成します:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// 競合なし - これは \MyNamespace\ArrayObject です
```

### XMF 名前空間の使用

XMFクラスは複数の方法で参照できます:

**完全な名前空間パス:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**useステートメント付き:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**複数のインポート:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## オートロード

XMFの最大の便利さの1つは自動クラスロードです。XMFクラスファイルを手動でインクルードする必要はありません。

### 従来のXOOPS読み込み

古い方法は明示的な読み込みが必要でした:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMFオートロード

XMFを使用すると、クラスは参照されたときに自動的にロードされます:

```php
$input = Xmf\Request::getString('input', '');
```

Or with a use statement:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

オートローダーは [PSR-4](http://www.php-fig.org/psr/psr-4/) 標準に従い、XMFが依存する依存関係も管理します。

## 基本的な使用例

### リクエスト入力の読み込み

```php
use Xmf\Request;

// デフォルト値0で整数値を取得
$id = Request::getInt('id', 0);

// デフォルト値が空の文字列で文字列値を取得
$title = Request::getString('title', '');

// コマンド (英数字, 小文字) を取得
$op = Request::getCmd('op', 'list');

// 検証付きメールアドレスを取得
$email = Request::getEmail('email', '');

// 特定のハッシュから取得 (POST、GET など)
$formData = Request::getString('data', '', 'POST');
```

### モジュールヘルパーを使用する

```php
use Xmf\Module\Helper;

// モジュールのヘルパーを取得
$helper = Helper::getHelper('mymodule');

// モジュール設定を読み込む
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// モジュールオブジェクトにアクセス
$module = $helper->getModule();
$version = $module->getVar('version');

// ハンドラーを取得
$itemHandler = $helper->getHandler('items');

// 言語ファイルを読み込む
$helper->loadLanguage('admin');

// 現在のモジュールかどうかをチェック
if ($helper->isCurrentModule()) {
    // このモジュール内にいます
}

// 管理者権限をチェック
if ($helper->isUserAdmin()) {
    // ユーザーは管理者アクセスを持っています
}
```

### パスとURLのヘルパー

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// モジュールURLを取得
$moduleUrl = $helper->url('images/logo.png');
// 返す: https://example.com/modules/mymodule/images/logo.png

// モジュールパスを取得
$modulePath = $helper->path('templates/view.tpl');
// 返す: /var/www/html/modules/mymodule/templates/view.tpl

// アップロードパス
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## XMFでのデバッグ

XMFは有用なデバッグツールを提供します:

```php
// 変数をきれいにフォーマットしてダンプ
\Xmf\Debug::dump($myVariable);

// 複数の変数をダンプ
\Xmf\Debug::dump($var1, $var2, $var3);

// POSTデータをダンプ
\Xmf\Debug::dump($_POST);

// バックトレースを表示
\Xmf\Debug::backtrace();
```

デバッグ出力は折りたたみ可能で、オブジェクトと配列を読みやすい形式で表示します。

## プロジェクト構造の推奨事項

XMFベースのモジュールを構築するときは、コードを整理します:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## 共通インクルードパターン

典型的なモジュールのエントリーポイント:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// XOOPSヘッダーをインクルード
require_once XOOPS_ROOT_PATH . '/header.php';

// モジュールのロジックをここに
switch ($op) {
    case 'view':
        // ビューを処理
        break;
    case 'list':
    default:
        // リストを処理
        break;
}

// XOOPS フッターをインクルード
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## 次のステップ

基本を理解したら、以下を確認してください:

- XMF-Request - 詳細なリクエスト処理ドキュメント
- XMF-Module-Helper - 完全なモジュールヘルパーリファレンス
- ../Recipes/Permission-Helper - ユーザー権限の管理
- ../Recipes/Module-Admin-Pages - 管理インターフェースの構築

## 関連項目

- ../XMF-Framework - フレームワークの概要
- ../Reference/JWT - JSON Webトークンサポート
- ../Reference/Database - データベースユーティリティ

---

#xmf #getting-started #namespaces #autoloading #basics
