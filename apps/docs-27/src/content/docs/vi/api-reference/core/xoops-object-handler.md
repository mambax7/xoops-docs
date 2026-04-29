---
title: "Lớp XoopsObjectHandler"
description: "Trình xử lý cơ sở class cho các hoạt động CRUD trên các phiên bản XoopsObject với tính bền vững của cơ sở dữ liệu"
---
`XoopsObjectHandler` class và tiện ích mở rộng `XoopsPersistableObjectHandler` của nó cung cấp giao diện chuẩn hóa để thực hiện các hoạt động CRUD (Tạo, Đọc, Cập nhật, Xóa) trên các phiên bản `XoopsObject`. Điều này triển khai mẫu Trình ánh xạ dữ liệu, tách logic miền khỏi quyền truy cập cơ sở dữ liệu.

## Tổng quan về lớp học

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

## Hệ thống phân cấp lớp

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

### Trình xây dựng

```php
public function __construct(XoopsDatabase $db)
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$db` | Cơ sở dữ liệu Xoops | Ví dụ kết nối cơ sở dữ liệu |

**Ví dụ:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### tạo

Tạo một thể hiện đối tượng mới.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$isNew` | bool | Đối tượng có mới hay không (mặc định: true) |

**Trả về:** `XoopsObject|null` - Phiên bản đối tượng mới

**Ví dụ:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### nhận được

Truy xuất một đối tượng bằng khóa chính của nó.

```php
abstract public function get(int $id): ?XoopsObject
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$id` | int | Giá trị khóa chính |

**Trả về:** `XoopsObject|null` - Phiên bản đối tượng hoặc null nếu không tìm thấy

**Ví dụ:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### chèn

Lưu một đối tượng vào cơ sở dữ liệu (chèn hoặc cập nhật).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$obj` | XoopsObject | Đối tượng cần lưu |
| `$force` | bool | Buộc hoạt động ngay cả khi đối tượng không thay đổi |

**Trả về:** `bool` - Đúng khi thành công

**Ví dụ:**
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

### xóa

Xóa một đối tượng khỏi cơ sở dữ liệu.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$obj` | XoopsObject | Đối tượng cần xóa |
| `$force` | bool | Buộc xóa |

**Trả về:** `bool` - Đúng khi thành công

**Ví dụ:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` mở rộng `XoopsObjectHandler` với các phương pháp bổ sung để truy vấn và vận hành hàng loạt.

### Trình xây dựng

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$db` | Cơ sở dữ liệu Xoops | Kết nối cơ sở dữ liệu |
| `$table` | chuỗi | Tên bảng (không có tiền tố) |
| `$className` | chuỗi | Tên đầy đủ class của đối tượng |
| `$keyName` | chuỗi | Tên trường khóa chính |
| `$identifierName` | chuỗi | Trường định danh con người có thể đọc được |

**Ví dụ:**
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

### getObject

Truy xuất nhiều đối tượng phù hợp với tiêu chí.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$criteria` | Yếu tố tiêu chí | Tiêu chí truy vấn (tùy chọn) |
| `$idAsKey` | bool | Sử dụng khóa chính làm khóa mảng |
| `$asObject` | bool | Trả về đối tượng (đúng) hoặc mảng (sai) |

**Trả về:** `array` - Mảng đối tượng hoặc mảng kết hợp

**Ví dụ:**
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

Đếm các đối tượng phù hợp với tiêu chí.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$criteria` | Yếu tố tiêu chí | Tiêu chí truy vấn (tùy chọn) |**Trả về:** `int` - Số lượng đối tượng phù hợp

**Ví dụ:**
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

### lấy tất cả

Truy xuất tất cả các đối tượng (bí danh cho getObjects không có tiêu chí).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$criteria` | Yếu tố tiêu chí | Tiêu chí truy vấn |
| `$fields` | mảng | Các trường cụ thể cần truy xuất |
| `$asObject` | bool | Trả về dưới dạng đối tượng |
| `$idAsKey` | bool | Sử dụng ID làm khóa mảng |

