---
title: "Publisher - APIリファレンス"
description: "クラス、メソッド、コード例を含むPublisherモジュールの完全なAPIリファレンス"
---

# Publisher APIリファレンス

> Publisherモジュールのクラス、メソッド、関数、APIエンドポイントの完全なリファレンス。

---

## モジュール構造

### クラス構成

```
Publisherモジュールクラス:

├── Item / ItemHandler
│   ├── 記事取得
│   ├── 記事作成
│   ├── 記事更新
│   └── 記事削除
│
├── Category / CategoryHandler
│   ├── カテゴリ取得
│   ├── カテゴリ作成
│   ├── カテゴリ更新
│   └── カテゴリ削除
│
├── Comment / CommentHandler
│   ├── コメント取得
│   ├── コメント作成
│   ├── コメント管理
│   └── コメント削除
│
└── Helper
    ├── ユーティリティ関数
    ├── フォーマット関数
    └── パーミッションチェック
```

---

## Itemクラス

### 概要

`Item`クラスはPublisher内の単一の記事/アイテムを表します。

**名前空間:** `XoopsModules\Publisher\`

**ファイル:** `modules/publisher/class/Item.php`

### コンストラクター

```php
// 新しいアイテムを作成
$item = new Item();

// 既存のアイテムを取得
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### プロパティとメソッド

#### プロパティを取得

```php
// 記事IDを取得
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// タイトルを取得
$title = $item->getVar('title');
$title = $item->title();

// 説明を取得
$description = $item->getVar('description');
$description = $item->description();

// 本文/コンテンツを取得
$body = $item->getVar('body');
$body = $item->body();

// サブタイトルを取得
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// 著者を取得
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// 著者名を取得
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// カテゴリを取得
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// ステータスを取得
$status = $item->getVar('status');
$status = $item->status();

// 公開日を取得
$date = $item->getVar('datesub');
$date = $item->date();

// 修正日を取得
$modified = $item->getVar('datemod');
$modified = $item->modified();

// ビュー数を取得
$views = $item->getVar('counter');
$views = $item->views();

// 画像を取得
$image = $item->getVar('image');
$image = $item->image();

// 注目ステータスを取得
$featured = $item->getVar('featured');
```

#### プロパティを設定

```php
// タイトルを設定
$item->setVar('title', 'New Article Title');

// 本文を設定
$item->setVar('body', '<p>Article content here</p>');

// 説明を設定
$item->setVar('description', 'Short description');

// カテゴリを設定
$item->setVar('categoryid', 5);

// ステータスを設定 (0=下書き、1=公開など)
$item->setVar('status', 1);

// 注目を設定
$item->setVar('featured', 1);

// 画像を設定
$item->setVar('image', 'path/to/image.jpg');
```

#### メソッド

```php
// フォーマットされた日付を取得
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// アイテムURLを取得
$url = $item->url();

// カテゴリURLを取得
$catUrl = $item->categoryUrl();

// 公開されているかチェック
$isPublished = $item->isPublished();

// 編集URLを取得
$editUrl = $item->editUrl();

// 削除URLを取得
$deleteUrl = $item->deleteUrl();

// 抜粋/要約を取得
$summary = $item->getSummary(100);
$summary = $item->description();

// すべてのタグを取得
$tags = $item->getTags();

// コメントを取得
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// 評価を取得
$rating = $item->getRating();

// 評価数を取得
$ratingCount = $item->getRatingCount();
```

---

## ItemHandlerクラス

### 概要

`ItemHandler`は記事のCRUD操作を管理します。

**ファイル:** `modules/publisher/class/ItemHandler.php`

### アイテムを取得

```php
// IDで単一のアイテムを取得
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// すべてのアイテムを取得
$items = $itemHandler->getAll();

// 条件付きでアイテムを取得
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // 公開済みのみ
$criteria->add(new Criteria('categoryid', 5)); // 特定カテゴリ
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// カテゴリ別にアイテムを取得
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// 最新のアイテムを取得
$items = $itemHandler->getRecent($limit = 10);

// 注目アイテムを取得
$items = $itemHandler->getFeatured($limit = 5);

// アイテムをカウント
$total = $itemHandler->getCount($criteria);
```

### アイテムを作成

```php
// 新しいアイテムを作成
$item = $itemHandler->create();

// プロパティを設定
$item->setVar('title', 'Article Title');
$item->setVar('body', '<p>Content</p>');
$item->setVar('description', 'Short desc');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // 下書き
$item->setVar('datesub', time());

// 保存
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "Article created: " . $itemId;
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### アイテムを更新

```php
// アイテムを取得
$item = $itemHandler->get($itemId);

// 修正
$item->setVar('title', 'Updated Title');
$item->setVar('body', '<p>Updated content</p>');
$item->setVar('status', 1); // 公開

