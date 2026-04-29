---
title: "سیستم کاربر XOOPS"
description: "کلاس XoopsUser، مدیریت XoopsGroup، احراز هویت کاربر، مدیریت جلسه و کنترل دسترسی"
---
سیستم کاربر XOOPS حساب های کاربری، احراز هویت، مجوز، عضویت در گروه و مدیریت جلسه را مدیریت می کند. این یک چارچوب قوی برای ایمن سازی برنامه شما و کنترل دسترسی کاربر فراهم می کند.

## معماری سیستم کاربر

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

## کلاس XoopsUser

کلاس شیء کاربر اصلی که یک حساب کاربری را نشان می دهد.

### مرور کلی کلاس

```php
namespace XOOPS\Core\User;

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

### سازنده

```php
public function __construct(int $uid = null)
```

یک شی کاربر جدید ایجاد می کند که به صورت اختیاری از پایگاه داده توسط ID بارگیری می شود.

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$uid` | int | شناسه کاربری برای بارگیری (اختیاری) |

**مثال:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### خواص اصلی

| اموال | نوع | توضیحات |
|----------|------|-------------|
| `uid` | int | شناسه کاربری |
| `uname` | رشته | نام کاربری |
| `email` | رشته | آدرس ایمیل |
| `pass` | رشته | هش رمز عبور |
| `uregdate` | int | مهر زمانی ثبت نام |
| `ulevel` | int | سطح کاربر (9=ادمین، 1=کاربر) |
| `groups` | آرایه | شناسه گروه |
| `permissions` | آرایه | پرچم های مجوز |

### روشهای اصلی

#### getID / getUid

شناسه کاربر را می گیرد.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**برگرداندن:** `int` - شناسه کاربری

**مثال:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

نام نمایشی کاربر را دریافت می کند.

```php
public function getUnameReal(): string
```

**برگرداندن:** `string` - نام واقعی کاربر

**مثال:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### ایمیل دریافت کنید

آدرس ایمیل کاربر را دریافت می کند.

```php
public function getEmail(): string
```

**بازگشت:** `string` - آدرس ایمیل

**مثال:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

یک متغیر کاربر را دریافت یا تنظیم می کند.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**مثال:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### دریافت گروه ها

عضویت های گروه کاربر را دریافت می کند.

```php
public function getGroups(): array
```

**برگرداندن:** `array` - آرایه شناسه های گروه

**مثال:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### InGroup است

بررسی می کند که آیا کاربر به یک گروه تعلق دارد.

```php
public function isInGroup(int $groupId): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$groupId` | int | شناسه گروه برای بررسی |

**برگرداند:** `bool` - اگر در گروه باشد درست است

**مثال:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### مدیر است

بررسی می کند که آیا کاربر مدیر است یا خیر.

```php
public function isAdmin(): bool
```

**برگرداندن:** `bool` - درست است اگر مدیر

**مثال:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### دریافت نمایه

اطلاعات پروفایل کاربر را دریافت می کند.

```php
public function getProfile(): array
```

**بازگشت:** `array` - داده های نمایه

**مثال:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### فعال است

بررسی می کند که آیا حساب کاربری فعال است یا خیر.

```php
public function isActive(): bool
```

**برگرداند:** `bool` - اگر فعال باشد درست است

**مثال:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### به روز رسانیLastLogin

آخرین مهر زمانی ورود کاربر را به روز می کند.

```php
public function updateLastLogin(): bool
```

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## کلاس XoopsGroup

گروه های کاربری و مجوزها را مدیریت می کند.

### مرور کلی کلاس

```php
namespace XOOPS\Core\User;

class XoopsGroup extends XoopsObject
{
    protected int $groupid = 0;
    protected string $name = '';
    protected string $description = '';
    protected int $group_type = 0;
    protected array $users = [];
}
```

### ثابت ها

| ثابت | ارزش | توضیحات |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | گروه کاربر عادی |
| `TYPE_ADMIN` | 1 | گروه اداری |
| `TYPE_SYSTEM` | 2 | گروه سیستم |

### روش ها

#### getName

نام گروه را دریافت می کند.

```php
public function getName(): string
```

**بازگشت:** `string` - نام گروه

**مثال:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### دریافت توضیحات

توضیحات گروه را دریافت می کند.

```php
public function getDescription(): string
```

**بازگشت:** `string` - توضیحات

**مثال:**
```php
echo $group->getDescription();
```

#### کاربران را دریافت کنید

اعضای گروه را می گیرد.

```php
public function getUsers(): array
```

**برگرداندن:** `array` - آرایه ای از شناسه های کاربر

**مثال:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

کاربر را به گروه اضافه می کند.

```php
public function addUser(int $uid): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$uid` | int | شناسه کاربری |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### removeUser

کاربر را از گروه حذف می کند.

```php
public function removeUser(int $uid): bool
```

**مثال:**
```php
$group->removeUser(123);
```## احراز هویت کاربر

### فرآیند ورود

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

### مدیریت رمز عبور

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

## مدیریت جلسه

### کلاس جلسه

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

### روش های جلسه

#### شروع جلسه

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

#### جلسه را بررسی کنید

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

## سیستم مجوز

### ثابت های مجوز

| ثابت | ارزش | توضیحات |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | بدون اجازه |
| `XOOPS_PERMISSION_VIEW` | 1 | مشاهده مطالب |
| `XOOPS_PERMISSION_SUBMIT` | 2 | ارسال مطالب |
| `XOOPS_PERMISSION_EDIT` | 4 | ویرایش مطالب |
| `XOOPS_PERMISSION_DELETE` | 8 | حذف مطالب |
| `XOOPS_PERMISSION_ADMIN` | 16 | دسترسی ادمین |

### بررسی مجوز

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

## راهنمای کاربر

UserHandler عملیات پایداری کاربر را مدیریت می کند.

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

## مثال کامل مدیریت کاربر

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

## بهترین شیوه ها

1. ** رمز عبور هش ** - همیشه از bcrypt یا argon2 برای هش رمز عبور استفاده کنید
2. **Validate Input** - تمام ورودی های کاربر را اعتبارسنجی و پاکسازی کنید
3. **بررسی مجوزها** - همیشه قبل از اقدام، مجوزهای کاربر را تأیید کنید
4. **از Sessions به طور ایمن استفاده کنید** - شناسه های جلسه را در هنگام ورود دوباره ایجاد کنید
5. ** فعالیت های ورود ** - ورود به سیستم، خروج از سیستم، و اقدامات حیاتی
6. **محدودیت نرخ** - اعمال محدودیت نرخ تلاش برای ورود به سیستم
7. **فقط HTTPS** - همیشه از HTTPS برای احراز هویت استفاده کنید
8. **مدیریت گروه** - از گروه ها برای سازماندهی مجوز استفاده کنید

## مستندات مرتبط

- ../Kernel/Kernel-Classes - خدمات کرنل و بوت استرپ
- ../Database/QueryBuilder - جستجوهای پایگاه داده برای داده های کاربر
- ../Core/XoopsObject - کلاس شی پایه

---

*همچنین ببینید: [XOOPS User API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [امنیت PHP](https://www.php.net/manual/en/book.password.php)*