---
title: "XOOPS מערכת מודול"
description: "מחזור חיים של מודול, מחלקה XoopsModule, מודול installation/uninstallation, ווי מודול וניהול מודולים"
---
מערכת המודולים XOOPS מספקת מסגרת מלאה לפיתוח, התקנה, ניהול והרחבת פונקציונליות המודול. מודולים הם חבילות עצמאיות המרחיבות XOOPS עם תכונות ויכולות נוספות.

## ארכיטקטורת מודול
```mermaid
graph TD
    A[Module Package] -->|contains| B[xoops_version.php]
    A -->|contains| C[Admin Interface]
    A -->|contains| D[User Interface]
    A -->|contains| E[Class Files]
    A -->|contains| F[SQL Schema]

    B -->|defines| G[Module Metadata]
    B -->|defines| H[Admin Pages]
    B -->|defines| I[User Pages]
    B -->|defines| J[Blocks]
    B -->|defines| K[Hooks]

    L[Module Manager] -->|reads| B
    L -->|controls| M[Installation]
    L -->|controls| N[Activation]
    L -->|controls| O[Update]
    L -->|controls| P[Uninstallation]
```
## מבנה מודול

מבנה ספריות מודול XOOPS סטנדרטי:
```
mymodule/
├── xoops_version.php          # Module manifest and configuration
├── admin.php                  # Admin main page
├── index.php                  # User main page
├── admin/                     # Admin pages directory
│   ├── main.php
│   ├── manage.php
│   └── settings.php
├── class/                     # Module classes
│   ├── Handler/
│   │   ├── ItemHandler.php
│   │   └── CategoryHandler.php
│   └── Objects/
│       ├── Item.php
│       └── Category.php
├── sql/                       # Database schemas
│   ├── mysql.sql
│   └── postgres.sql
├── include/                   # Include files
│   ├── common.inc.php
│   └── functions.php
├── templates/                 # Module templates
│   ├── admin/
│   │   └── main.tpl
│   └── user/
│       ├── index.tpl
│       └── item.tpl
├── blocks/                    # Module blocks
│   └── blocks.php
├── tests/                     # Unit tests
├── language/                  # Language files
│   ├── english/
│   │   └── main.php
│   └── spanish/
│       └── main.php
└── docs/                      # Documentation
```
## XoopsModule שיעור

המחלקה XoopsModule מייצגת מודול XOOPS מותקן.

### סקירת כיתה
```php
namespace Xoops\Core\Module;

class XoopsModule extends XoopsObject
{
    protected int $moduleid = 0;
    protected string $name = '';
    protected string $dirname = '';
    protected string $version = '';
    protected string $description = '';
    protected array $config = [];
    protected array $blocks = [];
    protected array $adminPages = [];
    protected array $userPages = [];
}
```
### מאפיינים

| נכס | הקלד | תיאור |
|--------|------|--------|
| `$moduleid` | int | מזהה מודול ייחודי |
| `$name` | מחרוזת | שם תצוגה של מודול |
| `$dirname` | מחרוזת | שם ספריית מודול |
| `$version` | מחרוזת | גרסת המודול הנוכחית |
| `$description` | מחרוזת | תיאור מודול |
| `$config` | מערך | תצורת מודול |
| `$blocks` | מערך | בלוקים מודולים |
| `$adminPages` | מערך | דפי פאנל ניהול |
| `$userPages` | מערך | דפים הפונים למשתמש |

### קונסטרוקטור
```php
public function __construct()
```
יוצר מופע מודול חדש ומאתחל משתנים.

### שיטות ליבה

#### getName

מקבל את שם התצוגה של המודול.
```php
public function getName(): string
```
**החזרות:** `string` - שם תצוגת מודול

**דוגמה:**
```php
$module = new XoopsModule();
$module->setVar('name', 'Publisher');
echo $module->getName(); // "Publisher"
```
#### getDirname

מקבל את שם הספרייה של המודול.
```php
public function getDirname(): string
```
**החזרות:** `string` - שם ספריית המודול

**דוגמה:**
```php
echo $module->getDirname(); // "publisher"
```
#### getVersion

