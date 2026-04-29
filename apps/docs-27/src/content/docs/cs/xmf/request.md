---
title: "Požadavek XMF"
description: 'Bezpečné zpracování požadavků HTTP a ověření vstupu pomocí třídy Xmf\Request'
---

Třída `XMF\Request` poskytuje řízený přístup k proměnným požadavku HTTP s vestavěnou sanitací a konverzí typu. Ve výchozím nastavení chrání před potenciálně škodlivými injekcemi a zároveň přizpůsobuje vstup specifikovaným typům.

## Přehled

Zpracování požadavků je jedním z nejdůležitějších bezpečnostních aspektů vývoje webu. Třída požadavku XMF:

- Automaticky dezinfikuje vstup, aby se zabránilo útokům XSS
- Poskytuje typově bezpečné přístupové objekty pro běžné typy dat
- Podporuje více zdrojů požadavků (GET, POST, COOKIE atd.)
- Nabízí konzistentní zpracování výchozích hodnot

## Základní použití

```php
use XMF\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Metody požadavku

### getMethod()

Vrátí metodu požadavku HTTP pro aktuální požadavek.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Základní metoda, kterou vyvolává většina ostatních metod `get*()`. Načte a vrátí pojmenovanou proměnnou z dat požadavku.

**Parametry:**
- `$name` - Název proměnné k načtení
- `$default` - Výchozí hodnota, pokud proměnná neexistuje
- `$hash` - Zdroj hash: GET, POST, FILES, COOKIE, ENV, ZX01XQ09001, ZX01XQ0001 nebo REQUEST (výchozí)
- `$type` - Typ dat pro čištění (viz typy vstupu filtru níže)
- `$mask` - Bitová maska pro možnosti čištění

**Hodnoty masky:**

| Maska konstantní | Efekt |
|---------------|--------|
| `MASK_NO_TRIM` | Neořezávejte mezery leading/trailing |
| `MASK_ALLOW_RAW` | Přeskočit čištění, povolit vstup surového |
| `MASK_ALLOW_HTML` | Povolit omezenou „bezpečnou“ sadu značek HTML |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Typově specifické metody

### getInt($name, $default, $hash)

Vrátí celočíselnou hodnotu. Jsou povoleny pouze číslice.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

Vrátí plovoucí hodnotu. Jsou povoleny pouze číslice a tečky.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

Vrátí booleovskou hodnotu.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

Vrátí řetězec obsahující pouze písmena a podtržítka `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Vrátí příkazový řetězec pouze se `[A-Za-z0-9.-_]`, vynucený na malá písmena.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Vrátí vyčištěný řetězec s odstraněným špatným kódem HTML (pokud není přepsán maskou).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Vrátí pole, rekurzivně zpracované k odstranění XSS a špatného kódu.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Vrátí nezpracovaný text bez čištění. Používejte opatrně.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Vrátí ověřený web URL (pouze schémata relativní, http nebo https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

Vrátí ověřený souborový systém nebo webovou cestu.

```php
$filePath = Request::getPath('file', '');
```

### getEmail($name, $default, $hash)

Vrátí ověřenou e-mailovou adresu nebo výchozí.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

Vrátí ověřenou adresu IPv4 nebo IPv6.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Vrátí hodnotu záhlaví požadavku HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Užitkové metody

### hasVar($name, $hash)

Zkontrolujte, zda v zadaném hashu existuje proměnná.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Nastavte proměnnou v zadaném hash. Vrátí předchozí hodnotu nebo null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### získat ($hash, $mask)

Vrátí vyčištěnou kopii celého pole hash.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### sada ($array, $hash, $overwrite)

Nastaví více proměnných z pole.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## Integrace vstupu filtru

Třída Request používá k čištění `XMF\FilterInput`. Dostupné typy filtrů:| Typ | Popis |
|------|--------------|
| ALPHANUM / ALNUM | Pouze alfanumerické |
| ARRAY | Rekurzivně vyčistěte každý prvek |
| BASE64 | Base64 kódovaný řetězec |
| BOOLEAN / BOOL | Pravda nebo nepravda |
| CMD | Příkaz - A-Z, 0-9, podtržítko, pomlčka, tečka (malá písmena) |
| EMAIL | Platná emailová adresa |
| FLOAT / DOUBLE | Číslo s plovoucí desetinnou čárkou |
| INTEGER / INT | Celočíselná hodnota |
| IP | Platná IP adresa |
| PATH | Souborový systém nebo webová cesta |
| STRING | Obecný řetězec (výchozí) |
| USERNAME | Formát uživatelského jména |
| WEBURL | Web URL |
| WORD | Pouze písmena A-Z a podtržítko |

## Praktické příklady

### Zpracování formuláře

```php
use XMF\Request;

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

### Manipulátor AJAX

```php
use XMF\Request;

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

### Stránkování

```php
use XMF\Request;

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

### Vyhledávací formulář

```php
use XMF\Request;

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

## Nejlepší bezpečnostní postupy

1. **Vždy používejte metody specifické pro daný typ** – Pro ID použijte `getInt()`, pro e-maily `getEmail()` atd.

2. **Uveďte rozumné výchozí hodnoty** - Nikdy nepředpokládejte, že vstup existuje

3. **Validate after sanitization** – Sanitizace odstraní špatná data, validace zajistí správná data

4. **Použijte vhodný hash** – Zadejte POST pro data formuláře, GET pro parametry dotazu

5. **Vyhněte se nezpracovaným vstupům** – `getText()` nebo `MASK_ALLOW_RAW` používejte pouze tehdy, je-li to nezbytně nutné

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Viz také

- Začínáme s-XMF - Základní koncepty XMF
- XMF-Module-Helper - Třída pomocníka modulu
- ../XMF-Framework - Přehled rámce

---

#xmf #request #security #input-validation #sanitization