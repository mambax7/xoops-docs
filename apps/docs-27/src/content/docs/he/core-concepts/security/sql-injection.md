---
title: "SQL מניעת הזרקה"
description: "נוהלי אבטחת מסדי נתונים ומניעת הזרקת SQL ב- XOOPS"
---
הזרקת SQL היא אחת מפגיעות יישומי האינטרנט המסוכנות והנפוצות ביותר. מדריך זה מכסה כיצד להגן על המודולים XOOPS שלך מפני התקפות הזרקה SQL.

## תיעוד קשור

- אבטחה-שיטות עבודה מומלצות - מדריך אבטחה מקיף
- CSRF-הגנה - מערכת אסימונים ומחלקה XoopsSecurity
- קלט-חיטוי - MyTextSanitizer ואימות

## הבנת SQL הזרקה

הזרקת SQL מתרחשת כאשר קלט המשתמש נכלל ישירות בשאילתות SQL ללא חיטוי או פרמטרים מתאימים.

### דוגמה לקוד פגיע
```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
אם משתמש מעביר `1 OR 1=1` כמזהה, השאילתה הופכת:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
זה מחזיר את כל הרשומות במקום רק אחת.

## שימוש בשאילתות עם פרמטרים

ההגנה היעילה ביותר מפני הזרקת SQL היא שימוש בשאילתות עם פרמטרים (הצהרות מוכנות).

### שאילתה בסיסית עם פרמטרים
```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### פרמטרים מרובים
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### פרמטרים בעלי שם

חלק מהפשטות מסד הנתונים תומכות בפרמטרים בעלי שם:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## באמצעות XoopsObject ו-XoopsObjectHandler

XOOPS מספקת גישה למסד נתונים מונחה עצמים המסייעת במניעת הזרקת SQL דרך מערכת הקריטריונים.

### שימוש בקריטריונים בסיסיים
```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### CriteriaCompo עבור תנאים מרובים
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```
### קריטריונים מפעילים
```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```
### או תנאים
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## קידומות טבלה

השתמש תמיד במערכת קידומת הטבלה XOOPS:
```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT שאילתות

### שימוש בהצהרות מוכנות
```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```
### באמצעות XoopsObject
```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```
## UPDATE שאילתות

### שימוש בהצהרות מוכנות
```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```
### באמצעות XoopsObject
```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```
## DELETE שאילתות

### שימוש בהצהרות מוכנות
```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### באמצעות XoopsObject
```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### מחיקה בכמות גדולה עם קריטריונים
```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## בריחה בעת הצורך

אם אינך יכול להשתמש בהצהרות מוכנות, השתמש בבריחה נכונה:
```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
עם זאת, **העדיף תמיד הצהרות מוכנות** על פני בריחה.

## בניית שאילתות דינמיות בצורה בטוחה

### שמות עמודות דינמיות בטוחות

לא ניתן להגדיר פרמטרים של שמות עמודות. אימות מול רשימת הלבנים:
```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### שמות טבלאות דינמיות בטוחות

באופן דומה, אמת את שמות הטבלה:
```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### בניית WHERE סעיפים באופן דינמי
```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```
## LIKE שאילתות

היזהר עם שאילתות LIKE כדי להימנע מהזרקת תווים כלליים:
```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## סעיפי IN

בעת שימוש בסעיפים IN, ודא שכל הערכים מוקלדים כהלכה:
```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```
או עם קריטריונים:
```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## בטיחות בעסקאות

בעת ביצוע מספר שאילתות קשורות:
```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```
## טיפול בשגיאות

לעולם אל תחשוף שגיאות SQL למשתמשים:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```
## טעויות נפוצות שיש להימנע מהן

### טעות 1: אינטרפולציה ישירה של משתנה
```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### טעות 2: שימוש ב- addslashes()
```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### טעות 3: אמון במזהים מספריים
```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### טעות 4: הזרקה מסדר שני
```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```
## בדיקות אבטחה

### בדוק את השאילתות שלך

בדוק את הטפסים שלך עם התשומות האלה כדי לבדוק אם יש הזרקה של SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

אם אחד מאלה גורם להתנהגות בלתי צפויה או שגיאות, יש לך פגיעות.

### בדיקה אוטומטית

השתמש בכלי בדיקת הזרקה אוטומטיים של SQL במהלך הפיתוח:

- SQLMap
- סוויטת בורפ
- OWASP ZAP

## סיכום שיטות עבודה מומלצות

1. **השתמש תמיד בשאילתות עם פרמטרים** (הצהרות מוכנות)
2. **השתמש ב-XoopsObject/XoopsObjectHandler** במידת האפשר
3. **השתמש בשיעורי קריטריונים** לבניית שאילתות
4. **הרשימה הלבנה של הערכים המותרים** עבור עמודות ושמות טבלאות
5. **הטל ערכים מספריים** במפורש עם `(int)` או `(float)`
6. **לעולם אל תחשוף שגיאות מסד נתונים** למשתמשים
7. **השתמש בעסקאות** עבור שאילתות קשורות מרובות
8. **בדיקת הזרקת SQL** במהלך הפיתוח
9. **Escape LIKE תווים כלליים** בשאילתות חיפוש
10. **חיטוי ערכי IN** בנפרד

---

#Security #sql-injection #database #xoops #prepared-statements #Criteria