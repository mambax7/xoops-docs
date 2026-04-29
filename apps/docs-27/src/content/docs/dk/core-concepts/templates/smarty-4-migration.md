---
title: "Smarty 4 Migration"
description: "Guide til at opgradere XOOPS skabeloner fra Smarty 3 til Smarty 4"
---

Denne vejledning dækker de ændringer og migreringstrin, der er nødvendige ved opgradering fra Smarty 3 til Smarty 4 i XOOPS. Det er vigtigt at forstå disse forskelle for at opretholde kompatibilitet med moderne XOOPS-installationer.

## Relateret dokumentation

- Smarty-Basics - Fundamentals of Smarty i XOOPS
- Temaudvikling - Oprettelse af XOOPS-temaer
- Template-Variables - Tilgængelige variabler i skabeloner

## Oversigt over ændringer

Smarty 4 introducerede flere brydende ændringer fra Smarty 3:

1. Variabel tildelingsadfærd ændret
2. `{php}` tags er fuldstændig fjernet
3. Caching af API ændringer
4. Modifikatorhåndtering af opdateringer
5. Sikkerhedspolitiske ændringer
6. Forældede funktioner fjernet

## Ændringer i variabel adgang

### Problemet

I Smarty 2/3 var tildelte værdier direkte tilgængelige:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

I Smarty 4 er variabler pakket ind i `Smarty_Variable`-objekter:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Løsning 1: Få adgang til værdiegenskaben

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Løsning 2: Kompatibilitetstilstand

Aktiver kompatibilitetstilstand i PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Dette tillader direkte variabel adgang som Smarty 3.

### Løsning 3: Kontrol af betinget version

Skriv skabeloner, der virker i begge versioner:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Løsning 4: Indpakningsfunktion

Opret en hjælpefunktion til opgaver:

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

## Fjerner {php}-tags

### Problemet

Smarty 3+ understøtter ikke `{php}`-tags af sikkerhedsmæssige årsager:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Løsning: Brug Smarty-variabler

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Løsning: Flyt Logic til PHP

Kompleks logik skal være i PHP, ikke skabeloner:

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

### Løsning: Brugerdefinerede plugins

For genanvendelig funktionalitet skal du oprette Smarty-plugins:

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

## Cacheændringer

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

### Caching-konstanter

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache i skabeloner

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Modifikatorændringer

### Strengmodifikatorer

Nogle modifikatorer blev omdøbt eller forældet:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Array-modifikatorer

Array-modifikatorer kræver `@`-præfiks:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Brugerdefinerede modifikatorer

Brugerdefinerede modifikatorer skal registreres:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Ændringer i sikkerhedspolitik

### Smarty 4 Sikkerhed

Smarty 4 har strengere standardsikkerhed:

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

### Tilladte funktioner

Som standard begrænser Smarty 4, hvilke PHP-funktioner, der kan bruges:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Konfigurer tilladte funktioner om nødvendigt:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Opdateringer af skabelonarv

### Bloksyntaks

Bloksyntaks forbliver ens, men med nogle ændringer:

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

### Tilføj og forudsæt

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

## Forældede funktioner

### Fjernet i Smarty 4

| Funktion | Alternativ |
|--------|-------------|
| `{php}` tags | Flyt logik til PHP eller brug plugins |
| `{include_php}` | Brug registrerede plugins |
| `$smarty.capture` | Virker stadig, men forældet |
| `{strip}` med mellemrum | Brug minifikationsværktøjer |

### Brug alternativer

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

## Migrationstjekliste

### Før migrering

1. [ ] Sikkerhedskopier alle skabeloner
2. [ ] Liste al `{php}` tag brug
3. [ ] Dokument tilpassede plugins
4. [ ] Test den aktuelle funktionalitet

### Under migrering

1. [ ] Fjern alle `{php}` tags
2. [ ] Opdater syntaks for variabel adgang
3. [ ] Kontroller modifikatorbrug
4. [ ] Opdater caching-konfiguration
5. [ ] Gennemgå sikkerhedsindstillinger

### Efter migrering

1. [ ] Test alle skabeloner
2. [ ] Kontroller, at alle formularer virker
3. [ ] Bekræft caching fungerer
4. [ ] Test med forskellige brugerroller

## Tester for kompatibilitet

### Versionsregistrering

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Skabelonversionstjek

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Skrivning af krydskompatible skabeloner

### Bedste praksis

1. **Undgå helt `{php}`-tags** - De virker ikke i Smarty 3+

2. **Hold skabeloner enkle** - Kompleks logik hører hjemme i PHP

3. **Brug standardmodifikatorer** - Undgå forældede

4. **Test i begge versioner** - Hvis du skal understøtte begge

5. **Brug plugins til komplekse operationer** - Mere vedligeholdelsesvenlig

### Eksempel: Krydskompatibel skabelon
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

## Almindelige migrationsproblemer

### Problem: Variabler returnerer tomme

**Problem**: `<{$mod_url}>` returnerer intet i Smarty 4

**Løsning**: Brug `<{$mod_url->value}>` eller aktiver kompatibilitetstilstand

### Problem: PHP Tag fejl

**Problem**: Skabelonen kaster fejl på `{php}` tags

**Løsning**: Fjern alle PHP tags og flyt logik til PHP filer

### Problem: Modifikator blev ikke fundet

**Problem**: Brugerdefineret modifikator giver en "ukendt modifikator"-fejl

**Løsning**: Registrer modifikatoren med `registerPlugin()`

### Problem: Sikkerhedsbegrænsning

**Problem**: Funktion ikke tilladt i skabelonen

**Løsning**: Tilføj funktion til sikkerhedspolitikkens tilladte liste

---

#smarty #migrering #opgradering #xoops #smarty4 #kompatibilitet
