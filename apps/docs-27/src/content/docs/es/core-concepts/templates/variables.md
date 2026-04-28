---
title: "Variables de Plantilla"
description: "Variables Smarty disponibles en plantillas XOOPS"
---

XOOPS proporciona automáticamente muchas variables a las plantillas Smarty. Esta referencia documenta las variables disponibles para el desarrollo de plantillas de tema y módulo.

## Documentación Relacionada

- Smarty-Basics - Fundamentos de Smarty en XOOPS
- Theme-Development - Creación de temas XOOPS
- Smarty-4-Migration - Actualización de Smarty 3 a 4

## Variables Globales de Tema

Estas variables están disponibles en plantillas de tema (`theme.tpl`):

### Información del Sitio

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `$xoops_sitename` | Nombre del sitio de preferencias | `"My XOOPS Site"` |
| `$xoops_pagetitle` | Título de la página actual | `"Welcome"` |
| `$xoops_slogan` | Eslogan del sitio | `"Just Use It!"` |
| `$xoops_url` | URL completa de XOOPS | `"https://example.com"` |
| `$xoops_langcode` | Código de idioma | `"en"` |
| `$xoops_charset` | Conjunto de caracteres | `"UTF-8"` |

### Etiquetas Meta

| Variable | Descripción |
|----------|-------------|
| `$xoops_meta_keywords` | Palabras clave meta |
| `$xoops_meta_description` | Descripción meta |
| `$xoops_meta_robots` | Etiqueta meta de robots |
| `$xoops_meta_rating` | Clasificación de contenido |
| `$xoops_meta_author` | Etiqueta meta de autor |
| `$xoops_meta_copyright` | Aviso de derechos de autor |

### Información de Tema

| Variable | Descripción |
|----------|-------------|
| `$xoops_theme` | Nombre del tema actual |
| `$xoops_imageurl` | URL del directorio de imágenes del tema |
| `$xoops_themecss` | URL del archivo CSS principal del tema |
| `$xoops_icons32_url` | URL de iconos 32x32 |
| `$xoops_icons16_url` | URL de iconos 16x16 |

### Contenido de Página

| Variable | Descripción |
|----------|-------------|
| `$xoops_contents` | Contenido principal de la página |
| `$xoops_module_header` | Contenido de cabecera específico del módulo |
| `$xoops_footer` | Contenido de pie de página |
| `$xoops_js` | JavaScript a incluir |

### Navegación y Menús

| Variable | Descripción |
|----------|-------------|
| `$xoops_mainmenu` | Menú de navegación principal |
| `$xoops_usermenu` | Menú de usuario |

### Variables de Bloque

| Variable | Descripción |
|----------|-------------|
| `$xoops_lblocks` | Matriz de bloques izquierdos |
| `$xoops_rblocks` | Matriz de bloques derechos |
| `$xoops_cblocks` | Matriz de bloques centrales |
| `$xoops_showlblock` | Mostrar bloques izquierdos (booleano) |
| `$xoops_showrblock` | Mostrar bloques derechos (booleano) |
| `$xoops_showcblock` | Mostrar bloques centrales (booleano) |

## Variables de Usuario

Cuando un usuario ha iniciado sesión:

| Variable | Descripción |
|----------|-------------|
| `$xoops_isuser` | Usuario ha iniciado sesión (booleano) |
| `$xoops_isadmin` | Usuario es administrador (booleano) |
| `$xoops_userid` | ID de usuario |
| `$xoops_uname` | Nombre de usuario |
| `$xoops_isowner` | Usuario es propietario del contenido actual (booleano) |

### Acceder a Propiedades del Objeto Usuario

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## Variables de Módulo

En plantillas de módulo:

| Variable | Descripción |
|----------|-------------|
| `$xoops_dirname` | Nombre del directorio del módulo |
| `$xoops_modulename` | Nombre de visualización del módulo |
| `$mod_url` | URL del módulo (cuando se asigna) |

### Patrón Común de Plantilla de Módulo

```php
// En PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* En plantilla *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## Variables de Bloque

Cada bloque en `$xoops_lblocks`, `$xoops_rblocks` y `$xoops_cblocks` tiene:

| Propiedad | Descripción |
|----------|-------------|
| `$block.id` | ID de bloque |
| `$block.title` | Título del bloque |
| `$block.content` | Contenido HTML del bloque |
| `$block.template` | Nombre de plantilla del bloque |
| `$block.module` | Nombre del módulo |
| `$block.weight` | Peso/orden del bloque |

### Ejemplo de Visualización de Bloque

```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```

## Variables de Formulario

Cuando se usan clases XoopsForm:

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Plantilla *}
<div class="form-container">
    <{$form}>
</div>
```

## Variables de Paginación

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Plantilla *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## Asignación de Variables Personalizadas

### Valores Simples

```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```

### Matrices

```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```

### Objetos

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// O para XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Acceso a matriz *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Acceso a método de objeto *}
<h2><{$item_obj->getVar('title')}></h2>
```

### Matrices Anidadas

```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```

## Variables Incorporadas de Smarty

### $smarty.now

Marca de tiempo actual:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

Acceder a constantes PHP:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

Acceder a variables de solicitud (usar con cuidado):

```smarty
{* Solo para lectura, siempre escapar salida! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

Variables del servidor:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

Información de bucle:

```smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## Variables del Asistente XMF

Cuando se usa XMF, hay asistentes adicionales disponibles:

```php
// En PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* En plantilla *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```

## URLs de Imagen y Activos

```smarty
{* Imágenes del tema *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Imágenes del módulo *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Directorio de carga *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Usar iconos *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## Visualización Condicional Basada en Usuario

```smarty
{* Mostrar solo a usuarios registrados *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Mostrar solo a administradores *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Mostrar solo al propietario del contenido *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## Variables de Idioma

```php
// En PHP - cargar archivo de idioma
xoops_loadLanguage('main', 'mymodule');

// Asignar constantes de idioma
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* En plantilla *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

O usar constantes directamente:

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## Depuración de Variables

Para ver todas las variables disponibles:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #templates #variables #xoops #reference
