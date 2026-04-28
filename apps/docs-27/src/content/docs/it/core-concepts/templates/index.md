---
title: "Template Smarty in XOOPS"
---

## Panoramica

XOOPS utilizza il motore di template Smarty per separare la presentazione dalla logica. Questa guida copre la sintassi Smarty, le funzionalità specifiche di XOOPS e le best practice dei template.

## Sintassi di base

### Variabili

```smarty
{* Variabili scalari *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* Accesso a array *}
<{$items[0]}>
<{$config['setting']}>

{* Valori predefiniti *}
<{$title|default:'Untitled'}>
```

### Modificatori

```smarty
{* Trasformazioni di testo *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* Gestione HTML *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* Formattazione della data *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* Concatenamento di modificatori *}
<{$text|strip_tags|truncate:50|escape}>
```

### Condizionali

```smarty
{* If/else *}
<{if $logged_in}>
    Benvenuto, <{$username}>!
<{elseif $is_guest}>
    Per favore accedi.
<{else}>
    Stato sconosciuto.
<{/if}>

{* Confronti *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* Operatori logici *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### Loop

```smarty
{* Foreach con elementi *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* Con chiave *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* Con info di iterazione *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* Foreachelse per array vuoti *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    Nessun elemento trovato.
<{/foreach}>
```

### Sezioni (Legacy)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## Funzionalità specifiche di XOOPS

### Variabili globali

```smarty
{* Info del sito *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* Info utente *}
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

### Including Files

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

### Block Display

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

## Custom Functions

### Registered by XOOPS

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Module menu *}
<{xoModuleMenu}>
```

### Custom Plugins

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

## Template Organization

### Recommended Structure

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

### Partial Templates

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

## Performance

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

### Clear Cache

```php
// Clear specific template
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Clear all module templates
$xoopsTpl->clear_all_cache();
```

## Best Practices

1. **Escape Output** - Always escape user-generated content
2. **Use Modifiers** - Apply appropriate transformations
3. **Keep Logic Minimal** - Complex logic belongs in PHP
4. **Use Partials** - Reuse common template fragments
5. **Semantic HTML** - Use proper HTML5 elements
6. **Accessibility** - Include ARIA attributes where needed

## Related Documentation

- Theme-Development - Theme creation
- ../../04-API-Reference/Template/Template-System - XOOPS template API
- ../../03-Module-Development/Block-Development - Block templates
- ../Forms/Form-Elements - Form rendering
