---
title: "Smarty मूल बातें"
description: "XOOPS में Smarty टेम्प्लेटिंग के मूल सिद्धांत"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::नोट[Smarty संस्करण XOOPS रिलीज]
| XOOPS संस्करण | Smarty संस्करण | मुख्य अंतर |
|----------------------|----------------|----------------|
| 2.5.11 | Smarty 3.x | `{php}` ब्लॉक की अनुमति (लेकिन हतोत्साहित) |
| 2.7.0+ | Smarty 3.x/4.x | Smarty 4 अनुकूलता के लिए तैयारी |
| 4.0 | Smarty 4.x | `{php}` ब्लॉक हटाए गए, सख्त सिंटैक्स |

प्रवासन मार्गदर्शन के लिए Smarty-4-माइग्रेशन देखें।
:::

Smarty PHP के लिए एक टेम्पलेट इंजन है जो डेवलपर्स को प्रेजेंटेशन (HTML/CSS) को एप्लिकेशन लॉजिक से अलग करने की अनुमति देता है। XOOPS अपनी सभी टेम्प्लेटिंग आवश्यकताओं के लिए Smarty का उपयोग करता है, जिससे PHP कोड और HTML आउटपुट के बीच स्पष्ट पृथक्करण सक्षम होता है।

## संबंधित दस्तावेज़ीकरण

- थीम-विकास - XOOPS थीम बनाना
- टेम्प्लेट-वेरिएबल्स - टेम्प्लेट में उपलब्ध वेरिएबल्स
- Smarty-4-माइग्रेशन - Smarty 3 से 4 तक अपग्रेड करना

## Smarty क्या है?

Smarty प्रदान करता है:

- **चिंताओं का पृथक्करण**: टेम्पलेट्स में HTML रखें, कक्षाओं में PHP तर्क रखें
- **टेम्पलेट इनहेरिटेंस**: सरल ब्लॉक से जटिल लेआउट बनाएं
- **कैशिंग**: संकलित टेम्पलेट्स के साथ प्रदर्शन में सुधार करें
- **संशोधक**: अंतर्निहित या कस्टम फ़ंक्शन के साथ आउटपुट को रूपांतरित करें
- **सुरक्षा**: नियंत्रित करें कि PHP फ़ंक्शन टेम्प्लेट किस तक पहुंच सकते हैं

## XOOPS Smarty कॉन्फ़िगरेशन

XOOPS कस्टम सीमांकक के साथ Smarty कॉन्फ़िगर करता है:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

यह टेम्प्लेट में JavaScript कोड के साथ टकराव को रोकता है।

## मूल सिंटैक्स

### चर

वेरिएबल्स को PHP से टेम्प्लेट में पास किया जाता है:

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

### ऐरे एक्सेस

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

### वस्तु गुण

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## टिप्पणियाँ

Smarty में टिप्पणियाँ HTML पर प्रस्तुत नहीं की जाती हैं:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## नियंत्रण संरचनाएँ

### यदि/अन्यथा कथन

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### तुलना संचालक

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

### खाली/आइसेट की जांच की जा रही है

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

### फ़ोरैच लूप्स

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

### लूप्स के लिए

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### जबकि लूप्स

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## परिवर्तनीय संशोधक

संशोधक परिवर्तनीय आउटपुट को परिवर्तित करते हैं:

### स्ट्रिंग संशोधक

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

### संख्यात्मक संशोधक

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### सारणी संशोधक

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### चेनिंग संशोधक

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## शामिल करें और सम्मिलित करें

### अन्य टेम्पलेट्स सहित

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### गतिशील सामग्री सम्मिलित करना

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## टेम्प्लेट में वेरिएबल निर्दिष्ट करें

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

## बिल्ट-इन Smarty वेरिएबल

### $smarty वेरिएबल

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

## शाब्दिक ब्लॉक

घुंघराले ब्रेसिज़ के साथ JavaScript के लिए:

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

या JavaScript के भीतर Smarty वेरिएबल का उपयोग करें:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## कस्टम फ़ंक्शन

XOOPS कस्टम Smarty फ़ंक्शन प्रदान करता है:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## सर्वोत्तम प्रथाएँ

### हमेशा आउटपुट से बचें

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### अर्थपूर्ण परिवर्तनशील नामों का प्रयोग करें

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### तर्क न्यूनतम रखें

टेम्प्लेट को प्रेजेंटेशन पर ध्यान केंद्रित करना चाहिए. जटिल तर्क को PHP में ले जाएँ:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### टेम्प्लेट इनहेरिटेंस का उपयोग करें

सुसंगत लेआउट के लिए, टेम्पलेट इनहेरिटेंस का उपयोग करें (थीम-डेवलपमेंट देखें)।

## डिबगिंग टेम्पलेट्स

### डिबग कंसोल

```smarty
{* Show all assigned variables *}
<{debug}>
```

### अस्थायी आउटपुट

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## सामान्य XOOPS टेम्पलेट पैटर्न

### मॉड्यूल टेम्पलेट संरचना

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

### पृष्ठांकन

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### प्रपत्र प्रदर्शन

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#स्मार्ट #टेम्पलेट्स #xoops #फ्रंटएंड #टेम्पलेट-इंजन