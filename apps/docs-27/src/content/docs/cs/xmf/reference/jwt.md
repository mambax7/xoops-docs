---
title: "Webové tokeny JWT – JSON"
description: "XMF Implementace JWT pro bezpečné ověřování na základě tokenů a ochranu AJAX"
---

Jmenný prostor `XMF\Jwt` poskytuje podporu JSON Web Token (JWT) pro moduly XOOPS. JWT umožňují bezpečné, bezstavové ověřování a jsou zvláště užitečné pro ochranu požadavků AJAX.

## Co jsou webové tokeny JSON?

Webové tokeny JSON představují standardní způsob, jak publikovat sadu *nároků* (dat) jako textový řetězec s kryptografickým ověřením, že nároky nebyly zmanipulovány. Podrobné specifikace viz:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Klíčové vlastnosti

- **Podepsané**: Tokeny jsou kryptograficky podepsány, aby bylo možné detekovat manipulaci
- **Samostatný**: Všechny potřebné informace jsou v samotném tokenu
- **Stateless**: Nevyžaduje úložiště relace na straně serveru
- **Platnost**: Tokeny mohou obsahovat časy vypršení platnosti

> **Poznámka:** JWT jsou podepsané, nikoli šifrované. Data jsou zakódována v Base64 a jsou viditelná. Použijte JWT k ověření integrity, nikoli ke skrytí citlivých dat.

## Proč používat JWT v XOOPS?

### Problém s tokenem AJAX

Formuláře XOOPS používají tokeny nonce pro ochranu CSRF. Nonces však se AJAX nefungují špatně, protože:

1. **Jedno použití**: Nonce jsou obvykle platné pro jedno podání
2. **Asynchronní problémy**: Několik požadavků AJAX může přijít mimo provoz
3. **Složitost obnovy**: Neexistuje spolehlivý způsob asynchronního obnovování tokenů
4. **Kontextová vazba**: Standardní tokeny neověřují, který skript je vydal

### JWT Výhody

JWT řeší tyto problémy:

- Včetně doby vypršení platnosti (nárok `exp`) pro časově omezenou platnost
- Podpora vlastních nároků na vazbu tokenů na konkrétní skripty
- Povolení více požadavků během doby platnosti
- Poskytování kryptografického ověření původu tokenu

## Základní třídy

### JsonWebToken

Třída `XMF\Jwt\JsonWebToken` zpracovává vytváření a dekódování tokenů.

```php
use XMF\Jwt\JsonWebToken;
use XMF\Jwt\KeyFactory;

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

#### Metody

**`new JsonWebToken($key, $algorithm)`**

Vytvoří nový handler JWT.
- `$key`: Objekt `XMF\Key\KeyAbstract`
- `$algorithm`: Algoritmus podepisování (výchozí: 'HS256')

**`create($payload, $expirationOffset)`**

Vytvoří podepsaný řetězec tokenu.
- `$payload`: Řada nároků
- `$expirationOffset`: Sekundy do vypršení platnosti (volitelné)

**`decode($jwtString, $assertClaims)`**

Dekóduje a ověří token.
- `$jwtString`: Token k dekódování
- `$assertClaims`: Nároky k ověření (prázdné pole pro žádné)
- Vrací: stdClass payload nebo false, pokud je neplatný

**`setAlgorithm($algorithm)`**

Změní algoritmus signing/verification.

### TokenFactory

`XMF\Jwt\TokenFactory` poskytuje pohodlný způsob vytváření tokenů.

```php
use XMF\Jwt\TokenFactory;

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

- `$key`: Řetězec názvu klíče nebo objekt KeyAbstract
- `$payload`: Řada nároků
- `$expirationOffset`: Vypršení platnosti v sekundách

Při selhání vyvolá výjimky: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

Třída `XMF\Jwt\TokenReader` zjednodušuje čtení tokenů z různých zdrojů.

```php
use XMF\Jwt\TokenReader;

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

Všechny metody vrátí užitečné zatížení jako `stdClass` nebo `false`, pokud jsou neplatné.

### KeyFactory

`XMF\Jwt\KeyFactory` vytváří a spravuje kryptografické klíče.

```php
use XMF\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \XMF\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Klíče jsou trvale uloženy. Výchozí úložiště používá systém souborů.

## Příklad ochrany AJAX

Zde je kompletní příklad demonstrující AJAX chráněný JWT.

### Skript stránky (generuje token)

```php
<?php
use XMF\Jwt\TokenFactory;
use XMF\Jwt\TokenReader;
use XMF\Module\Helper;
use XMF\Request;

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

## Nejlepší postupy

### Vypršení platnosti tokenu

Nastavte vhodné časy vypršení platnosti na základě případu použití:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Ověření nároku

Vždy ověřte nárok `aud` (publikum), abyste zajistili použití tokenů se zamýšleným skriptem:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Pojmenování klíčů

Používejte popisné názvy klíčů pro různé účely:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Zpracování chyb

```php
use XMF\Jwt\TokenFactory;
use XMF\Jwt\TokenReader;

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

## Metody přenosu tokenů

### Záhlaví autorizace (doporučeno)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Soubor cookie

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parametr požadavku

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Bezpečnostní aspekty

1. **Použijte HTTPS**: Vždy používejte HTTPS, abyste zabránili zachycení tokenu
2. **Krátká expirace**: Použijte nejkratší praktickou dobu expirace
3. **Specifická tvrzení**: Zahrňte tvrzení, která spojují tokeny s konkrétními kontexty
4. **Ověření na straně serveru**: Vždy ověřujte tokeny na straně serveru
5. **Neuchovávejte citlivá data**: Pamatujte, že tokeny jsou čitelné (nešifrované)

## Reference API### XMF\Jwt\JsonWebToken

| Metoda | Popis |
|--------|-------------|
| `__construct($key, $algorithm)` | Vytvořit ovladač JWT |
| `setAlgorithm($algorithm)` | Nastavit podpisový algoritmus |
| `create($payload, $expiration)` | Vytvořit podepsaný token |
| `decode($token, $assertClaims)` | Dekódujte a ověřte token |

### XMF\Jwt\TokenFactory

| Metoda | Popis |
|--------|-------------|
| `build($key, $payload, $expiration)` | Vytvořit řetězec tokenů |

### XMF\Jwt\TokenReader

| Metoda | Popis |
|--------|-------------|
| `fromString($key, $token, $claims)` | Dekódovat z řetězce |
| `fromCookie($key, $name, $claims)` | Dekódovat z cookie |
| `fromRequest($key, $name, $claims)` | Dekódovat z požadavku |
| `fromHeader($key, $claims, $header)` | Dekódovat z hlavičky |

### XMF\Jwt\KeyFactory

| Metoda | Popis |
|--------|-------------|
| `build($name, $storage)` | Získejte nebo vytvořte klíč |

## Viz také

- ../Basics/XMF-Request - Vyřízení požadavku
- ../XMF-Framework - Přehled rámce
- Databáze - Databázové nástroje

---

#xmf #jwt #zabezpečení #ajax #ověření #tokeny