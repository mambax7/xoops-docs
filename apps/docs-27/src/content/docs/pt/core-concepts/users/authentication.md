---
title: "Autenticação"
description: "Guia completo do sistema de autenticação XOOPS, fluxo de login, gerenciamento de sessão, segurança e recursos avançados"
---

# Autenticação no XOOPS

O sistema de autenticação XOOPS fornece verificação segura de usuário, gerenciamento de sessão e recursos de segurança avançados, incluindo autenticação de dois fatores e integração OAuth. Este documento cobre fluxos de autenticação, implementação e boas práticas.

## Fluxo de Autenticação

### Diagrama de Sequência de Login

```mermaid
sequenceDiagram
    participant User as Navegador do Usuário
    participant Server as Servidor XOOPS
    participant DB as Banco de Dados
    participant Session as Gerenciador de Sessão
    participant Cache as Cache/APCu

    User->>Server: POST /user.php?op=login
    note over User, Server: username/email + password

    Server->>Server: Validar Entrada
    note over Server: Verificar formato, token CSRF

    alt Formato Inválido
        Server-->>User: 400 Bad Request
    else Formato Válido
        Server->>Cache: Verificar Bloqueio de Conta
        Cache-->>Server: Status de Bloqueio?

        alt Conta Bloqueada
            Server-->>User: Conta Temporariamente Bloqueada
        else Não Bloqueada
            Server->>DB: Consultar Usuário por Nome de Usuário/Email
            DB-->>Server: Registro de Usuário

            alt Usuário Não Encontrado
                Server->>Cache: Incrementar Tentativas Falhadas
                Server-->>User: Credenciais Inválidas
            else Usuário Encontrado
                Server->>Server: Verificar Hash de Senha
                note over Server: password_verify()

                alt Senha Incorreta
                    Server->>Cache: Incrementar Tentativas Falhadas
                    Server-->>User: Credenciais Inválidas
                else Senha Correta
                    Server->>Server: Verificar Status da Conta
                    alt Conta Inativa
                        Server-->>User: Conta Inativa
                    else Conta Ativa
                        Server->>Cache: Limpar Tentativas Falhadas
                        Server->>Session: Criar Sessão
                        note over Session: Gerar token,<br/>armazenar no BD

                        Server->>DB: Atualizar Último Login
                        DB-->>Server: Atualizado

                        alt Lembrar-me Marcado
                            Server->>Server: Gerar Token Persistente
                            Server->>User: Definir Cookie Persistente
                        else Lembrar-me Desmarcado
                            Server->>User: Definir Cookie de Sessão
                        end

                        Server-->>User: Redirecionamento 302 para Painel
                    end
                end
            end
        end
    end
```

### Detalhes do Processo de Login

```mermaid
graph TD
    A["Usuário Envia Formulário de Login"] --> B["Validação do Token CSRF"]
    B --> C{"Token Válido?"}
    C -->|Não| D["Rejeitar Requisição"]
    C -->|Sim| E["Validar Formato de Entrada"]
    E --> F{"Formato Válido?"}
    F -->|Não| G["Mostrar Erros de Validação"]
    F -->|Sim| H["Verificar Status de Bloqueio"]
    H --> I{"Conta Bloqueada?"}
    I -->|Sim| J["Mostrar Mensagem de Bloqueio"]
    I -->|Não| K["Consultar Banco de Dados de Usuários"]
    K --> L{"Usuário Existe?"}
    L -->|Não| M["Registrar Tentativa<br/>Mostrar Erro"]
    L -->|Sim| N["Verificar Hash de Senha"]
    N --> O{"Corresponde?"}
    O -->|Não| M
    O -->|Sim| P["Verificar Status da Conta"]
    P --> Q{"Ativa?"}
    Q -->|Não| R["Mostrar Erro de Status"]
    Q -->|Sim| S["Criar Sessão"]
    S --> T["Atualizar Último Login"]
    T --> U{"Lembrar-me?"}
    U -->|Sim| W["Criar Token Persistente<br/>Definir Cookie Longo"]
    U -->|Não| X["Definir Cookie de Sessão"]
    W --> Y["Redirecionar para Painel"]
    X --> Y
```

## Gerenciamento de Sessão

