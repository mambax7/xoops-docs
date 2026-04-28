---
title: "Gerenciamento de Usuários"
description: "Guia abrangente para o sistema de usuários XOOPS, registro, autenticação e gerenciamento de perfil"
---

# Gerenciamento de Usuários no XOOPS

O sistema de Gerenciamento de Usuários do XOOPS fornece um framework completo para lidar com registro de usuários, autenticação, gerenciamento de perfil e preferências do usuário. Este documento cobre a estrutura do objeto de usuário, fluxos de registro e exemplos de implementação prática.

## Estrutura do Objeto de Usuário

O objeto de usuário principal no XOOPS é a classe `XoopsUser`, que encapsula todos os dados do usuário e métodos.

### Esquema de Banco de Dados

```sql
CREATE TABLE xoops_users (
  uid INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uname VARCHAR(25) NOT NULL UNIQUE,
  email VARCHAR(60) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  pass_expired DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT NULL,
  login_attempts INT(11) DEFAULT 0,
  user_avatar VARCHAR(255) NOT NULL DEFAULT 'blank.gif',
  user_regdate INT(11) NOT NULL DEFAULT 0,
  user_icq VARCHAR(15) NOT NULL DEFAULT '',
  user_from VARCHAR(100) NOT NULL DEFAULT '',
  user_sig TEXT,
  user_sig_smilies TINYINT(1) NOT NULL DEFAULT 1,
  user_viewemail TINYINT(1) NOT NULL DEFAULT 0,
  user_attachsig TINYINT(1) NOT NULL DEFAULT 0,
  user_theme VARCHAR(32) NOT NULL DEFAULT '',
  user_language VARCHAR(32) NOT NULL DEFAULT '',
  user_openid VARCHAR(255) NOT NULL DEFAULT '',
  user_notify_method TINYINT(1) NOT NULL DEFAULT 0,
  user_notify_interval INT(11) NOT NULL DEFAULT 0
);
```

### Propriedades da Classe XoopsUser

```php
class XoopsUser
{
    protected $uid;
    protected $uname;
    protected $email;
    protected $pass;
    protected $pass_expired;
    protected $created_at;
    protected $updated_at;
    protected $last_login;
    protected $login_attempts;
    protected $user_avatar;
    protected $user_regdate;
    protected $user_icq;
    protected $user_from;
    protected $user_sig;
    protected $user_sig_smilies;
    protected $user_viewemail;
    protected $user_attachsig;
    protected $user_theme;
    protected $user_language;
    protected $user_openid;
    protected $user_notify_method;
    protected $user_notify_interval;
}
```

## Fluxo de Registro de Usuário

### Diagrama de Sequência de Registro

```mermaid
sequenceDiagram
    participant User as Usuário Web
    participant Browser
    participant Server as Servidor XOOPS
    participant DB as Banco de Dados
    participant Email as Serviço de Email

    User->>Browser: Preencher Formulário de Registro
    Browser->>Server: POST /register

    Server->>Server: Validar Entrada
    note over Server: Verificar nome de usuário,<br/>email, requisitos<br/>de senha

    alt Validação Falha
        Server-->>Browser: Mostrar Erros
    else Validação Passa
        Server->>Server: Hash de Senha
        Server->>DB: Inserir Registro de Usuário
        DB-->>Server: Sucesso (uid)

        Server->>Server: Gerar Token de Verificação
        Server->>Email: Enviar Email de Ativação
        Email-->>User: Link de Ativação

        Server-->>Browser: Confirmação de Registro

        User->>Email: Clicar no Link de Ativação
        Email-->>Browser: Redirecionar para URL de Ativação
        Browser->>Server: GET /activate?token=xxx

        Server->>DB: Marcar Usuário como Ativo
        DB-->>Server: Confirmado

        Server-->>Browser: Conta Ativada
        Browser-->>User: Mostrar Mensagem de Sucesso
    end
```

### Implementação de Registro

