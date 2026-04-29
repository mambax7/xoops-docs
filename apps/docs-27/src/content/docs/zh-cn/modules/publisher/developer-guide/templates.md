---
title: “模板和区块”
---

## 概述

Publisher 提供可自定义的模板，用于显示文章和区块，以实现 sidebar/widget 集成。本指南涵盖模板自定义和区块配置。

## 模板文件

### 核心模板

|模板|目的|
|----------|---------|
| `publisher_index.tpl` |模区块主页 |
| `publisher_item.tpl` |单篇文章查看 |
| `publisher_category.tpl` |类别列表 |
| `publisher_archive.tpl` |存档页面 |
| `publisher_search.tpl`|搜索结果 |
| `publisher_submit.tpl` |文章提交表格 |
| `publisher_print.tpl`|打印-friendly查看|

### 区块模板

|模板|目的|
|----------|---------|
| `publisher_block_latest.tpl`|最新文章区块 |
| `publisher_block_spotlight.tpl` |特色文章区块 |
| `publisher_block_category.tpl` |类别列表区块 |
| `publisher_block_author.tpl` |作者文章区块 |

## 模板变量

### 文章变量

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

### 类别变量

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## 自定义模板

### 覆盖位置

将模板复制到您的主题以进行自定义：

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### 示例：自定义文章模板

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

## 区块

### 可用区块

|区块|描述 |
|--------|-------------|
|最新消息 |显示最近的文章 |
|聚光灯|专题文章亮点 |
|类别菜单 |分类导航 |
|档案 |存档链接 |
|顶尖作者 |最活跃的作家 |
|热门商品 |浏览次数最多的文章 |

### 阻止选项

#### 最新新闻区块

|选项|描述 |
|--------|-------------|
|要显示的项目 |文章数量 |
|类别过滤 |仅限特定类别 |
|显示摘要 |显示文章摘录 |
|标题长度|截断标题 |
|模板|区块模板文件|

### 自定义区块模板

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

## 模板技巧

### 条件显示

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### 自定义 CSS 类

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### 日期格式

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## 相关文档

- ../User-Guide/Basic-Configuration - 模区块设置
- ../User-Guide/Creating-Articles - 内容管理
- ../../04-API-Reference/Template/Template-System - XOOPS模板引擎
- ../../02-Core-Concepts/Themes/Theme-Development - 主题定制