---
title: "Smartyの基本"
description: "XOOPSでのSmartyテンプレートの基礎"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[XOOPSリリースごとのSmartyバージョン]
| XOOPSバージョン | Smartyバージョン | 主な違い |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | `{php}`ブロック許可（非推奨） |
| 2.7.0+ | Smarty 3.x/4.x | Smarty 4互換性に向けて準備中 |
| 4.0 | Smarty 4.x | `{php}`ブロック削除、より厳密な構文 |

マイグレーション手順はSmarty-4-Migrationを参照してください。
:::

Smartyは、開発者がプレゼンテーション（HTML/CSS）をアプリケーションロジックから分離することを可能にするPHP用テンプレートエンジンです。XOOPSはすべてのテンプレート処理にSmartyを使用し、PHPコードとHTML出力の間にきれいな分離を実現しています。

## 関連ドキュメント

- テーマ開発 - XOOPSテーマの作成
- テンプレート変数 - テンプレートで利用可能な変数
- Smarty 4マイグレーション - Smarty 3からSmarty 4へのアップグレード

## Smartyとは

Smartyが提供するもの:

- **関心の分離**: HTMLをテンプレートに、PHPロジックをクラスに保持
- **テンプレート継承**: シンプルなブロックから複雑なレイアウトを構築
- **キャッシング**: コンパイルされたテンプレートでパフォーマンスを向上
- **修飾子**: 組み込みまたはカスタム関数で出力を変換
- **セキュリティ**: テンプレートがアクセスできるPHP関数を制御

## XOOPSでのSmarty設定

XOOPSはカスタムデリミタでSmartyを設定しています:

```
デフォルトSmarty: { と }
XOOPSでのSmarty:   <{ と }>
```

これはテンプレート内のJavaScriptコードの競合を防ぎます。

## 基本構文

### 変数

変数はPHPからテンプレートに渡されます:

