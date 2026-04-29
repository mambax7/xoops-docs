---
title: "Ξεκινώντας με το XMF"
description: "Εγκατάσταση, βασικές έννοιες και πρώτα βήματα με το XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Αυτός ο οδηγός καλύπτει τις θεμελιώδεις έννοιες του πλαισίου ενότητας XOOPS (XMF) και πώς να ξεκινήσετε να το χρησιμοποιείτε στις ενότητες σας.

## Προαπαιτούμενα

- XOOPS 2.5.8 ή μεταγενέστερη εγκατάσταση
- PHP 7.2 ή μεταγενέστερη
- Βασική κατανόηση του αντικειμενοστρεφούς προγραμματισμού PHP

## Κατανόηση των χώρων ονομάτων

Το XMF χρησιμοποιεί χώρους ονομάτων PHP για να οργανώσει τις τάξεις του και να αποφύγει τις συγκρούσεις ονομάτων. Όλες οι κλάσεις XMF βρίσκονται στον χώρο ονομάτων `XMF`.

## # Παγκόσμιο πρόβλημα διαστήματος

Χωρίς χώρους ονομάτων, όλες οι κλάσεις PHP μοιράζονται έναν παγκόσμιο χώρο. Αυτό μπορεί να προκαλέσει συγκρούσεις:

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

## # Λύση Χώρων ονομάτων

Οι χώροι ονομάτων δημιουργούν μεμονωμένα περιβάλλοντα ονομασίας:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

## # Χρήση χώρων ονομάτων XMF

Μπορείτε να ανατρέξετε στις τάξεις XMF με διάφορους τρόπους:

**Πλήρης διαδρομή ονομάτων:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Με δήλωση χρήσης:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Πολλαπλές εισαγωγές:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Αυτόματη φόρτωση

Μία από τις μεγαλύτερες ευκολίες του XMF είναι η αυτόματη φόρτωση κατηγορίας. Δεν χρειάζεται ποτέ να συμπεριλάβετε μη αυτόματα αρχεία κλάσης XMF.

## # Παραδοσιακό XOOPS Φόρτωση

Ο παλιός τρόπος απαιτούσε ρητή φόρτωση:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

## # XMF Αυτόματη φόρτωση

Με το XMF, οι κλάσεις φορτώνονται αυτόματα όταν αναφέρονται:

```php
$input = Xmf\Request::getString('input', '');
```

Ή με μια δήλωση χρήσης:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Ο αυτόματος φορτωτής ακολουθεί το πρότυπο [PSR-4](http://www.php-fig.org/psr/psr-4/) και διαχειρίζεται επίσης τις εξαρτήσεις στις οποίες βασίζεται το XMF.

## Παραδείγματα βασικής χρήσης

## # Αίτημα ανάγνωσης εισαγωγής

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

## # Χρήση της Βοήθειας Ενοτήτων

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

## # Μονοπάτι και URL Βοηθοί

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Εντοπισμός σφαλμάτων με XMF

Το XMF παρέχει χρήσιμα εργαλεία εντοπισμού σφαλμάτων:

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

Η έξοδος εντοπισμού σφαλμάτων είναι πτυσσόμενη και εμφανίζει αντικείμενα και πίνακες σε μια ευανάγνωστη μορφή.

## Σύσταση δομής έργου

Όταν δημιουργείτε ενότητες που βασίζονται σε XMF, οργανώστε τον κώδικά σας:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Common Include Pattern

Ένα τυπικό σημείο εισόδου ενότητας:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Επόμενα βήματα

Τώρα που καταλάβατε τα βασικά, εξερευνήστε:

- XMF-Αίτημα - Αναλυτική τεκμηρίωση χειρισμού αιτημάτων
- XMF-Module-Helper - Πλήρης αναφορά βοηθού ενότητας
- ../Recipes/Permission-Helper - Διαχείριση δικαιωμάτων χρήστη
- ../Recipes/Module-Admin-Pages - Δημιουργία διεπαφών διαχειριστή

## Δείτε επίσης

- ../XMF-Framework - Επισκόπηση πλαισίου
- ../Reference/JWT - JSON Υποστήριξη Web Token
- ../Reference/Database - Βοηθητικά προγράμματα βάσης δεδομένων

---

# XMF #ξεκινώντας #namespace #autoloading #basics
