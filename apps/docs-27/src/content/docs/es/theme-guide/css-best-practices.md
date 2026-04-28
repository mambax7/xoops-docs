---
title: "Mejores prácticas de CSS para temas de XOOPS"
---

## Descripción general

Esta guía cubre la organización de CSS, técnicas de diseño modernas y optimización del rendimiento para el desarrollo de temas de XOOPS.

## Arquitectura CSS

### Organización de archivos

```
themes/mytheme/css/
├── style.css           # Hoja de estilo principal (importa otras)
├── base/
│   ├── _reset.css     # Reinicio/normalización de CSS
│   ├── _typography.css # Estilos de fuente
│   └── _variables.css # Propiedades personalizadas de CSS
├── components/
│   ├── _blocks.css    # Estilo de bloques
│   ├── _buttons.css   # Estilos de botones
│   ├── _forms.css     # Elementos de formulario
│   └── _navigation.css # Menús de navegación
├── layout/
│   ├── _header.css    # Encabezado del sitio
│   ├── _footer.css    # Pie de página del sitio
│   ├── _sidebar.css   # Barras laterales
│   └── _grid.css      # Sistema de cuadrícula
└── modules/           # Sobrescrituras específicas del módulo
    ├── _news.css
    └── _publisher.css
```

### Hoja de estilo principal

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

## Propiedades personalizadas de CSS

### Variables

```css
/* _variables.css */
:root {
    /* Colores */
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

    /* Tipografía */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-family-heading: var(--font-family);
    --font-size-base: 16px;
    --line-height: 1.6;

    /* Espaciado */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Diseño */
    --max-width: 1200px;
    --sidebar-width: 250px;
    --header-height: 60px;

    /* Bordes */
    --border-radius: 4px;
    --border-width: 1px;

    /* Sombras */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Transiciones */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}
```

### Modo oscuro

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

/* Alternancia manual */
[data-theme="dark"] {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
}
```

## Diseño moderno

### Cuadrícula CSS para diseño de página

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

/* Sin barra lateral izquierda */
.no-left-sidebar .page-container {
    grid-template-columns: 1fr var(--sidebar-width);
    grid-template-areas:
        "header header"
        "main   right"
        "footer footer";
}

/* Sin barras laterales */
.no-sidebars .page-container {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main"
        "footer";
}
```

### Flexbox para componentes

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

## Diseño responsivo

### Puntos de quiebre primero móvil

```css
/* Móvil primero - estilos base */
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

/* Escritorio */
@media (min-width: 1024px) {
    .page-container {
        grid-template-columns: var(--sidebar-width) 1fr var(--sidebar-width);
        gap: var(--spacing-lg);
    }
}
```

### Consultas de contenedor

```css
/* Consultas de contenedor modernas */
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

## Estilo de bloques

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

## Rendimiento

### CSS crítico

```html
<head>
    <!-- CSS crítico en línea -->
    <style>
        /* Estilos sobre la línea de flotación */
        body { font-family: system-ui; margin: 0; }
        .header { background: #fff; height: 60px; }
    </style>

    <!-- Cargar CSS completo de forma asincrónica -->
    <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="style.css"></noscript>
</head>
```

### Consejos de optimización

1. **Minimizar especificidad** - Evitar anidamiento profundo
2. **Usar propiedades modernas** - `gap` en lugar de márgenes
3. **Reducir repintados** - Usar `transform` para animaciones
4. **Carga perezosa** - Cargar CSS del módulo solo cuando sea necesario

```css
/* Bien - baja especificidad */
.block-title { }

/* Evitar - alta especificidad */
.sidebar .block .block-header .block-title { }
```

## Documentación relacionada

- Theme-Structure - Organización de archivos de temas
- Theme-Development - Guía completa de temas
- ../Templates/Smarty-Templating - Integración de plantillas
- ../../03-Module-Development/Block-Development - Estilo de bloques
