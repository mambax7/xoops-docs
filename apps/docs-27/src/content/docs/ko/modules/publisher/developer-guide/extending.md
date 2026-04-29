---
title: "게시자 확장"
description: "게시자 모듈 확장 및 사용자 정의를 위한 개발자 가이드"
---

> 게시자 모듈 사용자 정의 및 확장에 대한 개발자 가이드입니다.

---

## 아키텍처 개요

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

## 시작하기

### 도우미에 액세스

```php
<?php
// Get Publisher helper instance
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Get handlers
$itemHandler = $helper->getHandler('Item');
$categoryHandler = $helper->getHandler('Category');

// Get config values
$itemsPerPage = $helper->getConfig('items_perpage');
$allowRatings = $helper->getConfig('perm_rating');
```

### 항목 작업

```php
<?php
use XoopsModules\Publisher\Helper;

$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// Create new item
$item = $itemHandler->create();
$item->setVar('title', 'My Article');
$item->setVar('categoryid', 1);
$item->setVar('body', 'Article content...');
$item->setVar('summary', 'Brief summary');
$item->setVar('uid', $xoopsUser->getVar('uid'));
$item->setVar('datesub', time());
$item->setVar('status', Constants::PUBLISHER_STATUS_PUBLISHED);

if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}

// Get published items
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

### 카테고리 작업

```php
<?php
$categoryHandler = $helper->getHandler('Category');

// Get category
$category = $categoryHandler->get(1);
echo $category->getVar('name');

// Get category tree
$categoryTree = $categoryHandler->getTree();

// Get children of category
$children = $categoryHandler->getChildren(1);

// Get items in category
$items = $itemHandler->getItemsFromCategory($categoryId, $limit, $start);
```

---

## 맞춤 쿼리

### 고급 항목 쿼리

```php
<?php
// Get items by multiple criteria
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->add(new \Criteria('categoryid', '(1, 2, 3)', 'IN'));
$criteria->add(new \Criteria('datesub', time() - (30 * 24 * 60 * 60), '>='));

// Search in title and body
$searchCriteria = new \CriteriaCompo();
$searchCriteria->add(new \Criteria('title', '%keyword%', 'LIKE'));
$searchCriteria->add(new \Criteria('body', '%keyword%', 'LIKE'), 'OR');
$criteria->add($searchCriteria);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### 사용자 정의 SQL 쿼리

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
    // Process row
}
```

---

## 후크 및 이벤트

### 사전 로드

`preloads/core.php` 생성:

```php
<?php

namespace XoopsModules\Publisher\Preloads;

use XoopsPreloadItem;

class Core extends XoopsPreloadItem
{
    /**
     * Called when an item is created
     */
    public static function eventPublisherItemCreated($args)
    {
        $item = $args['item'];

        // Send notification
        self::notifyNewItem($item);

        // Log activity
        self::logActivity('item_created', $item->getVar('itemid'));
    }

    /**
     * Called when an item is updated
     */
    public static function eventPublisherItemUpdated($args)
    {
        $item = $args['item'];
        // Custom logic here
    }

    /**
     * Called when an item is viewed
     */
    public static function eventPublisherItemViewed($args)
    {
        $item = $args['item'];
        // Track analytics, update view count, etc.
    }

    private static function notifyNewItem($item)
    {
        // Notification logic
    }

    private static function logActivity($action, $itemId)
    {
        // Logging logic
    }
}
```

---

## 맞춤 템플릿

### 템플릿 재정의

테마에 맞춤 템플릿을 만듭니다.

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
├── publisher_category.tpl
└── blocks/
    └── publisher_block_recent.tpl
```

### 템플릿 변수

```smarty
{* Available in item.tpl *}
<article class="publisher-item">
    <h1><{$item.title}></h1>

    <div class="meta">
        <span class="author">By <{$item.author}></span>
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
            <h3>Attachments</h3>
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

## 맞춤 블록

### 맞춤 블록 만들기

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
    $form .= 'Number of items: <input type="text" name="options[0]" value="' . ($options[0] ?? 5) . '">';
    $form .= '<br>Sort by: <select name="options[1]">';
    $form .= '<option value="datesub"' . (($options[1] ?? '') === 'datesub' ? ' selected' : '') . '>Date</option>';
    $form .= '<option value="counter"' . (($options[1] ?? '') === 'counter' ? ' selected' : '') . '>Views</option>';
    $form .= '<option value="rating"' . (($options[1] ?? '') === 'rating' ? ' selected' : '') . '>Rating</option>';
    $form .= '</select>';

    return $form;
}
```

### xoops_version.php에 블록 등록

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

## API 통합

### REST API 엔드포인트

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
                $response = ['success' => false, 'error' => 'Item not found'];
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

## 플러그인 아키텍처

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

## 관련 문서

- 사용자 가이드 - 시작하기
- MVC 패턴
- XoopsObject API

---

#xoops #출판자 #개발자 #확장 #api
