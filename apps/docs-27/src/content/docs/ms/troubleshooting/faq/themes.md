---
title: "Tema FAQ"
description: "Soalan lazim tentang XOOPS tema"
---
# Tema Soalan Lazim

> Soalan dan jawapan lazim tentang XOOPS tema, penyesuaian dan pengurusan.

---

## Pemasangan & Pengaktifan Tema

### S: Bagaimanakah cara saya memasang tema baharu dalam XOOPS?

**J:**
1. Muat turun fail zip tema
2. Pergi ke XOOPS Admin > Rupa > Tema
3. Klik "Muat naik" dan pilih fail zip
4. Tema muncul dalam senarai tema
5. Klik untuk mengaktifkannya untuk tapak anda

Alternatif: Ekstrak secara manual ke dalam direktori `/themes/` dan muat semula panel pentadbir.

---

### S: Muat naik tema gagal dengan "Kebenaran ditolak"

**J:** Betulkan kebenaran direktori tema:
```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```
---

### S: Bagaimanakah cara saya menetapkan tema yang berbeza untuk pengguna tertentu?

**J:**
1. Pergi ke Pengurus Pengguna > Edit Pengguna
2. Pergi ke tab "Lain".
3. Pilih tema pilihan dalam lungsur turun "Tema Pengguna".
4. Jimat

Tema yang dipilih pengguna mengatasi tema tapak lalai.

---

### S: Bolehkah saya mempunyai tema yang berbeza untuk tapak pentadbir dan pengguna?

**J:** Ya, tetapkan dalam XOOPS Pentadbir > Tetapan:

1. **Tema hadapan** - Tema tapak lalai
2. **Tema pentadbir** - Tema panel kawalan pentadbir (biasanya berasingan)

Cari tetapan seperti:
- `theme_set` - Tema bahagian hadapan
- `admin_theme` - Tema pentadbir

---

## Penyesuaian Tema

### S: Bagaimanakah cara saya menyesuaikan tema sedia ada?

**J:** Buat tema kanak-kanak untuk mengekalkan kemas kini:
```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Create copy for editing *}
    ├── style.css
    ├── templates/
    └── images/
```
Kemudian edit `theme.html` dalam tema tersuai anda.

---

### S: Bagaimanakah cara menukar warna tema?

**J:** Edit fail CSS tema:
```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```
Untuk XOOPS tema:
```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```
---

### S: Bagaimanakah cara saya menambah CSS tersuai pada tema?

**J:** Beberapa pilihan:

**Pilihan 1: Edit theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```
**Pilihan 2: Buat custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```
**Pilihan 3: Tetapan Pentadbir (jika disokong)**
Pergi ke XOOPS Pentadbir > Tetapan > Tetapan Tema dan tambah CSS tersuai.

---

### S: Bagaimanakah cara saya mengubah suai templat tema HTML?

**J:** Cari fail templat:
```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```
Edit dengan sintaks Smarty yang betul:
```html
<!-- themes/mytheme/templates/theme.html -->
{* XOOPS Theme Template *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>
        {include file="file:header.html"}
    </header>

    <main>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    {$xoops_contents}
                </div>
                <aside class="col-md-3">
                    {include file="file:sidebar.html"}
                </aside>
            </div>
        </div>
    </main>

    <footer>
        {include file="file:footer.html"}
    </footer>
</body>
</html>
```
---

## Struktur Tema

### S: Apakah fail yang diperlukan dalam tema?

**J:** Struktur minimum:
```
themes/mytheme/
├── theme.html              {* Main template (required) *}
├── style.css              {* Stylesheet (optional but recommended) *}
├── screenshot.png         {* Preview image for admin (optional) *}
├── images/                {* Theme images *}
│   └── logo.png
└── templates/             {* Optional: Additional templates *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```
Lihat Struktur Tema untuk mendapatkan butiran.

---

### S: Bagaimanakah cara saya mencipta tema dari awal?

**J:** Cipta struktur:
```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```
Buat `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```
Buat `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```
---

## Pembolehubah Tema

### S: Apakah pembolehubah yang tersedia dalam templat tema?

