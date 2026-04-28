---
title: "Theme-FAQ"
description: "Häufig gestellte Fragen zu XOOPS-Themes"
---

# Theme - Häufig gestellte Fragen

> Allgemeine Fragen und Antworten zu XOOPS-Themes, Anpassung und Verwaltung.

---

## Theme-Installation & Aktivierung

### F: Wie installiere ich ein neues Theme in XOOPS?

**A:**
1. Theme-ZIP-Datei herunterladen
2. Gehen Sie zu XOOPS Admin > Darstellung > Designs
3. Klicken Sie auf "Hochladen" und wählen Sie die ZIP-Datei
4. Das Design wird in der Designliste angezeigt
5. Klicken Sie, um es für Ihre Website zu aktivieren

Alternative: Extrahieren Sie manuell in das Verzeichnis `/themes/` und aktualisieren Sie das Admin-Panel.

---

### Q: Theme upload fails with "Permission denied"

**A:** Beheben Sie die Berechtigungen für das Design-Verzeichnis:

```bash
# Make themes directory writable
chmod 755 /path/to/xoops/themes

# Fix uploads if uploading
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Q: How do I set a different theme for specific users?

**A:**
1. Gehen Sie zu Benutzerverwaltung > Benutzer bearbeiten
2. Gehen Sie zur Registerkarte "Sonstiges"
3. Wählen Sie das bevorzugte Design in der Dropdown-Liste "Benutzerdesign"
4. Speichern Sie

Vom Benutzer ausgewählte Designs überschreiben das Standard-Website-Design.

---

### Q: Can I have different themes for admin and user sites?

**A:** Ja, setzen Sie in XOOPS Admin > Einstellungen:

1. **Frontend theme** - Default site theme
2. **Admin theme** - Admin control panel theme (usually separate)

Look for settings like:
- `theme_set` - Frontend theme
- `admin_theme` - Admin theme

---

## Design-Anpassung

### F: Wie passe ich ein vorhandenes Design an?

**A:** Erstellen Sie ein untergeordnetes Design, um Updates zu bewahren:

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

### Q: How do I change the theme colors?

**A:** Bearbeiten Sie die CSS-Datei des Designs:

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

### Q: How do I add custom CSS to a theme?

**A:** Mehrere Optionen:

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

### Q: How do I modify theme HTML templates?

**A:** Suchen Sie die Template-Datei:

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

## Design-Struktur

### F: Welche Dateien sind in einem Design erforderlich?

**A:** Mindeststruktur:

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

### Q: How do I create a theme from scratch?

**A:** Erstellen Sie die Struktur:

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

## Theme Variables

### Q: What variables are available in theme templates?

**A:** Common XOOPS theme variables:

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

### Q: How do I add custom variables to my theme?

**A:** In Ihrem PHP-Code vor dem Rendern:

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

## Design-Stil

### F: Wie mache ich mein Design responsiv?

**A:** Verwenden Sie CSS Grid oder Flexbox:

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

### F: Wie füge ich meinem Design einen dunklen Modus hinzu?

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

## Design-Probleme

### F: Das Design zeigt Fehler "unbekannte Template-Variable"

**A:** Die Variable wird nicht an das Template übergeben. Überprüfen Sie:

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

### F: CSS-Änderungen werden nicht im Browser angezeigt

**A:** Löschen Sie den Browser-Cache:

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

### F: Bilder im Design werden nicht geladen

**A:** Überprüfen Sie Bildpfade:

```html
{* WRONG - relative path from web root *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - use xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Or in CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

### Q: Theme templates missing or causing errors

**A:** See Template Errors for debugging.

---

## Design-Verteilung

### F: Wie verpacke ich ein Design zur Verteilung?

**A:** Erstellen Sie eine verteilbare ZIP-Datei:

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

### F: Kann ich mein XOOPS-Design verkaufen?

**A:** Überprüfen Sie die XOOPS-Lizenz:
- Themes using XOOPS classes/templates must respect XOOPS license
- Pure CSS/HTML themes have fewer restrictions
- Check XOOPS Contributing Guidelines for details

---

## Design-Leistung

### F: Wie optimiere ich die Design-Leistung?

**A:**
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

## Zugehörige Dokumentation

- Template-Fehler
- Design-Struktur
- Performance-FAQ
- Smarty-Debugging

---

#xoops #themes #faq #troubleshooting #customization
