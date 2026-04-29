---
title: "Система користувача XOOPS"
description: "Клас XoopsUser, керування XoopsGroup, автентифікація користувачів, обробка сеансів і контроль доступу"
---
Система користувача XOOPS керує обліковими записами користувачів, автентифікацією, авторизацією, членством у групах і керуванням сеансами. Він забезпечує надійну структуру для захисту вашої програми та контролю доступу користувачів.

## Архітектура системи користувача
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
## Клас користувача Xoops

Основний клас об’єкта користувача, що представляє обліковий запис користувача.

### Огляд класу
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
### Конструктор
```php
public function __construct(int $uid = null)
```
Створює новий об’єкт користувача, додатково завантажуючи з бази даних за ідентифікатором.

**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$uid` | int | Ідентифікатор користувача для завантаження (необов'язково) |

**Приклад:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### Основні властивості

| Власність | Тип | Опис |
|----------|------|-------------|
| `uid` | int | ID користувача |
| `uname` | рядок | Ім'я користувача |
| `email` | рядок | Адреса електронної пошти |
| `pass` | рядок | Хеш пароля |
| `uregdate` | int | Час реєстрації |
| `ulevel` | int | Рівень користувача (9=адміністратор, 1=користувач) |
| `groups` | масив | Ідентифікатори груп |
| `permissions` | масив | Прапори дозволів |

### Основні методи

#### getID / getUid

Отримує ідентифікатор користувача.
```php
public function getID(): int
public function getUid(): int  // Alias
```
**Повернення:** `int` - ідентифікатор користувача

**Приклад:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### getUnameReal

Отримує відображуване ім'я користувача.
```php
public function getUnameReal(): string
```
**Повертає:** `string` - Справжнє ім'я користувача

**Приклад:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### getEmail

Отримує електронну адресу користувача.
```php
public function getEmail(): string
```
**Повернення:** `string` - адреса електронної пошти

**Приклад:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
#### getVar / setVar

Отримує або встановлює змінну користувача.
```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**Приклад:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### getGroups

Отримує членство користувача в групах.
```php
public function getGroups(): array
```
**Returns:** `array` - Array of group IDs

**Приклад:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
#### isInGroup

Checks if user belongs to a group.
```php
public function isInGroup(int $groupId): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$groupId` | int | ID групи для перевірки |

**Повертає:** `bool` - True якщо в групі

**Приклад:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### - адміністратор

Перевіряє, чи є користувач адміністратором.
```php
public function isAdmin(): bool
```
**Повертає:** `bool` - Правда, якщо адмін

**Приклад:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### getProfile

Отримує інформацію профілю користувача.
```php
public function getProfile(): array
```
**Повернення:** `array` - Дані профілю

**Приклад:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### активний

Перевіряє, чи обліковий запис користувача активний.
```php
public function isActive(): bool
```
**Повертає:** `bool` - True, якщо активний

**Приклад:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### updateLastLogin

Оновлює позначку часу останнього входу користувача.
```php
public function updateLastLogin(): bool
```
**Повертає:** `bool` – вірно в разі успіху

**Приклад:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## Клас XoopsGroup

Керує групами користувачів і дозволами.

### Огляд класу
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
### Константи

| Постійний | Значення | Опис |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | Звичайна група користувачів |
| `TYPE_ADMIN` | 1 | Адміністративна група |
| `TYPE_SYSTEM` | 2 | Системна група |

### Методи

#### getName

Отримує назву групи.
```php
public function getName(): string
```
**Повертає:** `string` - назва групи

**Приклад:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### getDescription

Отримує опис групи.
```php
public function getDescription(): string
```
**Повернення:** `string` - Опис

**Приклад:**
```php
echo $group->getDescription();
```
#### getUsers

Отримує членів групи.
```php
public function getUsers(): array
```
**Повертає:** `array` - масив ідентифікаторів користувачів

**Приклад:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### addUser

Додає користувача до групи.
```php
public function addUser(int $uid): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$uid` | int | ID користувача |

**Повертає:** `bool` - True у разі успіху

**Приклад:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### removeUser

Видаляє користувача з групи.
```php
public function removeUser(int $uid): bool
```
**Приклад:**
```php
$group->removeUser(123);
```
## Автентифікація користувача

### Процес входу
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
### Керування паролями
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
## Керування сеансами

### Клас сесії
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
### Методи сеансу

#### Розпочати сеанс
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
#### Перевірте сеанс
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
#### Знищити сеанс
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
## Система дозволів

### Константи дозволів

| Постійний | Значення | Опис |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Немає дозволу |
| `XOOPS_PERMISSION_VIEW` | 1 | Переглянути вміст |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Надіслати вміст |
| `XOOPS_PERMISSION_EDIT` | 4 | Редагувати вміст |
| `XOOPS_PERMISSION_DELETE` | 8 | Видалити вміст |
| `XOOPS_PERMISSION_ADMIN` | 16 | Доступ адміністратора |

### Перевірка дозволів
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
## Обробник користувача

UserHandler керує операціями збереження користувача.
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
## Повний приклад керування користувачами
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
## Найкращі практики

1. **Хешувати паролі** - завжди використовуйте bcrypt або argon2 для хешування паролів
2. **Перевірити введені дані** - перевірити та очистити всі введені користувачем дані
3. **Перевірте дозволи** - Завжди перевіряйте дозволи користувача перед діями
4. **Використовуйте сеанси безпечно** - Повторно генеруйте ідентифікатори сеансів під час входу
5. **Реєстрація дій** - журнал входу, виходу з системи та критичних дій
6. **Обмеження швидкості** - запровадити обмеження кількості спроб входу
7. **Лише HTTPS** - завжди використовуйте HTTPS для автентифікації
8. **Керування групами** - Використовуйте групи для організації дозволів

## Пов'язана документація

- ../Kernel/Kernel-Classes - Служби ядра та завантаження
- ../Database/QueryBuilder - Запити до бази даних для даних користувача
- ../Core/XoopsObject - Базовий клас об'єктів

---

*Див. також: [XOOPS Користувач API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP Безпека](https://www.php.net/manual/en/book.password.php)*