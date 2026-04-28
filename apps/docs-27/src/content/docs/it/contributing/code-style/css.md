---
title: "Linee Guida CSS e SCSS"
description: "Standard di codifica CSS/SCSS e best practice di XOOPS"
---

> XOOPS segue standard CSS moderni con preprocessing SCSS, focalizzandosi su manutenibilità e performance.

---

## Panoramica

Gli standard CSS di XOOPS enfatizzano:

- **Preprocessing SCSS** per organizzazione
- **Metodologia BEM** per naming
- **Responsive design mobile-first**
- **Accessibilità e HTML semantico**
- **Ottimizzazione performance**

---

## Struttura File

### Organizzazione SCSS

```
styles/
├── abstracts/           # Variabili, mixin, funzioni
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # Reset, tipografia, defaults
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # Componenti riutilizzabili
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # Layout pagina
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # Stili specifici pagina
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # Importa tutti i file
```

### Naming File

```scss
// Usa lowercase con trattini
_button.scss        // Componente
_modal-dialog.scss  // Componente multi-parola
_colors.scss        // Variabili
```

---

## Convenzioni Naming

### Metodologia BEM

BEM = Block Element Modifier

```scss
// Block: Componente standalone
.button { }

// Block__Element: Child di block
.button__text { }
.button__icon { }

// Block--Modifier: Variazione di block
.button--primary { }
.button--disabled { }
.button--small { }

// Esempio complesso
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### Best Practice Naming

```scss
// ✅ Naming BEM descrittivo
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ Evita
.form-f { }                 // Troppo abbreviato
.form_field { }             // Usa trattini, non underscore
.formField { }              // Non usare camelCase
.form-field-2 { }           // Non usare numeri per varianti
.form-field.active { }      // Usa modifier, non classi
```

---

## Formattazione

### Struttura Base

```scss
.component {
  // 1. Positioning e layout
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. Box model
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. Tipografia
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. Effetti visivi
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. Animazioni
  transition: all 0.3s ease;
}
```

### Spacing e Indentazione

```scss
// Usa 2 spazi per indentazione
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// Properties su linee separate
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ Non compattare
.component { display: flex; color: red; }
```

### Selettori

```scss
// Un selettore per linea
.button,
.button-group,
.button-list {
  // ...
}

// Non saltare linee tra selettori
// ✅
.component {
}

.component__element {
}

// ❌
.component {
}


.component__element {
}
```

---

## Variabili

### Naming Variabili

```scss
// Usa nomi descrittivi
$color-primary: #0066cc;
$color-secondary: #666666;
$color-danger: #dc3545;

$font-base: 16px;
$font-size-small: 0.875rem;
$font-size-large: 1.25rem;

$spacing-unit: 0.5rem;
$spacing-small: 0.5rem;
$spacing-medium: 1rem;
$spacing-large: 2rem;

$border-radius-small: 2px;
$border-radius-medium: 4px;
$border-radius-large: 8px;

$transition-duration: 0.3s;
$transition-timing: ease-in-out;
```

### Organizzazione Variabili

```scss
// _variables.scss

// Colori
$color-primary: #0066cc;
$color-secondary: #666666;

// Tipografia
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Spacing
$spacing-unit: 0.5rem;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 4;
$spacing-lg: $spacing-unit * 8;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## Colori

### Sistema Colori

```scss
// Tavolozza primaria
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// Tavolozza secondaria
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// Colori semantici
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// Colori neutrali
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
$color-gray-200: #e9ecef;
$color-gray-300: #dee2e6;
$color-gray-400: #ced4da;
$color-gray-500: #adb5bd;
$color-gray-600: #6c757d;
$color-gray-700: #495057;
$color-gray-800: #343a40;
$color-gray-900: #212529;

// Utilizzo
.button {
  background-color: $color-primary;
  color: $color-white;

  &:hover {
    background-color: $color-primary-dark;
  }

  &--danger {
    background-color: $color-danger;
  }
}
```

---

## Tipografia

### Dichiarazioni Font

```scss
// Definisci variabili tipografia
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// Dimensioni font
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// Font weight
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Gerarchia Heading

```scss
h1, .h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-lg;
}

h2, .h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-md;
}

h3, .h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-md;
}

p {
  font-size: $font-size-base;
  line-height: $line-height-base;
  margin-bottom: $spacing-md;
}

small {
  font-size: $font-size-small;
}
```

---

## Mixin

### Mixin Comuni

```scss
// Responsive breakpoint mixin
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}

