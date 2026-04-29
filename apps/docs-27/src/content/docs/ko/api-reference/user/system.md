---
title: "XOOPS 사용자 시스템"
description: "XoopsUser 클래스, XoopsGroup 관리, 사용자 인증, 세션 처리, 접근 제어"
---

XOOPS 사용자 시스템은 사용자 계정, 인증, 권한 부여, 그룹 멤버십 및 세션 관리를 관리합니다. 이는 애플리케이션을 보호하고 사용자 액세스를 제어하기 위한 강력한 프레임워크를 제공합니다.

## 사용자 시스템 아키텍처

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

## XoopsUser 클래스

사용자 계정을 나타내는 기본 사용자 개체 클래스입니다.

### 클래스 개요

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

### 생성자

```php
public function __construct(int $uid = null)
```

선택적으로 ID별로 데이터베이스에서 로드하여 새 사용자 개체를 만듭니다.

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$uid` | 정수 | 로드할 사용자 ID(선택 사항) |

**예:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### 핵심 속성

| 부동산 | 유형 | 설명 |
|----------|------|-------------|
| `uid` | 정수 | 사용자 ID |
| `uname` | 문자열 | 사용자 이름 |
| `email` | 문자열 | 이메일 주소 |
| `pass` | 문자열 | 비밀번호 해시 |
| `uregdate` | 정수 | 등록 타임스탬프 |
| `ulevel` | 정수 | 사용자 수준(9=관리자, 1=사용자) |
| `groups` | 배열 | 그룹 ID |
| `permissions` | 배열 | 허가 플래그 |

### 핵심 메소드

#### getID / getUid

사용자의 ID를 가져옵니다.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**반환:** `int` - 사용자 ID

**예:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

사용자의 표시 이름을 가져옵니다.

```php
public function getUnameReal(): string
```

**반환:** `string` - 사용자의 실명

**예:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### 이메일 받기

사용자의 이메일 주소를 가져옵니다.

```php
public function getEmail(): string
```

**반품:** `string` - 이메일 주소

**예:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

사용자 변수를 가져오거나 설정합니다.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**예:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

사용자의 그룹 멤버십을 가져옵니다.

```php
public function getGroups(): array
```

**반환:** `array` - 그룹 ID 배열

**예:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

사용자가 그룹에 속해 있는지 확인합니다.

```php
public function isInGroup(int $groupId): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$groupId` | 정수 | 확인할 그룹ID |

**반환:** `bool` - 그룹에 있는 경우 True

**예:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### isAdmin

사용자가 관리자인지 확인합니다.

```php
public function isAdmin(): bool
```

**반환:** `bool` - 관리자인 경우 True

**예:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### 프로필 가져오기

사용자 프로필 정보를 가져옵니다.

```php
public function getProfile(): array
```

**반품:** `array` - 프로필 데이터

**예:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### isActive

사용자 계정이 활성화되어 있는지 확인합니다.

```php
public function isActive(): bool
```

**반환:** `bool` - 활성인 경우 True입니다.

**예:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### 업데이트마지막 로그인

사용자의 마지막 로그인 타임스탬프를 업데이트합니다.

```php
public function updateLastLogin(): bool
```

**반환:** `bool` - 성공 시 True

**예:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XoopsGroup 클래스

사용자 그룹 및 권한을 관리합니다.

### 클래스 개요

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

### 상수

| 상수 | 가치 | 설명 |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | 일반 사용자 그룹 |
| `TYPE_ADMIN` | 1 | 관리 그룹 |
| `TYPE_SYSTEM` | 2 | 시스템 그룹 |

### 방법

#### getName

그룹 이름을 가져옵니다.

```php
public function getName(): string
```

**반환:** `string` - 그룹 이름

**예:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

그룹 설명을 가져옵니다.

```php
public function getDescription(): string
```

**반품:** `string` - 설명

**예:**
```php
echo $group->getDescription();
```

#### getUsers

그룹 구성원을 가져옵니다.

```php
public function getUsers(): array
```

**반환:** `array` - 사용자 ID 배열

**예:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### 사용자 추가

그룹에 사용자를 추가합니다.

```php
public function addUser(int $uid): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$uid` | 정수 | 사용자 ID |

**반환:** `bool` - 성공 시 True

**예:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### 제거사용자

그룹에서 사용자를 제거합니다.

```php
public function removeUser(int $uid): bool
```

**예:**
```php
$group->removeUser(123);
```

## 사용자 인증

### 로그인 프로세스

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

### 비밀번호 관리

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

## 세션 관리

### 세션 클래스

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

### 세션 방법

#### 세션 시작

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

#### 세션 확인

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

#### 세션 삭제

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

## 권한 시스템

### 권한 상수

| 상수 | 가치 | 설명 |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | 권한 없음 |
| `XOOPS_PERMISSION_VIEW` | 1 | 콘텐츠 보기 |
| `XOOPS_PERMISSION_SUBMIT` | 2 | 콘텐츠 제출 |
| `XOOPS_PERMISSION_EDIT` | 4 | 콘텐츠 편집 |
| `XOOPS_PERMISSION_DELETE` | 8 | 콘텐츠 삭제 |
| `XOOPS_PERMISSION_ADMIN` | 16 | 관리자 액세스 |

### 권한 확인

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

## 사용자 핸들러

UserHandler는 사용자 지속성 작업을 관리합니다.

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

## 완전한 사용자 관리 예시

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

## 모범 사례

1. **해시 비밀번호** - 비밀번호 해싱에는 항상 bcrypt 또는 argon2를 사용하세요.
2. **입력 유효성 검사** - 모든 사용자 입력 유효성을 검사하고 삭제합니다.
3. **권한 확인** - 작업 전에 항상 사용자 권한을 확인하세요.
4. **세션을 안전하게 사용** - 로그인 시 세션 ID 재생성
5. **활동 기록** - 로그인, 로그아웃 및 중요한 작업을 기록합니다.
6. **속도 제한** - 로그인 시도 속도 제한 구현
7. **HTTPS만** - 인증에 항상 HTTPS를 사용합니다.
8. **그룹 관리** - 권한 구성을 위해 그룹을 사용합니다.

## 관련 문서

-../Kernel/Kernel-Classes - 커널 서비스 및 부트스트래핑
-../Database/QueryBuilder - 사용자 데이터에 대한 데이터베이스 쿼리
-../Core/XoopsObject - 기본 객체 클래스

---

*참조: [XOOPS 사용자 API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP 보안](https://www.php.net/manual/en/book.password.php)*
