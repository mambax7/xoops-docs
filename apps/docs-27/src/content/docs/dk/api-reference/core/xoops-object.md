---
title: "XoopsObject klasse"
description: "Basisklasse for alle dataobjekter i XOOPS-systemet, der leverer ejendomsadministration, validering og serialisering"
---

Klassen `XoopsObject` er den grundlæggende basisklasse for alle dataobjekter i XOOPS-systemet. Det giver en standardiseret grænseflade til styring af objektegenskaber, validering, dirty tracking og serialisering.

## Klasseoversigt

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

## Klassehierarki

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

## Egenskaber

| Ejendom | Skriv | Synlighed | Beskrivelse |
|--------|------|--------|------------|
| `$vars` | række | beskyttet | Gemmer variable definitioner og værdier |
| `$cleanVars` | række | beskyttet | Gemmer rensede værdier til databaseoperationer |
| `$isNew` | bool | beskyttet | Angiver om objektet er nyt (endnu ikke i databasen) |
| `$errors` | række | beskyttet | Gemmer validerings- og fejlmeddelelser |

## Konstruktør

```php
public function __construct()
```

Opretter en ny XoopsObject-instans. Objektet er markeret som nyt som standard.

**Eksempel:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## Kernemetoder

### initVar

Initialiserer en variabeldefinition for objektet.

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

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$key` | streng | Variabelnavn |
| `$dataType` | int | Datatypekonstant (se Datatyper) |
| `$value` | blandet | Standardværdi |
| `$required` | bool | Om felt er påkrævet |
| `$maxlength` | int | Maksimal længde for strengtyper |
| `$options` | streng | Yderligere muligheder |

**Datatyper:**

| Konstant | Værdi | Beskrivelse |
|--------|--------|------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Indtastning af tekstboks |
| `XOBJ_DTYPE_TXTAREA` | 2 | Tekstområdeindhold |
| `XOBJ_DTYPE_INT` | 3 | Heltalsværdi |
| `XOBJ_DTYPE_URL` | 4 | URL streng |
| `XOBJ_DTYPE_EMAIL` | 5 | E-mailadresse |
| `XOBJ_DTYPE_ARRAY` | 6 | Serialiseret array |
| `XOBJ_DTYPE_OTHER` | 7 | Brugerdefineret type |
| `XOBJ_DTYPE_SOURCE` | 8 | Kildekode |
| `XOBJ_DTYPE_STIME` | 9 | Kort tidsformat |
| `XOBJ_DTYPE_MTIME` | 10 | Mellem tidsformat |
| `XOBJ_DTYPE_LTIME` | 11 | Langtidsformat |
| `XOBJ_DTYPE_FLOAT` | 12 | Flydende komma |
| `XOBJ_DTYPE_DECIMAL` | 13 | Decimaltal |
| `XOBJ_DTYPE_ENUM` | 14 | Optælling |

**Eksempel:**
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

### sætVar

Indstiller værdien af en variabel.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$key` | streng | Variabelnavn |
| `$value` | blandet | Værdi at indstille |
| `$notGpc` | bool | Hvis sand, er værdien ikke fra GET/POST/COOKIE |

**Returneringer:** `bool` - Sandt, hvis det lykkedes, ellers falsk

**Eksempel:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Henter værdien af en variabel med valgfri formatering.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$key` | streng | Variabelnavn |
| `$format` | streng | Outputformat |

**Formatindstillinger:**

| Format | Beskrivelse |
|--------|-------------|
| `'s'` | Vis - HTML enheder escaped til visning |
| `'e'` | Rediger - For formularindtastningsværdier |
| `'p'` | Forhåndsvisning - Ligner til at vise |
| `'f'` | Formulardata - Rå til formularbehandling |
| `'n'` | Ingen - rå værdi, ingen formatering |

**Returneringer:** `mixed` - Den formaterede værdi

**Eksempel:**
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

### sætVars

Indstiller flere variabler på én gang fra en matrix.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$values` | række | Associativ array af nøgle => værdipar |
| `$notGpc` | bool | Hvis sandt, er værdierne ikke fra GET/POST/COOKIE |

**Eksempel:**
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

Henter alle variabelværdier.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$keys` | række | Specifikke nøgler til at hente (nul for alle) |
| `$format` | streng | Outputformat |
| `$maxDepth` | int | Maksimal dybde for indlejrede objekter |

**Returneringer:** `array` - Associativ række af værdier

**Eksempel:**
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

### assignVarTildeler en værdi direkte uden validering (brug med forsigtighed).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parametre:**

| Parameter | Skriv | Beskrivelse |
|-----------|------|------------|
| `$key` | streng | Variabelnavn |
| `$value` | blandet | Værdi at tildele |

**Eksempel:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Renser alle variabler til databaseoperationer.

```php
public function cleanVars(): bool
```

**Returnerer:** `bool` - Sandt, hvis alle variabler er gyldige

**Eksempel:**
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

### er nyt

Kontrollerer eller indstiller, om objektet er nyt.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Eksempel:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Fejlhåndteringsmetoder

### sætFejl

Tilføjer en fejlmeddelelse.

```php
public function setErrors(string|array $error): void
```

**Eksempel:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Henter alle fejlmeddelelser.

```php
public function getErrors(): array
```

**Eksempel:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Returnerer fejl formateret som HTML.

```php
public function getHtmlErrors(): string
```

**Eksempel:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Hjælpemetoder

### tilArray

Konverterer objektet til et array.

```php
public function toArray(): array
```

**Eksempel:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Returnerer variabeldefinitionerne.

```php
public function getVars(): array
```

**Eksempel:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Komplet brugseksempel

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

## Bedste praksis

1. **Initialiser altid variabler**: Definer alle variabler i konstruktøren ved hjælp af `initVar()`

2. **Brug passende datatyper**: Vælg den korrekte `XOBJ_DTYPE_*` konstant til validering

3. **Håndter brugerinput forsigtigt**: Brug `setVar()` med `$notGpc = false` til brugerinput

4. **Valider før lagring**: Kald altid `cleanVars()` før databasehandlinger

5. **Brug formatparametre**: Brug det passende format i `getVar()` til konteksten

6. **Udvid til brugerdefineret logik**: Tilføj domænespecifikke metoder i underklasser

## Relateret dokumentation

- XoopsObjectHandler - Håndtermønster for objektpersistens
- ../Database/Criteria - Forespørgselsbygning med kriterier
- ../Database/XoopsDatabase - Databaseoperationer

---

*Se også: [XOOPS kildekode](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
