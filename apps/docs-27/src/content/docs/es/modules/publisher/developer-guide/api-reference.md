---
title: "Publisher - Referencia de API"
description: "Referencia completa de API para el módulo Publisher con clases, métodos y ejemplos de código"
---

# Referencia de API del Publisher

> Referencia completa para clases, métodos, funciones y puntos finales de API del módulo Publisher.

---

## Estructura del Módulo

### Organización de Clases

```
Clases del Módulo Publisher:

├── Item / ItemHandler
│   ├── Obtener artículos
│   ├── Crear artículos
│   ├── Actualizar artículos
│   └── Eliminar artículos
│
├── Category / CategoryHandler
│   ├── Obtener categorías
│   ├── Crear categorías
│   ├── Actualizar categorías
│   └── Eliminar categorías
│
├── Comment / CommentHandler
│   ├── Obtener comentarios
│   ├── Crear comentarios
│   ├── Moderar comentarios
│   └── Eliminar comentarios
│
└── Helper
    ├── Funciones de utilidad
    ├── Funciones de formato
    └── Verificaciones de permisos
```

---

## Clase Item

### Descripción General

La clase `Item` representa un artículo/elemento individual en Publisher.

**Espacio de nombres:** `XoopsModules\Publisher\`

**Archivo:** `modules/publisher/class/Item.php`

### Constructor

```php
// Crear nuevo elemento
$item = new Item();

// Obtener elemento existente
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Propiedades y Métodos

#### Obtener Propiedades

```php
// Obtener ID del artículo
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Obtener título
$title = $item->getVar('title');
$title = $item->title();

// Obtener descripción
$description = $item->getVar('description');
$description = $item->description();

// Obtener cuerpo/contenido
$body = $item->getVar('body');
$body = $item->body();

// Obtener subtítulo
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Obtener autor
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Obtener nombre del autor
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Obtener categoría
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Obtener estado
$status = $item->getVar('status');
$status = $item->status();

// Obtener fecha de publicación
$date = $item->getVar('datesub');
$date = $item->date();

// Obtener fecha de modificación
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Obtener recuento de vistas
$views = $item->getVar('counter');
$views = $item->views();

// Obtener imagen
$image = $item->getVar('image');
$image = $item->image();

// Obtener estado destacado
$featured = $item->getVar('featured');
```

#### Establecer Propiedades

```php
// Establecer título
$item->setVar('title', 'Nuevo Título de Artículo');

// Establecer cuerpo
$item->setVar('body', '<p>Contenido del artículo aquí</p>');

// Establecer descripción
$item->setVar('description', 'Descripción breve');

// Establecer categoría
$item->setVar('categoryid', 5);

// Establecer estado (0=borrador, 1=publicado, etc)
$item->setVar('status', 1);

// Establecer destacado
$item->setVar('featured', 1);

// Establecer imagen
$item->setVar('image', 'path/to/image.jpg');
```

#### Métodos

```php
// Obtener fecha formateada
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// Obtener URL del elemento
$url = $item->url();

// Obtener URL de la categoría
$catUrl = $item->categoryUrl();

// Verificar si está publicado
$isPublished = $item->isPublished();

// Obtener URL de edición
$editUrl = $item->editUrl();

// Obtener URL de eliminación
$deleteUrl = $item->deleteUrl();

// Obtener extracto/resumen
$summary = $item->getSummary(100);
$summary = $item->description();

// Obtener todas las etiquetas
$tags = $item->getTags();

// Obtener comentarios
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// Obtener calificación
$rating = $item->getRating();

// Obtener recuento de calificación
$ratingCount = $item->getRatingCount();
```

---

## Clase ItemHandler

### Descripción General

El `ItemHandler` gestiona operaciones CRUD para artículos.

**Archivo:** `modules/publisher/class/ItemHandler.php`

### Recuperar Elementos

```php
// Obtener un elemento por ID
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// Obtener todos los elementos
$items = $itemHandler->getAll();

// Obtener elementos con condiciones
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // Solo publicados
$criteria->add(new Criteria('categoryid', 5)); // Categoría específica
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// Obtener elementos por categoría
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// Obtener elementos recientes
$items = $itemHandler->getRecent($limit = 10);

// Obtener elementos destacados
$items = $itemHandler->getFeatured($limit = 5);

// Contar elementos
$total = $itemHandler->getCount($criteria);
```

