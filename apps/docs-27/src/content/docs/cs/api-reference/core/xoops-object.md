---
title: "Třída XoopsObject"
description: "Základní třída pro všechny datové objekty v systému XOOPS poskytující správu vlastností, ověřování a serializaci"
---

Třída `XOOPSObject` je základní základní třídou pro všechny datové objekty v systému XOOPS. Poskytuje standardizované rozhraní pro správu vlastností objektů, ověřování, sledování a serializaci.

## Přehled třídy

```php
namespace XOOPS\Core;

class XOOPSObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## Hierarchie tříd

```
XOOPSObject
├── XOOPSUser
├── XOOPSGroup
├── XOOPSModule
├── XOOPSBlock
├── XOOPSComment
├── XOOPSNotification
├── XOOPSConfig
└── [Custom Module Objects]
```

## Vlastnosti

| Nemovitost | Typ | Viditelnost | Popis |
|----------|------|------------|-------------|
| `$vars` | pole | chráněný | Ukládá definice a hodnoty proměnných |
| `$cleanVars` | pole | chráněný | Ukládá vyčištěné hodnoty pro databázové operace |
| `$isNew` | bool | chráněný | Označuje, zda je objekt nový (ještě není v databázi) |
| `$errors` | pole | chráněný | Ukládá ověřovací a chybové zprávy |

## Konstruktér

```php
public function __construct()
```

Vytvoří novou instanci XOOPSObject. Objekt je ve výchozím nastavení označen jako nový.

**Příklad:**
```php
$object = new XOOPSObject();
// Object is new and has no defined variables
```

## Základní metody

### initVar

Inicializuje definici proměnné pro objekt.

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

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Název proměnné |
| `$dataType` | int | Konstanta datového typu (viz Datové typy) |
| `$value` | smíšené | Výchozí hodnota |
| `$required` | bool | Zda je pole povinné |
| `$maxlength` | int | Maximální délka pro typy strun |
| `$options` | řetězec | Další možnosti |

**Typy dat:**

| Konstantní | Hodnota | Popis |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Vstup do textového pole |
| `XOBJ_DTYPE_TXTAREA` | 2 | Obsah textové oblasti |
| `XOBJ_DTYPE_INT` | 3 | Celočíselná hodnota |
| `XOBJ_DTYPE_URL` | 4 | Řetězec URL |
| `XOBJ_DTYPE_EMAIL` | 5 | E-mailová adresa |
| `XOBJ_DTYPE_ARRAY` | 6 | Serializované pole |
| `XOBJ_DTYPE_OTHER` | 7 | Vlastní typ |
| `XOBJ_DTYPE_SOURCE` | 8 | Zdrojový kód |
| `XOBJ_DTYPE_STIME` | 9 | Krátký časový formát |
| `XOBJ_DTYPE_MTIME` | 10 | Formát středního času |
| `XOBJ_DTYPE_LTIME` | 11 | Formát dlouhého času |
| `XOBJ_DTYPE_FLOAT` | 12 | Plovoucí desetinná čárka |
| `XOBJ_DTYPE_DECIMAL` | 13 | Desetinné číslo |
| `XOBJ_DTYPE_ENUM` | 14 | Výčet |

**Příklad:**
```php
class MyObject extends XOOPSObject
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

Nastavuje hodnotu proměnné.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Název proměnné |
| `$value` | smíšené | Hodnota k nastavení |
| `$notGpc` | bool | Pokud je pravda, hodnota není z GET/POST/COOKIE |

**Vrátí:** `bool` - True v případě úspěchu, false v opačném případě

**Příklad:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Načte hodnotu proměnné s volitelným formátováním.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Název proměnné |
| `$format` | řetězec | Výstupní formát |

**Možnosti formátu:**

| Formát | Popis |
|--------|-------------|
| `'s'` | Zobrazit - Entity HTML unikly pro zobrazení |
| `'e'` | Upravit - Pro vstupní hodnoty formuláře |
| `'p'` | Náhled - Podobné zobrazení |
| `'f'` | Formulářová data - Nezpracovaná pro zpracování formuláře |
| `'n'` | Žádné – Nezpracovaná hodnota, žádné formátování |

**Vrátí:** `mixed` – Formátovaná hodnota

**Příklad:**
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

Nastaví více proměnných najednou z pole.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$values` | pole | Asociativní pole klíčů => páry hodnot |
| `$notGpc` | bool | Pokud je pravda, hodnoty nepocházejí z GET/POST/COOKIE |

**Příklad:**
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

Načte všechny hodnoty proměnných.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$keys` | pole | Specifické klíče k načtení (null pro všechny) |
| `$format` | řetězec | Výstupní formát |
| `$maxDepth` | int | Maximální hloubka pro vnořené objekty |

**Vrátí:** `array` – Asociativní pole hodnot

**Příklad:**
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

### přiřaditVar

Přiřadí hodnotu přímo bez ověření (používejte opatrně).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parametry:**

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `$key` | řetězec | Název proměnné |
| `$value` | smíšené | Hodnota k přiřazení |

**Příklad:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVarsDezinfikuje všechny proměnné pro databázové operace.

```php
public function cleanVars(): bool
```

**Vrátí:** `bool` – True, pokud jsou všechny proměnné platné

**Příklad:**
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

### je Nové

Zkontroluje nebo nastaví, zda je objekt nový.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Příklad:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Metody zpracování chyb

### setErrors

Přidá chybovou zprávu.

```php
public function setErrors(string|array $error): void
```

**Příklad:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Načte všechny chybové zprávy.

```php
public function getErrors(): array
```

**Příklad:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Vrátí chyby ve formátu HTML.

```php
public function getHtmlErrors(): string
```

**Příklad:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Užitkové metody

### toArray

Převede objekt na pole.

```php
public function toArray(): array
```

**Příklad:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Vrátí definice proměnných.

```php
public function getVars(): array
```

**Příklad:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Kompletní příklad použití

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XOOPSObject
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

## Nejlepší postupy

1. **Vždy inicializovat proměnné**: Definujte všechny proměnné v konstruktoru pomocí `initVar()`

2. **Použijte vhodné typy dat**: Vyberte správnou konstantu `XOBJ_DTYPE_*` pro ověření

3. **Zacházejte s uživatelským vstupem opatrně**: Pro uživatelský vstup použijte `setVar()` s `$notGpc = false`

4. **Ověřit před uložením**: Před operacemi databáze vždy zavolejte `cleanVars()`

5. **Použít parametry formátu**: Použijte vhodný formát v `getVar()` pro kontext

6. **Extend for Custom Logic**: Přidejte metody specifické pro doménu do podtříd

## Související dokumentace

- XOOPSObjectHandler - Vzor manipulátoru pro perzistenci objektu
- ../Database/Criteria - Dotaz na budovu s kritérii
- ../Database/XOOPSDatabase - Operace s databází

---

*Viz také: [XOOPS Zdrojový kód](https://github.com/XOOPS/XOOPSCore27/blob/master/htdocs/class/xoopsobject.php)*