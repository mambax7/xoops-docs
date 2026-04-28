---
title: "System Użytkowników XOOPS"
description: "Klasa XoopsUser, zarządzanie XoopsGroup, uwierzytelnianie użytkownika, obsługa sesji i kontrola dostępu"
---

System Użytkowników XOOPS zarządza kontami użytkowników, uwierzytelnianiem, autoryzacją, członkostwem w grupach i zarządzaniem sesją. Zapewnia solidny framework do zabezpieczania aplikacji i kontrolowania dostępu użytkowników.

## Architektura Systemu Użytkowników

```mermaid
graph TD
    A[System Użytkowników] -->|manages| B[XoopsUser]
    A -->|manages| C[XoopsGroup]
    A -->|handles| D[Uwierzytelnianie]
    A -->|handles| E[Sesje]

    D -->|validates| F[Nazwa Użytkownika/Hasło]
    D -->|validates| G[E-mail/Token]
    D -->|triggers| H[Haki Po-Login]

    E -->|manages| I[Dane Sesji]
    E -->|manages| J[Ciasteczka Sesji]

    B -->|belongs to| C
    B -->|has| K[Uprawnienia]
    B -->|has| L[Dane Profilu]

    C -->|defines| M[Poziomy Dostępu]
    C -->|contains| N[Wielu Użytkowników]
```

## Klasa XoopsUser

Główna klasa obiektu użytkownika reprezentująca konto użytkownika.

### Class Overview

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

Tworzy nowy obiekt użytkownika, opcjonalnie ładując z bazy danych po ID.

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$uid` | int | ID użytkownika do załadowania (opcjonalnie) |

**Przykład:**
```php
// Utwórz nowego użytkownika
$user = new XoopsUser();

// Załaduj istniejącego użytkownika
$user = new XoopsUser(123);
```

### Właściwości Podstawowe

| Właściwość | Typ | Opis |
|-----------|-----|------|
| `uid` | int | ID użytkownika |
| `uname` | string | Nazwa użytkownika |
| `email` | string | Adres e-mail |
| `pass` | string | Hash hasła |
| `uregdate` | int | Timestamp rejestracji |
| `ulevel` | int | Poziom użytkownika (9=admin, 1=użytkownik) |
| `groups` | array | ID grupy |
| `permissions` | array | Flagi uprawnień |

### Główne Metody

#### getID / getUid

Pobiera ID użytkownika.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Zwraca:** `int` - ID użytkownika

**Przykład:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Pobiera wyświetlaną nazwę użytkownika.

```php
public function getUnameReal(): string
```

**Zwraca:** `string` - Imię i nazwisko użytkownika

**Przykład:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getEmail

Pobiera adres e-mail użytkownika.

```php
public function getEmail(): string
```

**Zwraca:** `string` - Adres e-mail

**Przykład:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Pobiera lub ustawia zmienną użytkownika.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Przykład:**
```php
// Pobierz wartości
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Sformatowana do wyświetlenia

// Ustaw wartości
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Pobiera członkostwo użytkownika w grupach.

```php
public function getGroups(): array
```

**Zwraca:** `array` - Tablica ID grup

**Przykład:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

Sprawdza czy użytkownik należy do grupy.

```php
public function isInGroup(int $groupId): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$groupId` | int | ID grupy do sprawdzenia |

**Zwraca:** `bool` - True jeśli w grupie

**Przykład:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### isAdmin

Sprawdza czy użytkownik jest administratorem.

```php
public function isAdmin(): bool
```

**Zwraca:** `bool` - True jeśli admin

**Przykład:**
```php
if ($user->isAdmin()) {
    // Pokaż kontrolki admin
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Pobiera informacje profilu użytkownika.

```php
public function getProfile(): array
```

**Zwraca:** `array` - Dane profilu

**Przykład:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### isActive

Sprawdza czy konto użytkownika jest aktywne.

```php
public function isActive(): bool
```

**Zwraca:** `bool` - True jeśli aktywny

**Przykład:**
```php
if ($user->isActive()) {
    // Zezwól na dostęp użytkownika
} else {
    // Ogranicz dostęp
}
```

#### updateLastLogin

Aktualizuje timestamp ostatniego logowania użytkownika.

```php
public function updateLastLogin(): bool
```

**Zwraca:** `bool` - True na sukces

**Przykład:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## Klasa XoopsGroup

Zarządza grupami użytkowników i uprawnieniami.

### Przegląd Klasy

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

### Stałe

| Stała | Wartość | Opis |
|-------|---------|------|
| `TYPE_NORMAL` | 0 | Normalna grupa użytkownika |
| `TYPE_ADMIN` | 1 | Grupa administracyjna |
| `TYPE_SYSTEM` | 2 | Grupa systemowa |

### Metody

#### getName

Pobiera nazwę grupy.

```php
public function getName(): string
```

**Zwraca:** `string` - Nazwa grupy

**Przykład:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Pobiera opis grupy.

```php
public function getDescription(): string
```

**Zwraca:** `string` - Opis

**Przykład:**
```php
echo $group->getDescription();
```

#### getUsers

Pobiera członków grupy.

```php
public function getUsers(): array
```

**Zwraca:** `array` - Tablica ID użytkowników

**Przykład:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

Dodaje użytkownika do grupy.

```php
public function addUser(int $uid): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$uid` | int | ID użytkownika |

**Zwraca:** `bool` - True na sukces

**Przykład:**
```php
$group = new XoopsGroup(2); // Edytorzy
$group->addUser(123);
$groupHandler->insert($group);
```

#### removeUser

Usuwa użytkownika z grupy.

```php
public function removeUser(int $uid): bool
```

**Przykład:**
```php
$group->removeUser(123);
```

## Uwierzytelnianie Użytkownika

### Proces Logowania

```php
/**
 * Login użytkownika
 */
