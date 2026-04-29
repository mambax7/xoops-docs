---
title: "Smarty 4 Migracija"
description: "Vodič za nadogradnju XOOPS templates sa Smarty 3 na Smarty 4"
---
Ovaj vodič pokriva promjene i korake migracije potrebne prilikom nadogradnje sa Smarty 3 na Smarty 4 u XOOPS. Razumijevanje ovih razlika bitno je za održavanje kompatibilnosti s modernim instalacijama XOOPS.

## Povezana dokumentacija

- Smarty-Osnove - Osnove Smarty u XOOPS
- Razvoj teme - Stvaranje XOOPS themes
- Varijable-predložak - Dostupne varijable u templates

## Pregled promjena

Smarty 4 uveo je nekoliko značajnih promjena u odnosu na Smarty 3:

1. Promijenilo se ponašanje dodjele varijabli
2. `{php}` oznake potpuno uklonjene
3. Spremanje API promjena u predmemoriju
4. Modifikator koji upravlja ažuriranjima
5. Promjene sigurnosne politike
6. Zastarjele značajke uklonjene

## Promjene varijabilnog pristupa

### Problem

U Smarty 2/3 dodijeljene vrijednosti bile su izravno dostupne:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

U Smarty 4, varijable su omotane u objekte `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Rješenje 1: pristupite svojstvu vrijednosti

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Rješenje 2: Način kompatibilnosti

Omogući način rada kompatibilnosti u PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Ovo omogućuje izravan pristup varijablama kao što je Smarty 3.

### Rješenje 3: Uvjetna provjera verzije

Napišite templates koji radi u obje verzije:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Rješenje 4: Funkcija omotača

Napravite pomoćnu funkciju za dodjelu:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## Uklanjanje {php} oznaka

### Problem

Smarty 3+ ne podržava oznake `{php}` iz sigurnosnih razloga:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Rješenje: Koristite varijable Smarty

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Rješenje: Premjestite Logic na PHP

Složena logika trebala bi biti u PHP, a ne u templates:

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

### Rješenje: Prilagođeni dodaci

Za višekratnu funkcionalnost stvorite dodatke Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Spremanje promjena u predmemoriju

### Smarty 3 Predmemoriranje

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Spremanje u predmemoriju

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Konstante predmemoriranja

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache u predlošcima

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Promjene modifikatora

### Modifikatori nizova

Neki su modifikatori preimenovani ili zastarjeli:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Modifikatori polja

Modifikatori polja zahtijevaju prefiks `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Prilagođeni modifikatori

Prilagođeni modifikatori moraju biti registrirani:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Promjene sigurnosne politike

### Smarty 4 Sigurnost

Smarty 4 ima strožu zadanu sigurnost:

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Dopuštene funkcije

Prema zadanim postavkama, Smarty 4 ograničava koje se funkcije PHP mogu koristiti:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Konfigurirajte dopuštene funkcije ako je potrebno:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Ažuriranja nasljeđivanja predložaka

### Sintaksa bloka

Sintaksa bloka ostaje slična, ali uz neke promjene:

```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Dodavanje i dodavanje ispred

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## Zastarjele značajke

### Uklonjeno u Smarty 4| Značajka | Alternativa |
|---------|-------------|
| `{php}` oznake | Premjestite logiku na PHP ili koristite dodatke |
| `{include_php}` | Koristite registrirane dodatke |
| `$smarty.capture` | I dalje radi, ali je zastario |
| `{strip}` s razmacima | Koristite alate za smanjivanje |

### Koristite alternative

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Kontrolni popis migracije

### Prije migracije

1. [ ] Sigurnosno kopirajte sve templates
2. [ ] Navedite sve upotrebe oznaka `{php}`
3. [ ] Dokumentirajte prilagođene dodatke
4. [ ] Testirajte trenutnu funkcionalnost

### Tijekom migracije

1. [ ] Uklonite sve oznake `{php}`
2. [ ] Ažuriraj sintaksu pristupa varijabli
3. [ ] Provjerite korištenje modifikatora
4. [ ] Ažurirajte konfiguraciju predmemoriranja
5. [ ] Pregledajte sigurnosne postavke

### Nakon migracije

1. [ ] Testirajte sve templates
2. [ ] Provjerite rad svih obrazaca
3. [ ] Provjerite radi li predmemoriranje
4. [ ] Testirajte s različitim korisničkim ulogama

## Testiranje kompatibilnosti

### Detekcija verzije

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Provjera verzije predloška

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Pisanje višekompatibilnih predložaka

### Najbolji primjeri iz prakse

1. **U potpunosti izbjegavajte oznake `{php}`** - Ne rade u Smarty 3+

2. **Neka templates bude jednostavan** - Složena logika pripada PHP

3. **Koristite standardne modifikatore** - Izbjegavajte one koji su zastarjeli

4. **Testirajte u obje verzije** - Ako trebate podržati obje

5. **Koristite dodatke za složene operacije** - Lakše ih je održavati

### Primjer: unakrsno kompatibilan predložak

```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## Uobičajeni problemi s migracijom

### Problem: varijable vraćaju prazno

**Problem**: `<{$mod_url}>` ne vraća ništa u Smarty 4

**Rješenje**: Koristite `<{$mod_url->value}>` ili omogućite način rada kompatibilnosti

### Problem: PHP Pogreške oznake

**Problem**: predložak daje pogrešku na oznakama `{php}`

**Rješenje**: Uklonite sve oznake PHP i premjestite logiku u datoteke PHP

### Problem: Modifikator nije pronađen

**Problem**: prilagođeni modifikator daje pogrešku "nepoznati modifikator".

**Rješenje**: Registrirajte modifikator sa `registerPlugin()`

### Problem: Sigurnosno ograničenje

**Problem**: Funkcija nije dopuštena u predlošku

**Rješenje**: Dodajte funkciju na popis dopuštenih sigurnosnih pravila

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
