---
title: "テーマ構造"
---

## 概要

XOOPS テーマはサイトの視覚的なプレゼンテーションを制御します。テーマ構造を理解することは、カスタマイズおよび新しいテーマの作成に不可欠です。

## ディレクトリレイアウト

```
themes/mytheme/
├── theme.html                  # メインレイアウトテンプレート
├── theme.ini                   # テーマ設定
├── theme_blockleft.html        # 左サイドバーブロックテンプレート
├── theme_blockright.html       # 右サイドバーブロックテンプレート
├── theme_blockcenter_c.html    # センターブロック (中央)
├── theme_blockcenter_l.html    # センターブロック (左揃え)
├── theme_blockcenter_r.html    # センターブロック (右揃え)
├── css/
│   ├── style.css              # メインスタイルシート
│   ├── admin.css              # 管理カスタマイズ (オプション)
│   └── print.css              # 印刷スタイルシート (オプション)
├── js/
│   └── theme.js               # テーマ JavaScript
├── images/
│   ├── logo.png               # サイトロゴ
│   └── icons/                 # テーマアイコン
├── language/
│   └── english/
│       └── main.php           # テーマ翻訳
├── modules/                    # モジュールテンプレートオーバーライド
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # テーマプレビュー画像
```

## 必須ファイル

### theme.html

すべてのコンテンツをラップするメインレイアウトテンプレート:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Module-specific headers *}
    <{$xoops_module_header}>

    {* Theme stylesheets *}
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/style.css">
</head>
<body class="<{$xoops_dirname}>">
    <header class="site-header">
        <a href="<{$xoops_url}>" class="logo">
            <img src="<{$xoops_url}>/themes/<{$xoops_theme}>/images/logo.png"
                 alt="<{$xoops_sitename}>">
        </a>
        <nav class="main-nav">
            <{$xoops_mainmenu}>
        </nav>
    </header>

    <div class="page-container">
        {* Left sidebar *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Main content *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Right sidebar *}
        <{if $xoops_showrblock == 1}>
        <aside class="sidebar-right">
            <{foreach item=block from=$xoops_rblocks}>
                <{include file="theme:theme_blockright.html"}>
            <{/foreach}>
        </aside>
        <{/if}>
    </div>

    <footer class="site-footer">
        <{$xoops_footer}>
    </footer>

    {* Module-specific footers *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

テーマ設定ファイル:

```ini
[Theme]
name = "My Theme"
version = "1.0.0"
author = "Your Name"
license = "GPL-2.0"
description = "A modern responsive theme"

[Screenshots]
screenshot = "screenshot.png"

[Options]
responsive = true
bootstrap = false

[Settings]
primary_color = "#3498db"
secondary_color = "#2c3e50"
```

### ブロックテンプレート

```html
{* theme_blockleft.html *}
<section class="block block-left" id="block-<{$block.id}>">
    <{if $block.title}>
        <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</section>
```

## テンプレート変数

### グローバル変数

| 変数 | 説明 |
|----------|-------------|
| `$xoops_sitename` | サイト名 |
| `$xoops_url` | サイト URL |
| `$xoops_theme` | 現在のテーマ名 |
| `$xoops_langcode` | 言語コード |
| `$xoops_charset` | 文字エンコーディング |
| `$xoops_pagetitle` | ページタイトル |
| `$xoops_dirname` | 現在のモジュール名 |

### ユーザー変数

| 変数 | 説明 |
|----------|-------------|
| `$xoops_isuser` | ログイン中 |
| `$xoops_isadmin` | 管理者権限 |
| `$xoops_userid` | ユーザーID |
| `$xoops_uname` | ユーザー名 |

### レイアウト変数

| 変数 | 説明 |
|----------|-------------|
| `$xoops_showlblock` | 左ブロック表示 |
| `$xoops_showrblock` | 右ブロック表示 |
| `$xoops_showcblock` | センターブロック表示 |
| `$xoops_lblocks` | 左ブロック配列 |
| `$xoops_rblocks` | 右ブロック配列 |
| `$xoops_contents` | メインページコンテンツ |

## モジュールテンプレートオーバーライド

モジュールテンプレートをオーバーライドするには、それらをテーマに配置します。

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # ニュースモジュールのインデックスをオーバーライド
    └── news_article.tpl    # 記事表示をオーバーライド
```

## CSS 組織

```css
/* css/style.css */

/* === Variables === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Base === */
body {
    font-family: system-ui, sans-serif;
    color: var(--text-color);
    background: var(--bg-color);
}

/* === Layout === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Components === */
.block {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
}

.block-title {
    margin: 0 0 10px;
    font-size: 1.1em;
}

/* === Responsive === */
@media (max-width: 768px) {
    .page-container {
        grid-template-columns: 1fr;
    }

    .sidebar-left,
    .sidebar-right {
        order: 2;
    }
}
```

## 関連ドキュメント

- ../Templates/Smarty-Templating - テンプレート構文
- Theme-Development - 完全なテーマガイド
- CSS-Best-Practices - スタイリングガイドライン
- ../../03-Module-Development/Block-Development - ブロック作成

