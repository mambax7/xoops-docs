---
title: "Fundamentos de Smarty"
description: "Fundamentos de plantillas Smarty en XOOPS"
---

<span class="version-badge version-25x">2.5.x: Smarty 3</span> <span class="version-badge version-40x">4.0.x: Smarty 4</span>

:::note[Versión de Smarty por Versión XOOPS]
| Versión XOOPS | Versión Smarty | Diferencias Clave |
|---------------|----------------|-----------------|
| 2.5.11 | Smarty 3.x | Bloques `{php}` permitidos (pero desaconsejados) |
| 2.7.0+ | Smarty 3.x/4.x | Preparándose para compatibilidad Smarty 4 |
| 4.0 | Smarty 4.x | Bloques `{php}` eliminados, sintaxis más estricta |

Ver Smarty-4-Migration para orientación de migración.
:::

Smarty es un motor de plantillas para PHP que permite a los desarrolladores separar la presentación (HTML/CSS) de la lógica de la aplicación. XOOPS usa Smarty para todas sus necesidades de plantillas, permitiendo una separación limpia entre el código PHP y la salida HTML.

## Documentación Relacionada

- Theme-Development - Creación de temas XOOPS
- Template-Variables - Variables disponibles en plantillas
- Smarty-4-Migration - Actualización de Smarty 3 a 4

## ¿Qué es Smarty?

Smarty proporciona:

- **Separación de Responsabilidades**: Mantener HTML en plantillas, lógica PHP en clases
- **Herencia de Plantillas**: Construir diseños complejos a partir de bloques simples
- **Caché**: Mejorar rendimiento con plantillas compiladas
- **Modificadores**: Transformar salida con funciones incorporadas o personalizadas
- **Seguridad**: Controlar qué funciones PHP pueden acceder las plantillas

## Configuración de Smarty en XOOPS

XOOPS configura Smarty con delimitadores personalizados:

```
Smarty Predeterminado: { y }
Smarty XOOPS:          <{ y }>
```

Esto previene conflictos con código JavaScript en plantillas.

## Sintaxis Básica

### Variables

Las variables se pasan de PHP a plantillas:

```php
// En PHP
$GLOBALS['xoopsTpl']->assign('title', 'My Page Title');
$GLOBALS['xoopsTpl']->assign('count', 42);
```

```smarty
{* En plantilla *}
<h1><{$title}></h1>
<p>Total items: <{$count}></p>
```

### Acceso a Matrices

```php
// PHP
$item = [
    'id' => 1,
    'title' => 'Article Title',
    'author' => 'John Doe'
];
$GLOBALS['xoopsTpl']->assign('item', $item);
```

```smarty
{* Plantilla *}
<h2><{$item.title}></h2>
<p>By: <{$item.author}></p>
```

### Propiedades de Objeto

```php
// PHP
$GLOBALS['xoopsTpl']->assign('user', $xoopsUser);
```

```smarty
{* Plantilla *}
<p>Welcome, <{$user->getVar('uname')}>!</p>
```

## Comentarios

Los comentarios en Smarty no se renderizan a HTML:

```smarty
{* This is a comment - it will not appear in the HTML output *}

{*
   Multi-line comments
   are also supported
*}
```

## Estructuras de Control

### Declaraciones If/Else

```smarty
<{if $user_logged_in}>
    <p>Welcome back!</p>
<{elseif $is_guest}>
    <p>Hello, Guest!</p>
<{else}>
    <p>Please log in.</p>
<{/if}>
```

### Operadores de Comparación

```smarty
{* Equality *}
<{if $status == 'published'}>Published<{/if}>
<{if $status eq 'published'}>Published<{/if}>

{* Inequality *}
<{if $count != 0}>Has items<{/if}>
<{if $count neq 0}>Has items<{/if}>

{* Greater/Less than *}
<{if $count > 10}>Many items<{/if}>
<{if $count gt 10}>Many items<{/if}>
<{if $count < 5}>Few items<{/if}>
<{if $count lt 5}>Few items<{/if}>

{* Greater/Less than or equal *}
<{if $count >= 10}>Ten or more<{/if}>
<{if $count gte 10}>Ten or more<{/if}>
<{if $count <= 5}>Five or less<{/if}>
<{if $count lte 5}>Five or less<{/if}>

{* Logical operators *}
<{if $logged_in && $is_admin}>Admin Panel<{/if}>
<{if $logged_in and $is_admin}>Admin Panel<{/if}>
<{if $option1 || $option2}>One option selected<{/if}>
<{if $option1 or $option2}>One option selected<{/if}>
<{if !$is_banned}>Access granted<{/if}>
<{if not $is_banned}>Access granted<{/if}>
```

