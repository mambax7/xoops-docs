---
title: "XoopsObject Klasse"
description: "Basisklasse für alle Datenobjekte im XOOPS-System mit Eigenschaftsverwaltung, Validierung und Serialisierung"
---

Die `XoopsObject` Klasse ist die grundlegende Basisklasse für alle Datenobjekte im XOOPS-System. Sie bietet eine standardisierte Schnittstelle für die Verwaltung von Objekteigenschaften, Validierung, Dirty Tracking und Serialisierung.

## Klassenübersicht

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

## Klassenhierarchie

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

## Eigenschaften

| Eigenschaft | Typ | Sichtbarkeit | Beschreibung |
|----------|-----|------------|-------------|
| `$vars` | array | protected | Speichert Variablendefinitionen und Werte |
| `$cleanVars` | array | protected | Speichert bereinigte Werte für Datenbankoperationen |
| `$isNew` | bool | protected | Gibt an, ob Objekt neu ist (noch nicht in Datenbank) |
| `$errors` | array | protected | Speichert Validierungs- und Fehlermeldungen |

## Konstruktor

```php
public function __construct()
```

Erstellt eine neue XoopsObject-Instanz. Das Objekt wird standardmäßig als neu gekennzeichnet.

**Beispiel:**
```php
$object = new XoopsObject();
// Das Objekt ist neu und hat keine definierten Variablen
```

## Kern-Methoden

### initVar

Initialisiert eine Variablendefinition für das Objekt.

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

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$key` | string | Variablennamen |
| `$dataType` | int | Datentyp-Konstante (siehe Datentypen) |
| `$value` | mixed | Standardwert |
| `$required` | bool | Ob Feld erforderlich ist |
| `$maxlength` | int | Maximale Länge für String-Typen |
| `$options` | string | Zusätzliche Optionen |

**Datentypen:**

| Konstante | Wert | Beschreibung |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Textbox-Eingabe |
| `XOBJ_DTYPE_TXTAREA` | 2 | Textarea-Inhalt |
| `XOBJ_DTYPE_INT` | 3 | Ganzzahlwert |
| `XOBJ_DTYPE_URL` | 4 | URL-String |
| `XOBJ_DTYPE_EMAIL` | 5 | E-Mail-Adresse |
| `XOBJ_DTYPE_ARRAY` | 6 | Serialisiertes Array |
| `XOBJ_DTYPE_OTHER` | 7 | Benutzerdefinierter Typ |
| `XOBJ_DTYPE_SOURCE` | 8 | Quellcode |
| `XOBJ_DTYPE_STIME` | 9 | Kurzes Zeitformat |
| `XOBJ_DTYPE_MTIME` | 10 | Mittleres Zeitformat |
| `XOBJ_DTYPE_LTIME` | 11 | Langes Zeitformat |
| `XOBJ_DTYPE_FLOAT` | 12 | Gleitkommazahl |
| `XOBJ_DTYPE_DECIMAL` | 13 | Dezimalzahl |
| `XOBJ_DTYPE_ENUM` | 14 | Aufzählung |

**Beispiel:**
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

Setzt den Wert einer Variablen.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$key` | string | Variablenname |
| `$value` | mixed | Zu setzender Wert |
| `$notGpc` | bool | Wenn true, stammt der Wert nicht von GET/POST/COOKIE |

**Rückgabewert:** `bool` - True bei Erfolg, false anderenfalls

**Beispiel:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Nicht von Benutzereingabe
$object->setVar('status', 1);
```

---

### getVar

Ruft den Wert einer Variablen mit optionaler Formatierung ab.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$key` | string | Variablenname |
| `$format` | string | Ausgabeformat |

**Format-Optionen:**

| Format | Beschreibung |
|--------|-------------|
| `'s'` | Show - HTML-Entitäten für Anzeige |
| `'e'` | Edit - Für Formulareingabewerte |
| `'p'` | Preview - Ähnlich wie Show |
| `'f'` | Form data - Roh für Formularverarbeitung |
| `'n'` | None - Rohwert, keine Formatierung |

**Rückgabewert:** `mixed` - Der formatierte Wert

**Beispiel:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (für Eingabewert)
echo $object->getVar('title', 'n'); // "Hello <World>" (roh)

