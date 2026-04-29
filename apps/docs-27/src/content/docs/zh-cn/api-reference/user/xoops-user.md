---
title: “XOOPSUser API参考”
description: “XOOPSUser 和用户管理类的完整API参考”
---

> 完成 XOOPS 用户系统的 API 文档。

---

## 用户系统架构

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

## XOOPSUser 类

### 属性

|物业 |类型 |描述 |
|----------|------|-------------|
| `uid`|整数 |用户 ID（主键）|
| `uname` |字符串|用户名 |
| `name`|字符串|真实姓名|
| `email`|字符串|电子邮件地址 |
| `pass` |字符串|密码哈希 |
| `url` |字符串|网站URL |
| `user_avatar` |字符串|头像文件名|
| `user_regdate` |整数 |注册时间戳 |
| `user_from` |字符串|地点 |
| `user_sig` |字符串|签名|
| `user_occ` |字符串|职业 |
| `user_intrest` |字符串|兴趣 |
| `bio` |字符串|传记 |
| `posts` |整数 |帖子计数 |
| `rank` |整数 |用户排名 |
| `level` |整数 |用户级别（0=非活动，1=活动）|
| `theme`|字符串|首选主题 |
| `timezone` |浮动|时区偏移 |
| `last_login` |整数 |上次登录时间戳 |

### 核心方法

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

## XOOPSUserHandler

### 用户CRUD操作

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

### 查询用户

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

## XOOPSMemberHandler

### 集团管理

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

### 身份验证

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

## 身份验证流程

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

## 团体系统

### 默认组

|群组 ID |名称 |描述 |
|----------|------|-------------|
| 1 |网站管理员|完全管理访问权限 |
| 2 |注册用户 |标准注册用户|
| 3 |匿名 |访客中非-logged |

### 组权限

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

### 检查权限

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

## 用户注册流程

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

## 完整示例

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

## 相关文档

- 用户管理指南
- 权限系统
- 认证

---

#XOOPS #api #user #authentication #reference