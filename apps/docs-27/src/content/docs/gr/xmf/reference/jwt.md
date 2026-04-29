---
title: "JWT - JSON Διακριτικά Ιστού"
description: "Υλοποίηση XMF JWT για ασφαλή έλεγχο ταυτότητας βάσει διακριτικών και προστασία AJAX"
---

Ο χώρος ονομάτων `XMF\Jwt` παρέχει υποστήριξη JSON Web Token (JWT) για μονάδες XOOPS. Τα JWT επιτρέπουν τον ασφαλή έλεγχο ταυτότητας χωρίς πολιτεία και είναι ιδιαίτερα χρήσιμοι για την προστασία αιτημάτων AJAX.

## Τι είναι τα JSON Διακριτικά Ιστού;

Τα JSON Τα Διακριτικά Ιστού είναι ένας τυπικός τρόπος δημοσίευσης ενός συνόλου *αξιώσεων* (δεδομένων) ως συμβολοσειρά κειμένου, με κρυπτογραφική επαλήθευση ότι οι αξιώσεις δεν έχουν παραβιαστεί. Για αναλυτικές προδιαγραφές, δείτε:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

## # Βασικά Χαρακτηριστικά

- **Υπογεγραμμένο**: Τα διακριτικά υπογράφονται κρυπτογραφικά για τον εντοπισμό παραβίασης
- **Αυτοδύναμη**: Όλες οι απαραίτητες πληροφορίες βρίσκονται στο ίδιο το διακριτικό
- **Stateless**: Δεν απαιτείται αποθήκευση περιόδου λειτουργίας από την πλευρά του διακομιστή
- **Λήγιμο**: Τα διακριτικά μπορούν να περιλαμβάνουν χρόνους λήξης

> **Σημείωση:** Τα JWT είναι υπογεγραμμένα, όχι κρυπτογραφημένα. Τα δεδομένα είναι κωδικοποιημένα και ορατά στο Base64. Χρησιμοποιήστε JWT για επαλήθευση ακεραιότητας, όχι για απόκρυψη ευαίσθητων δεδομένων.

## Γιατί να χρησιμοποιήσετε το JWT στο XOOPS;

## # Το πρόβλημα AJAX Token

Οι φόρμες XOOPS χρησιμοποιούν διακριτικά nonce για προστασία CSRF. Ωστόσο, οι nonces λειτουργούν άσχημα με το AJAX επειδή:

1. **Μία χρήση**: Οι μη ισχύουν συνήθως για μία υποβολή
2. **Ασύγχρονα ζητήματα**: Πολλά αιτήματα AJAX ενδέχεται να φτάσουν εκτός λειτουργίας
3. **Πολυπλοκότητα ανανέωσης**: Δεν υπάρχει αξιόπιστος τρόπος για ασύγχρονη ανανέωση των διακριτικών
4. **Context Binding**: Τα τυπικά διακριτικά δεν επαληθεύουν το σενάριο που τα εξέδωσε

## # JWT Πλεονεκτήματα

Τα JWT λύνουν αυτά τα προβλήματα με:

- Συμπεριλαμβανομένου χρόνου λήξης (`exp` αξίωση) για χρονικά περιορισμένη ισχύ
- Υποστήριξη προσαρμοσμένων αξιώσεων για τη σύνδεση διακριτικών σε συγκεκριμένα σενάρια
- Ενεργοποίηση πολλαπλών αιτημάτων εντός της περιόδου ισχύος
- Παροχή κρυπτογραφικής επαλήθευσης συμβολικής προέλευσης

## Βασικές τάξεις

## # JsonWebToken

Η κλάση `XMF\Jwt\JsonWebToken` χειρίζεται τη δημιουργία και την αποκωδικοποίηση διακριτικών.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Create a key
$key = KeyFactory::build('my_application_key');

// Create a JsonWebToken instance
$jwt = new JsonWebToken($key, 'HS256');

// Create a token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expires in 300 seconds

// Decode and verify a token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

### # Μέθοδοι

**`new JsonWebToken($key, $algorithm)`**

Δημιουργεί ένα νέο πρόγραμμα χειρισμού JWT.
- `$key `: Ένα αντικείμενο ` XMF\Key\KeyAbstract`
- `$algorithm`: Αλγόριθμος υπογραφής (προεπιλογή: 'HS256')

**`create($payload, $expirationOffset)`**

Δημιουργεί μια υπογεγραμμένη συμβολοσειρά διακριτικού.
- `$payload`: Σειρά αξιώσεων
- `$expirationOffset`: Δευτερόλεπτα μέχρι τη λήξη (προαιρετικό)

**`decode($jwtString, $assertClaims)`**

Αποκωδικοποιεί και επικυρώνει ένα διακριτικό.
- `$jwtString`: Το διακριτικό για αποκωδικοποίηση
- `$assertClaims`: Αξιώσεις για επαλήθευση (κενός πίνακας για κανένα)
- Επιστρέφει: ωφέλιμο φορτίο stdClass ή false εάν δεν είναι έγκυρο

**`setAlgorithm($algorithm)`**

Αλλάζει τον αλγόριθμο signing/verification.

## # TokenFactory

Το `XMF\Jwt\TokenFactory` παρέχει έναν βολικό τρόπο δημιουργίας διακριτικών.

