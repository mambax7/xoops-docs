---
title: "XMF-verzoek"
description: 'Veilige HTTP-verzoekafhandeling en invoervalidatie met de Xmf\Request-klasse'
---
De klasse `Xmf\Request` biedt gecontroleerde toegang tot HTTP-verzoekvariabelen met ingebouwde opschoning en typeconversie. Het beschermt standaard tegen potentieel schadelijke injecties terwijl de invoer voldoet aan gespecificeerde typen.

## Overzicht

Het afhandelen van verzoeken is een van de meest veiligheidskritische aspecten van webontwikkeling. De XMF Request-klasse:

- Reinigt automatisch de invoer om XSS-aanvallen te voorkomen
- Biedt typeveilige accessors voor veelgebruikte gegevenstypen
- Ondersteunt meerdere verzoekbronnen (GET, POST, COOKIE, enz.)
- Biedt consistente verwerking van standaardwaarden

## Basisgebruik

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Verzoekmethoden

### getMethod()

Retourneert de HTTP-verzoekmethode voor het huidige verzoek.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

De kernmethode die door de meeste andere `get*()`-methoden wordt aangeroepen. Haalt een benoemde variabele op uit aanvraaggegevens en retourneert deze.

**Parameters:**
- `$name` - Variabelenaam die moet worden opgehaald
- `$default` - Standaardwaarde als variabele niet bestaat
- `$hash` - Bronhash: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD of REQUEST (standaard)
- `$type` - Gegevenstype voor opschonen (zie FilterInvoertypen hieronder)
- `$mask` - Bitmasker voor reinigingsopties

**Maskerwaarden:**

| Maskerconstante | Effect |
|--------------|--------|
| `MASK_NO_TRIM` | Voorloop/achterliggende witruimte niet trimmen |
| `MASK_ALLOW_RAW` | Opschonen overslaan, onbewerkte invoer toestaan ​​|
| `MASK_ALLOW_HTML` | Sta een beperkte "veilige" set HTML-markeringen toe |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Typespecifieke methoden

### getInt($name, $default, $hash)

Retourneert een geheel getal. Alleen cijfers zijn toegestaan.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Retourneert een float-waarde. Alleen cijfers en punten toegestaan.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Retourneert een Booleaanse waarde.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Retourneert een tekenreeks met alleen letters en onderstrepingstekens `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Retourneert een opdrachtreeks met alleen `[A-Za-z0-9.-_]`, geforceerd in kleine letters.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Retourneert een opgeschoonde tekenreeks waaruit de slechte HTML-code is verwijderd (tenzij deze wordt overschreven door een masker).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Retourneert een array, recursief verwerkt om XSS en slechte code te verwijderen.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Retourneert onbewerkte tekst zonder opschoning. Wees voorzichtig.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Retourneert een gevalideerde web-URL (alleen relatieve, http- of https-schema's).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Retourneert een gevalideerd bestandssysteem of webpad.

```php
$filePath = Request::getPath('file', '');
```

### getE-mail($name, $default, $hash)

Retourneert een gevalideerd e-mailadres of het standaardadres.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Retourneert een gevalideerd IPv4- of IPv6-adres.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Retourneert een HTTP-aanvraagheaderwaarde.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Hulpprogramma's

### heeftVar($name, $hash)

Controleer of er een variabele bestaat in de opgegeven hash.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Stel een variabele in de opgegeven hash in. Retourneert de vorige waarde of null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### krijgen($hash, $mask)

Retourneert een opgeschoonde kopie van een volledige hash-array.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Stelt meerdere variabelen uit een array in.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput-integratie

De klasse Request gebruikt `Xmf\FilterInput` voor het opschonen. Beschikbare filtertypen:

| Typ | Beschrijving |
|------|-------------|
| ALPHANUM / ALNUM | Alleen alfanumeriek |
| ARRAY | Maak elk element recursief schoon |
| BASE64 | Base64-gecodeerde tekenreeks |
| BOOLEAN / BOOL | Waar of niet waar |
| CMD | Commando - A-Z, 0-9, onderstrepingsteken, streepje, punt (kleine letters) |
| EMAIL | Geldig e-mailadres |
| FLOAT / DOUBLE | Drijvende-kommagetal |
| INTEGER / INT | Geheel getal |
| IP | Geldig IP-adres |
| PATH | Bestandssysteem of webpad |
| STRING | Algemene tekenreeks (standaard) |
| USERNAME | Gebruikersnaamformaat |
| WEBURL | Web URL |
| WORD | Alleen letters A-Z en onderstrepingstekens |

## Praktische voorbeelden

### Formulierverwerking

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

### AJAX-handler

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

### Paginering

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

### Zoekformulier

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

## Beste beveiligingspraktijken

1. **Gebruik altijd typespecifieke methoden** - Gebruik `getInt()` voor ID's, `getEmail()` voor e-mails, enz.

2. **Zorg voor verstandige standaardinstellingen** - Ga er nooit van uit dat er invoer bestaat

3. **Valideren na sanering** - Sanering verwijdert slechte gegevens, validatie zorgt voor correcte gegevens

4. **Gebruik de juiste hash** - Specificeer POST voor formuliergegevens, GET voor queryparameters

5. **Vermijd onbewerkte invoer** - Gebruik `getText()` of `MASK_ALLOW_RAW` alleen wanneer dit absoluut noodzakelijk is

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Zie ook

- Aan de slag met XMF - Basisconcepten van XMF
- XMF-Module-Helper - Modulehelperklasse
- ../XMF-Framework - Kaderoverzicht

---

#xmf #request #security #input-validatie #sanitization