### Comprobación de Vacío/Isset

```smarty
{* Check if variable exists and has value *}
<{if $title}>
    <h1><{$title}></h1>
<{/if}>

{* Check if array is not empty *}
<{if $items|@count > 0}>
    <ul>
        <{foreach $items as $item}>
            <li><{$item.name}></li>
        <{/foreach}>
    </ul>
<{/if}>

{* Using isset *}
<{if isset($description)}>
    <p><{$description}></p>
<{/if}>
```

### Bucles Foreach

```smarty
{* Basic foreach *}
<ul>
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{/foreach}>
</ul>

{* With key *}
<{foreach $options as $key => $value}>
    <option value="<{$key}>"><{$value}></option>
<{/foreach}>

{* With @index, @first, @last *}
<{foreach $items as $item}>
    <{if $item@first}><ul><{/if}>
    <li class="item-<{$item@index}>"><{$item.name}></li>
    <{if $item@last}></ul><{/if}>
<{/foreach}>

{* Alternate row colors *}
<{foreach $rows as $row}>
    <tr class="<{if $row@iteration is odd}>odd<{else}>even<{/if}>">
        <td><{$row.name}></td>
    </tr>
<{/foreach}>

{* Foreachelse for empty arrays *}
<{foreach $items as $item}>
    <li><{$item.name}></li>
<{foreachelse}>
    <li>No items found.</li>
<{/foreach}>
```

### Bucles For

```smarty
<{for $i=1 to 10}>
    <p>Item <{$i}></p>
<{/for}>

<{for $i=10 to 1 step -1}>
    <p>Countdown: <{$i}></p>
<{/for}>
```

### Bucles While

```smarty
<{while $count > 0}>
    <p><{$count}></p>
    <{$count = $count - 1}>
<{/while}>
```

## Modificadores de Variables

Los modificadores transforman la salida de variables:

### Modificadores de Cadena

```smarty
{* HTML escape (always use for user input!) *}
<{$title|escape}>
<{$title|escape:'html'}>

{* URL encoding *}
<{$url|escape:'url'}>

{* Uppercase/Lowercase *}
<{$name|upper}>
<{$name|lower}>
<{$name|capitalize}>

{* Truncate text *}
<{$content|truncate:100:'...'}>

{* Strip HTML tags *}
<{$html|strip_tags}>

{* Replace *}
<{$text|replace:'old':'new'}>

{* Word wrap *}
<{$text|wordwrap:80:"\n"}>

{* Default value *}
<{$optional_var|default:'No value'}>
```

### Modificadores Numéricos

```smarty
{* Number formatting *}
<{$price|string_format:"%.2f"}>
<{$count|number_format}>

{* Date formatting *}
<{$timestamp|date_format:"%B %e, %Y"}>
<{$timestamp|date_format:"%Y-%m-%d %H:%M"}>
```

### Modificadores de Matriz

```smarty
{* Count items *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Encadenamiento de Modificadores

```smarty
<{$content|strip_tags|truncate:200:'...'|escape}>
```

## Incluir e Insertar

### Incluir Otras Plantillas

```smarty
{* Include a template file *}
<{include file="db:mymodule_header.tpl"}>

{* Include with variables *}
<{include file="db:mymodule_item.tpl" item=$currentItem}>

{* Include with assigned variables *}
<{include file="db:sidebar.tpl" assign="sidebar_content"}>
<div class="sidebar"><{$sidebar_content}></div>
```

### Insertar Contenido Dinámico

```smarty
{* Insert calls a PHP function for dynamic content *}
<{insert name="getBanner"}>
```

## Asignar Variables en Plantillas

```smarty
{* Simple assignment *}
<{assign var="page_title" value="Welcome"}>
<{$page_title = "Welcome"}>

{* Assignment from expression *}
<{assign var="full_name" value="`$first_name` `$last_name`"}>

