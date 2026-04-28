---
title: "FAQ temi"
description: "Domande frequenti sui temi XOOPS"
---

# Domande frequenti sui temi

> Domande e risposte comuni sui temi XOOPS, la personalizzazione e la gestione.

---

## Installazione e attivazione del tema

### D: Come installo un nuovo tema in XOOPS?

**R:**
1. Download the theme zip file
2. Go to XOOPS Admin > Appearance > Themes
3. Click "Upload" and select the zip file
4. The theme appears in the theme list
5. Click to activate it for your site

Alternative: Extract manually into `/themes/` directory and refresh admin panel.

---

### D: Il caricamento del tema non riesce con "Permesso negato"

**R:** Correggi le autorizzazioni della directory del tema:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### D: Come imposto un tema diverso per utenti specifici?

**R:**
1. Go to User Manager > Edit User
2. Go to "Other" tab
3. Select preferred theme in "User Theme" dropdown
4. Save

User-selected themes override the default site theme.

---

### D: Posso avere temi diversi per i siti di amministrazione e utenti?

**R:** Sì, imposta in XOOPS Admin > Settings:

1. **Frontend theme** - Default site theme
2. **Admin theme** - Admin control panel theme (usually separate)

Look for settings like:
- `theme_set` - Frontend theme
- `admin_theme` - Admin theme

---

## Personalizzazione del tema

### D: Come personalizzo un tema esistente?

**R:** Crea un tema figlio per preservare gli aggiornamenti:

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

Then edit `theme.html` in your custom theme.

---

### D: Come cambio i colori del tema?

**R:** Modifica il file CSS del tema:

```bash
# Locate theme CSS
themes/mytheme/style.css

# Or theme template
themes/mytheme/theme.html
```

For XOOPS themes:

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

### D: Come aggiungo CSS personalizzato a un tema?

**R:** Diverse opzioni:

**Option 1: Edit theme.html**
```html
<!-- themes/mytheme/theme.html -->
<head>
    {* Existing CSS *}
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/custom.css">
</head>
```

**Option 2: Create custom.css**
```bash
# Create file
themes/mytheme/custom.css

# Add your styles
body { background: #fff; }
```

**Option 3: Admin Settings (if supported)**
Go to XOOPS Admin > Settings > Theme Settings and add custom CSS.

---

### D: Come modifico i template HTML del tema?

**R:** Individua il file del template:

```bash
# List theme templates
ls -la themes/mytheme/templates/

# Common templates
themes/mytheme/templates/theme.html      {* Main layout *}
themes/mytheme/templates/header.html     {* Header *}
themes/mytheme/templates/footer.html     {* Footer *}
themes/mytheme/templates/sidebar.html    {* Sidebar *}
```

Edit with proper Smarty syntax:

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

## Struttura del tema

### D: Quali file sono richiesti in un tema?

**R:** Struttura minima:

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

See Theme Structure for details.

---

### D: Come creo un tema da zero?

**R:** Crea la struttura:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Create `theme.html`:
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

Create `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Variabili del tema

### D: Quali variabili sono disponibili nei template del tema?

**R:** Variabili comuni del tema XOOPS:

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

### D: Come aggiungo variabili personalizzate al mio tema?

**R:** Nel codice PHP prima del rendering:

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

In theme:
```smarty
<p>{$my_variable}</p>
<p>{$data_array.key1}</p>
```

---

## Stile del tema

### D: Come rendo il mio tema reattivo?

**R:** Usa CSS Grid o Flexbox:

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

Or use Bootstrap integration:
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

### D: Come aggiungo una modalità scura al mio tema?

**R:**
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

Toggle with JavaScript:
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

## Problemi del tema

### D: Il tema mostra errori "unrecognized template variable"

**R:** La variabile non viene passata al template. Controlla:

1. **Variable is assigned** in PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Template exists** where specified
3. **Template syntax is correct**:
```smarty
{* Correct *}
{$variable_name}

{* Wrong *}
$variable_name
{variable_name}
```

---

### D: Le modifiche CSS non vengono visualizzate nel browser

**R:** Cancella la cache del browser:

1. Hard refresh: `Ctrl+Shift+R` (Cmd+Shift+R on Mac)
2. Clear theme cache on server:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Check CSS file path in theme:
```bash
ls -la themes/mytheme/style.css
```

---

### D: Le immagini nel tema non si caricano

**R:** Controlla i percorsi dell'immagine:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### D: Mancano i template del tema o causano errori

**R:** Consulta Errori del template per il debug.

---

## Distribuzione del tema

### D: Come pacchetto un tema per la distribuzione?

**R:** Crea uno zip distribuibile:

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

### D: Posso vendere il mio tema XOOPS?

**R:** Controlla la licenza XOOPS:
- Themes using XOOPS classes/templates must respect XOOPS license
- Pure CSS/HTML themes have fewer restrictions
- Check XOOPS Contributing Guidelines for details

---

## Prestazioni del tema

### D: Come ottimizzole le prestazioni del tema?

**R:**
1. **Minimize CSS/JS** - Remove unused code
2. **Optimize images** - Use proper formats (WebP, AVIF)
3. **Use CDN** for resources
4. **Lazy load** images:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-bust versions**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

See Performance FAQ for more details.

---

## Documentazione correlata

- Errori del template
- Struttura del tema
- FAQ prestazioni
- Debug di Smarty

---

#xoops #themes #faq #troubleshooting #customization
