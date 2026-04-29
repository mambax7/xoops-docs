---
title: "Šablony a bloky"
---

## Přehled

Publisher poskytuje přizpůsobitelné šablony pro zobrazení článků a bloků pro integraci sidebar/widget. Tato příručka popisuje přizpůsobení šablony a konfiguraci bloku.

## Soubory šablon

### Základní šablony

| Šablona | Účel |
|----------|---------|
| `publisher_index.tpl` | Domovská stránka modulu |
| `publisher_item.tpl` | Zobrazení jednoho článku |
| `publisher_category.tpl` | Seznam kategorií |
| `publisher_archive.tpl` | Archivní stránka |
| `publisher_search.tpl` | Výsledky hledání |
| `publisher_submit.tpl` | Formulář pro odeslání článku |
| `publisher_print.tpl` | Zobrazení vhodné pro tisk |

### Šablony bloků

| Šablona | Účel |
|----------|---------|
| `publisher_block_latest.tpl` | Blok nejnovějších článků |
| `publisher_block_spotlight.tpl` | Blok doporučených článků |
| `publisher_block_category.tpl` | Blok seznamu kategorií |
| `publisher_block_author.tpl` | Blok autorských článků |

## Proměnné šablony

### Proměnné článku

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

### Proměnné kategorie

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Přizpůsobení šablon

### Přepsat umístění

Zkopírujte šablony do svého motivu a přizpůsobte si:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Příklad: Vlastní šablona článku

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

## Bloky

### Dostupné bloky

| Blokovat | Popis |
|-------|--------------|
| Nejnovější zprávy | Zobrazuje poslední články |
| Zaostřeno | Zvýraznění doporučeného článku |
| Nabídka kategorií | Navigace podle kategorií |
| Archiv | Archiv odkazů |
| Nejlepší autoři | Nejaktivnější spisovatelé |
| Oblíbené položky | Nejprohlíženější články |

### Možnosti blokování

#### Blok nejnovějších zpráv

| Možnost | Popis |
|--------|-------------|
| Položky k zobrazení | Počet článků |
| Filtr kategorií | Omezení na konkrétní kategorie |
| Zobrazit souhrn | Zobrazit úryvek článku |
| Délka názvu | Zkrátit tituly |
| Šablona | Soubor šablony bloku |

### Vlastní šablona bloku

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

## Šablonové triky

### Podmíněné zobrazení

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Vlastní třída CSS

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Formátování data

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Související dokumentace

- ../User-Guide/Basic-Configuration - Nastavení modulu
- ../User-Guide/Creating-Articles - Správa obsahu
- ../../04-API-Reference/Template/Template-System - XOOPS šablonový modul
- ../../02-Core-Concepts/Themes/Theme-Development - Přizpůsobení motivu