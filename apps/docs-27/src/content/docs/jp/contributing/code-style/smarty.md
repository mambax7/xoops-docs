---
title: "Smarty テンプレート 規約"
description: "XOOPS Smarty テンプレート コーディング標準とベストプラクティス"
---

> XOOPS はテンプレート化に Smarty を使用します。このガイドでは Smarty テンプレート開発の規約とベストプラクティスをカバーします。

---

## 概要

XOOPS Smarty テンプレートは以下に従います:

- **XOOPS テンプレート構造** と命名
- **アクセシビリティ標準** (WCAG)
- **セマンティック HTML5** マークアップ
- **BEM スタイル** クラス命名
- **パフォーマンス最適化**

---

## ファイル構造

### テンプレート 構成

```
templates/
├── admin/                   # 管理テンプレート
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # ブロック テンプレート
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # 共有テンプレート
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # メール テンプレート
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # ページ テンプレート
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # DB に保存、テーマ オーバーライド用
└── db:modulename_footer.tpl
```

### ファイル命名

```smarty
{* XOOPS テンプレート ファイルはモジュール接頭辞を使用 *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* 管理テンプレート *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## ファイル ヘッダー

### テンプレート ヘッダー コメント

```smarty
{*
 * XOOPS モジュール - モジュール名
 * @file アイテム リスト テンプレート
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 * このテンプレートが表示するもののの説明
 *}

<h1><{$page_title}></h1>
```

---

## 変数と命名

### 変数命名規則

```smarty
{* 説明的な名前を使用 *}
<{$page_title}>              {* ✅ 明確 *}
<{$items}>                   {* ✅ 明確 *}
<{$user_count}>              {* ✅ 明確 *}

<{$p_t}>                     {* ❌ 不明確な省略 *}
<{$x}>                       {* ❌ 不明確 *}
```

### 変数スコープ

```smarty
{* グローバル XOOPS 変数 *}
<{$xoops_url}>              {* ルート URL *}
<{$xoops_sitename}>         {* サイト名 *}
<{$xoops_requesturi}>       {* 現在の URI *}
<{$xoops_isadmin}>          {* 管理モード フラグ *}
<{$xoops_user_is_admin}>    {* ユーザーが管理者であるか *}

{* 共通モジュール変数 *}
<{$module_id}>              {* 現在のモジュール ID *}
<{$module_name}>            {* 現在のモジュール名 *}
<{$moduledir}>              {* モジュール ディレクトリ *}
<{$lang}>                   {* 現在の言語 *}
```

---

## フォーマットとスペーシング

### 基本構造

```smarty
{*
 * テンプレート ヘッダー
 *}

{* 他のテンプレートをインクルード *}
<{include file="db:modulename_header.tpl"}>

{* メイン コンテンツ *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* アイテムをレンダリング *}
  <{else}>
    {* 空の状態を表示 *}
  <{/if}>
</main>

