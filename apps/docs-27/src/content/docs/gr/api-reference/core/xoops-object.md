---
title: "Κλάση XoopsObject"
description: "Βασική κλάση για όλα τα αντικείμενα δεδομένων στο σύστημα XOOPS που παρέχει διαχείριση, επικύρωση και σειριοποίηση ιδιοτήτων"
---

Η κλάση `XoopsObject` είναι η θεμελιώδης βασική κλάση για όλα τα αντικείμενα δεδομένων στο σύστημα XOOPS. Παρέχει μια τυποποιημένη διεπαφή για τη διαχείριση των ιδιοτήτων των αντικειμένων, την επικύρωση, τη βρώμικη παρακολούθηση και τη σειριοποίηση.

## Επισκόπηση τάξης

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Ιεραρχία τάξης

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## Ιδιότητες

| Ακίνητα | Τύπος | Ορατότητα | Περιγραφή |
|----------|------|------------|-------------|
| `$vars` | συστοιχία | προστατευμένο | Αποθηκεύει ορισμούς και τιμές μεταβλητών |
| `$cleanVars` | συστοιχία | προστατευμένο | Αποθηκεύει απολυμανμένες τιμές για λειτουργίες βάσης δεδομένων |
| `$isNew` | bool | προστατευμένο | Υποδεικνύει εάν το αντικείμενο είναι νέο (δεν βρίσκεται ακόμη στη βάση δεδομένων) |
| `$errors` | συστοιχία | προστατευμένο | Αποθηκεύει μηνύματα επικύρωσης και σφάλματος |

## Κατασκευαστής

```php
public function __construct()
```

Δημιουργεί μια νέα παρουσία XoopsObject. Το αντικείμενο επισημαίνεται ως νέο από προεπιλογή.

**Παράδειγμα:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Βασικές Μέθοδοι

## # initVar

Αρχικοποιεί έναν ορισμό μεταβλητής για το αντικείμενο.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$key` | χορδή | Όνομα μεταβλητής |
| `$dataType` | int | Σταθερά τύπου δεδομένων (βλ. Τύποι δεδομένων) |
| `$value` | μικτή | Προεπιλεγμένη τιμή |
| `$required` | bool | Εάν το πεδίο είναι υποχρεωτικό |
| `$maxlength` | int | Μέγιστο μήκος για τύπους χορδών |
| `$options` | χορδή | Πρόσθετες επιλογές |

**Τύποι δεδομένων:**

| Σταθερά | Αξία | Περιγραφή |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Εισαγωγή πλαισίου κειμένου |
| `XOBJ_DTYPE_TXTAREA` | 2 | Περιεχόμενο Textarea |
| `XOBJ_DTYPE_INT` | 3 | Ακέραια τιμή |
| `XOBJ_DTYPE_URL` | 4 | URL συμβολοσειρά |
| `XOBJ_DTYPE_EMAIL` | 5 | Διεύθυνση ηλεκτρονικού ταχυδρομείου |
| `XOBJ_DTYPE_ARRAY` | 6 | Σειριακός πίνακας |
| `XOBJ_DTYPE_OTHER` | 7 | Προσαρμοσμένος τύπος |
| `XOBJ_DTYPE_SOURCE` | 8 | Πηγαίος κώδικας |
| `XOBJ_DTYPE_STIME` | 9 | Μορφή σύντομου χρόνου |
| `XOBJ_DTYPE_MTIME` | 10 | Μορφή μεσαίου χρόνου |
| `XOBJ_DTYPE_LTIME` | 11 | Μορφή για μεγάλο χρονικό διάστημα |
| `XOBJ_DTYPE_FLOAT` | 12 | Κινούμενο σημείο |
| `XOBJ_DTYPE_DECIMAL` | 13 | Δεκαδικός αριθμός |
| `XOBJ_DTYPE_ENUM` | 14 | Απαρίθμηση |

**Παράδειγμα:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

## # setVar

Ορίζει την τιμή μιας μεταβλητής.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$key` | χορδή | Όνομα μεταβλητής |
| `$value` | μικτή | Τιμή προς ρύθμιση |
| `$notGpc` | bool | Εάν αληθεύει, η τιμή δεν είναι από GET/POST/COOKIE |

**Επιστρέφει:** `bool` - Σωστό εάν είναι επιτυχές, ψευδές διαφορετικά

**Παράδειγμα:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

## # getVar