```php
<?php
/**
 * Manipulador de Registro de Usuário
 */
class RegistrationHandler
{
    private $userHandler;
    private $configHandler;

    public function __construct()
    {
        $this->userHandler = xoops_getHandler('user');
        $this->configHandler = xoops_getHandler('config');
    }

    /**
     * Validar entrada de registro
     *
     * @param array $data Dados do formulário de registro
     * @return array Erros de validação, vazio se válido
     */
    public function validateInput(array $data): array
    {
        $errors = [];

        // Validação de nome de usuário
        if (empty($data['uname'])) {
            $errors[] = 'Nome de usuário é obrigatório';
        } elseif (strlen($data['uname']) < 3) {
            $errors[] = 'Nome de usuário deve ter pelo menos 3 caracteres';
        } elseif (!preg_match('/^[a-zA-Z0-9_-]+$/', $data['uname'])) {
            $errors[] = 'Nome de usuário contém caracteres inválidos';
        } elseif ($this->userHandler->getUserByName($data['uname'])) {
            $errors[] = 'Nome de usuário já existe';
        }

        // Validação de email
        if (empty($data['email'])) {
            $errors[] = 'Email é obrigatório';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Formato de email inválido';
        } elseif ($this->userHandler->getUserByEmail($data['email'])) {
            $errors[] = 'Email já foi registrado';
        }

        // Validação de senha
        if (empty($data['password'])) {
            $errors[] = 'Senha é obrigatória';
        } elseif (strlen($data['password']) < 8) {
            $errors[] = 'Senha deve ter pelo menos 8 caracteres';
        } elseif ($data['password'] !== $data['password_confirm']) {
            $errors[] = 'As senhas não coincidem';
        }

        return $errors;
    }

    /**
     * Registrar novo usuário
     *
     * @param array $data Dados de registro
     * @return XoopsUser|false Objeto de usuário ou falso em caso de falha
     */
    public function registerUser(array $data)
    {
        // Validar entrada
        $errors = $this->validateInput($data);
        if (!empty($errors)) {
            return false;
        }

        // Criar objeto de usuário
        $user = $this->userHandler->create();
        $user->setVar('uname', $data['uname']);
        $user->setVar('email', $data['email']);
        $user->setVar('user_regdate', time());

        // Hash de senha usando bcrypt
        $hashedPassword = password_hash(
            $data['password'],
            PASSWORD_BCRYPT,
            ['cost' => 12]
        );
        $user->setVar('pass', $hashedPassword);

        // Definir preferências padrão
        $user->setVar('user_theme', $this->configHandler->getConfig('default_theme'));
        $user->setVar('user_language', $this->configHandler->getConfig('default_language'));

        // Salvar usuário
        if ($this->userHandler->insertUser($user)) {
            $uid = $user->getVar('uid');

            // Gerar token de verificação
            $token = bin2hex(random_bytes(32));
            $this->saveVerificationToken($uid, $token);

            // Enviar email de verificação
            $this->sendVerificationEmail($user, $token);

            return $user;
        }

        return false;
    }

    /**
     * Salvar token de verificação
     *
     * @param int $uid ID do Usuário
     * @param string $token Token de verificação
     */
    private function saveVerificationToken(int $uid, string $token): void
    {
        $tokenHandler = xoops_getHandler('usertoken');
        $tokenHandler->saveToken($uid, $token, 'email_verification', 24); // 24 horas
    }

    /**
     * Enviar email de verificação
     *
     * @param XoopsUser $user Objeto de usuário
     * @param string $token Token de verificação
     */
    private function sendVerificationEmail(XoopsUser $user, string $token): void
    {
        global $xoopsConfig;

        $siteUrl = $xoopsConfig['siteurl'];
        $activationUrl = $siteUrl . '/user.php?op=activate&token=' . $token;

        $subject = 'Verificação de Email - ' . $xoopsConfig['sitename'];
        $body = "Olá " . $user->getVar('uname') . ",\n\n";
        $body .= "Por favor clique no link abaixo para verificar seu email:\n";
        $body .= $activationUrl . "\n\n";
        $body .= "Este link expirará em 24 horas.\n\n";
        $body .= "Atenciosamente,\n" . $xoopsConfig['sitename'];

        $mailHandler = xoops_getHandler('mail');
        $mailHandler->send($user->getVar('email'), $subject, $body);
    }
}
```

## Processo de Autenticação de Usuário

### Diagrama de Fluxo de Autenticação

