---
title: "Estendendo o Publisher"
description: "Guia do desenvolvedor para estender e personalizar o módulo Publisher"
---

> Guia do desenvolvedor para personalizar e estender o módulo Publisher.

---

## Visão Geral da Arquitetura

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

    Item --> ItemHandler : gerenciado por
    Category --> CategoryHandler : gerenciado por
    ItemHandler --> Helper : usa
    CategoryHandler --> Helper : usa
```

---

## Primeiros Passos

### Acessar o Assistente

```php
<?php
// Obter instância do assistente Publisher
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Obter manipuladores
$itemHandler = $helper->getHandler('Item');
$categoryHandler = $helper->getHandler('Category');

// Obter valores de configuração
$itemsPerPage = $helper->getConfig('items_perpage');
$allowRatings = $helper->getConfig('perm_rating');
```

### Trabalhando com Itens

```php
<?php
use XoopsModules\Publisher\Helper;

$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Criar novo item
$item = $itemHandler->create();
$item->setVar('title', 'Meu Artigo');
$item->setVar('categoryid', 1);
$item->setVar('body', 'Conteúdo do artigo...');
$item->setVar('summary', 'Resumo breve');
$item->setVar('uid', $xoopsUser->getVar('uid'));
$item->setVar('datesub', time());
$item->setVar('status', Constants::PUBLISHER_STATUS_PUBLISHED);

if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}

// Obter itens publicados
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

### Trabalhando com Categorias

```php
<?php
$categoryHandler = $helper->getHandler('Category');

// Obter categoria
$category = $categoryHandler->get(1);
echo $category->getVar('name');

// Obter árvore de categoria
$categoryTree = $categoryHandler->getTree();

// Obter filhos de categoria
$children = $categoryHandler->getChildren(1);

// Obter itens em categoria
$items = $itemHandler->getItemsFromCategory($categoryId, $limit, $start);
```

---

## Consultas Personalizadas

### Consultas Avançadas de Item

```php
<?php
// Obter itens por múltiplos critérios
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->add(new \Criteria('categoryid', '(1, 2, 3)', 'IN'));
$criteria->add(new \Criteria('datesub', time() - (30 * 24 * 60 * 60), '>='));

// Buscar em título e corpo
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
    // Processar linha
}
```

---

## Ganchos e Eventos

### Preloads

Criar `preloads/core.php`:

```php
<?php

namespace XoopsModules\Publisher\Preloads;

use XoopsPreloadItem;

class Core extends XoopsPreloadItem
{
    /**
     * Chamado quando um item é criado
     */
    public static function eventPublisherItemCreated($args)
    {
        $item = $args['item'];

        // Enviar notificação
        self::notifyNewItem($item);

        // Registrar atividade
        self::logActivity('item_created', $item->getVar('itemid'));
    }

    /**
     * Chamado quando um item é atualizado
     */
    public static function eventPublisherItemUpdated($args)
    {
        $item = $args['item'];
        // Lógica personalizada aqui
    }

    /**
     * Chamado quando um item é visualizado
     */
    public static function eventPublisherItemViewed($args)
    {
        $item = $args['item'];
        // Rastrear análises, atualizar contagem de visualizações, etc.
    }

    private static function notifyNewItem($item)
    {
        // Lógica de notificação
    }

    private static function logActivity($action, $itemId)
    {
        // Lógica de registro
    }
}
```

---

## Templates Personalizados

### Sobrescrita de Template

Criar templates personalizados em seu tema:

```
themes/meumtema/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
├── publisher_category.tpl
└── blocks/
    └── publisher_block_recent.tpl
```

### Variáveis de Template

```smarty
{* Disponível em item.tpl *}
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
            <h3>Anexos</h3>
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

## Blocos Personalizados

### Criar Bloco Personalizado

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
    $form .= 'Número de itens: <input type="text" name="options[0]" value="' . ($options[0] ?? 5) . '">';
    $form .= '<br>Classificar por: <select name="options[1]">';
    $form .= '<option value="datesub"' . (($options[1] ?? '') === 'datesub' ? ' selected' : '') . '>Data</option>';
    $form .= '<option value="counter"' . (($options[1] ?? '') === 'counter' ? ' selected' : '') . '>Visualizações</option>';
    $form .= '<option value="rating"' . (($options[1] ?? '') === 'rating' ? ' selected' : '') . '>Classificação</option>';
    $form .= '</select>';

    return $form;
}
```

### Registrar Bloco em xoops_version.php

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

## Integração de API

### Endpoint de API REST

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
                $response = ['success' => false, 'error' => 'Item não encontrado'];
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

## Arquitetura de Plugin

```mermaid
graph TB
    subgraph "Núcleo Publisher"
        A[Item Handler]
        B[Category Handler]
        C[Event System]
    end

    subgraph "Plugins"
        D[Plugin SEO]
        E[Plugin Social]
        F[Plugin Analytics]
        G[Plugin Personalizado]
    end

    C --> D
    C --> E
    C --> F
    C --> G

    A --> C
    B --> C
```

---

## Documentação Relacionada

- Guia do Usuário - Primeiros Passos
- Padrão MVC
- API XoopsObject

---

#xoops #publisher #desenvolvedor #estendendo #api
