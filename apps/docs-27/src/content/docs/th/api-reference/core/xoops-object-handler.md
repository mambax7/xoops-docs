---
title: "คลาส XoopsObjectHandler"
description: "คลาสตัวจัดการฐานสำหรับการดำเนินการ CRUD บนอินสแตนซ์ XoopsObject ที่มีความคงอยู่ของฐานข้อมูล"
---
คลาส `XoopsObjectHandler` คลาสและส่วนขยาย `XoopsPersistableObjectHandler`¤ จัดเตรียมอินเทอร์เฟซมาตรฐานสำหรับการดำเนินการ CRUD (สร้าง อ่าน อัปเดต ลบ) บน `XoopsObject` อินสแตนซ์ สิ่งนี้ใช้รูปแบบ Data Mapper โดยแยกตรรกะโดเมนออกจากการเข้าถึงฐานข้อมูล

## ภาพรวมชั้นเรียน
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
## ลำดับชั้นของชั้นเรียน
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

### ตัวสร้าง
```php
public function __construct(XoopsDatabase $db)
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$db` | Xoopsฐานข้อมูล | อินสแตนซ์การเชื่อมต่อฐานข้อมูล |

**ตัวอย่าง:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### สร้าง

สร้างอินสแตนซ์วัตถุใหม่
```php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$isNew` | บูล | ไม่ว่าจะเป็นวัตถุใหม่ (ค่าเริ่มต้น: จริง) |

**ผลตอบแทน:** `XoopsObject|null` - อินสแตนซ์ออบเจ็กต์ใหม่

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### รับ

ดึงวัตถุโดยใช้คีย์หลัก
```php
abstract public function get(int $id): ?XoopsObject
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$id` | อินท์ | ค่าคีย์หลัก |

**ผลตอบแทน:** `XoopsObject|null` - อินสแตนซ์ของวัตถุหรือค่าว่างหากไม่พบ

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### ใส่

บันทึกวัตถุลงในฐานข้อมูล (แทรกหรืออัปเดต)
```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$obj` | XoopsObject | วัตถุที่จะบันทึก |
| `$force` | บูล | บังคับดำเนินการแม้ว่าวัตถุจะไม่เปลี่ยนแปลง |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
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

### ลบ

ลบวัตถุออกจากฐานข้อมูล
```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$obj` | XoopsObject | วัตถุที่จะลบ |
| `$force` | บูล | บังคับให้ลบ |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler` ขยาย `XoopsObjectHandler` ด้วยวิธีการเพิ่มเติมสำหรับการสืบค้นและการดำเนินการจำนวนมาก

### ตัวสร้าง
```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$db` | Xoopsฐานข้อมูล | การเชื่อมต่อฐานข้อมูล |
| `$table` | สตริง | ชื่อตาราง (ไม่มีคำนำหน้า) |
| `$className` | สตริง | ชื่อคลาสเต็มของอ็อบเจ็กต์ |
| `$keyName` | สตริง | ชื่อฟิลด์คีย์หลัก |
| `$identifierName` | สตริง | ฟิลด์ตัวระบุที่มนุษย์สามารถอ่านได้ |

**ตัวอย่าง:**
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

### รับวัตถุ

ดึงข้อมูลเกณฑ์ที่ตรงกับวัตถุหลายรายการ
```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์การค้นหา (ไม่บังคับ) |
| `$idAsKey` | บูล | ใช้คีย์หลักเป็นคีย์อาร์เรย์ |
| `$asObject` | บูล | ส่งกลับวัตถุ (จริง) หรืออาร์เรย์ (เท็จ) |

**ผลตอบแทน:** `array` - อาร์เรย์ของวัตถุหรืออาร์เรย์ที่เชื่อมโยง

**ตัวอย่าง:**
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

###getCount

นับวัตถุที่ตรงกับเกณฑ์
```php
public function getCount(CriteriaElement $criteria = null): int
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์การค้นหา (ไม่บังคับ) |

**ผลตอบแทน:** `int` - จำนวนวัตถุที่ตรงกัน

**ตัวอย่าง:**
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

### รับทั้งหมด

ดึงข้อมูลอ็อบเจ็กต์ทั้งหมด (นามแฝงสำหรับ getObjects ที่ไม่มีเกณฑ์)
```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์การค้นหา |
| `$fields` | อาร์เรย์ | ฟิลด์เฉพาะที่จะดึงข้อมูล |
| `$asObject` | บูล | กลับเป็นวัตถุ |
| `$idAsKey` | บูล | ใช้ ID เป็นคีย์อาร์เรย์ |

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### รับรหัส

