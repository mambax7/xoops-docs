---
title: "XoopsObject שיעור"
description: "מחלקה בסיס לכל אובייקטי הנתונים במערכת XOOPS המספקת ניהול נכסים, אימות והסדרה"
---
מחלקת `XoopsObject` היא מחלקת הבסיס הבסיסית עבור כל אובייקטי הנתונים במערכת XOOPS. הוא מספק ממשק סטנדרטי לניהול מאפייני אובייקט, אימות, מעקב מלוכלך והסדרה.

## סקירת כיתה
```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```
## היררכיית מעמדות
```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```
## מאפיינים

| נכס | הקלד | נראות | תיאור |
|--------|------|--------|-------------|
| `$vars` | מערך | מוגן | מאחסן הגדרות וערכים משתנים |
| `$cleanVars` | מערך | מוגן | מאחסן ערכים מחוטאים עבור פעולות מסד נתונים |
| `$isNew` | bool | מוגן | מציין אם האובייקט חדש (עדיין לא במסד הנתונים) |
| `$errors` | מערך | מוגן | מאחסן הודעות אימות ושגיאה |

## קונסטרוקטור
```php
public function __construct()
```
יוצר מופע חדש של XoopsObject. האובייקט מסומן כחדש כברירת מחדל.

**דוּגמָה:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## שיטות ליבה

### initVar

מאתחל הגדרת משתנה עבור האובייקט.
```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | שם משתנה |
| `$dataType` | int | קבוע סוג נתונים (ראה סוגי נתונים) |
| `$value` | מעורב | ערך ברירת מחדל |
| `$required` | bool | האם שדה חובה |
| `$maxlength` | int | אורך מקסימלי עבור סוגי מחרוזות |
| `$options` | מחרוזת | אפשרויות נוספות |

**סוגי נתונים:**

| קבוע | ערך | תיאור |
|--------|-------|------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | קלט תיבת טקסט |
| `XOBJ_DTYPE_TXTAREA` | 2 | תוכן אזורי טקסט |
| `XOBJ_DTYPE_INT` | 3 | ערך מספר שלם |
| `XOBJ_DTYPE_URL` | 4 | מחרוזת URL |
| `XOBJ_DTYPE_EMAIL` | 5 | כתובת דואר אלקטרוני |
| `XOBJ_DTYPE_ARRAY` | 6 | מערך סידורי |
| `XOBJ_DTYPE_OTHER` | 7 | סוג מותאם אישית |
| `XOBJ_DTYPE_SOURCE` | 8 | קוד מקור |
| `XOBJ_DTYPE_STIME` | 9 | פורמט זמן קצר |
| `XOBJ_DTYPE_MTIME` | 10 | פורמט זמן בינוני |
| `XOBJ_DTYPE_LTIME` | 11 | פורמט זמן ארוך |
| `XOBJ_DTYPE_FLOAT` | 12 | נקודה צפה |
| `XOBJ_DTYPE_DECIMAL` | 13 | מספר עשרוני |
| `XOBJ_DTYPE_ENUM` | 14 | ספירה |

**דוּגמָה:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```
---

### setVar

מגדיר את הערך של משתנה.
```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | שם משתנה |
| `$value` | מעורב | ערך להגדרה |
| `$notGpc` | bool | אם נכון, הערך אינו מ-GET/POST/COOKIE |

**החזרות:** `bool` - נכון אם מצליח, לא נכון אחרת

**דוגמה:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

### getVar

מאחזר את הערך של משתנה עם עיצוב אופציונלי.
```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | שם משתנה |
| `$format` | מחרוזת | פורמט פלט |

**אפשרויות פורמט:**

| פורמט | תיאור |
|--------|----------------|
| `'s'` | הצג - HTML ישויות בריחה לתצוגה |
| `'e'` | עריכה - לערכי קלט טופס |
| `'p'` | תצוגה מקדימה - דומה להצגה |
| `'f'` | נתוני טופס - גלם לעיבוד טופס |
| `'n'` | ללא - ערך גולמי, ללא עיצוב |

**החזרות:** `mixed` - הערך המעוצב

**דוגמה:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```
---

### setVars

מגדיר משתנים מרובים בבת אחת ממערך.
```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$values` | מערך | מערך אסוציאטיבי של מפתח => זוגות ערכים |
| `$notGpc` | bool | אם נכון, הערכים אינם מ-GET/POST/COOKIE |

**דוּגמָה:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```
---

### getValues

מאחזר את כל ערכי המשתנים.
```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$keys` | מערך | מפתחות ספציפיים לאחזור (null for all) |
| `$format` | מחרוזת | פורמט פלט |
| `$maxDepth` | int | עומק מרבי עבור אובייקטים מקוננים |

**החזרות:** `array` - מערך אסוציאטיבי של ערכים

**דוגמה:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```
---

### assignVar

מקצה ערך ישירות ללא אימות (השתמש בזהירות).
```php
public function assignVar(
    string $key,
    mixed $value
): void
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | שם משתנה |
| `$value` | מעורב | ערך להקצאה |

**דוּגמָה:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### cleanVars

מחטא את כל המשתנים עבור פעולות מסד נתונים.
```php
public function cleanVars(): bool
```
**החזרות:** `bool` - נכון אם כל המשתנים תקפים

**דוגמה:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```
---

### הוא חדש

בודק או קובע אם האובייקט חדש.
```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**דוּגמָה:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## שיטות טיפול בשגיאות

### setErrors

מוסיף הודעת שגיאה.
```php
public function setErrors(string|array $error): void
```
**דוּגמָה:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### getErrors

מאחזר את כל הודעות השגיאה.
```php
public function getErrors(): array
```
**דוּגמָה:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrors

מחזיר שגיאות בפורמט HTML.
```php
public function getHtmlErrors(): string
```
**דוּגמָה:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## שיטות שירות

### למערך

ממירה את האובייקט למערך.
```php
public function toArray(): array
```
**דוּגמָה:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### getVars

מחזירה את הגדרות המשתנים.
```php
public function getVars(): array
```
**דוּגמָה:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## דוגמה מלאה לשימוש
```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```
## שיטות עבודה מומלצות

1. **אתחול משתנים תמיד**: הגדר את כל המשתנים בבנאי באמצעות `initVar()`

2. **השתמש בסוגי נתונים מתאימים**: בחר בקבוע `XOBJ_DTYPE_*` הנכון לצורך אימות

3. **טפל בזהירות בקלט משתמש**: השתמש ב-`setVar()` עם `$notGpc = false` לקלט משתמש

4. **אמת לפני שמירה**: התקשר תמיד `cleanVars()` לפני פעולות במסד הנתונים

5. **השתמש בפרמטרים של פורמט**: השתמש בפורמט המתאים ב-`getVar()` עבור ההקשר

6. **הרחבה עבור לוגיקה מותאמת אישית**: הוסף שיטות ספציפיות לתחום בתתי מחלקות

## תיעוד קשור

- XoopsObjectHandler - דפוס מטפל עבור התמדה של אובייקט
- ../Database/Criteria - בניין שאילתות עם קריטריונים
- ../Database/XoopsDatabase - פעולות מסד נתונים

---

*ראה גם: [XOOPS קוד מקור](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*