---
title：“XOOPSObjectHandler 类”
description：“用于对具有数据库持久性的 XOOPSObject 实例进行 CRUD 操作的基本处理程序类”
---

`XOOPSObjectHandler`类及其扩展`XOOPSPersistableObjectHandler`提供了一个标准化接口，用于在`XOOPSObject`实例上执行CRUD（创建、读取、更新、删除）操作。这实现了数据映射器模式，将域逻辑与数据库访问分开。

## 类概述

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

## 类层次结构

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

## XOOPSObjectHandler

### 构造函数

```php
public function __construct(XoopsDatabase $db)
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$db` | XOOPS数据库|数据库连接实例|

**示例：**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### 创建

创建一个新的对象实例。

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$isNew` |布尔 |对象是否是新的（默认：true） |

**返回：** `XOOPSObject|null` - 新对象实例

**示例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### 得到

通过主键检索对象。

```php
abstract public function get(int $id): ?XoopsObject
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$id` |整数 |主键值 |

**返回：** `XOOPSObject|null` - 对象实例，如果未找到则返回 null

**示例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

###插入

将对象保存到数据库（插入或更新）。

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$obj` | XOOPS对象 |要保存的对象 |
| `$force` |布尔 |即使对象不变，也强制操作 |

**返回：** `bool` - 成功则为真

**示例：**
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

###删除

从数据库中删除一个对象。

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$obj` | XOOPS对象 |要删除的对象 |
| `$force` |布尔 |强制删除|

**返回：** `bool` - 成功则为真

**示例：**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XOOPSPersistableObjectHandler

`XOOPSPersistableObjectHandler` 通过用于查询和批量操作的附加方法扩展了`XOOPSObjectHandler`。

### 构造函数

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$db` | XOOPS数据库|数据库连接 |
| `$table` |字符串|表名（无前缀）|
| `$className` |字符串|对象的完整类名 |
| `$keyName`|字符串|主键字段名称 |
| `$identifierName` |字符串|人类-readable标识符字段|

**示例：**
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

### 获取对象

检索匹配条件的多个对象。

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$criteria` |标准元素 |查询条件（可选）|
| `$idAsKey` |布尔 |使用主键作为数组键 |
| `$asObject`|布尔 |返回对象 (true) 或数组 (false) |

**返回：** `array` - 对象数组或关联数组

**示例：**
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

### 获取计数

计算符合条件的对象。

```php
public function getCount(CriteriaElement $criteria = null): int
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$criteria` |标准元素 |查询条件（可选）|

**返回：** `int` - 匹配对象的计数

**示例：**
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

### 获取全部

检索所有对象（不带条件的 getObjects 的别名）。

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$criteria`|标准元素 |查询条件 |
| `$fields` |数组|要检索的特定字段 |
| `$asObject` |布尔 |作为对象返回 |
| `$idAsKey` |布尔 |使用 ID 作为数组键 |

**示例：**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### 获取Id

仅检索匹配对象的主键。

```php
public function getIds(CriteriaElement $criteria = null): array
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$criteria` |标准元素 |查询条件 |

**返回：** `array` - 主键值数组**示例：**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### 获取列表

检索下拉菜单的关键-value列表。

```php
public function getList(CriteriaElement $criteria = null): array
```

**返回：** `array` - 关联数组 [id => 标识符]

**示例：**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### 全部删除

删除所有符合条件的对象。

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$criteria` |标准元素 |删除对象的标准 |
| `$force`|布尔 |强制删除|
| `$asObject` |布尔 |删除之前加载对象（触发事件）|

**返回：** `bool` - 成功则为真

**示例：**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

###更新全部

更新所有匹配对象的字段值。

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$fieldname`|字符串|要更新的字段 |
| `$fieldvalue` |混合 |新价值|
| `$criteria` |标准元素 |更新对象的标准 |
| `$force` |布尔 |强制更新 |

**返回：** `bool` - 成功则为真

**示例：**
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

### 插入（扩展）

具有附加功能的扩展插入方法。

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**行为：**
- 如果对象是新的（`isNew() === true`）：INSERT
- 如果对象存在（`isNew() === false`）：UPDATE
- 自动呼叫`cleanVars()`
- 在新对象上设置自动-increment ID

**示例：**
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

## 辅助函数

### XOOPS_getHandler

用于检索核心处理程序的全局函数。

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$name` |字符串|处理程序名称（用户、模区块、组等）|
| `$optional`|布尔 |返回 null 而不是触发错误 |

**示例：**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### XOOPS_getModuleHandler

检索模区块-specific处理程序。

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$name` |字符串|处理者名称 |
| `$dirname`|字符串|模区块目录名称|
| `$optional`|布尔 |失败时返回 null |

**示例：**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## 创建自定义处理程序

### 基本处理程序实现

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

### 使用自定义处理程序

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

## 最佳实践

1. **使用 Criteria 进行查询**：始终使用 Criteria 对象进行类型-safe 查询

2. **扩展自定义方法**：将域-specific查询方法添加到处理程序

3. **Override insert/delete**：在override中添加级联操作和时间戳

4. **Use TransactionWhere Needed**：将复杂的操作包装在事务中

5. **利用 getList**：使用 `getList()` 选择下拉列表以减少查询

6. **索引键**：确保标准中使用的数据库字段已建立索引

7. **限制结果**：对于可能较大的结果集，始终使用 `setLimit()`

## 相关文档

- XOOPSObject - 基础对象类
- ../Database/Criteria - 构建查询条件
- ../Database/XOOPSDatabase - 数据库操作

---

*另见：[XOOPS Source Code](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/XOOPSobject.php)*