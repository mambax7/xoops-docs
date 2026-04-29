---
title: "Smarty 4 Migrasi"
description: "Panduan untuk mengupgrade template XOOPS dari Smarty 3 ke Smarty 4"
---

Panduan ini mencakup perubahan dan langkah migrasi yang diperlukan saat meningkatkan dari Smarty 3 ke Smarty 4 di XOOPS. Memahami perbedaan ini penting untuk menjaga kompatibilitas dengan instalasi XOOPS modern.

## Dokumentasi Terkait

- Smarty-Dasar - Dasar-dasar Smarty di XOOPS
- Pengembangan theme - Membuat theme XOOPS
- template-Variabel - Variabel yang tersedia di template

## Ikhtisar Perubahan

Smarty 4 memperkenalkan beberapa perubahan yang dapat mengganggu dari Smarty 3:

1. Perilaku penugasan variabel berubah
2. Tag `{php}` dihapus sepenuhnya
3. Menyimpan perubahan API
4. Pengubah menangani pembaruan
5. Perubahan kebijakan keamanan
6. Fitur yang tidak digunakan lagi dihapus

## Perubahan Akses Variabel

### Masalahnya

Di Smarty 2/3, nilai yang ditetapkan dapat diakses langsung:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Di Smarty 4, variabel dibungkus dalam objek `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Solusi 1: Akses Properti Nilai

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Solusi 2: Mode Kompatibilitas

Aktifkan mode kompatibilitas di PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Ini memungkinkan akses variabel langsung seperti Smarty 3.

### Solusi 3: Pemeriksaan Versi Bersyarat

Tulis template yang berfungsi di kedua versi:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Solusi 4: Fungsi Pembungkus

Buat fungsi pembantu untuk tugas:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## Menghapus Tag {php}

### Masalahnya

Smarty 3+ tidak mendukung tag `{php}` karena alasan keamanan:

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Solusi: Gunakan Variabel Smarty

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Solusi: Pindahkan Logika ke PHP

Logika kompleks harus ada di PHP, bukan template:

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

### Solusi: Plugin Khusus

Untuk fungsionalitas yang dapat digunakan kembali, buat plugin Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Perubahan dalam cache

### Smarty 3 Penembolokan

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 Penembolokan

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Konstanta Caching

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### Nocache di template

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Perubahan Pengubah

### Pengubah String

Beberapa pengubah diganti namanya atau tidak digunakan lagi:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### Pengubah Array

Pengubah array memerlukan awalan `@`:

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Pengubah Khusus

Pengubah khusus harus didaftarkan:

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## Perubahan Kebijakan Keamanan

### Smarty 4 Keamanan

Smarty 4 memiliki keamanan default yang lebih ketat:

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Fungsi yang Diizinkan

Secara default, Smarty 4 membatasi fungsi PHP mana yang dapat digunakan:

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Konfigurasikan fungsi yang diizinkan jika diperlukan:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Pembaruan Warisan template

### Blokir Sintaks

Sintaks block tetap serupa tetapi dengan beberapa perubahan:

```smarty
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

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### Tambahkan dan Tambahkan

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## Fitur yang Tidak Digunakan Lagi

### Dihapus di Smarty 4

| Fitur | Alternatif |
|---------|-------------|
| Tag `{php}` | Pindahkan logika ke PHP atau gunakan plugin |
| `{include_php}` | Gunakan plugin terdaftar |
| `$smarty.capture` | Masih berfungsi tetapi tidak digunakan lagi |
| `{strip}` dengan spasi | Gunakan alat minifikasi |

### Gunakan Alternatif

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Daftar Periksa Migrasi

### Sebelum Migrasi

1. [ ] Cadangkan semua template
2. [ ] Cantumkan semua penggunaan tag `{php}`
3. [ ] Dokumentasikan plugin khusus
4. [ ] Uji fungsionalitas saat ini

### Selama Migrasi

1. [ ] Hapus semua tag `{php}`
2. [ ] Perbarui sintaks akses variabel
3. [ ] Periksa penggunaan pengubah
4. [ ] Perbarui konfigurasi cache
5. [ ] Tinjau pengaturan keamanan

### Setelah Migrasi

1. [ ] Uji semua template
2. [ ] Periksa semua formulir berfungsi
3. [ ] Verifikasi caching berfungsi
4. [ ] Uji dengan peran pengguna yang berbeda

## Menguji Kompatibilitas

### Deteksi Versi

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### Pemeriksaan Versi template

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## Menulis template yang Kompatibel Lintas

### Praktik Terbaik1. **Hindari tag `{php}` sepenuhnya** - Tag tersebut tidak berfungsi di Smarty 3+

2. **Buat template tetap sederhana** - Logika kompleks termasuk dalam PHP

3. **Gunakan pengubah standar** - Hindari pengubah yang sudah tidak digunakan lagi

4. **Uji di kedua versi** - Jika Anda perlu mendukung keduanya

5. **Gunakan plugin untuk operasi kompleks** - Lebih mudah dipelihara

### Contoh: template yang Kompatibel Lintas

```smarty
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

## Masalah Umum Migrasi

### Masalah: Pengembalian Variabel Kosong

**Masalah**: `<{$mod_url}>` tidak mengembalikan apa pun di Smarty 4

**Solusi**: Gunakan `<{$mod_url->value}>` atau aktifkan mode kompatibilitas

### Masalah: Kesalahan Tag PHP

**Masalah**: template memunculkan kesalahan pada tag `{php}`

**Solusi**: Hapus semua tag PHP dan pindahkan logika ke file PHP

### Masalah: Pengubah Tidak Ditemukan

**Masalah**: Pengubah khusus memunculkan kesalahan "pengubah tidak dikenal".

**Solusi**: Daftarkan pengubah dengan `registerPlugin()`

### Masalah: Pembatasan Keamanan

**Masalah**: Fungsi tidak diperbolehkan dalam template

**Solusi**: Tambahkan fungsi ke daftar kebijakan keamanan yang diizinkan

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
