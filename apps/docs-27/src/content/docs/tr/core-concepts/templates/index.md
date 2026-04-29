---
title: "Smarty XOOPS'de template oluşturma"
---
## Genel Bakış

XOOPS, sunumu mantıktan ayırmak için Smarty template motorunu kullanır. Bu kılavuz Smarty sözdizimini, XOOPS'ye özgü özellikleri ve şablonla ilgili en iyi uygulamaları kapsar.

## Temel Söz Dizimi

### Değişkenler
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
### Değiştiriciler
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
### Koşul Cümleleri
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
### Döngüler
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
### Bölümler (Eski)
```smarty
<{section name=i loop=$items}>
    <{$items[i].title}>
<{/section}>
```
## XOOPS-Özel Özellikler

### Genel Değişkenler
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
### Dosyaları Dahil Etme
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
### Blok Görünümü
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
### Form Entegrasyonu
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
## Özel İşlevler

### XOOPS tarafından kaydedildi
```smarty
{* XoopsFormLoader *}
<{xoFormLoader form=$form}>

{* Breadcrumb *}
<{xoBreadcrumb}>

{* Module menu *}
<{xoModuleMenu}>
```
### Özel Eklentiler
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
## template Organizasyonu

### Önerilen Yapı
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
### Kısmi templates
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
## Performans

### Önbelleğe alma
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
### Önbelleği Temizle
```php
// Clear specific template
$xoopsTpl->clear_cache('mymodule_index.tpl');

// Clear all module templates
$xoopsTpl->clear_all_cache();
```
## En İyi Uygulamalar

1. **Çıktı Çıkışı** - user tarafından oluşturulan içerikten her zaman kaçın
2. **Değiştiricileri Kullanın** - Uygun dönüşümleri uygulayın
3. **Mantığı Minimum Tutun** - Karmaşık mantık PHP'ye aittir
4. **Kısmileri Kullan** - Yaygın template parçalarını yeniden kullanın
5. **Semantik HTML** - Uygun HTML5 öğelerini kullanın
6. **Erişilebilirlik** - Gerektiğinde ARIA özelliklerini ekleyin

## İlgili Belgeler

- theme Geliştirme - theme oluşturma
- ../../04-API-Reference/Template/Template-System - XOOPS şablonu API
- ../../03-Module-Development/Block-Development - Blok şablonları
- ../Forms/Form-Elements - Form oluşturma