function xoops_user_login(string $uname, string $pass, bool $rememberMe = false): ?XoopsUser
{
    global $xoopsDB;

    // Oczyść nazwę użytkownika
    $uname = trim($uname);

    // Pobierz użytkownika z bazy danych
    $query = $xoopsDB->prepare(
        'SELECT * FROM ' . $xoopsDB->prefix('users') .
        ' WHERE uname = ? AND active = 1'
    );
    $query->bind_param('s', $uname);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) {
        return null; // Użytkownik nie znaleziony
    }

    $row = $result->fetch_assoc();

    // Weryfikuj hasło
    if (!password_verify($pass, $row['pass'])) {
        return null; // Nieprawidłowe hasło
    }

    // Załaduj obiekt użytkownika
    $user = new XoopsUser($row['uid']);

    // Zaktualizuj ostatnie logowanie
    $user->updateLastLogin();

    // Obsługa "Remember Me"
    if ($rememberMe) {
        // Ustaw trwałe ciasteczko
        setcookie(
            'xoops_user_remember',
            $user->uid(),
            time() + (30 * 24 * 60 * 60), // 30 dni
            '/',
            $_SERVER['HTTP_HOST'] ?? ''
        );
    }

    return $user;
}
```

### Zarządzanie Hasłem

```php
/**
 * Hash hasła bezpiecznie
 */
function xoops_hash_password(string $password): string
{
    return password_hash($password, PASSWORD_BCRYPT, [
        'cost' => 12
    ]);
}

/**
 * Weryfikuj hasło
 */
function xoops_verify_password(string $password, string $hash): bool
{
    return password_verify($password, $hash);
}

/**
 * Sprawdź czy hasło wymaga rehaszowania
 */
function xoops_password_needs_rehash(string $hash): bool
{
    return password_needs_rehash($hash, PASSWORD_BCRYPT, [
        'cost' => 12
    ]);
}
```

## Zarządzanie Sesją

### Klasa Sesji

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

### Metody Sesji

#### Start Sesji

```php
<?php
session_start();

// Regeneruj ID sesji dla bezpieczeństwa
session_regenerate_id(true);

// Ustaw timeout sesji
ini_set('session.gc_maxlifetime', 3600); // 1 godzina

// Przechowuj użytkownika w sesji
if ($user) {
    $_SESSION['xoops_user'] = $user;
    $_SESSION['xoops_uid'] = $user->getID();
    $_SESSION['xoops_uname'] = $user->getVar('uname');
}
```

#### Sprawdź Sesję

```php
/**
 * Pobierz bieżącego użytkownika z sesji
 */
function xoops_get_current_user(): ?XoopsUser
{
    if (isset($_SESSION['xoops_user']) && $_SESSION['xoops_user'] instanceof XoopsUser) {
        return $_SESSION['xoops_user'];
    }
    return null;
}

/**
 * Sprawdź czy użytkownik jest zalogowany
 */
function xoops_is_user_logged_in(): bool
{
    return isset($_SESSION['xoops_uid']) && $_SESSION['xoops_uid'] > 0;
}
```

#### Zniszcz Sesję

```php
/**
 * Wyloguj użytkownika
 */
