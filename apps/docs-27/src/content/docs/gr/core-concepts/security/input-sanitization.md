---
title: "Απολύμανση εισροών"
description: "Χρήση τεχνικών MyTextSanitizer και επικύρωσης στο XOOPS"
---

Ποτέ μην εμπιστεύεστε τα στοιχεία χρήστη. Πάντα να επικυρώνετε και να απολυμαίνετε όλα τα δεδομένα εισόδου πριν τα χρησιμοποιήσετε. Το XOOPS παρέχει την κλάση `MyTextSanitizer` για την εξυγίανση της εισαγωγής κειμένου και διάφορες βοηθητικές λειτουργίες για επικύρωση.

## Σχετική τεκμηρίωση

- Security-Best-Practices - Περιεκτικός οδηγός ασφαλείας
- CSRF-Protection - Token system και XoopsSecurity class
- SQL-Injection-Prevention - Πρακτικές ασφαλείας βάσης δεδομένων

## Ο χρυσός κανόνας

**Ποτέ μην εμπιστεύεστε τα δεδομένα χρήστη.** Όλα τα δεδομένα από εξωτερικές πηγές πρέπει να είναι:

1. **Επικυρωμένο**: Ελέγξτε ότι ταιριάζει με την αναμενόμενη μορφή και τύπο
2. **Sanitized**: Αφαιρέστε ή αποφύγετε δυνητικά επικίνδυνους χαρακτήρες
3. **Escaped**: Κατά την έξοδο, διαφυγή για το συγκεκριμένο περιβάλλον (HTML, JavaScript, SQL)

## Τάξη MyTextSanitizer

Το XOOPS παρέχει την κλάση `MyTextSanitizer ` (κοινώς ονομάζεται `$myts`) για εξυγίανση κειμένου.

## # Λήψη της παρουσίας

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

## # Βασική εξυγίανση κειμένου

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

## # Επεξεργασία περιεχομένου Textarea

Η μέθοδος `displayTarea()` παρέχει ολοκληρωμένη επεξεργασία περιοχής κειμένου:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

## # Κοινές Μέθοδοι Απολύμανσης

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Επικύρωση εισόδου

## # Επικύρωση ακέραιων τιμών

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

## # Επικύρωση διευθύνσεων email

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

## # Επικύρωση διευθύνσεων URL

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

## # Ημερομηνίες επικύρωσης

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

## # Επικύρωση ονομάτων αρχείων

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Χειρισμός διαφορετικών τύπων εισόδου

## # Εισαγωγή συμβολοσειράς

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

## # Αριθμητική είσοδος

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

## # Boolean είσοδος

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

## # Εισαγωγή πίνακα

```php
// Validate array input (e.g., multiple checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

## # Select/Option Είσοδος

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Αντικείμενο αίτησης (XMF)

Όταν χρησιμοποιείτε το XMF, η κλάση Request παρέχει πιο καθαρό χειρισμό εισόδου:

```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Δημιουργία κλάσης επικύρωσης

Για σύνθετες φόρμες, δημιουργήστε μια ειδική κλάση επικύρωσης:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Χρήση:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## Απολύμανση για αποθήκευση βάσεων δεδομένων

Κατά την αποθήκευση δεδομένων στη βάση δεδομένων:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Απολύμανση για οθόνη

Τα διαφορετικά περιβάλλοντα απαιτούν διαφορετική διαφυγή:

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Συνήθεις παγίδες

## # Διπλή κωδικοποίηση

**Πρόβλημα**: Τα δεδομένα κωδικοποιούνται πολλές φορές

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

## # Ασυνεπής κωδικοποίηση

**Πρόβλημα**: Ορισμένες έξοδοι είναι κωδικοποιημένες, άλλες όχι

**Λύση**: Να χρησιμοποιείτε πάντα μια συνεπή προσέγγιση, κατά προτίμηση κωδικοποιώντας στην έξοδο:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

## # Λείπει η επικύρωση

**Πρόβλημα**: Απολύμανση μόνο χωρίς επικύρωση

**Λύση**: Πάντα να επικυρώνετε πρώτα και μετά να απολυμαίνετε:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Σύνοψη βέλτιστων πρακτικών

1. **Χρησιμοποιήστε το MyTextSanitizer** για επεξεργασία περιεχομένου κειμένου
2. **Χρησιμοποιήστε filter_var()** για επικύρωση συγκεκριμένης μορφής
3. **Χρησιμοποιήστε τύπο χύτευσης** για αριθμητικές τιμές
4. **Λίστα λευκών επιτρεπόμενων τιμών** για επιλεγμένες εισόδους
5. **Επικυρώστε πριν την απολύμανση**
6. **Escape στην έξοδο**, όχι στην είσοδο
7. **Χρησιμοποιήστε έτοιμες δηλώσεις** για ερωτήματα βάσης δεδομένων
8. **Δημιουργήστε κλάσεις επικύρωσης** για σύνθετες φόρμες
9. **Μην εμπιστεύεστε ποτέ την επικύρωση από την πλευρά του πελάτη** - επικυρώνετε πάντα από την πλευρά του διακομιστή

---

# ασφάλεια #εξυγίανση #επικύρωση #XOOPS #MyTextSanitizer #input-handling
