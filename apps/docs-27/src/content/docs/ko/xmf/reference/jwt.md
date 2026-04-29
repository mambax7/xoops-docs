---
title: "JWT - JSON 웹 토큰"
description: "보안 토큰 기반 인증 및 AJAX 보호를 위한 XMF JWT 구현"
---

`Xmf\Jwt` 네임스페이스는 XOOPS 모듈에 대한 JWT(JSON 웹 토큰) 지원을 제공합니다. JWT는 안전한 상태 비저장 인증을 지원하며 특히 AJAX 요청을 보호하는 데 유용합니다.

## JSON 웹 토큰이란 무엇입니까?

JSON 웹 토큰은 *클레임*(데이터) 집합을 텍스트 문자열로 게시하는 표준 방법으로, 해당 클레임이 변조되지 않았음을 암호화하여 확인합니다. 자세한 사양은 다음을 참조하세요.

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### 주요 특징

- **서명됨**: 토큰은 변조를 감지하기 위해 암호화 방식으로 서명됩니다.
- **자체 포함**: 필요한 모든 정보가 토큰 자체에 있습니다.
- **상태 비저장**: 서버측 세션 저장소가 필요하지 않습니다.
- **만료 가능**: 토큰에는 만료 시간이 포함될 수 있습니다.

> **참고:** JWT는 암호화되지 않고 서명됩니다. 데이터는 Base64로 인코딩되어 표시됩니다. 민감한 데이터를 숨기는 것이 아니라 무결성 확인을 위해 JWT를 사용하세요.

## XOOPS에서 JWT를 사용하는 이유는 무엇입니까?

### AJAX 토큰 문제

XOOPS 양식은 CSRF 보호를 위해 nonce 토큰을 사용합니다. 그러나 Nonce는 다음과 같은 이유로 AJAX에서 제대로 작동하지 않습니다.

1. **단일 사용**: Nonce는 일반적으로 한 번의 제출에 유효합니다.
2. **비동기 문제**: 여러 AJAX 요청이 순서 없이 도착할 수 있음
3. **새로 고침 복잡성**: 비동기식으로 토큰을 새로 고치는 안정적인 방법이 없습니다.
4. **컨텍스트 바인딩**: 표준 토큰은 어떤 스크립트가 이를 발행했는지 확인하지 않습니다.

### JWT의 장점

JWT는 다음을 통해 이러한 문제를 해결합니다.

- 시간 제한 유효성에 만료 시간(`exp` 청구) 포함
- 토큰을 특정 스크립트에 바인딩하는 사용자 지정 클레임 지원
- 유효기간 내 복수 요청 가능
- 토큰 출처에 대한 암호화 검증 제공

## 핵심 클래스

### JsonWebToken

`Xmf\Jwt\JsonWebToken` 클래스는 토큰 생성 및 디코딩을 처리합니다.

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

#### 방법

**`new JsonWebToken($key, $algorithm)`**

새 JWT 핸들러를 만듭니다.
- `$key`: `Xmf\Key\KeyAbstract` 객체
- `$algorithm`: 서명 알고리즘 (기본값: 'HS256')

**`create($payload, $expirationOffset)`**

서명된 토큰 문자열을 생성합니다.
- `$payload`: 클레임 배열
- `$expirationOffset`: 만료까지의 시간(초)(선택)

**`decode($jwtString, $assertClaims)`**

토큰을 디코딩하고 유효성을 검사합니다.
- `$jwtString`: 디코딩할 토큰
- `$assertClaims`: 확인할 클레임(없음인 경우 빈 배열)
- 반환: stdClass 페이로드 또는 유효하지 않은 경우 false

**`setAlgorithm($algorithm)`**

서명/검증 알고리즘을 변경합니다.

### 토큰팩토리

`Xmf\Jwt\TokenFactory`은 토큰을 생성하는 편리한 방법을 제공합니다.

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

- `$key`: 키 이름 문자열 또는 KeyAbstract 객체
- `$payload`: 클레임 배열
- `$expirationOffset`: 초 단위로 만료됩니다.

실패 시 예외 발생: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### 토큰리더

`Xmf\Jwt\TokenReader` 클래스는 다양한 소스에서 토큰 읽기를 단순화합니다.

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

모든 메소드는 유효하지 않은 경우 `stdClass` 또는 `false`으로 페이로드를 반환합니다.

### 키팩토리

`Xmf\Jwt\KeyFactory`은 암호화 키를 생성하고 관리합니다.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

키는 지속적으로 저장됩니다. 기본 저장소는 파일 시스템을 사용합니다.

## AJAX 보호 예

다음은 JWT로 보호되는 AJAX를 보여주는 완전한 예입니다.

### 페이지 스크립트(토큰 생성)

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

## 모범 사례

### 토큰 만료

사용 사례에 따라 적절한 만료 시간을 설정합니다.

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### 소유권 주장 확인

토큰이 의도한 스크립트와 함께 사용되는지 확인하려면 항상 `aud`(대상) 클레임을 확인하세요.

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### 키 이름 지정

다양한 목적으로 설명이 포함된 키 이름을 사용하세요.

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### 오류 처리

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

## 토큰 전송 방법

### 인증 헤더(권장)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### 쿠키

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### 요청 매개변수

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## 보안 고려 사항

1. **HTTPS 사용**: 토큰 가로채기를 방지하려면 항상 HTTPS를 사용하세요.
2. **짧은 만료 기간**: 실제 가장 짧은 만료 시간을 사용합니다.
3. **특정 클레임**: 토큰을 특정 컨텍스트에 연결하는 클레임을 포함합니다.
4. **서버 측 유효성 검사**: 항상 서버 측에서 토큰의 유효성을 검사합니다.
5. **민감한 데이터를 저장하지 마세요**: 토큰은 읽을 수 있다는 점을 기억하세요(암호화되지 않음)

## API 참조

### Xmf\Jwt\JsonWebToken

| 방법 | 설명 |
|--------|-------------|
| `__construct($key, $algorithm)` | JWT 핸들러 생성 |
| `setAlgorithm($algorithm)` | 서명 알고리즘 설정 |
| `create($payload, $expiration)` | 서명된 토큰 생성 |
| `decode($token, $assertClaims)` | 토큰 디코딩 및 확인 |

### Xmf\Jwt\TokenFactory

| 방법 | 설명 |
|--------|-------------|
| `build($key, $payload, $expiration)` | 토큰 문자열 생성 |

### Xmf\Jwt\TokenReader

| 방법 | 설명 |
|--------|-------------|
| `fromString($key, $token, $claims)` | 문자열에서 디코딩 |
| `fromCookie($key, $name, $claims)` | 쿠키에서 디코딩 |
| `fromRequest($key, $name, $claims)` | 요청에서 디코딩 |
| `fromHeader($key, $claims, $header)` | 헤더에서 디코딩 |

### Xmf\Jwt\KeyFactory

| 방법 | 설명 |
|--------|-------------|
| `build($name, $storage)` | 키 가져오기 또는 만들기 |

## 참고 항목

-../Basics/XMF-Request - 요청 처리
-../XMF-Framework - 프레임워크 개요
- 데이터베이스 - 데이터베이스 유틸리티

---

#xmf #jwt #보안 #ajax #인증 #토큰
