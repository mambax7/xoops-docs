---
title: "XOOPS brugersystem"
description: "XoopsUser klasse, XoopsGroup administration, brugergodkendelse, sessionshåndtering og adgangskontrol"
---

XOOPS brugersystemet administrerer brugerkonti, godkendelse, autorisation, gruppemedlemskab og sessionsstyring. Det giver en robust ramme til at sikre din applikation og kontrollere brugeradgang.

## Brugersystemarkitektur

```mermaid
graph TD
    A[User System] -->|manages| B[XoopsUser]
    A -->|manages| C[XoopsGroup]
    A -->|handles| D[Authentication]
    A -->|handles| E[Sessions]

    D -->|validates| F[Username/Password]
    D -->|validates| G[Email/Token]
    D -->|triggers| H[Post-Login Hooks]

    E -->|manages| I[Session Data]
    E -->|manages| J[Session Cookies]

    B -->|belongs to| C
    B -->|has| K[Permissions]
    B -->|has| L[Profile Data]

    C -->|defines| M[Access Levels]
    C -->|contains| N[Multiple Users]
```

## XoopsUser klasse

Hovedbrugerobjektklassen, der repræsenterer en brugerkonto.

### Klasseoversigt

```php
namespace Xoops\Core\User;

class XoopsUser extends XoopsObject
{
    protected int $uid = 0;
    protected string $uname = '';
    protected string $email = '';
    protected string $pass = '';
    protected int $uregdate = 0;
    protected int $ulevel = 0;
    protected array $groups = [];
    protected array $permissions = [];
}
```

### Konstruktør

```php
public function __construct(int $uid = null)
```

Opretter et nyt brugerobjekt, som eventuelt indlæses fra databasen efter ID.

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$uid` | int | Bruger-id til indlæsning (valgfrit) |

**Eksempel:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### Kerneegenskaber

| Ejendom | Skriv | Beskrivelse |
|--------|------|------------|
| `uid` | int | Bruger ID |
| `uname` | streng | Brugernavn |
| `email` | streng | E-mailadresse |
| `pass` | streng | Adgangskode hash |
| `uregdate` | int | Registreringstidsstempel |
| `ulevel` | int | Brugerniveau (9=admin, 1=bruger) |
| `groups` | række | Gruppe-id'er |
| `permissions` | række | Tilladelsesflag |

### Kernemetoder

#### getID / getUid

Henter brugerens ID.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Returneringer:** `int` - Bruger-id

**Eksempel:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Henter brugerens visningsnavn.

```php
public function getUnameReal(): string
```

**Returneringer:** `string` - Brugerens rigtige navn

**Eksempel:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getE-mail

Henter brugerens e-mailadresse.

```php
public function getEmail(): string
```

**Returneringer:** `string` - E-mailadresse

**Eksempel:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Henter eller indstiller en brugervariabel.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Eksempel:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Får brugerens gruppemedlemskaber.

```php
public function getGroups(): array
```

**Returneringer:** `array` - række af gruppe-id'er

**Eksempel:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### er i gruppe

Kontrollerer, om brugeren tilhører en gruppe.

```php
public function isInGroup(int $groupId): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$groupId` | int | Gruppe-id for at kontrollere |

**Returneringer:** `bool` - Sandt, hvis i gruppe

**Eksempel:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### er Admin

Kontrollerer, om brugeren er administrator.

```php
public function isAdmin(): bool
```

**Returneringer:** `bool` - Sandt, hvis admin

**Eksempel:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Får brugerprofiloplysninger.

```php
public function getProfile(): array
```

**Returneringer:** `array` - Profildata

**Eksempel:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### er Aktiv

Kontrollerer om brugerkontoen er aktiv.

```php
public function isActive(): bool
```

**Returneringer:** `bool` - Sand, hvis aktiv

**Eksempel:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### updateLastLogin

Opdaterer brugerens sidste login-tidsstempel.

```php
public function updateLastLogin(): bool
```

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XoopsGroup klasse

Administrerer brugergrupper og tilladelser.

### Klasseoversigt

```php
namespace Xoops\Core\User;

class XoopsGroup extends XoopsObject
{
    protected int $groupid = 0;
    protected string $name = '';
    protected string $description = '';
    protected int $group_type = 0;
    protected array $users = [];
}
```

### Konstanter

| Konstant | Værdi | Beskrivelse |
|--------|--------|------------|
| `TYPE_NORMAL` | 0 | Normal brugergruppe |
| `TYPE_ADMIN` | 1 | Administrativ gruppe |
| `TYPE_SYSTEM` | 2 | Systemgruppe |

### Metoder

#### getName

Henter gruppenavnet.

```php
public function getName(): string
```

**Returneringer:** `string` - Gruppenavn

**Eksempel:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Henter gruppebeskrivelsen.

```php
public function getDescription(): string
```

**Returneringer:** `string` - Beskrivelse

**Eksempel:**
```php
echo $group->getDescription();
```

#### getUsers

Får gruppemedlemmer.

```php
public function getUsers(): array
```

**Returneringer:** `array` - række af bruger-id'er

**Eksempel:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

Tilføjer en bruger til gruppen.

```php
public function addUser(int $uid): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$uid` | int | Bruger ID |

**Returneringer:** `bool` - Sand på succes

**Eksempel:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### fjern Bruger

Fjerner en bruger fra gruppen.

```php
public function removeUser(int $uid): bool
```

**Eksempel:**
```php
$group->removeUser(123);
```

## Brugergodkendelse

### Loginproces

```php
/**
 * User login
 */
