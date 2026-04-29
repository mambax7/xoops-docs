---
title: "XOOPS מערכת משתמש"
description: "XoopsUser שיעור, XoopsGroup ניהול, אימות משתמשים, טיפול בהפעלה ובקרת גישה"
---
מערכת המשתמש XOOPS מנהלת חשבונות משתמש, אימות, הרשאות, חברות בקבוצה וניהול הפעלה. הוא מספק מסגרת חזקה לאבטחת האפליקציה שלך ושליטה בגישה למשתמשים.

## ארכיטקטורת מערכת משתמש
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
## XoopsUser שיעור

מחלקת אובייקט המשתמש הראשי המייצגת חשבון משתמש.

### סקירת כיתה
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
### קונסטרוקטור
```php
public function __construct(int $uid = null)
```
יוצר אובייקט משתמש חדש, אופציונלי לטעון ממסד הנתונים לפי מזהה.

**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$uid` | int | מזהה משתמש לטעינה (אופציונלי) |

**דוּגמָה:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### מאפייני ליבה

| נכס | הקלד | תיאור |
|--------|------|--------|
| `uid` | int | מזהה משתמש |
| `uname` | מחרוזת | שם משתמש |
| `email` | מחרוזת | כתובת דואר אלקטרוני |
| `pass` | מחרוזת | סיסמא hash |
| `uregdate` | int | חותמת זמן רישום |
| `ulevel` | int | רמת משתמש (9=מנהל, 1=משתמש) |
| `groups` | מערך | מזהי קבוצה |
| `permissions` | מערך | דגלי הרשאה |

### שיטות ליבה

#### getID / getUid

מקבל את תעודת הזהות של המשתמש.
```php
public function getID(): int
public function getUid(): int  // Alias
```
**החזרות:** `int` - מזהה משתמש

**דוגמה:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### getUnameReal

מקבל את שם התצוגה של המשתמש.
```php
public function getUnameReal(): string
```
**החזרות:** `string` - השם האמיתי של המשתמש

**דוגמה:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### getEmail

מקבל את כתובת האימייל של המשתמש.
```php
public function getEmail(): string
```
**החזרות:** `string` - כתובת אימייל

**דוגמה:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
#### getVar / setVar

מקבל או מגדיר משתנה משתמש.
```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**דוּגמָה:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### getGroups

מקבל את החברות בקבוצה של המשתמש.
```php
public function getGroups(): array
```
**החזרות:** `array` - מערך מזהי קבוצה

**דוגמה:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
#### הוא בקבוצה

בודק אם המשתמש שייך לקבוצה.
```php
public function isInGroup(int $groupId): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$groupId` | int | מזהה קבוצה לבדיקה |

**החזרות:** `bool` - נכון אם בקבוצה

**דוגמה:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### הוא אדמין

בודק אם המשתמש הוא מנהל מערכת.
```php
public function isAdmin(): bool
```
**מחזירות:** `bool` - נכון אם מנהל

**דוגמה:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### getProfile

מקבל מידע על פרופיל משתמש.
```php
public function getProfile(): array
```
**החזרות:** `array` - נתוני פרופיל

**דוגמה:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### הוא פעיל

בודק אם חשבון המשתמש פעיל.
```php
public function isActive(): bool
```
**החזרות:** `bool` - נכון אם פעיל

**דוגמה:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### updateLastLogin

מעדכן את חותמת הכניסה האחרונה של המשתמש.
```php
public function updateLastLogin(): bool
```
**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## XoopsGroup שיעור

מנהל קבוצות משתמשים והרשאות.

### סקירת כיתה
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
### קבועים

| קבוע | ערך | תיאור |
|--------|-------|------------|
| `TYPE_NORMAL` | 0 | קבוצת משתמשים רגילה |
| `TYPE_ADMIN` | 1 | קבוצה מנהלית |
| `TYPE_SYSTEM` | 2 | קבוצת מערכת |

### שיטות

#### getName

מקבל את שם הקבוצה.
```php
public function getName(): string
```
**החזרות:** `string` - שם הקבוצה

**דוגמה:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### getDescription

מקבל את תיאור הקבוצה.
```php
public function getDescription(): string
```
**החזרות:** `string` - תיאור

**דוגמה:**
```php
echo $group->getDescription();
```
#### getUsers

מקבל חברי קבוצה.
```php
public function getUsers(): array
```
**החזרות:** `array` - מערך מזהי משתמש

**דוגמה:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### addUser

מוסיף משתמש לקבוצה.
```php
public function addUser(int $uid): bool
```
**פרמטרים:**

| פרמטר | הקלד | תיאור |
|-----------|------|------------|
| `$uid` | int | מזהה משתמש |

**החזרות:** `bool` - נכון לגבי הצלחה

**דוגמה:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### הסר משתמש

מסיר משתמש מהקבוצה.
```php
public function removeUser(int $uid): bool
```
**דוּגמָה:**
```php
$group->removeUser(123);
```
## אימות משתמש

### תהליך התחברות
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
### ניהול סיסמאות
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
## ניהול מפגשים

### שיעור מושב
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
### שיטות הפעלה

#### התחל הפעלה
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
#### בדוק הפעלה
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
#### הרס סשן
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
## מערכת הרשאות

### קבועי הרשאה

| קבוע | ערך | תיאור |
|--------|-------|------------|
| `XOOPS_PERMISSION_NONE` | 0 | אין רשות |
| `XOOPS_PERMISSION_VIEW` | 1 | צפה בתוכן |
| `XOOPS_PERMISSION_SUBMIT` | 2 | שלח תוכן |
| `XOOPS_PERMISSION_EDIT` | 4 | ערוך תוכן |
| `XOOPS_PERMISSION_DELETE` | 8 | מחק תוכן |
| `XOOPS_PERMISSION_ADMIN` | 16 | גישת מנהל |

### בדיקת הרשאות
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
## מטפל משתמש

ה-UserHandler מנהל את פעולות ההתמדה של המשתמש.
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
## דוגמה מלאה לניהול משתמשים
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
## שיטות עבודה מומלצות

1. **סיסמאות גיבוב** - השתמש תמיד ב-bcrypt או argon2 ל-hash סיסמה
2. **אמת קלט** - אמת וחיטוי כל קלט המשתמש
3. **בדוק הרשאות** - אמת תמיד את הרשאות המשתמש לפני פעולות
4. **השתמש בהפעלות בצורה מאובטחת** - צור מחדש מזהי הפעלה בעת הכניסה
5. **פעילויות יומן** - התחברות, התנתקות ופעולות קריטיות
6. **הגבלת תעריף** - יישם הגבלת שיעור ניסיונות הכניסה
7. **HTTPS בלבד** - השתמש תמיד ב-HTTPS לאימות
8. **ניהול קבוצות** - השתמש בקבוצות לארגון הרשאות

## תיעוד קשור

- ../Kernel/Kernel-Classes - שירותי ליבה ו-bootstrapping
- ../Database/QueryBuilder - שאילתות מסד נתונים עבור נתוני משתמשים
- ../Core/XoopsObject - מחלקת אובייקט בסיס

---

*ראה גם: [XOOPS משתמש API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP אבטחה](https://www.php.net/manual/en/book.password.php)*