```php
use Xmf\Jwt\TokenFactory;

// Create a token with automatic key handling
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expires in 120 seconds
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: συμβολοσειρά ονόματος κλειδιού ή αντικείμενο KeyAbstract
- `$payload`: Σειρά αξιώσεων
- `$expirationOffset`: Λήξη σε δευτερόλεπτα

Βάζει εξαιρέσεις σε περίπτωση αποτυχίας: `DomainException `, ` InvalidArgumentException `, ` UnexpectedValueException`

## # TokenReader

Η κλάση `XMF\Jwt\TokenReader` απλοποιεί την ανάγνωση διακριτικών από διάφορες πηγές.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// From a string
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// From a cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// From a request parameter
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// From Authorization header (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Όλες οι μέθοδοι επιστρέφουν το ωφέλιμο φορτίο ως `stdClass ` ή ` false` εάν δεν είναι έγκυρο.

## # KeyFactory

Το `XMF\Jwt\KeyFactory` δημιουργεί και διαχειρίζεται κρυπτογραφικά κλειδιά.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Τα κλειδιά αποθηκεύονται επίμονα. Η προεπιλεγμένη αποθήκευση χρησιμοποιεί το σύστημα αρχείων.

## AJAX Παράδειγμα προστασίας

Ακολουθεί ένα πλήρες παράδειγμα που δείχνει το JWT-προστατευμένο AJAX.

## # Σενάριο σελίδας (Δημιουργεί διακριτικό)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims to include and verify
$assertClaims = ['aud' => basename(__FILE__)];

// Check if this is an AJAX request
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Handle AJAX request
    $GLOBALS['xoopsLogger']->activated = false;

    // Verify the token from the Authorization header
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token is valid - process the request
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Your AJAX logic here
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Regular page request - generate token and display page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Create token with claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valid for 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript for AJAX calls
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Update UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Βέλτιστες πρακτικές

## # Λήξη διακριτικού

Ορίστε τους κατάλληλους χρόνους λήξης με βάση την περίπτωση χρήσης:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

## # Επαλήθευση αξίωσης

Επαληθεύετε πάντα την αξίωση `aud` (κοινό) για να βεβαιωθείτε ότι τα διακριτικά χρησιμοποιούνται με το προβλεπόμενο σενάριο:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

## # Ονομασία κλειδιού

Χρησιμοποιήστε περιγραφικά ονόματα κλειδιών για διαφορετικούς σκοπούς:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

## # Χειρισμός σφαλμάτων

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Invalid algorithm
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Invalid argument
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Unexpected value
    error_log('JWT Error: ' . $e->getMessage());
}

// Reading tokens returns false on failure (no exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token invalid, expired, or tampered
}
```

## Μέθοδοι μεταφοράς διακριτικών

## # Κεφαλίδα εξουσιοδότησης (Συνιστάται)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

## # Μπισκότο

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

## # Παράμετρος αιτήματος

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Θέματα ασφαλείας

1. **Χρησιμοποιήστε HTTPS**: Χρησιμοποιείτε πάντα HTTPS για να αποτρέψετε την υποκλοπή διακριτικών
2. **Σύντομη λήξη**: Χρησιμοποιήστε τον συντομότερο πρακτικό χρόνο λήξης
3. **Συγκεκριμένες αξιώσεις**: Συμπεριλάβετε αξιώσεις που συνδέουν διακριτικά με συγκεκριμένα περιβάλλοντα
4. **Επικύρωση από την πλευρά του διακομιστή**: Να επικυρώνετε πάντα τα διακριτικά από την πλευρά του διακομιστή
5. **Μην αποθηκεύετε ευαίσθητα δεδομένα**: Να θυμάστε ότι τα διακριτικά είναι αναγνώσιμα (όχι κρυπτογραφημένα)

## API Αναφορά

## # XMF\Jwt\JsonWebToken

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `__construct($key, $algorithm)` | Δημιουργία χειριστή JWT |
| `setAlgorithm($algorithm)` | Ορισμός αλγόριθμου υπογραφής |
| `create($payload, $expiration)` | Δημιουργία υπογεγραμμένου διακριτικού |
| `decode($token, $assertClaims)` | Αποκωδικοποίηση και επαλήθευση διακριτικού |

## # XMF\Jwt\TokenFactory

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `build($key, $payload, $expiration)` | Δημιουργία συμβολοσειράς |

## # XMF\Jwt\TokenReader

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `fromString($key, $token, $claims)` | Αποκωδικοποίηση από συμβολοσειρά |
| `fromCookie($key, $name, $claims)` | Αποκωδικοποίηση από cookie |
| `fromRequest($key, $name, $claims)` | Αποκωδικοποίηση από αίτημα |
| `fromHeader($key, $claims, $header)` | Αποκωδικοποίηση από κεφαλίδα |

## # XMF\Jwt\KeyFactory

| Μέθοδος | Περιγραφή |
|--------|-------------|
| `build($name, $storage)` | Λήψη ή δημιουργία κλειδιού |

## Δείτε επίσης

- ../Basics/XMF-Request - Request handling
- ../XMF-Framework - Επισκόπηση πλαισίου
- Βάση δεδομένων - Βοηθητικά προγράμματα βάσεων δεδομένων

---

# XMF #jwt #security #ajax #authentication #tokens