מקבל את גרסת המודול הנוכחית.
```php
public function getVersion(): string
```
**החזרות:** `string` - מחרוזת גרסה

**דוגמה:**
```php
echo $module->getVersion(); // "2.1.0"
```
#### getDescription

מקבל את תיאור המודול.
```php
public function getDescription(): string
```
**החזרות:** `string` - תיאור המודול

**דוגמה:**
```php
$desc = $module->getDescription();
```
#### getConfig

מאחזר את תצורת המודול.
```php
public function getConfig(string $key = null): mixed
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | מפתח תצורה (null עבור כולם) |

**החזרות:** `mixed` - ערך תצורה או מערך

**דוגמה:**
```php
$config = $module->getConfig();
$itemsPerPage = $module->getConfig('items_per_page');
```
#### setConfig

מגדיר את תצורת המודול.
```php
public function setConfig(string $key, mixed $value): void
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$key` | מחרוזת | מפתח תצורה |
| `$value` | מעורב | ערך תצורה |

**דוּגמָה:**
```php
$module->setConfig('items_per_page', 20);
$module->setConfig('enable_cache', true);
```
#### getPath

מקבל את הנתיב המלא של מערכת הקבצים למודול.
```php
public function getPath(): string
```
**החזרות:** `string` - נתיב ספריית מודול מוחלט

**דוגמה:**
```php
$path = $module->getPath(); // "/var/www/xoops/modules/publisher"
$classPath = $module->getPath() . '/class';
```
#### getUrl

מקבל את URL למודול.
```php
public function getUrl(): string
```
**החזרות:** `string` - מודול URL

**דוגמה:**
```php
$url = $module->getUrl(); // "http://example.com/modules/publisher"
```
## תהליך התקנת מודול

### פונקציית xoops_module_install

פונקציית התקנת המודול שהוגדרה ב-`xoops_version.php`:
```php
function xoops_module_install_modulename($module)
{
    // $module is an XoopsModule instance

    // Create database tables
    // Initialize default configuration
    // Create default folders
    // Set up file permissions

    return true; // Success
}
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$module` | XoopsModule | המודול המותקן |

**החזרות:** `bool` - נכון על הצלחה, לא נכון על כישלון

**דוגמה:**
```php
function xoops_module_install_publisher($module)
{
    // Get module path
    $modulePath = $module->getPath();

    // Create uploads directory
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (!is_dir($uploadsPath)) {
        mkdir($uploadsPath, 0755, true);
    }

    // Get database connection
    global $xoopsDB;

    // Execute SQL installation script
    $sqlFile = $modulePath . '/sql/mysql.sql';
    if (file_exists($sqlFile)) {
        $sqlQueries = file_get_contents($sqlFile);
        // Execute queries (simplified)
        $xoopsDB->queryFromFile($sqlFile);
    }

    // Set default configuration
    $module->setConfig('items_per_page', 10);
    $module->setConfig('enable_comments', true);

    return true;
}
```
### פונקציית xoops_module_uninstall

פונקציית הסרת ההתקנה של המודול:
```php
function xoops_module_uninstall_modulename($module)
{
    // Drop database tables
    // Remove uploaded files
    // Clean up configuration

    return true;
}
```
**דוּגמָה:**
```php
function xoops_module_uninstall_publisher($module)
{
    global $xoopsDB;

    // Drop tables
    $tables = ['publisher_items', 'publisher_categories', 'publisher_comments'];
    foreach ($tables as $table) {
        $xoopsDB->query('DROP TABLE IF EXISTS ' . $xoopsDB->prefix($table));
    }

    // Remove upload folder
    $uploadsPath = XOOPS_ROOT_PATH . '/uploads/publisher';
    if (is_dir($uploadsPath)) {
        // Recursive directory deletion
        $this->recursiveRemoveDir($uploadsPath);
    }

    return true;
}
```
## ווי מודול

ווי מודולים מאפשרים למודולים להשתלב עם מודולים אחרים והמערכת.

### הצהרת הוק

ב-`xoops_version.php`:
```php
$modversion['hooks'] = [
    'system.page.footer' => [
        'function' => 'publisher_page_footer'
    ],
    'user.profile.view' => [
        'function' => 'publisher_user_articles'
    ],
];
```
### יישום הוק
```php
// In a module file (e.g., include/hooks.php)

