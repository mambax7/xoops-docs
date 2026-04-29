---
title: "Sablonok és blokkok"
---
## Áttekintés

A Publisher testreszabható sablonokat biztosít a cikkek és blokkok megjelenítéséhez a sidebar/widget integrációhoz. Ez az útmutató a sablon testreszabásával és blokkkonfigurációjával foglalkozik.

## Sablonfájlok

### Alapsablonok

| Sablon | Cél |
|----------|----------|
| `publisher_index.tpl` | modul kezdőlapja |
| `publisher_item.tpl` | Egy cikk nézet |
| `publisher_category.tpl` | Kategória lista |
| `publisher_archive.tpl` | Archív oldal |
| `publisher_search.tpl` | Keresési eredmények |
| `publisher_submit.tpl` | Cikk benyújtási űrlap |
| `publisher_print.tpl` | Nyomtatásbarát nézet |

### Sablonok blokkolása

| Sablon | Cél |
|----------|----------|
| `publisher_block_latest.tpl` | Legújabb cikkek blokk |
| `publisher_block_spotlight.tpl` | Kiemelt cikkblokk |
| `publisher_block_category.tpl` | Kategória lista blokk |
| `publisher_block_author.tpl` | Szerzői cikkek blokk |

## Sablonváltozók

### Cikkváltozók

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

### Kategóriaváltozók

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Sablonok testreszabása

### Hely felülírása

Másoljon sablonokat a témába a testreszabáshoz:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Példa: Egyéni cikksablon

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

## Blokkok

### Elérhető blokkok

| Blokk | Leírás |
|-------|--------------|
| Legfrissebb hírek | Megjeleníti a legutóbbi cikkeket |
| Reflektorfény | Kiemelt cikk kiemelése |
| Kategória menü | Kategória navigáció |
| Archívum | Archív linkek |
| Legnépszerűbb szerzők | A legaktívabb írók |
| Népszerű tételek | Legnézettebb cikkek |

### Blokkolási lehetőségek

#### Legfrissebb hírek blokk

| Opció | Leírás |
|--------|--------------|
| Megjelenítendő elemek | Cikkek száma |
| Kategória szűrő | Konkrét kategóriákra korlátozás |
| Összefoglaló megjelenítése | Cikkrészlet megjelenítése |
| Cím hossza | Címek csonkolása |
| Sablon | Sablonfájl letiltása |

### Egyéni blokkosablon

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

## Sablontrükkök

### Feltételes megjelenítés

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Egyedi CSS osztály

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Dátum formázása

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Kapcsolódó dokumentáció

- ../User-Guide/Basic-Configuration - modul beállítások
- ../User-Guide/Creating-Articles - Tartalomkezelés
- ../../04-API-Reference/Template/Template-System - XOOPS sablon motor
- ../../02-Core-Concepts/Themes/Theme-Development - Téma testreszabása
