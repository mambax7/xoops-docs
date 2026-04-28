---
title: "Convenciones de Plantillas Smarty"
description: "Estándares de codificación de plantillas Smarty de XOOPS y mejores prácticas"
---

> XOOPS utiliza Smarty para plantillas. Esta guía cubre convenciones y mejores prácticas para desarrollar plantillas Smarty.

---

## Resumen

Las plantillas Smarty de XOOPS siguen:

- **Estructura y nombres de plantillas XOOPS**
- **Estándares de accesibilidad** (WCAG)
- **Marcado HTML5 semántico**
- **Nombres de clase estilo BEM**
- **Optimización de rendimiento**

---

## Estructura de Archivos

### Organización de Plantillas

```
templates/
├── admin/                   # Plantillas de administración
│   ├── admin_header.tpl
│   ├── admin_footer.tpl
│   ├── items_list.tpl
│   └── item_form.tpl
├── blocks/                  # Plantillas de bloque
│   ├── recent_items.tpl
│   └── featured.tpl
├── common/                  # Plantillas compartidas
│   ├── pagination.tpl
│   ├── breadcrumb.tpl
│   └── empty_state.tpl
├── emails/                  # Plantillas de correo electrónico
│   ├── notification.tpl
│   └── verification.tpl
├── pages/                   # Plantillas de página
│   ├── index.tpl
│   ├── detail.tpl
│   └── list.tpl
├── db:modulename_header.tpl # Almacenado en BD para temas personalizados
└── db:modulename_footer.tpl
```

### Denominación de Archivos

```smarty
{* Los archivos de plantilla XOOPS utilizan prefijo de módulo *}
modulename_index.tpl
modulename_item_detail.tpl
modulename_item_form.tpl
modulename_list.tpl
modulename_pagination.tpl

{* Plantillas de administración *}
admin_index.tpl
admin_edit.tpl
admin_list.tpl
```

---

## Encabezado de Archivo

### Comentario de Encabezado de Plantilla

```smarty
{*
 * XOOPS Module - Module Name
 * @file Item list template
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 * Description of what this template displays
 *}

<h1><{$page_title}></h1>
```

---

## Variables y Nombres

### Convención de Nombres de Variables

```smarty
{* Usar nombres descriptivos *}
<{$page_title}>              {* ✅ Claro *}
<{$items}>                   {* ✅ Claro *}
<{$user_count}>              {* ✅ Claro *}

<{$p_t}>                     {* ❌ Abreviatura poco clara *}
<{$x}>                       {* ❌ Poco claro *}
```

### Alcance de Variables

```smarty
{* Variables globales de XOOPS *}
<{$xoops_url}>              {* URL raíz *}
<{$xoops_sitename}>         {* Nombre del sitio *}
<{$xoops_requesturi}>       {* URI actual *}
<{$xoops_isadmin}>          {* Bandera de modo admin *}
<{$xoops_user_is_admin}>    {* ¿Es usuario admin? *}

{* Variables de módulo comunes *}
<{$module_id}>              {* ID del módulo actual *}
<{$module_name}>            {* Nombre del módulo actual *}
<{$moduledir}>              {* Directorio del módulo *}
<{$lang}>                   {* Idioma actual *}
```

---

## Formato y Espaciado

### Estructura Básica

```smarty
{*
 * Encabezado de plantilla
 *}

{* Incluir otras plantillas *}
<{include file="db:modulename_header.tpl"}>

{* Contenido principal *}
<main class="modulename-container">
  <h1><{$page_title}></h1>

  <{if $items|@count > 0}>
    {* Renderizar elementos *}
  <{else}>
    {* Mostrar estado vacío *}
  <{/if}>
</main>

{* Pie de página *}
<{include file="db:modulename_footer.tpl"}>
```

### Indentación

```smarty
{* Usar 2 espacios para indentación *}
<{if $condition}>
  <div>
    <p><{$content}></p>
  </div>
<{/if}>

{* No omitir líneas dentro de bloques *}
<{foreach item=item from=$items}>
  <div class="item">
    <h3><{$item.title}></h3>
    <p><{$item.description}></p>
  </div>
<{/foreach}>
```

### Espaciado Alrededor de Etiquetas

