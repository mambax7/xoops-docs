---
title: "XMF-kérés"
description: "Biztonságos HTTP kéréskezelés és bemenet ellenőrzése az XMF\Request osztály segítségével"
---
A `XMF\Request` osztály szabályozott hozzáférést biztosít a HTTP kérési változókhoz, beépített fertőtlenítéssel és típuskonverzióval. Alapértelmezés szerint véd a potenciálisan káros injekciók ellen, miközben megfelel a megadott típusoknak.

## Áttekintés

A kérések kezelése a webfejlesztés egyik biztonság szempontjából kritikus szempontja. A XMF kérési osztály:

- Automatikusan megtisztítja a bemenetet a XSS támadások megelőzése érdekében
- Típusbiztos hozzáférést biztosít a gyakori adattípusokhoz
- Több kérésforrást támogat (GET, POST, COOKIE stb.)
- Konzisztens alapértelmezett értékkezelést kínál

## Alapvető használat

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Kérési módszerek

### getMethod()

Az aktuális kérés HTTP kérési metódusát adja vissza.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Az alapvető metódus, amelyet a legtöbb `get*()` metódus hív meg. Lekér és visszaad egy elnevezett változót a kérésadatokból.

**Paraméterek:**
- `$name` - A lekérendő változó neve
- `$default` - Alapértelmezett érték, ha a változó nem létezik
- `$hash` - Forrás hash: GET, POST, FILES, COOKIE, QZXPH00012Q4H SERVER, METHOD vagy REQUEST (alapértelmezett)
- `$type` - Adattípus a tisztításhoz (lásd alább a szűrőbemeneti típusokat)
- `$mask` - Bitmaszk a tisztítási lehetőségekhez

**Maszkértékek:**

| Maszk Állandó | Hatás |
|---------------|--------|
| `MASK_NO_TRIM` | Ne vágja le a leading/trailing szóközt |
| `MASK_ALLOW_RAW` | Tisztítás kihagyása, nyers bevitel engedélyezése |
| `MASK_ALLOW_HTML` | A HTML jelölés korlátozott "biztonságos" készletének engedélyezése |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Típusspecifikus módszerek

### getInt($name, $default, $hash)

Egész értéket ad vissza. Csak számjegyek megengedettek.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat ($name, $default, $hash)

Lebegő értéket ad vissza. Csak számjegyek és pontok megengedettek.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Logikai értéket ad vissza.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord ($name, $default, $hash)

Olyan karakterláncot ad vissza, amely csak betűket és aláhúzásjeleket tartalmaz. `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Egy parancssort ad vissza, csak `[A-Za-z0-9.-_]`-val, kisbetűre kényszerítve.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Megtisztított karakterláncot ad vissza, rossz HTML kóddal (kivéve, ha a maszk felülírja).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Egy tömböt ad vissza, rekurzív feldolgozással a XSS és a rossz kód eltávolításához.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText ($name, $default, $hash)

Nyers szöveget ad vissza tisztítás nélkül. Óvatosan használja.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl ($name, $default, $hash)

Érvényesített webes URL-t ad vissza (csak relatív, http vagy https sémák esetén).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Érvényesített fájlrendszert vagy webes elérési utat ad vissza.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Érvényesített e-mail címet vagy az alapértelmezettet ad vissza.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP ($name, $default, $hash)

Érvényesített IPv4- vagy IPv6-címet ad vissza.

```php
$userIp = Request::getIP('client_ip', '');
```

### get Header ($headerName, $default)

A HTTP kérésfejléc értékét adja vissza.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Hasznossági módszerek

### hasVar($name, $hash)

Ellenőrizze, hogy létezik-e változó a megadott hashben.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Állítson be egy változót a megadott hashben. Az előző értéket vagy nullát adja vissza.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

Egy teljes hash tömb tisztított másolatát adja vissza.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### készlet ($array, $hash, $overwrite)

Több változót állít be egy tömbből.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## FilterInput integráció

A Request osztály a `XMF\FilterInput`-t használja a tisztításhoz. Elérhető szűrőtípusok:

| Típus | Leírás |
|------|--------------|
| ALPHANUM / ALNUM | Csak alfanumerikus |
| ARRAY | Minden elem rekurzív tisztítása |
| BASE64 | Base64 kódolású karakterlánc |
| BOOLEAN / BOOL | Igaz vagy hamis |
| CMD | Parancs - A-Z, 0-9, aláhúzás, kötőjel, pont (kisbetű) |
| EMAIL | Érvényes e-mail cím |
| FLOAT / DOUBLE | Lebegőpontos szám |
| INTEGER / INT | Egész érték |
| IP | Érvényes IP-cím |
| PATH | Fájlrendszer vagy webes elérési út |
| STRING | Általános karakterlánc (alapértelmezett) |
| USERNAME | Felhasználónév formátuma |
| WEBURL | Web URL |
| WORD | Csak A-Z betűk és aláhúzás |

## Gyakorlati példák

### Űrlap feldolgozás

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

### AJAX Kezelő

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

### Lapozás

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

### Keresési űrlap

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

## Biztonsági bevált gyakorlatok

1. **Mindig típusspecifikus módszereket használjon** - Használja a `getInt()`-t azonosítókhoz, `getEmail()`-t e-mailekhez stb.

2. **Érzékeny alapértelmezett értékeket adjon meg** - Soha ne feltételezze, hogy létezik bemenet

3. **Érvényesítés a fertőtlenítés után** – A fertőtlenítés eltávolítja a rossz adatokat, az érvényesítés biztosítja a helyes adatokat

4. **Használjon megfelelő hash-t** - Adja meg a POST-t űrlapadatokhoz, GET-t a lekérdezési paraméterekhez

5. **Kerülje a nyers bevitelt** - Csak akkor használja a `getText()` vagy `MASK_ALLOW_RAW`-t, ha feltétlenül szükséges

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Lásd még

- Kezdő lépések a XMF-val - Alapvető XMF-koncepciók
- XMF-modul-Helper - modul segítő osztály
- ../XMF-Framework - A keretrendszer áttekintése

---

#xmf #kérés #biztonság #bevitel-ellenőrzés #fertőtlenítés
