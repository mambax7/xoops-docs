---
title: "Páginas de Administración de Módulos"
description: "Crear páginas de administración de módulos estandarizadas y compatibles hacia adelante con XMF"
---

La clase `Xmf\Module\Admin` proporciona una forma consistente de crear interfaces de administración de módulos. Usar XMF para las páginas de administración garantiza la compatibilidad hacia adelante con futuras versiones de XOOPS mientras se mantiene una experiencia de usuario uniforme.

## Descripción General

La clase ModuleAdmin en XOOPS Frameworks facilitó la administración, pero su API ha evolucionado a través de las versiones. El contenedor `Xmf\Module\Admin`:

- Proporciona una API estable que funciona en versiones de XOOPS
- Maneja automáticamente las diferencias de API entre versiones
- Asegura que su código de administración sea compatible hacia adelante
- Ofrece métodos estáticos convenientes para tareas comunes

## Primeros Pasos

### Crear una Instancia de Administración

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Esto devuelve una instancia de `Xmf\Module\Admin` o una clase del sistema nativa si ya es compatible.

## Gestión de Iconos

### El Problema de la Ubicación de Iconos

Los iconos se han movido entre versiones de XOOPS, causando dolores de cabeza de mantenimiento. XMF resuelve esto con métodos de utilidad.

### Encontrar Iconos

**Forma antigua (dependiente de la versión):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Forma XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

El método `iconUrl()` devuelve una URL completa, por lo que no necesita preocuparse por la construcción de ruta.

### Tamaños de Icono

```php
// Iconos de 16x16
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// Iconos de 32x32 (predeterminado)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Solo la ruta (sin nombre de archivo)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Iconos de Menú

Para archivos menu.php de administración:

**Forma antigua:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**Forma XMF:**
```php
// Obtener ruta a iconos
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Páginas de Administración Estándar

### Página de Índice

**Formato antiguo:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Formato XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Página Acerca de

**Formato antiguo:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Formato XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Nota:** En futuras versiones de XOOPS, la información de PayPal se establece en xoops_version.php. La llamada a `setPaypal()` garantiza compatibilidad con versiones actuales mientras no tiene efecto en versiones más nuevas.

## Navegación

### Mostrar Menú de Navegación

```php
$admin = \Xmf\Module\Admin::getInstance();

// Mostrar navegación para la página actual
$admin->displayNavigation('items.php');

// O obtener cadena HTML
$navHtml = $admin->renderNavigation('items.php');
```

## Cuadros de Información

### Crear Cuadros de Información

```php
$admin = \Xmf\Module\Admin::getInstance();

// Agregar un cuadro de información
$admin->addInfoBox('Estadísticas del Módulo');

// Agregar líneas al cuadro de información
$admin->addInfoBoxLine('Total de Elementos: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Usuarios Activos: ' . $userCount, 'default', 'blue');

// Mostrar el cuadro de información
$admin->displayInfoBox();
```

## Cuadros de Configuración

Los cuadros de configuración muestran requisitos del sistema y comprobaciones de estado.

### Líneas de Configuración Básicas

```php
$admin = \Xmf\Module\Admin::getInstance();

// Agregar un mensaje simple
$admin->addConfigBoxLine('El módulo está correctamente configurado', 'default');

// Verificar si existe el directorio
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Verificar directorio con permisos
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Verificar si el módulo está instalado
$admin->addConfigBoxLine('xlanguage', 'module');

// Verificar módulo con advertencia en lugar de error si falta
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### Métodos de Conveniencia

```php
$admin = \Xmf\Module\Admin::getInstance();

// Agregar mensaje de error
$admin->addConfigError('El directorio de carga no es escribible');

// Agregar mensaje de éxito/aceptación
$admin->addConfigAccept('Tablas de base de datos verificadas');

// Agregar mensaje de advertencia
$admin->addConfigWarning('El directorio de caché debe limpiarse');

// Verificar versión del módulo
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Tipos de Cuadros de Configuración

| Tipo | Valor | Comportamiento |
|------|-------|----------|
| `default` | Cadena de mensaje | Muestra el mensaje directamente |
| `folder` | Ruta de directorio | Muestra aceptación si existe, error si no |
| `chmod` | `[ruta, permiso]` | Verifica que el directorio existe con permiso |
| `module` | Nombre del módulo | Aceptación si está instalado, error si no |
| `module` | `[nombre, 'warning']` | Aceptación si está instalado, advertencia si no |

## Botones de Elemento

Agregar botones de acción a las páginas de administración:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Agregar botones
$admin->addItemButton('Agregar Nuevo Elemento', 'item.php?op=new', 'add');
$admin->addItemButton('Importar Elementos', 'import.php', 'import');

// Mostrar botones (alineados a la izquierda por defecto)
$admin->displayButton('left');

// O obtener HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Ejemplos Completos de Página de Administración

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Mostrar navegación
$adminObject->displayNavigation(basename(__FILE__));

// Agregar cuadro de información con estadísticas
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Verificar configuración
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Verificar módulos opcionales
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Mostrar la página de índice
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Obtener operación
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Agregar botones de acción
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // Listar elementos
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Mostrar tabla
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Código de manejo de formulario...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Establecer ID de PayPal para donaciones (opcional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Mostrar página acerca de
// Pasar false para ocultar logo de XOOPS, true para mostrarlo
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Obtener ruta de icono usando XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Panel de control
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Elementos
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categorías
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permisos
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// Acerca de
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Referencia de API

### Métodos Estáticos

| Método | Descripción |
|--------|-------------|
| `getInstance()` | Obtener instancia de administración |
| `iconUrl($name, $size)` | Obtener URL del icono (tamaño: 16 o 32) |
| `menuIconPath($image)` | Obtener ruta del icono para menu.php |
| `setPaypal($paypal)` | Establecer ID de PayPal para página acerca de |

### Métodos de Instancia

| Método | Descripción |
|--------|-------------|
| `displayNavigation($menu)` | Mostrar menú de navegación |
| `renderNavigation($menu)` | Devolver HTML de navegación |
| `addInfoBox($title)` | Agregar cuadro de información |
| `addInfoBoxLine($text, $type, $color)` | Agregar línea al cuadro de información |
| `displayInfoBox()` | Mostrar cuadro de información |
| `renderInfoBox()` | Devolver HTML del cuadro de información |
| `addConfigBoxLine($value, $type)` | Agregar línea de verificación de configuración |
| `addConfigError($value)` | Agregar error al cuadro de configuración |
| `addConfigAccept($value)` | Agregar éxito al cuadro de configuración |
| `addConfigWarning($value)` | Agregar advertencia al cuadro de configuración |
| `addConfigModuleVersion($moddir, $version)` | Verificar versión del módulo |
| `addItemButton($title, $link, $icon, $extra)` | Agregar botón de acción |
| `displayButton($position, $delimiter)` | Mostrar botones |
| `renderButton($position, $delimiter)` | Devolver HTML de botones |
| `displayIndex()` | Mostrar página de índice |
| `renderIndex()` | Devolver HTML de página de índice |
| `displayAbout($logo_xoops)` | Mostrar página acerca de |
| `renderAbout($logo_xoops)` | Devolver HTML de página acerca de |

## Ver También

- ../Basics/XMF-Module-Helper - Clase de ayuda de módulo
- Permission-Helper - Gestión de permisos
- ../XMF-Framework - Descripción general del marco

---

#xmf #admin #module-development #navigation #icons
