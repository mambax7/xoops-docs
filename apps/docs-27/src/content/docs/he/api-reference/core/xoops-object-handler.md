---
title: "XoopsObjectHandler שיעור"
description: "מחלקת מטפל בסיס עבור פעולות CRUD במופעי XoopsObject עם התמדה של מסד נתונים"
---
המחלקה `XoopsObjectHandler` והרחבה שלה `XoopsPersistableObjectHandler` מספקות ממשק סטנדרטי לביצוע פעולות CRUD (יצירה, קריאה, עדכון, מחק) במופעים של `XoopsObject`. זה מיישם את דפוס Data Mapper, המפריד בין לוגיקה של תחום לגישה למסד נתונים.

## סקירת כיתה
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
## היררכיית מעמדות
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

### קונסטרוקטור
```php
public function __construct(XoopsDatabase $db)
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$db` | XoopsDatabase | מופע חיבור למסד נתונים |

**דוּגמָה:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```
---

### ליצור

יוצר מופע אובייקט חדש.
```php
abstract public function create(bool $isNew = true): ?XoopsObject
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$isNew` | bool | האם האובייקט חדש (ברירת מחדל: true) |

**מחזירות:** `XoopsObject|null` - מופע אובייקט חדש

**דוגמה:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```
---

### לקבל

מאחזר אובייקט לפי המפתח הראשי שלו.
```php
abstract public function get(int $id): ?XoopsObject
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$id` | int | ערך מפתח ראשי |

**מחזירות:** `XoopsObject|null` - מופע אובייקט או null אם לא נמצא

**דוגמה:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```
---

### הוסף

שומר אובייקט במסד הנתונים (הוספה או עדכון).
```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$obj` | XoopsObject | חפץ לשמירה |
| `$force` | bool | כוח פעולה גם אם האובייקט לא השתנה |

**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
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

### למחוק

מוחק אובייקט ממסד הנתונים.
```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$obj` | XoopsObject | אובייקט למחיקה |
| `$force` | bool | כפיית מחיקה |

**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```
---

## XoopsPersistableObjectHandler

ה-`XoopsPersistableObjectHandler` מרחיב את `XoopsObjectHandler` עם שיטות נוספות לשאילתות ופעולות בכמות גדולה.

### קונסטרוקטור
```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$db` | XoopsDatabase | חיבור למסד נתונים |
| `$table` | מחרוזת | שם טבלה (ללא קידומת) |
| `$className` | מחרוזת | שם המחלקה המלא של האובייקט |
| `$keyName` | מחרוזת | שם שדה מפתח ראשי |
| `$identifierName` | מחרוזת | שדה מזהה קריא לאדם |

**דוּגמָה:**
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

מאחזר מספר אובייקטים התואמים קריטריונים.
```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$criteria` | CriteriaElement | קריטריוני שאילתה (אופציונלי) |
| `$idAsKey` | bool | השתמש במפתח ראשי כמפתח מערך |
| `$asObject` | bool | החזר אובייקטים (true) או מערכים (false) |

**החזרות:** `array` - מערך אובייקטים או מערכים אסוציאטיביים

**דוגמה:**
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

סופר אובייקטים התואמים קריטריונים.
```php
public function getCount(CriteriaElement $criteria = null): int
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$criteria` | CriteriaElement | קריטריוני שאילתה (אופציונלי) |

**החזרות:** `int` - ספירת אובייקטים תואמים

**דוגמה:**
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

### קבל הכל

מאחזר את כל האובייקטים (כינוי עבור getObjects ללא קריטריונים).
```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$criteria` | CriteriaElement | קריטריוני שאילתה |
| `$fields` | מערך | שדות ספציפיים לאחזור |
| `$asObject` | bool | החזר כאובייקטים |
| `$idAsKey` | bool | השתמש במזהה כמפתח מערך |

**דוּגמָה:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```
---

### getIds

מאחזר רק את המפתחות הראשיים של אובייקטים תואמים.
```php
public function getIds(CriteriaElement $criteria = null): array
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$criteria` | CriteriaElement | קריטריוני שאילתה |

**החזרות:** `array` - מערך של ערכי מפתח ראשי

**דוגמה:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```
---

### getList

מאחזר רשימת מפתח-ערך עבור תפריטים נפתחים.
```php
public function getList(CriteriaElement $criteria = null): array
```
**החזרות:** `array` - מערך אסוציאטיבי [מזהה => מזהה]

**דוגמה:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```
---

### מחק הכל

מוחק את כל האובייקטים התואמים את הקריטריונים.
```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$criteria` | CriteriaElement | קריטריונים לאובייקטים למחיקה |
| `$force` | bool | כפיית מחיקה |
| `$asObject` | bool | טען אובייקטים לפני מחיקה (מפעיל אירועים) |

**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```
---

### עדכן הכל

מעדכן ערך שדה עבור כל האובייקטים התואמים.
```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$fieldname` | מחרוזת | שדה לעדכון |
| `$fieldvalue` | מעורב | ערך חדש |
| `$criteria` | CriteriaElement | קריטריונים לאובייקטים לעדכון |
| `$force` | bool | כפה עדכון |

**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
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

### הוספה (מורחב)

שיטת ההוספה המורחבת עם פונקציונליות נוספת.
```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```
**התנהגות:**
- אם האובייקט חדש (`isNew() === true`): INSERT
- אם קיים אובייקט (`isNew() === false`): UPDATE
- מתקשר `cleanVars()` באופן אוטומטי
- מגדיר מזהה הגדלה אוטומטית על אובייקטים חדשים

**דוגמה:**
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

## פונקציות עוזר

### xoops_getHandler

פונקציה גלובלית לאחזור מטפל ליבה.
```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$name` | מחרוזת | שם המטפל (משתמש, מודול, קבוצה וכו') |
| `$optional` | bool | החזר null במקום הפעלת שגיאה |

**דוּגמָה:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```
---

### xoops_getModuleHandler

מאחזר מטפל ספציפי למודול.
```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$name` | מחרוזת | שם המטפל |
| `$dirname` | מחרוזת | שם ספריית מודול |
| `$optional` | bool | החזר ריק בכשל |

**דוּגמָה:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```
---

## יצירת מטפלים מותאמים אישית

### יישום מטפל בסיסי
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
### שימוש במטפל המותאם אישית
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
## שיטות עבודה מומלצות

1. **השתמש בקריטריונים לשאילתות**: השתמש תמיד באובייקטי Criteria לשאילתות בטוחות בסוגים

2. **הרחבה לשיטות מותאמות אישית**: הוסף שיטות שאילתה ספציפיות לדומיין למטפלים

3. **עקוף insert/delete**: הוסף פעולות מדורגות וחותמות זמן בעקיפות

4. **השתמש בעסקאות במידת הצורך**: עטוף פעולות מורכבות בעסקאות

5. **מנף getList**: השתמש ב-`getList()` עבור תפריטים נפתחים נבחרים כדי לצמצם שאילתות

6. **מפתחות אינדקס**: ודא ששדות מסד הנתונים המשמשים בקריטריונים מתווספים לאינדקס

7. **הגבלת תוצאות**: השתמש תמיד ב-`setLimit()` עבור ערכות תוצאות גדולות פוטנציאליות

## תיעוד קשור

- XoopsObject - מחלקת אובייקט בסיס
- ../Database/Criteria - בניית קריטריונים לשאילתה
- ../Database/XoopsDatabase - פעולות מסד נתונים

---

*ראה גם: [XOOPS קוד מקור](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*