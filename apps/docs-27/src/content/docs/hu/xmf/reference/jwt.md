---
title: "JWT – JSON webes tokenek"
description: "XMF JWT implementáció a biztonságos token alapú hitelesítéshez és AJAX védelemhez"
---
A `XMF\Jwt` névtér JSON Web Token (JWT) támogatást biztosít a XOOPS modulokhoz. A JWT-k biztonságos, állapot nélküli hitelesítést tesznek lehetővé, és különösen hasznosak a AJAX kérések védelmében.

## Mik azok a JSON webes tokenek?

A JSON webes tokenek a *claims* (adatok) készletének szöveges karakterláncként történő közzétételének szabványos módja, kriptográfiai ellenőrzéssel, hogy a követeléseket nem manipulálták-e. A részletes specifikációkért lásd:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Főbb jellemzők

- **Aláírt**: A tokenek kriptográfiailag alá vannak írva, hogy észleljék a manipulációt
- **Önálló**: Minden szükséges információ magában a tokenben található
- **Stateles**: Nincs szükség szerveroldali munkamenet-tárolásra
- **Lejárt**: A tokenek tartalmazhatnak lejárati időt

> **Megjegyzés:** A JWT-k aláírtak, nem titkosítottak. Az adatok Base64 kódolásúak és láthatók. Használjon JWT-ket az integritás ellenőrzésére, ne az érzékeny adatok elrejtésére.

## Miért használja a JWT-t a XOOPS-ban?

### A AJAX Token probléma

A XOOPS űrlapok nonce tokeneket használnak a CSRF védelemhez. A nonces azonban rosszul működik a AJAX-val, mert:

1. **Egyszer használatos**: A Nonces-ek általában egy benyújtásra érvényesek
2. **Aszinkron problémák**: Előfordulhat, hogy több AJAX kérés nem megfelelő
3. **Frissítés bonyolultsága**: Nincs megbízható módja a tokenek aszinkron frissítésének
4. **Context Binding**: A szabványos tokenek nem ellenőrzik, hogy melyik szkript adta ki őket

### JWT Előnyök

A JWT-k ezeket a problémákat a következőképpen oldják meg:

- Lejárati idővel (`exp` követelés) a korlátozott érvényességhez
- Egyéni igények támogatása a tokenek meghatározott szkriptekhez való kötésére
- Több kérés engedélyezése az érvényességi időn belül
- A token eredetének kriptográfiai ellenőrzése

## Alapvető osztályok

### JsonWebToken

A `XMF\Jwt\JsonWebToken` osztály kezeli a token létrehozását és dekódolását.

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

#### Módszerek

**`new JsonWebToken($key, $algorithm)`**

Létrehoz egy új JWT kezelőt.
- `$key`: `XMF\Key\KeyAbstract` objektum
- `$algorithm`: Aláíró algoritmus (alapértelmezett: 'HS256')

**`create($payload, $expirationOffset)`**

Létrehoz egy aláírt token karakterláncot.
- `$payload`: Számos követelés
- `$expirationOffset`: Másodpercek a lejáratig (opcionális)

**`decode($jwtString, $assertClaims)`**

Dekódolja és érvényesíti a tokent.
- `$jwtString`: A dekódolandó token
- `$assertClaims`: Igazolási igények (üres tömb nincs)
- Visszatér: stdClass payload vagy false, ha érvénytelen

**`setAlgorithm($algorithm)`**

Módosítja a signing/verification algoritmust.

### TokenFactory

A `XMF\Jwt\TokenFactory` kényelmes módot biztosít tokenek létrehozására.

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

- `$key`: Kulcsnév karakterlánc vagy KeyAbstract objektum
- `$payload`: Számos követelés
- `$expirationOffset`: Lejárat másodpercben

Kivételeket dob hiba esetén: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

A `XMF\Jwt\TokenReader` osztály leegyszerűsíti a különböző forrásokból származó tokenek olvasását.

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

Minden módszer `stdClass` vagy `false` formátumban adja vissza a hasznos terhet, ha érvénytelen.

### KeyFactory

A `XMF\Jwt\KeyFactory` titkosítási kulcsokat hoz létre és kezel.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

A kulcsokat folyamatosan tárolják. Az alapértelmezett tárhely a fájlrendszert használja.

## AJAX védelmi példa

Íme egy teljes példa, amely bemutatja a JWT-védett AJAX-t.

### Oldalszkript (Tokent generál)

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

## Bevált gyakorlatok

### Token lejárata

Állítsa be a megfelelő lejárati időt a használati eset alapján:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Igényellenőrzés

Mindig ellenőrizze a `aud` (közönség) igényt, hogy a tokeneket a kívánt szkripttel használják:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Kulcs elnevezése

Használjon leíró kulcsneveket különböző célokra:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Hibakezelés

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

## Token szállítási módszerek

### Engedélyezési fejléc (ajánlott)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Süti

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Kérelem paraméter

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Biztonsági szempontok1. **Használja a HTTPS-t**: Mindig használja a HTTPS-t a token-elfogás megelőzése érdekében
2. **Rövid lejárati idő**: Használja a gyakorlatban legrövidebb lejárati időt
3. **Konkrét állítások**: Tartalmazzon olyan követeléseket, amelyek a tokeneket meghatározott kontextusokhoz kötik
4. **Server-Side Validation**: Mindig szerveroldali tokeneket kell érvényesíteni
5. **Ne tároljon érzékeny adatokat**: Ne feledje, hogy a tokenek olvashatóak (nem titkosítottak)

## API Referencia

### XMF\Jwt\JsonWebToken

| Módszer | Leírás |
|--------|--------------|
| `__construct($key, $algorithm)` | JWT kezelő létrehozása |
| `setAlgorithm($algorithm)` | Aláíró algoritmus beállítása |
| `create($payload, $expiration)` | Aláírt token létrehozása |
| `decode($token, $assertClaims)` | Dekódolás és ellenőrzés token |

### XMF\Jwt\TokenFactory

| Módszer | Leírás |
|--------|--------------|
| `build($key, $payload, $expiration)` | Token karakterlánc létrehozása |

### XMF\Jwt\TokenReader

| Módszer | Leírás |
|--------|--------------|
| `fromString($key, $token, $claims)` | Dekódolás karakterláncból |
| `fromCookie($key, $name, $claims)` | Dekódolás sütiből |
| `fromRequest($key, $name, $claims)` | Dekódolás kérésből |
| `fromHeader($key, $claims, $header)` | Dekódolás a fejlécből |

### XMF\Jwt\KeyFactory

| Módszer | Leírás |
|--------|--------------|
| `build($name, $storage)` | Kulcs beszerzése vagy létrehozása |

## Lásd még

- ../Basics/XMF-Request - Kezelési kérelem
- ../XMF-Framework - A keretrendszer áttekintése
- Adatbázis - Adatbázis segédprogramok

---

#xmf #jwt #biztonság #ajax #hitelesítés #tokenek
