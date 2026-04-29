---
title: "XOOPSObject osztály"
description: "Alaposztály a XOOPS rendszer összes adatobjektumához, amely tulajdonságkezelést, érvényesítést és szerializálást biztosít"
---
A `XOOPSObject` osztály a XOOPS rendszer összes adatobjektumának alapvető alaposztálya. Szabványosított felületet biztosít az objektumtulajdonságok kezeléséhez, az érvényesítéshez, a piszkos nyomkövetéshez és a szerializáláshoz.

## Osztály áttekintése

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

## Osztályhierarchia

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

## Tulajdonságok

| Ingatlan | Típus | Láthatóság | Leírás |
|----------|------|------------|--------------|
| `$vars` | tömb | védett | Változódefiníciókat és értékeket tárol |
| `$cleanVars` | tömb | védett | Megtisztított értékeket tárol az adatbázis-műveletekhez |
| `$isNew` | bool | védett | Azt jelzi, ha az objektum új (még nincs az adatbázisban) |
| `$errors` | tömb | védett | Az érvényesítési és hibaüzeneteket tárolja |

## Konstruktor

```php
public function __construct()
```

Létrehoz egy új XOOPSObject példányt. Az objektum alapértelmezés szerint újként van megjelölve.

**Példa:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Alapvető módszerek

### initVar

Inicializálja az objektum változódefinícióját.

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

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Változó neve |
| `$dataType` | int | Adattípus állandó (lásd Adattípusok) |
| `$value` | vegyes | Alapértelmezett érték |
| `$required` | bool | A mező kitöltése kötelező |
| `$maxlength` | int | A karakterlánctípusok maximális hossza |
| `$options` | húr | További lehetőségek |

**Adattípusok:**

| Állandó | Érték | Leírás |
|----------|-------|--------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Szövegdoboz bevitele |
| `XOBJ_DTYPE_TXTAREA` | 2 | Szövegterület tartalma |
| `XOBJ_DTYPE_INT` | 3 | Egész érték |
| `XOBJ_DTYPE_URL` | 4 | URL karakterlánc |
| `XOBJ_DTYPE_EMAIL` | 5 | E-mail cím |
| `XOBJ_DTYPE_ARRAY` | 6 | Sorosozott tömb |
| `XOBJ_DTYPE_OTHER` | 7 | Egyedi típus |
| `XOBJ_DTYPE_SOURCE` | 8 | Forráskód |
| `XOBJ_DTYPE_STIME` | 9 | Rövid időformátum |
| `XOBJ_DTYPE_MTIME` | 10 | Közepes idejű formátum |
| `XOBJ_DTYPE_LTIME` | 11 | Hosszú távú formátum |
| `XOBJ_DTYPE_FLOAT` | 12 | Lebegőpontos |
| `XOBJ_DTYPE_DECIMAL` | 13 | Tizedes szám |
| `XOBJ_DTYPE_ENUM` | 14 | Felsorolás |

**Példa:**
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

Beállítja egy változó értékét.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Változó neve |
| `$value` | vegyes | Beállítandó érték |
| `$notGpc` | bool | Ha igaz, az érték nem a GET/POST/COOKIE |

**Vissza:** `bool` - Sikeres esetén igaz, ellenkező esetben hamis

**Példa:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Lekéri egy változó értékét opcionális formázással.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Változó neve |
| `$format` | húr | Kimeneti formátum |

**Formázási lehetőségek:**

| Formátum | Leírás |
|--------|--------------|
| `'s'` | Megjelenítés – HTML entitások a megjelenítéshez |
| `'e'` | Szerkesztés - Form bemeneti értékekhez |
| `'p'` | Előnézet - Hasonló a bemutatóhoz |
| `'f'` | Űrlapadatok - Nyers adatlapfeldolgozáshoz |
| `'n'` | Nincs – Nyers érték, formázás nélkül |

**Vissza:** `mixed` – A formázott érték

**Példa:**
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

Több változót állít be egyszerre egy tömbből.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$values` | tömb | Kulcsok asszociatív tömbje => értékpárok |
| `$notGpc` | bool | Ha igaz, az értékek nem a GET/POST/COOKIE |

**Példa:**
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

Lekéri az összes változó értékét.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Paraméterek:**

| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$keys` | tömb | Konkrét lekérendő kulcsok (null az összeshez) |
| `$format` | húr | Kimeneti formátum |
| `$maxDepth` | int | Maximális mélység beágyazott objektumokhoz |

**Vissza:** `array` – Értékek asszociatív tömbje

**Példa:**
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

### assignVar

Közvetlenül, ellenőrzés nélkül rendel értéket (használja óvatosan).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Paraméterek:**| Paraméter | Típus | Leírás |
|-----------|------|--------------|
| `$key` | húr | Változó neve |
| `$value` | vegyes | Hozzárendelendő érték |

**Példa:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Megtisztítja az összes változót az adatbázis-műveletek számára.

```php
public function cleanVars(): bool
```

**Vissza:** `bool` - Igaz, ha minden változó érvényes

**Példa:**
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

### új

Ellenőrzi vagy beállítja, hogy az objektum új-e.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Példa:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Hibakezelési módszerek

### setErrors

Hibaüzenetet ad hozzá.

```php
public function setErrors(string|array $error): void
```

**Példa:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Lekéri az összes hibaüzenetet.

```php
public function getErrors(): array
```

**Példa:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

A HTML formátumú hibákat adja vissza.

```php
public function getHtmlErrors(): string
```

**Példa:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Hasznossági módszerek

### toArray

Az objektumot tömbbé alakítja.

```php
public function toArray(): array
```

**Példa:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

A változó definícióit adja vissza.

```php
public function getVars(): array
```

**Példa:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Teljes használati példa

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

## Bevált gyakorlatok

1. **Mindig inicializálja a változókat**: Határozza meg az összes változót a konstruktorban a `initVar()` használatával

2. **Használjon megfelelő adattípusokat**: Válassza ki a megfelelő `XOBJ_DTYPE_*` állandót az érvényesítéshez

3. **Óvatosan kezelje a felhasználói bevitelt**: Használja a `setVar()`-t a `$notGpc = false`-val a felhasználói bevitelhez

4. **Ellenőrzés mentés előtt**: Mindig hívja a `cleanVars()`-t az adatbázis-műveletek előtt

5. **Formátumparaméterek használata**: Használja a megfelelő formátumot a `getVar()`-ban a kontextushoz

6. **Extend for Custom Logic**: Domain-specifikus metódusok hozzáadása az alosztályokhoz

## Kapcsolódó dokumentáció

- XOOPSObjectHandler - Kezelőminta az objektumok fennmaradásához
- ../Database/Criteria - Lekérdezési épület kritériumokkal
- ../Database/XOOPSDatabase - Adatbázisműveletek

---

*Lásd még: [XOOPS forráskód](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/xoopsobject.php)*