### Configuração de Sessão

```php
<?php
/**
 * Configuração de Sessão XOOPS
 * Tipicamente em /include/session.php
 */

// Parâmetros de cookie de sessão para segurança
session_set_cookie_params([
    'lifetime' => 0,           // Cookie de sessão (deletado ao fechar navegador)
    'path' => '/',             // Caminho do cookie
    'domain' => '',            // Domínio do cookie (vazio = domínio atual)
    'secure' => true,          // Apenas HTTPS
    'httponly' => true,        // Não acessível a JavaScript
    'samesite' => 'Strict'     // Proteção CSRF
]);

// Definir configuração de sessão
ini_set('session.name', 'XOOPSPHPSESSID');
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.gc_maxlifetime', 28800);  // 8 horas

// Iniciar sessão
session_start();

// Verificar proteção de fixação de sessão
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id();
    $_SESSION['initiated'] = true;
}
```

### Implementação de Manipulador de Sessão

```php
<?php
/**
 * Manipulador de Sessão XOOPS
 */
class XoopsSessionHandler
{
    private $sessionTimeout = 28800; // 8 horas
    private $sessionTokenLength = 32;
    private $db;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
    }

    /**
     * Criar nova sessão
     *
     * @param XoopsUser $user Objeto de usuário
     * @param bool $rememberMe Flag de login persistente
     * @return bool Status de sucesso
     */
    public function createSession(XoopsUser $user, bool $rememberMe = false): bool
    {
        try {
            // Gerar token seguro
            $token = bin2hex(random_bytes($this->sessionTokenLength));

            // Armazenar em sessão
            $_SESSION['xoopsUserId'] = $user->getVar('uid');
            $_SESSION['xoopsUserName'] = $user->getVar('uname');
            $_SESSION['xoopsSessionToken'] = $token;
            $_SESSION['xoopsSessionCreated'] = time();
            $_SESSION['xoopsSessionIP'] = $this->getClientIP();
            $_SESSION['xoopsSessionUA'] = $_SERVER['HTTP_USER_AGENT'] ?? '';

            // Armazenar token em banco de dados
            $this->storeSessionToken(
                $user->getVar('uid'),
                $token,
                $this->sessionTimeout
            );

            // Lidar com login persistente
            if ($rememberMe) {
                $this->createPersistentLogin($user->getVar('uid'));
            }

            return true;
        } catch (Exception $e) {
            error_log('Session creation failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Validar sessão atual
     *
     * @return bool Sessão válida
     */
    public function validateSession(): bool
    {
        // Verificar se variáveis de sessão existem
        if (!isset($_SESSION['xoopsUserId'], $_SESSION['xoopsSessionToken'])) {
            return false;
        }

        // Verificar timeout de sessão
        $created = $_SESSION['xoopsSessionCreated'] ?? 0;
        if (time() - $created > $this->sessionTimeout) {
            $this->destroySession();
            return false;
        }

        // Verificar consistência do endereço IP
        if ($this->getClientIP() !== ($_SESSION['xoopsSessionIP'] ?? '')) {
            error_log('Session IP mismatch - possible session hijacking');
            $this->destroySession();
            return false;
        }

        // Verificar consistência do User Agent
        $currentUA = $_SERVER['HTTP_USER_AGENT'] ?? '';
        if ($currentUA !== ($_SESSION['xoopsSessionUA'] ?? '')) {
            error_log('Session UA mismatch - possible session hijacking');
            $this->destroySession();
            return false;
        }

        // Verificar token em banco de dados
        if (!$this->verifySessionToken(
            $_SESSION['xoopsUserId'],
            $_SESSION['xoopsSessionToken']
        )) {
            return false;
        }

        return true;
    }

    /**
     * Destruir sessão
     */
    public function destroySession(): void
    {
        if (isset($_SESSION['xoopsUserId'])) {
            $this->deleteSessionToken(
                $_SESSION['xoopsUserId'],
                $_SESSION['xoopsSessionToken'] ?? ''
            );
        }

        // Limpar dados de sessão
        $_SESSION = [];

        // Deletar cookie de sessão
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

        session_destroy();
    }

    /**
     * Armazenar token de sessão em banco de dados
     *
     * @param int $uid ID do Usuário
     * @param string $token Token de sessão
     * @param int $lifetime Duração do token em segundos
     */
    private function storeSessionToken(int $uid, string $token, int $lifetime): void
    {
        $tokenHash = hash('sha256', $token);
        $expiresAt = time() + $lifetime;

        $this->db->query(
            "INSERT INTO xoops_sessions (uid, token, ip, user_agent, expires_at)
             VALUES (?, ?, ?, ?, ?)",
            array($uid, $tokenHash, $this->getClientIP(),
                  $_SERVER['HTTP_USER_AGENT'] ?? '', $expiresAt)
        );
    }

    /**
     * Verificar token de sessão
     *
     * @param int $uid ID do Usuário
     * @param string $token Token de sessão
     * @return bool Token válido
     */
    private function verifySessionToken(int $uid, string $token): bool
    {
        $tokenHash = hash('sha256', $token);

        $result = $this->db->query(
            "SELECT id FROM xoops_sessions
             WHERE uid = ? AND token = ? AND expires_at > ?",
            array($uid, $tokenHash, time())
        );

        return $this->db->getRowCount($result) > 0;
    }

    /**
     * Deletar token de sessão
     *
     * @param int $uid ID do Usuário
     * @param string $token Token de sessão (opcional)
     */
    private function deleteSessionToken(int $uid, string $token = ''): void
    {
        if (!empty($token)) {
            $tokenHash = hash('sha256', $token);
            $this->db->query(
                "DELETE FROM xoops_sessions WHERE uid = ? AND token = ?",
                array($uid, $tokenHash)
            );
        } else {
            // Deletar todas as sessões do usuário
            $this->db->query(
                "DELETE FROM xoops_sessions WHERE uid = ?",
                array($uid)
            );
        }
    }

    /**
     * Obter endereço IP do cliente
     *
     * @return string Endereço IP
     */
    private function getClientIP(): string
    {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED'])) {
            return $_SERVER['HTTP_X_FORWARDED'];
        } elseif (!empty($_SERVER['HTTP_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_FORWARDED_FOR'];
        } elseif (!empty($_SERVER['HTTP_FORWARDED'])) {
            return $_SERVER['HTTP_FORWARDED'];
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            return $_SERVER['REMOTE_ADDR'];
        }
        return '';
    }
}
```