// Für Array-Datentypen
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Array zurückgeben
```

---

### setVars

Setzt mehrere Variablen gleichzeitig aus einem Array.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$values` | array | Assoziatives Array von Schlüssel => Wert-Paaren |
| `$notGpc` | bool | Wenn true, stammen Werte nicht von GET/POST/COOKIE |

**Beispiel:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// Aus Datenbank (nicht Benutzereingabe)
$object->setVars($row, true);
```

---

### getValues

Ruft alle Variablenwerte ab.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$keys` | array | Spezifische Schlüssel zum Abrufen (null für alle) |
| `$format` | string | Ausgabeformat |
| `$maxDepth` | int | Maximale Tiefe für verschachtelte Objekte |

**Rückgabewert:** `array` - Assoziatives Array von Werten

**Beispiel:**
```php
$object = new MyObject();

// Alle Werte abrufen
$allValues = $object->getValues();

// Bestimmte Werte abrufen
$subset = $object->getValues(['title', 'status']);

// Rohwerte für Datenbank
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Weist einen Wert direkt ohne Validierung zu (mit Vorsicht verwenden).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parameter:**

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `$key` | string | Variablenname |
| `$value` | mixed | Zuzuweisender Wert |

**Beispiel:**
```php
// Direkte Zuweisung aus vertrauenswürdiger Quelle (z.B. Datenbank)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Bereinigt alle Variablen für Datenbankoperationen.

```php
public function cleanVars(): bool
```

**Rückgabewert:** `bool` - True, wenn alle Variablen gültig sind

**Beispiel:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variablen sind bereinigt und bereit für Datenbank
    $cleanData = $object->cleanVars;
} else {
    // Validierungsfehler aufgetreten
    $errors = $object->getErrors();
}
```

---

### isNew

Überprüft oder setzt, ob das Objekt neu ist.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Beispiel:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Fehlerbehandlungs-Methoden

### setErrors

Fügt eine Fehlermeldung hinzu.

```php
public function setErrors(string|array $error): void
```

**Beispiel:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

Ruft alle Fehlermeldungen ab.

```php
public function getErrors(): array
```

**Beispiel:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Gibt Fehler als formatiertes HTML zurück.

```php
public function getHtmlErrors(): string
```

**Beispiel:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Utility-Methoden

### toArray

Konvertiert das Objekt in ein Array.

```php
public function toArray(): array
```

**Beispiel:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Gibt die Variablendefinitionen zurück.

```php
public function getVars(): array
```

**Beispiel:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## Vollständiges Verwendungsbeispiel

```php
<?php
/**
 * Benutzerdefiniertes Article-Objekt
 */
class Article extends XoopsObject
{
    /**
     * Konstruktor - Alle Variablen initialisieren
     */
    public function __construct()
    {
        parent::__construct();

        // Primärschlüssel
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Erforderliche Felder
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optionale Felder
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Zeitstempel
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status-Flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadaten als Array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Formatiertes Erstellungsdatum abrufen
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Überprüfen, ob Artikel veröffentlicht ist
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * View-Zähler erhöhen
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Benutzerdefinierte Validierung
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Titel-Validierung
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Autoren-Validierung
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Verwendung
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // In Datenbank speichern via Handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## Best Practices

1. **Variablen immer initialisieren**: Definieren Sie alle Variablen im Konstruktor mit `initVar()`

2. **Geeignete Datentypen verwenden**: Wählen Sie die richtige `XOBJ_DTYPE_*` Konstante für Validierung

3. **Benutzereingabe sorgfältig handhaben**: Verwenden Sie `setVar()` mit `$notGpc = false` für Benutzereingaben

4. **Vor dem Speichern validieren**: Rufen Sie immer `cleanVars()` vor Datenbankoperationen auf

5. **Format-Parameter verwenden**: Verwenden Sie das geeignete Format in `getVar()` für den Kontext

6. **Für benutzerdefinierte Logik erweitern**: Fügen Sie Domänen-spezifische Methoden in Subklassen hinzu

## Zugehörige Dokumentation

- XoopsObjectHandler - Handler-Muster für Objektpersistenz
- ../Database/Criteria - Abfragebau mit Criteria
- ../Database/XoopsDatabase - Datenbankoperationen

---

*Siehe auch: [XOOPS Source Code](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
