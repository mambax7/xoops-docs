---
title: "Sanitizacija vhoda"
description: "Uporaba MyTextSanitizer in tehnik preverjanja v XOOPS"
---
Nikoli ne zaupajte uporabniškemu vnosu. Pred uporabo vedno preverite in očistite vse vnesene podatke. XOOPS ponuja razred `MyTextSanitizer` za čiščenje vnosa besedila in različne pomožne funkcije za preverjanje.

## Povezana dokumentacija

– Najboljše varnostne prakse – Obsežen varnostni vodnik
- CSRF-Zaščita - Sistem žetonov in varnostni razred XOOPS
- SQL-Injection-Prevention - Varnostne prakse baze podatkov

## Zlato pravilo

**Nikoli ne zaupajte uporabniškemu vnosu.** Vsi podatki iz zunanjih virov morajo biti:

1. **Preverjeno**: Preverite, ali se ujema s pričakovano obliko in vrsto
2. **Sanitized**: Odstranite ali ubežite potencialno nevarne znake
3. **Escaped**: Pri izpisu ubežni znak za določen kontekst (HTML, JavaScript, SQL)

## Razred MyTextSanitizer

XOOPS zagotavlja razred `MyTextSanitizer` (običajno imenovan kot `$myts`) za čiščenje besedila.

### Pridobivanje primerka
```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```
### Osnovno čiščenje besedila
```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```
### Obdelava vsebine besedilnega polja

Metoda `displayTarea()` zagotavlja celovito obdelavo textarea:
```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```
### Običajne metode razkuževanja
```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```
## Preverjanje vnosa

### Preverjanje celih vrednosti
```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```
### Preverjanje e-poštnih naslovov
```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```
### Preverjanje URL-jev
```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```
### Preverjanje datumov
```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```
### Preverjanje imen datotek
```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```
## Ravnanje z različnimi vrstami vnosa

### Vnos niza
```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```
### Numerični vnos
```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```
### Logični vnos
```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```
### Vnos polja
```php
// Validate array input (e.g., multiple checkboxes)
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
### Select/Option Vnos
```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```
## Predmet zahteve (XMF)

Pri uporabi XMF razred Request zagotavlja čistejšo obravnavo vnosa:
```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```
## Ustvarjanje validacijskega razreda

Za zapletene obrazce ustvarite namenski razred za preverjanje:
```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
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
Uporaba:
```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```
## Prečiščevanje za shranjevanje podatkovne baze

Pri shranjevanju podatkov v bazi:
```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```
## Razkuževanje zaslona

Različni konteksti zahtevajo različne ubežnike:
```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```
## Pogoste pasti

### Dvojno kodiranje

**Težava**: Podatki se kodirajo večkrat
```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```
### Nedosledno kodiranje

**Težava**: nekateri izhodi so kodirani, nekateri ne

**Rešitev**: Vedno uporabite dosleden pristop, po možnosti kodiranje na izhodu:
```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```
### Manjka potrditev

**Težava**: Samo razkuževanje brez preverjanja

**Rešitev**: Vedno najprej preverite, nato razkužite:
```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```
## Povzetek najboljših praks

1. **Uporabite MyTextSanitizer** za obdelavo besedilne vsebine
2. **Uporabite filter_var()** za preverjanje posebne oblike
3. **Uporabite pretvorbo tipa** za številske vrednosti
4. **Dovoljene vrednosti na beli seznam** za izbrane vnose
5. **Preverite pred razkuževanjem**
6. **Escape na izhodu**, ne na vhodu
7. **Uporabite pripravljene izjave** za poizvedbe po bazi podatkov
8. **Ustvarite validacijske razrede** za kompleksne obrazce
9. **Nikoli ne zaupajte preverjanju na strani odjemalca** – vedno preverjajte na strani strežnika

---

#security #sanitization #validation #XOOPS #MyTextSanitizer #input-handling