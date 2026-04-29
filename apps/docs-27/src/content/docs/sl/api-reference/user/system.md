---
title: "XOOPS Uporabniški sistem"
description: "Razred XoopsUser, upravljanje XoopsGroup, preverjanje pristnosti uporabnikov, obravnavanje sej in nadzor dostopa"
---
Uporabniški sistem XOOPS upravlja uporabniške račune, avtentikacijo, avtorizacijo, članstvo v skupini in upravljanje sej. Zagotavlja robusten okvir za zaščito vaše aplikacije in nadzor uporabniškega dostopa.

## Arhitektura uporabniškega sistema
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
## Uporabniški razred XOOPS

Glavni uporabniški objektni razred, ki predstavlja uporabniški račun.

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
Ustvari nov uporabniški objekt, po želji nalaganje iz baze podatkov po ID-ju.

**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$uid` | int | ID uporabnika za nalaganje (neobvezno) |

**Primer:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### Lastnosti jedra

| Lastnina | Vrsta | Opis |
|----------|------|-------------|
| `uid` | int | ID uporabnika |
| `uname` | niz | Uporabniško ime |
| `email` | niz | E-poštni naslov |
| `pass` | niz | Zgoščena vrednost gesla |
| `uregdate` | int | Časovni žig registracije |
| `ulevel` | int | Raven uporabnika (9=skrbnik, 1=uporabnik) |
| `groups` | niz | ID-ji skupin |
| `permissions` | niz | Oznake dovoljenj |

### Osnovne metode

#### getID / getUid

Pridobi ID uporabnika.
```php
public function getID(): int
public function getUid(): int  // Alias
```
**Vrnitve:** `int` - ID uporabnika

**Primer:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### getUnameReal

Pridobi prikazno ime uporabnika.
```php
public function getUnameReal(): string
```
**Vrnitve:** `string` - Pravo ime uporabnika

**Primer:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### getEmail

Pridobi uporabnikov elektronski naslov.
```php
public function getEmail(): string
```
**Vračila:** `string` - E-poštni naslov

**Primer:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
#### getVar / setVar

Pridobi ali nastavi uporabniško spremenljivko.
```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**Primer:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### getGroups

Pridobi uporabnikovo članstvo v skupini.
```php
public function getGroups(): array
```
**Vrne:** `array` - Niz ID-jev skupin

**Primer:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
#### je v skupini

Preveri, ali uporabnik pripada skupini.
```php
public function isInGroup(int $groupId): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$groupId` | int | ID skupine za preverjanje |

**Vrne:** `bool` - True, če je v skupini

**Primer:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### je skrbnik

Preveri, ali je uporabnik skrbnik.
```php
public function isAdmin(): bool
```
**Vrne:** `bool` - True if admin

**Primer:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### getProfile

Pridobi informacije o uporabniškem profilu.
```php
public function getProfile(): array
```
**Vrnitve:** `array` - Podatki o profilu

**Primer:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### je aktiven

Preveri, ali je uporabniški račun aktiven.
```php
public function isActive(): bool
```
**Vrne:** `bool` - True, če je aktivno

**Primer:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### posodobi zadnjo prijavo

Posodobi časovni žig zadnje prijave uporabnika.
```php
public function updateLastLogin(): bool
```
**Vrnitve:** `bool` - velja ob uspehu

**Primer:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## Razred XoopsGroup

Upravlja uporabniške skupine in dovoljenja.

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

| Konstanta | Vrednost | Opis |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | Običajna uporabniška skupina |
| `TYPE_ADMIN` | 1 | Upravna skupina |
| `TYPE_SYSTEM` | 2 | Sistemska skupina |

### Metode

#### getName

Pridobi ime skupine.
```php
public function getName(): string
```
**Vrne:** `string` - Ime skupine

**Primer:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### getDescription

Pridobi opis skupine.
```php
public function getDescription(): string
```
**Vračila:** `string` - Opis

**Primer:**
```php
echo $group->getDescription();
```
#### getUsers

Pridobi člane skupine.
```php
public function getUsers(): array
```
**Vrne:** `array` - Niz ID-jev uporabnikov

**Primer:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### addUser

Doda uporabnika v skupino.
```php
public function addUser(int $uid): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$uid` | int | ID uporabnika |

**Vrnitve:** `bool` - Resnično ob uspehu

**Primer:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### odstraniUporabnika

Odstrani uporabnika iz skupine.
```php
public function removeUser(int $uid): bool
```
**Primer:**
```php
$group->removeUser(123);
```
## Preverjanje pristnosti uporabnika

### Postopek prijave
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
### Upravljanje gesel
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
## Upravljanje seje

### Razred seje
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
### Metode seje

#### Začnite sejo
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
#### Preverite sejo
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
#### Uniči sejo
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
## Sistem dovoljenj

### Konstante dovoljenj

| Konstanta | Vrednost | Opis |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Brez dovoljenja |
| `XOOPS_PERMISSION_VIEW` | 1 | Ogled vsebine |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Predloži vsebino |
| `XOOPS_PERMISSION_EDIT` | 4 | Uredi vsebino |
| `XOOPS_PERMISSION_DELETE` | 8 | Izbriši vsebino |
| `XOOPS_PERMISSION_ADMIN` | 16 | Skrbniški dostop |

### Preverjanje dovoljenj
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
## Uporabniški upravljavec

UserHandler upravlja operacije vztrajnosti uporabnika.
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
## Celoten primer upravljanja uporabnikov
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
## Najboljše prakse

1. **Zgoščevanje gesel** – za zgoščevanje gesel vedno uporabite bcrypt ali argon2
2. **Validate Input** - Preveri in razčisti vse uporabniške vnose
3. **Preveri dovoljenja** - Pred dejanji vedno preveri uporabniška dovoljenja
4. **Uporabite seje varno** - Znova ustvarite ID-je sej ob prijavi
5. **Dejavnosti dnevnika** - beležite prijavo, odjavo in kritična dejanja
6. **Rate Limiting** - Izvedite omejitev števila poskusov prijave
7. **HTTPS Samo** - vedno uporabite HTTPS za preverjanje pristnosti
8. **Upravljanje skupin** - Uporabite skupine za organizacijo dovoljenj

## Povezana dokumentacija

- ../Kernel/Kernel-Classes - Storitve jedra in zagon
- ../Database/QueryBuilder - Poizvedbe v bazi podatkov za uporabniške podatke
- ../Core/XoopsObject - Osnovni objektni razred

---

*Glej tudi: [XOOPS Uporabnik API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP Varnost](https://www.php.net/manual/en/book.password.php)*