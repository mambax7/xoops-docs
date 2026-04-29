---
title: "مبانی هوشمندانه"
description: "مبانی قالب هوشمند در XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note [نسخه هوشمند توسط XOOPS Release]
| نسخه XOOPS | نسخه اسمارتی | تفاوت های کلیدی |
|---------------|---------------|-----------------|
| 2.5.11 | اسمارتی 3.x | بلوک های `{php}` مجاز (اما دلسرد) |
| 2.7.0+ | اسمارتی 3.x/4.x | آماده سازی برای سازگاری Smarty 4 |
| 4.0 | اسمارتی 4.x | بلوک‌های `{php}` حذف شدند، نحو سخت‌تر |

برای راهنمایی مهاجرت به Smarty-4-Migration مراجعه کنید.
:::

Smarty یک موتور قالب برای PHP است که به توسعه دهندگان اجازه می دهد تا ارائه (HTML/CSS) را از منطق برنامه جدا کنند. XOOPS از Smarty برای همه نیازهای قالب خود استفاده می کند و جداسازی تمیز بین کد PHP و خروجی HTML را امکان پذیر می کند.

## مستندات مرتبط

- توسعه تم - ایجاد تم های XOOPS
- Template-Variables - متغیرهای موجود در قالب ها
- Smarty-4-Migration - ارتقاء از Smarty 3 به 4

## اسمارتی چیست؟

اسمارتی ارائه می دهد:

- **جداسازی نگرانی ها**: حفظ HTML در قالب ها، منطق PHP در کلاس ها
- ** وراثت قالب**: طرح بندی های پیچیده را از بلوک های ساده بسازید
- **Caching**: بهبود عملکرد با قالب های کامپایل شده
- **تغییرکننده ها**: خروجی را با توابع داخلی یا سفارشی تبدیل می کند
- **امنیت**: کنترل کنید که قالب ها به چه توابع PHP می توانند دسترسی داشته باشند

## پیکربندی هوشمند XOOPS

XOOPS Smarty را با جداکننده های سفارشی پیکربندی می کند:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

این از تداخل با کد جاوا اسکریپت در قالب ها جلوگیری می کند.

## نحو اولیه

### متغیرها

متغیرها از PHP به قالب ها منتقل می شوند:

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

### دسترسی به آرایه

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

### خواص شی

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## نظرات

نظرات در Smarty به HTML ارائه نمی شوند:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## ساختارهای کنترلی

### بیانیه های If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### مقایسه اپراتورها

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

### در حال بررسی Empty/Isset

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

### حلقه های Foreach

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

### برای حلقه ها

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### در حالی که حلقه ها

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## تغییر دهنده های متغیر

اصلاح کننده ها خروجی متغیر را تبدیل می کنند:

### اصلاح‌کننده‌های رشته

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

### اصلاح کننده های عددی

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### اصلاح کننده های آرایه

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Chaining Modifiers

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## شامل و درج کنید

### از جمله سایر الگوها

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### درج محتوای پویا

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## متغیرها را در قالب ها اختصاص دهید

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

## متغیرهای هوشمند داخلی

### متغیر $smarty

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

## بلوک های تحت اللفظی

برای جاوا اسکریپت با بریس های مجعد:

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

یا از متغیرهای Smarty در جاوا اسکریپت استفاده کنید:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## توابع سفارشی

XOOPS توابع Smarty سفارشی را ارائه می دهد:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## بهترین شیوه ها

### همیشه خروجی فرار

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### از نام های متغیر معنی دار استفاده کنید

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### منطق را حداقل نگه دارید

الگوها باید بر روی ارائه تمرکز کنند. انتقال منطق پیچیده به PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### از وراثت الگو استفاده کنید

برای طرح‌بندی‌های ثابت، از وراثت الگو استفاده کنید (به توسعه تم مراجعه کنید).

## الگوهای اشکال زدایی

### کنسول اشکال زدایی

```smarty
{* Show all assigned variables *}
<{debug}>
```

### خروجی موقت

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## الگوهای معمول XOOPS الگو

### ساختار قالب ماژول

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

### صفحه بندی

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### نمایش فرم

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#قالب های #هوشمند #xoops #frontend #موتور قالب