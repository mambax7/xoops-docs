---
title: "JWT - JSON Web Token"
description: "Реализация XMF JWT для безопасной аутентификации на основе токенов и защиты AJAX"
---

Пространство имен `Xmf\Jwt` предоставляет поддержку JSON Web Token (JWT) для модулей XOOPS. JWT позволяют безопасную, статусную аутентификацию и особенно полезны для защиты AJAX запросов.

## Что такое JSON Web Token?

JSON Web Token - это стандартный способ опубликовать набор *претензий* (данных) как текстовую строку с криптографической проверкой, что претензии не были подделаны. Для детальных спецификаций см:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Ключевые характеристики

- **Подписано**: Токены криптографически подписаны для обнаружения подделки
- **Автономно**: Вся необходимая информация находится в самом токене
- **Статусно**: Не требуется серверное хранилище сеанса
- **Истекаемо**: Токены могут включать время истечения

> **Примечание:** JWT подписаны, не зашифрованы. Данные закодированы в Base64 и видны. Используйте JWT для проверки целостности, не для скрытия чувствительных данных.

## Почему использовать JWT в XOOPS?

### Проблема AJAX токена

Формы XOOPS используют токены nonce для защиты CSRF. Однако nonce плохо работают с AJAX потому что:

1. **Одноразовые**: Токены обычно действительны для одной отправки
2. **Асинхронные проблемы**: Несколько AJAX запросов могут приходить в неправильном порядке
3. **Сложность обновления**: Нет надежного способа обновить токены асинхронно
4. **Привязка контекста**: Стандартные токены не проверяют какой скрипт их издал

### Преимущества JWT

JWT решают эти проблемы путем:

- Включение времени истечения (`exp` претензия) для ограниченной по времени действительности
- Поддержка пользовательских претензий для привязания токенов к конкретным скриптам
- Включение нескольких запросов в течение периода действительности
- Обеспечение криптографической проверки происхождения токена

## Основные классы

### JsonWebToken

Класс `Xmf\Jwt\JsonWebToken` обрабатывает создание и декодирование токена.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Создать ключ
$key = KeyFactory::build('my_application_key');

// Создать экземпляр JsonWebToken
$jwt = new JsonWebToken($key, 'HS256');

// Создать токен
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Истекает через 300 секунд

// Декодировать и проверить токен
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

### TokenFactory

Класс `Xmf\Jwt\TokenFactory` предоставляет удобный способ создания токенов.

```php
use Xmf\Jwt\TokenFactory;

// Создать токен с автоматической обработкой ключей
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Токен истекает через 120 секунд
```

### TokenReader

Класс `Xmf\Jwt\TokenReader` упрощает чтение токенов из различных источников.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// Из строки
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// Из cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// Из параметра запроса
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// Из заголовка Authorization (Bearer токен)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

## Практический пример: Защита AJAX

Вот полный пример демонстрирующий защищенный JWT AJAX.

### Страница скрипта (генерирует токен)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Претензии для включения и проверки
$assertClaims = ['aud' => basename(__FILE__)];

// Проверить, является ли это AJAX запросом
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Обработать AJAX запрос
    $GLOBALS['xoopsLogger']->activated = false;

    // Проверить токен из заголовка Authorization
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Токен действителен - обработать запрос
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Ваша логика AJAX здесь
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Обычный запрос страницы - генерировать токен и отобразить страницу
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Создать токен с претензиями
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Токен действителен 2 минуты
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript для AJAX вызовов
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
                // Обновить UI
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
echo '<button onclick="performAction('save')">Save Item</button>';
echo '<button onclick="performAction('delete')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Лучшие практики

### Истечение токена

Установить подходящие времена истечения на основе случая использования:

```php
// Краткосрочное для чувствительных операций (2 минуты)
$token = TokenFactory::build('key', $claims, 120);

// Более долгосрочное для общих взаимодействий (30 минут)
$token = TokenFactory::build('key', $claims, 1800);
```

### Проверка претензии

Всегда проверять претензию `aud` (audience) для гарантии, что токены используются с предназначенным скриптом:

```php
// При создании
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// При проверке
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

## API справочник

### Xmf\Jwt\JsonWebToken

| Метод | Описание |
|--------|-------------|
| `__construct($key, $algorithm)` | Создать обработчик JWT |
| `setAlgorithm($algorithm)` | Установить алгоритм подписания |
| `create($payload, $expiration)` | Создать подписанный токен |
| `decode($token, $assertClaims)` | Декодировать и проверить токен |

### Xmf\Jwt\TokenFactory

| Метод | Описание |
|--------|-------------|
| `build($key, $payload, $expiration)` | Создать строку токена |

### Xmf\Jwt\TokenReader

| Метод | Описание |
|--------|-------------|
| `fromString($key, $token, $claims)` | Декодировать из строки |
| `fromCookie($key, $name, $claims)` | Декодировать из cookie |
| `fromRequest($key, $name, $claims)` | Декодировать из запроса |
| `fromHeader($key, $claims, $header)` | Декодировать из заголовка |

---

#xmf #jwt #security #ajax #authentication #tokens
