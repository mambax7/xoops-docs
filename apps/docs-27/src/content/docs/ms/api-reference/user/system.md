---
title: "Sistem Pengguna XOOPS"
description: "Kelas XoopsUser, pengurusan XoopsGroup, pengesahan pengguna, pengendalian sesi dan kawalan akses"
---
Sistem Pengguna XOOPS mengurus akaun pengguna, pengesahan, kebenaran, keahlian kumpulan dan pengurusan sesi. Ia menyediakan rangka kerja yang teguh untuk melindungi aplikasi anda dan mengawal akses pengguna.## Seni Bina Sistem Pengguna
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
## Kelas XoopsUserKelas objek pengguna utama yang mewakili akaun pengguna.### Gambaran Keseluruhan Kelas
```
php
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
### Pembina
```
php
public function __construct(int $uid = null)
```
Mencipta objek pengguna baharu, secara pilihan memuatkan daripada pangkalan data mengikut ID.**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$uid` | int | ID pengguna untuk dimuatkan (pilihan) |**Contoh:**
```
php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### Harta Teras| Hartanah | Taip | Penerangan |
|----------|------|-------------|
| `uid` | int | ID Pengguna |
| `uname` | rentetan | Nama pengguna |
| `email` | rentetan | Alamat e-mel |
| `pass` | rentetan | Cincang kata laluan |
| `uregdate` | int | Cap masa pendaftaran |
| `ulevel` | int | Tahap pengguna (9=pentadbir, 1=pengguna) |
| `groups` | tatasusunan | ID Kumpulan |
| `permissions` | tatasusunan | Bendera kebenaran |### Kaedah Teras#### getID / getUidMendapat ID pengguna.
```
php
public function getID(): int
public function getUid(): int  // Alias
```
**Pemulangan:** `int` - ID Pengguna**Contoh:**
```
php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### getUnameRealMendapat nama paparan pengguna.
```
php
public function getUnameReal(): string
```
**Pemulangan:** `string` - Nama sebenar pengguna**Contoh:**
```
php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### dapatkanEmelMendapat alamat e-mel pengguna.
```
php
public function getEmail(): string
```
**Pemulangan:** `string` - Alamat e-mel**Contoh:**
```
php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
#### getVar / setVarMendapat atau menetapkan pembolehubah pengguna.
```
php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**Contoh:**
```
php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### getGroupsMendapat keahlian kumpulan pengguna.
```
php
public function getGroups(): array
```
**Pemulangan:** `array` - Tatasusunan ID kumpulan**Contoh:**
```
php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
#### isInGroupMenyemak sama ada pengguna tergolong dalam kumpulan.
```
php
public function isInGroup(int $groupId): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$groupId` | int | ID Kumpulan untuk menyemak |**Pemulangan:** `bool` - Benar jika dalam kumpulan**Contoh:**
```
php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### ialah AdminMenyemak sama ada pengguna ialah pentadbir.
```
php
public function isAdmin(): bool
```
**Pemulangan:** `bool` - Benar jika pentadbir**Contoh:**
```
php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### getProfileMendapat maklumat profil pengguna.
```
php
public function getProfile(): array
```
**Pemulangan:** `array` - Data profil**Contoh:**
```
php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### adalah AktifMenyemak sama ada akaun pengguna aktif.
```
php
public function isActive(): bool
```
**Pemulangan:** `bool` - Benar jika aktif**Contoh:**
```
php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### kemas kiniLastLoginMengemas kini cap masa log masuk terakhir pengguna.
```
php
public function updateLastLogin(): bool
```
**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## Kelas XoopsGroupMengurus kumpulan pengguna dan kebenaran.### Gambaran Keseluruhan Kelas
```
php
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
### Pemalar| Malar | Nilai | Penerangan |
|----------|-------|-------------|
| `TYPE_NORMAL` | 0 | Kumpulan pengguna biasa |
| `TYPE_ADMIN` | 1 | Kumpulan pentadbiran |
| `TYPE_SYSTEM` | 2 | Kumpulan sistem |### Kaedah#### getNameMendapat nama kumpulan.
```
php
public function getName(): string
```
**Pemulangan:** `string` - Nama kumpulan**Contoh:**
```
php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### getDescriptionMendapat penerangan kumpulan.
```
php
public function getDescription(): string
```
**Pemulangan:** `string` - Penerangan**Contoh:**
```
php
echo $group->getDescription();
```
#### getUsersMendapat ahli kumpulan.
```
php
public function getUsers(): array
```
**Pemulangan:** `array` - Tatasusunan ID pengguna**Contoh:**
```
php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### addUserMenambah pengguna pada kumpulan.
```
php
public function addUser(int $uid): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$uid` | int | ID Pengguna |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### removeUserMengalih keluar pengguna daripada kumpulan.
```
php
public function removeUser(int $uid): bool
```
**Contoh:**
```
php
$group->removeUser(123);
```
## Pengesahan Pengguna### Proses Log Masuk
```
php
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
### Pengurusan Kata Laluan
```
php
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
## Pengurusan Sesi### Kelas Sesi
```
php
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
### Kaedah Sesi#### Mulakan Sesi
```
php
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
#### Sesi Semak
```
php
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
#### Musnahkan Sesi
```
php
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
## Sistem Kebenaran### Pemalar Kebenaran| Malar | Nilai | Penerangan |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Tiada kebenaran |
| `XOOPS_PERMISSION_VIEW` | 1 | Lihat kandungan |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Hantar kandungan |
| `XOOPS_PERMISSION_EDIT` | 4 | Edit kandungan |
| `XOOPS_PERMISSION_DELETE` | 8 | Padamkan kandungan |
| `XOOPS_PERMISSION_ADMIN` | 16 | Akses pentadbir |### Semakan Kebenaran
```
php
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
## Pengendali PenggunaUserHandler menguruskan operasi kegigihan pengguna.
```
php
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
## Contoh Pengurusan Pengguna Lengkap
```
php
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
## Amalan Terbaik1. **Kata Laluan Cincang** - Sentiasa gunakan bcrypt atau argon2 untuk pencincangan kata laluan
2. **Sahkan Input** - Sahkan dan bersihkan semua input pengguna
3. **Semak Kebenaran** - Sentiasa sahkan kebenaran pengguna sebelum tindakan
4. **Gunakan Sesi Dengan Selamat** - Jana semula ID sesi semasa log masuk
5. **Aktiviti Log** - Log log masuk, log keluar dan tindakan kritikal
6. **Penghadan Kadar** - Laksanakan pengehadan kadar percubaan log masuk
7. **HTTPS Sahaja** - Sentiasa gunakan HTTPS untuk pengesahan
8. **Pengurusan Kumpulan** - Gunakan kumpulan untuk organisasi kebenaran## Dokumentasi Berkaitan- ../Kernel/Kernel-Classes - Perkhidmatan kernel dan bootstrapping
- ../Database/QueryBuilder - Pertanyaan pangkalan data untuk data pengguna
- ../Core/XoopsObject - Kelas objek asas---

*Lihat juga: [XOOPS User API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [Keselamatan PHP](https://www.php.net/manual/en/book.password.php)*