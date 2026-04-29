---
title: "XMFΑίτηση"
description: 'ΑσφαλήςHTTPχειρισμός αιτημάτων και επικύρωση εισόδου με τοXmf\Requestτάξη'
---

Ο `XMF\Request` Η κλάση παρέχει ελεγχόμενη πρόσβαση σεHTTPμεταβλητές αιτήματος με ενσωματωμένη απολύμανση και μετατροπή τύπου. Προστατεύει από δυνητικά επιβλαβείς ενέσεις από προεπιλογή, ενώ συμμορφώνεται με τα δεδομένα εισόδου σε καθορισμένους τύπους.

## Επισκόπηση

Η διαχείριση αιτημάτων είναι μια από τις πιο κρίσιμες πτυχές της ανάπτυξης ιστού για την ασφάλεια. ΟXMFΑίτημα τάξης:

- Απολυμαίνει αυτόματα την είσοδο για αποτροπήXSSεπιθέσεις
- Παρέχει ασφαλή για τον τύπο αξεσουάρ για κοινούς τύπους δεδομένων
- Υποστηρίζει πολλαπλές πηγές αιτημάτων (GET, POST, COOKIE, κλπ.)
- Προσφέρει συνεπή χειρισμό προεπιλεγμένων τιμών

## Βασική χρήση

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Μέθοδοι αιτήματος

### getMethod()Επιστρέφει τοHTTPμέθοδο αίτησης για το τρέχον αίτημα.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

## # getVar($name, $default, $hash, $type, $mask)

Η βασική μέθοδος που οι περισσότερες άλλες `get*()` μέθοδοι που επικαλούνται. Ανακτά και επιστρέφει μια ονομασμένη μεταβλητή από τα δεδομένα αιτήματος.

**Παράμετροι:**
- `$name`- Όνομα μεταβλητής προς ανάκτηση
- `$default`- Προεπιλεγμένη τιμή εάν δεν υπάρχει μεταβλητή
- `$hash`- Κατακερματισμός πηγής:GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, ήREQUEST(προεπιλογή)
- `$type`- Τύπος δεδομένων για καθαρισμό (δείτε τους τύπους εισόδου φίλτρου παρακάτω)
- `$mask`- Bitmask για επιλογές καθαρισμού

**Τιμές μάσκας:**

| Mask Constant | Επίδραση |
|---------------|--------|
|`MASK_NO_TRIM`| Μην κόβετεleading/trailingκενό διάστημα |
|`MASK_ALLOW_RAW`| Παράλειψη καθαρισμού, επιτρέψτε την ακατέργαστη εισαγωγή |
|`MASK_ALLOW_HTML`| Επιτρέψτε ένα περιορισμένο "ασφαλές" σύνολοHTMLσήμανση |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Μέθοδοι ειδικές για τον τύπο

## # getInt($name, $default, $hash)

Επιστρέφει μια ακέραια τιμή. Επιτρέπονται μόνο ψηφία.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

## # getFloat($name, $default, $hash)

Επιστρέφει μια κινητή τιμή. Επιτρέπονται μόνο ψηφία και τελείες.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

## # getBool($name, $default, $hash)

Επιστρέφει μια boolean τιμή.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

## # getWord($name, $default, $hash)

