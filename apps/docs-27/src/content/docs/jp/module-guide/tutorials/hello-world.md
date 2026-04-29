---
title: "Hello Worldモジュール"
description: "最初のXOOPSモジュール作成のためのステップバイステップチュートリアル"
---

# Hello World モジュール チュートリアル

このチュートリアルは最初のXOOPSモジュール作成を段階的にガイドします。最後には、フロントエンドと管理者エリアの両方で「Hello World」を表示する動作するモジュールが完成します。

## 前提条件

- XOOPS 2.5.xがインストール済みで実行中
- PHP 8.0以上
- 基本的なPHP知識
- テキストエディタまたはIDE（PhpStormを推奨）

## ステップ1: ディレクトリ構造を作成

`/modules/helloworld/` に以下のディレクトリ構造を作成:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## ステップ2: モジュール定義を作成

`xoops_version.php` を作成:

```php
<?php
/**
 * Hello Worldモジュール - モジュール定義
 *
 * @package    HelloWorld
 * @author     あなたの名前
 * @copyright  2025 あなたの名前
 * @license    GPL 2.0 以降
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPSルートパスが定義されていません');
}

$modversion = [];

// 基本モジュール情報
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'あなたの名前';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 以降';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// モジュール状態
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// 管理設定
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// メインメニュー
$modversion['hasMain'] = 1;

// テンプレート
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// 管理テンプレート
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// このシンプルモジュールはデータベーステーブルが不要
$modversion['tables'] = [];
```

## ステップ3: 言語ファイルを作成

### modinfo.php (モジュール情報)

`language/english/modinfo.php` を作成:

```php
<?php
/**
 * モジュール情報言語定数
 */

// モジュール情報
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'XOOPS開発を学ぶためのシンプルなHello Worldモジュール。');

// テンプレート説明
define('_MI_HELLOWORLD_INDEX_TPL', 'メインインデックスページテンプレート');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', '管理インデックスページテンプレート');
```

### main.php (フロントエンド言語)

`language/english/main.php` を作成:

```php
<?php
/**
 * フロントエンド言語定数
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Hello Worldモジュールへようこそ!');
define('_MD_HELLOWORLD_MESSAGE', 'これはあなたの最初のXOOPSモジュールです。おめでとう!');
define('_MD_HELLOWORLD_CURRENT_TIME', '現在のサーバー時刻:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'あなたは訪問者番号です:');
```

### admin.php (管理者言語)

`language/english/admin.php` を作成:

```php
<?php
/**
 * 管理者言語定数
 */

define('_AM_HELLOWORLD_INDEX', 'ダッシュボード');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World管理');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Hello Worldモジュール管理へようこそ');
define('_AM_HELLOWORLD_MODULE_INFO', 'モジュール情報');
define('_AM_HELLOWORLD_VERSION', 'バージョン:');
define('_AM_HELLOWORLD_AUTHOR', '作成者:');
```

## ステップ4: フロントエンドインデックスを作成

モジュールルートに `index.php` を作成:

```php
<?php
/**
 * Hello Worldモジュール - フロントエンドインデックス
 *
 * @package    HelloWorld
 * @author     あなたの名前
 * @copyright  2025 あなたの名前
 * @license    GPL 2.0 以降
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// 言語ファイルを読み込む
xoops_loadLanguage('main', 'helloworld');

// モジュールヘルパーを取得
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// ページテンプレートを設定
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// XOOPSヘッダーをインクルード
require XOOPS_ROOT_PATH . '/header.php';

// モジュール設定を取得
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// ページコンテンツを生成
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// シンプルな訪問者カウンター（セッション使用）
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// テンプレートに変数を割り当て
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// XOOPSフッターをインクルード
require XOOPS_ROOT_PATH . '/footer.php';
```

## ステップ5: フロントエンドテンプレートを作成

`templates/helloworld_index.tpl` を作成:

```smarty
<{* Hello Worldモジュール - インデックステンプレート *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## ステップ6: 管理ファイルを作成

### 管理ヘッダー

`admin/admin_header.php` を作成:

```php
<?php
/**
 * 管理ヘッダー
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// 管理言語ファイルを読み込む
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// モジュールヘルパーを取得
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// モジュールディレクトリ
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### 管理フッター

`admin/admin_footer.php` を作成:

```php
<?php
/**
 * 管理フッター
 */

// 管理フッターを表示
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### 管理メニュー

`admin/menu.php` を作成:

```php
<?php
/**
 * 管理メニュー設定
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPSルートパスが定義されていません');
}

$adminmenu = [];

// ダッシュボード
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### 管理インデックスページ

`admin/index.php` を作成:

```php
<?php
/**
 * 管理インデックスページ
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// 管理ナビゲーションを表示
$adminObject->displayNavigation('index.php');

// 管理情報ボックスを作成
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// 情報ボックスを表示
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// 管理フッターを表示
require_once __DIR__ . '/admin_footer.php';
```

## ステップ7: 管理テンプレートを作成

`templates/admin/helloworld_admin_index.tpl` を作成:

```smarty
<{* Hello Worldモジュール - 管理インデックステンプレート *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## ステップ8: モジュールロゴを作成

推奨サイズ: 92x92ピクセルのPNG画像を以下に作成またはコピー:
`assets/images/logo.png`

## ステップ9: モジュールをインストール

1. 管理者としてXOOPSサイトにログイン
2. **システム管理** > **モジュール** に移動
3. 利用可能なモジュールのリストから「Hello World」を検索
4. **インストール** ボタンをクリック
5. インストールを確認

## ステップ10: モジュールをテスト

### フロントエンドテスト

1. XOOPSサイトにナビゲート
2. メインメニューで「Hello World」をクリック
3. ウェルカムメッセージと現在時刻が表示される

### 管理テスト

1. 管理エリアに移動
2. 管理メニューで「Hello World」をクリック
3. 管理ダッシュボードが表示される

## トラブルシューティング

### モジュールがインストールリストに表示されない

- ファイルパーミッションを確認（ディレクトリ755、ファイル644）
- `xoops_version.php` 構文エラーがないか確認
- XOOPSキャッシュをクリア

### テンプレートが読み込まれない

- テンプレートファイルが正しいディレクトリにあるか確認
- テンプレートファイル名が `xoops_version.php` と一致するか確認
- Smarty構文が正しいか確認

### 言語文字列が表示されない

- 言語ファイルパスを確認
- 言語定数が定義されているか確認
- 正しい言語フォルダが存在するか確認

## 次のステップ

最初のモジュールができたので、以下を学び続けてください:

- CRUD モジュールを構築する - データベース機能を追加
- ../Patterns/MVC-Pattern - コードを適切に整理
- ../Best-Practices/Testing - PHPUnit テストを追加

## 完全なファイル参照

完成したモジュールは以下のファイルを持つべき:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## まとめ

おめでとう! あなたは最初のXOOPSモジュールを作成しました。カバーされた主要な概念:

1. **モジュール構造** - 標準的なXOOPSモジュールディレクトリレイアウト
2. **xoops_version.php** - モジュール定義と設定
3. **言語ファイル** - 国際化サポート
4. **テンプレート** - Smarty テンプレート統合
5. **管理インターフェース** - 基本的な管理パネル

関連トピック: ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