function publisher_page_footer()
{
    // Return HTML for footer
    return '<div class="publisher-footer">Publisher Footer Content</div>';
}

function publisher_user_articles($user_id)
{
    global $xoopsDB;

    // Get user's articles
    $result = $xoopsDB->query(
        'SELECT * FROM ' . $xoopsDB->prefix('publisher_articles') .
        ' WHERE author_id = ? ORDER BY published DESC LIMIT 5',
        [$user_id]
    );

    $articles = [];
    while ($row = $xoopsDB->fetchAssoc($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```
### ווי מערכת זמינים

| הוק | פרמטרים | תיאור |
|------|--------|-------------|
| `system.page.header` | אין | פלט כותרת עמוד |
| `system.page.footer` | אין | פלט כותרת תחתונה של עמוד |
| `user.login.success` | $user חפץ | לאחר התחברות משתמש |
| `user.logout` | $user חפץ | לאחר התנתק משתמש |
| `user.profile.view` | $user_id | צופה בפרופיל משתמש |
| `module.install` | $module חפץ | התקנת מודול |
| `module.uninstall` | $module חפץ | הסרת מודול |

## שירות מנהל מודול

שירות ModuleManager מטפל בפעולות מודול.

### שיטות

#### getModule

מאחזר מודול לפי שם.
```php
public function getModule(string $dirname): ?XoopsModule
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$dirname` | מחרוזת | שם ספריית מודול |

**החזרות:** `?XoopsModule` - מופע מודול או null

**דוגמה:**
```php
$moduleManager = $kernel->getService('module');
$publisher = $moduleManager->getModule('publisher');
if ($publisher) {
    echo $publisher->getName();
}
```
#### getAllModules

מקבל את כל המודולים המותקנים.
```php
public function getAllModules(bool $activeOnly = true): array
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$activeOnly` | bool | החזר רק מודולים פעילים |

**החזרות:** `array` - מערך של XoopsModule אובייקטים

**דוגמה:**
```php
$activeModules = $moduleManager->getAllModules(true);
foreach ($activeModules as $module) {
    echo $module->getName() . " - " . $module->getVersion() . "\n";
}
```
#### isModuleActive

בודק אם מודול פעיל.
```php
public function isModuleActive(string $dirname): bool
```
**דוּגמָה:**
```php
if ($moduleManager->isModuleActive('publisher')) {
    // Publisher module is active
}
```
#### הפעל את המודול

מפעיל מודול.
```php
public function activateModule(string $dirname): bool
```
**דוּגמָה:**
```php
if ($moduleManager->activateModule('publisher')) {
    echo "Publisher activated";
}
```
#### השבת את המודול

מבטל מודול.
```php
public function deactivateModule(string $dirname): bool
```
**דוּגמָה:**
```php
if ($moduleManager->deactivateModule('publisher')) {
    echo "Publisher deactivated";
}
```
## תצורת מודול (xoops_version.php)

דוגמה של מניפסט מודול מלא:
```php
<?php
/**
 * Module manifest for Publisher
 */

$modversion = [
    'name' => 'Publisher',
    'version' => '2.1.0',
    'description' => 'Professional content publishing module',
    'author' => 'XOOPS Community',
    'credits' => 'Based on original work by...',
    'license' => 'GPL v2',
    'official' => 1,
    'image' => 'images/logo.png',
    'dirname' => 'publisher',
    'onInstall' => 'xoops_module_install_publisher',
    'onUpdate' => 'xoops_module_update_publisher',
    'onUninstall' => 'xoops_module_uninstall_publisher',

    // Admin pages
    'hasAdmin' => 1,
    'adminindex' => 'admin/main.php',
    'adminmenu' => [
        [
            'title' => 'Dashboard',
            'link' => 'admin/main.php',
            'icon' => 'dashboard.png'
        ],
        [
            'title' => 'Manage Items',
            'link' => 'admin/items.php',
            'icon' => 'items.png'
        ],
        [
            'title' => 'Settings',
            'link' => 'admin/settings.php',
            'icon' => 'settings.png'
        ]
    ],

    // User pages
    'hasMain' => 1,
    'main_file' => 'index.php',

    // Blocks
    'blocks' => [
        [
            'file' => 'blocks/recent.php',
            'name' => 'Recent Articles',
            'description' => 'Display recent published articles',
            'show_func' => 'publisher_recent_show',
            'edit_func' => 'publisher_recent_edit',
            'options' => '5|0|0',
            'template' => 'publisher_block_recent.tpl'
        ],
        [
            'file' => 'blocks/featured.php',
            'name' => 'Featured Articles',
            'description' => 'Display featured articles',
            'show_func' => 'publisher_featured_show',
            'edit_func' => 'publisher_featured_edit'
        ]
    ],

    // Module hooks
    'hooks' => [
        'system.page.footer' => [
            'function' => 'publisher_page_footer'
        ],
        'user.profile.view' => [
            'function' => 'publisher_user_articles'
        ]
    ],

    // Configuration items
    'config' => [
        [
            'name' => 'items_per_page',
            'title' => '_MI_PUBLISHER_ITEMS_PER_PAGE',
            'description' => '_MI_PUBLISHER_ITEMS_PER_PAGE_DESC',
            'formtype' => 'text',
            'valuetype' => 'int',
            'default' => '10'
        ],
        [
            'name' => 'enable_comments',
            'title' => '_MI_PUBLISHER_ENABLE_COMMENTS',
            'description' => '_MI_PUBLISHER_ENABLE_COMMENTS_DESC',
            'formtype' => 'yesno',
            'valuetype' => 'int',
            'default' => '1'
        ]
    ]
];

function xoops_module_install_publisher($module)
{
    // Installation logic
    return true;
}

function xoops_module_update_publisher($module)
{
    // Update logic
    return true;
}

function xoops_module_uninstall_publisher($module)
{
    // Uninstallation logic
    return true;
}
```
## שיטות עבודה מומלצות

1. **מרחב שמות הכיתות שלך** - השתמש במרחבי שמות ספציפיים למודול כדי למנוע התנגשויות

2. **השתמש במטפלים** - השתמש תמיד במחלקות מטפל לפעולות מסד נתונים

3. **אינטרנציונל תוכן** - השתמש בקבועי שפה עבור כל המחרוזות הפונות למשתמש

4. **צור סקריפטים להתקנה** - ספק SQL סכימות עבור טבלאות מסד נתונים

5. **הוקסים למסמכים** - תיעד בבירור אילו ווים המודול שלך מספק

6. **גרסת המודול שלך** - הגדל מספרי גרסאות עם מהדורות

7. **התקנה בדיקה** - בדוק היטב תהליכים install/uninstall

8. **הרשאות טיפול** - בדוק את הרשאות המשתמש לפני שמתירים פעולות

## דוגמה של מודול מלא
```php
<?php
/**
 * Custom Article Module Main Page
 */

include __DIR__ . '/include/common.inc.php';

// Get module instance
$module = xoops_getModuleByDirname('mymodule');

// Check if module is active
if (!$module) {
    die('Module not found');
}

// Get module configuration
$itemsPerPage = $module->getConfig('items_per_page');

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Fetch items with pagination
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$items = $itemHandler->getObjects($criteria, $itemsPerPage);

// Prepare template
$xoopsTpl->assign('items', $items);
$xoopsTpl->assign('module_name', $module->getName());
$xoopsTpl->display($module->getPath() . '/templates/user/index.tpl');
```
## תיעוד קשור

- ../Kernel/Kernel-Classes - אתחול ליבה ושירותי ליבה
- ../Template/Template-System - תבניות מודול ושילוב ערכות נושא
- ../Database/QueryBuilder - בניית שאילתות מסד נתונים
- ../Core/XoopsObject - מחלקת אובייקט בסיס

---

*ראה גם: [XOOPS מדריך לפיתוח מודול](https://github.com/XOOPS/XoopsCore27/wiki/Module-Development)*