**Ví dụ:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getId

Chỉ lấy các khóa chính của các đối tượng phù hợp.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$criteria` | Yếu tố tiêu chí | Tiêu chí truy vấn |

**Trả về:** `array` - Mảng các giá trị khóa chính

**Ví dụ:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### lấy danh sách

Truy xuất danh sách khóa-giá trị cho danh sách thả xuống.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Trả về:** `array` - Mảng kết hợp [id => mã định danh]

**Ví dụ:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### xóaTất cả

Xóa tất cả các đối tượng phù hợp với tiêu chí.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$criteria` | Yếu tố tiêu chí | Tiêu chí xóa đối tượng |
| `$force` | bool | Buộc xóa |
| `$asObject` | bool | Tải đối tượng trước khi xóa (kích hoạt sự kiện) |

**Trả về:** `bool` - Đúng khi thành công

**Ví dụ:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### cập nhậtTất cả

Cập nhật giá trị trường cho tất cả các đối tượng phù hợp.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$fieldname` | chuỗi | Trường cần cập nhật |
| `$fieldvalue` | hỗn hợp | Giá trị mới |
| `$criteria` | Yếu tố tiêu chí | Tiêu chí đối tượng cập nhật |
| `$force` | bool | Buộc cập nhật |

**Trả về:** `bool` - Đúng khi thành công

**Ví dụ:**
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

### chèn (Mở rộng)

Phương thức chèn mở rộng với chức năng bổ sung.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Hành vi:**
- Nếu đối tượng mới (`isNew() === true`): INSERT
- Nếu đối tượng tồn tại (`isNew() === false`): CẬP NHẬT
- Tự động gọi `cleanVars()`
- Đặt ID tăng tự động trên các đối tượng mới

**Ví dụ:**
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

## Chức năng trợ giúp

### xoops_getHandler

Hàm toàn cục để truy xuất trình xử lý lõi.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$name` | chuỗi | Tên trình xử lý (người dùng, mô-đun, nhóm, v.v.) |
| `$optional` | bool | Trả về null thay vì gây ra lỗi |

**Ví dụ:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Truy xuất một trình xử lý dành riêng cho mô-đun.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Thông số:**

| Tham số | Loại | Mô tả |
|----------|------|-------------|
| `$name` | chuỗi | Tên người xử lý |
| `$dirname` | chuỗi | Tên thư mục mô-đun |
| `$optional` | bool | Trả về null khi thất bại |

**Ví dụ:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Tạo trình xử lý tùy chỉnh

### Triển khai trình xử lý cơ bản

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

### Sử dụng Trình xử lý tùy chỉnh

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

## Các phương pháp hay nhất

1. **Sử dụng Tiêu chí cho Truy vấn**: Luôn sử dụng các đối tượng Tiêu chí cho các truy vấn an toàn về loại2. **Mở rộng cho các phương thức tùy chỉnh**: Thêm các phương thức truy vấn theo miền cụ thể vào trình xử lý

3. **Ghi đè chèn/xóa**: Thêm các thao tác xếp tầng và dấu thời gian trong phần ghi đè

4. **Sử dụng giao dịch khi cần thiết**: Bao gồm các hoạt động phức tạp trong giao dịch

5. **Tận dụng getList**: Sử dụng `getList()` cho danh sách thả xuống chọn lọc nhằm giảm truy vấn

6. **Khóa chỉ mục**: Đảm bảo các trường cơ sở dữ liệu được sử dụng trong tiêu chí được lập chỉ mục

7. **Giới hạn kết quả**: Luôn sử dụng `setLimit()` cho các tập hợp kết quả có thể lớn

## Tài liệu liên quan

- XoopsObject - Đối tượng cơ sở class
- ../Database/Criteria - Xây dựng tiêu chí truy vấn
- ../Database/XoopsDatabase - Thao tác với cơ sở dữ liệu

---

*Xem thêm: [Mã nguồn XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*