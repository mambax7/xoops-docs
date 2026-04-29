---
title: "theme FAQ"
description: "XOOPS temaları hakkında sık sorulan sorular"
---
# theme Sıkça Sorulan Sorular

> XOOPS temaları, özelleştirme ve yönetim hakkında sık sorulan sorular ve yanıtlar.

---

## theme Kurulumu ve Etkinleştirilmesi

### S: XOOPS'ye yeni bir temayı nasıl yüklerim?

**C:**
1. theme zip dosyasını indirin
2. XOOPS Yönetici > Görünüm > themes'a gidin
3. "Yükle"ye tıklayın ve zip dosyasını seçin
4. theme, theme listesinde görünür
5. Siteniz için etkinleştirmek üzere tıklayın

Alternatif: Manuel olarak `/themes/` dizinine çıkartın ve yönetici panelini yenileyin.

---

### S: theme yükleme işlemi "İzin reddedildi" hatasıyla başarısız oluyor

**C:** theme dizini izinlerini düzeltin:
```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```
---

### S: Belirli users için farklı bir temayı nasıl ayarlarım?

**C:**
1. user Yöneticisi > Kullanıcıyı Düzenle'ye gidin
2. "Diğer" sekmesine gidin
3. "user Teması" açılır menüsünden tercih ettiğiniz temayı seçin
4. Kaydet

user tarafından seçilen themes, varsayılan site temasını geçersiz kılar.

---

### S: Yönetici ve user siteleri için farklı temalara sahip olabilir miyim?

**C:** Evet, XOOPS Yönetici > Ayarlar'da ayarlayın:

1. **Ön uç teması** - Varsayılan site teması
2. **Yönetici teması** - Yönetici kontrol paneli teması (genellikle ayrıdır)

Şunun gibi ayarları arayın:
- `theme_set` - Ön uç teması
- `admin_theme` - Yönetici teması

---

## theme Özelleştirme

### S: Mevcut bir temayı nasıl özelleştiririm?

**C:** Güncellemeleri korumak için bir alt theme oluşturun:
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
Daha sonra özel temanızda `theme.html`'yi düzenleyin.

---

### S: theme renklerini nasıl değiştiririm?

**C:** Temanın CSS dosyasını düzenleyin:
```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```
XOOPS temaları için:
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

### S: Bir temaya özel CSS'yi nasıl eklerim?

**C:** Çeşitli seçenekler:

**Seçenek 1: theme.html'yi düzenleyin**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```
**Seçenek 2: Custom.css oluşturun**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```
**Seçenek 3: Yönetici Ayarları (destekleniyorsa)**
XOOPS Yönetici > Ayarlar > theme Ayarları'na gidin ve özel CSS ekleyin.

---

### S: theme HTML şablonlarını nasıl değiştiririm?

**C:** template dosyasını bulun:
```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```
Uygun Smarty sözdizimiyle düzenleyin:
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

## theme Yapısı

### S: Bir temada hangi dosyalar gereklidir?

**A:** Minimum yapı:
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
Ayrıntılar için theme Yapısına bakın.

---

### S: Sıfırdan nasıl theme oluşturabilirim?

**A:** Yapıyı oluşturun:
```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```
`theme.html` oluşturun:
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
`style.css` oluşturun:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```
---

## theme Değişkenleri

### S: theme şablonlarında hangi değişkenler mevcut?

**A:** Ortak XOOPS theme değişkenleri:
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

### S: Temama özel değişkenleri nasıl eklerim?

**A:** Oluşturmadan önce PHP kodunuzda:
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
Temada:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```
---

## theme Şekillendirme

### S: Temamı nasıl duyarlı hale getirebilirim?

**A:** CSS Grid veya Flexbox kullanın:
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
Veya Bootstrap entegrasyonunu kullanın:
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

### S: Temama karanlık modu nasıl eklerim?

**A:**
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
JavaScript ile geçiş yapın:
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

## theme Sorunları

### S: theme "tanınmayan template değişkeni" hataları gösteriyor

**C:** Değişken şablona aktarılmıyor. Kontrol edin:

1. **PH000000¤'de **değişken atanır**:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```
2. **template mevcuttur**, belirtildiği yerde
3. **template söz dizimi doğrudur**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```
---

### S: CSS değişiklikleri tarayıcıda görünmüyor

**C:** Tarayıcı önbelleğini temizle:

1. Sert yenileme: `Ctrl+Shift+R` (Mac'te Cmd+Shift+R)
2. Sunucudaki theme önbelleğini temizleyin:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```
3. Temadaki CSS dosya yolunu kontrol edin:
```bash
ls -la themes/mytheme/style.css
```
---

### S: Temadaki görseller yüklenmiyor

**C:** Resim yollarını kontrol edin:
```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```
---

### S: theme şablonları eksik veya hatalara neden oluyor

**C:** Hata ayıklama için template Hatalarına bakın.

---

## theme Dağıtımı

### S: Bir temayı dağıtım için nasıl paketleyebilirim?

**C:** Dağıtılabilir bir zip oluşturun:
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

### S: XOOPS temamı satabilir miyim?

**A:** XOOPS lisansını kontrol edin:
- XOOPS classes/templates kullanan themes XOOPS lisansına uymalıdır
- Pure CSS/HTML temalarının daha az kısıtlaması vardır
- Ayrıntılar için XOOPS Katkıda Bulunma Kurallarını kontrol edin

---

## theme Performansı

### S: theme performansını nasıl optimize edebilirim?

**C:**
1. **CSS/JS'yi küçültün** - Kullanılmayan kodu kaldırın
2. **Resimleri optimize edin** - Uygun formatları kullanın (WebP, AVIF)
3. **Kaynaklar için CDN** kullanın
4. **Tembel yükleme** görselleri:
```html
<img src="image.jpg" loading="lazy">
```
5. **cache engelleme sürümleri**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```
Daha fazla ayrıntı için Performans FAQ'ye bakın.

---

## İlgili Belgeler

- template Hataları
- theme Yapısı
- Performans FAQ
- Smarty Hata ayıklama

---

#xoops #themes #sss #sorun giderme #özelleştirme