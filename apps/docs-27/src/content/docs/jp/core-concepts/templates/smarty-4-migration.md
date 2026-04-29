---
title: "Smarty 4マイグレーション"
description: "Smarty 3からSmarty 4へのXOOPSテンプレートをアップグレードするガイド"
---

このガイドでは、XOOPSでSmarty 3からSmarty 4にアップグレードする際に必要な変更とマイグレーションステップをカバーしています。これらの違いを理解することは、モダンなXOOPSインストールとの互換性を維持するために重要です。

## 関連ドキュメント

- Smartyの基本 - XOOPSでのSmartyの基礎
- テーマ開発 - XOOPSテーマの作成
- テンプレート変数 - テンプレートで利用可能な変数

## 変更概要

Smarty 4はSmarty 3からいくつかの大きな変更を導入しました:

1. 変数割り当ての動作が変更
2. `{php}`タグが完全に削除
3. キャッシングAPI変更
4. 修飾子処理の更新
5. セキュリティポリシーの変更
6. 廃止機能の削除

## 変数アクセスの変更

### 問題

Smarty 2/3では、割り当てられた値に直接アクセスできました:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - うまく機能しました *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Smarty 4では、変数は`Smarty_Variable`オブジェクトでラップされています:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### 解決法1: valueプロパティにアクセス

```smarty
{* Smarty 4 - valueプロパティにアクセス *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### 解決法2: 互換モード

PHPで互換モードを有効にする:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

これにより、Smarty 3のような直接変数アクセスが可能になります。

### 解決法3: 条件付きバージョンチェック

両バージョンで機能するテンプレートを作成:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### 解決法4: ラッパー関数

割り当てのためのヘルパー関数を作成:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - テンプレートでvalueプロパティ経由でアクセス
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - 標準割り当て
        $smarty->assign($name, $value);
    }
}
```

## {php}タグの削除

### 問題

Smarty 3+はセキュリティ上の理由から`{php}`タグをサポートしていません:

