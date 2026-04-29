---
title: "מודול FAQ"
description: "שאלות נפוצות על מודולים XOOPS"
---
# שאלות נפוצות של מודול

> שאלות ותשובות נפוצות לגבי XOOPS מודולים, התקנה וניהול.

---

## התקנה והפעלה

### ש: כיצד אוכל להתקין מודול ב-XOOPS?

**ת:**
1. הורד את קובץ ה-zip של המודול
2. עבור אל XOOPS ניהול > מודולים > ניהול מודולים
3. לחץ על "עיון" ובחר את קובץ ה-zip
4. לחץ על "העלה"
5. המודול מופיע ברשימה (בדרך כלל מושבת)
6. לחץ על סמל ההפעלה כדי להפעיל אותו

לחלופין, חלץ את ה-zip ישירות לתוך `/xoops_root/modules/` ונווט לפאנל הניהול.

---

### ש: העלאת מודול נכשלה עם "הרשאה נדחתה"

**ת:** זוהי בעיית הרשאת קובץ:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
ראה כשלי התקנת מודול לפרטים נוספים.

---

### ש: מדוע איני יכול לראות את המודול בפאנל הניהול לאחר ההתקנה?

**ת:** בדוק את הדברים הבאים:

1. **המודול לא הופעל** - לחץ על סמל העין ברשימת המודולים
2. **דף ניהול חסר** - המודול חייב להיות `hasAdmin = 1` ב-xoopsversion.php
3. **חסרים קבצי שפה** - צריך `language/english/admin.php`
4. **הcache לא נקה** - נקה cache ורענן את הדפדפן
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### ש: כיצד אוכל להסיר התקנה של מודול?

**ת:**
1. עבור אל XOOPS ניהול > מודולים > ניהול מודולים
2. השבת את המודול (לחץ על סמל העין)
3. לחץ על הסמל trash/delete
4. מחק ידנית את תיקיית המודול אם אתה רוצה הסרה מלאה:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## ניהול מודול

### ש: מה ההבדל בין השבתה להסרה?

**ת:**
- **השבתה**: השבת את המודול (לחץ על סמל העין). נותרו טבלאות מסד נתונים.
- **הסר התקנה**: הסר את המודול. מוחק טבלאות מסד נתונים ומסיר מהרשימה.

כדי להסיר באמת, מחק גם את התיקיה:
```bash
rm -rf modules/modulename
```
---

### ש: כיצד אוכל לבדוק אם מודול מותקן כהלכה?

**ת:** השתמש בסקריפט באגים:
```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```
---

### ש: האם אני יכול להריץ גרסאות מרובות של אותו מודול?

**ת:** לא, XOOPS אינו תומך בכך באופן מקורי. עם זאת, אתה יכול:

1. צור עותק עם שם ספרייה אחר: `mymodule` ו-`mymodule2`
2. עדכן את שם ה-dir ב-xoopsversion.php של שני המודולים
3. ודא שמות טבלאות מסד נתונים ייחודיים

זה לא מומלץ מכיוון שהם חולקים את אותו קוד.

---

## תצורת מודול

### ש: איפה אני מגדיר את הגדרות המודול?

**ת:**
1. עבור אל XOOPS Admin > מודולים
2. לחץ על הסמל settings/gear ליד המודול
3. הגדר העדפות

ההגדרות מאוחסנות בטבלה `xoops_config`.

**גישה בקוד:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```
---

### ש: כיצד אוכל להגדיר אפשרויות תצורה של מודול?

**ת:** ב-xoopsversion.php:
```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```
---

## תכונות מודול

### ש: כיצד אוכל להוסיף דף ניהול למודול שלי?

**ת:** צור את המבנה:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
ב-xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
צור `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### ש: כיצד אוכל להוסיף פונקציונליות חיפוש למודול שלי?

**ת:**
1. הגדר ב-xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. צור `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```
---

### ש: כיצד אוכל להוסיף הודעות למודול שלי?

**ת:**
1. הגדר ב-xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```
2. הפעלת התראה בקוד:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```
---

## הרשאות מודול

### ש: כיצד אוכל להגדיר הרשאות מודול?

**ת:**
1. עבור אל XOOPS Admin > מודולים > הרשאות מודול
2. בחר את המודול
3. בחרו user/group ורמת ההרשאה
4. שמור

**בקוד:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```
---

## מסד נתונים של מודול

### ש: היכן מאוחסנות טבלאות מסד נתונים של מודול?

**ת:** הכל במסד הנתונים הראשי XOOPS, עם קידומת קידומת הטבלה שלך (בדרך כלל `xoops_`):
```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```
---

### ש: כיצד אוכל לעדכן טבלאות מסד נתונים של מודול?

**ת:** צור סקריפט עדכון במודול שלך:
```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```
---

## תלות במודול

### ש: כיצד אוכל לבדוק אם מותקנים מודולים נדרשים?

**א:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```
---

### ש: האם מודולים יכולים להיות תלויים במודולים אחרים?

**ת:** כן, הצהיר ב-xoopsversion.php:
```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```
---

## פתרון בעיות

### ש: המודול מופיע ברשימה אך לא יופעל

**ת:** בדיקה:
1. תחביר xoopsversion.php - השתמש ב- PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. קובץ מסד נתונים SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. קבצי שפה:
```bash
ls -la modules/mymodule/language/english/
```
ראה כשלי התקנת מודול לאבחון מפורט.

---

### ש: מודול מופעל אך אינו מופיע באתר הראשי

**ת:**
1. הגדר `hasMain = 1` ב-xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. צור `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### ש: מודול גורם ל"מסך מוות לבן"

**ת:** אפשר איתור באגים כדי למצוא את השגיאה:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
בדוק את יומן השגיאות:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
ראה מסך מוות לבן לפתרונות.

---

## ביצועים

### ש: המודול איטי, כיצד אוכל לבצע אופטימיזציה?

**ת:**
1. **בדוק שאילתות מסד נתונים** - השתמש ברישום שאילתות
2. **נתוני cache** - השתמש בcache XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```
3. **בצע אופטימיזציה של תבניות** - הימנע מלולאות בתבניות
4. **אפשר PHP cache opcode** - APCu, XDebug וכו'.

ראה ביצועים FAQ לפרטים נוספים.

---

## פיתוח מודול

### ש: היכן אוכל למצוא תיעוד לפיתוח מודול?

**ת:** ראה:
- מדריך לפיתוח מודול
- מבנה מודול
- יצירת המודול הראשון שלך

---

## תיעוד קשור

- כשלים בהתקנת מודול
- מבנה מודול
- ביצועים FAQ
- הפעל מצב ניפוי באגים

---

#xoops #מודולים #שאלות נפוצות #פתרון בעיות