## Funcionalidade Lembrar-me

### Implementação de Login Persistente

```php
<?php
/**
 * Manipulador de Lembrar-me (Login Persistente)
 */
class PersistentLoginHandler
{
    private $cookieName = 'xoops_persistent_login';
    private $cookieLifetime = 1209600; // 14 dias
    private $db;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
    }

    /**
     * Criar token de login persistente
     *
     * @param int $uid ID do Usuário
     * @return string Token do cookie
     */
    public function createPersistentToken(int $uid): string
    {
        // Gerar token aleatório
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);

        // Armazenar em banco de dados
        $expiresAt = time() + $this->cookieLifetime;

        $this->db->query(
            "INSERT INTO xoops_persistent_tokens (uid, token_hash, expires_at)
             VALUES (?, ?, ?)",
            array($uid, $tokenHash, $expiresAt)
        );

        // Definir cookie
        setcookie(
            $this->cookieName,
            $token,
            time() + $this->cookieLifetime,
            '/',
            '',
            true,  // HTTPS only
            true   // HttpOnly
        );

        return $token;
    }

    /**
     * Validar cookie de login persistente
     *
     * @return XoopsUser|false Usuário autenticado ou falso
     */
    public function validatePersistentToken()
    {
        if (!isset($_COOKIE[$this->cookieName])) {
            return false;
        }

        $token = $_COOKIE[$this->cookieName];
        $tokenHash = hash('sha256', $token);

        // Consultar banco de dados
        $result = $this->db->query(
            "SELECT uid FROM xoops_persistent_tokens
             WHERE token_hash = ? AND expires_at > ?",
            array($tokenHash, time())
        );

        if ($this->db->getRowCount($result) === 0) {
            return false;
        }

        $row = $this->db->fetchArray($result);
        $uid = $row['uid'];

        // Obter usuário
        $userHandler = xoops_getHandler('user');
        $user = $userHandler->getUser($uid);

        if (!$user) {
            return false;
        }

        // Renovar token (janela deslizante)
        $this->refreshPersistentToken($uid, $token);

        return $user;
    }

    /**
     * Renovar token de login persistente (janela deslizante)
     *
     * @param int $uid ID do Usuário
     * @param string $oldToken Token antigo
     */
    private function refreshPersistentToken(int $uid, string $oldToken): void
    {
        // Deletar token antigo
        $oldTokenHash = hash('sha256', $oldToken);
        $this->db->query(
            "DELETE FROM xoops_persistent_tokens WHERE token_hash = ?",
            array($oldTokenHash)
        );

        // Criar novo token
        $this->createPersistentToken($uid);
    }

    /**
     * Limpar login persistente
     *
     * @param int $uid ID do Usuário
     */
    public function clearPersistentLogin(int $uid): void
    {
        // Deletar todos os tokens do usuário
        $this->db->query(
            "DELETE FROM xoops_persistent_tokens WHERE uid = ?",
            array($uid)
        );

        // Deletar cookie
        setcookie(
            $this->cookieName,
            '',
            time() - 3600,
            '/',
            '',
            true,
            true
        );
    }
}
```