### Crear Elemento

```php
// Crear nuevo elemento
$item = $itemHandler->create();

// Establecer propiedades
$item->setVar('title', 'Título del Artículo');
$item->setVar('body', '<p>Contenido</p>');
$item->setVar('description', 'Descripción breve');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // Borrador
$item->setVar('datesub', time());

// Guardar
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Artículo creado: " . $itemId;
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### Actualizar Elemento

```php
// Obtener elemento
$item = $itemHandler->get($itemId);

// Modificar
$item->setVar('title', 'Título Actualizado');
$item->setVar('body', '<p>Contenido actualizado</p>');
$item->setVar('status', 1); // Publicar

// Guardar
if ($itemHandler->insert($item)) {
    echo "Elemento actualizado";
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### Eliminar Elemento

```php
// Obtener elemento
$item = $itemHandler->get($itemId);

// Eliminar
if ($itemHandler->delete($item)) {
    echo "Elemento eliminado";
} else {
    echo "Error al eliminar elemento";
}

// Eliminar por ID
$itemHandler->deleteByPrimary($itemId);
```

---

## Clase Category

### Descripción General

La clase `Category` representa una categoría o sección.

**Archivo:** `modules/publisher/class/Category.php`

### Métodos

```php
// Obtener ID de categoría
$catId = $category->getVar('categoryid');
$catId = $category->id();

// Obtener nombre
$name = $category->getVar('name');
$name = $category->name();

// Obtener descripción
$desc = $category->getVar('description');
$desc = $category->description();

// Obtener imagen
$image = $category->getVar('image');
$image = $category->image();

// Obtener categoría padre
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// Obtener estado
$status = $category->getVar('status');

// Obtener URL
$url = $category->url();

// Obtener recuento de elementos
$count = $category->itemCount();

// Obtener subcategorías
$subs = $category->getSubCategories();

// Obtener objeto de categoría padre
$parent = $category->getParent();
```

---

## Clase CategoryHandler

### Descripción General

El `CategoryHandler` gestiona operaciones CRUD de categorías.

**Archivo:** `modules/publisher/class/CategoryHandler.php`

### Recuperar Categorías

```php
// Obtener categoría individual
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// Obtener todas las categorías
$categories = $catHandler->getAll();

// Obtener categorías raíz (sin padre)
$roots = $catHandler->getRoots();

// Obtener subcategorías
$subs = $catHandler->getByParent($parentId);

// Obtener categorías con criterios
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### Crear Categoría

```php
// Crear nueva
$category = $catHandler->create();

// Establecer valores
$category->setVar('name', 'Noticias');
$category->setVar('description', 'Elementos de noticias');
$category->setVar('parentid', 0); // Nivel raíz
$category->setVar('status', 1);

// Guardar
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Error";
}
```

### Actualizar Categoría

```php
// Obtener categoría
$category = $catHandler->get($categoryId);

// Modificar
$category->setVar('name', 'Nombre Actualizado');

// Guardar
$catHandler->insert($category);
```

### Eliminar Categoría

```php
// Obtener categoría
$category = $catHandler->get($categoryId);

// Eliminar
$catHandler->delete($category);
```

---

## Funciones de Ayuda

### Funciones de Utilidad

La clase Helper proporciona funciones de utilidad:

**Archivo:** `modules/publisher/class/Helper.php`

```php
// Obtener instancia del asistente
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Obtener instancia del módulo
$module = $helper->getModule();

// Obtener gestor
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// Obtener valor de configuración
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// Verificar permiso
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// Obtener URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// Obtener ruta base
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### Funciones de Formato

```php
// Formatear fecha
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// Truncar texto
$excerpt = $helper->truncate($text, $length = 100);

// Sanitizar entrada
$clean = $helper->sanitize($input);

// Preparar salida
$output = $helper->prepare($data);

// Obtener breadcrumb
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## API JavaScript

### Funciones JavaScript del Frontend

Publisher incluye una API JavaScript para interacciones del frontend:

```javascript
// Incluir biblioteca JS del Publisher
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Verificar si el objeto Publisher existe
if (typeof Publisher !== 'undefined') {
    // Usar API del Publisher
}

