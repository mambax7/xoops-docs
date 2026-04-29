---
title: "Ενότητα FAQ"
description: "Συχνές ερωτήσεις σχετικά με τις μονάδες XOOPS"
---

# Ενότητα Συχνές Ερωτήσεις

> Συνήθεις ερωτήσεις και απαντήσεις σχετικά με τις μονάδες XOOPS, την εγκατάσταση και τη διαχείριση.

---

## Εγκατάσταση & Ενεργοποίηση

## # Ε: Πώς μπορώ να εγκαταστήσω μια λειτουργική μονάδα στο XOOPS;

**Α:**
1. Κάντε λήψη του αρχείου zip της μονάδας
2. Μεταβείτε στο XOOPS Admin > Modules > Manage Modules
3. Κάντε κλικ στο "Browse" και επιλέξτε το αρχείο zip
4. Κάντε κλικ στο "Μεταφόρτωση"
5. Η μονάδα εμφανίζεται στη λίστα (συνήθως απενεργοποιημένη)
6. Κάντε κλικ στο εικονίδιο ενεργοποίησης για να το ενεργοποιήσετε

Εναλλακτικά, εξαγάγετε το zip απευθείας στο `/xoops_root/modules/` και μεταβείτε στον πίνακα διαχείρισης.

---

## # Ε: Η μεταφόρτωση της μονάδας αποτυγχάνει με "Απόρριψη άδειας"

**Α:** Αυτό είναι ένα ζήτημα άδειας αρχείου:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Δείτε Αποτυχίες εγκατάστασης μονάδας για περισσότερες λεπτομέρειες.

---

## # Ε: Γιατί δεν μπορώ να δω τη λειτουργική μονάδα στον πίνακα διαχείρισης μετά την εγκατάσταση;

**Α:** Ελέγξτε τα ακόλουθα:

1. **Η μονάδα δεν είναι ενεργοποιημένη** - Κάντε κλικ στο εικονίδιο του ματιού στη λίστα Ενότητες
2. **Λείπει η σελίδα διαχειριστή** - Η ενότητα πρέπει να έχει `hasAdmin = 1` στην έκδοση XOOPS.php
3. **Language files missing** - Need `language/english/admin.php`
4. **Η προσωρινή μνήμη δεν διαγράφηκε** - Εκκαθάριση προσωρινής μνήμης και ανανέωση του προγράμματος περιήγησης

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

## # Ε: Πώς μπορώ να απεγκαταστήσω μια λειτουργική μονάδα;

**Α:**
1. Μεταβείτε στο XOOPS Admin > Modules > Manage Modules
2. Απενεργοποιήστε τη μονάδα (κάντε κλικ στο εικονίδιο του ματιού)
3. Κάντε κλικ στο εικονίδιο trash/delete
4. Διαγράψτε με μη αυτόματο τρόπο το φάκελο της λειτουργικής μονάδας εάν θέλετε να αφαιρέσετε πλήρως:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Διαχείριση Ενοτήτων

## # Ε: Ποια είναι η διαφορά μεταξύ απενεργοποίησης και απεγκατάστασης;

**Α:**
- **Απενεργοποίηση**: Απενεργοποίηση της μονάδας (κάντε κλικ στο εικονίδιο του ματιού). Οι πίνακες βάσεων δεδομένων παραμένουν.
- **Απεγκατάσταση**: Αφαιρέστε τη μονάδα. Διαγράφει πίνακες βάσης δεδομένων και αφαιρεί από τη λίστα.

Για πραγματική κατάργηση, διαγράψτε επίσης τον φάκελο:
```bash
rm -rf modules/modulename
```

---

## # Ε: Πώς μπορώ να ελέγξω εάν μια λειτουργική μονάδα έχει εγκατασταθεί σωστά;

**Α:** Χρησιμοποιήστε το σενάριο εντοπισμού σφαλμάτων:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

## # Ε: Μπορώ να εκτελέσω πολλές εκδόσεις της ίδιας μονάδας;

**Α:** Όχι, το XOOPS δεν το υποστηρίζει εγγενώς. Ωστόσο, μπορείτε:

1. Δημιουργήστε ένα αντίγραφο με διαφορετικό όνομα καταλόγου: `mymodule ` και ` mymodule2`
2. Ενημερώστε το dirname στην έκδοση xoopsversion και των δύο μονάδων.php
3. Ensure unique database table names

Αυτό δεν συνιστάται καθώς μοιράζονται τον ίδιο κωδικό.

---

## Διαμόρφωση μονάδας

## # Ε: Πού μπορώ να διαμορφώσω τις ρυθμίσεις της μονάδας;

**Α:**
1. Μεταβείτε στο XOOPS Διαχειριστής > Ενότητες
2. Κάντε κλικ στο εικονίδιο settings/gear δίπλα στη μονάδα
3. Διαμορφώστε τις προτιμήσεις

