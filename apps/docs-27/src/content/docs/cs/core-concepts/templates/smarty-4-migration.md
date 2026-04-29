---
title: "Smarty 4 Migrace"
description: "Průvodce upgradem šablon XOOPS ze Smarty 3 na Smarty 4"
---

Tato příručka popisuje změny a kroky migrace potřebné při upgradu ze Smarty 3 na Smarty 4 v XOOPS. Pochopení těchto rozdílů je nezbytné pro zachování kompatibility s moderními instalacemi XOOPS.

## Související dokumentace

- Smarty-Základy - Základy Smarty v XOOPS
- Vývoj motivů - Vytváření motivů XOOPS
- Template-Variables - Dostupné proměnné v šablonách

## Přehled změn

Smarty 4 představil několik zásadních změn oproti Smarty 3:

1. Změnilo se chování přiřazení proměnných
2. Štítky `{php}` zcela odstraněny
3. Ukládání změn do mezipaměti API
4. Modifikátor obsluhující aktualizace
5. Změny bezpečnostní politiky
6. Zastaralé funkce byly odstraněny

## Změny variabilního přístupu

### Problém

V Smarty 2/3 byly přiřazené hodnoty přímo přístupné:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

V Smarty 4 jsou proměnné zabaleny do objektů `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Řešení 1: Otevřete vlastnost Value

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Řešení 2: Režim kompatibility

Povolte režim kompatibility v PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

To umožňuje přímý variabilní přístup jako Smarty 3.

### Řešení 3: Podmíněná kontrola verze

Napište šablony, které fungují v obou verzích:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Řešení 4: Funkce Wrapper

Vytvořte pomocnou funkci pro úkoly:

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

## Odebírání značek {php}

### Problém

Smarty 3+ z bezpečnostních důvodů nepodporuje značky `{php}`:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Řešení: Použijte proměnné Smarty

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Řešení: Přesuňte logiku na PHP

Komplexní logika by měla být v PHP, nikoli v šablonách:

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

### Řešení: Vlastní pluginy

Pro opakovaně použitelné funkce vytvořte pluginy Smarty:

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

## Změny v mezipaměti

### Smarty 3 Ukládání do mezipaměti

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Ukládání do mezipaměti

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Ukládání konstant do mezipaměti

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache v šablonách

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Změny modifikátoru

### Modifikátory řetězců

Některé modifikátory byly přejmenovány nebo zastaralé:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Modifikátory pole

Modifikátory pole vyžadují předponu `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Vlastní modifikátory

Vlastní modifikátory musí být zaregistrovány:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Změny zásad zabezpečení

### Smarty 4 Zabezpečení

Smarty 4 má přísnější výchozí zabezpečení:

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

### Povolené funkce

Ve výchozím nastavení Smarty 4 omezuje, které funkce PHP lze použít:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

V případě potřeby nakonfigurujte povolené funkce:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Aktualizace dědičnosti šablon

### Bloková syntaxe

Syntaxe bloku zůstává podobná, ale s některými změnami:

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

### Přidat a přidat před

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

## Zastaralé funkce

### Odstraněno v Smarty 4

| Funkce | Alternativa |
|---------|-------------|
| Štítky `{php}` | Přesuňte logiku na PHP nebo použijte pluginy |
| `{include_php}` | Používejte registrované pluginy |
| `$smarty.capture` | Stále funguje, ale již není podporováno |
| `{strip}` s mezerami | Použijte nástroje minifikace |

### Používejte alternativy

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

## Kontrolní seznam migrace

### Před migrací

1. [ ] Zálohujte všechny šablony
2. [ ] Seznam všech použití tagů `{php}`
3. [ ] Dokumentujte vlastní pluginy
4. [ ] Otestujte aktuální funkčnost

### Během migrace

1. [ ] Odstraňte všechny značky `{php}`
2. [ ] Aktualizujte syntaxi přístupu proměnných
3. [ ] Zkontrolujte použití modifikátoru
4. [ ] Aktualizujte konfiguraci mezipaměti
5. [ ] Zkontrolujte nastavení zabezpečení

### Po migraci

1. [ ] Otestujte všechny šablony
2. [ ] Zkontrolujte funkčnost všech formulářů
3. [ ] Ověřte, že ukládání do mezipaměti funguje
4. [ ] Testujte s různými uživatelskými rolemi

## Testování kompatibility

### Detekce verze

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Kontrola verze šablony

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Psaní vzájemně kompatibilních šablon

### Nejlepší postupy

1. **Zcela se vyhněte tagům `{php}`** – Nefungují v Smarty 3+

2. **Udržujte šablony jednoduché** - Komplexní logika patří do PHP

3. **Používejte standardní modifikátory** – Vyhněte se zastaralým modifikátorům

4. **Test v obou verzích** - Pokud potřebujete podporovat obě verze

5. **Používejte zásuvné moduly pro složité operace** – Snadnější údržba

### Příklad: Křížově kompatibilní šablona

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

## Společné problémy s migrací

### Problém: Proměnné se vrací prázdné

**Problém**: `<{$mod_url}>` nevrací nic v Smarty 4**Řešení**: Použijte `<{$mod_url->value}>` nebo povolte režim kompatibility

### Problém: Chyby značek PHP

**Problém**: Šablona vyvolá chybu u značek `{php}`

**Řešení**: Odstraňte všechny značky PHP a přesuňte logiku do souborů PHP

### Problém: Modifikátor nenalezen

**Problém**: Vlastní modifikátor vyvolá chybu „neznámý modifikátor“.

**Řešení**: Zaregistrujte modifikátor u `registerPlugin()`

### Problém: Bezpečnostní omezení

**Problém**: Funkce není v šabloně povolena

**Řešení**: Přidejte funkci do seznamu povolených bezpečnostních zásad

---

#smarty #migrace #upgrade #xoops #smarty4 #kompatibilita