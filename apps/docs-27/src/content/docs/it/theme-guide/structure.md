---
title: "Struttura del tema"
---

## Panoramica

I temi XOOPS controllano la presentazione visiva del tuo sito. Comprendere la struttura del tema è essenziale per la personalizzazione e la creazione di nuovi temi.

## Layout della directory

```
themes/mytheme/
├── theme.html                  # Template di layout principale
├── theme.ini                   # Configurazione del tema
├── theme_blockleft.html        # Template blocco barra laterale sinistra
├── theme_blockright.html       # Template blocco barra laterale destra
├── theme_blockcenter_c.html    # Blocco centrale (centrato)
├── theme_blockcenter_l.html    # Blocco centrale (allineato a sinistra)
├── theme_blockcenter_r.html    # Blocco centrale (allineato a destra)
├── css/
│   ├── style.css              # Foglio di stile principale
│   ├── admin.css              # Personalizzazioni amministratore (opzionale)
│   └── print.css              # Foglio di stile di stampa (opzionale)
├── js/
│   └── theme.js               # JavaScript del tema
├── images/
│   ├── logo.png               # Logo del sito
│   └── icons/                 # Icone del tema
├── language/
│   └── english/
│       └── main.php           # Traduzioni del tema
├── modules/                    # Override template modulo
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Immagine anteprima tema
```

## File essenziali

### theme.html

Il template di layout principale che avvolge tutto il contenuto:

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

File di configurazione del tema:

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

### Template blocco

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

## Variabili template

### Variabili globali

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_sitename` | Nome del sito |
| `$xoops_url` | URL del sito |
| `$xoops_theme` | Nome tema corrente |
| `$xoops_langcode` | Codice lingua |
| `$xoops_charset` | Codifica caratteri |
| `$xoops_pagetitle` | Titolo pagina |
| `$xoops_dirname` | Nome modulo corrente |

### Variabili utente

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_isuser` | È effettuato l'accesso |
| `$xoops_isadmin` | È amministratore |
| `$xoops_userid` | ID utente |
| `$xoops_uname` | Nome utente |

### Variabili layout

| Variabile | Descrizione |
|----------|-------------|
| `$xoops_showlblock` | Mostra blocchi sinistri |
| `$xoops_showrblock` | Mostra blocchi destri |
| `$xoops_showcblock` | Mostra blocchi centrali |
| `$xoops_lblocks` | Array blocchi sinistri |
| `$xoops_rblocks` | Array blocchi destri |
| `$xoops_contents` | Contenuto principale pagina |

## Override template modulo

Sovrascrivi i template del modulo posizionandoli nel tuo tema:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Sovrascrivi indice modulo news
    └── news_article.tpl    # Sovrascrivi visualizzazione articolo
```

## Organizzazione CSS

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

## Documentazione correlata

- ../Templates/Smarty-Templating - Sintassi template
- Theme-Development - Guida tema completa
- CSS-Best-Practices - Linee guida stile 
- ../../03-Module-Development/Block-Development - Creazione blocchi

