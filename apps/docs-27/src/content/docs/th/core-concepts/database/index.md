---
title: "ชั้นฐานข้อมูล"
description: "คู่มือที่ครอบคลุมเกี่ยวกับ XOOPS นามธรรมฐานข้อมูล, XoopsObject, ตัวจัดการ และระบบเกณฑ์"
---
# 🗄️ เลเยอร์ฐานข้อมูล

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> ทำความเข้าใจ XOOPS บทคัดย่อของฐานข้อมูล การคงอยู่ของวัตถุ และการสร้างคิวรี

:::tip[พิสูจน์การเข้าถึงข้อมูลของคุณในอนาคต]
รูปแบบตัวจัดการ/เกณฑ์ทำงานได้ทั้งสองเวอร์ชัน หากต้องการเตรียมพร้อมสำหรับ XOOPS 4.0 ให้พิจารณาการรวมตัวจัดการใน [คลาสพื้นที่เก็บข้อมูล](../../03-Module-Development/Patterns/Repository-Pattern.md) เพื่อให้สามารถทดสอบได้ดีขึ้น ดู [การเลือกรูปแบบการเข้าถึงข้อมูล](../../03-Module-Development/Choosing-Data-Access-Pattern.md)
::::::

---

## ภาพรวม

เลเยอร์ฐานข้อมูล XOOPS มอบนามธรรมที่แข็งแกร่งบน MySQL/MariaDB โดยมี:

- **รูปแบบโรงงาน** - การจัดการการเชื่อมต่อฐานข้อมูลแบบรวมศูนย์
- **การแมปวัตถุ-เชิงสัมพันธ์** - XoopsObject และตัวจัดการ
- **การสร้างแบบสอบถาม** - ระบบเกณฑ์สำหรับการสืบค้นที่ซับซ้อน
- **การใช้การเชื่อมต่อซ้ำ** - การเชื่อมต่อเดี่ยวผ่านโรงงานซิงเกิลตัน (ไม่รวมกลุ่ม)

---

## 🏗️ สถาปัตยกรรม
```
mermaid
flowchart TB
    subgraph App["📱 Application Code"]
        AppCode["Your Module Code"]
    end

    subgraph Handler["🔧 XoopsPersistableObjectHandler"]
        HandlerMethods["create() | get() | insert() | delete()<br/>getObjects() | getCount() | deleteAll()"]
    end

    subgraph Object["📦 XoopsObject"]
        ObjectMethods["initVar() | getVar() | setVar() | toArray()"]
    end

    subgraph Criteria["🔍 Criteria System"]
        CriteriaMethods["Criteria | CriteriaCompo | CriteriaElement"]
    end

    subgraph Database["🗄️ XoopsDatabase"]
        DatabaseMethods["query() | queryF() | fetchArray() | insert()"]
    end

    subgraph Storage["💾 MySQL / MariaDB"]
        DB[(Database)]
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

## 🔌 การเชื่อมต่อฐานข้อมูล

### การรับการเชื่อมต่อ
```php
// Recommended: Use the global database instance
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Legacy: Global variable (still works)
global $xoopsDB;
```
### XoopsDatabaseFactory

รูปแบบโรงงานทำให้มั่นใจได้ว่าการเชื่อมต่อฐานข้อมูลเดียวจะถูกนำมาใช้ซ้ำ:
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

คลาสพื้นฐานสำหรับวัตถุข้อมูลทั้งหมดใน XOOPS

### การกำหนดวัตถุ
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
### ประเภทข้อมูล

| ค่าคงที่ | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `XOBJ_DTYPE_INT` | จำนวนเต็ม | ค่าตัวเลข |
| `XOBJ_DTYPE_TXTBOX` | สตริง | ข้อความสั้น (< 255 ตัวอักษร) |
| `XOBJ_DTYPE_TXTAREA` | ข้อความ | เนื้อหาข้อความยาว |
| `XOBJ_DTYPE_EMAIL` | อีเมล์ | ที่อยู่อีเมล |
| `XOBJ_DTYPE_URL` | URL | ที่อยู่เว็บ |
| `XOBJ_DTYPE_FLOAT` | ลอย | ตัวเลขทศนิยม |
| `XOBJ_DTYPE_ARRAY` | อาร์เรย์ | อาร์เรย์แบบอนุกรม |
| `XOBJ_DTYPE_OTHER` | ผสม | ข้อมูลดิบ |

### การทำงานกับวัตถุ
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

## 🌠 ตัวจัดการวัตถุ

### XoopsPersistableObjectHandler

คลาสตัวจัดการจัดการการดำเนินงาน CRUD สำหรับอินสแตนซ์ XoopsObject
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
### วิธีการจัดการ
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
### วิธีการจัดการแบบกำหนดเอง
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

## 🔍 ระบบเกณฑ์

ระบบเกณฑ์ให้วิธีการที่มีประสิทธิภาพและมุ่งเน้นวัตถุในการสร้างคำสั่งย่อย SQL WHERE

### เกณฑ์พื้นฐาน
```php
// Simple equality
$criteria = new \Criteria('status', 'published');

