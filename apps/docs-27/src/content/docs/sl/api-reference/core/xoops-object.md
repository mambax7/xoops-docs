---
title: "Razred XoopsObject"
description: "Osnovni razred za vse podatkovne objekte v sistemu XOOPS, ki zagotavlja upravljanje lastnosti, validacijo in serializacijo"
---
Razred `XoopsObject` je osnovni osnovni razred za vse podatkovne objekte v sistemu XOOPS. Zagotavlja standardiziran vmesnik za upravljanje lastnosti objektov, preverjanje, umazano sledenje in serializacijo.

## Pregled razreda
```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```
## Hierarhija razreda
```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```
## Lastnosti

| Lastnina | Vrsta | Vidnost | Opis |
|----------|------|------------|-------------|
| `$vars` | niz | zaščiten | Shranjuje definicije in vrednosti spremenljivk |
| `$cleanVars` | niz | zaščiten | Shranjuje prečiščene vrednosti za operacije baze podatkov |
| `$isNew` | bool | zaščiten | Označuje, ali je objekt nov (še ni v bazi podatkov) |
| `$errors` | niz | zaščiten | Shranjuje potrditvena sporočila in sporočila o napakah |

## Konstruktor
```php
public function __construct()
```
Ustvari nov primerek XoopsObject. Predmet je privzeto označen kot nov.

**Primer:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## Temeljne metode

### initVar

Inicializira definicijo spremenljivke za objekt.
```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime spremenljivke |
| `$dataType` | int | Konstanta podatkovnega tipa (glejte Podatkovne vrste) |
| `$value` | mešano | Privzeta vrednost |
| `$required` | bool | Ali je polje obvezno |
| `$maxlength` | int | Največja dolžina za vrste nizov |
| `$options` | niz | Dodatne možnosti |

**Vrste podatkov:**

| Konstanta | Vrednost | Opis |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Vnos besedilnega polja |
| `XOBJ_DTYPE_TXTAREA` | 2 | Vsebina besedilnega polja |
| `XOBJ_DTYPE_INT` | 3 | Celo število |
| `XOBJ_DTYPE_URL` | 4 | URL niz |
| `XOBJ_DTYPE_EMAIL` | 5 | E-poštni naslov |
| `XOBJ_DTYPE_ARRAY` | 6 | Serializirano polje |
| `XOBJ_DTYPE_OTHER` | 7 | Vrsta po meri |
| `XOBJ_DTYPE_SOURCE` | 8 | Izvorna koda |
| `XOBJ_DTYPE_STIME` | 9 | Kratek časovni format |
| `XOBJ_DTYPE_MTIME` | 10 | Srednji časovni format |
| `XOBJ_DTYPE_LTIME` | 11 | Dolgotrajna oblika |
| `XOBJ_DTYPE_FLOAT` | 12 | Plavajoča vejica |
| `XOBJ_DTYPE_DECIMAL` | 13 | Decimalno število |
| `XOBJ_DTYPE_ENUM` | 14 | Naštevanje |

**Primer:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```
---

### setVar

Nastavi vrednost spremenljivke.
```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime spremenljivke |
| `$value` | mešano | Vrednost za nastavitev |
| `$notGpc` | bool | Če je res, vrednost ni od GET/POST/COOKIE |

**Vrne:** `bool` - True, če je uspešno, false v nasprotnem primeru

**Primer:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

### getVar

Pridobi vrednost spremenljivke z neobveznim oblikovanjem.
```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime spremenljivke |
| `$format` | niz | Izhodni format |

**Možnosti oblike:**

| Oblika | Opis |
|--------|-------------|
| `'s'` | Prikaži - HTML entitet, ubežnih za prikaz |
| `'e'` | Uredi - Za vnosne vrednosti obrazca |
| `'p'` | Predogled - Podobno prikazu |
| `'f'` | Podatki obrazca – Surovi za obdelavo obrazca |
| `'n'` | Brez – neobdelana vrednost, brez oblikovanja |

**Vrne:** `mixed` - Oblikovana vrednost

**Primer:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```
---

### setVars

Nastavi več spremenljivk hkrati iz matrike.
```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$values` | niz | Asociativno polje parov ključ => vrednost |
| `$notGpc` | bool | Če je res, vrednosti niso od GET/POST/COOKIE |

**Primer:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```
---

### getValues

Pridobi vse vrednosti spremenljivk.
```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$keys` | niz | Posebni ključi za pridobitev (null za vse) |
| `$format` | niz | Izhodni format |
| `$maxDepth` | int | Največja globina za ugnezdene objekte |

**Vrne:** `array` - Asociativni niz vrednosti

**Primer:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```
---

### dodeliVar

Dodeli vrednost neposredno brez preverjanja (uporabljajte previdno).
```php
public function assignVar(
    string $key,
    mixed $value
): void
```
**Parametri:**

| Parameter | Vrsta | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime spremenljivke |
| `$value` | mešano | Vrednost za dodelitev |

**Primer:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### cleanVars

Prečisti vse spremenljivke za operacije baze podatkov.
```php
public function cleanVars(): bool
```
**Vrne:** `bool` - True, če so vse spremenljivke veljavne

**Primer:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```
---

### je novo

Preveri ali nastavi, ali je predmet nov.
```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**Primer:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## Metode za odpravljanje napak

### setErrors

Doda sporočilo o napaki.
```php
public function setErrors(string|array $error): void
```
**Primer:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### getErrors

Pridobi vsa sporočila o napakah.
```php
public function getErrors(): array
```
**Primer:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrors

Vrne napake v obliki HTML.
```php
public function getHtmlErrors(): string
```
**Primer:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## Uporabne metode

### v niz

Pretvori predmet v matriko.
```php
public function toArray(): array
```
**Primer:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### getVars

Vrne definicije spremenljivk.
```php
public function getVars(): array
```
**Primer:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## Celoten primer uporabe
```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```
## Najboljše prakse

1. **Vedno inicializiraj spremenljivke**: Definirajte vse spremenljivke v konstruktorju z uporabo `initVar()`

2. **Uporabite ustrezne tipe podatkov**: izberite pravilno konstanto `XOBJ_DTYPE_*` za preverjanje

3. **Previdno ravnajte z uporabniškim vnosom**: Uporabite `setVar()` z `$notGpc = false` za uporabniški vnos

4. **Preveri pred shranjevanjem**: vedno pokličite `cleanVars()` pred operacijami baze podatkov

5. **Uporabi parametre formata**: Uporabi ustrezno obliko v `getVar()` za kontekst

6. **Razširitev za logiko po meri**: Dodajte domensko specifične metode v podrazrede

## Povezana dokumentacija

- XoopsObjectHandler - vzorec upravljalnika za obstojnost objekta
- ../Database/Criteria - Gradnja poizvedbe s kriteriji
- ../Database/XoopsDatabase - Podatkovne operacije

---

*Glejte tudi: [XOOPS Izvorna koda](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*