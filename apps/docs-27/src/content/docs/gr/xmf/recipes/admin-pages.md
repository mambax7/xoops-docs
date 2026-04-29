---
title: "Σελίδες διαχειριστή ενότητας"
description: "Δημιουργία τυποποιημένων και συμβατών με την προώθηση σελίδων διαχείρισης λειτουργικών μονάδων με το XMF"
---

Η κλάση `XMF\Module\Admin` παρέχει έναν συνεπή τρόπο δημιουργίας διεπαφών διαχείρισης λειτουργικών μονάδων. Η χρήση του XMF για σελίδες διαχειριστή εξασφαλίζει συμβατότητα προς τα εμπρός με μελλοντικές εκδόσεις XOOPS διατηρώντας παράλληλα μια ομοιόμορφη εμπειρία χρήστη.

## Επισκόπηση

Η κλάση ModuleAdmin στο XOOPS Frameworks έκανε τη διαχείριση ευκολότερη, αλλά το API του έχει εξελιχθεί σε διάφορες εκδόσεις. Το περιτύλιγμα `XMF\Module\Admin`:

- Παρέχει ένα σταθερό API που λειτουργεί σε XOOPS εκδόσεις
- Χειρίζεται αυτόματα API διαφορές μεταξύ των εκδόσεων
- Διασφαλίζει ότι ο κωδικός διαχειριστή σας είναι συμβατός με την προώθηση
- Προσφέρει βολικές στατικές μεθόδους για κοινές εργασίες

## Ξεκινώντας

## # Δημιουργία παρουσίας διαχειριστή

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Αυτό επιστρέφει είτε μια παρουσία `XMF\Module\Admin` είτε μια εγγενή κλάση συστήματος εάν είναι ήδη συμβατή.

## Διαχείριση εικονιδίων

## # Το πρόβλημα θέσης εικονιδίου

Τα εικονίδια έχουν μετακινηθεί μεταξύ των εκδόσεων XOOPS, προκαλώντας πονοκεφάλους συντήρησης. Το XMF το λύνει με βοηθητικές μεθόδους.

## # Εύρεση εικονιδίων

**Παλαιός τρόπος (εξαρτάται από την έκδοση):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF τρόπος:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Η μέθοδος `iconUrl()` επιστρέφει ένα πλήρες URL, επομένως δεν χρειάζεται να ανησυχείτε για την κατασκευή διαδρομής.

## # Μεγέθη εικονιδίων

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

## # Εικονίδια μενού

Για το μενού διαχειριστή.php files:

**Παλιό τρόπο:**
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

**XMF τρόπος:**
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

## Τυπικές σελίδες διαχειριστή

## # Σελίδα ευρετηρίου

**Παλιά μορφή:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF μορφή:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

## # Σχετικά με τη σελίδα

**Παλιά μορφή:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF μορφή:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Σημείωση:** Σε μελλοντικές εκδόσεις XOOPS, οι πληροφορίες PayPal ορίζονται στο xoops_version.php. Η κλήση `setPaypal()` διασφαλίζει συμβατότητα με τις τρέχουσες εκδόσεις, ενώ δεν έχει καμία επίδραση στις νεότερες.

## Πλοήγηση

## # Εμφάνιση μενού πλοήγησης

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Κουτιά πληροφοριών

## # Δημιουργία πλαισίων πληροφοριών

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

## Κουτιά διαμόρφωσης

Τα πλαίσια διαμόρφωσης εμφανίζουν απαιτήσεις συστήματος και ελέγχους κατάστασης.

## # Βασικές γραμμές διαμόρφωσης

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

## # Μέθοδοι ευκολίας

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

## # Τύποι πλαισίων διαμόρφωσης

| Τύπος | Αξία | Συμπεριφορά |
|------|-------|----------|
| `default` | Συμβολοσειρά μηνυμάτων | Εμφανίζει απευθείας το μήνυμα |
| `folder` | Διαδρομή καταλόγου | Εμφανίζει αποδοχή εάν υπάρχει, σφάλμα αν όχι |
| `chmod ` | `[path, permission]` | Ο κατάλογος ελέγχων υπάρχει με άδεια |
| `module` | Όνομα ενότητας | Αποδοχή εάν έχει εγκατασταθεί, σφάλμα αν όχι |
| `module ` | `[name, 'warning']` | Αποδοχή εάν έχει εγκατασταθεί, προειδοποίηση εάν όχι |

## Κουμπιά στοιχείων

Προσθήκη κουμπιών ενεργειών σε σελίδες διαχειριστή:

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

## Ολοκληρωμένα Παραδείγματα Σελίδας Διαχειριστή

## # index.php

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

## # items.php

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

## # about.php

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

## # menu.php

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

## API Αναφορά

## # Στατικές μέθοδοι

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `getInstance()` | Λήψη παρουσίας διαχειριστή |
| `iconUrl($name, $size)` | Λήψη εικονιδίου URL (μέγεθος: 16 ή 32) |
| `menuIconPath($image)` | Λήψη διαδρομής εικονιδίου για το μενού.php |
| `setPaypal($paypal)` | Ορίστε το αναγνωριστικό PayPal για τη σελίδα περίπου |

## # Παράδειγμα Μέθοδοι

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `displayNavigation($menu)` | Εμφάνιση μενού πλοήγησης |
| `renderNavigation($menu)` | Πλοήγηση επιστροφής HTML |
| `addInfoBox($title)` | Προσθήκη πλαισίου πληροφοριών |
| `addInfoBoxLine($text, $type, $color)` | Προσθήκη γραμμής στο πλαίσιο πληροφοριών |
| `displayInfoBox()` | Εμφάνιση πλαισίου πληροφοριών |
| `renderInfoBox()` | Πλαίσιο πληροφοριών επιστροφής HTML |
| `addConfigBoxLine($value, $type)` | Προσθήκη γραμμής ελέγχου διαμόρφωσης |
| `addConfigError($value)` | Προσθήκη σφάλματος στο πλαίσιο διαμόρφωσης |
| `addConfigAccept($value)` | Προσθήκη επιτυχίας στο πλαίσιο διαμόρφωσης |
| `addConfigWarning($value)` | Προσθήκη προειδοποίησης στο πλαίσιο διαμόρφωσης |
| `addConfigModuleVersion($moddir, $version)` | Ελέγξτε την έκδοση της μονάδας |
| `addItemButton($title, $link, $icon, $extra)` | Κουμπί προσθήκης ενέργειας |
| `displayButton($position, $delimiter)` | Κουμπιά εμφάνισης |
| `renderButton($position, $delimiter)` | Κουμπί επιστροφής HTML |
| `displayIndex()` | Εμφάνιση σελίδας ευρετηρίου |
| `renderIndex()` | Επιστροφή σελίδας ευρετηρίου HTML |
| `displayAbout($logo_xoops)` | Εμφάνιση σχετικά με τη σελίδα |
| `renderAbout($logo_xoops)` | Επιστροφή σχετικά με τη σελίδα HTML |

## Δείτε επίσης

- ../Basics/XMF-Module-Helper - Βοηθητική τάξη ενότητας
- Άδεια-Βοηθός - Διαχείριση αδειών
- ../XMF-Framework - Επισκόπηση πλαισίου

---

# XMF #admin #module-development #navigation #icons
