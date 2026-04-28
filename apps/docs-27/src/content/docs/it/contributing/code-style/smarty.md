---
title: "Convenzioni Template Smarty"
description: "Standard di codifica template Smarty di XOOPS e best practice"
---

> XOOPS utilizza Smarty per template. Questa guida copre convenzioni e best practice per sviluppare template Smarty.

---

## Panoramica

I template Smarty di XOOPS seguono:

- **Struttura template XOOPS** e naming
- **Standard accessibilità** (WCAG)
- **Markup HTML5 semantico**
- **Naming classi stile BEM**
- **Ottimizzazione performance**

---

## Struttura File

### Organizzazione Template

```
templates/
├── admin/                   # Template admin
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # Template blocchi
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # Template condivisi
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # Template email
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # Template pagine
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # Archiviati in DB per override tema
└── db:modulename_footer.tpl
```

### File Naming

```smarty
{* I file template XOOPS usano prefisso modulo *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* Template admin *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## File Header

### Commento Header Template

```smarty
{*
 * XOOPS Module - Module Name
 * @file Template lista articoli
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 * Descrizione di cosa questo template visualizza
 *}

<h1><{$page_title}></h1>
```

---

## Variabili e Naming

### Convenzione Naming Variabili

```smarty
{* Usa nomi descrittivi *}
<{$page_title}>              {* ✅ Chiaro *}
<{$items}>                   {* ✅ Chiaro *}
<{$user_count}>              {* ✅ Chiaro *}

<{$p_t}>                     {* ❌ Abbreviazione poco chiara *}
<{$x}>                       {* ❌ Poco chiaro *}
```

### Scope Variabili

```smarty
{* Variabili XOOPS globali *}
<{$xoops_url}>              {* URL radice *}
<{$xoops_sitename}>         {* Nome sito *}
<{$xoops_requesturi}>       {* URI attuale *}
<{$xoops_isadmin}>          {* Flag modalità admin *}
<{$xoops_user_is_admin}>    {* È utente admin *}

{* Variabili modulo comuni *}
<{$module_id}>              {* ID modulo attuale *}
<{$module_name}>            {* Nome modulo attuale *}
<{$moduledir}>              {* Directory modulo *}
<{$lang}>                   {* Lingua attuale *}
```

---

## Formattazione e Spacing

### Struttura Base

```smarty
{*
 * Header template
 *}

{* Includi altri template *}
<{include file="db:modulename_header.tpl"}>

{* Contenuto principale *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* Renderizza articoli *}
  <{else}>
    {* Mostra stato vuoto *}
  <{/if}>
</main>

