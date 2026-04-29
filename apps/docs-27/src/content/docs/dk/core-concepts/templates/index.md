---
title: "Smarty skabelon i XOOPS"
---

## Oversigt

XOOPS bruger Smarty-skabelonmotoren til at adskille præsentation fra logik. Denne vejledning dækker Smarty-syntaks, XOOPS-specifikke funktioner og bedste praksis for skabeloner.

## Grundlæggende syntaks

### Variabler

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

### Modifikatorer

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

### Betingelser

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

### Sløjfer

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

### sektioner (ældre)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## XOOPS-specifikke funktioner

### Globale variabler

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

### Inklusive filer

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

### Bloker display

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

### Form Integration

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

## Brugerdefinerede funktioner

### Registreret af XOOPS

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Module menu *}
<{xoModuleMenu}>
```

### Brugerdefinerede plugins

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

## Skabelonorganisation

### Anbefalet struktur

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

### Delvise skabeloner

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

## Ydeevne

### Caching

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

### Ryd cache

```php
// Clear specific template
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Clear all module templates
$xoopsTpl->clear_all_cache();
```

## Bedste praksis

1. **Escape Output** - Undslip altid brugergenereret indhold
2. **Brug modifikatorer** - Anvend passende transformationer
3. **Keep Logic Minimal** - Kompleks logik hører hjemme i PHP
4. **Brug partialer** - Genbrug almindelige skabelonfragmenter
5. **Semantisk HTML** - Brug de rigtige HTML5-elementer
6. **Tilgængelighed** - Inkluder ARIA-attributter, hvor det er nødvendigt

## Relateret dokumentation

- Tema-udvikling - Tema skabelse
- ../../04-API-Reference/Template/Template-System - XOOPS skabelon API
- ../../03-Module-Development/Block-Development - Blok skabeloner
- ../Forms/Form-Elements - Formulargengivelse
