---
title: "JWT - JSON Web Tokens"
description: "XMF JWT implementering til sikker token-baseret godkendelse og AJAX beskyttelse"
---

Navneområdet `Xmf\Jwt` giver JSON Web Token (JWT) understøttelse af XOOPS-moduler. JWT'er muliggør sikker, statsløs godkendelse og er særligt nyttige til at beskytte AJAX-anmodninger.

## Hvad er JSON webtokens?

JSON Web Tokens er en standard måde at publicere et sæt *krav* (data) som en tekststreng med kryptografisk verifikation af, at der ikke er blevet manipuleret med kravene. For detaljerede specifikationer, se:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Nøglekarakteristika

- **Underskrevet**: Tokens signeres kryptografisk for at detektere manipulation
- **Selvforsynet**: Alle nødvendige oplysninger er i selve tokenet
- **Statsløs**: Der kræves ingen sessionslagring på serversiden
- **Udløbsbar**: Tokens kan omfatte udløbstider

> **Bemærk:** JWT'er er signerede, ikke krypteret. Dataene er Base64-kodede og synlige. Brug JWT'er til integritetsverifikation, ikke til at skjule følsomme data.

## Hvorfor bruge JWT i XOOPS?

### AJAX-tokenproblemet

XOOPS-formularer bruger nonce-tokens til CSRF-beskyttelse. Men nonces fungerer dårligt med AJAX fordi:

1. **Engangsbrug**: Beskeder er typisk gyldige for én indsendelse
2. **Asynkrone problemer**: Flere AJAX-anmodninger kan komme ude af drift
3. **Refresh Complexity**: Ingen pålidelig måde at opdatere tokens asynkront på
4. **Kontekstbinding**: Standardtokens bekræfter ikke, hvilket script der har udstedt dem

### JWT Fordele

JWT'er løser disse problemer ved at:

- Inklusiv en udløbstid (`exp`-krav) for tidsbegrænset gyldighed
- Understøtter tilpassede krav om at binde tokens til specifikke scripts
- Aktivering af flere anmodninger inden for gyldighedsperioden
- Levering af kryptografisk verifikation af tokens oprindelse

## Kerneklasser

### JsonWebToken

Klassen `Xmf\Jwt\JsonWebToken` håndterer token-oprettelse og -afkodning.

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

#### Metoder

**`new JsonWebToken($key, $algorithm)`**

Opretter en ny JWT-handler.
- `$key`: Et `Xmf\Key\KeyAbstract` objekt
- `$algorithm`: Signeringsalgoritme (standard: 'HS256')

**`create($payload, $expirationOffset)`**

Opretter en signeret token-streng.
- `$payload`: Vifte af krav
- `$expirationOffset`: Sekunder indtil udløb (valgfrit)

**`decode($jwtString, $assertClaims)`**

Afkoder og validerer et token.
- `$jwtString`: Tokenet, der skal afkodes
- `$assertClaims`: Påstande, der skal verificeres (tom array for ingen)
- Returnerer: stdClass nyttelast eller falsk, hvis ugyldig

**`setAlgorithm($algorithm)`**

Ændrer signerings-/verifikationsalgoritmen.

### TokenFactory

`Xmf\Jwt\TokenFactory` giver en bekvem måde at oprette tokens på.

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

- `$key`: Nøglenavnstreng eller KeyAbstract-objekt
- `$payload`: Vifte af krav
- `$expirationOffset`: Udløb i sekunder

Kaster undtagelser ved fejl: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

Klassen `Xmf\Jwt\TokenReader` forenkler læsning af tokens fra forskellige kilder.

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

Alle metoder returnerer nyttelasten som `stdClass` eller `false`, hvis den er ugyldig.

### KeyFactory

`Xmf\Jwt\KeyFactory` opretter og administrerer kryptografiske nøgler.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Nøgler gemmes vedvarende. Standardlageret bruger filsystemet.

## AJAX Eksempel på beskyttelse

Her er et komplet eksempel, der demonstrerer JWT-beskyttet AJAX.

### Sidescript (genererer token)

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

## Bedste praksis

### Tokens udløb

Indstil passende udløbstider baseret på use case:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Bekræftelse af krav

Bekræft altid påstanden om `aud` (publikum) for at sikre, at tokens bruges sammen med det tilsigtede script:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Nøglenavngivning

Brug beskrivende nøglenavne til forskellige formål:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Fejlhåndtering

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

## Tokentransportmetoder

### Autorisationshoved (anbefales)

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

### Anmodningsparameter

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Sikkerhedsovervejelser1. **Brug HTTPS**: Brug altid HTTPS for at forhindre token-aflytning
2. **Kort udløb**: Brug den korteste praktiske udløbstid
3. **Specifikke påstande**: Inkluder påstande, der knytter tokens til specifikke kontekster
4. **Serversidevalidering**: Valider altid tokens på serversiden
5. **Opbevar ikke følsomme data**: Husk tokens er læsbare (ikke krypteret)

## API Reference

### Xmf\Jwt\JsonWebToken

| Metode | Beskrivelse |
|--------|-------------|
| `__construct($key, $algorithm)` | Opret JWT-handler |
| `setAlgorithm($algorithm)` | Indstil signeringsalgoritme |
| `create($payload, $expiration)` | Opret signeret token |
| `decode($token, $assertClaims)` | Afkode og bekræft token |

### Xmf\Jwt\TokenFactory

| Metode | Beskrivelse |
|--------|-------------|
| `build($key, $payload, $expiration)` | Opret token-streng |

### Xmf\Jwt\TokenReader

| Metode | Beskrivelse |
|--------|-------------|
| `fromString($key, $token, $claims)` | Afkode fra streng |
| `fromCookie($key, $name, $claims)` | Afkode fra cookie |
| `fromRequest($key, $name, $claims)` | Afkode fra anmodning |
| `fromHeader($key, $claims, $header)` | Afkode fra overskrift |

### Xmf\Jwt\KeyFactory

| Metode | Beskrivelse |
|--------|-------------|
| `build($name, $storage)` | Hent eller opret nøgle |

## Se også

- ../Basics/XMF-Request - Anmodningshåndtering
- ../XMF-Framework - Rammeoversigt
- Database - Databaseværktøjer

---

#xmf #jwt #sikkerhed #ajax #godkendelse #tokens