```php
// PHP内
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* テンプレート内 *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### 配列アクセス

```php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```

```smarty
{* テンプレート *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### オブジェクトプロパティ

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* テンプレート *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## コメント

SmartyのコメントはHTMLに表示されません:

```smarty
{* このコメントはHTML出力に表示されません *}

{*
   複数行コメント
   もサポートされています
*}
```

## 制御構造

### If/Else文

```smarty
<{if $user_logged_in}>
    <p>お帰りなさい！</p>
<{elseif $is_guest}>
    <p>こんにちは、ゲスト！</p>
<{else}>
    <p>ログインしてください。</p>
<{/if}>
```

### 比較演算子

```smarty
{* 等号 *}
<{if $status == 'published'}>公開<{/if}>
<{if $status eq 'published'}>公開<{/if}>

{* 不等号 *}
<{if $count != 0}>アイテムがあります<{/if}>
<{if $count neq 0}>アイテムがあります<{/if}>

{* より大きい/小さい *}
<{if $count > 10}>多くのアイテム<{/if}>
<{if $count gt 10}>多くのアイテム<{/if}>
<{if $count < 5}>少ないアイテム<{/if}>
<{if $count lt 5}>少ないアイテム<{/if}>

{* 以上/以下 *}
<{if $count >= 10}>10以上<{/if}>
<{if $count gte 10}>10以上<{/if}>
<{if $count <= 5}>5以下<{/if}>
<{if $count lte 5}>5以下<{/if}>

{* 論理演算子 *}
<{if $logged_in && $is_admin}>管理パネル<{/if}>
<{if $logged_in and $is_admin}>管理パネル<{/if}>
<{if $option1 || $option2}>1つのオプションが選択されました<{/if}>
<{if $option1 or $option2}>1つのオプションが選択されました<{/if}>
<{if !$is_banned}>アクセス許可<{/if}>
<{if not $is_banned}>アクセス許可<{/if}>
```

### Empty/Issetのチェック

```smarty
{* 変数が存在し、値を持っているかを確認 *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* 配列が空でないことを確認 *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* issetを使用 *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Foreachループ

```smarty
{* 基本的なforeach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* キー付き *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* @index、@first、@lastとともに *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* 行の色を交互に *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* 空配列の場合 *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>アイテムが見つかりません。</li>
<{/foreach}>
```

### Forループ

```smarty
<{for $i=1 to 10}>
    <p>アイテム <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>カウントダウン: <{$i}></p>
<{/for}>
```

### Whileループ

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## 変数修飾子

修飾子は変数出力を変換します:

### 文字列修飾子

```smarty
{* HTMLエスケープ（ユーザー入力には常に使用！） *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URLエンコード *}
<{$url|escape:'url'}>

{* 大文字/小文字 *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* テキストを切り詰める *}
<{$content|truncate:100:'...'}>

{* HTMLタグを削除 *}
<{$html|strip_tags}>

{* 置換 *}
<{$text|replace:'old':'new'}>

{* 単語折り返し *}
<{$text|wordwrap:80:"\n"}>

{* デフォルト値 *}
<{$optional_var|default:'No value'}>
```

### 数値修飾子

```smarty
{* 数値フォーマット *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* 日付フォーマット *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### 配列修飾子

```smarty
{* アイテムをカウント *}
<{$items|@count}> items

{* 配列を結合 *}
<{$tags|@implode:', '}>

{* JSONエンコード *}
<{$data|@json_encode}>
```

### 修飾子をチェーン

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## ファイルのインクルードと挿入

### 他のテンプレートをインクルード

```smarty
{* テンプレートファイルをインクルード *}
<{include file="db:mymodule_header.tpl"}>

{* 変数付きでインクルード *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* 割り当てられた変数でインクルード *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### 動的コンテンツを挿入

```smarty
{* 動的コンテンツ用のPHP関数を呼び出す *}
<{insert name="getBanner"}>
```

## テンプレート内で変数を割り当て

```smarty
{* シンプルな割り当て *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* 式からの割り当て *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* ブロックコンテンツをキャプチャ *}
<{capture name="sidebar"}>
    <h3>サイドバー</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## 組み込みSmarty変数

### $smarty変数

```smarty
{* 現在のタイムスタンプ *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* リクエスト変数 *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* 定数 *}
<{$smarty.const.XOOPS_URL}>

{* 設定変数 *}
<{$smarty.config.var_name}>

{* テンプレート情報 *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smartyバージョン *}
<{$smarty.version}>

{* セクション/Foreachプロパティ *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## リテラルブロック

JavaScriptで波括弧を使用する場合:

```smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```

またはSmarty変数をJavaScript内で使用:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## カスタム関数

XOOPSはカスタムSmarty関数を提供します:

```smarty
{* XOOPSイメージURL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPSモジュールURL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* アプリURL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## ベストプラクティス

### 常に出力をエスケープ

```smarty
{* ユーザー生成コンテンツの場合は常にエスケープ *}
<p><{$user_comment|escape}></p>

{* HTMLコンテンツの場合は適切なメソッドを使用 *}
<div><{$content}></div> {* コンテンツが事前にサニタイズされている場合のみ *}
```

### 意味のある変数名を使用

```php
// 良い
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// 避けるべき
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### ロジックを最小化

テンプレートはプレゼンテーションに焦点を当てるべきです。複雑なロジックはPHPに移動してください:

```smarty
{* テンプレートで複雑なロジックを避ける *}
{* 悪い *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* 良い - PHPで計算して単純なフラグを渡す *}
<{if $can_edit}>
```

### テンプレート継承を使用

一貫したレイアウトのために、テンプレート継承を使用してください（テーマ開発を参照）。

## テンプレートをデバッグ

### デバッグコンソール

```smarty
{* 割り当てられたすべての変数を表示 *}
<{debug}>
```

### 一時的な出力

```smarty
{* 特定の変数をデバッグ *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## 一般的なXOOPSテンプレートパターン

### モジュールテンプレート構造

```smarty
{* モジュールヘッダー *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* パンくずリスト *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* コンテンツ *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### ページネーション

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### フォーム表示

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #テンプレート #xoops #フロントエンド #テンプレートエンジン
