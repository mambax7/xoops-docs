---
title: "JWT - JSON Web Token"
description: "Implementazione XMF JWT per l'autenticazione basata su token sicuri e la protezione AJAX"
---

Lo spazio dei nomi `Xmf\Jwt` fornisce il supporto di JSON Web Token (JWT) per i moduli XOOPS. I JWT consentono l'autenticazione sicura e stateless e sono particolarmente utili per la protezione delle richieste AJAX.

## Cosa sono i JSON Web Token?

I JSON Web Token sono un modo standard di pubblicare un insieme di *rivendicazioni* (dati) come una stringa di testo, con verifica crittografica che le rivendicazioni non siano state manomesse. Per specifiche dettagliate, consulta:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Caratteristiche Chiave

- **Firmato**: I token sono crittograficamente firmati per rilevare le manomissioni
- **Autonomo**: Tutte le informazioni necessarie sono nel token stesso
- **Stateless**: Non è richiesto l'archiviazione della sessione lato server
- **Scadibile**: I token possono includere i tempi di scadenza

> **Nota:** I JWT sono firmati, non crittografati. I dati sono codificati in Base64 e visibili. Usa i JWT per la verifica dell'integrità, non per nascondere i dati sensibili.

## Perché Usare JWT in XOOPS?

### Il Problema del Token AJAX

I moduli XOOPS usano token nonce per la protezione CSRF. Tuttavia, i nonce funzionano male con AJAX perché:

1. **Uso Singolo**: I nonce sono tipicamente validi per un solo invio
2. **Problemi Asincroni**: Più richieste AJAX possono arrivare fuori ordine
3. **Complessità di Aggiornamento**: Nessun modo affidabile per aggiornare i token in modo asincrono
4. **Binding del Contesto**: I token standard non verificano quale script li ha emessi

### Vantaggi JWT

I JWT risolvono questi problemi da:

- Includere un tempo di scadenza (rivendicazione `exp`) per la validità limitata nel tempo
- Supportare rivendicazioni personalizzate per legare i token a script specifici
- Consentire molteplici richieste entro il periodo di validità
- Fornire la verifica crittografica dell'origine del token

## Classi Core

### JsonWebToken

La classe `Xmf\Jwt\JsonWebToken` gestisce la creazione e la decodifica dei token.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Crea una chiave
$key = KeyFactory::build('my_application_key');

// Crea un'istanza JsonWebToken
$jwt = new JsonWebToken($key, 'HS256');

// Crea un token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Scade in 300 secondi

// Decodifica e verifica un token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Metodi

**`new JsonWebToken($key, $algorithm)`**

Crea un nuovo handler JWT.
- `$key`: Un oggetto `Xmf\Key\KeyAbstract`
- `$algorithm`: Algoritmo di firma (default: 'HS256')

**`create($payload, $expirationOffset)`**

Crea una stringa di token firmato.
- `$payload`: Array di rivendicazioni
- `$expirationOffset`: Secondi fino alla scadenza (opzionale)

**`decode($jwtString, $assertClaims)`**

Decodifica e convalida un token.
- `$jwtString`: Il token da decodificare
- `$assertClaims`: Rivendicazioni da verificare (array vuoto per nessuno)
- Ritorna: payload stdClass o false se non valido

**`setAlgorithm($algorithm)`**

Cambia l'algoritmo di firma/verifica.

### TokenFactory

L'`Xmf\Jwt\TokenFactory` fornisce un modo conveniente di creare token.

```php
use Xmf\Jwt\TokenFactory;

// Crea un token con gestione automatica della chiave
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Il token scade in 120 secondi
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: Stringa nome della chiave o oggetto KeyAbstract
- `$payload`: Array di rivendicazioni
- `$expirationOffset`: Scadenza in secondi

Lancia eccezioni in caso di fallimento: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

La classe `Xmf\Jwt\TokenReader` semplifica la lettura dei token da varie sorgenti.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// Da una stringa
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// Da un cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// Da un parametro di richiesta
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// Da header Authorization (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Tutti i metodi ritornano il payload come `stdClass` o `false` se non valido.

### KeyFactory

L'`Xmf\Jwt\KeyFactory` crea e gestisce le chiavi crittografiche.

```php
use Xmf\Jwt\KeyFactory;

