---
title: "Extendiendo Publisher"
description: "Guía de desarrollador para extender y personalizar el módulo Publisher"
---

> Una guía del desarrollador para personalizar y extender el módulo Publisher.

---

## Architecture Overview

```mermaid
classDiagram
    class Item {
        +int itemid
        +int categoryid
        +string title
        +string body
        +int status
        +getVar()
        +setVar()
        +toArray()
    }

    class Category {
        +int categoryid
        +int parentid
        +string name
        +getVar()
        +setVar()
    }

    class ItemHandler {
        +create()
        +get()
        +insert()
        +delete()
        +getObjects()
        +getPublishedItems()
    }

    class CategoryHandler {
        +create()
        +get()
        +insert()
        +getTree()
        +getChildren()
    }

    class Helper {
        +getInstance()
        +getHandler()
        +getConfig()
        +getModule()
    }

    Item --> ItemHandler : managed by
    Category --> CategoryHandler : managed by
    ItemHandler --> Helper : uses
    CategoryHandler --> Helper : uses
```

---

## Empezando

### Acceder al Asistente

```php
<?php
// Obtener instancia del asistente de Publisher
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Obtener gestores
$itemHandler = $helper->getHandler('Item');
$categoryHandler = $helper->getHandler('Category');

// Obtener valores de configuración
$itemsPerPage = $helper->getConfig('items_perpage');
$allowRatings = $helper->getConfig('perm_rating');
```

### Trabajar con Elementos

```php
<?php
use XoopsModules\Publisher\Helper;

$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Crear nuevo elemento
$item = $itemHandler->create();
$item->setVar('title', 'Mi Artículo');
$item->setVar('categoryid', 1);
$item->setVar('body', 'Contenido del artículo...');
$item->setVar('summary', 'Resumen breve');
$item->setVar('uid', $xoopsUser->getVar('uid'));
$item->setVar('datesub', time());
$item->setVar('status', Constants::PUBLISHER_STATUS_PUBLISHED);

if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}

// Obtener elementos publicados
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(10);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->getVar('title') . "\n";
}
```

### Trabajar con Categorías

```php
<?php
$categoryHandler = $helper->getHandler('Category');

// Obtener categoría
$category = $categoryHandler->get(1);
echo $category->getVar('name');

// Obtener árbol de categorías
$categoryTree = $categoryHandler->getTree();

// Obtener hijos de una categoría
$children = $categoryHandler->getChildren(1);

// Obtener elementos en una categoría
$items = $itemHandler->getItemsFromCategory($categoryId, $limit, $start);
```

---

## Consultas Personalizadas

### Consultas de Elementos Avanzadas

```php
<?php
// Obtener elementos por múltiples criterios
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->add(new \Criteria('categoryid', '(1, 2, 3)', 'IN'));
$criteria->add(new \Criteria('datesub', time() - (30 * 24 * 60 * 60), '>='));

// Buscar en título y cuerpo
$searchCriteria = new \CriteriaCompo();
$searchCriteria->add(new \Criteria('title', '%keyword%', 'LIKE'));
$searchCriteria->add(new \Criteria('body', '%keyword%', 'LIKE'), 'OR');
$criteria->add($searchCriteria);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Consultas SQL Personalizadas

```php
<?php
$db = \XoopsDatabaseFactory::getDatabaseConnection();

$sql = sprintf(
    "SELECT i.*, c.name as category_name
     FROM %s i
     LEFT JOIN %s c ON i.categoryid = c.categoryid
     WHERE i.status = %d
     ORDER BY i.datesub DESC
     LIMIT %d",
    $db->prefix('publisher_items'),
    $db->prefix('publisher_categories'),
    Constants::PUBLISHER_STATUS_PUBLISHED,
    10
);

$result = $db->query($sql);
while ($row = $db->fetchArray($result)) {
    // Procesar fila
}
```

---

## Ganchos y Eventos

### Precarga

Crear `preloads/core.php`:

```php
<?php

namespace XoopsModules\Publisher\Preloads;

use XoopsPreloadItem;

class Core extends XoopsPreloadItem
{
    /**
     * Llamado cuando se crea un elemento
     */
    public static function eventPublisherItemCreated($args)
    {
        $item = $args['item'];

        // Enviar notificación
        self::notifyNewItem($item);

        // Registrar actividad
        self::logActivity('item_created', $item->getVar('itemid'));
    }

    /**
     * Llamado cuando se actualiza un elemento
     */
    public static function eventPublisherItemUpdated($args)
    {
        $item = $args['item'];
        // Lógica personalizada aquí
    }

    /**
     * Llamado cuando se ve un elemento
     */
    public static function eventPublisherItemViewed($args)
    {
        $item = $args['item'];
        // Rastrear analítica, actualizar recuento de vistas, etc.
    }

    private static function notifyNewItem($item)
    {
        // Lógica de notificación
    }

    private static function logActivity($action, $itemId)
    {
        // Lógica de registro
    }
}
```

---

## Plantillas Personalizadas

### Anulación de Plantilla

Crear plantillas personalizadas en su tema:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
├── publisher_category.tpl
└── blocks/
    └── publisher_block_recent.tpl
```