// Utilizzo
.component {
  font-size: 0.875rem;

  @include respond-to('md') {
    font-size: 1rem;
  }

  @include respond-to('lg') {
    font-size: 1.125rem;
  }
}

// Mixin flexbox
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Utilizzo
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// Mixin truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Utilizzo
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Mixin clearfix (legacy)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## Design Responsivo

### Approccio Mobile-First

```scss
// Stili base (mobile)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// Tablet e su
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// Desktop e su
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### Sistema Breakpoint

```scss
// Definisci breakpoints
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// Mixin flessibile per qualsiasi breakpoint
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// Utilizzo
.component {
  width: 100%;

  @include media('md') {
    width: 50%;
  }

  @include media('lg') {
    width: 33.333%;
  }
}
```

---

## Componenti

### Componente Button

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-md;
  border: 1px solid transparent;
  border-radius: $border-radius-medium;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Varianti
  &--primary {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }

  &--secondary {
    background-color: $color-secondary;
    color: $color-white;
  }

  &--danger {
    background-color: $color-danger;
    color: $color-white;
  }

  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-small;
  }

  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-large;
  }

  // Icone
  &__icon {
    margin-right: 0.5em;

    &:last-child {
      margin-right: 0;
      margin-left: 0.5em;
    }
  }
}
```

### Componente Form

```scss
.form-group {
  margin-bottom: $spacing-lg;
}

.form-field {
  display: flex;
  flex-direction: column;

  &__label {
    font-weight: $font-weight-semibold;
    margin-bottom: 0.5rem;
    color: $color-secondary-dark;
  }

  &__input,
  &__select,
  &__textarea {
    padding: $spacing-sm;
    border: 1px solid #ddd;
    border-radius: $border-radius-medium;
    font-size: $font-size-base;
    font-family: inherit;
    transition: border-color $transition-duration;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  &__help {
    font-size: $font-size-small;
    color: $color-gray-600;
    margin-top: 0.25rem;
  }

  &--error {
    .form-field__input,
    .form-field__select {
      border-color: $color-danger;

      &:focus {
        box-shadow: 0 0 0 3px rgba($color-danger, 0.1);
      }
    }

    .form-field__error {
      color: $color-danger;
      font-size: $font-size-small;
      margin-top: 0.25rem;
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

---

## Best Practice

### Da Fare

- Usa variabili SCSS per colori, spacing, font
- Segui convenzione naming BEM
- Design responsivo mobile-first
- Organizza file per scopo
- Scrivi mixin riutilizzabili
- Mantieni selettori semplici (max 3 livelli profondità)
- Usa HTML semantico
- Minimizza specificità
- Commenta sezioni complesse

### Da Non Fare

- Non usare stili inline
- Non usare !important (quasi mai)
- Non creare selettori eccessivamente specifici
- Non usare selettori ID per styling
- Non annidare troppo profondamente (max 3-4 livelli)
- Non usare px per dimensioni font (usa rem)
- Non creare numeri magici (usa variabili)
- Non lasciare CSS inutilizzato
- Non dimenticare accessibilità

---

## Accessibilità

### Color Contrast

```scss
// Assicura sufficiente contrasto
// Level AA: 4.5:1 per testo normale
// Level AAA: 7:1 per testo normale

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // Ratio contrasto: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // Ratio contrasto: 9.3:1 ✅
}
```

### Focus States

```scss
// Fornisci sempre stili focus
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### HTML Semantico con CSS

```scss
// Usa struttura semantica appropriata
main {
  padding: $spacing-lg;
}

article {
  margin-bottom: $spacing-xl;
  border-bottom: 1px solid #eee;
  padding-bottom: $spacing-xl;
}

header {
  background-color: #f5f5f5;
  padding: $spacing-md;
}

nav {
  display: flex;
  gap: $spacing-md;
}
```

---

## Performance

### Ottimizza Selettori

```scss
// ✅ Efficiente
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ Inefficiente (troppo specifico, annidamento profondo)
div.container section.content article .button {
  // ...
}
```

### Minimizza Repaints

```scss
// Raggruppa animazioni
.component {
  // Cambia multiple properties contemporaneamente
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// O usa shorthand
.component {
  transition: all 0.3s ease;
}
```

---

## Strumenti

### Configurazione Stylelint

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "color-hex-length": "short",
    "selector-pseudo-class-no-unknown": null,
    "scss/dollar-variable-pattern": "^[a-z]"
  }
}
```

---

## Documentazione Correlata

- Standard JavaScript
- Codice di Condotta
- Workflow Contribuzione
- Standard PHP

---

#xoops #css #scss #styling #coding-standards #best-practices
