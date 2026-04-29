---
title: "XMF Zahteva"
description: 'Varno HTTP obravnavanje zahtev in preverjanje vnosa z razredom XMF\Request'
---
Razred `XMF\Request` zagotavlja nadzorovan dostop do spremenljivk zahteve HTTP z vgrajeno sanacijo in pretvorbo tipa. Privzeto ščiti pred potencialno škodljivimi vbrizganji, hkrati pa prilagaja vnos določenim vrstam.

## Pregled

Obdelava zahtev je eden najbolj varnostno kritičnih vidikov spletnega razvoja. Razred zahteve XMF:

- Samodejno očisti vnos, da prepreči napade XSS
- Zagotavlja tipsko varne dostopnike za pogoste vrste podatkov
- Podpira več virov zahtev (GET, POST, COOKIE itd.)
- Ponuja dosledno ravnanje s privzetimi vrednostmi

## Osnovna uporaba
```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```
## Metode zahtevka

### getMethod()

Vrne metodo zahteve HTTP za trenutno zahtevo.
```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```
### getVar($name, $default, $hash, $type, $mask)

Osnovna metoda, ki jo prikliče večina drugih `get*()` metod. Pridobi in vrne imenovano spremenljivko iz podatkov zahteve.

**Parametri:**
- `$name` - Ime spremenljivke za pridobivanje
- `$default` - Privzeta vrednost, če spremenljivka ne obstaja
- `$hash` - Zgoščena vrednost vira: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD ali REQUEST (privzeto)
- `$type` - Tip podatkov za čiščenje (glejte Spodaj vrste FilterInput)
- `$mask` - Bitna maska za možnosti čiščenja

**Vrednosti maske:**

| Konstanta maske | Učinek |
|---------------|--------|
| `MASK_NO_TRIM` | Ne obrezujte leading/trailing presledka |
| `MASK_ALLOW_RAW` | Preskoči čiščenje, dovoli neobdelan vnos |
| `MASK_ALLOW_HTML` | Dovoli omejen "varen" nabor oznak HTML |
```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```
## Metode, specifične za vrsto

### getInt($name, $default, $hash)

Vrne celoštevilsko vrednost. Dovoljene so samo številke.
```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```
### getFloat($name, $default, $hash)

Vrne plavajočo vrednost. Dovoljene so samo števke in pike.
```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```
### getBool($name, $default, $hash)

Vrne logično vrednost.
```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```
### getWord($name, $default, $hash)

Vrne niz samo s črkami in podčrtaji `[A-Za-z_]`.
```php
$action = Request::getWord('action', 'view');
```
### getCmd($name, $default, $hash)

Vrne ukazni niz s samo `[A-Za-z0-9.-_]`, prisiljenim v male črke.
```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```
### getString($name, $default, $hash, $mask)

Vrne očiščen niz z odstranjeno slabo kodo HTML (razen če je preglasi maska).
```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```
### getArray($name, $default, $hash)

Vrne matriko, rekurzivno obdelano za odstranitev XSS in napačne kode.
```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```
### getText($name, $default, $hash)

Vrne neobdelano besedilo brez čiščenja. Uporabljajte previdno.
```php
$rawContent = Request::getText('raw_content', '');
```
### getUrl($name, $default, $hash)

Vrne preverjeno spletno URL (samo sheme relativne, http ali https).
```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```
### getPath($name, $default, $hash)

Vrne preverjen datotečni sistem ali spletno pot.
```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash)

Vrne potrjen e-poštni naslov ali privzeti naslov.
```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```
### getIP($name, $default, $hash)

Vrne potrjen naslov IPv4 ali IPv6.
```php
$userIp = Request::getIP('client_ip', '');
```
### getHeader($headerName, $default)

Vrne vrednost glave zahteve HTTP.
```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```
## Uporabne metode

### hasVar($name, $hash)

Preverite, ali obstaja spremenljivka v podani zgoščeni vrednosti.
```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```
### setVar($name, $value, $hash, $overwrite)

Nastavite spremenljivko v podani zgoščeni vrednosti. Vrne prejšnjo vrednost ali nič.
```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```
### get($hash, $mask)

Vrne očiščeno kopijo celotne zgoščene matrike.
```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```
### set($array, $hash, $overwrite)

Nastavi več spremenljivk iz matrike.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```
## Integracija FilterInput

Razred Zahteva uporablja `XMF\FilterInput` za čiščenje. Razpoložljive vrste filtrov:

| Vrsta | Opis |
|------|-------------|
| ALPHANUM / ALNUM | Samo alfanumerično |
| ARRAY | Rekurzivno očisti vsak element |
| BASE64 | Base64 kodiran niz |
| BOOLEAN / BOOL | Res ali napačno |
| CMD | Ukaz - A-Z, 0-9, podčrtaj, pomišljaj, pika (male črke) |
| EMAIL | Veljaven elektronski naslov |
| FLOAT / DOUBLE | Število s plavajočo vejico |
| INTEGER / INT | Celo število |
| IP | Veljaven naslov IP |
| PATH | Datotečni sistem ali spletna pot |
| STRING | Splošni niz (privzeto) |
| USERNAME | Oblika uporabniškega imena |
| WEBURL | Splet URL |
| WORD | Samo črke A-Z in podčrtaj |

## Praktični primeri

### Obdelava obrazca
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
### AJAX Upravljavec
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
### Obrazec za iskanje
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
## Najboljše varnostne prakse

1. **Vedno uporabljajte metode, specifične za vrsto** - Uporabite `getInt()` za ID-je, `getEmail()` za e-pošto itd.

2. **Zagotovite razumne privzete vrednosti** - Nikoli ne domnevajte, da vnos obstaja

3. **Preveri po sanaciji** - Sanitizacija odstrani slabe podatke, validacija zagotavlja pravilne podatke

4. **Uporabite ustrezno zgoščeno vrednost** - Določite POST za podatke obrazca, GET za poizvedbene parametre

5. **Izogibajte se neobdelanemu vnosu** - `getText()` ali `MASK_ALLOW_RAW` uporabite le, kadar je to nujno potrebno.
```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```
## Glej tudi

- Kako začeti z-XMF - Osnovni XMF pojmi
- XMF-Module-Helper - Razred pomočnika modula
- ../XMF-Framework - Pregled okvira

---

#XMF #request #security #input-validation #sanitization