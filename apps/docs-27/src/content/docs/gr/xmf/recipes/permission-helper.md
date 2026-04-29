---
title: "Βοηθός άδειας"
description: "Διαχείριση δικαιωμάτων ομάδας XOOPS με το XMF Άδεια βοήθειας"
---

Το XOOPS διαθέτει ένα ισχυρό και ευέλικτο σύστημα αδειών που βασίζεται στην ιδιότητα μέλους ομάδας χρηστών. Το XMF Permission Helper απλοποιεί την εργασία με αυτά τα δικαιώματα, μειώνοντας τους σύνθετους ελέγχους αδειών σε κλήσεις μεμονωμένης μεθόδου.

## Επισκόπηση

Το σύστημα αδειών XOOPS συσχετίζει ομάδες με:
- Αναγνωριστικό ενότητας
- Όνομα άδειας
- Αναγνωριστικό στοιχείου

Ο έλεγχος των αδειών απαιτεί παραδοσιακά την εύρεση ομάδων χρηστών, την αναζήτηση αναγνωριστικών μονάδων και την αναζήτηση των πινάκων αδειών. Το XMF Permission Helper χειρίζεται όλα αυτά αυτόματα.

## Ξεκινώντας

## # Δημιουργία βοηθητικού προγράμματος αδειών

```php
// For the current module
$permHelper = new \Xmf\Module\Helper\Permission();

// For a specific module
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

Ο βοηθός χρησιμοποιεί αυτόματα τις ομάδες του τρέχοντος χρήστη και το αναγνωριστικό της συγκεκριμένης μονάδας.

## Έλεγχος δικαιωμάτων

## # Ο χρήστης έχει άδεια;

Ελέγξτε εάν ο τρέχων χρήστης έχει συγκεκριμένη άδεια για ένα στοιχείο:

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

## # Ελέγξτε με Ανακατεύθυνση

Αυτόματη ανακατεύθυνση χρηστών που δεν έχουν άδεια:

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

## # Παράκαμψη διαχειριστή

Από προεπιλογή, οι χρήστες διαχειριστή έχουν πάντα άδεια. Για έλεγχο ακόμη και για διαχειριστές:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

## # Λάβετε αναγνωριστικά επιτρεπόμενων στοιχείων

Ανάκτηση όλων των αναγνωριστικών στοιχείων για τα οποία έχουν άδεια συγκεκριμένες ομάδες:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Διαχείριση δικαιωμάτων

## # Λήψη ομάδων για ένα αντικείμενο

Βρείτε ποιες ομάδες έχουν συγκεκριμένη άδεια:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5] (array of group IDs)
```

## # Αποθήκευση δικαιωμάτων

Εκχώρηση άδειας σε συγκεκριμένες ομάδες:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

## # Διαγραφή δικαιωμάτων

Καταργήστε όλα τα δικαιώματα για ένα στοιχείο (συνήθως όταν διαγράφετε το στοιχείο):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Για πολλούς τύπους αδειών:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Ενσωμάτωση φόρμας

## # Προσθήκη Επιλογής Δικαιωμάτων σε Φόρμες

Ο βοηθός μπορεί να δημιουργήσει ένα στοιχείο φόρμας για την επιλογή ομάδων:

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

## # Επιλογές στοιχείου φόρμας

Η πλήρης υπογραφή της μεθόδου:

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

## # Επεξεργασία Υποβολή Φόρμας

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

## # Προεπιλεγμένο όνομα πεδίου

Ο βοηθός δημιουργεί συνεπή ονόματα πεδίων:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## Πλήρες παράδειγμα: Αντικείμενα που προστατεύονται από δικαιώματα

## # Δημιουργία αντικειμένου με δικαιώματα

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

## # Προβολή με έλεγχο άδειας

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

## # Διαγραφή με Εκκαθάριση αδειών

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

## API Αναφορά

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Ελέγξτε εάν ο χρήστης έχει άδεια |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Ελέγξτε και ανακατευθύνετε εάν απορριφθεί |
| `getItemIds($name, $groupIds)` | Λήψη αναγνωριστικών στοιχείων μπορούν να έχουν πρόσβαση οι ομάδες |
| `getGroupsForItem($name, $itemId)` | Λάβετε ομάδες με άδεια |
| `savePermissionForItem($name, $itemId, $groups)` | Αποθήκευση δικαιωμάτων |
| `deletePermissionForItem($name, $itemId)` | Διαγραφή αδειών |
| `getGroupSelectFormForItem(...)` | Δημιουργία στοιχείου επιλογής φόρμας |
| `defaultFieldName($name, $itemId)` | Λήψη προεπιλεγμένου ονόματος πεδίου φόρμας |

## Δείτε επίσης

- ../Basics/XMF-Module-Helper - Βοηθητική τεκμηρίωση ενότητας
- Module-Admin-Pages - Δημιουργία διεπαφής διαχειριστή
- ../Basics/Getting-Started-with-XMF - XMF βασικά

---

# XMF #permissions #security #groups #forms
