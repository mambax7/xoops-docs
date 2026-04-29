---
title: "Templat dan Blok"
---
## Gambaran Keseluruhan

Penerbit menyediakan templat yang boleh disesuaikan untuk memaparkan artikel dan blok untuk penyepaduan sidebar/widget. Panduan ini merangkumi penyesuaian templat dan konfigurasi blok.

## Fail Templat

### Templat Teras

| Templat | Tujuan |
|----------|---------|
| `publisher_index.tpl` | Laman utama modul |
| `publisher_item.tpl` | Paparan artikel tunggal |
| `publisher_category.tpl` | Penyenaraian kategori |
| `publisher_archive.tpl` | Halaman arkib |
| `publisher_search.tpl` | Hasil carian |
| `publisher_submit.tpl` | Borang penyerahan artikel |
| `publisher_print.tpl` | Paparan mesra cetak |

### Templat Sekat

| Templat | Tujuan |
|----------|---------|
| `publisher_block_latest.tpl` | Sekatan artikel terkini |
| `publisher_block_spotlight.tpl` | Sekatan artikel pilihan |
| `publisher_block_category.tpl` | Blok senarai kategori |
| `publisher_block_author.tpl` | Sekatan artikel pengarang |

## Pembolehubah Templat

### Pembolehubah Artikel
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
### Pembolehubah Kategori
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## Menyesuaikan Templat

### Gantikan Lokasi

Salin templat ke tema anda untuk disesuaikan:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### Contoh: Templat Artikel Tersuai
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
## Blok

### Blok Tersedia

| Sekat | Penerangan |
|-------|-------------|
| Berita Terkini | Menunjukkan artikel terbaru |
| Tumpuan | Sorotan artikel pilihan |
| Menu Kategori | Navigasi kategori |
| Arkib | Pautan arkib |
| Pengarang Teratas | Penulis paling aktif |
| Item Popular | Artikel yang paling banyak dilihat |

### Pilihan Sekat

#### Blok Berita Terkini

| Pilihan | Penerangan |
|--------|--------------|
| Item untuk dipaparkan | Bilangan artikel |
| Penapis kategori | Had kepada kategori tertentu |
| Tunjukkan ringkasan | Paparkan petikan artikel |
| Panjang tajuk | Pangkas tajuk |
| Templat | Sekat fail templat |

### Templat Blok Tersuai
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
## Trik Templat

### Paparan Bersyarat
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### Kelas CSS Tersuai
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### Pemformatan Tarikh
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## Dokumentasi Berkaitan

- ../User-Guide/Basic-Configuration - Tetapan modul
- ../User-Guide/Creating-Articles - Pengurusan kandungan
- ../../04-API-Reference/Template/Template-System - XOOPS enjin templat
- ../../02-Core-Concepts/Themes/Theme-Development - Penyesuaian tema