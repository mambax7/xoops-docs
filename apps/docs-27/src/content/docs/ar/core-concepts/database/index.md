---
title: "طبقة قاعدة البيانات"
description: "دليل شامل لتجريد قاعدة بيانات XOOPS وXoopsObject والمعالجات ونظام Criteria"
dir: rtl
lang: ar
---

# 🗄️ طبقة قاعدة البيانات

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> فهم تجريد قاعدة بيانات XOOPS واستمرارية الكائنات وبناء الاستعلامات.

:::tip[جعل وصول البيانات الخاص بك مقاوماً للمستقبل]
يعمل نمط المعالج/Criteria في كلا الإصدارين. للتحضير لـ XOOPS 4.0، يجب عليك التفكير في لف المعالجات في [فئات Repository](../../03-Module-Development/Patterns/Repository-Pattern.md) لتحسين القابلية للاختبار. انظر [اختيار نمط الوصول إلى البيانات](../../03-Module-Development/Choosing-Data-Access-Pattern.md).
:::

---

## نظرة عامة

تقدم طبقة قاعدة بيانات XOOPS تجريداً قوياً على MySQL/MariaDB، مع الميزات التالية:

- **نمط Factory** - إدارة اتصالات قاعدة البيانات المركزية
- **تعيين العلاقات بين الكائنات والبيانات** - XoopsObject والمعالجات
- **بناء الاستعلامات** - نظام Criteria للاستعلامات المعقدة
- **إعادة استخدام الاتصالات** - اتصال واحد عبر مصنع النمط الفردي (بدون تجميع)

---

## 🏗️ الهندسة المعمارية

```mermaid
flowchart TB
    subgraph App["📱 كود التطبيق"]
        AppCode["كود المودول الخاص بك"]
    end

    subgraph Handler["🔧 XoopsPersistableObjectHandler"]
        HandlerMethods["create() | get() | insert() | delete()<br/>getObjects() | getCount() | deleteAll()"]
    end

    subgraph Object["📦 XoopsObject"]
        ObjectMethods["initVar() | getVar() | setVar() | toArray()"]
    end

    subgraph Criteria["🔍 نظام Criteria"]
        CriteriaMethods["Criteria | CriteriaCompo | CriteriaElement"]
    end

    subgraph Database["🗄️ XoopsDatabase"]
        DatabaseMethods["query() | queryF() | fetchArray() | insert()"]
    end

    subgraph Storage["💾 MySQL / MariaDB"]
        DB[(قاعدة البيانات)]
    end

    App --> Handler
    Handler --> Object
    Object --> Criteria
    Criteria --> Database
    Database --> Storage

    style App fill:#e3f2fd,stroke:#1976d2
    style Handler fill:#e8f5e9,stroke:#388e3c
    style Object fill:#fff3e0,stroke:#f57c00
    style Criteria fill:#f3e5f5,stroke:#7b1fa2
    style Database fill:#fce4ec,stroke:#c2185b
    style Storage fill:#eceff1,stroke:#546e7a
```

---

## 🔌 اتصال قاعدة البيانات

### الحصول على الاتصال

```php
// Recommended: Use the global database instance
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: Global variable (still works)
global $xoopsDB;
```

### XoopsDatabaseFactory

يضمن نمط Factory إعادة استخدام اتصال قاعدة البيانات الفردي:

```php
<?php

class XoopsDatabaseFactory
{
    private static ?XoopsDatabase $instance = null;

    public static function getDatabaseConnection(): XoopsDatabase
    {
        if (self::$instance === null) {
            self::$instance = new XoopsMySQLDatabase();
        }
        return self::$instance;
    }
}
```

---

## 📦 XoopsObject

الفئة الأساسية لجميع كائنات البيانات في XOOPS.

### تحديد كائن

```php
<?php

namespace XoopsModules\MyModule;

class Article extends \XoopsObject
{
    public function __construct()
    {
        $this->initVar('article_id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('category_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('author_id', \XOBJ_DTYPE_INT, 0, true);
        $this->initVar('status', \XOBJ_DTYPE_TXTBOX, 'draft', true, 20);
        $this->initVar('views', \XOBJ_DTYPE_INT, 0, false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', \XOBJ_DTYPE_INT, 0, false);
    }
}
```

### أنواع البيانات

