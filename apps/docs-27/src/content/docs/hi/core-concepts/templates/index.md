---
title: "Smarty XOOPS में टेम्प्लेटिंग"
---
## अवलोकन

XOOPS प्रस्तुतिकरण को तर्क से अलग करने के लिए Smarty टेम्पलेट इंजन का उपयोग करता है। यह मार्गदर्शिका Smarty सिंटैक्स, XOOPS-विशिष्ट सुविधाएँ और टेम्पलेट सर्वोत्तम प्रथाओं को शामिल करती है।

## मूल सिंटैक्स

### चर

```smarty
{* Scalar variables *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* Array access *}
<{$items[0]}>
<{$config['setting']}>

{* Default values *}
<{$title|default:'Untitled'}>
```

### संशोधक

```smarty
{* Text transformations *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* HTML handling *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* Date formatting *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* Chaining modifiers *}
<{$text|strip_tags|truncate:50|escape}>
```

### सशर्त

```smarty
{* If/else *}
<{if $logged_in}>
    Welcome, <{$username}>!
<{elseif $is_guest}>
    Please log in.
<{else}>
    Unknown state.
<{/if}>

{* Comparisons *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* Logical operators *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### लूप्स

```smarty
{* Foreach with items *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* With key *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* With iteration info *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    No items found.
<{/foreach}>
```

### अनुभाग (विरासत)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## XOOPS-विशिष्ट विशेषताएं

### वैश्विक चर

```smarty
{* Site info *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* User info *}
<{$xoops_isuser}>
<{$xoops_isadmin}>
<{$xoops_userid}>
<{$xoops_uname}>

{* Module info *}
<{$xoops_dirname}>
<{$xoops_pagetitle}>

{* Meta *}
<{$xoops_meta_keywords}>
<{$xoops_meta_description}>
```

### फ़ाइलें सहित

```smarty
{* Include from theme *}
<{include file="theme:header.html"}>

{* Include from module *}
<{include file="db:modulename_partial.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$article}>

{* Include from file system *}
<{include file="$xoops_rootpath/modules/mymodule/templates/partial.tpl"}>
```

### ब्लॉक डिस्प्ले

```smarty
{* In theme.html *}
<{foreach item=block from=$xoops_lblocks}>
    <div class="block">
        <{if $block.title}>
            <h3><{$block.title}></h3>
        <{/if}>
        <{$block.content}>
    </div>
<{/foreach}>
```

### फॉर्म एकीकरण

```smarty
{* XoopsForm rendering *}
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

## कस्टम फ़ंक्शन

### XOOPS द्वारा पंजीकृत

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Module menu *}
<{xoModuleMenu}>
```

### कस्टम प्लगइन्स

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

## टेम्पलेट संगठन

### अनुशंसित संरचना

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

### आंशिक टेम्पलेट्स

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

{* Usage *}
<{include file="db:mymodule_pagination.tpl" page=$current_page total_pages=$pages base_url=$url}>
```

## प्रदर्शन

### कैशिंग

```php
// In PHP
$xoopsTpl->caching = 1;
$xoopsTpl->cache_lifetime = 3600; // 1 hour

// Check if cached
if (!$xoopsTpl->is_cached('mymodule_index.tpl')) {
    // Fetch data only if not cached
    $items = $handler->getObjects();
    $xoopsTpl->assign('items', $items);
}
```

### कैश साफ़ करें

```php
// Clear specific template
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Clear all module templates
$xoopsTpl->clear_all_cache();
```

## सर्वोत्तम प्रथाएँ

1. **एस्केप आउटपुट** - हमेशा उपयोगकर्ता-जनित सामग्री से बचें
2. **संशोधक का उपयोग करें** - उचित परिवर्तन लागू करें
3. **तर्क को न्यूनतम रखें** - जटिल तर्क PHP में आता है
4. **आंशिकों का उपयोग करें** - सामान्य टेम्पलेट अंशों का पुन: उपयोग करें
5. **सिमेंटिक HTML** - उचित HTML5 तत्वों का उपयोग करें
6. **पहुंच-योग्यता** - जहां आवश्यक हो वहां ARIA विशेषताएँ शामिल करें

## संबंधित दस्तावेज़ीकरण

- थीम-विकास - थीम निर्माण
- ../../04-API-संदर्भ/टेम्पलेट/टेम्पलेट-सिस्टम - XOOPS टेम्पलेट API
- ../../03-मॉड्यूल-विकास/ब्लॉक-विकास - ब्लॉक टेम्पलेट्स
- ../फॉर्म/फॉर्म-तत्व - फॉर्म प्रतिपादन