```mermaid
graph TD
    A["Formulário de Login"] --> B["Nome de Usuário/Email e Senha"]
    B --> C{"Validação de Entrada"}
    C -->|Inválida| D["Mostrar Erro"]
    C -->|Válida| E["Consultar Banco de Dados de Usuários"]
    E --> F{"Usuário Encontrado?"}
    F -->|Não| G["Credenciais Inválidas"]
    G --> H["Registrar Tentativa Falhada"]
    H --> I{"Máximo de Tentativas?"}
    I -->|Sim| J["Conta Bloqueada"]
    I -->|Não| D
    F -->|Sim| K["Verificar Hash de Senha"]
    K --> L{"Hash Corresponde?"}
    L -->|Não| H
    L -->|Sim| M["Verificar Status da Conta"]
    M --> N{"Conta Ativa?"}
    N -->|Não| O["Conta Inativa/Suspensa"]
    N -->|Sim| P["Criar Sessão"]
    P --> Q["Armazenar Token de Sessão"]
    Q --> R{"Lembrar-me?"}
    R -->|Sim| S["Definir Cookie de Longa Duração"]
    R -->|Não| T["Definir Cookie de Sessão"]
    S --> U["Atualizar Último Login"]
    T --> U
    U --> V["Redirecionar para Painel"]
```

### Implementação de Autenticação

```php
<?php
/**
 * Manipulador de Autenticação
 */
class AuthenticationHandler
{
    private $userHandler;
    private $maxLoginAttempts = 5;
    private $lockoutDuration = 900; // 15 minutos

    public function __construct()
    {
        $this->userHandler = xoops_getHandler('user');
    }

    /**
     * Autenticar usuário por nome de usuário/email e senha
     *
     * @param string $username Nome de usuário ou email
     * @param string $password Senha em texto plano
     * @param bool $rememberMe Lembrar login
     * @return XoopsUser|false Usuário autenticado ou falso
     */
    public function authenticate(
        string $username,
        string $password,
        bool $rememberMe = false
    )
    {
        // Verificar bloqueio de conta
        if ($this->isAccountLocked($username)) {
            throw new Exception('Conta temporariamente bloqueada devido a tentativas de login falhadas');
        }

        // Encontrar usuário por nome de usuário ou email
        $user = $this->userHandler->getUserByName($username);
        if (!$user) {
            $user = $this->userHandler->getUserByEmail($username);
        }

        if (!$user) {
            $this->recordFailedAttempt($username);
            return false;
        }

        // Verificar senha
        if (!password_verify($password, $user->getVar('pass'))) {
            $this->recordFailedAttempt($username);
            return false;
        }

        // Verificar status da conta
        if ($user->getVar('level') == 0) {
            throw new Exception('Conta está inativa');
        }

        // Limpar tentativas falhadas
        $this->clearFailedAttempts($user->getVar('uid'));

        // Atualizar último login
        $user->setVar('last_login', date('Y-m-d H:i:s'));
        $this->userHandler->insertUser($user);

        // Criar sessão
        $this->createSession($user, $rememberMe);

        return $user;
    }

    /**
     * Criar sessão autenticada
     *
     * @param XoopsUser $user Objeto de usuário
     * @param bool $rememberMe Habilitar login persistente
     */
    private function createSession(XoopsUser $user, bool $rememberMe = false): void
    {
        // Gerar token de sessão
        $token = bin2hex(random_bytes(32));

        $_SESSION['xoopsUserId'] = $user->getVar('uid');
        $_SESSION['xoopsUserName'] = $user->getVar('uname');
        $_SESSION['xoopsSessionToken'] = $token;
        $_SESSION['xoopsSessionCreated'] = time();

        // Armazenar token em banco de dados para validação
        $this->storeSessionToken($user->getVar('uid'), $token);

        if ($rememberMe) {
            // Criar cookie de login persistente (14 dias)
            $cookieToken = bin2hex(random_bytes(32));
            setcookie(
                'xoops_persistent_login',
                $cookieToken,
                time() + (14 * 24 * 60 * 60),
                '/',
                '',
                true,  // HTTPS only
                true   // HttpOnly
            );

            // Armazenar hash do token do cookie
            $this->storePersistentToken(
                $user->getVar('uid'),
                hash('sha256', $cookieToken)
            );
        }
    }

    /**
     * Registrar tentativa de login falhada
     *
     * @param string $username Nome de usuário ou email
     */
    private function recordFailedAttempt(string $username): void
    {
        $key = 'login_attempt_' . md5($username);
        $attempts = apcu_fetch($key) ?: 0;
        apcu_store($key, $attempts + 1, $this->lockoutDuration);
    }

    /**
     * Verificar se conta está bloqueada
     *
     * @param string $username Nome de usuário ou email
     * @return bool Verdadeiro se bloqueada
     */
    private function isAccountLocked(string $username): bool
    {
        $key = 'login_attempt_' . md5($username);
        $attempts = apcu_fetch($key) ?: 0;
        return $attempts >= $this->maxLoginAttempts;
    }

    /**
     * Limpar tentativas falhadas
     *
     * @param int $uid ID do Usuário
     */
    private function clearFailedAttempts(int $uid): void
    {
        $user = $this->userHandler->getUser($uid);
        $user->setVar('login_attempts', 0);
        $this->userHandler->insertUser($user);
    }

    /**
     * Armazenar token de sessão
     *
     * @param int $uid ID do Usuário
     * @param string $token Token de sessão
     */
    private function storeSessionToken(int $uid, string $token): void
    {
        // Armazenar em banco de dados ou cache
        $tokenData = [
            'uid' => $uid,
            'token' => hash('sha256', $token),
            'created' => time(),
            'expires' => time() + (8 * 60 * 60) // 8 horas
        ];

        $db = XoopsDatabaseFactory::getDatabaseConnection();
        $db->query("INSERT INTO xoops_sessions (uid, token, created, expires)
                   VALUES (?, ?, ?, ?)",
                   array($uid, $tokenData['token'], $tokenData['created'], $tokenData['expires']));
    }
}
```

