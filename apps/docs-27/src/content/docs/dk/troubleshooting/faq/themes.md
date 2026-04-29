---
title: "Tema FAQ"
description: "Ofte stillede spørgsmål om XOOPS-temaer"
---

# Tema ofte stillede spørgsmål

> Almindelige spørgsmål og svar om XOOPS-temaer, tilpasning og administration.

---

## Temainstallation og aktivering

### Q: Hvordan installerer jeg et nyt tema i XOOPS?

**A:**
1. Download tema-zip-filen
2. Gå til XOOPS Admin > Udseende > Temaer
3. Klik på "Upload", og vælg zip-filen
4. Temaet vises på temalisten
5. Klik for at aktivere det til dit websted

Alternativ: Udpak manuelt i mappen `/themes/` og opdater adminpanelet.

---

### Sp.: Temaupload mislykkes med "Permission denied"

**A:** Ret temabibliotekstilladelser:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Q: Hvordan indstiller jeg et andet tema for specifikke brugere?

**A:**
1. Gå til Brugeradministrator > Rediger bruger
2. Gå til fanen "Andet".
3. Vælg foretrukket tema i rullemenuen "Brugertema".
4. Gem

Brugervalgte temaer tilsidesætter standardwebstedets tema.

---

### Q: Kan jeg have forskellige temaer til admin- og brugerwebsteder?

**A:** Ja, indstil i XOOPS Admin > Indstillinger:

1. **Frontend-tema** - Standard webstedstema
2. **Administrationstema** - Administratorkontrolpaneltema (normalt separat)

Se efter indstillinger som:
- `theme_set` - Frontend-tema
- `admin_theme` - Admin tema

---

## Tematilpasning

### Q: Hvordan tilpasser jeg et eksisterende tema?

**A:** Opret et underetema for at bevare opdateringer:

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

Rediger derefter `theme.html` i dit brugerdefinerede tema.

---

### Q: Hvordan ændrer jeg temafarverne?

**A:** Rediger temaets CSS-fil:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

For XOOPS-temaer:

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

### Q: Hvordan føjer jeg brugerdefineret CSS til et tema?

**A:** Flere muligheder:

**Mulighed 1: Rediger theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Mulighed 2: Opret custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Mulighed 3: Admin-indstillinger (hvis understøttet)**
Gå til XOOPS Admin > Indstillinger > Temaindstillinger og tilføj brugerdefineret CSS.

---

### Q: Hvordan ændrer jeg tema HTML skabeloner?

**A:** Find skabelonfilen:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Rediger med korrekt Smarty-syntaks:

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

## Temastruktur

### Q: Hvilke filer kræves i et tema?

**A:** Minimum struktur:

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

Se Temastruktur for detaljer.

---

### Q: Hvordan opretter jeg et tema fra bunden?

**A:** Opret strukturen:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Opret `theme.html`:
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

Opret `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Temavariabler

### Q: Hvilke variabler er tilgængelige i temaskabeloner?

**A:** Almindelige XOOPS-temavariabler:

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

### Q: Hvordan tilføjer jeg brugerdefinerede variabler til mit tema?

**A:** I din PHP-kode før gengivelse:

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

I tema:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Tema Styling

### Q: Hvordan gør jeg mit tema responsivt?

**A:** Brug CSS Grid eller Flexbox:

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

Eller brug Bootstrap-integration:
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

### Q: Hvordan føjer jeg en mørk tilstand til mit tema?

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

Skift med JavaScript:
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

## Temaproblemer

### Sp.: Temaet viser fejl med "ikke-genkendt skabelonvariabel".

**A:** Variablen sendes ikke til skabelonen. Tjek:

1. **Variabel er tildelt** i PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Skabelon findes** hvor det er angivet
3. **Skabelonsyntaks er korrekt**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### Q: CSS ændringer vises ikke i browseren

**A:** Ryd browsercache:

1. Hård opdatering: `Ctrl+Shift+R` (Cmd+Shift+R på Mac)
2. Ryd temacache på serveren:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Tjek CSS filsti i temaet:
```bash
ls -la themes/mytheme/style.css
```

---

### Q: Billeder i temaet indlæses ikke

**A:** Tjek billedstier:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### Q: Temaskabeloner mangler eller forårsager fejl

**A:** Se skabelonfejl for fejlretning.

---

## Temadistribution

### Q: Hvordan pakker jeg et tema til distribution?

**A:** Opret en distribuerbar zip:

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

### Q: Kan jeg sælge mit XOOPS-tema?

**A:** Tjek XOOPS licens:
- Temaer, der bruger XOOPS klasser/skabeloner skal respektere XOOPS licens
- Rene CSS/HTML-temaer har færre begrænsninger
- Se XOOPS Contributing Guidelines for detaljer

---

## Temaforestilling### Sp.: Hvordan optimerer jeg temaets ydeevne?

**A:**
1. **Minimer CSS/JS** - Fjern ubrugt kode
2. **Optimer billeder** - Brug korrekte formater (WebP, AVIF)
3. **Brug CDN** til ressourcer
4. **Doven indlæsning** billeder:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust versioner**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Se Ydelse FAQ for flere detaljer.

---

## Relateret dokumentation

- Skabelonfejl
- Temastruktur
- Ydeevne FAQ
- Smart fejlretning

---

#xoops #temaer #faq #fejlfinding #tilpasning
