---
title: "Klasa XoopsObject"
description: "Klasa bazowa dla wszystkich obiektów danych w systemie XOOPS zapewniająca zarządzanie właściwościami, walidację i serializację"
---

Klasa `XoopsObject` jest fundamentalną klasą bazową dla wszystkich obiektów danych w systemie XOOPS. Zapewnia standardowy interfejs do zarządzania właściwościami obiektów, walidacji, śledzenia zmian i serializacji.

## Przegląd Klasy

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

## Hierarchia Klas

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

## Właściwości

| Właściwość | Typ | Widoczność | Opis |
|-----------|-----|-----------|------|
| `$vars` | array | protected | Przechowuje definicje zmiennych i wartości |
| `$cleanVars` | array | protected | Przechowuje oczyśczone wartości do operacji bazy danych |
| `$isNew` | bool | protected | Wskazuje, czy obiekt jest nowy (jeszcze nie w bazie danych) |
| `$errors` | array | protected | Przechowuje komunikaty walidacji i błędów |

## Konstruktor

```php
public function __construct()
```

Tworzy nową instancję XoopsObject. Obiekt jest domyślnie oznaczony jako nowy.

**Przykład:**
```php
$object = new XoopsObject();
// Obiekt jest nowy i nie ma zdefiniowanych zmiennych
```

## Metody Podstawowe

### initVar

Inicjalizuje definicję zmiennej dla obiektu.

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

| Parametr | Typ | Opis |
|----------|-----|------|
| `$key` | string | Nazwa zmiennej |
| `$dataType` | int | Stała typu danych (patrz Typy Danych) |
| `$value` | mixed | Wartość domyślna |
| `$required` | bool | Czy pole jest wymagane |
| `$maxlength` | int | Maksymalna długość dla typów string |
| `$options` | string | Dodatkowe opcje |

**Typy Danych:**

| Stała | Wartość | Opis |
|-------|---------|------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Wejście pola tekstowego |
| `XOBJ_DTYPE_TXTAREA` | 2 | Zawartość obszaru tekstowego |
| `XOBJ_DTYPE_INT` | 3 | Wartość liczby całkowitej |
| `XOBJ_DTYPE_URL` | 4 | String URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Adres poczty e-mail |
| `XOBJ_DTYPE_ARRAY` | 6 | Serializowana tablica |
| `XOBJ_DTYPE_OTHER` | 7 | Typ niestandardowy |
| `XOBJ_DTYPE_SOURCE` | 8 | Kod źródłowy |
| `XOBJ_DTYPE_STIME` | 9 | Format czasu krótki |
| `XOBJ_DTYPE_MTIME` | 10 | Format czasu średni |
| `XOBJ_DTYPE_LTIME` | 11 | Format czasu długi |
| `XOBJ_DTYPE_FLOAT` | 12 | Liczba zmiennoprzecinkowa |
| `XOBJ_DTYPE_DECIMAL` | 13 | Liczba dziesiętna |
| `XOBJ_DTYPE_ENUM` | 14 | Wyliczenie |

**Przykład:**
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

Ustawia wartość zmiennej.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$key` | string | Nazwa zmiennej |
| `$value` | mixed | Wartość do ustawienia |
| `$notGpc` | bool | Jeśli true, wartość nie pochodzi z GET/POST/COOKIE |

**Zwraca:** `bool` - True jeśli pomyślnie, false w innym wypadku

**Przykład:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

Pobiera wartość zmiennej z opcjonalnym formatowaniem.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$key` | string | Nazwa zmiennej |
| `$format` | string | Format wyjściowy |

**Opcje Formatu:**

| Format | Opis |
|--------|------|
| `'s'` | Pokaż - Jednostki HTML wyjście dla wyświetlania |
| `'e'` | Edytuj - Dla wartości wejścia formularza |
| `'p'` | Podgląd - Podobnie do pokaż |
| `'f'` | Dane formularza - Surowe dla przetwarzania formularza |
| `'n'` | Brak - Surowa wartość, bez formatowania |

**Zwraca:** `mixed` - Sformatowana wartość

**Przykład:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// Dla typów danych tablica
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### setVars

