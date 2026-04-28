---
title: "範本和區塊"
---

## 概述

Publisher 提供可自訂的範本用於顯示文章和區塊用於側邊欄/小工具整合。本指南涵蓋範本自訂和區塊配置。

## 範本檔案

### 核心範本

| 範本 | 目的 |
|----------|---------|
| `publisher_index.tpl` | 模組首頁 |
| `publisher_item.tpl` | 單篇文章檢視 |
| `publisher_category.tpl` | 分類列表 |
| `publisher_archive.tpl` | 檔案頁面 |
| `publisher_search.tpl` | 搜尋結果 |
| `publisher_submit.tpl` | 文章提交表單 |
| `publisher_print.tpl` | 列印易讀版本 |

### 區塊範本

| 範本 | 目的 |
|----------|---------|
| `publisher_block_latest.tpl` | 最新文章區塊 |
| `publisher_block_spotlight.tpl` | 精選文章區塊 |
| `publisher_block_category.tpl` | 分類列表區塊 |
| `publisher_block_author.tpl` | 作者文章區塊 |

## 範本變數

### 文章變數

```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```

### 分類變數

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## 自訂範本

### 覆蓋位置

將範本複製到主題以自訂：

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### 範例：自訂文章範本

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

## 區塊

### 可用區塊

| 區塊 | 說明 |
|-------|-------------|
| Latest News | 顯示最近文章 |
| Spotlight | 精選文章亮點 |
| Category Menu | 分類導覽 |
| Archives | 檔案連結 |
| Top Authors | 最活躍的寫手 |
| Popular Items | 最多瀏覽的文章 |

### 區塊選項

#### 最新新聞區塊

| 選項 | 說明 |
|--------|-------------|
| Items to display | 文章數量 |
| Category filter | 限制特定分類 |
| Show summary | 顯示文章摘要 |
| Title length | 截斷標題 |
| Template | 區塊範本檔案 |

### 自訂區塊範本

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

## 範本技巧

### 條件式顯示

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### 自訂 CSS 類別

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### 日期格式化

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## 相關文件

- ../User-Guide/Basic-Configuration - 模組設定
- ../User-Guide/Creating-Articles - 內容管理
- ../../04-API-Reference/Template/Template-System - XOOPS 範本引擎
- ../../02-Core-Concepts/Themes/Theme-Development - 主題自訂
