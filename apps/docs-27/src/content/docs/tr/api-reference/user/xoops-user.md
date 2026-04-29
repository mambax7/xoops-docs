---
title: "XoopsUser API Referans"
description: "XoopsUser ve user yönetimi sınıfları için API referansını tamamlayın"
---
> XOOPS user sistemi için API belgelerini tamamlayın.

---

## user Sistem Mimarisi
```mermaid
classDiagram
    class XoopsUser {
        +int uid
        +string uname
        +string email
        +string pass
        +int user_regdate
        +int level
        +getVar(name, format)
        +setVar(name, value)
        +isAdmin(mid)
        +isActive()
        +getGroups()
        +getUnameFromId(uid)
    }

    class XoopsUserHandler {
        +create(isNew)
        +get(uid)
        +insert(user)
        +delete(user)
        +getObjects(criteria)
        +getCount(criteria)
        +getList(criteria)
        +getUsersByGroup(groupId)
    }

    class XoopsGroup {
        +int groupid
        +string name
        +string description
        +getVar(name)
        +setVar(name, value)
    }

    class XoopsGroupHandler {
        +create(isNew)
        +get(groupid)
        +insert(group)
        +delete(group)
        +getObjects(criteria)
    }

    class XoopsMemberHandler {
        +getUser(uid)
        +getUsersByGroup(groupid)
        +getGroupsByUser(uid)
        +addUserToGroup(groupid, uid)
        +removeUserFromGroup(groupid, uid)
        +loginUser(uname, pass)
    }

    XoopsUser --> XoopsUserHandler : managed by
    XoopsGroup --> XoopsGroupHandler : managed by
    XoopsUserHandler --> XoopsMemberHandler : uses
    XoopsGroupHandler --> XoopsMemberHandler : uses
```
---

## XoopsUser Sınıfı

### Özellikler

| Emlak | Tür | Açıklama |
|----------|------|------------|
| `uid` | int | user Kimliği (birincil anahtar) |
| `uname` | dize | user adı |
| `name` | dize | Gerçek isim |
| `email` | dize | E-posta adresi |
| `pass` | dize | Şifre karması |
| `url` | dize | Web sitesi URL |
| `user_avatar` | dize | Avatar dosya adı |
| `user_regdate` | int | Kayıt zaman damgası |
| `user_from` | dize | Konum |
| `user_sig` | dize | İmza |
| `user_occ` | dize | Meslek |
| `user_intrest` | dize | İlgi Alanları |
| `bio` | dize | Biyografi |
| `posts` | int | Gönderi sayısı |
| `rank` | int | user sıralaması |
| `level` | int | user düzeyi (0=etkin değil, 1=etkin) |
| `theme` | dize | Tercih edilen theme |
| `timezone` | şamandıra | Saat dilimi farkı |
| `last_login` | int | Son giriş zaman damgası |

### Temel Yöntemler
```php
// Get current user
global $xoopsUser;

// Check if logged in
if (is_object($xoopsUser)) {
    // User is logged in
    $uid = $xoopsUser->getVar('uid');
    $username = $xoopsUser->getVar('uname');
}

// Get formatted values
$uname = $xoopsUser->getVar('uname');           // Raw value
$unameDisplay = $xoopsUser->getVar('uname', 's'); // Sanitized for display
$unameEdit = $xoopsUser->getVar('uname', 'e');    // For form editing

// Check if admin
$isAdmin = $xoopsUser->isAdmin();              // Site admin
$isModuleAdmin = $xoopsUser->isAdmin($mid);    // Module admin

// Get user groups
$groups = $xoopsUser->getGroups();             // Array of group IDs

// Check if active
$isActive = $xoopsUser->isActive();
```
---

## XoopsUserHandler

