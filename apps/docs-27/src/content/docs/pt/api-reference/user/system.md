---
title: "Sistema de Usuário do XOOPS"
description: "Classe XoopsUser, gerenciamento de XoopsGroup, autenticação de usuário, manipulação de sessão e controle de acesso"
---

O Sistema de Usuário do XOOPS gerencia contas de usuário, autenticação, autorização, associação de grupo e gerenciamento de sessão. Ele fornece uma estrutura robusta para proteger sua aplicação e controlar o acesso do usuário.

## Arquitetura do Sistema de Usuário

```mermaid
graph TD
    A[Sistema de Usuário] -->|gerencia| B[XoopsUser]
    A -->|gerencia| C[XoopsGroup]
    A -->|processa| D[Autenticação]
    A -->|processa| E[Sessões]

    D -->|valida| F[Usuário/Senha]
    D -->|valida| G[Email/Token]
    D -->|dispara| H[Ganchos Pós-Login]

    E -->|gerencia| I[Dados da Sessão]
    E -->|gerencia| J[Cookies de Sessão]

    B -->|pertence a| C
    B -->|tem| K[Permissões]
    B -->|tem| L[Dados de Perfil]

    C -->|define| M[Níveis de Acesso]
    C -->|contém| N[Múltiplos Usuários]
```

## Classe XoopsUser

A classe de objeto de usuário principal que representa uma conta de usuário.

### Visão Geral da Classe

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

### Construtor

```php
public function __construct(int $uid = null)
```

Cria um novo objeto de usuário, opcionalmente carregando do banco de dados por ID.

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `$uid` | int | ID do usuário a carregar (opcional) |

**Exemplo:**
```php
// Criar novo usuário
$user = new XoopsUser();

// Carregar usuário existente
$user = new XoopsUser(123);
```

### Propriedades Principais

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `uid` | int | ID do usuário |
| `uname` | string | Nome de usuário |
| `email` | string | Endereço de email |
| `pass` | string | Hash de senha |
| `uregdate` | int | Timestamp de registro |
| `ulevel` | int | Nível de usuário (9=admin, 1=usuário) |
| `groups` | array | IDs de grupo |
| `permissions` | array | Flags de permissão |

### Métodos Principais

#### getID / getUid

Obtém o ID do usuário.

```php
public function getID(): int
public function getUid(): int  // Alias
```

**Retorna:** `int` - ID do usuário

**Exemplo:**
```php
$user = new XoopsUser(1);
echo $user->getID(); // 1
echo $user->getUid(); // 1
```

#### getUnameReal

Obtém o nome de exibição do usuário.

```php
public function getUnameReal(): string
```

**Retorna:** `string` - Nome real do usuário

**Exemplo:**
```php
$realName = $user->getUnameReal();
echo "Olá, $realName";
```

#### getEmail

Obtém o endereço de email do usuário.

```php
public function getEmail(): string
```

**Retorna:** `string` - Endereço de email

**Exemplo:**
```php
$email = $user->getEmail();
mail($email, 'Bem-vindo', 'Bem-vindo ao XOOPS');
```

#### getVar / setVar

Obtém ou define uma variável de usuário.

```php
public function getVar(string $key, string $format = 's'): mixed
public function setVar(string $key, mixed $value, bool $notGpc = false): bool
```

**Exemplo:**
```php
// Obter valores
$username = $user->getVar('uname');
$email = $user->getVar('email', 's'); // Formatado para exibição

// Definir valores
$user->setVar('uname', 'novousuario');
$user->setVar('email', 'usuario@example.com');
```

#### getGroups

Obtém as associações de grupo do usuário.

```php
public function getGroups(): array
```

**Retorna:** `array` - Array de IDs de grupo

**Exemplo:**
```php
$groups = $user->getGroups();
echo "Membro de " . count($groups) . " grupos";
```

#### isInGroup

Verifica se o usuário pertence a um grupo.

