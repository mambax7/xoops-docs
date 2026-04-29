---
title: "Vydavatel - API Reference"
description: "Kompletní reference API pro modul Publisher s třídami, metodami a příklady kódu"
---

# Vydavatel API Reference

> Kompletní reference pro třídy modulu Publisher, metody, funkce a koncové body API.

---

## Struktura modulu

### Organizace třídy

```
Publisher Module Classes:

├── Item / ItemHandler
│   ├── Get articles
│   ├── Create articles
│   ├── Update articles
│   └── Delete articles
│
├── Category / CategoryHandler
│   ├── Get categories
│   ├── Create categories
│   ├── Update categories
│   └── Delete categories
│
├── Comment / CommentHandler
│   ├── Get comments
│   ├── Create comments
│   ├── Moderate comments
│   └── Delete comments
│
└── Helper
    ├── Utility functions
    ├── Format functions
    └── Permission checks
```

---

## Třída položky

### Přehled

Třída `Item` představuje jeden article/item v aplikaci Publisher.

**Jmenný prostor:** `XOOPSModules\Publisher\`

**Soubor:** `modules/publisher/class/Item.php`

### Konstruktér

```php
// Create new item
$item = new Item();

// Get existing item
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### Vlastnosti a metody

#### Získejte vlastnosti

```php
// Get article ID
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// Get title
$title = $item->getVar('title');
$title = $item->title();

// Get description
$description = $item->getVar('description');
$description = $item->description();

// Get body/content
$body = $item->getVar('body');
$body = $item->body();

// Get subtitle
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// Get author
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// Get author name
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// Get category
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// Get status
$status = $item->getVar('status');
$status = $item->status();

// Get published date
$date = $item->getVar('datesub');
$date = $item->date();

// Get modified date
$modified = $item->getVar('datemod');
$modified = $item->modified();

// Get view count
$views = $item->getVar('counter');
$views = $item->views();

// Get image
$image = $item->getVar('image');
$image = $item->image();

// Get featured status
$featured = $item->getVar('featured');
```

#### Nastavit vlastnosti

```php
// Set title
$item->setVar('title', 'New Article Title');

// Set body
$item->setVar('body', '<p>Article content here</p>');

// Set description
$item->setVar('description', 'Short description');

// Set category
$item->setVar('categoryid', 5);

// Set status (0=draft, 1=published, etc)
$item->setVar('status', 1);

// Set featured
$item->setVar('featured', 1);

// Set image
$item->setVar('image', 'path/to/image.jpg');
```

#### Metody

```php
// Get formatted date
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// Get item URL
$url = $item->url();

// Get category URL
$catUrl = $item->categoryUrl();

// Check if published
$isPublished = $item->isPublished();

// Get edit URL
$editUrl = $item->editUrl();

// Get delete URL
$deleteUrl = $item->deleteUrl();

// Get excerpt/summary
$summary = $item->getSummary(100);
$summary = $item->description();

// Get all tags
$tags = $item->getTags();

// Get comments
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// Get rating
$rating = $item->getRating();

// Get rating count
$ratingCount = $item->getRatingCount();
```

---

## Třída ItemHandler

### Přehled

`ItemHandler` spravuje operace CRUD pro články.

**Soubor:** `modules/publisher/class/ItemHandler.php`

### Načíst položky

```php
// Get single item by ID
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// Get all items
$items = $itemHandler->getAll();

// Get items with conditions
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // Published only
$criteria->add(new Criteria('categoryid', 5)); // Specific category
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// Get items by category
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// Get recent items
$items = $itemHandler->getRecent($limit = 10);

// Get featured items
$items = $itemHandler->getFeatured($limit = 5);

// Count items
$total = $itemHandler->getCount($criteria);
```

### Vytvořit položku

```php
// Create new item
$item = $itemHandler->create();

// Set properties
$item->setVar('title', 'Article Title');
$item->setVar('body', '<p>Content</p>');
$item->setVar('description', 'Short desc');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // Draft
$item->setVar('datesub', time());

// Save
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Article created: " . $itemId;
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### Aktualizovat položku

```php
// Get item
$item = $itemHandler->get($itemId);

// Modify
$item->setVar('title', 'Updated Title');
$item->setVar('body', '<p>Updated content</p>');
$item->setVar('status', 1); // Publish

