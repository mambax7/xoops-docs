---
title: "template dan block"
---

## Ikhtisar

Penerbit menyediakan template yang dapat disesuaikan untuk menampilkan artikel dan block untuk integrasi sidebar/widget. Panduan ini mencakup kustomisasi template dan konfigurasi block.

## File template

### template core

| template | Tujuan |
|----------|---------|
| `publisher_index.tpl` | Beranda module |
| `publisher_item.tpl` | Tampilan artikel tunggal |
| `publisher_category.tpl` | Daftar kategori |
| `publisher_archive.tpl` | Halaman arsip |
| `publisher_search.tpl` | Hasil pencarian |
| `publisher_submit.tpl` | Formulir pengiriman artikel |
| `publisher_print.tpl` | Tampilan ramah cetak |

### Blokir template

| template | Tujuan |
|----------|---------|
| `publisher_block_latest.tpl` | block artikel terbaru |
| `publisher_block_spotlight.tpl` | block artikel unggulan |
| `publisher_block_category.tpl` | block daftar kategori |
| `publisher_block_author.tpl` | block artikel penulis |

## Variabel template

### Variabel Artikel

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

### Variabel Kategori

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## Menyesuaikan template

### Ganti Lokasi

Salin template ke theme Anda untuk disesuaikan:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Contoh: template Artikel Khusus

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

## block

### block Tersedia

| Blokir | Deskripsi |
|-------|-------------|
| Berita Terkini | Menampilkan artikel terkini |
| Sorotan | Sorotan artikel unggulan |
| Menu Kategori | Navigasi kategori |
| Arsip | Tautan arsip |
| Penulis Teratas | Penulis paling aktif |
| Barang Populer | Artikel paling banyak dilihat |

### Opsi Blokir

#### block Berita Terbaru

| Pilihan | Deskripsi |
|--------|-------------|
| Item untuk ditampilkan | Jumlah artikel |
| Filter kategori | Batasi pada kategori tertentu |
| Tampilkan ringkasan | Tampilkan kutipan artikel |
| Panjang judul | Potong judul |
| template | Blokir file template |

### template block Khusus

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

## Trik template

### Tampilan Bersyarat

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### Kelas CSS Kustom

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### Pemformatan Tanggal

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Dokumentasi Terkait

- ../User-Guide/Basic-Configuration - Pengaturan module
- ../User-Guide/Creating-Articles - Manajemen konten
- ../../04-API-Reference/Template/Template-System - Mesin template XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Kustomisasi theme