## Gerenciamento de Perfil

### Implementação de Atualização de Perfil

```php
<?php
/**
 * Gerenciamento de Perfil de Usuário
 */
class ProfileManager
{
    private $userHandler;
    private $avatarHandler;

    public function __construct()
    {
        $this->userHandler = xoops_getHandler('user');
        $this->avatarHandler = xoops_getHandler('avatar');
    }

    /**
     * Atualizar perfil do usuário
     *
     * @param int $uid ID do Usuário
     * @param array $data Dados do perfil
     * @return bool Status de sucesso
     */
    public function updateProfile(int $uid, array $data): bool
    {
        $user = $this->userHandler->getUser($uid);
        if (!$user) {
            return false;
        }

        // Atualizar campos do perfil
        if (isset($data['email'])) {
            // Verificar se email é único (excluindo usuário atual)
            $existingUser = $this->userHandler->getUserByEmail($data['email']);
            if ($existingUser && $existingUser->getVar('uid') !== $uid) {
                throw new Exception('Email já está em uso');
            }
            $user->setVar('email', $data['email']);
        }

        if (isset($data['user_icq'])) {
            $user->setVar('user_icq', sanitize_text_field($data['user_icq']));
        }

        if (isset($data['user_from'])) {
            $user->setVar('user_from', sanitize_text_field($data['user_from']));
        }

        if (isset($data['user_sig'])) {
            $sig = $data['user_sig'];
            if (strlen($sig) > 500) {
                throw new Exception('Assinatura muito longa');
            }
            $user->setVar('user_sig', $sig);
        }

        if (isset($data['user_sig_smilies'])) {
            $user->setVar('user_sig_smilies', (int)$data['user_sig_smilies']);
        }

        if (isset($data['user_viewemail'])) {
            $user->setVar('user_viewemail', (int)$data['user_viewemail']);
        }

        if (isset($data['user_attachsig'])) {
            $user->setVar('user_attachsig', (int)$data['user_attachsig']);
        }

        if (isset($data['user_theme'])) {
            $user->setVar('user_theme', $data['user_theme']);
        }

        if (isset($data['user_language'])) {
            $user->setVar('user_language', $data['user_language']);
        }

        return $this->userHandler->insertUser($user);
    }

    /**
     * Alterar senha do usuário
     *
     * @param int $uid ID do Usuário
     * @param string $currentPassword Senha atual
     * @param string $newPassword Nova senha
     * @return bool Status de sucesso
     */
    public function changePassword(
        int $uid,
        string $currentPassword,
        string $newPassword
    ): bool
    {
        $user = $this->userHandler->getUser($uid);
        if (!$user) {
            return false;
        }

        // Verificar senha atual
        if (!password_verify($currentPassword, $user->getVar('pass'))) {
            throw new Exception('Senha atual está incorreta');
        }

        // Validar nova senha
        if (strlen($newPassword) < 8) {
            throw new Exception('Nova senha deve ter pelo menos 8 caracteres');
        }

        // Hash da nova senha
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $user->setVar('pass', $hashedPassword);

        return $this->userHandler->insertUser($user);
    }

    /**
     * Obter dados do perfil do usuário
     *
     * @param int $uid ID do Usuário
     * @return array Dados do perfil
     */
    public function getProfile(int $uid): array
    {
        $user = $this->userHandler->getUser($uid);
        if (!$user) {
            return [];
        }

        return [
            'uid' => $user->getVar('uid'),
            'uname' => $user->getVar('uname'),
            'email' => $user->getVar('email'),
            'user_regdate' => $user->getVar('user_regdate'),
            'user_icq' => $user->getVar('user_icq'),
            'user_from' => $user->getVar('user_from'),
            'user_sig' => $user->getVar('user_sig'),
            'user_viewemail' => $user->getVar('user_viewemail'),
            'user_attachsig' => $user->getVar('user_attachsig'),
            'user_theme' => $user->getVar('user_theme'),
            'user_language' => $user->getVar('user_language'),
            'last_login' => $user->getVar('last_login'),
            'avatar' => $user->getVar('user_avatar')
        ];
    }
}
```