```php
public function isInGroup(int $groupId): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `$groupId` | int | ID do grupo a verificar |

**Retorna:** `bool` - Verdadeiro se no grupo

**Exemplo:**
```php
if ($user->isInGroup(1)) { // 1 = Webmasters
    echo 'Usuário é um webmaster';
}
```

#### isAdmin

Verifica se o usuário é um administrador.

```php
public function isAdmin(): bool
```

**Retorna:** `bool` - Verdadeiro se admin

**Exemplo:**
```php
if ($user->isAdmin()) {
    // Mostrar controles de admin
    echo '<a href="admin/">Painel Admin</a>';
}
```

#### getProfile

Obtém informações de perfil do usuário.

```php
public function getProfile(): array
```

**Retorna:** `array` - Dados do perfil

**Exemplo:**
```php
$profile = $user->getProfile();
echo 'Bio: ' . $profile['bio'];
```

#### isActive

Verifica se a conta do usuário está ativa.

```php
public function isActive(): bool
```

**Retorna:** `bool` - Verdadeiro se ativo

**Exemplo:**
```php
if ($user->isActive()) {
    // Permitir acesso do usuário
} else {
    // Restringir acesso
}
```

#### updateLastLogin

Atualiza o timestamp do último login do usuário.

```php
public function updateLastLogin(): bool
```

**Retorna:** `bool` - Verdadeiro se sucesso

**Exemplo:**
```php
if ($user->updateLastLogin()) {
    echo 'Login registrado';
}
```

## Classe XoopsGroup

Gerencia grupos de usuários e permissões.

### Visão Geral da Classe

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

| Constante | Valor | Descrição |
|-----------|-------|-----------|
| `TYPE_NORMAL` | 0 | Grupo de usuário normal |
| `TYPE_ADMIN` | 1 | Grupo administrativo |
| `TYPE_SYSTEM` | 2 | Grupo de sistema |

### Métodos

#### getName

Obtém o nome do grupo.

```php
public function getName(): string
```

**Retorna:** `string` - Nome do grupo

**Exemplo:**
```php
$group = new XoopsGroup(1);
echo $group->getName(); // "Webmasters"
```

#### getDescription

Obtém a descrição do grupo.

```php
public function getDescription(): string
```

**Retorna:** `string` - Descrição

**Exemplo:**
```php
echo $group->getDescription();
```

#### getUsers

Obtém membros do grupo.

```php
public function getUsers(): array
```

**Retorna:** `array` - Array de IDs de usuário

**Exemplo:**
```php
$users = $group->getUsers();
echo "Grupo tem " . count($users) . " membros";
```

#### addUser

Adiciona um usuário ao grupo.

```php
public function addUser(int $uid): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `$uid` | int | ID do usuário |

**Retorna:** `bool` - Verdadeiro se sucesso

**Exemplo:**
```php
$group = new XoopsGroup(2); // Editores
$group->addUser(123);
$groupHandler->insert($group);
```

#### removeUser

Remove um usuário do grupo.

```php
public function removeUser(int $uid): bool
```

**Exemplo:**
```php
$group->removeUser(123);
```

## User Authentication

### Login Process

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

### Password Management

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

## Session Management

### Session Class

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

### Session Methods

#### Start Session

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

#### Check Session

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

#### Destroy Session

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

## Permission System

### Permission Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `XOOPS_PERMISSION_NONE` | 0 | No permission |
| `XOOPS_PERMISSION_VIEW` | 1 | View content |
| `XOOPS_PERMISSION_SUBMIT` | 2 | Submit content |
| `XOOPS_PERMISSION_EDIT` | 4 | Edit content |
| `XOOPS_PERMISSION_DELETE` | 8 | Delete content |
| `XOOPS_PERMISSION_ADMIN` | 16 | Admin access |

### Permission Checking

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

## User Handler

The UserHandler manages user persistence operations.

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

## Complete User Management Example

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

## Melhores Práticas

1. **Hash de Senhas** - Sempre usar bcrypt ou argon2 para hash de senha
2. **Validar Entrada** - Validar e sanitizar toda entrada de usuário
3. **Verificar Permissões** - Sempre verificar permissões do usuário antes de ações
4. **Usar Sessões com Segurança** - Regenerar IDs de sessão no login
5. **Registrar Atividades** - Registrar login, logout e ações críticas
6. **Limitação de Taxa** - Implementar limitação de taxa para tentativas de login
7. **Apenas HTTPS** - Sempre usar HTTPS para autenticação
8. **Gerenciamento de Grupo** - Usar grupos para organização de permissão

## Documentação Relacionada

- ../Kernel/Kernel-Classes - Serviços de kernel e bootstrapping
- ../Database/QueryBuilder - Consultas de banco de dados para dados de usuário
- ../Core/XoopsObject - Classe de objeto base

---

*Veja também: [API de Usuário XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class) | [Segurança PHP](https://www.php.net/manual/en/book.password.php)*
