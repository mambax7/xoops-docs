---
title: "Riferimento API XoopsUser"
description: "Riferimento API completo per XoopsUser e classi di gestione utenti"
---

> Documentazione API completa per il sistema utenti XOOPS.

---

## Architettura Sistema Utenti

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

## Classe XoopsUser

### Proprietà

| Proprietà | Tipo | Descrizione |
|----------|------|-------------|
| `uid` | int | ID Utente (chiave primaria) |
| `uname` | string | Nome utente |
| `name` | string | Nome reale |
| `email` | string | Indirizzo email |
| `pass` | string | Hash password |
| `url` | string | URL sito web |
| `user_avatar` | string | Nome file avatar |
| `user_regdate` | int | Timestamp registrazione |
| `user_from` | string | Posizione |
| `user_sig` | string | Firma |
| `user_occ` | string | Professione |
| `user_intrest` | string | Interessi |
| `bio` | string | Biografia |
| `posts` | int | Conteggio post |
| `rank` | int | Rango utente |
| `level` | int | Livello utente (0=inattivo, 1=attivo) |
| `theme` | string | Tema preferito |
| `timezone` | float | Offset fuso orario |
| `last_login` | int | Timestamp ultimo login |

### Metodi di Base

```php
// Ottieni utente corrente
global $xoopsUser;

// Verifica se loggato
if (is_object($xoopsUser)) {
    // Utente è loggato
    $uid = $xoopsUser->getVar('uid');
    $username = $xoopsUser->getVar('uname');
}

// Ottieni valori formattati
$uname = $xoopsUser->getVar('uname');           // Valore raw
$unameDisplay = $xoopsUser->getVar('uname', 's'); // Sanificato per visualizzazione
$unameEdit = $xoopsUser->getVar('uname', 'e');    // Per modifica form

// Verifica se admin
$isAdmin = $xoopsUser->isAdmin();              // Admin sito
$isModuleAdmin = $xoopsUser->isAdmin($mid);    // Admin modulo

// Ottieni gruppi utente
$groups = $xoopsUser->getGroups();             // Array ID gruppi

// Verifica se attivo
$isActive = $xoopsUser->isActive();
```

---

## XoopsUserHandler

### Operazioni CRUD Utenti

```php
// Ottieni handler
$userHandler = xoops_getHandler('user');

// Crea nuovo utente
$user = $userHandler->create();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'user@example.com');
$user->setVar('pass', password_hash('password123', PASSWORD_DEFAULT));
$user->setVar('user_regdate', time());
$user->setVar('level', 1);

if ($userHandler->insert($user)) {
    $newUid = $user->getVar('uid');
}

// Ottieni utente per ID
$user = $userHandler->get(123);

// Aggiorna utente
$user->setVar('email', 'newemail@example.com');
$userHandler->insert($user);

// Cancella utente
$userHandler->delete($user);
```

### Interroga Utenti

```php
// Ottieni tutti gli utenti attivi
$criteria = new Criteria('level', 1);
$users = $userHandler->getObjects($criteria);

// Ottieni utenti per criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('level', 1));
$criteria->add(new Criteria('posts', 10, '>='));
$criteria->setSort('posts');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$activePosters = $userHandler->getObjects($criteria);

// Ottieni conteggio utenti
$count = $userHandler->getCount($criteria);

// Ottieni lista utenti (uid => uname)
$userList = $userHandler->getList($criteria);

// Cerca utenti
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('uname', '%john%', 'LIKE'));
$criteria->add(new Criteria('email', '%john%', 'LIKE'), 'OR');
$searchResults = $userHandler->getObjects($criteria);
```

---

## XoopsMemberHandler

### Gestione Gruppi

```php
$memberHandler = xoops_getHandler('member');

// Ottieni utente con gruppi
$user = $memberHandler->getUser($uid);
$groups = $memberHandler->getGroupsByUser($uid);

// Ottieni utenti in gruppo
$users = $memberHandler->getUsersByGroup($groupId);
$users = $memberHandler->getUsersByGroup($groupId, true); // Oggetti
$users = $memberHandler->getUsersByGroup($groupId, false); // Solo UID

// Aggiungi utente a gruppo
$memberHandler->addUserToGroup($groupId, $uid);

// Rimuovi utente da gruppo
$memberHandler->removeUserFromGroup($groupId, $uid);
```

### Autenticazione

