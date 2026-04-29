---
title: "XMF anmodning"
description: 'Sikker HTTP anmodningshåndtering og inputvalidering med Xmf\Request-klassen'
---

Klassen `Xmf\Request` giver kontrolleret adgang til HTTP-anmodningsvariabler med indbygget sanitisering og typekonvertering. Den beskytter som standard mod potentielt skadelige injektioner, mens den tilpasser input til specificerede typer.

## Oversigt

Forespørgselshåndtering er et af de mest sikkerhedskritiske aspekter af webudvikling. XMF Request-klassen:

- Desinficerer automatisk input for at forhindre XSS-angreb
- Giver typesikre accessorer til almindelige datatyper
- Understøtter flere anmodningskilder (GET, POST, COOKIE osv.)
- Tilbyder ensartet håndtering af standardværdier

## Grundlæggende brug

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Anmodningsmetoder

### getMethod()

Returnerer HTTP anmodningsmetoden for den aktuelle anmodning.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Kernemetoden, som de fleste andre `get*()`-metoder påberåber sig. Henter og returnerer en navngivet variabel fra anmodningsdata.

**Parametre:**
- `$name` - Variabelnavn, der skal hentes
- `$default` - Standardværdi, hvis variabel ikke findes
- `$hash` - Kildehash: GET, POST, FILES, COOKIE, qzxph000041q2xz, 0zphx0, 0zphx0 METHOD eller REQUEST (standard)
- `$type` - Datatype til rengøring (se FilterInput-typer nedenfor)
- `$mask` - Bitmaske til rengøringsmuligheder

**Maskeværdier:**

| Maske konstant | Effekt |
|--------------|--------|
| `MASK_NO_TRIM` | Trim ikke indledende/efterliggende mellemrum |
| `MASK_ALLOW_RAW` | Spring rengøring over, tillad rå input |
| `MASK_ALLOW_HTML` | Tillad et begrænset "sikkert" sæt HTML markup |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Typespecifikke metoder

### getInt($name, $default, $hash)

Returnerer en heltalsværdi. Kun cifre er tilladt.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Returnerer en flydende værdi. Kun cifre og punktummer tilladt.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Returnerer en boolesk værdi.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Returnerer en streng med kun bogstaver og understreger `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Returnerer en kommandostreng med kun `[A-Za-z0-9.-_]`, tvunget til små bogstaver.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Returnerer en renset streng med dårlig HTML-kode fjernet (medmindre den tilsidesættes af maske).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Returnerer et array, rekursivt behandlet for at fjerne XSS og dårlig kode.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Returnerer rå tekst uden rensning. Brug med forsigtighed.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Returnerer en valideret web URL (kun relative, http- eller https-skemaer).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Returnerer et valideret filsystem eller websti.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Returnerer en valideret e-mailadresse eller standarden.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Returnerer en valideret IPv4- eller IPv6-adresse.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Returnerer en HTTP-anmodningshovedværdi.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Hjælpemetoder

### hasVar($name, $hash)

Tjek, om der findes en variabel i den angivne hash.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### sætVar($name, $value, $hash, $overwrite)

Indstil en variabel i den angivne hash. Returnerer den forrige værdi eller null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Returnerer en renset kopi af en hel hash-array.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### sæt($array, $hash, $overwrite)

Indstiller flere variabler fra et array.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput IntegrationRequest-klassen bruger `Xmf\FilterInput` til rengøring. Tilgængelige filtertyper:

| Skriv | Beskrivelse |
|------|-------------|
| ALPHANUM / ALNUM | Kun alfanumerisk |
| ARRAY | Rengør hvert element rekursivt |
| BASE64 | Base64-kodet streng |
| BOOLEAN / BOOL | Sandt eller falsk |
| CMD | Kommando - A-Z, 0-9, understregning, bindestreg, punktum (små bogstaver) |
| EMAIL | Gyldig e-mailadresse |
| FLOAT / DOUBLE | Flydende kommanummer |
| INTEGER / INT | Heltalsværdi |
| IP | Gyldig IP-adresse |
| PATH | Filsystem eller websti |
| STRING | Generel streng (standard) |
| USERNAME | Brugernavn format |
| WEBURL | Web URL |
| WORD | Kun bogstaver A-Z og understregning |

## Praktiske eksempler

### Formularbehandling

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
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

### AJAX Handler

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### Sideinddeling

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### Søgeformular

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## Bedste praksis for sikkerhed

1. **Brug altid typespecifikke metoder** - Brug `getInt()` til ID'er, `getEmail()` til e-mails osv.

2. **Giv fornuftige standardindstillinger** - Antag aldrig, at der findes input

3. **Valider efter desinficering** - Sanitisering fjerner dårlige data, validering sikrer korrekte data

4. **Brug passende hash** - Angiv POST for formulardata, GET for forespørgselsparametre

5. **Undgå rå input** - Brug kun `getText()` eller `MASK_ALLOW_RAW`, når det er absolut nødvendigt

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Se også

- Kom godt i gang med-XMF - Grundlæggende XMF-koncepter
- XMF-Module-Helper - Modulhjælperklasse
- ../XMF-Framework - Rammeoversigt

---

#xmf #request #security #input-validation #sanitization
