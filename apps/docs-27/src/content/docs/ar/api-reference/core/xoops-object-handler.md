---
title: "فئة XoopsObjectHandler"
description: "فئة معالج الأساس لعمليات CRUD على مثيلات XoopsObject مع استمرارية قاعدة البيانات"
dir: rtl
lang: ar
---

تتوفر فئة `XoopsObjectHandler` وامتدادها `XoopsPersistableObjectHandler` واجهة موحدة لإجراء عمليات CRUD (إنشاء، قراءة، تحديث، حذف) على مثيلات `XoopsObject`. يطبق هذا نمط Data Mapper، الذي يفصل منطق المجال عن الوصول إلى قاعدة البيانات.

## نظرة عامة على الفئة

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

## التسلسل الهرمي للفئة

```
XoopsObjectHandler (قاعدة مجردة)
└── XoopsPersistableObjectHandler (تطبيق موسع)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [معالجات وحدات مخصصة]
```

## XoopsObjectHandler

### المُنشئ

```php
public function __construct(XoopsDatabase $db)
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$db` | XoopsDatabase | مثيل اتصال قاعدة البيانات |

**مثال:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### إنشاء

ينشئ مثيل كائن جديد.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$isNew` | bool | ما إذا كان الكائن جديداً (الافتراضي: صحيح) |

**العودة:** `XoopsObject|null` - مثيل الكائن الجديد

**مثال:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### الحصول

استرجاع كائن من خلال مفتاحه الأساسي.

```php
abstract public function get(int $id): ?XoopsObject
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$id` | int | قيمة المفتاح الأساسي |

**العودة:** `XoopsObject|null` - مثيل الكائن أو null إذا لم يتم العثور عليه

**مثال:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### إدراج

حفظ كائن في قاعدة البيانات (إدراج أو تحديث).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$obj` | XoopsObject | الكائن المراد حفظه |
| `$force` | bool | فرض العملية حتى لو كان الكائن دون تغيير |

**العودة:** `bool` - صحيح عند النجاح

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

### حذف

حذف كائن من قاعدة البيانات.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$obj` | XoopsObject | الكائن المراد حذفه |
| `$force` | bool | فرض الحذف |

**العودة:** `bool` - صحيح عند النجاح

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

يعمل `XoopsPersistableObjectHandler` على توسيع `XoopsObjectHandler` بطرق إضافية للاستعلام والعمليات الجماعية.

### المُنشئ

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$db` | XoopsDatabase | اتصال قاعدة البيانات |
| `$table` | string | اسم الجدول (بدون بادئة) |
| `$className` | string | اسم الفئة الكامل للكائن |
| `$keyName` | string | اسم حقل المفتاح الأساسي |
| `$identifierName` | string | حقل معرّف قابل للقراءة من قبل الإنسان |

**مثال:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // اسم الجدول
            'Article',               // اسم الفئة
            'article_id',            // المفتاح الأساسي
            'title'                  // حقل المعرّف
        );
    }
}
```

---

### getObjects

استرجاع كائنات متعددة تطابق المعايير.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معايير الاستعلام (اختياري) |
| `$idAsKey` | bool | استخدم المفتاح الأساسي كمفتاح مصفوفة |
| `$asObject` | bool | العودة بالكائنات (صحيح) أو المصفوفات (خطأ) |

**العودة:** `array` - مصفوفة من الكائنات أو المصفوفات الترابطية

**مثال:**
```php
$handler = xoops_getHandler('user');

// احصل على جميع المستخدمين النشطين
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// احصل على المستخدمين مع المعرف كمفتاح
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // الوصول من خلال المعرف

// احصل على المصفوفات بدلاً من الكائنات
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

حساب الكائنات التي تطابق المعايير.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معايير الاستعلام (اختياري) |

**العودة:** `int` - عدد الكائنات المطابقة

**مثال:**
```php
$handler = xoops_getHandler('user');

// حساب جميع المستخدمين
$totalUsers = $handler->getCount();

// حساب المستخدمين النشطين
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### getAll

استرجاع جميع الكائنات (بديل لـ getObjects بدون معايير).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معايير الاستعلام |
| `$fields` | array | حقول محددة للاسترجاع |
| `$asObject` | bool | العودة كائنات |
| `$idAsKey` | bool | استخدم المعرف كمفتاح مصفوفة |

**مثال:**
```php
$handler = xoops_getHandler('module');

// احصل على جميع الوحدات
$modules = $handler->getAll();

// احصل على حقول محددة فقط
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

استرجاع المفاتيح الأساسية فقط للكائنات المطابقة.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معايير الاستعلام |

**العودة:** `array` - مصفوفة من قيم المفتاح الأساسي