## Hash de Senha

### Manejo Seguro de Senha

```php
<?php
/**
 * Hash de senha e verificação
 */
class PasswordManager
{
    /**
     * Hash de senha usando bcrypt
     *
     * @param string $password Senha em texto plano
     * @return string Senha com hash
     */
    public static function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Verificar senha contra hash
     *
     * @param string $password Senha em texto plano
     * @param string $hash Hash da senha
     * @return bool Status da correspondência
     */
    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * Verificar se a senha precisa de rehash (algoritmo mais forte disponível)
     *
     * @param string $hash Hash da senha
     * @return bool Precisa de rehash
     */
    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * Validar força da senha
     *
     * @param string $password Senha a validar
     * @return array Resultado da validação
     */
    public static function validateStrength(string $password): array
    {
        $errors = [];

        // Comprimento mínimo
        if (strlen($password) < 8) {
            $errors[] = 'A senha deve ter pelo menos 8 caracteres';
        }

        // Requer letra maiúscula
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'A senha deve conter letra maiúscula';
        }

        // Requer letra minúscula
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'A senha deve conter letra minúscula';
        }

        // Requer número
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'A senha deve conter número';
        }

        // Requer caractere especial
        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            $errors[] = 'A senha deve conter caractere especial';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Gerar senha aleatória
     *
     * @param int $length Comprimento da senha
     * @return string Senha aleatória
     */
    public static function generateRandom(int $length = 12): string
    {
        $charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        $password = '';

        for ($i = 0; $i < $length; $i++) {
            $password .= $charset[random_int(0, strlen($charset) - 1)];
        }

        return $password;
    }
}
```

## Autenticação de Dois Fatores

### Visão Geral de Implementação de 2FA

