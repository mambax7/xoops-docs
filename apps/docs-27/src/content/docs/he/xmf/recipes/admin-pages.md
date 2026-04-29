---
title: "דפי ניהול מודול"
description: "יצירת דפי ניהול מודול סטנדרטיים ותואמים קדימה עם XMF"
---

הכיתה `Xmf\Module\Admin` מספקת דרך עקבית ליצור ממשקי ניהול מודול. שימוש ב-XMF עבור דפי ניהול מבטיח תאימות קדימה עם גרסאות XOOPS עתידיות תוך שמירה על חווית משתמש אחידה.

## סקירה כללית

מחלקת ModuleAdmin במסגרות XOOPS הקלה על הניהול, אך ה-API שלה התפתחה בין גרסאות. העטיפה של `Xmf\Module\Admin`:

- מספק API יציב שפועל על פני גרסאות XOOPS
- מטפל באופן אוטומטי בהבדלים API בין גרסאות
- מבטיח שקוד הניהול שלך תואם קדימה
- מציע שיטות סטטיות נוחות למשימות נפוצות

## תחילת העבודה

### יצירת מופע ניהול

```php
$admin = \Xmf\Module\Admin::getInstance();
```

זה מחזיר מופע `Xmf\Module\Admin` או מחלקת מערכת מקורית אם כבר תואמת.

## ניהול סמלים

### בעיית מיקום הסמל

סמלים עברו בין גרסאות XOOPS, מה שגרם לכאבי ראש תחזוקה. XMF פותר זאת באמצעות שיטות שירות.

### מציאת אייקונים

**בדרך הישנה (תלוי גרסה):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF בדרך:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

שיטת `iconUrl()` מחזירה URL מלא, כך שאינך צריך לדאוג לגבי בניית נתיבים.

### גדלי סמלים

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### סמלי תפריט

עבור קבצי admin menu.php:

**בדרך הישנה:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF בדרך:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## דפי ניהול סטנדרטיים

### דף אינדקס

**פורמט ישן:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**פורמט XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### דף מידע

**פורמט ישן:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**פורמט XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **הערה:** בגרסאות עתידיות של XOOPS, פרטי PayPal מוגדרים ב-xoops_version.php. הקריאה `setPaypal()` מבטיחה תאימות עם גרסאות נוכחיות ללא השפעה בגרסאות החדשות יותר.

## ניווט

### הצג תפריט ניווט

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## תיבות מידע

### יצירת תיבות מידע

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## תיבות תצורה

תיבות תצורה מציגות דרישות מערכת ובדיקות מצב.

### קווי תצורה בסיסיים

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### שיטות נוחות

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### סוגי תיבות תצורה

| הקלד | ערך | התנהגות |
|------|-------|--------|
| `default` | מחרוזת הודעה | מציג הודעה ישירות |
| `folder` | נתיב מדריך | מציג קבל אם קיים, שגיאה אם ​​לא |
| `chmod` | `[path, permission]` | ספריית בודק קיימת עם הרשאה |
| `module` | שם המודול | קבל אם מותקן, שגיאה אם ​​לא |
| `module` | `[name, 'warning']` | קבל אם מותקן, אזהרה אם לא |

## לחצני פריט

הוסף לחצני פעולה לדפי ניהול:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## דוגמאות לדף ניהול מלא

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## API הפניה

### שיטות סטטיות

| שיטה | תיאור |
|--------|----------------|
| `getInstance()` | קבל מופע אדמין |
| `iconUrl($name, $size)` | קבל סמל URL (גודל: 16 או 32) |
| `menuIconPath($image)` | קבל נתיב סמל עבור menu.php |
| `setPaypal($paypal)` | הגדר מזהה PayPal עבור עמוד בערך |

### שיטות מופע

| שיטה | תיאור |
|--------|----------------|
| `displayNavigation($menu)` | הצג תפריט ניווט |
| `renderNavigation($menu)` | ניווט חזרה HTML |
| `addInfoBox($title)` | הוסף תיבת מידע |
| `addInfoBoxLine($text, $type, $color)` | הוסף שורה לתיבת המידע |
| `displayInfoBox()` | תיבת מידע להציג |
| `renderInfoBox()` | תיבת מידע החזרה HTML |
| `addConfigBoxLine($value, $type)` | הוסף שורת בדיקת תצורה |
| `addConfigError($value)` | הוסף שגיאה לתיבת התצורה |
| `addConfigAccept($value)` | הוסף הצלחה לתיבת התצורה |
| `addConfigWarning($value)` | הוסף אזהרה לתיבת התצורה |
| `addConfigModuleVersion($moddir, $version)` | בדוק את גרסת המודול |
| `addItemButton($title, $link, $icon, $extra)` | כפתור הוסף פעולה |
| `displayButton($position, $delimiter)` | לחצני תצוגה |
| `renderButton($position, $delimiter)` | לחצן החזרה HTML |
| `displayIndex()` | הצג דף אינדקס |
| `renderIndex()` | החזרת דף אינדקס HTML |
| `displayAbout($logo_xoops)` | הצג אודות עמוד |
| `renderAbout($logo_xoops)` | החזרה אודות העמוד HTML |

## ראה גם

- ../Basics/XMF-Module-Helper - כיתת עוזר מודול
- Permission-Helper - ניהול הרשאות
- ../XMF-Framework - סקירת מסגרת

---

#xmf #admin #module-development #navigation #icons
