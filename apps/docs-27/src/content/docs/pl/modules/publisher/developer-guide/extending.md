---
title: "Rozszerzanie Publisher"
description: "Przewodnik programisty do rozszerzania i dostosowywania modułu Publisher"
---

> Przewodnik programisty do dostosowywania i rozszerzania modułu Publisher.

---

## Przegląd Architektury

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

    Item --> ItemHandler : zarządzane przez
    Category --> CategoryHandler : zarządzane przez
    ItemHandler --> Helper : używa
    CategoryHandler --> Helper : używa
```

---

## Pierwsze Kroki

### Dostęp do Pomocnika

```php
<?php
// Pobierz instancję pomocnika Publisher
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Pobierz handlery
$itemHandler = $helper->getHandler('Item');
$categoryHandler = $helper->getHandler('Category');

// Pobierz wartości konfiguracji
$itemsPerPage = $helper->getConfig('items_perpage');
$allowRatings = $helper->getConfig('perm_rating');
```

### Praca z Elementami

```php
<?php
use XoopsModules\Publisher\Helper;

$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Utwórz nowy element
$item = $itemHandler->create();
$item->setVar('title', 'Mój Artykuł');
$item->setVar('categoryid', 1);
$item->setVar('body', 'Zawartość artykułu...');
$item->setVar('summary', 'Krótkie streszczenie');
$item->setVar('uid', $xoopsUser->getVar('uid'));
$item->setVar('datesub', time());
$item->setVar('status', Constants::PUBLISHER_STATUS_PUBLISHED);

if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}

// Pobierz opublikowane elementy
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

### Praca z Kategoriami

```php
<?php
$categoryHandler = $helper->getHandler('Category');

// Pobierz kategorię
$category = $categoryHandler->get(1);
echo $category->getVar('name');

// Pobierz drzewo kategorii
$categoryTree = $categoryHandler->getTree();

// Pobierz dzieciaki kategorii
$children = $categoryHandler->getChildren(1);

// Pobierz elementy w kategorii
$items = $itemHandler->getItemsFromCategory($categoryId, $limit, $start);
```

---

## Niestandardowe Zapytania

### Zaawansowane Zapytania Elementów

```php
<?php
// Pobierz elementy według wielu kryteriów
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->add(new \Criteria('categoryid', '(1, 2, 3)', 'IN'));
$criteria->add(new \Criteria('datesub', time() - (30 * 24 * 60 * 60), '>='));

// Szukaj w tytule i treści
$searchCriteria = new \CriteriaCompo();
$searchCriteria->add(new \Criteria('title', '%keyword%', 'LIKE'));
$searchCriteria->add(new \Criteria('body', '%keyword%', 'LIKE'), 'OR');
$criteria->add($searchCriteria);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Niestandardowe Zapytania SQL

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
    // Przetwórz rząd
}
```

---

## Haki i Zdarzenia

### Wstępne ładunki

Utwórz `preloads/core.php`:

```php
<?php

namespace XoopsModules\Publisher\Preloads;

use XoopsPreloadItem;

class Core extends XoopsPreloadItem
{
    /**
     * Wywoływane gdy element jest tworzony
     */
    public static function eventPublisherItemCreated($args)
    {
        $item = $args['item'];

        // Wyślij powiadomienie
        self::notifyNewItem($item);

        // Zarejestruj aktywność
        self::logActivity('item_created', $item->getVar('itemid'));
    }

    /**
     * Wywoływane gdy element jest aktualizowany
     */
    public static function eventPublisherItemUpdated($args)
    {
        $item = $args['item'];
        // Niestandardowa logika tutaj
    }

    /**
     * Wywoływane gdy element jest wyświetlany
     */
    public static function eventPublisherItemViewed($args)
    {
        $item = $args['item'];
        // Śledź analitykę, aktualizuj liczbę wyświetleń, itp.
    }

    private static function notifyNewItem($item)
    {
        // Logika powiadomień
    }

    private static function logActivity($action, $itemId)
    {
        // Logika rejestrowania
    }
}
```

---

## Niestandardowe Szablony

### Przesłonięcie Szablonu

Utwórz niestandardowe szablony w swoim motywie:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
├── publisher_category.tpl
└── blocks/
    └── publisher_block_recent.tpl
```

### Zmienne Szablonu

```smarty
{* Dostępne w item.tpl *}
<article class="publisher-item">
    <h1><{$item.title}></h1>

    <div class="meta">
        <span class="author">Autor: <{$item.author}></span>
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
            <h3>Załączniki</h3>
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

## Niestandardowe Bloki

### Utwórz Niestandardowy Blok

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
    $form .= 'Liczba elementów: <input type="text" name="options[0]" value="' . ($options[0] ?? 5) . '">';
    $form .= '<br>Sortuj po: <select name="options[1]">';
    $form .= '<option value="datesub"' . (($options[1] ?? '') === 'datesub' ? ' selected' : '') . '>Data</option>';
    $form .= '<option value="counter"' . (($options[1] ?? '') === 'counter' ? ' selected' : '') . '>Wyświetlenia</option>';
    $form .= '<option value="rating"' . (($options[1] ?? '') === 'rating' ? ' selected' : '') . '>Ocena</option>';
    $form .= '</select>';

    return $form;
}
```

### Zarejestruj Blok w xoops_version.php

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

## Integracja API

### Punkt Końcowy REST API

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
                $response = ['success' => false, 'error' => 'Element nie znaleziony'];
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

## Architektura Wtyczek

```mermaid
graph TB
    subgraph "Rdzeń Publisher"
        A[Item Handler]
        B[Category Handler]
        C[Event System]
    end

    subgraph "Wtyczki"
        D[Wtyczka SEO]
        E[Wtyczka Social]
        F[Wtyczka Analytics]
        G[Wtyczka Niestandardowa]
    end

    C --> D
    C --> E
    C --> F
    C --> G

    A --> C
    B --> C
```

---

## Powiązana Dokumentacja

- Przewodnik Użytkownika - Pierwsze Kroki
- Wzorzec MVC
- API XoopsObject

---

#xoops #publisher #developer #extending #api
