---
title: "XOOPS ระบบผู้ใช้"
description: "คลาส XoopsUser, การจัดการ XoopsGroup, การตรวจสอบสิทธิ์ผู้ใช้, การจัดการเซสชัน และการควบคุมการเข้าถึง"
---
ระบบผู้ใช้ XOOPS จัดการบัญชีผู้ใช้ การรับรองความถูกต้อง การอนุญาต การเป็นสมาชิกกลุ่ม และการจัดการเซสชัน โดยมีเฟรมเวิร์กที่แข็งแกร่งสำหรับการรักษาความปลอดภัยแอปพลิเคชันของคุณและควบคุมการเข้าถึงของผู้ใช้

## สถาปัตยกรรมระบบผู้ใช้
```
mermaid
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
## คลาส XoopsUser

คลาสอ็อบเจ็กต์ผู้ใช้หลักที่แสดงถึงบัญชีผู้ใช้

### ภาพรวมชั้นเรียน
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
### ตัวสร้าง
```php
public function __construct(int $uid = null)
```
สร้างวัตถุผู้ใช้ใหม่ โดยสามารถเลือกโหลดจากฐานข้อมูลโดย ID

**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$uid` | อินท์ | ผู้ใช้ ID เพื่อโหลด (ไม่บังคับ) |

**ตัวอย่าง:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### คุณสมบัติหลัก

| คุณสมบัติ | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `uid` | อินท์ | ผู้ใช้ ID |
| `uname` | สตริง | ชื่อผู้ใช้ |
| `email` | สตริง | ที่อยู่อีเมล |
| `pass` | สตริง | รหัสผ่านแฮช |
| `uregdate` | อินท์ | ประทับเวลาการลงทะเบียน |
| `ulevel` | อินท์ | ระดับผู้ใช้ (9=ผู้ดูแลระบบ, 1=ผู้ใช้) |
| `groups` | อาร์เรย์ | รหัสกลุ่ม |
| `permissions` | อาร์เรย์ | ธงการอนุญาต |

### วิธีการหลัก

####getID/getUid

รับ ID ของผู้ใช้
```php
public function getID(): int
public function getUid(): int  // Alias
```
**ผลตอบแทน:** `int` - ผู้ใช้ ID

**ตัวอย่าง:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### รับ UnameReal

รับชื่อที่แสดงของผู้ใช้
```php
public function getUnameReal(): string
```
**ผลตอบแทน:** `string` - ชื่อจริงของผู้ใช้

**ตัวอย่าง:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### รับอีเมล์

รับที่อยู่อีเมลของผู้ใช้
```php
public function getEmail(): string
```
**การส่งคืน:** `string` - ที่อยู่อีเมล

**ตัวอย่าง:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
####getVar / setVar

