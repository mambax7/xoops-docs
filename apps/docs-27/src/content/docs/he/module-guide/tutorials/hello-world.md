---
title: "מודול שלום עולם"
description: "מדריך שלב אחר שלב ליצירת מודול XOOPS הראשון שלך"
---
# מדריך מודול שלום עולם

מדריך זה מנחה אותך ביצירת מודול XOOPS הראשון שלך. עד הסוף, יהיה לך מודול עבודה המציג "Hello World" הן בחזית הקצה והן באזור הניהול.

## דרישות מוקדמות

- XOOPS 2.5.x מותקן ופועל
- PHP 8.0 ומעלה
- ידע בסיסי PHP
- עורך טקסט או IDE (מומלץ PhpStorm)

## שלב 1: צור את מבנה המדריך

צור את מבנה הספריות הבא ב-`/modules/helloworld/`:
```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```
## שלב 2: צור את הגדרת המודול

צור `xoops_version.php`:
```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```
## שלב 3: צור קובצי שפה

### modinfo.php (מידע על מודול)

צור `language/english/modinfo.php`:
```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```
### main.php (שפת חזית)

צור `language/english/main.php`:
```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```
### admin.php (שפת ניהול)

צור `language/english/admin.php`:
```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```
## שלב 4: צור את אינדקס החזית

צור `index.php` בשורש המודול:
```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```
## שלב 5: צור את תבנית החזית

צור `templates/helloworld_index.tpl`:
```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```
## שלב 6: צור קבצי ניהול

### כותרת מנהל

צור `admin/admin_header.php`:
```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```
### כותרת תחתונה לניהול

צור `admin/admin_footer.php`:
```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```
### תפריט ניהול

צור `admin/menu.php`:
```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```
### דף אינדקס ניהול

צור `admin/index.php`:
```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```
## שלב 7: צור תבנית ניהול

צור `templates/admin/helloworld_admin_index.tpl`:
```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```
## שלב 8: צור את לוגו המודול

צור או העתק תמונה PNG (גודל מומלץ: 92x92 פיקסלים) ל:
`assets/images/logo.png`

אתה יכול להשתמש בכל עורך תמונות כדי ליצור לוגו פשוט, או להשתמש במציין מיקום מאתר כמו placeholder.com.

## שלב 9: התקן את המודול

1. היכנס לאתר XOOPS שלך כמנהל
2. עבור אל **מנהל מערכת** > **מודולים**
3. מצא את "Hello World" ברשימת המודולים הזמינים
4. לחץ על הלחצן **התקן**
5. אשר את ההתקנה

## שלב 10: בדוק את המודול שלך

### מבחן Frontend

1. נווט לאתר XOOPS שלך
2. לחץ על "שלום עולם" בתפריט הראשי
3. אתה אמור לראות את הודעת הפתיחה והשעה הנוכחית

### מבחן מנהל מערכת

1. עבור לאזור הניהול
2. לחץ על "שלום עולם" בתפריט הניהול
3. אתה אמור לראות את לוח המחוונים לניהול

## פתרון בעיות

### המודול לא מופיע ברשימת ההתקנה

- בדוק הרשאות קבצים (755 עבור ספריות, 644 עבור קבצים)
- ודא של `xoops_version.php` אין שגיאות תחביר
- נקה cache XOOPS

### התבנית לא נטענת

- ודא שקובצי התבניות נמצאים בספרייה הנכונה
- בדוק ששמות קבצי התבניות תואמים לאלו שב-`xoops_version.php`
- ודא שהתחביר Smarty נכון

### מחרוזות שפה אינן מוצגות

- בדוק נתיבי קבצי שפה
- ודא שקבועי שפה מוגדרים
- ודא שקיימת תיקיית השפה הנכונה

## השלבים הבאים

עכשיו כשיש לך מודול עובד, המשך ללמוד עם:

- Building-a-CRUD-Module - הוסף פונקציונליות של מסד נתונים
- ../Patterns/MVC-Pattern - ארגן את הקוד שלך כראוי
- ../Best-Practices/Testing - הוסף PHPUnit בדיקות

## השלם הפניה לקובץ

המודול שהושלם צריך לכלול את הקבצים הבאים:
```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```
## סיכום

מזל טוב! יצרת את המודול XOOPS הראשון שלך. מושגי מפתח מכוסים:

1. **מבנה המודול** - פריסת ספריית מודול XOOPS סטנדרטית
2. **xoops_version.php** - הגדרה ותצורה של מודול
3. **קבצי שפה** - תמיכה בבינאום
4. **תבניות** - Smarty שילוב תבניות
5. **ממשק ניהול** - פאנל ניהול בסיסי

ראה גם: ../Module-Development | Building-a-CRUD-מודול | ../Patterns/MVC-Pattern