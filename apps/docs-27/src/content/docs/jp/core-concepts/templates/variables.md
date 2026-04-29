---
title: "テンプレート変数"
description: "XOOPSテンプレートで利用可能なSmarty変数"
---

XOOPSはSmartyテンプレートに多くの変数を自動的に提供します。このリファレンスはテーマとモジュールテンプレート開発で利用可能な変数を文書化しています。

## 関連ドキュメント

- Smartyの基本 - XOOPSでのSmartyの基礎
- テーマ開発 - XOOPSテーマの作成
- Smarty 4マイグレーション - Smarty 3からSmarty 4へのアップグレード

## グローバルテーマ変数

これらの変数はテーマテンプレート（`theme.tpl`）で利用可能です:

### サイト情報

| 変数 | 説明 | 例 |
|----------|-------------|---------|
| `$xoops_sitename` | 設定からのサイト名 | `"My XOOPS Site"` |
| `$xoops_pagetitle` | 現在のページタイトル | `"Welcome"` |
| `$xoops_slogan` | サイトスローガン | `"Just Use It!"` |
| `$xoops_url` | フルXOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | 言語コード | `"en"` |
| `$xoops_charset` | 文字セット | `"UTF-8"` |

### メタタグ

| 変数 | 説明 |
|----------|-------------|
| `$xoops_meta_keywords` | メタキーワード |
| `$xoops_meta_description` | メタ説明 |
| `$xoops_meta_robots` | ロボットメタタグ |
| `$xoops_meta_rating` | コンテンツ評価 |
| `$xoops_meta_author` | 著者メタタグ |
| `$xoops_meta_copyright` | 著作権表示 |

### テーマ情報

| 変数 | 説明 |
|----------|-------------|
| `$xoops_theme` | 現在のテーマ名 |
| `$xoops_imageurl` | テーマイメージディレクトリURL |
| `$xoops_themecss` | メインテーマCSSファイルURL |
| `$xoops_icons32_url` | 32x32アイコンURL |
| `$xoops_icons16_url` | 16x16アイコンURL |

### ページコンテンツ

| 変数 | 説明 |
|----------|-------------|
| `$xoops_contents` | メインページコンテンツ |
| `$xoops_module_header` | モジュール固有のヘッドコンテンツ |
| `$xoops_footer` | フッターコンテンツ |
| `$xoops_js` | インクルードするJavaScript |

### ナビゲーションとメニュー

| 変数 | 説明 |
|----------|-------------|
| `$xoops_mainmenu` | メインナビゲーションメニュー |
| `$xoops_usermenu` | ユーザーメニュー |

### ブロック変数

| 変数 | 説明 |
|----------|-------------|
| `$xoops_lblocks` | 左ブロックの配列 |
| `$xoops_rblocks` | 右ブロックの配列 |
| `$xoops_cblocks` | 中央ブロックの配列 |
| `$xoops_showlblock` | 左ブロックを表示（ブール値） |
| `$xoops_showrblock` | 右ブロックを表示（ブール値） |
| `$xoops_showcblock` | 中央ブロックを表示（ブール値） |

## ユーザー変数

ユーザーがログインしている場合:

| 変数 | 説明 |
|----------|-------------|
| `$xoops_isuser` | ユーザーがログインしている（ブール値） |
| `$xoops_isadmin` | ユーザーが管理者である（ブール値） |
| `$xoops_userid` | ユーザーID |
| `$xoops_uname` | ユーザー名 |
| `$xoops_isowner` | ユーザーが現在のコンテンツを所有している（ブール値） |

### ユーザーオブジェクトプロパティにアクセス

```smarty
<{if $xoops_isuser}>
    <p>ようこそ、<{$xoops_uname}>！</p>
    <p>あなたのメール: <{$xoopsUser->getVar('email')}>}</p>
    <p>参加日: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>ようこそ、ゲスト！</p>
<{/if}>
```

## モジュール変数

モジュールテンプレート内:

| 変数 | 説明 |
|----------|-------------|
| `$xoops_dirname` | モジュールディレクトリ名 |
| `$xoops_modulename` | モジュール表示名 |
| `$mod_url` | モジュールURL（割り当てられた場合） |

### 一般的なモジュールテンプレートパターン