```smarty
{* Smarty 3+では機能しなくなった *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### 解決法: Smarty変数を使用

```smarty
{* Smarty組み込みの変数アクセスを使用 *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### 解決法: ロジックをPHPに移動

複雑なロジックはテンプレートではなくPHPにあるべきです:

```php
// PHP - 処理を行う
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// テンプレートに処理されたデータを割り当てる
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* テンプレート - 表示するだけ *}
<h2><{$category.name}></h2>
```

### 解決法: カスタムプラグイン

再利用可能な機能の場合、Smartyプラグインを作成してください:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* テンプレート *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## キャッシング変更

### Smarty 3キャッシング

```php
// Smarty 3スタイル
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// 変数ごとのnon-cache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4キャッシング

```php
// Smarty 4スタイル
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// またはプロパティを使用（これでも機能）
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### キャッシング定数

```php
// キャッシングモード
Smarty::CACHING_OFF                  // キャッシングなし
Smarty::CACHING_LIFETIME_CURRENT     // cache_lifetimeを使用
Smarty::CACHING_LIFETIME_SAVED       // キャッシュされた有効期限を使用
```

### テンプレート内のNocache

```smarty
{* コンテンツがキャッシュされないようにマーク *}
<{nocache}>
    <p>現在の時刻: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## 修飾子の変更

### 文字列修飾子

いくつかの修飾子は名前が変更されるか廃止されました:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - 代わりに'html'を使用 *}
<{$text|escape:'html'}>
```

### 配列修飾子

配列修飾子には`@`プリフィックスが必要です:

```smarty
{* 配列要素をカウント *}
<{$items|@count}> アイテム

{* 配列を結合 *}
<{$tags|@implode:', '}>

{* JSONエンコード *}
<{$data|@json_encode}>
```

### カスタム修飾子

カスタム修飾子は登録する必要があります:

```php
// カスタム修飾子を登録
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // 処理して返す
    return processed_string($string, $param1);
}
```

## セキュリティポリシーの変更

### Smarty 4セキュリティ

Smarty 4はより厳密なデフォルトセキュリティを持っています:

```php
// セキュリティポリシーを設定
$smarty->enableSecurity('Smarty_Security');

// またはカスタムポリシーを作成
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### 許可された関数

デフォルトでは、Smarty 4は特定のPHP関数の使用を制限しています:

```smarty
{* これらは制限される可能性があります *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

必要に応じて許可された関数を設定してください:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## テンプレート継承の更新

### ブロック構文

ブロック構文は似ていますが、いくつかの変更があります:

```smarty
{* 親テンプレート *}
<html>
<head>
    {block name=head}
    <title>デフォルトタイトル</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* 子テンプレート *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* 親ブロックコンテンツを含める *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>マイコンテンツ</h1>
{/block}
```

### Appendとprepend

```smarty
{block name=head append}
    {* 親コンテンツの後に追加 *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* 親コンテンツの前に追加 *}
    <script src="early.js"></script>
{/block}
```

## 廃止機能

### Smarty 4で削除

| 機能 | 代替案 |
|---------|-------------|
| `{php}`タグ | ロジックをPHPに、またはプラグインに移動 |
| `{include_php}` | 登録されたプラグインを使用 |
| `$smarty.capture` | まだ機能していますが廃止予定 |
| `{strip}`とスペース | ミニ化ツールを使用 |

### 代替案を使用

```smarty
{* {php}の代わりに *}
{* ロジックをPHPに移動して結果を割り当てる *}

{* {include_php}の代わりに *}
<{include file="db:mytemplate.tpl"}>

{* キャプチャの代わりに（まだ機能しますが検討中） *}
<{capture name="sidebar"}>
    <h3>サイドバー</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## マイグレーションチェックリスト

### マイグレーション前

1. [ ] すべてのテンプレートをバックアップ
2. [ ] `{php}`タグ使用をリストアップ
3. [ ] カスタムプラグインをドキュメント化
4. [ ] 現在の機能をテスト

### マイグレーション中

1. [ ] すべての`{php}`タグを削除
2. [ ] 変数アクセス構文を更新
3. [ ] 修飾子使用をチェック
4. [ ] キャッシング設定を更新
5. [ ] セキュリティ設定をレビュー

### マイグレーション後

1. [ ] すべてのテンプレートをテスト
2. [ ] すべてのフォームが機能することを確認
3. [ ] キャッシングが機能することを確認
4. [ ] 異なるユーザーロールでテスト

## 互換性テスト

### バージョン検出

```php
// PHPでSmartyバージョンをチェック
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+固有のコード
} else {
    // Smarty 3コード
}
```

### テンプレートバージョンチェック

```smarty
{* テンプレート内でバージョンをチェック *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+テンプレートコード *}
<{else}>
    {* Smarty 3テンプレートコード *}
<{/if}>
```

## クロス互換テンプレートの作成

### ベストプラクティス

1. **`{php}`タグを完全に避ける** - Smarty 3+では機能しません
2. **テンプレートをシンプルに保つ** - 複雑なロジックはPHPに属する
3. **標準修飾子を使用** - 廃止されたものを避ける
4. **両バージョンでテスト** - サポート可能な場合
5. **複雑な操作にプラグインを使用** - より保守しやすい

### 例: クロス互換テンプレート

```smarty
{* Smarty 3と4の両方で機能 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'デフォルトタイトル'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>アイテムが見つかりません。</p>
    <{/if}>
</body>
</html>
```

## 一般的なマイグレーション問題

### 問題: 変数が空を返す

**問題**: `<{$mod_url}>`はSmarty 4で何も返さない

**解決方法**: `<{$mod_url->value}>`を使用するか、互換モードを有効化

### 問題: PHPタグエラー

**問題**: テンプレートが`{php}`タグでエラーを投げる

**解決方法**: すべてのPHPタグを削除してロジックをPHPファイルに移動

### 問題: 修飾子が見つからない

**問題**: カスタム修飾子が「不明な修飾子」エラーを投げる

**解決方法**: `registerPlugin()`で修飾子を登録してください

### 問題: セキュリティ制限

**問題**: 関数がテンプレートで許可されていない

**解決方法**: セキュリティポリシーの許可されたリストに関数を追加

---

#smarty #マイグレーション #アップグレード #xoops #smarty4 #互換性