**J:** Pembolehubah tema biasa XOOPS:
```smarty
{* Site Information *}
{$xoops_sitename}          {* Site name *}
{$xoops_url}               {* Site URL *}
{$xoops_theme}             {* Current theme name *}

{* Page Content *}
{$xoops_contents}          {* Main page content *}
{$xoops_pagetitle}         {* Page title *}
{$xoops_headers}           {* Meta tags, styles in head *}

{* Module Information *}
{$xoops_module_header}     {* Module-specific header *}
{$xoops_moduledesc}        {* Module description *}

{* User Information *}
{$xoops_isuser}            {* Is user logged in? *}
{$xoops_userid}            {* User ID *}
{$xoops_uname}             {* Username *}

{* Blocks *}
{$xoops_blocks}            {* All block content *}

{* Other *}
{$xoops_charset}           {* Document charset *}
{$xoops_version}           {* XOOPS version *}
```
---

### S: Bagaimanakah cara saya menambah pembolehubah tersuai pada tema saya?

**J:** Dalam kod PHP anda sebelum rendering:
```php
<?php
// In module or admin code
require_once XOOPS_ROOT_PATH . '/class/xoopstpl.php';
$xoopsTpl = new XoopsTpl();

// Add custom variables
$xoopsTpl->assign('my_variable', 'value');
$xoopsTpl->assign('data_array', ['key1' => 'val1', 'key2' => 'val2']);

// Use in theme template
$xoopsTpl->display('file:theme.html');
?>
```
Dalam tema:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```
---

## Penggayaan Tema

### S: Bagaimanakah cara saya menjadikan tema saya responsif?

**J:** Gunakan CSS Grid atau Flexbox:
```css
/* themes/mytheme/style.css */

/* Mobile first approach */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Desktop and up */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```
Atau gunakan penyepaduan Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```
---

### S: Bagaimanakah cara saya menambah mod gelap pada tema saya?

**J:**
```css
/* themes/mytheme/style.css */

/* Light mode (default) */
:root {
    --bg-color: #ffffff;
    --text-color: #000000;
    --border-color: #cccccc;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --border-color: #444444;
    }
}

/* Or with CSS class */
body.dark-mode {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --border-color: #444444;
}
```
Togol dengan JavaScript:
```html
<script>
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
</script>
```
---

## Isu Tema

### S: Tema menunjukkan ralat "pembolehubah templat tidak dikenali".

**J:** Pembolehubah tidak dihantar ke templat. Semak:

1. **Pembolehubah ditugaskan** dalam PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```
2. **Templat wujud** jika dinyatakan
3. **Sintaks templat adalah betul**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```
---

### S: CSS perubahan tidak muncul dalam penyemak imbas

**J:** Kosongkan cache penyemak imbas:

1. Muat semula keras: `Ctrl+Shift+R` (Cmd+Shift+R pada Mac)
2. Kosongkan cache tema pada pelayan:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```
3. Semak CSS laluan fail dalam tema:
```bash
ls -la themes/mytheme/style.css
```
---

### S: Imej dalam tema tidak dimuatkan

**J:** Semak laluan imej:
```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```
---

### S: Templat tema tiada atau menyebabkan ralat

**J:** Lihat Ralat Templat untuk nyahpepijat.

---

## Pengagihan Tema

### S: Bagaimanakah cara saya membungkus tema untuk pengedaran?

**J:** Buat zip boleh agih:
```bash
# Structure
mytheme/
├── theme.html           {* Required *}
├── style.css
├── screenshot.png       {* 300x225 recommended *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optional *}
    ├── header.html
    └── footer.html

# Create zip
zip -r mytheme.zip mytheme/
```
---

### S: Bolehkah saya menjual tema XOOPS saya?

**J:** Semak lesen XOOPS:
- Tema yang menggunakan XOOPS classes/templates mesti menghormati lesen XOOPS
- Tema CSS/HTML tulen mempunyai lebih sedikit sekatan
- Semak XOOPS Garis Panduan Menyumbang untuk butiran

---

## Persembahan Tema

### S: Bagaimanakah cara saya mengoptimumkan prestasi tema?

**J:**
1. **Minimumkan CSS/JS** - Alih keluar kod yang tidak digunakan
2. **Optimumkan imej** - Gunakan format yang betul (WebP, AVIF)
3. **Gunakan CDN** untuk sumber
4. **Malas memuat** imej:
```html
<img src="image.jpg" loading="lazy">
```
5. **Versi cache-bust**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```
Lihat Prestasi FAQ untuk butiran lanjut.

---

## Dokumentasi Berkaitan

- Ralat Templat
- Struktur Tema
- Prestasi FAQ
- Penyahpepijatan Pintar

---

#XOOPS #themes #faq #penyelesaianmasalah #penyesuaian