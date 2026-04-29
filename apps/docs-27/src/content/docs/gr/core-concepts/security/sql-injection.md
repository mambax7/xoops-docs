---
title: "SQL Πρόληψη ένεσης"
description: "Πρακτικές ασφάλειας βάσης δεδομένων και πρόληψη SQL έγχυσης στο XOOPS"
---

Η έγχυση SQL είναι ένα από τα πιο επικίνδυνα και κοινά τρωτά σημεία εφαρμογών ιστού. Αυτός ο οδηγός καλύπτει τον τρόπο προστασίας των μονάδων XOOPS από επιθέσεις έγχυσης SQL.

## Σχετική τεκμηρίωση

- Security-Best-Practices - Περιεκτικός οδηγός ασφαλείας
- CSRF-Protection - Token system και XoopsSecurity class
- Input-Sanitization - MyTextSanitizer και επικύρωση

## Κατανόηση SQL Ένεση

Η έγχυση SQL λαμβάνει χώρα όταν η είσοδος του χρήστη συμπεριλαμβάνεται απευθείας στα ερωτήματα SQL χωρίς σωστή απολύμανση ή παραμετροποίηση.

## # Παράδειγμα ευάλωτου κώδικα

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

Εάν ένας χρήστης περάσει το `1 OR 1=1` ως αναγνωριστικό, το ερώτημα γίνεται:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

Αυτό επιστρέφει όλες τις εγγραφές αντί για μία μόνο.

## Χρήση παραμετροποιημένων ερωτημάτων

Η πιο αποτελεσματική άμυνα ενάντια στην έγχυση SQL είναι η χρήση παραμετροποιημένων ερωτημάτων (έτοιμες δηλώσεις).

## # Βασικό παραμετροποιημένο ερώτημα

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

## # Πολλαπλές παράμετροι

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

## # Ονομασμένες παράμετροι

Ορισμένες αφαιρέσεις βάσης δεδομένων υποστηρίζουν επώνυμες παραμέτρους:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## Χρήση XoopsObject και XoopsObjectHandler

Το XOOPS παρέχει αντικειμενοστραφή πρόσβαση στη βάση δεδομένων που βοηθά στην αποτροπή της έγχυσης SQL μέσω του συστήματος Criteria.

## # Χρήση βασικών κριτηρίων

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

## # CriteriaCompo για πολλαπλές συνθήκες

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

## # Κριτήρια Χειριστές

```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

## # Ή Προϋποθέσεις

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## Προθέματα πίνακα

Να χρησιμοποιείτε πάντα το σύστημα προθέματος πίνακα XOOPS:

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT Ερωτήματα

## # Χρήση προετοιμασμένων δηλώσεων

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

## # Χρήση XoopsObject

```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## UPDATE Ερωτήματα

## # Χρήση προετοιμασμένων δηλώσεων

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

## # Χρήση XoopsObject

```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## DELETE Ερωτήματα

## # Χρήση προετοιμασμένων δηλώσεων

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

## # Χρήση XoopsObject

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

## # Μαζική διαγραφή με κριτήρια

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## Απόδραση όταν είναι απαραίτητο

Εάν δεν μπορείτε να χρησιμοποιήσετε έτοιμες δηλώσεις, χρησιμοποιήστε τη σωστή διαφυγή:

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

Ωστόσο, **πάντα προτιμάτε τις προετοιμασμένες δηλώσεις** από την απόδραση.

## Δημιουργία δυναμικών ερωτημάτων με ασφάλεια

## # Ασφαλή δυναμικά ονόματα στηλών

Δεν είναι δυνατή η παραμετροποίηση των ονομάτων στηλών. Επικύρωση έναντι μιας λίστας επιτρεπόμενων:

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

## # Ονόματα ασφαλών δυναμικών πινάκων

Ομοίως, επικυρώστε τα ονόματα πινάκων:

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

## # Δημιουργία WHERE Προτάσεων Δυναμικά

```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## LIKE Ερωτήματα

Να είστε προσεκτικοί με τα ερωτήματα LIKE για να αποφύγετε την ένεση μπαλαντέρ:

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

Ρήτρες ## IN

Όταν χρησιμοποιείτε προτάσεις IN, βεβαιωθείτε ότι όλες οι τιμές έχουν πληκτρολογηθεί σωστά:

```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

Ή με κριτήρια:

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## Ασφάλεια συναλλαγών

Κατά την εκτέλεση πολλαπλών σχετικών ερωτημάτων:

```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## Χειρισμός σφαλμάτων

Μην εκθέτετε ποτέ τα σφάλματα SQL στους χρήστες:

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## Συνήθη λάθη που πρέπει να αποφεύγετε

## # Λάθος 1: Άμεση παρεμβολή μεταβλητής

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

## # Λάθος 2: Χρήση addslashes()

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

## # Λάθος 3: Εμπιστοσύνη αριθμητικών αναγνωριστικών

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

## # Λάθος 4: Ένεση δεύτερης τάξης

```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## Δοκιμή ασφαλείας

## # Δοκιμάστε τα ερωτήματά σας

Δοκιμάστε τις φόρμες σας με αυτές τις εισόδους για να ελέγξετε για ένεση SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Εάν κάποιο από αυτά προκαλεί απροσδόκητη συμπεριφορά ή σφάλματα, έχετε μια ευπάθεια.

## # Αυτοματοποιημένη δοκιμή

Χρησιμοποιήστε αυτοματοποιημένα εργαλεία δοκιμής έγχυσης SQL κατά την ανάπτυξη:

- SQLMap
- Burp Σουίτα
- OWASP ZAP

## Σύνοψη βέλτιστων πρακτικών

1. **Να χρησιμοποιείτε πάντα παραμετροποιημένα ερωτήματα** (έτοιμες δηλώσεις)
2. **Χρησιμοποιήστε XoopsObject/XoopsObjectHandler** όταν είναι δυνατόν
3. **Χρησιμοποιήστε κλάσεις Criteria** για τη δημιουργία ερωτημάτων
4. **Λίστα λευκών επιτρεπόμενων τιμών** για ονόματα στηλών και πινάκων
5. **Μετάδοση αριθμητικών τιμών** ρητά με `(int) ` ή `(float)`
6. **Μην εκθέτετε ποτέ τα σφάλματα της βάσης δεδομένων** στους χρήστες
7. **Χρησιμοποιήστε συναλλαγές** για πολλαπλά σχετικά ερωτήματα
8. **Δοκιμή για SQL ένεση** κατά την ανάπτυξη
9. **Escape LIKE χαρακτήρες μπαλαντέρ** σε ερωτήματα αναζήτησης
10. **Απολαύστε τις τιμές ρήτρας IN** ξεχωριστά

---

# ασφάλεια #sql-injection #βάση δεδομένων #XOOPS #prepared-statements #Criteria