```php
<?php
/**
 * Manipulador de Autenticação de Dois Fatores
 */
class TwoFactorAuthHandler
{
    private $db;
    private $qrCodeGenerator;
    private $totpTimeout = 30;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
    }

    /**
     * Habilitar 2FA para usuário
     *
     * @param int $uid ID do Usuário
     * @return array Dados de configuração com segredo e código QR
     */
    public function enable2FA(int $uid): array
    {
        // Gerar segredo
        $secret = $this->generateSecret();

        // Gerar código QR
        $qrCode = $this->generateQRCode($uid, $secret);

        // Armazenar segredo temporariamente (ainda não confirmado)
        $this->storeTempSecret($uid, $secret);

        return [
            'secret' => $secret,
            'qrCode' => $qrCode
        ];
    }

    /**
     * Confirmar configuração de 2FA com código TOTP
     *
     * @param int $uid ID do Usuário
     * @param string $code Código TOTP
     * @return bool Sucesso da confirmação
     */
    public function confirm2FA(int $uid, string $code): bool
    {
        // Obter segredo temporário
        $tempSecret = $this->getTempSecret($uid);
        if (!$tempSecret) {
            return false;
        }

        // Verificar código TOTP
        if (!$this->verifyTOTP($code, $tempSecret)) {
            return false;
        }

        // Tornar 2FA ativo
        $this->db->query(
            "UPDATE xoops_user_2fa SET status = 'active' WHERE uid = ?",
            array($uid)
        );

        return true;
    }

    /**
     * Verificar código TOTP durante login
     *
     * @param int $uid ID do Usuário
     * @param string $code Código TOTP
     * @return bool Código válido
     */
    public function verifyTOTP(int $uid, string $code): bool
    {
        // Obter segredo ativo
        $result = $this->db->query(
            "SELECT secret FROM xoops_user_2fa WHERE uid = ? AND status = 'active'",
            array($uid)
        );

        if ($this->db->getRowCount($result) === 0) {
            return false;
        }

        $row = $this->db->fetchArray($result);
        $secret = $row['secret'];

        // Verificar TOTP
        return $this->verifyTOTPCode($code, $secret);
    }

    /**
     * Verificar código TOTP contra segredo
     *
     * @param string $code Código TOTP
     * @param string $secret Segredo compartilhado
     * @return bool Válido
     */
    private function verifyTOTPCode(string $code, string $secret): bool
    {
        // Permitir desvio de tempo (atual, -1, +1)
        $timeSlice = floor(time() / 30);

        for ($i = -1; $i <= 1; $i++) {
            $timestamp = ($timeSlice + $i) * 30;
            $generated = $this->generateTOTP($secret, $timestamp);

            if ($generated === $code) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gerar código TOTP
     *
     * @param string $secret Segredo compartilhado
     * @param int $timestamp Unix timestamp
     * @return string Código TOTP
     */
    private function generateTOTP(string $secret, int $timestamp): string
    {
        $secretBinary = $this->base32Decode($secret);
        $time = pack('N', $timestamp);
        $hmac = hash_hmac('SHA1', $time, $secretBinary, true);

        $offset = ord($hmac[strlen($hmac) - 1]) & 0x0F;
        $code = (ord($hmac[$offset]) & 0x7F) << 24 |
                (ord($hmac[$offset + 1]) & 0xFF) << 16 |
                (ord($hmac[$offset + 2]) & 0xFF) << 8 |
                (ord($hmac[$offset + 3]) & 0xFF);

        return str_pad($code % 1000000, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Gerar segredo aleatório para 2FA
     *
     * @return string Segredo codificado em Base32
     */
    private function generateSecret(): string
    {
        $bytes = random_bytes(20);
        return $this->base32Encode($bytes);
    }

    /**
     * Codificar Base32
     *
     * @param string $data Dados a codificar
     * @return string String codificada em Base32
     */
    private function base32Encode(string $data): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $encoded = '';
        $len = strlen($data);
        $bits = 0;
        $value = 0;

        for ($i = 0; $i < $len; $i++) {
            $value = ($value << 8) | ord($data[$i]);
            $bits += 8;

            while ($bits >= 5) {
                $bits -= 5;
                $encoded .= $alphabet[($value >> $bits) & 31];
            }
        }

        if ($bits > 0) {
            $encoded .= $alphabet[($value << (5 - $bits)) & 31];
        }

        return $encoded;
    }

    /**
     * Decodificar Base32
     *
     * @param string $encoded String codificada em Base32
     * @return string Dados binários decodificados
     */
    private function base32Decode(string $encoded): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $decoded = '';
        $len = strlen($encoded);
        $bits = 0;
        $value = 0;

        for ($i = 0; $i < $len; $i++) {
            $pos = strpos($alphabet, $encoded[$i]);
            if ($pos === false) continue;

            $value = ($value << 5) | $pos;
            $bits += 5;

            if ($bits >= 8) {
                $bits -= 8;
                $decoded .= chr(($value >> $bits) & 255);
            }
        }

        return $decoded;
    }

    /**
     * Gerar código QR para configuração de 2FA
     *
     * @param int $uid ID do Usuário
     * @param string $secret Segredo TOTP
     * @return string URL de dados do código QR
     */
    private function generateQRCode(int $uid, string $secret): string
    {
        global $xoopsConfig;

        $user = xoops_getHandler('user')->getUser($uid);
        $label = $user->getVar('uname') . '@' . $_SERVER['HTTP_HOST'];
        $otpauthUrl = "otpauth://totp/" . urlencode($label) .
                      "?secret=" . urlencode($secret) .
                      "&issuer=" . urlencode($xoopsConfig['sitename']);

        // Gerar código QR usando biblioteca externa
        // Este exemplo usa um placeholder - use biblioteca QR real
        return "data:image/svg+xml,%3Csvg%3E...%3C/svg%3E";
    }
}
```

