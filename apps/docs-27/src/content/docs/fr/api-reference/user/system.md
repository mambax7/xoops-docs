---
title: "Système d'utilisateurs XOOPS"
description: "Classe XoopsUser, gestion XoopsGroup, authentification utilisateur, gestion de session et contrôle d'accès"
---

Le système d'utilisateurs XOOPS gère les comptes utilisateurs, l'authentification, l'autorisation, l'adhésion à des groupes et la gestion des sessions. Il fournit un cadre robuste pour sécuriser votre application et contrôler l'accès des utilisateurs.

## Architecture du système d'utilisateurs

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

## Classe XoopsUser

La classe d'objet utilisateur principale représentant un compte utilisateur.

### Vue d'ensemble de la classe

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

### Constructeur

```php
public function __construct(int $uid = null)
```

Crée un nouvel objet utilisateur, chargeant éventuellement de la base de données par ID.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$uid` | int | ID utilisateur à charger (optionnel) |

**Exemple :**
```php
// Create new user
$user = new XoopsUser();

// Load existing user
$user = new XoopsUser(123);
```

### Propriétés noyau

| Propriété | Type | Description |
|----------|------|-------------|
| `uid` | int | ID utilisateur |
| `uname` | string | Nom d'utilisateur |
| `email` | string | Adresse email |
| `pass` | string | Hachage du mot de passe |
| `uregdate` | int | Horodatage d'enregistrement |
| `ulevel` | int | Niveau utilisateur (9=admin, 1=user) |
| `groups` | array | IDs des groupes |
| `permissions` | array | Indicateurs de permissions |

### Méthodes noyau

#### getID / getUid

Obtient l'ID de l'utilisateur.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Retour :** `int` - ID utilisateur

**Exemple :**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Obtient le nom d'affichage de l'utilisateur.

```php
public function getUnameReal(): string
```

**Retour :** `string` - Nom réel de l'utilisateur

**Exemple :**
```php
$realName = $user->getUnameReal();
echo "Hello, $realName";
```

#### getEmail

Obtient l'adresse email de l'utilisateur.

```php
public function getEmail(): string
```

**Retour :** `string` - Adresse email

**Exemple :**
```php
$email = $user->getEmail();
mail($email, 'Welcome', 'Welcome to XOOPS');
```

#### getVar / setVar

Obtient ou définit une variable d'utilisateur.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Exemple :**
```php
// Get values
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatted for display

// Set values
$user->setVar('uname', 'newusername');
$user->setVar('email', 'user@example.com');
```

#### getGroups

Obtient les adhésions à des groupes de l'utilisateur.

```php
public function getGroups(): array
```

**Retour :** `array` - Tableau des IDs de groupes

**Exemple :**
```php
$groups = $user->getGroups();
echo "Member of " . count($groups) . " groups";
```

#### isInGroup

Vérifie si l'utilisateur appartient à un groupe.

```php
public function isInGroup(int $groupId): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$groupId` | int | ID du groupe à vérifier |

**Retour :** `bool` - True si dans le groupe

**Exemple :**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'User is a webmaster';
}
```

#### isAdmin

Vérifie si l'utilisateur est un administrateur.

```php
public function isAdmin(): bool
```

**Retour :** `bool` - True si administrateur

**Exemple :**
```php
if ($user->isAdmin()) {
    // Show admin controls
    echo '<a href="admin/">Admin Panel</a>';
}
```

#### getProfile

Obtient les informations de profil utilisateur.

```php
public function getProfile(): array
```

**Retour :** `array` - Données de profil

**Exemple :**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### isActive

Vérifie si le compte utilisateur est actif.

```php
public function isActive(): bool
```

**Retour :** `bool` - True si actif

**Exemple :**
```php
if ($user->isActive()) {
    // Allow user access
} else {
    // Restrict access
}
```

#### updateLastLogin

Met à jour l'horodatage de la dernière connexion de l'utilisateur.

```php
public function updateLastLogin(): bool
```

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
if ($user->updateLastLogin()) {
    echo 'Login recorded';
}
```

## Classe XoopsGroup

Gère les groupes d'utilisateurs et les permissions.

### Vue d'ensemble de la classe

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

### Constantes

| Constante | Valeur | Description |
|----------|--------|-------------|
| `TYPE_NORMAL` | 0 | Groupe d'utilisateurs normal |
| `TYPE_ADMIN` | 1 | Groupe administratif |
| `TYPE_SYSTEM` | 2 | Groupe système |

### Méthodes

#### getName

Obtient le nom du groupe.

```php
public function getName(): string
```

**Retour :** `string` - Nom du groupe

**Exemple :**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Obtient la description du groupe.

```php
public function getDescription(): string
```

**Retour :** `string` - Description

**Exemple :**
```php
echo $group->getDescription();
```

#### getUsers

Obtient les membres du groupe.

```php
public function getUsers(): array
```

**Retour :** `array` - Tableau des IDs d'utilisateurs

**Exemple :**
```php
$users = $group->getUsers();
echo "Group has " . count($users) . " members";
```

#### addUser

Ajoute un utilisateur au groupe.

```php
public function addUser(int $uid): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$uid` | int | ID utilisateur |

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
$group = new XoopsGroup(2); // Editors
$group->addUser(123);
$groupHandler->insert($group);
```

#### removeUser

Supprime un utilisateur du groupe.

```php
public function removeUser(int $uid): bool
```

**Exemple :**
```php
$group->removeUser(123);
```

## Authentification des utilisateurs

### Processus de connexion

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

### Gestion des mots de passe

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

## Gestion des sessions

### Classe du gestionnaire de sessions

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

### Méthodes de session

#### Démarrer la session

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

#### Vérifier la session

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

#### Détruire la session

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

## Système de permissions

### Constantes de permissions

| Constante | Valeur | Description |
|----------|--------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | Aucune permission |
| `XOOPS_PERMISSION_VIEW` | 1 | Afficher le contenu |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Soumettre du contenu |
| `XOOPS_PERMISSION_EDIT` | 4 | Éditer le contenu |
| `XOOPS_PERMISSION_DELETE` | 8 | Supprimer le contenu |
| `XOOPS_PERMISSION_ADMIN` | 16 | Accès administrateur |

### Vérification des permissions

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

## Gestionnaire d'utilisateurs

Le UserHandler gère les opérations de persistance des utilisateurs.

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

## Exemple complet de gestion d'utilisateurs

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

## Meilleures pratiques

1. **Hacher les mots de passe** - Toujours utiliser bcrypt ou argon2 pour le hachage des mots de passe
2. **Valider l'entrée** - Valider et assainir toutes les entrées utilisateur
3. **Vérifier les permissions** - Toujours vérifier les permissions avant les actions
4. **Utiliser les sessions de manière sécurisée** - Régénérer les IDs de session lors de la connexion
5. **Journaliser les activités** - Journaliser la connexion, déconnexion et actions critiques
6. **Limitation de la fréquence** - Implémenter la limitation de fréquence des tentatives de connexion
7. **HTTPS uniquement** - Toujours utiliser HTTPS pour l'authentification
8. **Gestion des groupes** - Utiliser les groupes pour l'organisation des permissions

## Documentation connexe

- ../Kernel/Kernel-Classes - Services noyau et amorçage
- ../Database/QueryBuilder - Requêtes de base de données pour les données utilisateur
- ../Core/XoopsObject - Classe objet de base

---

*Voir aussi : [API utilisateurs XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [Sécurité PHP](https://www.php.net/manual/en/book.password.php)*