```smarty
{* Sin espacios dentro de delimitadores de etiqueta *}
<{$variable}>                {* ✅ *}
<{ $variable }>              {* ❌ *}

{* Espacio después de pipes en modificadores *}
<{$text|truncate:50}>        {* ✅ *}
<{$text|truncate:50}>        {* ✅ *}

{* Espacio alrededor de operadores en condicionales *}
<{if $count > 0}>            {* ✅ *}
<{if $count>0}>              {* ❌ *}
```

---

## Estructuras de Control

### Condicionales

```smarty
{* Simple if/else *}
<{if $is_published}>
  <span class="status--published">Publicado</span>
<{else}>
  <span class="status--draft">Borrador</span>
<{/if}>

{* if/elseif/else *}
<{if $status == 'active'}>
  <div class="alert--success">Activo</div>
<{elseif $status == 'pending'}>
  <div class="alert--warning">Revisión Pendiente</div>
<{else}>
  <div class="alert--danger">Inactivo</div>
<{/if}>

{* Ternario en línea (Smarty 3+) *}
<span class="badge <{if $is_featured}>badge--featured<{/if}>">
  <{$label}>
</span>
```

### Bucles

```smarty
{* foreach básico *}
<ul class="item-list">
  <{foreach item=item from=$items}>
    <li class="item-list__item">
      <{$item.title}>
    </li>
  <{/foreach}>
</ul>

{* Con clave e contador *}
<{foreach item=item key=key from=$items}>
  <div class="item" data-index="<{$key}>">
    <{$item.title}> (<{$smarty.foreach.item.iteration}>/<{$smarty.foreach.item.total}>)
  </div>
<{/foreach}>

{* Con alternancia *}
<{foreach item=item from=$items}>
  <div class="item <{if $smarty.foreach.item.iteration % 2 == 0}>item--even<{else}>item--odd<{/if}>">
    <{$item.title}>
  </div>
<{/foreach}>

{* Verificar si está vacío *}
<{if $items|@count > 0}>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{else}>
  <p class="empty-state">No se encontraron elementos</p>
<{/if}>
```

### Sección (deprecada, usar foreach en su lugar)

```smarty
{* No usar section - está deprecada *}
{* ❌ <{section name=i loop=$items}> *}

{* Usar foreach en su lugar *}
{* ✅ *}
<{foreach item=item from=$items}>
```

---

## Salida de Variables

### Salida Básica

```smarty
{* Mostrar variable tal cual *}
<{$title}>

{* Mostrar con valor por defecto si está vacío *}
<{$title|default:'Sin título'}>

{* Escapar HTML (por defecto para seguridad) *}
<{$content}>                  {* Escapado por defecto *}
<{$content|escape:'html'}>    {* Explícitamente escapado *}

{* Salida sin procesar (¡usar con cuidado!) *}
<{$html_content|escape:false}>

{* Codificación especial *}
<{$url|escape:'url'}>         {* Para contexto URL *}
<{$json|escape:'javascript'}> {* Para JavaScript *}
```

### Modificadores

```smarty
{* Formato de texto *}
<{$text|upper}>              {* Convertir a mayúsculas *}
<{$text|lower}>              {* Convertir a minúsculas *}
<{$text|capitalize}>         {* Capitalizar primera letra *}
<{$text|truncate:50:'...'}>  {* Truncar a 50 caracteres *}

{* Formato de número *}
<{$price|number_format:2}>   {* Formato numérico *}
<{$count|string_format:"%03d"}> {* Formato como cadena *}

{* Formato de fecha *}
<{$date|date_format:'%Y-%m-%d'}> {* Formato de fecha *}
<{$date|date_format:'%B %d, %Y'}>

{* Operaciones de array *}
<{$items|@count}>            {* Contar elementos (nota @) *}
<{$items|@array_keys}>       {* Obtener claves *}

{* Encadenamiento de modificadores *}
<{$title|upper|truncate:30:'...'}> {* Encadenar múltiples *}

{* Modificador condicional *}
<{$status|default:'pending'}>
```

---

## Constantes

### Usar Constantes de XOOPS

