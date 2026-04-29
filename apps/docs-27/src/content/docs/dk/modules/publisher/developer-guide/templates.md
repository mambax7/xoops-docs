---
title: "Skabeloner og blokke"
---

## Oversigt

Publisher leverer tilpasselige skabeloner til visning af artikler og blokke til sidebar/widget-integration. Denne vejledning dækker skabelontilpasning og blokkonfiguration.

## Skabelonfiler

### Kerneskabeloner

| Skabelon | Formål |
|--------|--------|
| `publisher_index.tpl` | Modulets hjemmeside |
| `publisher_item.tpl` | Visning af enkelt artikel |
| `publisher_category.tpl` | Kategoriliste |
| `publisher_archive.tpl` | Arkivside |
| `publisher_search.tpl` | Søgeresultater |
| `publisher_submit.tpl` | Formular til indsendelse af artikel |
| `publisher_print.tpl` | Printvenlig visning |

### Blok skabeloner

| Skabelon | Formål |
|--------|--------|
| `publisher_block_latest.tpl` | Seneste artikler blokerer |
| `publisher_block_spotlight.tpl` | Udvalgte artikelblok |
| `publisher_block_category.tpl` | Kategorilisteblok |
| `publisher_block_author.tpl` | Forfatter artikler blok |

## Skabelonvariabler

### Artikelvariabler

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

### Kategorivariabler

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Tilpasning af skabeloner

### Tilsidesæt placering

Kopier skabeloner til dit tema for at tilpasse:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Eksempel: Brugerdefineret artikelskabelon

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

## Blokke

### Tilgængelige blokke

| Bloker | Beskrivelse |
|-------|-------------|
| Seneste nyt | Viser seneste artikler |
| Spotlight | Fremhæv af fremhævet artikel |
| Kategori Menu | Kategorinavigation |
| Arkiver | Arkiv links |
| Topforfattere | Mest aktive forfattere |
| Populære varer | Mest sete artikler |

### Blokeringsmuligheder

#### Seneste nyhedsblok

| Mulighed | Beskrivelse |
|--------|-------------|
| Elementer, der skal vises | Antal artikler |
| Kategori filter | Begræns til specifikke kategorier |
| Vis oversigt | Vis artikeluddrag |
| Titellængde | Afkorte titler |
| Skabelon | Bloker skabelonfil |

### Brugerdefineret blokskabelon

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

## Skabelontricks

### Betinget visning

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Brugerdefineret CSS klasse

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Datoformatering

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Relateret dokumentation

- ../User-Guide/Basic-Configuration - Modulindstillinger
- ../User-Guide/Creating-Articles - Indholdsstyring
- ../../04-API-Reference/Template/Template-System - XOOPS skabelonmotor
- ../../02-Core-Concepts/Themes/Theme-Development - Tematilpasning