// Costruisci una chiave (crea se non esiste)
$key = KeyFactory::build('my_application_key');

// Con archiviazione personalizzata
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Le chiavi sono archiviate in modo persistente. L'archiviazione predefinita utilizza il file system.

## Esempio di Protezione AJAX

Ecco un esempio completo che dimostra JWT-protected AJAX.

### Script di Pagina (Genera Token)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Rivendicazioni da includere e verificare
$assertClaims = ['aud' => basename(__FILE__)];

// Controlla se si tratta di una richiesta AJAX
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Gestisci la richiesta AJAX
    $GLOBALS['xoopsLogger']->activated = false;

    // Verifica il token dall'header di autorizzazione
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Il token è valido - elabora la richiesta
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // La tua logica AJAX qui
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Richiesta di pagina regolare - genera token e visualizza la pagina
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Crea token con rivendicazioni
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valido per 2 minuti
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript per le chiamate AJAX
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
                // Aggiorna l'interfaccia
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

## Migliori Pratiche

### Scadenza del Token

Imposta tempi di scadenza appropriati in base al caso d'uso:

```php
// Breve durata per operazioni sensibili (2 minuti)
$token = TokenFactory::build('key', $claims, 120);

// Più lungo per le interazioni generiche della pagina (30 minuti)
$token = TokenFactory::build('key', $claims, 1800);
```

### Verifica della Rivendicazione

Verifica sempre la rivendicazione `aud` (audience) per assicurarti che i token vengano utilizzati con lo script previsto:

```php
// Quando si crea
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// Quando si verifica
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Denominazione della Chiave

Utilizza nomi di chiave descrittivi per scopi diversi:

```php
// Chiavi separate per diverse funzionalità
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Gestione degli Errori

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Algoritmo non valido
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Argomento non valido
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Valore imprevisto
    error_log('JWT Error: ' . $e->getMessage());
}

// La lettura dei token ritorna false in caso di fallimento (no eccezione)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token non valido, scaduto, o manomesso
}
```

## Metodi di Trasporto del Token

### Header di Autorizzazione (Consigliato)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Cookie

```php
// Imposta cookie con token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Leggi dal cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parametro di Richiesta

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Considerazioni di Sicurezza

1. **Usa HTTPS**: Usa sempre HTTPS per prevenire l'intercettazione del token
2. **Scadenza Breve**: Usa il tempo di scadenza più breve pratico
3. **Rivendicazioni Specifiche**: Includi rivendicazioni che leghino i token a contesti specifici
4. **Validazione Lato Server**: Valida sempre i token lato server
5. **Non Archiviare Dati Sensibili**: Ricorda che i token sono leggibili (non crittografati)

## Riferimento API

### Xmf\Jwt\JsonWebToken

| Metodo | Descrizione |
|--------|-------------|
| `__construct($key, $algorithm)` | Crea handler JWT |
| `setAlgorithm($algorithm)` | Imposta algoritmo di firma |
| `create($payload, $expiration)` | Crea token firmato |
| `decode($token, $assertClaims)` | Decodifica e verifica il token |

### Xmf\Jwt\TokenFactory

| Metodo | Descrizione |
|--------|-------------|
| `build($key, $payload, $expiration)` | Crea stringa di token |

### Xmf\Jwt\TokenReader

| Metodo | Descrizione |
|--------|-------------|
| `fromString($key, $token, $claims)` | Decodifica da stringa |
| `fromCookie($key, $name, $claims)` | Decodifica da cookie |
| `fromRequest($key, $name, $claims)` | Decodifica da richiesta |
| `fromHeader($key, $claims, $header)` | Decodifica da header |

### Xmf\Jwt\KeyFactory

| Metodo | Descrizione |
|--------|-------------|
| `build($name, $storage)` | Ottieni o crea chiave |

## Vedere Anche

- ../Basics/XMF-Request - Gestione della richiesta
- ../XMF-Framework - Panoramica del framework
- Database - Utilità di database

---

#xmf #jwt #security #ajax #authentication #tokens
