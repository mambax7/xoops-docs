---
title: "Directrices de CSS y SCSS"
description: "Estándares de codificación CSS/SCSS de XOOPS y mejores prácticas"
---

> XOOPS sigue estándares CSS modernos con preprocesamiento SCSS, enfocándose en mantenibilidad y rendimiento.

---

## Resumen

Los estándares CSS de XOOPS enfatizan:

- **Preprocesamiento SCSS** para organización
- **Metodología BEM** para nombres
- **Diseño responsivo mobile-first**
- **HTML semántico y accesibilidad**
- **Optimización de rendimiento**

---

## Estructura de Archivos

### Organización SCSS

```
styles/
├── abstracts/           # Variables, mixins, funciones
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # Reset, tipografía, valores por defecto
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # Componentes reutilizables
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # Diseño de página
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # Estilos específicos de página
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # Importar todos los archivos
```

### Denominación de Archivos

```scss
// Utilizar minúsculas con guiones
_button.scss        // Componente
_modal-dialog.scss  // Componente de varias palabras
_colors.scss        // Variables
```

---

## Convenciones de Nombres

### Metodología BEM

BEM = Bloque Elemento Modificador

```scss
// Bloque: componente independiente
.button { }

// Bloque__Elemento: hijo del bloque
.button__text { }
.button__icon { }

// Bloque--Modificador: variación del bloque
.button--primary { }
.button--disabled { }
.button--small { }

// Ejemplo complejo
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### Mejores Prácticas de Nombres

```scss
// ✅ Nombres BEM descriptivos
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ Evitar
.form-f { }                 // Demasiado abreviado
.form_field { }             // Usar guiones, no guiones bajos
.formField { }              // No usar camelCase
.form-field-2 { }           // No usar números para variantes
.form-field.active { }      // Usar modificadores, no clases
```

---

## Formato

### Estructura Básica

```scss
.component {
  // 1. Posicionamiento y diseño
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. Modelo de caja
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. Tipografía
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. Efectos visuales
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. Animaciones
  transition: all 0.3s ease;
}
```

### Espaciado e Indentación

```scss
// Usar 2 espacios para indentación
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// Propiedades en líneas separadas
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ No compactar
.component { display: flex; color: red; }
```

### Selectores

```scss
// Un selector por línea
.button,
.button-group,
.button-list {
  // ...
}

// No saltar líneas entre selectores
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

## Variables

### Nombres de Variables

```scss
// Usar nombres descriptivos
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

### Organización de Variables

```scss
// _variables.scss

// Colores
$color-primary: #0066cc;
$color-secondary: #666666;

// Tipografía
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// Espaciado
$spacing-unit: 0.5rem;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 4;
$spacing-lg: $spacing-unit * 8;

// Puntos de ruptura
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

---

## Colores

### Sistema de Colores

```scss
// Paleta principal
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// Paleta secundaria
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// Colores semánticos
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// Colores neutros
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

// Uso
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

## Tipografía

### Declaraciones de Fuentes

```scss
// Definir variables de tipografía
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'Courier New', monospace;

// Tamaños de fuente
$font-size-base: 1rem;      // 16px
$font-size-small: 0.875rem; // 14px
$font-size-large: 1.25rem;  // 20px

$line-height-base: 1.5;
$line-height-tight: 1.25;
$line-height-loose: 1.75;

// Pesos de fuente
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Jerarquía de Encabezados

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

## Mixins

### Mixins Comunes

```scss
// Mixin de punto de ruptura responsivo
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

// Uso
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

// Uso
.modal__overlay {
  @include flex-center;
  height: 100vh;
}

// Mixin de truncado de texto
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Uso
.breadcrumb__item {
  @include truncate;
  max-width: 200px;
}

// Mixin clearfix (legado)
@mixin clearfix {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
```

---

## Diseño Responsivo

### Enfoque Mobile-First

```scss
// Estilos base (móvil)
.component {
  font-size: 0.875rem;
  padding: $spacing-sm;
}

// Tabletas y superior
@include respond-to('md') {
  .component {
    font-size: 1rem;
    padding: $spacing-md;
  }
}

// Escritorio y superior
@include respond-to('lg') {
  .component {
    font-size: 1.125rem;
    padding: $spacing-lg;
  }
}
```

### Sistema de Puntos de Ruptura

```scss
// Definir puntos de ruptura
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px,
);

// Mixin flexible para cualquier punto de ruptura
@mixin media($breakpoint) {
  $min-width: map-get($breakpoints, $breakpoint);
  @media (min-width: $min-width) {
    @content;
  }
}

// Uso
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

## Componentes

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

  // Variantes
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

  // Iconos
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

## Mejores Prácticas

### Si

- Usar variables SCSS para colores, espaciado, fuentes
- Seguir la convención de nombres BEM
- Diseño responsivo mobile-first
- Organizar archivos por propósito
- Escribir mixins reutilizables
- Mantener selectores simples (máximo 3 niveles de profundidad)
- Usar HTML semántico
- Minimizar especificidad
- Comentar secciones complejas

### No

- Usar estilos en línea
- Usar !important (casi nunca)
- Crear selectores demasiado específicos
- Usar selectores ID para estilos
- Anidar demasiado profundamente (máximo 3-4 niveles)
- Usar px para tamaños de fuente (usar rem)
- Crear números mágicos (usar variables)
- Dejar CSS sin usar
- Olvidar accesibilidad

---

## Accesibilidad

### Contraste de Color

```scss
// Asegurar contraste suficiente
// Nivel AA: 4.5:1 para texto normal
// Nivel AAA: 7:1 para texto normal

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // Relación de contraste: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // Relación de contraste: 9.3:1 ✅
}
```

### Estados de Enfoque

```scss
// Proporcionar siempre estilos de enfoque
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

### HTML Semántico con CSS

```scss
// Usar estructura semántica adecuada
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

## Rendimiento

### Optimizar Selectores

```scss
// ✅ Eficiente
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ Ineficiente (demasiado específico, anidación profunda)
div.container section.content article .button {
  // ...
}
```

### Minimizar Repintados

```scss
// Agrupar animaciones
.component {
  // Cambiar múltiples propiedades a la vez
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

// O usar forma abreviada
.component {
  transition: all 0.3s ease;
}
```

---

## Herramientas

### Configuración Stylelint

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

## Documentación Relacionada

- Estándares JavaScript
- Código de Conducta
- Flujo de Contribución
- Estándares PHP

---

#xoops #css #scss #styling #coding-standards #best-practices