## Manejo de Avatar

### Gerenciamento de Avatar

```php
<?php
/**
 * Manipulador de Avatar de Usuário
 */
class AvatarHandler
{
    private $avatarPath = '/uploads/avatars/';
    private $maxSize = 2097152; // 2MB
    private $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    /**
     * Fazer upload de avatar do usuário
     *
     * @param int $uid ID do Usuário
     * @param array $file Array $_FILES
     * @return string|false Nome do arquivo de avatar ou falso
     */
    public function uploadAvatar(int $uid, array $file)
    {
        // Validar arquivo
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload de arquivo: ' . $file['error']);
        }

        if ($file['size'] > $this->maxSize) {
            throw new Exception('Arquivo muito grande (máx 2MB)');
        }

        if (!in_array($file['type'], $this->allowedTypes)) {
            throw new Exception('Tipo de arquivo inválido');
        }

        // Verificar tipo MIME
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedTypes)) {
            throw new Exception('Conteúdo do arquivo inválido');
        }

        // Gerar nome de arquivo único
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'avatar_' . $uid . '_' . time() . '.' . $extension;

        // Criar diretório de upload
        $uploadDir = XOOPS_ROOT_PATH . $this->avatarPath;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filepath = $uploadDir . $filename;

        // Mover arquivo enviado
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Falha ao mover arquivo enviado');
        }

        // Redimensionar imagem para tamanho padrão (150x150)
        $this->resizeImage($filepath, 150, 150);

        // Atualizar avatar do usuário
        $userHandler = xoops_getHandler('user');
        $user = $userHandler->getUser($uid);

        // Deletar avatar antigo se existir
        $oldAvatar = $user->getVar('user_avatar');
        if ($oldAvatar && $oldAvatar !== 'blank.gif') {
            $oldPath = $uploadDir . $oldAvatar;
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        // Salvar novo avatar
        $user->setVar('user_avatar', $filename);
        $userHandler->insertUser($user);

        return $filename;
    }

    /**
     * Redimensionar imagem para dimensões especificadas
     *
     * @param string $filepath Caminho para arquivo de imagem
     * @param int $width Largura alvo
     * @param int $height Altura alvo
     */
    private function resizeImage(string $filepath, int $width, int $height): void
    {
        if (!extension_loaded('gd')) {
            return; // GD não disponível, pular redimensionamento
        }

        $image = imagecreatefromstring(file_get_contents($filepath));
        if (!$image) {
            return;
        }

        $resized = imagecreatetruecolor($width, $height);

        // Preservar transparência para PNG e GIF
        $format = mime_content_type($filepath);
        if ($format === 'image/png' || $format === 'image/gif') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
        }

        imagecopyresampled(
            $resized, $image,
            0, 0, 0, 0,
            $width, $height,
            imagesx($image), imagesy($image)
        );

        // Salvar imagem redimensionada
        $ext = pathinfo($filepath, PATHINFO_EXTENSION);
        if (strtolower($ext) === 'png') {
            imagepng($resized, $filepath, 9);
        } else {
            imagejpeg($resized, $filepath, 90);
        }

        imagedestroy($image);
        imagedestroy($resized);
    }

    /**
     * Deletar avatar do usuário
     *
     * @param int $uid ID do Usuário
     * @return bool Status de sucesso
     */
    public function deleteAvatar(int $uid): bool
    {
        $userHandler = xoops_getHandler('user');
        $user = $userHandler->getUser($uid);

        if (!$user) {
            return false;
        }

        $avatar = $user->getVar('user_avatar');
        if ($avatar && $avatar !== 'blank.gif') {
            $filepath = XOOPS_ROOT_PATH . $this->avatarPath . $avatar;
            if (file_exists($filepath)) {
                unlink($filepath);
            }
        }

        $user->setVar('user_avatar', 'blank.gif');
        return $userHandler->insertUser($user);
    }
}
```

