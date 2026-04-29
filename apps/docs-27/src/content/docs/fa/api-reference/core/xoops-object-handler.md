---
title: "کلاس XoopsObjectHandler"
description: "کلاس کنترل کننده پایه برای عملیات CRUD در نمونه های XoopsObject با پایداری پایگاه داده"
---
کلاس `XoopsObjectHandler` و پسوند آن `XoopsPersistableObjectHandler` یک رابط استاندارد برای انجام عملیات CRUD (ایجاد، خواندن، به‌روزرسانی، حذف) در نمونه‌های `XoopsObject` ارائه می‌کند. این الگوی Data Mapper را پیاده سازی می کند و منطق دامنه را از دسترسی به پایگاه داده جدا می کند.

## نمای کلی کلاس

```php
namespace XOOPS\Core;

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

## سلسله مراتب کلاس

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

### سازنده

```php
public function __construct(XoopsDatabase $db)
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$db` | XoopsDatabase | نمونه اتصال پایگاه داده |

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### ایجاد کنید

یک نمونه شی جدید ایجاد می کند.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$isNew` | bool | آیا شی جدید است (پیش‌فرض: درست) |

**برگرداند:** `XoopsObject|null` - نمونه شی جدید

**مثال:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### دریافت کنید

یک شی را با کلید اصلی آن بازیابی می کند.

```php
abstract public function get(int $id): ?XoopsObject
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$id` | int | مقدار کلید اولیه |

**برمی‌گرداند:** `XoopsObject|null` - نمونه شی یا در صورت یافت نشدن null

**مثال:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### درج کنید

یک شی را در پایگاه داده ذخیره می کند (درج یا به روز رسانی).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$obj` | XoopsObject | شیء برای ذخیره |
| `$force` | bool | عملیات اجباری حتی اگر جسم بدون تغییر |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
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

### حذف کنید

یک شی را از پایگاه داده حذف می کند.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$obj` | XoopsObject | اعتراض به حذف |
| `$force` | bool | حذف اجباری |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` `XoopsObjectHandler` را با روش های اضافی برای عملیات پرس و جو و انبوه گسترش می دهد.

### سازنده

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$db` | XoopsDatabase | اتصال به پایگاه داده |
| `$table` | رشته | نام جدول (بدون پیشوند) |
| `$className` | رشته | نام کلاس کامل شی |
| `$keyName` | رشته | نام فیلد کلید اصلی |
| `$identifierName` | رشته | فیلد شناسه قابل خواندن توسط انسان |

**مثال:**
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

### دریافت اشیا

چندین شیء مطابق با معیارها را بازیابی می کند.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معیارهای استعلام (اختیاری) |
| `$idAsKey` | bool | استفاده از کلید اصلی به عنوان کلید آرایه |
| `$asObject` | bool | برگرداندن اشیا (درست) یا آرایه ها (نادرست) |

**برگرداندن:** `array` - آرایه ای از اشیا یا آرایه های انجمنی

**مثال:**
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

### دریافت شمارش

اشیاء مطابق با معیارها را می شمارد.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معیارهای استعلام (اختیاری) |

**برگرداندن:** `int` - تعداد اشیاء منطبق

**مثال:**
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

### همه را دریافت کنید

همه اشیا (نام مستعار getObjects بدون معیار) را بازیابی می کند.

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معیارهای استعلام |
| `$fields` | آرایه | فیلدهای خاص برای بازیابی |
| `$asObject` | bool | بازگشت به عنوان اشیا |
| `$idAsKey` | bool | استفاده از ID به عنوان کلید آرایه |

**مثال:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### شناسه بگیریدفقط کلیدهای اصلی اشیاء منطبق را بازیابی می کند.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معیارهای استعلام |

**برمی‌گرداند:** `array` - آرایه‌ای از مقادیر کلید اولیه

**مثال:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### دریافت لیست

یک لیست کلید-مقدار را برای کشویی بازیابی می کند.

```php
public function getList(CriteriaElement $criteria = null): array
```

**برمی‌گرداند:** `array` - آرایه انجمنی [id => شناسه]

**مثال:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### حذف همه

تمام اشیاء مطابق با معیارها را حذف می کند.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معیارهای حذف اشیاء |
| `$force` | bool | حذف اجباری |
| `$asObject` | bool | بارگذاری اشیاء قبل از حذف (رویدادها را تحریک می کند) |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### به روز رسانی همه

یک مقدار فیلد را برای همه اشیاء منطبق به روز می کند.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$fieldname` | رشته | فیلد برای به روز رسانی |
| `$fieldvalue` | مخلوط | مقدار جدید |
| `$criteria` | CriteriaElement | معیارهای اشیا برای به روز رسانی |
| `$force` | bool | به روز رسانی اجباری |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
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

### درج (بسط داده شده)

روش درج توسعه یافته با عملکرد اضافی.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**رفتار:**
- اگر شی جدید است (`isNew() === true`): INSERT
- اگر شی وجود دارد (`isNew() === false`): به روز رسانی
- `cleanVars()` را بطور خودکار فرا می خواند
- شناسه افزایش خودکار را روی اشیاء جدید تنظیم می کند

**مثال:**
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

## توابع کمکی

### xoops_getHandler

عملکرد جهانی برای بازیابی یک کنترل کننده هسته.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$name` | رشته | نام هندلر (کاربر، ماژول، گروه و غیره) |
| `$optional` | bool | به جای ایجاد خطای | null را برگردانید

**مثال:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

یک کنترل کننده مخصوص ماژول را بازیابی می کند.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$name` | رشته | نام گرداننده |
| `$dirname` | رشته | نام دایرکتوری ماژول |
| `$optional` | bool | در صورت شکست، پوچ برگردانید |

**مثال:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## ایجاد هندلرهای سفارشی

### پیاده سازی Handler پایه

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

### با استفاده از کنترل کننده سفارشی

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

## بهترین شیوه ها

1. **استفاده از معیارها برای پرس و جوها**: همیشه از اشیاء معیار برای پرس و جوهای نوع ایمن استفاده کنید

2. **Extend for Custom Methods**: افزودن روش های پرس و جوی خاص دامنه به کنترل کننده ها

3. **Override insert/delete**: اضافه کردن عملیات آبشاری و مُهر زمانی در لغو

4. **از تراکنش در جاهایی که نیاز است استفاده کنید**: عملیات پیچیده را در تراکنش ها بپیچید

5. **Leverage getList**: از `getList()` برای انتخاب کشویی برای کاهش پرس و جوها استفاده کنید

6. **کلیدهای شاخص**: اطمینان حاصل کنید که فیلدهای پایگاه داده استفاده شده در معیارها نمایه شده اند

7. **نتایج محدود**: همیشه از `setLimit()` برای مجموعه نتایج بالقوه بزرگ استفاده کنید

## مستندات مرتبط

- XoopsObject - کلاس شی پایه
- ../Database/Criteria - معیارهای پرس و جو ساختمان
- ../Database/XoopsDatabase - عملیات پایگاه داده

---

*همچنین ببینید: [کد منبع XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*