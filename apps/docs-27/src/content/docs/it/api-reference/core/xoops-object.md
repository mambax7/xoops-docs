---
title: "Classe XoopsObject"
description: "Classe base per tutti gli oggetti dati nel sistema XOOPS fornendo gestione proprietà, validazione e serializzazione"
---

La classe `XoopsObject` è la classe base fondamentale per tutti gli oggetti dati nel sistema XOOPS. Fornisce un'interfaccia standardizzata per la gestione delle proprietà degli oggetti, validazione, tracciamento delle modifiche e serializzazione.

## Panoramica Classe

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

## Gerarchia Classi

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Oggetti Moduli Personalizzati]
```

## Proprietà

| Proprietà | Tipo | Visibilità | Descrizione |
|----------|------|------------|-------------|
| `$vars` | array | protected | Memorizza definizioni variabili e valori |
| `$cleanVars` | array | protected | Memorizza valori bonificati per operazioni database |
| `$isNew` | bool | protected | Indica se l'oggetto è nuovo (non ancora nel database) |
| `$errors` | array | protected | Memorizza messaggi validazione e errore |

## Costruttore

```php
public function __construct()
```

Crea una nuova istanza XoopsObject. L'oggetto è contrassegnato come nuovo per default.

**Esempio:**
```php
$object = new XoopsObject();
// L'oggetto è nuovo e non ha variabili definite
```

## Metodi Core

### initVar

Inizializza una definizione di variabile per l'oggetto.

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

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$key` | string | Nome variabile |
| `$dataType` | int | Costante tipo dati (vedi Tipi Dati) |
| `$value` | mixed | Valore default |
| `$required` | bool | Se il campo è obbligatorio |
| `$maxlength` | int | Lunghezza massima per tipi string |
| `$options` | string | Opzioni aggiuntive |

**Tipi Dati:**

| Costante | Valore | Descrizione |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Input text box |
| `XOBJ_DTYPE_TXTAREA` | 2 | Contenuto textarea |
| `XOBJ_DTYPE_INT` | 3 | Valore integer |
| `XOBJ_DTYPE_URL` | 4 | Stringa URL |
| `XOBJ_DTYPE_EMAIL` | 5 | Indirizzo email |
| `XOBJ_DTYPE_ARRAY` | 6 | Array serializzato |
| `XOBJ_DTYPE_OTHER` | 7 | Tipo personalizzato |
| `XOBJ_DTYPE_SOURCE` | 8 | Codice sorgente |
| `XOBJ_DTYPE_STIME` | 9 | Formato tempo breve |
| `XOBJ_DTYPE_MTIME` | 10 | Formato tempo medio |
| `XOBJ_DTYPE_LTIME` | 11 | Formato tempo lungo |
| `XOBJ_DTYPE_FLOAT` | 12 | Numero floating point |
| `XOBJ_DTYPE_DECIMAL` | 13 | Numero decimale |
| `XOBJ_DTYPE_ENUM` | 14 | Enumerazione |

**Esempio:**
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

Imposta il valore di una variabile.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$key` | string | Nome variabile |
| `$value` | mixed | Valore da impostare |
| `$notGpc` | bool | Se true, valore non da GET/POST/COOKIE |

**Restituisce:** `bool` - True se successo, false altrimenti

**Esempio:**
```php
$object = new MyObject();
$object->setVar('title', 'Ciao Mondo');
$object->setVar('content', '<p>Contenuto qui</p>', true); // Non da input utente
$object->setVar('status', 1);
```

---

### getVar

Recupera il valore di una variabile con formattazione opzionale.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$key` | string | Nome variabile |
| `$format` | string | Formato output |

**Opzioni Formato:**

| Formato | Descrizione |
|--------|-------------|
| `'s'` | Show - Entità HTML escapate per visualizzazione |
| `'e'` | Edit - Per valori input form |
| `'p'` | Preview - Simile a show |
| `'f'` | Form data - Raw per elaborazione form |
| `'n'` | None - Valore raw, nessuna formattazione |

**Restituisce:** `mixed` - Valore formattato

**Esempio:**
```php
$object = new MyObject();
$object->setVar('title', 'Ciao <World>');

echo $object->getVar('title', 's'); // "Ciao &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Ciao &lt;World&gt;" (per input value)
echo $object->getVar('title', 'n'); // "Ciao <World>" (raw)

// Per tipi dati array
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Restituisce array
```

---

### setVars

