---
title: "XOOPS-gebruikerssysteem"
description: "XoopsUser-klasse, XoopsGroup-beheer, gebruikersauthenticatie, sessieafhandeling en toegangscontrole"
---
Het XOOPS-gebruikerssysteem beheert gebruikersaccounts, authenticatie, autorisatie, groepslidmaatschap en sessiebeheer. Het biedt een robuust raamwerk voor het beveiligen van uw applicatie en het controleren van gebruikerstoegang.

## Gebruikerssysteemarchitectuur

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

## XoopsGebruikersklasse

De hoofdgebruikersobjectklasse die een gebruikersaccount vertegenwoordigt.

### Klassenoverzicht

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

### Constructeur

```php
public function __construct(int $uid = null)
```

Creëert een nieuw gebruikersobject, optioneel geladen vanuit de database op ID.

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$uid` | int | Gebruikers-ID om te laden (optioneel) |

**Voorbeeld:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### Kerneigenschappen

| Eigendom | Typ | Beschrijving |
|----------|------|-------------|
| `uid` | int | Gebruikers-ID |
| `uname` | tekenreeks | Gebruikersnaam |
| `email` | tekenreeks | E-mailadres |
| `pass` | tekenreeks | Wachtwoordhash |
| `uregdate` | int | Registratietijdstempel |
| `ulevel` | int | Gebruikersniveau (9=admin, 1=gebruiker) |
| `groups` | array | Groeps-ID's |
| `permissions` | array | Toestemmingsvlaggen |

### Kernmethoden

#### getID / getUid

Haalt de ID van de gebruiker op.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Retourzendingen:** `int` - Gebruikers-ID

**Voorbeeld:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Haalt de weergavenaam van de gebruiker op.

```php
public function getUnameReal(): string
```

**Retourzendingen:** `string` - Echte naam van de gebruiker

**Voorbeeld:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### ontvang e-mail

Haalt het e-mailadres van de gebruiker op.

```php
public function getEmail(): string
```

**Retourzendingen:** `string` - E-mailadres

**Voorbeeld:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar /setVar

Haalt of stelt een gebruikersvariabele in.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Voorbeeld:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Haalt de groepslidmaatschappen van de gebruiker op.

```php
public function getGroups(): array
```

**Retourneert:** `array` - Array van groeps-ID's

**Voorbeeld:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

Controleert of de gebruiker tot een groep behoort.

```php
public function isInGroup(int $groupId): bool
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$groupId` | int | Groeps-ID om te controleren |

**Retourneert:** `bool` - Waar indien in groep

**Voorbeeld:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### isAdmin

Controleert of de gebruiker een beheerder is.

```php
public function isAdmin(): bool
```

**Retourzendingen:** `bool` - Waar als beheerder

**Voorbeeld:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfiel

Haalt gebruikersprofielinformatie op.

```php
public function getProfile(): array
```

**Retourzendingen:** `array` - Profielgegevens

**Voorbeeld:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### isActief

Controleert of het gebruikersaccount actief is.

```php
public function isActive(): bool
```

**Retourneert:** `bool` - Waar indien actief

**Voorbeeld:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### updateLaatsteLogin

Werkt de tijdstempel van de laatste login van de gebruiker bij.

```php
public function updateLastLogin(): bool
```

**Retourzendingen:** `bool` - Klopt bij succes

**Voorbeeld:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XoopsGroepsles

Beheert gebruikersgroepen en machtigingen.

### Klassenoverzicht

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

### Constanten

| Constante | Waarde | Beschrijving |
|----------|-------|------------|
| `TYPE_NORMAL` | 0 | Normale gebruikersgroep |
| `TYPE_ADMIN` | 1 | Administratieve groep |
| `TYPE_SYSTEM` | 2 | Systeemgroep |

### Methoden

#### getName

Haalt de groepsnaam op.

```php
public function getName(): string
```

**Retourneert:** `string` - Groepsnaam

**Voorbeeld:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Haalt de groepsbeschrijving op.

```php
public function getDescription(): string
```

**Retourzendingen:** `string` - Beschrijving

**Voorbeeld:**
```php
echo $group->getDescription();
```

#### getUsers

Krijgt groepsleden.

```php
public function getUsers(): array
```

**Retourneert:** `array` - Array van gebruikers-ID's

**Voorbeeld:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### gebruiker toevoegen

Voegt een gebruiker toe aan de groep.

```php
public function addUser(int $uid): bool
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$uid` | int | Gebruikers-ID |

**Retourzendingen:** `bool` - Klopt bij succes

**Voorbeeld:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### verwijderGebruiker

Verwijdert een gebruiker uit de groep.

```php
public function removeUser(int $uid): bool
```

**Voorbeeld:**
```php
$group->removeUser(123);
```

## Gebruikersauthenticatie

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

### Wachtwoordbeheer

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

## Sessiebeheer

### Sessieles

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

### Sessiemethoden

#### Sessie starten

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

#### Sessie controleren

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

#### Sessie vernietigen

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

## Toestemmingssysteem

### Toestemmingsconstanten| Constante | Waarde | Beschrijving |
|----------|-------|------------|
| `XOOPS_PERMISSION_NONE` | 0 | Geen toestemming |
| `XOOPS_PERMISSION_VIEW` | 1 | Bekijk inhoud |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Inhoud indienen |
| `XOOPS_PERMISSION_EDIT` | 4 | Inhoud bewerken |
| `XOOPS_PERMISSION_DELETE` | 8 | Inhoud verwijderen |
| `XOOPS_PERMISSION_ADMIN` | 16 | Beheerderstoegang |

### Toestemmingscontrole

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

## Gebruikershandler

De UserHandler beheert gebruikerspersistentiebewerkingen.

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

## Compleet voorbeeld van gebruikersbeheer

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

## Beste praktijken

1. **Hash-wachtwoorden** - Gebruik altijd bcrypt of argon2 voor het hashen van wachtwoorden
2. **Invoer valideren** - Valideer en zuiver alle gebruikersinvoer
3. **Controleer machtigingen** - Controleer altijd de gebruikersmachtigingen vóór acties
4. **Gebruik sessies veilig** - Genereer sessie-ID's opnieuw bij het inloggen
5. **Activiteiten loggen** - Inloggen, uitloggen en kritieke acties registreren
6. **Snelheidsbeperking** - Implementeer een snelheidsbeperking voor inlogpogingen
7. **Alleen HTTPS** - Gebruik altijd HTTPS voor authenticatie
8. **Groepsbeheer** - Gebruik groepen voor het organiseren van machtigingen

## Gerelateerde documentatie

- ../Kernel/Kernel-Classes - Kernelservices en bootstrapping
- ../Database/QueryBuilder - Databasequery's voor gebruikersgegevens
- ../Core/XoopsObject - Basisobjectklasse

---

*Zie ook: [XOOPS Gebruiker API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP-beveiliging](https://www.php.net/manual/en/book.password.php)*