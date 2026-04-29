---
title: "XoopsUser API संदर्भ"
description: "XoopsUser और उपयोगकर्ता प्रबंधन कक्षाओं के लिए पूर्ण API संदर्भ"
---
> XOOPS उपयोगकर्ता प्रणाली के लिए पूर्ण API दस्तावेज़ीकरण।

---

## उपयोगकर्ता सिस्टम आर्किटेक्चर

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

## XoopsUser कक्षा

### गुण

| संपत्ति | प्रकार | विवरण |
|---|------|----|
| `uid` | int | उपयोगकर्ता आईडी (प्राथमिक कुंजी) |
| `uname` | स्ट्रिंग | उपयोगकर्ता नाम |
| `name` | स्ट्रिंग | असली नाम |
| `email` | स्ट्रिंग | ईमेल पता |
| `pass` | स्ट्रिंग | पासवर्ड हैश |
| `url` | स्ट्रिंग | वेबसाइट URL |
| `user_avatar` | स्ट्रिंग | अवतार फ़ाइल नाम |
| `user_regdate` | int | पंजीकरण टाइमस्टैम्प |
| `user_from` | स्ट्रिंग | स्थान |
| `user_sig` | स्ट्रिंग | हस्ताक्षर |
| `user_occ` | स्ट्रिंग | व्यवसाय |
| `user_intrest` | स्ट्रिंग | रुचियां |
| `bio` | स्ट्रिंग | जीवनी |
| `posts` | int | पोस्ट गिनती |
| `rank` | int | उपयोगकर्ता रैंक |
| `level` | int | उपयोगकर्ता स्तर (0=निष्क्रिय, 1=सक्रिय) |
| `theme` | स्ट्रिंग | पसंदीदा थीम |
| `timezone` | तैरना | समय क्षेत्र ऑफसेट |
| `last_login` | int | अंतिम लॉगिन टाइमस्टैम्प |

### कोर तरीके

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

### उपयोगकर्ता CRUD संचालन

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

### क्वेरी उपयोगकर्ता

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

### समूह प्रबंधन

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

### प्रमाणीकरण

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

## प्रमाणीकरण प्रवाह

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

## समूह प्रणाली

### डिफ़ॉल्ट समूह

| ग्रुप आईडी | नाम | विवरण |
|---|------|----|
| 1 | वेबमास्टर्स | पूर्ण प्रशासनिक पहुंच |
| 2 | पंजीकृत उपयोगकर्ता | मानक पंजीकृत उपयोगकर्ता |
| 3 | अनाम | गैर-लॉग इन विज़िटर |

### समूह अनुमतियाँ

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

### अनुमतियाँ जाँचें

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

## उपयोगकर्ता पंजीकरण प्रवाह

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

## पूरा उदाहरण

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

## संबंधित दस्तावेज़ीकरण

- उपयोगकर्ता प्रबंधन गाइड
- अनुमति प्रणाली
-प्रमाणीकरण

---

#xoops #api #उपयोगकर्ता #प्रमाणीकरण #संदर्भ