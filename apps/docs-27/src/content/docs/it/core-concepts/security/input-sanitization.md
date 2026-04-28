---
title: "Sanitizzazione dell'Input"
description: "Utilizzo di MyTextSanitizer e tecniche di validazione in XOOPS"
---

Non fidarti mai dell'input dell'utente. Valida e sanitizza sempre tutti i dati di input prima di utilizzarli. XOOPS fornisce la classe `MyTextSanitizer` per sanitizzare l'input di testo e varie funzioni helper per la validazione.

## Documentazione Correlata

- Security-Best-Practices - Guida completa alla sicurezza
- CSRF-Protection - Sistema di token e classe XoopsSecurity
- SQL-Injection-Prevention - Pratiche di sicurezza del database

## La Regola d'Oro

**Non fidarti mai dell'input dell'utente.** Tutti i dati da fonti esterne devono:

1. **Validati**: Verificare che corrisponda al formato e tipo previsto
2. **Sanitizzati**: Rimuovere o sfuggire ai caratteri potenzialmente pericolosi
3. **Sfuggiti**: Quando si output, sfuggire per il contesto specifico (HTML, JavaScript, SQL)

## Classe MyTextSanitizer

XOOPS fornisce la classe `MyTextSanitizer` (comunemente aliased come `$myts`) per la sanitizzazione del testo.

### Ottenere l'Istanza

```php
// Ottieni l'istanza singleton
$myts = MyTextSanitizer::getInstance();
```

### Sanitizzazione Basica del Testo

```php
$myts = MyTextSanitizer::getInstance();

// Per campi di testo semplice (nessun HTML consentito)
$title = $myts->htmlSpecialChars($_POST['title']);

// Questo converte:
// < a &lt;
// > a &gt;
// & a &amp;
// " a &quot;
// ' a &#039;
```

### Elaborazione del Contenuto di Textarea

Il metodo `displayTarea()` fornisce un'elaborazione completa di textarea:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = Nessun HTML consentito, 1 = HTML consentito
    $allowsmiley = 1,    // 1 = Emoticon abilitate
    $allowxcode = 1,     // 1 = Codici XOOPS abilitati (BBCode)
    $allowimages = 1,    // 1 = Immagini consentite
    $allowlinebreak = 1  // 1 = A capo convertiti a <br>
);
```

### Metodi di Sanitizzazione Comuni

```php
$myts = MyTextSanitizer::getInstance();

// Escape dei caratteri speciali HTML
$safe_text = $myts->htmlSpecialChars($text);

// Rimuovi barre inverse se magic quotes sono attive
$text = $myts->stripSlashesGPC($text);

// Converti codici XOOPS (BBCode) a HTML
$html = $myts->xoopsCodeDecode($text);

// Converti emoticon in immagini
$html = $myts->smiley($text);

// Rendi cliccabili i link
$html = $myts->makeClickable($text);

// Elaborazione completa del testo per l'anteprima
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Validazione dell'Input

### Validazione dei Valori Interi

```php
// Valida ID intero
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternativa con filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### Validazione degli Indirizzi Email

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### Validazione degli URL

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Controllo aggiuntivo per protocolli consentiti
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### Validazione delle Date

```php
$date = $_POST['date'] ?? '';

// Valida il formato della data (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Valida la validità della data effettiva
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### Validazione dei Nomi di File

```php
// Rimuovi tutti i caratteri eccetto alfanumerici, underscore e trattino
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// O usa un approccio whitelist
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Gestione di Diversi Tipi di Input

### Input di Stringhe

```php
$myts = MyTextSanitizer::getInstance();

// Testo breve (titoli, nomi)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limita la lunghezza
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Verifica i campi obbligatori vuoti
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### Input Numerico

```php
// Intero
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Assicura l'intervallo 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Arrotonda a 2 cifre decimali

// Valida l'intervallo
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### Input Booleano

```php
// Valori di spunta
$is_active = isset($_POST['is_active']) ? 1 : 0;

// O con controllo esplicito del valore
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Input di Array

```php
// Valida input di array (ad es. più caselle di controllo)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Input di Selezione/Opzione

```php
// Valida contro i valori consentiti
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Oggetto Request (XMF)

Quando si utilizza XMF, la classe Request fornisce una gestione dell'input più pulita:

```php
use Xmf\Request;

// Ottieni intero
$id = Request::getInt('id', 0);

// Ottieni stringa
$title = Request::getString('title', '');

// Ottieni array
$ids = Request::getArray('ids', []);

// Ottieni con specifica del metodo
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Verifica il metodo di richiesta
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Creazione di una Classe di Validazione

Per moduli complessi, crea una classe di validazione dedicata:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Validazione del titolo
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Validazione dell'email
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Validazione dello stato
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Utilizzo:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Visualizza gli errori all'utente
}
```

## Sanitizzazione per l'Archiviazione nel Database

Quando archivi i dati nel database:

```php
$myts = MyTextSanitizer::getInstance();

// Per l'archiviazione (verrà elaborato di nuovo sul display)
$title = $myts->addSlashes($_POST['title']);

// Meglio: Usa query preparate (vedi Prevenzione dell'Iniezione SQL)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Sanitizzazione per la Visualizzazione

Contesti diversi richiedono sfuggite diverse:

```php
$myts = MyTextSanitizer::getInstance();

// Contesto HTML
echo $myts->htmlSpecialChars($title);

// All'interno degli attributi HTML
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// Contesto JavaScript
echo json_encode($title);

// Parametro URL
echo urlencode($title);

// URL completo
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Errori Comuni

### Doppia Codifica

**Problema**: I dati vengono codificati più volte

```php
// Sbagliato - doppia codifica
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Giusto - codifica una volta, al momento appropriato
$title = $_POST['title']; // Archivia raw
echo $myts->htmlSpecialChars($title); // Codifica su output
```

### Codifica Incoerente

**Problema**: Alcuni output sono codificati, altri no

**Soluzione**: Usa sempre un approccio coerente, preferibilmente codificando su output:

```php
// Assegnazione del template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Validazione Mancante

**Problema**: Solo sanitizzazione senza validazione

**Soluzione**: Valida sempre prima, poi sanitizza:

```php
// Valida prima
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Poi sanitizza per l'archiviazione/visualizzazione
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Riassunto delle Best Practice

1. **Usa MyTextSanitizer** per l'elaborazione dei contenuti di testo
2. **Usa filter_var()** per la validazione del formato specifico
3. **Usa il casting dei tipi** per i valori numerici
4. **Whitelist valori consentiti** per gli input di selezione
5. **Valida prima di sanitizzare**
6. **Sfuggi su output**, non su input
7. **Usa query preparate** per le query del database
8. **Crea classi di validazione** per i moduli complessi
9. **Non fidarti mai della validazione lato client** - valida sempre lato server

---

#security #sanitization #validation #xoops #MyTextSanitizer #input-handling
