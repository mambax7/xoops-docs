---
title: "עזר מודול XMF"
description: "פעולות מודול פשוטות באמצעות הכיתה Xmf\Module\Helper ועוזרים קשורים"
---

מחלקה `Xmf\Module\Helper` מספקת דרך קלה לגשת למידע הקשור למודול, תצורות, מטפלים ועוד. השימוש ב-Modul Helper מפשט את הקוד שלך ומפחית את ה-boilerplate.

## סקירה כללית

עוזר המודול מספק:

- גישה פשוטה לתצורה
- אחזור אובייקט מודול
- מופע מטפל
- נתיב ורזולוציית URL
- רשות ועזרי הפעלות
- ניהול cache

## קבלת מודול עוזר

### שימוש בסיסי

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### מהמודול הנוכחי

אם לא תציין שם מודול, הוא משתמש במודול הפעיל הנוכחי:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## גישת תצורה

### דרך XOOPS המסורתית

קבלת תצורת המודול בדרך הישנה היא מילולית:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### דרך XMF

עם עוזר המודול, אותה משימה הופכת פשוטה:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## שיטות עוזר

### getModule()

מחזירה את האובייקט XoopsModule עבור מודול העוזר.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

מחזירה ערך תצורת מודול או את כל התצורות.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

מחזירה מטפל באובייקטים עבור המודול.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

טוען קובץ שפה עבור המודול.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

בודק אם מודול זה הוא המודול הפעיל כעת.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

בודק אם למשתמש הנוכחי יש זכויות אדמין עבור מודול זה.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## שיטות נתיב ו-URL

### url($url)

מחזירה URL מוחלט עבור נתיב יחסי למודול.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### נתיב($path)

מחזיר נתיב מוחלט של מערכת קבצים עבור נתיב יחסי למודול.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

מחזירה URL מוחלט עבור קבצי העלאת מודול.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

מחזיר נתיב מוחלט של מערכת קבצים עבור קבצי העלאת מודול.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### הפניה מחדש($url, $time, $message)

מפנה בתוך המודול ל-URL יחסית למודול.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## תמיכה באגים

### setDebug($bool)

הפעל או השבת את מצב ניפוי באגים עבור המסייע.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

הוסף הודעה ליומן המודול.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## שיעורי עוזרים קשורים

XMF מספקת עוזרים מיוחדים המרחיבים את `Xmf\Module\Helper\AbstractHelper`:

### עוזר הרשאות

ראה ../Recipes/Permission-Helper לתיעוד מפורט.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### עוזר הפעלות

אחסון הפעלה מודע למודול עם קידומת מפתח אוטומטית.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### עוזר הcache

cache מודע למודול עם קידומת מפתח אוטומטית.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```

## דוגמה מלאה

להלן דוגמה מקיפה באמצעות עוזר המודול:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## ClassHelper Base Abstract

כל כיתות העזר XMF מרחיבות את `Xmf\Module\Helper\AbstractHelper`, המספקת:

### קונסטרוקטור

```php
public function __construct($dirname)
```

מופע עם שם ספריית מודול. אם ריק, משתמש במודול הנוכחי.

### dirname()

מחזירה את שם ספריית המודול המשויך לעוזר.

```php
$dirname = $helper->dirname();
```

### init()

נקרא על ידי הבנאי לאחר טעינת המודול. ביטול של עוזרים מותאמים אישית עבור לוגיקה של אתחול.

## יצירת עוזרים מותאמים אישית

אתה יכול להרחיב את העזר לפונקציונליות ספציפית למודול:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## ראה גם

- תחילת העבודה עם-XMF - שימוש בסיסי ב-XMF
- XMF-בקשה - טיפול בבקשות
- ../Recipes/Permission-Helper - ניהול הרשאות
- ../Recipes/Module-Admin-Pages - יצירת ממשק ניהול

---

#xmf #module-helper #configuration #handlers #session #cache