### user CRUD İşlemler
```php
// Get handler
$userHandler = xoops_getHandler('user');

// Create new user
$user = $userHandler->create();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'user@example.com');
$user->setVar('pass', password_hash('password123', PASSWORD_DEFAULT));
$user->setVar('user_regdate', time());
$user->setVar('level', 1);

if ($userHandler->insert($user)) {
    $newUid = $user->getVar('uid');
}

// Get user by ID
$user = $userHandler->get(123);

// Update user
$user->setVar('email', 'newemail@example.com');
$userHandler->insert($user);

// Delete user
$userHandler->delete($user);
```
### Kullanıcıları Sorgula
```php
// Get all active users
$criteria = new Criteria('level', 1);
$users = $userHandler->getObjects($criteria);

// Get users by criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('level', 1));
$criteria->add(new Criteria('posts', 10, '>='));
$criteria->setSort('posts');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$activePosters = $userHandler->getObjects($criteria);

// Get user count
$count = $userHandler->getCount($criteria);

// Get user list (uid => uname)
$userList = $userHandler->getList($criteria);

// Search users
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('uname', '%john%', 'LIKE'));
$criteria->add(new Criteria('email', '%john%', 'LIKE'), 'OR');
$searchResults = $userHandler->getObjects($criteria);
```
---

## XoopsMemberHandler

### Grup Yönetimi
```php
$memberHandler = xoops_getHandler('member');

// Get user with groups
$user = $memberHandler->getUser($uid);
$groups = $memberHandler->getGroupsByUser($uid);

// Get users in group
$users = $memberHandler->getUsersByGroup($groupId);
$users = $memberHandler->getUsersByGroup($groupId, true); // Objects
$users = $memberHandler->getUsersByGroup($groupId, false); // UIDs only

// Add user to group
$memberHandler->addUserToGroup($groupId, $uid);

// Remove user from group
$memberHandler->removeUserFromGroup($groupId, $uid);
```
### Kimlik Doğrulaması
```php
// Login user
$user = $memberHandler->loginUser($username, $password);

if ($user) {
    // Login successful
    $_SESSION['xoopsUserId'] = $user->getVar('uid');
    $user->setVar('last_login', time());
    $userHandler->insert($user);
} else {
    // Login failed
}

// Logout
$_SESSION = [];
session_destroy();
redirect_header(XOOPS_URL, 3, 'Logged out');
```
---

## Kimlik Doğrulama Akışı
```mermaid
sequenceDiagram
    participant User
    participant LoginForm
    participant MemberHandler
    participant Database
    participant Session

    User->>LoginForm: Submit credentials
    LoginForm->>MemberHandler: loginUser(uname, pass)
    MemberHandler->>Database: Query user by uname
    Database-->>MemberHandler: User record

    alt User Found
        MemberHandler->>MemberHandler: Verify password hash
        alt Password Valid
            MemberHandler->>MemberHandler: Check user level > 0
            alt User Active
                MemberHandler-->>LoginForm: User object
                LoginForm->>Session: Store user ID
                LoginForm->>Database: Update last_login
                LoginForm-->>User: Redirect to success
            else User Inactive
                MemberHandler-->>LoginForm: null (account disabled)
                LoginForm-->>User: Error: Account disabled
            end
        else Password Invalid
            MemberHandler-->>LoginForm: null
            LoginForm-->>User: Error: Invalid credentials
        end
    else User Not Found
        MemberHandler-->>LoginForm: null
        LoginForm-->>User: Error: Invalid credentials
    end
```
---

## Grup Sistemi

### Varsayılan Gruplar

| Grup Kimliği | İsim | Açıklama |
|----------|------|------------|
| 1 | Web Yöneticileri | Tam yönetim erişimi |
| 2 | Kayıtlı users | Standart kayıtlı users |
| 3 | İsimsiz | Oturum açmamış ziyaretçiler |

