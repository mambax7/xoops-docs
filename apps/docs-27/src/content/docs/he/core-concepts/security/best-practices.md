---
title: "שיטות עבודה מומלצות לאבטחה"
description: "מדריך אבטחה מקיף לפיתוח מודול XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[אבטחה APIs יציבים בגרסאות שונות]
נוהלי האבטחה ו-APIs המתועדים כאן פועלים הן ב-XOOPS 2.5.x ו-XOOPS 4.0.x. דרגות אבטחה ליבה (`XoopsSecurity`, `MyTextSanitizer`) נשארות יציבות.
:::

מסמך זה מספק שיטות אבטחה מקיפות למפתחי מודול XOOPS. ביצוע הנחיות אלה יסייע להבטיח שהמודולים שלך מאובטחים ואינם מציגים פרצות בהתקנות XOOPS.

## עקרונות אבטחה

כל מפתח XOOPS צריך לפעול לפי עקרונות האבטחה הבסיסיים הבאים:

1. **הגנה בעומק**: הטמעת שכבות מרובות של בקרות אבטחה
2. **הרשאות הקטנות ביותר**: ספק רק את זכויות הגישה המינימליות הנדרשות
3. **אימות קלט**: לעולם אל תסמוך על קלט משתמש
4. **מאבטח כברירת מחדל**: אבטחה צריכה להיות תצורת ברירת המחדל
5. **Keep It Simple**: קשה יותר לאבטח מערכות מורכבות

## תיעוד קשור

- CSRF-הגנה - מערכת אסימונים ומחלקה XoopsSecurity
- קלט-חיטוי - MyTextSanitizer ואימות
- SQL-הזרקה-מניעת - נוהלי אבטחת מסדי נתונים

## רשימת עיון מהירה

לפני שחרור המודול שלך, ודא:

- [ ] כל הטפסים כוללים אסימונים של XOOPS
- [ ] כל קלט המשתמש מאומת ומחוטא
- [ ] כל הפלט הוצא כהלכה
- [ ] כל שאילתות מסד הנתונים משתמשות בהצהרות עם פרמטרים
- [ ] העלאות קבצים מאומתות כהלכה
- [ ] יש בדיקות אימות והרשאות
- [ ] טיפול בשגיאות אינו חושף מידע רגיש
- [ ] תצורה רגישה מוגנת
- [ ] ספריות צד שלישי מעודכנות
- [ ] בוצעו בדיקות אבטחה

## אימות והרשאה

### בדיקת אימות משתמש
```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### בדיקת הרשאות משתמש
```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### הגדרת הרשאות מודול
```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```
## אבטחת הפעלה

### שיטות מומלצות לטיפול במפגשים

1. אין לאחסן מידע רגיש בפגישה
2. צור מחדש מזהי הפעלה לאחר שינויים של login/privilege
3. אמת את נתוני הפגישה לפני השימוש בהם
```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```
### מניעת קיבוע הפעלה
```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```
## אבטחת העלאת קבצים

### אימות העלאות קבצים
```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```
### שימוש בהעלאה של XOOPS
```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```
### אחסון קבצים שהועלו בצורה מאובטחת
```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```
## טיפול בשגיאות ורישום

### טיפול בשגיאות מאובטח
```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```
### רישום אירועי אבטחה
```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```
## אבטחת תצורה

### אחסון תצורה רגישה
```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```
### הגנה על קבצי תצורה

השתמש ב-`.htaccess` כדי להגן על קבצי תצורה:
```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```
## ספריות של צד שלישי

### בחירת ספריות

1. בחר ספריות שמתוחזקות באופן פעיל
2. בדוק פרצות אבטחה
3. ודא שהרישיון של הספרייה תואם ל- XOOPS

### עדכון ספריות
```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```
### בידוד ספריות
```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```
## בדיקות אבטחה

### רשימת בדיקה ידנית

1. בדוק את כל הטפסים עם קלט לא חוקי
2. ניסיון לעקוף את האימות וההרשאה
3. בדוק את פונקציונליות העלאת הקבצים עם קבצים זדוניים
4. בדוק אם יש פגיעויות של XSS בכל הפלט
5. בדוק הזרקת SQL בכל שאילתות מסד הנתונים

### בדיקה אוטומטית

השתמש בכלים אוטומטיים כדי לסרוק פגיעויות:

1. כלי ניתוח קוד סטטי
2. סורקי יישומי אינטרנט
3. בודק תלות לספריות צד שלישי

## פלט בורח

### HTML הקשר
```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```
### JavaScript הקשר
```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```
### URL הקשר
```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```
### משתני תבנית
```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```
## משאבים

- [OWASP עשרת הגדולים](https://owasp.org/www-project-top-ten/)
- [PHP גיליון רמאות אבטחה](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS תיעוד](https://xoops.org/)

---

#אבטחה #שיטות עבודה מומלצות #xoops #פיתוח מודול #אימות #הרשאה