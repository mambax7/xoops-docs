---
title: "Publisher - API 參考"
description: "Publisher 模組的完整 API 參考，包括類別、方法和程式碼範例"
---

# Publisher API 參考

> Publisher 模組類別、方法、函數和 API 端點的完整參考。

---

## 模組結構

### 類別組織

```
Publisher 模組類別：

├── Item / ItemHandler
│   ├── 取得文章
│   ├── 建立文章
│   ├── 更新文章
│   └── 刪除文章
│
├── Category / CategoryHandler
│   ├── 取得分類
│   ├── 建立分類
│   ├── 更新分類
│   └── 刪除分類
│
├── Comment / CommentHandler
│   ├── 取得留言
│   ├── 建立留言
│   ├── 審核留言
│   └── 刪除留言
│
└── Helper
    ├── 公用函數
    ├── 格式化函數
    └── 權限檢查
```

---

## Item 類別

### 概述

`Item` 類別代表 Publisher 中的單個文章/項目。

**命名空間：** `XoopsModules\Publisher\`

**檔案：** `modules/publisher/class/Item.php`

### 建構子

```php
// 建立新項目
$item = new Item();

// 取得現有項目
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### 屬性和方法

#### 取得屬性

```php
// 取得文章 ID
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// 取得標題
$title = $item->getVar('title');
$title = $item->title();

// 取得說明
$description = $item->getVar('description');
$description = $item->description();

// 取得正文/內容
$body = $item->getVar('body');
$body = $item->body();

// 取得副標題
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// 取得作者
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// 取得作者名稱
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// 取得分類
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// 取得狀態
$status = $item->getVar('status');
$status = $item->status();

// 取得發佈日期
$date = $item->getVar('datesub');
$date = $item->date();

// 取得修改日期
$modified = $item->getVar('datemod');
$modified = $item->modified();

// 取得檢視計數
$views = $item->getVar('counter');
$views = $item->views();

// 取得圖像
$image = $item->getVar('image');
$image = $item->image();

// 取得特色狀態
$featured = $item->getVar('featured');
```

#### 設定屬性

```php
// 設定標題
$item->setVar('title', 'New Article Title');

// 設定正文
$item->setVar('body', '<p>Article content here</p>');

// 設定說明
$item->setVar('description', 'Short description');

// 設定分類
$item->setVar('categoryid', 5);

// 設定狀態 (0=草稿, 1=已發佈, 等等)
$item->setVar('status', 1);

// 設定特色
$item->setVar('featured', 1);

// 設定圖像
$item->setVar('image', 'path/to/image.jpg');
```

#### 方法

```php
// 取得格式化日期
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// 取得項目URL
$url = $item->url();

// 取得分類URL
$catUrl = $item->categoryUrl();

// 檢查是否已發佈
$isPublished = $item->isPublished();

// 取得編輯URL
$editUrl = $item->editUrl();

// 取得刪除URL
$deleteUrl = $item->deleteUrl();

// 取得摘要/摘要
$summary = $item->getSummary(100);
$summary = $item->description();

// 取得所有標籤
$tags = $item->getTags();

// 取得留言
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// 取得評分
$rating = $item->getRating();

// 取得評分計數
$ratingCount = $item->getRatingCount();
```

---

## ItemHandler 類別

### 概述

`ItemHandler` 管理文章的 CRUD 操作。

**檔案：** `modules/publisher/class/ItemHandler.php`

### 檢索項目

```php
// 按 ID 取得單個項目
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// 取得所有項目
$items = $itemHandler->getAll();

// 取得滿足條件的項目
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // 僅已發佈
$criteria->add(new Criteria('categoryid', 5)); // 特定分類
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// 按分類取得項目
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// 取得最新項目
$items = $itemHandler->getRecent($limit = 10);

// 取得特色項目
$items = $itemHandler->getFeatured($limit = 5);

// 計算項目
$total = $itemHandler->getCount($criteria);
```

### 建立項目

```php
// 建立新項目
$item = $itemHandler->create();

// 設定屬性
$item->setVar('title', 'Article Title');
$item->setVar('body', '<p>Content</p>');
$item->setVar('description', 'Short desc');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // 草稿
$item->setVar('datesub', time());

// 儲存
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Article created: " . $itemId;
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### 更新項目

```php
// 取得項目
$item = $itemHandler->get($itemId);

// 修改
$item->setVar('title', 'Updated Title');
$item->setVar('body', '<p>Updated content</p>');
$item->setVar('status', 1); // 發佈