## Preferências do Usuário

### Sistema de Preferências

```php
<?php
/**
 * Manipulador de Preferências do Usuário
 */
class UserPreferencesHandler
{
    private $userHandler;
    private $prefixCache = 'user_pref_';

    public function __construct()
    {
        $this->userHandler = xoops_getHandler('user');
    }

    /**
     * Obter preferência do usuário
     *
     * @param int $uid ID do Usuário
     * @param string $prefKey Chave de preferência
     * @param mixed $default Valor padrão
     * @return mixed Valor da preferência
     */
    public function getPreference(int $uid, string $prefKey, $default = null)
    {
        // Tentar cache primeiro
        $cacheKey = $this->prefixCache . $uid . '_' . $prefKey;
        $cached = apcu_fetch($cacheKey);
        if ($cached !== false) {
            return $cached;
        }

        // Obter do banco de dados
        $db = XoopsDatabaseFactory::getDatabaseConnection();
        $result = $db->query(
            "SELECT pref_value FROM xoops_user_preferences
             WHERE uid = ? AND pref_key = ?",
            array($uid, $prefKey)
        );

        if ($result && $db->getRowCount($result) > 0) {
            $row = $db->fetchArray($result);
            $value = unserialize($row['pref_value']);
            apcu_store($cacheKey, $value, 3600); // Cache por 1 hora
            return $value;
        }

        return $default;
    }

    /**
     * Definir preferência do usuário
     *
     * @param int $uid ID do Usuário
     * @param string $prefKey Chave de preferência
     * @param mixed $prefValue Valor da preferência
     * @return bool Status de sucesso
     */
    public function setPreference(int $uid, string $prefKey, $prefValue): bool
    {
        $db = XoopsDatabaseFactory::getDatabaseConnection();

        // Verificar se preferência existe
        $result = $db->query(
            "SELECT id FROM xoops_user_preferences
             WHERE uid = ? AND pref_key = ?",
            array($uid, $prefKey)
        );

        $serialized = serialize($prefValue);

        if ($db->getRowCount($result) > 0) {
            // Atualizar preferência existente
            $success = $db->query(
                "UPDATE xoops_user_preferences
                 SET pref_value = ?
                 WHERE uid = ? AND pref_key = ?",
                array($serialized, $uid, $prefKey)
            );
        } else {
            // Inserir nova preferência
            $success = $db->query(
                "INSERT INTO xoops_user_preferences (uid, pref_key, pref_value)
                 VALUES (?, ?, ?)",
                array($uid, $prefKey, $serialized)
            );
        }

        if ($success) {
            // Limpar cache
            $cacheKey = $this->prefixCache . $uid . '_' . $prefKey;
            apcu_delete($cacheKey);
        }

        return (bool)$success;
    }

    /**
     * Obter todas as preferências do usuário
     *
     * @param int $uid ID do Usuário
     * @return array Todas as preferências
     */
    public function getAllPreferences(int $uid): array
    {
        $db = XoopsDatabaseFactory::getDatabaseConnection();
        $result = $db->query(
            "SELECT pref_key, pref_value FROM xoops_user_preferences WHERE uid = ?",
            array($uid)
        );

        $prefs = [];
        while ($row = $db->fetchArray($result)) {
            $prefs[$row['pref_key']] = unserialize($row['pref_value']);
        }

        return $prefs;
    }

    /**
     * Deletar preferência do usuário
     *
     * @param int $uid ID do Usuário
     * @param string $prefKey Chave de preferência
     * @return bool Status de sucesso
     */
    public function deletePreference(int $uid, string $prefKey): bool
    {
        $db = XoopsDatabaseFactory::getDatabaseConnection();
        $success = $db->query(
            "DELETE FROM xoops_user_preferences WHERE uid = ? AND pref_key = ?",
            array($uid, $prefKey)
        );

        if ($success) {
            $cacheKey = $this->prefixCache . $uid . '_' . $prefKey;
            apcu_delete($cacheKey);
        }

        return (bool)$success;
    }
}
```

