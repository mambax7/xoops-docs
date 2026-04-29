---
title: "テンプレートとブロック"
---

## 概要

Publisherは、記事とブロック（サイドバー/ウィジェット統合用）を表示するためのカスタマイズ可能なテンプレートを提供します。このガイドは、テンプレートカスタマイズとブロック設定について説明します。

## テンプレートファイル

### コアテンプレート

| テンプレート | 目的 |
|----------|---------|
| `publisher_index.tpl` | モジュールホームページ |
| `publisher_item.tpl` | 単一記事ビュー |
| `publisher_category.tpl` | カテゴリリスト |
| `publisher_archive.tpl` | アーカイブページ |
| `publisher_search.tpl` | 検索結果 |
| `publisher_submit.tpl` | 記事投稿フォーム |
| `publisher_print.tpl` | 印刷用ビュー |

### ブロックテンプレート

| テンプレート | 目的 |
|----------|---------|
| `publisher_block_latest.tpl` | 最新記事ブロック |
| `publisher_block_spotlight.tpl` | 注目記事ブロック |
| `publisher_block_category.tpl` | カテゴリリストブロック |
| `publisher_block_author.tpl` | 著者記事ブロック |

## テンプレート変数

### 記事変数

```smarty
{* publisher_item.tpl内で利用可能 *}
<{$item.title}>           {* 記事タイトル *}
<{$item.body}>            {* 全文コンテンツ *}
<{$item.summary}>         {* 概要/抜粋 *}
<{$item.author}>          {* 著者名 *}
<{$item.authorid}>        {* 著者ユーザーID *}
<{$item.datesub}>         {* 公開日 *}
<{$item.datemodified}>    {* 最後修正日 *}
<{$item.counter}>         {* ビュー数 *}
<{$item.rating}>          {* 平均評価 *}
<{$item.votes}>           {* 投票数 *}
<{$item.categoryname}>    {* カテゴリ名 *}
<{$item.categorylink}>    {* カテゴリURL *}
<{$item.itemurl}>         {* 記事URL *}
<{$item.image}>           {* フィーチャー画像 *}
```

### カテゴリ変数

```smarty
{* publisher_category.tpl内で利用可能 *}
<{$category.name}>        {* カテゴリ名 *}
<{$category.description}> {* カテゴリ説明 *}
<{$category.image}>       {* カテゴリ画像 *}
<{$category.total}>       {* 記事数 *}
<{$category.link}>        {* カテゴリURL *}
```

## テンプレートをカスタマイズ

### オーバーライド場所

テンプレートをテーマにコピーしてカスタマイズします:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### 例: カスタム記事テンプレート

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## ブロック

### 利用可能なブロック

| ブロック | 説明 |
|-------|-------------|
| 最新ニュース | 最新記事を表示 |
| スポットライト | 注目記事ハイライト |
| カテゴリメニュー | カテゴリナビゲーション |
| アーカイブ | アーカイブリンク |
| トップ著者 | 最も活動的なライター |
| 人気アイテム | 最も閲覧された記事 |

### ブロックオプション

#### 最新ニュースブロック

| オプション | 説明 |
|--------|-------------|
| 表示するアイテム数 | 記事数 |
| カテゴリフィルター | 特定カテゴリに限定 |
| 概要を表示 | 記事の抜粋を表示 |
| タイトル長 | タイトルを短縮 |
| テンプレート | ブロックテンプレートファイル |

### カスタムブロックテンプレート

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## テンプレートのコツ

### 条件付き表示

```smarty
{* 異なるユーザーに異なるコンテンツを表示 *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### カスタムCSSクラス

```smarty
{* ステータスに基づくスタイルを追加 *}
<article class="article <{$item.status}>">
    {* コンテンツ *}
</article>
```

### 日付フォーマット

```smarty
{* Smartyで日付をフォーマット *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## 関連ドキュメント

- ../User-Guide/Basic-Configuration - モジュール設定
- ../User-Guide/Creating-Articles - コンテンツ管理
- ../../04-API-Reference/Template/Template-System - XOOPSテンプレートエンジン
- ../../02-Core-Concepts/Themes/Theme-Development - テーマカスタマイズ
