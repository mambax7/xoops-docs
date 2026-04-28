---
title: "Migrazione Smarty 4"
description: "Guida all'aggiornamento dei template XOOPS da Smarty 3 a Smarty 4"
---

Questa guida copre i cambiamenti e i passaggi di migrazione necessari durante l'aggiornamento da Smarty 3 a Smarty 4 in XOOPS. Comprendere queste differenze è essenziale per mantenere la compatibilità con le installazioni moderne di XOOPS.

## Documentazione Correlata

- Smarty-Basics - Fondamenti di Smarty in XOOPS
- Theme-Development - Creazione di temi XOOPS
- Template-Variables - Variabili disponibili nei template

## Panoramica dei Cambiamenti

Smarty 4 ha introdotto diversi cambiamenti di rilievo da Smarty 3:

1. Comportamento dell'assegnazione di variabili modificato
2. Blocchi `{php}` completamente rimossi
3. Cambiamenti dell'API di caching
4. Aggiornamenti della gestione dei modificatori
5. Modifiche della politica di sicurezza
6. Funzionalità deprecate rimosse

## Cambiamenti nell'Accesso alle Variabili

### Il Problema

In Smarty 2/3, i valori assegnati erano direttamente accessibili:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - funzionava bene *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

In Smarty 4, le variabili sono avvolte in oggetti `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Soluzione 1: Accedi alla Proprietà Value

```smarty
{* Smarty 4 - accedi alla proprietà value *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Soluzione 2: Modalità di Compatibilità

Abilita la modalità di compatibilità in PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Ciò consente l'accesso diretto alle variabili come Smarty 3.

### Soluzione 3: Controllo Versione Condizionale

Scrivi template che funzionino in entrambe le versioni:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Soluzione 4: Funzione Wrapper

Crea una funzione helper per le assegnazioni:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assegna normalmente, accedi tramite ->value nei template
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - assegnazione standard
        $smarty->assign($name, $value);
    }
}
```

## Rimozione di Blocchi {php}

### Il Problema

Smarty 3+ non supporta i blocchi `{php}` per motivi di sicurezza:

```smarty
{* Questo NON funziona più in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Soluzione: Usa Variabili Smarty

```smarty
{* Usa l'accesso alle variabili integrate di Smarty *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Soluzione: Sposta la Logica in PHP

La logica complessa dovrebbe essere in PHP, non nei template:

```php
// In PHP - fai l'elaborazione
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assegna i dati elaborati al template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* Nel template - solo visualizza *}
<h2><{$category.name}></h2>
```

### Soluzione: Plugin Personalizzati

Per funzionalità riutilizzabili, crea plugin Smarty:

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
{* Nel template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Cambiamenti di Caching

### Caching di Smarty 3

```php
// Stile Smarty 3
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per variabile nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Caching di Smarty 4

```php
// Stile Smarty 4
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// O usando proprietà (ancora funziona)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Costanti di Caching

```php
// Modalità di caching
Smarty::CACHING_OFF                  // Nessun caching
Smarty::CACHING_LIFETIME_CURRENT     // Usa cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Usa cache salvato
```

### Nocache nei Template

```smarty
{* Contrassegna il contenuto come mai in cache *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Cambiamenti di Modificatori

### Modificatori di Stringa

Alcuni modificatori sono stati rinominati o deprecati:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - usa 'html' invece *}
<{$text|escape:'html'}>
```

### Modificatori di Array

I modificatori di array richiedono il prefisso `@`:

```smarty
{* Conta elementi dell'array *}
<{$items|@count}> items

{* Unisci array *}
<{$tags|@implode:', '}>

{* Codifica JSON *}
<{$data|@json_encode}>
```

### Modificatori Personalizzati

I modificatori personalizzati devono essere registrati:

```php
// Registra un modificatore personalizzato
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Elabora e restituisci
    return processed_string($string, $param1);
}
```

## Cambiamenti della Politica di Sicurezza

### Sicurezza di Smarty 4

Smarty 4 ha una sicurezza predefinita più rigorosa:

```php
// Configura la politica di sicurezza
$smarty->enableSecurity('Smarty_Security');

