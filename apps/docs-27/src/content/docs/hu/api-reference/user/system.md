---
title: "XOOPS felhasználói rendszer"
description: "XOOPSUser osztály, XOOPSGroup-kezelés, felhasználói hitelesítés, munkamenet-kezelés és hozzáférés-vezérlés"
---
A XOOPS felhasználói rendszer kezeli a felhasználói fiókokat, a hitelesítést, az engedélyezést, a csoporttagságot és a munkamenet-kezelést. Robusztus keretrendszert biztosít az alkalmazások biztonságához és a felhasználói hozzáférés szabályozásához.

## Felhasználói rendszerarchitektúra

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

## XOOPSUser osztály

A felhasználói fiókot képviselő fő felhasználói objektumosztály.

### Osztály áttekintése

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

Létrehoz egy új felhasználói objektumot, amelyet opcionálisan betölt az adatbázisból a ID.

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$uid` | int | ID felhasználó betöltése (opcionális) |

**Példa:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### Core Properties

| Ingatlan | Típus | Leírás |
|----------|------|--------------|
| `uid` | int | Felhasználó ID |
| `uname` | húr | Felhasználónév |
| `email` | húr | E-mail cím |
| `pass` | húr | Jelszó hash |
| `uregdate` | int | Regisztrációs időbélyeg |
| `ulevel` | int | Felhasználói szint (9=adminisztrátor, 1=felhasználó) |
| `groups` | tömb | Csoportazonosítók |
| `permissions` | tömb | Engedélyjelzők |

### Alapvető módszerek

#### getID / getUid

Lekéri a felhasználó ID-ját.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Visszaküldés:** `int` – ID felhasználó

**Példa:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Lekéri a felhasználó megjelenített nevét.

```php
public function getUnameReal(): string
```

**Visszaküldés:** `string` – A felhasználó valódi neve

**Példa:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getEmail

Lekéri a felhasználó e-mail címét.

```php
public function getEmail(): string
```

**Visszaküldés:** `string` - E-mail cím

**Példa:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Felhasználói változót kér vagy állít be.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Példa:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Lekéri a felhasználó csoporttagságait.

```php
public function getGroups(): array
```

**Visszaküldés:** `array` - Csoportazonosítók tömbje

**Példa:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

Ellenőrzi, hogy a felhasználó egy csoporthoz tartozik-e.

```php
public function isInGroup(int $groupId): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$groupId` | int | ID csoport az ellenőrzéshez |

**Visszaküldés:** `bool` - Igaz, ha csoportban van

**Példa:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### is Admin

Ellenőrzi, hogy a felhasználó rendszergazda-e.

```php
public function isAdmin(): bool
```

**Vissza:** `bool` - Igaz, ha adminisztrátor

**Példa:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Felhasználói profiladatokat kap.

```php
public function getProfile(): array
```

**Visszaküldés:** `array` - Profiladatok

**Példa:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### Aktív

Ellenőrzi, hogy a felhasználói fiók aktív-e.

```php
public function isActive(): bool
```

**Vissza:** `bool` - Igaz, ha aktív

**Példa:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### updateLastLogin

Frissíti a felhasználó utolsó bejelentkezési időbélyegét.

```php
public function updateLastLogin(): bool
```

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XOOPSGroup osztály

Kezeli a felhasználói csoportokat és az engedélyeket.

### Osztály áttekintése

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

### Állandók

| Állandó | Érték | Leírás |
|----------|-------|--------------|
| `TYPE_NORMAL` | 0 | Normál felhasználói csoport |
| `TYPE_ADMIN` | 1 | Igazgatási csoport |
| `TYPE_SYSTEM` | 2 | Rendszercsoport |

### Módszerek

#### getName

Lekéri a csoport nevét.

```php
public function getName(): string
```

**Visszaküldés:** `string` - Csoport neve

**Példa:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Lekéri a csoport leírását.

```php
public function getDescription(): string
```

**Visszaküldés:** `string` - Leírás

**Példa:**
```php
echo $group->getDescription();
```

#### getUsers

Megszerzi a csoport tagjait.

```php
public function getUsers(): array
```

**Visszaküldés:** `array` - Felhasználói azonosítók tömbje

**Példa:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

Felhasználót ad a csoporthoz.

```php
public function addUser(int $uid): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$uid` | int | Felhasználó ID |

**Visszaküldés:** `bool` - Igaz a sikerre

**Példa:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### távolítsa el a felhasználót

Eltávolít egy felhasználót a csoportból.

```php
public function removeUser(int $uid): bool
```

**Példa:**
```php
$group->removeUser(123);
```

## Felhasználó hitelesítés

### Bejelentkezési folyamat

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

### Jelszókezelés

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

## Session Management

### Session Class

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

### Session módszerek

#### Indítsa el a munkamenetet

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

#### Ellenőrizze a munkamenetet

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

#### Destroy Session

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
## Engedélyrendszer

### Engedélyállandók

| Állandó | Érték | Leírás |
|----------|-------|--------------|
| `XOOPS_PERMISSION_NONE` | 0 | Nincs engedély |
| `XOOPS_PERMISSION_VIEW` | 1 | Tartalom megtekintése |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Tartalom beküldése |
| `XOOPS_PERMISSION_EDIT` | 4 | Tartalom szerkesztése |
| `XOOPS_PERMISSION_DELETE` | 8 | Tartalom törlése |
| `XOOPS_PERMISSION_ADMIN` | 16 | Adminisztrátori hozzáférés |

### Engedélyek ellenőrzése

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

## Felhasználókezelő

A UserHandler kezeli a felhasználói perzisztencia műveleteit.

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

## Teljes felhasználókezelési példa

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

## Bevált gyakorlatok

1. **Kivonatos jelszavak** – Mindig használjon bcrypt vagy argon2 kódot a jelszókivonatoláshoz
2. **Input ellenőrzése** – Minden felhasználói bevitel érvényesítése és megtisztítása
3. **Ellenőrizze az engedélyeket** – Mindig ellenőrizze a felhasználói engedélyeket a műveletek előtt
4. **A munkamenetek biztonságos használata** – A munkamenet-azonosítók újragenerálása bejelentkezéskor
5. **Tevékenységek naplózása** – Bejelentkezés, kijelentkezés és kritikus műveletek naplózása
6. **Rate Limiting** - Végezze el a bejelentkezési kísérlet gyakoriságának korlátozását
7. **Csak HTTPS** – Mindig használja a HTTPS hitelesítést
8. **Csoportkezelés** - Csoportok használata az engedélyek megszervezéséhez

## Kapcsolódó dokumentáció

- ../Kernel/Kernel-Classes - Kernelszolgáltatások és rendszerindítás
- ../Database/QueryBuilder - Adatbázis-lekérdezések felhasználói adatokhoz
- ../Core/XOOPSObject - Alap objektumosztály

---

*Lásd még: [XOOPS Felhasználó API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class) | [PHP Biztonság](https://www.php.net/manual/en/book.password.php)*