## Integração OAuth

### Fluxo de Login OAuth2

```php
<?php
/**
 * Integração OAuth2
 */
class OAuth2Handler
{
    private $providers = [
        'google' => [
            'client_id' => '',
            'client_secret' => '',
            'auth_url' => 'https://accounts.google.com/o/oauth2/v2/auth',
            'token_url' => 'https://www.googleapis.com/oauth2/v4/token',
            'userinfo_url' => 'https://www.googleapis.com/oauth2/v1/userinfo'
        ],
        'github' => [
            'client_id' => '',
            'client_secret' => '',
            'auth_url' => 'https://github.com/login/oauth/authorize',
            'token_url' => 'https://github.com/login/oauth/access_token',
            'userinfo_url' => 'https://api.github.com/user'
        ]
    ];

    private $db;
    private $userHandler;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
        $this->userHandler = xoops_getHandler('user');
    }

    /**
     * Obter URL de autorização OAuth
     *
     * @param string $provider Provedor OAuth
     * @return string URL de autorização
     */
    public function getAuthorizationUrl(string $provider): string
    {
        if (!isset($this->providers[$provider])) {
            throw new Exception('Unknown provider: ' . $provider);
        }

        $config = $this->providers[$provider];
        $state = bin2hex(random_bytes(16));

        // Armazenar estado para verificação
        $_SESSION['oauth_state'] = $state;
        $_SESSION['oauth_provider'] = $provider;

        $params = [
            'client_id' => $config['client_id'],
            'redirect_uri' => $this->getCallbackUrl($provider),
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state
        ];

        return $config['auth_url'] . '?' . http_build_query($params);
    }

    /**
     * Lidar com callback OAuth
     *
     * @param string $provider Provedor OAuth
     * @param string $code Código de autorização
     * @return XoopsUser|false Usuário autenticado ou falso
     */
    public function handleCallback(string $provider, string $code)
    {
        // Verificar estado
        if ($_SESSION['oauth_state'] !== ($_GET['state'] ?? '')) {
            throw new Exception('Invalid state parameter');
        }

        if (!isset($this->providers[$provider])) {
            throw new Exception('Unknown provider: ' . $provider);
        }

        $config = $this->providers[$provider];

        // Trocar código por token
        $token = $this->exchangeCodeForToken(
            $provider,
            $code,
            $config
        );

        if (!$token) {
            return false;
        }

        // Obter informações do usuário
        $userInfo = $this->getUserInfo(
            $provider,
            $token,
            $config
        );

        if (!$userInfo) {
            return false;
        }

        // Encontrar ou criar usuário
        return $this->findOrCreateUser($provider, $userInfo);
    }

    /**
     * Trocar código de autorização por token de acesso
     *
     * @param string $provider Nome do provedor
     * @param string $code Código de autorização
     * @param array $config Configuração do provedor
     * @return array|false Dados do token
     */
    private function exchangeCodeForToken(
        string $provider,
        string $code,
        array $config
    )
    {
        $params = [
            'code' => $code,
            'client_id' => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'redirect_uri' => $this->getCallbackUrl($provider),
            'grant_type' => 'authorization_code'
        ];

        $ch = curl_init($config['token_url']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_HEADER, ['Accept: application/json']);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    /**
     * Obter informações do usuário do provedor
     *
     * @param string $provider Nome do provedor
     * @param array $token Token de acesso
     * @param array $config Configuração do provedor
     * @return array|false Informações do usuário
     */
    private function getUserInfo(
        string $provider,
        array $token,
        array $config
    )
    {
        $ch = curl_init($config['userinfo_url']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token['access_token'],
            'Accept: application/json'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    /**
     * Encontrar ou criar usuário a partir de informações OAuth
     *
     * @param string $provider Nome do provedor
     * @param array $userInfo Informações do usuário do provedor
     * @return XoopsUser|false
     */
    private function findOrCreateUser(string $provider, array $userInfo)
    {
        // Verificar se o usuário já está vinculado
        $result = $this->db->query(
            "SELECT uid FROM xoops_oauth_users
             WHERE provider = ? AND provider_id = ?",
            array($provider, $userInfo['id'])
        );

        if ($this->db->getRowCount($result) > 0) {
            $row = $this->db->fetchArray($result);
            return $this->userHandler->getUser($row['uid']);
        }

        // Tentar encontrar usuário por email
        if (isset($userInfo['email'])) {
            $user = $this->userHandler->getUserByEmail($userInfo['email']);
            if ($user) {
                // Vincular usuário existente a conta OAuth
                $this->linkOAuthAccount(
                    $user->getVar('uid'),
                    $provider,
                    $userInfo['id']
                );
                return $user;
            }
        }

        // Criar novo usuário
        $newUser = $this->createOAuthUser($provider, $userInfo);
        return $newUser;
    }

    /**
     * Criar novo usuário a partir de informações OAuth
     *
     * @param string $provider Nome do provedor
     * @param array $userInfo Informações do usuário
     * @return XoopsUser|false
     */
    private function createOAuthUser(string $provider, array $userInfo)
    {
        // Gerar nome de usuário único a partir de dados do provedor
        $baseUsername = preg_replace('/[^a-zA-Z0-9_-]/', '', $userInfo['name'] ?? '');
        $username = $baseUsername ?: 'oauth_' . substr($userInfo['id'], 0, 8);

        // Tornar único
        $counter = 1;
        $originalUsername = $username;
        while ($this->userHandler->getUserByName($username)) {
            $username = $originalUsername . $counter;
            $counter++;
        }

        // Criar usuário
        $user = $this->userHandler->create();
        $user->setVar('uname', $username);
        $user->setVar('email', $userInfo['email'] ?? '');
        $user->setVar('pass', password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT));
        $user->setVar('user_regdate', time());

        if (!$this->userHandler->insertUser($user)) {
            return false;
        }

        // Vincular conta OAuth
        $this->linkOAuthAccount(
            $user->getVar('uid'),
            $provider,
            $userInfo['id']
        );

        return $user;
    }

    /**
     * Vincular conta OAuth a usuário
     *
     * @param int $uid ID do Usuário
     * @param string $provider Nome do provedor
     * @param string $providerId ID do usuário do provedor
     */
    private function linkOAuthAccount(int $uid, string $provider, string $providerId): void
    {
        $this->db->query(
            "INSERT INTO xoops_oauth_users (uid, provider, provider_id)
             VALUES (?, ?, ?)",
            array($uid, $provider, $providerId)
        );
    }

    /**
     * Obter URL de callback OAuth
     *
     * @param string $provider Nome do provedor
     * @return string URL de callback
     */
    private function getCallbackUrl(string $provider): string
    {
        global $xoopsConfig;
        return $xoopsConfig['siteurl'] . '/user.php?op=oauth_callback&provider=' . $provider;
    }
}
```

## Boas Práticas de Segurança

### Lista de Verificação de Segurança de Autenticação

```php
<?php
/**
 * Boas práticas de segurança
 */

// 1. HTTPS obrigatório
if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
    die('HTTPS required for authentication');
}

// 2. Proteção CSRF
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

// 3. Limitação de taxa de tentativas de login
class RateLimiter {
    public static function checkLoginLimit($identifier) {
        $key = 'login_attempt_' . md5($identifier);
        $attempts = apcu_fetch($key) ?: 0;

        if ($attempts > 5) {
            throw new Exception('Too many login attempts');
        }

        apcu_store($key, $attempts + 1, 900); // janela de 15 minutos
    }
}

// 4. Requisitos de senha segura
$passwordValidation = PasswordManager::validateStrength($password);
if (!$passwordValidation['valid']) {
    throw new Exception(implode(', ', $passwordValidation['errors']));
}

// 5. Cookie de sessão seguro
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'');
```

## Links Relacionados

- User Management.md
- Group System.md
- Permission System.md
- ../../Security/Security-Guidelines.md

## Tags

#authentication #login #sessions #security #password-hashing #2fa #oauth #session-management
