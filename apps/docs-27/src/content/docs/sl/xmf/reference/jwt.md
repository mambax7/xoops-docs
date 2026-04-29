---
title: "JWT - JSON spletni žetoni"
description: "XMF JWT implementacija za varno avtentikacijo na podlagi žetonov in AJAX zaščito"
---
Imenski prostor `XMF\Jwt` zagotavlja podporo za JSON spletni žeton (JWT) za module XOOPS. JWT-ji omogočajo varno avtentikacijo brez stanja in so še posebej uporabni za zaščito zahtev AJAX.

## Kaj so JSON spletni žetoni?

JSON Spletni žetoni so standardni način za objavo nabora *zahtevkov* (podatkov) kot besedilnega niza s kriptografskim preverjanjem, da zahtevki niso bili spremenjeni. Za podrobne specifikacije glejte:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Ključne značilnosti

- **Podpisano**: žetoni so kriptografsko podpisani, da zaznajo posege
- **Self-contained**: Vse potrebne informacije so v samem žetonu
- **Stateless**: shranjevanje seje na strani strežnika ni potrebno
- **Expirable**: žetoni lahko vključujejo čase poteka

> **Opomba:** JWT-ji so podpisani, niso šifrirani. Podatki so kodirani Base64 in vidni. Uporabite JWT za preverjanje integritete, ne za skrivanje občutljivih podatkov.

## Zakaj uporabljati JWT v XOOPS?

### Problem žetona AJAX

XOOPS obrazci uporabljajo nonce žetone za CSRF zaščito. Vendar pa nonces slabo delujejo z AJAX, ker:

1. **Enkratna uporaba**: Nonce so običajno veljavne za eno predložitev
2. **Asinhrone težave**: Več zahtev AJAX lahko prispe nepravilno
3. **Zapletenost osveževanja**: ni zanesljivega načina za asinhrono osveževanje žetonov
4. **Kontekstna vezava**: Standardni žetoni ne preverjajo, kateri skript jih je izdal### JWT Prednosti

JWT rešujejo te težave tako, da:

- Vključno s časom poteka (`exp` zahtevek) za časovno omejeno veljavnost
- Podpora zahtevkom po meri za vezavo žetonov na določene skripte
- Omogočanje večkratnih zahtevkov znotraj obdobja veljavnosti
- Zagotavljanje kriptografskega preverjanja izvora žetona

## Osnovni razredi

### JsonWebToken

Razred `XMF\Jwt\JsonWebToken` skrbi za ustvarjanje in dekodiranje žetonov.
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

Ustvari nov upravljalnik JWT.
- `$key`: predmet `XMF\Key\KeyAbstract`
- `$algorithm`: Algoritem podpisovanja (privzeto: 'HS256')

**`create($payload, $expirationOffset)`**

Ustvari podpisan niz žetonov.
- `$payload`: Niz zahtevkov
- `$expirationOffset`: sekunde do poteka (neobvezno)

**`decode($jwtString, $assertClaims)`**

Dekodira in potrdi žeton.
- `$jwtString`: žeton za dekodiranje
- `$assertClaims`: Trditve, ki jih je treba preveriti (prazen niz za nobenega)
- Vrne: stdClass payload ali false, če je neveljaven

**`setAlgorithm($algorithm)`**

Spremeni algoritem signing/verification.

### Tovarna žetonov

`XMF\Jwt\TokenFactory` ponuja priročen način za ustvarjanje žetonov.
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

- `$key`: Niz imena ključa ali objekt KeyAbstract
- `$payload`: Niz zahtevkov
- `$expirationOffset`: Potek v sekundah

Vrže izjeme ob napaki: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

Razred `XMF\Jwt\TokenReader` poenostavlja branje žetonov iz različnih virov.
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
Vse metode vrnejo obremenitev kot `stdClass` ali `false`, če je neveljavna.

### KeyFactory

`XMF\Jwt\KeyFactory` ustvarja in upravlja kriptografske ključe.
```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
Ključi so trajno shranjeni. Privzeti pomnilnik uporablja datotečni sistem.

## AJAX Primer zaščite

Tukaj je popoln primer, ki prikazuje JWT-zaščiteno AJAX.

### Skript strani (generira žeton)
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
## Najboljše prakse

### Potek žetona

Nastavite ustrezne čase poteka glede na primer uporabe:
```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```
### Preverjanje zahtevka

Vedno preverite trditev `aud` (občinstvo), da zagotovite uporabo žetonov s predvidenim skriptom:
```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```
### Poimenovanje ključev

Uporabite opisna imena ključev za različne namene:
```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```
### Obravnava napak
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
## Metode prenosa žetonov

### Glava avtorizacije (priporočeno)
```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```
### Piškotek
```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```
### Parameter zahteve
```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```
## Varnostni vidiki

1. **Uporabite HTTPS**: vedno uporabite HTTPS, da preprečite prestrezanje žetonov
2. **Kratek iztek**: Uporabite najkrajši praktični čas izteka
3. **Posebne trditve**: Vključite trditve, ki vežejo žetone na določene kontekste
4. **Preverjanje na strani strežnika**: Žetone vedno preverite na strani strežnika
5. **Ne shranjujte občutljivih podatkov**: Ne pozabite, da so žetoni berljivi (niso šifrirani)

## API Referenca

### XMF\Jwt\JsonWebToken

| Metoda | Opis |
|--------|-------------|
| `__construct($key, $algorithm)` | Ustvari JWT upravljalnik |
| `setAlgorithm($algorithm)` | Nastavite algoritem za podpisovanje |
| `create($payload, $expiration)` | Ustvari podpisan žeton |
| `decode($token, $assertClaims)` | Dekodiraj in preveri žeton |

### XMF\Jwt\TokenFactory

| Metoda | Opis |
|--------|-------------|
| `build($key, $payload, $expiration)` | Ustvari niz žetonov |

### XMF\Jwt\TokenReader

| Metoda | Opis |
|--------|-------------|
| `fromString($key, $token, $claims)` | Dekodiraj iz niza |
| `fromCookie($key, $name, $claims)` | Dekodiraj iz piškotka |
| `fromRequest($key, $name, $claims)` | Dekodiraj iz zahteve |
| `fromHeader($key, $claims, $header)` | Dekodiraj iz glave |

### XMF\Jwt\KeyFactory

| Metoda | Opis |
|--------|-------------|
| `build($name, $storage)` | Pridobite ali ustvarite ključ |## Glej tudi

- ../Basics/XMF-Request - Obravnava zahtev
- ../XMF-Framework - Pregled okvira
- Baza podatkov - Pripomočki za baze podatkov

---

#XMF #jwt #security #ajax #authentication #tokens