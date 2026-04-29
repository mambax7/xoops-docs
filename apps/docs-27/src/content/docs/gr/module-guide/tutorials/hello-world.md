---
title: "Hello World Module"
description: "Οδηγός βήμα προς βήμα για τη δημιουργία της πρώτης σας ενότητας XOOPS"
---

# Εκμάθηση ενότητας Hello World

Αυτό το σεμινάριο σας καθοδηγεί στη δημιουργία της πρώτης σας ενότητας XOOPS. Στο τέλος, θα έχετε μια λειτουργική μονάδα που εμφανίζει το "Hello World" τόσο στο frontend όσο και στην περιοχή διαχείρισης.

## Προαπαιτούμενα

- XOOPS 2.5.x εγκατεστημένο και σε λειτουργία
- PHP 8.0 ή υψηλότερη
- Βασικές γνώσεις PHP
- Επεξεργαστής κειμένου ή IDE (συνιστάται PhpStorm)

## Βήμα 1: Δημιουργήστε τη δομή καταλόγου

Δημιουργήστε την ακόλουθη δομή καταλόγου στο `/modules/helloworld/`:

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

## Βήμα 2: Δημιουργήστε τον ορισμό της μονάδας

Δημιουργία `xoops_version.php`:

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

## Βήμα 3: Δημιουργία αρχείων γλώσσας

## # modinfo.php (Module Information)

Δημιουργία `language/english/modinfo.php`:

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

## # κύρια.php (Frontend Language)

Δημιουργία `language/english/main.php`:

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

## # admin.php (Admin Language)

Δημιουργία `language/english/admin.php`:

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

## Βήμα 4: Δημιουργήστε το ευρετήριο Frontend

Δημιουργήστε το `index.php` στη ρίζα της μονάδας:

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

## Βήμα 5: Δημιουργήστε το πρότυπο Frontend

Δημιουργία `templates/helloworld_index.tpl`:

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

## Βήμα 6: Δημιουργήστε αρχεία διαχειριστή

## # Κεφαλίδα διαχειριστή

Δημιουργία `admin/admin_header.php`:

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

## # Υποσέλιδο διαχειριστή

Δημιουργία `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

## # Μενού διαχειριστή

Δημιουργία `admin/menu.php`:

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

## # Σελίδα ευρετηρίου διαχειριστή

Δημιουργία `admin/index.php`:

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

## Βήμα 7: Δημιουργία προτύπου διαχειριστή

Δημιουργία `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Βήμα 8: Δημιουργήστε το λογότυπο της μονάδας

Δημιουργήστε ή αντιγράψτε μια εικόνα PNG (προτεινόμενο μέγεθος: 92x92 pixel) σε:
`assets/images/logo.png`

Μπορείτε να χρησιμοποιήσετε οποιοδήποτε πρόγραμμα επεξεργασίας εικόνας για να δημιουργήσετε ένα απλό λογότυπο ή να χρησιμοποιήσετε ένα σύμβολο κράτησης θέσης από έναν ιστότοπο όπως το placeholder.com.

## Βήμα 9: Εγκαταστήστε τη μονάδα

1. Συνδεθείτε στον ιστότοπό σας XOOPS ως διαχειριστής
2. Μεταβείτε στο **Διαχειριστής συστήματος** > **Ενότητες**
3. Βρείτε το "Hello World" στη λίστα με τις διαθέσιμες ενότητες
4. Κάντε κλικ στο κουμπί **Εγκατάσταση**
5. Επιβεβαιώστε την εγκατάσταση

## Βήμα 10: Δοκιμάστε την ενότητα σας

## # Frontend Test

1. Μεταβείτε στον ιστότοπό σας XOOPS
2. Κάντε κλικ στο "Hello World" στο κύριο μενού
3. Θα πρέπει να δείτε το μήνυμα καλωσορίσματος και την τρέχουσα ώρα

## # Δοκιμή διαχειριστή

1. Μεταβείτε στην περιοχή διαχείρισης
2. Κάντε κλικ στο "Hello World" στο μενού διαχειριστή
3. Θα πρέπει να δείτε τον πίνακα ελέγχου διαχειριστή

## Αντιμετώπιση προβλημάτων

## # Η μονάδα δεν εμφανίζεται στη λίστα εγκατάστασης

- Ελέγξτε τα δικαιώματα αρχείων (755 για καταλόγους, 644 για αρχεία)
- Βεβαιωθείτε ότι το `xoops_version.php` δεν έχει συντακτικά σφάλματα
- Εκκαθάριση της προσωρινής μνήμης XOOPS

## # Το πρότυπο δεν φορτώνεται

- Βεβαιωθείτε ότι τα αρχεία προτύπων βρίσκονται στον σωστό κατάλογο
- Ελέγξτε τα ονόματα αρχείων προτύπων να ταιριάζουν με αυτά στο `xoops_version.php`
- Βεβαιωθείτε ότι η σύνταξη Smarty είναι σωστή

## # Οι συμβολοσειρές γλώσσας δεν εμφανίζονται

- Ελέγξτε τις διαδρομές αρχείων γλώσσας
- Βεβαιωθείτε ότι έχουν οριστεί σταθερές γλώσσας
- Βεβαιωθείτε ότι υπάρχει ο σωστός φάκελος γλώσσας

## Επόμενα βήματα

Τώρα που έχετε μια λειτουργική ενότητα, συνεχίστε να μαθαίνετε με:

- Building-a-CRUD-Module - Προσθήκη λειτουργικότητας βάσης δεδομένων
- ../Patterns/MVC-Pattern - Οργανώστε τον κώδικά σας σωστά
- ../Best-Practices/Testing - Προσθήκη δοκιμών μονάδας PHPU

## Πλήρης αναφορά αρχείου

Η ολοκληρωμένη ενότητα σας θα πρέπει να έχει αυτά τα αρχεία:

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

## Περίληψη

Συγχαρητήρια! Έχετε δημιουργήσει την πρώτη σας ενότητα XOOPS. Βασικές έννοιες που καλύπτονται:

1. **Δομή μονάδας** - Τυπική διάταξη καταλόγου λειτουργικής μονάδας XOOPS
2. **xoops_version.php** - Ορισμός και διαμόρφωση μονάδας
3. **Αρχεία γλώσσας** - Υποστήριξη διεθνοποίησης
4. **Πρότυπα** - Έξυπνη ενσωμάτωση προτύπων
5. **Διεπαφή διαχειριστή** - Βασικός πίνακας διαχείρισης

Δείτε επίσης: ../Ενότητα-Ανάπτυξη | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
