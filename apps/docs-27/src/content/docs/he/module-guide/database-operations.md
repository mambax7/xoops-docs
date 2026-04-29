---
title: "תפעול מסד נתונים"
---
## סקירה כללית

XOOPS מספקת שכבת הפשטה של מסד נתונים התומכת הן בתבניות פרוצדורליות מדור קודם והן בגישות מודרניות מונחה עצמים. מדריך זה מכסה פעולות נפוצות של מסד נתונים לפיתוח מודול.

## חיבור מסד נתונים

### קבלת מופע מסד הנתונים
```php
// Legacy approach
global $xoopsDB;

// Modern approach via helper
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via XMF helper
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```
## פעולות בסיסיות

### SELECT שאילתות
```php
// Simple query
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// With parameters (safe approach)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Single row
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```
### INSERT פעולות
```php
// Basic insert
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Get last insert ID
$newId = $db->getInsertId();
```
### UPDATE פעולות
```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Check affected rows
$affectedRows = $db->getAffectedRows();
```
### DELETE פעולות
```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```
## שימוש בקריטריונים

מערכת הקריטריונים מספקת דרך בטוחה לפי סוג לבניית שאילתות:
```php
use Criteria;
use CriteriaCompo;

// Simple criteria
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Compound criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```
### קריטריונים מפעילים

| מפעיל | תיאור |
|--------|----------------|
| `=` | שווה (ברירת מחדל) |
| `!=` | לא שווה |
| `<` | פחות מ |
| `>` | גדול מ |
| `<=` | פחות או שווה |
| `>=` | גדול או שווה |
| `LIKE` | התאמת דפוסים |
| `IN` | בקבוצת ערכים |
```php
// LIKE criteria
$criteria = new Criteria('title', '%search%', 'LIKE');

// IN criteria
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Date range
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```
## מטפלי חפצים

### שיטות מטפל
```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Create new object
$item = $handler->create();

// Get by ID
$item = $handler->get($id);

// Get multiple
$items = $handler->getObjects($criteria);

// Get as array
$items = $handler->getAll($criteria);

// Count
$count = $handler->getCount($criteria);

// Save
$success = $handler->insert($item);

// Delete
$success = $handler->delete($item);
```
### שיטות מטפל מותאמות אישית
```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```
## עסקאות
```php
// Begin transaction
$db->query('START TRANSACTION');

try {
    // Perform multiple operations
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Commit if all succeed
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Rollback on error
    $db->query('ROLLBACK');
    throw $e;
}
```
## הצהרות מוכנות (מודרני)
```php
// Using PDO through XOOPS database layer
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```
## ניהול סכימה

### יצירת טבלאות
```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
### הגירות
```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```
## שיטות עבודה מומלצות

1. **תמיד לצטט מחרוזות** - השתמש ב-`$db->quoteString()` לקלט משתמש
2. **השתמש ב-Intval** - מספרים שלמים Cast עם `intval()` או הצהרות סוג
3. **העדפת מטפלים** - השתמש במטפלי אובייקטים על פני SQL גולמי כאשר אפשר
4. **השתמש בקריטריונים** - צור שאילתות עם קריטריונים לבטיחות סוג
5. **טיפול בשגיאות** - בדוק ערכי החזר וטפל בכשלים
6. **השתמש בעסקאות** - עטוף פעולות הקשורות בעסקאות

## תיעוד קשור

- ../04-API-Reference/Kernel/Criteria - בניין שאילתות עם קריטריונים
- ../04-API-Reference/Core/XoopsObjectHandler - תבנית מטפל
- ../02-Core-Concepts/Database/Database-Layer - הפשטת מסד נתונים
- Database/Database-Schema - מדריך עיצוב סכימה