รับหรือตั้งค่าตัวแปรผู้ใช้
```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**ตัวอย่าง:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### รับกลุ่ม

รับความเป็นสมาชิกกลุ่มของผู้ใช้
```php
public function getGroups(): array
```
**ผลตอบแทน:** `array` - อาร์เรย์ของรหัสกลุ่ม

**ตัวอย่าง:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
#### อยู่ในกลุ่ม

ตรวจสอบว่าผู้ใช้อยู่ในกลุ่มหรือไม่
```php
public function isInGroup(int $groupId): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$groupId` | อินท์ | จัดกลุ่ม ID เพื่อตรวจสอบ |

**ผลตอบแทน:** `bool` - จริงหากอยู่ในกลุ่ม

**ตัวอย่าง:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### คือผู้ดูแลระบบ

ตรวจสอบว่าผู้ใช้เป็นผู้ดูแลระบบหรือไม่
```php
public function isAdmin(): bool
```
**ผลตอบแทน:** `bool` - จริงหากผู้ดูแลระบบ

**ตัวอย่าง:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### รับโปรไฟล์

รับข้อมูลโปรไฟล์ผู้ใช้
```php
public function getProfile(): array
```
**ผลตอบแทน:** `array` - ข้อมูลโปรไฟล์

**ตัวอย่าง:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### เปิดใช้งานอยู่

ตรวจสอบว่าบัญชีผู้ใช้มีการใช้งานอยู่หรือไม่
```php
public function isActive(): bool
```
**ผลตอบแทน:** `bool` - จริงหากใช้งานอยู่

**ตัวอย่าง:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### อัพเดตล่าสุดเข้าสู่ระบบ

อัปเดตการประทับเวลาเข้าสู่ระบบครั้งล่าสุดของผู้ใช้
```php
public function updateLastLogin(): bool
```
**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## คลาส XoopsGroup

จัดการกลุ่มผู้ใช้และการอนุญาต

### ภาพรวมชั้นเรียน
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
### ค่าคงที่

| ค่าคงที่ | ค่า | คำอธิบาย |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | กลุ่มผู้ใช้ปกติ |
| `TYPE_ADMIN` | 1 | กลุ่มธุรการ |
| `TYPE_SYSTEM` | 2 | กลุ่มระบบ |

### วิธีการ

#### รับชื่อ

รับชื่อกลุ่ม
```php
public function getName(): string
```
**ผลตอบแทน:** `string` - ชื่อกลุ่ม

**ตัวอย่าง:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### รับคำอธิบาย

รับคำอธิบายกลุ่ม
```php
public function getDescription(): string
```
**ผลตอบแทน:** `string` - คำอธิบาย

**ตัวอย่าง:**
```php
echo $group->getDescription();
```
#### รับผู้ใช้

รับสมาชิกกลุ่ม
```php
public function getUsers(): array
```
**ผลตอบแทน:** `array` - อาร์เรย์ของรหัสผู้ใช้

**ตัวอย่าง:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### เพิ่มผู้ใช้

เพิ่มผู้ใช้ในกลุ่ม
```php
public function addUser(int $uid): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$uid` | อินท์ | ผู้ใช้ ID |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### ลบผู้ใช้

ลบผู้ใช้ออกจากกลุ่ม
```php
public function removeUser(int $uid): bool
```
**ตัวอย่าง:**
```php
$group->removeUser(123);
```
## การตรวจสอบผู้ใช้

### กระบวนการเข้าสู่ระบบ
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
### การจัดการรหัสผ่าน
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
## การจัดการเซสชัน

### ชั้นเรียนเซสชั่น
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
### วิธีการเซสชัน

#### เริ่มเซสชัน
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
#### ตรวจสอบเซสชัน
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
#### ทำลายเซสชัน
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
## ระบบการอนุญาต

### ค่าคงที่การอนุญาต

| ค่าคงที่ | ค่า | คำอธิบาย |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | ไม่ได้รับอนุญาต |
| `XOOPS_PERMISSION_VIEW` | 1 | ดูเนื้อหา |
| `XOOPS_PERMISSION_SUBMIT` | 2 | ส่งเนื้อหา |
| `XOOPS_PERMISSION_EDIT` | 4 | แก้ไขเนื้อหา |
| `XOOPS_PERMISSION_DELETE` | 8 | ลบเนื้อหา |
| `XOOPS_PERMISSION_ADMIN` | 16 | การเข้าถึงของผู้ดูแลระบบ |

### การตรวจสอบสิทธิ์
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
## ตัวจัดการผู้ใช้

UserHandler จัดการการดำเนินการคงอยู่ของผู้ใช้
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
## ตัวอย่างการจัดการผู้ใช้ที่สมบูรณ์
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **รหัสผ่านแฮช** - ใช้ bcrypt หรือ argon2 เสมอสำหรับการแฮชรหัสผ่าน
2. **ตรวจสอบอินพุต** - ตรวจสอบและฆ่าเชื้ออินพุตของผู้ใช้ทั้งหมด
3. **ตรวจสอบสิทธิ์** - ตรวจสอบสิทธิ์ผู้ใช้ก่อนดำเนินการทุกครั้ง
4. **ใช้เซสชันอย่างปลอดภัย** - สร้าง ID เซสชันใหม่เมื่อเข้าสู่ระบบ
5. **บันทึกกิจกรรม** - บันทึกการเข้าสู่ระบบ ออกจากระบบ และการดำเนินการที่สำคัญ
6. **การจำกัดอัตรา** - ใช้การจำกัดอัตราความพยายามในการเข้าสู่ระบบ
7. **HTTPS เท่านั้น** - ใช้ HTTPS ในการตรวจสอบสิทธิ์เสมอ
8. **การจัดการกลุ่ม** - ใช้กลุ่มสำหรับองค์กรที่ได้รับอนุญาต

## เอกสารที่เกี่ยวข้อง

- ../Kernel/Kernel-Classes - บริการเคอร์เนลและการบูตสแตรปปิ้ง
- ../Database/QueryBuilder - สืบค้นฐานข้อมูลสำหรับข้อมูลผู้ใช้
- ../Core/XoopsObject - คลาสอ็อบเจ็กต์ฐาน

---

*ดูเพิ่มเติมที่: [¤XOOPS ผู้ใช้ API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP ความปลอดภัย](https://www.php.net/manual/en/book.password.php)*