// 儲存
if ($itemHandler->insert($item)) {
    echo "Item updated";
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### 刪除項目

```php
// 取得項目
$item = $itemHandler->get($itemId);

// 刪除
if ($itemHandler->delete($item)) {
    echo "Item deleted";
} else {
    echo "Error deleting item";
}

// 按 ID 刪除
$itemHandler->deleteByPrimary($itemId);
```

---

## Category 類別

### 概述

`Category` 類別代表分類或部分。

**檔案：** `modules/publisher/class/Category.php`

### 方法

```php
// 取得分類 ID
$catId = $category->getVar('categoryid');
$catId = $category->id();

// 取得名稱
$name = $category->getVar('name');
$name = $category->name();

// 取得說明
$desc = $category->getVar('description');
$desc = $category->description();

// 取得圖像
$image = $category->getVar('image');
$image = $category->image();

// 取得父分類
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// 取得狀態
$status = $category->getVar('status');

// 取得URL
$url = $category->url();

// 取得項目計數
$count = $category->itemCount();

// 取得子分類
$subs = $category->getSubCategories();

// 取得父分類物件
$parent = $category->getParent();
```

---

## CategoryHandler 類別

### 概述

`CategoryHandler` 管理分類 CRUD 操作。

**檔案：** `modules/publisher/class/CategoryHandler.php`

### 檢索分類

```php
// 取得單個分類
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// 取得所有分類
$categories = $catHandler->getAll();

// 取得根分類（沒有父級）
$roots = $catHandler->getRoots();

// 取得子分類
$subs = $catHandler->getByParent($parentId);

// 取得滿足條件的分類
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### 建立分類

```php
// 建立新分類
$category = $catHandler->create();

// 設定值
$category->setVar('name', 'News');
$category->setVar('description', 'News items');
$category->setVar('parentid', 0); // 根級別
$category->setVar('status', 1);

// 儲存
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Error";
}
```

### 更新分類

```php
// 取得分類
$category = $catHandler->get($categoryId);

// 修改
$category->setVar('name', 'Updated Name');

// 儲存
$catHandler->insert($category);
```

### 刪除分類

```php
// 取得分類
$category = $catHandler->get($categoryId);

// 刪除
$catHandler->delete($category);
```

---

## 幫助函數

### 公用函數

Helper 類別提供公用函數：

**檔案：** `modules/publisher/class/Helper.php`

```php
// 取得幫助器實例
$helper = \XoopsModules\Publisher\Helper::getInstance();

// 取得模組實例
$module = $helper->getModule();

// 取得處理程式
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// 取得配置值
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// 檢查權限
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// 取得URL
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// 取得基本路徑
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### 格式化函數

```php
// 格式化日期
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// 截斷文本
$excerpt = $helper->truncate($text, $length = 100);

// 清理輸入
$clean = $helper->sanitize($input);

// 準備輸出
$output = $helper->prepare($data);

// 取得麵包屑
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## JavaScript API

### 前端 JavaScript 函數

Publisher 包括前端互動的 JavaScript API：

```javascript
// 包含 Publisher JS 庫
<script src="/modules/publisher/assets/js/publisher.js"></script>

// 檢查 Publisher 物件是否存在
if (typeof Publisher !== 'undefined') {
    // 使用 Publisher API
}

// 取得文章資料
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// 取得分類資料
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// 提交評分
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Rating saved');
});

// 載入更多文章
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // 處理載入的文章
});

// 搜尋文章
Publisher.search(query, function(results) {
    // 處理搜尋結果
});
```

### AJAX 端點

Publisher 提供前端互動的 AJAX 端點：

```javascript
// 透過 AJAX 取得文章
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// 透過 AJAX 提交留言
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// 取得評分
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## REST API（如果啟用）

### API 端點

如果 Publisher 暴露 REST API：

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### API 呼叫範例

```php
// 透過 REST 取得項目
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// 取得單個項目
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// 建立項目
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

## 資料庫架構

### 表

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

## 事件和掛鉤

### Publisher 事件

```php
// 項目建立事件
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// 項目更新
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// 項目刪除
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// 文章留言
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### 監聽事件

```php
// 註冊事件監聽器
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// 或在外掛中
public function onItemCreated($item) {
    // 處理項目建立
}
```

---

## 程式碼範例

### 取得最近文章

```php
<?php
// 取得最近發佈的文章
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // 已發佈
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>閱讀更多</a>\n\n";
}
?>
```

### 以程式方式建立文章

```php
<?php
// 建立文章
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Programmatic Article');
$item->setVar('description', 'Created via API');
$item->setVar('body', '<p>Full content here</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // 已發佈
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Article created: " . $item->getVar('itemid');
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
?>
```

### 按分類取得文章

```php
<?php
// 取得分類文章
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Articles in category " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### 更新文章狀態

```php
<?php
// 變更文章狀態
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // 發佈

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

### 取得分類樹

```php
<?php
// 建立分類樹
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

## 錯誤處理

### 處理錯誤

```php
<?php
// Try/catch 錯誤處理
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
    // 處理錯誤
}
?>
```

### 取得錯誤訊息

```php
<?php
// 從物件取得錯誤訊息
$item = $itemHandler->create();
// ... 設定變數 ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Error: " . $error . "\n";
    }
}
?>
```

---

## 相關文件

- 掛鉤和事件
- 自訂範本
- Publisher 模組分析
- Publisher 中的範本和區塊
- 文章建立
- 分類管理

---

## 資源

- [Publisher GitHub](https://github.com/XoopsModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [PHP 文件](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
