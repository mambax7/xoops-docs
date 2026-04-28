---
title: "XoopsObjectHandler 類別"
description: "用於在 XoopsObject 實例上執行 CRUD 操作並具有資料庫持久化的基礎處理程式類別"
---

`XoopsObjectHandler` 類別及其擴充 `XoopsPersistableObjectHandler` 為在 `XoopsObject` 實例上執行 CRUD（建立、讀取、更新、刪除）操作提供標準化介面。這實現了資料映射器模式，將網域邏輯與資料庫存取分開。

## 類別概述

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## 類別階層

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### 建構函式

```php
public function __construct(XoopsDatabase $db)
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | 資料庫連線實例 |

**範例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

建立新物件實例。

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$isNew` | bool | 物件是否為新建（預設值：true） |

**傳回值：** `XoopsObject|null` - 新物件實例

**範例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

按主鍵檢索物件。

```php
abstract public function get(int $id): ?XoopsObject
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$id` | int | 主鍵值 |

**傳回值：** `XoopsObject|null` - 物件實例或 null（如果找不到）

**範例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

將物件保存到資料庫（插入或更新）。

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 要保存的物件 |
| `$force` | bool | 即使物件未變更也強制操作 |

**傳回值：** `bool` - 成功時為 true

**範例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### delete

從資料庫刪除物件。

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 要刪除的物件 |
| `$force` | bool | 強制刪除 |

**傳回值：** `bool` - 成功時為 true

**範例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` 擴充 `XoopsObjectHandler` 增加額外方法用於查詢和批量操作。

### 建構函式

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | 資料庫連線 |
| `$table` | string | 表格名稱（不含首碼） |
| `$className` | string | 物件的完整類別名稱 |
| `$keyName` | string | 主鍵欄位名稱 |
| `$identifierName` | string | 可讀的識別字欄位 |

**範例：**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### getObjects

檢索符合條件的多個物件。

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 查詢條件（選擇性） |
| `$idAsKey` | bool | 使用主鍵作為陣列鍵值 |
| `$asObject` | bool | 傳回物件（true）或陣列（false） |

**傳回值：** `array` - 物件或關聯陣列的陣列

**範例：**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

計算符合條件的物件。

```php
public function getCount(CriteriaElement $criteria = null): int
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 查詢條件（選擇性） |

**傳回值：** `int` - 符合物件的計數

**範例：**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

檢索所有物件（getObjects 的別名，無條件）。

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 查詢條件 |
| `$fields` | array | 要檢索的特定欄位 |
| `$asObject` | bool | 作為物件傳回 |
| `$idAsKey` | bool | 使用 ID 作為陣列鍵值 |

**範例：**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

只檢索符合物件的主鍵。

```php
public function getIds(CriteriaElement $criteria = null): array
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 查詢條件 |

**傳回值：** `array` - 主鍵值的陣列

**範例：**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

檢索用於下拉式清單的鍵值對清單。

```php
public function getList(CriteriaElement $criteria = null): array
```

**傳回值：** `array` - 關聯陣列 [id => identifier]

**範例：**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

刪除所有符合條件的物件。

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 要刪除的物件條件 |
| `$force` | bool | 強制刪除 |
| `$asObject` | bool | 刪除前載入物件（觸發事件） |

**傳回值：** `bool` - 成功時為 true

**範例：**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

更新所有符合物件的欄位值。

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$fieldname` | string | 要更新的欄位 |
| `$fieldvalue` | mixed | 新值 |
| `$criteria` | CriteriaElement | 要更新的物件條件 |
| `$force` | bool | 強制更新 |

**傳回值：** `bool` - 成功時為 true

**範例：**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert（擴充）

擴充的 insert 方法具有額外功能。

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**行為：**
- 如果物件是新的（`isNew() === true`）：INSERT
- 如果物件存在（`isNew() === false`）：UPDATE
- 自動呼叫 `cleanVars()`
- 在新物件上設定自動遞增 ID

**範例：**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## 協助程式函式

### xoops_getHandler

全域函式用於檢索核心處理程式。

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$name` | string | 處理程式名稱（user、module、group 等） |
| `$optional` | bool | 傳回 null 而不是觸發錯誤 |

**範例：**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

檢索模組特定的處理程式。

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**參數：**

| 參數 | 型別 | 描述 |
|-----------|------|-------------|
| `$name` | string | 處理程式名稱 |
| `$dirname` | string | 模組目錄名稱 |
| `$optional` | bool | 失敗時傳回 null |

**範例：**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## 建立自訂處理程式

### 基本處理程式實現

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### 使用自訂處理程式

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## 最佳實踐

1. **使用條件進行查詢**：始終為型別安全查詢使用 Criteria 物件

2. **擴充自訂方法**：將網域特定的查詢方法添加到處理程式

3. **覆寫 insert/delete**：在覆寫中添加級聯操作和時間戳

4. **需要時使用交易**：在複雜操作中使用交易包裝

5. **利用 getList**：為選擇下拉式清單使用 `getList()` 以減少查詢

6. **索引鍵**：確保條件中使用的資料庫欄位已編制索引

7. **限制結果**：始終為可能的大型結果集使用 `setLimit()`

## 相關文件

- XoopsObject - 基礎物件類別
- ../Database/Criteria - 構建查詢條件
- ../Database/XoopsDatabase - 資料庫操作

---

*另請參閱：[XOOPS 原始程式碼](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
