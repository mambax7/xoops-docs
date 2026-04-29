---
title: "게시자 - API 참조"
description: "클래스, 메소드 및 코드 예제가 포함된 게시자 모듈에 대한 완전한 API 참조"
---

# 게시자 API 참조

> 게시자 모듈 클래스, 메서드, 함수 및 API 끝점에 대한 전체 참조입니다.

---

## 모듈 구조

### 클래스 구성

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

## 아이템 클래스

### 개요

`Item` 클래스는 Publisher의 단일 기사/항목을 나타냅니다.

**네임스페이스:** `XoopsModules\Publisher\`

**파일:** `modules/publisher/class/Item.php`

### 생성자

```php
// Create new item
$item = new Item();

// Get existing item
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### 속성 및 메서드

#### 속성 가져오기

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

#### 속성 설정

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

#### 방법

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

## 아이템핸들러 클래스

### 개요

`ItemHandler`은 기사에 대한 CRUD 작업을 관리합니다.

**파일:** `modules/publisher/class/ItemHandler.php`

### 항목 검색

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

### 아이템 생성

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

### 업데이트 항목

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

### 항목 삭제

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

## 카테고리 클래스

### 개요

`Category` 클래스는 카테고리나 섹션을 나타냅니다.

**파일:** `modules/publisher/class/Category.php`

### 방법

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

## CategoryHandler 클래스

### 개요

`CategoryHandler`은 카테고리 CRUD 작업을 관리합니다.

**파일:** `modules/publisher/class/CategoryHandler.php`

### 카테고리 검색

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

### 카테고리 생성

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

### 업데이트 카테고리

```php
// Get category
$category = $catHandler->get($categoryId);

// Modify
$category->setVar('name', 'Updated Name');

// Save
$catHandler->insert($category);
```

### 카테고리 삭제

```php
// Get category
$category = $catHandler->get($categoryId);

// Delete
$catHandler->delete($category);
```

---

## 도우미 함수

### 유틸리티 기능

Helper 클래스는 다음과 같은 유틸리티 기능을 제공합니다.

**파일:** `modules/publisher/class/Helper.php`

```php
// Get helper instance
$helper = \XoopsModules\Publisher\Helper::getInstance();

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

### 형식 함수

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

### 프런트엔드 JavaScript 함수

게시자에는 프런트엔드 상호 작용을 위한 JavaScript API가 포함되어 있습니다.

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

### Ajax 엔드포인트

게시자는 프런트엔드 상호 작용을 위한 AJAX 엔드포인트를 제공합니다.

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

## REST API(활성화된 경우)

### API 엔드포인트

게시자가 REST API를 공개하는 경우:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### API 호출 예시

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

## 데이터베이스 스키마

### 테이블

#### 게시자_카테고리

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

#### 게시자_항목

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

#### 게시자_댓글

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### 게시자_파일

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## 이벤트 및 후크

### 게시자 이벤트

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

### 이벤트 듣기

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

## 코드 예

### 최근 기사 가져오기

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

### 프로그래밍 방식으로 기사 만들기

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

### 카테고리별로 기사 가져오기

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

### 기사 상태 업데이트

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

### 카테고리 트리 가져오기

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

## 오류 처리

### 오류 처리

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

### 오류 메시지 받기

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

## 관련 문서

- 후크 및 이벤트
- 맞춤 템플릿
- 퍼블리셔 모듈 분석
- Publisher의 템플릿 및 블록
- 기사 작성
- 카테고리 관리

---

## 리소스

- [출판사 GitHub](https://github.com/XoopsModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [PHP 문서](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
