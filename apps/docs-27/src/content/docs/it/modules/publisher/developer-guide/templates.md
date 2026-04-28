---
title: "Template e Blocchi"
---

## Panoramica

Publisher fornisce template personalizzabili per visualizzare articoli e blocchi per l'integrazione nella barra laterale/widget. Questa guida copre la personalizzazione dei template e la configurazione dei blocchi.

## File Template

### Template Principali

| Template | Scopo |
|----------|---------|
| `publisher_index.tpl` | Homepage modulo |
| `publisher_item.tpl` | Vista articolo singolo |
| `publisher_category.tpl` | Elenco categoria |
| `publisher_archive.tpl` | Pagina archivi |
| `publisher_search.tpl` | Risultati ricerca |
| `publisher_submit.tpl` | Modulo invio articolo |
| `publisher_print.tpl` | Vista compatibile stampa |

### Template Blocchi

| Template | Scopo |
|----------|---------|
| `publisher_block_latest.tpl` | Blocco ultimi articoli |
| `publisher_block_spotlight.tpl` | Blocco articolo in evidenza |
| `publisher_block_category.tpl` | Blocco elenco categoria |
| `publisher_block_author.tpl` | Blocco articoli autore |

## Variabili Template

### Variabili Articolo

```smarty
{* Disponibili in publisher_item.tpl *}
<{$item.title}>           {* Titolo articolo *}
<{$item.body}>            {* Contenuto completo *}
<{$item.summary}>         {* Riepilogo/estratto *}
<{$item.author}>          {* Nome autore *}
<{$item.authorid}>        {* ID utente autore *}
<{$item.datesub}>         {* Data pubblicazione *}
<{$item.datemodified}>    {* Data ultima modifica *}
<{$item.counter}>         {* Conteggio visualizzazioni *}
<{$item.rating}>          {* Valutazione media *}
<{$item.votes}>           {* Numero di voti *}
<{$item.categoryname}>    {* Nome categoria *}
<{$item.categorylink}>    {* URL categoria *}
<{$item.itemurl}>         {* URL articolo *}
<{$item.image}>           {* Immagine in evidenza *}
```

### Variabili Categoria

```smarty
{* Disponibili in publisher_category.tpl *}
<{$category.name}>        {* Nome categoria *}
<{$category.description}> {* Descrizione categoria *}
<{$category.image}>       {* Immagine categoria *}
<{$category.total}>       {* Conteggio articoli *}
<{$category.link}>        {* URL categoria *}
```

## Personalizzazione Template

### Posizione Override

Copia template al tuo tema per personalizzare:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Esempio: Template Articolo Personalizzato

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">Di <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Modifica Articolo
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Stampa</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## Blocchi

### Blocchi Disponibili

| Blocco | Descrizione |
|-------|-------------|
| Ultime Notizie | Mostra articoli recenti |
| Spotlight | Evidenzia articolo in evidenza |
| Menu Categoria | Navigazione categoria |
| Archivi | Link archivi |
| Autori Principali | Scrittori più attivi |
| Elementi Popolari | Articoli più visualizzati |

### Opzioni Blocco

#### Blocco Ultime Notizie

| Opzione | Descrizione |
|--------|-------------|
| Elementi da visualizzare | Numero di articoli |
| Filtro categoria | Limita a categorie specifiche |
| Mostra riepilogo | Visualizza estratto articolo |
| Lunghezza titolo | Tronca titoli |
| Template | File template blocco |

### Template Blocco Personalizzato

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> visualizzazioni</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Trucchi Template

### Visualizzazione Condizionale

```smarty
{* Mostra contenuto diverso per utenti diversi *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Modifica Admin</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Modifica Tuo Articolo</a>
<{/if}>
```

### Classe CSS Personalizzata

```smarty
{* Aggiungi stile basato su stato *}
<article class="article <{$item.status}>">
    {* Contenuto *}
</article>
```

### Formattazione Data

```smarty
{* Formatta date con Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Documentazione Correlata

- ../User-Guide/Basic-Configuration - Impostazioni modulo
- ../User-Guide/Creating-Articles - Gestione contenuti
- ../../04-API-Reference/Template/Template-System - Motore template XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Personalizzazione tema
