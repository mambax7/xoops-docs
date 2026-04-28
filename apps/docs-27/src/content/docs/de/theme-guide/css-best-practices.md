---
title: "CSS-Best-Practices für XOOPS-Designs"
---

## Übersicht

Dieser Leitfaden behandelt CSS-Organisation, moderne Layout-Techniken und Leistungs-Optimierung für die XOOPS-Design-Entwicklung.

## CSS-Architektur

### Datei-Organisation

```
themes/mytheme/css/
├── style.css           # Hauptstylesheet (importiert andere)
├── base/
│   ├── _reset.css     # CSS reset/normalize
│   ├── _typography.css # Font-Stile
│   └── _variables.css # CSS Custom Properties
├── components/
│   ├── _blocks.css    # Block-Styling
│   ├── _buttons.css   # Button-Stile
│   ├── _forms.css     # Formular-Elemente
│   └── _navigation.css # Nav-Menüs
├── layout/
│   ├── _header.css    # Webseiten-Header
│   ├── _footer.css    # Webseiten-Footer
│   ├── _sidebar.css   # Seitenleisten
│   └── _grid.css      # Raster-System
└── modules/           # Modul-spezifische Überrides
    ├── _news.css
    └── _publisher.css
```

### Hauptstylesheet

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

## CSS Custom Properties

### Variablen

```css
/* _variables.css */
:root {
    /* Farben */
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

    /* Typographie */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-family-heading: var(--font-family);
    --font-size-base: 16px;
    --line-height: 1.6;

    /* Abstände */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Layout */
    --max-width: 1200px;
    --sidebar-width: 250px;
    --header-height: 60px;

    /* Ränder */
    --border-radius: 4px;
    --border-width: 1px;

    /* Schatten */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Übergänge */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### Dark Mode

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

/* Manuelle Umschaltung */
[data-theme="dark"] {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
}
```

## Modernes Layout

### CSS Grid für Seitenlayout

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

/* Keine linke Seitenleiste */
.no-left-sidebar .page-container {
    grid-template-columns: 1fr var(--sidebar-width);
    grid-template-areas:
        "header header"
        "main   right"
        "footer footer";
}

/* Keine Seitenleisten */
.no-sidebars .page-container {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "footer";
}
```

### Flexbox für Komponenten

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

## Responsive Design

### Mobile-First Breakpoints

```css
/* Mobile first - Basis-Stile */
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

### Container Queries

```css
/* Moderne Container Queries */
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

## Block-Styling

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

## Leistung

### Critical CSS

```html
<head>
    <!-- Inline kritisches CSS -->
    <style>
        /* Above-the-fold Stile */
        body { font-family: system-ui; margin: 0; }
        .header { background: #fff; height: 60px; }
    </style>

    <!-- Vollständiges CSS async laden -->
    <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
</head>
```

### Optimierungs-Tipps

1. **Spezifität minimieren** - Vermeiden Sie tiefe Verschachtelung
2. **Moderne Properties verwenden** - `gap` statt Margins
3. **Repaints reduzieren** - Verwenden Sie `transform` für Animationen
4. **Lazy Load** - Laden Sie Modul-CSS nur wenn nötig

```css
/* Gut - niedrige Spezifität */
.block-title { }

/* Vermeiden - hohe Spezifität */
.sidebar .block .block-header .block-title { }
```

## Verwandte Dokumentation

- Theme-Structure - Design-Datei-Organisation
- Theme-Development - Vollständiger Design-Leitfaden
- ../Templates/Smarty-Templating - Template-Integration
- ../../03-Module-Development/Block-Development - Block-Styling
