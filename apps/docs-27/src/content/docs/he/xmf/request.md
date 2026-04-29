---
title: "XMF בַּקָשָׁה"
description: 'מְאוּבטָח HTTP טיפול בבקשת ואימות קלט עם Xmf\Request מַחלָקָה'
---

ה `Xmf\Request` class מספקת גישה מבוקרת ל HTTP בקש משתנים עם חיטוי מובנה והמרת סוג. הוא מגן מפני הזרקות שעלולות להיות מזיקות כברירת מחדל תוך התאמה של קלט לסוגים שצוינו.

## סקירה כללית

טיפול בבקשות הוא אחד ההיבטים הקריטיים ביותר לאבטחה בפיתוח אתרים. ה XMF בקשת שיעור:

- מחטא באופן אוטומטי קלט כדי למנוע XSS התקפות
- מספק אביזרים בטוחים לסוגי נתונים נפוצים
- תומך במספר מקורות בקשות (GET, POST, COOKIEוכו')
- מציע טיפול עקבי בערך ברירת מחדל

## שימוש בסיסי

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## שיטות בקשה

### getMethod()

מחזיר את HTTP שיטת בקשה עבור הבקשה הנוכחית.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

שיטת הליבה כי רוב אחרים `get*()` שיטות להפעיל. שואב ומחזיר משתנה בעל שם מנתוני בקשה.

**פרמטרים:**
- `$name` - שם משתנה לשליפה
- `$default` - ערך ברירת מחדל אם המשתנה אינו קיים
- `$hash` - Hash מקור: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, או REQUEST (ברירת מחדל)
- `$type` - סוג נתונים לניקוי (ראה סוגי קלט מסנן להלן)
- `$mask` - מסכת סיביות לאפשרויות ניקוי

**ערכי מסכה:**

| מסכה קבועה | אפקט |
|--------------|--------|
| `MASK_NO_TRIM` | לא לקצץ leading/trailing רווח לבן |
| `MASK_ALLOW_RAW` | דלג על ניקוי, אפשר קלט גולמי |
| `MASK_ALLOW_HTML` | אפשר סט מוגבל "בטוח" של HTML סימון |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## שיטות ספציפיות לסוג

### getInt($name, $default, $hash)

מחזירה ערך של מספר שלם. רק ספרות מותרות.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

מחזירה ערך צף. רק ספרות ונקודות מותרות.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

מחזירה ערך בוליאני.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

מחזירה מחרוזת עם אותיות וקווים תחתונים בלבד `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

מחזירה מחרוזת פקודה עם בלבד `[A-Za-z0-9.-_]`, נאלץ לאותיות קטנות.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

מחזיר מחרוזת נקייה עם רע HTML הקוד הוסר (אלא אם כן נשלף על ידי מסכה).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

מחזיר מערך, מעובד באופן רקורסיבי להסרה XSS וקוד גרוע.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

מחזיר טקסט גולמי ללא ניקוי. השתמש בזהירות.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

מחזירה אינטרנט מאומת URL (סכימות יחסיות, http או https בלבד).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

מחזירה מערכת קבצים מאומתת או נתיב אינטרנט.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

מחזירה כתובת אימייל מאומתת או ברירת המחדל.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

מחזירה כתובת IPv4 או IPv6 מאומתת.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

מחזירה an HTTP ערך כותרת בקשה.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## שיטות שירות

### hasVar($name, $hash)

בדוק אם קיים משתנה ב-hash שצוין.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

הגדר משתנה ב-hash שצוין. מחזירה את הערך הקודם או null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### קבל($hash, $mask)

מחזירה עותק נקי של מערך Hash שלם.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

מגדיר משתנים מרובים ממערך.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## שילוב FilterInput

מחלקת Request משתמשת `Xmf\FilterInput` לניקוי. סוגי מסננים זמינים:

| הקלד | תיאור |
|------|-------------|
| ALPHANUM / ALNUM | אלפאנומרי בלבד |
| ARRAY | נקה באופן רקורסיבי כל אלמנט |
| BASE64 | מחרוזת מקודדת Base64 |
| BOOLEAN / BOOL | נכון או לא נכון |
| CMD | פקודה - א-ז, 0-9, קו תחתון, מקף, נקודה (אותיות קטנות) |
| EMAIL | כתובת אימייל חוקית |
| FLOAT / DOUBLE | מספר נקודה צפה |
| INTEGER / INT | ערך מספר שלם |
| IP | כתובת IP חוקית |
| PATH | מערכת קבצים או נתיב אינטרנט |
| STRING | מחרוזת כללית (ברירת מחדל) |
| USERNAME | פורמט שם משתמש |
| WEBURL | אינטרנט URL |
| WORD | אותיות A-Z וקו תחתון בלבד |

## דוגמאות מעשיות

### עיבוד טופס

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### AJAX מטפל

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### עימוד

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### טופס חיפוש

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## שיטות עבודה מומלצות לאבטחה

1. **השתמש תמיד בשיטות ספציפיות לסוג** - השתמש `getInt()` עבור תעודות זהות, `getEmail()` למיילים וכו'.

2. **ספק ברירות מחדל הגיוניות** - לעולם אל תניח שקיים קלט

3. **אמת לאחר חיטוי** - חיטוי מסיר נתונים גרועים, אימות מבטיח נתונים נכונים

4. **השתמש ב-hash מתאים** - ציין POST עבור נתוני טופס, GET עבור פרמטרי שאילתה

5. **הימנע מקלט גולמי** - השתמש רק `getText()` אוֹ `MASK_ALLOW_RAW` כאשר הכרחי לחלוטין

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## ראה גם

- תחילת העבודה עם-XMF - בסיסי XMF מושגים
- XMF-Module-Helper - שיעור עוזר מודול
- ../XMF-Framework - סקירת מסגרת

---

#xmf #request #security #input-validation #sanitization
