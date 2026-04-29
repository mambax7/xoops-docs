---
title: "XOOPS user Sistemi"
description: "XoopsUser sınıfı, XoopsGroup yönetimi, user kimlik doğrulaması, oturum yönetimi ve erişim kontrolü"
---
XOOPS user Sistemi user hesaplarını, kimlik doğrulamayı, yetkilendirmeyi, grup üyeliğini ve oturum yönetimini yönetir. Uygulamanızı güvence altına almak ve user erişimini kontrol etmek için sağlam bir çerçeve sağlar.

## user Sistem Mimarisi
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
## XoopsUser Sınıfı

Bir user hesabını temsil eden ana user nesnesi sınıfı.

### Sınıfa Genel Bakış
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
### Yapıcı
```php
public function __construct(int $uid = null)
```
İsteğe bağlı olarak veritabanından kimliğe göre yüklenen yeni bir user nesnesi oluşturur.

**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$uid` | int | Yüklenecek user Kimliği (isteğe bağlı) |

**Örnek:**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```
### Temel Özellikler

| Emlak | Tür | Açıklama |
|----------|------|------------|
| `uid` | int | user Kimliği |
| `uname` | dize | user adı |
| `email` | dize | E-posta adresi |
| `pass` | dize | Şifre karması |
| `uregdate` | int | Kayıt zaman damgası |
| `ulevel` | int | user düzeyi (9=yönetici, 1=user) |
| `groups` | dizi | Grup Kimlikleri |
| `permissions` | dizi | İzin bayrakları |

### Temel Yöntemler

#### getID / getUid

Kullanıcının kimliğini alır.
```php
public function getID(): int
public function getUid(): int  // Alias
```
**Getirir:** `int` - user Kimliği

**Örnek:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```
#### getUnameReal

Kullanıcının görünen adını alır.
```php
public function getUnameReal(): string
```
**Returns:** `string` - Kullanıcının gerçek adı

**Örnek:**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```
#### e-posta al

Kullanıcının e-posta adresini alır.
```php
public function getEmail(): string
```
**Getirir:** `string` - E-posta adresi

**Örnek:**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```
#### getVar / setVar

Bir user değişkenini alır veya ayarlar.
```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```
**Örnek:**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```
#### getGroups

Kullanıcının grup üyeliklerini alır.
```php
public function getGroups(): array
```
**Returns:** `array` - Grup kimlikleri dizisi

**Örnek:**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```
####Grup İçinde

Kullanıcının bir gruba ait olup olmadığını kontrol eder.
```php
public function isInGroup(int $groupId): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$groupId` | int | Kontrol edilecek grup kimliği |

**Döndürür:** `bool` - Gruptaysa doğru

**Örnek:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```
#### Yönetici

Kullanıcının yönetici olup olmadığını kontrol eder.
```php
public function isAdmin(): bool
```
**Döndürür:** `bool` - Yönetici ise doğru

**Örnek:**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```
#### Profili Al

user profili bilgilerini alır.
```php
public function getProfile(): array
```
**Getirir:** `array` - Profil verileri

**Örnek:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```
#### Etkin

user hesabının aktif olup olmadığını kontrol eder.
```php
public function isActive(): bool
```
**Döndürür:** `bool` - Etkinse doğru

**Örnek:**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```
#### güncellemeSonGiriş

Kullanıcının son oturum açma zaman damgasını günceller.
```php
public function updateLastLogin(): bool
```
**Döndürür:** `bool` - Başarı durumunda doğru

**Örnek:**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```
## XoopsGroup Sınıfı

user gruplarını ve izinlerini yönetir.

### Sınıfa Genel Bakış
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
### Sabitler

| Sabit | Değer | Açıklama |
|----------|-------|------------|
| `TYPE_NORMAL` | 0 | Normal user grubu |
| `TYPE_ADMIN` | 1 | Yönetim grubu |
| `TYPE_SYSTEM` | 2 | Sistem grubu |

### Yöntemler

#### getName

Grup adını alır.
```php
public function getName(): string
```
**Getirir:** `string` - Grup adı

**Örnek:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```
#### getDescription

Grup açıklamasını alır.
```php
public function getDescription(): string
```
**Geri döndürür:** `string` - Açıklama

**Örnek:**
```php
echo $group->getDescription();
```
#### getUsers

Grup üyelerini alır.
```php
public function getUsers(): array
```
**Returns:** `array` - user kimlikleri dizisi

**Örnek:**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```
#### user ekle

Gruba bir user ekler.
```php
public function addUser(int $uid): bool
```
**Parametreler:**

| Parametre | Tür | Açıklama |
|-----------|------|------------|
| `$uid` | int | user Kimliği |

**Döndürür:** `bool` - Başarı durumunda doğru

**Örnek:**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```
#### Kullanıcıyı kaldır

Bir kullanıcıyı gruptan çıkarır.
```php
public function removeUser(int $uid): bool
```
**Örnek:**
```php
$group->removeUser(123);
```
## user Kimlik Doğrulaması

### Giriş İşlemi
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
### Şifre Yönetimi
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
## Oturum Yönetimi

### Oturum Sınıfı
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
### Oturum Yöntemleri

#### Oturumu Başlat
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
#### Oturumu Kontrol Et
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
#### Oturumu Yok Et
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
## İzin Sistemi

### İzin Sabitleri

| Sabit | Değer | Açıklama |
|----------|-------|------------|
| `XOOPS_PERMISSION_NONE` | 0 | İzin yok |
| `XOOPS_PERMISSION_VIEW` | 1 | İçeriği görüntüle |
| `XOOPS_PERMISSION_SUBMIT` | 2 | İçerik gönder |
| `XOOPS_PERMISSION_EDIT` | 4 | İçeriği düzenle |
| `XOOPS_PERMISSION_DELETE` | 8 | İçeriği sil |
| `XOOPS_PERMISSION_ADMIN` | 16 | Yönetici erişimi |

### İzin Kontrolü
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
## user İşleyicisi

UserHandler, user kalıcılığı işlemlerini yönetir.
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
## Tam user Yönetimi Örneği
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
## En İyi Uygulamalar

1. **Parolaları Karma** - Parola karma işlemi için her zaman bcrypt veya argon2 kullanın
2. **Girdiyi Doğrula** - Tüm user girişlerini doğrulayın ve temizleyin
3. **İzinleri Kontrol Edin** - İşlemlerden önce daima user izinlerini doğrulayın
4. **Oturumları Güvenli Bir Şekilde Kullanın** - Oturum açma sırasında oturum kimliklerini yeniden oluşturun
5. **Etkinlikleri Günlüğe Kaydetme** - Oturum açma, oturum kapatma ve kritik eylemleri günlüğe kaydetme
6. **Hız Sınırlama** - Giriş denemesi hız sınırlamasını uygulayın
7. **HTTPS Yalnızca** - Kimlik doğrulama için her zaman HTTPS kullanın
8. **Grup Yönetimi** - İzin organizasyonu için grupları kullanın

## İlgili Belgeler

- ../Kernel/Kernel-Classes - Core hizmetleri ve önyükleme
- ../Database/QueryBuilder - user verileri için database sorguları
- ../Core/XoopsObject - Temel nesne sınıfı

---

*Ayrıca bakınız: [XOOPS user API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [PHP Güvenlik](https://www.php.net/manual/en/book.password.php)*