Επιστρέφει μια συμβολοσειρά με μόνο γράμματα και κάτω παύλες `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

## # getCmd($name, $default, $hash)

Επιστρέφει μια συμβολοσειρά εντολών με μόνο `[A-Za-z0-9.-_]`, αναγκαστικά σε πεζά.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

## # getString($name, $default, $hash, $mask)

Επιστρέφει μια καθαρισμένη συμβολοσειρά με κακήHTMLο κωδικός αφαιρέθηκε (εκτός εάν παρακαμφθεί από μάσκα).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

## # getArray($name, $default, $hash)

Επιστρέφει έναν πίνακα, ο οποίος υποβάλλεται σε αναδρομική επεξεργασία για κατάργησηXSSκαι κακός κώδικας.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

## # getText($name, $default, $hash)

Επιστρέφει ακατέργαστο κείμενο χωρίς καθαρισμό. Χρησιμοποιήστε με προσοχή.

```php
$rawContent = Request::getText('raw_content', '');
```

## # getUrl($name, $default, $hash)

Επιστρέφει έναν επικυρωμένο ιστόURL(μόνο σχετικά, σχήματα http ή https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

## # getPath($name, $default, $hash)

Επιστρέφει ένα επικυρωμένο σύστημα αρχείων ή μια διαδρομή Ιστού.

```php
$filePath = Request::getPath('file', '');
```

## # getEmail($name, $default, $hash)

Επιστρέφει μια επικυρωμένη διεύθυνση email ή την προεπιλεγμένη.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

## # getIP($name, $default, $hash)

Επιστρέφει μια επικυρωμένη διεύθυνση IPv4 ή IPv6.

```php
$userIp = Request::getIP('client_ip', '');
```

## # getHeader($headerName, $default)

Επιστρέφει έναHTTPτιμή κεφαλίδας αιτήματος.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Βοηθητικές Μέθοδοι

## # έχειVar($name, $hash)

Ελέγξτε εάν υπάρχει μια μεταβλητή στον καθορισμένο κατακερματισμό.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

## # setVar($name, $value, $hash, $overwrite)

Ορίστε μια μεταβλητή στον καθορισμένο κατακερματισμό. Επιστρέφει την προηγούμενη τιμή ή μηδενική.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

## # παίρνω($hash, $mask)

Επιστρέφει ένα καθαρισμένο αντίγραφο ενός ολόκληρου πίνακα κατακερματισμού.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

## # σύνολο($array, $hash, $overwrite)

Ορίζει πολλές μεταβλητές από έναν πίνακα.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## Ενσωμάτωση εισόδου φίλτρου

Η κλάση Request χρησιμοποιεί `XMF\FilterInput` για καθαρισμό. Διαθέσιμοι τύποι φίλτρων:

| Τύπος | Περιγραφή |
|------|-------------|
|ALPHANUM / ALNUM| Μόνο αλφαριθμητικό |
|ARRAY| Καθαρίστε αναδρομικά κάθε στοιχείο |
|BASE64| Κωδικοποιημένη συμβολοσειρά Base64 |
|BOOLEAN / BOOL| Σωστό ή λάθος |
|CMD| Εντολή - A-Z, 0-9, κάτω παύλα, παύλα, τελεία (πεζά) |
|EMAIL| Έγκυρη διεύθυνση email |
|FLOAT / DOUBLE| Αριθμός κινητής υποδιαστολής |
|INTEGER / INT| Ακέραια τιμή |
| IP | Έγκυρη διεύθυνση IP |
|PATH| Σύστημα αρχείων ή διαδρομή Ιστού |
|STRING| Γενική συμβολοσειρά (προεπιλογή) |
|USERNAME| Μορφή ονόματος χρήστη |
|WEBURL| ΙστόςURL |
| WORD| Μόνο γράμματα Α-Ω και κάτω παύλα |

## Πρακτικά παραδείγματα

## # Επεξεργασία φόρμας

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

## # AJAXΧειριστής

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

## # Σελιδοποίηση

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

## # Φόρμα αναζήτησης

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Βέλτιστες πρακτικές ασφάλειας

1. **Να χρησιμοποιείτε πάντα μεθόδους για συγκεκριμένο τύπο** - Χρήση `getInt() ` για ταυτότητες,` getEmail()` για email κ.λπ.

2. **Παρέχετε λογικές προεπιλογές** - Μην υποθέτετε ποτέ ότι υπάρχει είσοδος

3. **Επικύρωση μετά την απολύμανση** - Η απολύμανση αφαιρεί τα κακά δεδομένα, η επικύρωση διασφαλίζει τα σωστά δεδομένα

4. **Χρησιμοποιήστε κατάλληλο κατακερματισμό** - ΠροσδιορίστεPOSTγια δεδομένα φόρμας,GETγια παραμέτρους ερωτήματος

5. **Αποφύγετε την ακατέργαστη εισαγωγή** - Χρησιμοποιήστε μόνο `getText() ` ή ` MASK_ALLOW_RAW` όταν είναι απολύτως απαραίτητο

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Δείτε επίσης

- Ξεκινώντας-με-XMF- ΒασικόXMFέννοιες
-XMF-Ενότητα-Βοηθός - Ενότητα βοηθητικής τάξης
- ../XMF-Πλαίσιο - Επισκόπηση πλαισίου

---

# XMF #request #security #input-validation #sanitization