function xoops_user_login(string $uname, string $pass, bool $rememberMe = false): ?XoopsUser
{
    global $xoopsDB;

    // Sanitize username
    $uname = trim($uname);

    // Get user from database
    $query = $xoopsDB->prepare(
        'SELECT * FROM ' . $xoopsDB->prefix('users') .
        ' WHERE uname = ? AND active = 1'
    );
    $query->bind_param('s', $uname);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        return null; // User not found
    }

    $row = $result->fetch_assoc();

    // Verify password
    if (!password_verify($pass, $row['pass'])) {
        return null; // Invalid password
    }

    // Load user object
    $user = new XoopsUser($row['uid']);

    // Update last login
    $user->updateLastLogin();

    // Handle "Remember Me"
    if ($rememberMe) {
        // Set persistent cookie
        setcookie(
            'xoops_user_remember',
            $user->uid(),
            time() + (30 * 24 * 60 * 60), // 30 days
            '/',
            $_SERVER['HTTP_HOST'] ?? ''
        );
    }

    return $user;
}
```

### Adgangskodehåndtering

```php
/**
 * Hash password securely
 */
function xoops_hash_password(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT, [
        'cost' => 12
    ]);
}

/**
 * Verify password
 */
function xoops_verify_password(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

/**
 * Check if password needs rehashing
 */
function xoops_password_needs_rehash(string $hash): bool
{
    return password_needs_rehash($hash, PASSWORD_BCRYPT, [
        'cost' => 12
    ]);
}
```

## Sessionsstyring

### Sessionsklasse

```php
namespace Xoops\Core;

class SessionManager
{
    protected array $data = [];
    protected string $sessionId = '';

    public function start(): void {}
    public function get(string $key): mixed {}
    public function set(string $key, mixed $value): void {}
    public function destroy(): void {}
}
```

### Sessionsmetoder

#### Start session

```php
<?php
session_start();

// Regenerate session ID for security
session_regenerate_id(true);

// Set session timeout
ini_set('session.gc_maxlifetime', 3600); // 1 hour

// Store user in session
if ($user) {
    $_SESSION['xoops_user'] = $user;
    $_SESSION['xoops_uid'] = $user->getID();
    $_SESSION['xoops_uname'] = $user->getVar('uname');
}
```

#### Tjek session

```php
/**
 * Get current user from session
 */
function xoops_get_current_user(): ?XoopsUser
{
    if (isset($_SESSION['xoops_user']) && $_SESSION['xoops_user'] instanceof XoopsUser) {
        return $_SESSION['xoops_user'];
    }
    return null;
}

/**
 * Check if user is logged in
 */
function xoops_is_user_logged_in(): bool
{
    return isset($_SESSION['xoops_uid']) && $_SESSION['xoops_uid'] > 0;
}
```

#### Ødelæg session

```php
/**
 * User logout
 */
function xoops_user_logout()
{
    global $xoopsUser;

    // Log the logout
    if ($xoopsUser) {
        error_log('User ' . $xoopsUser->getVar('uname') . ' logged out');
    }

    // Destroy session data
    $_SESSION = [];

    // Delete session cookie
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    // Destroy session
    session_destroy();
}
```

## Tilladelsessystem

### Tilladelseskonstanter| Konstant | Værdi | Beskrivelse |
|--------|--------|------------|
| `XOOPS_PERMISSION_NONE` | 0 | Ingen tilladelse |
| `XOOPS_PERMISSION_VIEW` | 1 | Se indhold |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Indsend indhold |
| `XOOPS_PERMISSION_EDIT` | 4 | Rediger indhold |
| `XOOPS_PERMISSION_DELETE` | 8 | Slet indhold |
| `XOOPS_PERMISSION_ADMIN` | 16 | Admin adgang |

### Tilladelseskontrol

```php
/**
 * Check if user has permission
 */
function xoops_check_permission($user, $resource, $permission)
{
    if (!$user) {
        return false;
    }

    // Admins have all permissions
    if ($user->isAdmin()) {
        return true;
    }

    // Check group permissions
    $groups = $user->getGroups();
    foreach ($groups as $groupId) {
        if (xoops_group_has_permission($groupId, $resource, $permission)) {
            return true;
        }
    }

    return false;
}
```

## Brugerbehandler

UserHandler administrerer brugervedholdenhedsoperationer.

```php
/**
 * Get user handler
 */
$userHandler = xoops_getHandler('user');

/**
 * Create new user
 */
$user = new XoopsUser();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'user@example.com');
$user->setVar('pass', xoops_hash_password('password123'));
$user->setVar('uregdate', time());
$user->setVar('uactive', 1);

