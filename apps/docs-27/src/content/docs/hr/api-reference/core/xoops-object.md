---
title: "XoopsObject klasa"
description: "Baza class za sve podatkovne objekte u sustavu XOOPS koji pruža upravljanje svojstvima, provjeru valjanosti i serijalizaciju"
---
`XoopsObject` class temeljna je baza class za sve podatkovne objekte u sustavu XOOPS. Omogućuje standardizirano sučelje za upravljanje svojstvima objekta, provjeru valjanosti, prljavo praćenje i serijalizaciju.

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

## Hijerarhija klasa

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

## Svojstva

| Vlasništvo | Upišite | Vidljivost | Opis |
|----------|------|------------|-------------|
| `$vars` | niz | zaštićen | Pohranjuje definicije varijabli i vrijednosti |
| `$cleanVars` | niz | zaštićen | Pohranjuje sanirane vrijednosti za operacije baze podataka |
| `$isNew` | bool | zaštićen | Označava je li objekt nov (još nije u bazi podataka) |
| `$errors` | niz | zaštićen | Pohranjuje provjere valjanosti i poruke o pogreškama |

## Konstruktor

```php
public function __construct()
```

Stvara novu instancu XoopsObject. Objekt je prema zadanim postavkama označen kao nov.

**Primjer:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Temeljne metode

### initVar

Inicijalizira definiciju varijable za objekt.

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

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime varijable |
| `$dataType` | int | Konstanta tipa podataka (vidi Vrste podataka) |
| `$value` | mješoviti | Zadana vrijednost |
| `$required` | bool | Je li polje obavezno |
| `$maxlength` | int | Maksimalna duljina za vrste nizova |
| `$options` | niz | Dodatne mogućnosti |

**Vrste podataka:**

| Konstanta | Vrijednost | Opis |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Unos tekstualnog okvira |
| `XOBJ_DTYPE_TXTAREA` | 2 | Tekstualni sadržaj |
| `XOBJ_DTYPE_INT` | 3 | Cijela vrijednost |
| `XOBJ_DTYPE_URL` | 4 | URL niz |
| `XOBJ_DTYPE_EMAIL` | 5 | Adresa e-pošte |
| `XOBJ_DTYPE_ARRAY` | 6 | Serializirano polje |
| `XOBJ_DTYPE_OTHER` | 7 | Prilagođeni tip |
| `XOBJ_DTYPE_SOURCE` | 8 | Izvorni kod |
| `XOBJ_DTYPE_STIME` | 9 | Kratkotrajni format |
| `XOBJ_DTYPE_MTIME` | 10 | Srednji vremenski format |
| `XOBJ_DTYPE_LTIME` | 11 | Dugotrajni format |
| `XOBJ_DTYPE_FLOAT` | 12 | Pokretni zarez |
| `XOBJ_DTYPE_DECIMAL` | 13 | Decimalni broj |
| `XOBJ_DTYPE_ENUM` | 14 | Nabrajanje |

**Primjer:**
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

Postavlja vrijednost varijable.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime varijable |
| `$value` | mješoviti | Vrijednost za postavljanje |
| `$notGpc` | bool | Ako je istina, vrijednost nije iz GET/POST/COOKIE |

**Vraća:** `bool` - True ako je uspješno, false u suprotnom

**Primjer:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Dohvaća vrijednost varijable s neobaveznim oblikovanjem.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime varijable |
| `$format` | niz | Izlazni format |

**Opcije formata:**

| Format | Opis |
|--------|-------------|
| `'s'` | Prikaži - HTML entiteti izbjegnuti za prikaz |
| `'e'` | Uredi - Za unos vrijednosti obrasca |
| `'p'` | Pregled - Slično prikazu |
| `'f'` | Podaci obrasca - sirovina za obradu obrasca |
| `'n'` | Ništa - sirova vrijednost, bez oblikovanja |**Vraća:** `mixed` - Formatirana vrijednost

**Primjer:**
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

Postavlja više varijabli odjednom iz niza.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$values` | niz | Asocijativni niz parova ključ => vrijednost |
| `$notGpc` | bool | Ako je točno, vrijednosti nisu iz GET/POST/COOKIE |

**Primjer:**
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

Dohvaća sve vrijednosti varijabli.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$keys` | niz | Specifični ključevi za dohvaćanje (nula za sve) |
| `$format` | niz | Izlazni format |
| `$maxDepth` | int | Maksimalna dubina za ugniježđene objekte |

**Vraća:** `array` - Asocijativni niz vrijednosti

**Primjer:**
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

### dodijeli Var

Dodjeljuje vrijednost izravno bez provjere valjanosti (koristite s oprezom).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parametri:**

| Parametar | Upišite | Opis |
|-----------|------|-------------|
| `$key` | niz | Ime varijable |
| `$value` | mješoviti | Vrijednost za dodjelu |

**Primjer:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Čisti sve varijable za operacije baze podataka.

```php
public function cleanVars(): bool
```

**Vraća:** `bool` - Istina ako su sve varijable važeće

**Primjer:**
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

Provjerava ili postavlja je li objekt nov.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Primjer:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Metode rukovanja pogreškama

### setErrors

Dodaje poruku o pogrešci.

```php
public function setErrors(string|array $error): void
```

**Primjer:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Dohvaća sve poruke o pogreškama.

```php
public function getErrors(): array
```

**Primjer:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Vraća pogreške formatirane kao HTML.

```php
public function getHtmlErrors(): string
```

**Primjer:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Korisne metode

### u niz

Pretvara objekt u polje.

```php
public function toArray(): array
```

**Primjer:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Vraća definicije varijabli.

```php
public function getVars(): array
```

**Primjer:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Kompletan primjer upotrebe

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

## Najbolji primjeri iz prakse

1. **Uvijek inicijaliziraj varijable**: Definirajte sve varijable u konstruktoru pomoću `initVar()`

2. **Koristite odgovarajuće vrste podataka**: Odaberite ispravnu `XOBJ_DTYPE_*` konstantu za provjeru valjanosti

3. **Pažljivo postupajte s korisničkim unosom**: koristite `setVar()` sa `$notGpc = false` za korisnički unos

4. **Provjeri prije spremanja**: Uvijek pozovite `cleanVars()` prije operacija baze podataka

5. **Koristite parametre formata**: Koristite odgovarajući format u `getVar()` za kontekst

6. **Proširi prilagođenu logiku**: Dodajte metode specifične za domenu u potklase

## Povezana dokumentacija

- XoopsObjectHandler - Uzorak rukovatelja za postojanost objekta
- ../Database/Criteria - Izgradnja upita s kriterijima
- ../Database/XoopsDatabase - Operacije baze podataka

---

*Vidi također: [XOOPS izvorni kod](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
