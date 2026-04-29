---
title: "Struktura tématu"
---

## Přehled

Motivy XOOPS ovládají vizuální prezentaci vašeho webu. Pochopení struktury motivu je nezbytné pro přizpůsobení a vytváření nových motivů.

## Rozložení adresáře

```
themes/mytheme/
├── theme.html                  # Main layout template
├── theme.ini                   # Theme configuration
├── theme_blockleft.html        # Left sidebar block template
├── theme_blockright.html       # Right sidebar block template
├── theme_blockcenter_c.html    # Center block (centered)
├── theme_blockcenter_l.html    # Center block (left-aligned)
├── theme_blockcenter_r.html    # Center block (right-aligned)
├── css/
│   ├── style.css              # Main stylesheet
│   ├── admin.css              # Admin customizations (optional)
│   └── print.css              # Print stylesheet (optional)
├── js/
│   └── theme.js               # Theme JavaScript
├── images/
│   ├── logo.png               # Site logo
│   └── icons/                 # Theme icons
├── language/
│   └── english/
│       └── main.php           # Theme translations
├── modules/                    # Module template overrides
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Theme preview image
```

## Základní soubory

### theme.html

Hlavní šablona rozvržení, která obaluje veškerý obsah:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Module-specific headers *}
    <{$xoops_module_header}>

    {* Theme stylesheets *}
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
        {* Left sidebar *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Main content *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Right sidebar *}
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

    {* Module-specific footers *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

Konfigurační soubor motivu:

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

### Šablony bloků

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

## Proměnné šablony

### Globální proměnné

| Proměnná | Popis |
|----------|-------------|
| `$xoops_sitename` | Název webu |
| `$xoops_url` | Místo URL |
| `$xoops_theme` | Název aktuálního tématu |
| `$xoops_langcode` | Kód jazyka |
| `$xoops_charset` | Kódování znaků |
| `$xoops_pagetitle` | Název stránky |
| `$xoops_dirname` | Název aktuálního modulu |

### Uživatelské proměnné

| Proměnná | Popis |
|----------|-------------|
| `$xoops_isuser` | Je přihlášen |
| `$xoops_isadmin` | Je správce |
| `$xoops_userid` | ID uživatele |
| `$xoops_uname` | Uživatelské jméno |

### Proměnné rozložení

| Proměnná | Popis |
|----------|-------------|
| `$xoops_showlblock` | Zobrazit levé bloky |
| `$xoops_showrblock` | Zobrazit pravé bloky |
| `$xoops_showcblock` | Zobrazit středové bloky |
| `$xoops_lblocks` | Pole levých bloků |
| `$xoops_rblocks` | Pravé pole bloků |
| `$xoops_contents` | Hlavní obsah stránky |

## Přepsání šablony modulu

Přepište šablony modulů jejich umístěním do motivu:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```

## Organizace CSS

```css
/* css/style.css */

/* === Variables === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Base === */
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

/* === Components === */
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

## Související dokumentace

- ../Templates/Smarty-Templating - Syntaxe šablony
- Vývoj tématu - Kompletní průvodce tématem
- CSS-Best-Practices - Pokyny pro styling 
- ../../03-Module-Development/Block-Development - Vytváření bloků