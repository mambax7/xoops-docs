---
title: "XOOPS Korisnički sustav"
description: "XoopsUser class, XoopsGroup upravljanje, provjera autentičnosti korisnika, rukovanje sesijom i kontrola pristupa"
---
Korisnički sustav XOOPS upravlja korisničkim računima, autentifikacijom, autorizacijom, članstvom u grupi i upravljanjem sesijom. Pruža robustan okvir za osiguranje vaše aplikacije i kontrolu korisničkog pristupa.

## Arhitektura korisničkog sustava

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

## XoopsUser klasa

Glavni korisnički objekt class koji predstavlja korisnički račun.

### Pregled razreda

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

### Konstruktor

```php
public function __construct(int $uid = null)
```

Stvara novi korisnički objekt, izborno učitavanje iz baze podataka prema ID-u.

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$uid` | int | ID korisnika za učitavanje (neobavezno) |

**Primjer:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### Osnovna svojstva

| Vlasništvo | Upišite | Opis |
|----------|------|-------------|
| `uid` | int | ID korisnika |
| `uname` | niz | Korisničko ime |
| `email` | niz | Adresa e-pošte |
| `pass` | niz | Hash zaporke |
| `uregdate` | int | Vremenska oznaka registracije |
| `ulevel` | int | Korisnička razina (9=admin, 1=korisnik) |
| `groups` | niz | ID grupe |
| `permissions` | niz | Oznake dopuštenja |

### Osnovne metode

#### getID / getUid

Dobiva ID korisnika.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Povrat:** `int` - ID korisnika

**Primjer:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Dobiva korisničko ime za prikaz.

```php
public function getUnameReal(): string
```

**Povratak:** `string` - Pravo ime korisnika

**Primjer:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getEmail

Dobiva adresu e-pošte korisnika.

```php
public function getEmail(): string
```

**Povratak:** `string` - Adresa e-pošte

**Primjer:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Dobiva ili postavlja korisničku varijablu.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Primjer:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Dohvaća korisnikovo članstvo u grupi.

```php
public function getGroups(): array
```

**Povratak:** `array` - Niz grupnih ID-ova

**Primjer:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### je u grupi

Provjerava pripada li korisnik grupi.

```php
public function isInGroup(int $groupId): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$groupId` | int | ID grupe za provjeru |

**Vraća:** `bool` - Istina ako je u grupi

**Primjer:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### je Administrator

Provjerava je li korisnik administrator.

```php
public function isAdmin(): bool
```

**Vraća:** `bool` - Istina ako je admin

**Primjer:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Dobiva informacije o korisničkom profilu.

```php
public function getProfile(): array
```

**Povrat:** `array` - Podaci o profilu

**Primjer:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### je aktivan

Provjerava je li korisnički račun aktivan.

```php
public function isActive(): bool
```

**Vraća:** `bool` - Istinito ako je aktivno

**Primjer:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### updateLastLogin

Ažurira vremensku oznaku zadnje prijave korisnika.

```php
public function updateLastLogin(): bool
```

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XoopsGroup klasa

Upravlja korisničkim grupama i dopuštenjima.

### Pregled razreda

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

### Konstante

| Konstanta | Vrijednost | Opis |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | Normalna korisnička grupa |
| `TYPE_ADMIN` | 1 | Administrativna grupa |
| `TYPE_SYSTEM` | 2 | Grupa sustava |

### Metode

#### getName

Dobiva naziv grupe.

```php
public function getName(): string
```

**Vraća:** `string` - Naziv grupe

**Primjer:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescriptionDobiva opis grupe.

```php
public function getDescription(): string
```

**Povratak:** `string` - Opis

**Primjer:**
```php
echo $group->getDescription();
```

#### getUsers

Dobiva članove grupe.

```php
public function getUsers(): array
```

**Povratak:** `array` - Niz ID-ova korisnika

**Primjer:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

Dodaje korisnika u grupu.

```php
public function addUser(int $uid): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$uid` | int | ID korisnika |

**Povrat:** `bool` - Istina nakon uspjeha

**Primjer:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### ukloni korisnika

Uklanja korisnika iz grupe.

```php
public function removeUser(int $uid): bool
```

**Primjer:**
```php
$group->removeUser(123);
```

## Autentikacija korisnika

### Proces prijave

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

### Upravljanje lozinkama

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

## Upravljanje sesijom

### Razred sesije

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

### Metode sesije

#### Započnite sesiju

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

#### Provjerite sesiju

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

#### Uništi sesiju

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

## Sustav dopuštenja

### Konstante dopuštenja

| Konstanta | Vrijednost | Opis |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Nema dopuštenja |
| `XOOPS_PERMISSION_VIEW` | 1 | Pogledaj sadržaj |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Pošalji sadržaj |
| `XOOPS_PERMISSION_EDIT` | 4 | Uredi sadržaj |
| `XOOPS_PERMISSION_DELETE` | 8 | Brisanje sadržaja |
| `XOOPS_PERMISSION_ADMIN` | 16 | Administratorski pristup |

### Provjera dopuštenja

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

## Rukovatelj korisnikom

UserHandler upravlja operacijama postojanosti korisnika.

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

## Potpuni primjer upravljanja korisnicima

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

## Najbolji primjeri iz prakse

1. **Hash Passwords** - Uvijek koristite bcrypt ili argon2 za hashiranje zaporki
2. **Validate Input** - Potvrdite i očistite sve korisničke unose
3. **Provjerite dozvole** - Uvijek provjerite korisničke dozvole prije radnji
4. **Sigurno koristite sesije** - Ponovno generirajte ID-ove sesija prilikom prijave
5. **Bilježi aktivnosti** - Bilježi prijavu, odjavu i kritične radnje
6. **Ograničenje stope** - Implementirajte ograničenje stope pokušaja prijave
7. **Samo HTTPS** - Uvijek koristite HTTPS za autentifikaciju
8. **Upravljanje grupama** - Koristite grupe za organizaciju dopuštenja

## Povezana dokumentacija

- ../Kernel/Kernel-Classes - Kernel usluge i bootstrapping
- ../Database/QueryBuilder - Upiti baze podataka za korisničke podatke
- ../Core/XoopsObject - Osnovni objekt class

---

*Vidi također: [XOOPS Korisnik API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP Sigurnost](https://www.php.net/manual/en/book.password.php)*
