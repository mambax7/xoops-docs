---
title: "Osnove Smarty"
description: "Osnove Smarty šablona u XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::napomena[Smarty Verzija XOOPS Izdanje]
| XOOPS Verzija | Smarty Verzija | Ključne razlike |
|--------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | `{php}` blokovi dopušteni (ali se ne preporučuju) |
| 2.7.0+ | Smarty 3.x/4.x | Priprema za Smarty 4 kompatibilnost |
| 4.0 | Smarty 4.x | `{php}` blokovi uklonjeni, stroža sintaksa |

Pogledajte Smarty-4-Migracija za upute o migraciji.
:::

Smarty je predložak za PHP koji programerima omogućuje odvajanje prezentacije (HTML/CSS) od logike aplikacije. XOOPS koristi Smarty za sve svoje potrebe izrade predložaka, omogućujući čisto odvajanje između PHP koda i HTML izlaza.

## Povezana dokumentacija

- Razvoj teme - Stvaranje XOOPS themes
- Varijable predloška - Dostupne varijable u templates
- Smarty-4-Migracija - Nadogradnja sa Smarty 3 na 4

## Što je Smarty?

Smarty pruža:

- **Odvajanje koncerna**: Zadržite HTML u templates, PHP logiku u classes
- **Nasljeđivanje predložaka**: Izgradite složene izglede od jednostavnih blokova
- **Caching**: Poboljšajte performanse s kompajliranim templates
- **Modifikatori**: Transformirajte izlaz pomoću ugrađenih ili prilagođenih funkcija
- **Sigurnost**: kontrolirajte kojim funkcijama PHP templates može pristupiti

## XOOPS Smarty Konfiguracija

XOOPS konfigurira Smarty s prilagođenim graničnicima:

```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```

Ovo sprječava sukobe s kodom JavaScript u templates.

## Osnovna sintaksa

### Varijable

Varijable se prenose iz PHP u templates:

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

### Pristup polju

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

### Svojstva objekta

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Komentari

Komentari u Smarty nisu prikazani u HTML:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## Kontrolne strukture

### If/Else izjave

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Operatori usporedbe

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

### Provjera za Empty/Isset

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

### Foreach petlje

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

### Za petlje

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Dok petlje

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Modifikatori varijabli

Modifikatori transformiraju izlaz varijable:

### Modifikatori nizova

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

### Numerički modifikatori

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Modifikatori polja

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Modifikatori ulančavanja

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Uključi i umetni

### Uključujući druge predloške

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Umetanje dinamičkog sadržaja

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## Dodijelite varijable u predlošcima

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

## Ugrađene varijable Smarty

### $smarty Varijabilno

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

## Doslovni blokovi

Za JavaScript s vitičastim zagradama:

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

Ili upotrijebite varijable Smarty unutar JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Prilagođene funkcijeXOOPS pruža prilagođene funkcije Smarty:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Najbolji primjeri iz prakse

### Uvijek izbjegavaj izlaz

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### Koristite smislena imena varijabli

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Neka logika bude minimalna

predlošci bi se trebali usredotočiti na prezentaciju. Premjesti složenu logiku na PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### Koristite nasljeđivanje predložaka

Za dosljedne izglede koristite nasljeđivanje predložaka (pogledajte Razvoj teme).

## predlošci za otklanjanje pogrešaka

### Konzola za otklanjanje pogrešaka

```smarty
{* Show all assigned variables *}
<{debug}>
```

### Privremeni izlaz

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Uobičajeni obrasci predložaka XOOPS

### Struktura predloška modula

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

### Paginacija

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Prikaz obrazaca

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #templates #xoops #frontend #template-engine