### Variables de Plantilla

```smarty
{* Disponible en item.tpl *}
<article class="publisher-item">
    <h1><{$item.title}></h1>

    <div class="meta">
        <span class="author">Por <{$item.author}></span>
        <span class="date"><{$item.datesub}></span>
        <span class="category">
            <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
        </span>
    </div>

    <{if $item.image}>
        <img src="<{$item.image}>" alt="<{$item.title}>">
    <{/if}>

    <div class="summary">
        <{$item.summary}>
    </div>

    <div class="body">
        <{$item.body}>
    </div>

    <{if $item.files}>
        <div class="attachments">
            <h3>Archivos Adjuntos</h3>
            <ul>
            <{foreach item=file from=$item.files}>
                <li><a href="<{$file.url}>"><{$file.name}></a></li>
            <{/foreach}>
            </ul>
        </div>
    <{/if}>

    <{if $item.canRate}>
        <div class="rating">
            <{include file="db:publisher_rating.tpl"}>
        </div>
    <{/if}>

    <{if $item.canComment}>
        <div class="comments">
            <{$item.comments}>
        </div>
    <{/if}>
</article>
```

---

## Bloques Personalizados

### Crear Bloque Personalizado

```php
<?php
// blocks/custom_block.php

function publisher_block_custom_show($options)
{
    $helper = \XoopsModules\Publisher\Helper::getInstance();
    $itemHandler = $helper->getHandler('Item');

    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
    $criteria->setSort($options[1] ?? 'datesub');
    $criteria->setOrder('DESC');
    $criteria->setLimit($options[0] ?? 5);

    $items = $itemHandler->getObjects($criteria);

    $block = [];
    foreach ($items as $item) {
        $block['items'][] = $item->toArray();
    }

    return $block;
}

function publisher_block_custom_edit($options)
{
    $form = '';
    $form .= 'Número de elementos: <input type="text" name="options[0]" value="' . ($options[0] ?? 5) . '">';
    $form .= '<br>Ordenar por: <select name="options[1]">';
    $form .= '<option value="datesub"' . (($options[1] ?? '') === 'datesub' ? ' selected' : '') . '>Fecha</option>';
    $form .= '<option value="counter"' . (($options[1] ?? '') === 'counter' ? ' selected' : '') . '>Vistas</option>';
    $form .= '<option value="rating"' . (($options[1] ?? '') === 'rating' ? ' selected' : '') . '>Calificación</option>';
    $form .= '</select>';

    return $form;
}
```

### Registrar Bloque en xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/custom_block.php',
    'name'        => _MI_PUBLISHER_BLOCK_CUSTOM,
    'description' => _MI_PUBLISHER_BLOCK_CUSTOM_DESC,
    'show_func'   => 'publisher_block_custom_show',
    'edit_func'   => 'publisher_block_custom_edit',
    'options'     => '5|datesub',
    'template'    => 'publisher_block_custom.tpl',
];
```

---

## Integración de API

### Punto Final de API REST

```php
<?php
// api/items.php

require_once dirname(dirname(dirname(__DIR__))) . '/mainfile.php';

header('Content-Type: application/json');

$helper = \XoopsModules\Publisher\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

$action = $_GET['action'] ?? 'list';
$response = ['success' => false];

try {
    switch ($action) {
        case 'list':
            $limit = min((int)($_GET['limit'] ?? 10), 50);
            $start = (int)($_GET['start'] ?? 0);

            $criteria = new \CriteriaCompo();
            $criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
            $criteria->setLimit($limit);
            $criteria->setStart($start);

            $items = $itemHandler->getObjects($criteria);
            $response = [
                'success' => true,
                'data' => array_map(fn($item) => $item->toArray(), $items),
                'total' => $itemHandler->getCount($criteria)
            ];
            break;

        case 'get':
            $id = (int)($_GET['id'] ?? 0);
            $item = $itemHandler->get($id);

            if ($item && $item->getVar('status') == Constants::PUBLISHER_STATUS_PUBLISHED) {
                $response = [
                    'success' => true,
                    'data' => $item->toArray()
                ];
            } else {
                http_response_code(404);
                $response = ['success' => false, 'error' => 'Elemento no encontrado'];
            }
            break;
    }
} catch (\Exception $e) {
    http_response_code(500);
    $response = ['success' => false, 'error' => $e->getMessage()];
}

echo json_encode($response);
```

---

## Plugin Architecture

```mermaid
graph TB
    subgraph "Publisher Core"
        A[Item Handler]
        B[Category Handler]
        C[Event System]
    end

    subgraph "Plugins"
        D[SEO Plugin]
        E[Social Plugin]
        F[Analytics Plugin]
        G[Custom Plugin]
    end

    C --> D
    C --> E
    C --> F
    C --> G

    A --> C
    B --> C
```

---

## Documentación Relacionada

- Guía de Usuario - Empezando
- Patrón MVC
- API XoopsObject

---

#xoops #publisher #desarrollador #extendiendo #api
