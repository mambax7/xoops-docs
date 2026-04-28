---
title: "JWT - JSON Web 令牌"
description: "用於安全令牌型認證和 AJAX 保護的 XMF JWT 實作"
---

`Xmf\Jwt` 命名空間為 XOOPS 模組提供 JSON Web Token (JWT) 支援。JWT 啟用安全、無狀態身份驗證，特別適用於保護 AJAX 請求。

## 什麼是 JSON Web 令牌？

JSON Web 令牌是以文字字串形式發佈一組**宣告**（資料）的標準方式，具有密碼驗證以確保宣告未遭篡改。如需詳細規範，請參閱：

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### 主要特性

- **已簽署**：令牌已密碼簽署以偵測篡改
- **自封**：所有必要資訊都在令牌本身中
- **無狀態**：不需要伺服器端工作階段儲存
- **可過期**：令牌可以包括過期時間

> **註：** JWT 已簽署但未加密。資料已進行 Base64 編碼且可見。使用 JWT 進行完整性驗證，而不是隱藏敏感資料。

## 為什麼在 XOOPS 中使用 JWT？

### AJAX 令牌問題

XOOPS 表單使用 nonce 令牌進行 CSRF 保護。但是，nonce 與 AJAX 配合效果不佳，因為：

1. **一次性使用**：Nonce 通常僅對一份提交有效
2. **非同步問題**：多個 AJAX 要求可能不按順序到達
3. **重新整理複雜性**：沒有可靠的方式以非同步方式重新整理令牌
4. **內容繫結**：標準令牌不驗證哪個指令碼發出它們

### JWT 優勢

JWT 透過以下方式解決這些問題：

- 包括過期時間 (`exp` 宣告) 以設定時間限制的有效性
- 支援自訂宣告以將令牌繫結到特定指令碼
- 在有效期內啟用多個要求
- 提供令牌來源的密碼驗證

## 核心類別

### JsonWebToken

`Xmf\Jwt\JsonWebToken` 類別處理令牌建立和解碼。

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Create a key
$key = KeyFactory::build('my_application_key');

// Create a JsonWebToken instance
$jwt = new JsonWebToken($key, 'HS256');

// Create a token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expires in 300 seconds

// Decode and verify a token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### 方法

**`new JsonWebToken($key, $algorithm)`**

建立新的 JWT 處理程式。
- `$key`: `Xmf\Key\KeyAbstract` 物件
- `$algorithm`: 簽署演算法 (預設值: 'HS256')

**`create($payload, $expirationOffset)`**

建立簽署的令牌字串。
- `$payload`: 宣告陣列
- `$expirationOffset`: 距過期的秒數 (選擇性)

**`decode($jwtString, $assertClaims)`**

解碼和驗證令牌。
- `$jwtString`: 要解碼的令牌
- `$assertClaims`: 要驗證的宣告 (無則為空陣列)
- 傳回: stdClass 有效負載或無效時為 false

**`setAlgorithm($algorithm)`**

變更簽署/驗證演算法。

### TokenFactory

`Xmf\Jwt\TokenFactory` 提供建立令牌的便利方式。

```php
use Xmf\Jwt\TokenFactory;

// Create a token with automatic key handling
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expires in 120 seconds
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: 金鑰名稱字串或 KeyAbstract 物件
- `$payload`: 宣告陣列
- `$expirationOffset`: 過期的秒數

失敗時拋出異常: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

`Xmf\Jwt\TokenReader` 類別簡化了從各種來源讀取令牌。

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// From a string
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// From a cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// From a request parameter
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// From Authorization header (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

所有方法都傳回無效時的有效負載作為 `stdClass` 或 `false`。

### KeyFactory

`Xmf\Jwt\KeyFactory` 建立和管理密碼金鑰。

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

金鑰會持續儲存。預設儲存使用檔案系統。

## AJAX 保護範例

以下是演示 JWT 保護的 AJAX 的完整範例。

### 頁面指令碼 (產生令牌)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims to include and verify
$assertClaims = ['aud' => basename(__FILE__)];

// Check if this is an AJAX request
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Handle AJAX request
    $GLOBALS['xoopsLogger']->activated = false;

    // Verify the token from the Authorization header
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token is valid - process the request
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Your AJAX logic here
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Regular page request - generate token and display page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Create token with claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valid for 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript for AJAX calls
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Update UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## 最佳實踐

### 令牌過期

根據用例設定適當的過期時間：

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### 宣告驗證

始終驗證 `aud` (對象) 宣告以確保令牌與預定的指令碼一起使用：

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### 金鑰命名

為不同的目的使用描述性金鑰名稱：

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### 錯誤處理

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Invalid algorithm
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Invalid argument
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Unexpected value
    error_log('JWT Error: ' . $e->getMessage());
}

// Reading tokens returns false on failure (no exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token invalid, expired, or tampered
}
```

## 令牌傳輸方法

### 授權標頭 (建議)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Cookie

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### 請求參數

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## 安全考量

1. **使用 HTTPS**：始終使用 HTTPS 來防止令牌攔截
2. **短期過期**：使用最短的實用過期時間
3. **具體宣告**：包括將令牌繫結到特定情境的宣告
4. **伺服器端驗證**：始終在伺服器端驗證令牌
5. **不儲存敏感資料**：記住令牌是可讀的 (未加密)

## API 參考資料

### Xmf\Jwt\JsonWebToken

| 方法 | 說明 |
|--------|-------------|
| `__construct($key, $algorithm)` | 建立 JWT 處理程式 |
| `setAlgorithm($algorithm)` | 設定簽署演算法 |
| `create($payload, $expiration)` | 建立簽署令牌 |
| `decode($token, $assertClaims)` | 解碼和驗證令牌 |

### Xmf\Jwt\TokenFactory

| 方法 | 說明 |
|--------|-------------|
| `build($key, $payload, $expiration)` | 建立令牌字串 |

### Xmf\Jwt\TokenReader

| 方法 | 說明 |
|--------|-------------|
| `fromString($key, $token, $claims)` | 從字串解碼 |
| `fromCookie($key, $name, $claims)` | 從 cookie 解碼 |
| `fromRequest($key, $name, $claims)` | 從要求解碼 |
| `fromHeader($key, $claims, $header)` | 從標頭解碼 |

### Xmf\Jwt\KeyFactory

| 方法 | 說明 |
|--------|-------------|
| `build($name, $storage)` | 取得或建立金鑰 |

## 相關資訊

- ../Basics/XMF-Request - 請求處理
- ../XMF-Framework - 框架概述
- Database - 資料庫公用程式

---

#xmf #jwt #security #ajax #authentication #tokens