{* Footer *}
<{include file="db:modulename_footer.tpl"}>
```

### Indentazione

```smarty
{* Usa 2 spazi per indentazione *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* Non saltare linee dentro blocchi *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### Spacing Attorno Tag

```smarty
{* Nessuno spazio dentro delimitatori tag *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* Spazio dopo pipe in modifier *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* Spazio attorno operatori nei condizionali *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## Strutture di Controllo

### Condizionali

```smarty
{* Semplice if/else *}
<{if $is_published}>
  <span class="status--published">Pubblicato</span>
<{else}>
  <span class="status--draft">Bozza</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">Attivo</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">In sospeso</div>
<{else}>
  <div class="alert--danger">Inattivo</div>
<{/if}>

{* Inline ternario (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### Loop

```smarty
{* Foreach base *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* Con chiave e contatore *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* Con alternazione *}
<{foreach item=item from=$items}>
  <div class="item <{if $smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* Controlla se vuoto *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">Nessun articolo trovato</p>
<{/if}>
```

### Section (deprecato, usa foreach invece)

```smarty
{* Non usare section - è deprecato *}
{* ❌ <{section name=i loop=$items}> *}

{* Usa foreach invece *}
{* ✅ *}
<{foreach item=item from=$items}>
```

---

## Output Variabili

### Output Base

```smarty
{* Visualizza variabile così com'è *}
<{$title}>

{* Visualizza con default se vuoto *}
<{$title|default:'Senza titolo'}>

{* HTML escape (default per sicurezza) *}
<{$content}>                  {* Escaped di default *}
<{$content|escape:'html'}>    {* Explicitly escaped *}

{* Output raw (usa con cautela!) *}
<{$html_content|escape:false}>

{* Encoding speciale *}
<{$url|escape:'url'}>         {* Per contesto URL *}
<{$json|escape:'javascript'}> {* Per JavaScript *}
```

### Modifier

```smarty
{* Formattazione testo *}
<{$text|upper}>              {* Converti a maiuscolo *}
<{$text|lower}>              {* Converti a minuscolo *}
<{$text|capitalize}>         {* Capitalize prima lettera *}
<{$text|truncate:50:'...'}>  {* Tronca a 50 char *}

{* Formattazione numero *}
<{$price|number_format:2}>   {* Formatta numero *}
<{$count|string_format:"%03d"}> {* Formatta come stringa *}

{* Formattazione data *}
<{$date|date_format:'%Y-%m-%d'}> {* Formatta data *}
<{$date|date_format:'%B %d, %Y'}}>

{* Operazioni array *}
<{$items|@count}>            {* Conta articoli (nota @) *}
<{$items|@array_keys}>       {* Ottieni chiavi *}

{* Concatena modifier *}
<{$title|upper|truncate:30:'...'}> {* Concatena multipli *}

{* Modifier condizionale *}
<{$status|default:'pending'}>
```

---

## Costanti

### Usa Costanti XOOPS

```smarty
{* Usa costanti define()d da PHP *}
{* Queste devono essere definite in PHP prima *}

{* Costanti principali *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* Costanti modulo *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* Costanti personalizzate *}
<{$smarty.const._MY_CONSTANT}>
```

### Costanti Linguaggio

```smarty
{* Usa costanti linguaggio per i18n *}
{* Definisci in file linguaggio: define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## Best Practice HTML

### Markup Semantico

```smarty
{* Usa elementi HTML semantici *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">Di <{$item.author}></span>
  </footer>
</article>
```

### Accessibilità

```smarty
{* Usa HTML semantico per accessibilità *}

{* Link con testo significativo *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ Testo link significativo *}
</a>

{* Immagini con alt text *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* Form label con input *}
<label for="email-input" class="form-field__label">
  Indirizzo Email
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* Heading in ordine *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ In ordine *}
<h4></h4>                  {* ❌ Salta h3 *}

{* Usa attributi aria quando necessario *}
<nav aria-label="Navigazione principale">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  Menu
</button>
```

---

## Pattern Comuni

### Paginazione

```smarty
{* Visualizza paginazione *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="Paginazione">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">Prima</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">Ultima</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```

### Breadcrumb

```smarty
{* Visualizza navigazione breadcrumb *}
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">Home</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```

### Alert Messages

```smarty
{* Visualizza messaggi *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* Visualizza errori *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">Errore</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```

---

## Performance

### Ottimizzazione Template

```smarty
{* Assegna variabili una volta, riutilizza *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p>Trovati <{$item_count}> articoli</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* Usa {assign} per valori computati *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* Opzioni admin *}
<{/if}>
<{if $is_admin}>
  {* Riutilizza stesso valore computato *}
<{/if}>

{* Evita logica complessa in template *}
{* ❌ Calcolo complesso in template *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ Computa in PHP, visualizza in template *}
<p><{$total}></p> {* Passato dal controller PHP *}
```

---

## Best Practice

### Da Fare

- Usa HTML5 semantico
- Includi alt text per immagini
- Usa costanti linguaggio per testo
- Escapi output (default)
- Mantieni logica minima
- Usa nomi variabili significativi
- Includi header file
- Usa nomi classi stile BEM
- Testa con screen reader

### Da Non Fare

- Non mescolare logica e presentazione
- Non dimenticare alt text
- Non usare HTML raw senza escaping
- Non creare variabili globali nei template
- Non usare feature Smarty deprecate
- Non annidare template troppo profondamente
- Non ignorare accessibilità
- Non hardcodare testo (usa costanti)

---

## Esempi Template

### Template Modulo Completo

```smarty
{*
 * XOOPS Module - Publisher
 * @file Template lista articoli
 * @author XOOPS Team
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  Di <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## Documentazione Correlata

- Standard JavaScript
- Linee Guida CSS
- Codice di Condotta
- Standard PHP

---

#xoops #smarty #templates #conventions #best-practices
