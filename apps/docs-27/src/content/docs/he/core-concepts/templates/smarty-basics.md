---
title: "יסודות Smarty"
description: "היסודות של תבנית Smarty ב-XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::הערה[גרסת Smarty מאת גרסה XOOPS]
| XOOPS גרסה | Smarty גרסה | הבדלים עיקריים |
|--------------|----------------|----------------|
| 2.5.11 | Smarty 3.x | `{php}` בלוקים מותרים (אך לא מעודדים) |
| 2.7.0+ | Smarty 3.x/4.x | מתכוננים לתאימות Smarty 4 |
| 4.0 | Smarty 4.x | `{php}` בלוקים הוסרו, תחביר מחמיר יותר |

ראה Smarty-4-Migration להנחיות הגירה.
:::

Smarty הוא מנוע תבנית עבור PHP המאפשר למפתחים להפריד בין המצגת (HTML/CSS) מהלוגיקה של האפליקציה. XOOPS משתמשת ב-Smarty עבור כל צורכי ההפרדה הנקייה שלה קוד PHP ופלט HTML.

## תיעוד קשור

- פיתוח נושא - יצירת ערכות נושא של XOOPS
- Template-Variables - משתנים זמינים בתבניות
- Smarty-4-Migration - שדרוג מ-Smarty 3 ל-4

## מה זה Smarty?

Smarty מספק:

- **הפרדת דאגות**: שמור את HTML בתבניות, לוגיקה PHP בשיעורים
- **ירושת תבנית**: בניית פריסות מורכבות מבלוקים פשוטים
- **Caching**: שפר את הביצועים עם תבניות הידור
- **משנים**: שינוי פלט עם פונקציות מובנות או מותאמות אישית
- **אבטחה**: שלוט לאילו תבניות פונקציות של PHP יכולות לגשת

## XOOPS Smarty תצורה

XOOPS מגדיר את Smarty עם מפרידים מותאמים אישית:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

זה מונע התנגשויות עם קוד JavaScript בתבניות.

## תחביר בסיסי

### משתנים

משתנים מועברים מ-PHP לתבניות:

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

### גישה למערך

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

### מאפייני אובייקט

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## הערות

הערות ב-Smarty אינן מוצגות ל-HTML:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## מבני בקרה

### If/Else הצהרות

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### מפעילי השוואה

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

### בודק עבור Empty/Isset

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

### Foreach Loops

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

### עבור לולאות

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### תוך כדי לולאות

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## משנה משתנים

משנים הופכים פלט משתנה:

### משנה מחרוזת

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

### משנים מספריים

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### משנה מערך

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### שינויי שרשור

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## כלול והוסף

### כולל תבניות אחרות

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### הוספת תוכן דינמי

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## הקצה משתנים בתבניות

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

## משתני Smarty מובנים

### $smarty משתנה

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

## בלוקים מילוליים

עבור JavaScript עם פלטה מתולתלת:

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

או השתמש במשתני Smarty בתוך JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## פונקציות מותאמות אישית

XOOPS מספק פונקציות מותאמות אישית של Smarty:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## שיטות עבודה מומלצות

### Always Escape Output

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### השתמש בשמות משתנים בעלי משמעות

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### שמור על היגיון מינימלי

תבניות צריכות להתמקד במצגת. העבר לוגיקה מורכבת ל-PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### השתמש בירושה של תבנית

לפריסות עקביות, השתמש בירושה של תבניות (ראה נושא-פיתוח).

## איתור באגים תבניות

### מסוף ניפוי באגים

```smarty
{* Show all assigned variables *}
<{debug}>
```

### פלט זמני

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## תבניות תבניות נפוצות של XOOPS

### מבנה תבנית מודול

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

### עימוד

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### תצוגת טופס

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#חכם #תבניות #xoops #חזית #מנוע-תבנית
