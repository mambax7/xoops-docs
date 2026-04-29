---
title: "תחילת העבודה עם XMF"
description: "התקנה, מושגים בסיסיים ושלבים ראשונים עם מסגרת המודול XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

מדריך זה מכסה את המושגים הבסיסיים של מסגרת המודול XOOPS (XMF) וכיצד להתחיל להשתמש בה במודולים שלך.

## דרישות מוקדמות

- מותקן XOOPS 2.5.8 ואילך
- PHP 7.2 ואילך
- הבנה בסיסית של PHP תכנות מונחה עצמים

## הבנת מרחבי שמות

XMF משתמש במרחבי השמות של PHP כדי לארגן את המחלקות שלה ולהימנע מהתנגשויות שמות. כל מחלקות XMF נמצאות במרחב השמות `Xmf`.

### בעיית חלל גלובלית

ללא מרחבי שמות, כל מחלקות PHP חולקות מרחב גלובלי. זה יכול לגרום לעימותים:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### פתרון מרחבי שמות

מרחבי שמות יוצרים הקשרי שמות מבודדים:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### שימוש במרחבי שמות של XMF

אתה יכול להתייחס לשיעורי XMF בכמה דרכים:

**נתיב מרחב השמות המלא:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**עם הצהרת שימוש:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**ייבוא ​​מרובה:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## טעינה אוטומטית

אחת הנוחות הגדולות ביותר של XMF היא טעינת מחלקה אוטומטית. לעולם אינך צריך לכלול ידנית קבצי מחלקה XMF.

### טעינה XOOPS מסורתית

הדרך הישנה דרשה טעינה מפורשת:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF טעינה אוטומטית

עם XMF, מחלקות נטענות אוטומטית עם הפניה:

```php
$input = Xmf\Request::getString('input', '');
```

או עם הצהרת שימוש:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

הטעינה האוטומטית עוקבת אחר תקן [PSR-4](http://www.php-fig.org/psr/psr-4/) וגם מנהלת תלות שעליהן מסתמך XMF.

## דוגמאות לשימוש בסיסי

### קלט בקשת קריאה

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### שימוש ב-Module Helper

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### עוזרי נתיב ו-URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## איתור באגים עם XMF

XMF מספק כלי איתור באגים מועילים:

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

פלט ניפוי הבאגים ניתן לקיפול ומציג אובייקטים ומערכים בפורמט קל לקריאה.

## המלצה על מבנה הפרויקט

בעת בניית מודולים מבוססי XMF, ארגן את הקוד שלך:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## תבנית כלול נפוצה

נקודת כניסה טיפוסית למודול:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## השלבים הבאים

עכשיו שאתה מבין את היסודות, חקור:

- XMF-בקשה - תיעוד מפורט לטיפול בבקשות
- XMF-Module-Helper - הפניה מלאה למסייע המודול
- ../Recipes/Permission-Helper - ניהול הרשאות משתמש
- ../Recipes/Module-Admin-Pages - בניית ממשקי ניהול

## ראה גם

- ../XMF-Framework - סקירת מסגרת
- ../Reference/JWT - JSON תמיכה באסימוני אינטרנט
- ../Reference/Database - כלי עזר למסד נתונים

---

#xmf #תחילת העבודה #מרחבי שם #טעינה אוטומטית #יסודות
