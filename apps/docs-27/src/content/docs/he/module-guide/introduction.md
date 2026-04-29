---
title: "פיתוח מודול"
description: "מדריך מקיף לפיתוח מודולים XOOPS תוך שימוש בשיטות PHP מודרניות"
---
סעיף זה מספק תיעוד מקיף לפיתוח מודולים XOOPS תוך שימוש בשיטות PHP מודרניות, דפוסי עיצוב ושיטות עבודה מומלצות.

## סקירה כללית

XOOPS פיתוח מודול התפתח באופן משמעותי במהלך השנים. מודולים מודרניים ממנפים:

- **MVC אדריכלות** - הפרדה נקייה של חששות
- **PHP 8.x תכונות** - סוג הצהרות, תכונות, ארגומנטים בעלי שם
- **דפוסי עיצוב** - מאגר, DTO, דפוסי שכבת שירות
- **בדיקות** - PHPUnit עם שיטות בדיקה מודרניות
- **XMF Framework** - XOOPS כלי עזר של Module Framework

## מבנה תיעוד

### הדרכות

מדריכים שלב אחר שלב לבניית מודולים XOOPS מאפס.

- Tutorials/Hello-World-Module - המודול XOOPS הראשון שלך
- Tutorials/Building-a-CRUD-Module - השלם פונקציונליות יצירה, קריאה, עדכון, מחיקה

### דפוסי עיצוב

דפוסים אדריכליים בשימוש בפיתוח מודול XOOPS מודרני.

- Patterns/MVC-Pattern - ארכיטקטורת Model-View-Controller
- Patterns/Repository-Pattern - הפשטת גישה לנתונים
- Patterns/DTO-Pattern - אובייקטי העברת נתונים לזרימת נתונים נקייה

### שיטות עבודה מומלצות

הנחיות לכתיבת קוד בר תחזוקה ואיכותי.

- Best-Practices/Clean-Code - עקרונות קוד נקיים עבור XOOPS
- Best-Practices/Code-Smells - אנטי-דפוסים נפוצים וכיצד לתקן אותם
- Best-Practices/Testing - PHPUnit אסטרטגיות בדיקה

### דוגמאות

דוגמאות לניתוח מודולים בעולם האמיתי.

- Publisher-Module-Analysis - צלילה עמוקה לתוך מודול Publisher

## מבנה ספריית מודול

מודול XOOPS מאורגן היטב עוקב אחר מבנה ספריות זה:
```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```
## קבצי מפתח מוסברים

### xoops_version.php

קובץ הגדרות המודול שאומר XOOPS על המודול שלך:
```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```
### Common Include File

צור קובץ אתחול נפוץ עבור המודול שלך:
```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```
## PHP דרישות גרסה

מודולים מודרניים XOOPS צריכים למקד PHP 8.0 ומעלה כדי למנף:

- **קידום נכסי קונסטרוקטור**
- **טיעונים בעלי שם**
- **סוגי איגודים**
- **ביטויי התאמה**
- **תכונות**
- **מפעילת Nullsafe**

## תחילת העבודה

1. התחל עם המדריך Tutorials/Hello-World-Module
2. התקדמות ל-Tutorials/Building-a-CRUD-Module
3. למד את Patterns/MVC-Pattern להדרכה ארכיטקטונית
4. יישמו שיטות Best-Practices/Clean-Code לאורך כל הדרך
5. יישם Best-Practices/Testing מההתחלה

## משאבים קשורים

- ../05-XMF-Framework/XMF-Framework - XOOPS כלי עזר של Module Framework
- Database-Operations - עבודה עם מסד הנתונים XOOPS
- ../04-API-Reference/Template/Template-System - Smarty תבנית ב-XOOPS
- ../02-Core-Concepts/Security/Security-Best-Practices - אבטחת המודול שלך

## היסטוריית גרסאות

| גרסה | תאריך | שינויים |
|--------|-------|--------|
| 1.0 | 2025-01-28 | תיעוד ראשוני |