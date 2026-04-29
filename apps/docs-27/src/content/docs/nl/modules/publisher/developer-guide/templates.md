---
title: "Sjablonen en blokken"
---
## Overzicht

Publisher biedt aanpasbare sjablonen voor het weergeven van artikelen en blokken voor zijbalk-/widget-integratie. Deze handleiding behandelt het aanpassen van sjablonen en blokconfiguratie.

## Sjabloonbestanden

### Kernsjablonen

| Sjabloon | Doel |
|----------|---------|
| `publisher_index.tpl` | Module-startpagina |
| `publisher_item.tpl` | Weergave van één artikel |
| `publisher_category.tpl` | Categorieoverzicht |
| `publisher_archive.tpl` | Archiefpagina |
| `publisher_search.tpl` | Zoekresultaten |
| `publisher_submit.tpl` | Formulier voor het indienen van artikelen |
| `publisher_print.tpl` | Printvriendelijke weergave |

### Bloksjablonen

| Sjabloon | Doel |
|----------|---------|
| `publisher_block_latest.tpl` | Laatste artikelen blok |
| `publisher_block_spotlight.tpl` | Uitgelicht artikelblok |
| `publisher_block_category.tpl` | Categorielijstblok |
| `publisher_block_author.tpl` | Auteur artikelen blokkeren |

## Sjabloonvariabelen

### Artikelvariabelen

```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```

### Categorievariabelen

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Sjablonen aanpassen

### Locatie negeren

Kopieer sjablonen naar uw thema om aan te passen:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Voorbeeld: Aangepaste artikelsjabloon

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
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
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## Blokken

### Beschikbare blokken

| Blok | Beschrijving |
|-------|------------|
| Laatste nieuws | Toont recente artikelen |
| In de spotlight | Uitgelicht artikel hoogtepunt |
| Categoriemenu | Categorienavigatie |
| Archief | Archieflinks |
| Topauteurs | Meest actieve schrijvers |
| Populaire artikelen | Meest bekeken artikelen |

### Blokkeeropties

#### Laatste nieuwsblok

| Optie | Beschrijving |
|--------|-------------|
| Weer te geven items | Aantal artikelen |
| Categoriefilter | Beperken tot specifieke categorieën |
| Samenvatting tonen | Artikelfragment weergeven |
| Titellengte | Titels afkappen |
| Sjabloon | Bloksjabloonbestand |

### Aangepaste bloksjabloon

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
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Sjabloontrucs

### Voorwaardelijke weergave

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Aangepaste CSS-klasse

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Datumopmaak

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Gerelateerde documentatie

- ../Gebruikershandleiding/Basisconfiguratie - Module-instellingen
- ../Gebruikershandleiding/Artikelen maken - Contentbeheer
- ../../04-API-Referentie/Sjabloon/Sjabloonsysteem - XOOPS-sjabloonengine
- ../../02-Core-Concepts/Themes/Theme-Development - Thema-aanpassing