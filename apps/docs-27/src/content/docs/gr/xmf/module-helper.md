---
title: "XMF Βοηθός ενότητας"
description: 'Απλοποιημένες λειτουργίες της μονάδας χρησιμοποιώντας την κλάση XMF\Module\Helper και σχετικούς βοηθούς'
---

Η κλάση `XMF\Module\Helper` παρέχει έναν εύκολο τρόπο πρόσβασης σε πληροφορίες, διαμορφώσεις, χειριστές και πολλά άλλα που σχετίζονται με τις μονάδες. Η χρήση της βοηθητικής μονάδας απλοποιεί τον κωδικό σας και μειώνει το boilerplate.

## Επισκόπηση

Ο βοηθός ενότητας παρέχει:

- Απλοποιημένη πρόσβαση διαμόρφωσης
- Ανάκτηση αντικειμένου ενότητας
- Στιγμιότυπο χειριστή
- Διαδρομή και ανάλυση URL
- Άδειες και βοηθοί συνεδρίας
- Διαχείριση κρυφής μνήμης

## Λήψη βοηθού ενότητας

## # Βασική χρήση

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

## # Από την τρέχουσα ενότητα

Εάν δεν καθορίσετε ένα όνομα λειτουργικής μονάδας, χρησιμοποιεί την τρέχουσα ενεργή λειτουργική μονάδα:

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## Πρόσβαση διαμόρφωσης

## # Παραδοσιακός τρόπος XOOPS

Η λήψη της διαμόρφωσης της μονάδας με τον παλιό τρόπο είναι περίπλοκη:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

## # XMF Τρόπος

Με τη βοηθητική μονάδα, η ίδια εργασία γίνεται απλή:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## Βοηθητικές Μέθοδοι

## # getModule()

Επιστρέφει το αντικείμενο XoopsModule για τη λειτουργική μονάδα του βοηθού.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

## # getConfig($name, $default)

Επιστρέφει μια τιμή διαμόρφωσης μονάδας ή όλες τις ρυθμίσεις παραμέτρων.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

## # getHandler($name)

Επιστρέφει έναν χειριστή αντικειμένων για τη μονάδα.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

## # loadLanguage($name)

Φορτώνει ένα αρχείο γλώσσας για τη λειτουργική μονάδα.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

## # isCurrentModule()

Ελέγχει εάν αυτή η λειτουργική μονάδα είναι η τρέχουσα ενεργή μονάδα.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

## # isUserAdmin()

Ελέγχει εάν ο τρέχων χρήστης έχει δικαιώματα διαχειριστή για αυτήν την ενότητα.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Διαδρομή και URL Μέθοδοι

## # url($url)

Επιστρέφει ένα απόλυτο URL για μια διαδρομή σχετική με την ενότητα.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

## # διαδρομή ($path)

Επιστρέφει μια απόλυτη διαδρομή συστήματος αρχείων για μια διαδρομή σχετική με την ενότητα.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

## # uploadUrl($url)

Επιστρέφει ένα απόλυτο URL για αρχεία μεταφόρτωσης λειτουργικών μονάδων.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

## # Διαδρομή μεταφόρτωσης ($path)

Επιστρέφει μια απόλυτη διαδρομή συστήματος αρχείων για αρχεία μεταφόρτωσης λειτουργικών μονάδων.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

## # ανακατεύθυνση($url, $time, $message)

Ανακατευθύνει εντός της λειτουργικής μονάδας σε μια σχετική με την ενότητα URL.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## Υποστήριξη εντοπισμού σφαλμάτων

## # setDebug($bool)

Ενεργοποιήστε ή απενεργοποιήστε τη λειτουργία εντοπισμού σφαλμάτων για τον βοηθό.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

## # addLog($log)

Προσθέστε ένα μήνυμα στο αρχείο καταγραφής της μονάδας.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## Σχετικές τάξεις βοήθειας

Το XMF παρέχει εξειδικευμένους βοηθούς που επεκτείνουν τα `XMF\Module\Helper\AbstractHelper`:

## # Βοηθός αδειών

Δείτε ../Recipes/Permission-Helper για λεπτομερή τεκμηρίωση.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

## # Βοηθός συνεδρίας

Αποθήκευση συνεδρίας με επίγνωση λειτουργικών μονάδων με αυτόματο πρόθεμα κλειδιού.

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

## # Βοηθός προσωρινής μνήμης

Αποθήκευση κρυφής μνήμης με επίγνωση λειτουργιών με αυτόματο πρόθεμα κλειδιού.

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

## Πλήρες παράδειγμα

Ακολουθεί ένα ολοκληρωμένο παράδειγμα με τη χρήση του βοηθητικού στοιχείου:

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

## AbstractHelper Base Class

Όλες οι βοηθητικές τάξεις XMF εκτείνονται στο `XMF\Module\Helper\AbstractHelper`, το οποίο παρέχει:

## # Κατασκευαστής

```php
public function __construct($dirname)
```

Εκκινεί με ένα όνομα καταλόγου λειτουργικής μονάδας. Εάν είναι κενό, χρησιμοποιεί την τρέχουσα μονάδα.

## # dirname()

Επιστρέφει το όνομα του καταλόγου της λειτουργικής μονάδας που σχετίζεται με το βοηθητικό πρόγραμμα.

```php
$dirname = $helper->dirname();
```

## # init()

Καλείται από τον κατασκευαστή μετά τη φόρτωση της μονάδας. Παράκαμψη σε προσαρμοσμένους βοηθούς για λογική προετοιμασίας.

## Δημιουργία προσαρμοσμένων βοηθών

Μπορείτε να επεκτείνετε το βοηθητικό πρόγραμμα για λειτουργικότητα συγκεκριμένης μονάδας:

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

## Δείτε επίσης

- Getting-Started-with-XMF - Βασική XMF χρήση
- XMF-Αίτημα - Διαχείριση αιτημάτων
- ../Recipes/Permission-Helper - Διαχείριση αδειών
- ../Recipes/Module-Admin-Pages - Δημιουργία διεπαφής διαχειριστή

---

# XMF #module-helper #configuration #handlers #session #cache
