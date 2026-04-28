---
title: "XOOPS中的Smarty範本"
---

## 概覽

XOOPS使用Smarty範本引擎來分離表現層與邏輯。本指南涵蓋Smarty語法、XOOPS特定功能和範本最佳實踐。

## 基本語法

### 變量

```smarty
{* 標量變量 *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* 數組訪問 *}
<{$items[0]}>
<{$config['setting']}>

{* 預設值 *}
<{$title|default:'Untitled'}>
```

### 修飾符

```smarty
{* 文本轉換 *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* HTML處理 *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* 日期格式 *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* 連鎖修飾符 *}
<{$text|strip_tags|truncate:50|escape}>
```

### 條件

```smarty
{* If/else *}
<{if $logged_in}>
    Welcome, <{$username}>!
<{elseif $is_guest}>
    Please log in.
<{else}>
    Unknown state.
<{/if}>

{* 比較 *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* 邏輯運算符 *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### 迴圈

```smarty
{* Foreach帶項目 *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* 帶鍵 *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* 帶迭代訊息 *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* Foreachelse用於空數組 *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    No items found.
<{/foreach}>
```

### 區塊(舊版)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## XOOPS特定功能

### 全域變量

```smarty
{* 網站訊息 *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* 用戶訊息 *}
<{$xoops_isuser}>
<{$xoops_isadmin}>
<{$xoops_userid}>
<{$xoops_uname}>

{* 模組訊息 *}
<{$xoops_dirname}>
<{$xoops_pagetitle}>

{* Meta *}
<{$xoops_meta_keywords}>
<{$xoops_meta_description}>
```

### 包括檔案

```smarty
{* 從主題包括 *}
<{include file="theme:header.html"}>

{* 從模組包括 *}
<{include file="db:modulename_partial.tpl"}>

{* 帶變量包括 *}
<{include file="db:mymodule_item.tpl" item=$article}>

{* 從檔案系統包括 *}
<{include file="$xoops_rootpath/modules/mymodule/templates/partial.tpl"}>
```

### 區塊顯示

```smarty
{* 在theme.html中 *}
<{foreach item=block from=$xoops_lblocks}>
    <div class="block">
        <{if $block.title}>
            <h3><{$block.title}></h3>
        <{/if}>
        <{$block.content}>
    </div>
<{/foreach}>
```

### 表單整合

```smarty
{* XoopsForm呈現 *}
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

## 自訂函數

### XOOPS註冊的

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* 麵包屑 *}
<{xoBreadcrumb}>

{* 模組菜單 *}
<{xoModuleMenu}>
```

### 自訂插件

```php
// include/smarty_plugins/function.myfunction.php
function smarty_function_myfunction($params, $smarty)
{
    $name = $params['name'] ?? 'World';
    return "Hello, {$name}!";
}
```

```smarty
<{myfunction name="XOOPS"}>
```

## 範本組織

### 建議的結構

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

### 部分範本

```smarty
{* partials/_pagination.tpl *}
<nav class="pagination">
    <{if $page > 1}>
        <a href="<{$base_url}>&page=<{$page-1}>">Previous</a>
    <{/if}>

    <span>Page <{$page}> of <{$total_pages}></span>

    <{if $page < $total_pages}>
        <a href="<{$base_url}>&page=<{$page+1}>">Next</a>
    <{/if}>
</nav>

{* 用法 *}
<{include file="db:mymodule_pagination.tpl" page=$current_page total_pages=$pages base_url=$url}>
```

## 效能

### 快取

```php
// 在PHP中
$xoopsTpl->caching = 1;
$xoopsTpl->cache_lifetime = 3600; // 1小時

// 檢查是否快取
if (!$xoopsTpl->is_cached('mymodule_index.tpl')) {
    // 如果未快取，僅取得數據
    $items = $handler->getObjects();
    $xoopsTpl->assign('items', $items);
}
```

### 清除快取

```php
// 清除特定範本
$xoopsTpl->clear_cache('mymodule_index.tpl');

// 清除所有模組範本
$xoopsTpl->clear_all_cache();
```

## 最佳實踐

1. **轉義輸出** - 始終轉義用戶產生的內容
2. **使用修飾符** - 套用適當的轉換
3. **最小邏輯** - 複雜邏輯應在PHP中
4. **使用部分** - 重複使用常見的範本片段
5. **語義HTML** - 使用適當的HTML5元素
6. **可訪問性** - 在需要時包括ARIA屬性

## 相關文檔

- 主題開發 - 主題建立
- ../../04-API參考/範本/範本系統 - XOOPS範本API
- ../../03-模組開發/區塊開發 - 區塊範本
- ../表單/表單元素 - 表單呈現
