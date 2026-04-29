---
title: "モジュール管理ページ"
description: "XMFで標準化された将来互換性のあるモジュール管理ページを作成"
---

`Xmf\Module\Admin` クラスは、モジュール管理インターフェースを作成するための一貫した方法を提供します。XMFを管理ページに使用することで、将来のXOOPSバージョンとの前方互換性を確保しながら、統一されたユーザー体験を保ちます。

## 概要

XOOPSフレームワークのModuleAdminクラスは管理を簡単にしましたが、そのAPIはバージョン間で進化しています。`Xmf\Module\Admin`ラッパーは:

- バージョン間で機能する安定したAPIを提供
- バージョン間のAPI差異を自動的に処理
- 管理コードが将来互換性を持つことを保証
- 一般的なタスクのための便利な静的メソッドを提供

## 使い始める

### 管理インスタンスを作成

```php
$admin = \Xmf\Module\Admin::getInstance();
```

これは `Xmf\Module\Admin` インスタンスまたはすでに互換性のあるネイティブシステムクラスを返します。

## アイコン管理

### アイコンロケーションの問題

アイコンはXOOPSバージョン間で移動し、保守の頭痛の種となります。XMFはユーティリティメソッドでこれを解決します。

### アイコンを見つけ

**古い方法 (バージョン依存):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF方法:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()` メソッドは完全なURLを返すため、パス構築について心配する必要はありません。

### アイコンサイズ

```php
// 16x16アイコン
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32アイコン (デフォルト)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// パスのみ (ファイル名なし)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### メニューアイコン

管理menu.phpファイル用:

**古い方法:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF方法:**
```php
// アイコンパスを取得
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## 標準管理ページ

### インデックスページ

**古い形式:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF形式:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### 概要ページ

**古い形式:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF形式:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **注:** 将来のXOOPSバージョンでは、PayPal情報はxoops_version.phpに設定されます。`setPaypal()` 呼び出しは、新しいバージョンでは効果がない間に、現在のバージョンとの互換性を保証します。

## ナビゲーション

### ナビゲーションメニューを表示

```php
$admin = \Xmf\Module\Admin::getInstance();

// 現在のページのナビゲーションを表示
$admin->displayNavigation('items.php');

// またはHTMLストリングを取得
$navHtml = $admin->renderNavigation('items.php');
```

## 情報ボックス

### 情報ボックスを作成

```php
$admin = \Xmf\Module\Admin::getInstance();

// 情報ボックスを追加
$admin->addInfoBox('Module Statistics');

// 情報ボックスに行を追加
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// 情報ボックスを表示
$admin->displayInfoBox();
```

## 設定ボックス

設定ボックスはシステム要件と状態チェックを表示します。

### 基本設定行

```php
$admin = \Xmf\Module\Admin::getInstance();

// 単純なメッセージを追加
$admin->addConfigBoxLine('Module is properly configured', 'default');

// ディレクトリが存在するかをチェック
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// パーミッション付きでディレクトリをチェック
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// モジュールがインストールされているかをチェック
$admin->addConfigBoxLine('xlanguage', 'module');

// モジュールをチェック、見つからない場合は警告 (エラーではなく)
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### 利便性メソッド

```php
$admin = \Xmf\Module\Admin::getInstance();

// エラーメッセージを追加
$admin->addConfigError('Upload directory is not writable');

// 成功/受け入れメッセージを追加
$admin->addConfigAccept('Database tables verified');

// 警告メッセージを追加
$admin->addConfigWarning('Cache directory should be cleared');

// モジュールバージョンをチェック
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### 設定ボックスタイプ

| タイプ | 値 | 動作 |
|------|-----|------|
| `default` | メッセージ文字列 | メッセージを直接表示 |
| `folder` | ディレクトリパス | 存在すれば受け入れ、なければエラー |
| `chmod` | `[path, permission]` | パーミッションを持つディレクトリが存在するかをチェック |
| `module` | モジュール名 | インストール済みなら受け入れ、なければエラー |
| `module` | `[name, 'warning']` | インストール済みなら受け入れ、なければ警告 |

## アイテムボタン

管理ページにアクションボタンを追加:

```php
$admin = \Xmf\Module\Admin::getInstance();

// ボタンを追加
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// ボタンを表示 (デフォルトは左寄せ)
$admin->displayButton('left');

// またはHTMLを取得
$buttonHtml = $admin->renderButton('right', ' | ');
```

## 完全な管理ページの例

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// ナビゲーションを表示
$adminObject->displayNavigation(basename(__FILE__));

// 統計情報付きで情報ボックスを追加
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// 設定をチェック
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// オプションモジュールをチェック
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// インデックスページを表示
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// 操作を取得
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // アクションボタンを追加
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // アイテムをリスト表示
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // テーブルを表示
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // フォーム処理コード...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// 寄付用のPayPal IDを設定 (オプション)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// 概要ページを表示
// falseを渡してXOOPSロゴを非表示、trueで表示
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// XMFを使用してアイコンパスを取得
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// ダッシュボード
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// アイテム
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// カテゴリー
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// 権限
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// 概要
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## APIリファレンス

### 静的メソッド

| メソッド | 説明 |
|--------|------|
| `getInstance()` | 管理インスタンスを取得 |
| `iconUrl($name, $size)` | アイコンURLを取得 (サイズ: 16または32) |
| `menuIconPath($image)` | menu.php用のアイコンパスを取得 |
| `setPaypal($paypal)` | 概要ページ用のPayPal IDを設定 |

### インスタンスメソッド

| メソッド | 説明 |
|--------|------|
| `displayNavigation($menu)` | ナビゲーションメニューを表示 |
| `renderNavigation($menu)` | ナビゲーションHTMLを返す |
| `addInfoBox($title)` | 情報ボックスを追加 |
| `addInfoBoxLine($text, $type, $color)` | 情報ボックスに行を追加 |
| `displayInfoBox()` | 情報ボックスを表示 |
| `renderInfoBox()` | 情報ボックスHTMLを返す |
| `addConfigBoxLine($value, $type)` | 設定チェック行を追加 |
| `addConfigError($value)` | 設定ボックスにエラーを追加 |
| `addConfigAccept($value)` | 設定ボックスに成功を追加 |
| `addConfigWarning($value)` | 設定ボックスに警告を追加 |
| `addConfigModuleVersion($moddir, $version)` | モジュールバージョンをチェック |
| `addItemButton($title, $link, $icon, $extra)` | アクションボタンを追加 |
| `displayButton($position, $delimiter)` | ボタンを表示 |
| `renderButton($position, $delimiter)` | ボタンHTMLを返す |
| `displayIndex()` | インデックスページを表示 |
| `renderIndex()` | インデックスページHTMLを返す |
| `displayAbout($logo_xoops)` | 概要ページを表示 |
| `renderAbout($logo_xoops)` | 概要ページHTMLを返す |

## 関連項目

- ../Basics/XMF-Module-Helper - モジュールヘルパークラス
- Permission-Helper - 権限管理
- ../XMF-Framework - フレームワーク概要

---

#xmf #admin #module-development #navigation #icons
