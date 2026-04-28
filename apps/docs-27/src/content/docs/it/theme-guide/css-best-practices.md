---
title: "Migliori pratiche CSS per i temi XOOPS"
---

## Panoramica

Questa guida copre l'organizzazione CSS, le tecniche di layout moderne e l'ottimizzazione delle prestazioni per lo sviluppo dei temi XOOPS.

## Architettura CSS

### Organizzazione dei file

```
themes/mytheme/css/
├── style.css           # Foglio di stile principale (importa altri)
├── base/
│   ├── _reset.css     # Reset/normalizzazione CSS
│   ├── _typography.css # Stili del carattere
│   └── _variables.css # Proprietà personalizzate CSS
├── components/
│   ├── _blocks.css    # Stile blocco
│   ├── _buttons.css   # Stili pulsante
│   ├── _forms.css     # Elementi modulo
│   └── _navigation.css # Menu di navigazione
├── layout/
│   ├── _header.css    # Intestazione del sito
│   ├── _footer.css    # Piè di pagina del sito
│   ├── _sidebar.css   # Barre laterali
│   └── _grid.css      # Sistema di griglia
└── modules/           # Sovrascritture specifiche del modulo
    ├── _news.css
    └── _publisher.css
```

### Foglio di stile principale

```css
/* style.css */
@import 'base/_variables.css';
@import 'base/_reset.css';
@import 'base/_typography.css';

@import 'layout/_grid.css';
@import 'layout/_header.css';
@import 'layout/_footer.css';
@import 'layout/_sidebar.css';

@import 'components/_blocks.css';
@import 'components/_buttons.css';
@import 'components/_forms.css';
@import 'components/_navigation.css';

@import 'modules/_news.css';
@import 'modules/_publisher.css';
```

## Proprietà personalizzate CSS

### Variabili

```css
/* _variables.css */
:root {
    /* Colori */
    --color-primary: #3498db;
    --color-primary-dark: #2980b9;
    --color-secondary: #2c3e50;
    --color-accent: #e74c3c;

    --color-text: #333;
    --color-text-light: #666;
    --color-text-muted: #999;

    --color-bg: #fff;
    --color-bg-alt: #f5f5f5;
    --color-border: #ddd;

    /* Tipografia */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-family-heading: var(--font-family);
    --font-size-base: 16px;
    --line-height: 1.6;

    /* Spaziatura */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Layout */
    --max-width: 1200px;
    --sidebar-width: 250px;
    --header-height: 60px;

    /* Bordi */
    --border-radius: 4px;
    --border-width: 1px;

    /* Ombre */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Transizioni */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### Modalità scura

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-text: #e0e0e0;
        --color-text-light: #b0b0b0;
        --color-bg: #1a1a1a;
        --color-bg-alt: #2d2d2d;
        --color-border: #444;
    }
}

/* Toggle manuale */
[data-theme="dark"] {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
}
```

## Layout moderno

### CSS Grid per il layout della pagina

```css
/* _grid.css */
.page-container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr var(--sidebar-width);
    grid-template-areas:
        "header header header"
        "left   main   right"
        "footer footer footer";
    gap: var(--spacing-lg);
    max-width: var(--max-width);
    margin: 0 auto;
    padding: var(--spacing-md);
}

.site-header { grid-area: header; }
.sidebar-left { grid-area: left; }
.content-main { grid-area: main; }
.sidebar-right { grid-area: right; }
.site-footer { grid-area: footer; }

/* Nessuna barra laterale sinistra */
.no-left-sidebar .page-container {
    grid-template-columns: 1fr var(--sidebar-width);
    grid-template-areas:
        "header header"
        "main   right"
        "footer footer";
}

/* Nessuna barra laterale */
.no-sidebars .page-container {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "footer";
}
```

### Flexbox per i componenti

```css
.block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
}

.nav-menu {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    list-style: none;
    padding: 0;
}
```

## Design reattivo

### Breakpoint mobile-first

```css
/* Base mobile */
.page-container {
    display: block;
    padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
    .page-container {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        gap: var(--spacing-md);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .page-container {
        grid-template-columns: var(--sidebar-width) 1fr var(--sidebar-width);
        gap: var(--spacing-lg);
    }
}
```

### Container queries

```css
/* Container queries moderni */
.block {
    container-type: inline-size;
}

@container (min-width: 300px) {
    .block-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}
```

## Stile blocco

```css
/* _blocks.css */
.block {
    background: var(--color-bg);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-md);
    overflow: hidden;
}

.block-title {
    background: var(--color-bg-alt);
    padding: var(--spacing-sm) var(--spacing-md);
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    border-bottom: var(--border-width) solid var(--color-border);
}

.block-content {
    padding: var(--spacing-md);
}

.block-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.block-content li {
    padding: var(--spacing-sm) 0;
    border-bottom: var(--border-width) solid var(--color-border);
}

.block-content li:last-child {
    border-bottom: none;
}
```

## Prestazioni

### CSS critico

```html
<head>
    <!-- Inline CSS critico -->
    <style>
        /* Stili sopra la piega */
        body { font-family: system-ui; margin: 0; }
        .header { background: #fff; height: 60px; }
    </style>

    <!-- Carica CSS completo async -->
    <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
</head>
```

### Suggerimenti di ottimizzazione

1. **Riduci la specificità** - Evita l'annidamento profondo
2. **Usa le proprietà moderne** - `gap` invece di margini
3. **Riduci i repaint** - Usa `transform` per le animazioni
4. **Lazy load** - Carica CSS del modulo solo quando necessario

```css
/* Buono - bassa specificità */
.block-title { }

/* Evita - alta specificità */
.sidebar .block .block-header .block-title { }
```

## Documentazione correlata

- Theme-Structure - Organizzazione file del tema
- Theme-Development - Guida tema completa
- ../Templates/Smarty-Templating - Integrazione template
- ../../03-Module-Development/Block-Development - Stile blocco