// With operator
$criteria = new \Criteria('views', 100, '>=');

// Column comparison
$criteria = new \Criteria('updated', 'created', '>');
```
### CriteriaCompo (การรวมเกณฑ์)
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
### การเรียงลำดับและการแบ่งหน้า
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
### ผู้ประกอบการ

| ตัวดำเนินการ | ตัวอย่าง | SQL เอาต์พุต |
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

### ตัวอย่างที่ซับซ้อน
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

## 📝 สอบถามโดยตรง

สำหรับการสืบค้นที่ซับซ้อนซึ่งใช้เกณฑ์ไม่ได้ ให้ใช้โดยตรง SQL

### ข้อความค้นหาที่ปลอดภัย (อ่าน)
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
### เขียนแบบสอบถาม
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
### การหลบหนีค่า
```php
// String escaping
$safeString = $db->quoteString($userInput);
// or
$safeString = $db->escape($userInput);

// Integer (no escaping needed, just cast)
$safeInt = (int) $userInput;
```
---

## ⚠️ แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย

### หลีกเลี่ยงอินพุตของผู้ใช้เสมอ
```php
// NEVER do this
$sql = "SELECT * FROM articles WHERE title = '$_GET[title]'"; // SQL Injection!

// DO this
$title = $db->escape($_GET['title']);
$sql = "SELECT * FROM articles WHERE title = '$title'";

// Or better, use Criteria
$criteria = new \Criteria('title', $db->escape($_GET['title']));
```
### ใช้แบบสอบถามแบบกำหนดพารามิเตอร์ (XMF)
```php
use Xmf\Database\TableLoad;

// Safe bulk insert
$tableLoad = new TableLoad('mymodule_articles');
$tableLoad->insert([
    ['title' => 'Article 1', 'content' => 'Content 1'],
    ['title' => 'Article 2', 'content' => 'Content 2'],
]);
```
### ตรวจสอบประเภทอินพุต
```php
use Xmf\Request;

$id = Request::getInt('id', 0, 'GET');
$title = Request::getString('title', '', 'POST');
```
---

## 📊 ตัวอย่างสคีมาฐานข้อมูล
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

## 🔗 เอกสารที่เกี่ยวข้อง

- [เจาะลึกระบบเกณฑ์](../../04-API-Reference/Kernel/Criteria.md)
- [รูปแบบการออกแบบ - โรงงาน](../Architecture/Design-Patterns.md)
- [SQL การป้องกันการฉีด](../Security/SQL-Injection-Prevention.md)
- [XoopsDatabase API อ้างอิง](../../04-API-Reference/Database/XoopsDatabase.md)

---

#xoops #ฐานข้อมูล #orm #เกณฑ์ #ตัวจัดการ #mysql