---
title: "身份驗證"
description: "XOOPS身份驗證系統的完整指南，包括登入流程、會話管理、安全性和進階功能"
---

# XOOPS中的身份驗證

XOOPS身份驗證系統提供安全的用戶驗證、會話管理和進階安全功能，包括雙因素身份驗證和OAuth整合。本文件涵蓋身份驗證流程、實施和最佳實踐。

## 身份驗證流程

### 登入序列圖

```mermaid
sequenceDiagram
    participant User as User Browser
    participant Server as XOOPS Server
    participant DB as Database
    participant Session as Session Manager
    participant Cache as Cache/APCu

    User->>Server: POST /user.php?op=login
    note over User, Server: username/email + password

    Server->>Server: Validate Input
    note over Server: Check format, CSRF token

    alt Invalid Format
        Server-->>User: 400 Bad Request
    else Valid Format
        Server->>Cache: Check Account Lockout
        Cache-->>Server: Lockout Status?

        alt Account Locked
            Server-->>User: Account Temporarily Locked
        else Not Locked
            Server->>DB: Query User by Username/Email
            DB-->>Server: User Record

            alt User Not Found
                Server->>Cache: Increment Failed Attempts
                Server-->>User: Invalid Credentials
            else User Found
                Server->>Server: Verify Password Hash
                note over Server: password_verify()

                alt Password Incorrect
                    Server->>Cache: Increment Failed Attempts
                    Server-->>User: Invalid Credentials
                else Password Correct
                    Server->>Server: Check Account Status
                    alt Account Inactive
                        Server-->>User: Account Inactive
                    else Account Active
                        Server->>Cache: Clear Failed Attempts
                        Server->>Session: Create Session
                        note over Session: Generate token,<br/>store in DB

                        Server->>DB: Update Last Login
                        DB-->>Server: Updated

                        alt Remember Me Checked
                            Server->>Server: Generate Persistent Token
                            Server->>User: Set Persistent Cookie
                        else Remember Me Unchecked
                            Server->>User: Set Session Cookie
                        end

                        Server-->>User: 302 Redirect to Dashboard
                    end
                end
            end
        end
    end
```

### 登入流程詳細說明

```mermaid
graph TD
    A["User Submits Login Form"] --> B["CSRF Token Validation"]
    B --> C{"Token Valid?"}
    C -->|No| D["Reject Request"]
    C -->|Yes| E["Validate Input Format"]
    E --> F{"Format Valid?"}
    F -->|No| G["Show Validation Errors"]
    F -->|Yes| H["Check Lockout Status"]
    H --> I{"Account Locked?"}
    I -->|Yes| J["Show Lockout Message"]
    I -->|No| K["Query User Database"]
    K --> L{"User Exists?"}
    L -->|No| M["Record Attempt<br/>Show Error"]
    L -->|Yes| N["Verify Password Hash"]
    N --> O{"Match?"}
    O -->|No| M
    O -->|Yes| P["Check Account Status"]
    P --> Q{"Active?"}
    Q -->|No| R["Show Status Error"]
    Q -->|Yes| S["Clear Failed Attempts"]
    S --> T["Create Session"]
    T --> U["Update Last Login"]
    U --> V{"Remember Me?"}
    V -->|Yes| W["Create Persistent Token<br/>Set Long-lived Cookie"]
    V -->|No| X["Set Session Cookie"]
    W --> Y["Redirect to Dashboard"]
    X --> Y
```

## 會話管理

### 會話配置

```php
<?php
/**
 * XOOPS會話配置
 * 通常在/include/session.php中
 */

// 用於安全的會話cookie參數
session_set_cookie_params([
    'lifetime' => 0,           // 會話cookie(瀏覽器關閉時刪除)
    'path' => '/',             // Cookie路徑
    'domain' => '',            // Cookie域(空=當前域)
    'secure' => true,          // 僅HTTPS
    'httponly' => true,        // JavaScript無法訪問
    'samesite' => 'Strict'     // CSRF保護
]);

// 設定會話配置
ini_set('session.name', 'XOOPSPHPSESSID');
ini_set('session.use_strict_mode', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.gc_maxlifetime', 28800);  // 8小時

// 啟動會話
session_start();

// 驗證會話固定保護
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id();
    $_SESSION['initiated'] = true;
}
```

### 會話處理器實施