| الثابت | النوع | الوصف |
|----------|------|-------------|
| `XOBJ_DTYPE_INT` | رقم | القيم الرقمية |
| `XOBJ_DTYPE_TXTBOX` | سلسلة | نص قصير (< 255 حرف) |
| `XOBJ_DTYPE_TXTAREA` | نص | محتوى نص طويل |
| `XOBJ_DTYPE_EMAIL` | بريد إلكتروني | عناوين البريد الإلكتروني |
| `XOBJ_DTYPE_URL` | رابط | عناوين الويب |
| `XOBJ_DTYPE_FLOAT` | عدد عشري | الأرقام العشرية |
| `XOBJ_DTYPE_ARRAY` | مصفوفة | المصفوفات المسلسلة |
| `XOBJ_DTYPE_OTHER` | مختلط | البيانات الخام |

### العمل مع الكائنات

```php
// Create new object
$article = new Article();

// Set values
$article->setVar('title', 'My Article');
$article->setVar('content', 'Article content here...');
$article->setVar('category_id', 5);
$article->setVar('author_id', $xoopsUser->getVar('uid'));

// Get values
$title = $article->getVar('title');           // Raw value
$titleDisplay = $article->getVar('title', 'e'); // For editing (HTML entities)
$titleShow = $article->getVar('title', 's');    // For display (sanitized)

// Bulk assign from array
$article->assignVars([
    'title' => 'New Title',
    'status' => 'published'
]);

// Convert to array
$data = $article->toArray();
```

---

## 🔧 معالجات الكائنات

### XoopsPersistableObjectHandler

تدير فئة المعالج عمليات CRUD لنسخ XoopsObject.

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',  // Table name
            Article::class,       // Object class
            'article_id',         // Primary key
            'title'               // Identifier field
        );
    }
}
```

### طرق المعالج

```php
// Get handler instance
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create new object
$article = $articleHandler->create();

// Get by ID
$article = $articleHandler->get(123);

// Insert (create or update)
$success = $articleHandler->insert($article);

// Delete
$success = $articleHandler->delete($article);

// Get multiple objects
$articles = $articleHandler->getObjects($criteria);

// Get count
$count = $articleHandler->getCount($criteria);

// Get as array (key => value)
$list = $articleHandler->getList($criteria);

// Delete multiple
$deleted = $articleHandler->deleteAll($criteria);
```

### طرق معالج مخصصة

```php
<?php

