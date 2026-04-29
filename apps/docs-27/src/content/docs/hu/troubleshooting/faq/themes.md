---
title: "Téma GYIK"
description: "Gyakran ismételt kérdések az XOOPS témákról"
---
# Téma Gyakran Ismételt Kérdések

> Gyakori kérdések és válaszok a XOOPS témákkal, testreszabással és kezeléssel kapcsolatban.

---

## Téma telepítése és aktiválása

### K: Hogyan telepíthetek új témát a XOOPS-ba?

**A:**
1. Töltse le a téma zip fájlját
2. Lépjen a XOOPS Adminisztráció > Megjelenés > Témák oldalra.
3. Kattintson a "Feltöltés" gombra, és válassza ki a zip fájlt
4. A téma megjelenik a témalistában
5. Kattintson ide, hogy aktiválja webhelyén

Alternatív megoldás: Csomagolja ki manuálisan a `/themes/` könyvtárba, és frissítse az adminisztrációs panelt.

---

### K: A téma feltöltése sikertelen, ha „Engedély megtagadva”

**V:** Témakönyvtár-engedélyek javítása:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### K: Hogyan állíthatok be más témát bizonyos felhasználókhoz?

**A:**
1. Válassza a Felhasználókezelő > Felhasználó szerkesztése menüpontot
2. Lépjen az "Egyéb" fülre
3. Válassza ki a kívánt témát a „Felhasználói téma” legördülő menüből
4. Mentés

A felhasználó által kiválasztott témák felülírják az alapértelmezett webhelytémát.

---

### K: Rendelhetek különböző témákat az adminisztrátori és felhasználói webhelyekhez?

**V:** Igen, beállítva: XOOPS Admin > Settings:

1. **Frontend téma** – Alapértelmezett webhelytéma
2. **Adminisztrációs téma** – Rendszergazdai vezérlőpult-téma (általában különálló)

Keressen olyan beállításokat, mint:
- `theme_set` - Frontend téma
- `admin_theme` - Admin téma

---

## Téma testreszabása

### K: Hogyan szabhatok testre egy meglévő témát?

**V:** Hozzon létre egy gyermektémát a frissítések megőrzéséhez:

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

Ezután szerkessze a `theme.html`-t az egyéni témában.

---

### K: Hogyan változtathatom meg a téma színeit?

**V:** Szerkessze a téma CSS fájlját:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

XOOPS témák esetén:

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

### K: Hogyan adhatok hozzá egyéni CSS-t egy témához?

**V:** Több lehetőség:

**1. lehetőség: theme.html szerkesztése**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**2. lehetőség: custom.css létrehozása**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**3. lehetőség: Adminisztrátori beállítások (ha támogatott)**
Lépjen a XOOPS Admin > Beállítások > Témabeállítások oldalra, és adjon hozzá egyéni CSS-t.

---

### K: Hogyan módosíthatom a HTML témasablonokat?

**V:** Keresse meg a sablonfájlt:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Szerkesztés megfelelő Smarty szintaxissal:

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

## A téma felépítése

### K: Milyen fájlok szükségesek egy témához?

**A:** Minimális szerkezet:

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

A részletekért lásd a téma felépítését.

---

### K: Hogyan hozhatok létre témát a semmiből?

**V:** Hozza létre a szerkezetet:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` létrehozása:
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

`style.css` létrehozása:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Témaváltozók

### K: Milyen változók érhetők el a témasablonokban?

**A:** Gyakori XOOPS témaváltozók:

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

### K: Hogyan adhatok egyéni változókat a témámhoz?

**V:** A PHP kódban a megjelenítés előtt:

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

A témában:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Téma stílus

### K: Hogyan tehetem reszponzívvá a témát?

**V:** A CSS Grid vagy Flexbox használata:

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

Vagy használja a Bootstrap integrációt:
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

### K: Hogyan adhatok hozzá sötét módot a témámhoz?

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

Váltás JavaScripttel:
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

## Témaproblémák

### K: A téma "felismerhetetlen sablonváltozó" hibákat mutat

**V:** A változó nem kerül átadásra a sablonba. Ellenőrizze:

1. **A változó hozzá van rendelve** a PHP-ban:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Sablon létezik**, ahol meg van adva
3. **A sablon szintaxisa helyes**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### K: CSS módosítások nem jelennek meg a böngészőben

**V:** A böngésző gyorsítótárának törlése:

1. Kemény frissítés: `Ctrl+Shift+R` (Cmd+Shift+R Macen)
2. Törölje a téma gyorsítótárát a szerveren:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Ellenőrizze a CSS fájl elérési útját a témában:
```bash
ls -la themes/mytheme/style.css
```

---

### K: A témában lévő képek nem töltődnek be

**V:** Képútvonalak ellenőrzése:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### K: Hiányoznak a témasablonok, vagy hibát okoznak

**V:** A hibakereséshez lásd: Sablonhibák.

---

## Téma terjesztése

### K: Hogyan csomagolhatok egy témát terjesztésre?

**V:** Hozzon létre egy terjeszthető zip-et:

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

### K: Eladhatom a XOOPS témám?

**V:** Ellenőrizze a XOOPS licencet:
- A XOOPS classes/templates-t használó témáknak tiszteletben kell tartaniuk a XOOPS licencet
- A tiszta CSS/HTML témákra kevesebb korlátozás vonatkozik
- Részletekért tekintse meg a XOOPS közreműködési útmutatót

---## Téma teljesítménye

### K: Hogyan optimalizálhatom a téma teljesítményét?

**A:**
1. ** Minimalizálja CSS/JS** - Távolítsa el a nem használt kódot
2. **Képek optimalizálása** - Használjon megfelelő formátumokat (WebP, AVIF)
3. **Használja a CDN** forrást
4. **Lazy load** képek:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust verziók**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

További részletekért lásd: Teljesítmény FAQ.

---

## Kapcsolódó dokumentáció

- Sablonhibák
- A téma felépítése
- Teljesítmény FAQ
- Okos hibakeresés

---

#xoops #témák #gyik #hibaelhárítás #testreszabás