```smarty
{* Usar constantes definidas con define() desde PHP *}
{* Estas deben definirse en PHP primero *}

{* Constantes principales *}
<{$smarty.const._MD_MODULENAME_TITLE}>
<{$smarty.const._MD_MODULENAME_SUBMIT}>

{* Constantes de módulo *}
<{$smarty.const.MODULEDIR}>
<{$smarty.const.MODULEURL}>

{* Constantes personalizadas *}
<{$smarty.const._MY_CONSTANT}>
```

### Constantes de Idioma

```smarty
{* Usar constantes de idioma para i18n *}
{* Definir en archivo de idioma: define('_MD_MODULENAME_TITLE', 'English Title'); *}

<h1><{$smarty.const._MD_MODULENAME_TITLE}></h1>
<p><{$smarty.const._MD_MODULENAME_DESCRIPTION}></p>
<button><{$smarty.const._MD_MODULENAME_SUBMIT}></button>
```

---

## Mejores Prácticas HTML

### Marcado Semántico

```smarty
{* Usar elementos HTML semánticos *}

<article class="item">
  <header class="item__header">
    <h1 class="item__title"><{$item.title}></h1>
    <time class="item__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
      <{$item.created|date_format:'%B %d, %Y'}>
    </time>
  </header>

  <main class="item__content">
    <{$item.content|escape:false}>
  </main>

  <footer class="item__footer">
    <span class="item__author">Por <{$item.author}></span>
  </footer>
</article>
```

### Accesibilidad

```smarty
{* Usar HTML semántico para accesibilidad *}

{* Enlaces con texto significativo *}
<a href="<{$item.url}>" class="button">
  <{$item.title}> {* ✅ Texto de enlace significativo *}
</a>

{* Imágenes con texto alternativo *}
<img src="<{$image.url}>" alt="<{$image.alt_text}>" class="item__image">

{* Etiquetas de formulario con entradas *}
<label for="email-input" class="form-field__label">
  Dirección de Correo Electrónico
</label>
<input id="email-input" type="email" name="email" class="form-field__input" required>

{* Encabezados en orden *}
<h1><{$page_title}></h1>
<h2><{$section_title}></h2> {* ✅ En orden *}
<h4></h4>                  {* ❌ Omite h3 *}

{* Usar atributos aria cuando sea necesario *}
<nav aria-label="Navegación principal">
  <{$menu}>
</nav>

<button aria-expanded="<{if $is_open}>true<{else}>false<{/if}>">
  Menú
</button>
```

---

## Patrones Comunes

### Paginación

```smarty
{* Mostrar paginación *}
<{if $paginator|default:false}>
  <nav class="pagination" aria-label="Paginación">
    <ul class="pagination__list">
      <{if $paginator.has_previous}>
        <li class="pagination__item">
          <a href="<{$paginator.first_url}>" class="pagination__link">Primera</a>
        </li>
      <{/if}>

      <{foreach item=page from=$paginator.pages}>
        <li class="pagination__item">
          <{if $page.is_current}>
            <span class="pagination__link pagination__link--current" aria-current="page">
              <{$page.number}>
            </span>
          <{else}>
            <a href="<{$page.url}>" class="pagination__link">
              <{$page.number}>
            </a>
          <{/if}>
        </li>
      <{/foreach}>

      <{if $paginator.has_next}>
        <li class="pagination__item">
          <a href="<{$paginator.last_url}>" class="pagination__link">Última</a>
        </li>
      <{/if}>
    </ul>
  </nav>
<{/if}>
```

### Migajas

```smarty
{* Mostrar navegación de migajas *}
<nav class="breadcrumb" aria-label="Migajas">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="<{$xoops_url}>" class="breadcrumb__link">Inicio</a>
    </li>

    <{foreach item=crumb from=$breadcrumbs}>
      <li class="breadcrumb__item">
        <{if $crumb.url}>
          <a href="<{$crumb.url}>" class="breadcrumb__link">
            <{$crumb.title}>
          </a>
        <{else}>
          <span class="breadcrumb__current" aria-current="page">
            <{$crumb.title}>
          </span>
        <{/if}>
      </li>
    <{/foreach}>
  </ol>
</nav>
```

### Mensajes de Alerta

