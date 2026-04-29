---
title: "FAQ theme"
description: "Pertanyaan umum tentang theme XOOPS"
---

# theme Pertanyaan yang Sering Diajukan

> Pertanyaan dan jawaban umum tentang theme, penyesuaian, dan manajemen XOOPS.

---

## Instalasi & Aktivasi theme

### Q: Bagaimana cara menginstal theme baru di XOOPS?

**J:**
1. Unduh file zip theme
2. Buka Admin XOOPS > Tampilan > theme
3. Klik "Unggah" dan pilih file zip
4. theme muncul di daftar theme
5. Klik untuk mengaktifkannya untuk situs Anda

Alternatif: Ekstrak secara manual ke direktori `/themes/` dan segarkan panel admin.

---

### T: Unggahan theme gagal dengan "Izin ditolak"

**A:** Memperbaiki izin direktori theme:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### T: Bagaimana cara menetapkan theme berbeda untuk pengguna tertentu?

**J:**
1. Buka Manajer Pengguna > Edit Pengguna
2. Buka tab "Lainnya".
3. Pilih theme yang disukai di dropdown "theme Pengguna".
4. Simpan

theme yang dipilih pengguna menggantikan theme situs default.

---

### T: Bisakah saya memiliki theme berbeda untuk situs admin dan pengguna?

**A:** Ya, atur di XOOPS Admin > Pengaturan:

1. **theme front-end** - theme situs default
2. **theme Admin** - theme panel kontrol Admin (biasanya terpisah)

Cari pengaturan seperti:
- `theme_set` - theme bagian depan
- `admin_theme` - theme admin

---

## Kustomisasi theme

### T: Bagaimana cara menyesuaikan theme yang sudah ada?

**A:** Buat theme anak untuk mempertahankan pembaruan:

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

Kemudian edit `theme.html` di theme khusus Anda.

---

### T: Bagaimana cara mengubah warna theme?

**A:** Edit file CSS theme:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Untuk theme XOOPS:

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

### T: Bagaimana cara menambahkan CSS khusus ke theme?

**J:** Beberapa pilihan:

**Opsi 1: Edit theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Opsi 2: Buat custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Opsi 3: Pengaturan Admin (jika didukung)**
Buka XOOPS Admin > Pengaturan > Pengaturan theme dan tambahkan CSS khusus.

---

### T: Bagaimana cara memodifikasi template theme HTML?

**A:** Temukan file template:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Edit dengan sintaks Smarty yang tepat:

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

## Struktur theme

### Q: File apa saja yang diperlukan dalam sebuah theme?

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

Lihat Struktur theme untuk detailnya.

---

### T: Bagaimana cara membuat theme dari awal?

**A:** Buat struktur:

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

## Variabel theme

### Q: Variabel apa saja yang tersedia di template theme?

**A:** Variabel theme XOOPS yang umum:

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

### T: Bagaimana cara menambahkan variabel khusus ke theme saya?

**A:** Dalam kode PHP Anda sebelum rendering:

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

Dalam theme:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Penataan theme

### T: Bagaimana cara membuat theme saya responsif?

**A:** Gunakan CSS Grid atau Flexbox:

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

Atau gunakan integrasi Bootstrap:
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

### T: Bagaimana cara menambahkan mode gelap ke theme saya?

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

Beralih dengan JavaScript:
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

## Masalah theme

### T: theme menampilkan kesalahan "variabel template tidak dikenal".

**A:** Variabel tidak diteruskan ke template. Periksa:

1. **Variabel ditetapkan** di PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **template ada** jika ditentukan
3. **Sintaks template sudah benar**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### Q: Perubahan CSS tidak muncul di browser

**A:** Hapus cache browser:

1. Penyegaran keras: `Ctrl+Shift+R` (Cmd+Shift+R di Mac)
2. Hapus cache theme di server:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Periksa jalur file CSS di theme:
```bash
ls -la themes/mytheme/style.css
```

---

### Q: Gambar dalam theme tidak dimuat

**A:** Periksa jalur gambar:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### T: template theme hilang atau menyebabkan kesalahan

**A:** Lihat Kesalahan template untuk proses debug.

---

## Distribusi theme

### T: Bagaimana cara mengemas theme untuk didistribusikan?

**A:** Membuat zip yang dapat didistribusikan:

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

### T: Bisakah saya menjual theme XOOPS saya?**A:** Periksa lisensi XOOPS:
- theme yang menggunakan XOOPS classes/templates harus menghormati lisensi XOOPS
- theme CSS/HTML murni memiliki batasan lebih sedikit
- Periksa Pedoman Kontribusi XOOPS untuk detailnya

---

## Performa theme

### T: Bagaimana cara mengoptimalkan kinerja theme?

**J:**
1. **Minimalkan CSS/JS** - Hapus kode yang tidak digunakan
2. **Optimalkan gambar** - Gunakan format yang tepat (WebP, AVIF)
3. **Gunakan CDN** untuk sumber daya
4. **Pemuatan lambat** gambar:
```html
<img src="image.jpg" loading="lazy">
```

5. **Versi penghancur cache**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Lihat FAQ Kinerja untuk lebih jelasnya.

---

## Dokumentasi Terkait

- Kesalahan template
- Struktur theme
- FAQ Kinerja
- Proses Debug Smarty

---

#xoops #theme #faq #pemecahan masalah #penyesuaian
