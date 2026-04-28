---
title: "Ayuda de Permisos"
description: "Gestión de permisos de grupos de XOOPS con la Ayuda de Permisos XMF"
---

XOOPS tiene un sistema de permisos potente y flexible basado en la pertenencia al grupo de usuarios. La Ayuda de Permisos XMF simplifica el trabajo con estos permisos, reduciendo verificaciones de permisos complejas a llamadas de un único método.

## Descripción General

El sistema de permisos de XOOPS asocia grupos con:
- ID del módulo
- Nombre del permiso
- ID del elemento

Las verificaciones tradicionales de permisos requieren encontrar grupos de usuarios, buscar IDs de módulos y consultar tablas de permisos. La Ayuda de Permisos XMF maneja todo esto automáticamente.

## Primeros Pasos

### Crear una Ayuda de Permisos

```php
// Para el módulo actual
$permHelper = new \Xmf\Module\Helper\Permission();

// Para un módulo específico
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

El ayudante usa automáticamente los grupos del usuario actual y el ID del módulo especificado.

## Verificar Permisos

### ¿El usuario tiene permiso?

Verificar si el usuario actual tiene un permiso específico para un elemento:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Verificar si el usuario puede ver el tema con ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Mostrar el tema
} else {
    // Mostrar mensaje de acceso denegado
}
```

### Verificar con Redirección

Redirigir automáticamente a usuarios que carecen de permiso:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redirige a index.php después de 3 segundos si no tiene permiso
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'No está permitido ver ese tema'
);

// El código aquí solo se ejecuta si el usuario tiene permiso
displayTopic($topicId);
```

### Anulación de Administrador

Por defecto, los usuarios administradores siempre tienen permiso. Para verificar incluso para administradores:

```php
// Verificación normal: los administradores siempre tienen permiso
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Verificar incluso para administradores (tercer parámetro = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Obtener IDs de Elementos Permitidos

Recuperar todos los IDs de elementos que los grupos específicos tienen permiso para:

```php
// Obtener elementos que los grupos del usuario actual pueden ver
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Obtener elementos que un grupo específico puede ver
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Usar en consultas
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Gestionar Permisos

### Obtener Grupos para un Elemento

Encontrar qué grupos tienen un permiso específico:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Obtener grupos que pueden ver el tema 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Devuelve: [1, 2, 5] (matriz de IDs de grupo)
```

### Guardar Permisos

Otorgar permiso a grupos específicos:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Permitir que los grupos 1, 2 y 3 vean el tema 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Eliminar Permisos

Eliminar todos los permisos para un elemento (típicamente al eliminar el elemento):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Eliminar permiso de vista para este tema
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Para múltiples tipos de permisos:

```php
// Eliminar múltiples tipos de permisos a la vez
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Integración de Formularios

### Agregar Selección de Permisos a Formularios

El ayudante puede crear un elemento de formulario para seleccionar grupos:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Construir su formulario
$form = new XoopsThemeForm('Editar Tema', 'topicform', 'save.php');

// Agregar campo de título, etc.
$form->addElement(new XoopsFormText('Título', 'title', 50, 255, $topic->getVar('title')));

// Agregar selector de permisos
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Nombre del permiso
        $topicId,                              // ID del elemento
        'Grupos con permiso de Ver Tema'   // Título
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Guardar', 'submit'));
```

### Opciones de Elementos de Formulario

La firma del método completo:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Nombre del permiso
    $gperm_itemid,    // ID del elemento
    $caption,         // Título del elemento de formulario
    $name,            // Nombre del elemento (auto-generado si está vacío)
    $include_anon,    // Incluir grupo anónimo (predeterminado: false)
    $size,            // Número de filas visibles (predeterminado: 5)
    $multiple         // Permitir selección múltiple (predeterminado: true)
)
```

### Procesar Envío de Formulario

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Obtener el nombre de campo auto-generado
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Obtener grupos seleccionados del formulario
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Guardar los permisos
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Nombre de Campo Predeterminado

El ayudante genera nombres de campo consistentes:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Devuelve algo como: 'mymodule_viewtopic_42'
```

## Ejemplo Completo: Elementos Protegidos por Permisos

### Crear un Elemento con Permisos

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Guardar datos del elemento
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Guardar permiso de vista
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Guardar permiso de edición
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Elemento guardado');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Editar Elemento', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Título', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Contenido', 'content', $item->getVar('content')));

        // Selector de permiso de vista
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Grupos que pueden ver')
        );

        // Selector de permiso de edición
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Grupos que pueden editar')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Guardar', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Ver con Verificación de Permiso

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Verificar permiso de vista - redirige si se deniega
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'No tiene permiso para ver este elemento'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// El usuario tiene permiso, mostrar el elemento
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Mostrar botón de edición solo si el usuario tiene permiso de edición
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Eliminar con Limpieza de Permisos

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Eliminar el elemento
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Limpiar todos los permisos para este elemento
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Elemento eliminado');
}
```

## Referencia de API

| Método | Descripción |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Verificar si el usuario tiene permiso |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Verificar y redirigir si se deniega |
| `getItemIds($name, $groupIds)` | Obtener IDs de elementos que los grupos pueden acceder |
| `getGroupsForItem($name, $itemId)` | Obtener grupos con permiso |
| `savePermissionForItem($name, $itemId, $groups)` | Guardar permisos |
| `deletePermissionForItem($name, $itemId)` | Eliminar permisos |
| `getGroupSelectFormForItem(...)` | Crear elemento select de formulario |
| `defaultFieldName($name, $itemId)` | Obtener nombre de campo de formulario predeterminado |

## Ver También

- ../Basics/XMF-Module-Helper - Documentación de ayuda de módulo
- Module-Admin-Pages - Creación de interfaz de administración
- ../Basics/Getting-Started-with-XMF - Conceptos básicos de XMF

---

#xmf #permissions #security #groups #forms