```php
<?php
/**
 * XOOPS會話處理器
 */
class XoopsSessionHandler
{
    private $sessionTimeout = 28800; // 8小時
    private $sessionTokenLength = 32;
    private $db;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
    }

    /**
     * 建立新會話
     *
     * @param XoopsUser $user 用戶物件
     * @param bool $rememberMe 持久登入標誌
     * @return bool 成功狀態
     */
    public function createSession(XoopsUser $user, bool $rememberMe = false): bool
    {
        try {
            // 產生安全令牌
            $token = bin2hex(random_bytes($this->sessionTokenLength));

            // 儲存在會話中
            $_SESSION['xoopsUserId'] = $user->getVar('uid');
            $_SESSION['xoopsUserName'] = $user->getVar('uname');
            $_SESSION['xoopsSessionToken'] = $token;
            $_SESSION['xoopsSessionCreated'] = time();
            $_SESSION['xoopsSessionIP'] = $this->getClientIP();
            $_SESSION['xoopsSessionUA'] = $_SERVER['HTTP_USER_AGENT'] ?? '';

            // 在資料庫中儲存令牌
            $this->storeSessionToken(
                $user->getVar('uid'),
                $token,
                $this->sessionTimeout
            );

            // 處理持久登入
            if ($rememberMe) {
                $this->createPersistentLogin($user->getVar('uid'));
            }

            return true;
        } catch (Exception $e) {
            error_log('會話建立失敗: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * 驗證當前會話
     *
     * @return bool 會話有效
     */
    public function validateSession(): bool
    {
        // 檢查會話變量存在
        if (!isset($_SESSION['xoopsUserId'], $_SESSION['xoopsSessionToken'])) {
            return false;
        }

        // 驗證會話超時
        $created = $_SESSION['xoopsSessionCreated'] ?? 0;
        if (time() - $created > $this->sessionTimeout) {
            $this->destroySession();
            return false;
        }

        // 驗證IP地址一致性
        if ($this->getClientIP() !== ($_SESSION['xoopsSessionIP'] ?? '')) {
            error_log('會話IP不匹配 - 可能的會話劫持');
            $this->destroySession();
            return false;
        }

        // 驗證用戶代理一致性
        $currentUA = $_SERVER['HTTP_USER_AGENT'] ?? '';
        if ($currentUA !== ($_SESSION['xoopsSessionUA'] ?? '')) {
            error_log('會話UA不匹配 - 可能的會話劫持');
            $this->destroySession();
            return false;
        }

        // 驗證資料庫中的令牌
        if (!$this->verifySessionToken(
            $_SESSION['xoopsUserId'],
            $_SESSION['xoopsSessionToken']
        )) {
            return false;
        }

        return true;
    }

    /**
     * 銷毀會話
     */
    public function destroySession(): void
    {
        if (isset($_SESSION['xoopsUserId'])) {
            $this->deleteSessionToken(
                $_SESSION['xoopsUserId'],
                $_SESSION['xoopsSessionToken'] ?? ''
            );
        }

        // 清除會話數據
        $_SESSION = [];

        // 刪除會話cookie
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
     * 在資料庫中儲存會話令牌
     *
     * @param int $uid 用戶ID
     * @param string $token 會話令牌
     * @param int $lifetime 令牌生命週期(秒)
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
     * 驗證會話令牌
     *
     * @param int $uid 用戶ID
     * @param string $token 會話令牌
     * @return bool 有效令牌
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
     * 刪除會話令牌
     *
     * @param int $uid 用戶ID
     * @param string $token 會話令牌(可選)
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
            // 刪除用戶的所有會話
            $this->db->query(
                "DELETE FROM xoops_sessions WHERE uid = ?",
                array($uid)
            );
        }
    }

    /**
     * 取得用戶端IP地址
     *
     * @return string IP地址
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

## 記住我功能

### 持久登入實施

```php
<?php
/**
 * 記住我(持久登入)處理器
 */
class PersistentLoginHandler
{
    private $cookieName = 'xoops_persistent_login';
    private $cookieLifetime = 1209600; // 14天
    private $db;

    public function __construct()
    {
        $this->db = XoopsDatabaseFactory::getDatabaseConnection();
    }

    /**
     * 建立持久登入令牌
     *
     * @param int $uid 用戶ID
     * @return string Cookie令牌
     */
    public function createPersistentToken(int $uid): string
    {
        // 產生隨機令牌
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);

        // 在資料庫中儲存
        $expiresAt = time() + $this->cookieLifetime;