Ustawia wiele zmiennych naraz z tablicy.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$values` | array | Tablica asocjacyjna par klucz => wartość |
| `$notGpc` | bool | Jeśli true, wartości nie pochodzą z GET/POST/COOKIE |

**Przykład:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// Z bazy danych (nie dane użytkownika)
$object->setVars($row, true);
```

---

### getValues

Pobiera wszystkie wartości zmiennych.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$keys` | array | Konkretne klucze do pobrania (null dla wszystkich) |
| `$format` | string | Format wyjściowy |
| `$maxDepth` | int | Maksymalna głębia dla zagnieżdżonych obiektów |

**Zwraca:** `array` - Tablica asocjacyjna wartości

**Przykład:**
```php
$object = new MyObject();

// Pobierz wszystkie wartości
$allValues = $object->getValues();

// Pobierz określone wartości
$subset = $object->getValues(['title', 'status']);

// Pobierz surowe wartości dla bazy danych
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Przypisuje wartość bezpośrednio bez walidacji (ostrożnie).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parametry:**

| Parametr | Typ | Opis |
|----------|-----|------|
| `$key` | string | Nazwa zmiennej |
| `$value` | mixed | Wartość do przypisania |

**Przykład:**
```php
// Bezpośrednie przypisanie ze zaufanego źródła (np. baza danych)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Oczyszcza wszystkie zmienne do operacji bazy danych.

```php
public function cleanVars(): bool
```

**Zwraca:** `bool` - True jeśli wszystkie zmienne są ważne

**Przykład:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Zmienne są oczyśczone i gotowe do bazy danych
    $cleanData = $object->cleanVars;
} else {
    // Błędy walidacji
    $errors = $object->getErrors();
}
```

---

### isNew

Sprawdza lub ustawia czy obiekt jest nowy.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Przykład:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Metody Obsługi Błędów

### setErrors

Dodaje komunikat błędu.

```php
public function setErrors(string|array $error): void
```

**Przykład:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Pobiera wszystkie komunikaty błędów.

```php
public function getErrors(): array
```

**Przykład:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Zwraca błędy sformatowane jako HTML.

```php
public function getHtmlErrors(): string
```

**Przykład:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Metody Narzędziowe

### toArray

Konwertuje obiekt do tablicy.

```php
public function toArray(): array
```

**Przykład:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Zwraca definicje zmiennych.

```php
public function getVars(): array
```

**Przykład:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Kompletny Przykład Użycia

```php
<?php
/**
 * Niestandardowy Obiekt Artykułu
 */
class Article extends XoopsObject
{
    /**
     * Konstruktor - Inicjalizuj wszystkie zmienne
     */
    public function __construct()
    {
        parent::__construct();

        // Klucz podstawowy
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Wymagane pola
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Pola opcjonalne
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Znaczniki czasu
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Flagi statusu
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadane jako tablica
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Pobierz sformatowaną datę utworzenia
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Sprawdź czy artykuł jest opublikowany
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Zwiększ licznik wyświetleń
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Niestandardowa walidacja
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Walidacja tytułu
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Walidacja autora
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Użycie
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Zapisz do bazy danych za pomocą handlera
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Najlepsze Praktyki

1. **Zawsze Inicjalizuj Zmienne**: Zdefiniuj wszystkie zmienne w konstruktorze używając `initVar()`

2. **Używaj Odpowiednich Typów Danych**: Wybierz prawidłową stałą `XOBJ_DTYPE_*` do walidacji

3. **Obsługuj Dane Użytkownika Ostrożnie**: Użyj `setVar()` z `$notGpc = false` dla danych użytkownika

4. **Waliduj Przed Zapisaniem**: Zawsze wywołaj `cleanVars()` przed operacjami bazy danych

5. **Używaj Parametrów Formatu**: Użyj odpowiedniego formatu w `getVar()` dla kontekstu

6. **Rozszerz dla Niestandardowej Logiki**: Dodaj metody specyficzne dla domeny w podklasach

## Powiązana Dokumentacja

- XoopsObjectHandler - Wzorzec handlera do trwałości obiektów
- ../Database/Criteria - Budowanie zapytań z Criteria
- ../Database/XoopsDatabase - Operacje bazy danych

---

*Patrz też: [Kod Źródłowy XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
