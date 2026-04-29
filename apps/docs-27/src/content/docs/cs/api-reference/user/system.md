---
title: "Uživatelský systém XOOPS"
description: "Třída XoopsUser, správa XoopsGroup, ověřování uživatelů, zpracování relací a řízení přístupu"
---

Uživatelský systém XOOPS spravuje uživatelské účty, autentizaci, autorizaci, členství ve skupinách a správu relací. Poskytuje robustní rámec pro zabezpečení vaší aplikace a řízení přístupu uživatelů.

## Architektura uživatelského systému

```mermaid
graph TD
    A[User System] -->|manages| B[XOOPSUser]
    A -->|manages| C[XOOPSGroup]
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

## Třída XOOPSUser

Hlavní třída objektu uživatele představující uživatelský účet.

### Přehled třídy

```php
namespace XOOPS\Core\User;

class XOOPSUser extends XOOPSObject
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

### Konstruktér

```php
public function __construct(int $uid = null)
```

Vytvoří nový uživatelský objekt, volitelně načtený z databáze podle ID.

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$uid` | int | ID uživatele k načtení (volitelné) |

**Příklad:**
```php
// Create new user
$user = new XOOPSUser();

// Load existing user
$user = new XOOPSUser(123);
```

### Základní vlastnosti

| Nemovitost | Typ | Popis |
|----------|------|-------------|
| `uid` | int | ID uživatele |
| `uname` | řetězec | Uživatelské jméno |
| `email` | řetězec | E-mailová adresa |
| `pass` | řetězec | Hash hesla |
| `uregdate` | int | Časové razítko registrace |
| `ulevel` | int | Uživatelská úroveň (9=admin, 1=uživatel) |
| `groups` | pole | ID skupiny |
| `permissions` | pole | Příznaky povolení |

### Základní metody

#### getID / getUid

Získá ID uživatele.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Vrátí:** `int` – ID uživatele

**Příklad:**
```php
$user = new XOOPSUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Získá zobrazované jméno uživatele.

```php
public function getUnameReal(): string
```

**Vrátí:** `string` – skutečné jméno uživatele

**Příklad:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getEmail

Získá e-mailovou adresu uživatele.

```php
public function getEmail(): string
```

**Vrácení:** `string` – E-mailová adresa

**Příklad:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Získá nebo nastaví uživatelskou proměnnou.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Příklad:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Získá členství ve skupinách uživatele.

```php
public function getGroups(): array
```

**Vrátí:** `array` – Pole skupinových ID

**Příklad:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

Kontroluje, zda uživatel patří do skupiny.

```php
public function isInGroup(int $groupId): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$groupId` | int | ID skupiny ke kontrole |

**Vrátí:** `bool` - True, pokud je ve skupině

**Příklad:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### je správce

Zkontroluje, zda je uživatel správcem.

```php
public function isAdmin(): bool
```

**Vrátí:** `bool` – Pravda, pokud je admin

**Příklad:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Získá informace o uživatelském profilu.

```php
public function getProfile(): array
```

**Vrátí:** `array` – Údaje o profilu

**Příklad:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### je aktivní

Kontroluje, zda je uživatelský účet aktivní.

```php
public function isActive(): bool
```

**Vrátí:** `bool` - True, pokud je aktivní

**Příklad:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### aktualizovatPoslední přihlášení

Aktualizuje časové razítko posledního přihlášení uživatele.

```php
public function updateLastLogin(): bool
```

**Vrátí se:** `bool` – Pravda při úspěchu

**Příklad:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## Třída XOOPSGroup

Spravuje skupiny uživatelů a oprávnění.

### Přehled třídy

```php
namespace XOOPS\Core\User;

class XOOPSGroup extends XOOPSObject
{
    protected int $groupid = 0;
    protected string $name = '';
    protected string $description = '';
    protected int $group_type = 0;
    protected array $users = [];
}
```

### Konstanty

| Konstantní | Hodnota | Popis |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | Normální uživatelská skupina |
| `TYPE_ADMIN` | 1 | Administrativní skupina |
| `TYPE_SYSTEM` | 2 | Systémová skupina |

### Metody

#### getName

Získá název skupiny.

```php
public function getName(): string
```

**Vrátí:** `string` - Název skupiny

**Příklad:**
```php
$group = new XOOPSGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Získá popis skupiny.

```php
public function getDescription(): string
```

**Vrácení:** `string` - Popis

**Příklad:**
```php
echo $group->getDescription();
```

#### získat uživatele

Získá členy skupiny.

```php
public function getUsers(): array
```

**Vrátí:** `array` – Pole uživatelských ID

**Příklad:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### přidat uživatele

Přidá uživatele do skupiny.

```php
public function addUser(int $uid): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$uid` | int | ID uživatele |

**Vrátí se:** `bool` - Pravda při úspěchu

**Příklad:**
```php
$group = new XOOPSGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### odebrat uživatele

Odebere uživatele ze skupiny.

```php
public function removeUser(int $uid): bool
```

**Příklad:**
```php
$group->removeUser(123);
```

## Ověření uživatele

### Proces přihlášení

```php
/**
 * User login
 */
function xoops_user_login(string $uname, string $pass, bool $rememberMe = false): ?XOOPSUser
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
    $user = new XOOPSUser($row['uid']);

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

### Správa hesel

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

## Správa relací

### Třída relace

```php
namespace XOOPS\Core;

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

### Metody relace

#### Zahájit relaci

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

#### Kontrolní relace

```php
/**
 * Get current user from session
 */
function xoops_get_current_user(): ?XOOPSUser
{
    if (isset($_SESSION['xoops_user']) && $_SESSION['xoops_user'] instanceof XOOPSUser) {
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

#### Zničit relaci

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

## Systém povolení

### Konstanty oprávnění

| Konstantní | Hodnota | Popis |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Bez povolení |
| `XOOPS_PERMISSION_VIEW` | 1 | Zobrazit obsah |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Odeslat obsah |
| `XOOPS_PERMISSION_EDIT` | 4 | Upravit obsah |
| `XOOPS_PERMISSION_DELETE` | 8 | Smazat obsah |
| `XOOPS_PERMISSION_ADMIN` | 16 | Administrátorský přístup |

### Kontrola oprávnění

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

## User HandlerUserHandler spravuje operace trvalosti uživatele.

```php
/**
 * Get user handler
 */
$userHandler = xoops_getHandler('user');

/**
 * Create new user
 */
$user = new XOOPSUser();
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

## Kompletní příklad správy uživatelů

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

## Nejlepší postupy

1. **Hash Passwords** – Pro hashování hesel vždy používejte bcrypt nebo argon2
2. **Validate Input** – Ověřte a dezinfikujte všechny uživatelské vstupy
3. **Zkontrolujte oprávnění** – Před akcí vždy ověřte oprávnění uživatele
4. **Používejte Sessions Secure** – Obnovte ID relace při přihlášení
5. **Protokolovat aktivity** – Zaznamenat přihlášení, odhlášení a kritické akce
6. **Rate Limiting** – Implementujte omezení rychlosti pokusů o přihlášení
7. **Pouze HTTPS** – K ověření vždy používejte HTTPS
8. **Správa skupin** – Používejte skupiny pro organizaci oprávnění

## Související dokumentace

- ../Kernel/Kernel-Classes - Služby jádra a bootstrapping
- ../Database/QueryBuilder - Databázové dotazy na uživatelská data
- ../Core/XOOPSObject - Základní třída objektu

---

*Viz také: [XOOPS Uživatel API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class) | [Zabezpečení PHP](https://www.php.net/manual/en/book.password.php)*