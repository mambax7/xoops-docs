---
title: "XMF Request"
description: 'Gestione sicura delle richieste HTTP e validazione dell''input con la classe Xmf\Request'
---

La classe `Xmf\Request` fornisce accesso controllato alle variabili delle richieste HTTP con sanitizzazione integrata e conversione di tipo. Protegge da potenziali iniezioni dannose per impostazione predefinita, conformando l'input ai tipi specificati.

## Panoramica

La gestione delle richieste è uno degli aspetti più critici per la sicurezza nello sviluppo web. La classe XMF Request:

- Sanitizza automaticamente l'input per prevenire attacchi XSS
- Fornisce accessori type-safe per i tipi di dati comuni
- Supporta multiple sorgenti di richieste (GET, POST, COOKIE, etc.)
- Offre gestione coerente dei valori di default

## Utilizzo di Base

```php
use Xmf\Request;

// Ottieni input stringa
$name = Request::getString('name', '');

// Ottieni input intero
$id = Request::getInt('id', 0);

// Ottieni da una sorgente specifica
$postData = Request::getString('data', '', 'POST');
```

## Metodi di Richiesta

### getMethod()

Ritorna il metodo di richiesta HTTP per la richiesta corrente.

```php
$method = Request::getMethod();
// Ritorna: 'GET', 'HEAD', 'POST', o 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Il metodo core che la maggior parte dei metodi `get*()` invocano. Recupera e ritorna una variabile nominata dai dati della richiesta.

**Parametri:**
- `$name` - Nome della variabile da recuperare
- `$default` - Valore di default se la variabile non esiste
- `$hash` - Hash sorgente: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, o REQUEST (default)
- `$type` - Tipo di dati per la pulizia (vedere i tipi di FilterInput di seguito)
- `$mask` - Bitmask per le opzioni di pulizia

**Valori di Mask:**

| Costante Mask | Effetto |
|---------------|--------|
| `MASK_NO_TRIM` | Non trimmare spazi bianchi iniziali/finali |
| `MASK_ALLOW_RAW` | Salta la pulizia, consenti input grezzo |
| `MASK_ALLOW_HTML` | Consenti un set limitato di markup HTML "sicuro" |

```php
// Ottieni input grezzo senza pulizia
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Consenti HTML sicuro
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Metodi Type-Specific

### getInt($name, $default, $hash)

Ritorna un valore intero. Solo i digit sono consentiti.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Ritorna un valore float. Solo digit e punti sono consentiti.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Ritorna un valore booleano.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Ritorna una stringa con solo lettere e underscore `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Ritorna una stringa comando con solo `[A-Za-z0-9.-_]`, forzato a minuscolo.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" diventa "view_item"
```

### getString($name, $default, $hash, $mask)

Ritorna una stringa ripulita con codice HTML cattivo rimosso (a meno che non sia sovrascritta da mask).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Consenti alcuni HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Ritorna un array, processato ricorsivamente per rimuovere XSS e codice cattivo.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Ritorna testo grezzo senza pulizia. Usare con cautela.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Ritorna un URL web validato (solo schemi relativi, http, o https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Ritorna un percorso filesystem o web validato.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Ritorna un indirizzo email validato o il default.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Ritorna un indirizzo IPv4 o IPv6 validato.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Ritorna un valore di header di richiesta HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Metodi di Utilità

### hasVar($name, $hash)

Controlla se una variabile esiste nell'hash specificato.

```php
if (Request::hasVar('submit', 'POST')) {
    // Il form è stato inviato
}

if (Request::hasVar('id', 'GET')) {
    // Il parametro ID esiste
}
```

### setVar($name, $value, $hash, $overwrite)

Imposta una variabile nell'hash specificato. Ritorna il valore precedente o null.

```php
// Imposta un valore
$oldValue = Request::setVar('processed', true, 'POST');

// Imposta solo se non esiste già
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Ritorna una copia ripulita di un intero array hash.

```php
// Ottieni tutti i dati POST ripuliti
$postData = Request::get('POST');

// Ottieni tutti i dati GET
$getData = Request::get('GET');

// Ottieni dati REQUEST senza trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Imposta variabili multiple da un array.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Non sovrascrivere i valori esistenti
```

## Integrazione FilterInput

La classe Request usa `Xmf\FilterInput` per la pulizia. Tipi di filtro disponibili:

| Tipo | Descrizione |
|------|-------------|
| ALPHANUM / ALNUM | Solo alfanumerico |
| ARRAY | Pulisci ricorsivamente ogni elemento |
| BASE64 | Stringa codificata in base64 |
| BOOLEAN / BOOL | Vero o falso |
| CMD | Comando - A-Z, 0-9, underscore, dash, period (minuscolo) |
| EMAIL | Indirizzo email valido |
| FLOAT / DOUBLE | Numero punto mobile |
| INTEGER / INT | Valore intero |
| IP | Indirizzo IP valido |
| PATH | Percorso filesystem o web |
| STRING | Stringa generale (default) |
| USERNAME | Formato username |
| WEBURL | URL web |
| WORD | Solo lettere A-Z e underscore |

## Esempi Pratici

### Elaborazione Form

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Valida l'invio del form
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### Gestore AJAX

```php
use Xmf\Request;

// Verifica richiesta AJAX
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Gestisci delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Gestisci update
            break;
    }
}
```

### Paginazione

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Valida i range
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Modulo di Ricerca

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Costruisci i criteri di ricerca
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Migliori Pratiche di Sicurezza

1. **Usa sempre metodi type-specific** - Usa `getInt()` per gli ID, `getEmail()` per le email, etc.

2. **Fornisci default sensati** - Non assumere mai che l'input esiste

3. **Valida dopo sanitizzazione** - La sanitizzazione rimuove i dati cattivi, la validazione assicura che i dati siano corretti

4. **Usa l'hash appropriato** - Specifica POST per i dati del form, GET per i parametri della query

5. **Evita input grezzo** - Usa solo `getText()` o `MASK_ALLOW_RAW` quando assolutamente necessario

```php
// Buono - type-specific con default
$id = Request::getInt('id', 0);

// Cattivo - usa getString per dati numerici
$id = (int) Request::getString('id', '0');
```

## Vedere Anche

- Getting-Started-with-XMF - Concetti XMF di base
- XMF-Module-Helper - Classe module helper
- ../XMF-Framework - Panoramica del framework

---

#xmf #request #security #input-validation #sanitization
