---
title: “XOOPS用户系统”
description: “XOOPSUser 类、XOOPSGroup 管理、用户身份验证、会话处理和访问控制”
---

XOOPS用户系统管理用户帐户、身份验证、授权、组成员身份和会话管理。它提供了一个强大的框架来保护您的应用程序并控制用户访问。

## 用户系统架构

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

## XOOPSUser 类

代表用户帐户的主要用户对象类。

### 班级概览

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

### 构造函数

```php
public function __construct(int $uid = null)
```

创建一个新的用户对象，可以选择通过 ID 从数据库加载。

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$uid` |整数 |要加载的用户 ID（可选）|

**示例：**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### 核心属性

|物业 |类型 |描述 |
|----------|------|-------------|
| `uid` |整数 |用户名 |
| `uname` |字符串|用户名 |
| `email` |字符串|电子邮件地址 |
| `pass` |字符串|密码哈希 |
| `uregdate` |整数 |注册时间戳 |
| `ulevel` |整数 |用户级别（9=管理员，1=用户）|
| `groups` |数组|组 ID |
| `permissions` |数组|权限标志|

### 核心方法

#### 获取ID / 获取Uid

获取用户的 ID。

```php
public function getID(): int
public function getUid(): int  // Alias
```

**返回：** `int` - 用户 ID

**示例：**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

获取用户的显示名称。

```php
public function getUnameReal(): string
```

**返回：** `string` - 用户的真实姓名

**示例：**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### 获取电子邮件

获取用户的电子邮件地址。

```php
public function getEmail(): string
```

**退货：** `string` - 电子邮件地址

**示例：**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### 获取变量/设置变量

获取或设置用户变量。

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**示例：**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### 获取组

获取用户的组成员身份。

```php
public function getGroups(): array
```

**返回：** `array` - 组 ID 数组

**示例：**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### 属于组内

检查用户是否属于某个组。

```php
public function isInGroup(int $groupId): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$groupId` |整数 |要检查的组 ID |

**返回：** `bool` - 如果在组中则为 True

**示例：**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### 是管理员

检查用户是否是管理员。

```php
public function isAdmin(): bool
```

**返回：** `bool` - 如果管理员则为 True

**示例：**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### 获取个人资料

获取用户个人资料信息。

```php
public function getProfile(): array
```

**返回：** `array` - 个人资料数据

**示例：**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### 处于活动状态

检查用户帐户是否处于活动状态。

```php
public function isActive(): bool
```

**返回：** `bool` - 如果有效则为 True

**示例：**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### 更新上次登录

更新用户的上次登录时间戳。

```php
public function updateLastLogin(): bool
```

**返回：** `bool` - 成功则为真

**示例：**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## XOOPSGroup 类

管理用户组和权限。

### 班级概览

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

### 常量

|恒定|价值|描述 |
|----------|---------|-------------|
| `TYPE_NORMAL`| 0 |普通用户组|
| `TYPE_ADMIN` | 1 |行政组|
| `TYPE_SYSTEM` | 2 |系统组|

### 方法

#### 获取名称

获取组名称。

```php
public function getName(): string
```

**返回：** `string` - 组名称

**示例：**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### 获取描述

获取组描述。

```php
public function getDescription(): string
```

**退货：** `string` - 说明

**示例：**
```php
echo $group->getDescription();
```

#### 获取用户

获取群组成员。

```php
public function getUsers(): array
```

**返回：** `array` - 用户 ID 数组

**示例：**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### 添加用户

将用户添加到组中。

```php
public function addUser(int $uid): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$uid` |整数 |用户名 |

**返回：** `bool` - 成功则为真

**示例：**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### 删除用户

从组中删除用户。

```php
public function removeUser(int $uid): bool
```

**示例：**
```php
$group->removeUser(123);
```

## 用户认证

### 登录流程

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

### 密码管理

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

## 会话管理

### 会话类

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

### 会话方法

#### 开始会话

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

#### 检查会话

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

#### 销毁会话

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

## 权限系统

### 权限常量|恒定|价值|描述 |
|----------|---------|-------------|
| `XOOPS_PERMISSION_NONE`| 0 |没有权限 |
| `XOOPS_PERMISSION_VIEW` | 1 |查看内容 |
| `XOOPS_PERMISSION_SUBMIT`| 2 |提交内容 |
| `XOOPS_PERMISSION_EDIT`| 4 |编辑内容 |
| `XOOPS_PERMISSION_DELETE` | 8 |删除内容 |
| `XOOPS_PERMISSION_ADMIN` | 16 | 16管理员访问 |

### 权限检查

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

## 用户处理程序

UserHandler 管理用户持久性操作。

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

## 完整的用户管理示例

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

## 最佳实践

1. **哈希密码** - 始终使用 bcrypt 或 argon2 进行密码哈希
2. **验证输入** - 验证并清理所有用户输入
3. **检查权限** - 在执行操作之前始终验证用户权限
4. **安全地使用会话** - 登录时重新生成会话 ID
5. **记录活动** - 记录登录、注销和关键操作
6. **速率限制** - 实施登录尝试速率限制
7. **仅限HTTPS** - 始终使用HTTPS进行身份验证
8. **群组管理** - 使用群组进行权限组织

## 相关文档

- ../Kernel/Kernel-Classes - 内核服务和引导
- ../Database/QueryBuilder - 用户数据的数据库查询
- ../Core/XOOPSObject - 基础对象类

---

*另请参阅：[XOOPS User API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class) | [PHP Security](https://www.php.net/manual/en/book.password.php)*