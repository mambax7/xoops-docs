---
title: "JWT - JSON web tokeni"
description: "XMF JWT implementacija za sigurnu autentifikaciju temeljenu na tokenu i zaštitu AJAX"
---
`Xmf\Jwt` imenski prostor pruža JSON web token (JWT) podršku za XOOPS modules. JWT-ovi omogućuju sigurnu autentifikaciju bez stanja i posebno su korisni za zaštitu AJAX zahtjeva.

## Što su JSON web tokeni?

JSON Web tokeni standardni su način objavljivanja skupa *zahtjeva* (podataka) kao tekstualnog niza, uz kriptografsku provjeru da zahtjevi nisu neovlašteno mijenjani. Za detaljne specifikacije pogledajte:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Ključne karakteristike

- **Potpisano**: Tokeni su kriptografski potpisani kako bi se otkrilo neovlašteno mijenjanje
- **Samostalan**: Sve potrebne informacije nalaze se u samom tokenu
- **Stateless**: Nije potrebna pohrana sesije na strani poslužitelja
- **Istek**: Tokeni mogu include isteći

> **Napomena:** JWT-ovi su potpisani, nisu šifrirani. Podaci su Base64 kodirani i vidljivi. Koristite JWT za provjeru integriteta, a ne za skrivanje osjetljivih podataka.

## Zašto koristiti JWT u XOOPS?

### Problem tokena AJAX

Obrasci XOOPS koriste nonce tokene za zaštitu CSRF. Međutim, nonce rade loše sa AJAX jer:

1. **Jednokratna upotreba**: Jednokratne stavke obično vrijede za jedno podnošenje
2. **Asinkroni problemi**: Više AJAX zahtjeva može stići nepravilno
3. **Složenost osvježavanja**: Nema pouzdanog načina za asinkrono osvježavanje tokena
4. **Kontekstno povezivanje**: Standardni tokeni ne provjeravaju koja ih je skripta izdala

### JWT Prednosti

JWT rješava ove probleme na sljedeći način:

- Uključujući vrijeme isteka (zahtjev `exp`) za vremenski ograničenu valjanost
- Podrška prilagođenim zahtjevima za vezanje tokena na određene skripte
- Omogućavanje više zahtjeva unutar roka valjanosti
- Pružanje kriptografske provjere podrijetla tokena

## Osnovne klase

### JsonWebToken

`Xmf\Jwt\JsonWebToken` class upravlja stvaranjem i dekodiranjem tokena.

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

#### Metode

**`new JsonWebToken($key, $algorithm)`**

Stvara novi rukovatelj JWT.
- `$key`: objekt `Xmf\Key\KeyAbstract`
- `$algorithm`: Algoritam potpisivanja (zadano: 'HS256')

**`create($payload, $expirationOffset)`**

Stvara potpisani niz tokena.
- `$payload`: Niz zahtjeva
- `$expirationOffset`: Sekunde do isteka (izborno)

**`decode($jwtString, $assertClaims)`**

Dekodira i potvrđuje token.
- `$jwtString`: Token za dekodiranje
- `$assertClaims`: Zahtjevi za provjeru (prazan niz za ništa)
- Vraća: stdClass payload ili false ako nije valjano

**`setAlgorithm($algorithm)`**

Mijenja algoritam potpisivanja/provjere.

### TokenFactory

`Xmf\Jwt\TokenFactory` pruža prikladan način za stvaranje tokena.

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

- `$key`: niz naziva ključa ili objekt KeyAbstract
- `$payload`: niz tvrdnji
- `$expirationOffset`: Istek u sekundama

Izbacuje iznimke u slučaju kvara: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

`Xmf\Jwt\TokenReader` class pojednostavljuje čitanje tokena iz različitih izvora.

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

Sve metode vraćaju korisni teret kao `stdClass` ili `false` ako nije valjan.

### KeyFactory

`Xmf\Jwt\KeyFactory` stvara i upravlja kriptografskim ključevima.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
Ključevi se trajno pohranjuju. Zadana pohrana koristi datotečni sustav.

## AJAX Primjer zaštite

Ovdje je potpuni primjer koji pokazuje JWT-zaštićeni AJAX.

### Skripta stranice (generira token)

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

## Najbolji primjeri iz prakse

### Istek tokena

Postavite odgovarajuća vremena isteka na temelju slučaja upotrebe:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Potvrda zahtjeva

Uvijek provjerite tvrdnju `aud` (publika) kako biste bili sigurni da se tokeni koriste s predviđenom skriptom:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Imenovanje tipki

Koristite opisne nazive ključeva u različite svrhe:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Rješavanje grešaka

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

## Metode prijenosa tokena

### Zaglavlje autorizacije (preporučeno)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Kolačić

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parametar zahtjeva

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Sigurnosna razmatranja

1. **Koristite HTTPS**: Uvijek koristite HTTPS kako biste spriječili presretanje tokena
2. **Kratko trajanje**: Koristite najkraće praktično vrijeme isteka
3. **Specifične tvrdnje**: Uključite tvrdnje koje povezuju tokene s određenim kontekstima
4. **Provjera na strani poslužitelja**: Uvijek provjeravajte tokene na strani poslužitelja
5. **Ne pohranjujte osjetljive podatke**: Upamtite da su tokeni čitljivi (nisu šifrirani)

## API Referenca

### Xmf\Jwt\JsonWebToken

| Metoda | Opis |
|--------|-------------|
| `__construct($key, $algorithm)` | Stvorite rukovatelja JWT |
| `setAlgorithm($algorithm)` | Postavi algoritam potpisivanja |
| `create($payload, $expiration)` | Stvori potpisani token |
| `decode($token, $assertClaims)` | Dekodirajte i provjerite token |

### Xmf\Jwt\TokenFactory

| Metoda | Opis |
|--------|-------------|
| `build($key, $payload, $expiration)` | Stvori niz tokena |

### Xmf\Jwt\TokenReader

| Metoda | Opis |
|--------|-------------|
| `fromString($key, $token, $claims)` | Dekodiraj iz niza |
| `fromCookie($key, $name, $claims)` | Dekodiranje iz kolačića |
| `fromRequest($key, $name, $claims)` | Dekodiranje iz zahtjeva |
| `fromHeader($key, $claims, $header)` | Dešifriraj iz zaglavlja |

### Xmf\Jwt\KeyFactory

| Metoda | Opis |
|--------|-------------|
| `build($name, $storage)` | Nabavite ili izradite ključ |

## Vidi također

- ../Osnove/XMF-Zahtjev - Obrada zahtjeva
- ../XMF-Framework - Pregled okvira
- baza podataka - Pomoćni programi baze podataka

---

#xmf #jwt #sigurnost #ajax #autentikacija #tokeni
