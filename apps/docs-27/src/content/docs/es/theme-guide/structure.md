---
title: "Estructura del tema"
---

## Descripción general

Los temas de XOOPS controlan la presentación visual de su sitio. Comprender la estructura del tema es esencial para la personalización y creación de nuevos temas.

## Diseño de directorios

```
themes/mytheme/
├── theme.html                  # Plantilla de diseño principal
├── theme.ini                   # Configuración del tema
├── theme_blockleft.html        # Plantilla de bloque de barra lateral izquierda
├── theme_blockright.html       # Plantilla de bloque de barra lateral derecha
├── theme_blockcenter_c.html    # Bloque central (centrado)
├── theme_blockcenter_l.html    # Bloque central (alineado a la izquierda)
├── theme_blockcenter_r.html    # Bloque central (alineado a la derecha)
├── css/
│   ├── style.css              # Hoja de estilo principal
│   ├── admin.css              # Personalizaciones de administrador (opcional)
│   └── print.css              # Hoja de estilo de impresión (opcional)
├── js/
│   └── theme.js               # JavaScript del tema
├── images/
│   ├── logo.png               # Logo del sitio
│   └── icons/                 # Iconos del tema
├── language/
│   └── english/
│       └── main.php           # Traducciones del tema
├── modules/                    # Sobrescrituras de plantillas de módulos
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Imagen de vista previa del tema
```

## Archivos esenciales

### theme.html

La plantilla de diseño principal que envuelve todo el contenido:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Encabezados específicos del módulo *}
    <{$xoops_module_header}>

    {* Hojas de estilo del tema *}
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
        {* Barra lateral izquierda *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Contenido principal *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Barra lateral derecha *}
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

    {* Pies de página específicos del módulo *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

Archivo de configuración del tema:

```ini
[Theme]
name = "Mi Tema"
version = "1.0.0"
author = "Tu Nombre"
license = "GPL-2.0"
description = "Un tema moderno y responsivo"

[Screenshots]
screenshot = "screenshot.png"

[Options]
responsive = true
bootstrap = false

[Settings]
primary_color = "#3498db"
secondary_color = "#2c3e50"
```

### Plantillas de bloques

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

## Variables de plantilla

### Variables globales

| Variable | Descripción |
|----------|-------------|
| `$xoops_sitename` | Nombre del sitio |
| `$xoops_url` | URL del sitio |
| `$xoops_theme` | Nombre del tema actual |
| `$xoops_langcode` | Código de idioma |
| `$xoops_charset` | Codificación de caracteres |
| `$xoops_pagetitle` | Título de la página |
| `$xoops_dirname` | Nombre del módulo actual |

### Variables de usuario

| Variable | Descripción |
|----------|-------------|
| `$xoops_isuser` | ¿Está conectado? |
| `$xoops_isadmin` | ¿Es administrador? |
| `$xoops_userid` | ID del usuario |
| `$xoops_uname` | Nombre de usuario |

### Variables de diseño

| Variable | Descripción |
|----------|-------------|
| `$xoops_showlblock` | Mostrar bloques izquierdos |
| `$xoops_showrblock` | Mostrar bloques derechos |
| `$xoops_showcblock` | Mostrar bloques centrales |
| `$xoops_lblocks` | Matriz de bloques izquierdos |
| `$xoops_rblocks` | Matriz de bloques derechos |
| `$xoops_contents` | Contenido de la página principal |

## Sobrescrituras de plantillas de módulos

Sobrescriba las plantillas de módulos colocándolas en su tema:

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Sobrescribe el índice del módulo news
    └── news_article.tpl    # Sobrescribe la visualización del artículo
```

## Organización de CSS

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

/* === Diseño === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Componentes === */
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

/* === Responsivo === */
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

## Documentación relacionada

- ../Templates/Smarty-Templating - Sintaxis de plantilla
- Theme-Development - Guía completa de temas
- CSS-Best-Practices - Directrices de estilo
- ../../03-Module-Development/Block-Development - Creación de bloques

