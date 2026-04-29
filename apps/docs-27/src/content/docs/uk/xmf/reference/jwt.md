---
title: "JWT - JSON Веб-токени"
description: "Реалізація XMF JWT для безпечної автентифікації на основі токенів і захисту AJAX"
---
Простір імен `XMF\Jwt` забезпечує підтримку JSON Web Token (JWT) для модулів XOOPS. JWT забезпечують безпечну автентифікацію без збереження стану та особливо корисні для захисту запитів AJAX.

## Що таке JSON веб-токени?

JSON Веб-токени — це стандартний спосіб публікації набору *претензій* (даних) у вигляді текстового рядка з криптографічною перевіркою того, що претензії не були підроблені. Докладні характеристики див.

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Ключові характеристики

- **Підписаний**: токени мають криптографічний підпис для виявлення підробки
- **Self-contained**: уся необхідна інформація міститься в самому токені
- **Stateless**: не потрібне зберігання сеансів на стороні сервера
- **Термін дії**: токени можуть містити час закінчення терміну дії

> **Примітка:** JWT підписані, а не зашифровані. Дані закодовані Base64 і видимі. Використовуйте JWT для перевірки цілісності, а не для приховування конфіденційних даних.

## Навіщо використовувати JWT у XOOPS?

### Проблема маркерів AJAX

Форми XOOPS використовують nonce маркери для захисту CSRF. Однак одноразові номери погано працюють із AJAX через:

1. **Одноразове використання**: одноразові номери зазвичай дійсні для одного подання
2. **Асинхронні проблеми**: кілька запитів AJAX можуть надійти не по порядку
3. **Складність оновлення**: немає надійного способу асинхронного оновлення токенів
4. **Прив’язка контексту**: стандартні маркери не перевіряють, який сценарій їх видав### JWT Переваги

JWT вирішують ці проблеми:

- Включаючи термін дії (претензія `exp`) для терміну дії з обмеженим часом
- Підтримка користувальницьких претензій для прив'язки маркерів до певних сценаріїв
- Включення кількох запитів протягом терміну дії
- Забезпечення криптографічної перевірки походження токена

## Основні класи

### JsonWebToken

Клас `XMF\Jwt\JsonWebToken` керує створенням і декодуванням маркерів.
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
#### Методи

**`new JsonWebToken($key, $algorithm)`**

Створює новий обробник JWT.
- `$key`: об’єкт `XMF\Key\KeyAbstract`
- `$algorithm`: Алгоритм підпису (за замовчуванням: 'HS256')

**`create($payload, $expirationOffset)`**

Створює підписаний рядок маркера.
- `$payload`: Масив претензій
- `$expirationOffset`: Секунди до закінчення терміну дії (необов’язково)

**`decode($jwtString, $assertClaims)`**

Декодує та перевіряє маркер.
- `$jwtString`: маркер для декодування
- `$assertClaims`: претензії для перевірки (порожній масив для відсутності)
- Повертає: stdClass payload або false, якщо недійсний

**`setAlgorithm($algorithm)`**

Змінює алгоритм signing/verification.

### TokenFactory

`XMF\Jwt\TokenFactory` забезпечує зручний спосіб створення токенів.
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

- `$key`: рядок імені ключа або об’єкт KeyAbstract
- `$payload`: Масив претензій
- `$expirationOffset`: термін дії в секундах

Створює винятки у разі помилки: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

Клас `XMF\Jwt\TokenReader` спрощує читання токенів із різних джерел.
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
Усі методи повертають корисне навантаження як `stdClass` або `false`, якщо недійсні.

### KeyFactory

`XMF\Jwt\KeyFactory` створює та керує криптографічними ключами.
```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
Ключі зберігаються постійно. Сховище за замовчуванням використовує файлову систему.

## AJAX Приклад захисту

Ось повний приклад, що демонструє JWT-захищений AJAX.

### Сценарій сторінки (генерує маркер)
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
## Найкращі практики

### Термін дії токена

Встановіть відповідний термін придатності залежно від використання:
```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```
### Підтвердження претензії

Завжди перевіряйте твердження `aud` (аудиторія), щоб переконатися, що маркери використовуються з призначеним сценарієм:
```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```
### Назви ключів

Використовуйте описові назви ключів для різних цілей:
```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```
### Обробка помилок
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
## Методи транспортування маркерів

### Заголовок авторизації (рекомендовано)
```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```
### Печиво
```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```
### Параметр запиту
```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```
## Міркування безпеки

1. **Використовуйте HTTPS**: завжди використовуйте HTTPS, щоб запобігти перехопленню маркера
2. **Короткий термін придатності**: використовуйте найкоротший практичний термін придатності
3. **Конкретні претензії**: включають претензії, які прив’язують токени до певних контекстів
4. **Перевірка на стороні сервера**: завжди перевіряйте маркери на стороні сервера
5. **Не зберігайте конфіденційні дані**: пам’ятайте, що маркери читаються (не зашифровані)

## API Посилання

### XMF\Jwt\JsonWebToken

| Метод | Опис |
|--------|-------------|
| `__construct($key, $algorithm)` | Створити обробник JWT |
| `setAlgorithm($algorithm)` | Встановити алгоритм підписання |
| `create($payload, $expiration)` | Створити підписаний маркер |
| `decode($token, $assertClaims)` | Розшифруйте та перевірте маркер |

### XMF\Jwt\TokenFactory

| Метод | Опис |
|--------|-------------|
| `build($key, $payload, $expiration)` | Створити рядок маркера |

### XMF\Jwt\TokenReader

| Метод | Опис |
|--------|-------------|
| `fromString($key, $token, $claims)` | Декодувати з рядка |
| `fromCookie($key, $name, $claims)` | Декодувати з cookie |
| `fromRequest($key, $name, $claims)` | Декодувати із запиту |
| `fromHeader($key, $claims, $header)` | Декодувати із заголовка |

### XMF\Jwt\KeyFactory

| Метод | Опис |
|--------|-------------|
| `build($name, $storage)` | Отримати або створити ключ |## Дивіться також

- ../Basics/XMF-Request - Обробка запитів
- ../XMF-Framework - Огляд фреймворку
- Database - Утиліти бази даних

---

#XMF #jwt #security #ajax #authentication #токени