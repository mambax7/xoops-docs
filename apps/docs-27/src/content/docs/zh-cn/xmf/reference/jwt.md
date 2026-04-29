---
title：“JWT - JSON Web 令牌”
description：“XMFJWT安全令牌实施-based身份验证和AJAX保护”
---

`XMF\Jwt`命名空间为XOOPS模区块提供JSON网络令牌(JWT)支持。 JWT 支持安全、无状态的身份验证，对于保护 AJAX 请求特别有用。

## 什么是 JSON 网络令牌？

JSON Web 令牌是一种将一组*声明*（数据）发布为文本字符串的标准方式，并通过加密验证声明未被篡改。详细规格请参见：

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### 主要特征

- **签名**：令牌经过加密签名以检测篡改
- **Self-contained**：所有必要的信息都在令牌本身中
- **无状态**：无需服务器-side会话存储
- **可过期**：令牌可以包含过期时间

> **注意：** JWT 已签名，未加密。数据经过 Base64 编码且可见。使用 JWT 进行完整性验证，而不是隐藏敏感数据。

## 为什么在 XOOPS 中使用 JWT？

### AJAX 代币问题

XOOPS 形式使用随机数令牌来实现 CSRF 保护。然而，随机数与 AJAX 配合使用效果不佳，因为：

1. **单次使用**：随机数通常对一次提交有效
2. **异步问题**：多个 AJAX 请求可能会无序到达
3. **刷新复杂性**：没有可靠的异步刷新令牌的方法
4. **上下文绑定**：标准令牌不验证哪个脚本发出它们

### JWT 优点

JWT 通过以下方式解决这些问题：

- 包括时间-limited有效性的到期时间（`exp`索赔）
- 支持自定义声明将令牌绑定到特定脚本
- 允许在有效期内多次请求
- 提供令牌来源的加密验证

## 核心课程

### JsonWebToken

`XMF\Jwt\JsonWebToken`类处理令牌创建和解码。

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

创建一个新的 JWT 处理程序。
- `$key`：`XMF\Key\KeyAbstract`对象
- `$algorithm`：签名算法（默认：'HS256'）

**`create($payload, $expirationOffset)`**

创建签名令牌字符串。
- `$payload`：一系列权利要求
- `$expirationOffset`：到期前的秒数（可选）

**`decode($jwtString, $assertClaims)`**

解码并验证令牌。
- `$jwtString`：要解码的令牌
- `$assertClaims`：要求验证（空数组表示无）
- 返回：stdClass 有效负载，如果无效则返回 false

**`setAlgorithm($algorithm)`**

更改signing/verification算法。

### TokenFactory

`XMF\Jwt\TokenFactory`提供了一种创建代币的便捷方法。

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

- `$key`：键名称字符串或 KeyAbstract 对象
- `$payload`：一系列权利要求
- `$expirationOffset`：过期时间（秒）

失败时抛出异常：`DomainException`、`InvalidArgumentException`、`UnexpectedValueException`

### TokenReader

`XMF\Jwt\TokenReader`类简化了从各种来源读取令牌的过程。

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

所有方法均将有效负载返回为 `stdClass` 或 `false`（如果无效）。

### 密钥工厂

`XMF\Jwt\KeyFactory` 创建和管理加密密钥。

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

密钥被持久存储。默认存储使用文件系统。

## AJAX 保护示例

这是一个完整的示例，演示了 JWT-protected AJAX。

### 页面脚本（生成令牌）

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

## 最佳实践

### 令牌过期

根据用例设置适当的过期时间：

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### 声明验证

始终验证 `aud`（受众）声明，以确保令牌与预期脚本一起使用：

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### 键命名

将描述性键名称用于不同目的：

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### 错误处理

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

## 令牌传输方法

### 授权标头（推荐）

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### 饼干

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### 请求参数

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## 安全考虑1. **使用HTTPS**：始终使用HTTPS来防止令牌拦截
2. **短过期**：使用最短的实际过期时间
3. **特定声明**：包括将令牌与特定上下文联系起来的声明
4. **服务器-Side验证**：始终验证令牌服务器-side
5. **不要存储敏感数据**：记住令牌是可读的（未加密）

## API 参考

### XMF\Jwt\JsonWebToken

|方法|描述 |
|--------|-------------|
| `__construct($key, $algorithm)` |创建JWT处理程序|
| `setAlgorithm($algorithm)` |设置签名算法 |
| `create($payload, $expiration)` |创建签名令牌 |
| `decode($token, $assertClaims)` |解码并验证令牌 |

### XMF\Jwt\TokenFactory

|方法|描述 |
|--------|-------------|
| `build($key, $payload, $expiration)` |创建令牌字符串 |

### XMF\Jwt\TokenReader

|方法|描述 |
|--------|-------------|
| `fromString($key, $token, $claims)` |从字符串解码 |
| `fromCookie($key, $name, $claims)` |从 cookie 解码 |
| `fromRequest($key, $name, $claims)` |从请求中解码 |
| `fromHeader($key, $claims, $header)` |从标头解码 |

### XMF\Jwt\KeyFactory

|方法|描述 |
|--------|-------------|
| `build($name, $storage)` |获取或创建密钥 |

## 另请参阅

- ../Basics/XMF-Request - 请求处理
- ../XMF-Framework - 框架概述
- 数据库 - 数据库实用程序

---

#xmf#jwt#安全#ajax#身份验证#tokens