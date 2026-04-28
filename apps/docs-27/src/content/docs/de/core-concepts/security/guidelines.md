---
title: "Sicherheitsrichtlinien"
---

## Übersicht

Dieses Dokument beschreibt Sicherheits-Best-Practices für die XOOPS-Entwicklung, die Eingabevalidierung, Ausgabe-Kodierung, Authentifizierung, Autorisierung und Schutz vor häufigen Webanfälligkeiten abdecken.

## Sicherheitsprinzipien

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

## Eingabevalidierung

### Anfrage-Bereinigung

```php
use Xoops\Core\Request;

// Verwenden Sie immer typisierte Getter
$id = Request::getInt('id', 0, 'GET');
$name = Request::getString('name', '', 'POST');
$email = Request::getEmail('email', '', 'POST');
$url = Request::getUrl('website', '', 'POST');

// Verwenden Sie niemals rohes $_GET/$_POST/$_REQUEST
// Falsch: $id = $_GET['id'];
// Richtig: $id = Request::getInt('id', 0, 'GET');
```

### Validierungsregeln

```php
// Validieren vor der Verwendung
if ($id <= 0) {
    throw new InvalidArgumentException('Invalid ID');
}

if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    throw new InvalidArgumentException('Invalid username format');
}

// Verwenden Sie Whitelist-Validierung für Enums
$allowedStatuses = ['draft', 'published', 'archived'];
if (!in_array($status, $allowedStatuses, true)) {
    throw new InvalidArgumentException('Invalid status');
}
```

## SQL-Injection-Prävention

### Parametrisierte Abfragen verwenden

```php
// GUT: Parametrisierte Abfrage
$sql = "SELECT * FROM {$xoopsDB->prefix('users')} WHERE uid = ?";
$result = $xoopsDB->query($sql, [$userId]);

// FALSCH: String-Verkettung (anfällig!)
// $sql = "SELECT * FROM users WHERE uid = " . $userId;
```

### Verwendung von Criteria-Objekten

```php
use Criteria;
use CriteriaCompo;

$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', $userId, '='));
$criteria->add(new Criteria('created', time() - 86400, '>'));

$articles = $articleHandler->getObjects($criteria);
```

## XSS-Prävention

### Ausgabe-Kodierung

```php
use Xoops\Core\Text\Sanitizer;

// HTML-Kontext
$safeName = htmlspecialchars($userName, ENT_QUOTES, 'UTF-8');

// In Templates (automatisch escaped)
{$userName|escape}

// Für Rich-Content
$sanitizer = Sanitizer::getInstance();
$safeContent = $sanitizer->sanitizeForDisplay($content);
```

### Content Security Policy

```php
// CSP-Header setzen
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
```

## CSRF-Schutz

### Token-Implementierung

```php
// Token generieren
use Xoops\Core\Security;

$token = Security::createToken();

// Im Formular
echo '<input type="hidden" name="XOOPS_TOKEN_REQUEST" value="' . $token . '">';

// Bei Übermittlung überprüfen
if (!Security::checkToken()) {
    die('Security token mismatch');
}
```

### Verwendung von XoopsForm

```php
// Fügt CSRF-Token automatisch hinzu
$form = new XoopsThemeForm('Edit Article', 'articleform', 'save.php');
$form->addElement(new XoopsFormHiddenToken());
```

## Authentifizierung

### Passwort-Verwaltung

```php
// Passwörter hashen (PHP 5.5+)
$hashedPassword = password_hash($plainPassword, PASSWORD_ARGON2ID);

// Passwörter überprüfen
if (password_verify($plainPassword, $storedHash)) {
    // Passwort korrekt
}

// Überprüfen Sie, ob Rehashing erforderlich ist
if (password_needs_rehash($storedHash, PASSWORD_ARGON2ID)) {
    $newHash = password_hash($plainPassword, PASSWORD_ARGON2ID);
    // Gespeicherten Hash aktualisieren
}
```

### Sitzungssicherheit

```php
// Session-ID nach dem Login regenerieren
session_regenerate_id(true);

// Sichere Session-Cookie-Optionen setzen
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Lax');
```

## Autorisierung

### Berechtigungsprüfungen

```php
// Admin-Modul überprüfen
if (!$xoopsUser || !$xoopsUser->isAdmin($xoopsModule->mid())) {
    redirect_header('index.php', 3, 'Access denied');
}

// Gruppengenehmigungen überprüfen
$grouppermHandler = xoops_getHandler('groupperm');
$groups = $xoopsUser ? $xoopsUser->getGroups() : [XOOPS_GROUP_ANONYMOUS];

if (!$grouppermHandler->checkRight('view_item', $itemId, $groups, $moduleId)) {
    throw new AccessDeniedException('Permission denied');
}
```

### Rollenbasierter Zugriff

```php
class PermissionChecker
{
    public function canEdit(Article $article, ?XoopsUser $user): bool
    {
        if (!$user) {
            return false;
        }

        // Admin kann alles bearbeiten
        if ($user->isAdmin()) {
            return true;
        }

        // Autor kann sein eigenes bearbeiten
        if ($article->getAuthorId() === $user->uid()) {
            return true;
        }

        // Editor-Berechtigung überprüfen
        return $this->hasPermission($user, 'article_edit');
    }
}
```

## Datei-Upload-Sicherheit

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
        // Dateigröße überprüfen
        if ($file['size'] > 2 * 1024 * 1024) {
            throw new FileTooLargeException();
        }

        // MIME-Typ überprüfen
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $this->allowedMimeTypes, true)) {
            throw new InvalidFileTypeException();
        }

        // Erweiterung überprüfen
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions, true)) {
            throw new InvalidFileTypeException();
        }

        // Sicheren Dateinamen generieren
        return true;
    }

    public function generateSafeFilename(string $original): string
    {
        $extension = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        return bin2hex(random_bytes(16)) . '.' . $extension;
    }
}
```

## Audit-Protokollierung

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

        // In Datenbank oder Datei protokollieren
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

## Sicherheits-Header

```php
// Empfohlene Sicherheits-Header
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// HSTS (nur für HTTPS-Websites)
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
```

## Rate-Limiting

```php
class RateLimiter
{
    public function check(string $key, int $maxAttempts, int $windowSeconds): bool
    {
        $cacheKey = 'rate_limit:' . $key;
        $attempts = (int) $this->cache->get($cacheKey, 0);

        if ($attempts >= $maxAttempts) {
            return false; // Rate Limited
        }

        $this->cache->increment($cacheKey, 1, $windowSeconds);
        return true;
    }
}

// Verwendung
$limiter = new RateLimiter();
if (!$limiter->check('login:' . $ip, 5, 300)) {
    throw new TooManyRequestsException('Too many login attempts');
}
```

## Sicherheits-Checkliste

- [ ] Alle Benutzereingaben validiert und bereinigt
- [ ] Parametrisierte Abfragen für alle Datenbankoperationen
- [ ] Ausgabe-Kodierung für alle benutzergenerierten Inhalte
- [ ] CSRF-Tokens in allen statusändernden Formularen
- [ ] Sichere Passwort-Hash (Argon2id)
- [ ] Sitzungssicherheit konfiguriert
- [ ] Datei-Upload-Validierung
- [ ] Sicherheits-Header gesetzt
- [ ] Rate-Limiting implementiert
- [ ] Audit-Protokollierung aktiviert
- [ ] Fehlermeldungen geben keine sensiblen Informationen preis

## Verwandte Dokumentation

- Authentication System
- Permission System
- Input Validation
