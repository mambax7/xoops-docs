---
title: "Migracija Smarty 4"
description: "Vodnik za nadgradnjo XOOPS predlog s Smarty 3 na Smarty 4"
---
Ta priročnik pokriva spremembe in korake selitve, potrebne pri nadgradnji s Smarty 3 na Smarty 4 v XOOPS. Razumevanje teh razlik je bistveno za ohranjanje združljivosti s sodobnimi XOOPS namestitvami.

## Povezana dokumentacija

- Osnove Smarty - Osnove Smarty v XOOPS
- Razvoj tem - Ustvarjanje XOOPS tem
- Template-Variables - razpoložljive spremenljivke v predlogah

## Pregled sprememb

Smarty 4 je uvedel več pomembnih sprememb v primerjavi s Smarty 3:

1. Vedenje pri dodelitvi spremenljivk se je spremenilo
2. `{php}` oznake popolnoma odstranjene
3. Predpomnjenje API sprememb
4. Modifikator, ki obravnava posodobitve
5. Spremembe varnostne politike
6. Odstranjene zastarele funkcije

## Spremenljive spremembe dostopa

### Težava

V Smarty 2/3 so bile dodeljene vrednosti neposredno dostopne:
```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```
V Smarty 4 so spremenljivke ovite v `Smarty_Variable` objektov:
```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```
### 1. rešitev: Dostopite do lastnosti vrednosti
```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```
### 2. rešitev: način združljivosti

Omogoči način združljivosti v PHP:
```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```
To omogoča neposreden spremenljiv dostop, kot je Smarty 3.

### 3. rešitev: Pogojno preverjanje različice

Napišite predloge, ki delujejo v obeh različicah:
```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```
### Rešitev 4: Funkcija ovoja

Ustvarite pomožno funkcijo za dodelitve:
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
## Odstranjevanje oznak {php}

### Težava

Smarty 3+ ne podpira oznak `{php}` iz varnostnih razlogov:
```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```
### Rešitev: Uporabite spremenljivke Smarty
```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```
### Rešitev: premaknite logiko na PHP

Kompleksna logika naj bo v PHP, ne v predlogah:
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
### Rešitev: Vtičniki po meri

Za večkratno uporabo ustvarite vtičnike Smarty:
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
## Predpomnjenje sprememb

### Predpomnjenje Smarty 3
```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```
### Predpomnjenje Smarty 4
```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```
### Konstante predpomnjenja
```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```
### Nocache v predlogah
```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```
## Spremembe modifikatorja

### Modifikatorji nizov

Nekateri modifikatorji so bili preimenovani ali opuščeni:
```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```
### Modifikatorji polja

Modifikatorji matrike zahtevajo predpono `@`:
```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Modifikatorji po meri

Modifikatorje po meri je treba registrirati:
```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```
## Spremembe varnostne politike

### Varnost Smarty 4

Smarty 4 ima strožjo privzeto varnost:
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
### Dovoljene funkcije

Smarty 4 privzeto omejuje, katere PHP funkcije je mogoče uporabiti:
```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```
Po potrebi konfigurirajte dovoljene funkcije:
```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```
## Posodobitve dedovanja predlog

### Sintaksa bloka

Sintaksa bloka ostaja podobna, vendar z nekaj spremembami:
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
### Pripni in pripni
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
## Zastarele funkcije

### Odstranjeno v Smarty 4

| Funkcija | Alternativa |
|---------|-------------|
| `{php}` oznake | Premaknite logiko na PHP ali uporabite vtičnike |
| `{include_php}` | Uporabite registrirane vtičnike |
| `$Smarty.capture` | Še vedno deluje, vendar zastarelo |
| `{strip}` s presledki | Uporabite orodja za pomanjševanje |

### Uporabite alternative
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
## Kontrolni seznam za selitev

### Pred selitvijo

1. [ ] Varnostno kopirajte vse predloge
2. [ ] Navedite vse uporabe oznak `{php}`
3. [ ] Dokumentirajte vtičnike po meri
4. [ ] Preizkusite trenutno delovanje

### Med selitvijo

1. [ ] Odstranite vse oznake `{php}`
2. [ ] Posodobi spremenljivo sintakso dostopa
3. [ ] Preverite uporabo modifikatorja
4. [ ] Posodobite konfiguracijo predpomnjenja
5. [ ] Preglejte varnostne nastavitve

### Po selitvi

1. [ ] Preizkusite vse predloge
2. [ ] Preverite delo vseh obrazcev
3. [ ] Preverite, ali predpomnjenje deluje
4. [ ] Preizkusite z različnimi uporabniškimi vlogami

## Testiranje združljivosti

### Zaznavanje različice
```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```
### Preverjanje različice predloge
```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```
## Pisanje navzkrižno združljivih predlog

### Najboljše prakse

1. **V celoti se izogibajte oznakam `{php}`** - ne delujejo v Smarty 3+

2. **Predloge naj bodo preproste** - Kompleksna logika sodi v PHP

3. **Uporabljajte standardne modifikatorje** – izogibajte se zastarelim

4. **Preizkusite v obeh različicah** - Če potrebujete podporo za obe

5. **Uporabite vtičnike za zapletene operacije** – lažje jih je vzdrževati

### Primer: navzkrižno združljiva predloga
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
## Pogoste težave pri selitvi

### Težava: Spremenljivke vrnejo prazno

**Težava**: `<{$mod_url}>` ne vrne ničesar v Smarty 4

**Rešitev**: Uporabite `<{$mod_url->value}>` ali omogočite način združljivosti

### Težava: PHP Napake oznak

**Težava**: Predloga vrže napako na oznakah `{php}`

**Rešitev**: Odstranite vse oznake PHP in premaknite logiko v datoteke PHP

### Težava: modifikatorja ni bilo mogoče najti

**Težava**: modifikator po meri vrže napako »neznan modifikator«.

**Rešitev**: Registrirajte modifikator z `registerPlugin()`

### Težava: Varnostna omejitev

**Težava**: funkcija ni dovoljena v predlogi

**Rešitev**: Dodajte funkcijo na seznam dovoljenih varnostnih pravilnikov

---

#Smarty #migration #upgrade #XOOPS #smarty4 #compatibility