// 保存
if ($itemHandler->insert($item)) {
    echo "Item updated";
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
```

### アイテムを削除

```php
// アイテムを取得
$item = $itemHandler->get($itemId);

// 削除
if ($itemHandler->delete($item)) {
    echo "Item deleted";
} else {
    echo "Error deleting item";
}

// IDで削除
$itemHandler->deleteByPrimary($itemId);
```

---

## Categoryクラス

### 概要

`Category`クラスはカテゴリまたはセクションを表します。

**ファイル:** `modules/publisher/class/Category.php`

### メソッド

```php
// カテゴリIDを取得
$catId = $category->getVar('categoryid');
$catId = $category->id();

// 名前を取得
$name = $category->getVar('name');
$name = $category->name();

// 説明を取得
$desc = $category->getVar('description');
$desc = $category->description();

// 画像を取得
$image = $category->getVar('image');
$image = $category->image();

// 親カテゴリを取得
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// ステータスを取得
$status = $category->getVar('status');

// URLを取得
$url = $category->url();

// アイテムカウントを取得
$count = $category->itemCount();

// サブカテゴリを取得
$subs = $category->getSubCategories();

// 親カテゴリオブジェクトを取得
$parent = $category->getParent();
```

---

## CategoryHandlerクラス

### 概要

`CategoryHandler`はカテゴリのCRUD操作を管理します。

**ファイル:** `modules/publisher/class/CategoryHandler.php`

### カテゴリを取得

```php
// 単一のカテゴリを取得
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// すべてのカテゴリを取得
$categories = $catHandler->getAll();

// ルートカテゴリを取得（親がない）
$roots = $catHandler->getRoots();

// サブカテゴリを取得
$subs = $catHandler->getByParent($parentId);

// クライテリア付きでカテゴリを取得
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### カテゴリを作成

```php
// 新規作成
$category = $catHandler->create();

// 値を設定
$category->setVar('name', 'News');
$category->setVar('description', 'News items');
$category->setVar('parentid', 0); // ルートレベル
$category->setVar('status', 1);

// 保存
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "Error";
}
```

### カテゴリを更新

```php
// カテゴリを取得
$category = $catHandler->get($categoryId);

// 修正
$category->setVar('name', 'Updated Name');

// 保存
$catHandler->insert($category);
```

### カテゴリを削除

```php
// カテゴリを取得
$category = $catHandler->get($categoryId);

// 削除
$catHandler->delete($category);
```

---

## ヘルパー関数

### ユーティリティ関数

Helperクラスはユーティリティ関数を提供します:

**ファイル:** `modules/publisher/class/Helper.php`

```php
// ヘルパーインスタンスを取得
$helper = \XoopsModules\Publisher\Helper::getInstance();

// モジュールインスタンスを取得
$module = $helper->getModule();

// ハンドラーを取得
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// 設定値を取得
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// パーミッションをチェック
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// URLを取得
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// ベースパスを取得
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### フォーマット関数

```php
// 日付をフォーマット
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// テキストを短縮
$excerpt = $helper->truncate($text, $length = 100);

// 入力をサニタイズ
$clean = $helper->sanitize($input);

// 出力を準備
$output = $helper->prepare($data);

// ブレッドクラムを取得
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## JavaScript API

### フロントエンドJavaScript関数

Publisherはフロントエンドインタラクション用のJavaScript APIを含みます:

```javascript
// Publisher JSライブラリをインクルード
<script src="/modules/publisher/assets/js/publisher.js"></script>

// Publisherオブジェクトが存在するかチェック
if (typeof Publisher !== 'undefined') {
    // Publisher APIを使用
}

// 記事データを取得
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// カテゴリデータを取得
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// 評価を送信
Publisher.submitRating(itemId, rating, function(response) {
    console.log('Rating saved');
});

// さらに記事をロード
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // ロードされた記事を処理
});

// 記事を検索
Publisher.search(query, function(results) {
    // 検索結果を処理
});
```

### Ajaxエンドポイント

Publisherはフロントエンドインタラクション用のAJAXエンドポイントを提供します:

```javascript
// AJAXで記事を取得
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// AJAXでコメントを送信
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// 評価を取得
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## REST API（有効な場合）

### APIエンドポイント

Publisherが REST APIを公開している場合:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### APIコール例

```php
// REST経由でアイテムを取得
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// 単一のアイテムを取得
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// アイテムを作成
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

## データベーススキーマ

### テーブル

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

## イベント＆フック

### Publisherイベント

```php
// アイテム作成イベント
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// アイテム更新
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// アイテム削除
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// 記事にコメント
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### イベントをリッスン

```php
// イベントリスナーを登録
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// またはプラグインで
public function onItemCreated($item) {
    // アイテム作成を処理
}
```

---

## コード例

### 最新の記事を取得

```php
<?php
// 最新の公開記事を取得
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // 公開
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

### プログラムで記事を作成

```php
<?php
// 記事を作成
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'Programmatic Article');
$item->setVar('description', 'Created via API');
$item->setVar('body', '<p>Full content here</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // 公開
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "Article created: " . $item->getVar('itemid');
} else {
    echo "Error: " . implode(', ', $item->getErrors());
}
?>
```

### カテゴリ別に記事を取得

```php
<?php
// カテゴリ記事を取得
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "Articles in category " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### 記事ステータスを更新

```php
<?php
// 記事ステータスを変更
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // 公開

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

### カテゴリツリーを取得

```php
<?php
// カテゴリツリーを構築
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

## エラーハンドリング

### エラーを処理

```php
<?php
// Try/catchエラーハンドリング
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
    // エラーを処理
}
?>
```

### エラーメッセージを取得

```php
<?php
// オブジェクトからエラーメッセージを取得
$item = $itemHandler->create();
// ... 変数を設定 ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "Error: " . $error . "\n";
    }
}
?>
```

---

## 関連ドキュメント

- フックとイベント
- カスタムテンプレート
- Publisherモジュール分析
- PublisherのテンプレートとブロックPHP
- 記事作成
- カテゴリ管理

---

## リソース

- [Publisher GitHub](https://github.com/XoopsModules25x/publisher)
- [XOOPS API](../../04-API-Reference/API-Reference.md)
- [PHP Documentation](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
