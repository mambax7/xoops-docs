---
title: "Smarty 4 migráció"
description: "Útmutató az XOOPS-sablonok Smarty 3-ról Smarty 4-re frissítéséhez"
---
Ez az útmutató a XOOPS-ban lévő Smarty 3-ról Smarty 4-re történő frissítéskor szükséges változtatásokat és áttelepítési lépéseket ismerteti. E különbségek megértése elengedhetetlen a modern XOOPS telepítésekkel való kompatibilitás fenntartásához.

## Kapcsolódó dokumentáció

- Smarty-Basics - A Smarty alapjai XOOPS-ban
- Témafejlesztés - XOOPS témák létrehozása
- Sablon-változók - A sablonokban elérhető változók

## A változások áttekintése

A Smarty 4 számos áttörést jelentő változást vezetett be a Smarty 3-hoz képest:

1. A változó hozzárendelési viselkedése megváltozott
2. A `{php}` címkék teljesen eltávolítva
3. API változások gyorsítótárazása
4. Módosító kezelés frissítések
5. Biztonságpolitikai változások
6. Az elavult funkciók eltávolítva

## Változó hozzáférési változások

### A probléma

A Smarty 2/3-ban a hozzárendelt értékek közvetlenül elérhetők voltak:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

A Smarty 4-ben a változók `Smarty_Variable` objektumokba vannak csomagolva:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### 1. megoldás: Nyissa meg az Érték tulajdonságot

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### 2. megoldás: Kompatibilitási mód

Kompatibilitási mód engedélyezése a PHP-ban:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Ez lehetővé teszi a közvetlen változó hozzáférést, mint például a Smarty 3.

### 3. megoldás: Feltételes verzióellenőrzés

Írjon olyan sablonokat, amelyek mindkét verzióban működnek:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### 4. megoldás: Burkoló funkció

Hozzon létre egy segítő funkciót a feladatokhoz:

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

## {php} címkék eltávolítása

### A probléma

A Smarty 3+ biztonsági okokból nem támogatja a `{php}` címkéket:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Megoldás: Smarty változók használata

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Megoldás: Helyezze át a logikát a PHP helyre

A komplex logikának a PHP-ban kell lennie, nem sablonoknak:

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

### Megoldás: Egyéni beépülő modulok

Az újrafelhasználható funkciókhoz hozzon létre Smarty bővítményeket:

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

## Változások gyorsítótárazása

### Smarty 3 gyorsítótár

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 gyorsítótár

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Gyorsítótárazási állandók

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache a sablonokban

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Módosító módosítások

### String módosítók

Néhány módosítót átneveztek vagy elavult:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Tömbmódosítók

A tömbmódosítókhoz `@` előtag szükséges:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Egyéni módosítók

Az egyéni módosítókat regisztrálni kell:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Biztonsági szabályzat változásai

### Smarty 4 Security

A Smarty 4 szigorúbb alapértelmezett biztonsággal rendelkezik:

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

### Engedélyezett funkciók

Alapértelmezés szerint a Smarty 4 korlátozza, hogy mely PHP funkciók használhatók:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Szükség esetén konfigurálja az engedélyezett funkciókat:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Sablon öröklődési frissítések

### Blokk szintaxis

A blokk szintaxisa hasonló marad, de néhány változtatással:

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

### Hozzáfűzés és befűzés

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

## Elavult szolgáltatások

### Eltávolítva a Smarty 4-ben

| Funkció | Alternatív |
|---------|--------------|
| `{php}` címkék | Helyezze át a logikát a PHP-ba, vagy használjon | beépülő modulokat
| `{include_php}` | Regisztrált bővítmények használata |
| `$smarty.capture` | Még mindig működik, de elavult |
| `{strip}` szóközökkel | Minimalizálási eszközök használata |

### Használjon alternatívákat

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

## Migrációs ellenőrzőlista

### Migráció előtt

1. [ ] Az összes sablon biztonsági mentése
2. [ ] Az összes `{php}` címkehasználat listája
3. [ ] Dokumentálja az egyéni bővítményeket
4. [ ] Az aktuális működőképesség ellenőrzése

### Migráció közben

1. [ ] Távolítsa el az összes `{php}` címkét
2. [ ] Változó hozzáférési szintaxis frissítése
3. [ ] Ellenőrizze a módosító használatát
4. [ ] A gyorsítótárazási konfiguráció frissítése
5. [ ] Tekintse át a biztonsági beállításokat

### Migráció után

1. [ ] Tesztelje az összes sablont
2. [ ] Ellenőrizze, hogy minden űrlap működik
3. [ ] Ellenőrizze a gyorsítótárazás működését
4. [ ] Teszt különböző felhasználói szerepkörökkel

## Kompatibilitás tesztelése

### Verzióérzékelés

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Sablonverzió ellenőrzése

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Keresztkompatibilis sablonok írása

### Bevált gyakorlatok

1. **A `{php}` címkéket teljes mértékben kerülje** – Smarty 3+ esetén nem működnek

2. **A sablonok legyenek egyszerűek** – A komplex logika a PHP-ba tartozik

3. **Használjon szabványos módosítókat** – Kerülje az elavult módosítókat

4. **Tesztelje mindkét verziót** – Ha mindkettőt támogatnia kell

5. **Használjon bővítményeket az összetett műveletekhez** - Karbantarthatóbb

### Példa: keresztkompatibilis sablon
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

## Gyakori migrációs problémák

### Probléma: A változók üresen térnek vissza

**Probléma**: `<{$mod_url}>` semmit nem ad vissza a Smarty 4-ben

**Megoldás**: Használja a `<{$mod_url->value}>`-t, vagy engedélyezze a kompatibilitási módot

### Probléma: PHP Címkehibák

**Probléma**: A sablon hibát jelez a `{php}` címkéken

**Megoldás**: Távolítsa el az összes PHP címkét, és helyezze át a logikát a PHP fájlba

### Probléma: A módosító nem található

**Probléma**: Az egyéni módosító "ismeretlen módosító" hibát dob

**Megoldás**: Regisztrálja a módosítót a `registerPlugin()`-val

### Probléma: Biztonsági korlátozás

**Probléma**: A funkció nem engedélyezett a sablonban

**Megoldás**: Funkció hozzáadása a biztonsági szabályzat engedélyezett listájához

---

#okos #migráció #frissítés #xoops #smarty4 #kompatibilitás