{* フッター *}
<{include file="db:modulename_footer.tpl"}>
```

### インデント

```smarty
{* インデントに 2 スペースを使用 *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* ブロック内で行をスキップしない *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### タグの周りのスペーシング

```smarty
{* タグ区切り文字内にスペースなし *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* 修飾子のパイプの後にスペース *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* 条件の演算子の周りにスペース *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## 制御構造

### 条件分岐

```smarty
{* シンプルな if/else *}
<{if $is_published}>
  <span class="status--published">公開済み</span>
<{else}>
  <span class="status--draft">ドラフト</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">アクティブ</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">レビュー待ち</div>
<{else}>
  <div class="alert--danger">非アクティブ</div>
<{/if}>

{* インライン三項 (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### ループ

```smarty
{* 基本的な foreach *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* キーとカウンターを使用 *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* 交互に表示 *}
<{foreach item=item from=$items}>
  <div class="item <{if $smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* 空をチェック *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">アイテムが見つかりません</p>
<{/if}>
```

### Section (非推奨、forEach を代わりに使用)

```smarty
{* section を使用しない - 非推奨 *}
{* ❌ <{section name=i loop=$items}> *}

{* forEach を代わりに使用 *}
{* ✅ *}
<{foreach item=item from=$items}>
```

---

## 変数出力

### 基本的な出力

```smarty
{* 変数をそのまま表示 *}
<{$title}>

{* 空の場合はデフォルト値を表示 *}
<{$title|default:'無題'}>

{* HTML エスケープ (デフォルトで安全) *}
<{$content}>                  {* デフォルトでエスケープ *}
<{$content|escape:'html'}>    {* 明示的にエスケープ *}

{* 生出力 (注意深く使用!) *}
<{$html_content|escape:false}>

{* 特別なエンコード *}
<{$url|escape:'url'}>         {* URL コンテキスト用 *}
<{$json|escape:'javascript'}> {* JavaScript 用 *}
```

### 修飾子

```smarty
{* テキスト フォーマット *}
<{$text|upper}>              {* 大文字に変換 *}
<{$text|lower}>              {* 小文字に変換 *}
<{$text|capitalize}>         {* 最初の文字を大文字化 *}
<{$text|truncate:50:'...'}>  {* 50 文字に切り詰め *}

{* 数字フォーマット *}
<{$price|number_format:2}>   {* 数字をフォーマット *}
<{$count|string_format:"%03d"}> {* 文字列としてフォーマット *}

{* 日付フォーマット *}
<{$date|date_format:'%Y-%m-%d'}> {* 日付をフォーマット *}
<{$date|date_format:'%B %d, %Y'}>

{* 配列操作 *}
<{$items|@count}>            {* アイテムをカウント (@に注意) *}
<{$items|@array_keys}>       {* キーを取得 *}

{* 修飾子をチェーン *}
<{$title|upper|truncate:30:'...'}> {* 複数をチェーン *}

{* 条件付き修飾子 *}
<{$status|default:'pending'}>
```

---

## 定数

### XOOPS 定数の使用

```smarty
{* PHP で define() された定数を使用 *}
{* これらは PHP で最初に定義される必要があります *}

{* コア定数 *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* モジュール定数 *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* カスタム定数 *}
<{$smarty.const._MY_CONSTANT}>
```

### 言語定数

```smarty
{* i18n 用に言語定数を使用 *}
{* 言語ファイルで定義: define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## HTML ベストプラクティス

### セマンティック マークアップ

```smarty
{* セマンティック HTML 要素を使用 *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">著者: <{$item.author}></span>
  </footer>
</article>
```

### アクセシビリティ

```smarty
{* アクセシビリティのためにセマンティック HTML を使用 *}

{* 意味のあるテキストを持つリンク *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ 意味のあるリンク テキスト *}
</a>

{* 画像に代替テキスト *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* フォーム ラベルと入力 *}
<label for="email-input" class="form-field__label">
  メール アドレス
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* 見出しを順に使用 *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ 順序どおり *}
<h4></h4>                  {* ❌ h3 をスキップ *}

{* 必要な場合は aria 属性を使用 *}
<nav aria-label="メイン ナビゲーション">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  メニュー
</button>
```

---

## 一般的なパターン

### ページネーション

```smarty
{* ページネーションを表示 *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="ページネーション">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">最初</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">最後</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```

### パンくずリスト

```smarty
{* パンくずリスト ナビゲーションを表示 *}
<nav class="breadcrumb" aria-label="パンくずリスト">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">ホーム</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```

### アラート メッセージ

```smarty
{* メッセージを表示 *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* エラーを表示 *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">エラー</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```

---

## パフォーマンス

### テンプレート最適化

```smarty
{* 変数を一度割り当て、再利用 *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p><{$item_count}> 件のアイテムが見つかりました</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* 計算値に {assign} を使用 *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* 管理者オプション *}
<{/if}>
<{if $is_admin}>
  {* 同じ計算値を再利用 *}
<{/if}>

{* テンプレートで複雑なロジックを避ける *}
{* ❌ テンプレート内での複雑な計算 *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ PHP で計算、テンプレートで表示 *}
<p><{$total}></p> {* PHP コントローラーから渡される *}
```

---

## ベストプラクティス

### すべき こと

- セマンティック HTML5 を使用
- 画像に代替テキストを含める
- テキストに言語定数を使用
- 出力をエスケープ (デフォルト)
- ロジックを最小限に保つ
- 意味のある変数名を使用
- ファイル ヘッダーを含める
- BEM スタイル クラス名を使用
- スクリーン リーダーでテスト

### しないこと

- ロジックとプレゼンテーションを混在させない
- 代替テキストを忘れない
- エスケープなしで生 HTML を使用しない
- テンプレートでグローバル変数を作成しない
- 非推奨の Smarty 機能を使用しない
- テンプレートをネストしすぎない
- アクセシビリティを無視しない
- テキストをハードコーディングしない (定数を使用)

---

## テンプレート例

### 完全なモジュール テンプレート

```smarty
{*
 * XOOPS モジュール - パブリッシャー
 * @file アイテム リスト テンプレート
 * @author XOOPS チーム
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  著者: <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## 関連ドキュメント

- JavaScript 標準
- CSS ガイドライン
- 行動規範
- PHP 標準

---

#xoops #smarty #templates #conventions #best-practices
