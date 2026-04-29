---
title: "XMF Zahtjev"
description: 'Sigurno rukovanje HTTP zahtjevima i provjera valjanosti unosa uz Xmf\Request class'
---
`Xmf\Request` class pruža kontrolirani pristup varijablama HTTP zahtjeva s ugrađenom dezinfekcijom i konverzijom tipa. Štiti od potencijalno štetnih ubrizgavanja prema zadanim postavkama dok usklađuje unos s određenim vrstama.

## Pregled

Rukovanje zahtjevima jedan je od sigurnosno najkritičnijih aspekata web razvoja. Zahtjev XMF class:

- Automatski dezinficira unos kako bi spriječio XSS napade
- Pruža pristupnike sigurne za tipove za uobičajene tipove podataka
- Podržava više izvora zahtjeva (GET, POST, COOKIE, itd.)
- Nudi dosljedno rukovanje zadanom vrijednosti

## Osnovna upotreba

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Metode zahtjeva

### getMethod()

Vraća metodu HTTP zahtjeva za trenutni zahtjev.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Osnovna metoda koju poziva većina drugih metoda `get*()`. Dohvaća i vraća imenovanu varijablu iz podataka zahtjeva.

**Parametri:**
- `$name` - Naziv varijable za dohvaćanje
- `$default` - Zadana vrijednost ako varijabla ne postoji
- `$hash` - Izvorni hash: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD ili REQUEST (zadano)
- `$type` - Vrsta podataka za čišćenje (pogledajte vrste FilterInput u nastavku)
- `$mask` - Bitmaska za opcije čišćenja

**Vrijednosti maske:**

| Konstanta maske | Učinak |
|---------------|--------|
| `MASK_NO_TRIM` | Nemojte skraćivati ​​razmak na početku/završetku |
| `MASK_ALLOW_RAW` | Preskoči čišćenje, dopusti sirovi unos |
| `MASK_ALLOW_HTML` | Dopusti ograničeni "siguran" skup oznaka HTML |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Metode specifične za tip

### getInt($name, $default, $hash)

Vraća vrijednost cijelog broja. Dopuštene su samo znamenke.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Vraća float vrijednost. Dopuštene su samo znamenke i točke.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Vraća Booleovu vrijednost.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Vraća niz samo sa slovima i podvlakama `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Vraća naredbeni niz samo sa `[A-Za-z0-9.-_]`, prisiljen malim slovima.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Vraća očišćeni niz s uklonjenim pogrešnim kodom HTML (osim ako ga maska ne poništi).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Vraća niz, rekurzivno obrađen radi uklanjanja XSS-a i lošeg koda.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Vraća neobrađeni tekst bez čišćenja. Koristite s oprezom.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Vraća potvrđeni web URL (samo relativne, http ili https sheme).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Vraća potvrđeni datotečni sustav ili web stazu.

```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash)

Vraća potvrđenu adresu e-pošte ili zadanu.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Vraća potvrđenu IPv4 ili IPv6 adresu.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Vraća vrijednost zaglavlja HTTP zahtjeva.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Korisne metode

### hasVar($name, $hash)

Provjerite postoji li varijabla u navedenom hash-u.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Postavite varijablu u navedeni hash. Vraća prethodnu vrijednost ili null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Vraća očišćenu kopiju cijelog raspršenog polja.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set ($array, $hash, $overwrite)

Postavlja više varijabli iz niza.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput integracija

Zahtjev class koristi `Xmf\FilterInput` za čišćenje. Dostupne vrste filtera:

| Upišite | Opis |
|------|-------------|
| ALPHANUM / ALNUM | Samo alfanumerički |
| NIZ | Rekurzivno očistite svaki element |
| BASE64 | Base64 kodirani niz |
| BOOLEAN / BOOL | Točno ili netočno |
| CMD | Naredba - A-Z, 0-9, podvlaka, crtica, točka (mala slova) |
| E-POŠTA | Važeća email adresa |
| PLOVAK / DUPLO | Broj s pomičnim zarezom |
| CIJELI BROJ / INT | Cijela vrijednost |
| IP | Valjana IP adresa |
| PUT | Datotečni sustav ili web put |
| STRING | Opći niz (zadano) |
| KORISNIČKO IME | Format korisničkog imena |
| WEBURL | Web URL |
| RIJEČ | Samo slova A-Z i podvlaka |

## Praktični primjeri

### Obrada obrazaca

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

### AJAX rukovatelj

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

### Paginacija

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

### Obrazac za pretraživanje

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

## Najbolje sigurnosne prakse

1. **Uvijek koristite metode specifične za vrstu** - koristite `getInt()` za ID-ove, `getEmail()` za e-poštu itd.

2. **Omogućite razumne zadane postavke** - Nikad ne pretpostavljajte da unos postoji

3. **Validirajte nakon dezinfekcije** - dezinfekcija uklanja loše podatke, validacija osigurava točne podatke

4. **Koristite odgovarajući hash** - Navedite POST za podatke obrasca, GET za parametre upita

5. **Izbjegavajte neobrađeni unos** - `getText()` ili `MASK_ALLOW_RAW` koristite samo kada je to apsolutno neophodno

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Vidi također

- Početak rada sa XMF - Osnovni koncepti XMF
- XMF-Module-Helper - Module helper class
- ../XMF-Framework - Pregled okvira

---

#xmf #request #security #input-validation #sanitization