if ($userHandler->insert($user)) {
    echo 'User created with ID: ' . $user->getID();
}

/**
 * Update user
 */
$user = $userHandler->get(123);
$user->setVar('email', 'newemail@example.com');
$userHandler->insert($user);

/**
 * Get user by name
 */
$user = $userHandler->findByUsername('john');

/**
 * Delete user
 */
$userHandler->delete($user);

/**
 * Search users
 */
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('uname', '%admin%', 'LIKE'));
$users = $userHandler->getObjects($criteria);
```

## Komplet eksempel på brugeradministration

```php
<?php
/**
 * Complete user authentication and profile example
 */

require_once XOOPS_ROOT_PATH . '/include/common.inc.php';

$xoopsUser = $GLOBALS['xoopsUser'];

// Check if user is logged in
if (!$xoopsUser || !$xoopsUser->isActive()) {
    redirect_header(XOOPS_URL, 3, 'Please login');
}

// Get user handler
$userHandler = xoops_getHandler('user');

// Get current user with fresh data
$currentUser = $userHandler->get($xoopsUser->getID());

// User profile page
echo '<h1>Profile: ' . htmlspecialchars($currentUser->getVar('uname')) . '</h1>';

echo '<div class="user-profile">';
echo '<p><strong>Username:</strong> ' . htmlspecialchars($currentUser->getVar('uname')) . '</p>';
echo '<p><strong>Email:</strong> ' . htmlspecialchars($currentUser->getVar('email')) . '</p>';
echo '<p><strong>Registered:</strong> ' . date('Y-m-d H:i:s', $currentUser->getVar('uregdate')) . '</p>';
echo '<p><strong>Groups:</strong> ';

$groupHandler = xoops_getHandler('group');
$groups = $currentUser->getGroups();
$groupNames = [];
foreach ($groups as $groupId) {
    $group = $groupHandler->get($groupId);
    if ($group) {
        $groupNames[] = htmlspecialchars($group->getName());
    }
}
echo implode(', ', $groupNames);
echo '</p>';

// Admin status
if ($currentUser->isAdmin()) {
    echo '<p><strong>Status:</strong> Administrator</p>';
}

echo '</div>';

// Change password form
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['change_password'])) {
    $oldPassword = $_POST['old_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // Verify old password
    if (!password_verify($oldPassword, $currentUser->getVar('pass'))) {
        echo '<div class="error">Current password is incorrect</div>';
    } elseif ($newPassword !== $confirmPassword) {
        echo '<div class="error">New passwords do not match</div>';
    } elseif (strlen($newPassword) < 6) {
        echo '<div class="error">Password must be at least 6 characters</div>';
    } else {
        // Update password
        $currentUser->setVar('pass', xoops_hash_password($newPassword));
        if ($userHandler->insert($currentUser)) {
            echo '<div class="success">Password changed successfully</div>';
        } else {
            echo '<div class="error">Failed to update password</div>';
        }
    }
}

// Password change form
echo '<form method="post">';
echo '<h3>Change Password</h3>';
echo '<div class="form-group">';
echo '<label>Current Password:</label>';
echo '<input type="password" name="old_password" required>';
echo '</div>';
echo '<div class="form-group">';
echo '<label>New Password:</label>';
echo '<input type="password" name="new_password" required>';
echo '</div>';
echo '<div class="form-group">';
echo '<label>Confirm Password:</label>';
echo '<input type="password" name="confirm_password" required>';
echo '</div>';
echo '<button type="submit" name="change_password">Change Password</button>';
echo '</form>';
```

## Bedste praksis

1. **Hash-adgangskoder** - Brug altid bcrypt eller argon2 til hashing af adgangskoder
2. **Valider input** - Valider og sanér alle brugerinput
3. **Tjek tilladelser** - Bekræft altid brugertilladelser før handlinger
4. **Brug sessioner sikkert** - Gendan sessions-id'er ved login
5. **Log aktiviteter** - Log ind, log ud og kritiske handlinger
6. **Satsbegrænsning** - Implementer hastighedsbegrænsning for loginforsøg
7. Kun **HTTPS** - Brug altid HTTPS til godkendelse
8. **Gruppestyring** - Brug grupper til tilladelsesorganisation

## Relateret dokumentation

- ../Kernel/Kernel-Classes - Kerneltjenester og bootstrapping
- ../Database/QueryBuilder - Databaseforespørgsler til brugerdata
- ../Core/XoopsObject - Basisobjektklasse

---

*Se også: [XOOPS Bruger API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP Security](https://www.php.net/manual/en/book.password.php)*