## Exemplos de Operações do Usuário

### Operações Comuns de Usuário

```php
<?php
/**
 * Exemplos de operações comuns com usuários
 */

// Obter usuário logado atual
$xoopsUser = $GLOBALS['xoopsUser'];
if ($xoopsUser instanceof XoopsUser) {
    $userId = $xoopsUser->getVar('uid');
    $username = $xoopsUser->getVar('uname');
}

// Obter usuário por ID
$userHandler = xoops_getHandler('user');
$user = $userHandler->getUser(1);
echo $user->getVar('uname');

// Obter usuário por nome de usuário
$user = $userHandler->getUserByName('admin');
if ($user) {
    echo $user->getVar('email');
}

// Obter usuário por email
$user = $userHandler->getUserByEmail('user@example.com');

// Obter todos os usuários em um grupo
$users = $userHandler->getUsersByGroup(1);
foreach ($users as $user) {
    echo $user->getVar('uname') . "\n";
}

// Criar novo usuário
$user = $userHandler->create();
$user->setVar('uname', 'newuser');
$user->setVar('email', 'newuser@example.com');
$user->setVar('pass', password_hash('password', PASSWORD_BCRYPT));
$user->setVar('user_regdate', time());

if ($userHandler->insertUser($user)) {
    echo "Usuário criado: " . $user->getVar('uid');
}

// Deletar usuário
$userHandler->deleteUser(123);

// Obter objeto de usuário de ID
$user = $userHandler->getUser(5);
$profile = [
    'username' => $user->getVar('uname'),
    'email' => $user->getVar('email'),
    'regdate' => date('Y-m-d', $user->getVar('user_regdate')),
    'avatar' => $user->getVar('user_avatar'),
];
```

## Boas Práticas de Segurança

### Segurança de Senha

- Sempre usar `password_hash()` com algoritmo `PASSWORD_BCRYPT`
- Usar parâmetro cost de 12 para bcrypt
- Nunca armazenar senhas em texto plano
- Implementar políticas de expiração de senha
- Exigir mudança de senha para contas comprometidas

### Segurança de Sessão

```php
<?php
// Configuração de sessão
session_set_cookie_params([
    'lifetime' => 0,           // Cookie de sessão (deletado ao fechar navegador)
    'path' => '/',
    'domain' => '',
    'secure' => true,          // HTTPS only
    'httponly' => true,        // Não acessível a JavaScript
    'samesite' => 'Strict'     // Proteção CSRF
]);

session_start();

// Regenerar ID de sessão após login
session_regenerate_id(true);

// Validar token de sessão
if (!isset($_SESSION['xoopsSessionToken'])) {
    session_destroy();
    redirect('login');
}
```

## Links Relacionados

- Group System.md
- Permission System.md
- Authentication.md
- ../../Security/Security-Guidelines.md

## Tags

#users #registration #authentication #profiles #password-security #sessions
