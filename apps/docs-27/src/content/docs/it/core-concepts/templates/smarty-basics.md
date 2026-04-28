---
title: "Fondamenti di Smarty"
description: "Fondamenti della creazione di template Smarty in XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Versione di Smarty per Rilascio XOOPS]
| Versione di XOOPS | Versione di Smarty | Differenze Chiave |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Blocchi `{php}` consentiti (ma sconsigliati) |
| 2.7.0+ | Smarty 3.x/4.x | Preparazione per la compatibilità con Smarty 4 |
| 4.0 | Smarty 4.x | Blocchi `{php}` rimossi, sintassi più rigorosa |

Vedi Smarty-4-Migration per le linee guida sulla migrazione.
:::

Smarty è un motore di template per PHP che consente agli sviluppatori di separare la presentazione (HTML/CSS) dalla logica dell'applicazione. XOOPS usa Smarty per tutti i suoi esigenze di creazione di template, abilitando una separazione pulita tra il codice PHP e l'output HTML.

## Documentazione Correlata

- Theme-Development - Creazione di temi XOOPS
- Template-Variables - Variabili disponibili nei template
- Smarty-4-Migration - Aggiornamento da Smarty 3 a 4

## Cos'è Smarty?

Smarty fornisce:

- **Separazione delle Preoccupazioni**: Mantieni HTML nei template, logica PHP nelle classi
- **Eredità del Template**: Crea layout complessi da blocchi semplici
- **Caching**: Migliora le prestazioni con template compilati
- **Modificatori**: Trasforma l'output con funzioni integrate o personalizzate
- **Sicurezza**: Controlla quali funzioni PHP possono accedere ai template

## Configurazione di Smarty in XOOPS

XOOPS configura Smarty con delimitatori personalizzati:

```
Smarty Predefinito: { e }
XOOPS Smarty:   <{ e }>
```

Ciò previene conflitti con il codice JavaScript nei template.

## Sintassi Basica

### Variabili

Le variabili vengono passate da PHP ai template:

```php
// In PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* Nel template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### Accesso all'Array

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

### Proprietà dell'Oggetto

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Commenti

I commenti in Smarty non vengono renderizzati in HTML:

```smarty
{* Questo è un commento - non apparirà nell'output HTML *}

{*
   I commenti su più righe
   sono anche supportati
*}
```

## Strutture di Controllo

### Istruzioni If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Operatori di Confronto

```smarty
{* Uguaglianza *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Disuguaglianza *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Maggiore/Minore di *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Maggiore/Minore o uguale *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Operatori logici *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### Verifica di Vuoto/Isset

```smarty
{* Verifica che la variabile esista e abbia valore *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Verifica che l'array non sia vuoto *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Utilizzo di isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Cicli Foreach

```smarty
{* Foreach basico *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* Con chiave *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* Con @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Colori riga alternati *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse per array vuoti *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### Cicli For

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Cicli While

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Modificatori di Variabile

I modificatori trasformano l'output della variabile:

### Modificatori di Stringa

```smarty
{* Escape HTML (usa sempre per l'input dell'utente!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* Codifica URL *}
<{$url|escape:'url'}>

{* Maiuscolo/Minuscolo *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Tronca testo *}
<{$content|truncate:100:'...'}>

{* Rimuovi tag HTML *}
<{$html|strip_tags}>

{* Sostituisci *}
<{$text|replace:'old':'new'}>

{* A capo parola *}
<{$text|wordwrap:80:"\n"}>

{* Valore predefinito *}
<{$optional_var|default:'No value'}>
```

### Modificatori Numerici

```smarty
{* Formattazione numero *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Formattazione data *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Modificatori di Array

```smarty
{* Conta elementi *}
<{$items|@count}> items

{* Unisci array *}
<{$tags|@implode:', '}>

{* Codifica JSON *}
<{$data|@json_encode}>
```

### Concatenamento di Modificatori

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Include e Insert

### Inclusi di Altri Template

```smarty
{* Includi un file di template *}
<{include file="db:mymodule_header.tpl"}>

{* Includi con variabili *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Includi con variabili assegnate *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Inserimento di Contenuto Dinamico

```smarty
{* Insert chiama una funzione PHP per il contenuto dinamico *}
<{insert name="getBanner"}>
```

## Assegna Variabili nei Template

```smarty
{* Assegnazione semplice *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assegnazione da espressione *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Contenuto del blocco di cattura *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## Variabili Smarty Integrate

### Variabile $smarty

```smarty
{* Timestamp corrente *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Variabili di richiesta *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Costanti *}
<{$smarty.const.XOOPS_URL}>

{* Variabili di configurazione *}
<{$smarty.config.var_name}>

{* Informazioni del template *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Versione di Smarty *}
<{$smarty.version}>

{* Proprietà Sezione/Foreach *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## Blocchi Letterali

Per JavaScript con parentesi graffe:

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

Oppure usa variabili Smarty all'interno di JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Funzioni Personalizzate

XOOPS fornisce funzioni Smarty personalizzate:

```smarty
{* URL dell'Immagine XOOPS *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* URL del Modulo XOOPS *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* URL dell'App *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Best Practice

### Sempre Sfuggi l'Output

```smarty
{* Per il contenuto generato dall'utente, sempre sfuggi *}
<p><{$user_comment|escape}></p>

{* Per il contenuto HTML, usa il metodo appropriato *}
<div><{$content}></div> {* Solo se il contenuto è pre-sanitizzato *}
```

### Usa Nomi Variabili Significativi

```php
// Buono
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Evita
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Mantieni la Logica Minima

I template dovrebbero concentrarsi sulla presentazione. Sposta la logica complessa a PHP:

```smarty
{* Evita la logica complessa nei template *}
{* Cattivo *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Buono - calcola in PHP e passa una semplice bandiera *}
<{if $can_edit}>
```

### Usa l'Eredità del Template

Per layout coerenti, usa l'eredità del template (vedi Theme-Development).

## Debug dei Template

### Console di Debug

```smarty
{* Mostra tutte le variabili assegnate *}
<{debug}>
```

### Output Temporaneo

```smarty
{* Debug variabile specifica *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Pattern Comuni di Template XOOPS

### Struttura del Template del Modulo

```smarty
{* Intestazione del modulo *}
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

    {* Contenuto *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### Paginazione

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Visualizzazione del Modulo

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #templates #xoops #frontend #template-engine