Οι ρυθμίσεις αποθηκεύονται στον πίνακα `xoops_config`.

**Πρόσβαση στον κωδικό:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

## # Ε: Πώς ορίζω τις επιλογές διαμόρφωσης της μονάδας;

**Α:** Στο xoopsversion.php:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## Χαρακτηριστικά ενότητας

## # Ε: Πώς μπορώ να προσθέσω μια σελίδα διαχειριστή στην ενότητα μου;

**Α:** Δημιουργήστε τη δομή:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

Στο xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Δημιουργία `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

## # Ε: Πώς μπορώ να προσθέσω λειτουργικότητα αναζήτησης στη λειτουργική μονάδα μου;

**Α:**
1. Ορισμός στο xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Δημιουργήστε `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

## # Ε: Πώς μπορώ να προσθέσω ειδοποιήσεις στη μονάδα μου;

**Α:**
1. Ορισμός στο xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. Ενεργοποίηση ειδοποίησης σε κωδικό:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## Δικαιώματα ενότητας

## # Ε: Πώς μπορώ να ορίσω δικαιώματα λειτουργικής μονάδας;

**Α:**
1. Μεταβείτε στο XOOPS Διαχειριστής > Ενότητες > Δικαιώματα μονάδας
2. Επιλέξτε τη μονάδα
3. Επιλέξτε user/group και επίπεδο άδειας
4. Αποθήκευση

**Στον κωδικό:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## Βάση δεδομένων ενότητας

## # Ε: Πού αποθηκεύονται οι πίνακες βάσης δεδομένων λειτουργιών;

**Α:** Όλα στην κύρια βάση δεδομένων XOOPS, με πρόθεμα με το πρόθεμα του πίνακα σας (συνήθως `xoops_`):

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

## # Ε: Πώς μπορώ να ενημερώσω πίνακες βάσης δεδομένων λειτουργιών;

**Α:** Δημιουργήστε ένα σενάριο ενημέρωσης στη λειτουργική μονάδα σας:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## Εξαρτήσεις ενότητας

## # Ε: Πώς μπορώ να ελέγξω εάν έχουν εγκατασταθεί οι απαιτούμενες μονάδες;

**ΕΝΑ:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

## # Ε: Μπορούν οι μονάδες να εξαρτώνται από άλλες μονάδες;

**Α:** Ναι, δηλώστε στο xoopsversion.php:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## Αντιμετώπιση προβλημάτων

## # Ε: Η μονάδα εμφανίζεται στη λίστα αλλά δεν ενεργοποιείται

**Α:** Έλεγχος:
1. xoopsversion.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Αρχείο βάσης δεδομένων SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Αρχεία γλώσσας:
```bash
ls -la modules/mymodule/language/english/
```

Δείτε Αποτυχίες εγκατάστασης μονάδας για λεπτομερή διαγνωστικά.

---

## # Ε: Η μονάδα ενεργοποιήθηκε αλλά δεν εμφανίζεται στον κύριο ιστότοπο

**Α:**
1. Ορίστε `hasMain = 1` στο xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Δημιουργήστε `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

## # Ε: Η ενότητα προκαλεί "λευκή οθόνη θανάτου"

**Α:** Ενεργοποιήστε τον εντοπισμό σφαλμάτων για να βρείτε το σφάλμα:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Ελέγξτε το αρχείο καταγραφής σφαλμάτων:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Δείτε το White Screen of Death για λύσεις.

---

## Απόδοση

## # Ε: Η ενότητα είναι αργή, πώς μπορώ να βελτιστοποιήσω;

**Α:**
1. **Έλεγχος ερωτημάτων βάσης δεδομένων** - Χρησιμοποιήστε την καταγραφή ερωτημάτων
2. **Δεδομένα προσωρινής μνήμης** - Χρησιμοποιήστε την προσωρινή μνήμη XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **Βελτιστοποίηση προτύπων** - Αποφύγετε τους βρόχους στα πρότυπα
4. **Ενεργοποιήστε την προσωρινή μνήμη PHP opcode cache** - APCu, XDebug, κ.λπ.

Δείτε Performance FAQ για περισσότερες λεπτομέρειες.

---

## Ανάπτυξη ενότητας

## # Ε: Πού μπορώ να βρω τεκμηρίωση ανάπτυξης ενότητας;

**Α:** Δείτε:
- Οδηγός Ανάπτυξης Ενοτήτων
- Δομή ενότητας
- Δημιουργία της πρώτης σας ενότητας

---

## Σχετική τεκμηρίωση

- Βλάβες εγκατάστασης μονάδας
- Δομή ενότητας
- Απόδοση FAQ
- Ενεργοποιήστε τη λειτουργία εντοπισμού σφαλμάτων

---

# XOOPS #modules #faq #αντιμετώπιση προβλημάτων
