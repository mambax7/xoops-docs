---
title: "XoopsObject-klasse"
description: "Basisklasse voor alle data-objecten in het XOOPS-systeem dat vastgoedbeheer, validatie en serialisatie biedt"
---
De klasse `XoopsObject` is de fundamentele basisklasse voor alle gegevensobjecten in het XOOPS-systeem. Het biedt een gestandaardiseerde interface voor het beheren van objecteigenschappen, validatie, dirty tracking en serialisatie.

## Klassenoverzicht

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

## Klassenhiërarchie

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

## Eigenschappen

| Eigendom | Typ | Zichtbaarheid | Beschrijving |
|----------|------|------------|-----------|
| `$vars` | array | beschermd | Slaat variabeledefinities en waarden op |
| `$cleanVars` | array | beschermd | Slaat opgeschoonde waarden op voor databasebewerkingen |
| `$isNew` | bool | beschermd | Geeft aan of object nieuw is (nog niet in database) |
| `$errors` | array | beschermd | Slaat validatie- en foutmeldingen op |

## Constructeur

```php
public function __construct()
```

Creëert een nieuwe XoopsObject-instantie. Het object wordt standaard als nieuw gemarkeerd.

**Voorbeeld:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Kernmethoden

### initVar

Initialiseert een variabeledefinitie voor het object.

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

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Variabelenaam |
| `$dataType` | int | Gegevenstypeconstante (zie Gegevenstypen) |
| `$value` | gemengd | Standaardwaarde |
| `$required` | bool | Of veld verplicht is |
| `$maxlength` | int | Maximale lengte voor stringtypen |
| `$options` | tekenreeks | Extra opties |

**Gegevenstypen:**

| Constante | Waarde | Beschrijving |
|----------|-------|------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Tekstvakinvoer |
| `XOBJ_DTYPE_TXTAREA` | 2 | Inhoud tekstgebied |
| `XOBJ_DTYPE_INT` | 3 | Geheel getal |
| `XOBJ_DTYPE_URL` | 4 | URL-tekenreeks |
| `XOBJ_DTYPE_EMAIL` | 5 | E-mailadres |
| `XOBJ_DTYPE_ARRAY` | 6 | Geserialiseerde array |
| `XOBJ_DTYPE_OTHER` | 7 | Aangepast type |
| `XOBJ_DTYPE_SOURCE` | 8 | Broncode |
| `XOBJ_DTYPE_STIME` | 9 | Korte tijdsindeling |
| `XOBJ_DTYPE_MTIME` | 10 | Mediumtijdformaat |
| `XOBJ_DTYPE_LTIME` | 11 | Lange tijdnotatie |
| `XOBJ_DTYPE_FLOAT` | 12 | Zwevende komma |
| `XOBJ_DTYPE_DECIMAL` | 13 | Decimaal getal |
| `XOBJ_DTYPE_ENUM` | 14 | Opsomming |

**Voorbeeld:**
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

Stelt de waarde van een variabele in.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Variabelenaam |
| `$value` | gemengd | In te stellen waarde |
| `$notGpc` | bool | Indien waar, komt de waarde niet uit GET/POST/COOKIE |

**Retourneert:** `bool` - True indien succesvol, anders false

**Voorbeeld:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Haalt de waarde van een variabele op met optionele opmaak.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Variabelenaam |
| `$format` | tekenreeks | Uitvoerformaat |

**Formaatopties:**

| Formaat | Beschrijving |
|--------|-------------|
| `'s'` | Weergeven - HTML-entiteiten zijn ontsnapt voor weergave |
| `'e'` | Bewerken - Voor formulierinvoerwaarden |
| `'p'` | Voorbeeld - vergelijkbaar met tonen |
| `'f'` | Formuliergegevens - Ruw voor formulierverwerking |
| `'n'` | Geen - Ruwe waarde, geen opmaak |

**Retourneert:** `mixed` - De opgemaakte waarde

**Voorbeeld:**
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

Stelt meerdere variabelen tegelijk in vanuit een array.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$values` | array | Associatieve array van sleutel => waardeparen |
| `$notGpc` | bool | Indien waar, zijn de waarden niet afkomstig van GET/POST/COOKIE |

**Voorbeeld:**
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

Haalt alle variabelewaarden op.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$keys` | array | Specifieke sleutels om op te halen (null voor alles) |
| `$format` | tekenreeks | Uitvoerformaat |
| `$maxDepth` | int | Maximale diepte voor geneste objecten |

**Retourneert:** `array` - Associatieve reeks waarden

**Voorbeeld:**
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

### toewijzenVar

Wijst direct een waarde toe zonder validatie (gebruik voorzichtig).
```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parameters:**

| Parameter | Typ | Beschrijving |
|-----------|------|------------|
| `$key` | tekenreeks | Variabelenaam |
| `$value` | gemengd | Toe te wijzen waarde |

**Voorbeeld:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### schoneVars

Saniteert alle variabelen voor databasebewerkingen.

```php
public function cleanVars(): bool
```

**Retourneert:** `bool` - Waar als alle variabelen geldig zijn

**Voorbeeld:**
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

### isNieuw

Controleert of stelt in of het object nieuw is.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Voorbeeld:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Methoden voor foutafhandeling

### setErrors

Voegt een foutmelding toe.

```php
public function setErrors(string|array $error): void
```

**Voorbeeld:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Haalt alle foutmeldingen op.

```php
public function getErrors(): array
```

**Voorbeeld:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Retourneert fouten die zijn opgemaakt als HTML.

```php
public function getHtmlErrors(): string
```

**Voorbeeld:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Hulpprogramma's

### naarArray

Converteert het object naar een array.

```php
public function toArray(): array
```

**Voorbeeld:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Retourneert de variabeledefinities.

```php
public function getVars(): array
```

**Voorbeeld:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Compleet gebruiksvoorbeeld

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

## Beste praktijken

1. **Variabelen altijd initialiseren**: definieer alle variabelen in de constructor met `initVar()`

2. **Gebruik de juiste gegevenstypen**: Kies de juiste `XOBJ_DTYPE_*`-constante voor validatie

3. **Ga zorgvuldig om met gebruikersinvoer**: gebruik `setVar()` met `$notGpc = false` voor gebruikersinvoer

4. **Valideren vóór opslaan**: Roep altijd `cleanVars()` aan vóór databasebewerkingen

5. **Gebruik formaatparameters**: gebruik het juiste formaat in `getVar()` voor de context

6. **Uitbreiden voor aangepaste logica**: voeg domeinspecifieke methoden toe in subklassen

## Gerelateerde documentatie

- XoopsObjectHandler - Handlerpatroon voor objectpersistentie
- ../Database/Criteria - Queryopbouw met criteria
- ../Database/XoopsDatabase - Databasebewerkingen

---

*Zie ook: [XOOPS-broncode](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*