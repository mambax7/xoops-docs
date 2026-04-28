---
title: "FAQ de Módulos"
description: "Preguntas frecuentes sobre módulos de XOOPS"
---

# Preguntas Frecuentes sobre Módulos

> Preguntas comunes y respuestas sobre módulos de XOOPS, instalación y gestión.

---

## Instalación y Activación

### P: ¿Cómo instalo un módulo en XOOPS?

**R:**
1. Descargar el archivo zip del módulo
2. Ir a XOOPS Admin > Módulos > Gestionar Módulos
3. Hacer clic en "Examinar" y seleccionar el archivo zip
4. Hacer clic en "Subir"
5. El módulo aparece en la lista (generalmente desactivado)
6. Hacer clic en el icono de activación para habilitarlo

Alternativamente, extraer el zip directamente en `/xoops_root/modules/` y navegar al panel de administración.

---

### P: La subida del módulo falla con "Permiso denegado"

**R:** Este es un problema de permisos de archivo:

```bash
# Corregir permisos del directorio de módulos
chmod 755 /path/to/xoops/modules

# Corregir directorio de subida (si se carga)
chmod 777 /path/to/xoops/uploads

# Corregir propiedad si es necesario
chown -R www-data:www-data /path/to/xoops
```

Ver Errores de Instalación de Módulos para más detalles.

---

### P: ¿Por qué no puedo ver el módulo en el panel de administración después de la instalación?

**R:** Verificar lo siguiente:

1. **Módulo no activado** - Hacer clic en el icono de ojo en la lista de Módulos
2. **Página de administración faltante** - El módulo debe tener `hasAdmin = 1` en xoopsversion.php
3. **Archivos de idioma faltantes** - Necesita `language/english/admin.php`
4. **Caché no limpiado** - Limpiar caché y actualizar navegador

```bash
# Limpiar caché de XOOPS
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### P: ¿Cómo desinstalo un módulo?

**R:**
1. Ir a XOOPS Admin > Módulos > Gestionar Módulos
2. Desactivar el módulo (hacer clic en el icono de ojo)
3. Hacer clic en el icono de papelera/eliminar
4. Eliminar manualmente la carpeta del módulo si desea una eliminación completa:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Gestión de Módulos

### P: ¿Cuál es la diferencia entre deshabilitar y desinstalar?

**R:**
- **Deshabilitar**: Desactivar el módulo (hacer clic en icono de ojo). Las tablas de base de datos permanecen.
- **Desinstalar**: Eliminar el módulo. Elimina las tablas de base de datos y lo quita de la lista.

Para eliminar completamente, también elimine la carpeta:
```bash
rm -rf modules/modulename
```

---

### P: ¿Cómo verifico si un módulo está correctamente instalado?

**R:** Usar el script de depuración:

```php
<?php
// Crear admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Solo administrador');
}

echo "<h1>Depuración de Módulos</h1>";

// Listar todos los módulos
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Estado: " . ($module->getVar('isactive') ? "Activo" : "Inactivo") . "<br>";
    echo "Directorio: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Versión: " . $module->getVar('version') . "<br>";
}
?>
```

---

### P: ¿Puedo ejecutar múltiples versiones del mismo módulo?

**R:** No, XOOPS no soporta esto nativamente. Sin embargo, puede:

1. Crear una copia con nombre de directorio diferente: `mymodule` y `mymodule2`
2. Actualizar el dirname en xoopsversion.php de ambos módulos
3. Asegurar nombres únicos de tablas de base de datos

Esto no se recomienda ya que comparten el mismo código.

---

## Configuración de Módulos

### P: ¿Dónde configuro los ajustes del módulo?

**R:**
1. Ir a XOOPS Admin > Módulos
2. Hacer clic en el icono de configuración/engranaje junto al módulo
3. Configurar preferencias

Los ajustes se almacenan en la tabla `xoops_config`.

**Acceder en código:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### P: ¿Cómo defino opciones de configuración del módulo?

**R:** En xoopsversion.php:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## Características del Módulo

### P: ¿Cómo agrego una página de administración a mi módulo?

**R:** Crear la estructura:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

En xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Crear `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Administración de Módulo</h1>";
xoops_cp_footer();
?>
```

---

### P: ¿Cómo agrego funcionalidad de búsqueda a mi módulo?

**R:**
1. Establecer en xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Crear `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Implementación de búsqueda
    $results = [];
    return $results;
}
?>
```

---

### P: ¿Cómo agrego notificaciones a mi módulo?

**R:**
1. Establecer en xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. Desencadenar notificación en código:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Elemento publicado',
    'descripción'
);
?>
```

