---
title: "Οδηγίες ασφαλείας"
---

## Επισκόπηση

Αυτό το έγγραφο περιγράφει τις βέλτιστες πρακτικές ασφάλειας για την ανάπτυξη του XOOPS, καλύπτοντας την επικύρωση εισόδου, την κωδικοποίηση εξόδου, τον έλεγχο ταυτότητας, την εξουσιοδότηση και την προστασία από κοινές ευπάθειες ιστού.

## Αρχές ασφάλειας

```mermaid
flowchart TB
    subgraph "Defense in Depth"
        A[Input Validation] --> B[Authentication]
        B --> C[Authorization]
        C --> D[Data Sanitization]
        D --> E[Output Encoding]
        E --> F[Audit Logging]
    end
```

## Επικύρωση εισόδου

## # Ζητήστε απολύμανση

```php
use Xoops\Core\Request;

// Always use typed getters
$id = Request::getInt('id', 0, 'GET');
$name = Request::getString('name', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');

// Never use raw $_GET/$_POST/$_REQUEST
// Bad: $id = $_GET['id'];
// Good: $id = Request::getInt('id', 0, 'GET');
```

## # Κανόνες επικύρωσης

```php
// Validate before use
if ($id <= 0) {
    throw new InvalidArgumentException('Invalid ID');
}

if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    throw new InvalidArgumentException('Invalid username format');
}

// Use whitelist validation for enums
$allowedStatuses = ['draft', 'published', 'archived'];
if (!in_array($status, $allowedStatuses, true)) {
    throw new InvalidArgumentException('Invalid status');
}
```

## SQL Πρόληψη ένεσης

## # Χρησιμοποιήστε παραμετροποιημένα ερωτήματα

```php
// GOOD: Parameterized query
$sql = "SELECT * FROM {$xoopsDB->prefix('users')} WHERE uid = ?";
$result = $xoopsDB->query($sql, [$userId]);

// BAD: String concatenation (vulnerable!)
// $sql = "SELECT * FROM users WHERE uid = " . $userId;
```

## # Χρήση αντικειμένων κριτηρίων

```php
use Criteria;
use CriteriaCompo;

$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', $userId, '='));
$criteria->add(new Criteria('created', time() - 86400, '>'));

$articles = $articleHandler->getObjects($criteria);
```

## XSS Πρόληψη

## # Κωδικοποίηση εξόδου

```php
use Xoops\Core\Text\Sanitizer;

// HTML context
$safeName = htmlspecialchars($userName, ENT_QUOTES, 'UTF-8');

// In templates (auto-escaped)
{$userName|escape}

// For rich content
$sanitizer = Sanitizer::getInstance();
$safeContent = $sanitizer->sanitizeForDisplay($content);
```

## # Πολιτική ασφάλειας περιεχομένου

```php
// Set CSP headers
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
```

## CSRF Προστασία

## # Εφαρμογή Token

```php
// Generate token
use Xoops\Core\Security;

$token = Security::createToken();

// In form
echo '<input type="hidden" name="XOOPS_TOKEN_REQUEST" value="' . $token . '">';

// Verify on submission
if (!Security::checkToken()) {
    die('Security token mismatch');
}
```

## # Χρήση XoopsForm

```php
// Automatically adds CSRF token
$form = new XoopsThemeForm('Edit Article', 'articleform', 'save.php');
$form->addElement(new XoopsFormHiddenToken());
```

## Έλεγχος ταυτότητας

## # Χειρισμός κωδικού πρόσβασης

```php
// Hash passwords (PHP 5.5+)
$hashedPassword = password_hash($plainPassword, PASSWORD_ARGON2ID);

// Verify passwords
if (password_verify($plainPassword, $storedHash)) {
    // Password correct
}

// Check if rehash needed
if (password_needs_rehash($storedHash, PASSWORD_ARGON2ID)) {
    $newHash = password_hash($plainPassword, PASSWORD_ARGON2ID);
    // Update stored hash
}
```

## # Ασφάλεια συνεδρίας

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Set secure session cookie options
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Lax');
```

## Εξουσιοδότηση

## # Έλεγχοι άδειας

```php
// Check module admin
if (!$xoopsUser || !$xoopsUser->isAdmin($xoopsModule->mid())) {
    redirect_header('index.php', 3, 'Access denied');
}

