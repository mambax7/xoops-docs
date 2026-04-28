---
title: "Szablony Smarty w XOOPS"
---

## Przegląd

XOOPS używa silnika szablonów Smarty do rozdzielenia prezentacji od logiki. Ten przewodnik obejmuje składnię Smarty, funkcje specyficzne dla XOOPS i najlepsze praktyki szablonów.

## Podstawowa składnia

### Zmienne

```smarty
{* Zmienne skalarne *}
<{$variable}>
<{$article.title}>
<{$user->getUsername()}>

{* Dostęp do tablicy *}
<{$items[0]}>
<{$config['setting']}>

{* Wartości domyślne *}
<{$title|default:'Untitled'}>
```

### Modyfikatory

```smarty
{* Transformacje tekstu *}
<{$text|upper}>
<{$text|lower}>
<{$text|capitalize}>
<{$text|truncate:100:'...'}>

{* Obsługa HTML *}
<{$content|strip_tags}>
<{$html|escape:'html'}>
<{$url|escape:'url'}>

{* Formatowanie daty *}
<{$timestamp|date_format:'%Y-%m-%d'}>
<{$date|date_format:$xoops_config.dateformat}>

{* Łańcuchowanie modyfikatorów *}
<{$text|strip_tags|truncate:50|escape}>
```

### Warunkowe

```smarty
{* If/else *}
<{if $logged_in}>
    Welcome, <{$username}>!
<{elseif $is_guest}>
    Please log in.
<{else}>
    Unknown state.
<{/if}>

{* Porównania *}
<{if $count > 0}>
<{if $status == 'published'}>
<{if $items|@count >= 5}>

{* Operatory logiczne *}
<{if $is_admin && $can_edit}>
<{if $type == 'news' || $type == 'article'}>
<{if !$is_hidden}>
```

### Pętle

```smarty
{* Foreach z elementami *}
<{foreach item=article from=$articles}>
    <h2><{$article.title}></h2>
<{/foreach}>

{* Z kluczem *}
<{foreach key=id item=value from=$items}>
    <{$id}>: <{$value}>
<{/foreach}>

{* Z informacjami iteracji *}
<{foreach item=item from=$items name=itemloop}>
    <{$smarty.foreach.itemloop.index}>
    <{$smarty.foreach.itemloop.iteration}>
    <{$smarty.foreach.itemloop.first}>
    <{$smarty.foreach.itemloop.last}>
<{/foreach}>

{* Foreachelse dla pustych tablic *}
<{foreach item=item from=$items}>
    <{$item.name}>
<{foreachelse}>
    No items found.
<{/foreach}>
```

### Sekcje (Legacy)

```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```

## Funkcje specyficzne dla XOOPS

### Zmienne globalne

```smarty
{* Informacje o witrynie *}
<{$xoops_sitename}>
<{$xoops_url}>
<{$xoops_rootpath}>
<{$xoops_theme}>

{* Informacje o użytkowniku *}
<{$xoops_isuser}>
<{$xoops_isadmin}>
<{$xoops_userid}>
<{$xoops_uname}>

{* Informacje o module *}
<{$xoops_dirname}>
<{$xoops_pagetitle}>

{* Meta *}
<{$xoops_meta_keywords}>
<{$xoops_meta_description}>
```

### Dołączanie plików

```smarty
{* Dołącz z motywu *}
<{include file="theme:header.html"}>

{* Dołącz z modułu *}
<{include file="db:modulename_partial.tpl"}>

{* Dołącz ze zmiennymi *}
<{include file="db:mymodule_item.tpl" item=$article}>

{* Dołącz z systemu plików *}
<{include file="$xoops_rootpath/modules/mymodule/templates/partial.tpl"}>
```

### Wyświetlanie bloku

```smarty
{* W theme.html *}
<{foreach item=block from=$xoops_lblocks}>
    <div class="block">
        <{if $block.title}>
            <h3><{$block.title}></h3>
        <{/if}>
        <{$block.content}>
    </div>
<{/foreach}>
```

### Integracja formularza

```smarty
{* Renderowanie XoopsForm *}
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

## Niestandardowe funkcje

### Zarejestrowane przez XOOPS

```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Menu modułu *}
<{xoModuleMenu}>
```

### Niestandardowe wtyczki

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

## Organizacja szablonu

### Zalecana struktura

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

### Szablony częściowe

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

{* Użycie *}
<{include file="db:mymodule_pagination.tpl" page=$current_page total_pages=$pages base_url=$url}>
```

## Wydajność

### Cachowanie

```php
// W PHP
$xoopsTpl->caching = 1;
$xoopsTpl->cache_lifetime = 3600; // 1 godzina

// Sprawdź czy cached
if (!$xoopsTpl->is_cached('mymodule_index.tpl')) {
    // Pobierz dane tylko jeśli nie cached
    $items = $handler->getObjects();
    $xoopsTpl->assign('items', $items);
}
```

### Wyczyść cache

```php
// Wyczyść konkretny szablon
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Wyczyść wszystkie szablony modułu
$xoopsTpl->clear_all_cache();
```

## Najlepsze praktyki

1. **Zescapuj wyjście** - Zawsze zescapuj zawartość generowaną przez użytkownika
2. **Używaj modyfikatorów** - Stosuj odpowiednie transformacje
3. **Utrzymuj logikę na minimalnym poziomie** - Złożona logika należy do PHP
4. **Używaj szablonów częściowych** - Ponownie używaj wspólnych fragmentów szablonu
5. **Semantyczny HTML** - Używaj odpowiednich elementów HTML5
6. **Dostępność** - Dołącz atrybuty ARIA gdzie to potrzebne

## Powiązana dokumentacja

- Theme-Development - Tworzenie motywów XOOPS
- ../../04-API-Reference/Template/Template-System - XOOPS template API
- ../../03-Module-Development/Block-Development - Szablony bloków
- ../Forms/Form-Elements - Renderowanie formularza
