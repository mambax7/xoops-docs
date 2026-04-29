---
title: "Tham khảo XoopsUser API"
description: "Tham khảo API hoàn chỉnh cho XoopsUser và quản lý người dùng classes"
---
> Hoàn thành tài liệu API cho hệ thống người dùng XOOPS.

---

## Kiến trúc hệ thống người dùng

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

## Lớp người dùng Xoops

### Thuộc tính

| Bất động sản | Loại | Mô tả |
|----------|------|-------------|
| `uid` | int | ID người dùng (khóa chính) |
| `uname` | chuỗi | Tên người dùng |
| `name` | chuỗi | Tên thật |
| `email` | chuỗi | Địa chỉ email |
| `pass` | chuỗi | Băm mật khẩu |
| `url` | chuỗi | Trang web URL |
| `user_avatar` | chuỗi | Tên tệp hình đại diện |
| `user_regdate` | int | Dấu thời gian đăng ký |
| `user_from` | chuỗi | Vị trí |
| `user_sig` | chuỗi | Chữ ký |
| `user_occ` | chuỗi | Nghề nghiệp |
| `user_intrest` | chuỗi | Sở thích |
| `bio` | chuỗi | Tiểu sử |
| `posts` | int | Số bài viết |
| `rank` | int | Xếp hạng người dùng |
| `level` | int | Cấp độ người dùng (0=không hoạt động, 1=hoạt động) |
| `theme` | chuỗi | Chủ đề ưa thích |
| `timezone` | phao | Bù múi giờ |
| `last_login` | int | Dấu thời gian đăng nhập lần cuối |

### Phương pháp cốt lõi

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

### Người dùng CRUD Hoạt động

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

### Truy vấn người dùng

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

### Quản lý nhóm

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

### Xác thực

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

## Luồng xác thực

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

## Hệ thống nhóm

### Nhóm mặc định

| ID nhóm | Tên | Mô tả |
|----------|------|-------------|
| 1 | Quản trị viên web | Truy cập đầy đủ administrative |
| 2 | Người dùng đã đăng ký | Người dùng đã đăng ký tiêu chuẩn |
| 3 | Ẩn danh | Khách truy cập chưa đăng nhập |

### Quyền của nhóm

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

### Kiểm tra quyền

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

## Luồng đăng ký người dùng

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

## Ví dụ hoàn chỉnh

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

## Tài liệu liên quan

- Hướng dẫn quản lý người dùng
- Hệ thống cấp phép
- Xác thực

---

#xoops #api #người dùng #xác thực #tham khảo