ดึงข้อมูลเฉพาะคีย์หลักของออบเจ็กต์ที่ตรงกัน
```php
public function getIds(CriteriaElement $criteria = null): array
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์การค้นหา |

**ผลตอบแทน:** `array` - อาร์เรย์ของค่าคีย์หลัก

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### รับรายการ

ดึงรายการคีย์-ค่าสำหรับดรอปดาวน์
```php
public function getList(CriteriaElement $criteria = null): array
```
**ผลตอบแทน:** `array` - Associative array [id => identifier]

**ตัวอย่าง:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### ลบทั้งหมด

ลบออบเจ็กต์ทั้งหมดที่ตรงกับเกณฑ์
```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์สำหรับออบเจ็กต์ที่จะลบ |
| `$force` | บูล | บังคับให้ลบ |
| `$asObject` | บูล | โหลดวัตถุก่อนที่จะลบ (ทริกเกอร์เหตุการณ์) |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### อัปเดตทั้งหมด

อัพเดตค่าฟิลด์สำหรับออบเจ็กต์ที่ตรงกันทั้งหมด
```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$fieldname` | สตริง | ช่องที่จะอัปเดต |
| `$fieldvalue` | ผสม | ค่าใหม่ |
| `$criteria` | องค์ประกอบเกณฑ์ | เกณฑ์สำหรับออบเจ็กต์ที่จะอัปเดต |
| `$force` | บูล | บังคับอัปเดต |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
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

### แทรก (ขยาย)

วิธีการแทรกแบบขยายพร้อมฟังก์ชันเพิ่มเติม
```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**พฤติกรรม:**
- หากวัตถุเป็นของใหม่ (`isNew() === true`): INSERT
- หากมีวัตถุอยู่ (`isNew() === false`): UPDATE
- โทร `cleanVars()` โดยอัตโนมัติ
- ตั้งค่าการเพิ่มอัตโนมัติ ID บนวัตถุใหม่

**ตัวอย่าง:**
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

## ฟังก์ชั่นตัวช่วย

### xoops_getHandler

ฟังก์ชันโกลบอลเพื่อดึงข้อมูลตัวจัดการหลัก
```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$name` | สตริง | ชื่อตัวจัดการ (ผู้ใช้ โมดูล กลุ่ม ฯลฯ) |
| `$optional` | บูล | คืนค่า null แทนที่จะทำให้เกิดข้อผิดพลาด |

**ตัวอย่าง:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandler

ดึงข้อมูลตัวจัดการเฉพาะโมดูล
```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$name` | สตริง | ชื่อผู้ดำเนินการ |
| `$dirname` | สตริง | ชื่อไดเร็กทอรีโมดูล |
| `$optional` | บูล | ส่งกลับค่าว่างเมื่อล้มเหลว |

**ตัวอย่าง:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## การสร้างตัวจัดการแบบกำหนดเอง

### การใช้งานตัวจัดการขั้นพื้นฐาน
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
### การใช้ตัวจัดการแบบกำหนดเอง
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **ใช้เกณฑ์สำหรับการสืบค้น**: ใช้ออบเจ็กต์เกณฑ์สำหรับการสืบค้นแบบปลอดภัยเสมอ

2. **ขยายสำหรับวิธีการแบบกำหนดเอง**: เพิ่มวิธีการสืบค้นเฉพาะโดเมนให้กับตัวจัดการ

3. **แทนที่การแทรก/ลบ**: เพิ่มการดำเนินการแบบเรียงซ้อนและการประทับเวลาในการแทนที่

4. **ใช้ธุรกรรมเมื่อจำเป็น**: รวมการดำเนินการที่ซับซ้อนไว้ในธุรกรรม

5. **ใช้ประโยชน์จาก getList**: ใช้ `getList()`¤ สำหรับเมนูแบบเลื่อนลงที่เลือกเพื่อลดการสืบค้น

6. **คีย์ดัชนี**: ตรวจสอบให้แน่ใจว่าฟิลด์ฐานข้อมูลที่ใช้ในเกณฑ์ได้รับการจัดทำดัชนีแล้ว

7. **จำกัดผลลัพธ์**: ใช้ `setLimit()` เสมอสำหรับชุดผลลัพธ์ที่อาจมีขนาดใหญ่

## เอกสารที่เกี่ยวข้อง

- XoopsObject - คลาสอ็อบเจ็กต์ฐาน
- ../ฐานข้อมูล/เกณฑ์ - สร้างเกณฑ์การสืบค้น
- ../Database/XoopsDatabase - การทำงานของฐานข้อมูล

---

*ดูเพิ่มเติมที่: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*