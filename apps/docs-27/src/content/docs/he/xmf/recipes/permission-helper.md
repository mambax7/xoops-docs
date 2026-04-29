---
title: "עוזר רשות"
description: "ניהול הרשאות קבוצת XOOPS עם XMF Permission Helper"
---

ל-XOOPS מערכת הרשאות חזקה וגמישה המבוססת על חברות בקבוצת משתמשים. מסייע ההרשאות XMF מפשט את העבודה עם ההרשאות הללו, ומצמצם בדיקות הרשאות מורכבות לקריאות שיטה אחת.

## סקירה כללית

מערכת ההרשאות XOOPS משייכת קבוצות עם:
- מזהה מודול
- שם הרשאה
- מזהה פריט

בדיקת הרשאות דורשת באופן מסורתי מציאת קבוצות משתמשים, חיפוש מזהי מודול ושאילתה בטבלאות ההרשאות. מסייע ההרשאות XMF מטפל בכל זה באופן אוטומטי.

## תחילת העבודה

### יצירת מסייע להרשאות

```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

המסייע משתמש אוטומטית בקבוצות המשתמש הנוכחי ובמזהה המודול שצוין.

## בדיקת הרשאות

### האם למשתמש יש הרשאה?

בדוק אם למשתמש הנוכחי יש הרשאה ספציפית לפריט:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Check if user can view topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Display the topic
} else {
    // Show access denied message
}
```

### בדוק עם הפניה מחדש

הפנה אוטומטית משתמשים חסרי הרשאה:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redirects to index.php after 3 seconds if no permission
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Code here only runs if user has permission
displayTopic($topicId);
```

### עקיפה של מנהל מערכת

כברירת מחדל, למשתמשי מנהל יש תמיד הרשאה. כדי לבדוק אפילו אם יש מנהלים:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### קבל מזהי פריט מורשים

אחזר את כל מזהי הפריטים שלקבוצות ספציפיות יש הרשאה עבורם:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## ניהול הרשאות

### קבל קבוצות עבור פריט

מצא לאילו קבוצות יש הרשאה ספציפית:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```

### שמור הרשאות

הענק הרשאה לקבוצות ספציפיות:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### מחק הרשאות

הסר את כל ההרשאות לפריט (בדרך כלל בעת מחיקת הפריט):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

עבור סוגי הרשאות מרובים:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## שילוב טפסים

### הוספת בחירת הרשאה לטפסים

המסייע יכול ליצור רכיב טופס לבחירת קבוצות:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Build your form
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// Add title field, etc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Add permission selector
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Permission name
        $topicId,                              // Item ID
        'Groups with View Topic Permission'   // Caption
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### אפשרויות רכיב טופס

חתימת השיטה המלאה:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Permission name
    $gperm_itemid,    // Item ID
    $caption,         // Form element caption
    $name,            // Element name (auto-generated if empty)
    $include_anon,    // Include anonymous group (default: false)
    $size,            // Number of visible rows (default: 5)
    $multiple         // Allow multiple selection (default: true)
)
```

### מעבד שליחת טופס

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Get the auto-generated field name
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Get selected groups from form
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Save the permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### שם שדה ברירת מחדל

המסייע יוצר שמות שדות עקביים:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## דוגמה מלאה: פריטים מוגנים בהרשאה

### יצירת פריט עם הרשאות

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Save item data
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Save view permission
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Save edit permission
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // View permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Edit permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### צפייה עם בדיקת הרשאה

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Check view permission - redirects if denied
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// User has permission, display the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Show edit button only if user has edit permission
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### מחיקה עם ניקוי הרשאה

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Delete the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Clean up all permissions for this item
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## התייחסות API

| שיטה | תיאור |
|--------|----------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | בדוק אם למשתמש יש הרשאה |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | בדוק והפנה מחדש אם נדחה |
| `getItemIds($name, $groupIds)` | קבל מזהי פריט שקבוצות יכולות לגשת |
| `getGroupsForItem($name, $itemId)` | קבל קבוצות עם הרשאה |
| `savePermissionForItem($name, $itemId, $groups)` | שמור הרשאות |
| `deletePermissionForItem($name, $itemId)` | מחיקת הרשאות |
| `getGroupSelectFormForItem(...)` | צור טופס בחר אלמנט |
| `defaultFieldName($name, $itemId)` | קבל את שם שדה הטופס המוגדר כברירת מחדל |

## ראה גם

- ../Basics/XMF-Module-Helper - תיעוד מודול עוזר
- Module-Admin-Pages - יצירת ממשק Admin
- ../Basics/Getting-Started-with-XMF - XMF יסודות

---

#xmf #הרשאות #אבטחה #קבוצות #טפסים