// Check group permissions
$grouppermHandler = xoops_getHandler('groupperm');
$groups = $xoopsUser ? $xoopsUser->getGroups() : [XOOPS_GROUP_ANONYMOUS];

if (!$grouppermHandler->checkRight('view_item', $itemId, $groups, $moduleId)) {
    throw new AccessDeniedException('Permission denied');
}
```

## # Πρόσβαση βάσει ρόλων

```php
class PermissionChecker
{
    public function canEdit(Article $article, ?XoopsUser $user): bool
    {
        if (!$user) {
            return false;
        }

        // Admin can edit anything
        if ($user->isAdmin()) {
            return true;
        }

        // Author can edit their own
        if ($article->getAuthorId() === $user->uid()) {
            return true;
        }

        // Check editor permission
        return $this->hasPermission($user, 'article_edit');
    }
}
```

## Ασφάλεια μεταφόρτωσης αρχείων

```php
class SecureUploader
{
    private array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    private array $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    public function validate(array $file): bool
    {
        // Check file size
        if ($file['size'] > 2 * 1024 * 1024) {
            throw new FileTooLargeException();
        }

        // Verify MIME type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $this->allowedMimeTypes, true)) {
            throw new InvalidFileTypeException();
        }

        // Check extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions, true)) {
            throw new InvalidFileTypeException();
        }

        // Generate safe filename
        return true;
    }

    public function generateSafeFilename(string $original): string
    {
        $extension = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        return bin2hex(random_bytes(16)) . '.' . $extension;
    }
}
```

## Καταγραφή ελέγχου

```php
class SecurityLogger
{
    public function logAuthAttempt(string $username, bool $success, string $ip): void
    {
        $data = [
            'username' => $username,
            'success' => $success,
            'ip' => $ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'timestamp' => time()
        ];

        // Log to database or file
        $this->log('auth', $data);
    }

    public function logSensitiveAction(int $userId, string $action, array $context): void
    {
        $data = [
            'user_id' => $userId,
            'action' => $action,
            'context' => json_encode($context),
            'ip' => $_SERVER['REMOTE_ADDR'],
            'timestamp' => time()
        ];

        $this->log('audit', $data);
    }
}
```

## Κεφαλίδες ασφαλείας

```php
// Recommended security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// HSTS (only for HTTPS sites)
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
```

## Περιορισμός ποσοστού

```php
class RateLimiter
{
    public function check(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        $cacheKey = 'rate_limit:' . $key;
        $attempts = (int) $this->cache->get($cacheKey, 0);

        if ($attempts >= $maxAttempts) {
            return false; // Rate limited
        }

        $this->cache->increment($cacheKey, 1, $windowSeconds);
        return true;
    }
}

// Usage
$limiter = new RateLimiter();
if (!$limiter->check('login:' . $ip, 5, 300)) {
    throw new TooManyRequestsException('Too many login attempts');
}
```

## Λίστα ελέγχου ασφαλείας

- [ ] Όλες οι εισροές χρήστη έχουν επικυρωθεί και απολυμανθεί
- [ ] Παραμετροποιημένα ερωτήματα για όλες τις λειτουργίες της βάσης δεδομένων
- [ ] Κωδικοποίηση εξόδου για όλο το περιεχόμενο που δημιουργείται από τον χρήστη
- [ ] CSRF διακριτικά σε όλες τις φόρμες που αλλάζουν κατάσταση
- [ ] Ασφαλής κατακερματισμός κωδικού πρόσβασης (Argon2id)
- [ ] Διαμορφώθηκε η ασφάλεια περιόδου λειτουργίας
- [ ] Επικύρωση μεταφόρτωσης αρχείου
- [ ] Σύνολο κεφαλίδων ασφαλείας
- [ ] Εφαρμόστηκε ο περιορισμός ποσοστού
- [ ] Η καταγραφή ελέγχου είναι ενεργοποιημένη
- [ ] Τα μηνύματα σφάλματος δεν διαρρέουν ευαίσθητες πληροφορίες

## Σχετική τεκμηρίωση

- Σύστημα ελέγχου ταυτότητας
- Σύστημα αδειών
- Επικύρωση εισόδου