---

## Permisos del Módulo

### P: ¿Cómo establecer permisos del módulo?

**R:**
1. Ir a XOOPS Admin > Módulos > Permisos de Módulo
2. Seleccionar el módulo
3. Elegir usuario/grupo y nivel de permiso
4. Guardar

**En código:**
```php
<?php
// Verificar si el usuario puede acceder al módulo
if (!xoops_isUser()) {
    exit('Se requiere inicio de sesión');
}

// Verificar permiso específico
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Acceso denegado');
}
?>
```

---

## Base de Datos del Módulo

### P: ¿Dónde se almacenan las tablas de base de datos del módulo?

**R:** Todas en la base de datos principal de XOOPS, con prefijo de su prefijo de tabla (generalmente `xoops_`):

```bash
# Listar todas las tablas del módulo
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# O en PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### P: ¿Cómo actualizo las tablas de base de datos del módulo?

**R:** Crear un script de actualización en su módulo:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Solo administrador');
}

// Agregar nueva columna
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Actualizado exitosamente";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## Dependencias del Módulo

### P: ¿Cómo verifico si los módulos requeridos están instalados?

**R:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Verificar si un módulo existe
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module no está instalado o activo');
}
?>
```

---

### P: ¿Los módulos pueden depender de otros módulos?

**R:** Sí, declarar en xoopsversion.php:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = ilimitado
        'order' => 1
    ]
];
?>
```

---

## Solución de Problemas

### P: El módulo aparece en la lista pero no se activa

**R:** Verificar:
1. Sintaxis de xoopsversion.php - Usar PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Archivo SQL de base de datos:
```bash
# Verificar sintaxis SQL
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Archivos de idioma:
```bash
ls -la modules/mymodule/language/english/
```

Ver Errores de Instalación de Módulos para diagnósticos detallados.

---

### P: Módulo activado pero no se muestra en el sitio principal

**R:**
1. Establecer `hasMain = 1` en xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Crear `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Bienvenido a mi módulo";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### P: El módulo causa "pantalla blanca de la muerte"

**R:** Habilitar depuración para encontrar el error:

```php
<?php
// En mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Verificar el registro de errores:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Ver Pantalla Blanca de la Muerte para soluciones.

---

## Rendimiento

### P: El módulo es lento, ¿cómo optimizo?

**R:**
1. **Verificar consultas de base de datos** - Usar registro de consultas
2. **Almacenar datos en caché** - Usar caché de XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hora
}
?>
```

3. **Optimizar plantillas** - Evitar bucles en plantillas
4. **Habilitar caché de código PHP** - APCu, XDebug, etc.

Ver FAQ de Rendimiento para más detalles.

---

## Desarrollo de Módulos

### P: ¿Dónde puedo encontrar documentación de desarrollo de módulos?

**R:** Ver:
- Guía de Desarrollo de Módulos
- Estructura de Módulos
- Crear Tu Primer Módulo

---

## Documentación Relacionada

- Errores de Instalación de Módulos
- Estructura de Módulos
- FAQ de Rendimiento
- Habilitar Modo de Depuración

---

#xoops #módulos #faq #solución_de_problemas