{* Capture block content *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
    <ul>
        <li>Link 1</li>
        <li>Link 2</li>
    </ul>
<{/capture}>
<div class="sidebar"><{$smarty.capture.sidebar}></div>
```

## Variables Smarty Incorporadas

### Variable $smarty

```smarty
{* Current timestamp *}
<{$smarty.now|date_format:"%Y-%m-%d"}>

{* Request variables *}
<{$smarty.get.page}>
<{$smarty.post.username}>
<{$smarty.request.id}>
<{$smarty.cookies.session_id}>
<{$smarty.server.HTTP_HOST}>

{* Constants *}
<{$smarty.const.XOOPS_URL}>

{* Configuration variables *}
<{$smarty.config.var_name}>

{* Template info *}
<{$smarty.template}>
<{$smarty.current_dir}>

{* Smarty version *}
<{$smarty.version}>

{* Section/Foreach properties *}
<{$smarty.foreach.items.index}>
<{$smarty.foreach.items.iteration}>
<{$smarty.foreach.items.first}>
<{$smarty.foreach.items.last}>
```

## Bloques Literales

Para JavaScript con llaves:

```smarty
<{literal}>
<script>
    var config = {
        url: 'https://example.com',
        count: 10
    };
    if (config.count > 5) {
        console.log('Many items');
    }
</script>
<{/literal}>
```

O usar variables de Smarty dentro de JavaScript:

```smarty
<script>
var moduleUrl = '<{$xoops_url}>/modules/mymodule';
var items = <{$items_json}>;
</script>
```

## Funciones Personalizadas

XOOPS proporciona funciones Smarty personalizadas:

```smarty
{* XOOPS Image URL *}
<img src="<{xoImgUrl}>images/logo.png" alt="Logo">

{* XOOPS Module URL *}
<a href="<{xoModuleUrl}>">Module Home</a>

{* App URL *}
<a href="<{xoAppUrl 'item.php'}>?id=<{$item.id}>">View Item</a>
```

## Mejores Prácticas

### Siempre Escapar Salida

```smarty
{* For user-generated content, always escape *}
<p><{$user_comment|escape}></p>

{* For HTML content, use appropriate method *}
<div><{$content}></div> {* Only if content is pre-sanitized *}
```

### Usar Nombres de Variables Significativos

```php
// Good
$GLOBALS['xoopsTpl']->assign('article_title', $title);
$GLOBALS['xoopsTpl']->assign('article_items', $items);

// Avoid
$GLOBALS['xoopsTpl']->assign('t', $title);
$GLOBALS['xoopsTpl']->assign('arr', $items);
```

### Mantener Lógica Mínima

Las plantillas deben enfocarse en la presentación. Mover lógica compleja a PHP:

```smarty
{* Avoid complex logic in templates *}
{* Bad *}
<{if $user && $user->getVar('level') > 5 && $user->getVar('status') == 'active' && $permissions|in_array:'edit'}>

{* Good - calculate in PHP and pass a simple flag *}
<{if $can_edit}>
```

### Usar Herencia de Plantillas

Para diseños consistentes, usar herencia de plantillas (ver Theme-Development).

## Depuración de Plantillas

### Consola de Depuración

```smarty
{* Show all assigned variables *}
<{debug}>
```

### Salida Temporal

```smarty
{* Debug specific variable *}
<pre><{$variable|@print_r}></pre>
<pre><{$variable|@var_export}></pre>
```

## Patrones Comunes de Plantilla XOOPS

### Estructura de Plantilla de Módulo

```smarty
{* Module header *}
<div class="mymodule">
    <h2><{$module_name}></h2>

    {* Breadcrumb *}
    <{if $breadcrumb}>
    <nav class="breadcrumb">
        <{foreach $breadcrumb as $crumb}>
            <{if $crumb@last}>
                <span><{$crumb.title}></span>
            <{else}>
                <a href="<{$crumb.link}>"><{$crumb.title}></a> &raquo;
            <{/if}>
        <{/foreach}>
    </nav>
    <{/if}>

    {* Content *}
    <div class="content">
        <{$content}>
    </div>
</div>
```

### Paginación

```smarty
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

### Mostrada de Formulario

```smarty
<{if $form}>
<div class="form-container">
    <{$form}>
</div>
<{/if}>
```

---

#smarty #templates #xoops #frontend #template-engine
