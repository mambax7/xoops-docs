---
title: "JWT - JSON webtokens"
description: "XMF JWT-implementatie voor veilige tokengebaseerde authenticatie en AJAX-bescherming"
---
De `Xmf\Jwt`-naamruimte biedt JSON Web Token (JWT) ondersteuning voor XOOPS-modules. JWT's maken veilige, staatloze authenticatie mogelijk en zijn met name handig voor het beschermen van AJAX-verzoeken.

## Wat zijn JSON-webtokens?

JSON-webtokens zijn een standaardmanier om een ​​reeks *claims* (gegevens) als tekstreeks te publiceren, met cryptografische verificatie dat er niet met de claims is geknoeid. Voor uitgebreide specificaties zie:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Belangrijkste kenmerken

- **Ondertekend**: tokens zijn cryptografisch ondertekend om manipulatie te detecteren
- **Op zichzelf staand**: alle benodigde informatie bevindt zich in het token zelf
- **Stateless**: geen sessieopslag op de server vereist
- **Vervalbaar**: tokens kunnen vervaltijden bevatten

> **Opmerking:** JWT's zijn ondertekend, niet gecodeerd. De gegevens zijn Base64-gecodeerd en zichtbaar. Gebruik JWT's voor integriteitsverificatie, niet voor het verbergen van gevoelige gegevens.

## Waarom JWT gebruiken in XOOPS?

### Het AJAX-tokenprobleem

XOOPS-formulieren gebruiken nonce-tokens voor CSRF-beveiliging. Nonces werken echter slecht met AJAX omdat:

1. **Eenmalig gebruik**: Nonces zijn doorgaans geldig voor één inzending
2. **Asynchrone problemen**: meerdere AJAX-verzoeken kunnen in de verkeerde volgorde aankomen
3. **Complexiteit vernieuwen**: geen betrouwbare manier om tokens asynchroon te vernieuwen
4. **Contextbinding**: standaardtokens verifiëren niet door welk script ze zijn uitgegeven

### JWT Voordelen

JWT's lossen deze problemen op door:

- Inclusief een vervaltijd (`exp`-claim) voor in de tijd beperkte geldigheid
- Ondersteuning van aangepaste claims om tokens aan specifieke scripts te binden
- Het mogelijk maken van meerdere verzoeken binnen de geldigheidsperiode
- Het bieden van cryptografische verificatie van de oorsprong van tokens

## Kernklassen

### JsonWebToken

De klasse `Xmf\Jwt\JsonWebToken` verzorgt het maken en decoderen van tokens.

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

#### Methoden

**`new JsonWebToken($key, $algorithm)`**

Creëert een nieuwe JWT-handler.
- `$key`: een `Xmf\Key\KeyAbstract`-object
- `$algorithm`: Ondertekeningsalgoritme (standaard: 'HS256')

**`create($payload, $expirationOffset)`**

Creëert een ondertekende tokenreeks.
- `$payload`: Reeks claims
- `$expirationOffset`: seconden tot vervaldatum (optioneel)

**`decode($jwtString, $assertClaims)`**

Decodeert en valideert een token.
- `$jwtString`: het token dat moet worden gedecodeerd
- `$assertClaims`: claimt te verifiëren (lege array voor geen)
- Retourneert: stdClass-payload of false indien ongeldig

**`setAlgorithm($algorithm)`**

Wijzigt het ondertekenings-/verificatiealgoritme.

### TokenFactory

De `Xmf\Jwt\TokenFactory` biedt een handige manier om tokens te maken.

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

- `$key`: sleutelnaamreeks of KeyAbstract-object
- `$payload`: Reeks claims
- `$expirationOffset`: vervaldatum in seconden

Genereert uitzonderingen bij een fout: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### Tokenlezer

De klasse `Xmf\Jwt\TokenReader` vereenvoudigt het lezen van tokens uit verschillende bronnen.

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

Alle methoden retourneren de payload als `stdClass` of `false` als deze ongeldig is.

### Sleutelfabriek

De `Xmf\Jwt\KeyFactory` maakt en beheert cryptografische sleutels.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Sleutels worden permanent opgeslagen. De standaardopslag gebruikt het bestandssysteem.

## AJAX Beveiligingsvoorbeeld

Hier is een compleet voorbeeld dat de JWT-beveiligde AJAX demonstreert.

### Paginascript (genereert token)

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

## Beste praktijken

### Tokenvervaldatum

Stel de juiste vervaltijden in op basis van de gebruikssituatie:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Claimverificatie

Controleer altijd de `aud`-claim (doelgroep) om er zeker van te zijn dat tokens worden gebruikt met het beoogde script:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Sleutelnaamgeving

Gebruik beschrijvende sleutelnamen voor verschillende doeleinden:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Foutafhandeling

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

## Tokentransportmethoden

### Autorisatiekop (aanbevolen)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Koekje

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Verzoekparameter

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Beveiligingsoverwegingen1. **Gebruik HTTPS**: Gebruik altijd HTTPS om token-onderschepping te voorkomen
2. **Korte vervaldatum**: Gebruik de kortste praktische vervaltijd
3. **Specifieke claims**: Voeg claims toe die tokens aan specifieke contexten koppelen
4. **Serverzijdevalidatie**: valideer tokens altijd aan de serverzijde
5. **Bewaar geen gevoelige gegevens**: onthoud dat tokens leesbaar zijn (niet gecodeerd)

## API-referentie

### Xmf\Jwt\JsonWebToken

| Werkwijze | Beschrijving |
|--------|-------------|
| `__construct($key, $algorithm)` | JWT-handler maken |
| `setAlgorithm($algorithm)` | Ondertekenalgoritme instellen |
| `create($payload, $expiration)` | Ondertekend token maken |
| `decode($token, $assertClaims)` | Token decoderen en verifiëren |

### Xmf\Jwt\TokenFactory

| Werkwijze | Beschrijving |
|--------|-------------|
| `build($key, $payload, $expiration)` | Tokentekenreeks maken |

### Xmf\Jwt\TokenReader

| Werkwijze | Beschrijving |
|--------|-------------|
| `fromString($key, $token, $claims)` | Decoderen uit tekenreeks |
| `fromCookie($key, $name, $claims)` | Decoderen uit cookie |
| `fromRequest($key, $name, $claims)` | Decoderen van verzoek |
| `fromHeader($key, $claims, $header)` | Decoderen uit header |

### Xmf\Jwt\KeyFactory

| Werkwijze | Beschrijving |
|--------|-------------|
| `build($name, $storage)` | Sleutel ophalen of maken |

## Zie ook

- ../Basics/XMF-Request - Verzoekafhandeling
- ../XMF-Framework - Kaderoverzicht
- Database - Databasehulpprogramma's

---

#xmf #jwt #security #ajax #authenticatie #tokens