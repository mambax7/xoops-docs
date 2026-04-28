---
title: "主題結構"
---

## 概述

XOOPS 主題控制您的網站的視覺呈現。了解主題結構對於自訂和建立新主題至關重要。

## 目錄配置

```
themes/mytheme/
├── theme.html                  # Main layout template
├── theme.ini                   # Theme configuration
├── theme_blockleft.html        # Left sidebar block template
├── theme_blockright.html       # Right sidebar block template
├── theme_blockcenter_c.html    # Center block (centered)
├── theme_blockcenter_l.html    # Center block (left-aligned)
├── theme_blockcenter_r.html    # Center block (right-aligned)
├── css/
│   ├── style.css              # Main stylesheet
│   ├── admin.css              # Admin customizations (optional)
│   └── print.css              # Print stylesheet (optional)
├── js/
│   └── theme.js               # Theme JavaScript
├── images/
│   ├── logo.png               # Site logo
│   └── icons/                 # Theme icons
├── language/
│   └── english/
│       └── main.php           # Theme translations
├── modules/                    # Module template overrides
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Theme preview image
```

## 必要檔案

### theme.html

包裝所有內容的主要佈局範本：

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

主題配置檔案：

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

### 區塊範本

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

## 範本變數

### 全域變數

| 變數 | 說明 |
|----------|-------------|
| `$xoops_sitename` | 網站名稱 |
| `$xoops_url` | 網站 URL |
| `$xoops_theme` | 目前主題名稱 |
| `$xoops_langcode` | 語言代碼 |
| `$xoops_charset` | 字元編碼 |
| `$xoops_pagetitle` | 頁面標題 |
| `$xoops_dirname` | 目前模組名稱 |

### 使用者變數

| 變數 | 說明 |
|----------|-------------|
| `$xoops_isuser` | 已登入 |
| `$xoops_isadmin` | 是管理員 |
| `$xoops_userid` | 使用者 ID |
| `$xoops_uname` | 使用者名稱 |

### 佈局變數

| 變數 | 說明 |
|----------|-------------|
| `$xoops_showlblock` | 顯示左區塊 |
| `$xoops_showrblock` | 顯示右區塊 |
| `$xoops_showcblock` | 顯示中心區塊 |
| `$xoops_lblocks` | 左區塊陣列 |
| `$xoops_rblocks` | 右區塊陣列 |
| `$xoops_contents` | 主要頁面內容 |

## 模組範本覆蓋

透過將模組範本放在主題中來覆蓋它們：

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
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

## 相關文件

- ../Templates/Smarty-Templating - 範本語法
- Theme-Development - 完整主題指南
- CSS-Best-Practices - 樣式指南
- ../../03-Module-Development/Block-Development - 建立區塊