### Grup İzinleri
```mermaid
graph TB
    subgraph "Permission Types"
        A[Module Access] --> E[XoopsGroupPermHandler]
        B[Block View] --> E
        C[Module Admin] --> E
        D[Item-Level] --> E
    end

    subgraph "Permission Check"
        E --> F{Has Permission?}
        F -->|Yes| G[Allow Access]
        F -->|No| H[Deny Access]
    end
```
### İzinleri Kontrol Et
```php
$gpermHandler = xoops_getHandler('groupperm');

// Check module access
$groups = is_object($xoopsUser) ? $xoopsUser->getGroups() : [XOOPS_GROUP_ANONYMOUS];
$hasAccess = $gpermHandler->checkRight('module_read', $moduleId, $groups);

// Check module admin
$isAdmin = $gpermHandler->checkRight('module_admin', $moduleId, $groups);

// Check custom permission
$hasPermission = $gpermHandler->checkRight(
    'item_view',      // Permission name
    $itemId,          // Item ID
    $groups,          // Group IDs
    $moduleId         // Module ID
);

// Get items user can access
$itemIds = $gpermHandler->getItemIds('item_view', $groups, $moduleId);
```
---

## user Kayıt Akışı
```mermaid
sequenceDiagram
    participant Visitor
    participant Form
    participant Validation
    participant UserHandler
    participant Email
    participant Database

    Visitor->>Form: Fill registration form
    Form->>Validation: Validate input

    alt Validation Failed
        Validation-->>Form: Errors
        Form-->>Visitor: Show errors
    else Validation Passed
        Validation->>UserHandler: Create user

        alt Email Activation Required
            UserHandler->>Database: Save with level=0
            UserHandler->>Email: Send activation email
            Email-->>Visitor: Check your email
        else Auto Activation
            UserHandler->>Database: Save with level=1
            UserHandler-->>Visitor: Registration complete
        end
    end
```
---

## Tam Örnek
```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$memberHandler = xoops_getHandler('member');
$userHandler = xoops_getHandler('user');

// Registration handler
if (Request::hasVar('register', 'POST')) {
    // Verify CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('register.php', 3, 'Security error');
    }

    $uname = Request::getString('uname', '', 'POST');
    $email = Request::getEmail('email', '', 'POST');
    $pass = Request::getString('pass', '', 'POST');
    $passConfirm = Request::getString('pass_confirm', '', 'POST');

    $errors = [];

    // Validate username
    if (strlen($uname) < 3 || strlen($uname) > 25) {
        $errors[] = 'Username must be 3-25 characters';
    }

    // Check if username exists
    $criteria = new Criteria('uname', $uname);
    if ($userHandler->getCount($criteria) > 0) {
        $errors[] = 'Username already taken';
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    // Check if email exists
    $criteria = new Criteria('email', $email);
    if ($userHandler->getCount($criteria) > 0) {
        $errors[] = 'Email already registered';
    }

    // Validate password
    if (strlen($pass) < 8) {
        $errors[] = 'Password must be at least 8 characters';
    }

    if ($pass !== $passConfirm) {
        $errors[] = 'Passwords do not match';
    }

    if (empty($errors)) {
        // Create user
        $user = $userHandler->create();
        $user->setVar('uname', $uname);
        $user->setVar('email', $email);
        $user->setVar('pass', password_hash($pass, PASSWORD_DEFAULT));
        $user->setVar('user_regdate', time());
        $user->setVar('level', 1); // Auto-activate

        if ($userHandler->insert($user)) {
            // Add to Registered Users group
            $memberHandler->addUserToGroup(XOOPS_GROUP_USERS, $user->getVar('uid'));

            redirect_header('index.php', 3, 'Registration successful!');
        } else {
            $errors[] = 'Error creating account';
        }
    }
}

// Display registration form
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($errors)) {
    foreach ($errors as $error) {
        echo "<div class='errorMsg'>$error</div>";
    }
}

// Registration form here...

require_once XOOPS_ROOT_PATH . '/footer.php';
```
---

## İlgili Belgeler

- user Yönetim Kılavuzu
- İzin Sistemi
- Kimlik doğrulama

---

#xoops #api #user #kimlik doğrulama #referans