```php
// PHP内
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* テンプレート内 *}
<a href="<{$mod_url}>"><{$mod_name}>に戻る</a>
```

## ブロック変数

`$xoops_lblocks`、`$xoops_rblocks`、および`$xoops_cblocks`内の各ブロックは以下を持ちます:

| プロパティ | 説明 |
|----------|-------------|
| `$block.id` | ブロックID |
| `$block.title` | ブロックタイトル |
| `$block.content` | ブロックHTMLコンテンツ |
| `$block.template` | ブロックテンプレート名 |
| `$block.module` | モジュール名 |
| `$block.weight` | ブロックの重み/順序 |

### ブロック表示例

```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```

## フォーム変数

XoopsFormクラスを使用する場合:

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* テンプレート *}
<div class="form-container">
    <{$form}>
</div>
```

## ページネーション変数

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* テンプレート *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## カスタム変数を割り当て

### シンプルな値

```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}>件のアイテムが見つかりました</p>
<{if $is_featured}>フィーチャー！<{/if}>
```

### 配列

```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```

### オブジェクト

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// またはXoopsObjectの場合
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* 配列アクセス *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* オブジェクトメソッドアクセス *}
<h2><{$item_obj->getVar('title')}></h2>
```

### ネストされた配列

```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```

## Smarty組み込み変数

### $smarty.now

現在のタイムスタンプ:

```smarty
<p>現在の年: <{$smarty.now|date_format:"%Y"}></p>
<p>現在の日付: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>現在の時刻: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

PHPの定数にアクセス:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>ルートパス: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>アップロードパス: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get、$smarty.post、$smarty.request

リクエスト変数にアクセス（注意して使用）:

```smarty
{* 読み取り専用、常に出力をエスケープしてください！ *}
<{if $smarty.get.page}>
    ページ: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

サーバー変数:

```smarty
<p>サーバー: <{$smarty.server.SERVER_NAME}></p>
<p>リクエストURI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

ループ情報:

```smarty
<{foreach $items as $item name=itemloop}>
    <{* インデックス（0ベース） *}>
    インデックス: <{$smarty.foreach.itemloop.index}>

    <{* イテレーション（1ベース） *}>
    番号: <{$smarty.foreach.itemloop.iteration}>

    <{* 最初のアイテム *}>
    <{if $smarty.foreach.itemloop.first}>最初のアイテム！<{/if}>

    <{* 最後のアイテム *}>
    <{if $smarty.foreach.itemloop.last}>最後のアイテム！<{/if}>

    <{* 合計数 *}>
    合計: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## XMFヘルパー変数

XMFを使用する場合、追加のヘルパーが利用可能です:

```php
// PHP内
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* テンプレート内 *}
<a href="<{$mod_url}>">モジュールホーム</a>
<{if $mod_config.show_breadcrumb}>
    {* パンくずリストHTML *}
<{/if}>
```

## 画像およびアセットURL

```smarty
{* テーマイメージ *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* モジュールイメージ *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* アップロードディレクトリ *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* アイコンを使用 *}
<img src="<{$xoops_icons32_url}>edit.png" alt="編集">
<img src="<{$xoops_icons16_url}>delete.png" alt="削除">
```

## ユーザーに基づく条件付き表示

```smarty
{* ログインユーザーのみに表示 *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">マイプロフィール</a>
    <a href="<{$xoops_url}>/user.php?op=logout">ログアウト</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">ログイン</a>
    <a href="<{$xoops_url}>/register.php">登録</a>
<{/if}>

{* 管理者のみに表示 *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">管理パネル</a>
<{/if}>

{* コンテンツ所有者のみに表示 *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">編集</a>
    <a href="delete.php?id=<{$item.id}>">削除</a>
<{/if}>
```

## 言語変数

```php
// PHP - 言語ファイルを読み込み
xoops_loadLanguage('main', 'mymodule');

// 言語定数を割り当て
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* テンプレート内 *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

または定数を直接使用:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## 変数をデバッグ

すべての利用可能な変数を確認するには:

```smarty
{* デバッグコンソールを表示 *}
<{debug}>

{* 特定の変数を出力 *}
<pre><{$myvar|@print_r}></pre>

{* 変数をエクスポート *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #テンプレート #変数 #xoops #リファレンス
