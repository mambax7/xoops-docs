---
title: "Često postavljana pitanja o temi"
description: "Često postavljana pitanja o XOOPS themes"
---
# tema Često postavljana pitanja

> Uobičajena pitanja i odgovori o XOOPS themes, prilagodbi i upravljanju.

---

## Instalacija i aktivacija teme

### P: Kako mogu instalirati novu temu u XOOPS?

**A:**
1. Preuzmite zip datoteku teme
2. Idite na XOOPS Admin > Izgled > teme
3. Kliknite "Učitaj" i odaberite zip datoteku
4. tema se pojavljuje na popisu tema
5. Kliknite da biste ga aktivirali za svoju stranicu

Alternativa: Ekstrahirajte ručno u direktorij `/themes/` i osvježite ploču admin.

---

### P: Prijenos teme nije uspio s "dozvola odbijena"

**A:** Ispravite dopuštenja direktorija tema:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### P: Kako mogu postaviti drugu temu za određene korisnike?

**A:**
1. Idite na Upravitelj korisnika > Uredi korisnika
2. Idite na karticu "Ostalo".
3. Odaberite željenu temu u padajućem izborniku "Korisnička tema".
4. Spremiti

Korisnički odabrani themes nadjačava zadanu temu stranice.

---

### P: Mogu li dobiti različite themes za admin i korisničke stranice?

**A:** Da, postavite u XOOPS Admin > Postavke:

1. **Frontend tema** - Zadana tema stranice
2. **tema administratora** - tema upravljačke ploče administratora (obično odvojena)

Potražite postavke poput:
- `theme_set` - tema sučelja
- `admin_theme` - Administratorska tema

---

## Prilagodba teme

### P: Kako mogu prilagoditi postojeću temu?

**O:** Stvorite podređenu temu za očuvanje ažuriranja:

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

Zatim uredite `theme.html` u svojoj prilagođenoj temi.

---

### P: Kako mogu promijeniti boje teme?

**A:** Uredite CSS datoteku teme:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Za XOOPS themes:

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

### P: Kako mogu dodati prilagođeni CSS u temu?

**A:** Nekoliko opcija:

**Opcija 1: Uredi theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Opcija 2: Stvorite custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Opcija 3: Administratorske postavke (ako su podržane)**
Idite na XOOPS Administrator > Postavke > Postavke teme i dodajte prilagođeni CSS.

---

### P: Kako mogu promijeniti temu HTML templates?

**A:** Pronađite datoteku predloška:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Uredite odgovarajućom sintaksom Smarty:

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

## Struktura teme

### P: Koje su datoteke potrebne u temi?

**A:** Minimalna struktura:

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

Pojedinosti potražite u strukturi teme.

---

### P: Kako mogu stvoriti temu od nule?

**A:** Napravite strukturu:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Izradi `theme.html`:
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

Kreirajte `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Varijable teme

### P: Koje su varijable dostupne u temi templates?

**A:** Uobičajene varijable teme XOOPS:

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

### P: Kako mogu dodati prilagođene varijable svojoj temi?

**A:** U vašem PHP kodu prije renderiranja:

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

U temi:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Stil teme

### P: Kako da svoju temu učinim responzivnom?

**A:** Koristite CSS Grid ili Flexbox:

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

Ili upotrijebite Bootstrap integraciju:
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

### P: Kako da svojoj temi dodam tamni način rada?

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

Prebaci sa JavaScript:
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

## Tematska pitanja

### P: tema prikazuje pogreške "neprepoznata varijabla predloška".

**O:** Varijabla se ne prosljeđuje u predložak. Provjeriti:1. **Varijabla je dodijeljena** u PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **predložak postoji** gdje je navedeno
3. **Sintaksa predloška je ispravna**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### P: CSS promjene se ne pojavljuju u pregledniku

**A:** Očisti preglednik cache:

1. Snažno osvježavanje: `Ctrl+Shift+R` (Cmd+Shift+R na Macu)
2. Obrišite temu cache na poslužitelju:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Provjerite put datoteke CSS u temi:
```bash
ls -la themes/mytheme/style.css
```

---

### P: Slike u temi se ne učitavaju

**A:** Provjerite putanje slike:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### P: tema templates nedostaje ili uzrokuje pogreške

**O:** Za otklanjanje pogrešaka pogledajte Pogreške predložaka.

---

## Distribucija tema

### P: Kako pakirati temu za distribuciju?

**A:** Stvorite zip koji se može distribuirati:

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

### P: Mogu li prodati svoju XOOPS temu?

**A:** Provjerite licencu XOOPS:
- teme koje koriste XOOPS classes/templates moraju poštivati licencu XOOPS
- Čisti CSS/HTML themes imaju manje ograničenja
- Provjerite XOOPS Smjernice za doprinos za detalje

---

## Tematska izvedba

### P: Kako mogu optimizirati izvedbu teme?

**A:**
1. **Minimiziraj CSS/JS** - Ukloni neiskorišteni kod
2. **Optimizirajte slike** - Koristite odgovarajuće formate (WebP, AVIF)
3. **Koristite CDN** za resurse
4. **Lazy load** slike:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust verzije**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Za više detalja pogledajte FAQ o izvedbi.

---

## Povezana dokumentacija

- Pogreške predloška
- Struktura teme
- Česta pitanja o izvedbi
- Smarty Otklanjanje pogrešaka

---

#xoops #themes #faq #troubleshooting #customization