```smarty
{* Mostrar mensajes *}
<{if $messages|default:false}>
  <{foreach item=message from=$messages}>
    <div class="alert alert--<{$message.type}>" role="alert">
      <{$message.text}>
    </div>
  <{/foreach}>
<{/if}>

{* Mostrar errores *}
<{if $errors|default:false}>
  <div class="alert alert--danger" role="alert">
    <h2 class="alert__title">Error</h2>
    <ul class="alert__list">
      <{foreach item=error from=$errors}>
        <li><{$error}></li>
      <{/foreach}>
    </ul>
  </div>
<{/if}>
```

---

## Rendimiento

### Optimización de Plantillas

```smarty
{* Asignar variables una vez, reutilizar *}
<{assign var=item_count value=$items|@count}>
<{if $item_count > 0}>
  <p>Se encontraron <{$item_count}> elementos</p>
  <ul>
    <{foreach item=item from=$items}>
      <li><{$item.title}></li>
    <{/foreach}>
  </ul>
<{/if}>

{* Usar {assign} para valores calculados *}
<{assign var=is_admin value=$xoops_isadmin}>
<{if $is_admin}>
  {* Opciones de admin *}
<{/if}>
<{if $is_admin}>
  {* Reutilizar mismo valor calculado *}
<{/if}>

{* Evitar lógica compleja en plantillas *}
{* ❌ Cálculo complejo en plantilla *}
<{$total = 0}>
<{foreach item=item from=$items}>
  <{$total = $total + $item.price * $item.quantity}>
<{/foreach}>
<p><{$total}></p>

{* ✅ Calcular en PHP, mostrar en plantilla *}
<p><{$total}></p> {* Pasado desde controlador PHP *}
```

---

## Mejores Prácticas

### Si

- Usar HTML5 semántico
- Incluir texto alternativo para imágenes
- Usar constantes de idioma para texto
- Escapar salida (por defecto)
- Mantener lógica mínima
- Usar nombres de variables significativos
- Incluir encabezados de archivo
- Usar nombres de clase estilo BEM
- Probar con lectores de pantalla

### No

- No mezclar lógica y presentación
- No olvidar texto alternativo
- No usar HTML sin procesar sin escapar
- No crear variables globales en plantillas
- No usar características de Smarty deprecadas
- No anidar plantillas demasiado profundamente
- No ignorar accesibilidad
- No codificar texto (usar constantes)

---

## Ejemplos de Plantillas

### Plantilla Completa de Módulo

```smarty
{*
 * XOOPS Module - Publisher
 * @file Item list template
 * @author XOOPS Team
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 *}

<{include file="db:publisher_header.tpl"}>

<main class="publisher-container">
  <header class="page-header">
    <h1 class="page-header__title"><{$page_title}></h1>
    <p class="page-header__subtitle"><{$smarty.const._MD_PUBLISHER_ITEMS_DESC}></p>
  </header>

  <{if $items|@count > 0}>
    <section class="items-list">
      <ul class="items-list__items">
        <{foreach item=item from=$items}>
          <li class="items-list__item item-card">
            <article class="item-card">
              <h2 class="item-card__title">
                <a href="<{$item.url}>" class="item-card__link">
                  <{$item.title}>
                </a>
              </h2>

              <div class="item-card__meta">
                <time class="item-card__date" datetime="<{$item.created|date_format:'%Y-%m-%d'}>">
                  <{$item.created|date_format:'%B %d, %Y'}>
                </time>
                <span class="item-card__author">
                  Por <{$item.author}>
                </span>
              </div>

              <p class="item-card__excerpt">
                <{$item.description|truncate:150:'...'}>
              </p>

              <a href="<{$item.url}>" class="button button--primary">
                <{$smarty.const._MD_PUBLISHER_READ_MORE}>
              </a>
            </article>
          </li>
        <{/foreach}>
      </ul>
    </section>

    <{if $paginator|default:false}>
      <{include file="db:publisher_pagination.tpl"}>
    <{/if}>
  <{else}>
    <div class="empty-state">
      <p class="empty-state__message">
        <{$smarty.const._MD_PUBLISHER_NO_ITEMS}>
      </p>
    </div>
  <{/if}>
</main>

<{include file="db:publisher_footer.tpl"}>
```

---

## Documentación Relacionada

- Estándares JavaScript
- Directrices CSS
- Código de Conducta
- Estándares PHP

---

#xoops #smarty #templates #conventions #best-practices
