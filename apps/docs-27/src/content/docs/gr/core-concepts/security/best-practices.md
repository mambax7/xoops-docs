---
title: "Βέλτιστες πρακτικές ασφάλειας"
description: "Πλήρης οδηγός ασφαλείας για την ανάπτυξη της μονάδας XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip [Τα API ασφαλείας είναι σταθερά σε όλες τις εκδόσεις]
Οι πρακτικές ασφαλείας και τα API που τεκμηριώνονται εδώ λειτουργούν τόσο σε XOOPS 2.5.x και XOOPS 4.0.x. Οι βασικές κατηγορίες ασφαλείας (`XoopsSecurity `, ` MyTextSanitizer`) παραμένουν σταθερές.
:::

Αυτό το έγγραφο παρέχει ολοκληρωμένες βέλτιστες πρακτικές ασφάλειας για προγραμματιστές μονάδων XOOPS. Η τήρηση αυτών των οδηγιών θα σας βοηθήσει να διασφαλίσετε ότι οι μονάδες σας είναι ασφαλείς και δεν εισάγουν τρωτά σημεία στις εγκαταστάσεις XOOPS.

## Αρχές ασφάλειας

Κάθε προγραμματιστής XOOPS πρέπει να ακολουθεί αυτές τις θεμελιώδεις αρχές ασφάλειας:

1. **Defense in Depth**: Εφαρμόστε πολλαπλά επίπεδα ελέγχων ασφαλείας
2. **Λάγιστο προνόμιο**: Παρέχετε μόνο τα ελάχιστα απαραίτητα δικαιώματα πρόσβασης
3. **Επικύρωση εισόδου**: Ποτέ μην εμπιστεύεστε τα στοιχεία του χρήστη
4. **Ασφάλεια από προεπιλογή**: Η ασφάλεια πρέπει να είναι η προεπιλεγμένη διαμόρφωση
5. **Κρατήστε το απλό**: Τα σύνθετα συστήματα είναι πιο δύσκολο να ασφαλιστούν

## Σχετική τεκμηρίωση

- CSRF-Protection - Token system και XoopsSecurity class
- Input-Sanitization - MyTextSanitizer και επικύρωση
- SQL-Injection-Prevention - Πρακτικές ασφάλειας βάσης δεδομένων

## Λίστα ελέγχου γρήγορης αναφοράς

Πριν απελευθερώσετε τη μονάδα σας, επαληθεύστε:

- [ ] Όλες οι φόρμες περιλαμβάνουν μάρκες XOOPS
- [ ] Όλες οι εισαγωγές χρήστη επικυρώνονται και απολυμαίνονται
- [ ] Όλη η έξοδος έχει διαφύγει σωστά
- [ ] Όλα τα ερωτήματα της βάσης δεδομένων χρησιμοποιούν παραμετροποιημένες δηλώσεις
- [ ] Οι μεταφορτώσεις αρχείων έχουν επικυρωθεί σωστά
- [ ] Πραγματοποιούνται έλεγχοι ελέγχου ταυτότητας και εξουσιοδότησης
- [ ] Ο χειρισμός σφαλμάτων δεν αποκαλύπτει ευαίσθητες πληροφορίες
- [ ] Προστατεύεται η ευαίσθητη διαμόρφωση
- [ ] Οι βιβλιοθήκες τρίτων είναι ενημερωμένες
- [ ] Έγινε δοκιμή ασφαλείας

## Έλεγχος ταυτότητας και εξουσιοδότηση

## # Έλεγχος ελέγχου ταυτότητας χρήστη

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

## # Έλεγχος δικαιωμάτων χρήστη

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

## # Ρύθμιση δικαιωμάτων μονάδας

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

## Ασφάλεια συνεδρίας

## # Βέλτιστες πρακτικές χειρισμού συνεδρίας

1. Μην αποθηκεύετε ευαίσθητες πληροφορίες στη συνεδρία
2. Αναδημιουργήστε τα αναγνωριστικά περιόδου σύνδεσης μετά τις αλλαγές login/privilege
3. Επικυρώστε τα δεδομένα συνεδρίας πριν τα χρησιμοποιήσετε

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

## # Πρόληψη διόρθωσης συνεδρίας

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

## Ασφάλεια μεταφόρτωσης αρχείων

## # Επικύρωση μεταφορτώσεων αρχείων

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

## # Χρήση του XOOPS Uploader

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

## # Ασφαλής αποθήκευση των μεταφορτωμένων αρχείων

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

## Χειρισμός και καταγραφή σφαλμάτων

## # Ασφαλής χειρισμός σφαλμάτων

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

## # Καταγραφή συμβάντων ασφαλείας

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Ασφάλεια διαμόρφωσης

## # Αποθήκευση ευαίσθητης διαμόρφωσης

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

## # Προστασία αρχείων διαμόρφωσης

Χρησιμοποιήστε το `.htaccess` για την προστασία των αρχείων διαμόρφωσης:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Βιβλιοθήκες τρίτων

## # Επιλογή Βιβλιοθηκών

1. Επιλέξτε ενεργά διατηρούμενες βιβλιοθήκες
2. Ελέγξτε για τρωτά σημεία ασφαλείας
3. Βεβαιωθείτε ότι η άδεια χρήσης της βιβλιοθήκης είναι συμβατή με το XOOPS

## # Ενημέρωση βιβλιοθηκών

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

## # Απομόνωση Βιβλιοθηκών

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

## Δοκιμή ασφαλείας

## # Λίστα ελέγχου χειροκίνητων δοκιμών

1. Δοκιμάστε όλες τις φόρμες με μη έγκυρη εισαγωγή
2. Προσπαθήστε να παρακάμψετε τον έλεγχο ταυτότητας και την εξουσιοδότηση
3. Δοκιμάστε τη λειτουργία μεταφόρτωσης αρχείων με κακόβουλα αρχεία
4. Ελέγξτε για ευπάθειες XSS σε όλες τις εξόδους
5. Δοκιμάστε για ένεση SQL σε όλα τα ερωτήματα της βάσης δεδομένων

## # Αυτοματοποιημένη δοκιμή

Χρησιμοποιήστε αυτοματοποιημένα εργαλεία για σάρωση για τρωτά σημεία:

1. Εργαλεία ανάλυσης στατικού κώδικα
2. Σαρωτές διαδικτυακών εφαρμογών
3. Έλεγχοι εξάρτησης για βιβλιοθήκες τρίτων

## Διαφυγή εξόδου

## # HTML Περιεχόμενο

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

## # Περιεχόμενο JavaScript

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

## # URL Περιεχόμενο

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

## # Μεταβλητές προτύπου

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Πόροι

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Φύλλο εξαπάτησης ασφαλείας](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Τεκμηρίωση](https://xoops.org/)

---

# ασφάλεια #βέλτιστες πρακτικές #XOOPS #ανάπτυξη μονάδων #έλεγχος ταυτότητας #εξουσιοδότηση
