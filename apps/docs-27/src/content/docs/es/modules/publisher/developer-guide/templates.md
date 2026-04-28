---
title: "Plantillas y Bloques"
---

## Descripción General

Publisher proporciona plantillas personalizables para mostrar artículos y bloques para integración en la barra lateral/widgets. Esta guía cubre la personalización de plantillas y la configuración de bloques.

## Archivos de Plantilla

### Plantillas Principales

| Plantilla | Propósito |
|----------|---------|
| `publisher_index.tpl` | Página de inicio del módulo |
| `publisher_item.tpl` | Vista de artículo individual |
| `publisher_category.tpl` | Listado de categorías |
| `publisher_archive.tpl` | Página de archivo |
| `publisher_search.tpl` | Resultados de búsqueda |
| `publisher_submit.tpl` | Formulario de envío de artículo |
| `publisher_print.tpl` | Vista compatible con impresión |

### Plantillas de Bloque

| Plantilla | Propósito |
|----------|---------|
| `publisher_block_latest.tpl` | Bloque de artículos recientes |
| `publisher_block_spotlight.tpl` | Bloque de artículo destacado |
| `publisher_block_category.tpl` | Bloque de lista de categorías |
| `publisher_block_author.tpl` | Bloque de artículos del autor |

## Variables de Plantilla

### Variables de Artículo

```smarty
{* Disponibles en publisher_item.tpl *}
<{$item.title}>           {* Título del artículo *}
<{$item.body}>            {* Contenido completo *}
<{$item.summary}>         {* Resumen/extracto *}
<{$item.author}>          {* Nombre del autor *}
<{$item.authorid}>        {* ID de usuario del autor *}
<{$item.datesub}>         {* Fecha de publicación *}
<{$item.datemodified}>    {* Fecha de última modificación *}
<{$item.counter}>         {* Contador de vistas *}
<{$item.rating}>          {* Calificación promedio *}
<{$item.votes}>           {* Número de votos *}
<{$item.categoryname}>    {* Nombre de la categoría *}
<{$item.categorylink}>    {* URL de la categoría *}
<{$item.itemurl}>         {* URL del artículo *}
<{$item.image}>           {* Imagen destacada *}
```

### Variables de Categoría

```smarty
{* Disponibles en publisher_category.tpl *}
<{$category.name}>        {* Nombre de la categoría *}
<{$category.description}> {* Descripción de la categoría *}
<{$category.image}>       {* Imagen de la categoría *}
<{$category.total}>       {* Contador de artículos *}
<{$category.link}>        {* URL de la categoría *}
```

## Personalización de Plantillas

### Ubicación de Anulación

Copie plantillas a su tema para personalizarlas:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### Ejemplo: Plantilla de Artículo Personalizada

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">Por <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Editar Artículo
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Imprimir</a>
            <a href="<{$item.maillink}>">Correo Electrónico</a>
        </div>
    </footer>
</article>
```

## Bloques

### Bloques Disponibles

| Bloque | Descripción |
|-------|-------------|
| Últimas Noticias | Muestra artículos recientes |
| Destacado | Destacado de artículo destacado |
| Menú de Categorías | Navegación de categorías |
| Archivos | Enlaces de archivo |
| Autores Principales | Escritores más activos |
| Artículos Populares | Artículos más vistos |

### Opciones de Bloque

#### Bloque Últimas Noticias

| Opción | Descripción |
|--------|-------------|
| Elementos a mostrar | Número de artículos |
| Filtro de categoría | Limitar a categorías específicas |
| Mostrar resumen | Mostrar extracto de artículo |
| Longitud del título | Truncar títulos |
| Plantilla | Archivo de plantilla de bloque |

### Plantilla de Bloque Personalizada

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> vistas</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## Trucos de Plantilla

### Visualización Condicional

```smarty
{* Mostrar contenido diferente para diferentes usuarios *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Edición de Administrador</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Editar Tu Artículo</a>
<{/if}>
```

### Clase CSS Personalizada

```smarty
{* Agregar estilos basados en estado *}
<article class="article <{$item.status}>">
    {* Contenido *}
</article>
```

### Formato de Fecha

```smarty
{* Formatear fechas con Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## Documentación Relacionada

- ../User-Guide/Basic-Configuration - Configuración del módulo
- ../User-Guide/Creating-Articles - Gestión de contenido
- ../../04-API-Reference/Template/Template-System - Motor de plantillas XOOPS
- ../../02-Core-Concepts/Themes/Theme-Development - Personalización de temas