// Save
if ($itemHandler->insert($item)) {
    echo "Item updated";
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### Smazat položku

```php
// Get item
$item = $itemHandler->get($itemId);

// Delete
if ($itemHandler->delete($item)) {
    echo "Item deleted";
} else {
    echo "Error deleting item";
}

// Delete by ID
$itemHandler->deleteByPrimary($itemId);
```

---

## Kategorie Třída

### Přehled

Třída `Category` představuje kategorii nebo sekci.

**Soubor:** `modules/publisher/class/Category.php`

### Metody

```php
// Get category ID
$catId = $category->getVar('categoryid');
$catId = $category->id();

// Get name
$name = $category->getVar('name');
$name = $category->name();

// Get description
$desc = $category->getVar('description');
$desc = $category->description();

// Get image
$image = $category->getVar('image');
$image = $category->image();

// Get parent category
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// Get status
$status = $category->getVar('status');

// Get URL
$url = $category->url();

// Get item count
$count = $category->itemCount();

// Get subcategories
$subs = $category->getSubCategories();

// Get parent category object
$parent = $category->getParent();
```

---

## Třída CategoryHandler

### Přehled

`CategoryHandler` spravuje operace kategorie CRUD.

**Soubor:** `modules/publisher/class/CategoryHandler.php`

### Načíst kategorie

```php
// Get single category
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// Get all categories
$categories = $catHandler->getAll();

// Get root categories (no parent)
$roots = $catHandler->getRoots();

// Get subcategories
$subs = $catHandler->getByParent($parentId);

// Get categories with criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### Vytvořit kategorii

```php
// Create new
$category = $catHandler->create();

// Set values
$category->setVar('name', 'News');
$category->setVar('description', 'News items');
$category->setVar('parentid', 0); // Root level
$category->setVar('status', 1);

// Save
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Error";
}
```

### Aktualizovat kategorii

```php
// Get category
$category = $catHandler->get($categoryId);

// Modify
$category->setVar('name', 'Updated Name');

// Save
$catHandler->insert($category);
```

### Smazat kategorii

```php
// Get category
$category = $catHandler->get($categoryId);

// Delete
$catHandler->delete($category);
```

---

## Pomocné funkce

### Užitkové funkce

Třída Helper poskytuje pomocné funkce:

**Soubor:** `modules/publisher/class/Helper.php`

```php
// Get helper instance
$helper = \XOOPSModules\Publisher\Helper::getInstance();

// Get module instance
$module = $helper->getModule();

// Get handler
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// Get config value
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// Check permission
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// Get URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// Get base path
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### Funkce formátování

```php
// Format date
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// Truncate text
$excerpt = $helper->truncate($text, $length = 100);

// Sanitize input
$clean = $helper->sanitize($input);

// Prepare output
$output = $helper->prepare($data);

// Get breadcrumb
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## JavaScript API

### Frontend JavaScript Funkce

Vydavatel zahrnuje JavaScript API pro interakce s rozhraním:

```javascript
// Include Publisher JS library
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Check if Publisher object exists
if (typeof Publisher !== 'undefined') {
    // Use Publisher API
}

// Get article data
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// Get category data
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// Submit rating
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Rating saved');
});

// Load more articles
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // Handle loaded articles
});

// Search articles
Publisher.search(query, function(results) {
    // Handle search results
});
```

### Koncové body Ajaxu

Vydavatel poskytuje koncové body AJAX pro interakce frontendu:

```javascript
// Get article via AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// Submit comment via AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// Get ratings
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## REST API (pokud je povoleno)

### Koncové body API

Pokud vydavatel odhalí REST API:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### Příklad volání API

```php
// Get items via REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// Get single item
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// Create item
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'New Article',
    'body' => 'Content here',
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

## Schéma databáze

### Stoly

#### kategorie vydavatelů

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

#### položky publisher_items

```
- itemid (PK)
- categoryid (FK)
- uid (FK to users)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (views)
```

#### komentáře vydavatele

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### soubory vydavatele

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## Události a háčky

### Události vydavatele

```php
// Item created event
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// Item updated
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// Item deleted
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// Article commented
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### Poslouchejte Události

```php
// Register event listener
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// Or in plugin
public function onItemCreated($item) {
    // Handle item creation
}
```

---

## Příklady kódu

### Získejte nejnovější články

```php
<?php
// Get recent published articles
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // Published
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>Read More</a>\n\n";
}
?>
```

### Vytvářejte článek programově

```php
<?php
// Create article
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Programmatic Article');
$item->setVar('description', 'Created via API');
$item->setVar('body', '<p>Full content here</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // Published
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Article created: " . $item->getVar('itemid');
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
?>
```

### Získejte články podle kategorií

```php
<?php
// Get category articles
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Articles in category " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### Aktualizujte stav článku

```php
<?php
// Change article status
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // Publish

    if ($itemHandler->insert($item)) {
        echo "Article published";
    } else {
        echo "Error publishing article";
    }
} else {
    echo "Article not found";
}
?>
```

### Získejte strom kategorií

```php
<?php
// Build category tree
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

## Zpracování chyb

### Ošetřujte chyby

```php
<?php
// Try/catch error handling
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('Item not found');
    }

    $item->setVar('title', 'New Title');

    if (!$itemHandler->insert($item)) {
        throw new Exception('Failed to save item');
    }
} catch (Exception $e) {
    error_log('Publisher Error: ' . $e->getMessage());
    // Handle error
}
?>
```

### Získejte chybové zprávy

```php
<?php
// Get error messages from object
$item = $itemHandler->create();
// ... set variables ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Error: " . $error . "\n";
    }
}
?>
```

---

## Související dokumentace

- Háčky a události
- Vlastní šablony
- Analýza modulu vydavatele
- Šablony a bloky v Publisheru
- Tvorba článku
- Category Management

---

## Zdroje

- [Vydavatel GitHub](https://github.com/XOOPSModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [Dokumentace PHP](https://www.php.net/docs.php)

---

#vydavatel #api #reference #kód #třídy #metody #xoops