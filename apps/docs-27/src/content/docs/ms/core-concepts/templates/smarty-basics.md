---
title: "Asas Smarty"
description: "Asas templat Smarty dalam XOOPS"
---
<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>:::nota[Versi Smarty oleh XOOPS Keluaran]
| Versi XOOPS | Versi Smarty | Perbezaan Utama |
|----------------|----------------|----------------|
| 2.5.11 | Smarty 3.x | `{php}` blok dibenarkan (tetapi tidak digalakkan) |
| 2.7.0+ | Smarty 3.x/4.x | Bersedia untuk keserasian Smarty 4 |
| 4.0 | Smarty 4.x | Sekatan `{php}` dialih keluar, sintaks yang lebih ketat |Lihat Smarty-4-Migration untuk panduan penghijrahan.
:::Smarty ialah enjin templat untuk PHP yang membolehkan pembangun mengasingkan pembentangan (HTML/CSS) daripada logik aplikasi. XOOPS menggunakan Smarty untuk semua keperluan templatnya, membolehkan pemisahan bersih antara kod PHP dan output HTML.## Dokumentasi Berkaitan- Pembangunan Tema - Mencipta tema XOOPS
- Pembolehubah-Templat - Pembolehubah yang tersedia dalam templat
- Smarty-4-Migration - Menaik taraf daripada Smarty 3 kepada 4## Apakah itu Smarty?Smarty menyediakan:- **Pemisahan Kebimbangan**: Simpan HTML dalam templat, logik PHP dalam kelas
- **Warisan Templat**: Bina reka letak kompleks daripada blok ringkas
- **Caching**: Tingkatkan prestasi dengan templat yang disusun
- **Pengubahsuai**: Ubah output dengan fungsi terbina dalam atau tersuai
- **Keselamatan**: Kawal perkara yang boleh diakses oleh templat fungsi PHP## XOOPS Konfigurasi SmartyXOOPS mengkonfigurasi Smarty dengan pembatas tersuai:
```
Default Smarty: { and }
XOOPS Smarty:   <{ and }>
```
Ini menghalang konflik dengan kod JavaScript dalam templat.## Sintaks Asas### PembolehubahPembolehubah dihantar dari PHP ke templat:
```
php
// In PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```
```
Smarty
{* In template *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```
### Akses Tatasusunan
```
php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```
```
Smarty
{* Template *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```
### Sifat Objek
```
php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```
```
Smarty
{* Template *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```
## KomenKomen dalam Smarty tidak diberikan kepada HTML:
```
Smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```
## Struktur Kawalan### Penyata If/Else
```
Smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```
### Operator Perbandingan
```
Smarty
{* Equality *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Inequality *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Greater/Less than *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Greater/Less than or equal *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Logical operators *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```
### Menyemak Empty/Isset
```
Smarty
{* Check if variable exists and has value *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Check if array is not empty *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Using isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```
### Gelung Foreach
```
Smarty
{* Basic foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* With key *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* With @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Alternate row colors *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```
### Untuk Gelung
```
Smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```
### While Loops
```
Smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```
## Pengubahsuai PembolehubahPengubah suai mengubah output berubah:### Pengubah Rentetan
```
Smarty
{* HTML escape (always use for user input!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL encoding *}
<{$url|escape:'url'}>

{* Uppercase/Lowercase *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncate text *}
<{$content|truncate:100:'...'}>

{* Strip HTML tags *}
<{$html|strip_tags}>

{* Replace *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Default value *}
<{$optional_var|default:'No value'}>
```
### Pengubah suai angka
```
Smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```
### Pengubahsuai Tatasusunan
```
Smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Pengubahsuai Rantaian
```
Smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```
## Sertakan dan Sisipkan### Termasuk Templat Lain
```
Smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```
### Memasukkan Kandungan Dinamik
```
Smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```
## Berikan Pembolehubah dalam Templat
```
Smarty
{* Simple assignment *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assignment from expression *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capture block content *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$Smarty.capture.sidebar}></div>
```
## Pembolehubah Smarty Terbina dalam### Pembolehubah $Smarty
```
Smarty
{* Current timestamp *}
<{$Smarty.now|date_format:"%Y-%m-%d"}>

{* Request variables *}
<{$Smarty.get.page}>
<{$Smarty.post.username}>
<{$Smarty.request.id}>
<{$Smarty.cookies.session_id}>
<{$Smarty.server.HTTP_HOST}>

{* Constants *}
<{$Smarty.const.XOOPS_URL}>

{* Configuration variables *}
<{$Smarty.config.var_name}>

{* Template info *}
<{$Smarty.template}>
<{$Smarty.current_dir}>

{* Smarty version *}
<{$Smarty.version}>

{* Section/Foreach properties *}
<{$Smarty.foreach.items.index}>
<{$Smarty.foreach.items.iteration}>
<{$Smarty.foreach.items.first}>
<{$Smarty.foreach.items.last}>
```
## Blok LiteralUntuk JavaScript dengan pendakap kerinting:
```
Smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```
Atau gunakan pembolehubah Smarty dalam JavaScript:
```
Smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```
## Fungsi TersuaiXOOPS menyediakan fungsi Smarty tersuai:
```
Smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```
## Amalan Terbaik### Sentiasa Melarikan Diri Output
```
Smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```
### Gunakan Nama Pembolehubah Bermakna
```
php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```
### Pastikan Logik MinimumTemplat harus memberi tumpuan kepada pembentangan. Pindahkan logik kompleks ke PHP:
```
Smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```
### Gunakan Pewarisan TemplatUntuk reka letak yang konsisten, gunakan warisan templat (lihat Pembangunan Tema).## Templat Penyahpepijatan### Konsol Nyahpepijat
```
Smarty
{* Show all assigned variables *}
<{debug}>
```
### Output Sementara
```
Smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```
## Corak Templat XOOPS Biasa### Struktur Templat Modul
```
Smarty
{* Module header *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* Content *}
    <div class="content">
        <{$content}>
    </div>
</div>
```
### Penomboran
```
Smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```
### Paparan Borang
```
Smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```
---

#Smarty #templates #XOOPS #frontend #template-enjin