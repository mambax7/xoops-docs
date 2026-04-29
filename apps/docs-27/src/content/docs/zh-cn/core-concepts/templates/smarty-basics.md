---
title：“Smarty基础知识”
description：“XOOPS中Smarty模板的基础知识”
---

<span class="version-badge version-25x">2.5.x：Smarty 3</span> <span class="version-badge version-40x">4.0.x：Smarty 4</span>

:::注意[Smarty版本由XOOPS发布]
| XOOPS版本| Smarty版本|主要差异|
|--------------|----------------|-----------------|
| 11.2.5 | Smarty3.x | `{php}`允许区块（但不鼓励）|
| 2.7.0+ | Smarty3.x/4.x|准备 Smarty 4 兼容性 |
| 4.0 | Smarty 4.x | `{php}` 区块被删除，更严格的语法 |

有关迁移指南，请参阅Smarty-4-Migration。
:::

Smarty是PHP的模板引擎，允许开发人员将表示（HTML/CSS）与应用程序逻辑分开。 XOOPS使用Smarty来满足其所有模板需求，从而实现PHP代码和HTML输出之间的清晰分离。

## 相关文档

- 主题-Development - 创建XOOPS主题
- 模板-Variables - 模板中的可用变量
- Smarty-4-Migration - 从Smarty 3 升级到 4

## Smarty 是什么？

Smarty规定：

- **关注点分离**：将 HTML 保留在模板中，将 PHP 逻辑保留在类中
- **模板继承**：从简单的区块构建复杂的布局
- **缓存**：通过编译模板提高性能
- **修改器**：使用内置-in或自定义函数转换输出
- **安全**：控制 PHP 函数模板可以访问的内容

## XOOPS Smarty 配置

XOOPS 使用自定义分隔符配置 Smarty：

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

这可以防止与模板中的 JavaScript 代码发生冲突。

## 基本语法

### 变量

变量从 PHP 传递到模板：

```php
// In PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* In template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### 数组访问

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
{* Template *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### 对象属性

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## 评论

Smarty 中的注释不会呈现给 HTML：

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## 控制结构

### If/Else声明

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### 比较运算符

```smarty
{* Equality *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Inequality *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Greater/Less than *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Greater/Less than or equal *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Logical operators *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### 检查 Empty/Isset

```smarty
{* Check if variable exists and has value *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Check if array is not empty *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Using isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Foreach 循环

```smarty
{* Basic foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* With key *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* With @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Alternate row colors *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### For 循环

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### While 循环

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## 变量修饰符

修饰符转换变量输出：

### 字符串修饰符

```smarty
{* HTML escape (always use for user input!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL encoding *}
<{$url|escape:'url'}>

{* Uppercase/Lowercase *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncate text *}
<{$content|truncate:100:'...'}>

{* Strip HTML tags *}
<{$html|strip_tags}>

{* Replace *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Default value *}
<{$optional_var|default:'No value'}>
```

### 数字修饰符

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### 数组修饰符

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### 链接修饰符

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## 包含并插入

### 包括其他模板

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### 插入动态内容

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## 在模板中分配变量

```smarty
{* Simple assignment *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assignment from expression *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capture block content *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## 内置-inSmarty变量

### $smarty 变量

```smarty
{* Current timestamp *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Request variables *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Constants *}
<{$smarty.const.XOOPS_URL}>

{* Configuration variables *}
<{$smarty.config.var_name}>

{* Template info *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smarty version *}
<{$smarty.version}>

{* Section/Foreach properties *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## 文字区块

对于带大括号的 JavaScript：

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

或者在 JavaScript 中使用 Smarty 变量：

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## 自定义函数

XOOPS提供自定义Smarty功能：

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## 最佳实践

### 始终转义输出

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### 使用有意义的变量名称

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### 保持逻辑最少

模板应侧重于演示。将复杂逻辑移至PHP：

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### 使用模板继承

为了获得一致的布局，请使用模板继承（请参阅主题-Development）。

## 调试模板

### 调试控制台

```smarty
{* Show all assigned variables *}
<{debug}>
```

### 临时输出

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## 常见XOOPS模板模式

### 模区块模板结构

```smarty
{* Module header *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
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

    {* Content *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### 分页

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### 表格显示

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #模板#XOOPS #前端#模板-engine