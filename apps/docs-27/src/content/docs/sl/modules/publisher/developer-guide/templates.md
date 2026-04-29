---
title: "Predloge in bloki"
---
## Pregled

Publisher ponuja prilagodljive predloge za prikaz člankov in blokov za integracijo sidebar/widget. Ta priročnik zajema prilagoditev predloge in konfiguracijo blokov.

## Datoteke predlog

### Osnovne predloge

| Predloga | Namen |
|----------|---------|
| `publisher_index.tpl` | Domača stran modula |
| `publisher_item.tpl` | Pogled posameznega članka |
| `publisher_category.tpl` | Seznam kategorij |
| `publisher_archive.tpl` | Arhivska stran |
| `publisher_search.tpl` | Rezultati iskanja |
| `publisher_submit.tpl` | Obrazec za oddajo članka |
| `publisher_print.tpl` | Tiskanju prijazen pogled |

### Blokiraj predloge

| Predloga | Namen |
|----------|---------|
| `publisher_block_latest.tpl` | Blok najnovejših člankov |
| `publisher_block_spotlight.tpl` | Blok predstavljenih člankov |
| `publisher_block_category.tpl` | Blok seznama kategorij |
| `publisher_block_author.tpl` | Blok avtorskih člankov |

## Spremenljivke predloge

### Spremenljivke člena
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
### Spremenljivke kategorije
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## Prilagajanje predlog

### Preglasi lokacijo

Kopirajte predloge v svojo temo, da jih prilagodite:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### Primer: Predloga članka po meri
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
## Bloki

### Razpoložljivi bloki

| Blok | Opis |
|-------|-------------|
| Zadnje novice | Prikazuje nedavne članke |
| Žarometi | Vrhunec predstavljenega članka |
| Meni kategorije | Navigacija po kategorijah |
| Arhivi | Arhivske povezave |
| Vrhunski avtorji | Najbolj aktivni pisci |
| Priljubljeni predmeti | Najbolj gledani članki |

### Možnosti blokiranja

#### Blok najnovejših novic

| Možnost | Opis |
|--------|-------------|
| Predmeti za prikaz | Število člankov |
| Filter kategorij | Omejitev na določene kategorije |
| Prikaži povzetek | Prikaži izsek članka |
| Dolžina naslova | Skrajšani naslovi |
| Predloga | Blokiraj datoteko predloge |

### Predloga bloka po meri
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
## Triki s predlogami

### Pogojni prikaz
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### Razred po meri CSS
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### Oblikovanje datuma
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## Povezana dokumentacija

- ../User-Guide/Basic-Configuration - Nastavitve modula
- ../User-Guide/Creating-Articles - Upravljanje vsebin
- ../../04-API-Reference/Template/Template-System - XOOPS mehanizem predlog
- ../../02-Core-Concepts/Themes/Theme-Development - Prilagoditev teme