// O crea una politica personalizzata
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Funzioni Consentite

Per impostazione predefinita, Smarty 4 limita quali funzioni PHP possono essere utilizzate:

```smarty
{* Questi potrebbero essere limitati *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Configura le funzioni consentite se necessario:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Aggiornamenti dell'Eredità del Template

### Sintassi dei Blocchi

La sintassi dei blocchi rimane simile ma con alcuni cambiamenti:

```smarty
{* Template genitore *}
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
{* Template figlio *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Includi il contenuto del blocco genitore *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Append e Prepend

```smarty
{block name=head append}
    {* Questo è aggiunto dopo il contenuto genitore *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* Questo è aggiunto prima del contenuto genitore *}
    <script src="early.js"></script>
{/block}
```

## Funzionalità Deprecate

### Rimosso in Smarty 4

| Funzionalità | Alternativa |
|---------|-------------|
| Blocchi `{php}` | Sposta logica a PHP o usa plugin |
| `{include_php}` | Usa plugin registrati |
| `$smarty.capture` | Ancora funziona ma deprecato |
| `{strip}` con spazi | Usa strumenti di minificazione |

### Usa Alternative

```smarty
{* Invece di {php} *}
{* Sposta a PHP e assegna il risultato *}

{* Invece di include_php *}
<{include file="db:mytemplate.tpl"}>

{* Invece di capture (ancora funziona ma considera) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Checklist di Migrazione

### Prima della Migrazione

1. [ ] Fai il backup di tutti i template
2. [ ] Elenca tutti gli usi del blocco `{php}`
3. [ ] Documenta i plugin personalizzati
4. [ ] Testa la funzionalità corrente

### Durante la Migrazione

1. [ ] Rimuovi tutti i blocchi `{php}`
2. [ ] Aggiorna la sintassi di accesso alle variabili
3. [ ] Verifica l'utilizzo dei modificatori
4. [ ] Aggiorna la configurazione di caching
5. [ ] Rivedi le impostazioni di sicurezza

### Dopo la Migrazione

1. [ ] Testa tutti i template
2. [ ] Verifica che tutti i moduli funzionino
3. [ ] Verifica il funzionamento del caching
4. [ ] Testa con diversi ruoli utente

## Test per la Compatibilità

### Rilevazione Versione

```php
// Verifica la versione di Smarty in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Codice specifico di Smarty 4+
} else {
    // Codice di Smarty 3
}
```

### Verifica Versione nel Template

```smarty
{* Verifica la versione nel template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Codice template Smarty 4+ *}
<{else}>
    {* Codice template Smarty 3 *}
<{/if}>
```

## Scrittura di Template Cross-Compatibili

### Best Practice

1. **Evita i blocchi `{php}` interamente** - Non funzionano in Smarty 3+

2. **Mantieni i template semplici** - La logica complessa appartiene a PHP

3. **Usa modificatori standard** - Evita quelli deprecati

4. **Testa in entrambe le versioni** - Se hai bisogno di supportare entrambe

5. **Usa plugin per operazioni complesse** - Più mantenibile

### Esempio: Template Cross-Compatibile

```smarty
{* Funziona sia in Smarty 3 che in 4 *}
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

## Problemi Comuni di Migrazione

### Problema: Le Variabili Restituiscono Vuoto

**Problema**: `<{$mod_url}>` restituisce nulla in Smarty 4

**Soluzione**: Usa `<{$mod_url->value}>` o abilita la modalità di compatibilità

### Problema: Errori di Tag PHP

**Problema**: Il template genera un errore sui blocchi `{php}`

**Soluzione**: Rimuovi tutti i blocchi PHP e sposta la logica a file PHP

### Problema: Modificatore Non Trovato

**Problema**: Modificatore personalizzato genera errore "unknown modifier"

**Soluzione**: Registra il modificatore con `registerPlugin()`

### Problema: Restrizione di Sicurezza

**Problema**: Funzione non consentita nel template

**Soluzione**: Aggiungi la funzione all'elenco consentito della politica di sicurezza

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
