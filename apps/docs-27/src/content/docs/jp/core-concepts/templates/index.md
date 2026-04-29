---
title: "XOOPSでのSmartyテンプレート"
---

## 概要

XOOPSはテンプレートエンジンとしてSmartyを使用し、プレゼンテーションをロジックから分離します。このガイドはSmarty構文、XOOPS固有の機能、およびテンプレートベストプラクティスをカバーしています。

## 基本構文

### 変数

```smarty
{* スカラー変数 *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* 配列アクセス *}
<{$items[0]}>
<{$config['setting']}>

{* デフォルト値 *}
<{$title|default:'無題'}>
```

### 修飾子

```smarty
{* テキスト変換 *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* HTML処理 *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* 日付フォーマット *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* 修飾子をチェーン *}
<{$text|strip_tags|truncate:50|escape}>
```

### 条件分岐

```smarty
{* If/else *}
<{if $logged_in}>
    ようこそ、<{$username}>!
<{elseif $is_guest}>
    ログインしてください。
<{else}>
    状態が不明です。
<{/if}>

{* 比較 *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* 論理演算子 *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### ループ

```smarty
{* Foreachでアイテムを取得 *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* キーと共に *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* イテレーション情報 *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* 空配列の場合 *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    アイテムが見つかりません。
<{/foreach}>
```

### セクション（レガシー）

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## XOOPS固有の機能

### グローバル変数

```smarty
{* サイト情報 *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* ユーザー情報 *}
<{$xoops_isuser}>
<{$xoops_isadmin}>
<{$xoops_userid}>
<{$xoops_uname}>

{* モジュール情報 *}
<{$xoops_dirname}>
<{$xoops_pagetitle}>

{* メタ *}
<{$xoops_meta_keywords}>
<{$xoops_meta_description}>
```

### ファイルをインクルード

```smarty
{* テーマからインクルード *}
<{include file="theme:header.html"}>

{* モジュールからインクルード *}
<{include file="db:modulename_partial.tpl"}>

{* 変数と共にインクルード *}
<{include file="db:mymodule_item.tpl" item=$article}>

{* ファイルシステムからインクルード *}
<{include file="$xoops_rootpath/modules/mymodule/templates/partial.tpl"}>
```

### ブロック表示

```smarty
{* theme.htmlで *}
<{foreach item=block from=$xoops_lblocks}>
    <div class="block">
        <{if $block.title}>
            <h3><{$block.title}></h3>
        <{/if}>
        <{$block.content}>
    </div>
<{/foreach}>
```

### フォーム統合

```smarty
{* XoopsFormレンダリング *}
<{$form.javascript}>
<form action="<{$form.action}>" method="<{$form.method}>">
    <{foreach item=element from=$form.elements}>
        <div class="form-group">
            <label><{$element.caption}></label>
            <{$element.body}>
            <{if $element.description}>
                <small><{$element.description}></small>
            <{/if}>
        </div>
    <{/foreach}>
</form>
```

## カスタム関数

### XOOPSが登録した関数

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* パンくずリスト *}
<{xoBreadcrumb}>

{* モジュールメニュー *}
<{xoModuleMenu}>
```

### カスタムプラグイン

```php
// include/smarty_plugins/function.myfunction.php
function smarty_function_myfunction($params, $smarty)
{
    $name = $params['name'] ?? 'World';
    return "こんにちは、{$name}!";
}
```

```smarty
<{myfunction name="XOOPS"}>
```

## テンプレート編成

### 推奨される構造

```
templates/
├── admin/
│   ├── index.tpl
│   ├── item_list.tpl
│   └── item_form.tpl
├── blocks/
│   ├── recent.tpl
│   └── popular.tpl
├── frontend/
│   ├── index.tpl
│   ├── item_view.tpl
│   └── item_list.tpl
└── partials/
    ├── _header.tpl
    ├── _footer.tpl
    └── _pagination.tpl
```

### 部分テンプレート

```smarty
{* partials/_pagination.tpl *}
<nav class="pagination">
    <{if $page > 1}>
        <a href="<{$base_url}>&page=<{$page-1}>">前へ</a>
    <{/if}>

    <span>ページ <{$page}> / <{$total_pages}></span>

    <{if $page < $total_pages}>
        <a href="<{$base_url}>&page=<{$page+1}>">次へ</a>
    <{/if}>
</nav>

{* 使用方法 *}
<{include file="db:mymodule_pagination.tpl" page=$current_page total_pages=$pages base_url=$url}>
```

## パフォーマンス

### キャッシング

```php
// PHPで
$xoopsTpl->caching = 1;
$xoopsTpl->cache_lifetime = 3600; // 1時間

// キャッシュされているかを確認
if (!$xoopsTpl->is_cached('mymodule_index.tpl')) {
    // キャッシュされていない場合のみデータを取得
    $items = $handler->getObjects();
    $xoopsTpl->assign('items', $items);
}
```

### キャッシュをクリア

```php
// 特定のテンプレートをクリア
$xoopsTpl->clear_cache('mymodule_index.tpl');

// すべてのモジュールテンプレートをクリア
$xoopsTpl->clear_all_cache();
```

## ベストプラクティス

1. **出力をエスケープ** - ユーザー生成コンテンツを常にエスケープ
2. **修飾子を使用** - 適切な変換を適用
3. **ロジックを最小化** - 複雑なロジックはPHPに属する
4. **部分テンプレートを使用** - 一般的なテンプレートフラグメントを再利用
5. **セマンティックHTML** - 適切なHTML5要素を使用
6. **アクセシビリティ** - 必要に応じてARIA属性を含める

## 関連ドキュメント

- テーマ開発 - テーマ作成
- ../../04-API-Reference/Template/Template-System - XOOPSテンプレートAPI
- ../../03-Module-Development/Block-Development - ブロックテンプレート
- ../Forms/Form-Elements - フォームレンダリング