namespace XoopsModules\MyModule;

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    // ... constructor

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('category_id', $categoryId));
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId): array
    {
        $criteria = new \Criteria('author_id', $authorId);
        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            'UPDATE %s SET views = views + 1 WHERE article_id = %d',
            $this->table,
            $articleId
        );
        return $this->db->queryF($sql) !== false;
    }

    /**
     * Get popular articles
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```

---

## 🔍 نظام Criteria

يوفر نظام Criteria طريقة قوية وموجهة نحو الكائنات لبناء شروط WHERE في SQL.

### معايير أساسية

```php
// Simple equality
$criteria = new \Criteria('status', 'published');

// With operator
$criteria = new \Criteria('views', 100, '>=');

// Column comparison
$criteria = new \Criteria('updated', 'created', '>');
```

### CriteriaCompo (الجمع بين المعايير)

```php
$criteria = new \CriteriaCompo();

// AND conditions (default)
$criteria->add(new \Criteria('status', 'published'));
$criteria->add(new \Criteria('category_id', 5));

// OR conditions
$criteria->add(new \Criteria('featured', 1), 'OR');

// Nested conditions
$subCriteria = new \CriteriaCompo();
$subCriteria->add(new \Criteria('author_id', 1));
$subCriteria->add(new \Criteria('author_id', 2), 'OR');
$criteria->add($subCriteria);
```

### الفرز والترقيم

```php
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', 'published'));

// Sorting
$criteria->setSort('created');
$criteria->setOrder('DESC');

// Multiple sort fields
$criteria->setSort('category_id, created');
$criteria->setOrder('ASC, DESC');

// Pagination
$criteria->setLimit(10);    // Items per page
$criteria->setStart(20);    // Offset

// Group by
$criteria->setGroupby('category_id');
```

### المعاملات

| المعامل | مثال | مخرجات SQL |
|----------|---------|------------|
| `=` | `new Criteria('status', 'published')` | `status = 'published'` |
| `!=` | `new Criteria('status', 'draft', '!=')` | `status != 'draft'` |
| `>` | `new Criteria('views', 100, '>')` | `views > 100` |
| `>=` | `new Criteria('views', 100, '>=')` | `views >= 100` |
| `<` | `new Criteria('views', 100, '<')` | `views < 100` |
| `<=` | `new Criteria('views', 100, '<=')` | `views <= 100` |
| `LIKE` | `new Criteria('title', '%php%', 'LIKE')` | `title LIKE '%php%'` |
| `NOT LIKE` | `new Criteria('title', '%test%', 'NOT LIKE')` | `title NOT LIKE '%test%'` |
| `IN` | `new Criteria('id', '(1,2,3)', 'IN')` | `id IN (1,2,3)` |
| `NOT IN` | `new Criteria('id', '(1,2,3)', 'NOT IN')` | `id NOT IN (1,2,3)` |

### مثال معقد

```php
// Find published articles in specific categories,
// with search term in title, sorted by views
$criteria = new \CriteriaCompo();

// Status must be published
$criteria->add(new \Criteria('status', 'published'));

// In categories 1, 2, or 3
$criteria->add(new \Criteria('category_id', '(1, 2, 3)', 'IN'));

// Title contains search term
$searchTerm = '%' . $db->escape($searchQuery) . '%';
$criteria->add(new \Criteria('title', $searchTerm, 'LIKE'));

// Created in last 30 days
$thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
$criteria->add(new \Criteria('created', $thirtyDaysAgo, '>='));

// Sort by views descending
$criteria->setSort('views');
$criteria->setOrder('DESC');

// Paginate
$criteria->setLimit(10);
$criteria->setStart($page * 10);

$articles = $articleHandler->getObjects($criteria);
$totalCount = $articleHandler->getCount($criteria);
```

---

## 📝 الاستعلامات المباشرة

للاستعلامات المعقدة التي لا يمكن إجراؤها باستخدام Criteria، استخدم SQL مباشر.

### استعلامات آمنة (القراءة)

```php
$db = \XoopsDatabaseFactory::getDatabaseConnection();

$sql = sprintf(
    'SELECT a.*, c.category_name
     FROM %s a
     LEFT JOIN %s c ON a.category_id = c.category_id
     WHERE a.status = %s
     ORDER BY a.created DESC
     LIMIT %d',
    $db->prefix('mymodule_articles'),
    $db->prefix('mymodule_categories'),
    $db->quoteString('published'),
    10
);

$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    // Process row
    echo $row['title'];
}
```

### استعلامات الكتابة

```php
// Insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_articles'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);
$newId = $db->getInsertId();

// Update
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
$affectedRows = $db->getAffectedRows();

// Delete
$sql = sprintf(
    "DELETE FROM %s WHERE article_id = %d",
    $db->prefix('mymodule_articles'),
    $articleId
);
$db->queryF($sql);
```

### الهروب من القيم

```php
// String escaping
$safeString = $db->quoteString($userInput);
// or
$safeString = $db->escape($userInput);

// Integer (no escaping needed, just cast)
$safeInt = (int) $userInput;
```

---

## ⚠️ أفضل ممارسات الأمان

### قم بالهروب دائماً من مدخلات المستخدم

```php
// NEVER do this
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// DO this
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Or better, use Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```

### استخدام الاستعلامات المعاملة (XMF)

```php
use Xmf\Database\TableLoad;

// Safe bulk insert
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```

### التحقق من أنواع المدخلات

```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```

---

## 📊 مثال على مخطط قاعدة البيانات

```sql
-- sql/mysql.sql

CREATE TABLE `{PREFIX}_mymodule_articles` (
    `article_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `content` TEXT,
    `author_id` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
    `views` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `created` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    `updated` INT(11) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`article_id`),
    KEY `category_id` (`category_id`),
    KEY `author_id` (`author_id`),
    KEY `status` (`status`),
    KEY `created` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔗 الوثائق ذات الصلة

- [Criteria System Deep Dive](../../04-API-Reference/Kernel/Criteria.md)
- [Design Patterns - Factory](../Architecture/Design-Patterns.md)
- [SQL Injection Prevention](../Security/SQL-Injection-Prevention.md)
- [XoopsDatabase API Reference](../../04-API-Reference/Database/XoopsDatabase.md)

---

#xoops #database #orm #criteria #handlers #mysql
