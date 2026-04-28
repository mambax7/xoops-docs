---
title: "Smarty基礎知識"
description: "XOOPS中Smarty範本的基礎"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[按XOOPS版本的Smarty版本]
| XOOPS版本 | Smarty版本 | 主要差異 |
|----------|----------|---------|
| 2.5.11 | Smarty 3.x | 允許`{php}`塊(但不建議) |
| 2.7.0+ | Smarty 3.x/4.x | 為Smarty 4相容性準備 |
| 4.0 | Smarty 4.x | 移除`{php}`塊，更嚴格的語法 |

有關遷移指南，請參見Smarty 4遷移。
:::

Smarty是PHP的範本引擎，允許開發人員分離表現(HTML/CSS)與應用邏輯。XOOPS為所有範本需求使用Smarty，實現PHP代碼和HTML輸出的乾淨分離。

## 相關文檔

- 主題開發 - 建立XOOPS主題
- 範本變量 - 範本中可用的變量
- Smarty 4遷移 - 從Smarty 3升級到4

## 什麼是Smarty？

Smarty提供：

- **關注點分離**：HTML保留在範本中，PHP邏輯在類中
- **範本繼承**：從簡單塊構建複雜的佈局
- **快取**：使用編譯範本提高效能
- **修飾符**：使用內置或自訂函數轉換輸出
- **安全性**：控制範本可以訪問哪些PHP函數

## XOOPS Smarty配置

XOOPS使用自訂分隔符配置Smarty：

```
預設Smarty： { 和 }
XOOPS Smarty： <{ 和 }>
```

這防止與範本中的JavaScript代碼衝突。

## 基本語法

### 變量

變量從PHP傳遞到範本：

```php
// 在PHP中
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* 在範本中 *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### 數組訪問

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
{* 範本 *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### 物件屬性

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* 範本 *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## 評論

Smarty中的評論不呈現為HTML：

```smarty
{* 這是一條評論 - 不會出現在HTML輸出中 *}

{*
   多行評論
   也受支援
*}
```

## 控制結構

### If/Else語句

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### 比較運算符

```smarty
{* 相等 *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* 不相等 *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* 大於/小於 *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* 大於/小於或等於 *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* 邏輯運算符 *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### 檢查空/Isset

```smarty
{* 檢查變量是否存在且有值 *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* 檢查數組是否為空 *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* 使用isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Foreach迴圈

```smarty
{* 基本foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* 帶鍵 *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* 帶@index、@first、@last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* 替代行色 *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse用於空數組 *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### For迴圈

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### While迴圈

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## 變量修飾符

修飾符轉換變量輸出：

### 字符串修飾符

```smarty
{* HTML轉義(始終用於用戶輸入！) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL編碼 *}
<{$url|escape:'url'}>

{* 大小寫 *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* 截斷文本 *}
<{$content|truncate:100:'...'}>

{* 移除HTML標籤 *}
<{$html|strip_tags}>

{* 替換 *}
<{$text|replace:'old':'new'}>

{* 文字換行 *}
<{$text|wordwrap:80:"\n"}>

{* 預設值 *}
<{$optional_var|default:'No value'}>
```

### 數值修飾符

```smarty
{* 數字格式 *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* 日期格式 *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### 數組修飾符

```smarty
{* 計數項目 *}
<{$items|@count}> items

{* 連接數組 *}
<{$tags|@implode:', '}>

{* JSON編碼 *}
<{$data|@json_encode}>
```

### 連鎖修飾符

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## 包括和插入

### 包括其他範本

```smarty
{* 包括範本檔案 *}
<{include file="db:mymodule_header.tpl"}>

{* 帶變量包括 *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* 帶指派的變量包括 *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### 插入動態內容

```smarty
{* Insert呼叫PHP函數用於動態內容 *}
<{insert name="getBanner"}>
```

## 在範本中指派變量

```smarty
{* 簡單指派 *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* 來自表達式的指派 *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* 捕捉區塊內容 *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## 內置Smarty變量

### $smarty變量

```smarty
{* 當前時間戳 *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* 請求變量 *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* 常數 *}
<{$smarty.const.XOOPS_URL}>

{* 配置變量 *}
<{$smarty.config.var_name}>

{* 範本訊息 *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smarty版本 *}
<{$smarty.version}>

{* 區塊/Foreach屬性 *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## 文字塊

用於JavaScript的捲曲括號：

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

或在JavaScript中使用Smarty變量：

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## 自訂函數

XOOPS提供自訂Smarty函數：

```smarty
{* XOOPS圖像URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS模組URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* 應用URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## 最佳實踐

### 始終轉義輸出

```smarty
{* 對於用戶產生的內容，始終轉義 *}
<p><{$user_comment|escape}></p>

{* 對於HTML內容，使用適當的方法 *}
<div><{$content}></div> {* 僅當內容已預淨化時 *}
```

### 使用有意義的變量名稱

```php
// 好
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// 避免
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### 保持邏輯最少

範本應專注於表現。將複雜邏輯移到PHP：

```smarty
{* 避免在範本中進行複雜的邏輯 *}
{* 不好 *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* 好 - 在PHP中計算並傳遞簡單標誌 *}
<{if $can_edit}>
```

### 使用範本繼承

為獲得一致的佈局，請使用範本繼承(見主題開發)。

## 調試範本

### 調試控制台

```smarty
{* 顯示所有指派的變量 *}
<{debug}>
```

### 臨時輸出

```smarty
{* 調試特定變量 *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## 常見XOOPS範本模式

### 模組範本結構

```smarty
{* 模組標題 *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* 麵包屑 *}
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

    {* 內容 *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### 分頁

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### 表單顯示

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #templates #xoops #frontend #template-engine
