---
title: "Thema FAQ"
description: "Veelgestelde vragen over XOOPS-thema's"
---
# Thema Veelgestelde vragen

> Veelgestelde vragen en antwoorden over XOOPS-thema's, maatwerk en beheer.

---

## Thema-installatie en -activering

### V: Hoe installeer ik een nieuw thema in XOOPS?

**EEN:**
1. Download het thema-zipbestand
2. Ga naar XOOPS Beheerder > Uiterlijk > Thema's
3. Klik op "Uploaden" en selecteer het zipbestand
4. Het thema verschijnt in de themalijst
5. Klik om het voor uw site te activeren

Alternatief: Pak het handmatig uit in de map `/themes/` en vernieuw het beheerdersdashboard.

---

### V: Thema-upload mislukt met 'Toestemming geweigerd'

**A:** Themamaprechten repareren:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### V: Hoe stel ik een ander thema in voor specifieke gebruikers?

**EEN:**
1. Ga naar Gebruikersbeheer > Gebruiker bewerken
2. Ga naar het tabblad "Overig".
3. Selecteer het gewenste thema in de vervolgkeuzelijst "Gebruikersthema".
4. Opslaan

Door de gebruiker geselecteerde thema's overschrijven het standaard sitethema.

---

### V: Kan ik verschillende thema's hebben voor beheerders- en gebruikerssites?

**A:** Ja, ingesteld in XOOPS Beheerder > Instellingen:

1. **Frontendthema** - Standaard sitethema
2. **Beheerderthema** - Thema voor het beheerdersdashboard (meestal afzonderlijk)

Zoek naar instellingen zoals:
- `theme_set` - Frontend-thema
- `admin_theme` - Beheerderthema

---

## Themaaanpassing

### V: Hoe pas ik een bestaand thema aan?

**A:** Maak een child-thema om updates te behouden:

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

Bewerk vervolgens `theme.html` in uw aangepaste thema.

---

### V: Hoe wijzig ik de themakleuren?

**A:** Bewerk het CSS-bestand van het thema:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

Voor XOOPS-thema's:

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

### V: Hoe voeg ik aangepaste CSS toe aan een thema?

**A:** Verschillende opties:

**Optie 1: theme.html bewerken**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Optie 2: custom.css aanmaken**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Optie 3: Beheerdersinstellingen (indien ondersteund)**
Ga naar XOOPS Beheerder > Instellingen > Thema-instellingen en voeg aangepaste CSS toe.

---

### V: Hoe wijzig ik de thema-HTML-sjablonen?

**A:** Zoek het sjabloonbestand:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Bewerken met de juiste Smarty-syntaxis:

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

## Themastructuur

### V: Welke bestanden zijn vereist in een thema?

**A:** Minimale structuur:

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

Zie Themastructuur voor details.

---

### V: Hoe maak ik een geheel nieuw thema?

**A:** Maak de structuur:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

`theme.html` aanmaken:
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

`style.css` aanmaken:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Themavariabelen

### V: Welke variabelen zijn beschikbaar in themasjablonen?

**A:** Algemene XOOPS-themavariabelen:

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

### V: Hoe voeg ik vrije variabelen toe aan mijn thema?

**A:** In uw PHP-code vóór weergave:

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

In thema:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Themastijl

### V: Hoe maak ik mijn thema responsief?

**A:** Gebruik CSS Grid of Flexbox:

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

Of gebruik Bootstrap-integratie:
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

### V: Hoe voeg ik een donkere modus toe aan mijn thema?

**EEN:**
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

Schakelen met JavaScript:
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

## Themaproblemen

### V: Thema toont "niet-herkende sjabloonvariabele"-fouten

**A:** De variabele wordt niet doorgegeven aan de sjabloon. Controleer:

1. **Variabele is toegewezen** in PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Sjabloon bestaat** waar gespecificeerd
3. **Sjabloonsyntaxis is correct**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### Q: CSS wijzigingen verschijnen niet in de browser

**A:** Browsercache wissen:

1. Hard vernieuwen: `Ctrl+Shift+R` (Cmd+Shift+R op Mac)
2. Wis de themacache op de server:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Controleer het CSS-bestandspad in het thema:
```bash
ls -la themes/mytheme/style.css
```

---

### V: Afbeeldingen in thema worden niet geladen

**A:** Controleer afbeeldingspaden:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### V: Themasjablonen ontbreken of veroorzaken fouten

**A:** Zie Sjabloonfouten voor foutopsporing.

---

## Themadistributie

### V: Hoe verpak ik een thema voor distributie?

**A:** Maak een distribueerbare zip:

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

### V: Kan ik mijn XOOPS-thema verkopen?

**A:** Controleer de XOOPS-licentie:
- Thema's die XOOPS-klassen/-sjablonen gebruiken, moeten de XOOPS-licentie respecteren
- Pure CSS/HTML-thema's hebben minder beperkingen
- Raadpleeg de XOOPS richtlijnen voor bijdragen voor meer informatie

---

## Themaprestaties### V: Hoe optimaliseer ik de prestaties van thema's?

**EEN:**
1. **Minimaliseer CSS/JS** - Verwijder ongebruikte code
2. **Afbeeldingen optimaliseren** - Gebruik de juiste formaten (WebP, AVIF)
3. **Gebruik CDN** voor bronnen
4. **Lazy load** afbeeldingen:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust-versies**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Zie Prestaties FAQ voor meer details.

---

## Gerelateerde documentatie

- Sjabloonfouten
- Themastructuur
- Prestaties FAQ
- Slimme foutopsporing

---

#xoops #themes #faq #probleemoplossing #maatwerk