        $this->db->query(
            "INSERT INTO xoops_persistent_tokens (uid, token_hash, expires_at)
             VALUES (?, ?, ?)",
            array($uid, $tokenHash, $expiresAt)
        );

        // 設定cookie
        setcookie(
            $this->cookieName,
            $token,
            time() + $this->cookieLifetime,
            '/',
            '',
            true,  // 僅HTTPS
            true   // HttpOnly
        );

        return $token;
    }

    /**
     * 驗證持久登入cookie
     *
     * @return XoopsUser|false 經過驗證的用戶或false
     */
    public function validatePersistentToken()
    {
        if (!isset($_COOKIE[$this->cookieName])) {
            return false;
        }

        $token = $_COOKIE[$this->cookieName];
        $tokenHash = hash('sha256', $token);

        // 查詢資料庫
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

        // 取得用戶
        $userHandler = xoops_getHandler('user');
        $user = $userHandler->getUser($uid);

        if (!$user) {
            return false;
        }

        // 重新整理令牌(滑動視窗)
        $this->refreshPersistentToken($uid, $token);

        return $user;
    }

    /**
     * 重新整理持久令牌(滑動視窗)
     *
     * @param int $uid 用戶ID
     * @param string $oldToken 舊令牌
     */
    private function refreshPersistentToken(int $uid, string $oldToken): void
    {
        // 刪除舊令牌
        $oldTokenHash = hash('sha256', $oldToken);
        $this->db->query(
            "DELETE FROM xoops_persistent_tokens WHERE token_hash = ?",
            array($oldTokenHash)
        );

        // 建立新令牌
        $this->createPersistentToken($uid);
    }

    /**
     * 清除持久登入
     *
     * @param int $uid 用戶ID
     */
    public function clearPersistentLogin(int $uid): void
    {
        // 刪除用戶的所有令牌
        $this->db->query(
            "DELETE FROM xoops_persistent_tokens WHERE uid = ?",
            array($uid)
        );

        // 刪除cookie
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

## 密碼雜湊

### 安全密碼處理

```php
<?php
/**
 * 密碼雜湊和驗證
 */
class PasswordManager
{
    /**
     * 使用bcrypt雜湊密碼
     *
     * @param string $password 純文字密碼
     * @return string 雜湊密碼
     */
    public static function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * 驗證密碼與雜湊
     *
     * @param string $password 純文字密碼
     * @param string $hash 密碼雜湊
     * @return bool 匹配狀態
     */
    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * 檢查密碼是否需要重新雜湊(提供更強的算法)
     *
     * @param string $hash 密碼雜湊
     * @return bool 需要重新雜湊
     */
    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * 驗證密碼強度
     *
     * @param string $password 要驗證的密碼
     * @return array 驗證結果
     */
    public static function validateStrength(string $password): array
    {
        $errors = [];

        // 最小長度
        if (strlen($password) < 8) {
            $errors[] = '密碼至少要8個字符';
        }

        // 要求大寫
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = '密碼必須包含大寫字母';
        }

        // 要求小寫
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = '密碼必須包含小寫字母';
        }

        // 要求數字
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = '密碼必須包含數字';
        }

        // 要求特殊字符
        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            $errors[] = '密碼必須包含特殊字符';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * 產生隨機密碼
     *
     * @param int $length 密碼長度
     * @return string 隨機密碼
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

## 雙因素身份驗證

### 2FA實施概述

```php
<?php
/**
 * 雙因素身份驗證處理器
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
     * 為用戶啟用2FA
     *
     * @param int $uid 用戶ID
     * @return array 設定資料(包含祕密和QR碼)
     */
    public function enable2FA(int $uid): array
    {
        // 產生祕密
        $secret = $this->generateSecret();

        // 產生QR碼
        $qrCode = $this->generateQRCode($uid, $secret);

        // 暫時儲存祕密(尚未確認)
        $this->storeTempSecret($uid, $secret);

        return [
            'secret' => $secret,
            'qrCode' => $qrCode
        ];
    }

    /**
     * 使用TOTP代碼確認2FA設定
     *
     * @param int $uid 用戶ID
     * @param string $code TOTP代碼
     * @return bool 確認成功
     */
    public function confirm2FA(int $uid, string $code): bool
    {
        // 取得暫時祕密
        $tempSecret = $this->getTempSecret($uid);
        if (!$tempSecret) {
            return false;
        }

        // 驗證TOTP代碼
        if (!$this->verifyTOTP($code, $tempSecret)) {
            return false;
        }

        // 啟用2FA
        $this->db->query(
            "UPDATE xoops_user_2fa SET status = 'active' WHERE uid = ?",
            array($uid)
        );

        return true;
    }

    /**
     * 在登入期間驗證TOTP代碼
     *
     * @param int $uid 用戶ID
     * @param string $code TOTP代碼
     * @return bool 有效代碼
     */
    public function verifyTOTP(int $uid, string $code): bool
    {
        // 取得活動祕密
        $result = $this->db->query(
            "SELECT secret FROM xoops_user_2fa WHERE uid = ? AND status = 'active'",
            array($uid)
        );

        if ($this->db->getRowCount($result) === 0) {
            return false;
        }

        $row = $this->db->fetchArray($result);
        $secret = $row['secret'];

        // 驗證TOTP
        return $this->verifyTOTPCode($code, $secret);
    }

    /**
     * 驗證TOTP代碼與祕密
     *
     * @param string $code TOTP代碼
     * @param string $secret 共享祕密
     * @return bool 有效
     */
    private function verifyTOTPCode(string $code, string $secret): bool
    {
        // 允許時間偏差(目前、-1、+1)
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
     * 產生TOTP代碼
     *
     * @param string $secret 共享祕密
     * @param int $timestamp Unix時間戳
     * @return string TOTP代碼
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
     * 為2FA產生隨機祕密
     *
     * @return string Base32編碼的祕密
     */
    private function generateSecret(): string
    {
        $bytes = random_bytes(20);
        return $this->base32Encode($bytes);
    }

    /**
     * Base32編碼
     *
     * @param string $data 要編碼的資料
     * @return string Base32編碼的字符串
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
     * Base32解碼
     *
     * @param string $encoded Base32編碼的字符串
     * @return string 解碼的二進制資料
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
     * 為2FA設定產生QR碼
     *
     * @param int $uid 用戶ID
     * @param string $secret TOTP祕密
     * @return string QR碼資料URL
     */
    private function generateQRCode(int $uid, string $secret): string
    {
        global $xoopsConfig;

        $user = xoops_getHandler('user')->getUser($uid);
        $label = $user->getVar('uname') . '@' . $_SERVER['HTTP_HOST'];
        $otpauthUrl = "otpauth://totp/" . urlencode($label) .
                      "?secret=" . urlencode($secret) .
                      "&issuer=" . urlencode($xoopsConfig['sitename']);

        // 使用外部函式庫產生QR碼
        // 此範例使用佔位符 - 使用實際QR碼函式庫
        return "data:image/svg+xml,%3Csvg%3E...%3C/svg%3E";
    }
}
```

## OAuth整合

### OAuth2登入流程

```php
<?php
/**
 * OAuth2整合
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
     * 取得OAuth授權URL
     *
     * @param string $provider OAuth供應商
     * @return string 授權URL
     */
    public function getAuthorizationUrl(string $provider): string
    {
        if (!isset($this->providers[$provider])) {
            throw new Exception('未知的供應商: ' . $provider);
        }

        $config = $this->providers[$provider];
        $state = bin2hex(random_bytes(16));

        // 儲存狀態以供驗證
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
     * 處理OAuth回調
     *
     * @param string $provider OAuth供應商
     * @param string $code 授權代碼
     * @return XoopsUser|false 經過驗證的用戶或false
     */
    public function handleCallback(string $provider, string $code)
    {
        // 驗證狀態
        if ($_SESSION['oauth_state'] !== ($_GET['state'] ?? '')) {
            throw new Exception('無效的狀態參數');
        }

        if (!isset($this->providers[$provider])) {
            throw new Exception('未知的供應商: ' . $provider);
        }

        $config = $this->providers[$provider];

        // 用授權代碼交換令牌
        $token = $this->exchangeCodeForToken(
            $provider,
            $code,
            $config
        );

        if (!$token) {
            return false;
        }

        // 取得用戶訊息
        $userInfo = $this->getUserInfo(
            $provider,
            $token,
            $config
        );

        if (!$userInfo) {
            return false;
        }

        // 尋找或建立用戶
        return $this->findOrCreateUser($provider, $userInfo);
    }

    /**
     * 用授權代碼交換存取令牌
     *
     * @param string $provider 供應商名稱
     * @param string $code 授權代碼
     * @param array $config 供應商配置
     * @return array|false 令牌資料
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
     * 從供應商取得用戶訊息
     *
     * @param string $provider 供應商名稱
     * @param array $token 存取令牌
     * @param array $config 供應商配置
     * @return array|false 用戶訊息
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
     * 從OAuth訊息尋找或建立用戶
     *
     * @param string $provider 供應商名稱
     * @param array $userInfo 來自供應商的用戶訊息
     * @return XoopsUser|false
     */
    private function findOrCreateUser(string $provider, array $userInfo)
    {
        // 檢查用戶是否已連結
        $result = $this->db->query(
            "SELECT uid FROM xoops_oauth_users
             WHERE provider = ? AND provider_id = ?",
            array($provider, $userInfo['id'])
        );

        if ($this->db->getRowCount($result) > 0) {
            $row = $this->db->fetchArray($result);
            return $this->userHandler->getUser($row['uid']);
        }

        // 嘗試按電子郵件尋找用戶
        if (isset($userInfo['email'])) {
            $user = $this->userHandler->getUserByEmail($userInfo['email']);
            if ($user) {
                // 將現有用戶連結到OAuth帳戶
                $this->linkOAuthAccount(
                    $user->getVar('uid'),
                    $provider,
                    $userInfo['id']
                );
                return $user;
            }
        }

        // 建立新用戶
        $newUser = $this->createOAuthUser($provider, $userInfo);
        return $newUser;
    }

    /**
     * 從OAuth訊息建立新用戶
     *
     * @param string $provider 供應商名稱
     * @param array $userInfo 用戶訊息
     * @return XoopsUser|false
     */
    private function createOAuthUser(string $provider, array $userInfo)
    {
        // 從供應商資料產生唯一用戶名
        $baseUsername = preg_replace('/[^a-zA-Z0-9_-]/', '', $userInfo['name'] ?? '');
        $username = $baseUsername ?: 'oauth_' . substr($userInfo['id'], 0, 8);

        // 使其唯一
        $counter = 1;
        $originalUsername = $username;
        while ($this->userHandler->getUserByName($username)) {
            $username = $originalUsername . $counter;
            $counter++;
        }

        // 建立用戶
        $user = $this->userHandler->create();
        $user->setVar('uname', $username);
        $user->setVar('email', $userInfo['email'] ?? '');
        $user->setVar('pass', password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT));
        $user->setVar('user_regdate', time());

        if (!$this->userHandler->insertUser($user)) {
            return false;
        }

        // 連結OAuth帳戶
        $this->linkOAuthAccount(
            $user->getVar('uid'),
            $provider,
            $userInfo['id']
        );

        return $user;
    }

    /**
     * 將OAuth帳戶連結到用戶
     *
     * @param int $uid 用戶ID
     * @param string $provider 供應商名稱
     * @param string $providerId 供應商用戶ID
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
     * 取得OAuth回調URL
     *
     * @param string $provider 供應商名稱
     * @return string 回調URL
     */
    private function getCallbackUrl(string $provider): string
    {
        global $xoopsConfig;
        return $xoopsConfig['siteurl'] . '/user.php?op=oauth_callback&provider=' . $provider;
    }
}
```

## 安全最佳實踐

### 身份驗證安全檢查清單

```php
<?php
/**
 * 安全最佳實踐
 */

// 1. HTTPS強制實施
if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
    die('身份驗證需要HTTPS');
}

// 2. CSRF保護
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

// 3. 對登入嘗試進行速率限制
class RateLimiter {
    public static function checkLoginLimit($identifier) {
        $key = 'login_attempt_' . md5($identifier);
        $attempts = apcu_fetch($key) ?: 0;

        if ($attempts > 5) {
            throw new Exception('登入嘗試過多');
        }

        apcu_store($key, $attempts + 1, 900); // 15分鐘視窗
    }
}

// 4. 安全密碼要求
$passwordValidation = PasswordManager::validateStrength($password);
if (!$passwordValidation['valid']) {
    throw new Exception(implode(', ', $passwordValidation['errors']));
}

// 5. 安全會話cookie
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Security-Policy: default-src \'self\'');
```

## 相關連結

- User Management.md
- Group System.md
- Permission System.md
- ../../Security/Security-Guidelines.md

## 標籤

#authentication #login #sessions #security #password-hashing #2fa #oauth #session-management