Imposta più variabili contemporaneamente da un array.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$values` | array | Array associativo di coppie chiave => valore |
| `$notGpc` | bool | Se true, valori non da GET/POST/COOKIE |

**Esempio:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'Mio Titolo',
    'content' => 'Mio contenuto',
    'status' => 1
]);

// Da database (non input utente)
$object->setVars($row, true);
```

---

### getValues

Recupera tutti i valori variabili.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$keys` | array | Chiavi specifiche da recuperare (null per tutte) |
| `$format` | string | Formato output |
| `$maxDepth` | int | Profondità massima per oggetti annidati |

**Restituisce:** `array` - Array associativo di valori

**Esempio:**
```php
$object = new MyObject();

// Ottieni tutti i valori
$allValues = $object->getValues();

// Ottieni valori specifici
$subset = $object->getValues(['title', 'status']);

// Ottieni valori raw per database
$rawValues = $object->getValues(null, 'n');
```

---

### assignVar

Assegna un valore direttamente senza validazione (usa con attenzione).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**Parametri:**

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `$key` | string | Nome variabile |
| `$value` | mixed | Valore da assegnare |

**Esempio:**
```php
// Assegnamento diretto da fonte attendibile (ad es. database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

Bonifica tutte le variabili per operazioni database.

```php
public function cleanVars(): bool
```

**Restituisce:** `bool` - True se tutte le variabili sono valide

**Esempio:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Le variabili sono bonificate e pronte per il database
    $cleanData = $object->cleanVars;
} else {
    // Si sono verificati errori di validazione
    $errors = $object->getErrors();
}
```

---

### isNew

Verifica o imposta se l'oggetto è nuovo.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**Esempio:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## Metodi Gestione Errori

### setErrors

Aggiunge un messaggio di errore.

```php
public function setErrors(string|array $error): void
```

**Esempio:**
```php
$object->setErrors('Il titolo è obbligatorio');
$object->setErrors(['Errore campo 1', 'Errore campo 2']);
```

---

### getErrors

Recupera tutti i messaggi di errore.

```php
public function getErrors(): array
```

**Esempio:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

Restituisce errori formattati come HTML.

```php
public function getHtmlErrors(): string
```

**Esempio:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## Metodi Utilità

### toArray

Converte l'oggetto in un array.

```php
public function toArray(): array
```

**Esempio:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

Restituisce le definizioni variabili.

```php
public function getVars(): array
```

**Esempio:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Campo: $key, Tipo: {$definition['data_type']}\n";
}
```

---

## Esempio di Utilizzo Completo

```php
<?php
/**
 * Oggetto Article Personalizzato
 */
class Article extends XoopsObject
{
    /**
     * Costruttore - Inizializza tutte le variabili
     */
    public function __construct()
    {
        parent::__construct();

        // Chiave primaria
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Campi obbligatori
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Campi opzionali
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamp
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Flag di stato
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadati come array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Ottieni data creazione formattata
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Verifica se articolo è pubblicato
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Incrementa contatore visualizzazioni
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Validazione personalizzata
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Validazione titolo
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Il titolo è obbligatorio');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Il titolo deve essere di almeno 5 caratteri');
        }

        // Validazione autore
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('L\'autore è obbligatorio');
        }

        return empty($this->errors);
    }
}

// Utilizzo
$article = new Article();
$article->setVar('title', 'Mio Primo Articolo');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Contenuto articolo qui...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'Un articolo di esempio'
]);

if ($article->validate() && $article->cleanVars()) {
    // Salva nel database tramite handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Articolo salvato con ID: " . $article->getVar('article_id');
} else {
    echo "Errori: " . $article->getHtmlErrors();
}
```

## Migliori Pratiche

1. **Inizializza Sempre Variabili**: Definisci tutte le variabili nel costruttore usando `initVar()`

2. **Usa Tipi Dati Appropriati**: Scegli la costante `XOBJ_DTYPE_*` corretta per la validazione

3. **Gestisci Input Utente Con Attenzione**: Usa `setVar()` con `$notGpc = false` per input utente

4. **Valida Prima di Salvare**: Chiama sempre `cleanVars()` prima delle operazioni database

5. **Usa Parametri Formato**: Usa il formato appropriato in `getVar()` per il contesto

6. **Estendi per Logica Personalizzata**: Aggiungi metodi specifici del dominio nelle sottoclassi

## Documentazione Correlata

- XoopsObjectHandler - Pattern handler per persistenza oggetti
- ../Database/Criteria - Costruzione query con Criteria
- ../Database/XoopsDatabase - Operazioni database

---

*Vedi anche: [Codice Sorgente XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