// Obtener datos del artículo
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// Obtener datos de la categoría
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// Enviar calificación
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Calificación guardada');
});

// Cargar más artículos
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // Manejar artículos cargados
});

// Buscar artículos
Publisher.search(query, function(results) {
    // Manejar resultados de búsqueda
});
```

### Puntos Finales AJAX

Publisher proporciona puntos finales AJAX para interacciones del frontend:

```javascript
// Obtener artículo vía AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// Enviar comentario vía AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// Obtener calificaciones
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## API REST (Si está Habilitada)

### Puntos Finales de API

Si el Publisher expone API REST:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### Ejemplos de Llamadas a la API

```php
// Obtener elementos vía REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// Obtener elemento individual
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// Crear elemento
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'Nuevo Artículo',
    'body' => 'Contenido aquí',
    'categoryid' => 1
);
$options = array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    )
);
$response = file_get_contents($url, false, stream_context_create($options));
```

---

## Esquema de Base de Datos

### Tablas

#### publisher_categories

```
- categoryid (PK)
- name
- description
- image
- parentid (FK)
- status
- created
- modified
```

#### publisher_items

```
- itemid (PK)
- categoryid (FK)
- uid (FK a usuarios)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (vistas)
```

#### publisher_comments

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### publisher_files

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## Eventos y Ganchos

### Eventos del Publisher

```php
// Evento de elemento creado
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// Elemento actualizado
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// Elemento eliminado
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// Artículo comentado
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### Escuchar Eventos

```php
// Registrar oyente de evento
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// O en el complemento
public function onItemCreated($item) {
    // Manejar creación de elemento
}
```

---

## Ejemplos de Código

### Obtener Artículos Recientes

```php
<?php
// Obtener artículos publicados recientemente
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // Publicado
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>Leer Más</a>\n\n";
}
?>
```

### Crear Artículo Programáticamente

```php
<?php
// Crear artículo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Artículo Programático');
$item->setVar('description', 'Creado vía API');
$item->setVar('body', '<p>Contenido completo aquí</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // Publicado
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Artículo creado: " . $item->getVar('itemid');
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
?>
```

### Obtener Artículos por Categoría

```php
<?php
// Obtener artículos de categoría
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Artículos en categoría " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### Actualizar Estado del Artículo

```php
<?php
// Cambiar estado del artículo
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // Publicar

    if ($itemHandler->insert($item)) {
        echo "Artículo publicado";
    } else {
        echo "Error al publicar artículo";
    }
} else {
    echo "Artículo no encontrado";
}
?>
```

### Obtener Árbol de Categorías

```php
<?php
// Construir árbol de categorías
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$roots = $catHandler->getRoots();

function displayTree($category, $level = 0) {
    echo str_repeat("  ", $level) . $category->name() . "\n";

    $subs = $category->getSubCategories();
    foreach ($subs as $sub) {
        displayTree($sub, $level + 1);
    }
}

foreach ($roots as $root) {
    displayTree($root);
}
?>
```

---

## Manejo de Errores

### Manejar Errores

```php
<?php
// Manejo de errores try/catch
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('Elemento no encontrado');
    }

    $item->setVar('title', 'Nuevo Título');

    if (!$itemHandler->insert($item)) {
        throw new Exception('Error al guardar elemento');
    }
} catch (Exception $e) {
    error_log('Error del Publisher: ' . $e->getMessage());
    // Manejar error
}
?>
```

### Obtener Mensajes de Error

```php
<?php
// Obtener mensajes de error del objeto
$item = $itemHandler->create();
// ... establecer variables ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Error: " . $error . "\n";
    }
}
?>
```

---

## Documentación Relacionada

- Ganchos y Eventos
- Plantillas Personalizadas
- Análisis del Módulo Publisher
- Plantillas y Bloques en Publisher
- Creación de Artículos
- Gestión de Categorías

---

## Recursos

- [Publisher GitHub](https://github.com/XoopsModules25x/publisher)
- [API XOOPS](../../04-API-Reference/API-Reference.md)
- [Documentación de PHP](https://www.php.net/docs.php)

---

#publisher #api #referencia #código #clases #métodos #xoops
