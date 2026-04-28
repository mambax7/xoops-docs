---
title: "Migración Smarty 4"
description: "Guía para actualizar plantillas XOOPS de Smarty 3 a Smarty 4"
---

Esta guía cubre los cambios y pasos de migración necesarios al actualizar de Smarty 3 a Smarty 4 en XOOPS. Comprender estas diferencias es esencial para mantener la compatibilidad con instalaciones XOOPS modernas.

## Documentación Relacionada

- Smarty-Basics - Fundamentos de Smarty en XOOPS
- Theme-Development - Creación de temas XOOPS
- Template-Variables - Variables disponibles en plantillas

## Descripción General de Cambios

Smarty 4 introdujo varios cambios importantes de Smarty 3:

1. El comportamiento de asignación de variables cambió
2. Las etiquetas `{php}` se eliminaron completamente
3. Cambios en la API de caché
4. Actualizaciones en el manejo de modificadores
5. Cambios en la política de seguridad
6. Características obsoletas eliminadas

## Cambios en Acceso a Variables

### El Problema

En Smarty 2/3, los valores asignados eran directamente accesibles:

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - funcionaba bien *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

En Smarty 4, las variables se envuelven en objetos `Smarty_Variable`:

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### Solución 1: Acceder a la Propiedad Value

```smarty
{* Smarty 4 - acceder a la propiedad value *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### Solución 2: Modo de Compatibilidad

Habilitar el modo de compatibilidad en PHP:

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

Esto permite acceso directo a variables como en Smarty 3.

### Solución 3: Verificación de Versión Condicional

Escribir plantillas que funcionen en ambas versiones:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### Solución 4: Función Contenedora

Crear una función auxiliar para asignaciones:

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - asignar normalmente, acceder mediante ->value en plantillas
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - asignación estándar
        $smarty->assign($name, $value);
    }
}
```

## Eliminación de Etiquetas {php}

### El Problema

Smarty 3+ no soporta etiquetas `{php}` por razones de seguridad:

```smarty
{* Esto YA NO funciona en Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### Solución: Usar Variables de Smarty

```smarty
{* Usar el acceso a variables incorporado de Smarty *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### Solución: Mover Lógica a PHP

La lógica compleja debe estar en PHP, no en plantillas:

```php
// En PHP - hacer el procesamiento
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Asignar datos procesados a la plantilla
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* En plantilla - solo mostrar *}
<h2><{$category.name}></h2>
```

### Solución: Complementos Personalizados

Para funcionalidad reutilizable, crear complementos Smarty:

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* En plantilla *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## Cambios en Caché

### Caché de Smarty 3

```php
// Estilo Smarty 3
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Por variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Caché de Smarty 4

```php
// Estilo Smarty 4
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// O usando propiedades (aún funciona)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### Constantes de Caché

```php
// Modos de caché
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Usar cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Usar vida útil en caché
```

### Nocache en Plantillas

```smarty
{* Marcar contenido como nunca en caché *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## Cambios en Modificadores

### Modificadores de Cadena

Algunos modificadores fueron renombrados u obsoletos:

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - usar 'html' en su lugar *}
<{$text|escape:'html'}>
```

### Modificadores de Matriz

Los modificadores de matriz requieren el prefijo `@`:

```smarty
{* Contar elementos de matriz *}
<{$items|@count}> items

{* Unir matriz *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### Modificadores Personalizados

Los modificadores personalizados deben registrarse:

```php
// Registrar un modificador personalizado
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Procesar y devolver
    return processed_string($string, $param1);
}
```

## Cambios en Política de Seguridad

### Seguridad de Smarty 4

Smarty 4 tiene seguridad por defecto más estricta:

```php
// Configurar política de seguridad
$smarty->enableSecurity('Smarty_Security');

// O crear política personalizada
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### Funciones Permitidas

Por defecto, Smarty 4 restringe qué funciones PHP se pueden usar:

```smarty
{* Estos pueden estar restringidos *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

Configurar funciones permitidas si es necesario:

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## Actualizaciones en Herencia de Plantillas

### Sintaxis de Bloque

La sintaxis de bloque sigue siendo similar pero con algunos cambios:

```smarty
{* Plantilla padre *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Plantilla hijo *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Incluir contenido del bloque padre *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>Mi Contenido</h1>
{/block}
```

### Agregar y Prepend

```smarty
{block name=head append}
    {* Esto se añade después del contenido padre *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* Esto se añade antes del contenido padre *}
    <script src="early.js"></script>
{/block}
```

## Características Obsoletas

### Eliminadas en Smarty 4

| Característica | Alternativa |
|---------|-------------|
| Etiquetas `{php}` | Mover lógica a PHP o usar complementos |
| `{include_php}` | Usar complementos registrados |
| `$smarty.capture` | Aún funciona pero es obsoleto |
| `{strip}` con espacios | Usar herramientas de minificación |

### Usar Alternativas

```smarty
{* En lugar de {php} *}
{* Mover a PHP y asignar resultado *}

{* En lugar de include_php *}
<{include file="db:mytemplate.tpl"}>

{* En lugar de capture (aún funciona pero considerar) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## Lista de Verificación de Migración

### Antes de Migrar

1. [ ] Hacer copia de seguridad de todas las plantillas
2. [ ] Listar todo el uso de etiquetas `{php}`
3. [ ] Documentar complementos personalizados
4. [ ] Probar funcionalidad actual

### Durante Migración

1. [ ] Eliminar todas las etiquetas `{php}`
2. [ ] Actualizar sintaxis de acceso a variables
3. [ ] Verificar uso de modificadores
4. [ ] Actualizar configuración de caché
5. [ ] Revisar configuración de seguridad

### Después de Migración

1. [ ] Probar todas las plantillas
2. [ ] Verificar que todos los formularios funcionen
3. [ ] Verificar que el caché funcione
4. [ ] Probar con diferentes roles de usuario

## Pruebas de Compatibilidad

### Detección de Versión

```php
// Comprobar versión de Smarty en PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Código específico de Smarty 4+
} else {
    // Código de Smarty 3
}
```

### Comprobación de Versión en Plantilla

```smarty
{* Comprobar versión en plantilla *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Código de plantilla Smarty 4+ *}
<{else}>
    {* Código de plantilla Smarty 3 *}
<{/if}>
```

## Escribir Plantillas Compatible

### Mejores Prácticas

1. **Evitar etiquetas `{php}` por completo** - No funcionan en Smarty 3+

2. **Mantener plantillas simples** - La lógica compleja pertenece en PHP

3. **Usar modificadores estándar** - Evitar los obsoletos

4. **Probar en ambas versiones** - Si necesita soportar ambas

5. **Usar complementos para operaciones complejas** - Más mantenible

### Ejemplo: Plantilla Compatible

```smarty
{* Funciona en Smarty 3 y 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## Problemas Comunes de Migración

### Problema: Las Variables Devuelven Vacío

**Problema**: `<{$mod_url}>` devuelve nada en Smarty 4

**Solución**: Usar `<{$mod_url->value}>` o habilitar modo de compatibilidad

### Problema: Errores de Etiqueta PHP

**Problema**: La plantilla genera error en etiquetas `{php}`

**Solución**: Eliminar todas las etiquetas PHP y mover lógica a archivos PHP

### Problema: Modificador No Encontrado

**Problema**: El modificador personalizado genera error "unknown modifier"

**Solución**: Registrar el modificador con `registerPlugin()`

### Problema: Restricción de Seguridad

**Problema**: Función no permitida en plantilla

**Solución**: Agregar función a la lista permitida de la política de seguridad

---

#smarty #migration #upgrade #xoops #smarty4 #compatibility
