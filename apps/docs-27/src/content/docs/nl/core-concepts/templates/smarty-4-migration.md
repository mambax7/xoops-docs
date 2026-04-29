---
title: "Smarty 4 Migratie"
description: "Handleiding voor het upgraden van XOOPS-sjablonen van Smarty 3 naar Smarty 4"
---
Deze handleiding behandelt de wijzigingen en migratiestappen die nodig zijn bij het upgraden van Smarty 3 naar Smarty 4 in XOOPS. Het begrijpen van deze verschillen is essentieel voor het behouden van de compatibiliteit met moderne XOOPS-installaties.

## Gerelateerde documentatie

- Smarty-Basics - Grondbeginselen van Smarty in XOOPS
- Thema-ontwikkeling - XOOPS-thema's maken
- Sjabloonvariabelen - Beschikbare variabelen in sjablonen

## Overzicht van wijzigingen

Smarty 4 introduceerde verschillende belangrijke wijzigingen ten opzichte van Smarty 3:

1. Gedrag van variabele toewijzing veranderd
2. `{php}`-tags volledig verwijderd
3. Wijzigingen in API in cache opslaan
4. Modifier die updates verwerkt
5. Wijzigingen in het beveiligingsbeleid
6. Verouderde functies verwijderd

## Veranderingen in variabele toegang

### Het probleem

In Smarty 2/3 waren toegewezen waarden direct toegankelijk:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

In Smarty 4 zijn variabelen verpakt in `Smarty_Variable`-objecten:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Oplossing 1: toegang tot de waarde-eigenschap

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Oplossing 2: compatibiliteitsmodus

Compatibiliteitsmodus inschakelen in PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Dit maakt directe variabele toegang mogelijk, zoals Smarty 3.

### Oplossing 3: voorwaardelijke versiecontrole

Schrijf sjablonen die in beide versies werken:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Oplossing 4: Wrapper-functie

Maak een helperfunctie voor opdrachten:

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

## Verwijderen van {PHP}-tags

### Het probleem

Smarty 3+ ondersteunt om veiligheidsredenen geen `{php}`-tags:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Oplossing: gebruik Smarty-variabelen

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Oplossing: Verplaats logica naar PHP

Complexe logica moet in PHP staan, niet in sjablonen:

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

### Oplossing: aangepaste plug-ins

Maak Smarty-plug-ins voor herbruikbare functionaliteit:

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

## Wijzigingen in cache

### Smarty 3 Caching

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Caching

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Caching-constanten

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache in sjablonen

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Modificatiewijzigingen

### Stringmodificatoren

Sommige modifiers zijn hernoemd of verouderd:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Arraymodificatoren

Array-modifiers vereisen het voorvoegsel `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Aangepaste modificaties

Aangepaste modifiers moeten worden geregistreerd:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Wijzigingen in het beveiligingsbeleid

### Smarty 4-beveiliging

Smarty 4 heeft strengere standaardbeveiliging:

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

### Toegestane functies

Standaard beperkt Smarty 4 welke PHP-functies kunnen worden gebruikt:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Configureer indien nodig toegestane functies:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Updates van sjabloonovererving

### Bloksyntaxis

De bloksyntaxis blijft hetzelfde, maar met enkele wijzigingen:

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

### Toevoegen en voorafgaan

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

## Verouderde functies

### Verwijderd in Smarty 4

| Kenmerk | Alternatief |
|---------|------------|
| `{php}`-tags | Verplaats logica naar PHP of gebruik plug-ins |
| `{include_php}` | Gebruik geregistreerde plug-ins |
| `$smarty.capture` | Werkt nog steeds, maar is verouderd |
| `{strip}` met spaties | Gebruik verkleiningstools |

### Gebruik alternatieven

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

## Migratiechecklist

### Vóór de migratie

1. [ ] Maak een back-up van alle sjablonen
2. [ ] Geef een overzicht van al het gebruik van de `{php}`-tag
3. [ ] Documenteer aangepaste plug-ins
4. [ ] Test huidige functionaliteit

### Tijdens migratie

1. [ ] Verwijder alle `{php}`-tags
2. [ ] Syntaxis voor variabele toegang bijwerken
3. [ ] Controleer het modifiergebruik
4. [ ] Cachingconfiguratie bijwerken
5. [ ] Controleer de beveiligingsinstellingen

### Na de migratie

1. [ ] Test alle sjablonen
2. [ ] Controleer of alle formulieren werken
3. [ ] Controleer of caching werkt
4. [ ] Test met verschillende gebruikersrollen

## Testen op compatibiliteit

### Versiedetectie

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Sjabloonversiecontrole

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Cross-compatibele sjablonen schrijven

### Beste praktijken

1. **Vermijd `{php}`-tags volledig** - Ze werken niet in Smarty 3+

2. **Houd sjablonen eenvoudig** - Complexe logica hoort thuis in PHP

3. **Gebruik standaard modifiers** - Vermijd verouderde modifiers

4. **Test in beide versies** - Als u beide wilt ondersteunen

5. **Gebruik plug-ins voor complexe bewerkingen** - Beter onderhoudbaar

### Voorbeeld: Cross-compatibele sjabloon

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

## Veelvoorkomende migratieproblemen### Probleem: Variabelen retourneren leeg

**Probleem**: `<{$mod_url}>` retourneert niets in Smarty 4

**Oplossing**: gebruik `<{$mod_url->value}>` of schakel de compatibiliteitsmodus in

### Probleem: PHP-tagfouten

**Probleem**: sjabloon genereert een fout op `{php}`-tags

**Oplossing**: verwijder alle PHP-tags en verplaats de logica naar PHP-bestanden

### Probleem: Modifier niet gevonden

**Probleem**: aangepaste modifier genereert de foutmelding 'onbekende modifier'

**Oplossing**: Registreer de modifier met `registerPlugin()`

### Probleem: beveiligingsbeperking

**Probleem**: Functie niet toegestaan in sjabloon

**Oplossing**: voeg een functie toe aan de toegestane lijst van het beveiligingsbeleid

---

#Smarty #migration #upgrade #xoops #smarty4 #compatibiliteit