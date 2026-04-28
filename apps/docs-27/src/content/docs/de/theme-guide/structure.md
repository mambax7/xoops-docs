---
title: "Design-Struktur"
---

## Übersicht

XOOPS-Designs steuern die visuelle Darstellung Ihrer Webseite. Das Verständnis der Design-Struktur ist für die Anpassung und Erstellung neuer Designs unerlässlich.

## Verzeichnis-Layout

```
themes/mytheme/
├── theme.html                  # Hauptlayout-Template
├── theme.ini                   # Design-Konfiguration
├── theme_blockleft.html        # Linke Seitenleisten-Block-Template
├── theme_blockright.html       # Rechte Seitenleisten-Block-Template
├── theme_blockcenter_c.html    # Zentral-Block (zentriert)
├── theme_blockcenter_l.html    # Zentral-Block (links-ausgerichtet)
├── theme_blockcenter_r.html    # Zentral-Block (rechts-ausgerichtet)
├── css/
│   ├── style.css              # Hauptstylesheet
│   ├── admin.css              # Admin-Anpassungen (optional)
│   └── print.css              # Druck-Stylesheet (optional)
├── js/
│   └── theme.js               # Design-JavaScript
├── images/
│   ├── logo.png               # Webseiten-Logo
│   └── icons/                 # Design-Icons
├── language/
│   └── english/
│       └── main.php           # Design-Übersetzungen
├── modules/                    # Modul-Template Overrides
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Design-Vorschau-Bild
```

## Wesentliche Dateien

### theme.html

Das Hauptlayout-Template, das alle Inhalte umhüllt:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Modul-spezifische Header *}
    <{$xoops_module_header}>

    {* Design-Stylesheets *}
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/style.css">
</head>
<body class="<{$xoops_dirname}>">
    <header class="site-header">
        <a href="<{$xoops_url}>" class="logo">
            <img src="<{$xoops_url}>/themes/<{$xoops_theme}>/images/logo.png"
                 alt="<{$xoops_sitename}>">
        </a>
        <nav class="main-nav">
            <{$xoops_mainmenu}>
        </nav>
    </header>

    <div class="page-container">
        {* Linke Seitenleiste *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Hauptinhalt *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Rechte Seitenleiste *}
        <{if $xoops_showrblock == 1}>
        <aside class="sidebar-right">
            <{foreach item=block from=$xoops_rblocks}>
                <{include file="theme:theme_blockright.html"}>
            <{/foreach}>
        </aside>
        <{/if}>
    </div>

    <footer class="site-footer">
        <{$xoops_footer}>
    </footer>

    {* Modul-spezifische Footer *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

Design-Konfigurationsdatei:

```ini
[Theme]
name = "My Theme"
version = "1.0.0"
author = "Your Name"
license = "GPL-2.0"
description = "A modern responsive theme"

[Screenshots]
screenshot = "screenshot.png"

[Options]
responsive = true
bootstrap = false

[Settings]
primary_color = "#3498db"
secondary_color = "#2c3e50"
```

### Block-Templates

```html
{* theme_blockleft.html *}
<section class="block block-left" id="block-<{$block.id}>">
    <{if $block.title}>
        <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</section>
```

## Template-Variablen

### Globale Variablen

| Variable | Beschreibung |
|----------|-------------|
| `$xoops_sitename` | Webseiten-Name |
| `$xoops_url` | Webseiten-URL |
| `$xoops_theme` | Aktuelles Design-Name |
| `$xoops_langcode` | Sprach-Code |
| `$xoops_charset` | Zeichenkodierung |
| `$xoops_pagetitle` | Seitentitel |
| `$xoops_dirname` | Aktueller Modul-Name |

### Benutzer-Variablen

| Variable | Beschreibung |
|----------|-------------|
| `$xoops_isuser` | Ist angemeldet |
| `$xoops_isadmin` | Ist Administrator |
| `$xoops_userid` | Benutzer-ID |
| `$xoops_uname` | Benutzername |

### Layout-Variablen

| Variable | Beschreibung |
|----------|-------------|
| `$xoops_showlblock` | Linke Blöcke zeigen |
| `$xoops_showrblock` | Rechte Blöcke zeigen |
| `$xoops_showcblock` | Zentral-Blöcke zeigen |
| `$xoops_lblocks` | Linke Blöcke Array |
| `$xoops_rblocks` | Rechte Blöcke Array |
| `$xoops_contents` | Haupt-Seiteninhalt |

## Modul-Template Overrides

Überschreiben Sie Modul-Templates, indem Sie sie in Ihrem Design platzieren:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Überschreibt news-Modul-Index
    └── news_article.tpl    # Überschreibt Artikel-Anzeige
```

## CSS-Organisation

```css
/* css/style.css */

/* === Variablen === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Basis === */
body {
    font-family: system-ui, sans-serif;
    color: var(--text-color);
    background: var(--bg-color);
}

/* === Layout === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Komponenten === */
.block {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
}

.block-title {
    margin: 0 0 10px;
    font-size: 1.1em;
}

/* === Responsive === */
@media (max-width: 768px) {
    .page-container {
        grid-template-columns: 1fr;
    }

    .sidebar-left,
    .sidebar-right {
        order: 2;
    }
}
```

## Verwandte Dokumentation

- ../Templates/Smarty-Templating - Template-Syntax
- Theme-Development - Vollständiger Design-Leitfaden
- CSS-Best-Practices - Styling-Richtlinien
- ../../03-Module-Development/Block-Development - Blöcke erstellen
