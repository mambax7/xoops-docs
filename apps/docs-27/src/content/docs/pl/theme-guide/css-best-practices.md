---
title: "Najlepsze praktyki CSS dla motywów XOOPS"
description: ""
---

## Przegląd

Ten przewodnik obejmuje organizację CSS, nowoczesne techniki układu i optymalizację wydajności dla tworzenia motywów XOOPS.

## Architektura CSS

### Organizacja plików

```
themes/mytheme/css/
├── style.css           # Główny arkusz stylów (importuje inne)
├── base/
│   ├── _reset.css     # Reset/normalizacja CSS
│   ├── _typography.css # Style czcionek
│   └── _variables.css # Niestandardowe właściwości CSS
├── components/
│   ├── _blocks.css    # Stylizacja bloków
│   ├── _buttons.css   # Style przycisków
│   ├── _forms.css     # Elementy formularza
│   └── _navigation.css # Menu nawigacji
├── layout/
│   ├── _header.css    # Nagłówek witryny
│   ├── _footer.css    # Stopka witryny
│   ├── _sidebar.css   # Paski boczne
│   └── _grid.css      # System siatki
└── modules/           # Przesłonięcia specyficzne dla modułu
    ├── _news.css
    └── _publisher.css
```

### Główny arkusz stylów

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

## Niestandardowe właściwości CSS

### Zmienne

```css
/* _variables.css */
:root {
    /* Kolory */
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

    /* Typografia */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-family-heading: var(--font-family);
    --font-size-base: 16px;
    --line-height: 1.6;

    /* Odstępy */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Układ */
    --max-width: 1200px;
    --sidebar-width: 250px;
    --header-height: 60px;

    /* Obramowania */
    --border-radius: 4px;
    --border-width: 1px;

    /* Cienie */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Przejścia */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### Tryb ciemny

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

/* Ręczne przełączanie */
[data-theme="dark"] {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
}
```

## Nowoczesny układ

### Siatka CSS dla układu strony

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

/* Bez lewego paska bocznego */
.no-left-sidebar .page-container {
    grid-template-columns: 1fr var(--sidebar-width);
    grid-template-areas:
        "header header"
        "main   right"
        "footer footer";
}

/* Bez pasków bocznych */
.no-sidebars .page-container {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "footer";
}
```

### Flexbox dla komponentów

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

## Projekt responsywny

### Punkty przerwania Mobile-First

```css
/* Mobile first - style bazowe */
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

### Zapytania kontenerowe

```css
/* Nowoczesne zapytania kontenerowe */
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

## Stylizacja bloków

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

## Wydajność

### Krytyczny CSS

```html
<head>
    <!-- Inline krytyczny CSS -->
    <style>
        /* Style powyżej zagiętej linii */
        body { font-family: system-ui; margin: 0; }
        .header { background: #fff; height: 60px; }
    </style>

    <!-- Ładuj pełny CSS asynchronicznie -->
    <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
</head>
```

### Wskazówki optymalizacji

1. **Minimalizuj specyficzność** - Unikaj głębokich zagnieżdżeń
2. **Używaj nowoczesnych właściwości** - `gap` zamiast marginesów
3. **Zmniejsz przerysowania** - Używaj `transform` dla animacji
4. **Leniwe ładowanie** - Ładuj CSS modułu tylko gdy jest potrzebny

```css
/* Dobrze - niska specyficzność */
.block-title { }

/* Unikaj - wysoka specyficzność */
.sidebar .block .block-header .block-title { }
```

## Powiązana dokumentacja

- Theme-Structure - Organizacja plików motywu
- Theme-Development - Kompletny przewodnik po motywach
- ../Templates/Smarty-Templating - Integracja szablonów
- ../../03-Module-Development/Block-Development - Stylizacja bloków