Ανακτά την τιμή μιας μεταβλητής με προαιρετική μορφοποίηση.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$key` | χορδή | Όνομα μεταβλητής |
| `$format` | χορδή | Μορφή εξόδου |

**Επιλογές μορφής:**

| Μορφή | Περιγραφή |
|--------|-------------|
| `'s'` | Εμφάνιση - HTML οντότητες διαφυγής για εμφάνιση |
| `'e'` | Επεξεργασία - Για τιμές εισαγωγής φόρμας |
| `'p'` | Προεπισκόπηση - Παρόμοιο με εμφάνιση |
| `'f'` | Δεδομένα φόρμας - Ακατέργαστα για επεξεργασία εντύπων |
| `'n'` | Κανένα - Ακατέργαστη τιμή, χωρίς μορφοποίηση |

**Επιστρέφει:** `mixed` - Η διαμορφωμένη τιμή

**Παράδειγμα:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

## # setVars

Ορίζει πολλές μεταβλητές ταυτόχρονα από έναν πίνακα.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$values` | συστοιχία | Συσχετικός πίνακας κλειδιών => ζεύγη τιμών |
| `$notGpc` | bool | Εάν αληθεύει, οι τιμές δεν είναι από GET/POST/COOKIE |

**Παράδειγμα:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

## # λάβετε Τιμές

Ανακτά όλες τις τιμές μεταβλητών.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$keys` | συστοιχία | Ειδικά κλειδιά για ανάκτηση (μηδενικό για όλους) |
| `$format` | χορδή | Μορφή εξόδου |
| `$maxDepth` | int | Μέγιστο βάθος για ένθετα αντικείμενα |

**Επιστρέφει:** `array` - Συσχετικός πίνακας τιμών

**Παράδειγμα:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

## # assignVar

Εκχωρεί μια τιμή απευθείας χωρίς επικύρωση (χρησιμοποιήστε με προσοχή).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Παράμετροι:**

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `$key` | χορδή | Όνομα μεταβλητής |
| `$value` | μικτή | Τιμή προς εκχώρηση |

**Παράδειγμα:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

## # cleanVars

Απολυμαίνει όλες τις μεταβλητές για λειτουργίες βάσης δεδομένων.

```php
public function cleanVars(): bool
```

**Επιστρέφει:** `bool` - True αν όλες οι μεταβλητές είναι έγκυρες

**Παράδειγμα:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

Το ### είναι Νέο

Ελέγχει ή ορίζει εάν το αντικείμενο είναι νέο.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Παράδειγμα:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Μέθοδοι χειρισμού σφαλμάτων

## # set Σφάλματα

Προσθέτει ένα μήνυμα σφάλματος.

```php
public function setErrors(string|array $error): void
```

**Παράδειγμα:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

## # λάβετε Σφάλματα

Ανακτά όλα τα μηνύματα σφάλματος.

```php
public function getErrors(): array
```

**Παράδειγμα:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

## # getHtmlErrors

Επιστρέφει σφάλματα που έχουν μορφοποιηθεί ως HTML.

```php
public function getHtmlErrors(): string
```

**Παράδειγμα:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Βοηθητικές Μέθοδοι

## # toArray

Μετατρέπει το αντικείμενο σε πίνακα.

```php
public function toArray(): array
```

**Παράδειγμα:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

## # getVars

Επιστρέφει τους ορισμούς της μεταβλητής.

```php
public function getVars(): array
```

**Παράδειγμα:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Παράδειγμα πλήρους χρήσης

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Βέλτιστες πρακτικές

1. **Always Initialize Variables**: Ορίστε όλες τις μεταβλητές στον κατασκευαστή χρησιμοποιώντας το `initVar()`

2. **Χρησιμοποιήστε κατάλληλους τύπους δεδομένων**: Επιλέξτε τη σωστή σταθερά `XOBJ_DTYPE_*` για επικύρωση

3. **Χειριστείτε προσεκτικά την εισαγωγή χρήστη**: Χρησιμοποιήστε `setVar() ` με `$notGpc = false` για εισαγωγή χρήστη

4. **Επικύρωση πριν από την αποθήκευση**: Να καλείτε πάντα το `cleanVars()` πριν από τη λειτουργία της βάσης δεδομένων

5. **Χρήση παραμέτρων μορφής**: Χρησιμοποιήστε την κατάλληλη μορφή στο `getVar()` για το περιβάλλον

6. **Extend for Custom Logic**: Προσθήκη μεθόδων για συγκεκριμένο τομέα σε υποκλάσεις

## Σχετική τεκμηρίωση

- XoopsObjectHandler - Μοτίβο χειρισμού για επιμονή αντικειμένων
- ../Database/Criteria - Κτίριο ερωτημάτων με κριτήρια
- ../Database/XoopsDatabase - Λειτουργίες βάσης δεδομένων

---

*Δείτε επίσης: [XOOPS Πηγαίος κώδικας](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