```php
// Accedi utente
$user = $memberHandler->loginUser($username, $password);

if ($user) {
    // Login riuscito
    $_SESSION['xoopsUserId'] = $user->getVar('uid');
    $user->setVar('last_login', time());
    $userHandler->insert($user);
} else {
    // Login fallito
}

// Logout
$_SESSION = [];
session_destroy();
redirect_header(XOOPS_URL, 3, 'Logged out');
```

---

## Flusso Autenticazione

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

## Sistema Gruppi

### Gruppi Default

| ID Gruppo | Nome | Descrizione |
|----------|------|-------------|
| 1 | Webmasters | Accesso amministrativo completo |
| 2 | Registered Users | Utenti registrati standard |
| 3 | Anonymous | Visitatori non loggati |

### Permessi Gruppo

```mermaid
graph TB
    subgraph "Tipi Permessi"
        A[Module Access] --> E[XoopsGroupPermHandler]
        B[Block View] --> E
        C[Module Admin] --> E
        D[Item-Level] --> E
    end

    subgraph "Verifica Permessi"
        E --> F{Has Permission?}
        F -->|Yes| G[Allow Access]
        F -->|No| H[Deny Access]
    end
```

### Verifica Permessi

```php
$gpermHandler = xoops_getHandler('groupperm');

// Verifica accesso modulo
$groups = is_object($xoopsUser) ? $xoopsUser->getGroups() : [XOOPS_GROUP_ANONYMOUS];
$hasAccess = $gpermHandler->checkRight('module_read', $moduleId, $groups);

// Verifica admin modulo
$isAdmin = $gpermHandler->checkRight('module_admin', $moduleId, $groups);

// Verifica permesso personalizzato
$hasPermission = $gpermHandler->checkRight(
    'item_view',      // Nome permesso
    $itemId,          // ID elemento
    $groups,          // ID gruppi
    $moduleId         // ID modulo
);

// Ottieni elementi a cui l'utente può accedere
$itemIds = $gpermHandler->getItemIds('item_view', $groups, $moduleId);
```

---

## Flusso Registrazione Utenti

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

## Esempio Completo

```php
<?php
require_once __DIR__ . '/mainfile.php';

use Xmf\Request;

$memberHandler = xoops_getHandler('member');
$userHandler = xoops_getHandler('user');

// Gestore registrazione
if (Request::hasVar('register', 'POST')) {
    // Verifica CSRF
    if (!$GLOBALS['xoopsSecurity']->check()) {
        redirect_header('register.php', 3, 'Security error');
    }

    $uname = Request::getString('uname', '', 'POST');
    $email = Request::getEmail('email', '', 'POST');
    $pass = Request::getString('pass', '', 'POST');
    $passConfirm = Request::getString('pass_confirm', '', 'POST');

    $errors = [];

    // Valida nome utente
    if (strlen($uname) < 3 || strlen($uname) > 25) {
        $errors[] = 'Username must be 3-25 characters';
    }

    // Verifica se nome utente esiste
    $criteria = new Criteria('uname', $uname);
    if ($userHandler->getCount($criteria) > 0) {
        $errors[] = 'Username already taken';
    }

    // Valida email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    // Verifica se email esiste
    $criteria = new Criteria('email', $email);
    if ($userHandler->getCount($criteria) > 0) {
        $errors[] = 'Email already registered';
    }

    // Valida password
    if (strlen($pass) < 8) {
        $errors[] = 'Password must be at least 8 characters';
    }

    if ($pass !== $passConfirm) {
        $errors[] = 'Passwords do not match';
    }

    if (empty($errors)) {
        // Crea utente
        $user = $userHandler->create();
        $user->setVar('uname', $uname);
        $user->setVar('email', $email);
        $user->setVar('pass', password_hash($pass, PASSWORD_DEFAULT));
        $user->setVar('user_regdate', time());
        $user->setVar('level', 1); // Auto-attiva

        if ($userHandler->insert($user)) {
            // Aggiungi al gruppo Registered Users
            $memberHandler->addUserToGroup(XOOPS_GROUP_USERS, $user->getVar('uid'));

            redirect_header('index.php', 3, 'Registration successful!');
        } else {
            $errors[] = 'Error creating account';
        }
    }
}

// Mostra modulo registrazione
require_once XOOPS_ROOT_PATH . '/header.php';

if (!empty($errors)) {
    foreach ($errors as $error) {
        echo "<div class='errorMsg'>$error</div>";
    }
}

// Modulo registrazione qui...

require_once XOOPS_ROOT_PATH . '/footer.php';
```

---

## Documentazione Correlata

- Guida Gestione Utenti
- Sistema Permessi
- Autenticazione

---

#xoops #api #user #authentication #reference