**مثال:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - مصفوفة من معرفات المستخدمين الإداريين
```

---

### getList

استرجاع قائمة مفتاح-قيمة للقوائم المنسدلة.

```php
public function getList(CriteriaElement $criteria = null): array
```

**العودة:** `array` - مصفوفة ترابطية [id => identifier]

**مثال:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// لقائمة منسدلة مختارة
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

حذف جميع الكائنات التي تطابق المعايير.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | معايير الكائنات المراد حذفها |
| `$force` | bool | فرض الحذف |
| `$asObject` | bool | تحميل الكائنات قبل الحذف (تشغيل الأحداث) |

**العودة:** `bool` - صحيح عند النجاح

**مثال:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// احذف جميع التعليقات لمقال محدد
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// حذف مع تحميل الكائنات (تشغيل أحداث الحذف)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

تحديث قيمة الحقل لجميع الكائنات المطابقة.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$fieldname` | string | الحقل المراد تحديثه |
| `$fieldvalue` | mixed | القيمة الجديدة |
| `$criteria` | CriteriaElement | معايير الكائنات المراد تحديثها |
| `$force` | bool | فرض التحديث |

**العودة:** `bool` - صحيح عند النجاح

**مثال:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// وضع علامة على جميع مقالات المؤلف كمسودة
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// تحديث عدد المشاهدات
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### إدراج (موسع)

طريقة الإدراج الموسعة مع وظائف إضافية.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**السلوك:**
- إذا كان الكائن جديداً (`isNew() === true`): إدراج
- إذا كان الكائن موجوداً (`isNew() === false`): تحديث
- استدعاء `cleanVars()` تلقائياً
- تعيين معرف الزيادة التلقائية على الكائنات الجديدة

**مثال:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// إنشاء مقال جديد
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// تحديث مقال موجود
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## دوال مساعدة

### xoops_getHandler

دالة عامة لاسترجاع معالج أساسي.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$name` | string | اسم المعالج (user, module, group, إلخ.) |
| `$optional` | bool | إرجاع null بدلاً من تشغيل خطأ |

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

استرجاع معالج خاص بالوحدة.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**المعاملات:**

| المعامل | النوع | الوصف |
|-----------|------|-------------|
| `$name` | string | اسم المعالج |
| `$dirname` | string | اسم دليل الوحدة |
| `$optional` | bool | إرجاع null عند الفشل |

**مثال:**
```php
// احصل على معالج من الوحدة الحالية
$articleHandler = xoops_getModuleHandler('article');

// احصل على معالج من وحدة محددة
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## إنشاء معالجات مخصصة

### تطبيق معالج أساسي

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * معالج لكائنات المقال
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * المُنشئ
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
     * احصل على المقالات المنشورة
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
     * احصل على مقالات حسب المؤلف
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
     * احصل على مقالات حسب الفئة
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
     * ابحث عن مقالات
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
     * احصل على المقالات الشهيرة حسب عدد المشاهدات
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
     * زيادة عدد المشاهدات
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
     * تجاوز الإدراج للسلوك المخصص
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // تعيين طابع زمني محدث
        $obj->setVar('updated', time());

        // إذا كان جديداً، عيّن طابع زمني مُنشأ
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * تجاوز الحذف لعمليات الحذف على مستوى الكائن
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // احذف التعليقات المرتبطة
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### استخدام المعالج المخصص

```php
// احصل على المعالج
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// أنشئ مقالة جديدة
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

// احصل على المقالات المنشورة
$articles = $articleHandler->getPublished(10);

// ابحث عن المقالات
$results = $articleHandler->search('xoops');

// احصل على المقالات الشهيرة
$popular = $articleHandler->getPopular(5);

// حدّث عدد المشاهدات
$articleHandler->incrementViews($articleId);
```

## أفضل الممارسات

1. **استخدم Criteria للاستعلامات**: استخدم دائماً كائنات Criteria للاستعلامات الآمنة من حيث النوع

2. **توسيع للطرق المخصصة**: أضف طرق استعلام خاصة بالمجال إلى المعالجات

3. **تجاوز الإدراج/الحذف**: أضف عمليات حذف على مستوى الكائن والطوابع الزمنية في التجاوزات

4. **استخدم المعاملات عند الحاجة**: تفاف العمليات المعقدة بمعاملات

5. **استفد من getList**: استخدم `getList()` لتحديد القوائم المنسدلة لتقليل الاستعلامات

6. **فهرس المفاتيح**: تأكد من فهرسة حقول قاعدة البيانات المستخدمة في المعايير

7. **حدّد النتائج**: استخدم دائماً `setLimit()` لمجموعات النتائج المحتملة الكبيرة

## الوثائق ذات الصلة

- XoopsObject - فئة الكائن الأساسية
- ../Database/Criteria - بناء معايير الاستعلام
- ../Database/XoopsDatabase - عمليات قاعدة البيانات

---

*انظر أيضاً: [كود مصدر XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
