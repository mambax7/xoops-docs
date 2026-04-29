---
title: "templates ve Bloklar"
---
## Genel Bakış

Publisher, sidebar/widget entegrasyonu için makaleleri ve blokları görüntülemek üzere özelleştirilebilir templates sağlar. Bu kılavuz template özelleştirmesini ve blok yapılandırmasını kapsar.

## template Dosyaları

### Temel templates

| template | Amaç |
|----------|-----------|
| `publisher_index.tpl` | module ana sayfası |
| `publisher_item.tpl` | Tek makale görünümü |
| `publisher_category.tpl` | Kategori listeleme |
| `publisher_archive.tpl` | Arşiv sayfası |
| `publisher_search.tpl` | Arama sonuçları |
| `publisher_submit.tpl` | Makale gönderim formu |
| `publisher_print.tpl` | Yazdırma dostu görünüm |

### Blok Şablonları

| template | Amaç |
|----------|-----------|
| `publisher_block_latest.tpl` | Son makaleler bloğu |
| `publisher_block_spotlight.tpl` | Öne çıkan makale bloğu |
| `publisher_block_category.tpl` | Kategori listesi bloğu |
| `publisher_block_author.tpl` | Yazar makaleleri bloğu |

## template Değişkenleri

### Makale Değişkenleri
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
### Kategori Değişkenleri
```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```
## Şablonları Özelleştirme

### Konumu Geçersiz Kıl

Özelleştirmek için şablonları temanıza kopyalayın:
```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```
### Örnek: Özel Makale Şablonu
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
## Bloklar

### Mevcut Bloklar

| Blok | Açıklama |
|----------|----------------|
| Son Haberler | En son makaleleri gösterir |
| Gündem | Öne çıkan makalenin öne çıkanları |
| Kategori Menüsü | Kategori navigasyonu |
| Arşivler | Arşiv bağlantıları |
| En İyi Yazarlar | En aktif yazarlar |
| Popüler Ürünler | En çok görüntülenen makaleler |

### Blok Seçenekleri

#### Son Haber Bloğu

| Seçenek | Açıklama |
|----------|----------------|
| Görüntülenecek öğeler | Makale sayısı |
| Kategori filtresi | Belirli kategorilerle sınırlandırın |
| Özeti göster | Makale alıntısını görüntüle |
| Başlık uzunluğu | Başlıkları kısalt |
| template | template dosyasını engelle |

### Özel Blok Şablonu
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
## template Püf Noktaları

### Koşullu Ekran
```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```
### Özel CSS Sınıfı
```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```
### Tarih Biçimlendirmesi
```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```
## İlgili Belgeler

- ../User-Guide/Basic-Configuration - module ayarları
- ../User-Guide/Creating-Articles - İçerik yönetimi
- ../../04-API-Reference/Template/Template-System - XOOPS template motoru
- ../../02-Core-Concepts/Themes/Theme-Development - theme özelleştirme