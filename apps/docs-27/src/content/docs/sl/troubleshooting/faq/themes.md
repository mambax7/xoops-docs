---
title: "Tema FAQ"
description: "Pogosta vprašanja o XOOPS temah"
---
# Tema Pogosta vprašanja

> Pogosta vprašanja in odgovori o XOOPS temah, prilagajanju in upravljanju.

---

## Namestitev in aktivacija teme

### V: Kako namestim novo temo v XOOPS?

**A:**
1. Prenesite zip datoteko teme
2. Pojdite na XOOPS Skrbnik > Videz > Teme
3. Kliknite »Naloži« in izberite datoteko zip
4. Tema se prikaže na seznamu tem
5. Kliknite, da ga aktivirate za svoje spletno mesto

Alternativa: ročno ekstrahirajte v imenik `/themes/` in osvežite skrbniško ploščo.

---

### V: Nalaganje teme ni uspelo z "Dovoljenje zavrnjeno"

**A:** Popravite dovoljenja imenika tem:
```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```
---

### V: Kako nastavim drugo temo za določene uporabnike?

**A:**
1. Pojdite na Upravitelj uporabnikov > Uredi uporabnika
2. Pojdite na zavihek "Drugo".
3. V spustnem meniju »Uporabniška tema« izberite želeno temo
4. Shrani

Teme, ki jih izberejo uporabniki, preglasijo privzeto temo spletnega mesta.

---

### V: Ali lahko imam različne teme za skrbniška in uporabniška mesta?

**A:** Da, nastavite v XOOPS Admin > Settings:

1. **Frontend tema** - Privzeta tema spletnega mesta
2. **Skrbniška tema** - Tema skrbniške nadzorne plošče (običajno ločena)

Poiščite nastavitve, kot so:
- `theme_set` - Frontend tema
- `admin_theme` - Administratorska tema

---

## Prilagoditev teme

### V: Kako prilagodim obstoječo temo?

**A:** Ustvarite podrejeno temo, da ohranite posodobitve:
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
Nato uredite `theme.html` v svoji temi po meri.

---

### V: Kako spremenim barve teme?

**A:** Uredite datoteko CSS teme:
```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```
Za XOOPS tem:
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

### V: Kako temi dodam CSS po meri?

**A:** Več možnosti:

**1. možnost: Uredi theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```
**2. možnost: ustvarite custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```
**3. možnost: skrbniške nastavitve (če so podprte)**
Pojdite na XOOPS Admin > Nastavitve > Nastavitve teme in dodajte CSS po meri.

---

### V: Kako spremenim predloge teme HTML?

**A:** Poiščite datoteko predloge:
```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```
Uredite s pravilno sintakso Smarty:
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

### V: Katere datoteke so potrebne v temi?

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
Za podrobnosti glejte strukturo teme.

---

### V: Kako ustvarim temo iz nič?

**A:** Ustvarite strukturo:
```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```
Ustvari `theme.html`:
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
Ustvari `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```
---

## Spremenljivke teme

### V: Katere spremenljivke so na voljo v predlogah tem?

**A:** Pogoste XOOPS spremenljivke teme:
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

### V: Kako svoji temi dodam spremenljivke po meri?

**A:** V vaši kodi PHP pred upodabljanjem:
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
V temi:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```
---

## Oblikovanje teme

### V: Kako naredim svojo temo odzivno?

**A:** Uporabite CSS Grid ali Flexbox:
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
Ali pa uporabite integracijo Bootstrap:
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

### V: Kako svoji temi dodam temni način?

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
Preklopi z JavaScriptom:
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

## Tematska vprašanja

### V: Tema prikazuje napake "neprepoznana spremenljivka predloge".

**O:** Spremenljivka ni posredovana predlogi. Preverite:

1. **Spremenljivka je dodeljena** v PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```
2. **Predloga obstaja**, kjer je navedeno
3. **Sintaksa predloge je pravilna**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```
---

### V: CSS spremembe se ne prikažejo v brskalniku

**A:** Počisti predpomnilnik brskalnika:

1. Trda osvežitev: `Ctrl+Shift+R` (Cmd+Shift+R na Macu)
2. Počistite predpomnilnik teme na strežniku:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```
3. Preverite CSS pot datoteke v temi:
```bash
ls -la themes/mytheme/style.css
```
---

### V: Slike v temi se ne naložijo

**A:** Preverite poti slik:
```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```
---

### V: Predloge tem manjkajo ali povzročajo napake

**O:** Glejte Napake predloge za odpravljanje napak.

---

## Distribucija tem

### V: Kako zapakiram temo za distribucijo?

**A:** Ustvarite zip za distribucijo:
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

### V: Ali lahko prodam svojo temo XOOPS?

**A:** Preverite licenco XOOPS:
- Teme, ki uporabljajo XOOPS classes/templates, morajo upoštevati licenco XOOPS
- Čiste teme CSS/HTML imajo manj omejitev
- Preverite XOOPS Smernice za prispevanje za podrobnosti

---

## Tematska predstava

### V: Kako optimiziram delovanje teme?

**A:**
1. **Minimiziraj CSS/JS** - Odstrani neuporabljeno kodo
2. **Optimizirajte slike** - uporabite ustrezne formate (WebP, AVIF)
3. **Uporabite CDN** za vire
4. Slike **Lazy load**:
```html
<img src="image.jpg" loading="lazy">
```
5. **Cache-bust različice**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```
Glejte Zmogljivost FAQ za več podrobnosti.

---

## Povezana dokumentacija

- Napake predloge
- Struktura teme
- Zmogljivost FAQ
- Pametno odpravljanje napak

---

#XOOPS #themes #faq #troubleshooting #customization