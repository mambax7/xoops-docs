---
title: "Smarty 4 Migrasi"
description: "Panduan untuk menaik taraf templat XOOPS daripada Smarty 3 kepada Smarty 4"
---
Panduan ini merangkumi perubahan dan langkah migrasi yang diperlukan semasa menaik taraf daripada Smarty 3 kepada Smarty 4 dalam XOOPS. Memahami perbezaan ini adalah penting untuk mengekalkan keserasian dengan pemasangan XOOPS moden.## Dokumentasi Berkaitan- Smarty-Basics - Asas Smarty dalam XOOPS
- Pembangunan Tema - Mencipta tema XOOPS
- Pembolehubah-Templat - Pembolehubah yang tersedia dalam templat## Gambaran Keseluruhan PerubahanSmarty 4 memperkenalkan beberapa perubahan besar daripada Smarty 3:1. Tingkah laku tugasan berubah berubah
2. Teg `{php}` dialih keluar sepenuhnya
3. Caching API perubahan
4. Kemas kini pengendalian pengubah suai
5. Perubahan dasar keselamatan
6. Ciri yang tidak digunakan dialih keluar## Perubahan Akses Boleh Ubah### MasalahnyaDalam Smarty 2/3, nilai yang ditetapkan boleh diakses secara langsung:
```
php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```
```
Smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```
Dalam Smarty 4, pembolehubah dibalut dalam objek `Smarty_Variable`:
```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```
### Penyelesaian 1: Akses Harta Nilai
```
Smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```
### Penyelesaian 2: Mod KeserasianDayakan mod keserasian dalam PHP:
```
php
$Smarty = new Smarty();
$Smarty->setCompatibilityMode(true);
```
Ini membenarkan capaian berubah terus seperti Smarty 3.### Penyelesaian 3: Semakan Versi BersyaratTulis templat yang berfungsi dalam kedua-dua versi:
```
Smarty
<{if $Smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```
### Penyelesaian 4: Fungsi PembungkusBuat fungsi pembantu untuk tugasan:
```
php
function smartyAssign($Smarty, $name, $value)
{
    if (version_compare($Smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $Smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $Smarty->assign($name, $value);
    }
}
```
## Mengalih keluar Teg {php}.### MasalahnyaSmarty 3+ tidak menyokong teg `{php}` atas sebab keselamatan:
```
Smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```
### Penyelesaian: Gunakan Pembolehubah Smarty
```
Smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$Smarty.template_vars.cid}>
```
### Penyelesaian: Alihkan Logik ke PHPLogik kompleks harus dalam PHP, bukan templat:
```
php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```
```
Smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```
### Penyelesaian: Pemalam TersuaiUntuk kefungsian boleh guna semula, buat pemalam Smarty:
```
php
// /class/Smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $Smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $Smarty->assign($params['assign'], $category->toArray());
    }
}
```
```
Smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```
## Perubahan Caching### Smarty 3 Caching
```
php
// Smarty 3 style
$Smarty->caching = true;
$Smarty->cache_lifetime = 3600;
$Smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```
### Smarty 4 Caching
```
php
// Smarty 4 style
$Smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$Smarty->setCacheLifetime(3600);
$Smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$Smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$Smarty->cache_lifetime = 3600;
```
### Caching Pemalar
```
php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```
### Nocache dalam Templat
```
Smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$Smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```
## Perubahan Pengubahsuai### Pengubah RentetanBeberapa pengubah telah dinamakan semula atau ditamatkan:
```
Smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```
### Pengubahsuai TatasusunanPengubah suai tatasusunan memerlukan awalan `@`:
```
Smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Pengubahsuai TersuaiPengubah suai tersuai mesti didaftarkan:
```
php
// Register a custom modifier
$Smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```
## Perubahan Dasar Keselamatan### Keselamatan Smarty 4Smarty 4 mempunyai keselamatan lalai yang lebih ketat:
```
php
// Configure security policy
$Smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$Smarty->enableSecurity(new MySecurityPolicy($Smarty));
```
### Fungsi yang DibenarkanSecara lalai, Smarty 4 mengehadkan fungsi PHP yang boleh digunakan:
```
Smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```
Konfigurasikan fungsi yang dibenarkan jika perlu:
```
php
$Smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```
## Kemas Kini Warisan Templat### Sekat SintaksSintaks blok kekal serupa tetapi dengan beberapa perubahan:
```
Smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```
```
Smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$Smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```
### Tambah dan Tambah
```
Smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```
## Ciri Ditamatkan### Dialih keluar dalam Smarty 4| Ciri | Alternatif |
|---------|-------------|
| Teg `{php}` | Alihkan logik ke PHP atau gunakan pemalam |
| `{include_php}` | Gunakan pemalam berdaftar |
| `$Smarty.capture` | Masih berfungsi tetapi tidak digunakan |
| `{strip}` dengan ruang | Gunakan alat pemindahan |### Gunakan Alternatif
```
Smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$Smarty.capture.sidebar}></div>
```
## Senarai Semak Migrasi### Sebelum Hijrah1. [ ] Sandarkan semua templat
2. [ ] Senaraikan semua penggunaan teg `{php}`
3. [ ] Dokumen pemalam tersuai
4. [ ] Uji kefungsian semasa### Semasa Hijrah1. [ ] Alih keluar semua teg `{php}`
2. [ ] Kemas kini sintaks akses berubah-ubah
3. [ ] Semak penggunaan pengubah suai
4. [ ] Kemas kini konfigurasi caching
5. [ ] Semak tetapan keselamatan### Selepas Hijrah1. [ ] Uji semua templat
2. [ ] Semak semua borang berfungsi
3. [ ] Sahkan kerja caching
4. [ ] Uji dengan peranan pengguna yang berbeza## Ujian untuk Keserasian### Pengesanan Versi
```
php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```
### Semakan Versi Templat
```
Smarty
{* Check version in template *}
<{assign var="smarty_major" value=$Smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```
## Menulis Templat Serasi Silang### Amalan Terbaik1. **Elakkan teg `{php}` sepenuhnya** - Mereka tidak berfungsi dalam Smarty 3+2. **Pastikan templat mudah** - Logik kompleks tergolong dalam PHP3. **Gunakan pengubah suai standard** - Elakkan yang tidak digunakan lagi4. **Ujian dalam kedua-dua versi** - Jika anda perlu menyokong kedua-duanya5. **Gunakan pemalam untuk operasi yang kompleks** - Lebih boleh diselenggara### Contoh: Templat Serasi Silang
```
Smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```
## Isu Migrasi Biasa### Isu: Pembolehubah Kembali Kosong**Masalah**: `<{$mod_url}>` tidak mengembalikan apa-apa dalam Smarty 4**Penyelesaian**: Gunakan `<{$mod_url->value}>` atau dayakan mod keserasian### Isu: Ralat Tag PHP**Masalah**: Templat membuang ralat pada teg `{php}`**Penyelesaian**: Alih keluar semua tag PHP dan alihkan logik ke fail PHP### Isu: Pengubah suai Tidak Ditemui**Masalah**: Pengubah suai tersuai membuang ralat "pengubah suai tidak diketahui".**Penyelesaian**: Daftarkan pengubah suai dengan `registerPlugin()`### Isu: Sekatan Keselamatan**Masalah**: Fungsi tidak dibenarkan dalam templat**Penyelesaian**: Tambahkan fungsi pada senarai dibenarkan dasar keselamatan---

#pintar #hijrah #naik taraf #XOOPS #smarty4 #keserasian