function xoops_user_logout()
{
    global $xoopsUser;

    // Zaloguj wylogowanie
    if ($xoopsUser) {
        error_log('User ' . $xoopsUser->getVar('uname') . ' logged out');
    }

    // Zniszcz dane sesji
    $_SESSION = [];

    // Usuń ciasteczko sesji
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

    // Zniszcz sesję
    session_destroy();
}
```

## System Uprawnień

### Stałe Uprawnień

| Stała | Wartość | Opis |
|-------|---------|------|
| `XOOPS_PERMISSION_NONE` | 0 | Brak uprawnień |
| `XOOPS_PERMISSION_VIEW` | 1 | Wyświetl zawartość |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Prześlij zawartość |
| `XOOPS_PERMISSION_EDIT` | 4 | Edytuj zawartość |
| `XOOPS_PERMISSION_DELETE` | 8 | Usuń zawartość |
| `XOOPS_PERMISSION_ADMIN` | 16 | Dostęp admin |

### Sprawdzanie Uprawnień

```php
/**
 * Sprawdź czy użytkownik ma uprawnienia
 */
function xoops_check_permission($user, $resource, $permission)
{
    if (!$user) {
        return false;
    }

    // Administratorzy mają wszystkie uprawnienia
    if ($user->isAdmin()) {
        return true;
    }

    // Sprawdź uprawnienia grupy
    $groups = $user->getGroups();
    foreach ($groups as $groupId) {
        if (xoops_group_has_permission($groupId, $resource, $permission)) {
            return true;
        }
    }

    return false;
}
```

## Handler Użytkownika

UserHandler zarządza operacjami trwałości użytkownika.

```php
/**
 * Pobierz handler użytkownika
 */
$userHandler = xoops_getHandler('user');

/**
 * Utwórz nowego użytkownika
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
 * Zaktualizuj użytkownika
 */
$user = $userHandler->get(123);
$user->setVar('email', 'newemail@example.com');
$userHandler->insert($user);

/**
 * Pobierz użytkownika po nazwie
 */
$user = $userHandler->findByUsername('john');

/**
 * Usuń użytkownika
 */
$userHandler->delete($user);

/**
 * Szukaj użytkowników
 */
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('uname', '%admin%', 'LIKE'));
$users = $userHandler->getObjects($criteria);
```

## Kompletny Przykład Zarządzania Użytkownikami

```php
<?php
/**
 * Kompletny przykład uwierzytelniania i profilu użytkownika
 */

require_once XOOPS_ROOT_PATH . '/include/common.inc.php';

$xoopsUser = $GLOBALS['xoopsUser'];

// Sprawdź czy użytkownik jest zalogowany
if (!$xoopsUser || !$xoopsUser->isActive()) {
    redirect_header(XOOPS_URL, 3, 'Please login');
}

// Pobierz handler użytkownika
$userHandler = xoops_getHandler('user');

// Pobierz bieżącego użytkownika ze świeżymi danymi
$currentUser = $userHandler->get($xoopsUser->getID());

// Strona profilu użytkownika
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

// Status administratora
if ($currentUser->isAdmin()) {
    echo '<p><strong>Status:</strong> Administrator</p>';
}

echo '</div>';

// Formularz zmiany hasła
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['change_password'])) {
    $oldPassword = $_POST['old_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // Weryfikuj stare hasło
    if (!password_verify($oldPassword, $currentUser->getVar('pass'))) {
        echo '<div class="error">Current password is incorrect</div>';
    } elseif ($newPassword !== $confirmPassword) {
        echo '<div class="error">New passwords do not match</div>';
    } elseif (strlen($newPassword) < 6) {
        echo '<div class="error">Password must be at least 6 characters</div>';
    } else {
        // Zaktualizuj hasło
        $currentUser->setVar('pass', xoops_hash_password($newPassword));
        if ($userHandler->insert($currentUser)) {
            echo '<div class="success">Password changed successfully</div>';
        } else {
            echo '<div class="error">Failed to update password</div>';
        }
    }
}

// Formularz zmiany hasła
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

## Najlepsze Praktyki

1. **Hashuj Hasła** - Zawsze używaj bcrypt lub argon2 do haszowania haseł
2. **Waliduj Wejście** - Waliduj i oczyść wszystkie wejście użytkownika
3. **Sprawdzaj Uprawnienia** - Zawsze weryfikuj uprawnienia użytkownika przed akcjami
4. **Bezpiecznie Używaj Sesji** - Regeneruj ID sesji podczas logowania
5. **Loguj Aktywności** - Loguj logowanie, wylogowanie i krytyczne akcje
6. **Rate Limiting** - Implementuj limitowanie prób logowania
7. **Tylko HTTPS** - Zawsze używaj HTTPS do uwierzytelniania
8. **Zarządzanie Grupami** - Używaj grup do organizacji uprawnień

## Powiązana Dokumentacja

- ../Kernel/Kernel-Classes - Serwisy rdzenia i bootstrap
- ../Database/QueryBuilder - Zapytania do bazy danych dla danych użytkownika
- ../Core/XoopsObject - Klasa obiektu bazowego

---

*Patrz też: [API Użytkowników XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [Bezpieczeństwo PHP](https://www.php.net/manual/en/book.password.php)*
