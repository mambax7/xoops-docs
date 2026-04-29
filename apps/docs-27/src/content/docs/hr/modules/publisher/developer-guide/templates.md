---
title: "predlošci i blokovi"
---
## Pregled

Publisher nudi prilagodljivi templates za prikaz članaka i blokova za integraciju bočne trake/widgeta. Ovaj vodič pokriva prilagodbu predloška i konfiguraciju blokova.

## Datoteke predložaka

### Temeljni predlošci

| predložak | Svrha |
|----------|---------|
| `publisher_index.tpl` | Početna stranica modula |
| `publisher_item.tpl` | Prikaz pojedinačnog članka |
| `publisher_category.tpl` | Popis kategorija |
| `publisher_archive.tpl` | Stranica arhive |
| `publisher_search.tpl` | Rezultati pretraživanja |
| `publisher_submit.tpl` | Obrazac za slanje članaka |
| `publisher_print.tpl` | Pogled pogodan za ispis |

### predlošci blokova

| predložak | Svrha |
|----------|---------|
| `publisher_block_latest.tpl` | Najnoviji članci blok |
| `publisher_block_spotlight.tpl` | Blok istaknutih članaka |
| `publisher_block_category.tpl` | Blok popisa kategorija |
| `publisher_block_author.tpl` | Blok autorskih članaka |

## Varijable predloška

### Varijable članka

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

### Varijable kategorije

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Prilagodba predložaka

### Nadjačaj lokaciju

Kopirajte templates u svoju temu za prilagodbu:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Primjer: prilagođeni predložak članka

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

## Blokovi

### Dostupni blokovi

| Blokiraj | Opis |
|-------|-------------|
| Najnovije vijesti | Prikazuje nedavne članke |
| U središtu pažnje | Istaknuti članak |
| Izbornik kategorije | Navigacija po kategorijama |
| Arhiva | Linkovi arhive |
| Vrhunski autori | Najaktivniji pisci |
| Popularni artikli | Najgledaniji članci |

### Opcije bloka

#### Blok najnovijih vijesti

| Opcija | Opis |
|--------|-------------|
| Stavke za prikaz | Broj članaka |
| Filter kategorije | Ograniči na određene kategorije |
| Prikaži sažetak | Prikaži izvadak članka |
| Dužina naslova | Skrati naslove |
| predložak | Datoteka predloška bloka |

### Prilagođeni predložak bloka

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

## Trikovi s predlošcima

### Uvjetni prikaz

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Prilagođena klasa CSS

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

- ../User-Guide/Basic-Configuration - Postavke modula
- ../User-Guide/Creating-Articles - Upravljanje sadržajem
- ../../04-API-Reference/Template/Template-System - XOOPS mehanizam za predloške
- ../../02-Core-Concepts/Themes/Theme-Development - Prilagodba teme
